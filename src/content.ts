/**
 * Every string on the page, in every language. Swap this for a CMS query
 * later — nothing else needs to change.
 *
 * NOTE ON CLAIMS: every number and guarantee on this page has to survive the
 * moment a client overlays the image on their plan. The earlier copy promised
 * `1:1 SURVEY ACCURATE`, `8K DELIVERY`, `72h FIRST DRAFT` and geometry "locked
 * to the drawings" — a CAD pipeline the studio does not run. Replaced with what
 * the studio actually does: fast generative work, referenced to the drawings
 * and the real site, delivered vertical. Sell the speed, not a survey.
 *
 * Anything added here must be answerable with "yes, here is the file".
 *
 * ADDING A LANGUAGE: add the code to LANGS, then add one block to COPY with
 * the same shape. Nothing else in the app has to change. Spanish is the
 * obvious next one — the money on this coast is English, Russian and Spanish,
 * in that order.
 */

export const BRAND = {
  name: 'STOARI',
  /**
   * The descriptor. Plain, not clever: it names the business in the words a
   * developer already uses. The name carries the distinctiveness — this only
   * removes the guessing. Kept in one place so the nav, the loader and the
   * particle field cannot drift apart.
   */
  descriptor: 'REAL ESTATE MEDIA',
  email: 'info@stoari.com',
  /** Digits only, country code first — that is the format wa.me expects. */
  whatsapp: '34610826619',
  whatsappLabel: '+34 610 826 619',
  /**
   * The same number again, as something to ring. This coast does business on
   * the phone, and until now the site offered no way to make one: mail and
   * WhatsApp only.
   */
  phone: '+34 610 826 619',
  phoneHref: 'tel:+34610826619',
  /** Clean URL: the igsh/utm parameters on a shared link are QR tracking. */
  instagram: 'https://www.instagram.com/stoaristudio',
  instagramLabel: '@stoaristudio',
  /**
   * The enquiry form collects a name, a company and a property from visitors
   * in Spain, which makes it personal data under the GDPR and the LOPDGDD: it
   * needs a notice at the point of collection saying who holds it and on what
   * basis. Until that page exists this stays empty, and the form prints its
   * one-line notice without a link rather than pointing at a 404.
   */
  privacyUrl: '/privacy/',
} as const

export const LANGS = ['en', 'es', 'ru'] as const
export type Lang = (typeof LANGS)[number]

export type Section = {
  id: string
  rev?: boolean
  hero?: boolean
  /** Full-bleed column: the card grids and the work grid need the width. */
  wide?: boolean
  /** index into SHAPES in field.ts */
  shape: number
}

/**
 * The field's horizontal push per section is NOT set here — it lives in
 * `OFFSETS` in field.ts, indexed by position in this array. Add or reorder a
 * section here and that array has to be updated to match, or the point cloud
 * ends up behind the text.
 */
export const SECTIONS: Section[] = [
  { id: 'index', hero: true, shape: 0 },
  // Work before services: a visual studio is believed by what it has made, not
  // by what it lists. Proof first, offer second.
  { id: 'work', wide: true, shape: 1 },
  // Prices second. A visitor who came to find out what this costs should meet
  // the answer on the third screen, not the fifth.
  { id: 'packages', rev: true, wide: true, shape: 2 },
  // Full films third, right after the prices: a buyer who has just read what
  // it costs wants to see what that money buys, whole and with sound.
  { id: 'films', wide: true, shape: 5 },
  { id: 'services', rev: true, shape: 4 },
  { id: 'how', shape: 4 },
  { id: 'why', rev: true, shape: 5 },
  { id: 'faq', shape: 3 },
  { id: 'contact', rev: true, shape: 0 },
]

/**
 * Sides alternate strictly from `work` to `contact` — left, right, left, right.
 * Eight sections under the hero is an even number, so the alternation lands
 * `contact` on the right without a single repeat.
 *
 * `program` and `project` were removed as a pair, a left and a right, when the
 * old price grids came off the page. Taking them out together is what kept
 * every other section on the side it already had.
 */

/**
 * Media is shared across languages — only the words change. Captions live in
 * COPY and are matched to these frames by position, so the two arrays must
 * stay the same length.
 */
