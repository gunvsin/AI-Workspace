# Decision Journal — 60–90 Day Post-Mortem Template

Complete this template **at decision time** (pre-mortem) and again **60–90 days later** (post-mortem).
The cognitive prompt (`system-prompts/production-cognitive-prompt.md`) produces the pre-mortem; this file stores the loop.

## Decision record (fill at decision time)

- **Date:** YYYY-MM-DD
- **Question:** (one line — what decision)
- **Options:** (list)
- **Chosen:** (which option)
- **Expected outcome:** (what should happen if right)
- **Confidence:** 1–100%
- **Bias checks completed:**
  - [ ] Sunk cost: "Ignore past spend — fresh $/time today, same choice?"
  - [ ] Confirmation: "What evidence would prove this wrong?"
  - [ ] Recency: "Am I overweighting the last 2 weeks?"
  - [ ] Optimism: "Am I assuming best-case probability?"
- **Pre-mortem:** assume failure at 18 months — what went wrong? (trace backward)
- **Cynefin domain:** Clear / Complicated / Complex / Chaotic
- **Steering profile:** Risk posture (Conservative/Balanced/Aggressive) + Focus (Financial/Balanced/QoL)
- **Simulated outcomes:** Nominal / Worst-Case / Optimal

## Post-mortem (fill 60–90 days later)

- **Review date:** (decision date + 60–90 days)
- **Actual outcome:** (what happened)
- **Predicted vs actual:** (delta)
- **Brier score:** (calibration — 0 = perfect, higher = worse)
- **Bias that hit:** (if any — name it, rate 1–10)
- **Lessons:** (what to remember — copy to brain/memory/semantic.md)
- **Counterfactual:** (what would have happened with the other option)

## Automation

- Cron: `0 9 */75 * *` (every 75 days) scans `Decision.reviewAt` and writes a ping to `brain/inbox/post-mortem/`
- Update `brain/memory/semantic.md` with the lesson line
- Track Brier scores over time to measure calibration drift
