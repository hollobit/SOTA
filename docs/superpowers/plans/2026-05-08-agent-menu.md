# Agent Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a new `Agent` tab to the SOTA dashboard that renders four sub-sections (SOTA Watch / Categories / Frontier-vs-AgentProduct-vs-Edge Compare / Composite Leaderboard) over 10 hardcoded agentic categories, plus the underlying data — 14 new benchmarks, 19 new agent-product / edge-SLM models, ~60–100 new score rows, and 20 new Resources references.

**Architecture:** Hybrid pattern — `dashboard/js/agent.js` follows the AI4S/Cyber-Coding hybrid (hardcoded `CATEGORIES` array with explicit benchmark-id lists, no regex; data-driven SOTA queries from `App.data.scores`). New score data ingested via existing `scripts/load_benchmark_scores.py` pipeline. Modal extended with two new `scale_class` badges (`agent-product` amber, `edge-slm` green). Score sweep uses the Playwright pattern verified on 2026-05-08 for client-side rendered leaderboards. **DOM rendering follows the established pattern in `dashboard/js/medical-ai.js` and `ai4s.js` — string-built HTML assigned to host `.innerHTML`, with `_escape(s)` applied to every value pulled from `App.data` to neutralize XSS.**

**Tech Stack:** Vanilla JavaScript ES5, Tailwind utility classes, Python 3 (existing exporter and loader scripts), SQLite 3, Playwright MCP, pytest for backend tests.

**Reference Spec:** `docs/superpowers/specs/2026-05-08-agent-menu-design.md`

---

## File Structure

**Created:**
- `dashboard/js/agent.js` — main renderer (4 sub-sections), ~500 LOC
- `resource/zzzz...benchmarks_2026_05_08_scores.json` — 14 new benchmark registrations
- `resource/zzzz...agent_products_2026_05_08_scores.json` — 10 agent-product entries
- `resource/zzzz...edge_slms_2026_05_08_scores.json` — 9 edge-SLM entries
- `resource/zzzz...agent_score_sweep_2026_05_08_scores.json` — frontier coverage gap fill
- `config/edge_models_utility.json` — model_size_gb / ttft_ms / power_mw

**Modified:**
- `dashboard/index.html` — new tab button, panel, script include + cache-bust
- `dashboard/js/app.js` — tab activation switch case `'agent'`
- `dashboard/js/modal.js` — extend `_renderHeader` with two new badges
- `config/model_enrichment.yaml` — `scale_class` for 19 new + ~15 retags
- `config/seed_sources.yaml` — append 20 new Resources entries
- `dashboard/js/app.js` (renderResources) — append 20 new Resources sites
- `Plans.md`, `HISTORY.md`, `data/export/reports/changelog.json`

---

## Task Sequencing

| Group | Tasks | Depends on |
|-------|-------|------------|
| **A. UI scaffolding** | 1–9 | none |
| **B. Benchmark registration** | 10–12 | none |
| **C. Model registration + retag** | 13–17 | Task 8 (modal badge) must land first |
| **D. Frontier score sweep** | 18–24 | B and C |
| **E. Resources / docs / sync** | 25–28 | all above |

---

## Task 1: Add `Agent` tab button and panel to `index.html`

**Files:** Modify `dashboard/index.html`.

- [ ] **Step 1.1:** Run `grep -nE 'data-tab="(ai4s|explorer)"' dashboard/index.html`. Expected: line numbers for the existing AI4S and Explorer tab buttons.

- [ ] **Step 1.2:** Edit `dashboard/index.html`. Between the `data-tab="ai4s"` button and the `data-tab="explorer"` button, insert:

```
<button class="tab-btn" data-tab="agent" role="tab" aria-selected="false" aria-controls="tab-agent" id="tabbtn-agent" tabindex="-1">Agent</button>
```

- [ ] **Step 1.3:** Run `grep -nE '<section id="tab-(ai4s|explorer)"' dashboard/index.html` to find panel insertion point.

- [ ] **Step 1.4:** Insert the new panel after `tab-ai4s` `</section>`:

```
<section id="tab-agent" class="tab-content hidden" role="tabpanel" aria-labelledby="tabbtn-agent">
  <div class="space-y-8">
    <div id="agent-sota-watch"></div>
    <div id="agent-categories"></div>
    <div id="agent-compare"></div>
    <div id="agent-leaderboard"></div>
  </div>
</section>
```

- [ ] **Step 1.5:** Run `grep -c '<section id="tab-' dashboard/index.html` and `grep -c '</section>'` — both counts must be equal and the count must have grown by 1.

- [ ] **Step 1.6:** Stage and commit using message `feat(agent): add Agent tab button and panel scaffolding`.

---

## Task 2: Wire Agent tab into `app.js` activation switch

**Files:** Modify `dashboard/js/app.js`.

- [ ] **Step 2.1:** Run `grep -nE "case '(ai4s|physical-ai|medical-ai)':" dashboard/js/app.js` to locate the tab switch.

- [ ] **Step 2.2:** Insert the new case immediately after the `case 'ai4s'` block (mirror its style):

```
case 'agent':
  if (window.Agent) Agent.render();
  break;
```

- [ ] **Step 2.3:** Syntax-check by serving the file locally and loading the page in a browser; the DevTools console must show no `SyntaxError` referencing `app.js`. Alternative: use Node's syntax-only mode if available.

- [ ] **Step 2.4:** Stage and commit with message `feat(agent): wire Agent tab activation into app.js switch`.

---

## Task 3: Create `agent.js` skeleton with constants and placeholder render

**Files:** Create `dashboard/js/agent.js`.

- [ ] **Step 3.1: Create the module IIFE**

The file is structured as `var Agent = (function() { ... })();` exposing `{ render, _CATEGORIES, _SOTA_WATCH, _AGENT_PRODUCTS, _EDGE_SLMS, _allAgentBenchmarks }`.

Define `CATEGORIES` as an array of 10 entries in display order. Each has `key`, `icon`, `label`, `benchmarks` (array). Special fields: `domain` adds `crossListed: ['medical-ai','ai4s']`; `safety` adds `lower_better` array; `edge` adds `utility_emphasis: true`.

