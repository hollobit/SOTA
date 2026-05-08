# AI4S Menu Widget Expansion — Design Spec

**Date:** 2026-05-09
**Author:** USER (brainstormed with Claude Opus 4.7)
**Target menu:** AI4S (`dashboard/js/ai4s.js`)
**Goal:** Add 10 ECharts/DOM widgets to the AI4S menu, raising it from 0 chart widgets to a Medium-density information dashboard comparable to Agent menu's pattern (but adapted to AI4S's domain characteristics).

---

## Context

The AI4S menu currently has **0 chart widgets** — only category tiles + a model list. By comparison, the Agent menu has 18 widgets, Sovereign 5+, Medical/Physical AI 2 each. AI4S has the largest information gap among the four menus.

**Data shape** (snapshot 2026-05-09):
- 19 categories (nuclear-fusion / energy-grid / quantum-chem / cosmology-particle / geosci-seismo / atmospheric-chem / hydrology / agriculture / pharma / lab-automation / symbolic-math / co-scientist / math / chemistry / astronomy / physics-materials / geo-climate / bio-genomics / multi-disciplinary)
- ~90+ AI4S models distributed across the 19 categories (climate-weather 16, biology-genomics 21, materials-physics 12, math 14, chemistry 9, fusion 5, pharma 5, energy-grid 4, astronomy 4)
- ~33 AI4S-related benchmarks (math 24 scores, imo_answerbench 16, mathvision 11, matharena_apex 10, math_500 8, frontiermath 7, casp16_gdt 4, alphafold3_pae 3, protein_binding 3, …)

**Key data characteristics that shape this design:**
1. **Sparse per-benchmark data** — most domains have 1-3 scores per benchmark, unlike Agent menu where benchmarks have 20+ scores.
2. **No cross-domain composite score** — averaging AlphaFold's CASP-GDT with AlphaProof's IMO would be meaningless. Composite leaderboards must be per-domain.
3. **Research labs replace vendors** — DeepMind / MIT / Argonne / FAIR / NVIDIA-Clara / IBM are the natural axis, not OpenAI/Anthropic/Google as in Agent.
4. **Milestone-driven narrative** — AI4S's story is breakthrough events (AlphaFold, AlphaProof, Aurora), not gradual SOTA leakage.
5. **No commercial cost data** — most AI4S models are research artifacts without $/token pricing.

---

## Sub-section structure

The AI4S tab uses Hybrid C structure: keep Agent-menu sub-section *names* (familiar UX), but redefine content for AI4S domain.

