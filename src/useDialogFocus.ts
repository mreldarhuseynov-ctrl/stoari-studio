import { useEffect } from 'react'

export function useDialogFocus(open: boolean, selector: string) {
  useEffect(() => {
    if (!open) return
    const dialog = document.querySelector<HTMLElement>(selector)
    if (!dialog) return
    const origin = document.activeElement as HTMLElement | null
    const controls = () => [...dialog.querySelectorAll<HTMLElement>('button, a[href], input, textarea, video[controls], [tabindex="0"]')]
      .filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0)
    const initial = dialog.querySelector<HTMLElement>('.pclose, .close') || controls()[0]
    initial?.focus({ preventScroll: true })
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = controls()
      if (!list.length) { e.preventDefault(); return }
      const at = list.indexOf(document.activeElement as HTMLElement)
      if (at === -1 || (e.shiftKey && at === 0) || (!e.shiftKey && at === list.length - 1)) {
        e.preventDefault()
        list[e.shiftKey ? list.length - 1 : 0].focus()
      }
    }
    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      if (origin?.isConnected) origin.focus({ preventScroll: true })
    }
  }, [open, selector])
}
