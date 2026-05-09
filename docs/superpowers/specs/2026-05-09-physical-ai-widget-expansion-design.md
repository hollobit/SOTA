# Physical AI Menu Widget Expansion — Design Spec

**Date:** 2026-05-09
**Author:** USER (brainstormed with Claude Opus 4.7)
**Target menu:** Physical AI (`dashboard/js/physical-ai.js`)
**Goal:** Add 10 ECharts/DOM widgets to Physical AI menu, raising it from 2 chart widgets (timeline + radar) to a Medium-density information dashboard parallel to AI4S (Session 7) and Medical AI (Session 8).

---

## Context

Currently 2 chart widgets (timeline + radar). Apply the same hybrid sub-section pattern proven in Sessions 7-8.

**Data shape** (snapshot 2026-05-09):
- **5 model categories**: world-models, vla-policies, industrial-robots, manufacturing-fm, human-centric-vision
- **4 benchmark suite categories**: VLA Manipulation Suites, World Model Quality, Embodied Reasoning, Industrial Deployment Metrics
- **Top benchmarks**: libero (5 scores), libero_spatial/object/goal/long (4 each), robocasa (4), world_model_consistency (2), cosmos_* (1 each), simpler_env_avg (1)
- **~50+ Physical AI models**: GR00T family, π-zero (Physical Intelligence), OpenVLA, Octo, Gemini Robotics ER, NVIDIA Cosmos, Skild Brain, Covariant RFM-1, Figure Helix, Apptronik Apollo, Tesla Optimus, FoxBrain, Siemens SiFM, Bosch Industrial GenAI, Sapiens2 family.

**Key data characteristics:**
1. **VLA policies are the headline narrative** — GR00T-N1.7, π-zero, OpenVLA, Octo, Gemini Robotics ER define the SOTA frontier in robot policy learning.
2. **LIBERO is the densest benchmark family** — 5 sub-benches (libero/spatial/object/goal/long) with 4-5 models scored each.
3. **World model quality is a separate axis** — Cosmos benchmarks (cosmos_embodied/intuitive_physics/physical_common_sense) measure simulation fidelity, not policy.
4. **Industrial deployment is a real category** — FoxBrain (Foxconn), Siemens, Hitachi, Bosch — but mostly metadata, not benchmark scores.
5. **Sim-to-real is a key concept** — simpler_env_avg, robocasa365 measure transfer.
6. **Robot family taxonomy** replaces vendor — GR00T family (NVIDIA), π family (Physical Intelligence), OpenVLA, Octo, Gemini Robotics, Industrial humanoids (Helix/Apollo/Optimus/Carbon/Digit).

---

## Sub-section structure

```
┌─────────────────────────────────────────────────────────┐
│ Physical AI Tab                                         │
├─────────────────────────────────────────────────────────┤
│ ▶ SOTA Watch — Physical AI Breakthroughs                │
│   8 hero tiles: GR00T-N1.7 / Gemini Robotics ER /       │
│   π-zero (Physical Intelligence) / OpenVLA / NVIDIA     │
│   Cosmos / FoxBrain / Figure Helix / Sapiens2.          │
├─────────────────────────────────────────────────────────┤
│ ▶ 5 Category Cards (existing pattern, enhanced)         │
│   Each card click → per-category leaderboard modal.     │
├─────────────────────────────────────────────────────────┤
│ ▶ Cross-Family Compare                                  │
│   Replaces "vendor" axis with robot family.             │
│   Family × Benchmark suite matrix + LIBERO Suite Radar  │
│   + World Model Quality Radar.                          │
├─────────────────────────────────────────────────────────┤
│ ▶ Domain-specific Mini-Leaderboards                     │
│   Modal on category card click.                         │
└─────────────────────────────────────────────────────────┘
```

---

## Widget inventory (10 widgets)

| # | Widget | Sub-section | Type | Data |
|---|---|---|---|---|
| **W1** | Physical AI Breakthrough Hero Cards (8 tiles) | SOTA Watch | DOM cards | Static `_PHY_BREAKTHROUGHS` |
| **W2** | Family × Benchmark Suite Coverage Matrix | Cross-Family Compare | ECharts heatmap | `_FAMILY_MAP` × benchmark suites |
| **W3** | LIBERO Suite Radar | Cross-Family Compare | ECharts radar | 5 libero_* sub-benches |
| **W4** | World Model Quality Radar | Cross-Family Compare | ECharts radar | cosmos_* + world_model_* sub-benches |
| **W5** | Per-Category Leaderboard Modal | Mini-Leaderboards | DOM modal | App.data + `_BENCHMARK_FAMILY_MAP` |
| **W6** | LIBERO Progression Curve | Domain Deep Dive | ECharts multi-line | libero family × release_date |
| **W7** | Sim-to-Real Compare | Domain Deep Dive | ECharts grouped bar | simpler_env_avg / robocasa / robocasa365 |
| **W8** | Industrial Deployment Map | Domain Deep Dive | DOM cards | manufacturing-fm + industrial-robots categories |
| **W9** | Embodied Reasoning Heatmap | Domain Deep Dive | ECharts heatmap | cosmos_embodied / cosmos_physical_common_sense × top models |
| **W10** | Physical AI Benchmark Catalog Grid | Catalog | Searchable DOM grid | App.data.benchmarks + `_BENCHMARK_FAMILY_MAP` |