```
┌─────────────────────────────────────────────────────────┐
│ AI4S Tab                                                │
├─────────────────────────────────────────────────────────┤
│ ▶ SOTA Watch — Science Breakthroughs                    │
│   5-8 hero tiles featuring AlphaFold 3 / AlphaProof /   │
│   Aurora / MatterGen / Evo 2 / AlphaQubit / Chai-2 /    │
│   Goedel-Prover. Each = model name + 1-line narrative + │
│   key score + primary-source URL.                       │
├─────────────────────────────────────────────────────────┤
│ ▶ 19 Domain Cards (existing pattern, enhanced)          │
│   Each card = icon + label + model count + benchmark    │
│   count. Click → per-domain mini-leaderboard modal.     │
├─────────────────────────────────────────────────────────┤
│ ▶ Cross-Lab Compare                                     │
│   Replaces vendor axis with research-lab axis. Lab ×    │
│   Domain bubble matrix + Frontier-vs-Specialist compare │
│   panel + Breakthrough timeline.                        │
├─────────────────────────────────────────────────────────┤
│ ▶ Domain-specific Mini-Leaderboards                     │
│   Modal on domain card click. Shows that domain's       │
│   native benchmarks ranked by score; no cross-domain    │
│   composite forced.                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Widget inventory (10 widgets)

| # | Widget | Sub-section | Type | Data dependency |
|---|---|---|---|---|
| **W1** | Breakthrough Hero Cards (5-8 tiles) | SOTA Watch | DOM cards | Static `_BREAKTHROUGHS` object |
| **W2** | Lab × Domain Bubble Matrix | Cross-Lab Compare | ECharts heatmap | App.data + `_LAB_MAP` |
| **W3** | Frontier vs Specialist Compare | Cross-Lab Compare | ECharts grouped bar | App.data.scores (math priority) |
| **W4** | Breakthrough Timeline | Cross-Lab Compare | ECharts scatter (year × milestone) | release_date + `_BREAKTHROUGHS` |
| **W5** | Per-Domain Leaderboard Modal | Domain Mini-Leaderboards | DOM modal w/ table | App.data + `_BENCHMARK_DOMAIN_MAP` |
| **W6** | Math Progression Curve | Domain Deep Dive | ECharts multi-line | math/imo_answerbench/math_500/frontiermath/matharena_* — already populated |
| **W7** | Weather Forecast Skill Curve | Domain Deep Dive | ECharts line+area | **Requires new ingestion** (Aurora/GraphCast/Pangu/AIFS RMSE from ECMWF + MS papers) |
| **W8** | Protein Folding (CASP) Progression | Domain Deep Dive | ECharts step+area | **Requires CASP12-15 backfill** (currently only casp16_gdt × 4 + alphafold3_pae × 3) |
| **W9** | Materials Discovery Yield | Domain Deep Dive | ECharts bubble | **Requires Matbench Discovery + MatterGen yield ingest** |
| **W10** | Benchmark Catalog Grid | Catalog | Searchable DOM grid | App.data.benchmarks + `_BENCHMARK_DOMAIN_MAP` |

---

## Design decisions

### 1. Lab taxonomy

**Decision:** Explicit `_LAB_MAP` object (commit-time hardcoded), not regex.

```js
var _LAB_MAP = {
  'deepmind':       { label: 'DeepMind',       prefixes: ['deepmind/', 'deepmind-cfs/', 'deepmind-doe/'] },
  'mit-cfs':        { label: 'MIT (CFS)',      prefixes: ['mit-cfs/'] },
  'argonne':        { label: 'Argonne (ANL)',  prefixes: ['anl/', 'argonne/'] },
  'fair':           { label: 'Meta FAIR',      prefixes: ['meta/', 'fair/', 'meta-fair/'] },
  'nvidia':         { label: 'NVIDIA',         prefixes: ['nvidia/', 'nvidia-clara/', 'physicsnemo/'] },
  'ibm':            { label: 'IBM',            prefixes: ['ibm/', 'ibm-lf/'] },
  'microsoft':      { label: 'Microsoft',      prefixes: ['microsoft/', 'msft-inl/'] },
  'isomorphic':     { label: 'Isomorphic Labs',prefixes: ['isomorphic/'] },
  'openai':         { label: 'OpenAI',         prefixes: ['openai/'] },
  'anthropic':      { label: 'Anthropic',      prefixes: ['anthropic/'] },
  'google':         { label: 'Google Research',prefixes: ['google/', 'google-jku/'] },
  'ecmwf':          { label: 'ECMWF',          prefixes: ['ecmwf/'] },
  'ornl':           { label: 'ORNL',           prefixes: ['ornl/'] },
  'cmu':            { label: 'CMU',            prefixes: ['cmu/'] },
  'huggingface':    { label: 'Hugging Face',   prefixes: ['huggingface/'] },
  // …~15 entries total
};
```

A model whose ID prefix doesn't match any entry falls into a synthetic "Other" bucket (visible but lower priority). The map is reviewed at commit time when new models are ingested — not auto-generated.

### 2. Benchmark → Domain mapping

**Decision:** Explicit `_BENCHMARK_DOMAIN_MAP` object, not regex.

```js
var _BENCHMARK_DOMAIN_MAP = {
  'casp16_gdt':         'bio-genomics',
  'alphafold3_pae':     'bio-genomics',
  'protein_binding':    'bio-genomics',
  'imo_answerbench':    'math',
  'math':               'math',
  'math_500':           'math',
  'frontiermath':       'math',
  'matharena_apex':     'math',
  'matharena_arxivmath':'math',
  'matharena_final_answer':'math',
  // … ~33 entries total
};
```

Used by W5 (modal filters benchmarks to that domain only) and W10 (catalog domain filter).

### 3. Hero breakthroughs — `_BREAKTHROUGHS` static object

```js
var _BREAKTHROUGHS = [
  { model_id: 'deepmind/alphafold-3', benchmark_id: 'casp16_gdt', value: '~91 GDT-TS',
    title: 'AlphaFold 3', narrative: 'Single-model protein structure with bound ligands',
    domain: 'bio-genomics', source_url: 'https://www.nature.com/articles/s41586-024-07487-w', year: 2024 },
  { model_id: 'deepmind/alphaproof', benchmark_id: 'imo_2024', value: 'Silver Medal',
    title: 'AlphaProof', narrative: 'IMO 2024 Silver Medal — RL-trained Lean proof system',
    domain: 'math', source_url: 'https://deepmind.google/discover/blog/...', year: 2024 },
  { model_id: 'microsoft/aurora-open', benchmark_id: 'aurora_rmse',  value: 'IFS-beating',
    title: 'Aurora', narrative: '1.3B-param atmospheric foundation model',
    domain: 'geo-climate', source_url: 'https://www.nature.com/articles/...', year: 2024 },
  { model_id: 'microsoft/mattergen', benchmark_id: 'mattergen_yield', value: '~10× novel materials',
    title: 'MatterGen', narrative: 'Diffusion model for inorganic crystal generation',
    domain: 'physics-materials', source_url: 'https://www.nature.com/articles/...', year: 2025 },
  { model_id: 'arc-institute/evo-2', benchmark_id: 'evo2_zeroshot', value: '7B params, 9.3T tokens',
    title: 'Evo 2', narrative: 'Genome-scale foundation model across DNA/RNA/protein',
    domain: 'bio-genomics', source_url: 'https://arxiv.org/abs/2502.05497', year: 2025 },
  { model_id: 'deepmind/alphaqubit', benchmark_id: 'alphaqubit_decoder_acc', value: 'Sub-threshold decode',
    title: 'AlphaQubit', narrative: 'Quantum error correction decoder with NN',
    domain: 'physics-materials', source_url: 'https://www.nature.com/articles/s41586-024-08148-8', year: 2024 },
  { model_id: 'isomorphic/iso-dde-chai-2', benchmark_id: 'chai2_pae', value: '92% accuracy',
    title: 'Chai-2', narrative: 'AlphaFold-3-class protein structure prediction',
    domain: 'bio-genomics', source_url: 'https://www.chai-discovery.com/', year: 2025 },
  { model_id: 'goedel/goedel-prover-v2', benchmark_id: 'putnambench', value: 'SOTA Putnam',
    title: 'Goedel-Prover v2', narrative: 'Open-weight Lean theorem prover',
    domain: 'math', source_url: 'https://arxiv.org/abs/2502.07640', year: 2025 }
];
```

8 entries chosen to span 4 domains (bio-genomics 3, math 2, physics-materials 2, geo-climate 1).

### 4. File structure

**Decision:** Split into `dashboard/js/ai4s.js` (existing — render orchestration + categories) + `dashboard/js/ai4s-charts.js` (new — 10 widgets).

Pattern matches Agent menu (`agent.js` orchestrator + `agent-charts.js` widgets). Keeps each file under ~1500 LOC.

`ai4s-charts.js` exposes `AI4SCharts.renderAll()` called from `AI4S.render()`. Each widget uses `_ensureMountPoint(id, title, hint)` factory cloned from agent-charts.js (same DOM structure, same dark theme, same toolbox).

### 5. Data ingestion strategy

**W7/W8/W9 require new benchmark scores.** These are blocked on data sweep.

Phase 2A sweep targets (strict-attribution rule applies):
- **W7 Aurora/GraphCast/Pangu/AIFS** — ECMWF skill scores (https://charts.ecmwf.int/), MS Aurora paper Table 2, GraphCast paper Table 1, Pangu-Weather paper Table 3.
- **W8 CASP12-15 backfill** — CASP official site (predictioncenter.org) GDT-TS for AlphaFold v1/v2, RoseTTAFold, OpenFold, ESMFold across CASP12-CASP16.
- **W9 Matbench Discovery + MatterGen yield** — Matbench leaderboard (matbench-discovery.materialsproject.org), MatterGen paper supplementary.

If a sweep agent can't find a primary source for a (model, benchmark, value) triple, it skips that entry — no fabrication.

### 6. Per-domain composite (W5 modal)

For each domain, the modal computes a **per-domain composite** = mean of `value / max(value across that benchmark) * 100` across the domain's benchmarks where the model has a score. Coverage threshold = ≥ 1 benchmark (lowered from Agent's ≥ 3 because AI4S benchmarks are sparse). Lower-better benchmarks (none currently in AI4S core set, but defensive flag included) are inverted before averaging.

---

## Implementation phasing

```
PHASE 1 — Foundation + immediate-render widgets
═══════════════════════════════════════════════════════════════════
  Sub-Phase 1A — Foundation (controller, sequential)
    ▸ Lab taxonomy (_LAB_MAP) — ~50 LOC
    ▸ Benchmark→Domain map (_BENCHMARK_DOMAIN_MAP) — ~80 LOC
    ▸ ai4s-charts.js skeleton (clone agent-charts.js _ensureMountPoint
      factory + renderAll orchestrator) — ~150 LOC
    ▸ _BREAKTHROUGHS static object (8 entries) — ~80 LOC

  Sub-Phase 1B — Immediate widgets (4 parallel agents)
    ▸ W1  Breakthrough Hero Cards (no chart, DOM cards)
    ▸ W2  Lab × Domain Matrix (ECharts heatmap)
    ▸ W4  Breakthrough Timeline (ECharts scatter)
    ▸ W6  Math Progression Curve (ECharts multi-line)
    ▸ W10 Benchmark Catalog Grid (DOM searchable grid)

  Phase 1 result: 5 widgets live, ~1500 LOC added, fully functional
  with current data.

