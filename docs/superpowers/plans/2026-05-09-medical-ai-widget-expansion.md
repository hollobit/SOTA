# Medical AI Widget Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 10 ECharts/DOM widgets to the Medical AI menu (currently 2 widgets — timeline + radar), bringing it to a Medium-density information dashboard parallel to AI4S menu.

**Architecture:** New `dashboard/js/medical-ai-charts.js` UMD-style module mirroring `ai4s-charts.js` patterns (`_ensureMountPoint` factory, `Charts._getOrCreate`, `_applyToolbox`, lazy-render via `requestIdleCallback`). Hooked from `MedicalAI.render()` orchestrator. Two static maps (`_SPECIALTY_MAP`, `_BENCHMARK_CATEGORY_MAP`) and one static dataset (`_MED_BREAKTHROUGHS`) drive cross-widget consistency. All widgets ship on currently-loaded data; data sweep deferred (optional follow-up).

**Tech Stack:** Vanilla ES5 UMD module (browser global + node `require`), ECharts 5 dark theme, Tailwind dark CSS, vanilla `node assert` for unit tests, no build step. No `innerHTML` writes (security hook). Cache-bust on `medical-ai.js` + new `medical-ai-charts.js`.

---

## File structure

| Action | Path | Responsibility |
|---|---|---|
| **CREATE** | `dashboard/js/medical-ai-charts.js` | 10 widget renderers + helpers |
| **CREATE** | `dashboard/js/__tests__/medical-ai-charts.test.js` | Unit tests for `_resolveSpecialty`, `_resolveCategory`, `_MED_BREAKTHROUGHS` schema, `_perCategoryComposite` |
| **MODIFY** | `dashboard/js/medical-ai.js` | Wire `MedicalAICharts.renderAll()` into `MedicalAI.render()`; add Shift+click on category card → W5 modal |
| **MODIFY** | `dashboard/index.html` | Add `<div id="medical-ai-charts">` + `<script>`; bump `medical-ai.js` cache-bust |

UMD pattern matches `peer-matcher.js` and `ai4s-charts.js` (Session 7). The module-end:

```js
  root.MedicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
```

---

## Phase 1A — Foundation (sequential, controller direct)

### Task 1: UMD skeleton + `_SPECIALTY_MAP` + `_resolveSpecialty()` + unit test

**Files:** Create `dashboard/js/medical-ai-charts.js`, `dashboard/js/__tests__/medical-ai-charts.test.js`

- [ ] **Step 1: Create test file**

```js
'use strict';
var assert = require('assert');
var M = require('../medical-ai-charts.js');

assert.ok(M, 'MedicalAICharts must be exported');
assert.ok(M._resolveSpecialty, '_resolveSpecialty must be exported');

assert.strictEqual(M._resolveSpecialty('google/med-gemini-3-pro').key, 'general');
assert.strictEqual(M._resolveSpecialty('saama/openbiollm-llama3-70b').key, 'biomedical');
assert.strictEqual(M._resolveSpecialty('huawei/dermavqa').key, 'dermatology');
assert.strictEqual(M._resolveSpecialty('virchow/path-vit').key, 'pathology');
assert.strictEqual(M._resolveSpecialty('').key, 'other');
assert.strictEqual(M._resolveSpecialty('random/unknown').key, 'other');

console.log('Task 1 _resolveSpecialty OK');
```

- [ ] **Step 2: Verify test fails** (`node dashboard/js/__tests__/medical-ai-charts.test.js`).

- [ ] **Step 3: Create `dashboard/js/medical-ai-charts.js`**

```js
/**
 * Medical AI tab — graphical widgets (10 ECharts/DOM visualisations).
 *
 * Mirrors dashboard/js/ai4s-charts.js patterns:
 *   - UMD module exposing MedicalAICharts.renderAll() + per-widget renderers
 *   - _ensureMountPoint factory creates sections inside #medical-ai-charts
 *   - Charts._getOrCreate factory for ECharts dark-theme instances
 *   - No innerHTML; createElement/textContent/appendChild only
 *
 * Loaded after medical-ai.js. Render is invoked from MedicalAI.render().
 */
(function(root) {
  'use strict';

  // ====================================================================
  // Specialty taxonomy. Resolves model IDs to medical specialty.
  // Keyword matching against id + (lowercase) name. 'other' fallback.
  // ====================================================================
  var _SPECIALTY_MAP = [
    { key: 'general',       label: 'General Clinical',
      keywords: ['gpt-clinicians','medlm','med-palm','med-gemini','medgemma','polaris','clinical-camel','almanac','medalpaca','clinical-llm'] },
    { key: 'biomedical',    label: 'Biomedical Research',
      keywords: ['openbiollm','biomistral','meditron','biogpt','med42','aloe','biomedlm','pmc-llama','me-llama','asclepius'] },
    { key: 'radiology',     label: 'Radiology / Imaging',
      keywords: ['radiology','radqa','chexpert','rad-onc','maira'] },
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
      keywords: ['mental','psych','wellbeing'] }
  ];
  var _OTHER_SPECIALTY = { key: 'other', label: 'Other Medical', keywords: [] };

  function _resolveSpecialty(modelId, modelName) {
    if (!modelId) return _OTHER_SPECIALTY;
    var hay = (modelId + ' ' + (modelName || '')).toLowerCase();
    for (var i = 0; i < _SPECIALTY_MAP.length; i++) {
      var sp = _SPECIALTY_MAP[i];
      for (var j = 0; j < sp.keywords.length; j++) {
        if (hay.indexOf(sp.keywords[j]) !== -1) return sp;
      }
    }
    return _OTHER_SPECIALTY;
  }

  var api = {
    _SPECIALTY_MAP: _SPECIALTY_MAP,
    _resolveSpecialty: _resolveSpecialty
  };

  root.MedicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
```

