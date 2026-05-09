# Physical AI Widget Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Add 10 widgets to Physical AI menu (currently 2). Mirror AI4S (Session 7) and Medical AI (Session 8) scaffold.

**Architecture:** New `dashboard/js/physical-ai-charts.js` UMD module. Hooked from `PhysicalAI.render()`. Two static maps (`_FAMILY_MAP`, `_BENCHMARK_FAMILY_MAP`) + one dataset (`_PHY_BREAKTHROUGHS`).

**Tech Stack:** Vanilla ES5 UMD, ECharts 5 dark theme, Tailwind dark CSS, vanilla node assert tests, no build step. No `innerHTML` writes.

---

## File structure

| Action | Path |
|---|---|
| **CREATE** | `dashboard/js/physical-ai-charts.js` |
| **CREATE** | `dashboard/js/__tests__/physical-ai-charts.test.js` |
| **MODIFY** | `dashboard/js/physical-ai.js` (renderAll hook + Shift+click) |
| **MODIFY** | `dashboard/index.html` (mount div + script + cache-bust) |

---

## Phase 1A — Foundation

### Task 1: UMD skeleton + `_FAMILY_MAP` + `_resolveFamily` + test

**Test (`dashboard/js/__tests__/physical-ai-charts.test.js`):**

```js
'use strict';
var assert = require('assert');
var P = require('../physical-ai-charts.js');

assert.ok(P, 'PhysicalAICharts must be exported');
assert.ok(P._resolveFamily, '_resolveFamily must be exported');

assert.strictEqual(P._resolveFamily('nvidia/gr00t-n1.7').key, 'gr00t');
assert.strictEqual(P._resolveFamily('physical-intelligence/pi-zero').key, 'pi');
assert.strictEqual(P._resolveFamily('openvla/openvla-7b').key, 'openvla');
assert.strictEqual(P._resolveFamily('octo/octo-base').key, 'octo');
assert.strictEqual(P._resolveFamily('google-deepmind/gemini-robotics-er-1.6').key, 'gemini-robotics');
assert.strictEqual(P._resolveFamily('figure-ai/helix').key, 'industrial-humanoid');
assert.strictEqual(P._resolveFamily('foxconn/foxbrain-70b').key, 'industrial-fm');
assert.strictEqual(P._resolveFamily('meta/sapiens2-5b').key, 'human-vision');
assert.strictEqual(P._resolveFamily('').key, 'other');
assert.strictEqual(P._resolveFamily('random/unknown').key, 'other');

console.log('Task 1 _resolveFamily OK');
```

**Module skeleton (`dashboard/js/physical-ai-charts.js`):**

```js
/**
 * Physical AI tab — graphical widgets (10 ECharts/DOM visualisations).
 *
 * Mirrors dashboard/js/medical-ai-charts.js patterns (UMD module +
 * _ensureMountPoint factory + Charts._getOrCreate + lazy render).
 */
(function(root) {
  'use strict';

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
  var _OTHER_FAMILY = { key: 'other', label: 'Other', keywords: [] };

  function _resolveFamily(modelId, modelName) {
    if (!modelId) return _OTHER_FAMILY;
    var hay = (modelId + ' ' + (modelName || '')).toLowerCase();
    for (var i = 0; i < _FAMILY_MAP.length; i++) {
      var f = _FAMILY_MAP[i];
      for (var j = 0; j < f.keywords.length; j++) {
        if (hay.indexOf(f.keywords[j]) !== -1) return f;
      }
    }
    return _OTHER_FAMILY;
  }

  var api = {
    _FAMILY_MAP: _FAMILY_MAP,
    _resolveFamily: _resolveFamily
  };

  root.PhysicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
```

**Commit:** `feat(physical-ai-charts): Task 1 — UMD skeleton + _FAMILY_MAP + _resolveFamily + test`

---

### Task 2: `_BENCHMARK_FAMILY_MAP` + `_resolveSuite` + test

**Test:**

```js
// Task 2
assert.ok(P._resolveSuite, '_resolveSuite must be exported');
assert.strictEqual(P._resolveSuite('libero'), 'vla-manipulation');
assert.strictEqual(P._resolveSuite('libero_spatial'), 'vla-manipulation');
assert.strictEqual(P._resolveSuite('cosmos_embodied_reasoning'), 'world-model');
assert.strictEqual(P._resolveSuite('world_model_consistency'), 'world-model');
assert.strictEqual(P._resolveSuite('unknown_bench'), null);
console.log('Task 2 _resolveSuite OK');
```

**Code (insert before `var api =`):**

