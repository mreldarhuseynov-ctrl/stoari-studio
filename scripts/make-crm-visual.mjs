// An explicit workflow diagram, not a fabricated screenshot or client data.
import { writeFile } from 'node:fs/promises'
const words = {
  es: ['Flujo de trabajo', 'Consultas', 'Cualificación', 'Seguimiento', 'Visitas'],
  en: ['Workflow', 'Enquiries', 'Qualification', 'Follow-up', 'Viewings'],
  ru: ['Рабочий процесс', 'Запросы', 'Квалификация', 'Сопровождение', 'Просмотры'],
}
for (const [lang, labels] of Object.entries(words)) {
  const cards = labels.slice(1).map((label, i) => {
    const y = 198 + i * 145
    return `<g transform="translate(58 ${y})"><rect width="424" height="110" fill="#fbf9f4"/><rect width="5" height="110" fill="${i === 3 ? '#8a6524' : '#d2c4aa'}"/><circle cx="48" cy="43" r="9" fill="none" stroke="#8a6524" stroke-width="2.5"/><path d="M32 73v-7c0-18 32-18 32 0v7" fill="none" stroke="#8a6524" stroke-width="2.5"/><text x="91" y="64" font-family="Arial,sans-serif" font-size="26" fill="#15171b">${label}</text></g>${i < 3 ? `<path d="M270 ${y+116}v24m-6-6 6 6 6-6" stroke="#8a6524" stroke-width="2" fill="none"/>` : ''}`
  }).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="810" viewBox="0 0 540 810"><rect width="540" height="810" fill="#e7e3db"/><rect x="0" y="0" width="540" height="124" fill="#15171b"/><text x="58" y="64" fill="#f3f0ea" font-size="30" font-family="Arial,sans-serif">CRM</text><text x="58" y="95" fill="#d2c4aa" font-size="18" font-family="Arial,sans-serif">${labels[0]}</text>${cards}</svg>\n`
  await writeFile(`public/services/crm-workflow-${lang}.svg`, svg)
}
