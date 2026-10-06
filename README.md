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
| `src/content.ts` | Identity copy — brand, nav, hero, work, services, method, contact, in all three languages. Also `SECTIONS`, which is the order of the page. |
| `src/offer.ts` | Commercial copy — packages, agents, developers, leads & automation, travel, the four steps, the questions. Prices live here and nowhere else in the code. |
| `src/field.ts` | The point field: geometry, shaders, physics, and `OFFSETS`, which pushes the cloud away from the text column section by section. |
| `src/App.tsx` | Markup. Sections are rendered by index against `SECTIONS`. |
| `src/styles.css`, `src/refinements.css` | Original design and scoped responsive refinements, shared card/control radii. |
| `src/useHorizontalGalleries.ts` | Vertical-to-horizontal gallery travel, keyboard visibility and reduced-motion fallback. |
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

## Deployment — stoari.com

The primary domain is `https://stoari.com`, on Robert's existing Hostinger
Business plan. `www.stoari.com` and HTTP redirect to the HTTPS primary domain.
The old GitHub Pages and Netlify deployments are separate from this hosting.

```bash
npm ci
composer install --no-dev
npm run test:enquiry   # PHP required; test mail never leaves the computer
npm run lint
npm run bundle:hostinger
```

Upload the contents of `dist-hostinger/stoari-hostinger.zip` into this site's
`public_html`. The archive root contains `index.html`, `.htaccess`, `assets/`,
`films/` and `api/`. Keep a copy of the previous archive before replacing it,
so rollback is restoring the previous contents. Build from the agreed Git
commit and record that commit with each deployment.

Full films are ignored on `main`. In a fresh checkout, recover the web versions
from the publishing branch before building (or use a saved copy):

```bash
git fetch origin gh-pages
git archive origin/gh-pages films | tar -x -C public
```

GitHub Pages contains 15-second excerpts, not the integral films described by
the catalogue. Full exports must be supplied separately. The packaging command
checks all 15 durations with `ffprobe` and rejects those excerpts by default.
`node scripts/package-hostinger.mjs --preview-excerpts` is only for updates that
explicitly retain the existing excerpt portfolio. Do not upload camera originals.

`build:hostinger` selects `/api/enquiry.php` for the enquiry
form. PHP validates the request, ignores the honeypot and limits repeated sends;
Authenticated SMTP over verified TLS forwards to the studio's existing public address,
`info@stoari.com`. The visitor sees success only when the transport
accepts the message. Acceptance does not verify delivery to the recipient's
inbox; verify that separately with an authorised real enquiry. SMTP credentials must exist at `~/domains/stoari.com/private/smtp.json`, outside `public_html`, with mode 0600. The handler fails closed if configuration, TLS, authentication or delivery acceptance fails; it never falls back to `mail()`. No enquiry text
is saved by this handler. Private temporary counters contain only send counts.

All builds default to `/api/enquiry.php`; `VITE_ENQUIRY_ENDPOINT` can override it only with a compatible JSON handler. Success requires an HTTP-success response with JSON `{ok:true}`. A page returning HTTP 200 cannot acknowledge an enquiry. Development previews do not simulate success. Use `npm run test:enquiry-client` and `npm run test:enquiry` for isolated transport checks; neither sends external mail.

After uploading, check HTTPS, the `www` redirect, the hero, all film assets,
the three languages and the contact form's error path. Publishing on Hostinger
currently requires an explicit upload; a push to GitHub alone does not update it.

## October 2026 refinement

The opening particle wordmark and illustrated service rows are retained. Prices
are three peers on desktop and stack on mobile. Cards and action buttons share
square corners, per the owner’s latest preference. Service rows retain their
images with compact spacing and separators. The hero selects its film by both
width and orientation: narrow landscape panels do not load the magnified phone
crop. Media selection updates on resize/rotation. Galleries use native vertical page scrolling, hidden
scrollbars and previous/next controls. Reduced-motion visitors get static
posters and native horizontal browsing; short viewports keep controls accessible.

Fonts are self-hosted, licensed WOFF2 with Latin/Cyrillic coverage. Work and
film assets retain their existing WebP/MP4 optimization. Visible clips pause
offscreen, in hidden tabs and when reduced motion is requested. The hero has
no pause button, per the owner's preference; reduced-motion visitors see its
poster. Keyboard users can skip the page and access modal focus traps.
The hero's original frame-to-frame wobble has been corrected within each shot,
with a fixed 1% safety crop and the original 30 fps cadence. Original source
files are retained; the page loads the separately named stable exports.

The contact form requires a valid reply email. Run `npm run test:hero` for
responsive film selection, `npm run test:gallery` for scroll geometry and
`npm run test:enquiry` for PHP validation, rate limiting
and SMTP success/failure using an isolated local TLS mail server.

SEO includes the primary-domain canonical, metadata in the selected language,
favicon/app icons, sitemap, robots file and business structured data. Spanish
legal, privacy and cookie pages use the owner and address supplied by Robert.
There are no analytics, advertising cookies or third-party video/font embeds.
Language storage is written only after an explicit language selection.

The owner confirmed creation of `info@stoari.com` on Hostinger. The public
contact, structured data, legal pages, form destination and sender now use that
address. MX records point to Hostinger and SPF includes its mail service.
Actual end-to-end inbox delivery is still pending an authorised real enquiry;
local tests capture mail using a fake transport and never send it externally.
Website policy text does not replace the owner's provider agreements and
actual operating duties.

### Authenticated email setup

On 6 October the first public enquiry reached Spam: `dkim=none`, `dmarc=fail`
(SPF authenticated the generic hosting server, not stoari.com). The domain's
Hostinger SPF and three DKIM CNAMEs were already present. Authenticated SMTP
replaces that unauthenticated transport; no DNS bypass or mailbox allowlist is used.

The owner runs `python3 scripts/configure-smtp.py` to enter the **existing mailbox**
password in a hidden local prompt. It tests the login against `smtp.hostinger.com:465`
with certificate verification, then stores the secret via SSH stdin outside the web root.
It does not print/save the password locally, change it, send email, or publish code.
`composer.lock` pins PHPMailer; `npm run build:hostinger` installs it before packaging.
After setup and deployment, verify a real enquiry's inbox placement and original
SPF/DKIM/DMARC results. SMTP acceptance alone is not proof of inbox placement.