```js
  var _BENCHMARK_FAMILY_MAP = {
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
    'world_model_consistency': 'world-model',
    'world_model_fps': 'world-model',
    'world_model_visual_memory': 'world-model',
    'cosmos_embodied_reasoning': 'world-model',
    'cosmos_intuitive_physics': 'world-model',
    'cosmos_physical_common_sense': 'world-model',
    'embodied_qa': 'embodied-reasoning',
    'embodied_planning': 'embodied-reasoning'
  };

  function _resolveSuite(benchmarkId) {
    if (!benchmarkId) return null;
    return Object.prototype.hasOwnProperty.call(_BENCHMARK_FAMILY_MAP, benchmarkId)
      ? _BENCHMARK_FAMILY_MAP[benchmarkId] : null;
  }
```

Update `api` to add `_BENCHMARK_FAMILY_MAP, _resolveSuite`.

**Commit:** `feat(physical-ai-charts): Task 2 — _BENCHMARK_FAMILY_MAP + _resolveSuite + test`

---

### Task 3: `_ensureMountPoint` factory + style + `renderAll` skeleton + index.html wiring

Mirror Medical AI Task 3 — copy structurally, swap IDs:
- Style block ID: `physical-ai-charts-style`
- Mount class: `physical-ai-chart-mount`
- Host: `#physical-ai-charts`
- Code structurally identical to `medical-ai-charts.js` — copy, find/replace `medical-ai` → `physical-ai`, `MedicalAI` → `PhysicalAI`.

In `dashboard/index.html` `#tab-physical-ai` section, add `<div id="physical-ai-charts" class="space-y-6 mt-8"></div>` before `</section>`. Bump `<script src="js/physical-ai.js?v=20260430a"></script>` to `?v=20260509a` and add `<script src="js/physical-ai-charts.js?v=20260509a"></script>`.

In `dashboard/js/physical-ai.js` `render: function() { ... }` (around line 243), append at end:
```js
        if (typeof PhysicalAICharts !== 'undefined' && PhysicalAICharts.renderAll) {
            PhysicalAICharts.renderAll();
        }
```

**Commit:** `feat(physical-ai-charts): Task 3 — _ensureMountPoint factory + renderAll skeleton + wiring`

---

### Task 4: `_PHY_BREAKTHROUGHS` + schema test

**Test (append):**
```js
// Task 4
assert.ok(Array.isArray(P._PHY_BREAKTHROUGHS));
assert.ok(P._PHY_BREAKTHROUGHS.length >= 6 && P._PHY_BREAKTHROUGHS.length <= 8);
P._PHY_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.domain, 'entry ' + i + ' missing domain');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 4 _PHY_BREAKTHROUGHS schema OK');
```

**Code:** Insert `_PHY_BREAKTHROUGHS` (8 entries from spec section 3 — GR00T-N1.7 / Gemini Robotics ER 1.6 / π-zero / OpenVLA-7B / NVIDIA Cosmos / FoxBrain 70B / Figure Helix / Meta Sapiens2). Add to `api`.

**Commit:** `feat(physical-ai-charts): Task 4 — _PHY_BREAKTHROUGHS dataset (8 milestone tiles)`

---

## Phase 1B — Immediate widgets (5 sequential tasks)

### Task 5: W1 Hero Cards

Add `_categoryColor(domain)` for Physical AI palette:
```js
  function _categoryColor(domain) {
    var palette = {
      'world-models':         '#3b82f6',
      'vla-policies':         '#10b981',
      'industrial-robots':    '#f59e0b',
      'manufacturing-fm':     '#a78bfa',
      'human-centric-vision': '#ec4899',
      'world-model':          '#3b82f6'
    };
    return palette[domain] || '#6b7280';
  }
```

Add `renderHeroCards()` — mirror Medical AI Task 5 with `_PHY_BREAKTHROUGHS`, host `#physical-ai-charts`, section ID `physical-ai-hero-cards-section`, title `'SOTA Watch — Physical AI Breakthroughs'`. Wire into `renderAll` + `api`.

**Commit:** `feat(physical-ai-charts): W1 Physical AI Breakthrough Hero Cards (8 tiles)`

---

### Task 6: W2 Family × Benchmark Suite Coverage Matrix

Mirror Medical AI Task 6 (`renderSpecialtyMatrix`). Use `_FAMILY_MAP` for rows, suite categories for cols (`vla-manipulation`, `world-model`, `embodied-reasoning`). Helpers `_physicalAICategories` (reads `window.PhysicalAI.CATEGORIES`) and `_physicalAIModels` (returns `[{model_id, family_key}]`).