---

## Design decisions

### 1. Robot family taxonomy — `_FAMILY_MAP`

```js
var _FAMILY_MAP = [
  { key: 'gr00t',         label: 'NVIDIA GR00T',
    keywords: ['nvidia/gr00t','isaac-gr00t','cosmos'] },
  { key: 'pi',            label: 'Physical Intelligence (π)',
    keywords: ['physical-intelligence/pi','rdt-1b'] },
  { key: 'openvla',       label: 'OpenVLA',
    keywords: ['openvla/'] },
  { key: 'octo',          label: 'Octo',
    keywords: ['octo/'] },
  { key: 'gemini-robotics',label: 'Gemini Robotics',
    keywords: ['gemini-robotics','google-deepmind/gemini-robotics'] },
  { key: 'industrial-humanoid', label: 'Industrial Humanoids',
    keywords: ['figure-ai/helix','apptronik','agility','sanctuary','tesla/optimus','unitree'] },
  { key: 'industrial-fm', label: 'Industrial Foundation Models',
    keywords: ['foxbrain','foxconn','siemens','hitachi','bosch','aveva','autodesk','ge-vernova','landing-ai','ptc/','dassault'] },
  { key: 'world-model',   label: 'World Models',
    keywords: ['genesis','dreamerv','iss-world','nvidia/cosmos'] },
  { key: 'human-vision',  label: 'Human-Centric Vision',
    keywords: ['sapiens','reka/reka-edge'] },
  { key: 'industrial-vendor', label: 'Industrial Vendor (other)',
    keywords: ['skild','covariant','rfm'] }
];
```

Models that don't match fall into `other`.

### 2. Benchmark → suite mapping — `_BENCHMARK_FAMILY_MAP`

```js
var _BENCHMARK_FAMILY_MAP = {
  // VLA manipulation
  'libero': 'vla-manipulation',
  'libero_spatial': 'vla-manipulation',
  'libero_object': 'vla-manipulation',
  'libero_goal': 'vla-manipulation',
  'libero_long': 'vla-manipulation',
  'robocasa': 'vla-manipulation',
  'robocasa365': 'vla-manipulation',
  'robotwin2': 'vla-manipulation',
  'vlabench': 'vla-manipulation',
  'vlabench_track1_primitive': 'vla-manipulation',
  'bridge_v2': 'vla-manipulation',
  'aloha_4task_avg': 'vla-manipulation',
  'open_x_embodiment': 'vla-manipulation',
  'dexmimicgen': 'vla-manipulation',
  'gr1_tabletop': 'vla-manipulation',
  'simpler_env_avg': 'vla-manipulation',
  'roboarena_elo': 'vla-manipulation',
  'gr1_real_lang_following': 'vla-manipulation',
  'unitree_g1_1k_demos': 'vla-manipulation',
  'realworld_language_following': 'vla-manipulation',
  // World model quality
  'world_model_consistency': 'world-model',
  'world_model_fps': 'world-model',
  'world_model_visual_memory': 'world-model',
  'cosmos_embodied_reasoning': 'world-model',
  'cosmos_intuitive_physics': 'world-model',
  'cosmos_physical_common_sense': 'world-model',
  // Embodied reasoning
  'embodied_qa': 'embodied-reasoning',
  'embodied_planning': 'embodied-reasoning'
};
```

### 3. Hero breakthroughs — `_PHY_BREAKTHROUGHS`

