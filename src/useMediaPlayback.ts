import { useEffect } from 'react'

export function useMediaPlayback(language: string, heroVariant: string) {
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)')
    const clips = [...document.querySelectorAll<HTMLVideoElement>('.heroclip video, .work video')]
    const visible = new Set<HTMLVideoElement>()
    const sync = () => {
      for (const video of clips) {
        if (!still.matches && !document.hidden && visible.has(video)) void video.play().catch(() => {})
        else video.pause()
      }
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting) visible.add(video)
        else visible.delete(video)
      }
      sync()
    }, { threshold: 0.2 })
    clips.forEach((clip) => observer.observe(clip))
    still.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      observer.disconnect()
      still.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      clips.forEach((clip) => clip.pause())
    }
  }, [language, heroVariant])
}
