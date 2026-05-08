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
    var out = [];
    for (var i = 0; i < App.data.scores.length; i++) {
      if (App.data.scores[i].benchmark_id === benchmarkId) out.push(App.data.scores[i]);
    }
    return out;
  }

  function _modelDisplayName(modelId) {
    if (!window.App || !App.data || !App.data.models) return modelId;
    for (var i = 0; i < App.data.models.length; i++) {
      if (App.data.models[i].id === modelId) return App.data.models[i].name || modelId;
    }
    return modelId;
  }

  function _vendorOf(modelId) {
    if (!window.App || !App.data || !App.data.models) return '';
    for (var i = 0; i < App.data.models.length; i++) {
      if (App.data.models[i].id === modelId) return App.data.models[i].vendor || '';
    }
    return '';
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
  function _ensureMountPoint(id, title, hint) {
    var host = document.getElementById('agent-charts');
    if (!host) return null;
    var existing = document.getElementById(id + '-section');
    if (existing) return existing;
    var section = document.createElement('div');
    section.id = id + '-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var h = document.createElement('h2');
    h.className = 'text-lg font-semibold text-gray-200 mb-1';
    h.textContent = title;
    section.appendChild(h);

    if (hint) {
      var p = document.createElement('p');
      p.className = 'text-xs text-gray-500 mb-3';
      p.textContent = hint;
      section.appendChild(p);
    }

    var chart = document.createElement('div');
    chart.id = id;
    chart.className = 'w-full';
    chart.style.height = '420px';
    section.appendChild(chart);

    host.appendChild(section);
    return section;
  }

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

      var series = [
        {
          name: 'Frontier',
          type: 'scatter',
          data: priced.filter(function(p) { return p.klass === 'frontier'; }).map(_bubble),
          emphasis: { focus: 'series' }
        },
        {
          name: 'Agent-Product',
          type: 'scatter',
          data: priced.filter(function(p) { return p.klass === 'agent-product'; }).map(_bubble),
          emphasis: { focus: 'series' }
        },
        {
          name: 'Edge-SLM',
          type: 'scatter',
          data: edge.map(_bubble),
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

      chart.setOption(opt, true);
    });
  }

  // ======================================================================
  // Widget 2 — Capability Heatmap (models × benchmarks)
  // ======================================================================
  function renderCapabilityHeatmap() {
    _ensureMountPoint('agent-chart-heatmap',
      'Capability Heatmap',
      'Top 20 agents (rows) × 12 core agentic benchmarks (cols). Cell color = normalized score 0–100.');
    // implementation body: Phase 2 Agent B
  }

  // ======================================================================
  // Widget 3 — Per-category Radar (interactive agent picker)
  // State persists across re-renders so toggles survive ECharts dispose.
  // ======================================================================
  var _radarState = { categoryKey: 'coding', selectedAgents: null };
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

    chart.setOption({
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
    }, true);
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

    chart.setOption({
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
    }, true);
  }

  // ======================================================================
  // Widget 5 — SOTA Timeline / Handover Log (per benchmark)
  // ======================================================================
  function renderSOTATimeline() {
    _ensureMountPoint('agent-chart-sota-timeline',
      'SOTA Timeline (Agent benchmarks)',
      'Step plot of SOTA holder over time on a selected agentic benchmark. Drawn from data/scores/history snapshots.');
    // implementation body: Phase 2 Agent E
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

    chart.setOption({
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
    }, true);
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
    }
  }

  // ======================================================================
  // Widget 8 — Score Distribution Violin (per class)
  // ======================================================================
  function renderClassViolin() {
    _ensureMountPoint('agent-chart-class-violin',
      'Score Distribution by Class',
      'Three violins (Frontier / Agent-Product / Edge) for a selected benchmark. Shows median, spread, outliers — answers whether the gap is systematic or benchmark-specific.');
    // implementation body: Phase 2 Agent E
  }

  // ======================================================================
  // Top-level render — called from Agent.render() after _renderCompare.
  // Each widget renders independently; one failing must not break the
  // others, hence the per-call try/catch.
  // ======================================================================
  function renderAll() {
    var fns = [
      renderCostScatter,
      renderCapabilityHeatmap,
      renderCategoryRadar,
      renderClassDotPlot,
      renderSOTATimeline,
      renderVendorMatrix,
      renderClassViolin
    ];
    for (var i = 0; i < fns.length; i++) {
      try { fns[i](); } catch (e) {
        if (window.console) console.warn('[AgentCharts] widget failed:', fns[i].name || i, e);
      }
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
    // Helpers exported for widgets to reuse.
    _scoresFor: _scoresFor,
    _modelDisplayName: _modelDisplayName,
    _vendorOf: _vendorOf,
    _modelClass: _modelClass,
    _classColor: _classColor,
    _ensureMountPoint: _ensureMountPoint
  };
})();