```js
var _PHY_BREAKTHROUGHS = [
  {
    title: 'NVIDIA GR00T-N1.7',
    narrative: 'Foundation model for general-purpose humanoid robots',
    value: 'Generalist VLA',
    domain: 'vla-policies',
    model_id: 'nvidia/gr00t-n1.7',
    benchmark_id: 'libero',
    source_url: 'https://developer.nvidia.com/isaac/gr00t',
    year: 2025
  },
  {
    title: 'Gemini Robotics ER 1.6',
    narrative: 'Vision-language-action with embodied reasoning',
    value: 'Robot Arena top',
    domain: 'vla-policies',
    model_id: 'google-deepmind/gemini-robotics-er-1.6',
    benchmark_id: 'roboarena_elo',
    source_url: 'https://deepmind.google/discover/blog/gemini-robotics/',
    year: 2025
  },
  {
    title: 'π-zero (Physical Intelligence)',
    narrative: 'Generalist robot policy across embodiments',
    value: 'Bridge V2 SOTA',
    domain: 'vla-policies',
    model_id: 'physical-intelligence/pi-zero',
    benchmark_id: 'bridge_v2',
    source_url: 'https://www.physicalintelligence.company/blog/pi0',
    year: 2024
  },
  {
    title: 'OpenVLA-7B',
    narrative: 'Open-weight vision-language-action policy',
    value: 'Open VLA leader',
    domain: 'vla-policies',
    model_id: 'openvla/openvla-7b',
    benchmark_id: 'libero',
    source_url: 'https://openvla.github.io/',
    year: 2024
  },
  {
    title: 'NVIDIA Cosmos',
    narrative: 'World foundation model for physical AI',
    value: 'Embodied SOTA',
    domain: 'world-models',
    model_id: 'nvidia/cosmos-transfer-2.5',
    benchmark_id: 'cosmos_embodied_reasoning',
    source_url: 'https://www.nvidia.com/en-us/ai/cosmos/',
    year: 2025
  },
  {
    title: 'FoxBrain 70B (Foxconn)',
    narrative: 'Large-scale industrial AI for manufacturing',
    value: '70B params industrial FM',
    domain: 'manufacturing-fm',
    model_id: 'foxconn/foxbrain-70b',
    benchmark_id: 'industrial_deployment',
    source_url: 'https://www.foxconn.com/news/2024/foxbrain',
    year: 2025
  },
  {
    title: 'Figure Helix',
    narrative: 'End-to-end VLA for humanoid robots',
    value: 'Real-world deployment',
    domain: 'industrial-robots',
    model_id: 'figure-ai/helix',
    benchmark_id: 'realworld_language_following',
    source_url: 'https://www.figure.ai/news/helix',
    year: 2025
  },
  {
    title: 'Meta Sapiens2',
    narrative: 'Human-centric vision foundation model',
    value: '5B-class HCV FM',
    domain: 'human-centric-vision',
    model_id: 'meta/sapiens2-5b',
    benchmark_id: 'human_pose',
    source_url: 'https://about.meta.com/realitylabs/sapiens',
    year: 2025
  }
];
```

### 4. File structure

`dashboard/js/physical-ai-charts.js` (NEW UMD module) + `dashboard/js/physical-ai.js` (existing — modify) + `dashboard/index.html` (mount + script + cache-bust). UMD pattern matches `medical-ai-charts.js`.

### 5. Per-category composite (W5 modal)

Same formula as Medical AI: per-category composite = mean of `value / max(value across that benchmark) * 100` across benchmarks where the model has a score. Coverage threshold = ≥1.

### 6. New benchmark/score ingestion

Optional sweep deferred — Phase 1 + 2B widgets ship on currently-loaded data. Many widgets will degrade gracefully (empty state) where data is sparse (e.g., cosmos benchmarks have only 1 score each).

---

## Implementation phasing

```
PHASE 1 — Foundation + immediate-render widgets
  ▸ 1A — Foundation: _FAMILY_MAP / _BENCHMARK_FAMILY_MAP / mount factory / _PHY_BREAKTHROUGHS
  ▸ 1B — 5 immediate widgets: W1 / W2 / W3 / W6 / W10

PHASE 2 — Data-dependent widgets (sequential)
  ▸ W4 World Model Radar / W5 Per-Category Modal / W7 Sim-to-Real / W8 Industrial Deployment / W9 Embodied Reasoning Heatmap

PHASE 3 — Polish + deploy
  ▸ Lazy render + cache-bust + push + CI verify + docs
```

**Estimated commits:** ~16 (matches Medical AI scaffold).

---

## Out of scope

- Cross-category composite leaderboard (different units across world-model / VLA / industrial-FM).
- Cost / pricing widgets (research artifacts).
- New data sweeps (deferred).

---

## Success criteria

1. Physical AI tab loads with 10 widgets visible (5 immediate + 5 lazy).
2. Clicking any of 5 category cards opens per-category leaderboard modal.
3. All scores trace to primary source URL.
4. No `innerHTML` writes.
5. Mobile responsive + a11y (role=img + aria-label).
6. Live deploy verified.
