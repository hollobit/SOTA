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
  // Widget 1 — Cost vs Performance Scatter (filled in Phase 2)
  // Stub: mount point is created so the integration agent only edits the
  // implementation body, not the section structure.
  // ======================================================================
  function renderCostScatter() {
    _ensureMountPoint('agent-chart-cost-scatter',
      'Cost vs Performance Scatter',
      'Composite Agent Score (Y) vs cost per 1M output tokens (X, log scale). Bubble color = class, size = coverage. Pareto frontier highlighted.');
    // implementation body: Phase 2 Agent A
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