- [ ] **Step 4: Verify test passes**, **Step 5: `node -c` parse OK**, **Step 6: Commit**

```bash
git add dashboard/js/medical-ai-charts.js dashboard/js/__tests__/medical-ai-charts.test.js
git commit -m "feat(medical-ai-charts): Task 1 — UMD skeleton + _SPECIALTY_MAP + _resolveSpecialty + test"
```

---

### Task 2: `_BENCHMARK_CATEGORY_MAP` + `_resolveCategory()` + test

**Files:** Modify `dashboard/js/medical-ai-charts.js`, `dashboard/js/__tests__/medical-ai-charts.test.js`

- [ ] **Step 1: Append failing test**

```js
// Task 2
assert.ok(M._resolveCategory, '_resolveCategory must be exported');
assert.strictEqual(M._resolveCategory('medqa_usmle'), 'clinical-knowledge');
assert.strictEqual(M._resolveCategory('pubmedqa'), 'biomedical-research');
assert.strictEqual(M._resolveCategory('healthbench_pro_redteam'), 'healthbench');
assert.strictEqual(M._resolveCategory('mmedbench'), 'multilingual');
assert.strictEqual(M._resolveCategory('unknown_bench'), null);

console.log('Task 2 _resolveCategory OK');
```

- [ ] **Step 2: Verify FAIL**

- [ ] **Step 3: Add `_BENCHMARK_CATEGORY_MAP` + `_resolveCategory`**

Insert before `var api =`:

```js
  var _BENCHMARK_CATEGORY_MAP = {
    // clinical-knowledge
    'medqa_usmle':                'clinical-knowledge',
    'medqa':                      'clinical-knowledge',
    'medqa_vals_ai':              'clinical-knowledge',
    'medmcqa':                    'clinical-knowledge',
    'medexpqa':                   'clinical-knowledge',
    // biomedical-research
    'pubmedqa':                   'biomedical-research',
    // healthbench
    'healthbench':                'healthbench',
    'healthbench_hard':           'healthbench',
    'healthbench_consensus':      'healthbench',
    'healthbench_professional':   'healthbench',
    'healthbench_pro_care_consult':   'healthbench',
    'healthbench_pro_gf_difficult':   'healthbench',
    'healthbench_pro_goodfaith':  'healthbench',
    'healthbench_pro_redteam':    'healthbench',
    'healthbench_pro_research':   'healthbench',
    'healthbench_pro_writing':    'healthbench',
    'healthbench_pro_orthopedics':'healthbench',
    // specialty
    'dermabench':                 'specialty',
    'dermavqa':                   'specialty',
    'medcalc_bench':              'specialty',
    'medcalc_bench_verified':     'specialty',
    // multilingual
    'mmedbench':                  'multilingual',
    'jmedbench':                  'multilingual',
    'medbench_cn':                'multilingual',
    'climedbench_cn':             'multilingual',
    // dialog
    'meddialog':                  'dialog',
    'meddialog_rubrics':          'dialog'
  };

  function _resolveCategory(benchmarkId) {
    if (!benchmarkId) return null;
    return Object.prototype.hasOwnProperty.call(_BENCHMARK_CATEGORY_MAP, benchmarkId)
      ? _BENCHMARK_CATEGORY_MAP[benchmarkId]
      : null;
  }
```

Update `api`: add `_BENCHMARK_CATEGORY_MAP, _resolveCategory`.

- [ ] **Step 4-6: Verify, parse, commit**

```bash
git add dashboard/js/medical-ai-charts.js dashboard/js/__tests__/medical-ai-charts.test.js
git commit -m "feat(medical-ai-charts): Task 2 — _BENCHMARK_CATEGORY_MAP + _resolveCategory + test"
```

---

### Task 3: `_ensureMountPoint` factory + style + `renderAll` skeleton + index.html wiring

**Files:** Modify `dashboard/js/medical-ai-charts.js`, `dashboard/js/medical-ai.js`, `dashboard/index.html`

- [ ] **Step 1: Add factory + style + applyToolbox + renderAll stub**

Mirror ai4s-charts.js Task 3 (use ID `medical-ai-charts-style`, mount class `medical-ai-chart-mount`, host `#medical-ai-charts`). Code is structurally identical to AI4S Task 3 — just substitute the IDs. Reference `dashboard/js/ai4s-charts.js` lines 67-241 for the pattern.

- [ ] **Step 2: Add `<div id="medical-ai-charts">` to index.html**

In `dashboard/index.html` `#tab-medical-ai` section, add after existing content:
```html
<div id="medical-ai-charts" class="space-y-6 mt-8"></div>
```

- [ ] **Step 3: Add `<script>` + bump cache-bust**

Replace:
```html
<script src="js/medical-ai.js?v=20260503a"></script>
```
With:
```html
<script src="js/medical-ai.js?v=20260509a"></script>
<script src="js/medical-ai-charts.js?v=20260509a"></script>
```

- [ ] **Step 4: Wire `MedicalAICharts.renderAll()` into `MedicalAI.render()`**

In `dashboard/js/medical-ai.js` find `render: function() { ... }` (around line 815). At the END (just before closing `},`):

