import type { Lang } from './content'

/**
 * Full films. The work section above shows three seconds on a loop and stays
 * as it is — those are presentation pieces and are not to be touched. This is
 * the other half: every film whole, with sound, sorted by direction.
 *
 * Directions come straight from how the originals are filed in
 * `EldarLending/videos`: villa shoots, FPV, agents, AI construction, AI films.
 *
 * Web versions are made by `scratchpad/encode_films.py` from the originals:
 * vertical films at 720×1280 (they are watched to the height of the screen),
 * horizontal ones at 1080p (they are watched to its width), each with a poster
 * and a four-second silent preview for the card. The originals are 60–525 MB
 * and must never be put on the site as they are.
 */

export type Kind = 'villas' | 'fpv' | 'agents' | 'build' | 'ai'

export type Film = {
  id: string
  kind: Kind
  vertical: boolean
  /** Seconds, for the badge on the card. */
  duration: number
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
export const filmSrc = (id: string) => f(`${id}.mp4`)
export const filmPoster = (id: string) => f(`${id}.webp`)
export const filmPreview = (id: string) => f(`${id}-preview.mp4`)

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
}

export const FILMS_COPY: Record<Lang, FilmsCopy> = {
  en: {
    eyebrow: '03 — FILMS',
    title: ['Watch them', 'from start to finish.'],
    lede: 'The work above is three seconds on a loop. Here every film plays whole, with sound — villas shot on the day, FPV flights, agents, construction shown before it begins, and films made entirely with AI.',
    all: 'All',
    kinds: {
      villas: 'Villas',
      fpv: 'FPV',
      agents: 'Agents',
      build: 'Before it is built',
      ai: 'AI films',
    },
    lines: {
      'villa-alfa-tour': 'The full tour, three minutes',
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
  },
  es: {
    eyebrow: '03 — PELÍCULAS',
    title: ['Míralas', 'de principio a fin.'],
    lede: 'Los trabajos de arriba son tres segundos en bucle. Aquí cada película se ve entera y con sonido: villas grabadas en el día, vuelos FPV, agentes, obras enseñadas antes de empezar y películas hechas por completo con IA.',
    all: 'Todo',
    kinds: {
      villas: 'Villas',
      fpv: 'FPV',
      agents: 'Agentes',
      build: 'Antes de construir',
      ai: 'Cine IA',
    },
    lines: {
      'villa-alfa-tour': 'El recorrido completo, tres minutos',
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
  },
  ru: {
    eyebrow: '03 — ФИЛЬМЫ',
    title: ['Смотрите', 'целиком.'],
    lede: 'Работы выше — три секунды на повторе. Здесь каждый фильм идёт полностью и со звуком: виллы, снятые в день съёмки, полёты FPV, агенты, стройка, показанная до её начала, и фильмы, сделанные целиком на ИИ.',
    all: 'Все',
    kinds: {
      villas: 'Виллы',
      fpv: 'FPV',
      agents: 'Агенты',
      build: 'До стройки',
      ai: 'ИИ-кино',
    },
    lines: {
      'villa-alfa-tour': 'Полный тур, три минуты',
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
  },
}
