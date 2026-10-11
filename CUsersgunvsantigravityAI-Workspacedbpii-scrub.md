# PII Scrub Layer — spec gap (peer-review critical #3)

Before any external LLM call (or returning user-derived strings),
run regex scrub on titles + content.

## Scrub patterns

```js
const PII_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.]+/g,                    // email
  /\b\d{3}-\d{2}-\d{4}\b/g,                      // SSN
  /\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,  // phone
  /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,    // credit card
];
export function scrubPII(text) {
  return PII_PATTERNS.reduce((acc, p) => acc.replace(p, "[REDACTED]"), text);
}
```

## Where to apply

- `my-business-brain/app/api/entities/route.ts` — note.title
- `my-business-brain/app/api/dashboard/metrics/route.ts` — titles
- `my-business-brain/app/api/dashboard/explain/route.ts` — content passed to LLM
- `my-business-brain/app/api/capture/route.ts` — incoming text before storage (optional: store raw, scrub on output)

## Rule

External calls get scrubbed text only. Raw PII never leaves the DB boundary.
