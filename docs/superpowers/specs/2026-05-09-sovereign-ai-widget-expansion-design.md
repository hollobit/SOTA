# Sovereign AI Menu Widget Expansion — Design Spec

**Date:** 2026-05-09
**Author:** USER (brainstormed with Claude Opus 4.7)
**Target menu:** Sovereign AI (`dashboard/js/sovereign.js`)
**Goal:** Add 6 NEW widgets that complement Sovereign AI's existing 9 widgets, focused on gaps not covered by the existing rich set.

---

## Context

Unlike AI4S (Session 7) / Medical AI (Session 8) / Physical AI (Session 9), Sovereign AI already has 9 chart widgets. This spec adds **only widgets that fill genuine gaps**, not duplicate the established ones.

**Existing widgets** (already shipped):
- Region Map, Timeline, Cumulative, Country Radar, Country Leaderboard, 3 Dimension renders (language/medical/domain), Perf Suites, Agent Products section (Session 6), Heatmap.

**Gap analysis** (what's missing):
1. **SOTA Watch hero cards** — Sovereign AI has no "milestone tile" section like AI4S/Medical/Physical AI menus.
2. **Frontier vs Sovereign-Specialist compare** — no head-to-head between frontier LLMs and regional specialists on multilingual benchmarks.
3. **VLAIR Legal sub-benchmark radar** — VLAIR has 5 sub-benches, but no integrated radar view.
4. **Multi-language progression curve** — mmmlu/c_eval/cmmlu over time.
5. **Per-dimension drill-down modal** — 3 dimension cards (language/medical/domain) currently render full sections, but no quick "show me top-N for THIS dimension" modal.
6. **Sovereign benchmark catalog** — searchable list of all sovereign-tagged benchmarks with region/dimension filter.

**Data shape** (snapshot 2026-05-09):
- 19 regions (kr/fr/cn/jp/in/il/ae/sg/ch/us-legal/us-fin/ru/de/uk/us-open + 4 application-specific)
- 3 dimensions: language / medical / domain
- ~30+ sovereign benchmarks: mmmlu (31), swe_bench_multilingual (13), chinese_simpleqa (6), global_piqa (5), aixcc_synth_vuln (4), vlair_* (3-4 each), c_eval/cmmlu (3 each), kmle (3), afrimed (2), cybersec_eval3 (3)

---

## Sub-section structure

```
┌─────────────────────────────────────────────────────────┐
│ Sovereign AI Tab                                        │
├─────────────────────────────────────────────────────────┤
│ ▶ SOTA Watch — Sovereign Breakthroughs (NEW)            │
│   8 hero tiles spanning Asia / Europe / Middle East /   │
│   Africa with region flag accent.                       │
├─────────────────────────────────────────────────────────┤
│ ▶ Region Map / Timeline / Cumulative / Country Radar /  │
│   Country Leaderboard / Dimensions / Perf Suites /      │
│   Agent Products / Heatmap (existing — unchanged)       │
├─────────────────────────────────────────────────────────┤
│ ▶ Cross-Region Compare (3 NEW widgets)                  │
│   W2 Frontier vs Sovereign-Specialist + W3 VLAIR Legal  │
│   Radar + W4 Multi-language Progression                 │
├─────────────────────────────────────────────────────────┤
│ ▶ Domain Mini-Leaderboards (NEW W5 modal)               │
│   3 dimension cards Shift+click → modal                 │
├─────────────────────────────────────────────────────────┤
│ ▶ Sovereign Benchmark Catalog (NEW W6)                  │
│   ~30 benchmarks searchable                             │
└─────────────────────────────────────────────────────────┘
```

---

## Widget inventory (6 NEW widgets)

| # | Widget | Type | Data |
|---|---|---|---|
| **W1** | Sovereign Breakthrough Hero Cards (8 tiles) | DOM cards | Static `_SOV_BREAKTHROUGHS` |
| **W2** | Frontier vs Sovereign-Specialist Compare | ECharts grouped bar | App.data.scores (mmmlu/c_eval/cmmlu/chinese_simpleqa) |
| **W3** | VLAIR Legal Sub-benchmarks Radar | ECharts radar | 5 vlair_* sub-benches |
| **W4** | Multi-language Progression Curve | ECharts multi-line | mmmlu/c_eval/cmmlu × release_date |
| **W5** | Per-Dimension Drill-down Modal | DOM modal | App.data + DIMENSIONS array |
| **W6** | Sovereign Benchmark Catalog Grid | Searchable DOM grid | App.data.benchmarks + `_BENCHMARK_DIMENSION_MAP` |

---

## Design decisions

### 1. Hero breakthroughs — `_SOV_BREAKTHROUGHS`

8 entries spanning 5 regions (East Asia / Europe / Middle East / Africa / Southeast Asia):

```js
var _SOV_BREAKTHROUGHS = [
  {
    title: 'KMed.ai (SNUH × Naver)',
    narrative: 'Korean medical FM — KMLE 96.4 SOTA',
    value: 'KMLE 96.4%',
    region: 'kr',
    flag: '🇰🇷',
    model_id: 'snuh-naver/kmed-ai',
    benchmark_id: 'kmle',
    source_url: 'https://www.naver.com/healthcare-ai',
    year: 2025
  },
  {
    title: 'HyperCLOVA X',
    narrative: 'Naver Korean foundation model',
    value: 'Korea sovereign FM',
    region: 'kr',
    flag: '🇰🇷',
    model_id: 'naver/hyperclova-x',
    benchmark_id: 'kmlu',
    source_url: 'https://clova.ai/hyperclova',
    year: 2024
  },
  {
    title: 'DeepSeek V4 Pro',
    narrative: 'Open-weight Chinese frontier',
    value: 'Frontier-class V4',
    region: 'cn',
    flag: '🇨🇳',
    model_id: 'deepseek/deepseek-v4-pro',
    benchmark_id: 'chinese_simpleqa',
    source_url: 'https://www.deepseek.com/',
    year: 2025
  },
  {
    title: 'Qwen 3.6 Plus',
    narrative: 'Alibaba Tongyi flagship',
    value: 'C-Eval / CMMLU SOTA',
    region: 'cn',
    flag: '🇨🇳',
    model_id: 'alibaba/qwen-3.6-plus',
    benchmark_id: 'c_eval',
    source_url: 'https://qwenlm.github.io/',
    year: 2025
  },
  {
    title: 'Mistral Large 3',
    narrative: 'European frontier model',
    value: 'EU sovereign frontier',
    region: 'fr',
    flag: '🇫🇷',
    model_id: 'mistral/mistral-large-3',
    benchmark_id: 'mmmlu',
    source_url: 'https://mistral.ai/news/',
    year: 2025
  },
  {
    title: 'Falcon (TII)',
    narrative: 'UAE Technology Innovation Institute',
    value: 'Arabic medical SOTA',
    region: 'ae',
    flag: '🇦🇪',
    model_id: 'tii/falcon-h1-arabic-34b',
    benchmark_id: 'arabic_medical_eval',
    source_url: 'https://www.tii.ae/news/falcon-arabic',
    year: 2024
  },
  {
    title: 'Aya 23 (Cohere)',
    narrative: 'Multilingual covering 23 languages',
    value: 'Global PIQA SOTA',
    region: 'us-open',
    flag: '🌐',
    model_id: 'cohere/aya-23',
    benchmark_id: 'global_piqa',
    source_url: 'https://cohere.com/research/aya',
    year: 2024
  },
  {
    title: 'Sea-LION v4',
    narrative: 'AI Singapore SE Asian languages',
    value: 'SEA multilingual',
    region: 'sg',
    flag: '🇸🇬',
    model_id: 'ai-singapore/apertus-sea-lion-v4-8b',
    benchmark_id: 'mmmlu',
    source_url: 'https://aisingapore.org/sea-lion/',
    year: 2025
  }
];
```

### 2. Benchmark → dimension mapping — `_BENCHMARK_DIMENSION_MAP`

Reuses `Sovereign.DIMENSIONS` ids (language/medical/domain):

```js
var _BENCHMARK_DIMENSION_MAP = {
  // language
  'mmmlu': 'language',
  'c_eval': 'language',
  'cmmlu': 'language',
  'chinese_simpleqa': 'language',
  'global_piqa': 'language',
  'swe_bench_multilingual': 'language',
  // medical
  'kmle': 'medical',
  'medqa': 'medical',
  'medqa_5op': 'medical',
  'pubmedqa': 'medical',
  'mmlu_med': 'medical',
  'medxpertqa': 'medical',
  'medmcqa': 'medical',
  'med_avg': 'medical',
  'healthbench': 'medical',
  'healthbench_professional': 'medical',
  'afrimed_qa': 'medical',
  'ehrqa': 'medical',
  // domain
  'vlair_doc_qa': 'domain',
  'vlair_summarization': 'domain',
  'vlair_chronology': 'domain',
  'vlair_redlining': 'domain',
  'vlair_data_extract': 'domain',
  'vlair_transcript': 'domain',
  'aixcc_synth_vuln': 'domain',
  'fpb': 'domain',
  'convfinqa': 'domain',
  'finqa': 'domain'
};
```

### 3. File structure

`dashboard/js/sovereign-charts.js` (NEW UMD module) + `dashboard/js/sovereign.js` (modify — add hook + Shift+click) + `dashboard/index.html` (mount + script + cache-bust).

UMD pattern matches `physical-ai-charts.js`.

### 4. Per-dimension composite (W5 modal)

Same formula: per-dimension composite = mean of `value / max(value across that benchmark) * 100` across the dimension's benchmarks. Coverage threshold ≥1.

### 5. New benchmark/score ingestion

None for Phase 1+2. All widgets ship on currently-loaded data. arabic_medical_eval used in W1 may not exist as a benchmark ID — that's OK, hero cards are static metadata; the source_url points to verification.

---

## Implementation phasing

```
PHASE 1 — Foundation + 3 immediate widgets
  ▸ 1A — Foundation: _BENCHMARK_DIMENSION_MAP + _ensureMountPoint factory + _SOV_BREAKTHROUGHS
  ▸ 1B — 3 immediate widgets: W1 Hero Cards / W3 VLAIR Radar / W6 Catalog Grid

PHASE 2 — Data-dependent widgets
  ▸ W2 Frontier vs Sovereign-Specialist / W4 Multi-lang Progression / W5 Per-Dimension Modal

PHASE 3 — Polish + deploy
  ▸ Lazy render + cache-bust + push + CI verify + docs
```

**Estimated commits:** ~12.

---

## Out of scope

- Cross-region composite leaderboard (different score scales meaningless across cybersec/medical/legal).
- New data sweeps.
- Cost / pricing widgets.
- Compute sovereignty matrix (deferred — would require new metadata schema for chip/cloud per region).

---

## Success criteria

1. Sovereign AI tab loads with 6 NEW widgets visible alongside existing 9.
2. Clicking any of 3 dimension cards (language/medical/domain) Shift+click opens per-dimension leaderboard modal.
3. All scores trace to primary source URL.
4. No `innerHTML` writes added.
5. Mobile responsive + a11y.
6. Live deploy verified — fetched JS contains all widget renderer markers.
