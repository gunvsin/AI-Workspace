// PII scrub — regex redaction layer (peer-review critical #3)
// Apply to all user-derived strings before external LLM calls
// or API responses.

const PII_PATTERNS: RegExp[] = [
  /[\w.+-]+@[\w-]+\.[\w.]+/g,                                    // email
  /\b\d{3}-\d{2}-\d{4}\b/g,                                      // SSN
  /\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,       // phone
  /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,                    // credit card
]

export function scrubPII(text: string): string {
  return PII_PATTERNS.reduce((acc, p) => acc.replace(p, '[REDACTED]'), text)
}

export function scrubNote<T extends { title: string; content?: string }>(
  note: T
): T {
  return {
    ...note,
    title: scrubPII(note.title),
    ...(note.content ? { content: scrubPII(note.content) } : {}),
  }
}
