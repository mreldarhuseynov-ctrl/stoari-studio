import type { Lang } from './content'

/**
 * Commercial copy — the services and their prices, the four steps and the
 * questions. It lives apart from `content.ts` on purpose: prices change on
 * their own schedule, while the identity copy next door barely moves.
 *
 * Everything priced here comes from one brief and nothing else: a monthly
 * content and marketing package, two services sold on their own, and a CRM for
 * agencies that is priced at a meeting rather than on the page. No figure and
 * no line item may be added that the brief does not contain — if a price
 * changes, it changes in the brief first.
 *
 * The older price grids — per-property packages, the agents' programme, the
 * developers' visualisation, the agency system and travel — were removed in
 * full, in all three languages. They are in the repository history if anyone
 * needs to know what used to be quoted.
 */

export type Price = {
  /** Small label above the figure: `from`, `desde`, `от`. */
  pre?: string
  /** The figure itself, the only thing set large. */
  amount: string
  /** Trails the figure on the baseline: `per month`. */
  per?: string
}

export type Service = {
  /** Corner tag. The main package carries one; the single services name their kind. */
  tag: string
  t: string
  /** One line under the name: what it is. */
  d?: string
  price: Price
  rows?: string[]
  /** Pre-filled into WhatsApp so the first message already names the service. */
  wa: string
}

export type Prices = {
  eyebrow: string
  title: [string, string]
  lede: string
  /** Heading over the list on the cards. */
  included: string
  main: Service
  singles: Service[]
  /** The two ways to get in touch, on every card. */
  actions: { wa: string; form: string }
  /**
   * The agencies' CRM. No figure on the page by design: the price is set at a
   * meeting, and the block is built to get that meeting booked.
   */
  crm: {
    eyebrow: string
    t: string
    lede: string
    rows: string[]
    price: string
    book: string
    wa: string
  }
}

export type Offer = {
  prices: Prices
  how: {
    eyebrow: string
    title: [string, string]
    lede: string
    steps: { sn: string; st: string; sd: string }[]
  }
  faq: {
    eyebrow: string
    title: [string, string]
    lede: string
    items: { q: string; a: string }[]
  }
  /** Sits under the prices. */
  vat: string
}

