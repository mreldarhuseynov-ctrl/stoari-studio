/** Generate browser icons from the approved STOARI mark (see make-logo.mjs). */
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f0ea"/><path fill="#15171b" fill-rule="evenodd" d="M22 6H78V94H22ZM45.5 24H54.5V70H45.5Z"/></svg>\n'
for (const name of ['favicon.svg', 'stoari-favicon.svg']) await writeFile(`public/${name}`, svg)
for (const [name, size] of [['favicon-32.png', 32], ['stoari-favicon-32.png', 32], ['apple-touch-icon.png', 180], ['stoari-apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/${name}`)
}
// ICO directory with PNG-encoded 16, 32 and 48px images for legacy/root requests.
const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(size => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
images.forEach((bytes, i) => {
  const entry = 6 + i * 16
  header[entry] = sizes[i]
  header[entry + 1] = sizes[i]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(bytes.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += bytes.length
})
await writeFile('public/favicon.ico', Buffer.concat([header, ...images]))
console.log('Generated STOARI SVG, PNG, Apple and multi-size ICO icons.')
