import assert from 'node:assert/strict'
import { chooseHeroVariant } from '../src/heroMedia.ts'

assert.equal(chooseHeroVariant(false, false, false), '', 'A wide desktop keeps the original film')
assert.equal(chooseHeroVariant(true, false, false), '-landscape', 'A narrow desktop panel must not magnify a portrait crop')
assert.equal(chooseHeroVariant(true, true, true), '-portrait', 'A portrait phone gets the full-height portrait film')
assert.equal(chooseHeroVariant(true, false, true), '-landscape', 'Turning a phone switches to the landscape film')
assert.equal(chooseHeroVariant(false, false, true), '-landscape', 'A touch tablet uses the smaller landscape film')
console.log('PASS: desktop, narrow panels, portrait phones and rotation select the matching hero format.')
