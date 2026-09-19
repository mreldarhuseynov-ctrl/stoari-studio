import type { Lang } from './content'

/**
 * Commercial copy — packages, the monthly programme, travel, the four steps
 * and the questions. It lives apart from `content.ts` on purpose: prices and
 * package contents change on their own schedule, several times a season,
 * while the identity copy next door barely moves. Keeping them in one file
 * meant every price edit touched the file that also holds the wordmark and
 * the project captions.
 *
 * The numbers here are not invented — they come from `stoari-content/пакеты.md`,
 * which derives every one of them from the shoot-day cost and the margin floor
 * in `pricing.md`. Change a price there first, then here.
 *
 * Prices are written as "from" everywhere. A package that names a single fixed
 * figure invites a line-by-line negotiation of what to remove; a floor names
 * the entry and leaves the property to decide the rest.
 */

export type Pack = {
  n: string
  /** Package name. */
  t: string
  /** How many services, shown before anyone reads the list. */
  count: string
  price: string
  /** Set on exactly one pack per group — the default choice. */
  note?: string
  rows: string[]
  /** Optional line under the list: what the same thing costs separately. */
  foot?: string
}

export type Group = { title: string; packs: Pack[] }

export type Block = {
  eyebrow: string
  title: [string, string]
  lede: string
  groups: Group[]
}

export type Offer = {
  packages: Block
  program: Block
  project: Block
  /**
   * The line no media studio on this coast sells: what happens to the enquiry
   * after the film has done its job. The prices are first-pass anchors, settled
   * with the developer before any of them is quoted to a client.
   *
   * Deliberately no turnaround promise anywhere in this block. The media
   * packages name five working days because there is a pipeline behind that
   * number; there is not one here yet, and a date on the site that nothing
   * backs is the one thing this studio does not do.
   */
  funnel: Block
  travel: Block
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
  /** Sits under every price grid. */
  vat: string
}