export const OFFER: Record<Lang, Offer> = {
  en: {
    prices: {
      eyebrow: '02 — PRICES',
      title: ['Services & prices', ''],
      lede: 'Monthly content, property photography or an FPV flight. Choose what your project needs.',
      included: 'Included',
      main: {
        tag: 'MAIN PACKAGE',
        t: 'Content & marketing',
        price: { amount: '€1,500', per: 'per month' },
        rows: [
          '4 Reels videos',
          '1 marketing campaign',
          'Help with Instagram Stories',
          'Drone aerials, photo and video',
          'Publishing on social media',
          'Copywriting',
          'Technical support in a WhatsApp group',
        ],
        wa: 'Hi Eldar, I am interested in the Content & marketing package.',
      },
      singles: [
        {
          tag: 'SEPARATE SERVICE',
          t: 'Professional photography',
          d: 'Photography of a villa or an apartment with a professional camera.',
          price: { amount: '€200–250' },
          wa: 'Hi Eldar, I am interested in professional photography.',
        },
        {
          tag: 'SEPARATE SERVICE',
          t: 'FPV drone',
          price: { pre: 'from', amount: '€450' },
          rows: ['1 horizontal video + 1 vertical video', 'Length: 30–60 seconds'],
          wa: 'Hi Eldar, I am interested in the FPV drone.',
        },
      ],
      actions: { wa: 'WHATSAPP', form: 'REQUEST FORM' },
      crm: {
        eyebrow: 'FOR ESTATE AGENCIES',
        t: 'A personalised CRM for estate agencies',
        lede: 'Every enquiry answered, qualified and kept in one place, set up around the way your agency works:',
        rows: [
          'Propiedades: managing your properties',
          'Captación: bringing in new properties',
          'Leads: managing your leads',
          'Enquiry capture forms',
          'Lead qualification',
          'WhatsApp bot',
          'AI calls',
        ],
        price: 'The price is discussed at a personal meeting',
        book: 'BOOK A MEETING',
        wa: 'Hi Eldar, I would like to book a meeting about the CRM for our agency.',
      },
    },
    how: {
      eyebrow: '05 — HOW IT WORKS',
      title: ['From brief to delivery', ''],
      lede: 'From the first message to the finished files. Dates are agreed in writing before anything is booked.',
      steps: [
        {
          sn: '01',
          st: 'Send the property',
          sd: 'An address, a link to the listing or the drawings. You get a quote the same day.',
        },
        {
          sn: '02',
          st: 'Choose the service',
          sd: 'The monthly package or a single service. What is included is fixed in writing before anything is booked.',
        },
        {
          sn: '03',
          st: 'Shoot day',
          sd: 'We come with a plan and a script. All you need to give us is access.',
        },
        {
          sn: '04',
          st: 'Delivery',
          sd: 'Five working days, in vertical and landscape, ready to post.',
        },
      ],
    },
    faq: {
      eyebrow: '07 — QUESTIONS',
      title: ['Common questions', ''],
      lede: 'What clients usually ask before the first shoot.',
      items: [
        {
          q: 'How soon do we get the material?',
          a: 'Five working days after the shoot day. For visualisation, the first view comes back in seven days.',
        },
        {
          q: 'How many rounds of revisions are included?',
          a: 'Two. The first after the massing is agreed, the second after light and materials. Anything after that is quoted separately. Once the massing is signed off, moving walls is a new quote, not a revision.',
        },
        {
          q: 'The building does not exist yet.',
          a: 'Then it is visualisation. We build the house on your plot from your drawings, with the sun where your coordinates actually put it.',
        },
        {
          q: 'Who owns the material?',
          a: 'You do. If we would like to show the work in our portfolio, we ask separately, in writing.',
        },
        {
          q: 'What do you need from us on the day?',
          a: 'Access, keys and the time slot. For visualisation: drawings, the survey, site photographs and the material schedule, all before any modelling starts.',
        },
        {
          q: 'Do you travel?',
          a: 'Yes. Costa del Sol is the base; beyond it, flights and accommodation are billed at cost.',
        },
        {
          q: 'How is it paid?',
          a: 'Half on booking the day, half on delivery. The monthly package is billed monthly.',
        },
        {
          q: 'What if the weather goes?',
          a: 'The day moves, at no cost, as long as you tell us the day before.',
        },
      ],
    },
    vat: 'Prices exclude VAT.',
  },

  es: {
    prices: {
      eyebrow: '02 — PRECIOS',
      title: ['Servicios y precios', ''],
      lede: 'Contenido mensual, fotografía de inmuebles o un vuelo FPV. Elige lo que necesita tu proyecto.',
      included: 'Incluye',
      main: {
        tag: 'PAQUETE PRINCIPAL',
        t: 'Contenido y marketing',
        price: { amount: '1.500 €', per: 'al mes' },
        rows: [
          '4 vídeos Reels',
          '1 campaña de marketing',
          'Ayuda con las Stories de Instagram',
          'Grabación aérea con dron, foto y vídeo',
          'Publicación en redes sociales',
          'Copywriting',
          'Soporte técnico en un grupo de WhatsApp',
        ],
        wa: 'Hola Eldar, me interesa el paquete Contenido y marketing.',
      },
      singles: [
        {
          tag: 'SERVICIO APARTE',
          t: 'Fotografía profesional',
          d: 'Fotografía de una villa o un apartamento con cámara profesional.',
          price: { amount: '200–250 €' },
          wa: 'Hola Eldar, me interesa la fotografía profesional.',
        },
        {
          tag: 'SERVICIO APARTE',
          t: 'Dron FPV',
          price: { pre: 'desde', amount: '450 €' },
          rows: ['1 vídeo horizontal + 1 vídeo vertical', 'Duración: 30–60 segundos'],
          wa: 'Hola Eldar, me interesa el dron FPV.',
        },
      ],
      actions: { wa: 'WHATSAPP', form: 'FORMULARIO' },
      crm: {
        eyebrow: 'PARA INMOBILIARIAS',
        t: 'CRM personalizado para inmobiliarias',
        lede: 'Cada consulta atendida, cualificada y en un solo sitio, configurado según la forma de trabajar de su inmobiliaria:',
        rows: [
          'Propiedades: gestión de inmuebles',
          'Captación: captación de nuevos inmuebles',
          'Leads: gestión de leads',
          'Formularios de captación de solicitudes',
          'Cualificación de leads',
          'Bot de WhatsApp',
          'Llamadas con IA',
        ],
        price: 'El precio se concreta en una reunión personal',
        book: 'PEDIR UNA REUNIÓN',
        wa: 'Hola Eldar, me gustaría concertar una reunión sobre el CRM para nuestra inmobiliaria.',
      },
    },
    how: {
      eyebrow: '05 — CÓMO FUNCIONA',
      title: ['Del encargo a la entrega', ''],
      lede: 'Del primer mensaje a los archivos terminados. Las fechas quedan por escrito antes de reservar nada.',
      steps: [
        {
          sn: '01',
          st: 'Envíe el inmueble',
          sd: 'Una dirección, el enlace al anuncio o los planos. El presupuesto llega el mismo día.',
        },
        {
          sn: '02',
          st: 'Elija el servicio',
          sd: 'El paquete mensual o un servicio suelto. Lo que entra queda por escrito antes de reservar nada.',
        },
        {
          sn: '03',
          st: 'Día de rodaje',
          sd: 'Venimos con un plan y un guion. Usted solo tiene que darnos acceso.',
        },
        {
          sn: '04',
          st: 'Entrega',
          sd: 'Cinco días laborables, en vertical y horizontal, listo para publicar.',
        },
      ],
    },
    faq: {
      eyebrow: '07 — PREGUNTAS',
      title: ['Preguntas frecuentes', ''],
      lede: 'Lo que suelen preguntar los clientes antes del primer rodaje.',
      items: [
        {
          q: '¿Cuándo tenemos el material?',
          a: 'Cinco días laborables tras la jornada de rodaje. En visualización, la primera vista vuelve en siete días.',
        },
        {
          q: '¿Cuántas rondas de correcciones entran?',
          a: 'Dos. La primera tras aprobar el volumen, la segunda tras luz y materiales. Lo que venga después se presupuesta aparte. Una vez aprobado el volumen, mover muros es presupuesto nuevo, no corrección.',
        },
        {
          q: 'El edificio todavía no existe.',
          a: 'Entonces es visualización. Levantamos la casa sobre su parcela a partir de sus planos, con el sol donde lo ponen sus coordenadas reales.',
        },
        {
          q: '¿De quién es el material?',
          a: 'Suyo. Si queremos mostrar el trabajo en nuestro portfolio, lo pedimos aparte y por escrito.',
        },
        {
          q: '¿Qué necesitan de nosotros ese día?',
          a: 'Acceso, llaves y la franja horaria. En visualización: planos, levantamiento, fotos del solar y la memoria de calidades, todo antes de empezar a modelar.',
        },
        {
          q: '¿Se desplazan?',
          a: 'Sí. La base es la Costa del Sol; fuera de ella, vuelos y alojamiento se facturan a coste.',
        },
        {
          q: '¿Cómo se paga?',
          a: 'La mitad al reservar la jornada, la mitad a la entrega. El paquete mensual se factura cada mes.',
        },
        {
          q: '¿Y si el tiempo se estropea?',
          a: 'Se cambia el día, sin coste, si nos avisa el día antes.',
        },
      ],
    },
    vat: 'Precios sin IVA.',
  },

  ru: {
    prices: {
      eyebrow: '02 — ЦЕНЫ',
      title: ['Услуги и цены', ''],
      lede: 'Контент на месяц, фотосъёмка недвижимости или FPV-полёт. Выберите услугу для вашего проекта.',
      included: 'Что входит',
      main: {
        tag: 'ОСНОВНОЙ ПАКЕТ',
        t: 'Контент и маркетинг',
        price: { amount: '1 500 €', per: 'в месяц' },
        rows: [
          '4 видео Reels',
          '1 маркетинговая кампания',
          'Помощь с Instagram Stories',
          'Аэросъёмка с дрона, фото и видео',
          'Публикация в социальных сетях',
          'Копирайтинг',
          'Техническая поддержка в группе WhatsApp',
        ],
        wa: 'Здравствуйте, Эльдар! Интересует пакет «Контент и маркетинг».',
      },
      singles: [
        {
          tag: 'ОТДЕЛЬНАЯ УСЛУГА',
          t: 'Профессиональная фотосъёмка',
          d: 'Фотосъёмка виллы или апартамента на профессиональную камеру.',
          price: { amount: '200–250 €' },
          wa: 'Здравствуйте, Эльдар! Интересует профессиональная фотосъёмка.',
        },
        {
          tag: 'ОТДЕЛЬНАЯ УСЛУГА',
          t: 'FPV-дрон',
          price: { pre: 'от', amount: '450 €' },
          rows: ['1 горизонтальное видео + 1 вертикальное видео', 'Длительность: 30–60 секунд'],
          wa: 'Здравствуйте, Эльдар! Интересует FPV-дрон.',
        },
      ],
      actions: { wa: 'WHATSAPP', form: 'ФОРМА ЗАЯВКИ' },
      crm: {
        eyebrow: 'ДЛЯ АГЕНТСТВ НЕДВИЖИМОСТИ',
        t: 'Персонализированная CRM для агентств недвижимости',
        lede: 'Каждая заявка получает ответ, проходит квалификацию и хранится в одном месте. Настраивается под то, как работает ваше агентство:',
        rows: [
          'Propiedades: управление объектами',
          'Captación: привлечение объектов',
          'Leads: управление лидами',
          'Формы захвата заявок',
          'Квалификация лидов',
          'Бот в WhatsApp',
          'Звонки с ИИ',
        ],
        price: 'Стоимость обсуждается на личной встрече',
        book: 'ЗАПИСАТЬСЯ НА ВСТРЕЧУ',
        wa: 'Здравствуйте, Эльдар! Хочу записаться на встречу по CRM для нашего агентства.',
      },
    },
    how: {
      eyebrow: '05 — КАК ЭТО УСТРОЕНО',
      title: ['От заявки до готовых файлов', ''],
      lede: 'От первого сообщения до готовых файлов. Сроки фиксируем письменно до брони.',
      steps: [
        {
          sn: '01',
          st: 'Пришлите объект',
          sd: 'Адрес, ссылку на объявление или чертежи. Смета придёт в тот же день.',
        },
        {
          sn: '02',
          st: 'Выберите услугу',
          sd: 'Пакет на месяц или отдельная услуга. Состав фиксируется письменно до брони.',
        },
        {
          sn: '03',
          st: 'Съёмочная смена',
          sd: 'Приезжаем с планом и сценарием. От вас нужен только доступ.',
        },
        {
          sn: '04',
          st: 'Сдача',
          sd: 'Пять рабочих дней, вертикаль и горизонталь, сразу к публикации.',
        },
      ],
    },
    faq: {
      eyebrow: '07 — ВОПРОСЫ',
      title: ['Частые вопросы', ''],
      lede: 'О чём обычно спрашивают перед первой съёмкой.',
      items: [
        {
          q: 'Когда мы получим материал?',
          a: 'Пять рабочих дней после смены. По визуализации первый вид возвращается за семь дней.',
        },
        {
          q: 'Сколько волн правок входит?',
          a: 'Две. Первая после согласования объёма, вторая после света и материалов. Всё дальнейшее считается отдельно — а после утверждения объёма передвинуть стены значит новую смету, а не правку.',
        },
        {
          q: 'Объект ещё не построен.',
          a: 'Тогда это визуализация. Ставим дом на ваш участок по вашим чертежам, а солнце туда, куда его ставят реальные координаты.',
        },
        {
          q: 'Кому принадлежит материал?',
          a: 'Вам. Если мы захотим показать работу в портфолио, спросим отдельно и письменно.',
        },
        {
          q: 'Что нужно от нас в день съёмки?',
          a: 'Доступ, ключи и время. Для визуализации — чертежи, обмеры, фотографии участка и ведомость материалов, всё до начала моделирования.',
        },
        {
          q: 'Вы выезжаете?',
          a: 'Да. База — Коста-дель-Соль; за её пределами перелёт и проживание по счёту.',
        },
        {
          q: 'Как происходит оплата?',
          a: 'Половина при бронировании смены, половина при сдаче. Пакет на месяц выставляется помесячно.',
        },
        {
          q: 'А если испортится погода?',
          a: 'День переносится, бесплатно, если предупредить накануне.',
        },
      ],
    },
    vat: 'Цены указаны без НДС.',
  },
}
