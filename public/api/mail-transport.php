<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/autoload.php';

/** Send through the authenticated mailbox; never fall back to unsigned mail(). */
function sendStoariEnquiry(string $replyTo, string $message): bool
{
    try {
        // The override is server configuration, never a request parameter.
        $path = getenv('STOARI_MAIL_CONFIG') ?: dirname(__DIR__, 2) . '/private/smtp.json';
        if (!is_readable($path)) throw new RuntimeException('Mail configuration unavailable');
        $config = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        if (($config['username'] ?? null) !== 'info@stoari.com'
            || !is_string($config['password'] ?? null) || $config['password'] === '') {
            throw new RuntimeException('Mail configuration invalid');
        }

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $config['host'] ?? 'smtp.hostinger.com';
        $mail->Port = $config['port'] ?? 465;
        $mail->SMTPAuth = true;
        $mail->Username = $config['username'];
        $mail->Password = $config['password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->SMTPAutoTLS = false; // Implicit TLS from connection start.
        $mail->SMTPDebug = 0;
        $mail->Timeout = 8;
        $mail->Timelimit = 10;
        $mail->SMTPOptions = ['ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
        ]];
        if (isset($config['ca_file'])) $mail->SMTPOptions['ssl']['cafile'] = $config['ca_file'];
        $mail->Hostname = 'stoari.com';
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
        $mail->setFrom('info@stoari.com', 'STOARI');
        $mail->addAddress('info@stoari.com');
        $mail->addReplyTo($replyTo);
        $mail->Subject = 'STOARI website enquiry';
        $mail->Body = $message;
        $mail->send();
        return true;
    } catch (Throwable $error) {
        // Neither credentials, enquiry text nor raw SMTP responses belong in logs.
        error_log('STOARI enquiry: authenticated mail transport failed');
        return false;
    }
}
