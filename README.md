# STOARI — studio site

One long page, three languages, a WebGL point field that assembles the wordmark,
and a fifteen-second film behind the hero. React + Vite, and no CSS library on
purpose.

```bash
npm install
npm run dev      # http://localhost:5176
npm run build    # type-checks first, then builds into dist/
npm run lint
```

---

## Where things live

| File | What is in it |
|---|---|
| `src/content.ts` | Identity copy — brand, nav, hero, work, services, why, method, contact, in all three languages. Also `SECTIONS`, which is the order of the page. |
| `src/offer.ts` | Commercial copy — packages, agents, developers, leads & automation, travel, the four steps, the questions. Prices live here and nowhere else in the code. |
| `src/field.ts` | The point field: geometry, shaders, physics, and `OFFSETS`, which pushes the cloud away from the text column section by section. |
| `src/App.tsx` | Markup. Sections are rendered by index against `SECTIONS`. |
| `src/styles.css` | The whole design system. Plain CSS, deliberately. |
| `scripts/make-logo.mjs` | Renders every logo PNG in `public/logo` from one SVG source. |
| `public/hero/` | The hero film and its poster. |

---

## Seven things that break the site quietly

Every one of these has already gone wrong once. None of them shows up as an error.

**1. The mark's geometry lives in two places.** `scripts/make-logo.mjs` and the
`Mark()` component in `src/App.tsx` draw the same shape independently. Change one
without the other and the mark in the nav stops matching the mark in every
exported file.

**2. `SECTIONS` and `OFFSETS` are indexed against each other.** Add, remove or
reorder a section in `content.ts` and the `OFFSETS` array in `field.ts` has to be
re-checked. Nothing warns you — the point cloud simply ends up behind the copy.

**3. `main` carries `z-index: 10`.** It opens its own stacking context, so
anything that has to sit *behind* the point field cannot live inside it, however
negative its own z-index. That is why `.heroclip` is a sibling of the canvas and
not a child of the hero section.

**4. The canvas has to stay transparent.** `field.ts` creates the GL context with
`alpha: true`, and the composite shader writes coverage into the alpha channel
instead of a flat `1.0`. Put either of those back the way it was and the hero
film vanishes behind an opaque black sheet.

**5. Prices are downstream of a document.** The numbers in `offer.ts` come from
`stoari-content/пакеты.md`, which derives each of them from the cost of a shoot
day and a positioning floor. Change the document first, then the code.

**6. The descriptor is translated as a line of text and never inside the lockup.**
`REAL ESTATE MEDIA` stays English in the mark itself, because there it is part of
the mark. In the contact footer it is translated, because there it sits beside a
translated name and place.

**7. The dated offer has to come down when its date passes.** The `offer` block in
`content.ts` announces terms until 30 September. A deadline that is quietly
extended tells every returning visitor the price was never real. Delete the block
from all three languages once the date has gone.

---

## Working on this together

- **`main` is what is live.** Nothing is committed straight to it — branch, then
  merge.
- **One branch per change,** named for the change: `hero-video`, `whatsapp-bot`.
- **Never force-push `main`.** If two changes collide, merge them by hand.
- **`npm run build` has to pass before a merge.** It type-checks first, so a
  broken build is a compile error rather than a surprise in production.
- **How the site looks and what it promises are decisions, not preferences.** The
  reasoning behind the current answers is written down in `stoari-content/`:
  `START-HERE.md` for the identity, `закон-сайта.md` for the visual law,
  `пакеты.md` for the prices. Read the relevant one before changing what it
  covers, and update it in the same breath as the code.

---

## Deployment

The site deploys from `main`: Netlify runs `npm run build` and serves `dist`.
Nothing is dragged into a browser by hand any more — that is exactly how two
people overwrite each other's work.
