# Sovereign AI Widget Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development.

**Goal:** Add 6 NEW widgets to Sovereign AI menu (already has 9). Focused on gaps not covered by existing rich set.

**Architecture:** New `dashboard/js/sovereign-charts.js` UMD module (mirrors physical-ai-charts.js / medical-ai-charts.js). Hooked from existing `Sovereign.render()`. One static map (`_BENCHMARK_DIMENSION_MAP`) + one dataset (`_SOV_BREAKTHROUGHS`). No new helpers needed beyond `_resolveDimension`.

**Tech Stack:** Vanilla ES5 UMD, ECharts 5 dark theme, Tailwind dark CSS, vanilla node assert tests, no build step. No `innerHTML` writes.

---

## File structure

| Action | Path |
|---|---|
| **CREATE** | `dashboard/js/sovereign-charts.js` |
| **CREATE** | `dashboard/js/__tests__/sovereign-charts.test.js` |
| **MODIFY** | `dashboard/js/sovereign.js` (renderAll hook + Shift+click on dimension cards) |
| **MODIFY** | `dashboard/index.html` (mount div + script + cache-bust) |

---

## Phase 1A — Foundation (4 tasks)

### Task 1: UMD skeleton + `_BENCHMARK_DIMENSION_MAP` + `_resolveDimension` + test

**Test (`dashboard/js/__tests__/sovereign-charts.test.js`):**

```js
'use strict';
var assert = require('assert');
var S = require('../sovereign-charts.js');

assert.ok(S, 'SovereignCharts must be exported');
assert.ok(S._resolveDimension, '_resolveDimension must be exported');

assert.strictEqual(S._resolveDimension('mmmlu'), 'language');
assert.strictEqual(S._resolveDimension('chinese_simpleqa'), 'language');
assert.strictEqual(S._resolveDimension('kmle'), 'medical');
assert.strictEqual(S._resolveDimension('healthbench_professional'), 'medical');
assert.strictEqual(S._resolveDimension('vlair_doc_qa'), 'domain');
assert.strictEqual(S._resolveDimension('aixcc_synth_vuln'), 'domain');
assert.strictEqual(S._resolveDimension('unknown_bench'), null);

console.log('Task 1 _resolveDimension OK');
```

**Module (`dashboard/js/sovereign-charts.js`):**

```js
/**
 * Sovereign AI tab — supplemental widgets (6 NEW visualisations).
 *
 * Mirrors dashboard/js/physical-ai-charts.js patterns (UMD module +
 * _ensureMountPoint factory + Charts._getOrCreate + lazy render).
 *
 * Loaded after sovereign.js. Render is invoked from Sovereign.render() at
 * the end via SovereignCharts.renderAll().
 */
(function(root) {
  'use strict';

  // ====================================================================
  // Benchmark → Sovereign dimension mapping. Used by W5 / W6.
  // Keys must match Sovereign.DIMENSIONS[].id (language/medical/domain).
  // ====================================================================
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

  function _resolveDimension(benchmarkId) {
    if (!benchmarkId) return null;
    return Object.prototype.hasOwnProperty.call(_BENCHMARK_DIMENSION_MAP, benchmarkId)
      ? _BENCHMARK_DIMENSION_MAP[benchmarkId] : null;
  }

  var api = {
    _BENCHMARK_DIMENSION_MAP: _BENCHMARK_DIMENSION_MAP,
    _resolveDimension: _resolveDimension
  };

  root.SovereignCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
```

**Commit:** `feat(sovereign-charts): Task 1 — UMD skeleton + _BENCHMARK_DIMENSION_MAP + _resolveDimension + test`

---

### Task 2: `_ensureMountPoint` factory + style + `renderAll` skeleton + index.html wiring

Mirror physical-ai-charts.js Task 3. Substitute IDs:
- Style block ID: `sovereign-charts-style`
- Mount class: `sovereign-chart-mount`
- Host: `#sovereign-charts`

In `dashboard/index.html` `#tab-sovereign` section, add `<div id="sovereign-charts" class="space-y-6 mt-8"></div>` BEFORE `</section>`.

Bump `<script src="js/sovereign.js?v=20260509a"></script>` to `?v=20260509b` and add `<script src="js/sovereign-charts.js?v=20260509a"></script>`.

In `dashboard/js/sovereign.js` `render: function() { ... }` (around line 1075), append at end:
```js
        if (typeof SovereignCharts !== 'undefined' && SovereignCharts.renderAll) {
            SovereignCharts.renderAll();
        }
```

