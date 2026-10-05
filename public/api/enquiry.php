<?php
declare(strict_types=1);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, bool $ok): never
{
    http_response_code($status);
    echo json_encode(['ok' => $ok]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    respond(413, false);
}
if (isset($_SERVER['HTTP_ORIGIN']) && !in_array($_SERVER['HTTP_ORIGIN'], [
    'https://stoari.com', 'https://www.stoari.com',
], true)) {
    respond(403, false);
}
if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/x-www-form-urlencoded')) {
    respond(415, false);
}

// A filled honeypot must never trigger an email.
if (!empty($_POST['bot-field'])) {
    respond(200, true);
}
$fields = [];
foreach (['name' => 500, 'email' => 254, 'company' => 500, 'object' => 4000, 'when' => 500] as $key => $limit) {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $limit || !preg_match('//u', $value)) {
        respond(422, false);
    }
    $fields[$key] = trim($value);
}
if ($fields['name'] === '' || $fields['object'] === ''
    || !filter_var($fields['email'], FILTER_VALIDATE_EMAIL)
    || strpbrk($fields['email'], "\r\n") !== false) {
    respond(422, false);
}

// Private, short-lived counters contain no enquiry text. The lock keeps
// concurrent requests from getting around the limit. Proxy headers are ignored.
$counterPath = sys_get_temp_dir() . '/stoari-enquiry-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$counter = fopen($counterPath, 'c+');
if ($counter === false || !flock($counter, LOCK_EX)) {
    respond(503, false);
}
chmod($counterPath, 0600);
$saved = json_decode(stream_get_contents($counter), true);
$now = time();
$start = is_array($saved) ? (int) ($saved['start'] ?? 0) : 0;
$count = $now - $start < 600 ? (int) ($saved['count'] ?? 0) : 0;
if ($count >= 5) {
    flock($counter, LOCK_UN);
    fclose($counter);
    header('Retry-After: 600');
    respond(429, false);
}
$state = json_encode(['start' => $count === 0 ? $now : $start, 'count' => $count + 1]);
rewind($counter);
if (!ftruncate($counter, 0) || fwrite($counter, $state) !== strlen($state) || !fflush($counter)) {
    flock($counter, LOCK_UN);
    fclose($counter);
    respond(503, false);
}
flock($counter, LOCK_UN);
fclose($counter);

$message = "New enquiry from stoari.com\n\n"
    . "Name: {$fields['name']}\n"
    . "Email: {$fields['email']}\n"
    . "Company: {$fields['company']}\n"
    . "Property / project: {$fields['object']}\n"
    . "When: {$fields['when']}\n";

// The destination stays on the verified operational mailbox until info@stoari.com
// has been created and tested. Reply-To is validated and cannot contain newlines.
$accepted = mail('mreldarhuseynov@gmail.com', 'STOARI website enquiry', $message, [
    'From' => 'STOARI <noreply@stoari.com>',
    'Reply-To' => $fields['email'],
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
]);
if (!$accepted) {
    error_log('STOARI enquiry: mail transport did not accept the message');
    respond(503, false);
}
respond(200, true);