| key | icon | label | benchmark IDs |
|-----|------|-------|---------------|
| coding | 💻 | Coding Agents | `swe_bench_verified`, `swe_bench_pro`, `swe_bench_verified_mini`, `swe_bench_multilingual`, `swe_bench_multimodal`, `swe_rebench`, `multi_swe_bench`, `swe_polybench`, `expert_swe`, `aider_polyglot`, `swe_lancer`, `mle_bench`, `usaco` |
| web-browse | 🌐 | Web & Browsing | `browsecomp`, `browsecomp_plus`, `browsecomp_agent_swarm`, `gaia`, `gaia2`, `webarena`, `appworld` |
| os-computer | 🖥️ | OS / Computer Use | `osworld`, `osworld_verified`, `windows_agent_arena`, `the_agent_company` |
| tool-use | 🔧 | Tool Use & Function Calling | `bfcl`, `bfcl_v3`, `bfcl_v3_live`, `bfcl_v3_multi_turn`, `bfcl_v4`, `bfcl_v4_web_search` |
| mcp | 🔌 | MCP | `mcp_bench`, `mcp_atlas`, `mcpatlas_public`, `mcpmark`, `livemcpbench` |
| customer-service | 💼 | Customer Service / Multi-turn | `tau_bench`, `tau2_bench`, `tau2_airline`, `tau2_retail`, `tau2_telecom`, `tau3_bench`, `tau3_telecom` |
| domain | 🧪 | Domain-Specific Agents | `finance_agent`, `scienceagentbench`, `agentclinic_medqa`, `agentclinic_nejm`, `medagentbench`, `medagentsbench` |
| safety | 🛡️ | Agent Safety & Security | `agentdojo_targeted_asr`, `agentdojo_utility`, `injecagent`, `browserart`, `anthropic_shade_browser_asr_attempts`, `anthropic_shade_browser_asr_scenarios`, `anthropic_shade_browser_asr_with_safeguards`, `agent_red_teaming`, `agentsmith_inf` |
| general | 🚀 | General / Composite | `apex_agents`, `apex_agents_hard`, `terminal_bench_2`, `terminal_bench_hard`, `hal_overall_accuracy_at_fixed_cost` |
| edge | 📱 | On-device / Edge Agents | `mobile_actions`, `healthslm_bench`, `mobile_agent_bench`, `mobilebench_v2`, `mobilebench_xiaomi`, `mlperf_mobile_llm`, `mlperf_inference_edge_v5_1`, `mlperf_tiny_v1_2`, `tinyml_energy_v1`, `function_gemma_calling` |

The `safety.lower_better` array contains every safety benchmark ID **except** `agentdojo_utility`.

`SOTA_WATCH` (array of 4 `{ benchmark, label, icon }`):
- `swe_bench_verified` → "Top Coder" 💻
- `browsecomp` → "Top Web Agent" 🌐
- `osworld_verified` → "Top OS Agent" 🖥️
- `agentdojo_utility` → "Best Defense" 🛡️

`AGENT_PRODUCTS` (10 IDs): `anthropic/claude-code`, `openai/codex-cli`, `cursor/composer`, `replit/agent`, `cognition/devin`, `manus-ai/manus`, `anthropic/computer-use`, `google/mariner`, `openai/operator`, `anthropic/claude-cowork`.

`EDGE_SLMS` (9 IDs): `apple/foundation-3b`, `apple/foundation-private-cloud`, `microsoft/phi-4-mini-instruct`, `microsoft/phi-4`, `google/gemma-3-270m`, `google/gemma-3n`, `google/function-gemma`, `meta/llama-3.2-1b-instruct`, `meta/llama-3.2-3b-instruct`.

`UTILITY_METRICS` starts as `{}`.

Helpers (full bodies added in Tasks 4–7):
- `_allAgentBenchmarks()` returns the flat union of every category's benchmark IDs
- `_bootValidate()` — `console.warn` if any hardcoded ID is missing from `App.data.benchmarks`
- `render()` — for now sets each of 4 panel divs to a placeholder string

DOM construction (subsequent tasks) follows the established pattern in `dashboard/js/medical-ai.js`. `_escape(s)` defined as `String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')` is used on every value pulled from `App.data`.

- [ ] **Step 3.2:** Register the script in `dashboard/index.html`. Run `grep -nE 'src="js/ai4s\.js' dashboard/index.html`. After that line add `<script src="js/agent.js?v=20260508a"></script>`.

- [ ] **Step 3.3:** Smoke check served HTML: `(cd dashboard && python3 -m http.server 8765 >/tmp/s.log 2>&1 &) ; sleep 1 ; curl -s http://localhost:8765/index.html | grep -c 'data-tab="agent"' ; pkill -f "python3 -m http.server 8765" 2>/dev/null`. Expected output: `1`.

- [ ] **Step 3.4:** Open the page in a browser, click `Agent` tab, observe DevTools console — there must be no `ReferenceError: Agent is not defined` or other JS-load errors.

- [ ] **Step 3.5:** Stage and commit with message `feat(agent): scaffold agent.js with CATEGORIES + SOTA_WATCH + placeholder render`.

---

## Task 4: Implement `_renderSOTAWatch()` (4 tiles)

**Files:** Modify `dashboard/js/agent.js`.

- [ ] **Step 4.1: Add helpers**

Inside the IIFE, above `render()`, add five helpers:

- `_scoresFor(benchmarkId)` — iterate `App.data.scores` (defensive null checks); return entries whose `benchmark_id` matches.
- `_topModel(benchmarkId, lowerBetter)` — call `_scoresFor`, sort by `value` desc (or asc if `lowerBetter`), return `rows[0]` or null.
- `_modelDisplayName(modelId)` — search `App.data.models` for `id === modelId`; return its `name` or fall back to the id.
- `_benchmarkName(benchmarkId)` — same pattern for `App.data.benchmarks`.
- `_escape(s)` — return `String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')`.

- [ ] **Step 4.2: Add `_renderSOTAWatch` renderer**

Builds an HTML string for the 4 SOTA tiles:

