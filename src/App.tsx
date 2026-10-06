import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'

import { createField } from './field'
import { chooseHeroVariant, type HeroVariant } from './heroMedia'
import { useHorizontalGalleries } from './useHorizontalGalleries'
import { LegalFooter } from './legal'
import { LEGAL_COPY } from './legalCopy'
import { updateMetadata } from './seo'
import { useDialogFocus } from './useDialogFocus'
import { useMediaPlayback } from './useMediaPlayback'
import {
  BRAND,
  COPY,
  LANGS,
  SECTIONS,
  WORK_MEDIA,
  type Copy,
  type Lang,
} from './content'
import { OFFER, type Prices, type Service } from './offer'
import {
  FILMS,
  FILMS_COPY,
  filmPoster,
  filmSrc,
  fmtTime,
  type Kind,
} from './films'

// Portrait phones use the portrait crop. Narrow landscape panels and touch
// tablets use a 720p landscape encode; wide desktops use the 1080p film.
// Width alone used to load a tightly cropped portrait film in desktop panels.
const heroKind = () => chooseHeroVariant(
  matchMedia('(max-width: 820px)').matches,
  matchMedia('(orientation: portrait)').matches,
  matchMedia('(pointer: coarse)').matches,
)
const heroClip = (variant: HeroVariant) => `${import.meta.env.BASE_URL}hero/hero-15s-stable${variant}.mp4`
const heroPoster = (variant: HeroVariant) =>
  `${import.meta.env.BASE_URL}hero/hero-poster-stable${variant === '-portrait' ? '-portrait' : ''}.jpg`

/**
 * A service photograph, keyed by the row's number rather than its
 * position, so the three languages cannot drift apart and reordering the rows
 * cannot silently reassign the pictures.
 *
 * These are matched to what the row says, not picked for looks: the plot with
 * the volume drawn on it goes under Visualisation because that is the service,
 * the agent's film under the agent row, the marina flight under Drone & FPV.
 * If a row's copy changes subject, the still has to be re-checked with it.
 */
const SERVICE_SHOT: Record<string, string> = {
  '01': WORK_MEDIA[5].img, // the agent film: the content the monthly package makes
  '02': WORK_MEDIA[2].img, // the interiors, as a photographer sees them
  '03': WORK_MEDIA[3].img, // the marina, flown
  '04': WORK_MEDIA[0].img, // the bare plot, then the volume standing on it
  '05': WORK_MEDIA[4].img, // the footprint drawn on the land: the system behind the sale
}