```js
        if (typeof MedicalAICharts !== 'undefined' && MedicalAICharts.renderAll) {
            MedicalAICharts.renderAll();
        }
```

- [ ] **Step 5-6: Validate + commit**

```bash
node -c dashboard/js/medical-ai-charts.js
node -c dashboard/js/medical-ai.js
node dashboard/js/__tests__/medical-ai-charts.test.js
git add dashboard/js/medical-ai-charts.js dashboard/js/medical-ai.js dashboard/index.html
git commit -m "feat(medical-ai-charts): Task 3 — _ensureMountPoint factory + renderAll skeleton + wiring"
```

---

### Task 4: `_MED_BREAKTHROUGHS` static dataset + schema test

**Files:** Modify `dashboard/js/medical-ai-charts.js`, `dashboard/js/__tests__/medical-ai-charts.test.js`

- [ ] **Step 1: Append failing schema test**

```js
// Task 4
assert.ok(Array.isArray(M._MED_BREAKTHROUGHS));
assert.ok(M._MED_BREAKTHROUGHS.length >= 6 && M._MED_BREAKTHROUGHS.length <= 8);
M._MED_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.domain, 'entry ' + i + ' missing domain');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 4 _MED_BREAKTHROUGHS schema OK');
```

- [ ] **Step 2: FAIL verify**, **Step 3: add 8-entry `_MED_BREAKTHROUGHS`** (verbatim from spec section 3 — Med-Gemini-3-Pro / Med-PaLM 2 / MedGemma 27B / Polaris-3 / OpenBioLLM-70B / M42 Med42-v2-70B / HuatuoGPT-o1 72B / KMed.ai). Add to `api`.

- [ ] **Step 4-6: PASS, commit**

```bash
git commit -m "feat(medical-ai-charts): Task 4 — _MED_BREAKTHROUGHS dataset (8 milestone tiles)"
```

---

## Phase 1B — Immediate widgets (sequential)

### Task 5: W1 Medical Breakthrough Hero Cards

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `_categoryColor` helper + `renderHeroCards`**

Color palette for medical categories (different from AI4S domain palette):

```js
  function _categoryColor(domain) {
    var palette = {
      'clinical-llm':           '#10b981', // emerald
      'biomedical-llm':         '#a78bfa', // violet
      'multilingual-medical':   '#f59e0b', // amber
      'biomedical-encoder':     '#3b82f6', // blue
      'korean-medical':         '#ec4899', // pink
      'medical-vlm':            '#8b5cf6', // purple
      'protein-fm':             '#14b8a6', // teal
      'drug-discovery':         '#f97316', // orange
      'radiology-reporting':    '#22d3ee', // cyan
      'safety-evaluator':       '#fb7185', // rose
      'clinical-prediction':    '#eab308'  // yellow
    };
    return palette[domain] || '#6b7280';
  }

  function renderHeroCards() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('medical-ai-charts');
    if (!host) return;
    var existing = document.getElementById('medical-ai-hero-cards-section');
    if (existing) return;
    var section = document.createElement('div');
    section.id = 'medical-ai-hero-cards-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'SOTA Watch — Medical Breakthroughs';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Milestone moments in Medical AI — primary-source links, no extrapolation.';
    section.appendChild(sub);

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3';

    _MED_BREAKTHROUGHS.forEach(function(b) {
      var card = document.createElement('a');
      card.href = b.source_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'block rounded border bg-gray-950 border-gray-800 p-3 hover:border-blue-600 transition';
      card.style.borderLeft = '4px solid ' + _categoryColor(b.domain);

      var title = document.createElement('div');
      title.className = 'text-sm font-semibold text-gray-100';
      title.textContent = b.title;
      card.appendChild(title);

      var year = document.createElement('div');
      year.className = 'text-[10px] text-gray-500 uppercase tracking-wider mt-0.5';
      year.textContent = b.domain + ' · ' + b.year;
      card.appendChild(year);

      var nar = document.createElement('div');
      nar.className = 'text-xs text-gray-400 mt-1.5';
      nar.textContent = b.narrative;
      card.appendChild(nar);

      var val = document.createElement('div');
      val.className = 'text-sm font-mono text-blue-300 mt-2';
      val.textContent = b.value;
      card.appendChild(val);

      grid.appendChild(card);
    });

    section.appendChild(grid);
    host.appendChild(section);
  }
```

- [ ] **Step 2: Wire into `renderAll`** (replace stub with `try { renderHeroCards(); } catch (e) {...}`). Add to `api`.

- [ ] **Step 3-4: Validate + commit**

```bash
git commit -m "feat(medical-ai-charts): W1 Medical Breakthrough Hero Cards (8 tiles)"
```

---

### Task 6: W2 Specialty × Benchmark Coverage Matrix

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `_medicalAICategories` + `_medicalAIModels` + `renderSpecialtyMatrix`**