Mount ID: `physical-ai-chart-family-matrix`. Title: `'Family × Benchmark Suite Matrix'`.

**Commit:** `feat(physical-ai-charts): W2 Family × Benchmark Suite Coverage Matrix`

---

### Task 7: W3 LIBERO Suite Radar

Add shared helpers `_scoresFor`, `_modelDisplayName` (mirror Medical AI Task 7).

Then `renderLiberoSuiteRadar()` — radar with 5 axes (libero / libero_spatial / libero_object / libero_goal / libero_long), top-5 models by mean coverage. Coverage filter ≥3.

Mount ID: `physical-ai-chart-libero-radar`. Title: `'LIBERO Suite Radar'`.

**Commit:** `feat(physical-ai-charts): W3 LIBERO Suite Radar (top 5 × 5 sub-benches)`

---

### Task 8: W6 LIBERO Progression Curve

Add helper `_modelReleaseDate`.

`renderLiberoProgression()` — multi-line over time: each LIBERO sub-bench (libero, libero_spatial, libero_object, libero_goal, libero_long) plotted with model release dates.

Mount ID: `physical-ai-chart-libero-progression`. Title: `'LIBERO Progression Curve'`.

**Commit:** `feat(physical-ai-charts): W6 LIBERO Progression Curve (5 sub-benches × time)`

---

### Task 9: W10 Benchmark Catalog Grid

Mirror Medical AI Task 9. Use `_BENCHMARK_FAMILY_MAP`. Suite palette:
```js
var suitePalette = {
  'vla-manipulation': '#10b981',
  'world-model': '#3b82f6',
  'embodied-reasoning': '#a78bfa'
};
```

Section ID: `physical-ai-bench-catalog-section`. Title: `'Physical AI Benchmark Catalog'`.

**Commit:** `feat(physical-ai-charts): W10 Physical AI Benchmark Catalog Grid`

---

## Phase 2B — Data-dependent widgets (5 sequential tasks)

### Task 10: W4 World Model Quality Radar

Mirror Task 7 W3 radar but with sub-benches:
```js
var subs = ['cosmos_embodied_reasoning','cosmos_intuitive_physics','cosmos_physical_common_sense','world_model_consistency','world_model_fps','world_model_visual_memory'];
var subLabels = ['Embodied Reasoning','Intuitive Physics','Common Sense','Consistency','FPS','Visual Memory'];
```

Coverage threshold ≥2 (sparser data). Top 5 models.

Mount ID: `physical-ai-chart-world-model-radar`. Title: `'World Model Quality Radar'`.

**Commit:** `feat(physical-ai-charts): W4 World Model Quality Radar`

---

### Task 11: W5 Per-Category Mini-Leaderboard Modal + composite test

Mirror Medical AI Task 11. Add `_categoryBenchmarks(categoryCode)` (returns benches matching the category code via `_BENCHMARK_FAMILY_MAP`), `_perCategoryComposite(modelId, benchIds)`, `openCategoryLeaderboard(categoryCode)`.

Test (append):
```js
// Task 11
assert.ok(P._perCategoryComposite, '_perCategoryComposite must be exported');
global.window = global.window || {};
global.window.App = { data: { scores: [
  { model_id: 'm1', benchmark_id: 'libero', value: 80 },
  { model_id: 'm2', benchmark_id: 'libero', value: 100 },
  { model_id: 'm1', benchmark_id: 'libero_spatial', value: 60 },
  { model_id: 'm2', benchmark_id: 'libero_spatial', value: 50 }
]}};
var c1 = P._perCategoryComposite('m1', ['libero','libero_spatial']);
assert.strictEqual(c1.coverage, 2);
assert.strictEqual(c1.score, 90);
console.log('Task 11 _perCategoryComposite OK');
```

Wire Shift+click in `dashboard/js/physical-ai.js` `_renderCategoryMap` (around line 290+) on category cards to call `PhysicalAICharts.openCategoryLeaderboard(cat.code)`.

**Commit:** `feat(physical-ai-charts): W5 Per-Category Mini-Leaderboard Modal + Shift+click`

---

### Task 12: W7 Sim-to-Real Compare

`renderSimToRealCompare()` — bar chart showing simpler_env_avg / robocasa / robocasa365 top scores per model.

```js
var benches = ['simpler_env_avg', 'robocasa', 'robocasa365'];
```

For each bench: top model + score. Empty state if <2 benches have rows.

Mount ID: `physical-ai-chart-sim-to-real`. Title: `'Sim-to-Real Compare'`.

