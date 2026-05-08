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
  // ======================================================================
  function renderCategoryRadar() {
    _ensureMountPoint('agent-chart-radar',
      'Category Radar',
      'Per-category capability profile. Pick a category and up to 5 agents to overlay polygons.');
    // implementation body: Phase 2 Agent C
  }

  // ======================================================================
  // Widget 4 — Frontier-Product-Edge Diverging Dot Plot
  // ======================================================================
  function renderClassDotPlot() {
    _ensureMountPoint('agent-chart-classplot',
      'Frontier vs Agent-Product vs Edge — per benchmark',
      'For each benchmark, shows the best Frontier / Agent-Product / Edge score. Connecting line visualizes the "scaffolding tax" / "edge gap".');
    // implementation body: Phase 2 Agent D
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
    // implementation body: Phase 2 Agent D
  }

  // ======================================================================
  // Widget 7 — Capability Fingerprint (mini-radar in leaderboard rows)
  // Distinctly: this hooks into the existing leaderboard table renderer in
  // agent.js — not a top-level chart section. Marked as a no-op here so the
  // implementation sits in agent.js _renderLeaderboard.
  // ======================================================================
  function renderFingerprintsInLeaderboard() {
    // implementation body: Phase 2 Agent C — adds a 60x60 radar canvas to
    // each existing leaderboard <tr> via Agent._afterLeaderboardRender hook.
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