1. Heading "SOTA Watch", responsive Tailwind grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`.
2. For each entry in `SOTA_WATCH`, call `_topModel(w.benchmark, false)`. If null → render an amber-bordered "No scores for X" tile. Otherwise render a tile with icon + label, model display name (escaped), raw value, benchmark name (escaped), and `data-bench` attribute for the click handler.
3. After setting host innerHTML, attach a `click` listener on `[data-bench]` calling `Modal.showBenchmark(bench)` if it exists.

- [ ] **Step 4.3:** In `render()`, replace the placeholder line for SOTA Watch with `_renderSOTAWatch();`.

- [ ] **Step 4.4:** Bump cache-bust in `dashboard/index.html` from `agent.js?v=20260508a` to `agent.js?v=20260508b`.

- [ ] **Step 4.5: SQL truth check**

Run `sqlite3 data/benchmark.db "SELECT model_id, value FROM scores WHERE benchmark_id IN ('swe_bench_verified','browsecomp','osworld_verified','agentdojo_utility') ORDER BY benchmark_id, value DESC;"`. Top model per benchmark should match what the SOTA Watch displays.

- [ ] **Step 4.6: Browser smoke**

Local serve, click Agent tab. All 4 tiles must show a model name + score. Tiles for benchmarks with 0 scores show "No scores for ..." (graceful fallback), not a JS error.

- [ ] **Step 4.7:** Stage and commit with message `feat(agent): render SOTA Watch tiles`.

---

## Task 5: Implement `_renderCategories()` (10 cards, edge spans full row)

**Files:** Modify `dashboard/js/agent.js`.

- [ ] **Step 5.1: Add `_categoryStats(cat)` helper**

For each benchmark in `cat.benchmarks`, gather `_scoresFor(bid)`. Compute `benchCount = cat.benchmarks.length`, `modelCount = unique model IDs across rows`, `totalScores = sum of row counts`.

Build `modelBest` keyed by `model_id`: for each model, find its highest *normalized* score across the category. Normalization: `lowerBetter ? (1 - v/maxV) * 100 : (v/maxV) * 100`, where `lowerBetter` is true when the benchmark id is in `cat.lower_better` (set lookup).

Sort `modelBest` descending by `norm` and slice top 3. Return `{ benchCount, modelCount, totalScores, top3 }`.

- [ ] **Step 5.2: Add `_renderCategoryCard(cat)` helper**

Renders one card. Components:

1. Heading `<icon> <label>` plus an amber `Also in <crossListed>` badge when `cat.crossListed`.
2. Metric line `<benchCount> benchmarks · <modelCount> models · <totalScores> scores`.
3. Microtext `↓ lower-better for ASR/jailbreak rows` when `cat.lower_better && cat.lower_better.length`.
4. Ordered list of top-3 entries (model name escaped + raw value + benchmark name). Fallback `No scores yet.` when empty.

Outer classes default to `rounded border bg-white p-4 cursor-pointer hover:shadow`. When `cat.utility_emphasis`, prepend `col-span-1 md:col-span-3` so the card spans the full row.

Add `data-cat="<cat.key>"` for click handling.

- [ ] **Step 5.3: Add `_renderCategories()` renderer**

Sets the `agent-categories` host innerHTML to a heading "Categories" + a `grid grid-cols-1 md:grid-cols-3 gap-3` wrapping each `_renderCategoryCard(cat)`. After rendering, attach click listener on `[data-cat]` that for v1 just `console.log("[Agent] category click:", key)`.

- [ ] **Step 5.4:** In `render()`, replace the placeholder line with `_renderCategories();`.

- [ ] **Step 5.5:** Bump cache-bust to `agent.js?v=20260508c`.

- [ ] **Step 5.6: SQL spot check Coding category**

Run `sqlite3 data/benchmark.db "SELECT COUNT(*) FROM scores WHERE benchmark_id IN ('swe_bench_verified','swe_bench_pro','swe_bench_verified_mini','swe_bench_multilingual','swe_bench_multimodal','swe_rebench','multi_swe_bench','swe_polybench','expert_swe');"`. The number must equal the Coding card's "n scores" line.

- [ ] **Step 5.7: Browser smoke**

Open Agent tab. Verify:
- All 9 standard cards render with non-zero benchmark count.
- The 10th card (`📱 On-device / Edge`) spans the full row.
- Domain card shows the amber `Also in medical-ai / ai4s` badge.
- Safety card shows the `↓ lower-better` microtext.
- Each card lists top-3 models (or shows "No scores yet" when data sweep hasn't run).

- [ ] **Step 5.8:** Stage and commit with message `feat(agent): render 10 category cards with normalized top-3`.

---

## Task 6: Implement `_renderCompare()` (3-column with switchable benchmark)

**Files:** Modify `dashboard/js/agent.js`.

- [ ] **Step 6.1: Add `COMPARE_BENCHMARKS` constant** (9 entries `{id, label}`):

| id | label |
|----|-------|
| `swe_bench_verified` | SWE-bench Verified |
| `swe_bench_pro` | SWE-bench Pro |
| `terminal_bench_2` | Terminal-Bench 2.0 |
| `osworld_verified` | OSWorld-Verified |
| `gaia` | GAIA |
| `tau2_bench` | τ2-Bench |
| `bfcl_v4` | BFCL v4 |
| `mobile_actions` | Mobile Actions |
| `mobile_agent_bench` | MobileAgentBench |

The first entry is the default selection.

- [ ] **Step 6.2: Add `_modelClass(modelId)` helper**

Returns `'agent-product'` if id is in `AGENT_PRODUCTS`, `'edge-slm'` if in `EDGE_SLMS`, otherwise `'frontier'`.

- [ ] **Step 6.3: Add `_utilityFor(modelId)`** — returns `UTILITY_METRICS[modelId] || {}`.

- [ ] **Step 6.4: Add `_renderCompareColumn(rows, klass, showSize)` helper**

Renders a `<table>` for one column. Columns: rank, escaped model name, raw value. Add a `Size` column when `showSize === true`, populating from `_utilityFor(r.model_id).size_gb` rendered as `X GB` or `—`. Cap at 10 rows. If `rows` is empty, return `<div class="text-meta text-gray-500 italic">No data</div>`.

- [ ] **Step 6.5: Add `_renderCompare(benchmarkId)` renderer**

Renders the Compare panel for the selected benchmark (`benchmarkId || COMPARE_BENCHMARKS[0].id`):

1. Call `_scoresFor(bid)`.
2. Bucket rows into `frontier`, `product`, `edge` arrays via `_modelClass`.
3. Sort each bucket descending by `value`.
4. Build HTML: heading "Frontier vs Agent-Product vs On-device/Edge", a `<select id="agent-compare-bench">` populated from `COMPARE_BENCHMARKS`, then a `grid grid-cols-1 md:grid-cols-3 gap-3` wrapping three boxes — one per bucket — each with a heading and the result of `_renderCompareColumn`. The Edge column passes `showSize = true`.
5. After setting innerHTML, attach a `change` listener on the dropdown that calls `_renderCompare(e.target.value)` (re-renders).

- [ ] **Step 6.6:** In `render()`, replace the Compare placeholder with `_renderCompare();`.

- [ ] **Step 6.7:** Bump cache-bust to `agent.js?v=20260508d`.

- [ ] **Step 6.8: Browser smoke**

Open Agent tab. Verify three columns with headings "Frontier (general-purpose)", "Agent products", "On-device / Edge". Default benchmark is SWE-bench Verified. Frontier column has rows. Switching the dropdown to "Terminal-Bench 2.0" re-renders all three columns.

- [ ] **Step 6.9:** Stage and commit with message `feat(agent): render 3-column Compare panel with switchable benchmark`.

---

## Task 7: Implement `_renderLeaderboard()` (composite agent score)

**Files:** Modify `dashboard/js/agent.js`.

- [ ] **Step 7.1: Add `_allLowerBetterSet()`** — returns a set of every benchmark id listed in any category's `lower_better` array.

- [ ] **Step 7.2: Add `_benchmarkMaxes(benchIds)`** — for each id, compute the max value across `_scoresFor(bid)`. Return `{ bid: maxValue }`.

- [ ] **Step 7.3: Add `_compositeScores()`** — returns `{ rows, totalBenchmarks }`:

1. Build `byModel = { model_id: { sum, count } }`.
2. For every (benchmark, score row) pair: compute normalized score (`(1 - value/max) * 100` for lower-better; `(value/max) * 100` otherwise). Skip when `max` is 0.
3. Add normalized to `byModel[mid].sum`, increment `count`.
4. Result array: include only models where `count >= 3`. Each entry `{ model_id, agent_score: sum/count, coverage: count }`.
5. Sort by `agent_score` desc, tie-break by `coverage` desc.

- [ ] **Step 7.4: Add `_vendorOf(modelId)`** — returns `App.data.models[i].vendor || ''` for matching id.

- [ ] **Step 7.5: Add `_classLabel(klass)`** — maps `'agent-product'` → `'Agent-Product'`, `'edge-slm'` → `'Edge-SLM'`, else `'Frontier'`.

- [ ] **Step 7.6: Add `_renderLeaderboard()` renderer**

Sets `agent-leaderboard` innerHTML to:

1. Heading "Composite Agent Score (Top 25)".
2. Disclaimer: `Coverage threshold: ≥ 3 agentic benchmarks. Total tracked: <N>. Safety ASR / jailbreak rows inverted (lower-better).`
3. A `<table>` with columns Rank / Model / Vendor / Class / Agent Score / Coverage. Show top 25 rows. Agent Score uses `r.agent_score.toFixed(1)`. Coverage shows `coverage / totalBenchmarks` as `N/M`.

Each `<tr>` carries `data-model="<modelId>"`. Click listener calls `Modal.showModel(modelId)` if it exists.

- [ ] **Step 7.7:** In `render()`, replace the leaderboard placeholder with `_renderLeaderboard();`.

- [ ] **Step 7.8:** Bump cache-bust to `agent.js?v=20260508e`.

- [ ] **Step 7.9: SQL truth check** — run a query that lists the top-5 model IDs by count of distinct agentic benchmarks scored. The leaderboard's top entries should overlap (with normalization adjusting their order slightly).

- [ ] **Step 7.10: Browser smoke** — table renders 6 columns, top model has Class `Frontier`, Coverage shows `N/M`. Clicking a row opens a model modal (or no-op gracefully).

- [ ] **Step 7.11:** Stage and commit with message `feat(agent): render composite leaderboard with normalized agent_score`.

---

## Task 8: Extend modal `_renderHeader` with `agent-product` and `edge-slm` badges

**Files:** Modify `dashboard/js/modal.js`.

- [ ] **Step 8.1:** Run `grep -nE "scale_class" dashboard/js/modal.js` to find the existing scale_class branch (renders amber pills for `agent-system`, `narrow-ml`, etc.).

- [ ] **Step 8.2:** Edit `dashboard/js/modal.js`. In `_renderHeader`, add two branches near the existing `agent-system` branch:

- When `sc === 'agent-product'`: amber pill `<span class="ml-2 inline-block rounded bg-amber-100 text-amber-800 text-meta px-2 py-0.5">🛠️ Agent Product</span>`.
- When `sc === 'edge-slm'`: green pill `<span class="ml-2 inline-block rounded bg-green-100 text-green-800 text-meta px-2 py-0.5">📱 Edge SLM</span>`.

Mirror the if/else style of surrounding branches.

- [ ] **Step 8.3:** Bump `modal.js?v=` cache-bust in `dashboard/index.html`.

- [ ] **Step 8.4:** Browser smoke — open any existing model modal already classified `agent-system`; the amber badge must still render (no regression). The two new badges only appear after Task C registers entries with the new classes.

- [ ] **Step 8.5:** Stage and commit with message `feat(modal): add agent-product and edge-slm scale_class badges`.

---

## Task 9: End-to-end UI smoke test (no-data state)

**Files:** No edits.

- [ ] **Step 9.1:** `(cd dashboard && python3 -m http.server 8765 >/tmp/s.log 2>&1 &) ; sleep 1`.

- [ ] **Step 9.2:** Run `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8765/index.html`. Expected: `200`.

- [ ] **Step 9.3:** Run `curl -s "http://localhost:8765/index.html" | grep -E 'data-tab="agent"|tab-agent' | wc -l`. Expected ≥ 2.

- [ ] **Step 9.4:** Open the page in a browser, click Agent tab. DevTools console: 0 errors. Warnings about missing benchmark IDs are expected if Tasks B/C/D haven't run yet.

- [ ] **Step 9.5:** `pkill -f "python3 -m http.server 8765" 2>/dev/null || true`.

- [ ] **Step 9.6:** No commit unless fixes were applied.

---

## Task 10: Register 14 new benchmarks via ingest JSON

**Files:** Create `resource/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz_agent_benchmarks_2026_05_08_scores.json`.

- [ ] **Step 10.1: Resolve primary sources**

For each of these 13 candidate URLs, run `curl -sI -L -o /dev/null -w "%{http_code}\n" <url>` and confirm a 2xx or 3xx status:

- `https://aider.chat/docs/leaderboards/`
- `https://github.com/openai/mle-bench`
- `https://hal.cs.princeton.edu/usaco`
- `https://appworld.dev/leaderboard`
- `https://hal.cs.princeton.edu/`
- `https://mobileagentbench.github.io/`
- `https://arxiv.org/abs/2505.11891`
- `https://github.com/XiaoMi/MobileBench`
- `https://mlcommons.org/benchmarks/inference-mobile/`
- `https://mlcommons.org/benchmarks/inference-edge/`
- `https://mlcommons.org/benchmarks/inference-tiny/`
- `https://arxiv.org/abs/2505.15622`
- `https://github.com/google-ai-edge/LiteRT-LM`

