# Agent Menu — Design Spec

**Date**: 2026-05-08
**Topic**: New "Agent" tab for browsing agentic AI benchmarks, evaluation results, SOTA models — with frontier vs agent-product vs on-device-edge utility comparison
**Status**: Design approved. Implementation pending.
**Live site**: https://hollobit.github.io/SOTA/

---

## Goal (one sentence)

Add a new top-level **Agent** tab to the SOTA dashboard that lets the user browse 9+1 categories of agentic AI benchmarks, see SOTA model rankings per category, and compare frontier general-purpose models, agent-product wrappers (Claude Code / Codex CLI / Cursor / etc.), and on-device / edge SLM agents on the same benchmark + utility metrics (cost, model size, latency, power).

## Why

The dashboard already tracks 59 agentic benchmarks with 374 score rows across 94 distinct models, but they are scattered across Cyber & Coding, Frontier Compare, Medical AI, and Explorer with no central agentic view. Users currently cannot:

1. See which agentic capability domain (coding / web / OS / tool-use / MCP / customer service / domain / safety / general / edge) a benchmark belongs to.
2. Compare a frontier model's raw score (e.g. Opus 4.7 87.6% on SWE-bench Verified) against an agent-product wrapper's score (Claude Code 80.9%) and an on-device SLM (Phi-4-mini 62.3%) at a glance.
3. Reason about utility tradeoffs (cost / model size / latency / power) when picking an agent for a given task.

This spec defines the new menu and the data sweep needed to populate it.

---

## Scope

### In scope

| Area | Items |
|------|-------|
| New tab UI | `Agent` tab with 4 sub-sections (SOTA Watch tiles + 10 category cards + Frontier vs Agent-Product vs Edge comparison + Unified leaderboard) |
| Categories | 10 hardcoded sub-categories (Coding / Web & Browsing / OS use / Tool use / MCP / Customer service / Domain / Safety / General / **Edge**) |
| Score data sweep | Fill frontier-coverage gaps in 15+ existing agentic benchmarks |
| New benchmarks | Register ~14 missing benchmarks: HAL, MLE-Bench, SWE-Lancer, Aider Polyglot, AppWorld, USACO, MobileAgentBench, Mobile-Bench-v2, MobileBench (Xiaomi), MLPerf Mobile, MLPerf Inference Edge v5.1, MLPerf Tiny v1.2, TinyML Energy, FunctionGemma Calling |
| New models | Register ~10 agent-product wrappers (Claude Code / Codex CLI / Cursor Composer / Replit Agent / Devin / Manus / Computer Use / Mariner / Operator / Cowork) + ~9 on-device SLMs (Apple Foundation 3B + Private Cloud / Phi-4 + mini / Gemma 3-270M + 3n / FunctionGemma / Llama 3.2-1B + 3B) |
| Resources additions | 8 leaderboard sites + 8 on-device sites added to Resources tab + seed_sources.yaml |
| Cross-list | Domain agents (Finance, AgentClinic, MedAgentBench, ScienceAgentBench) appear in both `Agent → Domain` and `Medical AI` / `AI4S` |
| Docs | Plans.md, HISTORY.md, changelog.json updates |

### Out of scope

- New frontier model ingest (separate daily sweep)
- AI4S/Medical cross-list automatic two-way sync (manual)
- Agent framework (LangGraph / CrewAI / AutoGen) as model entries (only as Resources scorecard links)
- Devin's Agent Compute Unit pricing normalization (display "subscription" instead of $/1M tokens)
- HW-specific MLPerf Tiny per-SoC results (model-level utility metrics only)
- Direct battery / power measurement (we cite primary-source numbers, never measure)
- New agent-products' system card PDF storage in `resource/` (out of UI scope)
- Vision Arena / Search Arena were ingested separately on 2026-05-08; not re-touched here

---

## Architecture

### File layout

