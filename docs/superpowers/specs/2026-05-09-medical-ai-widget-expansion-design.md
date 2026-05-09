# Medical AI Menu Widget Expansion — Design Spec

**Date:** 2026-05-09
**Author:** USER (brainstormed with Claude Opus 4.7)
**Target menu:** Medical AI (`dashboard/js/medical-ai.js`)
**Goal:** Add 10 ECharts/DOM widgets to Medical AI menu, raising it from 2 chart widgets (timeline + radar) to a Medium-density information dashboard comparable to AI4S menu's pattern.

---

## Context

The Medical AI menu currently has only 2 chart widgets (timeline + radar) plus category cards and a benchmark table. AI4S menu (Session 7) shipped 10 widgets across SOTA Watch / 19 Domain Cards / Cross-Lab Compare / Domain Mini-Leaderboards sub-sections. This spec applies the same hybrid pattern to Medical AI, adapted for medical-specific data.

**Data shape** (snapshot 2026-05-09):
- **18 categories**: clinical-llm, biomedical-llm, multilingual-medical, biomedical-encoder, korean-medical, medical-vlm, protein-fm, drug-discovery, radiology-reporting, multilingual-medical-vlm, safety-evaluator, clinical-prediction, plus 8 country-specific (japan, germany, france, uk, canada, india, uae, singapore).
- **~150+ medical models** distributed across the 18 categories
- **~30+ medical benchmarks** with strongest coverage on medqa_usmle (34 scores), HealthBench family (~50 scores across 7 sub-benches), pubmedqa (15), medmcqa (13). Long-tail: medcalc_bench, derm/path/jmed/medbench_cn, mmedbench (6-lang), meddialog, etc.

**Key data characteristics that shape this design:**
1. **Specialty axis is a natural taxonomy** — cardiology / dermatology / radiology / pathology / oncology / pediatrics / orthopedics. This replaces vendor in cross-section widgets.
2. **HealthBench family is the richest sub-benchmark set** — 7 sub-benches (consensus / professional / redteam / research / care-consult / good-faith / writing) — natural radar axes.
3. **USMLE progression is the headline narrative** — Med-PaLM 2 → Med-Gemini → MedGemma → GPT-4 USMLE pass rate over time.
4. **Frontier vs medical specialist comparison is highly relevant** — GPT-5.5 / Claude Opus 4.7 vs Med-Gemini-3-Pro / MedGemma-27B on shared MedQA-class benchmarks.
5. **Multilingual is a real differentiator** — mmedbench (6 langs), jmedbench (Japanese), medbench_cn / climedbench_cn (Chinese), KMLE (Korean), Apollo / Aloe (multilingual).
6. **Safety / hallucination evaluation is a category of its own** — safety-evaluator models + healthbench_pro_redteam + writing-related rubrics.

---

## Sub-section structure

The Medical AI tab uses Hybrid C structure: keep Agent-menu sub-section *names* (familiar UX), but redefine content for medical domain.