function ServicesCatalog({ services }: { services: Copy['services'] }) {
  return (
    <ul className="service-catalog">
      {services.rows.map((row) => (
        <li className="service-entry" key={row.n}>
          <img src={SERVICE_SHOT[row.n]} alt="" loading="lazy" decoding="async" width="720" height="900" />
          <div className="service-copy">
            <h3>{row.t}</h3>
            <p>{row.d}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function GalleryControls({ lang, next }: { lang: Lang; next: string }) {
  const labels = LEGAL_COPY[lang]
  return (
    <div className="gallery-controls">
      <div className="gallery-buttons">
        <button type="button" data-gallery-prev aria-label={labels.previous}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h14" /></svg>
        </button>
        <button type="button" data-gallery-next aria-label={labels.next}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 5 7 7-7 7M17 12H3" /></svg>
        </button>
      </div>
      <a href={next}>{labels.continue}</a>
    </div>
  )
}

function Mark() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M22 6 H78 V94 H22 Z M45.5 24 H54.5 V70 H45.5 Z" />
    </svg>
  )
}

/** Remembered choice first, then the browser, then English. */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('stoari.lang')
    if (saved && (LANGS as readonly string[]).includes(saved)) return saved as Lang
  } catch {
    /* private mode */
  }
  const l = navigator.language?.toLowerCase() ?? ''
  if (l.startsWith('ru')) return 'ru'
  if (l.startsWith('es')) return 'es'
  return 'en'
}

/**
 * React renders the markup; the field owns everything that moves — shape
 * morphs, the progress rule, the section counter, `.in` reveals and the
 * loader. Splitting that responsibility any other way would mean two systems
 * writing the same DOM.
 */
/**
 * The services and their prices, exactly as the brief sets them: the monthly
 * package as the one card that stands out, the two single services under it at
 * equal weight, and the agencies' CRM in a block of its own with no figure —
 * its price is settled at a meeting, so the block is built to book one.
 *
 * Every card ends in the same two ways in: WhatsApp with the service already
 * named in the draft, so the first message is not a blank "hi", or the form.
 *
 * The cards keep the classes the old price grids used — `pack`, `pp`, `pamt`,
 * `pl` — so they read in the same type and on the same dark panel as before.
 * Only the layout around them is new.
 */
const waLink = (text: string) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`

function ServiceCard({
  sv,
  p,
  shot,
  main = false,
}: {
  sv: Service
  p: Prices
  shot: number
  main?: boolean
}) {
  return (
    <div
      className={main ? 'pack on main' : 'pack'}
    >
      <img className="price-image" src={WORK_MEDIA[shot].img} alt="" loading="lazy" />
      <div className="price-body">
      <span className="tag">{sv.tag}</span>
      <h3 className="pt">{sv.t}</h3>
      <div className="pp">
        {sv.price.pre ? <span className="ppre">{sv.price.pre}</span> : null}
        <span className="pamt">{sv.price.amount}</span>
        {sv.price.per ? <span className="pper">{sv.price.per}</span> : null}
      </div>
      {sv.d ? <p className="pd">{sv.d}</p> : null}
      {sv.rows ? (
        <>
          <div className="pinc">{p.included}</div>
          <ul className="pl">
            {sv.rows.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="pacts">
        <a
          className="pcta"
          href={waLink(sv.wa)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${p.actions.wa}: ${sv.t}`}
        >
          {p.actions.wa}
        </a>
        <a className="pcta" href="#contact" aria-label={`${p.actions.form}: ${sv.t}`}>
          {p.actions.form}
        </a>
      </div>
      </div>
    </div>
  )
}