| Action | File |
|--------|------|
| **Create** | `dashboard/js/agent.js` (~500 LOC, AI4S + Cyber-Coding hybrid pattern) |
| **Modify** | `dashboard/index.html` — new tab button, panel section, script include w/ cache bust |
| **Modify** | `dashboard/js/app.js` — tab activation switch case `'agent'` |
| **Modify** | `dashboard/js/modal.js` — extend `_renderHeader` `scale_class` switch with `'agent-product'` (amber) and `'edge-slm'` (green) badges |
| **Modify** | `config/model_enrichment.yaml` — add `scale_class` for ~19 new models |
| **Modify** | `config/seed_sources.yaml` — append 16 new leaderboard / on-device reference entries |
| **Modify** | `Plans.md` — Active Tabs list adds `Agent`; Next Steps moves relevant cc:TODO to "completed" |
| **Modify** | `HISTORY.md` — new section under 2026-05-08 entry |
| **Modify** | `data/export/reports/changelog.json` — new top entry |
| **Add** | `resource/zzz...agent_menu_data_2026_05_08_scores.json` (new scores + new benchmarks + new models in single file) |

### Tab insertion

Tab order (`dashboard/index.html` ~line 47-48):
```
... AI4S | Agent | Explorer ...
```
Place between AI4S and Explorer because Agent is the last domain-specialized tab and Explorer is a generic data tool.

### Data flow

```
Agent.render()
  ↓
  reads App.data.scores + App.data.benchmarks + App.data.enrichment
  ↓
  filters by hardcoded CATEGORIES[*].benchmarks[*]
  ↓
  builds 4 vertical sections:
    A) SOTA Watch  ← top-1 model per benchmark in SOTA_WATCH (4 tiles)
    B) Categories  ← 10 cards, top-3 SOTA models per category
    C) Compare     ← frontier / agent-product / edge 3-col table
    D) Leaderboard ← composite agent_score across all 10 categories
```

---

## Section 1 — File structure & integration points

`dashboard/js/agent.js` is structured as:

```
// 1. CATEGORIES — hardcoded 10-item list
// 2. SOTA_WATCH  — 4-item list (default)
// 3. AGENT_PRODUCTS, EDGE_SLMS — model_id sets for compare panel
// 4. UTILITY_METRICS — { model_id: { cost_per_1m_in, cost_per_1m_out, size_gb, ttft_ms, power_mw } }
//                       — populated from aa_pricing.json + manual edge-models.json
// 5. Agent.render() — top-level entry, called from app.js tab switch
// 6. _renderSOTAWatch() — section A
// 7. _renderCategories() — section B
// 8. _renderCompare()    — section C with switchable benchmark dropdown
// 9. _renderLeaderboard() — section D
// 10. _composite_score(model_id) — normalized average across covered agentic benchmarks
// 11. _bootValidate()  — checks all hardcoded benchmark IDs exist in App.data.benchmarks; console.warn missing
```

Cache-bust convention: `js/agent.js?v=20260508a`

---

## Section 2 — Categories (data architecture)

Hardcoded **10 sub-categories** with explicit benchmark-id arrays (no regex). Order in UI matches the table below.