export const OFFER: Record<Lang, Offer> = {
  en: {
    packages: {
      eyebrow: '02 — PACKAGES',
      title: ['Everything a listing', 'needs, from one visit'],
      lede: 'Photography, film, drone and the page — shot in one visit and cut to one look. The figure is the entry point for a standard villa; anything larger is quoted the same day.',
      groups: [
        {
          title: 'Per property',
          packs: [
            {
              n: '01',
              t: 'Property',
              count: '5 services',
              price: 'from €1,400',
              rows: [
                'Half a shoot day on site',
                '25 edited photographs',
                '45-second film, vertical and landscape',
                'Subtitles and cover frame',
                'Delivered in 5 working days',
              ],
            },
            {
              n: '02',
              t: 'Signature',
              count: '7 services',
              price: 'from €2,200',
              note: 'MOST CHOSEN',
              rows: [
                'A full shoot day on site',
                '40 edited photographs',
                '60-second film, vertical and landscape',
                'Two 15-second vertical teasers',
                'Drone — aerial stills and aerial film',
                'Subtitles and cover frames',
                'Delivered in 5 working days',
              ],
            },
            {
              n: '03',
              t: 'Full',
              count: '10 services',
              price: 'from €3,400',
              rows: [
                'Everything in Signature',
                'Twilight — golden hour and after sunset, a second visit',
                'FPV — one unbroken flight through the property',
                'Four vertical teasers',
                'A listing page with its own domain',
                'Delivered in 7 working days',
              ],
              foot: 'Bought separately: €4,300.',
            },
            {
              n: '04',
              t: 'Your own set',
              count: 'Any services',
              price: 'from €950',
              rows: [
                'Built around the property',
                'Any single service on its own',
                'Quoted the same day',
              ],
            },
          ],
        },
      ],
    },
    program: {
      eyebrow: '05 — AGENTS & PROGRAMME',
      title: ['The agent is the', 'other half of the sale'],
      lede: 'A property is filmed once. An agent is filmed every month, and that is what keeps the listings coming. Scripts are included — we tell you what to shoot and what to say on camera.',
      groups: [
        {
          title: 'One shoot day',
          packs: [
            {
              n: '01',
              t: 'Personal film',
              count: '4 services',
              price: 'from €850',
              rows: [
                'Half a shoot day',
                'One 20–30 second vertical film',
                'Script and what to say on camera',
                'Subtitles and cover frame',
              ],
            },
            {
              n: '02',
              t: 'Three films in a day',
              count: '4 services',
              price: 'from €1,900',
              rows: [
                'One visit — three agents, or three films',
                'A script for each',
                'Subtitles and cover frames',
                'Delivered in 5 working days',
              ],
            },
            {
              n: '03',
              t: 'Agency day',
              count: '4 services',
              price: 'from €2,900',
              rows: [
                'Five films in one visit — €580 an agent',
                'A script for each',
                'Subtitles and cover frames',
                'Delivered in 7 working days',
              ],
            },
          ],
        },
        {
          title: 'Monthly programme · minimum three months',
          packs: [
            {
              n: '01',
              t: 'Tier one',
              count: '4 films a month',
              price: 'from €1,500 / month',
              rows: [
                'Four films a month, script and edit included',
                'A photo session of the agent and the properties',
                'Stories that keep the profile alive all month',
                'A monthly editorial plan: what goes out, and when',
              ],
              foot: 'Bought separately: €2,500. Minimum three months — before that the effect does not show.',
            },
            {
              n: '02',
              t: 'Tier two',
              count: '6 films a month',
              price: 'from €1,900 / month',
              note: 'MOST CHOSEN',
              rows: [
                'Six films a month',
                'Up to two locations',
                'Scripts and a publishing plan',
                '15% off everything else',
              ],
            },
            {
              n: '03',
              t: 'Tier three',
              count: '8 films a month',
              price: 'from €2,400 / month',
              rows: [
                'Eight films a month',
                'Up to three locations',
                'Scripts and a publishing plan',
                '20% off everything else',
              ],
            },
            {
              n: '04',
              t: 'Construction progress',
              count: '3 services',
              price: 'from €750 / month',
              rows: [
                'One visit a month',
                '30-second film',
                'Minimum three months',
              ],
            },
          ],
        },
      ],
    },
    project: {
      eyebrow: '06 — DEVELOPERS',
      title: ['Sell it before', 'it is standing'],
      lede: 'Priced by the property, not by the number of views — how many angles it takes for a building to be understood is the studio’s call. Two rounds of revisions are included in all of it.',
      groups: [
        {
          title: 'Visualisation',
          packs: [
            {
              n: '01',
              t: 'Concept',
              count: '3 services',
              price: 'from €950',
              rows: [
                'A plot, or a single volume',
                'What will be here, from your drawings',
                'Two rounds of revisions',
              ],
            },
            {
              n: '02',
              t: 'Property',
              count: '4 services',
              price: 'from €1,900',
              rows: [
                'Villa or apartment up to 400 m²',
                'Exterior and interior',
                '15-second film from the same scenes',
                'Two rounds of revisions',
              ],
            },
            {
              n: '03',
              t: 'Large property',
              count: '4 services',
              price: 'from €3,200',
              rows: [
                'Over 400 m², several buildings or phases',
                'Exterior and interior',
                '30-second film from the same scenes',
                'Two rounds of revisions',
              ],
            },
            {
              n: '04',
              t: 'Project launch',
              count: '3 services',
              price: 'from €4,200',
              note: 'START HERE',
              rows: [
                'Visualisation of the property',
                'A shoot day with drone once it stands',
                'The project page',
              ],
              foot: 'Bought separately: €4,850.',
            },
          ],
        },
      ],
    },
    funnel: {
      eyebrow: '07 — AGENCY SYSTEM',
      title: ['Every enquiry answered', 'in thirty seconds.'],
      lede: 'A buyer writes on Saturday evening and the agency answers on Monday — by then they have spoken to two others. We build the system that answers at once, asks what the agent would ask, and has everything waiting in the CRM by morning. Live in 21 days.',
      groups: [
        {
          title: 'Built for the agency, run from the phone',
          packs: [
            {
              n: '01',
              t: 'AI system',
              count: '8 parts',
              price: 'from €4,200 + €350/month',
              note: 'THE MAIN ONE',
              rows: [
                'WhatsApp assistant in Spanish, replying in under 30 seconds, day and night',
                'Asks five things: area, budget, timing, financing, type of property',
                'Leads CRM with status and history — who to call today, at a glance',
                'Property CRM: listing text and social posts written from the photos',
                'Idealista and Fotocasa enquiries land in the CRM and get the same answer',
                'Fifteen follow-up automations; a hot lead is flagged to the agent at once',
                'Voice assistant takes the calls the agent misses and books the viewing',
                'Live in 21 days, with two meetings along the way',
                'Built on GoHighLevel — any other CRM is checked before we commit',
              ],
              foot: 'Bought piece by piece: €10,100. If after 60 days the agency is not saving at least 8 hours a week, we keep working without charging until it is.',
            },
            {
              n: '02',
              t: 'Agency website',
              count: '3 parts',
              price: 'from €1,900',
              rows: [
                'Connected to the CRM',
                'Properties load themselves',
                'Every form lands straight in the system',
              ],
            },
            {
              n: '03',
              t: 'Single-property page',
              count: '2 parts',
              price: 'from €600',
              rows: [
                'Its own site for a high-value home',
                'Enquiries go straight to the CRM',
              ],
            },
            {
              n: '04',
              t: 'Process audit',
              count: '3 parts',
              price: 'from €950',
              rows: [
                'Where enquiries come in and where they are lost',
                'What is worth automating, and what is not',
                'A written plan with priorities',
              ],
              foot: 'Consulting by the hour €220. Monthly support for agencies with their own team from €1,450/month.',
            },
          ],
        },
      ],
    },
    travel: {
      eyebrow: '08 — TRAVEL',
      title: ['Not on the', 'Costa del Sol?'],
      lede: 'Madrid, Ibiza, Dubai. Locations and scripts are settled before anyone flies. Flights and accommodation are billed at cost, on top.',
      groups: [
        {
          title: 'Away from the coast',
          packs: [
            {
              n: '01',
              t: 'Trip 01',
              count: '4 services',
              price: 'from €5,900',
              rows: [
                'Two shoot days',
                'Eight finished films',
                'Locations and scripts planned before the trip',
                'Subtitles and a publishing plan',
              ],
            },
            {
              n: '02',
              t: 'Trip 02',
              count: '5 services',
              price: 'from €6,900',
              note: 'MOST CHOSEN',
              rows: [
                'Two shoot days',
                'Ten finished films',
                'Drone — aerial stills and film',
                'Locations and scripts planned before the trip',
                'Subtitles and a publishing plan',
              ],
            },
            {
              n: '03',
              t: 'Trip 03',
              count: '5 services',
              price: 'from €8,500',
              rows: [
                'Three shoot days',
                'Twelve finished films',
                'Drone and FPV',
                'Locations and scripts planned before the trip',
                'Subtitles and a publishing plan',
              ],
            },
          ],
        },
      ],
    },
    how: {
      eyebrow: '09 — HOW IT WORKS',
      title: ['Four steps, and', 'nothing to prepare'],
      lede: 'The part most studios leave vague. Here it is in order, with the dates that go in writing before anything is booked.',
      steps: [
        {
          sn: '01',
          st: 'Send the property',
          sd: 'An address, the drawings, or a link to the listing. A quote comes back the same day.',
        },
        {
          sn: '02',
          st: 'Choose the package',
          sd: 'Three levels or your own set. What is included is fixed in writing before the day is booked.',
        },
        {
          sn: '03',
          st: 'Shoot day',
          sd: 'We arrive with the plan and the script. Nothing to prepare on your side except access.',
        },
        {
          sn: '04',
          st: 'Delivery',
          sd: 'Five working days. Vertical and landscape from the start, so nothing has to be recut.',
        },
      ],
    },
    faq: {
      eyebrow: '11 — QUESTIONS',
      title: ['The questions that', 'come up every time'],
      lede: 'Everything below is what actually happens, not what sounds good in a proposal.',
      items: [
        {
          q: 'How soon do we get the material?',
          a: 'Five working days after the shoot day, seven if the package includes twilight or a page. For visualisation, the first view comes back in seven days.',
        },
        {
          q: 'How many rounds of revisions are included?',
          a: 'Two. The first after the massing is agreed, the second after light and materials. Anything after that is quoted separately — and once the massing is signed off, moving walls is a new quote, not a revision.',
        },
        {
          q: 'The building does not exist yet.',
          a: 'Then it is visualisation, and it is the reason the studio exists. The volume stands on your plot, built from your drawings, with the sun in the position your coordinates actually give it.',
        },
        {
          q: 'Who owns the material?',
          a: 'You do. The studio asks separately, in writing, for the right to show the work in its own portfolio — and a discount is only ever given in exchange for something like that.',
        },
        {
          q: 'What do you need from us on the day?',
          a: 'Access, keys and the time slot. For visualisation: drawings, the survey, site photographs and the material schedule, all before any modelling starts.',
        },
        {
          q: 'Do you travel?',
          a: 'Yes. Costa del Sol is the base; anything beyond it is in Travel above, with flights and accommodation billed at cost.',
        },
        {
          q: 'How is it paid?',
          a: 'Half on booking the day, half on delivery. Monthly programmes are billed monthly, with a minimum of three months.',
        },
        {
          q: 'What if the weather goes?',
          a: 'The day moves. A shoot day is booked against a property, not against a forecast, and moving it costs nothing as long as it is moved the day before.',
        },
      ],
    },
    vat: 'All figures are entry prices, excluding VAT.',
  },

  es: {
    packages: {
      eyebrow: '02 — PAQUETES',
      title: ['Todo lo que un inmueble', 'necesita, en una visita'],
      lede: 'Fotografía, vídeo, dron y la página — rodado en una sola visita y montado con una misma mirada. La cifra es el punto de partida para una villa estándar; lo más grande se presupuesta el mismo día.',
      groups: [
        {
          title: 'Por inmueble',
          packs: [
            {
              n: '01',
              t: 'Inmueble',
              count: '5 servicios',
              price: 'desde 1.400 €',
              rows: [
                'Media jornada de rodaje',
                '25 fotografías editadas',
                'Vídeo de 45 segundos, vertical y horizontal',
                'Subtítulos y portada',
                'Entrega en 5 días laborables',
              ],
            },
            {
              n: '02',
              t: 'Signature',
              count: '7 servicios',
              price: 'desde 2.200 €',
              note: 'EL MÁS ELEGIDO',
              rows: [
                'Jornada completa de rodaje',
                '40 fotografías editadas',
                'Vídeo de 60 segundos, vertical y horizontal',
                'Dos teasers verticales de 15 segundos',
                'Dron — fotografía y vídeo aéreo',
                'Subtítulos y portadas',
                'Entrega en 5 días laborables',
              ],
            },
            {
              n: '03',
              t: 'Completo',
              count: '10 servicios',
              price: 'desde 3.400 €',
              rows: [
                'Todo lo de Signature',
                'Crepúsculo — hora dorada y después del ocaso, segunda visita',
                'FPV — un vuelo continuo por todo el inmueble',
                'Cuatro teasers verticales',
                'Página del inmueble con dominio propio',
                'Entrega en 7 días laborables',
              ],
              foot: 'Por separado: 4.300 €.',
            },
            {
              n: '04',
              t: 'A medida',
              count: 'Servicios sueltos',
              price: 'desde 950 €',
              rows: [
                'Montado alrededor del inmueble',
                'Cualquier servicio por separado',
                'Presupuesto el mismo día',
              ],
            },
          ],
        },
      ],
    },
    program: {
      eyebrow: '05 — AGENTES Y PROGRAMA',
      title: ['El agente es la otra', 'mitad de la venta'],
      lede: 'Un inmueble se rueda una vez. Un agente se rueda cada mes, y eso es lo que hace que sigan entrando encargos. Los guiones van incluidos: decimos qué rodar y qué decir ante la cámara.',
      groups: [
        {
          title: 'Una jornada de rodaje',
          packs: [
            {
              n: '01',
              t: 'Vídeo personal',
              count: '4 servicios',
              price: 'desde 850 €',
              rows: [
                'Media jornada de rodaje',
                'Un vídeo vertical de 20–30 segundos',
                'Guion y qué decir ante la cámara',
                'Subtítulos y portada',
              ],
            },
            {
              n: '02',
              t: 'Tres vídeos en un día',
              count: '4 servicios',
              price: 'desde 1.900 €',
              rows: [
                'Una visita — tres agentes, o tres vídeos',
                'Un guion para cada uno',
                'Subtítulos y portadas',
                'Entrega en 5 días laborables',
              ],
            },
            {
              n: '03',
              t: 'Jornada de agencia',
              count: '4 servicios',
              price: 'desde 2.900 €',
              rows: [
                'Cinco vídeos en una visita — 580 € por agente',
                'Un guion para cada uno',
                'Subtítulos y portadas',
                'Entrega en 7 días laborables',
              ],
            },
          ],
        },
        {
          title: 'Programa mensual · mínimo tres meses',
          packs: [
            {
              n: '01',
              t: 'Nivel uno',
              count: '4 vídeos al mes',
              price: 'desde 1.500 € / mes',
              rows: [
                'Cuatro vídeos al mes, con guion y edición',
                'Sesión de fotos del agente y de las propiedades',
                'Historias que mantienen el perfil vivo todo el mes',
                'Plan editorial mensual: qué se publica y qué día',
              ],
              foot: 'Por separado: 2.500 €. Permanencia mínima de tres meses: antes no se ve el efecto.',
            },
            {
              n: '02',
              t: 'Nivel dos',
              count: '6 vídeos al mes',
              price: 'desde 1.900 € / mes',
              note: 'EL MÁS ELEGIDO',
              rows: [
                'Seis vídeos al mes',
                'Hasta dos localizaciones',
                'Guiones y plan de publicación',
                '15% de descuento en todo lo demás',
              ],
            },
            {
              n: '03',
              t: 'Nivel tres',
              count: '8 vídeos al mes',
              price: 'desde 2.400 € / mes',
              rows: [
                'Ocho vídeos al mes',
                'Hasta tres localizaciones',
                'Guiones y plan de publicación',
                '20% de descuento en todo lo demás',
              ],
            },
            {
              n: '04',
              t: 'Avance de obra',
              count: '3 servicios',
              price: 'desde 750 € / mes',
              rows: [
                'Una visita al mes',
                'Vídeo de 30 segundos',
                'Mínimo tres meses',
              ],
            },
          ],
        },
      ],
    },
    project: {
      eyebrow: '06 — PROMOTORES',
      title: ['Véndalo antes', 'de que esté en pie'],
      lede: 'El precio va por inmueble, no por número de vistas — cuántos ángulos hacen falta para que un edificio se entienda lo decide el estudio. Dos rondas de correcciones incluidas en todo.',
      groups: [
        {
          title: 'Visualización',
          packs: [
            {
              n: '01',
              t: 'Concepto',
              count: '3 servicios',
              price: 'desde 950 €',
              rows: [
                'Una parcela, o un solo volumen',
                'Lo que habrá aquí, a partir de sus planos',
                'Dos rondas de correcciones',
              ],
            },
            {
              n: '02',
              t: 'Inmueble',
              count: '4 servicios',
              price: 'desde 1.900 €',
              rows: [
                'Villa o apartamento hasta 400 m²',
                'Exterior e interior',
                'Vídeo de 15 segundos de las mismas escenas',
                'Dos rondas de correcciones',
              ],
            },
            {
              n: '03',
              t: 'Gran inmueble',
              count: '4 servicios',
              price: 'desde 3.200 €',
              rows: [
                'Más de 400 m², varios bloques o fases',
                'Exterior e interior',
                'Vídeo de 30 segundos de las mismas escenas',
                'Dos rondas de correcciones',
              ],
            },
            {
              n: '04',
              t: 'Lanzamiento de proyecto',
              count: '3 servicios',
              price: 'desde 4.200 €',
              note: 'EMPIECE AQUÍ',
              rows: [
                'Visualización del inmueble',
                'Jornada de rodaje con dron cuando esté en pie',
                'La página del proyecto',
              ],
              foot: 'Por separado: 4.850 €.',
            },
          ],
        },
      ],
    },
    funnel: {
      eyebrow: '07 — SISTEMA PARA AGENCIAS',
      title: ['Cada consulta, contestada', 'en treinta segundos.'],
      lede: 'Un comprador escribe el sábado por la tarde y la agencia contesta el lunes; para entonces ya ha hablado con otras dos. Montamos el sistema que contesta al momento, pregunta lo que preguntaría el agente y lo deja todo en el CRM para la mañana. Funcionando en 21 días.',
      groups: [
        {
          title: 'Hecho para la agencia, se usa desde el móvil',
          packs: [
            {
              n: '01',
              t: 'Sistema IA',
              count: '8 piezas',
              price: 'desde 4.200 € + 350 €/mes',
              note: 'EL PRINCIPAL',
              rows: [
                'Asistente de WhatsApp en español, contesta en menos de 30 segundos a cualquier hora',
                'Pregunta cinco cosas: zona, presupuesto, plazo, financiación y tipo de inmueble',
                'CRM de leads con estado e historial: a quién llamar hoy, de un vistazo',
                'CRM inmobiliario: el texto del anuncio y las redes, escritos desde las fotos',
                'Las consultas de Idealista y Fotocasa entran al CRM y se contestan igual',
                'Quince automatizaciones de seguimiento; un lead caliente avisa al agente al momento',
                'Asistente de voz que coge las llamadas perdidas y deja la visita en la agenda',
                'Funcionando en 21 días, con dos reuniones de acompañamiento',
                'Sobre GoHighLevel; cualquier otro CRM se revisa antes de comprometer nada',
              ],
              foot: 'Pieza a pieza: 10.100 €. Si a los 60 días la agencia no ahorra al menos 8 horas a la semana, seguimos trabajando sin cobrar hasta conseguirlo.',
            },
            {
              n: '02',
              t: 'Web de agencia',
              count: '3 piezas',
              price: 'desde 1.900 €',
              rows: [
                'Conectada al CRM',
                'Las propiedades se cargan solas',
                'Cada formulario entra directo al sistema',
              ],
            },
            {
              n: '03',
              t: 'Página de una propiedad',
              count: '2 piezas',
              price: 'desde 600 €',
              rows: [
                'Su propia web para un inmueble de precio alto',
                'Las consultas van directas al CRM',
              ],
            },
            {
              n: '04',
              t: 'Auditoría de procesos',
              count: '3 piezas',
              price: 'desde 950 €',
              rows: [
                'Por dónde entran los contactos y dónde se pierden',
                'Qué merece automatizarse y qué no',
                'Un plan escrito con prioridades',
              ],
              foot: 'Consultoría por horas: 220 €. Acompañamiento mensual para agencias con equipo propio desde 1.450 €/mes.',
            },
          ],
        },
      ],
    },
    travel: {
      eyebrow: '08 — DESPLAZAMIENTO',
      title: ['¿Fuera de la', 'Costa del Sol?'],
      lede: 'Madrid, Ibiza, Dubái. Localizaciones y guiones se cierran antes de volar. Vuelos y alojamiento se facturan a coste, aparte.',
      groups: [
        {
          title: 'Fuera de la costa',
          packs: [
            {
              n: '01',
              t: 'Viaje 01',
              count: '4 servicios',
              price: 'desde 5.900 €',
              rows: [
                'Dos jornadas de rodaje',
                'Ocho vídeos terminados',
                'Localizaciones y guiones antes del viaje',
                'Subtítulos y plan de publicación',
              ],
            },
            {
              n: '02',
              t: 'Viaje 02',
              count: '5 servicios',
              price: 'desde 6.900 €',
              note: 'EL MÁS ELEGIDO',
              rows: [
                'Dos jornadas de rodaje',
                'Diez vídeos terminados',
                'Dron — fotografía y vídeo aéreo',
                'Localizaciones y guiones antes del viaje',
                'Subtítulos y plan de publicación',
              ],
            },
            {
              n: '03',
              t: 'Viaje 03',
              count: '5 servicios',
              price: 'desde 8.500 €',
              rows: [
                'Tres jornadas de rodaje',
                'Doce vídeos terminados',
                'Dron y FPV',
                'Localizaciones y guiones antes del viaje',
                'Subtítulos y plan de publicación',
              ],
            },
          ],
        },
      ],
    },
    how: {
      eyebrow: '09 — CÓMO FUNCIONA',
      title: ['Cuatro pasos, y', 'nada que preparar'],
      lede: 'La parte que la mayoría de los estudios deja vaga. Aquí está en orden, con las fechas por escrito antes de reservar nada.',
      steps: [
        {
          sn: '01',
          st: 'Envíe el inmueble',
          sd: 'Una dirección, los planos o un enlace al anuncio. El presupuesto vuelve el mismo día.',
        },
        {
          sn: '02',
          st: 'Elija el paquete',
          sd: 'Tres niveles o a medida. Lo que entra queda por escrito antes de reservar la jornada.',
        },
        {
          sn: '03',
          st: 'Día de rodaje',
          sd: 'Llegamos con el plan y el guion. Por su parte, nada que preparar salvo el acceso.',
        },
        {
          sn: '04',
          st: 'Entrega',
          sd: 'Cinco días laborables. Vertical y horizontal desde el principio, sin volver a montar nada.',
        },
      ],
    },
    faq: {
      eyebrow: '11 — PREGUNTAS',
      title: ['Las preguntas que', 'salen siempre'],
      lede: 'Lo de abajo es lo que ocurre de verdad, no lo que queda bien en una propuesta.',
      items: [
        {
          q: '¿Cuándo tenemos el material?',
          a: 'Cinco días laborables tras la jornada de rodaje, siete si el paquete incluye crepúsculo o página. En visualización, la primera vista vuelve en siete días.',
        },
        {
          q: '¿Cuántas rondas de correcciones entran?',
          a: 'Dos. La primera tras aprobar el volumen, la segunda tras luz y materiales. Lo que venga después se presupuesta aparte — y una vez aprobado el volumen, mover muros es presupuesto nuevo, no corrección.',
        },
        {
          q: 'El edificio todavía no existe.',
          a: 'Entonces es visualización, y es la razón por la que existe el estudio. El volumen se levanta sobre su parcela a partir de sus planos, con el sol en la posición que dan sus coordenadas reales.',
        },
        {
          q: '¿De quién es el material?',
          a: 'Suyo. El estudio pide aparte, por escrito, el derecho a mostrar el trabajo en su portfolio — y cualquier rebaja solo se da a cambio de algo así.',
        },
        {
          q: '¿Qué necesitan de nosotros ese día?',
          a: 'Acceso, llaves y la franja horaria. En visualización: planos, levantamiento, fotos del solar y la memoria de calidades, todo antes de empezar a modelar.',
        },
        {
          q: '¿Se desplazan?',
          a: 'Sí. La base es la Costa del Sol; todo lo demás está arriba en Desplazamiento, con vuelos y alojamiento a coste.',
        },
        {
          q: '¿Cómo se paga?',
          a: 'La mitad al reservar la jornada, la mitad a la entrega. Los programas mensuales se facturan cada mes, con un mínimo de tres.',
        },
        {
          q: '¿Y si el tiempo se estropea?',
          a: 'Se mueve el día. Una jornada se reserva contra un inmueble, no contra un parte meteorológico, y moverla no cuesta nada si se avisa el día antes.',
        },
      ],
    },
    vat: 'Todas las cifras son precios de entrada, IVA no incluido.',
  },

  ru: {
    packages: {
      eyebrow: '02 — ПАКЕТЫ',
      title: ['Всё, что нужно объекту,', 'за один выезд'],
      lede: 'Фотографии, ролик, дрон и страница — снято за один приезд и собрано одним взглядом. Цифра — вход для обычной виллы; объект крупнее считается в тот же день.',
      groups: [
        {
          title: 'По объекту',
          packs: [
            {
              n: '01',
              t: 'Объект',
              count: '5 позиций',
              price: 'от 1 400 €',
              rows: [
                'Полсмены на объекте',
                '25 обработанных фотографий',
                'Ролик 45 секунд, вертикально и горизонтально',
                'Субтитры и обложка',
                'Сдача 5 рабочих дней',
              ],
            },
            {
              n: '02',
              t: 'Подпись',
              count: '7 позиций',
              price: 'от 2 200 €',
              note: 'ЧАЩЕ ВСЕГО БЕРУТ',
              rows: [
                'Полная смена на объекте',
                '40 обработанных фотографий',
                'Ролик 60 секунд, вертикально и горизонтально',
                'Два вертикальных тизера по 15 секунд',
                'Дрон — аэрофото и аэровидео',
                'Субтитры и обложки',
                'Сдача 5 рабочих дней',
              ],
            },
            {
              n: '03',
              t: 'Полный',
              count: '10 позиций',
              price: 'от 3 400 €',
              rows: [
                'Всё из «Подписи»',
                'Сумерки — золотой час и после заката, второй заход',
                'FPV — один непрерывный полёт через объект',
                'Четыре вертикальных тизера',
                'Страница объекта с собственным доменом',
                'Сдача 7 рабочих дней',
              ],
              foot: 'Порознь то же самое — 4 300 €.',
            },
            {
              n: '04',
              t: 'Свой набор',
              count: 'Любые позиции',
              price: 'от 950 €',
              rows: [
                'Собирается под объект',
                'Любая позиция отдельно',
                'Смета в тот же день',
              ],
            },
          ],
        },
      ],
    },
    program: {
      eyebrow: '05 — АГЕНТУ И АБОНЕМЕНТ',
      title: ['Агент — вторая', 'половина сделки'],
      lede: 'Объект снимают один раз. Агента снимают каждый месяц, и именно это приводит новые объекты. Сценарии входят: говорим, что снимать и что сказать в кадре.',
      groups: [
        {
          title: 'Одна смена',
          packs: [
            {
              n: '01',
              t: 'Персональный ролик',
              count: '4 позиции',
              price: 'от 850 €',
              rows: [
                'Полсмены',
                'Один вертикальный ролик 20–30 секунд',
                'Сценарий и что говорить в кадре',
                'Субтитры и обложка',
              ],
            },
            {
              n: '02',
              t: 'Три ролика за день',
              count: '4 позиции',
              price: 'от 1 900 €',
              rows: [
                'Один выезд — три агента или три ролика',
                'Сценарий на каждый',
                'Субтитры и обложки',
                'Сдача 5 рабочих дней',
              ],
            },
            {
              n: '03',
              t: 'День агентства',
              count: '4 позиции',
              price: 'от 2 900 €',
              rows: [
                'Пять роликов за один выезд — 580 € за агента',
                'Сценарий на каждый',
                'Субтитры и обложки',
                'Сдача 7 рабочих дней',
              ],
            },
          ],
        },
        {
          title: 'Абонемент · минимум три месяца',
          packs: [
            {
              n: '01',
              t: 'Тариф первый',
              count: '4 ролика в месяц',
              price: 'от 1 500 € / мес',
              rows: [
                'Четыре ролика в месяц, сценарий и монтаж входят',
                'Фотосессия агента и объектов',
                'Сторис, чтобы профиль жил весь месяц',
                'План публикаций на месяц: что и в какой день',
              ],
              foot: 'По отдельности — 2 500 €. Минимум три месяца: раньше эффект не виден.',
            },
            {
              n: '02',
              t: 'Тариф второй',
              count: '6 роликов в месяц',
              price: 'от 1 900 € / мес',
              note: 'ЧАЩЕ ВСЕГО БЕРУТ',
              rows: [
                'Шесть роликов в месяц',
                'До двух локаций',
                'Сценарии и план публикаций',
                'Минус 15% на всё остальное',
              ],
            },
            {
              n: '03',
              t: 'Тариф третий',
              count: '8 роликов в месяц',
              price: 'от 2 400 € / мес',
              rows: [
                'Восемь роликов в месяц',
                'До трёх локаций',
                'Сценарии и план публикаций',
                'Минус 20% на всё остальное',
              ],
            },
            {
              n: '04',
              t: 'Ход стройки',
              count: '3 позиции',
              price: 'от 750 € / мес',
              rows: [
                'Выезд раз в месяц',
                'Ролик 30 секунд',
                'Минимум три месяца',
              ],
            },
          ],
        },
      ],
    },
    project: {
      eyebrow: '06 — ЗАСТРОЙЩИКУ',
      title: ['Продать до того,', 'как он построен'],
      lede: 'Цена по объекту, а не по числу видов — сколько нужно ракурсов, чтобы здание читалось, решает студия. Две волны правок входят везде.',
      groups: [
        {
          title: 'Визуализация',
          packs: [
            {
              n: '01',
              t: 'Концепция',
              count: '3 позиции',
              price: 'от 950 €',
              rows: [
                'Участок или один объём',
                'Что здесь будет — с ваших чертежей',
                'Две волны правок',
              ],
            },
            {
              n: '02',
              t: 'Объект',
              count: '4 позиции',
              price: 'от 1 900 €',
              rows: [
                'Вилла или апартаменты до 400 м²',
                'Снаружи и внутри',
                'Ролик 15 секунд из тех же сцен',
                'Две волны правок',
              ],
            },
            {
              n: '03',
              t: 'Большой объект',
              count: '4 позиции',
              price: 'от 3 200 €',
              rows: [
                'Свыше 400 м², несколько корпусов или очередей',
                'Снаружи и внутри',
                'Ролик 30 секунд из тех же сцен',
                'Две волны правок',
              ],
            },
            {
              n: '04',
              t: 'Запуск объекта',
              count: '3 позиции',
              price: 'от 4 200 €',
              note: 'С ЭТОГО НАЧИНАЮТ',
              rows: [
                'Визуализация объекта',
                'Съёмочная смена с дроном, когда он встанет',
                'Страница проекта',
              ],
              foot: 'Порознь то же самое — 4 850 €.',
            },
          ],
        },
      ],
    },
    funnel: {
      eyebrow: '07 — СИСТЕМА ДЛЯ АГЕНТСТВА',
      title: ['Каждая заявка — ответ', 'за тридцать секунд.'],
      lede: 'Покупатель пишет в субботу вечером, агентство отвечает в понедельник — а он уже поговорил с двумя другими. Мы ставим систему, которая отвечает сразу, спрашивает то, что спросил бы агент, и к утру всё уже лежит в CRM. Запуск за 21 день.',
      groups: [
        {
          title: 'Сделано под агентство, работает с телефона',
          packs: [
            {
              n: '01',
              t: 'Система ИИ',
              count: '8 частей',
              price: 'от 4 200 € + 350 €/мес',
              note: 'ГЛАВНОЕ',
              rows: [
                'Ассистент в WhatsApp на испанском: отвечает меньше чем за 30 секунд, днём и ночью',
                'Спрашивает пять вещей: район, бюджет, срок, финансирование, тип объекта',
                'CRM заявок со статусом и историей: кому звонить сегодня — видно сразу',
                'CRM объектов: текст объявления и посты для соцсетей — прямо из фотографий',
                'Заявки с Idealista и Fotocasa падают в CRM, и на них отвечают так же',
                'Пятнадцать автоматических касаний; горячую заявку система сразу отдаёт агенту',
                'Голосовой ассистент берёт пропущенные звонки и записывает на просмотр',
                'Запуск за 21 день, с двумя встречами по ходу',
                'На GoHighLevel; любая другая CRM проверяется до того, как что-то обещать',
              ],
              foot: 'По частям то же самое — 10 100 €. Если через 60 дней агентство не экономит хотя бы 8 часов в неделю, работаем бесплатно, пока не добьёмся.',
            },
            {
              n: '02',
              t: 'Сайт агентства',
              count: '3 части',
              price: 'от 1 900 €',
              rows: [
                'Связан с CRM',
                'Объекты подгружаются сами',
                'Каждая форма падает прямо в систему',
              ],
            },
            {
              n: '03',
              t: 'Страница одного объекта',
              count: '2 части',
              price: 'от 600 €',
              rows: [
                'Свой сайт для дорогого объекта',
                'Заявки идут прямо в CRM',
              ],
            },
            {
              n: '04',
              t: 'Аудит процессов',
              count: '3 части',
              price: 'от 950 €',
              rows: [
                'Откуда приходят заявки и где теряются',
                'Что стоит автоматизировать, а что нет',
                'Письменный план с приоритетами',
              ],
              foot: 'Консультация почасово — 220 €. Сопровождение агентства со своей командой — от 1 450 €/мес.',
            },
          ],
        },
      ],
    },
    travel: {
      eyebrow: '08 — ВЫЕЗД',
      title: ['Не на Коста-', 'дель-Соль?'],
      lede: 'Мадрид, Ибица, Дубай. Локации и сценарии разбираются до вылета. Перелёт и проживание — по счёту, сверху.',
      groups: [
        {
          title: 'За пределами побережья',
          packs: [
            {
              n: '01',
              t: 'Выезд 01',
              count: '4 позиции',
              price: 'от 5 900 €',
              rows: [
                'Два съёмочных дня',
                'Восемь готовых роликов',
                'Локации и сценарии до выезда',
                'Субтитры и план публикаций',
              ],
            },
            {
              n: '02',
              t: 'Выезд 02',
              count: '5 позиций',
              price: 'от 6 900 €',
              note: 'ЧАЩЕ ВСЕГО БЕРУТ',
              rows: [
                'Два съёмочных дня',
                'Десять готовых роликов',
                'Дрон — аэрофото и аэровидео',
                'Локации и сценарии до выезда',
                'Субтитры и план публикаций',
              ],
            },
            {
              n: '03',
              t: 'Выезд 03',
              count: '5 позиций',
              price: 'от 8 500 €',
              rows: [
                'Три съёмочных дня',
                'Двенадцать готовых роликов',
                'Дрон и FPV',
                'Локации и сценарии до выезда',
                'Субтитры и план публикаций',
              ],
            },
          ],
        },
      ],
    },
    how: {
      eyebrow: '09 — КАК ЭТО УСТРОЕНО',
      title: ['Четыре шага,', 'готовить ничего не надо'],
      lede: 'То, что большинство студий оставляет туманным. Здесь по порядку и со сроками, которые фиксируются письменно до брони.',
      steps: [
        {
          sn: '01',
          st: 'Пришлите объект',
          sd: 'Адрес, чертежи или ссылку на объявление. Смета возвращается в тот же день.',
        },
        {
          sn: '02',
          st: 'Выберите пакет',
          sd: 'Три уровня или свой набор. Состав фиксируется письменно до того, как смена забронирована.',
        },
        {
          sn: '03',
          st: 'Съёмочная смена',
          sd: 'Приезжаем с планом и сценарием. С вашей стороны готовить нечего, кроме доступа.',
        },
        {
          sn: '04',
          st: 'Сдача',
          sd: 'Пять рабочих дней. Вертикаль и горизонталь с самого начала — перемонтировать ничего не нужно.',
        },
      ],
    },
    faq: {
      eyebrow: '11 — ВОПРОСЫ',
      title: ['Вопросы, которые', 'задают каждый раз'],
      lede: 'Ниже то, что происходит на самом деле, а не то, что хорошо смотрится в коммерческом предложении.',
      items: [
        {
          q: 'Когда мы получим материал?',
          a: 'Пять рабочих дней после смены, семь — если в пакете сумерки или страница. По визуализации первый вид возвращается за семь дней.',
        },
        {
          q: 'Сколько волн правок входит?',
          a: 'Две. Первая после согласования объёма, вторая после света и материалов. Всё дальнейшее считается отдельно — а после утверждения объёма передвинуть стены значит новую смету, а не правку.',
        },
        {
          q: 'Объект ещё не построен.',
          a: 'Тогда это визуализация, ради неё студия и существует. Объём встаёт на вашем участке по вашим чертежам, а солнце — в том положении, которое дают реальные координаты.',
        },
        {
          q: 'Кому принадлежит материал?',
          a: 'Вам. Право показывать работу в портфолио студия просит отдельно и письменно — и любая уступка в цене даётся только в обмен на что-то подобное.',
        },
        {
          q: 'Что нужно от нас в день съёмки?',
          a: 'Доступ, ключи и время. Для визуализации — чертежи, обмеры, фотографии участка и ведомость материалов, всё до начала моделирования.',
        },
        {
          q: 'Вы выезжаете?',
          a: 'Да. База — Коста-дель-Соль, всё остальное в разделе «Выезд» выше, перелёт и проживание по счёту.',
        },
        {
          q: 'Как происходит оплата?',
          a: 'Половина при бронировании смены, половина при сдаче. Абонемент выставляется помесячно, минимум три месяца.',
        },
        {
          q: 'А если испортится погода?',
          a: 'День переносится. Смена бронируется под объект, а не под прогноз, и перенос ничего не стоит, если предупредить накануне.',
        },
      ],
    },
    vat: 'Все цифры — входные цены, без НДС.',
  },
}