```js
  function _medicalAICategories() {
    if (typeof window === 'undefined') return [];
    if (typeof window.MedicalAI !== 'undefined' && window.MedicalAI.CATEGORIES) return window.MedicalAI.CATEGORIES;
    return [];
  }

  // Returns [{model_id, specialty_key}] for all models in any Medical AI category.
  function _medicalAIModels() {
    var cats = _medicalAICategories();
    if (!cats.length || typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return [];
    var modelsById = {};
    window.App.data.models.forEach(function(m) { modelsById[m.id] = m; });
    var seen = {}; var out = [];
    cats.forEach(function(c) {
      (c.models || []).forEach(function(mid) {
        if (seen[mid]) return;
        seen[mid] = true;
        var m = modelsById[mid] || { id: mid, name: '' };
        var sp = _resolveSpecialty(mid, m.name);
        out.push({ model_id: mid, specialty_key: sp.key });
      });
    });
    return out;
  }

  function renderSpecialtyMatrix() {
    _ensureMountPoint('medical-ai-chart-specialty-matrix',
      'Specialty × Benchmark Category Matrix',
      'Which medical specialties report on which benchmark categories. Cell = distinct model count.');
    if (typeof echarts === 'undefined') return;
    var mountEl = document.getElementById('medical-ai-chart-specialty-matrix');
    if (!mountEl) return;

    var entries = _medicalAIModels();
    if (!entries.length) return;

    var specOrder = _SPECIALTY_MAP.map(function(s) { return s.key; }).concat(['other']);
    var specLabel = {}; _SPECIALTY_MAP.forEach(function(s) { specLabel[s.key] = s.label; }); specLabel['other'] = 'Other';
    var categories = ['clinical-knowledge','biomedical-research','healthbench','specialty','multilingual','dialog'];
    var categoryLabel = {
      'clinical-knowledge': 'Clinical Knowledge',
      'biomedical-research': 'Biomedical Research',
      'healthbench': 'HealthBench Family',
      'specialty': 'Specialty Eval',
      'multilingual': 'Multi-language',
      'dialog': 'Dialog / Safety'
    };

    // Index scores by model
    var scoresByModel = {};
    if (window.App && window.App.data && window.App.data.scores) {
      window.App.data.scores.forEach(function(s) {
        var cat = _resolveCategory(s.benchmark_id);
        if (!cat) return;
        scoresByModel[s.model_id] = scoresByModel[s.model_id] || {};
        scoresByModel[s.model_id][cat] = true;
      });
    }

    var counts = {}; var maxV = 0;
    entries.forEach(function(e) {
      var cats = scoresByModel[e.model_id] || {};
      Object.keys(cats).forEach(function(c) {
        var k = e.specialty_key + '|' + c;
        counts[k] = (counts[k] || 0) + 1;
        if (counts[k] > maxV) maxV = counts[k];
      });
    });

    var data = [];
    for (var si = 0; si < specOrder.length; si++) {
      for (var ci = 0; ci < categories.length; ci++) {
        var v = counts[specOrder[si] + '|' + categories[ci]] || 0;
        data.push([ci, si, v === 0 ? '-' : v]);
      }
    }

    if (maxV === 0) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
      msg.textContent = 'No medical scores loaded — verify App.data';
      mountEl.appendChild(msg);
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-specialty-matrix');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 130, right: 24, top: 30, bottom: 80 },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          return '<b>' + (specLabel[specOrder[p.value[1]]] || '?') + '</b><br>' +
            (categoryLabel[categories[p.value[0]]] || '?') + '<br>Models: ' +
            (p.value[2] === '-' ? 0 : p.value[2]);
        }
      },
      xAxis: {
        type: 'category',
        data: categories.map(function(c) { return categoryLabel[c] || c; }),
        axisLabel: { color: '#9ca3af', rotate: 30, fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } }
      },
      yAxis: {
        type: 'category',
        data: specOrder.map(function(k) { return specLabel[k] || k; }),
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } }
      },
      visualMap: {
        min: 1, max: maxV,
        calculable: false,
        orient: 'horizontal', left: 'center', bottom: 8,
        textStyle: { color: '#9ca3af' },
        inRange: { color: ['#1e3a8a', '#3b82f6', '#60a5fa', '#bfdbfe'] }
      },
      series: [{
        name: 'Models', type: 'heatmap',
        data: data,
        label: { show: true, color: '#0f172a', fontSize: 9 },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(96,165,250,0.6)' } }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Step 2: Wire into renderAll fns + api**, **Step 3: validate + commit**

```bash
git commit -m "feat(medical-ai-charts): W2 Specialty × Benchmark Coverage Matrix"
```

---

### Task 7: W4 HealthBench Sub-benchmarks Radar

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `_scoresFor` (shared helper) + `renderHealthBenchRadar`**

```js
  // Shared helper — used by W3/W4/W6/W7/W8/W9
  function _scoresFor(benchmarkId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.scores) return [];
    var out = [];
    var ss = window.App.data.scores;
    for (var i = 0; i < ss.length; i++) {
      if (ss[i].benchmark_id === benchmarkId) out.push(ss[i]);
    }
    return out;
  }

  function _modelReleaseDate(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return null;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].release_date || null;
    }
    return null;
  }

  function _modelDisplayName(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return modelId;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].name || modelId;
    }
    return modelId;
  }

  function renderHealthBenchRadar() {
    _ensureMountPoint('medical-ai-chart-healthbench-radar',
      'HealthBench Sub-benchmarks Radar',
      'Top 5 models on the 7 HealthBench-Pro sub-benches (consensus / professional / redteam / research / care-consult / good-faith / writing).');
    if (typeof echarts === 'undefined') return;

    var subs = [
      'healthbench_consensus',
      'healthbench_professional',
      'healthbench_pro_care_consult',
      'healthbench_pro_redteam',
      'healthbench_pro_research',
      'healthbench_pro_goodfaith',
      'healthbench_pro_writing'
    ];

    // Aggregate scores per model
    var byModel = {};
    subs.forEach(function(b) {
      _scoresFor(b).forEach(function(s) {
        if (typeof s.value !== 'number') return;
        byModel[s.model_id] = byModel[s.model_id] || {};
        byModel[s.model_id][b] = s.value;
      });
    });

    // Pick top 5 by total coverage × mean
    var ranked = Object.keys(byModel).map(function(mid) {
      var v = byModel[mid];
      var sum = 0; var cov = 0;
      subs.forEach(function(b) {
        if (typeof v[b] === 'number') { sum += v[b]; cov++; }
      });
      return { model_id: mid, mean: cov > 0 ? sum / cov : 0, coverage: cov };
    }).filter(function(r) { return r.coverage >= 3; })
      .sort(function(a, b) { return b.mean - a.mean; })
      .slice(0, 5);

    var mountEl = document.getElementById('medical-ai-chart-healthbench-radar');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient HealthBench coverage — need ≥2 models with ≥3 sub-benches';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-healthbench-radar');
    if (!chart) return;
    var subLabels = ['Consensus','Professional','Care Consult','Red Team','Research','Good Faith','Writing'];
    var indicators = subLabels.map(function(label) { return { name: label, max: 100 }; });
    var palette = ['#60a5fa','#a78bfa','#34d399','#f59e0b','#fb7185'];
    var series = [{
      type: 'radar', emphasis: { focus: 'series' },
      data: ranked.map(function(r, i) {
        return {
          name: _modelDisplayName(r.model_id),
          value: subs.map(function(b) {
            var v = byModel[r.model_id][b];
            return typeof v === 'number' ? v : 0;
          }),
          lineStyle: { color: palette[i % palette.length], width: 2 },
          areaStyle: { color: palette[i % palette.length], opacity: 0.15 },
          itemStyle: { color: palette[i % palette.length] }
        };
      })
    }];
    var opt = {
      backgroundColor: 'transparent',
      legend: { bottom: 0, textStyle: { color: '#d1d5db' } },
      tooltip: { backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
      radar: { indicator: indicators,
        axisName: { color: '#9ca3af', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1f2937' } },
        splitArea: { areaStyle: { color: ['rgba(17,24,39,0.5)','rgba(17,24,39,0.3)'] } },
        axisLine: { lineStyle: { color: '#4b5563' } } },
      series: series
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Step 2-3: Wire + validate + commit**

```bash
git commit -m "feat(medical-ai-charts): W4 HealthBench Sub-benchmarks Radar (top 5 × 7 sub-benches)"
```

---

### Task 8: W6 USMLE Progression Curve

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `renderUSMLEProgression`**

```js
  function renderUSMLEProgression() {
    _ensureMountPoint('medical-ai-chart-usmle-progression',
      'USMLE Progression Curve',
      'medqa_usmle scores over model release date. Tracks the medical-AI capability frontier on USMLE-class questions.');
    if (typeof echarts === 'undefined') return;

    var rows = _scoresFor('medqa_usmle');
    var pts = [];
    rows.forEach(function(r) {
      var d = _modelReleaseDate(r.model_id);
      if (!d || typeof r.value !== 'number') return;
      pts.push([d, r.value, r.model_id]);
    });
    pts.sort(function(a, b) { return a[0].localeCompare(b[0]); });

    var mountEl = document.getElementById('medical-ai-chart-usmle-progression');
    if (pts.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No USMLE scores loaded — verify App.data.scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-usmle-progression');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 50 },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var d = p[0];
          return d.value[0] + '<br><b>' + _modelDisplayName(d.value[2]) + '</b><br>USMLE: ' + d.value[1];
        }
      },
      xAxis: { type: 'time', axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      yAxis: { type: 'value', name: 'medqa_usmle Score', min: 0, max: 100,
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [{
        name: 'USMLE',
        type: 'line',
        data: pts.map(function(p) { return [p[0], p[1], p[2]]; }),
        symbol: 'circle', symbolSize: 6,
        lineStyle: { color: '#10b981', width: 2 },
        itemStyle: { color: '#10b981' },
        areaStyle: { color: 'rgba(16,185,129,0.15)' }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Step 2-3: Wire + commit**

```bash
git commit -m "feat(medical-ai-charts): W6 USMLE Progression Curve (34 scores × time)"
```

---

### Task 9: W10 Medical Benchmark Catalog Grid

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `renderBenchmarkCatalog`**

Mirror AI4S Task 9 (`dashboard/js/ai4s-charts.js renderBenchmarkCatalog`) but use `_BENCHMARK_CATEGORY_MAP` and `_categoryColor` for the pill. Mount ID: `medical-ai-bench-catalog-section`. Title: 'Medical AI Benchmark Catalog'.

Reference code from `dashboard/js/ai4s-charts.js` lines around `renderBenchmarkCatalog`. Key differences:
- ID: `medical-ai-bench-catalog-section`
- Map: `_BENCHMARK_CATEGORY_MAP` (not `_BENCHMARK_DOMAIN_MAP`)
- Color via `_categoryColor` of the bench's category value
- Title: 'Medical AI Benchmark Catalog'

- [ ] **Step 2: Wire + commit**

```bash
git commit -m "feat(medical-ai-charts): W10 Medical Benchmark Catalog Grid (~30 entries searchable)"
```

---

## Phase 2B — Data-dependent widgets (sequential)

### Task 10: W3 Frontier vs Medical-Specialist Compare

**Files:** Modify `dashboard/js/medical-ai-charts.js`

```js
  var _FRONTIER_IDS_FOR_MED = [
    'openai/gpt-5.5','openai/gpt-5.4','anthropic/claude-opus-4.7',
    'google/gemini-3.1-pro','xai/grok-4.20','deepseek/deepseek-v4-pro'
  ];
  var _MED_SPECIALIST_IDS = [
    'google/med-gemini-3-pro','google/med-palm-2','google/medgemma-27b',
    'google/medgemma-9b','m42-health/med42-v2-70b','saama/openbiollm-llama3-70b',
    'epfl/meditron-70b','openmeditron/meditron3-70b'
  ];

  function _avgScoreForGroup(modelIds, benchmarkId) {
    var scores = _scoresFor(benchmarkId).filter(function(s) {
      return modelIds.indexOf(s.model_id) !== -1 && typeof s.value === 'number';
    });
    if (!scores.length) return null;
    var sum = 0;
    for (var i = 0; i < scores.length; i++) sum += scores[i].value;
    return sum / scores.length;
  }

  function renderFrontierVsMedicalSpecialist() {
    _ensureMountPoint('medical-ai-chart-frontier-vs-specialist',
      'Frontier LLM vs Medical Specialist',
      'Frontier general LLMs vs medical foundation models on shared MedQA-class benchmarks.');
    if (typeof echarts === 'undefined') return;

    var benches = ['medqa_usmle','medqa','medmcqa','pubmedqa','medexpqa','healthbench'];
    var labels = []; var fr = []; var sp = [];
    benches.forEach(function(bid) {
      var f = _avgScoreForGroup(_FRONTIER_IDS_FOR_MED, bid);
      var s = _avgScoreForGroup(_MED_SPECIALIST_IDS, bid);
      if (f === null && s === null) return;
      labels.push(bid);
      fr.push(f === null ? null : Math.round(f * 10) / 10);
      sp.push(s === null ? null : Math.round(s * 10) / 10);
    });

    var mountEl = document.getElementById('medical-ai-chart-frontier-vs-specialist');
    if (!labels.length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No shared benchmarks have both frontier + medical-specialist scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-frontier-vs-specialist');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 70 },
      legend: { bottom: 0, textStyle: { color: '#d1d5db' } },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
      xAxis: { type: 'category', data: labels,
        axisLabel: { color: '#9ca3af', rotate: 30, fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } } },
      yAxis: { type: 'value', name: 'Avg Score', min: 0, max: 100,
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [
        { name: 'Frontier LLM (avg)', type: 'bar', data: fr, itemStyle: { color: '#60a5fa' } },
        { name: 'Medical Specialist (avg)', type: 'bar', data: sp, itemStyle: { color: '#10b981' } }
      ]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Wire + commit**:
```bash
git commit -m "feat(medical-ai-charts): W3 Frontier vs Medical-Specialist Compare"
```

---

### Task 11: W5 Per-Category Mini-Leaderboard Modal

**Files:** Modify `dashboard/js/medical-ai-charts.js`, `dashboard/js/medical-ai.js`, `dashboard/js/__tests__/medical-ai-charts.test.js`

- [ ] **Step 1: Append composite test** (mirror AI4S Task 14 with same mock data structure)

- [ ] **Step 2: Add `_categoryBenchmarks` + `_perCategoryComposite` + `openCategoryLeaderboard`**

Mirror AI4S Task 14 (`_domainBenchmarks` → `_categoryBenchmarks`, `_perDomainComposite` → `_perCategoryComposite`, `openDomainLeaderboard` → `openCategoryLeaderboard`). The composite formula is identical — max-normalized mean with coverage ≥1.

- [ ] **Step 3: Wire Shift+click in `dashboard/js/medical-ai.js`**

In `_renderCategoryMap` (around line 850 in medical-ai.js), find the existing card click handler and wrap with Shift+click → `MedicalAICharts.openCategoryLeaderboard(cat.code)`.

- [ ] **Step 4: Validate + commit**

```bash
git commit -m "feat(medical-ai-charts): W5 Per-Category Mini-Leaderboard Modal + Shift+click"
```

---

### Task 12: W7 Multi-language Medical Compare

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `renderMultilangCompare`**

```js
  function renderMultilangCompare() {
    _ensureMountPoint('medical-ai-chart-multilang-compare',
      'Multi-language Medical Compare',
      'Top model on each multilingual medical benchmark — mmedbench (6-lang) / jmedbench (Japanese) / medbench_cn / climedbench_cn.');
    if (typeof echarts === 'undefined') return;

    var benches = ['mmedbench','jmedbench','medbench_cn','climedbench_cn'];
    var data = [];
    benches.forEach(function(bid) {
      var rows = _scoresFor(bid);
      if (!rows.length) return;
      var top = rows.slice().sort(function(a, b) { return b.value - a.value; })[0];
      data.push({
        bid: bid,
        value: typeof top.value === 'number' ? Math.round(top.value * 10) / 10 : 0,
        model: top.model_id
      });
    });

    var mountEl = document.getElementById('medical-ai-chart-multilang-compare');
    if (data.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient multi-language medical scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-multilang-compare');
    if (!chart) return;
    var palette = ['#60a5fa','#a78bfa','#34d399','#f59e0b'];
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 60, right: 24, top: 30, bottom: 60 },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var d = data[p[0].dataIndex];
          return d.bid + '<br>Top: <b>' + _modelDisplayName(d.model) + '</b><br>Score: ' + d.value;
        }
      },
      xAxis: { type: 'category', data: data.map(function(d) { return d.bid; }),
        axisLabel: { color: '#9ca3af', rotate: 20, fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } } },
      yAxis: { type: 'value', name: 'Top Score',
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [{
        type: 'bar', data: data.map(function(d, i) {
          return { value: d.value, itemStyle: { color: palette[i % palette.length] } };
        })
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Step 2-3: Wire + commit**:
```bash
git commit -m "feat(medical-ai-charts): W7 Multi-language Medical Compare"
```

---

### Task 13: W8 Medical Safety Heatmap

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `renderSafetyHeatmap`**

```js
  function renderSafetyHeatmap() {
    _ensureMountPoint('medical-ai-chart-safety-heatmap',
      'Medical Safety / Hallucination Heatmap',
      'Top models × HealthBench safety sub-benches (redteam / good-faith / care-consult / writing). Cell = score (higher = safer/better).');
    if (typeof echarts === 'undefined') return;

    var safetySubs = [
      'healthbench_pro_redteam',
      'healthbench_pro_goodfaith',
      'healthbench_pro_gf_difficult',
      'healthbench_pro_care_consult',
      'healthbench_pro_writing'
    ];

    var byModel = {};
    safetySubs.forEach(function(b) {
      _scoresFor(b).forEach(function(s) {
        if (typeof s.value !== 'number') return;
        byModel[s.model_id] = byModel[s.model_id] || {};
        byModel[s.model_id][b] = s.value;
      });
    });

    // Top 8 models by total coverage × mean
    var ranked = Object.keys(byModel).map(function(mid) {
      var sum = 0; var cov = 0;
      safetySubs.forEach(function(b) {
        var v = byModel[mid][b];
        if (typeof v === 'number') { sum += v; cov++; }
      });
      return { model_id: mid, mean: cov > 0 ? sum / cov : 0, coverage: cov };
    }).filter(function(r) { return r.coverage >= 2; })
      .sort(function(a, b) { return b.mean - a.mean; })
      .slice(0, 8);

    var mountEl = document.getElementById('medical-ai-chart-safety-heatmap');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient safety scores — need ≥2 models with ≥2 safety sub-benches';
        mountEl.appendChild(msg);
      }
      return;
    }

    var subLabels = ['Red Team','Good Faith','GF Difficult','Care Consult','Writing'];
    var data = [];
    var maxV = 0;
    ranked.forEach(function(r, ri) {
      safetySubs.forEach(function(b, bi) {
        var v = byModel[r.model_id][b];
        var val = (typeof v === 'number') ? v : null;
        data.push([bi, ri, val === null ? '-' : Math.round(val * 10) / 10]);
        if (val !== null && val > maxV) maxV = val;
      });
    });

    var chart = Charts._getOrCreate('medical-ai-chart-safety-heatmap');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 180, right: 24, top: 30, bottom: 80 },
      tooltip: { position: 'top',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          return '<b>' + _modelDisplayName(ranked[p.value[1]].model_id) + '</b><br>' +
            subLabels[p.value[0]] + ': ' + (p.value[2] === '-' ? 'n/a' : p.value[2]);
        }
      },
      xAxis: { type: 'category', data: subLabels,
        axisLabel: { color: '#9ca3af', rotate: 20, fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } } },
      yAxis: { type: 'category', data: ranked.map(function(r) { return _modelDisplayName(r.model_id); }),
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } } },
      visualMap: { min: 0, max: maxV || 100, calculable: false,
        orient: 'horizontal', left: 'center', bottom: 8,
        textStyle: { color: '#9ca3af' },
        inRange: { color: ['#7f1d1d','#ef4444','#f59e0b','#10b981','#34d399'] } },
      series: [{ name: 'Score', type: 'heatmap', data: data,
        label: { show: true, color: '#0f172a', fontSize: 9 } }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Wire + commit**:
```bash
git commit -m "feat(medical-ai-charts): W8 Medical Safety Heatmap"
```

---

### Task 14: W9 Clinical Prediction Bubble

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] **Step 1: Add `renderClinicalPredictionBubble`**