```js
const CATEGORIES = [
  {
    key: 'coding', icon: '💻', label: 'Coding Agents',
    benchmarks: [
      'swe_bench_verified','swe_bench_pro','swe_bench_verified_mini',
      'swe_bench_multilingual','swe_bench_multimodal','swe_rebench',
      'multi_swe_bench','swe_polybench','expert_swe',
      // newly registered
      'aider_polyglot','swe_lancer','mle_bench','usaco'
    ]
  },
  {
    key: 'web-browse', icon: '🌐', label: 'Web & Browsing',
    benchmarks: [
      'browsecomp','browsecomp_plus','browsecomp_agent_swarm',
      'gaia','gaia2','webarena',
      // newly registered
      'appworld'
    ]
  },
  {
    key: 'os-computer', icon: '🖥️', label: 'OS / Computer Use',
    benchmarks: [
      'osworld','osworld_verified','windows_agent_arena','the_agent_company'
    ]
  },
  {
    key: 'tool-use', icon: '🔧', label: 'Tool Use & Function Calling',
    benchmarks: [
      'bfcl','bfcl_v3','bfcl_v3_live','bfcl_v3_multi_turn',
      'bfcl_v4','bfcl_v4_web_search'
    ]
  },
  {
    key: 'mcp', icon: '🔌', label: 'MCP (Model Context Protocol)',
    benchmarks: [
      'mcp_bench','mcp_atlas','mcpatlas_public','mcpmark','livemcpbench'
    ]
  },
  {
    key: 'customer-service', icon: '💼', label: 'Customer Service / Multi-turn',
    benchmarks: [
      'tau_bench','tau2_bench','tau2_airline','tau2_retail','tau2_telecom',
      'tau3_bench','tau3_telecom'
    ]
  },
  {
    key: 'domain', icon: '🧪', label: 'Domain-Specific Agents',
    crossListed: ['medical-ai','ai4s'],   // amber badge "Also in Medical AI / AI4S"
    benchmarks: [
      'finance_agent','scienceagentbench',
      'agentclinic_medqa','agentclinic_nejm',
      'medagentbench','medagentsbench'
    ]
  },
  {
    key: 'safety', icon: '🛡️', label: 'Agent Safety & Security',
    direction_note: 'mixed',  // utility ↑ better, ASR ↓ better
    lower_better: [   // ASR / jailbreak — lower is better
      'agentdojo_targeted_asr','injecagent','browserart',
      'anthropic_shade_browser_asr_attempts',
      'anthropic_shade_browser_asr_scenarios',
      'anthropic_shade_browser_asr_with_safeguards',
      'agent_red_teaming','agentsmith_inf'
    ],
    benchmarks: [
      'agentdojo_targeted_asr','agentdojo_utility','injecagent',
      'browserart','anthropic_shade_browser_asr_attempts',
      'anthropic_shade_browser_asr_scenarios',
      'anthropic_shade_browser_asr_with_safeguards',
      'agent_red_teaming','agentsmith_inf'
    ]
  },
  {
    key: 'general', icon: '🚀', label: 'General / Composite',
    benchmarks: [
      'apex_agents','apex_agents_hard',
      'terminal_bench_2','terminal_bench_hard',
      // newly registered
      'hal_overall_accuracy_at_fixed_cost'
    ]
  },
  {
    key: 'edge', icon: '📱', label: 'On-device / Edge Agents',
    utility_emphasis: true,  // surface size / latency / power in card body
    benchmarks: [
      'mobile_actions','healthslm_bench',
      // newly registered
      'mobile_agent_bench','mobilebench_v2','mobilebench_xiaomi',
      'mlperf_mobile_llm','mlperf_inference_edge_v5_1','mlperf_tiny_v1_2',
      'tinyml_energy_v1','function_gemma_calling'
    ]
  }
];

const SOTA_WATCH = [
  { benchmark: 'swe_bench_verified', label: 'Top Coder',     icon: '💻' },
  { benchmark: 'browsecomp',         label: 'Top Web Agent', icon: '🌐' },
  { benchmark: 'osworld_verified',   label: 'Top OS Agent',  icon: '🖥️' },
  { benchmark: 'agentdojo_utility',  label: 'Best Defense',  icon: '🛡️' }
];
```

**Total benchmark IDs across all categories**: ~75 (53 already in DB + ~22 new registered in Section 5B/7B).

---

## Section 3 — UI rendering

### 3A. SOTA Watch (4 tiles)

```
┌─────────────────────────────────────────────────────────────┐
│ 💻 Top Coder       🌐 Top Web      🖥️ Top OS    🛡️ Best Defense │
│ Claude Mythos      GPT-5.5 Pro     Mythos       <model>       │
│ 93.9%              90.1%           79.6%        ??.?%         │
│ SWE-bench Verified BrowseComp      OSWorld-V    AgentDojo Util│
└─────────────────────────────────────────────────────────────┘
```

- **Tile click** → modal showing top-15 leaderboard for that benchmark
- **Responsive**: 4-col → 2×2 → 1-col stacking at 768px / 375px breakpoints
- **AgentDojo Utility fallback**: if score count = 0, swap tile to next-most-covered safety benchmark (`agentdojo_targeted_asr` with reversed ↓lower-better display)

### 3B. Category cards (10 cards in 3-column grid → rows 1–3 hold 9 cards; row 4 has 1 full-width card)

The `edge` card (row 4) spans all 3 columns to give utility metrics room to breathe (size · latency · power microtext).

```
┌──────────────┬──────────────┬──────────────┐
│ 💻 Coding    │ 🌐 Web       │ 🖥️ OS Use    │
│ 13 bench     │ 7 bench      │ 4 bench      │
│ Top: ●●●     │ Top: ●●●     │ Top: ●●●     │
├──────────────┼──────────────┼──────────────┤
│ 🔧 Tool Use  │ 🔌 MCP       │ 💼 Customer  │
├──────────────┼──────────────┼──────────────┤
│ 🧪 Domain    │ 🛡️ Safety    │ 🚀 General   │
│ also Medical │ ↓ ASR=better │              │
├──────────────┴──────────────┴──────────────┤
│ 📱 Edge — surface size · latency · power    │
└─────────────────────────────────────────────┘
```