For SWE-Lancer the primary source is the OpenAI blog post or arxiv preprint — use whichever is canonical at implementation time.

- [ ] **Step 10.2: Write the ingest file**

The JSON has top-level `_meta` (collected_at, _note about Task B benchmark registration only), a `benchmarks` array of 14 entries, and an empty `scores: []`. Each entry: `id`, `name`, `_source` (URL from Step 10.1), and `_note` (one short sentence).

The 14 benchmark IDs must be exactly: `aider_polyglot`, `swe_lancer`, `mle_bench`, `usaco`, `appworld`, `hal_overall_accuracy_at_fixed_cost`, `mobile_agent_bench`, `mobilebench_v2`, `mobilebench_xiaomi`, `mlperf_mobile_llm`, `mlperf_inference_edge_v5_1`, `mlperf_tiny_v1_2`, `tinyml_energy_v1`, `function_gemma_calling`. These match the IDs hardcoded in `agent.js CATEGORIES` (Task 3).

- [ ] **Step 10.3:** Run `python3 -c "import json; json.load(open('resource/zzzz...agent_benchmarks_2026_05_08_scores.json'))"` to validate syntax (use the actual full filename).

- [ ] **Step 10.4:** Run `python scripts/load_benchmark_scores.py resource/zzzz...agent_benchmarks_2026_05_08_scores.json 2>&1 | tail -3`. Expected: tail line shows `Loaded N models, M benchmarks, K scores` where M grew by 14.

