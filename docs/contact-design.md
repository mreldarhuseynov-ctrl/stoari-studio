# Final contact section

The contact section retains STOARI’s ivory, ink, square controls and existing typography. A clear invitation and direct contact sit beside a compact enquiry; the property photo stays separate from text. On mobile the image is omitted to bring the form forward.

Only name, email and project details appear initially. Company and timing remain available in an optional native disclosure. Persistent labels, autofill, semantic input types, native validation and 48px inputs support accessible completion. The submit action describes requesting a quote. No response-time, sales outcome or new price guarantee was added.

The existing enquiry payload, privacy notice and professional mailbox are retained. Sending disables duplicate submission and editing; after 20 seconds the request can recover. Failed acknowledgement keeps the fields visible and offers retry or a WhatsApp draft with the project details. Success requires handler acknowledgement, including on development builds. The floating CTA disappears once the contact section enters the viewport.

References reviewed on 6 October 2026:
- Homerun Brokers: direct contact routes and prominent invitation, https://www.homerunmarbella.com/contact-us
- ReneGonzMedia: project-specific quote request, https://renegonzmedia.com/contact
- Array: explicit shoot booking action, https://www.arraymedia.com/

Validation: lint, TypeScript, production build, backend mail-handler self-test without external mail; browser required-field validation, preserved inputs after mail failure, optional disclosure, synthetic local acknowledgement, responsive ES/EN/RU layouts. Real inbox receipt remains unverified.