Card body:
- Icon + label (heading)
- Metric row: `N benchmarks · M distinct models · K total scores`
- Top 3 SOTA models (vendor flag + name + best-in-category score)
- Cross-list badge if applicable (amber)
- Direction microtext for safety (↓ lower is safer)
- For `edge` card: extra row showing `min size: 0.5 GB · best latency: ~ms · lowest power: ~mW` (aggregated from utility_metrics)

**Card click** → in-page expand or modal: list every benchmark in category with its top-5 SOTA models.

### 3C. Compare panel (3-column: Frontier / Agent-Product / Edge)

```
Default benchmark: [SWE-bench Verified ▾]   View: Score | Cost | Eff (Score/Cost)

┌────── Frontier ──────┬─── Agent-Product ───┬─── On-device / Edge ─────┐
│ Rank Model     Score │ Rank Model    Score │ Rank Model     Score Size│
│  1  Opus 4.7   87.6  │  1  Claude Code 80.9│  1  Phi-4      62.3  7GB │
│  2  GPT-5.5    82.7  │  2  Codex CLI   78.4│  2  Phi-4-mini 60.1  3.8 │
│  3  Gemini 3.1 71.8  │  3  Cursor C.   72.1│  3  Gemma 3n   58.1  4.4 │
│ ...                  │ ...                 │ ...                       │
└──────────────────────┴─────────────────────┴───────────────────────────┘
```

- **Default benchmark**: `swe_bench_verified`
- **Switchable dropdown**: SWE Verified / SWE Pro / Terminal-Bench 2.0 / OSWorld-V / GAIA / TAU2-Bench / BFCL v4 / **Mobile Actions** / **MobileAgentBench**
- **View toggle**: Score (default) / Cost ($/1M out tokens or session) / Effective (Score / Cost)
- **Edge column extra metrics**: model_size_gb (always), ttft_ms or tok/s (if MLPerf data), power_mw (if reported)
- **Diff highlighting**: agent-product score vs underlying frontier raw → green ↑ if higher, amber ↓ if lower, gray if same model
- **Empty cells**: dash `—`, never auto-fill

### 3D. Unified leaderboard — Composite Agent Score

```
Agentic Capability Composite (top 25 across 10 categories)

Rank Model                Vendor       Class           AgentScore  Coverage
─────────────────────────────────────────────────────────────────────────────
  1  Claude Opus 4.7      Anthropic    Frontier        78.4        18/53
  2  GPT-5.5              OpenAI       Frontier        77.1        22/53
  3  Claude Code          Anthropic    Agent-Product   76.8        12/53
  4  Gemini 3.1 Pro       Google       Frontier        71.8        15/53
  ...
 19  Phi-4-mini           Microsoft    Edge-SLM        42.1         5/53
```

**Composite formula**:
```
for each (model, benchmark) in covered:
    if benchmark in safety.lower_better:
        normalized = (1 − value / max_observed) * 100
    else:
        normalized = value / max_observed * 100   # 0–100 per benchmark
agent_score(model) = mean(normalized)
coverage(model)    = count(scores in agent_benchmarks)
```

**Coverage threshold for leaderboard inclusion**: ≥ 3 distinct agentic benchmarks.

**Class column** values: `Frontier` | `Agent-Product` | `Edge-SLM` | `Frontier-FM` (default for everything else).

**Sort**: agent_score desc, tie-break by coverage desc.

**Row click** → modal showing per-benchmark normalized vs raw scores for that model.

---

## Section 4 — Edge cases, testing, docs, out of scope

### Edge cases

| Case | Behavior |
|------|----------|
| Empty benchmark in category (0 scores) | Shown in card metric count; not selectable as Top-N |
| Coverage < 3 agentic benchmarks | Excluded from unified leaderboard; can still appear in SOTA Watch / Compare |
| Safety direction tie-break | `agentdojo_utility` is normal-direction. All ASR/jailbreak rows in `safety.lower_better` array are inverted. Code path: see `_normalize(score, benchmark_id, category)` |
| Cross-list duplication | Domain agents may appear identically in `Agent → Domain` and `Medical AI` / `AI4S`. Intentional for discoverability; flagged via `crossListed` array |
| Benchmark ID renamed/removed | `_bootValidate()` checks each ID exists in `App.data.benchmarks` and `console.warn`s on miss. UI hides missing IDs gracefully |
| Agent product without underlying frontier `base_model_id` | `Class` column shows "Agent-Product (multi-model)" |
| Edge model with only model size (no score) | Listed in compare panel only when current benchmark has its score; otherwise omitted (no fake row) |
| Devin / Manus subscription pricing | Cost column shows "subscription" instead of $/1M; cost-effective rank is N/A for those rows |