- [ ] **Step 10.5:** Run `sqlite3 data/benchmark.db "SELECT id FROM benchmarks WHERE id IN ('aider_polyglot','swe_lancer','mle_bench','usaco','appworld','hal_overall_accuracy_at_fixed_cost','mobile_agent_bench','mobilebench_v2','mobilebench_xiaomi','mlperf_mobile_llm','mlperf_inference_edge_v5_1','mlperf_tiny_v1_2','tinyml_energy_v1','function_gemma_calling');" | wc -l`. Expected: `14`.

- [ ] **Step 10.6:** Stage and commit with message `data: register 14 new agentic benchmarks`.

---

## Task 11: Run exporter and confirm benchmarks.json updated

**Files:** Generated `data/export/benchmarks.json`.

- [ ] **Step 11.1:** Run `python -m cyber export 2>&1 | tail -2`. Expected: `Exported data to /Users/user/git/cyber/data/export`.

- [ ] **Step 11.2:** Run a Python one-liner that loads `data/export/benchmarks.json`, builds a set of present IDs, and prints `missing: []` after checking the 14 expected IDs.

- [ ] **Step 11.3:** Stage `data/export/benchmarks.json`, `data/export/sota.json`, plus any other auto-touched export files in `data/export/scores/`.

- [ ] **Step 11.4:** Commit with message `data: re-export benchmarks.json after agent benchmark registration`.

---

## Task 12: Cross-check that every `agent.js` benchmark id is now in the DB

**Files:** No edits.

- [ ] **Step 12.1:** Extract benchmark-like IDs referenced from `agent.js` (use `grep -oE "'[a-z0-9_]+'" dashboard/js/agent.js | sort -u`). Filter to plausible benchmark names (no `/`, snake_case, ≥4 chars, common prefixes such as `swe_`, `tau`, `bfcl`, `mcp`, `gaia`, `osworld`, `agent`, `mobile`, `mlperf`).

- [ ] **Step 12.2:** Cross with `sqlite3 data/benchmark.db "SELECT id FROM benchmarks ORDER BY id;"`. Expected: every filtered candidate from Step 12.1 is present in the DB. If any are missing, return to Task 10.

- [ ] **Step 12.3:** No commit (verification only).

---

## Task 13: Register 10 agent-product wrapper models

**Files:** Create `resource/zzzz...agent_products_2026_05_08_scores.json`.

- [ ] **Step 13.1: Write ingest file**

Top-level `_meta` block, a `models` array with 10 entries, and empty `scores: []`. Each model entry has:

- `id` — one of the 10 strings in `AGENT_PRODUCTS` (Task 3)
- `vendor` — vendor name with country, e.g. "Anthropic (USA)"
- `name` — display name, e.g. "Claude Code (CLI)"
- `type` — `"proprietary"`
- `modalities` — typically `["text"]`; Computer Use / Mariner / Operator add `"image"`
- `release_date` — best-effort YYYY-MM-DD from the official launch announcement
- `_source` — official product URL

The 10 IDs must match `AGENT_PRODUCTS` exactly (Task 3). Cross reference Spec Section 5C for canonical primary URLs.

- [ ] **Step 13.2:** Validate JSON, then run loader `python scripts/load_benchmark_scores.py resource/zzzz...agent_products_2026_05_08_scores.json 2>&1 | tail -2`.

- [ ] **Step 13.3:** Run `sqlite3 data/benchmark.db "SELECT id FROM models WHERE id IN ('anthropic/claude-code','openai/codex-cli','cursor/composer','replit/agent','cognition/devin','manus-ai/manus','anthropic/computer-use','google/mariner','openai/operator','anthropic/claude-cowork');" | wc -l`. Expected: `10`.

- [ ] **Step 13.4:** Stage and commit with message `data: register 10 agent-product wrapper models`.

---

## Task 14: Register 9 edge-SLM models

**Files:** Create `resource/zzzz...edge_slms_2026_05_08_scores.json`.

- [ ] **Step 14.1: Write ingest file**

Same shape as Task 13 with 9 entries. The `id` values must match `EDGE_SLMS` in `agent.js` exactly. `type` is `"open-weight"` for all except the two Apple entries (`"proprietary"`). Add `parameters` (3B, 3.8B, 14B, 270M, 1B, 3B). `_source` points to the canonical HuggingFace, GitHub, or Apple ML page.

- [ ] **Step 14.2:** Validate JSON, run loader.

- [ ] **Step 14.3:** Run `sqlite3 data/benchmark.db "SELECT id FROM models WHERE id IN ('apple/foundation-3b','apple/foundation-private-cloud','microsoft/phi-4-mini-instruct','microsoft/phi-4','google/gemma-3-270m','google/gemma-3n','google/function-gemma','meta/llama-3.2-1b-instruct','meta/llama-3.2-3b-instruct');" | wc -l`. Expected: `9`.

- [ ] **Step 14.4:** Stage and commit with message `data: register 9 edge-SLM models`.

---

## Task 15: Add `scale_class` enrichment for 19 new + retag candidates

**Files:** Modify `config/model_enrichment.yaml`.

- [ ] **Step 15.1: Identify retag candidates**

Run `sqlite3 data/benchmark.db "SELECT id, name FROM models WHERE (id LIKE '%-1b' OR id LIKE '%-3b' OR id LIKE '%-7b' OR id LIKE '%-8b' OR id LIKE '%mini%' OR id LIKE '%nano%') AND id NOT LIKE 'lg/exaone%' AND id NOT LIKE '%-vl%' ORDER BY id;" > /tmp/retag_candidates.txt`. Review each line; apply `scale_class: edge-slm` only to general-purpose LLMs (skip vision-language, math/coding-specialist, domain-specific). Build a list of ≤15 IDs.

- [ ] **Step 15.2: Add YAML entries**

Edit `config/model_enrichment.yaml`. Under top-level `models:` (creating the key if absent), add one entry per model ID:

- `scale_class: agent-product` for the 10 IDs in `AGENT_PRODUCTS` (with `base_model_id` pointing at the underlying frontier model when known — `anthropic/claude-code → anthropic/claude-opus-4.7`, `openai/codex-cli → openai/gpt-5.3-codex`, etc.)
- `scale_class: edge-slm` for the 9 IDs in `EDGE_SLMS` and each accepted retag candidate
- A `links:` sub-block with `homepage` (or `huggingface`, or `paper`) URL when known

If a model_id already has a YAML entry, merge — do not duplicate the key.

- [ ] **Step 15.3:** Run `python3 -c "import yaml; d=yaml.safe_load(open('config/model_enrichment.yaml')); print('YAML OK; models:', len(d.get('models', {})))"`. Expected: model count grew by ~30.

- [ ] **Step 15.4:** Run `python -m cyber export 2>&1 | tail -2`.

