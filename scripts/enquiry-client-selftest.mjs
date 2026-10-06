import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { sendEnquiry, EnquiryRequestError } from '../src/enquiryRequest.ts'

let payload = ''
const server = createServer(async (req, res) => {
  payload = ''
  for await (const chunk of req) payload += chunk
  const path = req.url
  if (path === '/timeout') return
  if (path === '/html') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<html>OK</html>'); return }
  res.writeHead(path === '/rate' ? 429 : path === '/validation' ? 422 : path === '/server' ? 503 : 200, { 'Content-Type': 'application/json' })
  res.end(path === '/bad-json' ? '{broken' : JSON.stringify({ ok: path === '/ok' || path === '/server' ? true : path === '/string' ? 'true' : false }))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const url = `http://127.0.0.1:${server.address().port}`
const fields = { name: 'Prueba', email: 'visitor@example.com', object: '¿CRM para mi agencia?', service: 'CRM inmobiliario' }
const send = path => sendEnquiry(url + path, fields, new AbortController().signal)
try {
  await send('/ok')
  assert.equal(new URLSearchParams(payload).get('service'), fields.service)
  assert.equal(new URLSearchParams(payload).get('object'), fields.object)
  for (const path of ['/html', '/false', '/string', '/server']) {
    await assert.rejects(send(path), error => error instanceof EnquiryRequestError && error.kind === 'unavailable', path)
  }
  await assert.rejects(send('/bad-json'), SyntaxError)
  await assert.rejects(send('/rate'), error => error.kind === 'rate-limit')
  await assert.rejects(send('/validation'), error => error.kind === 'validation')
  const controller = new AbortController()
  const request = sendEnquiry(url + '/timeout', fields, controller.signal)
  setTimeout(() => controller.abort(), 40)
  await assert.rejects(request, error => error.name === 'AbortError')
  console.log('PASS: only explicit JSON true succeeds; HTML, false, string, invalid JSON, errors and timeout fail; service and Unicode preserved. No external mail sent.')
} finally {
  server.closeAllConnections()
  await new Promise(resolve => server.close(resolve))
}