/**
 * Media paths go through the build's base URL rather than starting with `/`.
 * A root-relative path only works when the site is served from the domain root;
 * the moment it is opened anywhere else — a preview link, a subfolder — every
 * image and every clip on the page 404s at once. That is exactly how the work
 * cards went blank on the first preview link.
 */
const w = (file: string) => `${import.meta.env.BASE_URL}works/${file}`

export const WORK_MEDIA = [
  {
    n: '01',
    img: w('01-madronal.webp'),
    clip: w('01-madronal-loop.mp4'),
    frames: [
      w('01-madronal-a.webp'),
      w('01-madronal-b.webp'),
      w('01-madronal-c.webp'),
      w('01-madronal-d.webp'),
    ],
  },
  {
    n: '02',
    img: w('02-alfa.webp'),
    clip: w('02-alfa-loop.mp4'),
    frames: [
      w('02-alfa-a.webp'),
      w('02-alfa-b.webp'),
      w('02-alfa-c.webp'),
      w('02-alfa-d.webp'),
    ],
  },
  {
    n: '03',
    img: w('03-alfa-interiors.webp'),
    clip: w('03-alfa-interiors-loop.mp4'),
    frames: [
      w('03-alfa-interiors-a.webp'),
      w('03-alfa-interiors-b.webp'),
      w('03-alfa-interiors-c.webp'),
      w('03-alfa-interiors-d.webp'),
    ],
  },
  {
    n: '04',
    img: w('04-marina.webp'),
    clip: w('04-marina-loop.mp4'),
    frames: [
      w('04-marina-a.webp'),
      w('04-marina-b.webp'),
      w('04-marina-c.webp'),
      w('04-marina-d.webp'),
    ],
  },
  {
    n: '05',
    img: w('05-yinyang.webp'),
    clip: w('05-yinyang-loop.mp4'),
    frames: [
      w('05-yinyang-a.webp'),
      w('05-yinyang-b.webp'),
      w('05-yinyang-c.webp'),
      w('05-yinyang-d.webp'),
    ],
  },
  {
    n: '06',
    img: w('06-agent.webp'),
    clip: w('06-agent-loop.mp4'),
    frames: [
      w('06-agent-a.webp'),
      w('06-agent-b.webp'),
      w('06-agent-c.webp'),
      w('06-agent-d.webp'),
    ],
  },
]

export type Copy = {
  nav: { label: string; href: string }[]
  cta: string
  /** Sits in the corner from the hero down — one tap to the form, anywhere. */
  stickyCta: string
  labels: string[]
  /**
   * The enquiry form. It did not exist until now, and that was the largest hole
   * in the site: a developer arriving from a cold email could read the prices
   * and then had nothing to press. Four fields and no more — every extra field
   * costs replies.
   */
  form: {
    title: [string, string]
    lede: string
    name: string
    email: string
    company: string
    object: string
    when: string
    submit: string
    sending: string
    note: string
    /** Label for the privacy notice link. Only rendered if BRAND.privacyUrl is set. */
    privacy: string
    done: string
    doneNote: string
    /** Shown when the POST did not actually reach Netlify. */
    failed: string
    failedNote: string
    retry: string
    wa: string
  }
  hero: {
    eyebrow: string
    title: [string, string]
    lede: string
    /** Who this is for and what it starts at — the anchor, right under the title. */
    audience: string
    /** Their move, and it is the right one: the hero points at the prices. */
    cta: string
    cue: string
  }
  services: {
    eyebrow: string
    title: [string, string]
    lede: string
    rows: { n: string; t: string; d: string }[]
  }
  works: {
    eyebrow: string
    title: [string, string]
    lede: string
    more: string
    items: { alt: string; t: string; k: string; s: string; d: string; caps: string[] }[]
  }
  why: {
    eyebrow: string
    title: [string, string]
    lede: string
    /** `from` turns the value into a counter that runs down to `v` in view. */
    stats: { v: string; k: string; from?: number }[]
  }
  method: {
    eyebrow: string
    title: [string, string]
    steps: { sn: string; st: string; sd: string }[]
  }
  contact: {
    eyebrow: string
    title: [string, string]
    meta: string[]
    /** Pre-filled into the WhatsApp draft so the first message is not blank. */
    waText: string
  }
  close: string
}