Functions to add to `sovereign-charts.js` (insert before `var api =`):
- `_ensureSovereignChartsStyle()` — mobile + a11y CSS injection
- `_ensureMountPoint(id, title, hint)` — mount factory with role=img/aria-label
- `_applyToolbox(opt)` — saveAsImage + dataView + restore
- `function renderAll() { /* stub */ }`

Update `api` to add `_ensureMountPoint, _applyToolbox, renderAll`.

**Commit:** `feat(sovereign-charts): Task 2 — _ensureMountPoint factory + renderAll skeleton + wiring`

---

### Task 3: `_SOV_BREAKTHROUGHS` + schema test

**Test (append):**
```js
// Task 3
assert.ok(Array.isArray(S._SOV_BREAKTHROUGHS));
assert.ok(S._SOV_BREAKTHROUGHS.length >= 6 && S._SOV_BREAKTHROUGHS.length <= 8);
S._SOV_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.region, 'entry ' + i + ' missing region');
  assert.ok(b.flag, 'entry ' + i + ' missing flag');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 3 _SOV_BREAKTHROUGHS schema OK');
```

**Code:** Insert `_SOV_BREAKTHROUGHS` (8 entries from spec section 1: KMed.ai/HyperCLOVA X/DeepSeek V4 Pro/Qwen 3.6 Plus/Mistral Large 3/Falcon (TII)/Aya 23/Sea-LION v4). Add to `api`.

**Commit:** `feat(sovereign-charts): Task 3 — _SOV_BREAKTHROUGHS dataset (8 milestone tiles)`

---

## Phase 1B — 3 immediate widgets

### Task 4: W1 Sovereign Breakthrough Hero Cards

Add `_regionColor(region)` for sovereign region accents (different from medical/physical AI):

```js
  function _regionColor(region) {
    var palette = {
      'kr':       '#3b82f6', // blue
      'cn':       '#ef4444', // red
      'jp':       '#ec4899', // pink
      'in':       '#f97316', // orange
      'fr':       '#a78bfa', // violet
      'de':       '#fbbf24', // yellow
      'uk':       '#1d4ed8', // dark blue
      'il':       '#3b82f6', // blue
      'ae':       '#10b981', // emerald
      'sg':       '#fb7185', // rose
      'ch':       '#dc2626', // dark red
      'ru':       '#dc2626', // dark red
      'us-legal': '#9ca3af',
      'us-fin':   '#9ca3af',
      'us-open':  '#60a5fa'
    };
    return palette[region] || '#6b7280';
  }
```

Add `renderHeroCards()` — mirror Medical/Physical AI Task 5 with `_SOV_BREAKTHROUGHS`, host `#sovereign-charts`, section ID `sovereign-hero-cards-section`, title `'SOTA Watch — Sovereign Breakthroughs'`. Each card shows flag emoji + title + region/year + narrative + value. Border-left color = `_regionColor(b.region)`.

Wire into `renderAll` + `api`.

**Commit:** `feat(sovereign-charts): W1 Sovereign Breakthrough Hero Cards (8 tiles)`

---

### Task 5: W3 VLAIR Legal Sub-benchmarks Radar

Add shared helpers `_scoresFor`, `_modelDisplayName` (mirror Medical AI Task 7 — used by W2/W3/W4/W5).

Then `renderVLAIRRadar()` — radar with 5 axes (vlair_doc_qa / vlair_summarization / vlair_chronology / vlair_redlining / vlair_data_extract), top-5 models. Coverage filter ≥3.

