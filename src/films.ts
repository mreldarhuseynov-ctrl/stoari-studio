import type { Lang } from './content'

/**
 * Film catalogue. Cards and the player share the same web export, without a
 * playback time limit. All 15 full web exports were verified on 6 October 2026.
 * Badges read the actual media duration; the expected catalogue durations
 * below also let packaging reject accidentally restored excerpts.
 * See docs/film-exports.md for the authenticated release download.
 */

export type Kind = 'villas' | 'fpv' | 'agents' | 'build' | 'ai'

export type Film = {
  id: string
  kind: Kind
  vertical: boolean
  /** Expected full-export duration; badges use actual media metadata. */
  duration: number
  /** Explicit for supplied excerpts, including before media metadata loads. */
  excerpt?: boolean
  /** Proper name — the same in every language. */
  title: string
}

export const FILMS: Film[] = [
  { id: 'villa-alfa-tour', kind: 'villas', vertical: false, duration: 180, title: 'Villa Alfa' },
  { id: 'cin-lento', kind: 'villas', vertical: true, duration: 58, title: 'Cin Lento' },
  { id: 'villa-alfa-agent', kind: 'villas', vertical: true, duration: 49, title: 'Villa Alfa' },
  { id: 'villa-hd', kind: 'villas', vertical: false, duration: 54, title: 'Villa' },
  { id: 'villa-alfa-detail', kind: 'villas', vertical: true, duration: 38, title: 'Villa Alfa' },
  { id: 'villa-alfa-short', kind: 'villas', vertical: true, duration: 29, title: 'Villa Alfa' },
  { id: 'fpv-villa', kind: 'fpv', vertical: false, duration: 77, title: 'FPV Villa' },
  { id: 'ultimo-llamada', kind: 'fpv', vertical: true, duration: 56, title: 'Última llamada' },
  { id: 'ignazio', kind: 'agents', vertical: true, duration: 20, title: 'Ignazio' },
  { id: 'madronal', kind: 'build', vertical: true, duration: 44, title: 'Madronal' },
  { id: 'project-3', kind: 'build', vertical: false, duration: 47, title: 'Project 3.0' },
  { id: 'mr-eh', kind: 'build', vertical: false, duration: 90, title: 'By Mr. E.H.' },
  { id: 'toro-negro', kind: 'ai', vertical: true, duration: 31, title: 'El Toro Negro' },
  { id: 'puerto-banus', kind: 'ai', vertical: true, duration: 34, title: 'Puerto Banús' },
  { id: 'zaceni-balam', kind: 'ai', vertical: true, duration: 35, title: 'Zaceni Balam' },
]

/** Same base-URL rule as the work cards: nothing on this site starts with `/`. */
const f = (file: string) => `${import.meta.env.BASE_URL}films/${file}`
// A new URL also replaces the old 15-second files in returning visitors' caches.
export const filmSrc = (id: string) => f(`${id}.mp4?v=full-20261006`)
export const filmPoster = (id: string) => f(`${id}.webp`)

export const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

type FilmsCopy = {
  eyebrow: string
  title: [string, string]
  lede: string
  all: string
  kinds: Record<Kind, string>
  /** One line under each title, by film id. */
  lines: Record<string, string>
  close: string
  prev: string
  next: string
  excerpt: string
}

export const FILMS_COPY: Record<Lang, FilmsCopy> = {
  en: {
    eyebrow: '03 — FILMS',
    title: ['The films', ''],
    lede: 'Property tours, FPV flights and films with agents. Open a video for sound and playback controls. Concept films are generated digitally with AI.',
    all: 'All',
    kinds: {
      villas: 'Villas',
      fpv: 'FPV',
      agents: 'Agents',
      build: 'Before it is built',
      ai: 'Concept films',
    },
    lines: {
      'villa-alfa-tour': 'The property tour',
      'cin-lento': 'Slow cinema',
      'villa-alfa-agent': 'With the agent',
      'villa-hd': 'Interiors',
      'villa-alfa-detail': 'Details',
      'villa-alfa-short': 'The short cut',
      'fpv-villa': 'One flight through the whole house',
      'ultimo-llamada': 'FPV, vertical',
      ignazio: 'An agent film',
      madronal: 'From the plot to the house',
      'project-3': 'A villa that does not exist yet',
      'mr-eh': 'Handing over the key',
      'toro-negro': 'AI film',
      'puerto-banus': 'AI film',
      'zaceni-balam': 'AI film',
    },
    close: 'CLOSE',
    prev: 'PREVIOUS',
    next: 'NEXT',
    excerpt: 'Extract',
  },
  es: {
    eyebrow: '03 — PELÍCULAS',
    title: ['Los vídeos', ''],
    lede: 'Recorridos de inmuebles, vuelos FPV y vídeos con agentes. Abre un vídeo para activar el sonido y los controles. Los conceptos visuales se generan digitalmente con IA.',
    all: 'Todo',
    kinds: {
      villas: 'Villas',
      fpv: 'FPV',
      agents: 'Agentes',
      build: 'Antes de construir',
      ai: 'Conceptos visuales',
    },
    lines: {
      'villa-alfa-tour': 'El recorrido del inmueble',
      'cin-lento': 'Cine lento',
      'villa-alfa-agent': 'Con el agente',
      'villa-hd': 'Interiores',
      'villa-alfa-detail': 'Detalles',
      'villa-alfa-short': 'La versión corta',
      'fpv-villa': 'Un solo vuelo por toda la casa',
      'ultimo-llamada': 'FPV, en vertical',
      ignazio: 'Vídeo de agente',
      madronal: 'De la parcela a la casa',
      'project-3': 'Una villa que todavía no existe',
      'mr-eh': 'La entrega de llaves',
      'toro-negro': 'Película IA',
      'puerto-banus': 'Película IA',
      'zaceni-balam': 'Película IA',
    },
    close: 'CERRAR',
    prev: 'ANTERIOR',
    next: 'SIGUIENTE',
    excerpt: 'Extracto',
  },
  ru: {
    eyebrow: '03 — ФИЛЬМЫ',
    title: ['Фильмы', ''],
    lede: 'Туры по объектам, FPV-пролёты и видео с агентами. Откройте видео, чтобы включить звук и управление воспроизведением. Концептуальные фильмы созданы с помощью ИИ.',
    all: 'Все',
    kinds: {
      villas: 'Виллы',
      fpv: 'FPV',
      agents: 'Агенты',
      build: 'До стройки',
      ai: 'Концептуальные фильмы',
    },
    lines: {
      'villa-alfa-tour': 'Тур по объекту',
      'cin-lento': 'Медленное кино',
      'villa-alfa-agent': 'С агентом',
      'villa-hd': 'Интерьеры',
      'villa-alfa-detail': 'Детали',
      'villa-alfa-short': 'Короткая версия',
      'fpv-villa': 'Один полёт через весь дом',
      'ultimo-llamada': 'FPV, вертикально',
      ignazio: 'Ролик агента',
      madronal: 'От участка до дома',
      'project-3': 'Вилла, которой ещё нет',
      'mr-eh': 'Передача ключа',
      'toro-negro': 'ИИ-фильм',
      'puerto-banus': 'ИИ-фильм',
      'zaceni-balam': 'ИИ-фильм',
    },
    close: 'ЗАКРЫТЬ',
    prev: 'НАЗАД',
    next: 'ДАЛЬШЕ',
    excerpt: 'Фрагмент',
  },
}
