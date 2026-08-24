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
  email: 'mreldarhuseynov@gmail.com',
  /** Digits only, country code first — that is the format wa.me expects. */
  whatsapp: '34610826619',
  whatsappLabel: '+34 610 826 619',
  /** Clean URL: the igsh/utm parameters on a shared link are QR tracking. */
  instagram: 'https://www.instagram.com/stoaristudio',
  instagramLabel: '@stoaristudio',
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
  // the answer on the third screen, not the fifth — and the packages say what
  // the studio does more concretely than a list of services ever did.
  { id: 'packages', rev: true, wide: true, shape: 2 },
  { id: 'services', shape: 4 },
  // The commercial run, in the order a buyer actually decides: what a listing
  // costs, then what an agent costs, then what a developer buys, then what it
  // costs to fly us somewhere else. All four are wide — a price grid needs the
  // width of four cards, and squeezing one into the 520px text measure turns
  // the cards into columns too narrow to read a line of.
  { id: 'program', rev: true, wide: true, shape: 5 },
  { id: 'project', wide: true, shape: 1 },
  // Leads and automation sits right behind the developers, because it is the
  // answer to what happens once their film has done its work.
  { id: 'funnel', wide: true, shape: 3 },
  { id: 'travel', rev: true, wide: true, shape: 2 },
  { id: 'how', shape: 4 },
  { id: 'why', rev: true, shape: 5 },
  { id: 'faq', shape: 3 },
  { id: 'contact', rev: true, shape: 0 },
]

/**
 * Sides alternate from `work` to `contact` with one repeat: `funnel` follows
 * `project` on the same side. Eleven sections below the hero cannot alternate
 * cleanly and still land `contact` on the right, and the repeat sits directly
 * behind a wide section — which reads as a break in the rhythm, not as a side.
 */

/**
 * Media is shared across languages — only the words change. Captions live in
 * COPY and are matched to these frames by position, so the two arrays must
 * stay the same length.
 */
export const WORK_MEDIA = [
  {
    n: '01',
    img: '/works/01-madronal.webp',
    clip: '/works/01-madronal-loop.mp4',
    frames: [
      '/works/01-madronal-a.webp',
      '/works/01-madronal-b.webp',
      '/works/01-madronal-c.webp',
      '/works/01-madronal-d.webp',
    ],
  },
  {
    n: '02',
    img: '/works/02-alfa.webp',
    clip: '/works/02-alfa-loop.mp4',
    frames: [
      '/works/02-alfa-a.webp',
      '/works/02-alfa-b.webp',
      '/works/02-alfa-c.webp',
      '/works/02-alfa-d.webp',
    ],
  },
  {
    n: '03',
    img: '/works/03-alfa-interiors.webp',
    clip: '/works/03-alfa-interiors-loop.mp4',
    frames: [
      '/works/03-alfa-interiors-a.webp',
      '/works/03-alfa-interiors-b.webp',
      '/works/03-alfa-interiors-c.webp',
      '/works/03-alfa-interiors-d.webp',
    ],
  },
  {
    n: '04',
    img: '/works/04-marina.webp',
    clip: '/works/04-marina-loop.mp4',
    frames: [
      '/works/04-marina-a.webp',
      '/works/04-marina-b.webp',
      '/works/04-marina-c.webp',
      '/works/04-marina-d.webp',
    ],
  },
  {
    n: '05',
    img: '/works/05-yinyang.webp',
    clip: '/works/05-yinyang-loop.mp4',
    frames: [
      '/works/05-yinyang-a.webp',
      '/works/05-yinyang-b.webp',
      '/works/05-yinyang-c.webp',
      '/works/05-yinyang-d.webp',
    ],
  },
  {
    n: '06',
    img: '/works/06-agent.webp',
    clip: '/works/06-agent-loop.mp4',
    frames: [
      '/works/06-agent-a.webp',
      '/works/06-agent-b.webp',
      '/works/06-agent-c.webp',
      '/works/06-agent-d.webp',
    ],
  },
]

type Copy = {
  nav: { label: string; href: string }[]
  cta: string
  labels: string[]
  hero: {
    eyebrow: string
    title: [string, string]
    lede: string
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
    /**
     * A dated offer. It has to come down when the date passes — a deadline
     * that is quietly extended tells every returning visitor that the price
     * was never real. Delete the `offer` block from all three languages.
     */
    offer: { headline: string; detail: string }
  }
  close: string
}