```
┌─────────────────────────────────────────────────────────┐
│ Medical AI Tab                                          │
├─────────────────────────────────────────────────────────┤
│ ▶ SOTA Watch — Medical Breakthroughs                    │
│   6-8 hero tiles featuring Med-Gemini-3-Pro / Med-PaLM 2│
│   USMLE 86.5 / MedGemma family / Polaris-3 / OpenBioLLM-│
│   70B / ChatGPT for Clinicians / HealthBench-Pro top /  │
│   M42 Med42-v2-70B (UAE FDA-class). Each = model name + │
│   1-line narrative + key score + primary-source URL.    │
├─────────────────────────────────────────────────────────┤
│ ▶ 18 Category Cards (existing pattern, enhanced)        │
│   Each card click → per-category leaderboard modal.     │
├─────────────────────────────────────────────────────────┤
│ ▶ Cross-Specialty Compare                               │
│   Replaces "vendor" axis with medical specialty.        │
│   Specialty × Benchmark matrix + Frontier-vs-Medical-   │
│   Specialist compare + HealthBench Sub-benchmarks Radar │
│   + Multi-language Medical Compare.                     │
├─────────────────────────────────────────────────────────┤
│ ▶ Domain-specific Mini-Leaderboards                     │
│   Modal on category card click. Shows that category's   │
│   native benchmarks ranked by score; no cross-category  │
│   composite forced.                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Widget inventory (10 widgets)

| # | Widget | Sub-section | Type | Data |
|---|---|---|---|---|
| **W1** | Medical Breakthrough Hero Cards (6-8 tiles) | SOTA Watch | DOM cards | Static `_MED_BREAKTHROUGHS` |
| **W2** | Specialty × Benchmark Coverage Matrix | Cross-Specialty Compare | ECharts heatmap | `_SPECIALTY_MAP` × benchmark domains |
| **W3** | Frontier vs Medical-Specialist Compare | Cross-Specialty Compare | ECharts grouped bar | App.data.scores (medqa_usmle/pubmedqa/medmcqa) |
| **W4** | HealthBench Sub-benchmarks Radar | Cross-Specialty Compare | ECharts radar | 7 healthbench_* sub-benches |
| **W5** | Per-Category Leaderboard Modal | Mini-Leaderboards | DOM modal | App.data + `_BENCHMARK_CATEGORY_MAP` |
| **W6** | USMLE Progression Curve | Domain Deep Dive | ECharts multi-line | medqa_usmle 34 scores × release_date |
| **W7** | Multi-language Medical Compare | Domain Deep Dive | ECharts grouped bar | mmedbench / jmedbench / medbench_cn / KMLE |
| **W8** | Medical Safety Heatmap | Domain Deep Dive | ECharts heatmap | safety-evaluator + healthbench_pro_redteam variants |
| **W9** | Clinical Prediction (MIMIC/eICU) Bubble | Domain Deep Dive | ECharts scatter | clinical-prediction category models |
| **W10** | Medical Benchmark Catalog Grid | Catalog | Searchable DOM grid | App.data.benchmarks + `_BENCHMARK_CATEGORY_MAP` |

---

## Design decisions

### 1. Specialty taxonomy — `_SPECIALTY_MAP`

**Decision:** Hardcoded specialty list with model-id keyword matching. Specialties chosen to map to common medical domains AND existing Medical AI categories.

```js
var _SPECIALTY_MAP = [
  { key: 'general',       label: 'General Clinical',
    keywords: ['gpt-clinicians','medlm','med-palm','med-gemini','medgemma','polaris','clinical','almanac'] },
  { key: 'biomedical',    label: 'Biomedical Research',
    keywords: ['openbiollm','biomistral','meditron','biogpt','clinical-camel','medalpaca','med42','aloe','biomedlm','pmc-llama','me-llama','asclepius'] },
  { key: 'radiology',     label: 'Radiology / Imaging',
    keywords: ['radiology','radqa','dermavqa','chexpert','rad-onc','maira'] },
  { key: 'pathology',     label: 'Pathology',
    keywords: ['pathology','virchow','prov-gigapath','musk-multimodal'] },
  { key: 'dermatology',   label: 'Dermatology',
    keywords: ['derm','derma'] },
  { key: 'cardiology',    label: 'Cardiology',
    keywords: ['cardio','ecg'] },
  { key: 'oncology',      label: 'Oncology',
    keywords: ['onc','tumor','cancer'] },
  { key: 'protein',       label: 'Protein / Drug Discovery',
    keywords: ['esm','rfdiffusion','rosettafold','phenom','iso-dde','chemistry42','boltzgen'] },
  { key: 'multilingual',  label: 'Multilingual / Regional',
    keywords: ['mmedlm','apollo-medlm','huatuogpt','zhongjing','bianque','doctorglm','biancang','aimedlex','jmed','kmed','huatuo'] },
  { key: 'safety',        label: 'Safety / Hallucination',
    keywords: ['safety','hallucination','medfact','medhalt'] },
  { key: 'mental-health', label: 'Mental Health',
    keywords: ['mental','psych','wellbeing'] },
  { key: 'other',         label: 'Other Medical',
    keywords: [] }
];
```

A model whose ID/name matches no keyword falls into `other`. Used by W2 (specialty heatmap).

### 2. Benchmark → category mapping — `_BENCHMARK_CATEGORY_MAP`

```js
var _BENCHMARK_CATEGORY_MAP = {
  // USMLE / clinical knowledge
  'medqa_usmle': 'clinical-knowledge',
  'medqa': 'clinical-knowledge',
  'medqa_vals_ai': 'clinical-knowledge',
  'medmcqa': 'clinical-knowledge',
  'medexpqa': 'clinical-knowledge',
  // Biomedical research QA
  'pubmedqa': 'biomedical-research',
  // HealthBench family (7 sub-benches)
  'healthbench': 'healthbench',
  'healthbench_hard': 'healthbench',
  'healthbench_consensus': 'healthbench',
  'healthbench_professional': 'healthbench',
  'healthbench_pro_care_consult': 'healthbench',
  'healthbench_pro_gf_difficult': 'healthbench',
  'healthbench_pro_goodfaith': 'healthbench',
  'healthbench_pro_redteam': 'healthbench',
  'healthbench_pro_research': 'healthbench',
  'healthbench_pro_writing': 'healthbench',
  'healthbench_pro_orthopedics': 'healthbench',
  // Specialty
  'dermabench': 'specialty',
  'dermavqa': 'specialty',
  'medcalc_bench': 'specialty',
  'medcalc_bench_verified': 'specialty',
  // Multilingual
  'mmedbench': 'multilingual',
  'jmedbench': 'multilingual',
  'medbench_cn': 'multilingual',
  'climedbench_cn': 'multilingual',
  // Dialog / safety
  'meddialog': 'dialog',
  'meddialog_rubrics': 'dialog'
};
```

### 3. Hero breakthroughs — `_MED_BREAKTHROUGHS` static dataset

8 entries spanning 4 medical themes (clinical knowledge / biomedical / multilingual / specialty):

```js
var _MED_BREAKTHROUGHS = [
  {
    title: 'Med-Gemini-3-Pro',
    narrative: 'Frontier medical reasoning + multimodal',
    value: 'MedQA SOTA',
    domain: 'clinical-llm',
    model_id: 'google/med-gemini-3-pro',
    benchmark_id: 'medqa_usmle',
    source_url: 'https://arxiv.org/abs/2404.18416',
    year: 2025
  },
  {
    title: 'Med-PaLM 2',
    narrative: 'First model to pass USMLE expert level',
    value: 'USMLE 86.5%',
    domain: 'clinical-llm',
    model_id: 'google/med-palm-2',
    benchmark_id: 'medqa_usmle',
    source_url: 'https://www.nature.com/articles/s41591-024-02855-5',
    year: 2023
  },
  {
    title: 'MedGemma 27B',
    narrative: 'Open-weight Gemma-class medical FM',
    value: 'MedQA 87.7%',
    domain: 'clinical-llm',
    model_id: 'google/medgemma-27b',
    benchmark_id: 'medqa_usmle',
    source_url: 'https://huggingface.co/google/medgemma-27b-it',
    year: 2025
  },
  {
    title: 'Polaris-3',
    narrative: 'Hippocratic AI 70B clinical conversation',
    value: 'HealthBench top',
    domain: 'clinical-llm',
    model_id: 'hippocratic-ai/polaris-3',
    benchmark_id: 'healthbench',
    source_url: 'https://www.hippocraticai.com/research/polaris-3',
    year: 2025
  },
  {
    title: 'OpenBioLLM-70B',
    narrative: 'Open biomedical LLM (Saama)',
    value: 'PubMedQA 80%',
    domain: 'biomedical-llm',
    model_id: 'saama/openbiollm-llama3-70b',
    benchmark_id: 'pubmedqa',
    source_url: 'https://huggingface.co/aaditya/Llama3-OpenBioLLM-70B',
    year: 2024
  },
  {
    title: 'M42 Med42-v2-70B',
    narrative: 'UAE Cerebras-trained clinical LLM',
    value: 'MedQA Foundation-class',
    domain: 'biomedical-llm',
    model_id: 'm42-health/med42-v2-70b',
    benchmark_id: 'medqa_usmle',
    source_url: 'https://m42.ae/media-resources/news/m42-announces-new-clinical-llm-to-transform-the-future-of-ai-in-healthcare/',
    year: 2024
  },
  {
    title: 'HuatuoGPT-o1 72B',
    narrative: 'Chinese medical reasoning LLM',
    value: 'climedbench_cn SOTA',
    domain: 'multilingual-medical',
    model_id: 'freedomintelligence/huatuogpt-o1-72b',
    benchmark_id: 'climedbench_cn',
    source_url: 'https://github.com/FreedomIntelligence/HuatuoGPT-o1',
    year: 2024
  },
  {
    title: 'KMed.ai (SNUH × Naver)',
    narrative: 'Korean medical FM — KMLE 96.4 SOTA',
    value: 'KMLE 96.4%',
    domain: 'korean-medical',
    model_id: 'snuh-naver/kmed-ai',
    benchmark_id: 'kmle',
    source_url: 'https://www.naver.com/healthcare-ai',
    year: 2025
  }
];
```

### 4. File structure

**Decision:** Split into `dashboard/js/medical-ai.js` (existing — render orchestration + categories) + `dashboard/js/medical-ai-charts.js` (new — 10 widgets). Same UMD pattern as ai4s-charts.js.

`medical-ai-charts.js` exposes `MedicalAICharts.renderAll()` called from `MedicalAI.render()`. Each widget uses the `_ensureMountPoint(id, title, hint)` factory cloned from ai4s-charts.js.

### 5. Per-category composite (W5 modal)

For each category, modal computes per-category composite = mean of `value / max(value across that benchmark) * 100` across the category's benchmarks where the model has a score. Coverage threshold = ≥ 1 benchmark (sparse data tolerant). HealthBench safety/hallucination scores (e.g., redteam pass rate) treated as higher-better.

### 6. New benchmark/score ingestion (Phase 2A)

**Optional sweep targets** for richer widgets:
- **HealthBench-Pro additional sub-benches**: OpenAI HealthBench paper has more sub-categories (radiology / oncology / pediatrics) that may have public scores → ingest from primary sources.
- **KMLE Korean medical**: SNUH KMed.ai paper claims 96.4 — verify primary source, ingest if public.
- **mmedbench multi-language scores**: multi-lang scores per language for top mmedlm models.

These are deferred — Phase 1 + Phase 2B widgets ship on currently-loaded data, sweep optional in a follow-up session.

---

## Implementation phasing

```
PHASE 1 — Foundation + immediate-render widgets
═══════════════════════════════════════════════════════════════════
  Sub-Phase 1A — Foundation (controller, sequential)
    ▸ _SPECIALTY_MAP + _resolveSpecialty(modelId, modelName) — ~80 LOC
    ▸ _BENCHMARK_CATEGORY_MAP + _resolveCategory(benchmarkId) — ~50 LOC
    ▸ medical-ai-charts.js skeleton (clone ai4s-charts.js _ensureMountPoint
      factory + renderAll orchestrator + style block) — ~150 LOC
    ▸ _MED_BREAKTHROUGHS static object (8 entries) — ~80 LOC

  Sub-Phase 1B — Immediate widgets (sequential per skill rules)
    ▸ W1  Medical Breakthrough Hero Cards
    ▸ W2  Specialty × Benchmark Coverage Matrix
    ▸ W4  HealthBench Sub-benchmarks Radar
    ▸ W6  USMLE Progression Curve
    ▸ W10 Medical Benchmark Catalog Grid

  Phase 1 result: 5 widgets live, ~1500 LOC added, fully functional
  with current data.