PHASE 2 — Data-dependent widgets
═══════════════════════════════════════════════════════════════════
  Sub-Phase 2A — Data sweep (3 parallel agents, strict-attribution)
    ▸ Aurora/GraphCast/Pangu/AIFS RMSE — ECMWF + MS papers
    ▸ CASP12-15 backfill — predictioncenter.org
    ▸ Matbench Discovery + MatterGen yield

  Sub-Phase 2B — Data-dependent widgets (3 parallel agents)
    ▸ W3  Frontier vs Specialist Compare (math priority since math
          benchmarks have both frontier LLMs and specialists scored)
    ▸ W7  Weather Forecast Skill Curve
    ▸ W8  CASP Protein Folding Progression
    ▸ W9  Materials Discovery Yield
    ▸ W5  Per-Domain Leaderboard Modal (after _BENCHMARK_DOMAIN_MAP
          covers all 19 domains)

  Phase 2 result: full 10 widgets live, AI4S menu reaches Medium-
  density information dashboard.
```

**Estimated commits:** ~12-14 (Phase 1: 5-6, Phase 2: 6-8). 7-9 parallel agents + controller-direct foundation work.

---

## Cache-bust + integration

- `dashboard/js/ai4s.js` cache-bust bumped on every change (currently `?v=20260506c`).
- New file `dashboard/js/ai4s-charts.js` linked in `dashboard/index.html` immediately after `ai4s.js`.
- Widget mount container `#ai4s-charts` added inside the existing `#tab-ai4s` section in `index.html`, sibling to `#ai4s-summary` and `#ai4s-container`.

---

## Out of scope (explicitly deferred)

- **Cross-domain composite leaderboard** — semantically meaningless for AI4S.
- **Cost / pricing widgets** — most AI4S models have no commercial pricing.
- **Provider availability** — research models are not hosted on commercial APIs.
- **Build-Your-Scientist wizard** — Agent menu's W11 wizard concept doesn't translate (researchers pick models by problem type, not capability priority sliders).
- **Reasoning trace / scheming evals** — AI4S models are domain-specialist, not general-purpose; safety eval framework doesn't apply.

---

## Success criteria

1. AI4S tab loads with 10 widgets visible (5 immediately on tab open, rest via lazy render).
2. Clicking any of the 19 domain cards opens a per-domain leaderboard modal.
3. All scores trace back to a primary source URL (strict-attribution rule).
4. No `innerHTML` writes added (security hook compliance).
5. Mobile responsive: chart heights shrink to 320px on screens ≤768px (inherits from agent-charts.js style block, or duplicates if needed).
6. Accessibility: every chart mount has `role="img"` + aria-label.
7. Live deploy verified — fetched JS contains all widget renderer markers.
