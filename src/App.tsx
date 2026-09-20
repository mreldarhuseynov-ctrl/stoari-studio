import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'

import { createField } from './field'
import {
  BRAND,
  COPY,
  LANGS,
  SECTIONS,
  WORK_MEDIA,
  type Copy,
  type Lang,
} from './content'
import { OFFER, type Block } from './offer'
import {
  FILMS,
  FILMS_COPY,
  filmPoster,
  filmPreview,
  filmSrc,
  fmtTime,
  type Kind,
} from './films'

/**
 * A still behind each service row, keyed by the row's number rather than its
 * position, so the three languages cannot drift apart and reordering the rows
 * cannot silently reassign the pictures.
 *
 * These are matched to what the row says, not picked for looks: the plot with
 * the volume drawn on it goes under Visualisation because that is the service,
 * the agent's film under the agent row, the marina flight under Drone & FPV.
 * If a row's copy changes subject, the still has to be re-checked with it.
 */
const SERVICE_SHOT: Record<string, string> = {
  '01': WORK_MEDIA[0].img, // the bare plot, then the volume standing on it
  '02': WORK_MEDIA[5].img, // the agent film
  '03': WORK_MEDIA[3].img, // the marina, flown
  '04': WORK_MEDIA[1].img, // the finished residence a project page is built on
  '05': WORK_MEDIA[4].img,
}

/**
 * A price is one string in the copy — `from €1,400`, `desde 1.400 € / mes`,
 * `от 1 900 € / мес` — because that is how it is written and read in each
 * language, and splitting it in the content would mean three ways to get the
 * same number wrong. It is split here instead, for typesetting only.
 *
 * The amount is the first run of digits touching the currency mark, on either
 * side of it, with the thin and non-breaking spaces the Russian copy uses. The
 * words before it and whatever follows — `/ month`, `+ 350 €/mes` — are set
 * small, so the figure is the only thing at size and the eye lands on it.
 */
const PRICE = /^(.*?)((?:€\s?[\d.,\u00a0\u202f ]*\d)|(?:\d[\d.,\u00a0\u202f ]*\s?€))(.*)$/

function splitPrice(price: string) {
  const m = PRICE.exec(price)
  if (!m) return { pre: '', amount: price, post: '' }
  return { pre: m[1].trim(), amount: m[2].trim(), post: m[3].trim() }
}

function Mark() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M22 6 H78 V94 H22 Z M45.5 24 H54.5 V70 H45.5 Z" />
    </svg>
  )
}

/**
 * A number that runs down to its final value the first time it is seen —
 * the drop from a month to a week is the whole argument of the section, so
 * it is worth showing rather than stating. Runs once; reduced motion gets
 * the final number immediately.
 */
