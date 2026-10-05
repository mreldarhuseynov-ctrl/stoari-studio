import { useEffect } from 'react'
import { cardOffset, galleryOffset } from './galleryGeometry'

/** Native page scroll moves each rail; wheel and touch gestures stay native. */
export function useHorizontalGalleries(language: string) {
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)')
    const rigs = [...document.querySelectorAll<HTMLElement>('.hpin')].map((pin) => ({
      pin,
      stage: pin.querySelector<HTMLElement>('.hstage')!,
      track: pin.querySelector<HTMLElement>('.gallery-track')!,
      speed: Number(pin.dataset.pinSpeed || 1),
      distance: 0,
      stickyTop: 0,
      offset: 0,
    })).filter((r) => r.stage && r.track)
    let frame = 0
    let resizeFrame = 0
    let measuring = false

    const draw = () => {
      frame = 0
      for (const r of rigs) {
        if (r.distance) {
          r.offset = galleryOffset(r.pin.getBoundingClientRect().top, r.stickyTop, r.distance, r.speed)
          r.track.style.transform = `translate3d(${-r.offset}px,0,0)`
        } else r.offset = r.track.scrollLeft
        const end = r.distance || Math.max(0, r.track.scrollWidth - r.track.clientWidth)
        const prev = r.pin.querySelector<HTMLButtonElement>('[data-gallery-prev]')
        const next = r.pin.querySelector<HTMLButtonElement>('[data-gallery-next]')
        if (prev) prev.disabled = r.offset < 2
        if (next) next.disabled = r.offset >= end - 2
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw) }

    const measure = () => {
      if (measuring) return
      measuring = true
      document.documentElement.style.setProperty('--bleed-w', `${document.documentElement.clientWidth}px`)
      for (const r of rigs) {
        r.pin.classList.toggle('on', !still.matches)
        r.track.style.transform = ''
        r.distance = still.matches ? 0 : Math.max(0, r.track.scrollWidth - r.stage.clientWidth)
        // In a very short landscape viewport, keep captions and controls reachable.
        if (r.stage.offsetHeight > innerHeight - 104) {
          r.pin.classList.remove('on')
          r.distance = 0
        }
        r.stickyTop = Math.max(88, Math.round((innerHeight - r.stage.offsetHeight) / 2))
        r.stage.style.top = r.distance ? `${r.stickyTop}px` : ''
        r.pin.style.height = r.distance ? `${r.stage.offsetHeight + r.distance / r.speed}px` : ''
        if (r.distance) r.track.scrollLeft = 0
      }
      measuring = false
      draw()
    }

    const navigate = (r: typeof rigs[number], offset: number) => {
      if (!r.distance) {
        r.track.scrollTo({ left: offset, behavior: still.matches ? 'instant' : 'smooth' })
        return
      }
      const start = r.pin.getBoundingClientRect().top + scrollY - r.stickyTop
      scrollTo({ top: start + Math.min(r.distance, Math.max(0, offset)) / r.speed, behavior: 'instant' })
    }
    const onClick = (e: Event) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>('[data-gallery-prev], [data-gallery-next]')
      const r = rigs.find((x) => button && x.pin.contains(button))
      if (!r || !button) return
      const cards = [...r.track.children] as HTMLElement[]
      const end = r.distance || Math.max(0, r.track.scrollWidth - r.track.clientWidth)
      const targets = cards.map((card) => cardOffset(card.offsetLeft, card.offsetWidth, r.stage.clientWidth, end))
      const next = button.hasAttribute('data-gallery-next')
      const target = next
        ? targets.find((x) => x > r.offset + 4) ?? end
        : targets.findLast((x) => x < r.offset - 4) ?? 0
      navigate(r, target)
    }
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.work, .film')
      const r = rigs.find((x) => card && x.track.contains(card))
      if (!r || !card || !r.distance) return
      if (card.offsetLeft < r.offset || card.offsetLeft + card.offsetWidth > r.offset + r.stage.clientWidth) {
        navigate(r, cardOffset(card.offsetLeft, card.offsetWidth, r.stage.clientWidth, r.distance))
      }
    }
    const requestMeasure = () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0
        measure()
      })
    }
    const resize = new ResizeObserver(requestMeasure)
    const mutations = new MutationObserver(requestMeasure)
    for (const r of rigs) {
      resize.observe(r.track)
      resize.observe(r.stage)
      mutations.observe(r.track, { childList: true })
      r.pin.addEventListener('click', onClick)
      r.track.addEventListener('focusin', onFocus)
      r.track.addEventListener('scroll', onScroll, { passive: true })
    }
    measure()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', requestMeasure)
    still.addEventListener('change', measure)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      resize.disconnect()
      mutations.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', requestMeasure)
      still.removeEventListener('change', measure)
      for (const r of rigs) {
        r.pin.removeEventListener('click', onClick)
        r.track.removeEventListener('focusin', onFocus)
        r.track.removeEventListener('scroll', onScroll)
        r.pin.classList.remove('on')
        r.pin.style.height = ''
        r.stage.style.top = ''
        r.track.style.transform = ''
      }
    }
  }, [language])
}