function PriceBlock({ p, vat }: { p: Prices; vat: string }) {
  return (
    <>
      <h2 className="rv">
        {p.title.join(' ')}
      </h2>
      <p className="lede rv">{p.lede}</p>

      <div className="packs pricing-grid rv">
        <ServiceCard sv={p.main} p={p} shot={1} main />
        {p.singles.map((sv, i) => (
          <ServiceCard key={sv.t} sv={sv} p={p} shot={[2, 3][i] ?? 0} />
        ))}
      </div>
      <div className="vat rv">{vat}</div>

      {/* Its own anchor, so a letter to an agency can link straight here. */}
      <div className="crm rv" id="crm">
        <h3>{p.crm.t}</h3>
        <p className="lede">{p.crm.lede}</p>
        <ul className="pl">
          {p.crm.rows.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="crmprice">{p.crm.price}</div>
        <div className="pacts">
          <a className="crmbook" href={waLink(p.crm.wa)} target="_blank" rel="noreferrer">
            {p.crm.book}
          </a>
          <a className="pcta" href="#contact">
            {p.actions.form}
          </a>
        </div>
      </div>
    </>
  )
}

/**
 * The enquiry form.
 *
 * Hostinger builds use VITE_ENQUIRY_ENDPOINT=/api/enquiry.php. Other builds
 * retain Netlify's POST and static form in index.html. Hostinger must return
 * an explicit JSON acknowledgement, so an HTML fallback cannot lose a lead
 * while showing a thank-you.
 *
 * On localhost there is nothing to POST to, so in dev the send is treated as
 * successful and the thank-you still shows — the flow can be checked without
 * deploying. In production the opposite rule holds: `fetch` does NOT reject on
 * a 404 or a 500, so the response is checked explicitly. A failed send must
 * never be acknowledged, or the enquiry is lost with nobody the wiser.
 */
function Enquiry({ c }: { c: Copy }) {
  const [sent, setSent] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [f, setF] = useState({ name: '', email: '', company: '', object: '', when: '' })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sent === 'sending') return
    const botField = new FormData(e.currentTarget).get('bot-field')
    const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT || '/'
    setSent('sending')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'enquiry', ...f, 'bot-field': String(botField || ''),
        }).toString(),
      })
      /* There is no form handler in front of `vite dev`, so the 404 it returns
         is the expected answer and not a failure worth showing. */
      const delivered = res.ok && (!import.meta.env.VITE_ENQUIRY_ENDPOINT || (await res.json()).ok === true)
      if (!delivered && !import.meta.env.DEV) {
        setSent('failed')
        return
      }
    } catch {
      /* Offline, DNS, a blocked request — nothing arrived. Say so. */
      if (!import.meta.env.DEV) {
        setSent('failed')
        return
      }
    }
    setSent('done')
  }

  /* Whatever they typed travels into the WhatsApp draft, so a visitor who
     prefers to carry on there does not have to say it twice. */
  const draft = [f.name, f.company, f.object, f.when].filter(Boolean).join(', ')
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    draft || c.contact.waText,
  )}`

  /* The typed values are deliberately kept in state: the visitor retries with
     the form still filled in, and never retypes the property twice. */
  if (sent === 'failed')
    return (
      <div className="formdone rv" role="alert">
        <div className="fdone ffail">{c.form.failed}</div>
        <p className="fnote">{c.form.failedNote}</p>
        <div className="frecover">
          <button type="button" className="fretry" onClick={() => setSent('idle')}>
            {c.form.retry}
          </button>
          <a className="wa" href={wa} target="_blank" rel="noreferrer">
            {c.form.wa}
          </a>
        </div>
      </div>
    )

  if (sent === 'done')
    return (
      <div className="formdone rv" role="status">
        <div className="fdone">{c.form.done}</div>
        <p className="fnote">{c.form.doneNote}</p>
        <a className="wa" href={wa} target="_blank" rel="noreferrer">
          {c.form.wa}
        </a>
      </div>
    )

  return (
    <form className="enq rv" name="enquiry" onSubmit={submit}>
      <input type="hidden" name="form-name" value="enquiry" />
      <p className="hidden">
        <label>
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="erow">
        <label className="form-field" htmlFor="enquiry-name">{c.form.name} <span>*</span>
          <input id="enquiry-name" name="name" required maxLength={120} autoComplete="name" value={f.name} onChange={set('name')} />
        </label>
        <label className="form-field" htmlFor="enquiry-email">{c.form.email} <span>*</span>
          <input id="enquiry-email" name="email" type="email" required maxLength={254} autoComplete="email" value={f.email} onChange={set('email')} />
        </label>
      </div>
      <label className="form-field" htmlFor="enquiry-company">{c.form.company}
        <input id="enquiry-company" name="company" maxLength={120} autoComplete="organization" value={f.company} onChange={set('company')} />
      </label>
      <label className="form-field" htmlFor="enquiry-object">{c.form.object} <span>*</span>
        <textarea id="enquiry-object" name="object" required maxLength={2000} rows={3} value={f.object} onChange={set('object')} />
      </label>
      <label className="form-field" htmlFor="enquiry-when">{c.form.when}
        <input id="enquiry-when" name="when" maxLength={120} value={f.when} onChange={set('when')} />
      </label>
      <button type="submit" disabled={sent === 'sending'}>
        {sent === 'sending' ? c.form.sending : c.form.submit}
      </button>
      <p className="fnote">
        {c.form.note}
        {BRAND.privacyUrl && (
          <>
            {' '}
            <a className="fprivacy" href={BRAND.privacyUrl} target="_blank" rel="noreferrer">
              {c.form.privacy}
            </a>
          </>
        )}
      </p>
    </form>
  )
}

/**
 * The full films. A mosaic rather than a grid of equal tiles: vertical films
 * stand one column wide and two rows tall, horizontal ones lie two columns
 * wide and one row tall, and `grid-auto-flow: dense` packs them. Every tile is
 * cropped only slightly; the film itself always plays uncropped.
 *
 * Visible cards play the entire supplied export silently. Offscreen cards stay
 * unloaded until visible; the player opens that export with sound and controls.
 */
function Films({ lang }: { lang: Lang }) {
  const t = FILMS_COPY[lang]
  const [kind, setKind] = useState<Kind | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)
  const [durations, setDurations] = useState<Record<string, number>>({})
  const list = FILMS.filter((x) => kind === 'all' || x.kind === kind)
  const kinds = (['villas', 'fpv', 'agents', 'build', 'ai'] as Kind[]).filter((k) =>
    FILMS.some((x) => x.kind === k),
  )

  const film = open === null ? null : list[open]
  const isExcerpt = (id: string, expected: number) =>
    durations[id] !== undefined && durations[id] < expected - 1
  const rememberDuration = (id: string) => (e: { currentTarget: HTMLVideoElement }) => {
    const duration = e.currentTarget.duration
    if (Number.isFinite(duration)) {
      setDurations((saved) => saved[id] === duration ? saved : { ...saved, [id]: duration })
    }
  }
  useMediaPlayback(lang, kind, '.film video', open !== null)
  useDialogFocus(open !== null, '.player')

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.target instanceof HTMLMediaElement) return
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % list.length))
      if (e.key === 'ArrowLeft')
        setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length))
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, list.length])

  return (
    <>
      <h2 className="rv">
        {t.title.join(' ')}
      </h2>
      <p className="lede rv">{t.lede}</p>

      <div className="ftabs rv" role="group" aria-label={t.title.join(" ")}>
        {(['all', ...kinds] as (Kind | 'all')[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kind === k}
            className={kind === k ? 'on' : ''}
            onClick={() => setKind(k)}
          >
            {k === 'all' ? t.all : t.kinds[k]}
            <span>
              {k === 'all' ? FILMS.length : FILMS.filter((x) => x.kind === k).length}
            </span>
          </button>
        ))}
      </div>

      {/* The wrapper is the size container the mosaic measures itself against:
          rows are derived from the column width, so a vertical tile stays near
          9:16 and a horizontal one near 16:9 at every screen width. */}
      <div className="filmswrap rv hpin" data-pin-speed="2.2">
      <div className="hstage">
      <div className="films gallery-track">
        {list.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={x.vertical ? 'film v' : 'film h'}
            onClick={() => setOpen(i)}
            aria-label={`${x.title} — ${isExcerpt(x.id, x.duration) ? t.excerpt : t.lines[x.id]}`}
          >
            <img
              src={filmPoster(x.id)}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.hidden = true
              }}
            />
            <video
              muted
              loop
              playsInline
              preload="none"
              poster={filmPoster(x.id)}
              src={filmSrc(x.id)}
              onLoadedMetadata={rememberDuration(x.id)}
              aria-hidden="true"
            />
            <span className="fplay" aria-hidden="true" />
            <span className="fbadges">
              {durations[x.id] !== undefined && <span>{fmtTime(durations[x.id])}</span>}
              {isExcerpt(x.id, x.duration) && <span>{t.excerpt}</span>}
              <span>{x.vertical ? '9:16' : '16:9'}</span>
            </span>
            <span className="fmeta">
              <span className="fk">{t.kinds[x.kind]}</span>
              <span className="ft">{x.title}</span>
              <span className="fl">{isExcerpt(x.id, x.duration) ? t.excerpt : t.lines[x.id]}</span>
            </span>
          </button>
        ))}
      </div>
      <GalleryControls lang={lang} next="#services" />
      </div>
      </div>

      {film && (
        <div
          className="player"
          role="dialog"
          aria-modal="true"
          aria-label={film.title}
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        >
          <div className={film.vertical ? 'pbox v' : 'pbox h'}>
            <video
              key={film.id}
              src={filmSrc(film.id)}
              poster={filmPoster(film.id)}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={rememberDuration(film.id)}
            />
            <div className="pcap">
              <span className="fk">{t.kinds[film.kind]}</span>
              <span className="ft">{film.title}</span>
              <span className="fl">
                {isExcerpt(film.id, film.duration) ? t.excerpt : t.lines[film.id]}
                {durations[film.id] !== undefined && `, ${fmtTime(durations[film.id])}`}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="pnav prev"
            onClick={() => setOpen((open! - 1 + list.length) % list.length)}
          >
            {t.prev}
          </button>
          <button
            type="button"
            className="pnav next"
            onClick={() => setOpen((open! + 1) % list.length)}
          >
            {t.next}
          </button>
          <button type="button" className="pclose" onClick={() => setOpen(null)}>
            {t.close}
          </button>
        </div>
      )}
    </>
  )
}

export default function App() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let dispose = createField()
    const refresh = () => { dispose(); dispose = createField() }
    preference.addEventListener('change', refresh)
    return () => { preference.removeEventListener('change', refresh); dispose() }
  }, [])

  const [lang, setLang] = useState<Lang>(initialLang)
  const [heroVariant, setHeroVariant] = useState(heroKind)
  const c = COPY[lang]
  const o = OFFER[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    updateMetadata(lang)
  }, [lang])

  useEffect(() => {
    const queries = ['(max-width: 820px)', '(orientation: portrait)', '(pointer: coarse)'].map((query) => matchMedia(query))
    const update = () => setHeroVariant(heroKind())
    queries.forEach((query) => query.addEventListener('change', update))
    return () => queries.forEach((query) => query.removeEventListener('change', update))
  }, [])
  useMediaPlayback(lang, heroVariant)

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('section.hero')
    if (!hero) return
    const update = () => document.documentElement.style.setProperty('--hero-height', `${hero.offsetHeight}px`)
    const observer = new ResizeObserver(update)
    observer.observe(hero)
    update()
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--hero-height')
    }
  }, [])

  /**
   * A project opens over the page rather than on its own route: the field
   * renderer owns a single continuous scroll, and routing away from it would
   * mean tearing down and rebuilding the canvas on every click.
   */
  useHorizontalGalleries(lang)

  /* The sticky button stays out of the hero, where the hero has its own call
     to action, and appears once the visitor is past it. */
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(scrollY > innerHeight * 0.8)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const [open, setOpen] = useState<number | null>(null)
  const project = open === null ? null : c.works.items[open]
  const media = open === null ? null : WORK_MEDIA[open]
  useDialogFocus(open !== null, '.sheet')

  useEffect(() => {
    if (project === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [project])

  const s = SECTIONS
  const cls = (i: number) =>
    [s[i].hero ? 'hero' : '', s[i].rev ? 'rev' : '', s[i].wide ? 'wide' : '']
      .filter(Boolean)
      .join(' ')
  /** `rev` mirrors the section; the column has to follow it or the copy sits
      under the point cloud instead of beside it. */
  const col = (i: number) =>
    ['col', s[i].wide ? 'wide' : '', s[i].rev ? 'right' : '']
      .filter(Boolean)
      .join(' ')

  return (
    <>
      {/* The film has to sit UNDER the point cloud, and that is why it lives
          here rather than inside the hero section: `main` carries z-index 10 and
          makes its own stacking context, so nothing inside it — however negative
          its z-index — can ever fall behind the canvas. Out here it can.
          Absolute, not fixed: it scrolls away with the hero. */}
      <div
        className="heroclip"
        aria-hidden="true"
        style={{ '--hero-poster': `url(${heroPoster(heroVariant)})` } as CSSProperties}
      >
        <video
          key={heroVariant}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster(heroVariant)}
        >
          <source src={heroClip(heroVariant)} type="video/mp4" />
        </video>
      </div>

      <canvas id="gl" aria-hidden="true" />

      <a className="skip-link" href="#main">{LEGAL_COPY[lang].skip}</a>
      <nav>
        <div className="brand">
          <Mark />
          <div className="brandword">
            <b>{BRAND.name}</b>
            <i>{BRAND.descriptor}</i>
          </div>
        </div>
        <div className="navlinks">
          {c.nav.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="navright">
          <a className="navtel" href={BRAND.phoneHref}>
            {BRAND.phone}
          </a>
          <div className="lang" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                className={l === lang ? 'on' : ''}
                onClick={() => {
                  setLang(l)
                  try { localStorage.setItem('stoari.lang', l) } catch { /* private mode */ }
                }}
                aria-pressed={l === lang}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="navcta" href="#contact">
            {c.cta}
          </a>
        </div>
      </nav>

      <main id="main">
        <section
          className={cls(0)}
          data-shape={s[0].shape}
          data-label={c.labels[0]}
        >
          <div className="col">
            <h1 className="rv">
              {c.hero.title[0]}<br />{c.hero.title[1]}
            </h1>
            <p className="lede rv">{c.hero.lede}</p>
            {/* The hero points at the prices, not at the form. A visitor who
                came to find out what this costs should not have to scroll
                past six sections to learn it. */}
            <div className="hero-actions">
              <a className="herocta" href="#packages">{c.hero.cta}</a>
              <a className="hero-prices" href="#work">{c.nav[0].label}</a>
            </div>
          </div>
        </section>

        <section
          id={s[1].id}
          className={cls(1)}
          data-shape={s[1].shape}
          data-label={c.labels[1]}
        >
          <div className={col(1)}>
            <h2 className="rv">
              {c.works.title.join(' ')}
            </h2>
            <p className="lede rv">{c.works.lede}</p>
            <div className="hpin" data-pin-speed="1.1">
              <div className="hstage">
                <div className="works gallery-track">
              {c.works.items.map((w, i) => (
                <button
                  className="work"
                  key={WORK_MEDIA[i].n}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`${w.t} — ${c.works.more}`}
                >
                  <div className="shot">
                    <img src={WORK_MEDIA[i].img} alt={w.alt} loading="lazy" />
                    {/* Three silent seconds on a loop. The still underneath is
                        the poster, so a card never renders empty and reduced
                        motion falls back to it. */}
                    <video
                      className="clip"
                      poster={WORK_MEDIA[i].img}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                    >
                      <source src={WORK_MEDIA[i].clip} type="video/mp4" />
                    </video>
                    <span className="svc">{w.s}</span>
                  </div>
                  <div className="wmeta">
                    <span className="n">{WORK_MEDIA[i].n}</span>
                    <span className="t">{w.t}</span>
                  </div>
                  <div className="k">{w.k}</div>
                  <p className="d">{w.d}</p>
                  <span className="more">{c.works.more}</span>
                </button>
              ))}
                </div>
                <GalleryControls lang={lang} next="#packages" />
              </div>
            </div>
          </div>
        </section>

        <section
          id={s[2].id}
          className={cls(2)}
          data-shape={s[2].shape}
          data-label={c.labels[2]}
        >
          <div className={col(2)}>
            <PriceBlock p={o.prices} vat={o.vat} />
          </div>
        </section>

        <section
          id={s[3].id}
          className={cls(3)}
          data-shape={s[3].shape}
          data-label={c.labels[3]}
        >
          <div className={col(3)}>
            <Films lang={lang} />
          </div>
        </section>

        <section
          id={s[4].id}
          className={cls(4)}
          data-shape={s[4].shape}
          data-label={c.labels[4]}
        >
          <div className={col(4)}>
            <div className="service-heading">
              <h2>{c.services.title.join(' ')}</h2>
              <p className="lede">{c.services.lede}</p>
            </div>
            <ServicesCatalog services={c.services} />
            {/* The visualisation passes lived under the developers' price grid.
                The grid went with the old prices; the method did not change,
                so it moved here, next to the Visualisation row it belongs to. */}
            <div className="passes rv">
              <div className="steps">
                {c.method.steps.map((st) => (
                  <div className="step" key={st.sn}>
                    <div className="sn">{st.sn}</div>
                    <div>
                      <div className="st">{st.st}</div>
                      <div className="sd">{st.sd}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id={s[5].id}
          className={cls(5)}
          data-shape={s[5].shape}
          data-label={c.labels[5]}
        >
          <div className={col(5)}>
            <h2 className="rv">
              {o.how.title.join(' ')}
            </h2>
            <p className="lede rv">{o.how.lede}</p>
            <div className="steps rv">
              {o.how.steps.map((st) => (
                <div className="step" key={st.sn}>
                  <div className="sn">{st.sn}</div>
                  <div>
                    <div className="st">{st.st}</div>
                    <div className="sd">{st.sd}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id={s[6].id}
          className={cls(6)}
          data-shape={s[6].shape}
          data-label={c.labels[6]}
        >
          <div className={col(6)}>
            <h2 className="rv">
              {c.why.title.join(' ')}
            </h2>
            <p className="lede rv">{c.why.lede}</p>
            <div className="stats rv">
              {c.why.stats.map((st) => (
                <div className="stat" key={st.k}>
                  <div className="v">{st.v}</div>
                  <div className="k">{st.k}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id={s[7].id}
          className={cls(7)}
          data-shape={s[7].shape}
          data-label={c.labels[7]}
        >
          <div className={col(7)}>
            <h2 className="rv">
              {o.faq.title.join(' ')}
            </h2>
            <p className="lede rv">{o.faq.lede}</p>
            {/* Native details: the answers stay in the page for search and for
                anyone reading with the keyboard, with no state to get wrong. */}
            <div className="faq rv">
              {o.faq.items.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id={s[8].id}
          className={cls(8)}
          data-shape={s[8].shape}
          data-label={c.labels[8]}
        >
          <div className={col(8)}>
            <h2 className="rv">
              {c.contact.title.join(' ')}
            </h2>
            <div className="formhead rv">
              <h3>
                {c.form.title.join(' ')}
              </h3>
              <p className="lede">{c.form.lede}</p>
            </div>
            <Enquiry c={c} />

            <a className="bigmail rv" href={`mailto:${BRAND.email}`}>
              {BRAND.email}
            </a>
            {/* On this coast a developer answers WhatsApp and ignores email,
                so the number sits at the same weight as the address. */}
            <div className="reach rv">
              <a
                className="wa"
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                  c.contact.waText,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                WHATSAPP {BRAND.whatsappLabel}
              </a>
              <a
                className="wa"
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
              >
                INSTAGRAM {BRAND.instagramLabel}
              </a>
              <a className="wa" href={BRAND.phoneHref}>
                {BRAND.phone}
              </a>
            </div>
            <div className="meta rv">
              {c.contact.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} />

      <a className={past ? 'stickycta on' : 'stickycta'} href="#contact">
        {c.stickyCta}
      </a>

      {project && media && (
        <div
          className="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={project.t}
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
        >
          <div className="sheetin">
            <button
              className="close"
              type="button"
              onClick={() => setOpen(null)}
              aria-label={c.close}
            >
              {c.close}
            </button>

            <div className="shead">
              <p className="project-type">{project.s}</p>
              <h3>{project.t}</h3>
              <div className="k">{project.k}</div>
              <p className="d">{project.d}</p>
            </div>

            <div className="strip">
              {media.frames.map((src, i) => (
                <figure key={src}>
                  <img src={src} alt={project.caps[i]} loading="lazy" />
                  <figcaption>{project.caps[i]}</figcaption>
                </figure>
              ))}
            </div>

            <a className="sheetcta" href="#contact" onClick={() => setOpen(null)}>
              {c.cta}
            </a>
          </div>
        </div>
      )}

    </>
  )
}