export const COPY: Record<Lang, Copy> = {
  en: {
    nav: [
      { label: 'WORK', href: '#work' },
      { label: 'PRICES', href: '#packages' },
      { label: 'CRM', href: '#crm' },
      { label: 'QUESTIONS', href: '#faq' },
    ],
    cta: 'START A PROJECT',
    stickyCta: 'SEND A PROPERTY',
    form: {
      title: ['Request a quote', ''],
      lede: 'An address or a link to the listing is enough to start. Photos and drawings can follow.',
      name: 'Your name',
      email: 'Email',
      company: 'Company',
      object: 'The property: address, link, or a line about it',
      when: 'When do you need it',
      submit: 'SEND',
      sending: 'SENDING…',
      note: 'Robert Di Gaetano uses these details to answer your enquiry. Required fields are marked *. Read the privacy notice for recipients, retention and your rights.',
      privacy: 'How we handle your data',
      done: 'Got it.',
      doneNote: 'Your enquiry has been submitted. You can also contact us on WhatsApp.',
      failed: 'That did not send.',
      failedNote: 'Nothing reached us. What you wrote is still in the form below, so try again, or write on WhatsApp, which does not depend on this.',
      retry: 'TRY AGAIN',
      wa: 'CONTINUE ON WHATSAPP',
    },
    labels: ['INDEX', 'WORK', 'PRICES', 'FILMS', 'SERVICES', 'HOW IT WORKS', 'WHY', 'QUESTIONS', 'CONTACT'],
    hero: {
      eyebrow: 'REAL ESTATE MEDIA, COSTA DEL SOL',
      title: ['Make them want it', 'before they see it'],
      lede: 'Film, photography and drone for estate agents and developers on the Costa del Sol.',
      audience: 'For estate agents and developers. Based in Marbella.',
      cta: 'SEE THE PRICES',
      cue: 'SCROLL',
    },
    services: {
      eyebrow: '04 — SERVICES',
      title: ['What we do', ''],
      lede: 'Photography, film and drone footage for your properties. Content for your social media and a CRM to manage enquiries.',
      rows: [
        {
          n: '01',
          t: 'Content & social',
          d: 'Reels, campaigns and Stories, created and published every month.',
        },
        {
          n: '02',
          t: 'Photography',
          d: 'Professional property photography, delivered in five working days.',
        },
        {
          n: '03',
          t: 'Drone & FPV',
          d: 'Aerial views and FPV tours through the property in one flight.',
        },
        {
          n: '04',
          t: 'Visualisation',
          d: 'Images and films of your unbuilt project, made from your plans.',
        },
        {
          n: '05',
          t: 'Agency CRM',
          d: 'Properties, leads and prospecting, with a WhatsApp bot and AI calls.',
        },
      ],
    },
    works: {
      eyebrow: '01 — WORK',
      title: ['Selected projects', ''],
      lede: 'Open one to see the frames and what the client needed from it.',
      more: 'VIEW PROJECT',
      items: [
        {
          alt: 'Villa Madronal — the plot and the visualised house',
          t: 'Villa Madronal',
          k: 'Plot 121, in-house',
          s: 'VISUALISATION',
          d: 'A bare plot filmed from the air, then the house standing on it: one locked shot, from excavation to finished volume.',
          caps: [
            'Setting out, on the pad',
            'Excavation complete',
            'Massing, same camera',
            'Finished volume, evening sun',
          ],
        },
        {
          alt: 'The garage opening at night, the car lit inside',
          t: 'Villa Alfa',
          k: 'Marbella',
          s: 'FILM',
          d: 'A completed residence at dusk and after dark: the garage opening on the car, the stair, the terraces and the approach, all on available light.',
          caps: [
            'The garage opens, car lit inside',
            'Stair, raking light',
            'Terrace at dusk',
            'Approach, last light',
          ],
        },
        {
          alt: 'Villa Alfa — interiors and terraces',
          t: 'Villa Alfa — Interiors',
          k: 'Marbella',
          s: 'FILM',
          d: 'Interior sequence through living space, bedrooms, spa and pool, cut to the daylight the house actually gets.',
          caps: ['Terrace, midday', 'Living space', 'Principal bedroom', 'Indoor pool'],
        },
        {
          alt: 'Puerto Marina from the air at sunset',
          t: 'Puerto Marina',
          k: 'Benalmádena',
          s: 'DRONE / FPV',
          d: 'A marina shown in one unbroken move, down between the moorings, over the roofs and out to the horizon at sunset.',
          caps: [
            'Entry, low over the water',
            'Through the moorings',
            'Over the roofs, sun down',
            'Out to the horizon',
          ],
        },
        {
          alt: 'The project outline drawn over the empty plot at night',
          t: 'Yin Yang',
          k: 'Hacienda Las Chapas, in-house',
          s: 'VISUALISATION',
          d: 'An empty plot, the footprint drawn straight onto it from the air at night, then the finished house room by room.',
          caps: [
            'The plot, nothing on it',
            'Footprint drawn on the land',
            'Interior, one light source',
            'Study, view to the garden',
          ],
        },
        {
          alt: 'An estate agent filmed through a modern villa',
          t: 'Ricardo Ignacio',
          k: 'Marbella',
          s: 'AGENT FILM',
          d: 'A personal film for an estate agent: the agent, the house and the pitch cut into twenty seconds.',
          caps: [
            'Approach, hard midday sun',
            'Through the house',
            'Terrace and pool',
            'The property from the air',
          ],
        },
      ],
    },
    why: {
      eyebrow: '06 — WHY',
      title: ['Ready for your listings', ''],
      lede: 'Vertical for Reels and Stories, landscape for the website, the portals and the sales deck, all from the same shoot. Nothing has to be cut twice.',
      stats: [
        { v: '7', k: 'DAYS TO FIRST LOOK', from: 30 },
        { v: '9:16 + 16:9', k: 'BOTH, FROM THE START' },
        { v: '5', k: 'SERVICES, ONE TEAM' },
      ],
    },
    method: {
      eyebrow: 'FOUR PASSES',
      title: ['Four passes,', 'no guesswork'],
      steps: [
        {
          sn: '01',
          st: 'Intake',
          sd: 'Drawings, survey, site photographs and material schedule are collected before any modelling starts.',
        },
        {
          sn: '02',
          st: 'Massing',
          sd: 'The volume is built against your plans and sent back for sign-off. Nothing downstream moves until you confirm it.',
        },
        {
          sn: '03',
          st: 'Light & material',
          sd: 'Sun position from the real coordinates and orientation of the plot. Finishes matched to your schedule.',
        },
        {
          sn: '04',
          st: 'Delivery',
          sd: 'Stills and film, vertical and landscape, in the formats your sales team already posts.',
        },
      ],
    },
    contact: {
      eyebrow: '08 — CONTACT',
      title: ['Tell us about your property', ''],
      meta: ['ELDAR HUSEYNOV', 'REAL ESTATE MEDIA', 'COSTA DEL SOL'],
      waText: 'Hi Eldar, I found STOARI online. I have a property on the Costa del Sol.',
    },
    close: 'CLOSE',
  },

  es: {
    nav: [
      { label: 'TRABAJOS', href: '#work' },
      { label: 'PRECIOS', href: '#packages' },
      { label: 'CRM', href: '#crm' },
      { label: 'PREGUNTAS', href: '#faq' },
    ],
    cta: 'EMPEZAR UN PROYECTO',
    stickyCta: 'ENVIAR INMUEBLE',
    form: {
      title: ['Pide un presupuesto', ''],
      lede: 'Con una dirección o el enlace al anuncio es suficiente para empezar. Las fotos y los planos pueden venir después.',
      name: 'Su nombre',
      email: 'Email',
      company: 'Empresa',
      object: 'El inmueble: dirección, enlace o una línea sobre él',
      when: 'Para cuándo lo necesita',
      submit: 'ENVIAR',
      sending: 'ENVIANDO…',
      note: 'Robert Di Gaetano utiliza estos datos para responder a tu consulta. Los campos con * son obligatorios. Consulta la política de privacidad para conocer los destinatarios, la conservación y tus derechos.',
      privacy: 'Cómo tratamos sus datos',
      done: 'Recibido.',
      doneNote: 'Tu consulta se ha enviado. También puedes contactarnos por WhatsApp.',
      failed: 'No se ha enviado.',
      failedNote: 'No nos ha llegado nada. Lo que escribió sigue en el formulario: inténtelo otra vez o escríbanos por WhatsApp, que no depende de esto.',
      retry: 'REINTENTAR',
      wa: 'SEGUIR POR WHATSAPP',
    },
    labels: ['INICIO', 'TRABAJOS', 'PRECIOS', 'PELÍCULAS', 'SERVICIOS', 'CÓMO FUNCIONA', 'POR QUÉ', 'PREGUNTAS', 'CONTACTO'],
    hero: {
      eyebrow: 'MARKETING INMOBILIARIO, COSTA DEL SOL',
      title: ['Que lo quieran', 'antes de visitarlo'],
      lede: 'Vídeo, fotografía y dron para inmobiliarias y promotores de la Costa del Sol.',
      audience: 'Para agentes inmobiliarios y promotores. Con base en Marbella.',
      cta: 'VER LOS PRECIOS',
      cue: 'BAJAR',
    },
    services: {
      eyebrow: '04 — SERVICIOS',
      title: ['Nuestros servicios', ''],
      lede: 'Fotografía, vídeo y dron para tus inmuebles. Contenido para tus redes y un CRM para gestionar las consultas.',
      rows: [
        {
          n: '01',
          t: 'Contenido y redes',
          d: 'Reels, campañas y Stories: creación y publicación mensual.',
        },
        {
          n: '02',
          t: 'Fotografía',
          d: 'Fotografía profesional de inmuebles. Entrega en cinco días laborables.',
        },
        {
          n: '03',
          t: 'Dron y FPV',
          d: 'Vistas aéreas y recorridos FPV en un solo vuelo.',
        },
        {
          n: '04',
          t: 'Visualización',
          d: 'Imágenes y vídeo del proyecto a partir de tus planos.',
        },
        {
          n: '05',
          t: 'CRM inmobiliario',
          d: 'Inmuebles, leads y captación, con bot de WhatsApp y llamadas con IA.',
        },
      ],
    },
    works: {
      eyebrow: '01 — TRABAJOS',
      title: ['Proyectos seleccionados', ''],
      lede: 'Abra uno para ver los fotogramas y lo que el cliente necesitaba.',
      more: 'VER PROYECTO',
      items: [
        {
          alt: 'Villa Madronal — la parcela y la casa visualizada',
          t: 'Villa Madronal',
          k: 'Parcela 121, trabajo propio',
          s: 'VISUALIZACIÓN',
          d: 'Una parcela vacía desde el aire y después la casa levantada sobre ella: un solo plano fijo, del vaciado al volumen terminado.',
          caps: [
            'Replanteo sobre la plataforma',
            'Vaciado terminado',
            'Volumen, misma cámara',
            'Casa terminada, sol de tarde',
          ],
        },
        {
          alt: 'El garaje abriéndose de noche con el coche iluminado dentro',
          t: 'Villa Alfa',
          k: 'Marbella',
          s: 'VÍDEO',
          d: 'Una residencia terminada al anochecer y de noche: el garaje abriéndose sobre el coche, la escalera, las terrazas y el acceso, todo con luz disponible.',
          caps: [
            'El garaje abre, coche iluminado',
            'Escalera, luz rasante',
            'Terraza al anochecer',
            'Acceso, última luz',
          ],
        },
        {
          alt: 'Villa Alfa — interiores y terrazas',
          t: 'Villa Alfa — Interiores',
          k: 'Marbella',
          s: 'VÍDEO',
          d: 'Recorrido por salón, dormitorios, spa y piscina, montado sobre la luz que la casa recibe de verdad.',
          caps: ['Terraza, mediodía', 'Salón', 'Dormitorio principal', 'Piscina interior'],
        },
        {
          alt: 'Puerto Marina desde el aire al atardecer',
          t: 'Puerto Marina',
          k: 'Benalmádena',
          s: 'DRON / FPV',
          d: 'Un puerto entero en un solo movimiento, entre los amarres, sobre los tejados y hacia el horizonte al atardecer.',
          caps: [
            'Entrada, bajo sobre el agua',
            'Entre los amarres',
            'Sobre los tejados, sol puesto',
            'Hacia el horizonte',
          ],
        },
        {
          alt: 'El contorno del proyecto dibujado sobre la parcela de noche',
          t: 'Yin Yang',
          k: 'Hacienda Las Chapas, trabajo propio',
          s: 'VISUALIZACIÓN',
          d: 'Una parcela vacía, la huella del edificio dibujada sobre ella desde el aire de noche, y después la casa terminada estancia por estancia.',
          caps: [
            'La parcela, sin nada',
            'La huella sobre el terreno',
            'Interior, una sola fuente de luz',
            'Despacho, vista al jardín',
          ],
        },
        {
          alt: 'Un agente inmobiliario filmado en una villa moderna',
          t: 'Ricardo Ignacio',
          k: 'Marbella',
          s: 'VÍDEO DE AGENTE',
          d: 'Un vídeo personal para un agente inmobiliario: el agente, la casa y su discurso en veinte segundos.',
          caps: [
            'Llegada, sol duro de mediodía',
            'Recorrido por la casa',
            'Terraza y piscina',
            'La propiedad desde el aire',
          ],
        },
      ],
    },
    why: {
      eyebrow: '06 — POR QUÉ',
      title: ['Listo para tus anuncios', ''],
      lede: 'Vertical para Reels y Stories, horizontal para la web, los portales y la presentación de ventas, todo del mismo rodaje. No hay que volver a montar nada.',
      stats: [
        { v: '7', k: 'DÍAS HASTA LA PRIMERA VERSIÓN', from: 30 },
        { v: '9:16 + 16:9', k: 'LOS DOS, DESDE EL PRINCIPIO' },
        { v: '5', k: 'SERVICIOS, UN EQUIPO' },
      ],
    },
    method: {
      eyebrow: 'CUATRO PASADAS',
      title: ['Cuatro pasos,', 'sin suposiciones'],
      steps: [
        {
          sn: '01',
          st: 'Recepción',
          sd: 'Reunimos planos, mediciones, fotos de la parcela y la memoria de calidades. El modelado empieza después de eso.',
        },
        {
          sn: '02',
          st: 'Volumen',
          sd: 'Levantamos el volumen según sus planos y se lo enviamos para aprobación. Hasta que lo confirme, no seguimos.',
        },
        {
          sn: '03',
          st: 'Luz y materiales',
          sd: 'El sol se coloca por las coordenadas y la orientación reales de la parcela. Los acabados, según su memoria.',
        },
        {
          sn: '04',
          st: 'Entrega',
          sd: 'Imágenes y vídeo en vertical y horizontal, en los formatos que su equipo comercial ya publica cada día.',
        },
      ],
    },
    contact: {
      eyebrow: '08 — CONTACTO',
      title: ['Hablemos de tu inmueble', ''],
      meta: ['ELDAR HUSEYNOV', 'CONTENIDO INMOBILIARIO', 'COSTA DEL SOL'],
      waText: 'Hola Eldar, le escribo desde la web de STOARI. Tengo un proyecto en la Costa del Sol.',
    },
    close: 'CERRAR',
  },

  ru: {
    nav: [
      { label: 'РАБОТЫ', href: '#work' },
      { label: 'ЦЕНЫ', href: '#packages' },
      { label: 'CRM', href: '#crm' },
      { label: 'ВОПРОСЫ', href: '#faq' },
    ],
    cta: 'НАЧАТЬ ПРОЕКТ',
    stickyCta: 'ПРИСЛАТЬ ОБЪЕКТ',
    form: {
      title: ['Запросить стоимость', ''],
      lede: 'Для начала достаточно адреса или ссылки на объявление. Фото и чертежи можно прислать потом.',
      name: 'Как вас зовут',
      email: 'Email',
      company: 'Компания',
      object: 'Объект — адрес, ссылка или строка о нём',
      when: 'К какому сроку нужно',
      submit: 'ОТПРАВИТЬ',
      sending: 'ОТПРАВЛЯЕМ…',
      note: 'Robert Di Gaetano использует эти данные для ответа на ваш запрос. Поля со знаком * обязательны. Получатели, сроки хранения и ваши права описаны в политике конфиденциальности.',
      privacy: 'Как мы обращаемся с данными',
      done: 'Получили.',
      doneNote: 'Ваш запрос отправлен. Вы также можете написать нам в WhatsApp.',
      failed: 'Не отправилось.',
      failedNote: 'До нас ничего не дошло — то, что вы написали, осталось в форме. Попробуйте ещё раз или напишите в WhatsApp: он от этого не зависит.',
      retry: 'ПОПРОБОВАТЬ СНОВА',
      wa: 'ПРОДОЛЖИТЬ В WHATSAPP',
    },
    labels: ['ГЛАВНАЯ', 'РАБОТЫ', 'ЦЕНЫ', 'ФИЛЬМЫ', 'УСЛУГИ', 'КАК ЭТО УСТРОЕНО', 'ПОЧЕМУ МЫ', 'ВОПРОСЫ', 'КОНТАКТ'],
    hero: {
      eyebrow: 'МАРКЕТИНГ НЕДВИЖИМОСТИ',
      title: ['Захотят', 'ещё до показа'],
      lede: 'Видео, фото и съёмка с дрона для агентств недвижимости и застройщиков на Коста-дель-Соль.',
      audience: 'Для агентов и застройщиков. Работаем из Марбельи.',
      cta: 'СМОТРЕТЬ ЦЕНЫ',
      cue: 'ВНИЗ',
    },
    services: {
      eyebrow: '04 — УСЛУГИ',
      title: ['Наши услуги', ''],
      lede: 'Фото, видео и съёмка с дрона для ваших объектов. Контент для соцсетей и CRM для работы с заявками.',
      rows: [
        {
          n: '01',
          t: 'Контент и соцсети',
          d: 'Reels, кампании и Stories: создаём и публикуем каждый месяц.',
        },
        {
          n: '02',
          t: 'Фотосъёмка',
          d: 'Профессиональные фото объектов. Готово за пять рабочих дней.',
        },
        {
          n: '03',
          t: 'Дрон и FPV',
          d: 'Виды с воздуха и FPV-тур по дому одним непрерывным пролётом.',
        },
        {
          n: '04',
          t: 'Визуализация',
          d: 'Изображения и видео будущего проекта по вашим чертежам.',
        },
        {
          n: '05',
          t: 'CRM для агентств',
          d: 'Объекты, лиды и привлечение клиентов, с ботом WhatsApp и звонками с ИИ.',
        },
      ],
    },
    works: {
      eyebrow: '01 — РАБОТЫ',
      title: ['Избранные проекты', ''],
      lede: 'Откройте любой: внутри кадры и задача, с которой пришёл клиент.',
      more: 'СМОТРЕТЬ ПРОЕКТ',
      items: [
        {
          alt: 'Вилла Мадрональ — участок и визуализация дома',
          t: 'Villa Madronal',
          k: 'Участок 121, своя работа',
          s: 'ВИЗУАЛИЗАЦИЯ',
          d: 'Пустой участок с воздуха, а затем дом, стоящий на нём — один неподвижный кадр от котлована до готового объёма.',
          caps: [
            'Разбивка на площадке',
            'Котлован готов',
            'Объём, та же камера',
            'Готовый дом, вечернее солнце',
          ],
        },
        {
          alt: 'Ворота гаража открываются ночью, машина освещена внутри',
          t: 'Villa Alfa',
          k: 'Марбелья',
          s: 'СЪЁМКА',
          d: 'Готовая резиденция в сумерках и ночью — открывающийся гараж с машиной внутри, лестница, террасы и подъезд, всё при доступном свете.',
          caps: [
            'Гараж открывается, машина в свете',
            'Лестница, скользящий свет',
            'Терраса в сумерках',
            'Подъезд, последний свет',
          ],
        },
        {
          alt: 'Вилла Альфа — интерьеры и террасы',
          t: 'Villa Alfa — интерьеры',
          k: 'Марбелья',
          s: 'СЪЁМКА',
          d: 'Проход по гостиной, спальням, спа и бассейну, смонтированный под тот свет, который дом получает на самом деле.',
          caps: ['Терраса, полдень', 'Гостиная', 'Главная спальня', 'Крытый бассейн'],
        },
        {
          alt: 'Пуэрто Марина с воздуха на закате',
          t: 'Puerto Marina',
          k: 'Бенальмадена',
          s: 'ДРОН / FPV',
          d: 'Марина показана одним непрерывным движением — вниз между причалами, над крышами и к горизонту на закате.',
          caps: [
            'Вход, низко над водой',
            'Между причалами',
            'Над крышами, солнце село',
            'К горизонту',
          ],
        },
        {
          alt: 'Контур проекта, прочерченный по пустому участку ночью',
          t: 'Yin Yang',
          k: 'Hacienda Las Chapas, своя работа',
          s: 'ВИЗУАЛИЗАЦИЯ',
          d: 'Пустой участок, контур будущего дома, прочерченный прямо по земле с воздуха ночью, и готовый дом комната за комнатой.',
          caps: [
            'Участок, на нём ничего',
            'Контур на земле',
            'Интерьер, один источник света',
            'Кабинет, вид в сад',
          ],
        },
        {
          alt: 'Агент по недвижимости, снятый в современной вилле',
          t: 'Ricardo Ignacio',
          k: 'Марбелья',
          s: 'СЪЁМКА АГЕНТА',
          d: 'Персональный ролик для агента по недвижимости — агент, дом и его подача, уложенные в двадцать секунд.',
          caps: [
            'Подход, жёсткое полуденное солнце',
            'Проход по дому',
            'Терраса и бассейн',
            'Объект с воздуха',
          ],
        },
      ],
    },
    why: {
      eyebrow: '06 — ПОЧЕМУ МЫ',
      title: ['Готово для ваших объявлений', ''],
      lede: 'Вертикаль для Reels и Stories, горизонталь для сайта, порталов и презентации, всё с одной съёмки. Перемонтировать ничего не нужно.',
      stats: [
        { v: '7', k: 'ДНЕЙ ДО ПЕРВОГО ПОКАЗА', from: 30 },
        { v: '9:16 + 16:9', k: 'ОБА ФОРМАТА СРАЗУ' },
        { v: '5', k: 'УСЛУГ, ОДНА КОМАНДА' },
      ],
    },
    method: {
      eyebrow: 'ЧЕТЫРЕ ПРОХОДА',
      title: ['Четыре прохода,', 'без догадок'],
      steps: [
        {
          sn: '01',
          st: 'Приём материалов',
          sd: 'Собираем чертежи, обмеры, фотографии участка и спецификацию отделки. Моделирование начинается только после этого.',
        },
        {
          sn: '02',
          st: 'Объём',
          sd: 'Строим объём по вашим планам и присылаем на согласование. Пока вы не подтвердили — дальше не идём.',
        },
        {
          sn: '03',
          st: 'Свет и материалы',
          sd: 'Солнце ставим по реальным координатам и ориентации участка. Отделку — по вашей спецификации.',
        },
        {
          sn: '04',
          st: 'Сдача',
          sd: 'Отдаём кадры и видео вертикально и горизонтально — в тех форматах, которыми ваш отдел продаж пользуется каждый день.',
        },
      ],
    },
    contact: {
      eyebrow: '08 — КОНТАКТ',
      title: ['Расскажите о вашем объекте', ''],
      meta: ['ЭЛЬДАР ХУСЕЙНОВ', 'МЕДИА ДЛЯ НЕДВИЖИМОСТИ', 'КОСТА-ДЕЛЬ-СОЛЬ'],
      waText: 'Здравствуйте, Эльдар! Пишу с сайта STOARI — есть проект на Коста-дель-Соль.',
    },
    close: 'ЗАКРЫТЬ',
  },
}
