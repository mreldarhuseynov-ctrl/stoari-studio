import assert from 'node:assert/strict'
import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, writeFile, readFile, rm, mkdir, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'node:net'
import { createServer as createTLSServer } from 'node:tls'

const scratch = await mkdtemp(join(tmpdir(), 'stoari-enquiry-test-'))
await mkdir(join(scratch, 'rates'))
const keyPath = join(scratch, 'key.pem')
const certPath = join(scratch, 'cert.pem')
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
  '-keyout', keyPath, '-out', certPath, '-subj', '/CN=localhost',
  '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1'], { stdio: 'ignore' })
let failMail = false
let failAuth = false
let lastMessage = ''
let envelope = []
let authenticated = 0
let delivered = 0
const smtp = createTLSServer({ key: await readFile(keyPath), cert: await readFile(certPath), minVersion: 'TLSv1.2' }, socket => {
  socket.write('220 localhost SMTP fixture\r\n')
  let buffer = '', data = false, authStep = 0, message = '', loggedIn = false
  socket.on('error', () => {})
  socket.on('data', chunk => {
    buffer += chunk.toString()
    while (buffer.includes('\r\n')) {
      const end = buffer.indexOf('\r\n')
      const line = buffer.slice(0, end)
      buffer = buffer.slice(end + 2)
      if (data) {
        if (line === '.') {
          data = false
          lastMessage = message
          if (!failMail) delivered++
          socket.write(failMail ? '451 Temporary failure\r\n' : '250 Accepted\r\n')
        } else message += line.replace(/^\.\./, '.') + '\r\n'
      } else if (authStep) {
        const decoded = Buffer.from(line, 'base64').toString()
        if (authStep === 1) {
          assert.equal(decoded, 'info@stoari.com')
          authStep = 2
          socket.write('334 UGFzc3dvcmQ6\r\n')
        } else {
          assert.equal(decoded, 'synthetic-password')
          authStep = 0
          loggedIn = !failAuth
          if (loggedIn) authenticated++
          socket.write(failAuth ? '535 Authentication failed\r\n' : '235 Authenticated\r\n')
        }
      } else if (line.startsWith('EHLO')) socket.write('250-localhost\r\n250 AUTH LOGIN\r\n')
      else if (line === 'AUTH LOGIN') { authStep = 1; socket.write('334 VXNlcm5hbWU6\r\n') }
      else if (line.startsWith('MAIL FROM:') || line.startsWith('RCPT TO:')) {
        assert.ok(loggedIn, 'Transport authenticates before sending')
        envelope.push(line)
        socket.write('250 OK\r\n')
      } else if (line === 'DATA') { data = true; message = ''; socket.write('354 Send data\r\n') }
      else if (line === 'QUIT') { socket.end('221 Bye\r\n') }
      else if (line === 'RSET') socket.write('250 Reset\r\n')
      else throw new Error('Unexpected SMTP command: ' + line)
    }
  })
})
smtp.on('tlsClientError', () => {})
await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve))
const configPath = join(scratch, 'smtp.json')
const config = { host: '127.0.0.1', port: smtp.address().port, username: 'info@stoari.com', password: 'synthetic-password', ca_file: certPath }
await writeFile(configPath, JSON.stringify(config), { mode: 0o600 })
const decodeQuotedPrintable = text => Buffer.from(text.replace(/=\r\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, byte) => String.fromCharCode(parseInt(byte, 16))), 'binary').toString('utf8')
const port = await new Promise((resolve) => {
  const server = createServer()
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port
    server.close(() => resolve(port))
  })
})
const php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', 'public'], {
  env: { ...process.env, TMPDIR: join(scratch, 'rates'), STOARI_MAIL_CONFIG: configPath }, stdio: 'ignore',
})
const endpoint = `http://127.0.0.1:${port}/api/enquiry.php`
const valid = { name: 'Test', email: 'visitor@example.com', company: 'STOARI test', object: 'Synthetic property', when: 'Test only', service: 'CRM inmobiliario' }
async function post(fields = valid, origin = 'https://stoari.com') {
  return fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: origin },
    body: new URLSearchParams(fields),
  })
}
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { await fetch(endpoint); break } catch { await new Promise((resolve) => setTimeout(resolve, 30)) }
  }
  assert.equal((await fetch(endpoint)).status, 405, 'GET cannot submit an enquiry')
  assert.equal((await post({ ...valid, name: '' })).status, 422, 'A name is required')
  assert.equal((await post({ ...valid, object: '' })).status, 422, 'A property is required')
  assert.equal((await post({ ...valid, email: '' })).status, 422, 'A reply address is required')
  assert.equal((await post({ ...valid, email: 'not-an-email' })).status, 422, 'Malformed addresses are rejected')
  assert.equal((await post({ ...valid, email: 'visitor@example.com\r\nBcc: injected@example.com' })).status, 422, 'Header injection is rejected')
  assert.equal((await post({ ...valid, service: 'a'.repeat(121) })).status, 422, 'Service length is bounded')
  assert.equal((await post({ ...valid, name: 'a'.repeat(121) })).status, 422, 'Field lengths match the browser')
  assert.equal((await post({ ...valid, object: '🏠'.repeat(1001) })).status, 422, 'Emoji count matches browser maxlength')
  assert.equal((await post(valid, 'https://other.example')).status, 403, 'Unrelated origins are rejected')
  assert.equal((await post({ ...valid, object: 'a'.repeat(66000) })).status, 413, 'Oversized requests are rejected')
  const bot = await post({ ...valid, 'bot-field': 'spam' })
  assert.equal(bot.status, 200)
  assert.deepEqual(await bot.json(), { ok: true }, 'The honeypot returns a harmless acknowledgement')
  const response = await post({ ...valid, object: 'Дом '.repeat(500) })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true }, 'Accepted mail gets an explicit acknowledgement')
  const message = decodeQuotedPrintable(lastMessage)
  assert.equal(authenticated, 1)
  assert.ok(envelope.includes('MAIL FROM:<info@stoari.com>'), 'Envelope sender aligns with the From domain')
  assert.ok(envelope.includes('RCPT TO:<info@stoari.com>'), 'Recipient is fixed')
  assert.match(message, /^To: <?info@stoari\.com>?/m, 'Enquiries reach the professional mailbox')
  assert.match(message, /^From: STOARI <info@stoari\.com>/m, 'The sender uses the existing domain mailbox')
  assert.match(message, /Reply-To: <?visitor@example\.com>?/, 'Replies reach the validated visitor address')
  assert.match(message, /Selected service: CRM inmobiliario/, 'The selected service reaches the mailbox')
  assert.match(message, /Email: visitor@example\.com/, 'The enquiry includes a usable reply address')
  assert.match(message, /Дом /, 'A full-length Cyrillic enquiry survives validation')
  failMail = true
  assert.equal((await post()).status, 503, 'Failed mail is never acknowledged as sent')
  failMail = false
  for (let i = 0; i < 3; i++) assert.equal((await post()).status, 200)
  assert.equal((await post()).status, 429, 'Repeated sends are limited')
  const resetRates = async () => { for (const file of await readdir(join(scratch, 'rates'))) await rm(join(scratch, 'rates', file)) }
  await resetRates()
  const sentBeforeFailures = delivered
  failAuth = true
  assert.equal((await post()).status, 503, 'Failed SMTP authentication never falls back to mail()')
  failAuth = false
  await writeFile(configPath, JSON.stringify({ ...config, ca_file: undefined }))
  assert.equal((await post()).status, 503, 'An untrusted TLS certificate is rejected')
  await writeFile(configPath, '{invalid')
  assert.equal((await post()).status, 503, 'Invalid private configuration fails closed')
  await rm(configPath)
  assert.equal((await post()).status, 503, 'Missing credentials fail closed')
  assert.equal(delivered, sentBeforeFailures, 'No message delivered on any transport failure')
  console.log('PASS: validation, origins, limits, honeypot, authenticated TLS SMTP, aligned envelope, Unicode, rejection/auth/config/certificate failures. No external mail sent.')
} finally {
  php.kill('SIGTERM')
  await new Promise((resolve) => php.once('exit', resolve))
  await new Promise(resolve => smtp.close(resolve))
  await rm(scratch, { recursive: true, force: true })
}