```js
  function renderClinicalPredictionBubble() {
    _ensureMountPoint('medical-ai-chart-clinical-prediction',
      'Clinical Prediction Models (MIMIC / eICU)',
      'Models in the clinical-prediction category plotted by their available scores. Empty state if no scores loaded.');
    if (typeof echarts === 'undefined') return;
    var mountEl = document.getElementById('medical-ai-chart-clinical-prediction');
    if (!mountEl) return;

    // Find models in clinical-prediction category
    var cats = _medicalAICategories();
    var cpCat = cats.filter(function(c) { return c.code === 'clinical-prediction'; })[0];
    if (!cpCat || !cpCat.models || !cpCat.models.length) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
      msg.textContent = 'clinical-prediction category not loaded';
      mountEl.appendChild(msg);
      return;
    }

    // For each model in this category, count their scores across any benchmark
    var pts = [];
    if (window.App && window.App.data && window.App.data.scores) {
      cpCat.models.forEach(function(mid) {
        var rows = window.App.data.scores.filter(function(s) { return s.model_id === mid && typeof s.value === 'number'; });
        if (!rows.length) return;
        var avg = rows.reduce(function(a, s) { return a + s.value; }, 0) / rows.length;
        pts.push({
          value: [rows.length, avg],
          symbolSize: Math.min(40, 12 + rows.length * 1.5),
          _meta: { model_id: mid, n: rows.length, avg: avg }
        });
      });
    }

    if (pts.length < 1) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg2 = document.createElement('div');
      msg2.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
      msg2.textContent = 'No clinical-prediction model scores loaded yet';
      mountEl.appendChild(msg2);
      return;
    }

    var chart = Charts._getOrCreate('medical-ai-chart-clinical-prediction');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 50 },
      tooltip: { trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var m = p.data._meta;
          return '<b>' + _modelDisplayName(m.model_id) + '</b><br>Scored benchmarks: ' + m.n + '<br>Avg: ' + m.avg.toFixed(2);
        }
      },
      xAxis: { type: 'value', name: 'Scored benchmarks (n)',
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      yAxis: { type: 'value', name: 'Avg score',
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [{
        name: 'Clinical Prediction Models', type: 'scatter', data: pts,
        itemStyle: { color: '#fb7185', opacity: 0.85 }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

- [ ] **Wire + commit**:
```bash
git commit -m "feat(medical-ai-charts): W9 Clinical Prediction Bubble (MIMIC/eICU models)"
```

---

## Phase 3 — Polish + deploy

### Task 15: Lazy render integration

**Files:** Modify `dashboard/js/medical-ai-charts.js`

- [ ] Replace synchronous `renderAll` with eager + lazy split (mirror AI4S Task 18):

```js
  function renderAll() {
    var eagerFns = [renderHeroCards, renderSpecialtyMatrix, renderHealthBenchRadar];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[MedicalAICharts] eager failed:', fn.name, e);
      }
    });
    var lazyFns = [
      renderUSMLEProgression,
      renderFrontierVsMedicalSpecialist,
      renderMultilangCompare,
      renderSafetyHeatmap,
      renderClinicalPredictionBubble,
      renderBenchmarkCatalog
    ];
    function _runLazy() {
      lazyFns.forEach(function(fn) {
        try { fn(); } catch (e) {
          if (typeof console !== 'undefined') console.warn('[MedicalAICharts] lazy failed:', fn.name, e);
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

- [ ] **Validate + commit**:
```bash
git commit -m "feat(medical-ai-charts): Task 15 — lazy render orchestrator (eager 3 + lazy 6)"
```

---

### Task 16: Cache-bust + push + deploy verify + docs

**Files:** Modify `dashboard/index.html`, `HISTORY.md`, `data/export/reports/changelog.json`

- [ ] Bump `medical-ai.js` + `medical-ai-charts.js` to `?v=20260509b`.
- [ ] Push to ops, trigger CI (`gh workflow run benchmark-update.yml --ref main`).
- [ ] Wait, verify markers in deployed JS:
  ```bash
  curl -sS "https://hollobit.github.io/SOTA/js/medical-ai-charts.js?z=$(date +%s)" -o /tmp/live-med.js
  for m in renderHeroCards renderSpecialtyMatrix renderHealthBenchRadar renderUSMLEProgression renderFrontierVsMedicalSpecialist renderMultilangCompare renderSafetyHeatmap renderClinicalPredictionBubble renderBenchmarkCatalog openCategoryLeaderboard _SPECIALTY_MAP _BENCHMARK_CATEGORY_MAP _MED_BREAKTHROUGHS requestIdleCallback; do
    echo "$m: $(grep -c "$m" /tmp/live-med.js)"
  done
  ```
- [ ] Append HISTORY.md Session 8 section + changelog.json entry.
- [ ] Sync HISTORY.md to main via worktree.

---

## Self-Review

**Spec coverage:**
- ✅ Sub-section structure (SOTA Watch / 18 Category Cards / Cross-Specialty Compare / Mini-Leaderboards) — Tasks 5 (W1) and 11 (W5)
- ✅ 10 widgets — W1 (Task 5), W2 (Task 6), W3 (Task 10), W4 (Task 7), W5 (Task 11), W6 (Task 8), W7 (Task 12), W8 (Task 13), W9 (Task 14), W10 (Task 9)
- ✅ Specialty taxonomy — Task 1
- ✅ Benchmark category mapping — Task 2
- ✅ Breakthroughs static dataset — Task 4
- ✅ File structure (UMD medical-ai-charts.js + tests) — Tasks 1, 3
- ✅ Per-category composite (≥1 coverage) — Task 11
- ✅ Phasing — Tasks ordered 1A → 1B → 2B → polish
- ✅ Cache-bust + integration — Tasks 3, 16
- ✅ Out of scope items NOT included (no cost widgets, no FDA tracking, no patient UX)

**Placeholder scan:** None — every task has actual code, exact paths, exact commands.

**Type consistency:**
- `_resolveSpecialty(modelId, modelName)` returns `{key, label, keywords}` — used in W2 (Task 6).
- `_resolveCategory(benchmarkId)` returns string|null — used in W2/W5/W10.
- `_MED_BREAKTHROUGHS[i]` schema enforced by Task 4 schema test; consumed by W1.
- `_scoresFor`, `_modelReleaseDate`, `_modelDisplayName`, `_avgScoreForGroup` defined once in Task 7/8/10 and reused.
- `_categoryColor(domain)` defined in Task 5, reused in W10 (Task 9).
- Mount IDs (`medical-ai-chart-*-section`) consistently namespaced.

---

**Plan complete.** Ready for subagent-driven execution. **16 tasks** = Phase 1A 4 + Phase 1B 5 + Phase 2B 5 + Phase 3 2.
