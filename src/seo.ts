import type { Lang } from './content'

const meta = {
  en: { title: 'STOARI | Property Video & Photography in Marbella', description: 'Property films, professional photography, drone and social media for estate agents and developers in Marbella and the Costa del Sol.', locale: 'en_GB' },
  es: { title: 'STOARI | Vídeo y fotografía inmobiliaria en Marbella', description: 'Vídeo inmobiliario, fotografía profesional, dron y redes sociales para inmobiliarias y promotores en Marbella y la Costa del Sol.', locale: 'es_ES' },
  ru: { title: 'STOARI | Видео и фотосъёмка недвижимости в Марбелье', description: 'Видео недвижимости, профессиональная фотография, дрон и соцсети для агентств и застройщиков в Марбелье и на Коста-дель-Соль.', locale: 'ru_RU' },
}

export function updateMetadata(lang: Lang) {
  const m = meta[lang]
  document.title = m.title
  const set = (selector: string, value: string) => document.querySelector(selector)?.setAttribute('content', value)
  set('meta[name="description"]', m.description)
  set('meta[property="og:title"]', m.title)
  set('meta[property="og:description"]', m.description)
  set('meta[property="og:locale"]', m.locale)
  set('meta[name="twitter:title"]', m.title)
  set('meta[name="twitter:description"]', m.description)
}
