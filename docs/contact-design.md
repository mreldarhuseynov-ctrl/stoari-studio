# Final contact section

The contact section retains STOARI’s ivory, ink, square controls and existing typography. A clear invitation and direct contact sit beside a compact enquiry; the property photo stays separate from text. On mobile the image is omitted to bring the form forward.

Only name, email and project details appear initially. Company and timing remain available in an optional native disclosure. Persistent labels, autofill, semantic input types, native validation and 48px inputs support accessible completion. The submit action describes requesting a quote. No response-time, sales outcome or new price guarantee was added.

The existing enquiry payload, privacy notice and professional mailbox are retained. Sending disables duplicate submission and editing; after 20 seconds the request can recover. Failed acknowledgement keeps the fields visible and offers retry or a WhatsApp draft with the project details. Success requires handler acknowledgement, including on development builds. The floating CTA disappears once the contact section enters the viewport.

References reviewed on 6 October 2026:
- Homerun Brokers: direct contact routes and prominent invitation, https://www.homerunmarbella.com/contact-us
- ReneGonzMedia: project-specific quote request, https://renegonzmedia.com/contact
- Array: explicit shoot booking action, https://www.arraymedia.com/

Validation: lint, TypeScript, production build, backend mail-handler self-test without external mail; browser required-field validation, preserved inputs after mail failure, optional disclosure, synthetic local acknowledgement, responsive ES/EN/RU layouts. The later live test reached Spam; see delivery diagnosis below.

## Final review implementation — 6 October 2026

- The hero and contact copy include content production and CRM, with the existing three required fields.
- Package/CRM form links carry a visible, removable service selection into the form, PHP email and WhatsApp fallback. Draft text is not overwritten.
- All builds use the real PHP endpoint by default. Only explicit JSON boolean `ok: true` can show success; HTML 200, false/string acknowledgements, malformed JSON and HTTP errors cannot.
- Validation/rate-limit errors have localized explanations; failure keeps editable data. Status receives keyboard focus on failure/success. The existing 20-second timeout and double-submit prevention remain.
- A mobile navigation disclosure provides section/contact links, Escape and 44px controls. Hidden sticky CTA is excluded from keyboard and assistive technology, and hides while pricing or contact is visible.
- Canvas animation is clipped to the hero and scheduled only while the hero and document are visible.

Validation: unit HTTP fixtures for the browser request contract; PHP synthetic success/failure/Unicode/service/rate-limit checks; browser isolated mail failure, retry/success, retained data and service context; menu Escape/navigation at 320px. No test-only router or mail transport is included in the public build. Real mailbox receipt is recorded separately after the deployment test.

Live test: one authorized submission via the published browser form was accepted on 6 October 2026, with service CRM and marker `STOARI-TEST-061026-FORM`. The success panel received keyboard focus. Robert confirmed that this message arrived in Spam. The original message was inspected: `dkim=none`, `dmarc=fail` because the envelope sender was `noreply@srv2025.main-hosting.eu`, not the visible `stoari.com` sender. SPF/DKIM DNS records for Hostinger Mail already exist. Authenticated SMTP was activated after the owner entered the mailbox credential through a local hidden field. A new public-form submission with marker `STOARI-SMTP-061026` arrived in INBOX at 18:48 Madrid time on 6 October 2026. Read-only IMAP retrieval of that specific test confirmed `spf=pass`, `dkim=pass`, `dmarc=pass`, with `Return-Path: info@stoari.com`. The website displayed success. No spam-filter bypass or allowlist is applied.
