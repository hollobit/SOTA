# Sovereign AI — Country Leaderboard Competitiveness & Trend

**Date:** 2026-07-20
**Status:** Approved (design)
**Tab:** Sovereign AI (`dashboard/js/sovereign.js`, `dashboard/index.html`)

## Goal

Add a section to the Sovereign AI tab that compares each country's **top AI model
competitiveness across the major leaderboards / arenas / indices**, and shows the
**trend over time**. Users want to see, per country, how close the best sovereign
model is to the global frontier on each leaderboard, and how that gap moves.

## Data availability (verified)

Present in DB as benchmark ids (usable):

| Selector label | benchmark id | scale |
|---|---|---|
| LMArena / arena.ai Text | `arena_ai_text_elo` | Elo (~1000–1700) |
| Artificial Analysis (AAII v4.1) | `aa_intelligence_index_v4_1` | 0–100 index |
| LiveBench | `livebench` (fallback `livebench-overall`) | % |
| HuggingFace Open LLM v2 | `avg_open_llm_v2` | % |
| Epoch ECI | `epoch_capabilities_index` | index |
| arena.ai WebDev (coding) | `arena_webdev_elo` | Elo |

Time-series: `data/export/scores/history/*.json` — 60 daily snapshots
(2026-04-16 … 2026-07-20), each a full scores array `{model_id, benchmark_id, value, …}`.

**Excluded (not per-model live scores):** OpenRouter (token-usage ranking, not a
benchmark score), Stanford AI Index (annual report). Noted in a section footnote.

Country mapping: reuse `Sovereign.REGIONS` — each region has `code`, `label`,
`flag`, and a curated `models` list. A country's leaderboard value = the max score
among its `models` that have a value on that benchmark in the given snapshot.

## Scope

- Countries: the ~12 national regions with general LLMs (KR, CN, FR, JP, IN, IL,
  AE, SG, CH, CA, DE, UK). US frontier = 100% reference baseline (dotted), not a
  competitor line. Domain-only regions (us-legal, us-fin, darpa, mfg-*) are
  excluded (no general-leaderboard scores); regions with no data on the selected
  leaderboard are auto-filtered.
- Two metric modes: **gap-to-frontier %** (`countryBest / globalTop × 100`,
  comparable across leaderboards) and **raw score** (native scale).

## Components

### Chart ① Trend line (top) — `#sov-comp-trend`
- Controls (`#sov-comp-controls`): leaderboard `<select>`, Y-mode toggle
  (gap% / raw), period `<select>` (all / 6M / 3M). Mirrors existing
  `#sov-timeline-*` control styling.
- Series: one line per country (max ~12), computed from the 60 history snapshots.
  For each snapshot date: countryValue = max over `REGIONS[code].models` of the
  benchmark value; globalTop = max value across ALL models on that benchmark that
  snapshot. gap% = countryValue/globalTop×100. Missing → line gap (null), no
  interpolation. US frontier drawn as a 100% dotted markLine in gap% mode / the
  globalTop line in raw mode.
- Legend click toggles a country series.
- **Primary intent (user-emphasized):** the chart tracks how each country's
  competitiveness *changes over time, driven by its best-performing model*. The
  country line IS the trajectory of that country's top model per date. Tooltip at
  each point shows the country's top model name + raw score + gap%, so a rising
  line is legible as "which model lifted this country, and when." When the top
  model changes between dates (a newer release overtakes), the tooltip name
  changes accordingly — making leadership hand-offs visible.

### Chart ② Current cross-leaderboard heatmap (bottom) — `#sov-comp-heatmap`
- Rows = countries (~12), Columns = the 6 leaderboards, cell = **latest-snapshot
  gap%** (color intensity + printed value). ECharts heatmap.
- Cell click → `Modal.showScoreSource(topModelId, benchId)` for that country's
  best model on that leaderboard (reuses existing score-source modal).

## Architecture / boundaries

- `Sovereign._LEADERBOARDS` — array of `{id, label, scale}` (the 6 above). Single
  source of truth for both charts and the selector.
- `Sovereign._competitivenessSeries(bid, mode)` — **pure**: (history snapshots +
  REGIONS) → `{dates, series:[{country, values[]}], frontier[]}`. Unit-testable,
  no DOM. Caches per `(bid, mode)`.
- `Sovereign._competitivenessHeatmap()` — pure: latest snapshot → matrix
  `[{country, bench, gapPct, topModelId}]`.
- `Sovereign._renderCompetitiveness()` — ECharts render of both charts; wires
  controls. Called from `Sovereign.render()`.
- History access: add `App._ensureHistory()` (lazy fetch of the dated snapshots
  via `history/index.json`) if not already loaded, mirroring `_ensureScores`.
  If the full 60-file fetch is heavy, load only the dates needed for the selected
  period; default view = all.
- HTML: new `<section>` in `#tab-sovereign` with the 3 containers + a heading and
  the exclusion footnote.

## Performance

- Series computation runs only on leaderboard/mode/period change; results cached.
- Per snapshot only the REGIONS' curated models are scanned (tens), across 60
  snapshots → bounded. No per-render O(N²) over the full 18k-row score set.
- Target pure-render < 300 ms; measured via Playwright on a fresh port (per the
  menu-load-perf rule). Respects the shared-index pattern for the current-snapshot
  heatmap (`App.getScoreIndex().byModelBench`).

## Testing

- Unit-style check of `_competitivenessSeries`: frontier country = 100% in gap%
  mode; a country with no score on a bench → null (line gap); raw mode returns
  native values.
- Playwright: both charts render; leaderboard selector switches series; gap%↔raw
  toggle rescales; period filter trims the x-axis; heatmap cell click opens the
  score-source modal. Render time < 300 ms.

## Out of scope

- OpenRouter usage ranking and Stanford AI Index (no per-model live scores).
- New data ingestion — this feature is presentation-only over existing scores +
  history.