### Testing

**Manual smoke (Playwright)**:
1. Open Agent tab → assert tab activates (no console errors)
2. SOTA Watch: 4 tiles all show a model name + score (no "—")
3. Categories: all 10 cards render with non-zero benchmark count
4. Compare panel: dropdown switch from SWE-Verified → OSWorld-V → re-renders correctly
5. Leaderboard: top model matches SQL `SELECT model_id, agent_score FROM ...` calculation

**Data spot-check (3 SQL queries)**:
```sql
-- 1. SOTA Watch tile 1 = SQL truth?
SELECT model_id, value FROM scores WHERE benchmark_id='swe_bench_verified' ORDER BY value DESC LIMIT 1;

-- 2. Coding category total scores
SELECT COUNT(*) FROM scores WHERE benchmark_id IN ('swe_bench_verified','swe_bench_pro', ...);

-- 3. Composite agent_score for top-3 frontier models
SELECT model_id, AVG(value / max_value * 100) as composite
FROM scores JOIN (SELECT benchmark_id, MAX(value) as max_value ...) USING (benchmark_id)
WHERE benchmark_id IN (... all agentic IDs ...)
GROUP BY model_id ORDER BY composite DESC LIMIT 3;
```

**Visual regression**: 1280px / 768px / 375px viewports — no overflow, no overlap, font sizes match existing tabs.

**Console-error free**: Tab activation, dropdown switch, modal open/close all clean.

### Documentation