function Counter({ from, to }: { from: number; to: string }) {
  const [n, setN] = useState<string>(String(from))
  const [el, setEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!el) return
    const target = Number(to)
    if (!Number.isFinite(target)) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    let raf = 0
    let done = false
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done) return
        done = true
        io.disconnect()
        const start = performance.now()
        const DUR = 1100
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DUR)
          // Fast at first, settling on the last few — a countdown that eases
          // out reads as a result, not as a slot machine.
          const e = 1 - Math.pow(1 - t, 3)
          setN(String(Math.round(from + (target - from) * e)))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [el, from, to])

  return (
    <div className="v count" ref={setEl}>
      {n}
    </div>
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
 * One price grid. Every commercial block on the page is the same shape — a
 * heading, one or two groups, and cards — so they are one component rather
 * than four near-copies: a change to how a price reads has to land on all of
 * them at once or the page stops looking like one offer.
 */
/**
 * How much of a block's price list the page actually shows.
 *
 * Twenty-two priced cards across five grids read as a lottery ticket, not as an
 * offer: past about half a dozen options a buyer stops choosing and starts
 * leaving. Nothing is deleted to fix that — every package, every line and all
 * three languages stay in `offer.ts`, because they are what gets quoted when
 * somebody asks. This only decides what meets a first-time visitor.
 *
 * `packs: 0` shows the section and what it is for, and no prices at all. That
 * is deliberate for the agency system and for travel: one is a different trade
 * from filming a villa, the other is a line on a quote, and neither earns a
 * grid of its own on the way past.
 *
 * Put a number back and the cards return — that is the whole revert.
 */
type Shown = { groups?: number; packs?: number }

function Packs({
  block,
  vat,
  cta,
  shown,
}: {
  block: Block
  vat: string
  cta: string
  shown?: Shown
}) {
  const groups = block.groups
    .slice(0, shown?.groups ?? block.groups.length)
    .map((g) => ({ ...g, packs: g.packs.slice(0, shown?.packs ?? g.packs.length) }))
    .filter((g) => g.packs.length)
  return (
    <>
      <div className="eyebrow rv">
        <i />
        {block.eyebrow}
      </div>
      <h2 className="rv">
        {block.title[0]}
        <br />
        {block.title[1]}
      </h2>
      <p className="lede rv">{block.lede}</p>
      {groups.map((g, gi) => (
        <div className="group rv" key={g.title}>
          <div className="gtitle">
            <span className="bar" />
            {g.title}
          </div>
          <div className="packs">
            {g.packs.map((pk, pi) => (
              <div
                className={pk.note ? 'pack on' : 'pack'}
                key={pk.n}
                /* A price list on a flat panel reads as a spreadsheet. Each card
                   carries a property behind its head instead, dimmed to the
                   card's own colour before the first line of type — the work
                   stills are already on the page, so nothing extra is fetched.
                   The index counts straight through the groups rather than
                   restarting in each one: the cycle then uses every shot and
                   still cannot repeat on two cards in a row, including across
                   the seam between one group and the next. */
                style={
                  {
                    '--shot': `url(${
                      WORK_MEDIA[
                        (groups
                          .slice(0, gi)
                          .reduce((n, prev) => n + prev.packs.length, 0) +
                          pi) %
                          WORK_MEDIA.length
                      ].img
                    })`,
                  } as CSSProperties
                }
              >
                {pk.note ? <span className="tag">{pk.note}</span> : null}
                <div className="pn">{pk.n}</div>
                <div className="pt">{pk.t}</div>
                <div className="pc">{pk.count}</div>
                <div className="pp">
                  {(() => {
                    const { pre, amount, post } = splitPrice(pk.price)
                    return (
                      <>
                        {pre ? <span className="ppre">{pre}</span> : null}
                        <span className="pamt">{amount}</span>
                        {post ? <span className="pper">{post}</span> : null}
                      </>
                    )
                  })()}
                </div>
                <ul className="pl">
                  {pk.rows.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {pk.foot ? <div className="pf">{pk.foot}</div> : null}
                <a className="pcta" href="#contact">
                  {cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
      {groups.length ? <div className="vat rv">{vat}</div> : null}
    </>
  )
}

/**
 * The enquiry form.
 *
 * Netlify catches the POST itself — there is no backend and nothing to keep
 * running. The price of that is a static copy of the form in `index.html`,
 * which is what Netlify actually reads at deploy time; this one is the React
 * version the visitor sees. If a field is added here it has to be added there
 * too, or the value silently never arrives.
 *
 * On localhost there is nothing to POST to, so in dev the send is treated as
 * successful and the thank-you still shows — the flow can be checked without
 * deploying. In production the opposite rule holds: `fetch` does NOT reject on
 * a 404 or a 500, so the response is checked explicitly. A failed send must
 * never be acknowledged, or the enquiry is lost with nobody the wiser.
 */
function Enquiry({ c }: { c: Copy }) {
  const [sent, setSent] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [f, setF] = useState({ name: '', company: '', object: '', when: '' })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSent('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'enquiry', ...f }).toString(),
      })
      /* There is no form handler in front of `vite dev`, so the 404 it returns
         is the expected answer and not a failure worth showing. */
      if (!res.ok && !import.meta.env.DEV) {
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
      <div className="formdone rv">
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
        <input
          name="name"
          required
          placeholder={c.form.name}
          value={f.name}
          onChange={set('name')}
        />
        <input
          name="company"
          placeholder={c.form.company}
          value={f.company}
          onChange={set('company')}
        />
      </div>
      <input
        name="object"
        required
        placeholder={c.form.object}
        value={f.object}
        onChange={set('object')}
      />
      <input
        name="when"
        placeholder={c.form.when}
        value={f.when}
        onChange={set('when')}
      />
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
 * Nothing heavy loads until it is asked for: posters on the page, a four-second
 * silent preview on hover, and the film itself only when it is opened.
 */
function Films({ lang }: { lang: Lang }) {
  const t = FILMS_COPY[lang]
  const [kind, setKind] = useState<Kind | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)
  const list = FILMS.filter((x) => kind === 'all' || x.kind === kind)
  const kinds = (['villas', 'fpv', 'agents', 'build', 'ai'] as Kind[]).filter((k) =>
    FILMS.some((x) => x.kind === k),
  )

  const film = open === null ? null : list[open]

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
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

  const hover = (on: boolean) => (e: { currentTarget: HTMLElement }) => {
    const v = e.currentTarget.querySelector('video')
    if (!v) return
    if (on) void v.play().catch(() => {})
    else {
      v.pause()
      v.currentTime = 0
    }
  }

  return (
    <>
      <div className="eyebrow rv">
        <i />
        {t.eyebrow}
      </div>
      <h2 className="rv">
        {t.title[0]}
        <br />
        {t.title[1]}
      </h2>
      <p className="lede rv">{t.lede}</p>

      <div className="ftabs rv" role="tablist">
        {(['all', ...kinds] as (Kind | 'all')[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
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
      <div className="filmswrap rv hpin" data-pin-speed="2.6">
      <div className="hstage">
      <div className="films">
        {list.map((x, i) => (
          <button
            key={x.id}
            type="button"
            className={x.vertical ? 'film v' : 'film h'}
            onClick={() => setOpen(i)}
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
            aria-label={`${x.title} — ${t.lines[x.id]}`}
          >
            <img
              src={filmPoster(x.id)}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.hidden = true
              }}
            />
            <video muted loop playsInline preload="none" aria-hidden="true">
              <source src={filmPreview(x.id)} type="video/mp4" />
            </video>
            <span className="fplay" aria-hidden="true" />
            <span className="fbadges">
              <span>{fmtTime(x.duration)}</span>
              <span>{x.vertical ? '9:16' : '16:9'}</span>
            </span>
            <span className="fmeta">
              <span className="fk">{t.kinds[x.kind]}</span>
              <span className="ft">{x.title}</span>
              <span className="fl">{t.lines[x.id]}</span>
            </span>
          </button>
        ))}
      </div>
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
            />
            <div className="pcap">
              <span className="fk">{t.kinds[film.kind]}</span>
              <span className="ft">{film.title}</span>
              <span className="fl">
                {t.lines[film.id]}, {fmtTime(film.duration)}
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
  useEffect(() => createField(), [])

  const [lang, setLang] = useState<Lang>(initialLang)
  const c = COPY[lang]
  const o = OFFER[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('stoari.lang', lang)
    } catch {
      /* private mode */
    }
  }, [lang])

  /**
   * Six cards means six clips. Letting all of them autoplay costs a phone six
   * simultaneous decodes and six downloads of video nobody is looking at, so
   * a clip only runs while its card is actually on screen.
   */
  useEffect(() => {
    const clips = Array.from(
      document.querySelectorAll<HTMLVideoElement>('.work video'),
    )
    if (!clips.length) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement
          if (e.isIntersecting) void v.play().catch(() => {})
          else v.pause()
        }),
      { threshold: 0.25 },
    )
    clips.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [lang])

  /**
   * A project opens over the page rather than on its own route: the field
   * renderer owns a single continuous scroll, and routing away from it would
   * mean tearing down and rebuilding the canvas on every click.
   */
  /**
   * The work row, driven sideways by the page scrolling down.
   *
   * The shape is the standard one: a tall outer element, a stage stuck to the
   * top of the viewport for as long as that element passes through it, and a
   * track inside the stage moved with a transform. The outer height is set to
   * the viewport plus exactly the distance the track has to travel, so one
   * pixel of page scroll is one pixel sideways and the row neither races the
   * scroll nor lags behind it.
   *
   * Three things this deliberately does NOT do:
   *
   * - It does not run under `prefers-reduced-motion`. Tying the viewport to a
   *   transform is the exact thing that setting is for.
   * - It does not run on a narrow screen. A finger already swipes the row
   *   natively there, and pinning would take the page scroll away from it.
   * - It does not hijack the wheel. Nothing calls preventDefault, so the page
   *   keeps its own scrolling, its momentum and its scrollbar; the row simply
   *   reads the position. A visitor who wants past it scrolls, as usual.
   *
   * In every case it falls back to the row this replaced, which scrolls
   * sideways on its own and is perfectly usable.
   */
  useEffect(() => {
    const pins = Array.from(document.querySelectorAll<HTMLElement>('.hpin'))
    if (!pins.length) return

    const narrow = matchMedia('(max-width: 820px)')
    const still = matchMedia('(prefers-reduced-motion: reduce)')

    const rigs = pins.map((pin) => {
      const stage = pin.querySelector<HTMLElement>('.hstage')
      const track = stage?.firstElementChild as HTMLElement | null
      /* 1 means a pixel of page scroll is a pixel sideways. The film strip is
         five thousand pixels long and at 1 it would hold the page for five
         screens, so it is given a multiplier and travels faster than the
         scroll that drives it. */
      const speed = Number(pin.dataset.pinSpeed || 1)
      return { pin, stage, track, speed, distance: 0, stuck: 0 }
    })

    let frame = 0

    const draw = () => {
      frame = 0
      for (const r of rigs) {
        if (!r.distance || !r.track) continue
        /* The stage is not the height of the screen — it is the height of the
           row, stuck at the offset that centres it. Progress is measured from
           the point where it starts sticking, not from the top of the
           viewport, or the row would begin moving before it is even still. */
        const span = r.distance / r.speed
        const past = r.stuck - r.pin.getBoundingClientRect().top
        const p = Math.min(1, Math.max(0, past / span))
        r.track.style.transform = `translate3d(${-p * r.distance}px,0,0)`
      }
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const measure = () => {
      /* 100vw counts the scrollbar and would push the page sideways; the
         documentElement's client width does not. */
      document.documentElement.style.setProperty(
        '--bleed-w',
        `${document.documentElement.clientWidth}px`,
      )
      const on = !narrow.matches && !still.matches
      for (const r of rigs) {
        r.pin.classList.toggle('on', on)
        if (!on || !r.stage || !r.track) {
          r.distance = 0
          r.stuck = 0
          r.pin.style.height = ''
          if (r.stage) r.stage.style.top = ''
          if (r.track) r.track.style.transform = ''
          continue
        }
        r.distance = Math.max(0, r.track.offsetWidth - r.stage.clientWidth)
        /* A row 320px tall centred inside 100svh leaves a third of a screen
           empty above it and a third below. The stage is the height of its own
           content instead, and the sticky offset is what centres it. */
        r.stuck = Math.max(0, Math.round((innerHeight - r.stage.offsetHeight) / 2))
        r.stage.style.top = `${r.stuck}px`
        r.pin.style.height = `${r.stage.offsetHeight + r.distance / r.speed}px`
      }
      draw()
    }

    /* The film strip is filtered in place, so its length changes without a
       resize and without a re-render of this effect. Watching the track covers
       that, and late web fonts, and anything else that moves it. */
    const ro = new ResizeObserver(() => measure())
    for (const r of rigs) if (r.track) ro.observe(r.track)

    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement
      const r = rigs.find((x) => x.track && x.track.contains(el))
      if (!r || !r.distance || !r.track || !r.stage) return
      const card = el.closest('.work, .film') as HTMLElement | null
      if (!card) return
      const top = r.pin.getBoundingClientRect().top + scrollY - r.stuck
      const span = r.distance / r.speed
      const seen = Math.min(r.distance, Math.max(0, (scrollY - top) * r.speed))
      const w = r.stage.clientWidth
      const left = card.offsetLeft
      const right = left + card.offsetWidth
      let want = seen
      if (left < seen) want = left
      else if (right > seen + w) want = right - w
      if (want === seen) return
      scrollTo({ top: top + Math.min(span, Math.max(0, want / r.speed)) })
    }

    measure()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', measure)
    narrow.addEventListener('change', measure)
    still.addEventListener('change', measure)
    for (const r of rigs) r.track?.addEventListener('focusin', onFocus)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      ro.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', measure)
      narrow.removeEventListener('change', measure)
      still.removeEventListener('change', measure)
      for (const r of rigs) {
        r.track?.removeEventListener('focusin', onFocus)
        r.pin.classList.remove('on')
        r.pin.style.height = ''
        if (r.stage) r.stage.style.top = ''
        if (r.track) r.track.style.transform = ''
      }
    }
  }, [lang])

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
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}hero/hero-poster.jpg)`,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${import.meta.env.BASE_URL}hero/hero-poster.jpg`}
        >
          <source
            src={`${import.meta.env.BASE_URL}hero/hero-15s.mp4`}
            type="video/mp4"
          />
        </video>
      </div>

      <canvas id="gl" />
      <div id="progress" />

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
                onClick={() => setLang(l)}
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

      <main>
        <section
          className={cls(0)}
          data-shape={s[0].shape}
          data-label={c.labels[0]}
        >
          <div className="col">
            <div className="eyebrow rv">
              <i />
              {c.hero.eyebrow}
            </div>
            <h1 className="rv">
              {c.hero.title[0]}
              <br />
              {c.hero.title[1]}
            </h1>
            <p className="lede rv">{c.hero.lede}</p>
            <div className="audience rv">{c.hero.audience}</div>
            {/* The hero points at the prices, not at the form. A visitor who
                came to find out what this costs should not have to scroll
                past six sections to learn it. */}
            <a className="herocta rv" href="#packages">
              {c.hero.cta}
            </a>
          </div>
          <div className="cue">
            <span className="bar" />
            {c.hero.cue}
          </div>
        </section>

        <section
          id={s[1].id}
          className={cls(1)}
          data-shape={s[1].shape}
          data-label={c.labels[1]}
        >
          <div className={col(1)}>
            <div className="eyebrow rv">
              <i />
              {c.works.eyebrow}
            </div>
            <h2 className="rv">
              {c.works.title[0]}
              <br />
              {c.works.title[1]}
            </h2>
            <p className="lede rv">{c.works.lede}</p>
            <div className="hpin" data-pin-speed="0.55">
              <div className="hstage">
                <div className="works rv">
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
            <Packs block={o.packages} vat={o.vat} cta={c.cta} />
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
            <div className="eyebrow rv">
              <i />
              {c.services.eyebrow}
            </div>
            <h2 className="rv">
              {c.services.title[0]}
              <br />
              {c.services.title[1]}
            </h2>
            <p className="lede rv">{c.services.lede}</p>
            <div className="rule rv" />
            <div className="list rv">
              {c.services.rows.map((r) => (
                <div
                  className="row"
                  key={r.n}
                  style={
                    { '--shot': `url(${SERVICE_SHOT[r.n]})` } as CSSProperties
                  }
                >
                  <span className="n">{r.n}</span>
                  <span className="t">{r.t}</span>
                  <span className="d">{r.d}</span>
                </div>
              ))}
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
            <Packs block={o.program} vat={o.vat} cta={c.cta} shown={{ groups: 1, packs: 3 }} />
          </div>
        </section>

        <section
          id={s[6].id}
          className={cls(6)}
          data-shape={s[6].shape}
          data-label={c.labels[6]}
        >
          <div className={col(6)}>
            <Packs block={o.project} vat={o.vat} cta={c.cta} shown={{ packs: 3 }} />
            <div className="passes rv">
              <div className="gtitle">
                <span className="bar" />
                {c.method.eyebrow}
              </div>
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
          id={s[7].id}
          className={cls(7)}
          data-shape={s[7].shape}
          data-label={c.labels[7]}
        >
          <div className={col(7)}>
            <div className="eyebrow rv">
              <i />
              {o.how.eyebrow}
            </div>
            <h2 className="rv">
              {o.how.title[0]}
              <br />
              {o.how.title[1]}
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
          id={s[8].id}
          className={cls(8)}
          data-shape={s[8].shape}
          data-label={c.labels[8]}
        >
          <div className={col(8)}>
            <div className="eyebrow rv">
              <i />
              {c.why.eyebrow}
            </div>
            <h2 className="rv">
              {c.why.title[0]}
              <br />
              {c.why.title[1]}
            </h2>
            <p className="lede rv">{c.why.lede}</p>
            <div className="stats rv">
              {c.why.stats.map((st) => (
                <div className="stat" key={st.k}>
                  {st.from === undefined ? (
                    <div className="v">{st.v}</div>
                  ) : (
                    <Counter from={st.from} to={st.v} />
                  )}
                  <div className="k">{st.k}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id={s[9].id}
          className={cls(9)}
          data-shape={s[9].shape}
          data-label={c.labels[9]}
        >
          <div className={col(9)}>
            <div className="eyebrow rv">
              <i />
              {o.faq.eyebrow}
            </div>
            <h2 className="rv">
              {o.faq.title[0]}
              <br />
              {o.faq.title[1]}
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
          id={s[10].id}
          className={cls(10)}
          data-shape={s[10].shape}
          data-label={c.labels[10]}
        >
          <div className={col(10)}>
            <div className="eyebrow rv">
              <i />
              {c.contact.eyebrow}
            </div>
            <h2 className="rv">
              {c.contact.title[0]}
              <br />
              {c.contact.title[1]}
            </h2>
            {/* Dated offer — see the note in content.ts. Remove all three
                language blocks once the date has passed. */}
            <div className="offer rv">
              <div className="oh">{c.contact.offer.headline}</div>
              <p className="od">{c.contact.offer.detail}</p>
            </div>
            <div className="formhead rv">
              <h3>
                {c.form.title[0]}
                <br />
                {c.form.title[1]}
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

      <a className={past ? 'stickycta on' : 'stickycta'} href="#contact">
        {c.stickyCta}
      </a>

      <div id="counter">
        <b id="cNow">01</b> / {String(s.length).padStart(2, '0')}&nbsp;&nbsp;
        <span id="cLabel">{c.labels[0]}</span>
      </div>

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
              <div className="eyebrow">
                <i />
                {project.s}
              </div>
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

      <div id="loader">
        <div>{BRAND.name}</div>
        <div id="bar">
          <div id="barIn" />
        </div>
        <div id="pct">0%</div>
      </div>
    </>
  )
}