export const COPY: Record<Lang, Copy> = {
  en: {
    nav: [
      { label: 'WORK', href: '#work' },
      { label: 'PACKAGES', href: '#packages' },
      { label: 'DEVELOPERS', href: '#project' },
      { label: 'QUESTIONS', href: '#faq' },
    ],
    cta: 'START A PROJECT',
    labels: ['INDEX', 'WORK', 'PACKAGES', 'SERVICES', 'AGENTS', 'DEVELOPERS', 'LEADS & AUTOMATION', 'TRAVEL', 'HOW IT WORKS', 'WHY', 'QUESTIONS', 'CONTACT'],
    hero: {
      eyebrow: 'ARCHITECTURAL VISUALIZATION',
      title: ['Buildings before', 'they exist'],
      lede: 'Visualization, film, photography and the page that sells them — for villas, apartments and developments on the Costa del Sol. Scripts included: we say what to shoot and what to say on camera.',
      cta: 'SEE THE PACKAGES',
      cue: 'SCROLL',
    },
    services: {
      eyebrow: '03 — SERVICES',
      title: ['Everything a project', 'needs to be sold'],
      lede: 'Most developers buy renders in one place, film in another and a website in a third, then spend weeks making them look like the same project. Here it is one studio and one look.',
      rows: [
        {
          n: '01',
          t: 'Visualisation',
          d: 'Before it is built. The volume standing on your plot, from your drawings.',
        },
        {
          n: '02',
          t: 'Property & agent film',
          d: 'Villas, apartments and construction progress, stills from the same day — and the agents who sell them.',
        },
        {
          n: '03',
          t: 'Drone & FPV',
          d: 'Standard drone for the orbit and the establishing shot, FPV where it has to be one unbroken move.',
        },
        {
          n: '04',
          t: 'Project page',
          d: 'The landing page or project site you send a buyer to, built around the images.',
        },
        {
          n: '05',
          t: 'Leads & automation',
          d: 'The WhatsApp bot that answers at once and the CRM the enquiry lands in — the half that comes after the film.',
        },
      ],
    },
    works: {
      eyebrow: '01 — WORK',
      title: ['Some of', 'our work'],
      lede: 'Some of these are built and filmed, some exist only as visualisation. Each answered a different question — open one to see the frames and what was actually needed.',
      more: 'VIEW PROJECT',
      items: [
        {
          alt: 'Villa Madronal — the plot and the visualised house',
          t: 'Villa Madronal',
          k: 'Plot 121 · in-house',
          s: 'VISUALISATION',
          d: 'A bare plot filmed from the air, then the house standing on it — one locked shot, from excavation to finished volume.',
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
          d: 'A completed residence at dusk and after dark — the garage opening on the car, the stair, the terraces and the approach, all on available light.',
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
          d: 'A marina shown in one unbroken move — down between the moorings, over the roofs and out to the horizon at sunset.',
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
          k: 'Hacienda Las Chapas · in-house',
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
          d: 'A personal film for an estate agent — the agent, the house and the pitch cut into twenty seconds.',
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
      eyebrow: '08 — WHY',
      title: ['Days, not months,', 'and in both formats'],
      lede: 'Most studios quote weeks before you see anything. Here the first look comes back in days — vertical for social and landscape for the site, the portal and the deck. Nothing has to be recut.',
      stats: [
        { v: '7', k: 'DAYS TO FIRST LOOK', from: 30 },
        { v: '9:16 + 16:9', k: 'BOTH, FROM THE START' },
        { v: '5', k: 'SERVICES, ONE STUDIO' },
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
      eyebrow: '11 — CONTACT',
      title: ['Send the drawings.', 'See it standing.'],
      meta: ['ELDAR HUSEYNOV', 'REAL ESTATE MEDIA', 'COSTA DEL SOL'],
      waText: 'Hi Eldar — I found STOARI online. I have a project on the Costa del Sol.',
      offer: {
        headline: 'SEPTEMBER TERMS · −30% ON VISUALISATION UNTIL 30 SEPTEMBER',
        detail:
          'Visualisation from €665 instead of €950. Quote the same day, first view in seven days. The season is starting and I am still adding objects to the portfolio, so the work has to be publishable. Shoot days and packages keep their prices.',
      },
    },
    close: 'CLOSE',
  },

  es: {
    nav: [
      { label: 'TRABAJOS', href: '#work' },
      { label: 'PAQUETES', href: '#packages' },
      { label: 'PROMOTORES', href: '#project' },
      { label: 'PREGUNTAS', href: '#faq' },
    ],
    cta: 'EMPEZAR UN PROYECTO',
    labels: ['INICIO', 'TRABAJOS', 'PAQUETES', 'SERVICIOS', 'AGENTES', 'PROMOTORES', 'LEADS Y AUTOMATIZACIÓN', 'DESPLAZAMIENTO', 'CÓMO FUNCIONA', 'POR QUÉ', 'PREGUNTAS', 'CONTACTO'],
    hero: {
      eyebrow: 'VISUALIZACIÓN ARQUITECTÓNICA',
      title: ['Ver el edificio', 'antes de construirlo'],
      lede: 'Visualización, vídeo, fotografía y la página que lo vende — para villas, apartamentos y promociones en la Costa del Sol. Guiones incluidos: decimos qué rodar y qué decir ante la cámara.',
      cta: 'VER LOS PAQUETES',
      cue: 'BAJAR',
    },
    services: {
      eyebrow: '03 — SERVICIOS',
      title: ['Todo lo que hace falta', 'para vender el proyecto'],
      lede: 'Lo normal es encargar los renders en un sitio, el vídeo en otro y la web en un tercero, y luego pasar semanas haciendo que parezcan el mismo proyecto. Aquí es un solo estudio y una sola mirada.',
      rows: [
        {
          n: '01',
          t: 'Visualización',
          d: 'Antes de construir. El volumen sobre su parcela, levantado desde sus planos.',
        },
        {
          n: '02',
          t: 'Vídeo de propiedad y agente',
          d: 'Villas, apartamentos, avance de obra y fotografía de la misma jornada. Y los agentes que las venden.',
        },
        {
          n: '03',
          t: 'Dron y FPV',
          d: 'Dron clásico para el vuelo alrededor, FPV cuando tiene que ser un solo movimiento continuo.',
        },
        {
          n: '04',
          t: 'Página del proyecto',
          d: 'La landing o la web del proyecto a la que usted manda al comprador.',
        },
        {
          n: '05',
          t: 'Leads y automatización',
          d: 'El bot de WhatsApp que responde al instante y el CRM donde cae la consulta — la mitad que viene después del vídeo.',
        },
      ],
    },
    works: {
      eyebrow: '01 — TRABAJOS',
      title: ['Algunos de', 'nuestros trabajos'],
      lede: 'Algunos ya están construidos y filmados, otros existen sólo en visualización. Cada uno respondía a una pregunta distinta — ábralos para ver los fotogramas y qué hacía falta.',
      more: 'VER PROYECTO',
      items: [
        {
          alt: 'Villa Madronal — la parcela y la casa visualizada',
          t: 'Villa Madronal',
          k: 'Parcela 121 · trabajo propio',
          s: 'VISUALIZACIÓN',
          d: 'Una parcela vacía desde el aire y después la casa levantada sobre ella — un solo plano fijo, del vaciado al volumen terminado.',
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
          d: 'Una residencia terminada al anochecer y de noche — el garaje abriéndose sobre el coche, la escalera, las terrazas y el acceso, todo con luz disponible.',
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
          d: 'Un puerto entero en un solo movimiento — entre los amarres, sobre los tejados y hacia el horizonte al atardecer.',
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
          k: 'Hacienda Las Chapas · trabajo propio',
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
          d: 'Un vídeo personal para un agente inmobiliario — el agente, la casa y su discurso en veinte segundos.',
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
      eyebrow: '08 — POR QUÉ',
      title: ['Días, no meses,', 'y en los dos formatos'],
      lede: 'La mayoría de los estudios habla de semanas antes de que usted vea nada. Aquí la primera versión llega en días — en vertical para redes y en horizontal para la web, el portal y la presentación. No hay que remontar nada.',
      stats: [
        { v: '7', k: 'DÍAS HASTA LA PRIMERA VERSIÓN', from: 30 },
        { v: '9:16 + 16:9', k: 'LOS DOS, DESDE EL PRINCIPIO' },
        { v: '5', k: 'SERVICIOS, UN ESTUDIO' },
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
          sd: 'Levantamos el volumen según sus planos y se lo enviamos para aprobación. Hasta que usted lo confirme, no seguimos.',
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
      eyebrow: '11 — CONTACTO',
      title: ['Envíe los planos.', 'Lo verá antes de obra.'],
      meta: ['ELDAR HUSEYNOV', 'CONTENIDO INMOBILIARIO', 'COSTA DEL SOL'],
      waText: 'Hola Eldar, le escribo desde la web de STOARI. Tengo un proyecto en la Costa del Sol.',
      offer: {
        headline: 'CONDICIONES DE SEPTIEMBRE · −30% EN VISUALIZACIÓN HASTA EL 30 DE SEPTIEMBRE',
        detail:
          'Visualización desde 665 € en lugar de 950 €. Presupuesto el mismo día, primera vista en siete días. Empieza la temporada y sigo sumando obras al porfolio, por eso el trabajo tiene que ser publicable. Las jornadas de rodaje y los paquetes mantienen su precio.',
      },
    },
    close: 'CERRAR',
  },

  ru: {
    nav: [
      { label: 'РАБОТЫ', href: '#work' },
      { label: 'ПАКЕТЫ', href: '#packages' },
      { label: 'ЗАСТРОЙЩИКУ', href: '#project' },
      { label: 'ВОПРОСЫ', href: '#faq' },
    ],
    cta: 'НАЧАТЬ ПРОЕКТ',
    labels: ['ГЛАВНАЯ', 'РАБОТЫ', 'ПАКЕТЫ', 'УСЛУГИ', 'АГЕНТУ', 'ЗАСТРОЙЩИКУ', 'ЗАЯВКИ И АВТОМАТИЗАЦИЯ', 'ВЫЕЗД', 'КАК ЭТО УСТРОЕНО', 'ПОЧЕМУ МЫ', 'ВОПРОСЫ', 'КОНТАКТ'],
    hero: {
      eyebrow: 'АРХИТЕКТУРНАЯ ВИЗУАЛИЗАЦИЯ',
      title: ['Покажем объект', 'до начала стройки'],
      lede: 'Визуализация, съёмка, фотографии и сайт — под один проект и в одном стиле. Виллы, апартаменты и посёлки на Коста-дель-Соль. Сценарии входят: говорим, что снимать и что сказать в кадре.',
      cta: 'СМОТРЕТЬ ПАКЕТЫ',
      cue: 'ВНИЗ',
    },
    services: {
      eyebrow: '03 — УСЛУГИ',
      title: ['Всё, что нужно,', 'чтобы объект продался'],
      lede: 'Обычно рендеры заказывают в одном месте, съёмку в другом, сайт в третьем — а потом неделями сводят это к виду одного проекта. Здесь одна студия и один взгляд.',
      rows: [
        {
          n: '01',
          t: 'Визуализация',
          d: 'Объект, которого ещё нет: строим по вашим чертежам и показываем на вашем участке.',
        },
        {
          n: '02',
          t: 'Съёмка объектов',
          d: 'Виллы, апартаменты, ход стройки и фотографии с той же смены. И персональные ролики для агентов.',
        },
        {
          n: '03',
          t: 'Аэросъёмка и FPV',
          d: 'Классический дрон для облёта объекта, FPV — где нужен один непрерывный кадр.',
        },
        {
          n: '04',
          t: 'Сайт объекта',
          d: 'Лендинг или страница проекта, на которую вы отправляете покупателя.',
        },
        {
          n: '05',
          t: 'Заявки и автоматизация',
          d: 'Бот в WhatsApp, который отвечает сразу, и CRM, куда падает заявка, — вторая половина, которая идёт после ролика.',
        },
      ],
    },
    works: {
      eyebrow: '01 — РАБОТЫ',
      title: ['Некоторые', 'из наших работ'],
      lede: 'Часть объектов уже построена и снята, часть пока существует только в визуализации. У каждого проекта своя задача — откройте, чтобы посмотреть кадры и что именно требовалось.',
      more: 'СМОТРЕТЬ ПРОЕКТ',
      items: [
        {
          alt: 'Вилла Мадрональ — участок и визуализация дома',
          t: 'Villa Madronal',
          k: 'Участок 121 · своя работа',
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
          k: 'Hacienda Las Chapas · своя работа',
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
      eyebrow: '08 — ПОЧЕМУ МЫ',
      title: ['Дни, а не месяцы,', 'и сразу в двух форматах'],
      lede: 'Большинство студий называют недели, прежде чем вы увидите хоть что-то. Здесь первый вариант приходит за несколько дней — и сразу вертикально для соцсетей и горизонтально для сайта, портала и презентации. Пересводить ничего не нужно.',
      stats: [
        { v: '7', k: 'ДНЕЙ ДО ПЕРВОГО ПОКАЗА', from: 30 },
        { v: '9:16 + 16:9', k: 'ОБА ФОРМАТА СРАЗУ' },
        { v: '5', k: 'УСЛУГ В ОДНОЙ СТУДИИ' },
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
      eyebrow: '11 — КОНТАКТ',
      title: ['Пришлите чертежи.', 'Покажем объект до стройки.'],
      meta: ['ЭЛЬДАР ХУСЕЙНОВ', 'МЕДИА ДЛЯ НЕДВИЖИМОСТИ', 'КОСТА-ДЕЛЬ-СОЛЬ'],
      waText: 'Здравствуйте, Эльдар! Пишу с сайта STOARI — есть проект на Коста-дель-Соль.',
      offer: {
        headline: 'СЕНТЯБРЬСКИЕ УСЛОВИЯ · −30% НА ВИЗУАЛИЗАЦИЮ ДО 30 СЕНТЯБРЯ',
        detail:
          'Визуализация от 665 € вместо 950 €. Смета в тот же день, первый вид за семь дней. Начинается сезон, и я добираю объекты в портфолио — поэтому работу должно быть можно публиковать. Съёмочные смены и пакеты остаются в цене.',
      },
    },
    close: 'ЗАКРЫТЬ',
  },
}