```js
  function renderVLAIRRadar() {
    _ensureMountPoint('sovereign-chart-vlair-radar',
      'VLAIR Legal Sub-benchmarks Radar',
      'Top 5 models on the 5 VLAIR legal sub-benches (doc_qa / summarization / chronology / redlining / data_extract).');
    if (typeof echarts === 'undefined') return;

    var subs = ['vlair_doc_qa', 'vlair_summarization', 'vlair_chronology', 'vlair_redlining', 'vlair_data_extract'];

    var byModel = {};
    subs.forEach(function(b) {
      _scoresFor(b).forEach(function(s) {
        if (typeof s.value !== 'number') return;
        byModel[s.model_id] = byModel[s.model_id] || {};
        byModel[s.model_id][b] = s.value;
      });
    });

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

    var mountEl = document.getElementById('sovereign-chart-vlair-radar');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient VLAIR coverage — need ≥2 models with ≥3 sub-benches';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('sovereign-chart-vlair-radar');
    if (!chart) return;
    var subLabels = ['Doc QA', 'Summarization', 'Chronology', 'Redlining', 'Data Extract'];
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

Wire into `renderAll` + `api`.

**Commit:** `feat(sovereign-charts): W3 VLAIR Legal Sub-benchmarks Radar`

---

### Task 6: W6 Sovereign Benchmark Catalog Grid

Mirror Medical/Physical AI catalog. Use `_BENCHMARK_DIMENSION_MAP`. Section ID: `sovereign-bench-catalog-section`. Title: `'Sovereign Benchmark Catalog'`. Dimension pill palette:

```js
var dimPalette = {
  'language': '#3b82f6',
  'medical': '#10b981',
  'domain': '#a78bfa'
};
```

**Commit:** `feat(sovereign-charts): W6 Sovereign Benchmark Catalog Grid`

---

## Phase 2 — 3 data-dependent widgets

### Task 7: W2 Frontier vs Sovereign-Specialist Compare

Mirror Medical AI Task 10 / Physical AI Task 12 patterns:

```js
  var _FRONTIER_IDS_FOR_SOV = [
    'openai/gpt-5.5','openai/gpt-5.4','anthropic/claude-opus-4.7',
    'google/gemini-3.1-pro','xai/grok-4.20'
  ];
  var _SOV_SPECIALIST_IDS = [
    'deepseek/deepseek-v4-pro','alibaba/qwen-3.6-plus','moonshot/kimi-k2.6',
    'mistral/mistral-large-3','tii/falcon-h1-arabic-34b','cohere/aya-23',
    'ai-singapore/apertus-sea-lion-v4-8b','naver/hyperclova-x'
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

  function renderFrontierVsSovereign() {
    _ensureMountPoint('sovereign-chart-frontier-vs-specialist',
      'Frontier vs Sovereign-Specialist Compare',
      'Frontier general LLMs vs regional sovereign models on multilingual benchmarks.');
    if (typeof echarts === 'undefined') return;

    var benches = ['mmmlu', 'c_eval', 'cmmlu', 'chinese_simpleqa', 'global_piqa', 'swe_bench_multilingual'];
    var labels = []; var fr = []; var sp = [];
    benches.forEach(function(bid) {
      var f = _avgScoreForGroup(_FRONTIER_IDS_FOR_SOV, bid);
      var s = _avgScoreForGroup(_SOV_SPECIALIST_IDS, bid);
      if (f === null && s === null) return;
      labels.push(bid);
      fr.push(f === null ? null : Math.round(f * 10) / 10);
      sp.push(s === null ? null : Math.round(s * 10) / 10);
    });

    var mountEl = document.getElementById('sovereign-chart-frontier-vs-specialist');
    if (!labels.length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No shared multilingual benchmarks have both frontier + sovereign-specialist scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('sovereign-chart-frontier-vs-specialist');
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
      yAxis: { type: 'value', name: 'Avg Score',
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [
        { name: 'Frontier LLM (avg)', type: 'bar', data: fr, itemStyle: { color: '#60a5fa' } },
        { name: 'Sovereign Specialist (avg)', type: 'bar', data: sp, itemStyle: { color: '#10b981' } }
      ]
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

**Commit:** `feat(sovereign-charts): W2 Frontier vs Sovereign-Specialist Compare`

---

### Task 8: W4 Multi-language Progression Curve

Mirror Medical AI Task 8 (W6 USMLE Progression). Add helper `_modelReleaseDate`.

```js
  function _modelReleaseDate(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return null;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].release_date || null;
    }
    return null;
  }

  function renderMultilangProgression() {
    _ensureMountPoint('sovereign-chart-multilang-progression',
      'Multi-language Progression Curve',
      'Multi-line: each multilingual benchmark over time. X = model release date, Y = score.');
    if (typeof echarts === 'undefined') return;

    var benches = ['mmmlu', 'c_eval', 'cmmlu', 'chinese_simpleqa', 'global_piqa', 'swe_bench_multilingual'];

    var seriesByBench = {};
    benches.forEach(function(bid) {
      var rows = _scoresFor(bid);
      var pts = [];
      rows.forEach(function(r) {
        var d = _modelReleaseDate(r.model_id);
        if (!d || typeof r.value !== 'number') return;
        pts.push([d, r.value, r.model_id]);
      });
      pts.sort(function(a, b) { return a[0].localeCompare(b[0]); });
      if (pts.length >= 2) seriesByBench[bid] = pts;
    });

    var mountEl = document.getElementById('sovereign-chart-multilang-progression');
    if (!Object.keys(seriesByBench).length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No multilingual scores loaded';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('sovereign-chart-multilang-progression');
    if (!chart) return;

    var palette = ['#a78bfa', '#60a5fa', '#34d399', '#f59e0b', '#fb7185', '#22d3ee'];
    var i = 0;
    var series = Object.keys(seriesByBench).map(function(bid) {
      var color = palette[i++ % palette.length];
      return {
        name: bid, type: 'line',
        data: seriesByBench[bid].map(function(p) { return [p[0], p[1]]; }),
        symbol: 'circle', symbolSize: 6,
        lineStyle: { color: color, width: 2 },
        itemStyle: { color: color }
      };
    });

    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 70 },
      legend: { bottom: 0, textStyle: { color: '#d1d5db' } },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' } },
      xAxis: { type: 'time', axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      yAxis: { type: 'value', name: 'Score',
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: series
    };
    chart.setOption(_applyToolbox(opt), true);
  }
```

**Commit:** `feat(sovereign-charts): W4 Multi-language Progression Curve`

---

### Task 9: W5 Per-Dimension Drill-down Modal + composite test

Mirror Medical AI Task 11 / Physical AI Task 11.

**Test:**
```js
// Task 9
assert.ok(S._perDimensionComposite, '_perDimensionComposite must be exported');
global.window = global.window || {};
global.window.App = { data: { scores: [
  { model_id: 'm1', benchmark_id: 'mmmlu', value: 80 },
  { model_id: 'm2', benchmark_id: 'mmmlu', value: 100 },
  { model_id: 'm1', benchmark_id: 'c_eval', value: 60 },
  { model_id: 'm2', benchmark_id: 'c_eval', value: 50 }
]}};
var c1 = S._perDimensionComposite('m1', ['mmmlu','c_eval']);
assert.strictEqual(c1.coverage, 2);
assert.strictEqual(c1.score, 90);
assert.strictEqual(S._perDimensionComposite('m3', ['mmmlu']), null);
console.log('Task 9 _perDimensionComposite OK');
```

**Code:** Add `_dimensionBenchmarks(dimensionId)` (returns benches matching the dimension via `_BENCHMARK_DIMENSION_MAP`), `_perDimensionComposite(modelId, benchIds)`, `openDimensionLeaderboard(dimensionId)`.

Wire Shift+click in `dashboard/js/sovereign.js`: find `_renderDimension` (around line 1085+) which renders dimension cards. Find each card's existing click handler and wrap with `e.shiftKey` → `SovereignCharts.openDimensionLeaderboard(dim.id)`.

**Commit:** `feat(sovereign-charts): W5 Per-Dimension Drill-down Modal + Shift+click`

---

## Phase 3 — Polish + deploy

### Task 10: Lazy render integration

```js
  function renderAll() {
    var eagerFns = [renderHeroCards, renderVLAIRRadar];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[SovereignCharts] eager failed:', fn.name, e);
      }
    });
    var lazyFns = [
      renderFrontierVsSovereign,
      renderMultilangProgression,
      renderBenchmarkCatalog
    ];
    function _runLazy() {
      lazyFns.forEach(function(fn) {
        try { fn(); } catch (e) {
          if (typeof console !== 'undefined') console.warn('[SovereignCharts] lazy failed:', fn.name, e);
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

**Commit:** `feat(sovereign-charts): Task 10 — lazy render orchestrator (eager 2 + lazy 3)`

---

### Task 11: Cache-bust + push + CI deploy + docs

- Bump `sovereign.js` + `sovereign-charts.js` to `?v=20260509b`.
- Push ops, trigger CI.
- Verify markers in deployed JS (renderHeroCards / renderVLAIRRadar / renderFrontierVsSovereign / renderMultilangProgression / renderBenchmarkCatalog / openDimensionLeaderboard / _BENCHMARK_DIMENSION_MAP / _SOV_BREAKTHROUGHS / requestIdleCallback).
- Append HISTORY.md Session 10 + changelog.json entry.
- Sync HISTORY.md to main worktree.

---

## Self-Review

**Spec coverage:** ✅ all 6 widgets + foundation + breakthroughs + composite + lazy render + deploy.

**Placeholder scan:** None.

**Type consistency:** `_resolveDimension` returns string|null, `_SOV_BREAKTHROUGHS` schema enforced by Task 3 test, `_perDimensionComposite` returns `{score, coverage}|null`. Mount IDs `sovereign-chart-*` consistently namespaced (avoiding collision with existing `sov-*` prefixes used by sovereign.js).
