export type EnquiryFailure = 'validation' | 'rate-limit' | 'unavailable'

export class EnquiryRequestError extends Error {
  kind: EnquiryFailure
  constructor(kind: EnquiryFailure) {
    super(kind)
    this.name = 'EnquiryRequestError'
    this.kind = kind
  }
}

/** A successful HTTP page response is not proof that an enquiry was accepted. */
export async function sendEnquiry(endpoint: string, fields: Record<string, string>, signal: AbortSignal) {
  const response = await fetch(endpoint, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(fields).toString(),
  })
  if (response.status === 429) throw new EnquiryRequestError('rate-limit')
  if (response.status === 422) throw new EnquiryRequestError('validation')
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new EnquiryRequestError('unavailable')
  }
  const acknowledgement: unknown = await response.json()
  if (!acknowledgement || typeof acknowledgement !== 'object'
      || !('ok' in acknowledgement) || acknowledgement.ok !== true) {
    throw new EnquiryRequestError('unavailable')
  }
}
