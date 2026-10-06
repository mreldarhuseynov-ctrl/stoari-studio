import { useEffect } from 'react'

export function useMediaPlayback(
  language: string,
  variant: string,
  selector = '.heroclip video, .work video',
  suspended = false,
) {
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)')
    const clips = [...document.querySelectorAll<HTMLVideoElement>(selector)]
    const visible = new Set<HTMLVideoElement>()
    const sync = () => {
      for (const video of clips) {
        if (!suspended && !still.matches && !document.hidden && visible.has(video)) {
          if (video.paused) void video.play().catch(() => {})
        }
        else video.pause()
      }
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) visible.add(video)
        else visible.delete(video)
      }
      sync()
    }, { threshold: 0.2 })
    clips.forEach((clip) => observer.observe(clip))
    clips.forEach((clip) => clip.addEventListener('canplay', sync))
    still.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('pageshow', sync)
    return () => {
      observer.disconnect()
      clips.forEach((clip) => clip.removeEventListener('canplay', sync))
      still.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('pageshow', sync)
      clips.forEach((clip) => clip.pause())
    }
  }, [language, variant, selector, suspended])
}
