import { BRAND, type Lang } from './content'

import { LEGAL_COPY } from './legalCopy'

export function LegalFooter({ lang }: { lang: Lang }) {
  const c = LEGAL_COPY[lang]
  return (
    <footer className="legal-footer">
      <a className="footer-brand" href="#main">STOARI</a>
      <span>© {new Date().getFullYear()} Robert Di Gaetano</span>
      <div>
        <a href="/legal/">{c.legal}</a>
        <a href={BRAND.privacyUrl}>{c.privacy}</a>
        <a href="/cookies/">{c.cookies}</a>
      </div>
    </footer>
  )
}