- [ ] **Step 15.5:** Run a Python check that loads `data/export/model_enrichment.json` and asserts `scale_class` for the 4 representative entries: `anthropic/claude-code → agent-product`, `openai/codex-cli → agent-product`, `apple/foundation-3b → edge-slm`, `microsoft/phi-4-mini-instruct → edge-slm`. All must pass.

- [ ] **Step 15.6:** Stage and commit with message `data(enrichment): scale_class agent-product/edge-slm for 19 new + retag SLMs`.

---

## Task 16: Browser smoke check that new badges render in the modal

**Files:** No edits.

- [ ] **Step 16.1:** Local serve dashboard.

- [ ] **Step 16.2:** Open `Claude Code` modal — amber `🛠️ Agent Product` pill must render. Open `Phi-4-mini-instruct` modal — green `📱 Edge SLM` pill must render. If either is absent, check that Task 8 is on disk and the modal cache-bust was bumped.

- [ ] **Step 16.3:** Stop the local server.

- [ ] **Step 16.4:** No commit unless fixes were applied.

---

## Task 17: Build `config/edge_models_utility.json` for size/latency/power

**Files:** Create `config/edge_models_utility.json`. Modify `dashboard/js/agent.js`.

- [ ] **Step 17.1: Author utility metrics file**

The JSON has `_meta` plus a `models` object keyed by model_id. For each of the 9 EDGE_SLMS, include known fields: `size_gb`, `ttft_ms`, `tok_s`, `power_mw`, `battery_pct_per_25_conversations`, `_source`, `_note`. Use `null` for unpublished values. Strict-attribution: every value cites a primary URL.

Concrete known values for v1:
- `apple/foundation-3b`: `size_gb: 3.0`, source = Apple ML Research
- `microsoft/phi-4-mini-instruct`: `size_gb: 3.8`, source = HF
- `microsoft/phi-4`: `size_gb: 7.0` (INT4), source = HF
- `google/gemma-3-270m`: `size_gb: 0.5`, `battery_pct_per_25_conversations: 0.75` (Pixel 9 Pro per Google blog)
- `google/gemma-3n`: `size_gb: 4.4`, source = HF
- `meta/llama-3.2-1b-instruct`: `size_gb: 2.0`, source = HF
- `meta/llama-3.2-3b-instruct`: `size_gb: 6.4`, source = HF
- `apple/foundation-private-cloud`, `google/function-gemma`: all metric fields null, but include `_source` and `_note`

- [ ] **Step 17.2: Wire into agent.js**

Add `_loadUtility(cb)` inside the IIFE (above `render`). It checks `Object.keys(UTILITY_METRICS).length` and short-circuits if already populated. Otherwise it calls `fetch(<utility json url>)` and on success sets `UTILITY_METRICS = (response.models) || {}` then invokes `cb()`. On any catch, still invoke `cb()` (fail open).

Update `render()` to wrap the render calls inside `_loadUtility(function() { _bootValidate(); _renderSOTAWatch(); _renderCategories(); _renderCompare(); _renderLeaderboard(); });`.

The fetch URL must match where the dashboard serves data. Inspect `dashboard/js/app.js` for how `data/export/<file>.json` is fetched and mirror that path.

- [ ] **Step 17.3:** Copy to export path: `cp config/edge_models_utility.json data/export/edge_models_utility.json`. If the exporter only copies specific files, update `cyber/publisher/exporter.py` to include this one (mirror how `aa_pricing.json` is exported).

- [ ] **Step 17.4:** Bump `agent.js?v=20260508e` to `agent.js?v=20260508f`.

- [ ] **Step 17.5:** Local serve, click Agent tab, inspect Compare panel's edge column — Size column should show GB values once Task D ingests the corresponding scores.

- [ ] **Step 17.6:** Stage and commit with message `data(edge): utility metrics file with size/battery citations + agent.js loader`.

---

## Task 18: Score sweep — Playwright extract MobileAgentBench

**Files:** Compile a single sweep ingest file `resource/zzzz...agent_score_sweep_2026_05_08_scores.json` across Tasks 18–22. Append to a working draft.

- [ ] **Step 18.1:** Use Playwright MCP `browser_navigate` to open `https://mobileagentbench.github.io/`. Then `browser_evaluate` to extract the leaderboard table. Capture top-10 frontier rows.

- [ ] **Step 18.2:** Map model labels to canonical model_ids. For example, `GPT-4` → `openai/gpt-4o`; `Claude 3.5 Sonnet` → `anthropic/claude-3.5-sonnet`. Reject any model_id not present in `data/benchmark.db` (`SELECT id FROM models`).

- [ ] **Step 18.3:** Create or append to the draft sweep JSON. Top-level `_meta` (collected_at, sources, _note about strict attribution) plus a `scores` array. Each row has `model`, `benchmark`, `score`, `unit`, `_source`, `collected_at`, `_note` (rank N, original label).

**Strict-attribution required**: skip any row where the leaderboard doesn't show an exact model name + numeric score. Skip rows for models not yet in the DB after Tasks 13/14.

- [ ] **Step 18.4:** Run a Python validator on the JSON. Confirm syntax is valid.

- [ ] **Step 18.5:** Don't load yet — accumulate across Tasks 18–22.

---

## Task 19: Score sweep — Playwright extract HAL leaderboards

**Files:** Same draft sweep JSON.

- [ ] **Step 19.1:** Visit `https://hal.cs.princeton.edu/`. Navigate sub-leaderboards: `/gaia`, `/usaco`, `/tau-bench`, `/swe-bench`, `/appworld`. Extract top frontier rows per page.

- [ ] **Step 19.2:** Append HAL rows to draft sweep JSON. Map to existing benchmark IDs (`gaia`, `swe_bench_verified`, `tau2_bench`, `usaco`, `appworld`). For HAL composite, use `hal_overall_accuracy_at_fixed_cost`. Include `_source` (specific HAL sub-page URL) and `_note` (HAL leaderboard name + rank).

- [ ] **Step 19.3:** Validate JSON; total row count grew from Task 18.

- [ ] **Step 19.4:** Don't load yet — continue to Task 20.

---

## Task 20: Score sweep — SWE-bench Pro / Verified / Aider Polyglot + agent products

**Files:** Same draft sweep JSON.

- [ ] **Step 20.1:** Visit `https://labs.scale.com/leaderboard/swe_bench_pro_public`. Extract top frontier rows, append as `swe_bench_pro` rows.

- [ ] **Step 20.2:** Visit `https://www.swebench.com/`. Extract top frontier rows, append as `swe_bench_verified` rows. Re-including frontier models already in DB at the same value is fine — `INSERT OR REPLACE` is idempotent.

- [ ] **Step 20.3:** Visit `https://aider.chat/docs/leaderboards/`. Extract top frontier rows, append as `aider_polyglot` rows.

- [ ] **Step 20.4: Agent products**

