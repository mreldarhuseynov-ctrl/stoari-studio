import { useEffect, useId, useRef, useState } from 'react'
import type { Lang } from './content'
import './mobile-menu.css'

const LABELS: Record<Lang, { open: string; close: string }> = {
  en: { open: 'Open menu', close: 'Close menu' },
  es: { open: 'Abrir menú', close: 'Cerrar menú' },
  ru: { open: 'Открыть меню', close: 'Закрыть меню' },
}

type MobileMenuProps = {
  lang: Lang
  links: readonly { href: string; label: string }[]
  contactLabel: string
}

/** An ordinary navigation disclosure: tab through links, or Escape to close. */
export function MobileMenu({ lang, links, contactLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      trigger.current?.focus()
    }
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false)
    }
    const desktop = matchMedia('(min-width: 821px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', resize)
    }
  }, [open])

  return (
    <div
      className="mobile-menu"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        className="mobile-menu-trigger"
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? LABELS[lang].close : LABELS[lang].open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={open ? 'M6 6 18 18M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
        </svg>
      </button>
      <div className="mobile-menu-panel" id={panelId} hidden={!open}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
            </li>
          ))}
          <li className="mobile-menu-contact">
            <a href="#contact" onClick={() => setOpen(false)}>{contactLabel}</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
