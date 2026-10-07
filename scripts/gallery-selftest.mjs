import assert from 'node:assert/strict'
import { galleryOffset, cardOffset } from '../src/galleryGeometry.ts'

// Scenarios mirror actual touch/desktop rails, changing filters and reverse scroll.
for (const { viewport, distance, speed, stickyTop } of [
  { viewport: 375, distance: 1245, speed: 1.1, stickyTop: 164 },
  { viewport: 1280, distance: 4200, speed: 2.2, stickyTop: 168 },
  { viewport: 375, distance: 750, speed: 2.2, stickyTop: 214 },
]) {
  assert.equal(galleryOffset(stickyTop + 100, stickyTop, distance, speed), 0, 'No sideways movement before the stage sticks')
  assert.equal(galleryOffset(stickyTop, stickyTop, distance, speed), 0)
  assert.equal(galleryOffset(stickyTop - distance / speed, stickyTop, distance, speed), distance, 'The final card is reachable')
  assert.equal(galleryOffset(-10000, stickyTop, distance, speed), distance, 'No overrun at the end')
  assert.equal(galleryOffset(stickyTop - distance / speed / 2, stickyTop, distance, speed), distance / 2, 'Reverse scrolling returns to the same position')
  const left = distance + viewport - 270
  const offset = cardOffset(left, 270, viewport, distance)
  assert.ok(offset <= left && offset + viewport >= left + 270, 'Keyboard/arrow navigation fully reveals the final card')
}
assert.equal(galleryOffset(-400, 88, 0, 2.2), 0, 'A filter with no overflowing content has no pinned travel')
assert.equal(cardOffset(18, 270, 375, 1245), 0, 'The first card never requests a negative page offset')
console.log('PASS: mobile/desktop travel, both endpoints, reverse scrolling, short filters and focused-card visibility.')