When a leaderboard shows e.g. Claude Code 80.9% on SWE-bench Verified, append `{ "model": "anthropic/claude-code", "benchmark": "swe_bench_verified", "score": 80.9, "_source": "<leaderboard URL>", ... }`. This is what gives the Compare panel its three-column data. Apply similar treatment to Codex CLI / Cursor Composer / Replit Agent / Devin where disclosed.

- [ ] **Step 20.5:** Validate JSON. No load yet.

---

## Task 21: Score sweep — BFCL v4 / Terminal-Bench 2 / TAU2 / OSWorld-V

**Files:** Same draft sweep JSON.

- [ ] **Step 21.1: BFCL v4**

Visit `https://gorilla.cs.berkeley.edu/leaderboard.html`. Extract top frontier rows for `bfcl_v4`. Append.

- [ ] **Step 21.2: Terminal-Bench 2.0**

Cross-check `https://benchlm.ai/` for current frontier rows on Terminal-Bench 2.0. Append rows beyond what's already in DB. Add Claude Code / Codex CLI rows if disclosed.

- [ ] **Step 21.3: TAU2-Bench**

Visit Sierra's TAU-bench GitHub or blog for current frontier numbers. Append.

- [ ] **Step 21.4: OSWorld-Verified**

Visit OSWorld-V leaderboard. Append rows for any frontier models or agent products not yet in DB.

- [ ] **Step 21.5:** Validate JSON. No load yet.

---

## Task 22: Score sweep — Edge models on `mobile_actions` and `function_gemma_calling`

**Files:** Same draft sweep JSON.

- [ ] **Step 22.1: Mobile Actions**

`mobile_actions` benchmark already exists in DB. Extract scores for edge SLMs (Phi-4-mini, Gemma 3, FunctionGemma, Llama 3.2 1B/3B) from primary papers/repos.

- [ ] **Step 22.2: FunctionGemma Calling**

Use `https://github.com/google-ai-edge/LiteRT-LM`. Find disclosed eval numbers for FunctionGemma. Append.

- [ ] **Step 22.3: Phi-4 / Phi-4-mini agentic scores**

From the Phi-4 technical report, extract any agentic / function-calling scores. Append rows mapping to existing benchmark IDs (`bfcl_v4`, `mobile_actions`, etc.).

- [ ] **Step 22.4:** Validate JSON. Run a Python script that loads the file, prints `total rows: N`, then iterates `scores` building a set of `(model, benchmark)` tuples and prints `duplicate (model,benchmark) pairs: <count>`. Expected: total in 60–100 range; 0 duplicates within file.

- [ ] **Step 22.5:** Don't commit yet — load in Task 23.

---

## Task 23: Load score sweep + run audit

**Files:** Existing `resource/zzzz...agent_score_sweep_2026_05_08_scores.json`.

- [ ] **Step 23.1:** Run loader: `python scripts/load_benchmark_scores.py resource/zzzz...agent_score_sweep_2026_05_08_scores.json 2>&1 | tail -3`.

- [ ] **Step 23.2:** Run `python scripts/audit_version_date_consistency.py 2>&1 | tail -3`. Expected: `Contradictions found: 0`. If not zero, fix the offending model release_date in `config/model_enrichment.yaml` or the resource JSON.

- [ ] **Step 23.3:** Run `python -m cyber export 2>&1 | tail -2`.

- [ ] **Step 23.4: SQL spot checks**

Run a single sqlite3 invocation that prints counts for: `mobile_agent_bench`, `hal_overall_accuracy_at_fixed_cost`, `usaco`, `aider_polyglot`, `appworld`, plus row counts for `model_id='anthropic/claude-code'` and `model_id='openai/codex-cli'`. Expected: each new benchmark has ≥ 3 rows; each agent product has ≥ 1 row.

- [ ] **Step 23.5:** Stage and commit with message `data: agentic score sweep — 60-100 frontier rows across 14+ benchmarks via Playwright`.

---

## Task 24: Verify Compare panel renders 3 columns with real data

**Files:** No edits.

- [ ] **Step 24.1:** Local serve dashboard, open Agent tab.

- [ ] **Step 24.2: Verify Compare panel**

Frontier column shows a frontier top model (Opus 4.7 / GPT-5.5 / Gemini 3.1 Pro). Agent products column has at least 1 row (Claude Code, Codex CLI, etc.). Edge column may have rows for Phi-4-mini / Gemma 3 if Task D found scores; the size column shows GB. Switch dropdown to Terminal-Bench 2.0 / OSWorld-V; all 3 columns re-render.

- [ ] **Step 24.3:** Verify Leaderboard now includes rows from all three classes (`Class` column shows `Frontier`, `Agent-Product`, or `Edge-SLM`).

- [ ] **Step 24.4:** Stop the local server.

- [ ] **Step 24.5:** No commit (verification only).

---

## Task 25: Add 20 Resources entries (11 leaderboards + 9 on-device sites)

**Files:** Modify `dashboard/js/app.js` (renderResources sites array). Modify `config/seed_sources.yaml`.

- [ ] **Step 25.1:** Run `grep -n "Awesome Agents Agentic" dashboard/js/app.js` to locate the Resources sites array.

- [ ] **Step 25.2: Insert 20 entries**

Insert them inside the `renderResources` `sites` array (flat list of `{ name, url, desc }` literals) in the order below:

1. HAL — Holistic Agent Leaderboard (`https://hal.cs.princeton.edu/`)
2. HAL Reliability Dashboard (`https://hal.cs.princeton.edu/reliability/`)
3. HAL GAIA Leaderboard (`https://hal.cs.princeton.edu/gaia/`)
4. HAL USACO Leaderboard (`https://hal.cs.princeton.edu/usaco/`)
5. AA Coding Agents (`https://artificialanalysis.ai/agents/coding`)
6. BenchLM Agent (`https://benchlm.ai/llm-agent-benchmarks`)
7. AI Agent Square (`https://aiagentsquare.com/blog/ai-agent-benchmarks-2026.html`)
8. Rapid Claw Framework Scorecard (`https://rapidclaw.dev/blog/ai-agent-benchmarks-2026`)
9. MorphLLM Coding Agents (`https://www.morphllm.com/ai-coding-agent`)
10. Helicone Manus Benchmark (`https://www.helicone.ai/blog/manus-benchmark-operator-comparison`)
11. Phil Schmid Agent Compendium (`https://github.com/philschmid/ai-agent-benchmark-compendium`)
12. MobileAgentBench (`https://mobileagentbench.github.io/`)
13. Xiaomi Mobile-Bench (`https://github.com/XiaoMi/MobileBench`)
14. MLCommons MLPerf Mobile (`https://mlcommons.org/benchmarks/inference-mobile/`)
15. MLCommons MLPerf Tiny (`https://mlcommons.org/benchmarks/inference-tiny/`)
16. MLCommons MLPerf Inference Edge (`https://mlcommons.org/benchmarks/inference-edge/`)
17. Google AI Edge / LiteRT-LM (`https://github.com/google-ai-edge/LiteRT-LM`)
18. Apple ML Research (`https://machinelearning.apple.com/`)
19. HuggingFace SmolLM Blog (`https://huggingface.co/blog/smollm`)
20. Local AI Master SLM Guide 2026 (`https://localaimaster.com/blog/small-language-models-guide-2026`)