PHASE 2 — Data-dependent widgets
═══════════════════════════════════════════════════════════════════
  Sub-Phase 2B — Data-dependent widgets (sequential)
    ▸ W3  Frontier vs Medical-Specialist Compare (medqa_usmle/pubmedqa
          have both frontier LLMs and medical specialists scored)
    ▸ W5  Per-Category Leaderboard Modal (after _BENCHMARK_CATEGORY_MAP
          is finalized in Phase 1A)
    ▸ W7  Multi-language Medical Compare (mmedbench/jmedbench/etc.)
    ▸ W8  Medical Safety Heatmap (healthbench_pro_redteam variants)
    ▸ W9  Clinical Prediction Bubble (MIMIC/eICU models in clinical-
          prediction category)

  Phase 2 result: full 10 widgets live.
  (Note: Phase 2A data sweep is OPTIONAL for this menu — most widgets
  work on currently-loaded data. Sweep deferred to follow-up session
  unless explicitly requested.)

PHASE 3 — Polish + deploy
═══════════════════════════════════════════════════════════════════
  ▸ Lazy render integration (eager 3 + lazy 6 via requestIdleCallback)
  ▸ Cache-bust + push + CI deploy verify + HISTORY/changelog + main sync
```

**Estimated commits:** ~15-17 (Phase 1: 9, Phase 2B: 5, Phase 3: 2). Mostly sequential.

---

## Cache-bust + integration

- `dashboard/js/medical-ai.js` cache-bust bumped on every change (currently `?v=20260503a`).
- New file `dashboard/js/medical-ai-charts.js` linked in `dashboard/index.html` immediately after `medical-ai.js`.
- Widget mount container `#medical-ai-charts` added inside the existing `#tab-medical-ai` section in `index.html`.

---

## Out of scope (explicitly deferred)

- **Cross-category composite leaderboard** — semantically meaningless (specialty differences too large).
- **Cost / pricing widgets** — most medical models are research artifacts or hospital-deployed, no $/token.
- **FDA-cleared device tracking** — requires separate data source + new schema.
- **Clinical safety case studies** — qualitative, not chart-friendly.
- **Patient-facing UX widgets** — out of dashboard scope.

---

## Success criteria

1. Medical AI tab loads with 10 widgets visible (5 immediately on tab open, rest via lazy render).
2. Clicking any of the 18 category cards opens a per-category leaderboard modal.
3. All scores trace back to a primary source URL (strict-attribution rule).
4. No `innerHTML` writes added (security hook compliance).
5. Mobile responsive: chart heights shrink to 320px on screens ≤768px.
6. Accessibility: every chart mount has `role="img"` + aria-label.
7. Live deploy verified — fetched JS contains all widget renderer markers.
