/**
 * Agent tab — graphical comparison widgets (8 ECharts visualisations).
 *
 * All widgets read from App.data (models / benchmarks / scores / enrichment) plus
 * Agent._CATEGORIES / _AGENT_PRODUCTS / _EDGE_SLMS, and from data/aa_pricing.json
 * + data/edge_models_utility.json (already loaded by agent.js _loadUtility).
 *
 * Charts use ECharts 'dark' theme via the existing Charts._getOrCreate() factory
 * in dashboard/js/charts.js. Each renderer:
 *   - Receives a containerId (mount div in #agent-charts)
 *   - Bails early if echarts is undefined or container not visible
 *   - Calls Charts._getOrCreate to obtain a managed instance
 *   - Builds the option object and calls chart.setOption(opt, true)
 *
 * Render is invoked from agent.js Agent.render() after _renderCompare and before
 * _renderLeaderboard.
 *
 * Reference patterns:
 *   - dashboard/js/charts.js — Charts._getOrCreate factory + dark-theme reuse
 *   - dashboard/js/app.js renderTrends — heatmap + scatter precedents
 */
var AgentCharts = (function() {
  // Shared helpers — defined in agent.js IIFE but agent-charts.js is loaded after
  // and calls into Agent._helpers. We re-export the small ones we need.
  function _scoresFor(benchmarkId) {
    if (!window.App || !App.data || !App.data.scores) return [];
    // O(1) via the shared score index instead of scanning all ~18K scores.
    // This helper is called once per benchmark across every Agent widget; the
    // linear scan made the Agent tab take ~11s of pure JS.
    var idx = App.getScoreIndex && App.getScoreIndex();
    if (idx && idx.byBench) return idx.byBench[benchmarkId] || [];
    var out = [];
    for (var i = 0; i < App.data.scores.length; i++) {
      if (App.data.scores[i].benchmark_id === benchmarkId) out.push(App.data.scores[i]);
    }
    return out;
  }

  // Lazy id->model map so _modelDisplayName / _vendorOf are O(1) instead of
  // scanning all ~4.7K models on every call. Rebuilds if the models array grows.
  var _mmCache = null;
  function _modelMap() {
    var n = (window.App && App.data && App.data.models) ? App.data.models.length : 0;
    if (_mmCache && _mmCache.__n === n) return _mmCache;
    var m = { __n: n };
    if (window.App && App.data && App.data.models) {
      for (var i = 0; i < App.data.models.length; i++) m[App.data.models[i].id] = App.data.models[i];
    }
    _mmCache = m;
    return m;
  }

  function _modelDisplayName(modelId) {
    var m = _modelMap()[modelId];
    return m ? (m.name || modelId) : modelId;
  }

  function _vendorOf(modelId) {
    var m = _modelMap()[modelId];
    return m ? (m.vendor || '') : '';
  }

  function _modelClass(modelId) {
    if (!window.Agent) return 'frontier';
    var ap = Agent._AGENT_PRODUCTS || [];
    for (var i = 0; i < ap.length; i++) if (ap[i] === modelId) return 'agent-product';
    var es = Agent._EDGE_SLMS || [];
    for (var j = 0; j < es.length; j++) if (es[j] === modelId) return 'edge-slm';
    return 'frontier';
  }

  function _classColor(klass) {
    if (klass === 'agent-product') return '#fbbf24'; // amber-400
    if (klass === 'edge-slm') return '#34d399';      // emerald-400
    return '#60a5fa';                                 // blue-400
  }

  function _benchmarkLabel(benchmarkId) {
    if (!benchmarkId) return '';
    if (window.App && App.data && App.data.benchmarks) {
      var bs = App.data.benchmarks;
      if (Array.isArray(bs)) {
        for (var i = 0; i < bs.length; i++) {
          if (bs[i] && bs[i].id === benchmarkId) {
            return (bs[i].name && String(bs[i].name).length) ? bs[i].name : benchmarkId;
          }
        }
      } else if (typeof bs === 'object') {
        var hit = bs[benchmarkId];
        if (hit && hit.name) return hit.name;
      }
    }
    return benchmarkId;
  }

  function _categoryByKey(key) {
    if (!window.Agent || !Agent._CATEGORIES) return null;
    var cats = Agent._CATEGORIES;
    for (var i = 0; i < cats.length; i++) if (cats[i].key === key) return cats[i];
    return null;
  }

  function _isLowerBetter(cat, benchmarkId) {
    if (!cat || !cat.lower_better) return false;
    for (var i = 0; i < cat.lower_better.length; i++) {
      if (cat.lower_better[i] === benchmarkId) return true;
    }
    return false;
  }

  // Per-benchmark normalized score lookup for a given model (0-100).
  // Honors lower_better via the supplied category. Returns null if no score.
  function _normalizedScore(modelId, benchmarkId, cat) {
    var rows = _scoresFor(benchmarkId);
    if (!rows.length) return null;
    var maxV = 0;
    var mine = null;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r || typeof r.value !== 'number') continue;
      if (r.value > maxV) maxV = r.value;
      if (r.model_id === modelId) mine = r.value;
    }
    if (mine === null || maxV <= 0) return null;
    if (_isLowerBetter(cat, benchmarkId)) return (1 - mine / maxV) * 100;
    return (mine / maxV) * 100;
  }

  // Coverage per model in a category — count of benchmarks the model has a
  // numeric score on. Used for picking default agents and the top-8 list.
  function _categoryCoverage(cat) {
    if (!cat || !cat.benchmarks) return [];
    var counts = {};
    for (var i = 0; i < cat.benchmarks.length; i++) {
      var rows = _scoresFor(cat.benchmarks[i]);
      for (var j = 0; j < rows.length; j++) {
        var r = rows[j];
        if (!r || r.model_id == null || typeof r.value !== 'number') continue;
        counts[r.model_id] = (counts[r.model_id] || 0) + 1;
      }
    }
    var arr = [];
    for (var mid in counts) {
      if (Object.prototype.hasOwnProperty.call(counts, mid)) {
        arr.push({ model_id: mid, coverage: counts[mid] });
      }
    }
    arr.sort(function(a, b) { return b.coverage - a.coverage; });
    return arr;
  }

  // ======================================================================
  // Mount-point management. Each widget's container is created lazily
  // inside #agent-charts so widgets ship independently and any one being
  // unimplemented is a no-op (just empty section).
  // ======================================================================
  // Inject responsive + reduced-motion CSS once. Mobile (≤768px) shrinks the
  // 420px chart heights to 320px so they're readable on phones; users with
  // prefers-reduced-motion get ECharts animation suppressed so they don't get
  // a wave of bouncing bars on tab open.
  function _ensureAgentChartsStyle() {
    if (document.getElementById('agent-charts-style')) return;
    var s = document.createElement('style');
    s.id = 'agent-charts-style';
    s.textContent = [
      '@media (max-width: 768px) {',
      '  .agent-chart-mount { height: 320px !important; }',
      '  .agent-chart-mount canvas { max-width: 100% !important; }',
      '  #agent-charts h2 { font-size: 1rem !important; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .agent-chart-mount * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }',
      '}',
      '.agent-chart-mount:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  function _ensureMountPoint(id, title, hint) {
    _ensureAgentChartsStyle();
    var host = document.getElementById('agent-charts');
    if (!host) return null;
    var existing = document.getElementById(id + '-section');
    if (existing) return existing;
    var section = document.createElement('div');
    section.id = id + '-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    // Title row: <h2> + optional ⓘ info icon (B-polish — inline help via the
    // browser-native title attribute → free tooltip, no extra JS).
    var headRow = document.createElement('div');
    headRow.className = 'flex items-center mb-1';

    var h = document.createElement('h2');
    h.className = 'text-lg font-semibold text-gray-200';
    h.textContent = title;
    headRow.appendChild(h);

    if (hint) {
      var infoIcon = document.createElement('span');
      infoIcon.className = 'ml-2 text-gray-500 hover:text-blue-400 cursor-help text-sm';
      infoIcon.textContent = 'ⓘ'; // ⓘ
      infoIcon.title = hint;
      headRow.appendChild(infoIcon);
    }
    section.appendChild(headRow);

    if (hint) {
      var p = document.createElement('p');
      p.className = 'text-xs text-gray-500 mb-3';
      p.textContent = hint;
      section.appendChild(p);
    }

    var chart = document.createElement('div');
    chart.id = id;
    chart.className = 'w-full agent-chart-mount';
    chart.style.height = '420px';
    // a11y: ECharts renders into a canvas with no semantic structure.
    // role + aria-label gives screen readers something to announce when the
    // chart container is focused or summarized in the page outline.
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Chart: ' + title + (hint ? ' — ' + hint : ''));
    chart.setAttribute('tabindex', '0');
    section.appendChild(chart);

    host.appendChild(section);
    return section;
  }

  // ======================================================================
  // B-polish helpers (Wave 2D)
  // _applyToolbox: attach ECharts toolbox (PNG / data view / restore).
  // _saveState / _loadState: persist user selections in localStorage; failures
  // (private mode, quota) are swallowed silently.
  // ======================================================================
  function _applyToolbox(option) {
    if (!option || typeof option !== 'object') return option;
    option.toolbox = {
      show: true,
      feature: {
        saveAsImage: { title: 'PNG', pixelRatio: 2, name: 'agent-chart' },
        dataView: { title: 'Data', readOnly: true, lang: ['Data', 'Close', 'Refresh'] },
        restore: { title: 'Reset' }
      },
      right: 12,
      top: 4,
      iconStyle: { borderColor: '#9ca3af' },
      emphasis: { iconStyle: { borderColor: '#60a5fa' } }
    };
    return option;
  }

  function _saveState(key, value) {
    try { localStorage.setItem('agent-charts:' + key, JSON.stringify(value)); } catch (e) {}
  }

  function _loadState(key, defaultValue) {
    try {
      var v = localStorage.getItem('agent-charts:' + key);
      if (v == null) return defaultValue;
      return JSON.parse(v);
    } catch (e) { return defaultValue; }
  }

  // ======================================================================
  // Cross-widget brush bus — pub/sub by model_id.
  // Subscribers register handlers via _brush.on(fn) and _brush.off(fn);
  // emitters call _brush.emit(modelId | null) on hover-in / hover-out.
  // Listeners re-render or dispatch ECharts highlight actions accordingly.
  // ======================================================================
  var _brush = (function() {
    var listeners = [];
    var current = null;
    return {
      on: function(fn) {
        if (typeof fn !== 'function') return;
        for (var i = 0; i < listeners.length; i++) if (listeners[i] === fn) return;
        listeners.push(fn);
      },
      off: function(fn) {
        for (var i = listeners.length - 1; i >= 0; i--) if (listeners[i] === fn) listeners.splice(i, 1);
      },
      emit: function(modelId) {
        if (current === modelId) return;
        current = modelId;
        for (var i = 0; i < listeners.length; i++) {
          try { listeners[i](modelId); } catch (e) {}
        }
      },
      current: function() { return current; }
    };
  })();

  // ======================================================================
  // Widget 1 — Cost vs Performance Scatter
  // X = $/1M output tokens (log scale), Y = composite Agent Score (0–100),
  // bubble color = class, size = coverage, Pareto frontier dashed line.
  // ======================================================================
  var EDGE_X_PLACEHOLDER = 0.01; // log-scale-friendly placeholder for free on-device

  // Mirrors Agent._compositeScores() — duplicated here because that helper is
  // not exported. Threshold ≥ 3 benchmarks; safety/asr-style benchmarks listed
  // in CATEGORIES[*].lower_better are inverted before averaging.
  function _composite() {
    if (!window.Agent || !Agent._allAgentBenchmarks || !window.App || !App.data || !App.data.scores) {
      return [];
    }
    var ids = Agent._allAgentBenchmarks();
    var cats = Agent._CATEGORIES || [];
    var lowerSet = {};
    for (var ci = 0; ci < cats.length; ci++) {
      var lb = cats[ci].lower_better || [];
      for (var lj = 0; lj < lb.length; lj++) lowerSet[lb[lj]] = true;
    }
    var maxes = {};
    for (var i = 0; i < ids.length; i++) {
      var rows = _scoresFor(ids[i]);
      var m = 0;
      for (var j = 0; j < rows.length; j++) {
        if (rows[j].value > m) m = rows[j].value;
      }
      maxes[ids[i]] = m;
    }
    var byModel = {};
    for (var k = 0; k < ids.length; k++) {
      var bid = ids[k];
      var maxV = maxes[bid];
      if (!maxV) continue;
      var lower = !!lowerSet[bid];
      var bRows = _scoresFor(bid);
      for (var r = 0; r < bRows.length; r++) {
        var v = bRows[r].value;
        var norm = lower ? (1 - v / maxV) * 100 : (v / maxV) * 100;
        var mid = bRows[r].model_id;
        if (!byModel[mid]) byModel[mid] = { sum: 0, count: 0 };
        byModel[mid].sum += norm;
        byModel[mid].count++;
      }
    }
    var arr = [];
    for (var midKey in byModel) {
      if (!Object.prototype.hasOwnProperty.call(byModel, midKey)) continue;
      if (byModel[midKey].count < 3) continue;
      arr.push({
        model_id: midKey,
        agent_score: byModel[midKey].sum / byModel[midKey].count,
        coverage: byModel[midKey].count
      });
    }
    return arr;
  }

  // Pareto-frontier filter: a point dominates another if it has strictly higher
  // score AND strictly lower cost. Frontier = points not dominated by anyone.
  // We treat lower X (cheaper) and higher Y (better) as the desirable corner.
  function _paretoFrontier(points) {
    var frontier = [];
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var dominated = false;
      for (var j = 0; j < points.length; j++) {
        if (i === j) continue;
        var q = points[j];
        if (q.cost <= p.cost && q.score >= p.score && (q.cost < p.cost || q.score > p.score)) {
          dominated = true;
          break;
        }
      }
      if (!dominated) frontier.push(p);
    }
    frontier.sort(function(a, b) { return a.cost - b.cost; });
    return frontier;
  }

  function renderCostScatter() {
    _ensureMountPoint('agent-chart-cost-scatter',
      'Cost vs Performance Scatter',
      'Composite Agent Score (Y) vs cost per 1M output tokens (X, log scale). Bubble color = class, size = coverage. Pareto frontier highlighted.');
    if (typeof echarts === 'undefined') return;

    // Pricing source: prefer App.data.pricing (already loaded by App.loadData);
    // fallback to a one-shot fetch cached on AgentCharts._pricingPromise.
    function getPricing() {
      if (window.App && App.data && App.data.pricing && Object.keys(App.data.pricing).length) {
        return Promise.resolve(App.data.pricing);
      }
      AgentCharts._pricingPromise = AgentCharts._pricingPromise || (function() {
        var base = (window.location.pathname.indexOf('/dashboard/') !== -1) ? '../data' : 'data';
        return fetch(base + '/aa_pricing.json')
          .then(function(r) { return r.ok ? r.json() : { models: [] }; })
          .catch(function() { return { models: [] }; })
          .then(function(d) {
            var pmap = {};
            var list = (d && d.models) || [];
            if (Array.isArray(list)) {
              for (var i = 0; i < list.length; i++) {
                var m = list[i];
                if (m && m.model_id) {
                  pmap[m.model_id] = {
                    input: m.price_per_1m_input,
                    output: m.price_per_1m_output
                  };
                }
              }
            } else {
              pmap = list;
            }
            return pmap;
          });
      })();
      return AgentCharts._pricingPromise;
    }

    getPricing().then(function(pricing) {
      var mountEl = document.getElementById('agent-chart-cost-scatter');
      if (!mountEl) return;

      var rows = _composite();
      // Build scatter points; split into priced vs edge-placeholder vs skipped.
      var priced = [];   // {cost, score, coverage, klass, model_id}
      var edge = [];
      var edgeSet = {};
      var es = (window.Agent && Agent._EDGE_SLMS) || [];
      for (var ei = 0; ei < es.length; ei++) edgeSet[es[ei]] = true;

      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var p = pricing[r.model_id];
        var outCost = p && (typeof p.output === 'number' ? p.output : p.price_per_1m_output);
        var klass = _modelClass(r.model_id);
        if (typeof outCost === 'number' && outCost > 0) {
          priced.push({
            cost: outCost,
            score: r.agent_score,
            coverage: r.coverage,
            klass: klass,
            model_id: r.model_id
          });
        } else if (edgeSet[r.model_id] || klass === 'edge-slm') {
          edge.push({
            cost: EDGE_X_PLACEHOLDER,
            score: r.agent_score,
            coverage: r.coverage,
            klass: 'edge-slm',
            model_id: r.model_id
          });
        }
        // else: subscription-only (Devin/Manus) or unpriced — skipped, per spec.
      }

      var allPoints = priced.concat(edge);

      // Empty state
      if (!allPoints.length) {
        // Clear any prior chart and replace with text.
        if (Charts && Charts._instances && Charts._instances['agent-chart-cost-scatter']) {
          try { Charts._instances['agent-chart-cost-scatter'].dispose(); } catch (e) {}
          delete Charts._instances['agent-chart-cost-scatter'];
        }
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Coverage too sparse for cost-scatter — re-run after Group D score sweep';
        mountEl.appendChild(msg);
        return;
      }

      var chart = Charts._getOrCreate('agent-chart-cost-scatter');
      if (!chart) return;

      function _bubble(p) {
        return {
          name: _modelDisplayName(p.model_id),
          value: [p.cost, p.score],
          itemStyle: { color: _classColor(p.klass), opacity: 0.85 },
          symbolSize: Math.min(30, 8 + p.coverage * 0.5),
          _meta: {
            model_id: p.model_id,
            vendor: _vendorOf(p.model_id),
            klass: p.klass,
            coverage: p.coverage,
            cost: p.cost,
            isEdgePlaceholder: p.cost === EDGE_X_PLACEHOLDER && p.klass === 'edge-slm'
          }
        };
      }

      function _classLabel(k) {
        if (k === 'agent-product') return 'Agent-Product';
        if (k === 'edge-slm') return 'Edge-SLM';
        return 'Frontier';
      }

      var frontierPts = _paretoFrontier(priced);
      var frontierLineData = frontierPts.map(function(p) { return [p.cost, p.score]; });
      var frontierIds = {};
      for (var fi = 0; fi < frontierPts.length; fi++) frontierIds[frontierPts[fi].model_id] = true;

      function _bubbleWithLabel(p) {
        var b = _bubble(p);
        if (frontierIds[p.model_id]) {
          b.label = {
            show: true,
            position: 'top',
            distance: 6,
            color: '#e5e7eb',
            backgroundColor: 'rgba(17,24,39,0.85)',
            borderColor: '#a78bfa',
            borderWidth: 1,
            borderRadius: 3,
            padding: [2, 4],
            fontSize: 10,
            formatter: _modelDisplayName(p.model_id)
          };
        }
        return b;
      }

      var series = [
        {
          name: 'Frontier',
          type: 'scatter',
          data: priced.filter(function(p) { return p.klass === 'frontier'; }).map(_bubbleWithLabel),
          emphasis: { focus: 'series' }
        },
        {
          name: 'Agent-Product',
          type: 'scatter',
          data: priced.filter(function(p) { return p.klass === 'agent-product'; }).map(_bubbleWithLabel),
          emphasis: { focus: 'series' }
        },
        {
          name: 'Edge-SLM',
          type: 'scatter',
          data: edge.map(_bubbleWithLabel),
          emphasis: { focus: 'series' }
        }
      ];

      if (frontierLineData.length >= 2) {
        series.push({
          name: 'Pareto frontier',
          type: 'line',
          data: frontierLineData,
          showSymbol: false,
          lineStyle: { type: 'dashed', color: '#a78bfa', width: 2 },
          tooltip: { show: false },
          z: 1,
          silent: true
        });
      }

      var opt = {
        backgroundColor: 'transparent',
        grid: { left: 60, right: 24, top: 30, bottom: 70 },
        legend: {
          bottom: 0,
          textStyle: { color: '#d1d5db' },
          data: ['Frontier', 'Agent-Product', 'Edge-SLM'].concat(frontierLineData.length >= 2 ? ['Pareto frontier'] : [])
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(17,24,39,0.95)',
          borderColor: '#374151',
          textStyle: { color: '#e5e7eb' },
          formatter: function(params) {
            if (params.seriesType === 'line') return '';
            var m = params.data && params.data._meta;
            if (!m) return params.name;
            var costStr = m.isEdgePlaceholder
              ? 'free (on-device, plotted at $' + EDGE_X_PLACEHOLDER.toFixed(2) + ')'
              : '$' + (m.cost < 1 ? m.cost.toFixed(3) : m.cost.toFixed(2)) + ' / 1M out';
            var lines = [
              '<b>' + params.name + '</b>',
              'vendor: ' + (m.vendor || '—'),
              'class: ' + _classLabel(m.klass),
              'agent score: ' + params.value[1].toFixed(1),
              'coverage: ' + m.coverage + ' benchmarks',
              'cost: ' + costStr
            ];
            return lines.join('<br>');
          }
        },
        xAxis: {
          type: 'log',
          name: '$ / 1M output tokens (log)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: { color: '#9ca3af' },
          axisLabel: {
            color: '#9ca3af',
            formatter: function(v) {
              if (v < 1) return '$' + v.toFixed(2);
              return '$' + v;
            }
          },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } },
          min: 0.005
        },
        yAxis: {
          type: 'value',
          name: 'Composite Agent Score',
          nameLocation: 'middle',
          nameGap: 42,
          nameTextStyle: { color: '#9ca3af' },
          min: 0,
          max: 100,
          axisLabel: { color: '#9ca3af' },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } }
        },
        series: series,
        graphic: edge.length ? [{
          type: 'text',
          left: 8,
          bottom: 24,
          style: {
            text: 'Edge SLMs plotted at $' + EDGE_X_PLACEHOLDER.toFixed(2) + ' placeholder (free on-device)',
            fill: '#9ca3af',
            fontSize: 10,
            fontStyle: 'italic'
          }
        }] : []
      };

      chart.setOption(_applyToolbox(opt), true);

      // Brush sync: highlight the matching bubble (across all 3 series) when a
      // leaderboard row is hovered. Reset on null. We rebuild the index map
      // each render to track current data, and unsubscribe the prior handler.
      var seriesIndex = {}; // model_id → {sIdx, dIdx}
      for (var sI = 0; sI < series.length; sI++) {
        var sData = series[sI].data || [];
        for (var dI = 0; dI < sData.length; dI++) {
          var meta = sData[dI] && sData[dI]._meta;
          if (meta && meta.model_id) seriesIndex[meta.model_id] = { sIdx: sI, dIdx: dI };
        }
      }
      if (chart._agentBrushHandler) _brush.off(chart._agentBrushHandler);
      chart._agentBrushHandler = function(modelId) {
        try {
          chart.dispatchAction({ type: 'downplay' });
          if (modelId && seriesIndex[modelId]) {
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: seriesIndex[modelId].sIdx,
              dataIndex: seriesIndex[modelId].dIdx
            });
          }
        } catch (e) {}
      };
      _brush.on(chart._agentBrushHandler);
    });
  }

  // ======================================================================
  // Widget 2 — Capability Heatmap (models × benchmarks)
  //
  // Rows: top 20 agents by coverage (≥ 3 of the 12 core benchmarks scored).
  //       Sort by coverage desc, tie-break by composite (mean of normalized).
  // Cols: 12-benchmark curated core set (higher-better only — agentdojo_utility
  //       is the "utility" direction so higher == better).
  // Cell value: value / max(benchmark) * 100, with `'-'` for missing pairs
  //       (ECharts heatmap convention).
  // Color scale: red (0) → yellow (50) → green (100), dark-friendly.
  // Click → Modal.showModel(modelId) for drilldown.
  // ======================================================================
  var _HEATMAP_BENCHMARKS = [
    'swe_bench_verified', 'swe_bench_pro', 'terminal_bench_2', 'osworld_verified',
    'gaia', 'tau2_bench', 'bfcl_v4', 'browsecomp', 'aider_polyglot', 'usaco',
    'mobile_actions', 'agentdojo_utility',
    // 2026-04-05 — Recent agent benchmark additions (Sections 36, 40, 43)
    'mcpmark', 'tau3_bench', 'prdbench',
    'corebench_hard', 'tau_bench_airline', 'assistantbench',
    'complexmcp', 'agentick', 'delegate_52'
  ];

  function _benchmarkShortName(bid) {
    var raw = bid;
    if (window.Agent && typeof window.Agent._benchmarkName === 'function') {
      raw = window.Agent._benchmarkName(bid) || bid;
    } else if (window.App && App.data && App.data.benchmarks) {
      var bs = App.data.benchmarks;
      if (Array.isArray(bs)) {
        for (var i = 0; i < bs.length; i++) {
          if (bs[i] && bs[i].id === bid) { raw = bs[i].name || bid; break; }
        }
      }
    }
    var s = String(raw);
    if (s.length > 22) s = s.slice(0, 20) + '…';
    return s;
  }

  function _classEmoji(klass) {
    if (klass === 'agent-product') return '🟧';
    if (klass === 'edge-slm') return '🟩';
    return '🟦';
  }

  function _emptyHeatmapMount(message) {
    var el = document.getElementById('agent-chart-heatmap');
    if (!el) return;
    if (Charts && Charts._instances && Charts._instances['agent-chart-heatmap']) {
      try { Charts._instances['agent-chart-heatmap'].dispose(); } catch (e) {}
      delete Charts._instances['agent-chart-heatmap'];
    }
    while (el.firstChild) el.removeChild(el.firstChild);
    var p = document.createElement('div');
    p.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
    p.textContent = message;
    el.appendChild(p);
  }

  function renderCapabilityHeatmap() {
    _ensureMountPoint('agent-chart-heatmap',
      'Capability Heatmap',
      'Top 20 agents (rows) × 12 core agentic benchmarks (cols). Cell color = normalized score 0–100.');
    if (typeof echarts === 'undefined') return;
    if (!(window.App && App.data && App.data.scores && App.data.models)) return;

    // 1. For each benchmark, gather all (model_id, value) and compute max.
    //    Build modelStats: { coverage, perBench: { bid: {value, norm} } }.
    var benchMax = {};
    var modelStats = {};
    var BSET = {};
    for (var b = 0; b < _HEATMAP_BENCHMARKS.length; b++) BSET[_HEATMAP_BENCHMARKS[b]] = true;

    var scores = App.data.scores;
    for (var i = 0; i < scores.length; i++) {
      var s = scores[i];
      if (!s || !BSET[s.benchmark_id]) continue;
      var v = (typeof s.value === 'number') ? s.value : null;
      if (v === null || isNaN(v)) continue;
      if (!(s.benchmark_id in benchMax) || v > benchMax[s.benchmark_id]) {
        benchMax[s.benchmark_id] = v;
      }
      if (!modelStats[s.model_id]) {
        modelStats[s.model_id] = { coverage: 0, perBench: {} };
      }
      var prev = modelStats[s.model_id].perBench[s.benchmark_id];
      if (!prev || v > prev.value) {
        modelStats[s.model_id].perBench[s.benchmark_id] = { value: v };
      }
    }

    var modelIds = Object.keys(modelStats);
    for (var m = 0; m < modelIds.length; m++) {
      modelStats[modelIds[m]].coverage = Object.keys(modelStats[modelIds[m]].perBench).length;
    }

    // 2. Coverage >= 3, then top 20 by coverage desc (composite tie-break).
    var eligible = [];
    for (var k = 0; k < modelIds.length; k++) {
      if (modelStats[modelIds[k]].coverage >= 3) eligible.push(modelIds[k]);
    }
    if (eligible.length < 5) {
      _emptyHeatmapMount(
        'Not enough coverage yet — need ≥5 models scored on ≥3 of the 12 core benchmarks. (' +
        eligible.length + ' eligible.)');
      return;
    }

    for (var n = 0; n < eligible.length; n++) {
      var midN = eligible[n];
      var pbN = modelStats[midN].perBench;
      var sumN = 0, cntN = 0;
      for (var bidN in pbN) {
        if (!Object.prototype.hasOwnProperty.call(pbN, bidN)) continue;
        var maxV = benchMax[bidN];
        if (!maxV || maxV <= 0) continue;
        var nrm = (pbN[bidN].value / maxV) * 100;
        pbN[bidN].norm = nrm;
        sumN += nrm;
        cntN += 1;
      }
      modelStats[midN].composite = cntN ? sumN / cntN : 0;
    }

    eligible.sort(function(a, bb) {
      var ca = modelStats[a].coverage, cb = modelStats[bb].coverage;
      if (cb !== ca) return cb - ca;
      return modelStats[bb].composite - modelStats[a].composite;
    });
    var topModels = eligible.slice(0, 20);

    // 3. ECharts y-axis renders bottom-up, so reverse so top-coverage sits at
    //    the top of the y-axis. Fill `'-'` for missing cells per the spec.
    var rowOrder = topModels.slice().reverse();
    var data = [];
    var rawByCell = {};
    for (var r = 0; r < rowOrder.length; r++) {
      var rid = rowOrder[r];
      var pbR = modelStats[rid].perBench;
      for (var c = 0; c < _HEATMAP_BENCHMARKS.length; c++) {
        var bidC = _HEATMAP_BENCHMARKS[c];
        var cell = pbR[bidC];
        if (cell && typeof cell.norm === 'number') {
          var roundedNorm = Math.round(cell.norm * 10) / 10;
          data.push([c, r, roundedNorm]);
          rawByCell[c + ':' + r] = { raw: cell.value, modelId: rid, benchmarkId: bidC };
        } else {
          data.push([c, r, '-']);
        }
      }
    }

    // 4. Axis labels.
    var xLabels = _HEATMAP_BENCHMARKS.map(function(bid) { return _benchmarkShortName(bid); });
    var yLabels = rowOrder.map(function(mid) {
      return _classEmoji(_modelClass(mid)) + ' ' + _modelDisplayName(mid);
    });

    var chart = Charts._getOrCreate('agent-chart-heatmap');
    if (!chart) return;

    var option = {
      backgroundColor: 'transparent',
      grid: { left: 200, right: 30, top: 30, bottom: 90, containLabel: false },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb', fontSize: 12 },
        formatter: function(p) {
          if (!p || !p.value) return '';
          var col = p.value[0], row = p.value[1], norm = p.value[2];
          var rid = rowOrder[row];
          var bid = _HEATMAP_BENCHMARKS[col];
          var meta = rawByCell[col + ':' + row];
          var klass = _modelClass(rid);
          var klassLabel = klass === 'agent-product' ? 'Agent-Product'
                         : klass === 'edge-slm' ? 'Edge-SLM' : 'Frontier';
          var nameLine = '<b>' + _modelDisplayName(rid) + '</b>' +
            ' <span style="color:#9ca3af">(' + klassLabel + ')</span>';
          var benchLine = _benchmarkShortName(bid);
          if (norm === '-' || !meta) {
            return nameLine + '<br>' + benchLine + '<br><span style="color:#6b7280">No score</span>';
          }
          var rawDisplay = (meta.raw > 500) ? Math.round(meta.raw) : (Math.round(meta.raw * 100) / 100);
          return nameLine + '<br>' + benchLine +
                 '<br>Normalized: <b>' + norm + '</b> / 100' +
                 '<br>Raw: ' + rawDisplay;
        }
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { rotate: 30, fontSize: 10, color: '#d1d5db', interval: 0 },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 10, color: '#d1d5db' },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      visualMap: {
        min: 0, max: 100, calculable: true,
        orient: 'horizontal', left: 'center', bottom: 8,
        inRange: { color: ['#7f1d1d', '#dc2626', '#f59e0b', '#fde047', '#84cc16', '#16a34a'] },
        textStyle: { color: '#9ca3af', fontSize: 10 },
        text: ['100', '0']
      },
      series: [{
        name: 'Capability',
        type: 'heatmap',
        data: data,
        label: {
          show: true, fontSize: 9, color: '#0f172a', fontWeight: 600,
          formatter: function(p) {
            if (!p || !p.value || p.value[2] === '-') return '';
            return p.value[2];
          }
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff', borderWidth: 1,
            shadowBlur: 8, shadowColor: 'rgba(96, 165, 250, 0.5)'
          }
        },
        progressive: 0
      }]
    };

    chart.setOption(_applyToolbox(option), true);

    chart.off('click');
    chart.on('click', function(p) {
      if (!p || !p.value) return;
      var rIdx = p.value[1];
      var rid = rowOrder[rIdx];
      if (rid && window.Modal && typeof Modal.showModel === 'function') {
        Modal.showModel(rid);
      }
    });
  }

  // ======================================================================
  // Widget 3 — Per-category Radar (interactive agent picker)
  // State persists across re-renders so toggles survive ECharts dispose.
  // ======================================================================
  var _radarState = _loadState('radar-state', { categoryKey: 'coding', selectedAgents: null });
  var MAX_RADAR_AGENTS = 5;

  function renderCategoryRadar() {
    var section = _ensureMountPoint('agent-chart-radar',
      'Category Radar',
      'Per-category capability profile. Pick a category and up to 5 agents to overlay polygons.');
    if (!section) return;

    var canvasDiv = section.querySelector('#agent-chart-radar');
    if (!canvasDiv) return;

    var controls = section.querySelector('[data-radar-controls]');
    if (!controls) {
      controls = document.createElement('div');
      controls.dataset.radarControls = '1';
      controls.className = 'mb-3 text-xs text-gray-300 space-y-2';

      // Row 1: category select
      var rowCat = document.createElement('div');
      rowCat.className = 'flex items-center gap-2 flex-wrap';
      var labelCat = document.createElement('label');
      labelCat.className = 'text-gray-400';
      labelCat.textContent = 'Category:';
      rowCat.appendChild(labelCat);

      var sel = document.createElement('select');
      sel.dataset.radarCategorySelect = '1';
      sel.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100';
      var cats = (window.Agent && Agent._CATEGORIES) ? Agent._CATEGORIES : [];
      for (var i = 0; i < cats.length; i++) {
        var opt = document.createElement('option');
        opt.value = cats[i].key;
        opt.textContent = (cats[i].icon ? cats[i].icon + ' ' : '') + cats[i].label;
        sel.appendChild(opt);
      }
      sel.addEventListener('change', function() {
        _radarState.categoryKey = this.value;
        _radarState.selectedAgents = null; // reset → defaults will repopulate
        _refreshRadarControls(controls);
        _saveState('radar-state', _radarState);
        _drawRadar();
      });
      rowCat.appendChild(sel);
      controls.appendChild(rowCat);

      // Row 2: agent checkbox container — populated by _refreshRadarControls
      var rowAgents = document.createElement('div');
      rowAgents.dataset.radarAgentList = '1';
      rowAgents.className = 'flex items-center gap-3 flex-wrap';
      controls.appendChild(rowAgents);

      // Row 3: status / hint
      var status = document.createElement('div');
      status.dataset.radarStatus = '1';
      status.className = 'text-gray-500';
      controls.appendChild(status);

      section.insertBefore(controls, canvasDiv);
    }

    _refreshRadarControls(controls);
    _drawRadar();
  }

  function _refreshRadarControls(controls) {
    if (!controls) return;
    var sel = controls.querySelector('[data-radar-category-select]');
    if (sel && sel.value !== _radarState.categoryKey) {
      sel.value = _radarState.categoryKey;
    }

    var cat = _categoryByKey(_radarState.categoryKey);
    var coverage = _categoryCoverage(cat);
    var top8 = coverage.slice(0, 8);

    // Initialize defaults: top 3 by coverage on first render for this category.
    if (!_radarState.selectedAgents) {
      _radarState.selectedAgents = top8.slice(0, 3).map(function(x) { return x.model_id; });
    } else {
      // Drop any selected agents that aren't in top8 anymore (after category change).
      var validIds = {};
      for (var i = 0; i < top8.length; i++) validIds[top8[i].model_id] = true;
      _radarState.selectedAgents = _radarState.selectedAgents.filter(function(id) {
        return validIds[id];
      });
    }

    var list = controls.querySelector('[data-radar-agent-list]');
    if (!list) return;
    while (list.firstChild) list.removeChild(list.firstChild);

    if (!top8.length) {
      var none = document.createElement('span');
      none.className = 'text-gray-500 italic';
      none.textContent = 'No agents have scores in this category yet.';
      list.appendChild(none);
    }

    for (var k = 0; k < top8.length; k++) {
      var mid = top8[k].model_id;
      var label = document.createElement('label');
      label.className = 'inline-flex items-center gap-1 cursor-pointer';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = mid;
      cb.className = 'accent-blue-400';
      cb.checked = _radarState.selectedAgents.indexOf(mid) !== -1;
      cb.addEventListener('change', _onRadarAgentToggle);
      label.appendChild(cb);

      var dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '50%';
      dot.style.background = _classColor(_modelClass(mid));
      label.appendChild(dot);

      var nm = document.createElement('span');
      nm.className = 'text-gray-200';
      nm.textContent = _modelDisplayName(mid);
      label.appendChild(nm);

      var cov = document.createElement('span');
      cov.className = 'text-gray-500';
      cov.textContent = '(' + top8[k].coverage + ')';
      label.appendChild(cov);

      list.appendChild(label);
    }

    var status = controls.querySelector('[data-radar-status]');
    if (status) {
      status.textContent = 'Selected ' + _radarState.selectedAgents.length + ' / ' + MAX_RADAR_AGENTS +
                           ' (top 8 by coverage shown). Values normalized 0–100 per benchmark.';
    }
  }

  function _onRadarAgentToggle(e) {
    var mid = e.target.value;
    var idx = _radarState.selectedAgents.indexOf(mid);
    if (e.target.checked) {
      if (idx === -1) {
        if (_radarState.selectedAgents.length >= MAX_RADAR_AGENTS) {
          e.target.checked = false;
          return;
        }
        _radarState.selectedAgents.push(mid);
      }
    } else if (idx !== -1) {
      _radarState.selectedAgents.splice(idx, 1);
    }
    _saveState('radar-state', _radarState);
    var section = document.getElementById('agent-chart-radar-section');
    if (section) {
      var controls = section.querySelector('[data-radar-controls]');
      if (controls) _refreshRadarControls(controls);
    }
    _drawRadar();
  }

  function _drawRadar() {
    if (typeof echarts === 'undefined' || !window.Charts) return;
    var chart = Charts._getOrCreate('agent-chart-radar');
    if (!chart) return;

    var cat = _categoryByKey(_radarState.categoryKey);
    if (!cat) { chart.setOption({}, true); return; }

    // Only include benchmarks where at least one model has a score.
    var benchIds = [];
    for (var i = 0; i < (cat.benchmarks || []).length; i++) {
      var bid = cat.benchmarks[i];
      if (_scoresFor(bid).some(function(r) { return typeof r.value === 'number'; })) {
        benchIds.push(bid);
      }
    }

    if (benchIds.length < 3) {
      // Radar chart needs at least 3 axes — fall back to a friendly message.
      chart.setOption({
        title: {
          text: 'Need at least 3 benchmarks with scores in this category.',
          left: 'center', top: 'middle',
          textStyle: { color: '#9ca3af', fontSize: 12, fontWeight: 'normal' }
        }
      }, true);
      return;
    }

    var indicator = benchIds.map(function(b) {
      return { name: _benchmarkLabel(b), max: 100 };
    });

    var selected = _radarState.selectedAgents || [];
    var rawByAgent = {};
    var seriesData = selected.map(function(mid) {
      var raw = [];
      var norm = benchIds.map(function(bid) {
        var n = _normalizedScore(mid, bid, cat);
        // Pull raw value too for tooltip
        var rows = _scoresFor(bid);
        var rawV = null;
        for (var r = 0; r < rows.length; r++) {
          if (rows[r].model_id === mid && typeof rows[r].value === 'number') {
            rawV = rows[r].value; break;
          }
        }
        raw.push(rawV);
        return n === null ? 0 : n;
      });
      rawByAgent[mid] = raw;
      var color = _classColor(_modelClass(mid));
      return {
        name: _modelDisplayName(mid),
        modelId: mid,
        value: norm,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: color, width: 2 },
        areaStyle: { color: color, opacity: 0.18 },
        itemStyle: { color: color }
      };
    });

    chart.setOption(_applyToolbox({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: function(p) {
          if (!p || !p.value) return '';
          var mid = p.data && p.data.modelId;
          var raw = mid ? rawByAgent[mid] : null;
          var lines = ['<b>' + p.name + '</b>'];
          for (var i = 0; i < benchIds.length; i++) {
            var n = p.value[i];
            var nDisp = (typeof n === 'number') ? n.toFixed(1) : '–';
            var r = raw ? raw[i] : null;
            var rDisp = (typeof r === 'number') ? (r > 500 ? Math.round(r) : r.toFixed(2)) : '–';
            lines.push(_benchmarkLabel(benchIds[i]) + ': ' + rDisp + ' (norm ' + nDisp + ')');
          }
          return lines.join('<br>');
        }
      },
      legend: {
        bottom: 0,
        type: 'scroll',
        textStyle: { color: '#d1d5db', fontSize: 11 },
        data: seriesData.map(function(s) { return s.name; })
      },
      radar: {
        indicator: indicator,
        shape: 'polygon',
        splitNumber: 4,
        axisName: { color: '#d1d5db', fontSize: 11 },
        splitLine: { lineStyle: { color: 'rgba(75,85,99,0.5)' } },
        splitArea: { areaStyle: { color: ['rgba(31,41,55,0.3)', 'rgba(17,24,39,0.3)'] } },
        axisLine: { lineStyle: { color: 'rgba(75,85,99,0.5)' } }
      },
      series: [{
        type: 'radar',
        emphasis: { focus: 'series' },
        data: seriesData
      }]
    }), true);
  }

  // ======================================================================
  // Widget 4 — Frontier-Product-Edge Diverging Dot Plot
  // ======================================================================
  // Curated 10-benchmark list shared by Widgets 4 and 6.
  var DOT_PLOT_BENCHMARKS = [
    'swe_bench_verified', 'swe_bench_pro', 'terminal_bench_2', 'osworld_verified',
    'gaia', 'tau2_bench', 'bfcl_v4', 'browsecomp', 'aider_polyglot', 'mobile_actions'
  ];

  function _classLabelLong(k) {
    if (k === 'agent-product') return 'Agent-Product';
    if (k === 'edge-slm') return 'Edge-SLM';
    return 'Frontier';
  }

  // Strip parenthetical / country / comma suffix from vendor strings so
  // "Google (USA)", "Google DeepMind (USA/UK)", "Alibaba (Qwen)" all collapse
  // to a sensible canonical key while keeping "Google DeepMind" distinct
  // from "Google".
  function _canonVendor(v) {
    if (!v) return '';
    var s = String(v);
    var cut = s.length;
    var paren = s.indexOf('(');
    var comma = s.indexOf(',');
    if (paren >= 0 && paren < cut) cut = paren;
    if (comma >= 0 && comma < cut) cut = comma;
    return s.substring(0, cut).trim();
  }

  function renderClassDotPlot() {
    _ensureMountPoint('agent-chart-classplot',
      'Frontier vs Agent-Product vs Edge — per benchmark',
      'For each benchmark, shows the best Frontier / Agent-Product / Edge score. Connecting line visualizes the "scaffolding tax" / "edge gap".');
    if (typeof echarts === 'undefined') return;
    var chart = Charts._getOrCreate('agent-chart-classplot');
    if (!chart) return;

    // Aggregate: per benchmark, best score per class.
    var rows = [];
    for (var i = 0; i < DOT_PLOT_BENCHMARKS.length; i++) {
      var bid = DOT_PLOT_BENCHMARKS[i];
      var scores = _scoresFor(bid);
      var byClass = { 'frontier': null, 'agent-product': null, 'edge-slm': null };
      for (var j = 0; j < scores.length; j++) {
        var s = scores[j];
        var v = (typeof s.value === 'number') ? s.value : parseFloat(s.value);
        if (!isFinite(v)) continue;
        var k = _modelClass(s.model_id);
        if (!byClass[k] || v > byClass[k]._v) {
          byClass[k] = { model_id: s.model_id, _v: v };
        }
      }
      rows.push({ bid: bid, byClass: byClass, label: _benchmarkLabel(bid) });
    }

    var yLabels = rows.map(function(r) { return r.label; });

    var frontierData = [];
    var productData = [];
    var edgeData = [];
    var lineSegments = [];

    for (var rIdx = 0; rIdx < rows.length; rIdx++) {
      var row = rows[rIdx];
      var pts = [];
      if (row.byClass['frontier']) {
        var f = row.byClass['frontier'];
        frontierData.push({ value: [f._v, rIdx], modelId: f.model_id, klass: 'frontier', bid: row.bid });
        pts.push(f._v);
      }
      if (row.byClass['agent-product']) {
        var pr = row.byClass['agent-product'];
        productData.push({ value: [pr._v, rIdx], modelId: pr.model_id, klass: 'agent-product', bid: row.bid });
        pts.push(pr._v);
      }
      if (row.byClass['edge-slm']) {
        var ed = row.byClass['edge-slm'];
        edgeData.push({ value: [ed._v, rIdx], modelId: ed.model_id, klass: 'edge-slm', bid: row.bid });
        pts.push(ed._v);
      }
      if (pts.length >= 2) {
        pts.sort(function(a, b) { return a - b; });
        lineSegments.push([
          { coord: [pts[0], rIdx] },
          { coord: [pts[pts.length - 1], rIdx] }
        ]);
      }
    }

    function _tooltip(p) {
      if (!p || !p.data) return '';
      var d = p.data;
      if (!d.modelId) return '';
      var v = d.value && d.value[0];
      var name = _modelDisplayName(d.modelId);
      var bench = _benchmarkLabel(d.bid);
      return '<div style="font-size:11px;line-height:1.5"><b>' + _classLabelLong(d.klass) + '</b><br>'
           + name + '<br>'
           + bench + ': <b>' + (Math.round(v * 10) / 10) + '</b></div>';
    }

    chart.setOption(_applyToolbox({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: _tooltip
      },
      legend: {
        top: 4,
        textStyle: { color: '#d1d5db', fontSize: 11 },
        data: [
          { name: 'Frontier',      icon: 'circle', itemStyle: { color: _classColor('frontier') } },
          { name: 'Agent-Product', icon: 'circle', itemStyle: { color: _classColor('agent-product') } },
          { name: 'Edge-SLM',      icon: 'circle', itemStyle: { color: _classColor('edge-slm') } }
        ]
      },
      grid: { left: 200, right: 32, top: 40, bottom: 50 },
      xAxis: {
        type: 'value',
        min: 0, max: 100,
        name: 'Score',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: '#9ca3af', fontSize: 11 },
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } }
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        inverse: true,
        axisLabel: { color: '#d1d5db', fontSize: 11 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#1f2937', type: 'dashed' } }
      },
      series: [
        {
          name: 'connector',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          silent: true,
          lineStyle: { color: '#475569', width: 1.5, opacity: 0.6 },
          data: lineSegments,
          z: 1
        },
        {
          name: 'Frontier',
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: { color: _classColor('frontier'), borderColor: '#0f172a', borderWidth: 1 },
          data: frontierData,
          z: 3
        },
        {
          name: 'Agent-Product',
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: { color: _classColor('agent-product'), borderColor: '#0f172a', borderWidth: 1 },
          data: productData,
          z: 3
        },
        {
          name: 'Edge-SLM',
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: { color: _classColor('edge-slm'), borderColor: '#0f172a', borderWidth: 1 },
          data: edgeData,
          z: 3
        }
      ]
    }), true);
  }

  // ======================================================================
  // Shared infrastructure for Widgets 5 + 8.
  // Curated 9-benchmark agentic list — used as the dropdown options.
  // ======================================================================
  var AGENTIC_BENCHMARKS = [
    'swe_bench_verified',
    'swe_bench_pro',
    'terminal_bench_2',
    'osworld_verified',
    'gaia',
    'tau2_bench',
    'bfcl_v4',
    'browsecomp',
    'mobile_actions'
  ];

  function _historyBase() {
    return (window.location.pathname.indexOf('/dashboard/') !== -1) ? '../data' : 'data';
  }

  // Cache: index promise + per-date snapshot promises keyed by date string.
  var _historyCache = { indexPromise: null, snapshots: {} };

  function _loadHistoryIndex() {
    if (_historyCache.indexPromise) return _historyCache.indexPromise;
    var url = _historyBase() + '/scores/history/index.json';
    _historyCache.indexPromise = fetch(url)
      .then(function(r) { return r.ok ? r.json() : { dates: [] }; })
      .catch(function() { return { dates: [] }; });
    return _historyCache.indexPromise;
  }

  function _loadSnapshot(date) {
    if (_historyCache.snapshots[date]) return _historyCache.snapshots[date];
    var url = _historyBase() + '/scores/history/' + date + '.json';
    _historyCache.snapshots[date] = fetch(url)
      .then(function(r) { return r.ok ? r.json() : []; })
      .catch(function() { return []; });
    return _historyCache.snapshots[date];
  }

  // Stable color hash for SOTA-holder bands.
  function _modelBandColor(modelId) {
    var palette = [
      '#60a5fa', '#fbbf24', '#34d399', '#f472b6', '#a78bfa',
      '#fb7185', '#22d3ee', '#facc15', '#4ade80', '#c084fc',
      '#fb923c', '#2dd4bf'
    ];
    var h = 0;
    var s = modelId || '';
    for (var i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return palette[h % palette.length];
  }

  function _emptyStateMessage(mountEl, message) {
    if (window.Charts && Charts._instances && Charts._instances[mountEl.id]) {
      try { Charts._instances[mountEl.id].dispose(); } catch (e) {}
      delete Charts._instances[mountEl.id];
    }
    while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    var msg = document.createElement('div');
    msg.className = 'text-sm text-gray-400 italic flex items-center justify-center';
    msg.style.height = '100%';
    msg.textContent = message;
    mountEl.appendChild(msg);
  }

  function _ensureBenchmarkSelect(section, idPrefix, defaultBid, onChange) {
    var controlsId = idPrefix + '-controls';
    if (document.getElementById(controlsId)) return;
    var wrap = document.createElement('div');
    wrap.id = controlsId;
    wrap.className = 'mb-3 flex items-center gap-2 flex-wrap text-xs text-gray-300';

    var label = document.createElement('label');
    label.className = 'text-gray-400';
    label.textContent = 'Benchmark:';
    label.htmlFor = idPrefix + '-select';
    wrap.appendChild(label);

    var select = document.createElement('select');
    select.id = idPrefix + '-select';
    select.className = 'bg-gray-800 border border-gray-700 text-gray-100 rounded px-2 py-1';
    for (var i = 0; i < AGENTIC_BENCHMARKS.length; i++) {
      var opt = document.createElement('option');
      opt.value = AGENTIC_BENCHMARKS[i];
      opt.textContent = _benchmarkLabel(AGENTIC_BENCHMARKS[i]);
      if (AGENTIC_BENCHMARKS[i] === defaultBid) opt.selected = true;
      select.appendChild(opt);
    }
    select.addEventListener('change', function() { onChange(select.value); });
    wrap.appendChild(select);

    var chartDiv = document.getElementById(idPrefix);
    if (chartDiv && chartDiv.parentNode === section) {
      section.insertBefore(wrap, chartDiv);
    } else {
      section.appendChild(wrap);
    }
  }

  // ======================================================================
  // Widget 5 — SOTA Timeline / Handover Log (per benchmark)
  // ======================================================================
  function _drawSOTATimeline(bid) {
    var mountEl = document.getElementById('agent-chart-sota-timeline');
    if (!mountEl) return;
    if (typeof echarts === 'undefined') return;

    _loadHistoryIndex().then(function(idx) {
      var dates = (idx && idx.dates) || [];
      if (dates.length < 2) {
        _emptyStateMessage(mountEl, 'Not enough history snapshots — need at least 2 days of data.');
        return;
      }
      Promise.all(dates.map(_loadSnapshot)).then(function(snapshots) {
        // Per-date: max value on the chosen benchmark + the model that owns it.
        var dailyBest = [];
        for (var i = 0; i < dates.length; i++) {
          var rows = snapshots[i] || [];
          var bestVal = -Infinity;
          var bestMid = null;
          for (var j = 0; j < rows.length; j++) {
            var r = rows[j];
            if (r && r.benchmark_id === bid && typeof r.value === 'number') {
              if (r.value > bestVal) {
                bestVal = r.value;
                bestMid = r.model_id;
              }
            }
          }
          if (bestMid !== null) {
            dailyBest.push({ date: dates[i], value: bestVal, model_id: bestMid });
          }
        }

        if (dailyBest.length < 2) {
          _emptyStateMessage(mountEl, 'Not enough history snapshots — need at least 2 days of data.');
          return;
        }

        // Running SOTA — never decreases. Carry the previous holder forward
        // when a snapshot lacks a higher score.
        var sota = [];
        var bestSoFar = -Infinity;
        var bestHolder = null;
        for (var p = 0; p < dailyBest.length; p++) {
          if (dailyBest[p].value > bestSoFar) {
            bestSoFar = dailyBest[p].value;
            bestHolder = dailyBest[p].model_id;
          }
          sota.push({ date: dailyBest[p].date, value: bestSoFar, model_id: bestHolder });
        }

        // Group consecutive same-holder points into colored segments.
        var segments = [];
        var current = null;
        for (var k = 0; k < sota.length; k++) {
          var s = sota[k];
          if (!current || current.model_id !== s.model_id) {
            if (current) {
              // Bridge to the new date for visual continuity.
              current.points.push([s.date, current.points[current.points.length - 1][1]]);
              segments.push(current);
            }
            current = { model_id: s.model_id, points: [[s.date, s.value]] };
          } else {
            current.points.push([s.date, s.value]);
          }
        }
        if (current) segments.push(current);

        // Handover annotation markers — first point of each segment past 0.
        var handovers = [];
        for (var sIdx = 1; sIdx < segments.length; sIdx++) {
          var seg = segments[sIdx];
          handovers.push({
            value: seg.points[0],
            name: _modelDisplayName(seg.model_id),
            itemStyle: { color: _modelBandColor(seg.model_id) }
          });
        }

        var legendData = [];
        var seenLegend = {};
        var series = [];
        for (var s2 = 0; s2 < segments.length; s2++) {
          var sg = segments[s2];
          var nm = _modelDisplayName(sg.model_id);
          if (!seenLegend[nm]) {
            legendData.push(nm);
            seenLegend[nm] = true;
          }
          series.push({
            name: nm,
            type: 'line',
            step: 'end',
            showSymbol: true,
            symbolSize: 6,
            data: sg.points,
            lineStyle: { color: _modelBandColor(sg.model_id), width: 2.5 },
            itemStyle: { color: _modelBandColor(sg.model_id) },
            emphasis: { focus: 'series' }
          });
        }

        if (handovers.length) {
          series.push({
            name: 'Handover',
            type: 'scatter',
            data: handovers.map(function(h) {
              return {
                value: h.value,
                name: h.name,
                itemStyle: h.itemStyle,
                symbolSize: 14,
                label: {
                  show: true,
                  position: 'top',
                  formatter: h.name,
                  color: '#e5e7eb',
                  fontSize: 10,
                  backgroundColor: 'rgba(17,24,39,0.85)',
                  padding: [2, 4],
                  borderRadius: 3
                }
              };
            }),
            z: 5
          });
        }

        // If a previous render left a placeholder text node behind, clear it
        // so ECharts.init can take over the empty div.
        if (!Charts._instances || !Charts._instances['agent-chart-sota-timeline']) {
          while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        }
        var chart = Charts._getOrCreate('agent-chart-sota-timeline');
        if (!chart) return;

        chart.setOption(_applyToolbox({
          backgroundColor: 'transparent',
          grid: { left: 64, right: 24, top: 40, bottom: 70 },
          legend: {
            bottom: 0,
            type: 'scroll',
            textStyle: { color: '#d1d5db' },
            data: legendData
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(17,24,39,0.95)',
            borderColor: '#374151',
            textStyle: { color: '#e5e7eb' },
            formatter: function(params) {
              if (!params || !params.length) return '';
              var lines = ['<b>' + params[0].axisValue + '</b>'];
              for (var i = 0; i < params.length; i++) {
                var pp = params[i];
                if (pp.seriesName === 'Handover') continue;
                var v = pp.value && pp.value[1];
                if (v === undefined || v === null) continue;
                lines.push(pp.marker + pp.seriesName + ': ' + (typeof v === 'number' ? v.toFixed(1) : v));
              }
              return lines.join('<br>');
            }
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { color: '#9ca3af', rotate: 30 },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { show: false }
          },
          yAxis: {
            type: 'value',
            name: 'SOTA score (' + _benchmarkLabel(bid) + ')',
            nameLocation: 'middle',
            nameGap: 46,
            nameTextStyle: { color: '#9ca3af' },
            axisLabel: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#1f2937' } }
          },
          series: series
        }), true);
      });
    });
  }

  function renderSOTATimeline() {
    var section = _ensureMountPoint('agent-chart-sota-timeline',
      'SOTA Timeline (Agent benchmarks)',
      'Step plot of SOTA holder over time on a selected agentic benchmark. Drawn from data/scores/history snapshots.');
    if (!section) return;
    var savedBid = _loadState('sota-timeline-bid', 'swe_bench_verified');
    _ensureBenchmarkSelect(section, 'agent-chart-sota-timeline', savedBid,
      function(newBid) {
        _saveState('sota-timeline-bid', newBid);
        _drawSOTATimeline(newBid);
      });
    var sel = document.getElementById('agent-chart-sota-timeline-select');
    var bid = (sel && sel.value) || savedBid;
    _drawSOTATimeline(bid);
  }

  // ======================================================================
  // Widget 6 — Vendor × Benchmark Bubble Matrix
  // ======================================================================
  function renderVendorMatrix() {
    _ensureMountPoint('agent-chart-vendor-matrix',
      'Vendor × Benchmark Matrix',
      'Bubble size = vendor\'s top score on that benchmark. Quick visual scan for which vendor dominates which axis.');
    if (typeof echarts === 'undefined') return;
    var chart = Charts._getOrCreate('agent-chart-vendor-matrix');
    if (!chart) return;

    var benches = DOT_PLOT_BENCHMARKS;

    // Pass 1: count agentic-score occurrences per canonical vendor across the
    // 10 curated benchmarks → use this to pick the top 12 vendor rows.
    var vendorCounts = {};
    for (var bi = 0; bi < benches.length; bi++) {
      var rows = _scoresFor(benches[bi]);
      for (var ri = 0; ri < rows.length; ri++) {
        var raw = _vendorOf(rows[ri].model_id);
        var canon = _canonVendor(raw);
        if (!canon) continue;
        vendorCounts[canon] = (vendorCounts[canon] || 0) + 1;
      }
    }
    var vendorList = [];
    for (var v in vendorCounts) {
      if (Object.prototype.hasOwnProperty.call(vendorCounts, v)) {
        vendorList.push({ vendor: v, count: vendorCounts[v] });
      }
    }
    vendorList.sort(function(a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.vendor.localeCompare(b.vendor);
    });
    var topVendors = vendorList.slice(0, 12).map(function(x) { return x.vendor; });
    if (!topVendors.length) {
      // Empty state — clear chart and return.
      chart.setOption({
        title: {
          text: 'No agentic scores available yet for the curated benchmark set.',
          left: 'center', top: 'middle',
          textStyle: { color: '#9ca3af', fontSize: 12, fontWeight: 'normal' }
        }
      }, true);
      return;
    }
    var vendorIndex = {};
    for (var vi = 0; vi < topVendors.length; vi++) vendorIndex[topVendors[vi]] = vi;

    // Pass 2: for each (vendor, benchmark) cell, find the vendor's best score
    // and which model achieved it.
    // bestCell[bIdx + ',' + vIdx] = { value, model_id }
    var bubbleData = [];
    var minVal = Infinity;
    var maxVal = -Infinity;

    for (var bIdx = 0; bIdx < benches.length; bIdx++) {
      var bid = benches[bIdx];
      var sRows = _scoresFor(bid);
      var bestForCell = {}; // vIdx -> {value, model_id}
      for (var sIdx = 0; sIdx < sRows.length; sIdx++) {
        var s = sRows[sIdx];
        var canonV = _canonVendor(_vendorOf(s.model_id));
        if (!(canonV in vendorIndex)) continue;
        var val = (typeof s.value === 'number') ? s.value : parseFloat(s.value);
        if (!isFinite(val)) continue;
        var slot = vendorIndex[canonV];
        if (!bestForCell[slot] || val > bestForCell[slot].value) {
          bestForCell[slot] = { value: val, model_id: s.model_id };
        }
      }
      for (var slotKey in bestForCell) {
        if (!Object.prototype.hasOwnProperty.call(bestForCell, slotKey)) continue;
        var entry = bestForCell[slotKey];
        if (entry.value < minVal) minVal = entry.value;
        if (entry.value > maxVal) maxVal = entry.value;
        bubbleData.push({
          // ECharts cartesian: [xIndex, yIndex, sizeValue]
          value: [bIdx, parseInt(slotKey, 10), entry.value],
          modelId: entry.model_id,
          vendor: topVendors[parseInt(slotKey, 10)],
          bid: bid
        });
      }
    }

    if (!isFinite(minVal)) { minVal = 0; maxVal = 100; }

    var xLabels = benches.map(function(b) { return _benchmarkLabel(b); });

    // Viridis-like dark scale (low → high).
    var VIRIDIS = ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'];

    function _tooltip(p) {
      if (!p || !p.data) return '';
      var d = p.data;
      var modelName = _modelDisplayName(d.modelId);
      var bench = _benchmarkLabel(d.bid);
      var val = d.value[2];
      return '<div style="font-size:11px;line-height:1.5">'
           + '<b>' + d.vendor + '</b><br>'
           + bench + ': <b>' + (Math.round(val * 10) / 10) + '</b><br>'
           + 'best: ' + modelName + '</div>';
    }

    chart.setOption(_applyToolbox({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: _tooltip
      },
      grid: { left: 160, right: 80, top: 60, bottom: 80 },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: { color: '#d1d5db', fontSize: 10, rotate: 35, interval: 0 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#1f2937', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: topVendors,
        inverse: true,
        axisLabel: { color: '#d1d5db', fontSize: 11 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#1f2937', type: 'dashed' } }
      },
      visualMap: {
        min: Math.floor(minVal),
        max: Math.ceil(maxVal),
        dimension: 2,
        orient: 'vertical',
        right: 10,
        top: 'middle',
        calculable: true,
        textStyle: { color: '#d1d5db', fontSize: 10 },
        inRange: { color: VIRIDIS },
        text: ['high', 'low']
      },
      series: [{
        name: 'Vendor best',
        type: 'scatter',
        symbol: 'circle',
        data: bubbleData,
        symbolSize: function(val) {
          // val = [xIdx, yIdx, score]
          var s = (val && val.length >= 3) ? val[2] : 0;
          return Math.min(30, 8 + s / 4);
        },
        itemStyle: { borderColor: 'rgba(15,23,42,0.7)', borderWidth: 1 },
        emphasis: {
          focus: 'self',
          itemStyle: { borderColor: '#f8fafc', borderWidth: 2 }
        }
      }]
    }), true);
  }

  // ======================================================================
  // Widget 7 — Capability Fingerprint (mini-radar in leaderboard rows)
  // Hooks the rendered leaderboard table; appends a 60x60 canvas cell per row
  // showing a 4-axis radar (Coding / Web / OS / Tool-use). Pure Canvas2D so
  // we don't pay an ECharts init for ~25 sparklines.
  // ======================================================================
  var _FINGERPRINT_CATS = ['coding', 'web-browse', 'os-computer', 'tool-use'];
  var _FINGERPRINT_AXIS_LABELS = ['Cod', 'Web', 'OS', 'Tool'];

  function _fingerprintValues(modelId) {
    var out = [0, 0, 0, 0];
    for (var i = 0; i < _FINGERPRINT_CATS.length; i++) {
      var cat = _categoryByKey(_FINGERPRINT_CATS[i]);
      if (!cat || !cat.benchmarks) continue;
      var best = 0;
      for (var j = 0; j < cat.benchmarks.length; j++) {
        var n = _normalizedScore(modelId, cat.benchmarks[j], cat);
        if (typeof n === 'number' && n > best) best = n;
      }
      out[i] = best;
    }
    return out;
  }

  function _drawFingerprintCanvas(canvas, values, klass) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2;
    var R = Math.min(w, h) / 2 - 4;
    var color = _classColor(klass);

    ctx.clearRect(0, 0, w, h);

    // Background grid square (50% threshold ring + outer ring)
    ctx.strokeStyle = 'rgba(75,85,99,0.6)';
    ctx.fillStyle = 'rgba(31,41,55,0.5)';
    ctx.lineWidth = 1;

    // Outer polygon (max ring) — fill subtle gray, stroke ring
    var rings = [R, R * 0.5];
    for (var ri = 0; ri < rings.length; ri++) {
      ctx.beginPath();
      for (var a = 0; a < 4; a++) {
        var ang = -Math.PI / 2 + a * (Math.PI / 2);
        var x = cx + Math.cos(ang) * rings[ri];
        var y = cy + Math.sin(ang) * rings[ri];
        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (ri === 0) ctx.fill();
      ctx.stroke();
    }

    // Spokes (4 axes at N/E/S/W)
    ctx.beginPath();
    for (var s = 0; s < 4; s++) {
      var sang = -Math.PI / 2 + s * (Math.PI / 2);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sang) * R, cy + Math.sin(sang) * R);
    }
    ctx.stroke();

    // Data polygon
    var pts = [];
    for (var i = 0; i < 4; i++) {
      var v = Math.max(0, Math.min(100, values[i] || 0));
      var ang2 = -Math.PI / 2 + i * (Math.PI / 2);
      var rr = (v / 100) * R;
      pts.push([cx + Math.cos(ang2) * rr, cy + Math.sin(ang2) * rr]);
    }

    // Fill (30% alpha) + stroke
    ctx.beginPath();
    for (var p = 0; p < pts.length; p++) {
      if (p === 0) ctx.moveTo(pts[p][0], pts[p][1]);
      else ctx.lineTo(pts[p][0], pts[p][1]);
    }
    ctx.closePath();
    ctx.fillStyle = _hexToRgba(color, 0.30);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Vertex dots
    ctx.fillStyle = color;
    for (var d = 0; d < pts.length; d++) {
      ctx.beginPath();
      ctx.arc(pts[d][0], pts[d][1], 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function _hexToRgba(hex, alpha) {
    if (!hex || hex.charAt(0) !== '#' || (hex.length !== 7 && hex.length !== 4)) {
      return 'rgba(96,165,250,' + alpha + ')';
    }
    var r, g, b;
    if (hex.length === 7) {
      r = parseInt(hex.substr(1, 2), 16);
      g = parseInt(hex.substr(3, 2), 16);
      b = parseInt(hex.substr(5, 2), 16);
    } else {
      r = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      g = parseInt(hex.charAt(2) + hex.charAt(2), 16);
      b = parseInt(hex.charAt(3) + hex.charAt(3), 16);
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function renderFingerprintsInLeaderboard() {
    var lb = document.getElementById('agent-leaderboard');
    if (!lb) return;
    var thead = lb.querySelector('thead tr');
    if (thead && !thead.querySelector('[data-fingerprint-header]')) {
      var th = document.createElement('th');
      th.dataset.fingerprintHeader = '1';
      th.className = 'text-left px-2 py-1';
      th.textContent = 'Fingerprint';
      thead.appendChild(th);
    }

    var rows = lb.querySelectorAll('tbody tr[data-model]');
    for (var i = 0; i < rows.length; i++) {
      var modelId = rows[i].dataset.model;
      if (!modelId) continue;
      var values = _fingerprintValues(modelId);
      var klass = _modelClass(modelId);
      var cell = rows[i].querySelector('[data-fingerprint-cell]');
      if (!cell) {
        cell = document.createElement('td');
        cell.dataset.fingerprintCell = '1';
        cell.className = 'px-2 py-1';
        var canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 60;
        canvas.style.display = 'block';
        canvas.style.transition = 'box-shadow 120ms ease, transform 120ms ease';
        canvas.dataset.fpCanvas = '1';
        cell.appendChild(canvas);
        rows[i].appendChild(cell);
      }
      var cv = cell.querySelector('canvas');
      // Tooltip via title attribute (simple, no extra DOM).
      var tip = _modelDisplayName(modelId) + '\n' +
                _FINGERPRINT_AXIS_LABELS[0] + ': ' + values[0].toFixed(0) + '\n' +
                _FINGERPRINT_AXIS_LABELS[1] + ': ' + values[1].toFixed(0) + '\n' +
                _FINGERPRINT_AXIS_LABELS[2] + ': ' + values[2].toFixed(0) + '\n' +
                _FINGERPRINT_AXIS_LABELS[3] + ': ' + values[3].toFixed(0);
      if (cv) {
        cv.title = tip;
        _drawFingerprintCanvas(cv, values, klass);
      }

      // Brush emit: row hover broadcasts modelId; row leave clears.
      // Idempotent — guard via dataset flag so re-renders don't stack listeners.
      if (!rows[i].dataset.brushBound) {
        rows[i].dataset.brushBound = '1';
        rows[i].addEventListener('mouseenter', (function(mid) {
          return function() { _brush.emit(mid); };
        })(modelId));
        rows[i].addEventListener('mouseleave', function() { _brush.emit(null); });
      }
    }

    // Row-side highlight: subscribe once, re-applied across re-renders.
    if (!lb.dataset.brushSub) {
      lb.dataset.brushSub = '1';
      _brush.on(function(modelId) {
        var trs = lb.querySelectorAll('tbody tr[data-model]');
        for (var k = 0; k < trs.length; k++) {
          var match = modelId && trs[k].dataset.model === modelId;
          var fp = trs[k].querySelector('canvas[data-fp-canvas]');
          if (fp) {
            fp.style.boxShadow = match ? '0 0 0 2px #a78bfa' : 'none';
            fp.style.transform = match ? 'scale(1.08)' : 'scale(1)';
          }
          trs[k].style.background = match ? 'rgba(167,139,250,0.10)' : '';
        }
      });
    }
  }

  // ======================================================================
  // Widget 8 — Score Distribution Violin (per class)
  // ECharts has no native violin → boxplot per class + jittered scatter
  // overlay of every individual data point. 5-number summary in tooltip.
  // ======================================================================
  var _CLASS_ORDER = ['frontier', 'agent-product', 'edge-slm'];
  var _CLASS_LABELS = {
    'frontier': 'Frontier',
    'agent-product': 'Agent-Product',
    'edge-slm': 'Edge-SLM'
  };

  function _percentile(sorted, p) {
    if (!sorted.length) return null;
    if (sorted.length === 1) return sorted[0];
    var idx = (sorted.length - 1) * p;
    var lo = Math.floor(idx);
    var hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    var frac = idx - lo;
    return sorted[lo] * (1 - frac) + sorted[hi] * frac;
  }

  function _summary(values) {
    if (!values.length) return null;
    var sorted = values.slice().sort(function(a, b) { return a - b; });
    var min = sorted[0];
    var max = sorted[sorted.length - 1];
    var q1 = _percentile(sorted, 0.25);
    var med = _percentile(sorted, 0.5);
    var q3 = _percentile(sorted, 0.75);
    return { min: min, q1: q1, median: med, q3: q3, max: max, n: values.length };
  }

  function _drawClassViolin(bid) {
    var mountEl = document.getElementById('agent-chart-class-violin');
    if (!mountEl) return;
    if (typeof echarts === 'undefined') return;

    var rows = _scoresFor(bid);
    var byClass = { 'frontier': [], 'agent-product': [], 'edge-slm': [] };
    var pointsByClass = { 'frontier': [], 'agent-product': [], 'edge-slm': [] };

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r || typeof r.value !== 'number') continue;
      var klass = _modelClass(r.model_id);
      if (!byClass[klass]) continue;
      byClass[klass].push(r.value);
      pointsByClass[klass].push({ value: r.value, model_id: r.model_id });
    }

    // Empty-overall state
    var totalN = byClass['frontier'].length + byClass['agent-product'].length + byClass['edge-slm'].length;
    if (totalN === 0) {
      _emptyStateMessage(mountEl, 'No scores available for this benchmark.');
      return;
    }

    var summaries = {};
    for (var ci = 0; ci < _CLASS_ORDER.length; ci++) {
      summaries[_CLASS_ORDER[ci]] = _summary(byClass[_CLASS_ORDER[ci]]);
    }

    // Compute "median of others" for empty-class fallback placement.
    var nonEmptyMeds = [];
    for (var c2 = 0; c2 < _CLASS_ORDER.length; c2++) {
      var sm = summaries[_CLASS_ORDER[c2]];
      if (sm) nonEmptyMeds.push(sm.median);
    }
    var fallbackMed = nonEmptyMeds.length
      ? nonEmptyMeds.reduce(function(a, b) { return a + b; }, 0) / nonEmptyMeds.length
      : 50;

    // Boxplot data: index by category position. Empty classes get a tiny
    // placeholder box at fallbackMed with dashed border + "No data" label.
    var boxData = [];
    var emptyMarkers = [];
    for (var c3 = 0; c3 < _CLASS_ORDER.length; c3++) {
      var k = _CLASS_ORDER[c3];
      var sm2 = summaries[k];
      if (sm2) {
        boxData.push({
          value: [sm2.min, sm2.q1, sm2.median, sm2.q3, sm2.max],
          itemStyle: {
            color: 'rgba(' + _hexToRgb(_classColor(k)) + ',0.35)',
            borderColor: _classColor(k),
            borderWidth: 2
          }
        });
      } else {
        boxData.push({
          value: [fallbackMed - 1, fallbackMed - 0.5, fallbackMed, fallbackMed + 0.5, fallbackMed + 1],
          itemStyle: {
            color: 'rgba(75,85,99,0.15)',
            borderColor: '#6b7280',
            borderWidth: 1,
            borderType: 'dashed'
          }
        });
        emptyMarkers.push({ x: c3, y: fallbackMed });
      }
    }

    // Scatter overlay — jitter horizontally so identical scores don't stack.
    // ECharts category axis uses index as the X position; we deterministically
    // jitter within ±0.32 around that index.
    var scatterPoints = [];
    for (var c4 = 0; c4 < _CLASS_ORDER.length; c4++) {
      var key = _CLASS_ORDER[c4];
      var pts = pointsByClass[key];
      for (var pi = 0; pi < pts.length; pi++) {
        // Deterministic jitter from model_id hash.
        var midStr = pts[pi].model_id || '';
        var hash = 0;
        for (var hi = 0; hi < midStr.length; hi++) {
          hash = (hash * 31 + midStr.charCodeAt(hi)) >>> 0;
        }
        var jitter = ((hash % 1000) / 1000 - 0.5) * 0.64; // ±0.32
        scatterPoints.push({
          value: [c4 + jitter, pts[pi].value],
          model_id: pts[pi].model_id,
          klass: key,
          itemStyle: { color: _classColor(key), opacity: 0.7, borderColor: '#0f172a', borderWidth: 0.5 }
        });
      }
    }

    // Clear placeholder text from a prior empty-state render before ECharts
    // takes the div.
    if (!Charts._instances || !Charts._instances['agent-chart-class-violin']) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    }
    var chart = Charts._getOrCreate('agent-chart-class-violin');
    if (!chart) return;

    // Render "No data" labels for empty classes via a silent scatter series so
    // ECharts does the data→pixel conversion for us.
    var emptyLabelSeries = emptyMarkers.length ? [{
      name: 'Empty',
      type: 'scatter',
      symbol: 'none',
      silent: true,
      data: emptyMarkers.map(function(em) {
        return {
          value: [em.x, em.y],
          label: {
            show: true,
            formatter: 'No data',
            color: '#9ca3af',
            fontSize: 11,
            fontStyle: 'italic'
          }
        };
      })
    }] : [];

    chart.setOption(_applyToolbox({
      backgroundColor: 'transparent',
      grid: { left: 64, right: 24, top: 30, bottom: 60 },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(params) {
          if (params.seriesName === 'Distribution') {
            var idx = params.dataIndex;
            var k = _CLASS_ORDER[idx];
            var sm = summaries[k];
            if (!sm) {
              return '<b>' + _CLASS_LABELS[k] + '</b><br>No data';
            }
            return '<b>' + _CLASS_LABELS[k] + '</b><br>'
              + 'n: ' + sm.n + '<br>'
              + 'min: ' + sm.min.toFixed(1) + '<br>'
              + 'Q1: ' + sm.q1.toFixed(1) + '<br>'
              + 'median: ' + sm.median.toFixed(1) + '<br>'
              + 'Q3: ' + sm.q3.toFixed(1) + '<br>'
              + 'max: ' + sm.max.toFixed(1);
          }
          if (params.seriesType === 'scatter' && params.data && params.data.model_id) {
            return '<b>' + _modelDisplayName(params.data.model_id) + '</b><br>'
              + 'class: ' + _CLASS_LABELS[params.data.klass] + '<br>'
              + 'score: ' + params.value[1].toFixed(1);
          }
          return '';
        }
      },
      xAxis: {
        // Numeric axis for scatter jitter — show category-style labels via
        // axisLabel formatter.
        type: 'value',
        min: -0.5,
        max: _CLASS_ORDER.length - 0.5,
        interval: 1,
        axisLabel: {
          color: '#d1d5db',
          formatter: function(v) {
            var i = Math.round(v);
            if (i < 0 || i >= _CLASS_ORDER.length) return '';
            return _CLASS_LABELS[_CLASS_ORDER[i]];
          }
        },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        name: 'Score',
        nameLocation: 'middle',
        nameGap: 42,
        nameTextStyle: { color: '#9ca3af' },
        min: 0,
        max: 100,
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } }
      },
      series: [
        {
          name: 'Distribution',
          // ECharts boxplot series expects a category x-axis; we use a value
          // x-axis so scatter points can jitter horizontally. So render the
          // box ourselves via a `custom` series.
          type: 'custom',
          renderItem: function(p, api) {
            var idx = api.value(0);
            var minV = api.value(1);
            var q1V = api.value(2);
            var medV = api.value(3);
            var q3V = api.value(4);
            var maxV = api.value(5);

            var halfWidth = 0.32;
            var x = api.coord([idx, 0])[0];
            var xL = api.coord([idx - halfWidth, 0])[0];
            var xR = api.coord([idx + halfWidth, 0])[0];
            var yMin = api.coord([0, minV])[1];
            var yQ1 = api.coord([0, q1V])[1];
            var yMed = api.coord([0, medV])[1];
            var yQ3 = api.coord([0, q3V])[1];
            var yMax = api.coord([0, maxV])[1];

            var style = api.style();

            return {
              type: 'group',
              children: [
                // Whisker line min->max
                {
                  type: 'line',
                  shape: { x1: x, y1: yMin, x2: x, y2: yMax },
                  style: { stroke: style.stroke, lineWidth: 1, lineDash: style.lineDash || null }
                },
                // Min cap
                {
                  type: 'line',
                  shape: { x1: xL + (xR - xL) * 0.25, y1: yMin, x2: xR - (xR - xL) * 0.25, y2: yMin },
                  style: { stroke: style.stroke, lineWidth: 1 }
                },
                // Max cap
                {
                  type: 'line',
                  shape: { x1: xL + (xR - xL) * 0.25, y1: yMax, x2: xR - (xR - xL) * 0.25, y2: yMax },
                  style: { stroke: style.stroke, lineWidth: 1 }
                },
                // Box Q1->Q3
                {
                  type: 'rect',
                  shape: { x: xL, y: yQ3, width: xR - xL, height: yQ1 - yQ3 },
                  style: {
                    fill: style.fill,
                    stroke: style.stroke,
                    lineWidth: style.lineWidth,
                    lineDash: style.lineDash || null
                  }
                },
                // Median bar
                {
                  type: 'line',
                  shape: { x1: xL, y1: yMed, x2: xR, y2: yMed },
                  style: { stroke: style.stroke, lineWidth: 2 }
                }
              ]
            };
          },
          encode: { x: 0, y: [1, 2, 3, 4, 5], tooltip: [1, 2, 3, 4, 5] },
          data: boxData.map(function(b, i) {
            return {
              value: [i, b.value[0], b.value[1], b.value[2], b.value[3], b.value[4]],
              itemStyle: b.itemStyle
            };
          }),
          z: 2
        },
        {
          name: 'Models',
          type: 'scatter',
          symbolSize: 6,
          data: scatterPoints,
          z: 5
        }
      ].concat(emptyLabelSeries)
    }), true);
  }

  // hex like '#60a5fa' → '96,165,250'
  function _hexToRgb(hex) {
    var h = (hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function(c) { return c + c; }).join('');
    var r = parseInt(h.substring(0, 2), 16) || 0;
    var g = parseInt(h.substring(2, 4), 16) || 0;
    var b = parseInt(h.substring(4, 6), 16) || 0;
    return r + ',' + g + ',' + b;
  }

  function renderClassViolin() {
    var section = _ensureMountPoint('agent-chart-class-violin',
      'Score Distribution by Class',
      'Three violins (Frontier / Agent-Product / Edge) for a selected benchmark. Shows median, spread, outliers — answers whether the gap is systematic or benchmark-specific.');
    if (!section) return;
    var savedBid = _loadState('class-violin-bid', 'swe_bench_verified');
    _ensureBenchmarkSelect(section, 'agent-chart-class-violin', savedBid,
      function(newBid) {
        _saveState('class-violin-bid', newBid);
        _drawClassViolin(newBid);
      });
    var sel = document.getElementById('agent-chart-class-violin-select');
    var bid = (sel && sel.value) || savedBid;
    _drawClassViolin(bid);
  }

  // ======================================================================
  // Widget 13 (C2) — Provider Availability Map
  // Heatmap: top 25 models (by composite score) × 14 inference providers.
  // Cell = 1 (green) if model hosted on provider, 0 (gray) otherwise.
  // Source: api_providers field in config/model_enrichment.yaml.
  // ======================================================================
  var _PROVIDER_KEYS = [
    'anthropic_api', 'openai_api', 'google_ai_studio', 'aws_bedrock', 'azure_openai',
    'together_ai', 'replicate', 'huggingface', 'groq', 'fireworks', 'openrouter',
    'ollama', 'lmstudio', 'apple_intelligence'
  ];
  var _PROVIDER_LABELS = {
    'anthropic_api': 'Anthropic',
    'openai_api': 'OpenAI',
    'google_ai_studio': 'Google AI',
    'aws_bedrock': 'AWS Bedrock',
    'azure_openai': 'Azure OpenAI',
    'together_ai': 'Together AI',
    'replicate': 'Replicate',
    'huggingface': 'HuggingFace',
    'groq': 'Groq',
    'fireworks': 'Fireworks',
    'openrouter': 'OpenRouter',
    'ollama': 'Ollama',
    'lmstudio': 'LM Studio',
    'apple_intelligence': 'Apple Intelligence'
  };
  var _PROVIDER_URLS = {
    'anthropic_api': 'https://www.anthropic.com/api',
    'openai_api': 'https://platform.openai.com',
    'google_ai_studio': 'https://aistudio.google.com',
    'aws_bedrock': 'https://aws.amazon.com/bedrock/',
    'azure_openai': 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
    'together_ai': 'https://www.together.ai',
    'replicate': 'https://replicate.com',
    'huggingface': 'https://huggingface.co/inference-endpoints',
    'groq': 'https://groq.com',
    'fireworks': 'https://fireworks.ai',
    'openrouter': 'https://openrouter.ai',
    'ollama': 'https://ollama.com',
    'lmstudio': 'https://lmstudio.ai',
    'apple_intelligence': 'https://www.apple.com/apple-intelligence/'
  };
  // Older yaml entries used different aliases; normalize to canonical keys.
  var _PROVIDER_ALIASES = {
    'huggingface_inference': 'huggingface',
    'hf_inference': 'huggingface'
  };

  function _normalizeProviders(arr) {
    if (!arr || !arr.length) return [];
    var out = {};
    for (var i = 0; i < arr.length; i++) {
      var raw = arr[i];
      if (!raw) continue;
      var key = _PROVIDER_ALIASES[raw] || raw;
      out[key] = true;
    }
    return Object.keys(out);
  }

  function _showProviderToast(message) {
    var host = document.getElementById('agent-chart-provider-availability-section');
    if (!host) return;
    var prev = document.getElementById('agent-chart-provider-availability-toast');
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    var toast = document.createElement('div');
    toast.id = 'agent-chart-provider-availability-toast';
    toast.className = 'mt-2 text-xs text-gray-200 bg-gray-800 border border-gray-700 rounded px-3 py-2';
    toast.textContent = message;
    host.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 5000);
  }

  function renderProviderAvailability() {
    _ensureMountPoint('agent-chart-provider-availability',
      'Provider Availability Map',
      'Top 25 models × 14 inference providers. Green = hosted; click a cell for the provider link.');
    if (typeof echarts === 'undefined') return;
    if (!(window.App && App.data && App.data.scores && App.data.models)) return;
    var mountEl = document.getElementById('agent-chart-provider-availability');
    if (!mountEl) return;

    // Lazy-load enrichment, then re-render once it's available.
    if (App.data.enrichment === null) {
      if (App.loadEnrichment) {
        App.loadEnrichment().then(function() { renderProviderAvailability(); });
      }
      return;
    }
    var enrich = App.data.enrichment || {};

    // Pick rows: top 25 by composite score, restricted to models that have any
    // api_providers populated. Falls back to score-coverage if composite empty.
    var ranked = _composite();
    ranked.sort(function(a, b) { return b.agent_score - a.agent_score; });
    var rows = [];
    var seen = {};
    for (var i = 0; i < ranked.length && rows.length < 25; i++) {
      var mid = ranked[i].model_id;
      if (seen[mid]) continue;
      var ent = enrich[mid];
      if (!ent || !ent.api_providers || !ent.api_providers.length) continue;
      seen[mid] = true;
      rows.push(mid);
    }
    if (rows.length < 5) {
      // Fallback: any model with api_providers, ordered by enrichment-key.
      for (var midKey in enrich) {
        if (rows.length >= 25) break;
        if (seen[midKey]) continue;
        var en2 = enrich[midKey];
        if (!en2 || !en2.api_providers || !en2.api_providers.length) continue;
        seen[midKey] = true;
        rows.push(midKey);
      }
    }
    if (rows.length === 0) return;

    // Reverse so highest-rank row is at top of y-axis (ECharts renders bottom-up).
    var rowOrder = rows.slice().reverse();

    var data = [];
    var providerSets = {};
    for (var r = 0; r < rowOrder.length; r++) {
      var rid = rowOrder[r];
      var providers = _normalizeProviders((enrich[rid] && enrich[rid].api_providers) || []);
      var pset = {};
      for (var pi = 0; pi < providers.length; pi++) pset[providers[pi]] = true;
      providerSets[rid] = pset;
      for (var c = 0; c < _PROVIDER_KEYS.length; c++) {
        var pkey = _PROVIDER_KEYS[c];
        data.push([c, r, pset[pkey] ? 1 : 0]);
      }
    }

    var xLabels = _PROVIDER_KEYS.map(function(k) { return _PROVIDER_LABELS[k] || k; });
    var yLabels = rowOrder.map(function(mid) {
      return _classEmoji(_modelClass(mid)) + ' ' + _modelDisplayName(mid);
    });

    var chart = Charts._getOrCreate('agent-chart-provider-availability');
    if (!chart) return;
    mountEl.style.height = Math.max(420, 24 * rowOrder.length + 140) + 'px';
    chart.resize();

    var option = {
      backgroundColor: 'transparent',
      grid: { left: 220, right: 30, top: 30, bottom: 80, containLabel: false },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb', fontSize: 12 },
        formatter: function(p) {
          if (!p || !p.value) return '';
          var col = p.value[0], row = p.value[1], val = p.value[2];
          var rid = rowOrder[row];
          var pkey = _PROVIDER_KEYS[col];
          var provLabel = _PROVIDER_LABELS[pkey] || pkey;
          var modelLabel = _modelDisplayName(rid);
          if (val === 1) {
            return '<b>' + modelLabel + '</b><br>available on <b>' + provLabel + '</b>';
          }
          return '<b>' + modelLabel + '</b><br>not on ' + provLabel +
                 '<br><span style="color:#6b7280">(per vendor docs)</span>';
        }
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { rotate: 35, fontSize: 10, color: '#d1d5db', interval: 0 },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        splitArea: { show: true },
        axisLabel: { fontSize: 10, color: '#d1d5db' },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      visualMap: {
        show: false,
        min: 0, max: 1,
        inRange: { color: ['#1f2937', '#16a34a'] }
      },
      series: [{
        name: 'Availability',
        type: 'heatmap',
        data: data,
        label: { show: false },
        itemStyle: { borderColor: '#0f172a', borderWidth: 1 },
        emphasis: {
          itemStyle: {
            borderColor: '#fbbf24', borderWidth: 2,
            shadowBlur: 6, shadowColor: 'rgba(251, 191, 36, 0.6)'
          }
        },
        progressive: 0
      }]
    };

    chart.setOption(_applyToolbox(option), true);

    chart.off('click');
    chart.on('click', function(p) {
      if (!p || !p.value) return;
      var col = p.value[0], row = p.value[1], val = p.value[2];
      var rid = rowOrder[row];
      var pkey = _PROVIDER_KEYS[col];
      var provLabel = _PROVIDER_LABELS[pkey] || pkey;
      var modelLabel = _modelDisplayName(rid);
      if (val === 1) {
        var url = _PROVIDER_URLS[pkey];
        var msg = modelLabel + ' is available on ' + provLabel +
                  (url ? ' — ' + url : '');
        _showProviderToast(msg);
      } else {
        _showProviderToast(modelLabel + ' is not listed on ' + provLabel + ' (per vendor docs).');
      }
    });
  }

  // ======================================================================
  // Widget 9 (C1) — Capability Sankey
  // 3-level data flow: Top 12 models → 10 categories → top 20 benchmarks.
  // Edge weight = score count. A benchmark may live in multiple categories;
  // each membership is counted once so column totals stay consistent.
  // ======================================================================
  var _SANKEY_CAT_PAL = [
    '#60a5fa', '#a78bfa', '#f472b6', '#fb7185', '#fbbf24',
    '#facc15', '#a3e635', '#34d399', '#22d3ee', '#94a3b8'
  ];

  function renderCapabilitySankey() {
    _ensureMountPoint('agent-chart-sankey',
      'Capability Sankey',
      'Data flow: Top 12 models → 10 categories → top 20 benchmarks. Edge weight = score count.');
    if (typeof echarts === 'undefined') return;
    if (!(window.App && App.data && App.data.scores)) return;
    var cats = (window.Agent && Agent._CATEGORIES) ? Agent._CATEGORIES : [];
    var mountEl = document.getElementById('agent-chart-sankey');
    if (!cats.length || !mountEl) return;

    // benchmark_id -> [categoryIndex...] (a benchmark can sit in many).
    var benchToCats = {};
    for (var ci = 0; ci < cats.length; ci++) {
      var bs = cats[ci].benchmarks || [];
      for (var bi = 0; bi < bs.length; bi++) {
        (benchToCats[bs[bi]] = benchToCats[bs[bi]] || []).push(ci);
      }
    }

    // One sweep — tally model / benchmark / (model,cat) / (cat,bench) counts.
    var mCount = {}, bCount = {}, mCov = {}, mcCount = {}, cbCount = {};
    var scores = App.data.scores;
    for (var s = 0; s < scores.length; s++) {
      var r = scores[s];
      if (!r || r.model_id == null || typeof r.value !== 'number') continue;
      var memberships = benchToCats[r.benchmark_id];
      if (!memberships) continue;
      var mid = r.model_id, bid2 = r.benchmark_id;
      mCount[mid] = (mCount[mid] || 0) + 1;
      bCount[bid2] = (bCount[bid2] || 0) + 1;
      (mCov[mid] = mCov[mid] || {})[bid2] = true;
      for (var mi = 0; mi < memberships.length; mi++) {
        var c = memberships[mi];
        mcCount[mid + '||' + c] = (mcCount[mid + '||' + c] || 0) + 1;
        cbCount[c + '||' + bid2] = (cbCount[c + '||' + bid2] || 0) + 1;
      }
    }

    // ≥3 covered benchmarks gate — at least 3 such models needed.
    var enoughModels = 0;
    for (var k in mCov) {
      if (Object.prototype.hasOwnProperty.call(mCov, k) &&
          Object.keys(mCov[k]).length >= 3) enoughModels++;
    }
    if (enoughModels < 3) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var emptyMsg = document.createElement('div');
      emptyMsg.className = 'text-xs text-gray-500 italic';
      emptyMsg.textContent = 'Insufficient coverage for Sankey diagram';
      mountEl.appendChild(emptyMsg);
      return;
    }

    function _topIds(map, n) {
      var arr = Object.keys(map).map(function(id) { return [id, map[id]]; });
      arr.sort(function(a, b) { return b[1] - a[1]; });
      return arr.slice(0, n).map(function(x) { return x[0]; });
    }
    var topModels = _topIds(mCount, 12);
    var topBenches = _topIds(bCount, 20);
    if (!topModels.length || !topBenches.length) return;
    var mSet = {}, bSet = {};
    topModels.forEach(function(id) { mSet[id] = true; });
    topBenches.forEach(function(id) { bSet[id] = true; });

    // Build nodes (prefixed names avoid cross-column collisions) + name index.
    var nodes = [], byName = {};
    function _push(node) { nodes.push(node); byName[node.name] = node; }
    topModels.forEach(function(id) {
      _push({
        name: 'M::' + id, _label: _modelDisplayName(id), _modelId: id, _kind: 'model',
        itemStyle: { color: _classColor(_modelClass(id)) },
        label: { color: '#e5e7eb', fontSize: 10, formatter: _modelDisplayName(id) }
      });
    });
    cats.forEach(function(cat, idx) {
      _push({
        name: 'C::' + cat.key, _label: cat.label, _kind: 'category',
        itemStyle: { color: _SANKEY_CAT_PAL[idx % _SANKEY_CAT_PAL.length] },
        label: { color: '#e5e7eb', fontSize: 10, formatter: cat.label }
      });
    });
    topBenches.forEach(function(id) {
      _push({
        name: 'B::' + id, _label: _benchmarkLabel(id), _kind: 'benchmark',
        itemStyle: { color: '#9ca3af' },
        label: { color: '#cbd5e1', fontSize: 9, formatter: _benchmarkLabel(id) }
      });
    });

    // Edges: model→category and category→benchmark, restricted to top sets.
    var links = [];
    Object.keys(mcCount).forEach(function(key) {
      var p = key.split('||');
      if (!mSet[p[0]]) return;
      links.push({ source: 'M::' + p[0], target: 'C::' + cats[+p[1]].key, value: mcCount[key] });
    });
    Object.keys(cbCount).forEach(function(key) {
      var p = key.split('||');
      if (!bSet[p[1]]) return;
      links.push({ source: 'C::' + cats[+p[0]].key, target: 'B::' + p[1], value: cbCount[key] });
    });

    var chart = Charts._getOrCreate('agent-chart-sankey');
    if (!chart) return;

    chart.setOption(_applyToolbox({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb', fontSize: 12 },
        formatter: function(p) {
          if (!p) return '';
          if (p.dataType === 'edge') {
            var sN = byName[p.data.source], tN = byName[p.data.target];
            var sLab = sN ? sN._label : p.data.source;
            var tLab = tN ? tN._label : p.data.target;
            if (sN && tN && sN._kind === 'model' && tN._kind === 'category') {
              return '<b>' + sLab + '</b> has <b>' + p.data.value + '</b> scores in ' + tLab;
            }
            if (sN && tN && sN._kind === 'category' && tN._kind === 'benchmark') {
              return tLab + ' contributes <b>' + p.data.value + '</b> scores to ' + sLab;
            }
            return sLab + ' → ' + tLab + ': <b>' + p.data.value + '</b>';
          }
          var nN = byName[p.name];
          return '<b>' + (nN ? nN._label : p.name) + '</b><br>Total flow: ' +
                 (p.value != null ? p.value : '');
        }
      },
      series: [{
        type: 'sankey',
        left: 20, right: 160, top: 20, bottom: 20,
        nodeWidth: 14, nodeGap: 8, nodeAlign: 'justify', layoutIterations: 32,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.55 },
        label: { color: '#e5e7eb', fontSize: 10 },
        data: nodes, links: links
      }]
    }), true);

    chart.off('click');
    chart.on('click', function(p) {
      if (!p || p.dataType !== 'node') return;
      var nN = byName[p.name];
      if (nN && nN._kind === 'model' && nN._modelId &&
          window.Modal && typeof Modal.showModel === 'function') {
        Modal.showModel(nN._modelId);
      }
    });
  }

  // ======================================================================
  // Widget 10 (C2) — Cumulative SOTA Wins (stacked area)
  // X = date, Y = cumulative SOTA-holder days per model, stacked.
  // Each model that EVER held SOTA on the chosen benchmark gets a band that
  // grows by 1 on every date it owns SOTA, and is flat otherwise. Final view:
  // band thicknesses = total days at SOTA per model.
  // ======================================================================
  function _drawCumulativeSOTA(bid) {
    var mountEl = document.getElementById('agent-chart-cumulative-sota');
    if (!mountEl) return;
    if (typeof echarts === 'undefined') return;

    _loadHistoryIndex().then(function(idx) {
      var dates = (idx && idx.dates) || [];
      if (dates.length < 2) {
        _emptyStateMessage(mountEl, 'Need at least 2 days of history snapshots');
        return;
      }
      Promise.all(dates.map(_loadSnapshot)).then(function(snapshots) {
        // Per-date best holder for the chosen benchmark — same logic as W5.
        var dailyBest = [];
        for (var i = 0; i < dates.length; i++) {
          var rows = snapshots[i] || [];
          var bestVal = -Infinity;
          var bestMid = null;
          for (var j = 0; j < rows.length; j++) {
            var r = rows[j];
            if (r && r.benchmark_id === bid && typeof r.value === 'number') {
              if (r.value > bestVal) {
                bestVal = r.value;
                bestMid = r.model_id;
              }
            }
          }
          dailyBest.push({ date: dates[i], value: bestVal, model_id: bestMid });
        }

        // Running SOTA — only updates when a strictly higher score appears,
        // otherwise the previous holder keeps the crown for that day.
        var runningHolders = [];
        var bestSoFar = -Infinity;
        var bestHolder = null;
        for (var p = 0; p < dailyBest.length; p++) {
          var d = dailyBest[p];
          if (d.model_id !== null && d.value > bestSoFar) {
            bestSoFar = d.value;
            bestHolder = d.model_id;
          }
          runningHolders.push(bestHolder); // null until first holder appears
        }

        // Discover holder set (preserve first-seen order so legend reads
        // chronologically: who held SOTA first appears first).
        var holders = [];
        var seenHolder = {};
        for (var h = 0; h < runningHolders.length; h++) {
          var mid = runningHolders[h];
          if (mid && !seenHolder[mid]) {
            holders.push(mid);
            seenHolder[mid] = true;
          }
        }
        if (!holders.length) {
          _emptyStateMessage(mountEl, 'No SOTA holder found on this benchmark');
          return;
        }

        // Build cumulative-days series, one per holder. On each date, the
        // current holder's counter increments by 1; everyone else stays flat.
        var series = [];
        var cumByModel = {};
        for (var ih = 0; ih < holders.length; ih++) cumByModel[holders[ih]] = [];

        for (var di = 0; di < dates.length; di++) {
          var owner = runningHolders[di];
          for (var ho = 0; ho < holders.length; ho++) {
            var hm = holders[ho];
            var prev = cumByModel[hm].length
              ? cumByModel[hm][cumByModel[hm].length - 1]
              : 0;
            cumByModel[hm].push(hm === owner ? prev + 1 : prev);
          }
        }

        for (var s = 0; s < holders.length; s++) {
          var hid = holders[s];
          var color = _classColor(_modelClass(hid));
          series.push({
            name: _modelDisplayName(hid),
            type: 'line',
            stack: 'sota-days',
            step: 'end',
            showSymbol: false,
            smooth: false,
            areaStyle: { color: color, opacity: 0.7 },
            lineStyle: { color: color, width: 1 },
            itemStyle: { color: color },
            emphasis: { focus: 'series' },
            data: cumByModel[hid]
          });
        }

        if (!Charts._instances || !Charts._instances['agent-chart-cumulative-sota']) {
          while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        }
        var chart = Charts._getOrCreate('agent-chart-cumulative-sota');
        if (!chart) return;

        chart.setOption(_applyToolbox({
          backgroundColor: 'transparent',
          grid: { left: 64, right: 24, top: 40, bottom: 70 },
          legend: {
            bottom: 0,
            type: 'scroll',
            textStyle: { color: '#d1d5db' }
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(17,24,39,0.95)',
            borderColor: '#374151',
            textStyle: { color: '#e5e7eb' },
            formatter: function(params) {
              if (!params || !params.length) return '';
              var lines = ['<b>' + params[0].axisValue + '</b>'];
              // Sort descending by cumulative days for readability.
              var sorted = params.slice().sort(function(a, b) {
                return (b.value || 0) - (a.value || 0);
              });
              for (var k = 0; k < sorted.length; k++) {
                var pp = sorted[k];
                var v = pp.value;
                if (v === undefined || v === null || v === 0) continue;
                lines.push(pp.marker + pp.seriesName + ': ' + v + ' day' + (v === 1 ? '' : 's'));
              }
              return lines.join('<br>');
            }
          },
          xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
            axisLabel: { color: '#9ca3af', rotate: 30 },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { show: false }
          },
          yAxis: {
            type: 'value',
            name: 'Cumulative SOTA-holder days',
            nameLocation: 'middle',
            nameGap: 46,
            nameTextStyle: { color: '#9ca3af' },
            axisLabel: { color: '#9ca3af' },
            axisLine: { lineStyle: { color: '#4b5563' } },
            splitLine: { lineStyle: { color: '#1f2937' } }
          },
          series: series
        }), true);
      });
    });
  }

  function renderCumulativeSOTAWins() {
    var section = _ensureMountPoint('agent-chart-cumulative-sota',
      'Cumulative SOTA Wins (days at SOTA)',
      'How long each model held the SOTA crown on the selected benchmark. Stacked by date — band thickness = total days at the top.');
    if (!section) return;
    var savedBid = _loadState('cumulative-sota-bid', 'swe_bench_verified');
    _ensureBenchmarkSelect(section, 'agent-chart-cumulative-sota', savedBid,
      function(newBid) {
        _saveState('cumulative-sota-bid', newBid);
        _drawCumulativeSOTA(newBid);
      });
    var sel = document.getElementById('agent-chart-cumulative-sota-select');
    var bid = (sel && sel.value) || savedBid;
    _drawCumulativeSOTA(bid);
  }


  // ======================================================================
  // Widget 11 (C4) — Build Your Agent wizard
  // Priority sliders (one per major capability category) drive a weighted
  // ranking of agents. The right column shows the top-10 recommendations,
  // each with a sparkline-bar of category contributions. No ECharts — pure
  // DOM widget; recompute happens on every slider/checkbox change without a
  // full chart rebuild.
  // ======================================================================
  var _wizardState = _loadState('wizard-state', {
    priorities: {
      coding: 50,
      'web-browse': 50,
      'os-computer': 50,
      'tool-use': 50,
      mcp: 50,
      'customer-service': 50,
      safety: 50
    },
    includeCost: false,
    edgeOnly: false
  });

  var _WIZARD_SLIDERS = [
    { key: 'coding',           label: 'Coding',
      tooltip: 'SWE-Bench Verified, SWE-Bench Pro, Aider Polyglot, USACO. 코드 생성·디버깅·복잡한 PR 작업 능력.' },
    { key: 'web-browse',       label: 'Web & Browsing',
      tooltip: 'BrowseComp, Online-Mind2Web, VisualWebArena, WebShop. 실제 웹사이트 탐색·검색·정보 수집 능력.' },
    { key: 'os-computer',      label: 'OS / Computer Use',
      tooltip: 'OSWorld Verified, ScreenSpot-Pro, OSCopilot-GAIA. GUI 클릭, 데스크톱 자동화, OS 환경 조작.' },
    { key: 'tool-use',         label: 'Tool Use & Function Calling',
      tooltip: 'BFCL v4, GAIA, Tau2-Bench, AppWorld. API 호출, 함수 시그니처 매칭, 다단계 도구 조합.' },
    { key: 'mcp',              label: 'MCP',
      tooltip: 'Model Context Protocol — Anthropic 표준. 툴/리소스/프롬프트 등 컨텍스트 인터페이스 호환성.' },
    { key: 'customer-service', label: 'Customer Service',
      tooltip: 'Tau2-Bench (Retail/Telecom/Airline). 멀티턴 대화, 정책 준수, 사용자 의도 파악.' },
    { key: 'safety',           label: 'Safety',
      tooltip: 'AgentDojo (lower=better ASR), Apollo scheming oversight. 프롬프트 인젝션·탈옥·은폐 시도 저항.' }
  ];

  // Mean of _normalizedScore() across the category's benchmarks for a model.
  // Returns 0 when the model has no scores in the category (so the prior is
  // "no contribution" rather than "missing data" — keeps ranking stable).
  function _wizardCoverageScore(modelId, categoryKey) {
    var cat = _categoryByKey(categoryKey);
    if (!cat || !cat.benchmarks || !cat.benchmarks.length) return 0;
    var sum = 0;
    var n = 0;
    for (var i = 0; i < cat.benchmarks.length; i++) {
      var s = _normalizedScore(modelId, cat.benchmarks[i], cat);
      if (typeof s === 'number' && !isNaN(s)) {
        sum += s;
        n += 1;
      }
    }
    return n > 0 ? (sum / n) : 0;
  }

  // Pricing lookup — synchronous, based on App.data.pricing already loaded
  // by App.loadData. Returns null if missing so we can skip cost penalty.
  function _wizardOutputCost(modelId) {
    if (!window.App || !App.data || !App.data.pricing) return null;
    var p = App.data.pricing[modelId];
    if (!p) return null;
    var v = (typeof p.output === 'number') ? p.output : p.price_per_1m_output;
    return (typeof v === 'number' && v > 0) ? v : null;
  }

  // Returns sorted list (desc) of { model_id, score, contributions }.
  function _wizardRank() {
    if (!window.App || !App.data || !App.data.models) return [];
    var models = App.data.models;
    var out = [];
    for (var i = 0; i < models.length; i++) {
      var m = models[i];
      if (!m || !m.id) continue;
      if (_wizardState.edgeOnly && _modelClass(m.id) !== 'edge-slm') continue;

      var score = 0;
      var contributions = [];
      var anyCoverage = false;
      for (var j = 0; j < _WIZARD_SLIDERS.length; j++) {
        var key = _WIZARD_SLIDERS[j].key;
        var w = (_wizardState.priorities[key] || 0) / 100;
        var cov = _wizardCoverageScore(m.id, key);
        if (cov > 0) anyCoverage = true;
        var contrib = w * cov;
        score += contrib;
        contributions.push({ key: key, value: contrib, raw: cov });
      }
      if (!anyCoverage) continue; // skip models with zero data in any chosen category

      if (_wizardState.includeCost) {
        var cost = _wizardOutputCost(m.id);
        if (typeof cost === 'number' && cost > 0) {
          var penalty = Math.log(cost + 1) / Math.LN10; // log10
          if (penalty > 0) score = score / penalty;
        }
      }

      out.push({ model_id: m.id, score: score, contributions: contributions });
    }
    out.sort(function(a, b) { return b.score - a.score; });
    return out;
  }

  // Idempotent — section already has a chart div (height 420) from
  // _ensureMountPoint. We hide that and append our 2-column grid once.
  function _ensureWizardControls(section) {
    if (section.getAttribute('data-wizard-built') === '1') return;
    section.setAttribute('data-wizard-built', '1');

    // Hide the default chart mount (we don't render an ECharts chart).
    var defaultMount = document.getElementById('agent-chart-wizard');
    if (defaultMount) defaultMount.style.display = 'none';

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mt-2';

    // Left column — sliders + checkboxes
    var left = document.createElement('div');
    left.className = 'space-y-3';

    var leftHead = document.createElement('div');
    leftHead.className = 'text-sm font-semibold text-gray-300 mb-2';
    leftHead.textContent = 'Priorities';
    left.appendChild(leftHead);

    for (var i = 0; i < _WIZARD_SLIDERS.length; i++) {
      var s = _WIZARD_SLIDERS[i];
      var row = document.createElement('div');
      row.className = 'flex items-center gap-2 text-xs';

      var lab = document.createElement('label');
      lab.className = 'text-gray-300 w-44 shrink-0 flex items-center gap-1';
      lab.htmlFor = 'wizard-slider-' + s.key;
      var labText = document.createElement('span');
      labText.textContent = s.label;
      lab.appendChild(labText);
      if (s.tooltip) {
        var info = document.createElement('span');
        info.className = 'text-gray-500 cursor-help text-[10px]';
        info.textContent = 'ⓘ';
        info.title = s.tooltip;
        info.setAttribute('aria-label', s.tooltip);
        lab.appendChild(info);
      }
      row.appendChild(lab);

      var input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '100';
      input.value = String(_wizardState.priorities[s.key]);
      input.step = '1';
      input.id = 'wizard-slider-' + s.key;
      input.className = 'flex-1 accent-blue-400';
      input.setAttribute('data-cat', s.key);
      row.appendChild(input);

      var val = document.createElement('span');
      val.className = 'text-gray-400 w-8 text-right tabular-nums';
      val.id = 'wizard-slider-val-' + s.key;
      val.textContent = String(_wizardState.priorities[s.key]);
      row.appendChild(val);

      // Closure-safe handler (capture key + val ref).
      (function(key, valRef) {
        input.addEventListener('input', function(e) {
          var v = parseInt(e.target.value, 10);
          if (isNaN(v)) v = 0;
          _wizardState.priorities[key] = v;
          valRef.textContent = String(v);
          _saveState('wizard-state', _wizardState);
          _renderWizardOutput();
        });
      })(s.key, val);

      left.appendChild(row);
    }

    // Checkbox row — Include cost
    var costRow = document.createElement('div');
    costRow.className = 'flex items-center gap-2 text-xs mt-3 pt-3 border-t border-gray-800';
    var costCb = document.createElement('input');
    costCb.type = 'checkbox';
    costCb.id = 'wizard-include-cost';
    costCb.className = 'accent-blue-400';
    costCb.checked = _wizardState.includeCost;
    costCb.addEventListener('change', function(e) {
      _wizardState.includeCost = !!e.target.checked;
      _saveState('wizard-state', _wizardState);
      _renderWizardOutput();
    });
    var costLab = document.createElement('label');
    costLab.htmlFor = 'wizard-include-cost';
    costLab.className = 'text-gray-300';
    costLab.textContent = 'Include cost in scoring (penalize expensive models)';
    costRow.appendChild(costCb);
    costRow.appendChild(costLab);
    left.appendChild(costRow);

    // Checkbox row — Edge-only
    var edgeRow = document.createElement('div');
    edgeRow.className = 'flex items-center gap-2 text-xs';
    var edgeCb = document.createElement('input');
    edgeCb.type = 'checkbox';
    edgeCb.id = 'wizard-edge-only';
    edgeCb.className = 'accent-blue-400';
    edgeCb.checked = _wizardState.edgeOnly;
    edgeCb.addEventListener('change', function(e) {
      _wizardState.edgeOnly = !!e.target.checked;
      _saveState('wizard-state', _wizardState);
      _renderWizardOutput();
    });
    var edgeLab = document.createElement('label');
    edgeLab.htmlFor = 'wizard-edge-only';
    edgeLab.className = 'text-gray-300';
    edgeLab.textContent = 'Edge-only filter (small/on-device models)';
    edgeRow.appendChild(edgeCb);
    edgeRow.appendChild(edgeLab);
    left.appendChild(edgeRow);

    // Right column — output list mount
    var right = document.createElement('div');
    right.className = 'space-y-2';

    var rightHead = document.createElement('div');
    rightHead.className = 'text-sm font-semibold text-gray-300 mb-2';
    rightHead.textContent = 'Recommended agents';
    right.appendChild(rightHead);

    var listMount = document.createElement('div');
    listMount.id = 'agent-chart-wizard-list';
    listMount.className = 'space-y-2';
    right.appendChild(listMount);

    grid.appendChild(left);
    grid.appendChild(right);
    section.appendChild(grid);
  }

  function _wizardClassLabel(klass) {
    if (klass === 'agent-product') return 'Agent Product';
    if (klass === 'edge-slm') return 'Edge SLM';
    return 'Frontier';
  }

  function _wizardCostTier(cost) {
    if (typeof cost !== 'number' || cost <= 0) return '';
    if (cost < 1) return '$';
    if (cost < 5) return '$$';
    if (cost < 20) return '$$$';
    return '$$$$';
  }

  function _renderWizardOutput() {
    var listMount = document.getElementById('agent-chart-wizard-list');
    if (!listMount) return;
    while (listMount.firstChild) listMount.removeChild(listMount.firstChild);

    var ranked = _wizardRank();
    if (!ranked.length) {
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic';
      msg.textContent = _wizardState.edgeOnly
        ? 'No edge-class models matched your priorities.'
        : 'No models matched your priorities — try raising at least one slider.';
      listMount.appendChild(msg);
      return;
    }

    var top = ranked.slice(0, 10);

    // Global max contribution for sparkline normalization across the top-10.
    var globalMaxContrib = 0;
    for (var i = 0; i < top.length; i++) {
      for (var j = 0; j < top[i].contributions.length; j++) {
        if (top[i].contributions[j].value > globalMaxContrib) {
          globalMaxContrib = top[i].contributions[j].value;
        }
      }
    }
    if (globalMaxContrib <= 0) globalMaxContrib = 1;

    for (var k = 0; k < top.length; k++) {
      var entry = top[k];
      var item = document.createElement('div');
      item.className = 'rounded border border-gray-800 bg-gray-950 p-3 cursor-pointer hover:border-blue-500 transition-colors';
      item.setAttribute('data-model-id', entry.model_id);

      // Header line — rank + name
      var head = document.createElement('div');
      head.className = 'flex items-baseline gap-2';

      var rank = document.createElement('span');
      rank.className = 'text-xs text-gray-500 tabular-nums w-6 shrink-0';
      rank.textContent = (k + 1) + '.';
      head.appendChild(rank);

      var name = document.createElement('span');
      name.className = 'text-sm font-medium text-gray-200 truncate';
      name.textContent = _modelDisplayName(entry.model_id);
      head.appendChild(name);

      item.appendChild(head);

      // Meta line — vendor · class · score · cost
      var meta = document.createElement('div');
      meta.className = 'flex items-center gap-2 text-xs text-gray-400 mt-1 ml-7 flex-wrap';

      var vendor = document.createElement('span');
      vendor.textContent = _vendorOf(entry.model_id) || 'unknown';
      meta.appendChild(vendor);

      var sep1 = document.createElement('span');
      sep1.className = 'text-gray-600';
      sep1.textContent = '·';
      meta.appendChild(sep1);

      var klass = _modelClass(entry.model_id);
      var klabel = document.createElement('span');
      klabel.style.color = _classColor(klass);
      klabel.textContent = _wizardClassLabel(klass);
      meta.appendChild(klabel);

      var sep2 = document.createElement('span');
      sep2.className = 'text-gray-600';
      sep2.textContent = '·';
      meta.appendChild(sep2);

      var score = document.createElement('span');
      score.className = 'text-gray-300 tabular-nums';
      score.textContent = 'Score: ' + entry.score.toFixed(1);
      meta.appendChild(score);

      var costVal = _wizardOutputCost(entry.model_id);
      var tier = _wizardCostTier(costVal);
      if (tier) {
        var sep3 = document.createElement('span');
        sep3.className = 'text-gray-600';
        sep3.textContent = '·';
        meta.appendChild(sep3);
        var costSpan = document.createElement('span');
        costSpan.className = 'text-gray-500';
        costSpan.textContent = 'Cost: ' + tier;
        meta.appendChild(costSpan);
      }

      item.appendChild(meta);

      // Sparkline-like contribution bars (one column per slider)
      var spark = document.createElement('div');
      spark.className = 'flex items-end gap-1 mt-2 ml-7';
      spark.style.height = '24px';
      for (var sp = 0; sp < entry.contributions.length; sp++) {
        var c = entry.contributions[sp];
        var bar = document.createElement('div');
        var pct = Math.max(2, Math.round((c.value / globalMaxContrib) * 100));
        bar.style.height = pct + '%';
        bar.style.width = '12px';
        bar.style.backgroundColor = _classColor(klass);
        bar.style.opacity = '0.75';
        bar.title = c.key + ': weighted ' + c.value.toFixed(1) + ' (raw ' + c.raw.toFixed(0) + ')';
        spark.appendChild(bar);
      }
      item.appendChild(spark);

      // "Why?" button — opens C4 Recommendation Breakdown modal without
      // triggering the row-level Modal.showModel handler.
      var whyBtn = document.createElement('button');
      whyBtn.type = 'button';
      whyBtn.className = 'mt-2 ml-7 text-xs px-2 py-1 rounded border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-300';
      whyBtn.textContent = 'Why?';
      whyBtn.setAttribute('aria-label', 'Why this model ranked here');
      (function(mid) {
        whyBtn.addEventListener('click', function(ev) {
          ev.stopPropagation();
          renderRecommendationBreakdown(mid);
        });
      })(entry.model_id);
      item.appendChild(whyBtn);

      // Click → modal drilldown
      (function(mid) {
        item.addEventListener('click', function() {
          if (window.Modal && typeof Modal.showModel === 'function') {
            Modal.showModel(mid);
          }
        });
      })(entry.model_id);

      listMount.appendChild(item);
    }
  }

  function renderAgentWizard() {
    var section = _ensureMountPoint('agent-chart-wizard',
      'Build Your Agent — Priority-driven ranking',
      'Set capability priorities (sliders) → ranked agent recommendations. Toggle cost or edge-only filtering.');
    if (!section) return;
    _ensureWizardControls(section);
    _renderWizardOutput();
  }

  // ======================================================================
  // Widget 14 (C4) — Recommendation Breakdown drill-down (per-category
  // contribution). Invoked on demand from the wizard's "Why?" button.
  // Overlays a modal showing how a model's weighted score is composed.
  // ======================================================================
  function _categoryColor(catKey) {
    var palette = {
      'coding': '#3b82f6', 'web-browse': '#10b981', 'os-computer': '#f59e0b',
      'tool-use': '#8b5cf6', 'mcp': '#ec4899', 'customer-service': '#06b6d4',
      'safety': '#ef4444'
    };
    return palette[catKey] || '#9ca3af';
  }

  // Track active modal so we can clean up listeners + dispose ECharts.
  var _breakdownState = { overlay: null, escHandler: null, chartId: null };

  function _closeBreakdownModal() {
    if (_breakdownState.escHandler) {
      document.removeEventListener('keydown', _breakdownState.escHandler);
      _breakdownState.escHandler = null;
    }
    if (_breakdownState.chartId && window.Charts && Charts._instances) {
      var inst = Charts._instances[_breakdownState.chartId];
      if (inst) {
        try { inst.dispose(); } catch (e) {}
        delete Charts._instances[_breakdownState.chartId];
      }
      _breakdownState.chartId = null;
    }
    if (_breakdownState.overlay && _breakdownState.overlay.parentNode) {
      _breakdownState.overlay.parentNode.removeChild(_breakdownState.overlay);
    }
    _breakdownState.overlay = null;
  }

  function renderRecommendationBreakdown(modelId) {
    if (!modelId) return;
    // Close any pre-existing breakdown modal so we don't stack overlays.
    _closeBreakdownModal();

    var cats = (window.Agent && Agent._CATEGORIES) ? Agent._CATEGORIES : [];
    var priorities = _wizardState.priorities || {};
    var rows = [];
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i];
      if (!cat || !cat.key) continue;
      if (!Object.prototype.hasOwnProperty.call(priorities, cat.key)) continue;
      var raw = _wizardCoverageScore(modelId, cat.key);
      var priority = priorities[cat.key] || 0;
      var contribution = raw * (priority / 100);
      rows.push({ cat: cat, raw: raw, priority: priority, contribution: contribution });
    }
    rows.sort(function(a, b) { return b.contribution - a.contribution; });

    _showBreakdownModal(modelId, rows);
  }

  function _showBreakdownModal(modelId, rows) {
    var overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.addEventListener('click', function(ev) {
      if (ev.target === overlay) _closeBreakdownModal();
    });

    var panel = document.createElement('div');
    panel.className = 'bg-gray-900 border border-gray-800 rounded p-6 max-w-3xl w-full overflow-y-auto';
    panel.style.maxHeight = '90vh';

    // Header — title + close button
    var header = document.createElement('div');
    header.className = 'flex items-start justify-between gap-4 mb-3';

    var titleWrap = document.createElement('div');
    var title = document.createElement('div');
    title.className = 'text-base font-semibold text-gray-100';
    title.textContent = 'Why ' + _modelDisplayName(modelId) + ' ranked here';
    titleWrap.appendChild(title);

    var sub = document.createElement('div');
    sub.className = 'text-xs text-gray-400 mt-1 flex items-center gap-2 flex-wrap';
    var vendor = document.createElement('span');
    vendor.textContent = _vendorOf(modelId) || 'unknown';
    sub.appendChild(vendor);
    var sepA = document.createElement('span');
    sepA.className = 'text-gray-600';
    sepA.textContent = '·';
    sub.appendChild(sepA);
    var klass = _modelClass(modelId);
    var klassSpan = document.createElement('span');
    klassSpan.style.color = _classColor(klass);
    klassSpan.textContent = _wizardClassLabel(klass);
    sub.appendChild(klassSpan);
    titleWrap.appendChild(sub);

    header.appendChild(titleWrap);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'text-gray-400 hover:text-gray-100 text-xl leading-none px-2';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', _closeBreakdownModal);
    header.appendChild(closeBtn);

    panel.appendChild(header);

    // Chart container — dedicated id so Charts._getOrCreate can manage it.
    var chartId = 'agent-breakdown-chart';
    var chartDiv = document.createElement('div');
    chartDiv.id = chartId;
    chartDiv.style.width = '100%';
    chartDiv.style.height = '320px';
    panel.appendChild(chartDiv);

    // Total weighted score
    var total = 0;
    for (var i = 0; i < rows.length; i++) total += rows[i].contribution;

    var totalLine = document.createElement('div');
    totalLine.className = 'text-sm text-gray-200 mt-3';
    totalLine.textContent = 'Total weighted score: ' + total.toFixed(1);
    panel.appendChild(totalLine);

    // Summary table
    var table = document.createElement('table');
    table.className = 'w-full text-xs mt-2 border-collapse';

    var thead = document.createElement('thead');
    var thr = document.createElement('tr');
    ['Category', 'Raw avg', 'Priority %', 'Contribution'].forEach(function(h) {
      var th = document.createElement('th');
      th.className = 'text-left text-gray-400 font-normal py-1 pr-3 border-b border-gray-800';
      th.textContent = h;
      thr.appendChild(th);
    });
    thead.appendChild(thr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    function _appendCell(tr, txt, cls) {
      var td = document.createElement('td');
      td.className = cls;
      td.textContent = txt;
      tr.appendChild(td);
      return td;
    }
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var tr = document.createElement('tr');

      var tdCat = document.createElement('td');
      tdCat.className = 'py-1 pr-3 text-gray-200';
      var swatch = document.createElement('span');
      swatch.style.cssText = 'display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:2px;background-color:' + _categoryColor(row.cat.key) + ';';
      tdCat.appendChild(swatch);
      var catText = document.createElement('span');
      catText.textContent = row.cat.label || row.cat.key;
      tdCat.appendChild(catText);
      tr.appendChild(tdCat);

      _appendCell(tr, row.raw.toFixed(1),       'py-1 pr-3 text-gray-300 tabular-nums');
      _appendCell(tr, String(row.priority),     'py-1 pr-3 text-gray-300 tabular-nums');
      _appendCell(tr, row.contribution.toFixed(1), 'py-1 pr-3 text-gray-100 tabular-nums');

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    panel.appendChild(table);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Esc → close
    var escHandler = function(ev) {
      if (ev.key === 'Escape' || ev.keyCode === 27) _closeBreakdownModal();
    };
    document.addEventListener('keydown', escHandler);
    _breakdownState.overlay = overlay;
    _breakdownState.escHandler = escHandler;
    _breakdownState.chartId = chartId;

    // Init ECharts after the overlay is in the DOM (so dimensions are real).
    if (window.Charts && typeof Charts._getOrCreate === 'function' && typeof echarts !== 'undefined') {
      var chart = Charts._getOrCreate(chartId);
      if (chart) {
        var labels = rows.map(function(r) { return r.cat.label || r.cat.key; });
        var data = rows.map(function(r) {
          return { value: Number(r.contribution.toFixed(2)), itemStyle: { color: _categoryColor(r.cat.key) } };
        });
        // ECharts horizontal bar — y-axis is category, x-axis is value.
        // Reverse so highest contribution appears on top.
        labels.reverse();
        data.reverse();
        chart.setOption({
          grid: { left: 140, right: 30, top: 20, bottom: 30 },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(p) {
              if (!p || !p.length) return '';
              var d = p[0];
              return d.name + '<br/>Contribution: <b>' + d.value.toFixed(2) + '</b>';
            }
          },
          xAxis: { type: 'value', axisLabel: { color: '#9ca3af' } },
          yAxis: { type: 'category', data: labels, axisLabel: { color: '#d1d5db' } },
          series: [{ type: 'bar', data: data, barWidth: '60%' }]
        });
        try { chart.resize(); } catch (e) {}
      }
    }
  }

  // ======================================================================
  // Widget 12 (C1) — Cost Simulator
  // Interactive monthly inference cost calculator. Three sliders (req/day,
  // input tokens, output tokens) + reasoning/edge/subscription toggles
  // produce a ranked top-15 table of cheapest models. Edge SLMs are pinned
  // at $0 (on-device). Subscription products (Devin/Manus) are toggleable
  // and use a flat-fee + per-task cost model.
  // ======================================================================
  var _simulatorState = _loadState('simulator-state', {
    requestsPerDay: 1000,
    inputTokens: 2000,
    outputTokens: 500,
    reasoningMultiplier: false,
    edgeOnly: false,
    showSubscription: false
  });

  // Subscription tiers — fixed monthly fee + optional per-task cost. Daily $
  // is computed as (monthly_fee / 30) + (req/day × per_task_cost) so heavy
  // workloads still scale with usage even when most cost is the flat fee.
  var _SIMULATOR_SUBSCRIPTIONS = [
    { model_id: 'cognition/devin',  monthly: 20,  per_task: 2.25, label: 'Devin (Core + ACU)' },
    { model_id: 'manus-ai/manus',   monthly: 500, per_task: 0,    label: 'Manus (Pro)' }
  ];

  // Composite agent score for edge SLMs — average of normalized scores
  // across the wizard's seven categories. Used purely for ordering free
  // on-device entries (which all share daily_cost = 0).
  function _simulatorEdgeScore(modelId) {
    var keys = ['coding', 'web-browse', 'os-computer', 'tool-use', 'mcp', 'customer-service', 'safety'];
    var sum = 0;
    var n = 0;
    for (var i = 0; i < keys.length; i++) {
      var s = _wizardCoverageScore(modelId, keys[i]);
      if (typeof s === 'number' && s > 0) { sum += s; n += 1; }
    }
    return n > 0 ? (sum / n) : 0;
  }

  // Compute daily inference cost for a frontier model. Returns null if no
  // pricing available. Output cost is multiplied by 3.5x when the reasoning
  // toggle is on (proxy for thinking-token expansion across the field).
  function _simulatorFrontierCost(modelId) {
    if (!window.App || !App.data || !App.data.pricing) return null;
    var p = App.data.pricing[modelId];
    if (!p) return null;
    var inputPrice = (typeof p.input === 'number') ? p.input : null;
    var outputPrice = (typeof p.output === 'number') ? p.output : null;
    if (inputPrice == null || outputPrice == null) return null;
    var req = _simulatorState.requestsPerDay;
    var inputCost = req * _simulatorState.inputTokens * inputPrice / 1000000;
    var outputCost = req * _simulatorState.outputTokens * outputPrice / 1000000;
    if (_simulatorState.reasoningMultiplier) outputCost *= 3.5;
    return inputCost + outputCost;
  }

  // Build the row list. Rows sorted ascending by daily cost. Edge SLMs
  // (all daily=0) ranked among themselves by composite agent score.
  function _simulatorBuildRows() {
    var rows = [];

    if (window.App && App.data && App.data.pricing && App.data.models) {
      for (var i = 0; i < App.data.models.length; i++) {
        var m = App.data.models[i];
        if (!m || !m.id) continue;
        var klass = _modelClass(m.id);
        if (_simulatorState.edgeOnly && klass !== 'edge-slm') continue;
        if (klass === 'edge-slm') continue; // edge handled below
        var daily = _simulatorFrontierCost(m.id);
        if (daily == null) continue;
        rows.push({
          modelId: m.id, name: _modelDisplayName(m.id), vendor: _vendorOf(m.id),
          klass: klass, daily: daily, monthly: daily * 30, yearly: daily * 365, note: ''
        });
      }
    }

    var edgeIds = (window.Agent && Agent._EDGE_SLMS) || [];
    var edgeRows = [];
    for (var e = 0; e < edgeIds.length; e++) {
      var eid = edgeIds[e];
      edgeRows.push({
        modelId: eid, name: _modelDisplayName(eid), vendor: _vendorOf(eid),
        klass: 'edge-slm', daily: 0, monthly: 0, yearly: 0,
        note: 'on-device · score ' + _simulatorEdgeScore(eid).toFixed(0)
      });
    }
    edgeRows.sort(function(a, b) {
      return _simulatorEdgeScore(b.modelId) - _simulatorEdgeScore(a.modelId);
    });

    if (_simulatorState.showSubscription && !_simulatorState.edgeOnly) {
      for (var s = 0; s < _SIMULATOR_SUBSCRIPTIONS.length; s++) {
        var sub = _SIMULATOR_SUBSCRIPTIONS[s];
        var dailyFlat = sub.monthly / 30;
        var dailyTask = _simulatorState.requestsPerDay * sub.per_task;
        var dailySub = dailyFlat + dailyTask;
        rows.push({
          modelId: sub.model_id, name: _modelDisplayName(sub.model_id),
          vendor: _vendorOf(sub.model_id), klass: _modelClass(sub.model_id),
          daily: dailySub, monthly: dailySub * 30, yearly: dailySub * 365,
          note: '$' + sub.monthly + '/mo + $' + sub.per_task + '/task'
        });
      }
    }

    rows.sort(function(a, b) { return a.daily - b.daily; });
    if (_simulatorState.edgeOnly) return edgeRows.slice(0, 15);
    return edgeRows.concat(rows).slice(0, 15);
  }

  function _simulatorClassLabel(klass) {
    if (klass === 'agent-product') return 'Agent';
    if (klass === 'edge-slm') return 'Edge';
    return 'Frontier';
  }

  function _simulatorFormatCost(v) {
    if (v <= 0) return '$0';
    if (v < 1) return '$' + v.toFixed(3);
    if (v < 100) return '$' + v.toFixed(2);
    return '$' + Math.round(v).toLocaleString();
  }

  function _ensureSimulatorControls(section) {
    if (section.getAttribute('data-simulator-built') === '1') return;
    section.setAttribute('data-simulator-built', '1');

    var defaultMount = document.getElementById('agent-chart-cost-simulator');
    if (defaultMount) defaultMount.style.display = 'none';

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mt-2';

    var left = document.createElement('div');
    left.className = 'space-y-3';

    var leftHead = document.createElement('div');
    leftHead.className = 'text-sm font-semibold text-gray-300 mb-2';
    leftHead.textContent = 'Workload';
    left.appendChild(leftHead);

    var sliderSpecs = [
      { key: 'requestsPerDay', label: 'Requests / day',           min: 100, max: 1000000, step: 1,   log: true,  format: function(v) { return v.toLocaleString(); } },
      { key: 'inputTokens',    label: 'Avg input tokens / req',   min: 100, max: 50000,   step: 100, log: false, format: function(v) { return v.toLocaleString(); } },
      { key: 'outputTokens',   label: 'Avg output tokens / req',  min: 50,  max: 10000,   step: 50,  log: false, format: function(v) { return v.toLocaleString(); } }
    ];

    for (var i = 0; i < sliderSpecs.length; i++) {
      var spec = sliderSpecs[i];
      var row = document.createElement('div');
      row.className = 'flex items-center gap-2 text-xs';

      var lab = document.createElement('label');
      lab.className = 'text-gray-300 w-44 shrink-0';
      lab.textContent = spec.label;
      lab.htmlFor = 'simulator-slider-' + spec.key;
      row.appendChild(lab);

      var input = document.createElement('input');
      input.type = 'range';
      input.id = 'simulator-slider-' + spec.key;
      input.className = 'flex-1 accent-blue-400';
      if (spec.log) {
        input.min = String(Math.log10(spec.min));
        input.max = String(Math.log10(spec.max));
        input.step = '0.01';
        input.value = String(Math.log10(_simulatorState[spec.key]));
      } else {
        input.min = String(spec.min);
        input.max = String(spec.max);
        input.step = String(spec.step);
        input.value = String(_simulatorState[spec.key]);
      }
      row.appendChild(input);

      var val = document.createElement('span');
      val.className = 'text-gray-400 w-20 text-right tabular-nums';
      val.textContent = spec.format(_simulatorState[spec.key]);
      row.appendChild(val);

      (function(s, valRef) {
        input.addEventListener('input', function(e) {
          var raw = parseFloat(e.target.value);
          if (isNaN(raw)) return;
          var v = s.log ? Math.round(Math.pow(10, raw)) : Math.round(raw);
          if (v < s.min) v = s.min;
          if (v > s.max) v = s.max;
          _simulatorState[s.key] = v;
          valRef.textContent = s.format(v);
          _saveState('simulator-state', _simulatorState);
          _renderSimulatorOutput();
        });
      })(spec, val);

      left.appendChild(row);
    }

    var checkSpecs = [
      { key: 'reasoningMultiplier', label: 'Include reasoning models (×3.5 output for thinking tokens)' },
      { key: 'edgeOnly',            label: 'Edge-only filter (on-device SLMs)' },
      { key: 'showSubscription',    label: 'Show subscription products (Devin / Manus)' }
    ];

    for (var c = 0; c < checkSpecs.length; c++) {
      var cspec = checkSpecs[c];
      var crow = document.createElement('div');
      crow.className = c === 0
        ? 'flex items-center gap-2 text-xs mt-3 pt-3 border-t border-gray-800'
        : 'flex items-center gap-2 text-xs';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.id = 'simulator-cb-' + cspec.key;
      cb.className = 'accent-blue-400';
      cb.checked = !!_simulatorState[cspec.key];
      (function(key) {
        cb.addEventListener('change', function(e) {
          _simulatorState[key] = !!e.target.checked;
          _saveState('simulator-state', _simulatorState);
          _renderSimulatorOutput();
        });
      })(cspec.key);
      var clab = document.createElement('label');
      clab.htmlFor = 'simulator-cb-' + cspec.key;
      clab.className = 'text-gray-300';
      clab.textContent = cspec.label;
      crow.appendChild(cb);
      crow.appendChild(clab);
      left.appendChild(crow);
    }

    var right = document.createElement('div');
    right.className = 'space-y-2';

    var rightHead = document.createElement('div');
    rightHead.className = 'text-sm font-semibold text-gray-300 mb-2';
    rightHead.textContent = 'Top 15 — cheapest first';
    right.appendChild(rightHead);

    var tableMount = document.createElement('div');
    tableMount.id = 'agent-chart-cost-simulator-table';
    tableMount.className = 'overflow-x-auto';
    right.appendChild(tableMount);

    grid.appendChild(left);
    grid.appendChild(right);
    section.appendChild(grid);
  }

  function _renderSimulatorOutput() {
    var mount = document.getElementById('agent-chart-cost-simulator-table');
    if (!mount) return;
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    var rows = _simulatorBuildRows();
    if (!rows.length) {
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic';
      msg.textContent = 'No models matched current filters.';
      mount.appendChild(msg);
      return;
    }

    var table = document.createElement('table');
    table.className = 'w-full text-xs text-gray-300';

    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    hr.className = 'text-gray-400 border-b border-gray-800';
    var heads = ['#', 'Model', 'Vendor', 'Class', 'Daily', 'Monthly', 'Yearly'];
    for (var h = 0; h < heads.length; h++) {
      var th = document.createElement('th');
      th.className = h === 0
        ? 'text-left py-1 pr-2 w-6'
        : (h >= 4 ? 'text-right py-1 px-2 tabular-nums' : 'text-left py-1 px-2');
      th.textContent = heads[h];
      hr.appendChild(th);
    }
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var tr = document.createElement('tr');
      tr.className = 'border-b border-gray-900 hover:bg-gray-800';

      var rankTd = document.createElement('td');
      rankTd.className = 'py-1 pr-2 text-gray-500 tabular-nums';
      rankTd.textContent = String(r + 1);
      tr.appendChild(rankTd);

      var nameTd = document.createElement('td');
      nameTd.className = 'py-1 px-2 text-gray-200';
      var nameSpan = document.createElement('span');
      nameSpan.textContent = row.name;
      nameTd.appendChild(nameSpan);
      if (row.note) {
        var noteSpan = document.createElement('span');
        noteSpan.className = 'ml-2 text-gray-500';
        noteSpan.textContent = '(' + row.note + ')';
        nameTd.appendChild(noteSpan);
      }
      tr.appendChild(nameTd);

      var vendorTd = document.createElement('td');
      vendorTd.className = 'py-1 px-2 text-gray-400';
      vendorTd.textContent = row.vendor || '—';
      tr.appendChild(vendorTd);

      var klassTd = document.createElement('td');
      klassTd.className = 'py-1 px-2';
      klassTd.style.color = _classColor(row.klass);
      klassTd.textContent = _simulatorClassLabel(row.klass);
      tr.appendChild(klassTd);

      var dailyTd = document.createElement('td');
      dailyTd.className = 'py-1 px-2 text-right tabular-nums';
      dailyTd.textContent = row.klass === 'edge-slm' ? '$0' : _simulatorFormatCost(row.daily);
      tr.appendChild(dailyTd);

      var monthTd = document.createElement('td');
      monthTd.className = 'py-1 px-2 text-right tabular-nums';
      monthTd.textContent = row.klass === 'edge-slm' ? '$0' : _simulatorFormatCost(row.monthly);
      tr.appendChild(monthTd);

      var yearTd = document.createElement('td');
      yearTd.className = 'py-1 px-2 text-right tabular-nums text-gray-400';
      yearTd.textContent = row.klass === 'edge-slm' ? '$0' : _simulatorFormatCost(row.yearly);
      tr.appendChild(yearTd);

      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    mount.appendChild(table);
  }

  function renderCostSimulator() {
    var section = _ensureMountPoint('agent-chart-cost-simulator',
      'Cost Simulator',
      'Estimate monthly inference cost across frontier models. Adjust sliders to match your workload — output ranks models cheapest-first.');
    if (!section) return;
    _ensureSimulatorControls(section);
    _renderSimulatorOutput();
  }

  // ======================================================================
  // Widget 15 — Vendor × Benchmark Coverage Matrix (Reporting Gap View)
  //
  // Rows: top 12 vendors by total scored-model count across the 12 core
  //       agentic benchmarks (_HEATMAP_BENCHMARKS).
  // Cols: the 12 core agentic benchmarks.
  // Cell value: NUMBER of distinct scored models from that vendor on that
  //             benchmark (NOT the score itself). Empty cells render as
  //             '-' so reporting gaps stand out.
  // Color scale: light gray (1) → blue (mid) → bright blue (5+).
  //              0/empty cells use ECharts '-' convention (transparent).
  // Tooltip: lists which models from that vendor reported scores.
  //
  // Complements Widget 2 (model × benchmark heatmap): this is the
  // "vendor accountability" view — useful for spotting reporting gaps
  // (e.g., "Anthropic doesn't report on tau2_bench").
  // ======================================================================
  function _topVendors(limit) {
    // Count distinct (vendor, model_id) pairs scored on _HEATMAP_BENCHMARKS,
    // then rank canonical vendors by total scored-model count desc.
    if (!(window.App && App.data && App.data.scores)) return [];
    var BSET = {};
    for (var b = 0; b < _HEATMAP_BENCHMARKS.length; b++) BSET[_HEATMAP_BENCHMARKS[b]] = true;

    var vendorModels = {}; // vendor -> { modelId: true }
    var scores = App.data.scores;
    for (var i = 0; i < scores.length; i++) {
      var s = scores[i];
      if (!s || !BSET[s.benchmark_id]) continue;
      if (typeof s.value !== 'number' || isNaN(s.value)) continue;
      var canon = _canonVendor(_vendorOf(s.model_id));
      if (!canon) continue;
      if (!vendorModels[canon]) vendorModels[canon] = {};
      vendorModels[canon][s.model_id] = true;
    }
    var arr = [];
    for (var v in vendorModels) {
      if (!Object.prototype.hasOwnProperty.call(vendorModels, v)) continue;
      arr.push({ vendor: v, count: Object.keys(vendorModels[v]).length });
    }
    arr.sort(function(a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return a.vendor.localeCompare(b.vendor);
    });
    var n = (typeof limit === 'number' && limit > 0) ? limit : 12;
    return arr.slice(0, n).map(function(x) { return x.vendor; });
  }

  function renderVendorCoverageMatrix() {
    _ensureMountPoint('agent-chart-vendor-coverage',
      'Vendor × Benchmark Coverage Matrix — Reporting Gap View',
      'Shows how many scored models each vendor has on each agentic benchmark. White cells = no reported scores from that vendor.');
    if (typeof echarts === 'undefined') return;
    if (!(window.App && App.data && App.data.scores && App.data.models)) return;

    var chart = Charts._getOrCreate('agent-chart-vendor-coverage');
    if (!chart) return;

    var topVendors = _topVendors(12);
    if (!topVendors.length) {
      chart.setOption({
        title: {
          text: 'No vendor coverage data available yet for the curated benchmark set.',
          left: 'center', top: 'middle',
          textStyle: { color: '#9ca3af', fontSize: 12, fontWeight: 'normal' }
        }
      }, true);
      return;
    }

    var vendorIndex = {};
    for (var vi = 0; vi < topVendors.length; vi++) vendorIndex[topVendors[vi]] = vi;

    // Build cell -> { count, models: [name,...] }.
    // cellKey = bIdx + ':' + vIdx
    var cellModels = {};
    var BSET = {};
    for (var b = 0; b < _HEATMAP_BENCHMARKS.length; b++) BSET[_HEATMAP_BENCHMARKS[b]] = true;

    var scores = App.data.scores;
    for (var si = 0; si < scores.length; si++) {
      var s = scores[si];
      if (!s || !BSET[s.benchmark_id]) continue;
      if (typeof s.value !== 'number' || isNaN(s.value)) continue;
      var canon = _canonVendor(_vendorOf(s.model_id));
      if (!(canon in vendorIndex)) continue;
      var bIdx = -1;
      for (var bi2 = 0; bi2 < _HEATMAP_BENCHMARKS.length; bi2++) {
        if (_HEATMAP_BENCHMARKS[bi2] === s.benchmark_id) { bIdx = bi2; break; }
      }
      if (bIdx < 0) continue;
      var vIdx = vendorIndex[canon];
      var key = bIdx + ':' + vIdx;
      if (!cellModels[key]) cellModels[key] = {};
      cellModels[key][s.model_id] = true;
    }

    // Build heatmap data array. Use '-' (ECharts convention) for empty cells
    // so they render transparent and gaps stand out.
    var data = [];
    var maxCount = 0;
    for (var c = 0; c < _HEATMAP_BENCHMARKS.length; c++) {
      for (var r = 0; r < topVendors.length; r++) {
        var ck = c + ':' + r;
        if (cellModels[ck]) {
          var n = Object.keys(cellModels[ck]).length;
          if (n > maxCount) maxCount = n;
          data.push([c, r, n]);
        } else {
          data.push([c, r, '-']);
        }
      }
    }
    if (maxCount < 1) maxCount = 1;

    var xLabels = _HEATMAP_BENCHMARKS.map(function(bid) { return _benchmarkShortName(bid); });

    var option = {
      backgroundColor: 'transparent',
      grid: { left: 160, right: 30, top: 30, bottom: 90, containLabel: false },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb', fontSize: 12 },
        formatter: function(p) {
          if (!p || !p.value) return '';
          var col = p.value[0], row = p.value[1], val = p.value[2];
          var vendor = topVendors[row];
          var bid = _HEATMAP_BENCHMARKS[col];
          var benchLine = _benchmarkShortName(bid);
          var head = '<b>' + vendor + '</b><br>' + benchLine;
          if (val === '-' || !cellModels[col + ':' + row]) {
            return head + '<br><span style="color:#fca5a5">No reported scores</span>';
          }
          var ids = Object.keys(cellModels[col + ':' + row]);
          var lines = [head, '<span style="color:#9ca3af">' + ids.length + ' scored model' + (ids.length === 1 ? '' : 's') + ':</span>'];
          var max = Math.min(ids.length, 6);
          for (var i = 0; i < max; i++) {
            lines.push('• ' + _modelDisplayName(ids[i]));
          }
          if (ids.length > max) lines.push('<span style="color:#6b7280">…and ' + (ids.length - max) + ' more</span>');
          return lines.join('<br>');
        }
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: true },
        axisLabel: { rotate: 30, fontSize: 10, color: '#d1d5db', interval: 0 },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'category',
        data: topVendors,
        inverse: true,
        splitArea: { show: true },
        axisLabel: { fontSize: 11, color: '#d1d5db' },
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false }
      },
      visualMap: {
        min: 1, max: maxCount, calculable: true,
        orient: 'horizontal', left: 'center', bottom: 8,
        inRange: { color: ['#e5e7eb', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'] },
        textStyle: { color: '#9ca3af', fontSize: 10 },
        text: [String(maxCount) + '+ models', '1 model']
      },
      series: [{
        name: 'Scored Models',
        type: 'heatmap',
        data: data,
        label: {
          show: true, fontSize: 10, color: '#0f172a', fontWeight: 600,
          formatter: function(p) {
            if (!p || !p.value || p.value[2] === '-') return '';
            return p.value[2];
          }
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff', borderWidth: 1,
            shadowBlur: 8, shadowColor: 'rgba(96, 165, 250, 0.5)'
          }
        },
        progressive: 0
      }]
    };

    chart.setOption(_applyToolbox(option), true);
  }

  // ======================================================================
  // Widget 16 (Wave 6C2) — Score Trajectory Replay (animated)
  //
  // Animates how SOTA scores have evolved over time on a chosen agentic
  // benchmark. Each ECharts timeline step = one snapshot date; each step's
  // option re-renders the scatter of (model, score) pairs observed on or
  // before that date. Press the built-in timeline play button to scrub
  // through history and watch the leaderboard reshuffle.
  //
  // Data source: data/scores/history/<date>.json snapshots (same source as
  // Widget 5 SOTA Timeline). Top-10 holders per benchmark are tracked.
  // Falls back to "Insufficient history" if fewer than 5 distinct dates
  // contain scores for the chosen benchmark.
  // ======================================================================
  function _drawTrajectoryReplay(bid) {
    var mountEl = document.getElementById('agent-chart-trajectory-replay');
    if (!mountEl) return;
    if (typeof echarts === 'undefined') return;

    _loadHistoryIndex().then(function(idx) {
      var dates = (idx && idx.dates) || [];
      if (dates.length < 5) {
        _emptyStateMessage(mountEl, 'Insufficient history — need at least 5 snapshot dates for animation.');
        return;
      }

      Promise.all(dates.map(_loadSnapshot)).then(function(snapshots) {
        // Build per-date best-score-per-model map for the chosen benchmark.
        // datesWithData = subset of dates where the benchmark has at least
        // one row (used to gate the "insufficient history" message).
        var datesWithData = [];
        var perDate = []; // perDate[i] = { modelId: bestValueOnOrBeforeDate }
        var cumulative = {}; // running best-per-model across all snapshots so far
        for (var i = 0; i < dates.length; i++) {
          var rows = snapshots[i] || [];
          var hadRow = false;
          for (var j = 0; j < rows.length; j++) {
            var r = rows[j];
            if (!r || r.benchmark_id !== bid) continue;
            if (typeof r.value !== 'number' || isNaN(r.value)) continue;
            hadRow = true;
            var prev = cumulative[r.model_id];
            if (prev === undefined || r.value > prev) {
              cumulative[r.model_id] = r.value;
            }
          }
          if (hadRow) datesWithData.push(dates[i]);
          // Snapshot a copy of the current cumulative state for this frame.
          var snap = {};
          for (var mid in cumulative) {
            if (Object.prototype.hasOwnProperty.call(cumulative, mid)) {
              snap[mid] = cumulative[mid];
            }
          }
          perDate.push(snap);
        }

        if (datesWithData.length < 5) {
          _emptyStateMessage(mountEl,
            'Insufficient history for ' + _benchmarkLabel(bid) +
            ' — only ' + datesWithData.length + ' date(s) have scores (need 5+).');
          return;
        }

        // Determine final-frame top-10 model ids — these are the bubbles we
        // animate across all frames. Models that don't yet have a score on
        // an earlier frame are simply absent from that frame's data.
        var finalSnap = perDate[perDate.length - 1];
        var finalArr = [];
        for (var fmid in finalSnap) {
          if (Object.prototype.hasOwnProperty.call(finalSnap, fmid)) {
            finalArr.push({ model_id: fmid, value: finalSnap[fmid] });
          }
        }
        finalArr.sort(function(a, b) { return b.value - a.value; });
        var top10 = finalArr.slice(0, 10);
        var top10Ids = top10.map(function(t) { return t.model_id; });
        var top10Set = {};
        for (var ti = 0; ti < top10Ids.length; ti++) top10Set[top10Ids[ti]] = true;

        // Build keyframe options — one per snapshot date.
        var options = [];
        for (var d = 0; d < dates.length; d++) {
          var snapD = perDate[d];
          var scatterPoints = [];
          for (var k = 0; k < top10Ids.length; k++) {
            var midK = top10Ids[k];
            if (snapD[midK] === undefined) continue;
            scatterPoints.push({
              value: [k, snapD[midK]],
              name: _modelDisplayName(midK),
              itemStyle: { color: _modelBandColor(midK) }
            });
          }
          options.push({
            title: {
              text: 'Frame: ' + dates[d],
              left: 'center', top: 6,
              textStyle: { color: '#9ca3af', fontSize: 11, fontWeight: 'normal' }
            },
            series: [{
              name: 'Score',
              type: 'scatter',
              symbolSize: function(v) {
                // Size = sqrt(value) so high scores stand out without dwarfing low ones.
                var s = (v && typeof v[1] === 'number') ? v[1] : 0;
                return Math.max(10, Math.min(38, Math.sqrt(s) * 4.5));
              },
              data: scatterPoints,
              label: {
                show: true,
                position: 'top',
                color: '#e5e7eb',
                fontSize: 10,
                formatter: function(p) { return p.name || ''; },
                backgroundColor: 'rgba(17,24,39,0.7)',
                padding: [2, 4],
                borderRadius: 3
              },
              emphasis: { focus: 'series' }
            }]
          });
        }

        // Base option = axes + timeline definition. Each option in `options`
        // overrides only the title + series for that frame.
        var xLabels = top10Ids.map(function(mid) { return _modelDisplayName(mid); });

        if (!Charts._instances || !Charts._instances['agent-chart-trajectory-replay']) {
          while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        }
        var chart = Charts._getOrCreate('agent-chart-trajectory-replay');
        if (!chart) return;

        // _applyToolbox attaches `toolbox` at the top of an option object,
        // but ECharts timeline mode reads toolbox from `baseOption`. So we
        // run _applyToolbox on a stub, then move the toolbox config inside.
        var _stub = _applyToolbox({});
        var baseOption = {
          backgroundColor: 'transparent',
          baseOption: {
            toolbox: _stub.toolbox,
            timeline: {
              axisType: 'category',
              autoPlay: false,
              playInterval: 1000,
              loop: false,
              currentIndex: dates.length - 1,
              data: dates,
              label: { color: '#9ca3af', fontSize: 10 },
              lineStyle: { color: '#374151' },
              checkpointStyle: { color: '#60a5fa', borderColor: '#1e3a8a' },
              controlStyle: {
                color: '#9ca3af',
                borderColor: '#9ca3af'
              },
              emphasis: {
                label: { color: '#e5e7eb' },
                controlStyle: { color: '#60a5fa', borderColor: '#60a5fa' }
              },
              bottom: 4
            },
            grid: { left: 64, right: 24, top: 56, bottom: 110 },
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(17,24,39,0.95)',
              borderColor: '#374151',
              textStyle: { color: '#e5e7eb' },
              formatter: function(p) {
                if (!p || !p.value) return '';
                var v = p.value[1];
                return '<b>' + p.name + '</b><br>' +
                  _benchmarkLabel(bid) + ': ' +
                  (typeof v === 'number' ? v.toFixed(1) : v);
              }
            },
            xAxis: {
              type: 'category',
              data: xLabels,
              axisLabel: { color: '#9ca3af', rotate: 35, fontSize: 10, interval: 0 },
              axisLine: { lineStyle: { color: '#4b5563' } },
              splitLine: { show: false }
            },
            yAxis: {
              type: 'value',
              name: 'Score (' + _benchmarkLabel(bid) + ')',
              nameLocation: 'middle',
              nameGap: 46,
              nameTextStyle: { color: '#9ca3af' },
              min: 0,
              axisLabel: { color: '#9ca3af' },
              axisLine: { lineStyle: { color: '#4b5563' } },
              splitLine: { lineStyle: { color: '#1f2937' } }
            }
          },
          options: options
        };

        chart.setOption(baseOption, true);
      });
    });
  }

  function renderTrajectoryReplay() {
    var section = _ensureMountPoint('agent-chart-trajectory-replay',
      'Score Trajectory Replay — Watch SOTA Evolve',
      'Animates score-over-time for top models on the selected benchmark. Use the play button to scrub through history.');
    if (!section) return;
    var savedBid = _loadState('trajectory-replay-bid', 'swe_bench_verified');
    _ensureBenchmarkSelect(section, 'agent-chart-trajectory-replay', savedBid,
      function(newBid) {
        _saveState('trajectory-replay-bid', newBid);
        _drawTrajectoryReplay(newBid);
      });
    var sel = document.getElementById('agent-chart-trajectory-replay-select');
    var bid = (sel && sel.value) || savedBid;
    _drawTrajectoryReplay(bid);
  }

  // ======================================================================
  // Widget 19 (Wave 6C5) — Edge SLM Utility Scatter (size × battery × score)
  //
  // Plots on-device SLMs as bubbles to help users pick the right model
  // for phone constraints. X = model size on disk (GB, log scale), Y =
  // battery % drained per 25 conversations (lower is better — flagged in
  // the axis label). Bubble color = vendor, bubble size = composite agent
  // score (small fallback if not in _composite()). Source citation URL
  // surfaced on hover. Battery values are sparse in the dataset; missing
  // ones are estimated from size_gb (calibrated against gemma-3-270m's
  // published 0.75% / 25 convos at 0.5 GB → ~1.5%/GB) and clearly tagged
  // as estimates in the tooltip.
  //
  // Fetches data/edge_models_utility.json directly because UTILITY_METRICS
  // is private inside the Agent IIFE. Result cached on
  // AgentCharts._edgeUtilityPromise.
  // ======================================================================
  function _edgeVendorColor(vendor) {
    var map = {
      'apple':     '#f472b6', // pink-400
      'google':    '#34d399', // emerald-400
      'meta':      '#60a5fa', // blue-400
      'microsoft': '#fbbf24', // amber-400
      'openai':    '#a78bfa', // violet-400
      'anthropic': '#f87171'  // red-400
    };
    return map[(vendor || '').toLowerCase()] || '#9ca3af'; // gray-400 fallback
  }

  function _edgeVendorOf(modelId) {
    if (!modelId) return '';
    var slash = modelId.indexOf('/');
    return slash > 0 ? modelId.slice(0, slash) : modelId;
  }

  function _edgeModelShortName(modelId) {
    var registered = _modelDisplayName(modelId);
    if (registered && registered !== modelId) return registered;
    // No registered model record — derive a readable label from the id.
    var slash = modelId.indexOf('/');
    return slash > 0 ? modelId.slice(slash + 1) : modelId;
  }

  function renderEdgeUtilityScatter() {
    _ensureMountPoint('agent-chart-edge-utility',
      'Edge SLM Utility — Size × Battery × Capability',
      'On-device models plotted by file size (X) and battery cost (Y). Bubble size = composite agent score. Source citations on hover.');
    if (typeof echarts === 'undefined') return;

    function getEdgeUtility() {
      AgentCharts._edgeUtilityPromise = AgentCharts._edgeUtilityPromise || (function() {
        var base = (window.location.pathname.indexOf('/dashboard/') !== -1) ? '../data' : 'data';
        return fetch(base + '/edge_models_utility.json')
          .then(function(r) { return r.ok ? r.json() : { models: {} }; })
          .catch(function() { return { models: {} }; });
      })();
      return AgentCharts._edgeUtilityPromise;
    }

    getEdgeUtility().then(function(data) {
      var mountEl = document.getElementById('agent-chart-edge-utility');
      if (!mountEl) return;

      var models = (data && data.models) || {};
      var keys = Object.keys(models);

      function _showEmpty(message) {
        if (Charts && Charts._instances && Charts._instances['agent-chart-edge-utility']) {
          try { Charts._instances['agent-chart-edge-utility'].dispose(); } catch (e) {}
          delete Charts._instances['agent-chart-edge-utility'];
        }
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = message;
        mountEl.appendChild(msg);
      }

      if (!keys.length) { _showEmpty('Edge utility data unavailable'); return; }

      // Composite-score lookup so bubble size can encode agentic capability.
      var compositeMap = {};
      var rows = _composite();
      for (var ci = 0; ci < rows.length; ci++) compositeMap[rows[ci].model_id] = rows[ci].agent_score;

      // Calibration: gemma-3-270m → 0.5 GB consumes 0.75% / 25 convos →
      // ~1.5 %/GB. Use this when battery_pct is missing.
      var BATTERY_PER_GB_ESTIMATE = 1.5;

      // Group points by vendor for legend coloring.
      var byVendor = {};
      var plotted = 0;

      for (var i = 0; i < keys.length; i++) {
        var mid = keys[i];
        var entry = models[mid] || {};
        var sizeGb = entry.size_gb;
        if (typeof sizeGb !== 'number' || sizeGb <= 0) continue; // X-axis required

        var vendor = _edgeVendorOf(mid);
        var battery = entry.battery_pct_per_25_conversations;
        var batteryEstimated = false;
        if (typeof battery !== 'number') {
          battery = sizeGb * BATTERY_PER_GB_ESTIMATE;
          batteryEstimated = true;
        }

        var score = compositeMap[mid];
        var hasScore = typeof score === 'number';
        // Bubble size: 10..40 for scored models, 8 fallback for unscored.
        var symbolSize = hasScore ? Math.max(10, Math.min(40, 8 + score * 0.35)) : 8;

        var label = _edgeModelShortName(mid);
        var point = {
          name: label,
          value: [sizeGb, battery, hasScore ? score : null],
          symbolSize: symbolSize,
          label: {
            show: true,
            position: 'top',
            distance: 6,
            color: '#e5e7eb',
            backgroundColor: 'rgba(17,24,39,0.85)',
            borderColor: '#4b5563',
            borderWidth: 1,
            borderRadius: 3,
            padding: [2, 4],
            fontSize: 10,
            formatter: label
          },
          _meta: {
            model_id: mid,
            vendor: vendor,
            size_gb: sizeGb,
            battery_pct: battery,
            battery_estimated: batteryEstimated,
            agent_score: hasScore ? score : null,
            citation: entry._source || ''
          }
        };

        if (!byVendor[vendor]) byVendor[vendor] = [];
        byVendor[vendor].push(point);
        plotted++;
      }

      if (!plotted) { _showEmpty('Edge utility data unavailable'); return; }

      var chart = Charts._getOrCreate('agent-chart-edge-utility');
      if (!chart) return;

      var vendorNames = Object.keys(byVendor).sort();
      var series = vendorNames.map(function(v) {
        return {
          name: v.charAt(0).toUpperCase() + v.slice(1),
          type: 'scatter',
          data: byVendor[v],
          itemStyle: { color: _edgeVendorColor(v), opacity: 0.85 },
          emphasis: { focus: 'series' }
        };
      });

      var opt = {
        backgroundColor: 'transparent',
        grid: { left: 70, right: 24, top: 30, bottom: 70 },
        legend: {
          bottom: 0,
          textStyle: { color: '#d1d5db' },
          data: series.map(function(s) { return s.name; })
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(17,24,39,0.95)',
          borderColor: '#374151',
          textStyle: { color: '#e5e7eb' },
          formatter: function(params) {
            var m = params.data && params.data._meta;
            if (!m) return params.name;
            var batteryStr = m.battery_pct.toFixed(2) + '% / 25 convos'
              + (m.battery_estimated ? ' (est. from size)' : '');
            var scoreStr = (m.agent_score == null) ? 'n/a (unscored)' : m.agent_score.toFixed(1);
            var citation = m.citation
              ? '<a href="' + m.citation + '" target="_blank" rel="noopener" style="color:#60a5fa">source</a>'
              : '—';
            var lines = [
              '<b>' + params.name + '</b>',
              'vendor: ' + (m.vendor || '—'),
              'size: ' + m.size_gb.toFixed(2) + ' GB',
              'battery: ' + batteryStr,
              'agent score: ' + scoreStr,
              'citation: ' + citation
            ];
            return lines.join('<br>');
          }
        },
        xAxis: {
          type: 'log',
          name: 'Model size (GB, log)',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: { color: '#9ca3af' },
          axisLabel: {
            color: '#9ca3af',
            formatter: function(v) { return v + ' GB'; }
          },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } },
          min: 0.3,
          max: 30
        },
        yAxis: {
          type: 'value',
          name: 'Battery % / 25 convos (lower is better)',
          nameLocation: 'middle',
          nameGap: 48,
          nameTextStyle: { color: '#9ca3af' },
          min: 0,
          axisLabel: {
            color: '#9ca3af',
            formatter: function(v) { return v.toFixed(1) + '%'; }
          },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } }
        },
        series: series,
        graphic: [{
          type: 'text',
          left: 8,
          bottom: 24,
          style: {
            text: 'Bubble size = composite agent score · battery values flagged "(est.)" derived from size × 1.5 %/GB',
            fill: '#9ca3af',
            fontSize: 10,
            fontStyle: 'italic'
          }
        }]
      };

      chart.setOption(_applyToolbox(opt), true);
    });
  }

  // ======================================================================
  // Widget 17 (Wave 6C3) — Multi-Source Confidence Intervals
  //
  // For (model, benchmark) pairs where the same pair appears across MULTIPLE
  // independent source URLs (current scores + history snapshots), compute the
  // min/max/median range. Widest-range pairs surface the most-disputed scores —
  // i.e., where vendor self-reports diverge from third-party leaderboards.
  //
  // Render as a horizontal dumbbell:
  //   - line connector from min → max
  //   - scatter dot at min (red), max (green), median (gray diamond)
  // Top 20 pairs by range desc; tooltip lists every source with its value.
  // Empty-state below 5 pairs prints an explanatory message instead.
  // ======================================================================
  function _confidenceSourceUrl(score) {
    if (!score) return '';
    var src = score.source;
    if (typeof src === 'string') return src;
    if (src && typeof src === 'object') return src.url || src.citation || '';
    return score.source_url || score.url || '';
  }

  function _collectMultiSourcePairs() {
    if (!(window.App && App.data && App.data.scores)) return [];
    // Bucket all observations by "model|benchmark"; each entry is {value, url, date}.
    var groups = {};
    function _ingest(arr) {
      if (!arr || !arr.length) return;
      for (var i = 0; i < arr.length; i++) {
        var s = arr[i];
        if (!s || !s.model_id || !s.benchmark_id) continue;
        var v = (typeof s.value === 'number') ? s.value : parseFloat(s.value);
        if (!isFinite(v)) continue;
        var url = _confidenceSourceUrl(s);
        var key = s.model_id + '|' + s.benchmark_id;
        if (!groups[key]) groups[key] = [];
        groups[key].push({ value: v, url: url || '(unknown)', date: s.collected_at || '' });
      }
    }
    _ingest(App.data.scores);
    if (App.data.history && typeof App.data.history === 'object') {
      for (var d in App.data.history) {
        if (!Object.prototype.hasOwnProperty.call(App.data.history, d)) continue;
        _ingest(App.data.history[d]);
      }
    }

    var pairs = [];
    for (var k in groups) {
      if (!Object.prototype.hasOwnProperty.call(groups, k)) continue;
      var obs = groups[k];
      // Distinct URLs (excluding empty/unknown placeholders).
      var urlSet = {};
      for (var oi = 0; oi < obs.length; oi++) {
        var u = obs[oi].url;
        if (u && u !== '(unknown)') urlSet[u] = true;
      }
      var urlCount = 0;
      for (var uk in urlSet) {
        if (Object.prototype.hasOwnProperty.call(urlSet, uk)) urlCount++;
      }
      if (urlCount < 2) continue;

      // Per-URL collapse: keep one observation per source URL (latest by date).
      // Avoids history snapshots inflating "agreement" via duplicate rows from
      // the same upstream URL re-ingested across dates.
      var bySource = {};
      for (var oj = 0; oj < obs.length; oj++) {
        var ob = obs[oj];
        if (!ob.url || ob.url === '(unknown)') continue;
        var prev = bySource[ob.url];
        if (!prev || (ob.date && ob.date > prev.date)) {
          bySource[ob.url] = ob;
        }
      }
      var perSource = [];
      for (var sk in bySource) {
        if (Object.prototype.hasOwnProperty.call(bySource, sk)) perSource.push(bySource[sk]);
      }
      if (perSource.length < 2) continue;

      var vals = perSource.map(function(o) { return o.value; }).sort(function(a, b) { return a - b; });
      var min = vals[0];
      var max = vals[vals.length - 1];
      var range = max - min;
      if (range < 1.0) continue;
      var med = (vals.length % 2 === 1)
        ? vals[(vals.length - 1) >> 1]
        : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;

      var parts = k.split('|');
      pairs.push({
        model_id: parts[0],
        benchmark_id: parts[1],
        min: min, max: max, median: med, range: range,
        sources: perSource
      });
    }
    pairs.sort(function(a, b) { return b.range - a.range; });
    return pairs;
  }

  function renderConfidenceIntervals() {
    var section = _ensureMountPoint('agent-chart-confidence-intervals',
      'Multi-Source Confidence Intervals — Where Reports Disagree',
      'For (model, benchmark) pairs with ≥2 independent sources, shows the min-max range. Wider bars = more disagreement.');
    if (!section) return;
    var mountEl = document.getElementById('agent-chart-confidence-intervals');
    if (!mountEl) return;

    var pairs = _collectMultiSourcePairs();
    var top = pairs.slice(0, 20);

    // Empty-state branch: insufficient multi-source data.
    if (top.length < 5) {
      if (window.Charts && Charts._instances && Charts._instances['agent-chart-confidence-intervals']) {
        try { Charts._instances['agent-chart-confidence-intervals'].dispose(); } catch (e) {}
        delete Charts._instances['agent-chart-confidence-intervals'];
      }
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full text-center px-6';
      msg.textContent = 'Insufficient multi-source data — most scores are single-attestation. '
        + 'This will fill in as more independent evaluations are added.';
      mountEl.appendChild(msg);
      return;
    }

    if (typeof echarts === 'undefined' || !window.Charts) return;
    // Clear leftover empty-state text node so ECharts can take the div.
    if (!Charts._instances || !Charts._instances['agent-chart-confidence-intervals']) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    }
    var chart = Charts._getOrCreate('agent-chart-confidence-intervals');
    if (!chart) return;

    // Y-axis label = "<model display name> / <benchmark name>".
    // ECharts category y-axis renders bottom-up; with `inverse: true` the
    // first item sits at the top — i.e., widest range at the top of the plot.
    var yLabels = top.map(function(p) {
      var m = _modelDisplayName(p.model_id);
      var b = _benchmarkLabel(p.benchmark_id);
      return m + ' / ' + b;
    });

    var minPoints = [];
    var maxPoints = [];
    var medianPoints = [];
    var lineSegments = [];

    for (var i = 0; i < top.length; i++) {
      var p = top[i];
      var datum = {
        model_id: p.model_id,
        benchmark_id: p.benchmark_id,
        min: p.min, max: p.max, median: p.median, range: p.range,
        sources: p.sources
      };
      minPoints.push({ value: [p.min, i], _meta: datum });
      maxPoints.push({ value: [p.max, i], _meta: datum });
      medianPoints.push({ value: [p.median, i], _meta: datum });
      lineSegments.push([
        { coord: [p.min, i] },
        { coord: [p.max, i] }
      ]);
    }

    function _ciTooltip(p) {
      if (!p || !p.data || !p.data._meta) return '';
      var d = p.data._meta;
      var name = _modelDisplayName(d.model_id);
      var bench = _benchmarkLabel(d.benchmark_id);
      var html = '<div style="font-size:11px;line-height:1.5;max-width:380px">'
        + '<b>' + name + '</b><br>'
        + bench + '<br>'
        + 'Range: <b>' + (Math.round(d.range * 10) / 10) + '</b> '
        + '(min ' + (Math.round(d.min * 10) / 10)
        + ' → max ' + (Math.round(d.max * 10) / 10)
        + ', median ' + (Math.round(d.median * 10) / 10) + ')<br>'
        + '<span style="color:#9ca3af">' + d.sources.length + ' sources:</span>'
        + '<ul style="margin:4px 0 0 14px;padding:0;color:#d1d5db">';
      var srcs = d.sources.slice().sort(function(a, b) { return b.value - a.value; });
      for (var si = 0; si < srcs.length; si++) {
        var s = srcs[si];
        var u = s.url || '(unknown)';
        var short = u;
        if (short.length > 60) short = short.slice(0, 57) + '…';
        html += '<li><b>' + (Math.round(s.value * 10) / 10) + '</b> — '
             + '<span style="color:#9ca3af">' + short + '</span></li>';
      }
      html += '</ul></div>';
      return html;
    }

    var option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: _ciTooltip
      },
      legend: {
        top: 4,
        textStyle: { color: '#d1d5db', fontSize: 11 },
        data: [
          { name: 'Min',    icon: 'circle',  itemStyle: { color: '#ef4444' } },
          { name: 'Median', icon: 'diamond', itemStyle: { color: '#9ca3af' } },
          { name: 'Max',    icon: 'circle',  itemStyle: { color: '#10b981' } }
        ]
      },
      grid: { left: 240, right: 32, top: 40, bottom: 50 },
      xAxis: {
        type: 'value',
        min: 0, max: 100,
        name: 'Score',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: '#9ca3af', fontSize: 11 },
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } }
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        inverse: true,
        axisLabel: {
          color: '#d1d5db', fontSize: 11,
          formatter: function(v) { return (v && v.length > 38) ? v.slice(0, 36) + '…' : v; }
        },
        axisLine: { lineStyle: { color: '#4b5563' } },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: '#1f2937', type: 'dashed' } }
      },
      series: [
        {
          name: 'range',
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          silent: true,
          lineStyle: { color: '#475569', width: 4, opacity: 0.7 },
          data: lineSegments,
          z: 1
        },
        {
          name: 'Min',
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: { color: '#ef4444', borderColor: '#0f172a', borderWidth: 1 },
          data: minPoints,
          z: 3
        },
        {
          name: 'Median',
          type: 'scatter',
          symbol: 'diamond',
          symbolSize: 10,
          itemStyle: { color: '#9ca3af', borderColor: '#0f172a', borderWidth: 1 },
          data: medianPoints,
          z: 3
        },
        {
          name: 'Max',
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: { color: '#10b981', borderColor: '#0f172a', borderWidth: 1 },
          data: maxPoints,
          z: 3
        }
      ]
    };

    chart.setOption(_applyToolbox(option), true);
  }

  // ======================================================================
  // Top-level render — called from Agent.render() after _renderCompare.
  // Each widget renders independently; one failing must not break the
  // others, hence the per-call try/catch.
  // ======================================================================
  function renderAll() {
    // Above-the-fold widgets render synchronously to fill the visible viewport
    // immediately. The remaining 12 widgets are deferred to the next idle frame
    // so the initial paint isn't blocked by ~12 ECharts.init + setOption calls.
    // requestIdleCallback gives the browser room to settle layout before we
    // stack more chart work; setTimeout is the fallback for Safari < 17 etc.
    var eagerFns = [
      renderCostScatter,
      renderCapabilityHeatmap,
      renderCategoryRadar,
      renderClassDotPlot
    ];
    for (var i = 0; i < eagerFns.length; i++) {
      try { eagerFns[i](); } catch (e) {
        if (window.console) console.warn('[AgentCharts] eager widget failed:', eagerFns[i].name || i, e);
      }
    }
    var lazyFns = [
      renderSOTATimeline,
      renderVendorMatrix,
      renderClassViolin,
      renderProviderAvailability,
      renderCapabilitySankey,
      renderCumulativeSOTAWins,
      renderAgentWizard,
      renderCostSimulator,
      renderVendorCoverageMatrix,
      renderTrajectoryReplay,
      renderEdgeUtilityScatter,
      renderConfidenceIntervals
    ];
    function _runLazy() {
      for (var i = 0; i < lazyFns.length; i++) {
        try { lazyFns[i](); } catch (e) {
          if (window.console) console.warn('[AgentCharts] lazy widget failed:', lazyFns[i].name || i, e);
        }
      }
    }
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(_runLazy, { timeout: 1500 });
    } else {
      setTimeout(_runLazy, 50);
    }
    // Widget 7 hooks the leaderboard renderer; that integration lives in agent.js.
  }

  return {
    renderAll: renderAll,
    // Individual exports so agents implementing Phase 2 can target their widget.
    renderCostScatter: renderCostScatter,
    renderCapabilityHeatmap: renderCapabilityHeatmap,
    renderCategoryRadar: renderCategoryRadar,
    renderClassDotPlot: renderClassDotPlot,
    renderSOTATimeline: renderSOTATimeline,
    renderVendorMatrix: renderVendorMatrix,
    renderFingerprintsInLeaderboard: renderFingerprintsInLeaderboard,
    renderClassViolin: renderClassViolin,
    renderProviderAvailability: renderProviderAvailability,
    renderCapabilitySankey: renderCapabilitySankey,
    renderCumulativeSOTAWins: renderCumulativeSOTAWins,
    renderAgentWizard: renderAgentWizard,
    renderRecommendationBreakdown: renderRecommendationBreakdown,
    renderCostSimulator: renderCostSimulator,
    renderVendorCoverageMatrix: renderVendorCoverageMatrix,
    renderTrajectoryReplay: renderTrajectoryReplay,
    renderEdgeUtilityScatter: renderEdgeUtilityScatter,
    renderConfidenceIntervals: renderConfidenceIntervals,
    // Helpers exported for widgets to reuse.
    _scoresFor: _scoresFor,
    _modelDisplayName: _modelDisplayName,
    _vendorOf: _vendorOf,
    _modelClass: _modelClass,
    _classColor: _classColor,
    _ensureMountPoint: _ensureMountPoint
  };
})();