Use the description text from Spec Section 6 (one-line description per site).

- [ ] **Step 25.3:** Bump `app.js?v=` cache-bust (e.g. to `v=20260508g`).

- [ ] **Step 25.4:** Append the same 20 entries to `config/seed_sources.yaml` in the same block as other agent-related leaderboards (`url`, `name`, `type: evaluation_report`, `format: html_table`, `notes`).

- [ ] **Step 25.5: Validation**

Run `python3 -c "import yaml; yaml.safe_load(open('config/seed_sources.yaml')); print('YAML OK')"`. Expected: `YAML OK`. For the JS side, syntax is checked by browser load (DevTools console must show no `SyntaxError` on `app.js`).

- [ ] **Step 25.6:** Stage and commit with message `feat(resources): +20 agent + on-device leaderboard references`.

---

## Task 26: Final integration test

**Files:** No edits.

- [ ] **Step 26.1:** Local serve dashboard.

- [ ] **Step 26.2: Manual smoke checklist**

Open `Agent` tab. Confirm:
- All 4 SOTA Watch tiles populated.
- All 10 category cards rendered. Last (📱 Edge) spans full width.
- Compare panel: 3 columns each with ≥ 1 row at default benchmark. Dropdown switching works.
- Leaderboard table top 25, with mixed `Class` values (Frontier + Agent-Product + Edge-SLM rows).
- Click a leaderboard row → modal opens for that model. New `agent-product` / `edge-slm` badges render where applicable.
- Click a SOTA Watch tile → benchmark detail modal opens (or no-op gracefully).
- DevTools console: 0 errors.

- [ ] **Step 26.3: SQL truth check**

Run a sqlite3 query that prints: total benchmarks, total scores, total models, count of agent-product models in DB (must be 10), count of edge-SLM models in DB (must be 9). Expected: benchmarks count grew by 14; scores count grew by 60–100.

- [ ] **Step 26.4:** Stop the local server.

- [ ] **Step 26.5:** No commit unless fixes were applied.

---

## Task 27: Update Plans.md, HISTORY.md, changelog.json

**Files:** Modify `Plans.md`, `HISTORY.md`, `data/export/reports/changelog.json`.

- [ ] **Step 27.1:** `Plans.md`

Add `Agent (10 sub-categories)` to the Active Tabs list. Move the closed cc:TODO items (MRCR v2 done, Video-MME render done) into a "Completed" sub-section. Add a one-paragraph "2026-05-08 — Agent menu launch" entry referencing the commit hashes from Tasks 10, 13, 14, 15, 23, 25.

- [ ] **Step 27.2:** `HISTORY.md`

Add a new sub-section under the existing 2026-05-08 entry titled "8. Agent menu launch + agentic data sweep". Cover the 4 sub-section UI architecture, 14 new benchmarks, 19 new models + ~15 retags, score delta, 20 Resources additions, strict-attribution applied throughout. Reference commit hashes.

- [ ] **Step 27.3:** `data/export/reports/changelog.json`

Prepend a top entry with `type: Feature`, `date: 2026-05-08`, and `benchmark_id` summarizing "Agent menu 신설 + agentic data sweep — 14 신규 벤치마크 + 19 신규 모델 + 60-100 신규 점수 + 20 Resources". The `new_model` field describes the 10 agent-products + 9 edge-SLMs and lists the 14 new benchmark IDs. The `new_value` field summarizes the deltas.

- [ ] **Step 27.4:** Run `python3 -c "import json; json.load(open('data/export/reports/changelog.json')); print('OK')"`.

- [ ] **Step 27.5:** Stage and commit with message `docs: Agent menu launch + sweep — Plans.md / HISTORY.md / changelog.json sync`.

---

## Task 28: Push ops + sync HISTORY.md to main

**Files:** No edits — sync only.

- [ ] **Step 28.1:** Push: `git push origin ops 2>&1 | tail -3`.

- [ ] **Step 28.2: Sync HISTORY.md to main via worktree**

Run `git worktree add /tmp/cyber-main-sync-agent main`, then `cp HISTORY.md /tmp/cyber-main-sync-agent/HISTORY.md`, then `(cd /tmp/cyber-main-sync-agent && git add HISTORY.md && git commit -m "docs: sync HISTORY.md from ops — 2026-05-08 Agent menu launch" && git push origin main)`, then `git worktree remove /tmp/cyber-main-sync-agent`.

- [ ] **Step 28.3:** Run `git log --oneline -3 ops` and `git log --oneline -2 main` to confirm both branches landed.

- [ ] **Step 28.4: Live-deploy verification**

After GitHub Pages rebuilds (a few minutes), open `https://hollobit.github.io/SOTA/` and click `Agent` tab. Confirm the same 4 sub-sections render with real data.

- [ ] **Step 28.5:** No further commit.

---

## Self-review checklist (already applied)

- ✅ Spec coverage: every spec section maps to ≥ 1 task. Section 1 → Tasks 1–3. Section 2 → Task 3. Section 3A–D → Tasks 4–7. Section 4 → Tasks 8, 9, 16, 24, 26. Section 5A → Tasks 18–23. Section 5B → Tasks 10–12. Section 5C → Tasks 13–15. Section 6 → Task 25. Section 7 → Tasks 14, 15, 17.
- ✅ Placeholder scan: 0 TBD / TODO / FIXME in step bodies. The phrase "TODO" in changelog.json reference is a stable JSON value, not a placeholder.
- ✅ Type and name consistency across tasks: `Agent.render`, `_renderSOTAWatch`, `_renderCategories`, `_renderCompare`, `_renderLeaderboard`, `_modelClass`, `_compositeScores`, `_topModel`, `_scoresFor`, `_modelDisplayName`, `_benchmarkName`, `_escape`, `_loadUtility`, `_bootValidate`, `_allAgentBenchmarks`, `_categoryStats`, `_renderCategoryCard`, `_renderCompareColumn`, `_allLowerBetterSet`, `_benchmarkMaxes`, `_vendorOf`, `_classLabel`, `UTILITY_METRICS`, `CATEGORIES`, `SOTA_WATCH`, `AGENT_PRODUCTS`, `EDGE_SLMS`, `COMPARE_BENCHMARKS`.
- ✅ Dependencies: Group B (Tasks 10–12) and Group C (Tasks 13–17) before Group D (Tasks 18–24). Group E (Tasks 25–28) last. Task 8 (modal badge code) lands during Group A so Task 16's badge smoke test has the code path available.
- ✅ Strict-attribution rule applied throughout Group D — anonymized models or extrapolated scores are explicitly rejected at each sub-task.
