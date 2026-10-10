# Shared Dashboard — Live Metrics + Animated Explainers

Zero-dependency static bundle: HTML + CSS + JS, no build step.
Runs **demo mode** out of the box (open `index.html` directly), or goes **live**
when the host project serves two optional endpoints.

## Run it now

```
python -m http.server 8080 --directory shared-dashboard
# open http://localhost:8080
```

Click any metric card → animated explainer panel slides open with the "why".
Ask box → posts to `/api/explain` (falls back to demo answers if absent).

## Integrate into a project (copy, don't import)

Projects stay independent — **no shared runtime code**. Copy the three files:

```
cp shared-dashboard/* <your-project>/public/dashboard/
```

Then serve two endpoints from that project:

| Method | Path            | In                              | Out                                    |
| ------ | --------------- | ------------------------------- | -------------------------------------- |
| GET    | `/api/metrics`  | —                               | `[{ id, label, value, delta, up, spark: number[], explain }]` |
| POST   | `/api/explain`  | `{ "question": "..." }`         | `{ "answer": "..." }`                  |

If either endpoint 404s, the dashboard silently uses built-in demo data.

## Wire the AI explainer to Claude

Example route (Next.js, `app/api/explain/route.ts`) — pass the question to
Claude with your metrics as context:

```ts
import { Anthropic } from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  const { question } = await req.json();
  const client = new Anthropic(); // ANTHROPIC_API_KEY in env
  const msg = await client.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 512,
    messages: [{ role: "user", content: `Metrics context: ...\nQuestion: ${question}` }],
  });
  return Response.json({ answer: msg.content[0].text });
}
```

Rule: the dashboard never holds keys. The host project's route owns auth,
reads its own env, and returns plain text — same pattern as my-business-brain's
`app/api/*` routes.

## Future projects

Same three files, same two endpoints. Anything that can serve HTTP can host it
(Next.js route handlers, FastAPI, Express, a static host + a tiny function).
Nothing here imports from another project, so lifecycles stay independent.
