import { readFile, readdir, mkdir, rm, access } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

// Full films are kept out of main. Refuse an incomplete portfolio bundle.
const filmsSource = await readFile('src/films.ts', 'utf8')
const ids = [...filmsSource.matchAll(/\{ id: '([^']+)'/g)].map((match) => match[1])
for (const id of ids) {
  for (const suffix of ['.mp4', '-preview.mp4', '.webp']) {
    await access(`dist/films/${id}${suffix}`)
  }
}
// GitHub Pages contains 15-second excerpts, despite the full-film catalogue.
// Presence alone must never qualify those excerpts as integral films.
const excerpts = process.argv.includes('--preview-excerpts')
if (!excerpts) execFileSync(process.execPath, ['scripts/check-film-durations.mjs'], { stdio: 'inherit' })
const assets = await readdir('dist/assets')
const bundle = (await Promise.all(assets.filter((file) => file.endsWith('.js'))
  .map((file) => readFile(`dist/assets/${file}`, 'utf8')))).join('\n')
if (!bundle.includes('/api/enquiry.php')) throw new Error('Run npm run build:hostinger first')
await access('dist/api/enquiry.php')
await access('dist/.htaccess')
for (const variant of ['', '-landscape', '-portrait']) {
  await access(`dist/hero/hero-15s-stable${variant}.mp4`)
}
for (const variant of ['', '-portrait']) {
  await access(`dist/hero/hero-poster-stable${variant}.jpg`)
}
await mkdir('dist-hostinger', { recursive: true })
const archive = resolve('dist-hostinger/stoari-hostinger.zip')
await rm(archive, { force: true })
execFileSync('zip', ['-qr', archive, '.'], { cwd: 'dist' })
console.log(`Hostinger bundle ready: ${archive} (${ids.length} ${excerpts ? 'preview excerpts' : 'verified full films'})`)
