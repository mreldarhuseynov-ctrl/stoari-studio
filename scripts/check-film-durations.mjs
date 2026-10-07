import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const source = await readFile('src/films.ts', 'utf8')
const films = [...source.matchAll(/\{ id: '([^']+)'[^\n]+duration: ([\d.]+)/g)]
const directory = process.argv[2] || 'dist/films'
if (films.length !== 15) throw new Error('Expected the complete 15-film catalogue')
const failures = []
for (const [, id, expected] of films) {
  const actual = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', join(directory, `${id}.mp4`),
  ], { encoding: 'utf8' }).trim())
  if (!Number.isFinite(actual) || Math.abs(actual - Number(expected)) > 1) {
    failures.push(`${id}: ${actual}s supplied; approximately ${expected}s required`)
  }
}
if (failures.length) {
  console.error(`Full film verification failed:\n${failures.join('\n')}`)
  process.exitCode = 1
} else console.log('PASS: all 15 films retain their complete catalogue durations.')