**Commit:** `feat(physical-ai-charts): W7 Sim-to-Real Compare`

---

### Task 13: W8 Industrial Deployment Map

DOM cards (no chart). For each model in `manufacturing-fm` + `industrial-robots` + `industrial-humanoids` categories from `PhysicalAI.CATEGORIES`, render a card with vendor/model name + family pill + (if available) a deployment status note from a static metadata table:

```js
var _DEPLOYMENT_STATUS = {
  'foxconn/foxbrain-70b': { status: 'production', region: 'Taiwan/Asia', note: 'Deployed in Foxconn factories' },
  'figure-ai/helix': { status: 'pilot', region: 'US', note: 'Real-world VLA deployment in factory pilot' },
  'tesla/optimus-vlm': { status: 'beta', region: 'US', note: 'Tesla factory walking tasks' },
  'apptronik/apollo-gemini': { status: 'pilot', region: 'US', note: 'Mercedes-Benz pilot' },
  'agility/digit-arc': { status: 'production', region: 'US', note: 'Amazon warehouse' },
  'sanctuary/carbon': { status: 'pilot', region: 'Canada', note: 'Sanctuary Phoenix' }
};
```

Mount ID: `physical-ai-industrial-deployment-section`. Title: `'Industrial Deployment Map'`.

**Commit:** `feat(physical-ai-charts): W8 Industrial Deployment Map`

---

### Task 14: W9 Embodied Reasoning Heatmap

Mirror Medical AI Task 13 (W8 Safety Heatmap):
```js
var subs = ['cosmos_embodied_reasoning','cosmos_intuitive_physics','cosmos_physical_common_sense'];
var subLabels = ['Embodied Reasoning','Intuitive Physics','Common Sense'];
```

Top 8 models, coverage ≥1 (sparse data). Cell color: red→green visualMap. Empty state if <2 models with ≥1 sub-bench.

Mount ID: `physical-ai-chart-embodied-heatmap`. Title: `'Embodied Reasoning Heatmap'`.

**Commit:** `feat(physical-ai-charts): W9 Embodied Reasoning Heatmap`

---

## Phase 3 — Polish + deploy

### Task 15: Lazy render integration

Replace `renderAll`:
```js
  function renderAll() {
    var eagerFns = [renderHeroCards, renderFamilyMatrix, renderLiberoSuiteRadar];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[PhysicalAICharts] eager failed:', fn.name, e);
      }
    });
    var lazyFns = [
      renderLiberoProgression,
      renderWorldModelRadar,
      renderSimToRealCompare,
      renderIndustrialDeployment,
      renderEmbodiedHeatmap,
      renderBenchmarkCatalog
    ];
    function _runLazy() {
      lazyFns.forEach(function(fn) {
        try { fn(); } catch (e) {
          if (typeof console !== 'undefined') console.warn('[PhysicalAICharts] lazy failed:', fn.name, e);
        }
      });
    }
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(_runLazy, { timeout: 1500 });
    } else if (typeof setTimeout !== 'undefined') {
      setTimeout(_runLazy, 50);
    }
  }
```

**Commit:** `feat(physical-ai-charts): Task 15 — lazy render orchestrator`

---

### Task 16: Cache-bust + push + CI deploy + docs

- Bump `physical-ai.js` + `physical-ai-charts.js` to `?v=20260509b`.
- Push ops, trigger `gh workflow run benchmark-update.yml --ref main`.
- Wait + verify markers in deployed JS (renderHeroCards / renderFamilyMatrix / renderLiberoSuiteRadar / renderLiberoProgression / renderWorldModelRadar / renderSimToRealCompare / renderIndustrialDeployment / renderEmbodiedHeatmap / renderBenchmarkCatalog / openCategoryLeaderboard / _FAMILY_MAP / _BENCHMARK_FAMILY_MAP / _PHY_BREAKTHROUGHS / requestIdleCallback).
- Append HISTORY.md Session 9 + changelog.json entry.
- Sync HISTORY.md to main worktree.

---

## Self-Review

**Spec coverage:** ✅ all 10 widgets + sub-section + foundation maps + breakthroughs + composite + lazy render + deploy.

**Placeholder scan:** None.

**Type consistency:** `_resolveFamily` returns `{key, label, keywords}`, `_resolveSuite` returns string|null, `_PHY_BREAKTHROUGHS` schema enforced by Task 4 test, `_perCategoryComposite` returns `{score, coverage}|null`. Mount IDs `physical-ai-chart-*` consistently namespaced.
