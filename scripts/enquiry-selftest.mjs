import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'node:net'

const scratch = await mkdtemp(join(tmpdir(), 'stoari-enquiry-test-'))
await mkdir(join(scratch, 'rates'))
const sendmail = join(scratch, 'sendmail')
await writeFile(sendmail, `#!/bin/sh\ncat >'${scratch}/last-message'\n[ ! -f '${scratch}/fail-mail' ]\n`, { mode: 0o700 })
const port = await new Promise((resolve) => {
  const server = createServer()
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port
    server.close(() => resolve(port))
  })
})
const php = spawn('php', ['-d', `sendmail_path=${sendmail}`, '-S', `127.0.0.1:${port}`, '-t', 'public'], {
  env: { ...process.env, TMPDIR: join(scratch, 'rates') }, stdio: 'ignore',
})
const endpoint = `http://127.0.0.1:${port}/api/enquiry.php`
const valid = { name: 'Test', email: 'visitor@example.com', company: 'STOARI test', object: 'Synthetic property', when: 'Test only' }
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
  assert.equal((await post({ ...valid, name: 'a'.repeat(501) })).status, 422, 'Field lengths are bounded')
  assert.equal((await post(valid, 'https://other.example')).status, 403, 'Unrelated origins are rejected')
  assert.equal((await post({ ...valid, object: 'a'.repeat(17000) })).status, 413, 'Oversized requests are rejected')
  const bot = await post({ ...valid, 'bot-field': 'spam' })
  assert.equal(bot.status, 200)
  assert.deepEqual(await bot.json(), { ok: true }, 'The honeypot returns a harmless acknowledgement')
  const response = await post()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true }, 'Accepted mail gets an explicit acknowledgement')
  const message = await readFile(join(scratch, 'last-message'), 'utf8')
  assert.match(message, /^To: info@stoari\.com/m, 'Enquiries reach the professional mailbox')
  assert.match(message, /^From: STOARI <info@stoari\.com>/m, 'The sender uses the existing domain mailbox')
  assert.match(message, /Reply-To: visitor@example\.com/, 'Replies reach the validated visitor address')
  assert.match(message, /Email: visitor@example\.com/, 'The enquiry includes a usable reply address')
  await writeFile(join(scratch, 'fail-mail'), '')
  assert.equal((await post()).status, 503, 'Failed mail is never acknowledged as sent')
  await rm(join(scratch, 'fail-mail'))
  for (let i = 0; i < 3; i++) assert.equal((await post()).status, 200)
  assert.equal((await post()).status, 429, 'Repeated sends are limited')
  console.log('PASS: methods, validation, origins, size cap, honeypot, mail success/failure, rate limit. No external mail sent.')
} finally {
  php.kill('SIGTERM')
  await new Promise((resolve) => php.once('exit', resolve))
  await rm(scratch, { recursive: true, force: true })
}
