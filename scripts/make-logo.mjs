/**
 * Renders the STOARI overlay marks as transparent PNGs.
 *
 * Geometry is the approved mark from the studio build — the same paths the
 * nav renders — so the corner bug on a clip and the logo on the site are the
 * one object, not two drawings that drift apart.
 *
 *   node scripts/make-logo.mjs
 */
import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const OUT = 'public/logo'
await mkdir(OUT, { recursive: true })

/**
 * The slot: a mass with a vertical opening of light cut through it. Drawn as a
 * single even-odd path so the opening is a real hole — it reads on any ground
 * without a background rectangle underneath it.
 */
const MARK = `<path fill-rule="evenodd" d="M22 6 H78 V94 H22 Z M45.5 24 H54.5 V70 H45.5 Z"/>`

/** Mark only — square, for tight corners and avatars. */
const markSvg = (px) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100"
     fill="#FFFFFF">
  ${MARK}
</svg>`

/** Avatar — the mark centred on solid black, for social profile pictures. */
const avatarSvg = (px) => {
  const inset = Math.round(px * 0.14)
  const box = px - inset * 2
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">
  <rect width="${px}" height="${px}" fill="#0B0C0D"/>
  <svg x="${inset}" y="${inset}" width="${box}" height="${box}" viewBox="0 0 100 100"
       fill="#FFFFFF">
    ${MARK}
  </svg>
</svg>`
}

/**
 * The wordmark face. Bahnschrift is Microsoft's DIN — the drawing-office
 * standard, and the reason it is right here is the capital I: a bare vertical
 * stem, the same figure as the slot cut through the mark. Word and mark are
 * then one geometry rather than a drawing with a caption.
 *
 * The stack falls back through the other DIN descendants; the rendered PNGs are
 * committed, so a machine without the face still ships the correct letterforms.
 */
const FACE = "Bahnschrift, 'DIN Next', 'DIN Pro', 'Archivo', sans-serif"

/** The wordmark alone, on its own baseline — used for the reveal in video. */
const wordSvg = (px) => {
  const w = Math.round(px * 5.5)
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${px}" viewBox="0 0 ${w} ${px}">
  <text x="0" y="${Math.round(px * 0.5)}"
        font-family="${FACE}"
        font-size="${Math.round(px * 0.62)}"
        letter-spacing="${(px * 0.2).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">STOARI</text>
</svg>`
}

/**
 * Lockup — mark + wordmark. The tracking is explicit, so the spacing holds even
 * if a renderer substitutes the face.
 *
 * The gap between mark and word is nearly twice the cap height on purpose. The
 * mark is a box with a vertical slot — graphically an I — and the word ends in
 * one, so at a normal word gap the eye reads the whole thing as a single string,
 * "I STOARI". Pushing the mark away makes it an object again. The tracking came
 * down for the same reason: loose letters plus a leading glyph read as a row of
 * initials rather than a name.
 *
 * Below roughly 160px wide the word stops reading at this tracking. Use the mark
 * on its own there — see the sizing rule in START-HERE.md.
 */
const lockupSvg = (px) => {
  const h = px
  // Trimmed to the ink: the condensed face ends far earlier than the monospace
  // one did, and the leftover canvas used to push the corner bug off the corner.
  const w = Math.round(px * 4.5)
  const s = h / 100
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="translate(0,0) scale(${s})" fill="#FFFFFF">
    ${MARK}
  </g>
  <text x="${Math.round(h * 1.95)}" y="${Math.round(h * 0.63)}"
        font-family="${FACE}"
        font-size="${Math.round(h * 0.54)}"
        letter-spacing="${(h * 0.11).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">STOARI</text>
</svg>`
}

/**
 * The descriptor. Plain, not clever: it says what business the studio is in, in
 * the words a developer already uses. The name carries the distinctiveness, the
 * descriptor only removes the guessing.
 */
const DESCRIPTOR = 'REAL ESTATE MEDIA'

