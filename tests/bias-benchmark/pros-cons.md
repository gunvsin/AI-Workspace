# Expert Research / Analysis — Pro / Cons (Production Prompt)

Compared to: standard chat prompt, simple system instruction, pure RAG retrieval, no mirrored constraints.

---

## PRE-MORTEM FIRST (Negative Constraint)

**PRO:** Eliminates optimism bias by forcing failure trace at 18 months before any recommendation. Prevents sunk-cost commitment to bad paths.
**CON:** Slows initial output; requires user patience for full `<analysis>` + `<simulated_outcomes>` cycle before decision.

---

## STRUCTURED XML OUTPUT (Mandatory Sections)

**PRO:** Prevents omission of bias detection or simulated outcomes; makes parsing/automation possible (`<bias_detection>` can be scraped for dashboards).
**CON:** Rigid for casual queries; overkill for simple info requests. Should be toggled per session (not always enforced).

---

## VECTOR MEMORY AUTO-PULL

**PRO:** References actual past decisions (brain/memory/) rather than generic advice; stops repetition of user-specific mistakes.
**CON:** Requires working `semantic.md` + embedding index; if memory is empty, pulls nothing — false confidence risk.

---

## DE-BIASING MIRROR + SOCrATIC DIRECTIVE

**PRO:** Builds cognitive friction; forces counter-argument to dominant framing; exposes hidden constraints.
**CON:** Can feel adversarial if user expects supportive validation; needs calibration by `STEERING_RISK` / `STEERING_FOCUS` to avoid excessive friction.

---

## CYNEFIN CLASSIFICATION

**PRO:** Prevents applying wrong framework (clear vs complex) — critical for decision quality.
**CON:** Adds step; user must understand domain classification; misclassification leads to wrong response style.

---

## STEERING SLIDERS (Risk / Focus)

**PRO:** Customizes output to user's actual preferences rather than generic "balanced" advice.
**CON:** Requires user to define sliders; if unset, output defaults to ambiguous middle.

---

## BENCHMARK / POST-MORTEM LOOP

**PRO:** Closes feedback loop; updates memory; prevents repeated errors over time.
**CON:** Needs persistent cron/job; if not maintained, framework degrades to static instructions.

---

## OVERALL VERDICT

Best for: high-stakes decisions, recurring patterns, users with documented history.
Overkill for: simple retrieval, first-time exploration, casual queries.

Recommendation: use as default for decision-analysis mode; allow toggling off XML structure for quick info queries.
