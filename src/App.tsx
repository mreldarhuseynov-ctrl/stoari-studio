import { useEffect, useState, type FormEvent } from 'react'

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
function Packs({
  block,
  vat,
  cta,
}: {
  block: Block
  vat: string
  cta: string
}) {
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
      {block.groups.map((g) => (
        <div className="group rv" key={g.title}>
          <div className="gtitle">
            <span className="bar" />
            {g.title}
          </div>
          <div className="packs">
            {g.packs.map((pk) => (
              <div className={pk.note ? 'pack on' : 'pack'} key={pk.n}>
                {pk.note ? <span className="tag">{pk.note}</span> : null}
                <div className="pn">{pk.n}</div>
                <div className="pt">{pk.t}</div>
                <div className="pc">{pk.count}</div>
                <div className="pp">{pk.price}</div>
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
      <div className="vat rv">{vat}</div>
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
 * On localhost the POST 404s, which is expected and swallowed: the form still
 * shows its thank-you so the flow can be checked without deploying.
 */
function Enquiry({ c }: { c: Copy }) {
  const [sent, setSent] = useState<'idle' | 'sending' | 'done'>('idle')
  const [f, setF] = useState({ name: '', company: '', object: '', when: '' })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSent('sending')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'enquiry', ...f }).toString(),
      })
    } catch {
      /* offline, or the dev server — the enquiry still gets acknowledged and
         the visitor is offered WhatsApp, which is the faster route anyway */
    }
    setSent('done')
  }

  /* Whatever they typed travels into the WhatsApp draft, so a visitor who
     prefers to carry on there does not have to say it twice. */
  const draft = [f.name, f.company, f.object, f.when].filter(Boolean).join(' · ')
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    draft || c.contact.waText,
  )}`

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
      <p className="fnote">{c.form.note}</p>
    </form>
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
      <div className="heroclip" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-poster.jpg"
        >
          <source src="/hero/hero-15s.mp4" type="video/mp4" />
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
                <div className="row" key={r.n}>
                  <span className="n">{r.n}</span>
                  <span className="t">{r.t}</span>
                  <span className="d">{r.d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id={s[4].id}
          className={cls(4)}
          data-shape={s[4].shape}
          data-label={c.labels[4]}
        >
          <div className={col(4)}>
            <Packs block={o.program} vat={o.vat} cta={c.cta} />
          </div>
        </section>

        <section
          id={s[5].id}
          className={cls(5)}
          data-shape={s[5].shape}
          data-label={c.labels[5]}
        >
          <div className={col(5)}>
            <Packs block={o.project} vat={o.vat} cta={c.cta} />
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
          id={s[6].id}
          className={cls(6)}
          data-shape={s[6].shape}
          data-label={c.labels[6]}
        >
          <div className={col(6)}>
            <Packs block={o.funnel} vat={o.vat} cta={c.cta} />
          </div>
        </section>

        <section
          id={s[7].id}
          className={cls(7)}
          data-shape={s[7].shape}
          data-label={c.labels[7]}
        >
          <div className={col(7)}>
            <Packs block={o.travel} vat={o.vat} cta={c.cta} />
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
          id={s[9].id}
          className={cls(9)}
          data-shape={s[9].shape}
          data-label={c.labels[9]}
        >
          <div className={col(9)}>
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
          id={s[10].id}
          className={cls(10)}
          data-shape={s[10].shape}
          data-label={c.labels[10]}
        >
          <div className={col(10)}>
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
          id={s[11].id}
          className={cls(11)}
          data-shape={s[11].shape}
          data-label={c.labels[11]}
        >
          <div className={col(11)}>
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
                WHATSAPP · {BRAND.whatsappLabel}
              </a>
              <a
                className="wa"
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
              >
                INSTAGRAM · {BRAND.instagramLabel}
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
        <b id="cNow">01</b> / {String(s.length).padStart(2, '0')}&nbsp;·&nbsp;
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