/**
 * Lockup with the descriptor locked under the word.
 *
 * It sits on the left edge of STOARI, not centred under the whole lockup. The
 * gap between mark and word is nearly twice the cap height on purpose, and a
 * centred descriptor would fall into that gap and read as a caption floating in
 * the middle of nothing. Aligned to the word, the two become one block and the
 * mark stays an object beside it.
 *
 * Size and tracking are set so the descriptor comes out the same width as the
 * word above it. That is the whole trick — a descriptor that is nearly but not
 * exactly the wordmark width looks like a mistake, one that matches looks built.
 */
const lockupDescriptorSvg = (px) => {
  const h = px
  const w = Math.round(px * 4.5)
  const s = h / 100
  const wordX = Math.round(h * 1.95)
  const H = Math.round(h * 1.34)
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}">
  <g transform="translate(0,0) scale(${s})" fill="#FFFFFF">
    ${MARK}
  </g>
  <text x="${wordX}" y="${Math.round(h * 0.63)}"
        font-family="${FACE}"
        font-size="${Math.round(h * 0.54)}"
        letter-spacing="${(h * 0.11).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">STOARI</text>
  <text x="${wordX}" y="${Math.round(h * 1.12)}"
        font-family="${FACE}"
        font-size="${Math.round(h * 0.17)}"
        letter-spacing="${(h * 0.043).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">${DESCRIPTOR}</text>
</svg>`
}

/**
 * Stacked variant — mark above, word under it, descriptor under that, all
 * centred. For square placements where the horizontal lockup would have to be
 * set too small to read: a profile header, a stamp on a board, the last frame of
 * a carousel. Stacking also dissolves the I-beside-I problem, so the mark can
 * sit directly over the word with an ordinary gap.
 */
const stackedSvg = (px) => {
  const w = Math.round(px * 3.2)
  const H = Math.round(px * 2.15)
  const cx = Math.round(w / 2)
  const markPx = px
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${H}" viewBox="0 0 ${w} ${H}">
  <g transform="translate(${Math.round(cx - markPx / 2)},0) scale(${markPx / 100})" fill="#FFFFFF">
    ${MARK}
  </g>
  <text x="${cx}" y="${Math.round(px * 1.42)}" text-anchor="middle"
        font-family="${FACE}"
        font-size="${Math.round(px * 0.54)}"
        letter-spacing="${(px * 0.11).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">STOARI</text>
  <text x="${cx}" y="${Math.round(px * 1.86)}" text-anchor="middle"
        font-family="${FACE}"
        font-size="${Math.round(px * 0.17)}"
        letter-spacing="${(px * 0.043).toFixed(2)}"
        fill="#FFFFFF" dominant-baseline="middle">${DESCRIPTOR}</text>
</svg>`
}

const jobs = [
  ['mark-16.png', markSvg(16)],
  ['mark-64.png', markSvg(64)],
  ['mark-128.png', markSvg(128)],
  ['mark-256.png', markSvg(256)],
  ['lockup-64.png', lockupSvg(64)],
  ['lockup-96.png', lockupSvg(96)],
  ['lockup-160.png', lockupSvg(160)],
  // Video: rendered at twice the size it is composited at (≈46% of a 1080-wide
  // frame), so the downscale is clean and the stems stay crisp on a phone.
  ['lockup-280.png', lockupSvg(280)],
  ['mark-560.png', markSvg(560)],
  ['word-280.png', wordSvg(280)],
  ['avatar-512.png', avatarSvg(512)],
  ['avatar-1024.png', avatarSvg(1024)],
  // Instagram crops the profile picture to a circle; 1080 is what the app
  // stores, and the mark sits well inside the inscribed circle at this inset.
  ['avatar-ig-1080.png', avatarSvg(1080)],
  ['lockup-descriptor-160.png', lockupDescriptorSvg(160)],
  ['lockup-descriptor-280.png', lockupDescriptorSvg(280)],
  ['lockup-descriptor-560.png', lockupDescriptorSvg(560)],
  ['stacked-280.png', stackedSvg(280)],
  ['stacked-560.png', stackedSvg(560)],
]

for (const [name, svg] of jobs) {
  const file = join(OUT, name)
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file)
  const { size } = await stat(file)
  console.log(`${name.padEnd(16)} ${(size / 1024).toFixed(1)} kB`)
}
console.log(`\nWritten to ${OUT}/ — white on transparent.`)
