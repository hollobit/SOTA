## Summary

<!-- 1-3 sentences: what changed and why -->

## Type of change

- [ ] New model added
- [ ] New benchmark / score
- [ ] Bug fix
- [ ] Feature
- [ ] Refactor / docs

## New model checklist (skip if N/A)

If you're adding a new model to seed JSON or enrichment YAML, verify:

- [ ] Primary source URL cited (vendor doc / arxiv / HF model card)
- [ ] Strict-attribution rule met: model name + benchmark name + value all appear together at the source URL
- [ ] No date paradox (e.g., 2026 model citing 2025-only benchmark results without scope note)
- [ ] If frontier-30: enrichment YAML entry includes architecture, links, pricing, benchmarks_meta where verifiable
- [ ] If sovereign region: added to dashboard/js/sovereign.js model list
- [ ] Loader still runs cleanly: `python3 scripts/load_benchmark_scores.py`
- [ ] Exporter still runs cleanly: `PYTHONPATH=. python3 -m cyber export`

## Test plan

<!-- What you tested. Include commands or screenshots if UI. -->

## Checklist

- [ ] `pytest tests/` passes
- [ ] `node dashboard/js/__tests__/peer-matcher.test.js` passes (if JS changes)
- [ ] No console errors in browser