- **Plans.md**: under "Active Tabs", add `Agent (10 sub-categories)`. Move closed cc:TODO to "completed".
- **HISTORY.md**: add section 8 under 2026-05-08: "Agent menu launch + agentic data sweep".
- **changelog.json**: 2026-05-08 entry covering UI + data sweep + new benchmarks + new models.
- **README**: no change (existing description doesn't enumerate tabs).

### Explicit out of scope

- New frontier model ingest (separate sweep)
- AI4S/Medical cross-list automatic two-way sync (manual)
- Agent framework (LangGraph/CrewAI/AutoGen) as model entries
- Devin Agent Compute Unit cost normalization
- HW-specific MLPerf Tiny per-SoC results
- Direct battery/power measurement
- New models' system card PDF storage in `resource/`

---

## Section 5 — Data sweep plan

Three sub-tracks (5A coverage gap fill, 5B new benchmark registration, 5C new model registration). Single ingest JSON file: `resource/zzz...agent_menu_data_2026_05_08_scores.json`.

### 5A. Frontier coverage gap fill (existing benchmarks)

Sweep frontier models on under-covered agentic benchmarks. Strict-attribution: every row must have model name + benchmark name + value visible in primary source.

| benchmark | current | gap target | primary source |
|-----------|--------:|------------|----------------|
| `swe_bench_verified` | 58 | Mythos 93.9, GPT-5.5 if disclosed | swebench.com / vals.ai |
| `swe_bench_pro` | 29 | Mythos 77.8 / Opus 4.7 64.3 / GPT-5.5 58.6 (verify in DB) | labs.scale.com/leaderboard/swe_bench_pro_public |
| `terminal_bench_2` | 41 | Mythos / Opus 4.7 69.4 / GPT-5.5 82.7 fill | system cards + benchlm.ai |
| `browsecomp_plus` | **0** | full frontier sweep | OpenAI / Anthropic system cards |
| `livemcpbench` | **0** | full frontier sweep | LiveMCPBench leaderboard (Playwright) |
| `mcp_bench` | **0** | full frontier sweep | MCP-Bench official |
| `scienceagentbench` | **0** | full frontier sweep | scienceagentbench.github.io |
| `windows_agent_arena` | **0** | full frontier sweep | Microsoft repo |
| `osworld` | **1** | OSWorld original (Verified covered) | OSWorld leaderboard (Playwright) |
| `bfcl_v4` | **3** | 14+ frontier models | BFCL Berkeley leaderboard (Playwright) |
| `gaia` | **4** | GPT-5.5 / Opus 4.7 / Mythos | HF Spaces leaderboard |
| `webarena` | **5** | recent frontier | WebArena GitHub |
| `agentdojo_targeted_asr` | 8 | frontier delta | AgentDojo paper updates |
| `agentdojo_utility` | 7 | frontier delta | AgentDojo paper updates |
| `injecagent` | **3** | frontier delta | InjecAgent repo |
| `apex_agents` | **2** | frontier delta | mercor.com/apex |

**Estimated new score rows: 60–100** depending on each leaderboard's frontier coverage.

### 5B. New benchmark registration

| benchmark id | category | name | primary source |
|--------------|----------|------|----------------|
| `aider_polyglot` | coding | Aider Polyglot (133 problems / 6 languages) | aider.chat/docs/leaderboards |
| `swe_lancer` | coding | SWE-Lancer (1400 freelance SWE tasks) | OpenAI arxiv |
| `mle_bench` | coding | MLE-Bench (75 Kaggle competitions) | github.com/openai/mle-bench |
| `usaco` | coding | USACO competitive programming | hal.cs.princeton.edu/usaco |
| `appworld` | web-browse | AppWorld (750 interactive coding tasks) | appworld.dev/leaderboard |
| `hal_overall_accuracy_at_fixed_cost` | general | HAL composite cost-controlled | hal.cs.princeton.edu |
| `mobile_agent_bench` | edge | MobileAgentBench (100 tasks × 10 OSS apps) | mobileagentbench.github.io |
| `mobilebench_v2` | edge | Mobile-Bench-v2 (VLM-based mobile agent) | arxiv.org/abs/2505.11891 |
| `mobilebench_xiaomi` | edge | Mobile-Bench (Xiaomi, 103 APIs) | github.com/XiaoMi/MobileBench |
| `mlperf_mobile_llm` | edge | MLPerf Mobile LLM inference | mlcommons.org/benchmarks/inference-mobile |
| `mlperf_inference_edge_v5_1` | edge | MLPerf Inference Edge v5.1 | mlcommons.org/benchmarks/inference-edge |
| `mlperf_tiny_v1_2` | edge | MLPerf Tiny v1.2 (<100kB MCU) | mlcommons.org/benchmarks/inference-tiny |
| `tinyml_energy_v1` | edge | TinyML Energy & Latency (resource-constrained) | arxiv.org/abs/2505.15622 |
| `function_gemma_calling` | edge | FunctionGemma Calling | github.com/google-ai-edge/LiteRT-LM |

**Total: 14 new benchmarks**.

### 5C. New model registration

#### Agent-product wrappers (10)

| model_id | base_model_id | scale_class | source |
|----------|---------------|-------------|--------|
| `anthropic/claude-code` | `anthropic/claude-opus-4.7` | agent-product | claude.com/product/claude-code |
| `openai/codex-cli` | `openai/gpt-5.3-codex` | agent-product | openai.com/codex |
| `cursor/composer` | multi (mostly Opus) | agent-product | cursor.com |
| `replit/agent` | multi | agent-product | replit.com/agent |
| `cognition/devin` | self + multi | agent-product | cognition.ai/devin |
| `manus-ai/manus` | self + multi (China) | agent-product | manus.im |
| `anthropic/computer-use` | `anthropic/claude-sonnet-4.5` | agent-product | Anthropic system card |
| `google/mariner` | Gemini | agent-product | deepmind.google |
| `openai/operator` | GPT-5 series | agent-product | openai.com/operator |
| `anthropic/claude-cowork` | Claude | agent-product | anthropic |

#### On-device / Edge SLMs (9 new + retag existing)

| model_id | scale_class | size_gb | vendor / country | source |
|----------|-------------|---------|------------------|--------|
| `apple/foundation-3b` | edge-slm | ~3.0 | Apple / USA | machinelearning.apple.com |
| `apple/foundation-private-cloud` | edge-slm (hybrid) | n/a | Apple / USA | Apple WWDC 2025 |
| `microsoft/phi-4-mini-instruct` | edge-slm | ~3.8 | Microsoft / USA | huggingface.co/microsoft/phi-4-mini |
| `microsoft/phi-4` | edge-slm | ~7.0 | Microsoft / USA | huggingface.co/microsoft/phi-4 |
| `google/gemma-3-270m` | edge-slm | ~0.5 | Google / USA | huggingface.co/google/gemma-3-270m |
| `google/gemma-3n` | edge-slm | ~4.4 | Google / USA | huggingface.co/google/gemma-3n |
| `google/function-gemma` | edge-slm | small | Google / USA | google-ai-edge |
| `meta/llama-3.2-1b-instruct` | edge-slm | ~2.0 | Meta / USA | huggingface.co/meta-llama/Llama-3.2-1B |
| `meta/llama-3.2-3b-instruct` | edge-slm | ~6.4 | Meta / USA | huggingface.co/meta-llama/Llama-3.2-3B |

**Retag** existing in DB. Implementation step: query `SELECT id, name FROM models WHERE id LIKE '%-1b%' OR id LIKE '%-3b%' OR id LIKE '%-7b%' OR id LIKE '%-8b%' OR id LIKE '%mini%' OR id LIKE '%nano%'` and apply `scale_class: 'edge-slm'` to entries that are (a) general-purpose LLMs and (b) not already classified as `agent-system`, `dataset`, `tool`, or `narrow-ml`. Known retag candidates: `ai21/jamba2-mini`, `ai21/jamba2-3b`, `alibaba/qwen-1.5-7b`, `alibaba/qwen-2.5-7b`, `alibaba/qwen3-8b`. Estimated ~15 retags total.

**Total: 19 new model entries + ~15 retags**.

### 5D. Sweep methodology

1. **Phase 1 — Playwright extraction** (verified 2026-05-08 pattern):
   - swebench.com / labs.scale.com (SWE Pro) / appworld.dev/leaderboard / hal.cs.princeton.edu / aider.chat
   - mobileagentbench.github.io / mlcommons.org/benchmarks/inference-mobile
2. **Phase 2 — System card PDFs**:
   - `resource/` already has GPT-5.5, Opus 4.7, Mythos system cards. Re-scan agentic sections.
3. **Phase 3 — Strict-attribution validation**:
   - Every row: model name + benchmark name + value visible in primary source.
   - Reject anonymized model labels (e.g. AISI joint-testing "Model A").
   - Reject extrapolations / "frontier baseline" / wrong-URL citations.

---

## Section 6 — Resources & seed_sources additions

### 6A. Agentic leaderboards (11 sites)

| site | url | note |
|------|-----|------|
| HAL — Holistic Agent Leaderboard | hal.cs.princeton.edu | Princeton ICLR 2026, cost-controlled, 9×9 21,730 rollouts |
| HAL Reliability Dashboard | hal.cs.princeton.edu/reliability | 14 agents × 12 metrics × 4 dimensions |
| HAL GAIA | hal.cs.princeton.edu/gaia | GAIA aggregate leaderboard |
| HAL USACO | hal.cs.princeton.edu/usaco | competitive programming |
| AA Coding Agents | artificialanalysis.ai/agents/coding | Cursor / Claude Code / Codex / Copilot |
| BenchLM Agent | benchlm.ai/llm-agent-benchmarks | 24 agentic benchmarks aggregated |
| AI Agent Square | aiagentsquare.com/blog/ai-agent-benchmarks-2026 | Performance × cost |
| Rapid Claw Framework Scorecard | rapidclaw.dev/blog/ai-agent-benchmarks-2026 | LangGraph / CrewAI / AutoGen |
| MorphLLM Coding Agents | morphllm.com/ai-coding-agent | 15 coding agents validated |
| Helicone Manus Benchmark | helicone.ai/blog/manus-benchmark-operator-comparison | Manus vs Operator vs Computer Use |
| Phil Schmid Agent Compendium | github.com/philschmid/ai-agent-benchmark-compendium | 50+ agent benchmarks indexed |

### 6B. On-device / Edge AI (9 sites)

| site | url | note |
|------|-----|------|
| MobileAgentBench | mobileagentbench.github.io | mobile agent benchmark |
| Xiaomi MobileBench GitHub | github.com/XiaoMi/MobileBench | Mobile-Bench v1 / 103 APIs |
| MLCommons MLPerf Mobile | mlcommons.org/benchmarks/inference-mobile | Android/iOS inference latency |
| MLCommons MLPerf Tiny | mlcommons.org/benchmarks/inference-tiny | <100kB MCU models |
| MLCommons MLPerf Inference Edge | mlcommons.org/benchmarks/inference-edge | edge accelerator latency |
| Google AI Edge Gallery | github.com/google-ai-edge/LiteRT-LM | FunctionGemma + LiteRT-LM Tool Use APIs |
| Apple ML Research | machinelearning.apple.com | Apple Foundation Models |
| HuggingFace SmolLM blog | huggingface.co/blog/smollm | SLM curation |
| Local AI Master SLM Guide 2026 | localaimaster.com/blog/small-language-models-guide-2026 | 17 SLM comparison |

**Total Resources additions: 20** (some may already be registered; dedupe before commit).

---

## Section 7 — IoT / On-device dimension (cross-cutting)

This section is a horizontal concern that touches Sections 2, 3, 5, and 6.

### 7A. Category integration
- 10th category `edge` (defined in Section 2)
- Different card body emphasis: `utility_emphasis: true` flag → renders extra row showing min size / best latency / lowest power across the category's covered models

### 7B. Compare panel 3-column extension
- Section 3C is already 3-column: Frontier / Agent-Product / **On-device & Edge**
- Edge column extra metrics: model_size_gb / ttft_ms / power_mw

### 7C. Utility metrics data structure
```js
const UTILITY_METRICS = {
  // sourced from aa_pricing.json (frontier)
  // + manual edge-models.json (size, latency, power citations)
  'apple/foundation-3b': {
    cost_per_1m_in:  0.0,    // free on-device
    cost_per_1m_out: 0.0,
    size_gb: 3.0,
    ttft_ms: null,           // not published
    tok_s: null,
    power_mw: null,
    notes: 'Private to user device; Apple WWDC 2025'
  },
  'google/gemma-3-270m': {
    cost_per_1m_in:  0.0,
    cost_per_1m_out: 0.0,
    size_gb: 0.5,
    ttft_ms: null,
    tok_s: null,
    power_mw: null,
    battery_pct_per_25_conversations: 0.75,  // Pixel 9 Pro
    notes: 'Pixel 9 Pro: 25 conversations = 0.75% battery'
  },
  // ... etc.
};
```

### 7D. New modal scale_class badges

Extend `dashboard/js/modal.js _renderHeader`:
- `agent-product` → amber pill `🛠️ Agent Product`
- `edge-slm` → green pill `📱 Edge SLM`
- existing `frontier-fm` (no badge) and `narrow-ml`, `agent-system`, `dataset`, `tool`, etc. unchanged

---

## Implementation plan split (handoff to writing-plans)

The implementation plan should split this work into **4 subtasks** (suggest A→B→C→D linear order to avoid dependency conflicts):

| Task | Subject | Estimated effort | Dependency |
|------|---------|------------------|------------|
| **A. UI** | `agent.js` + tab + modal extensions + CSS | medium (~9 sub-tasks) | none |
| **B. Benchmark registration** | 14 new benchmarks in single ingest JSON | small (~3 sub-tasks) | none |
| **C. Model registration** | 19 new + ~15 retags + scale_class enrichment | medium (~5 sub-tasks) | none |
| **D. Score sweep** | 60–100 new rows across 16 benchmarks via Playwright + system card | large (~8 sub-tasks) | B and C must land first (model_ids referenced) |

After all 4 lands: integration test (Section 4 testing block) + HISTORY/changelog/Plans/main-sync.

---

## Strict-attribution rule (project-wide, restated)

Every row in the score table must have **model name + benchmark name + value** explicitly written in a verifiable primary source. Anonymized models (AISI joint-testing "Model A"), extrapolations, or "frontier baseline" placeholders are rejected. Aggregator sites (llm-stats.com, benchlm.ai) are acceptable only when they cite an upstream primary source and the value matches that source on inspection.

---

## Reproducibility

After implementation:
```bash
# Phase 1: data
python scripts/load_benchmark_scores.py resource/zzz...agent_menu_data_2026_05_08_scores.json
python -m cyber export

# Phase 2: deploy
git add dashboard/ resource/ config/ data/export/
git commit -m "feat: Agent menu + agentic data sweep"
git push origin ops

# Phase 3: verify
python scripts/audit_version_date_consistency.py   # 0 contradictions
# Open hollobit.github.io/SOTA/ → click Agent tab → run manual smoke checklist
```
