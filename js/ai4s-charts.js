/**
 * AI4S tab — graphical widgets (10 ECharts/DOM visualisations).
 *
 * Mirrors dashboard/js/agent-charts.js patterns:
 *   - UMD module exposing AI4SCharts.renderAll() + per-widget renderers
 *   - _ensureMountPoint factory creates sections inside #ai4s-charts
 *   - Charts._getOrCreate factory for ECharts dark-theme instances
 *   - No innerHTML; createElement/textContent/appendChild only
 *
 * Loaded after ai4s.js. Render is invoked from AI4S.render() at the end.
 */
(function(root) {
  'use strict';

  // ====================================================================
  // Lab taxonomy. Resolves model IDs to the research lab that produced
  // them. Hardcoded at commit time — reviewed when new AI4S models are
  // ingested. Models whose prefix doesn't match fall into 'other' bucket.
  // ====================================================================
  var _LAB_MAP = [
    { key: 'deepmind',     label: 'DeepMind',
      prefixes: ['deepmind/', 'deepmind-cfs/', 'deepmind-doe/'] },
    { key: 'mit-cfs',      label: 'MIT (CFS)',
      prefixes: ['mit-cfs/'] },
    { key: 'argonne',      label: 'Argonne (ANL)',
      prefixes: ['anl/', 'argonne/'] },
    { key: 'fair',         label: 'Meta FAIR',
      prefixes: ['meta/', 'fair/', 'meta-fair/'] },
    { key: 'nvidia',       label: 'NVIDIA',
      prefixes: ['nvidia/', 'nvidia-clara/', 'physicsnemo/'] },
    { key: 'ibm',          label: 'IBM',
      prefixes: ['ibm/', 'ibm-lf/'] },
    { key: 'microsoft',    label: 'Microsoft',
      prefixes: ['microsoft/', 'msft-inl/', 'msft/'] },
    { key: 'isomorphic',   label: 'Isomorphic Labs',
      prefixes: ['isomorphic/'] },
    { key: 'openai',       label: 'OpenAI',
      prefixes: ['openai/'] },
    { key: 'anthropic',    label: 'Anthropic',
      prefixes: ['anthropic/'] },
    { key: 'google',       label: 'Google Research',
      prefixes: ['google/', 'google-jku/'] },
    { key: 'ecmwf',        label: 'ECMWF',
      prefixes: ['ecmwf/'] },
    { key: 'ornl',         label: 'ORNL',
      prefixes: ['ornl/'] },
    { key: 'cmu',          label: 'CMU',
      prefixes: ['cmu/'] },
    { key: 'arc-institute', label: 'Arc Institute',
      prefixes: ['arc-institute/', 'arc-institute-stanford/'] },
    { key: 'futurehouse',  label: 'FutureHouse',
      prefixes: ['futurehouse/'] }
  ];
  var _OTHER_LAB = { key: 'other', label: 'Other', prefixes: [] };

  function _resolveLab(modelId) {
    if (!modelId) return _OTHER_LAB;
    for (var i = 0; i < _LAB_MAP.length; i++) {
      var lab = _LAB_MAP[i];
      for (var j = 0; j < lab.prefixes.length; j++) {
        if (modelId.indexOf(lab.prefixes[j]) === 0) return lab;
      }
    }
    return _OTHER_LAB;
  }

  // ====================================================================
  // Benchmark → AI4S category mapping. Used by W5 (per-domain modal
  // filters benchmarks to that domain) and W10 (catalog domain filter).
  // Domain keys must match AI4S._CATEGORIES keys (see dashboard/js/ai4s.js).
  // ====================================================================
  var _BENCHMARK_DOMAIN_MAP = {
    // bio-genomics
    'casp16_gdt':                'bio-genomics',
    'casp15_gdt':                'bio-genomics',
    'casp14_gdt':                'bio-genomics',
    'casp13_gdt':                'bio-genomics',
    'casp12_gdt':                'bio-genomics',
    'alphafold3_pae':            'bio-genomics',
    'protein_binding':           'bio-genomics',
    'chai2_pae':                 'bio-genomics',
    'evo2_zeroshot':             'bio-genomics',
    // math
    'math':                      'math',
    'math_500':                  'math',
    'math_level5':               'math',
    'imo_answerbench':           'math',
    'imoanswerbench':            'math',
    'imo_2024':                  'math',
    'imo_2025':                  'math',
    'frontiermath':              'math',
    'frontiermath_t4':           'math',
    'matharena_apex':            'math',
    'matharena_arxivmath':       'math',
    'matharena_arxivlean':       'math',
    'matharena_brokenarxiv':     'math',
    'matharena_brumo_2025':      'math',
    'matharena_final_answer':    'math',
    'matharena_project_euler':   'math',
    'matharena_visualmath':      'math',
    'mathvision':                'math',
    'math_vision':               'math',
    'mathvista':                 'math',
    'mathvista_mini':            'math',
    'putnambench':               'math',
    'cmath':                     'math',
    't_math':                    'math',
    'wemath':                    'math',
    // physics-materials
    'matbench_discovery_mae':    'physics-materials',
    'matbench_discovery_f1':     'physics-materials',
    'mattergen_yield':           'physics-materials',
    'alphaqubit_decoder_acc':    'physics-materials',
    // geo-climate
    'aurora_rmse':               'geo-climate',
    'graphcast_rmse':            'geo-climate',
    'pangu_rmse':                'geo-climate',
    'aifs_rmse':                 'geo-climate',
    'weatherbench_z500_72h':     'geo-climate',
    'weatherbench_2_ifs_targets':'geo-climate',

    // 2026-05 SDE family (Section 43) — Scientific Discovery Evaluation
    'sde_avg':                   'math',  // multi-domain composite, but math-anchored eval framework
    'sde_hard':                  'math',
    'sde_biology':               'bio-genomics',
    'sde_chemistry':             'physics-materials',
    'sde_materials':             'physics-materials',
    'sde_physics':               'physics-materials',
    'sde_protein_design':        'bio-genomics',
    'sde_gene_editing':          'bio-genomics',
    'sde_retrosynthesis':        'physics-materials',
    'sde_molecule_optimization': 'physics-materials',
    'sde_tmc_optimization':      'physics-materials',
    'sde_crystal_design':        'physics-materials',
    'sde_ising_model':           'physics-materials',
    'sde_symbolic_regression':   'math',

    // 2026-05-15 SciFM batch (Section 44)
    'posebusters_v2':            'bio-genomics',
    'bhrf1_binder':              'bio-genomics',
    'tdc_66_vs_genrlst':         'bio-genomics',
    'tdc_66_vs_specialist':      'bio-genomics',
    'esmgfp_sequence_identity':  'bio-genomics',
    'oc20_s2ef_force_mae':       'physics-materials',
    'oc20_s2ef_energy_mae':      'physics-materials'
  };

  function _resolveDomain(benchmarkId) {
    if (!benchmarkId) return null;
    return Object.prototype.hasOwnProperty.call(_BENCHMARK_DOMAIN_MAP, benchmarkId)
      ? _BENCHMARK_DOMAIN_MAP[benchmarkId]
      : null;
  }

  // ====================================================================
  // Style block — mobile + a11y. Inject once on first mount.
  // ====================================================================
  function _ensureAi4sChartsStyle() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('ai4s-charts-style')) return;
    var s = document.createElement('style');
    s.id = 'ai4s-charts-style';
    s.textContent = [
      '@media (max-width: 768px) {',
      '  .ai4s-chart-mount { height: 320px !important; }',
      '  .ai4s-chart-mount canvas { max-width: 100% !important; }',
      '  #ai4s-charts h2 { font-size: 1rem !important; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .ai4s-chart-mount * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }',
      '}',
      '.ai4s-chart-mount:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ====================================================================
  // Mount-point factory. Each widget calls this to lazily create its
  // section inside #ai4s-charts. Idempotent — safe to call repeatedly.
  // ====================================================================
  function _ensureMountPoint(id, title, hint) {
    if (typeof document === 'undefined') return null;
    _ensureAi4sChartsStyle();
    var host = document.getElementById('ai4s-charts');
    if (!host) return null;
    var existing = document.getElementById(id + '-section');
    if (existing) return existing;
    var section = document.createElement('div');
    section.id = id + '-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var headRow = document.createElement('div');
    headRow.className = 'flex items-center mb-1';
    var h = document.createElement('h2');
    h.className = 'text-lg font-semibold text-gray-200';
    h.textContent = title;
    headRow.appendChild(h);
    if (hint) {
      var info = document.createElement('span');
      info.className = 'ml-2 text-gray-500 hover:text-blue-400 cursor-help text-sm';
      info.textContent = 'ⓘ';
      info.title = hint;
      headRow.appendChild(info);
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
    chart.className = 'w-full ai4s-chart-mount';
    chart.style.height = '420px';
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Chart: ' + title + (hint ? ' — ' + hint : ''));
    chart.setAttribute('tabindex', '0');
    section.appendChild(chart);
    host.appendChild(section);
    return section;
  }

  // ====================================================================
  // Toolbox helper (PNG export + dataView + restore). Mirrors agent-charts.
  // ====================================================================
  function _applyToolbox(opt) {
    opt.toolbox = opt.toolbox || {
      right: 12, top: 8,
      iconStyle: { borderColor: '#9ca3af' },
      feature: {
        saveAsImage: { backgroundColor: '#0f172a' },
        dataView: { readOnly: true, backgroundColor: '#0f172a',
          textareaColor: '#1f2937', textareaBorderColor: '#374151',
          textColor: '#e5e7eb' },
        restore: {}
      }
    };
    return opt;
  }

  // ====================================================================
  // W2 — Lab × Domain bubble matrix.
  // Rows: 16 labs (incl. 'other'). Cols: 19 domains from AI4S._CATEGORIES.
  // Cell value: count of distinct AI4S models from that lab in that domain.
  // ====================================================================
  function _ai4sCategories() {
    if (typeof window === 'undefined') return [];
    if (typeof window.AI4S !== 'undefined' && window.AI4S._CATEGORIES) return window.AI4S._CATEGORIES;
    return [];
  }

  function _ai4sModels() {
    if (typeof window === 'undefined') return [];
    if (typeof window.AI4S !== 'undefined' && typeof window.AI4S._getAI4SModels === 'function') {
      return window.AI4S._getAI4SModels(); // [{model, category}]
    }
    return [];
  }

  function renderLabDomainMatrix() {
    _ensureMountPoint('ai4s-chart-lab-domain',
      'Lab × Domain Coverage',
      'Which research labs work on which AI4S domains. Cell value = number of distinct models.');
    if (typeof echarts === 'undefined') return;
    var mountEl = document.getElementById('ai4s-chart-lab-domain');
    if (!mountEl) return;

    var categories = _ai4sCategories();
    var entries = _ai4sModels();
    if (!categories.length || !entries.length) return;

    var labOrder = _LAB_MAP.map(function(l) { return l.key; }).concat(['other']);
    var labLabel = {}; _LAB_MAP.forEach(function(l) { labLabel[l.key] = l.label; });
    labLabel['other'] = 'Other';

    var domainKeys = categories.map(function(c) { return c.key; });
    var domainLabel = {}; categories.forEach(function(c) { domainLabel[c.key] = c.label; });

    var counts = {};
    entries.forEach(function(e) {
      var lab = _resolveLab(e.model.id).key;
      var dom = e.category.key;
      var k = lab + '|' + dom;
      counts[k] = (counts[k] || 0) + 1;
    });

    var data = [];
    var maxV = 0;
    for (var li = 0; li < labOrder.length; li++) {
      for (var di = 0; di < domainKeys.length; di++) {
        var v = counts[labOrder[li] + '|' + domainKeys[di]] || 0;
        data.push([di, li, v === 0 ? '-' : v]);
        if (v > maxV) maxV = v;
      }
    }

    if (maxV === 0) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
      msg.textContent = 'No AI4S models loaded — ensure App.data is populated';
      mountEl.appendChild(msg);
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-lab-domain');
    if (!chart) return;

    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 110, right: 24, top: 30, bottom: 80 },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          return '<b>' + (labLabel[labOrder[p.value[1]]] || '?') + '</b><br>' +
            (domainLabel[domainKeys[p.value[0]]] || '?') + '<br>' +
            'Models: ' + (p.value[2] === '-' ? 0 : p.value[2]);
        }
      },
      xAxis: {
        type: 'category',
        data: domainKeys.map(function(k) { return domainLabel[k] || k; }),
        axisLabel: { color: '#9ca3af', rotate: 45, fontSize: 9 },
        axisLine: { lineStyle: { color: '#4b5563' } }
      },
      yAxis: {
        type: 'category',
        data: labOrder.map(function(k) { return labLabel[k] || k; }),
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
        name: 'Models',
        type: 'heatmap',
        data: data,
        label: { show: true, color: '#0f172a', fontSize: 9 },
        emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(96,165,250,0.6)' } }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // W4 — Breakthrough Timeline. Year × milestone scatter, color = domain.
  // ====================================================================
  function renderBreakthroughTimeline() {
    _ensureMountPoint('ai4s-chart-breakthrough-timeline',
      'Breakthrough Timeline',
      'When each AI4S milestone landed. Y-axis groups by milestone; color shows domain.');
    if (typeof echarts === 'undefined') return;
    var mountEl = document.getElementById('ai4s-chart-breakthrough-timeline');
    if (!mountEl) return;

    var chart = Charts._getOrCreate('ai4s-chart-breakthrough-timeline');
    if (!chart) return;

    var domains = {};
    _BREAKTHROUGHS.forEach(function(b) {
      if (!domains[b.domain]) domains[b.domain] = [];
      domains[b.domain].push(b);
    });

    var labels = _BREAKTHROUGHS.map(function(b) { return b.title; });
    var series = Object.keys(domains).map(function(d) {
      return {
        name: d,
        type: 'scatter',
        symbolSize: 22,
        data: domains[d].map(function(b) {
          return { value: [b.year, labels.indexOf(b.title)], _meta: b };
        }),
        itemStyle: { color: _domainColor(d) },
        label: {
          show: true, position: 'right', color: '#d1d5db', fontSize: 10,
          formatter: function(p) { return p.data._meta.value; }
        }
      };
    });

    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 130, right: 80, top: 30, bottom: 50 },
      legend: { bottom: 0, textStyle: { color: '#d1d5db' }, data: Object.keys(domains) },
      tooltip: {
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var b = p.data._meta;
          return '<b>' + b.title + '</b><br>' + b.narrative + '<br>' +
            '<span style="color:#60a5fa">' + b.value + '</span> · ' + b.domain + ' · ' + b.year +
            '<br><a href="' + b.source_url + '" target="_blank" style="color:#9ca3af;font-size:10px">source ↗</a>';
        }
      },
      xAxis: {
        type: 'value', min: 2017, max: 2026, interval: 1,
        name: 'Year', nameLocation: 'middle', nameGap: 28,
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af', formatter: '{value}' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } }
      },
      yAxis: {
        type: 'category', data: labels, inverse: true,
        axisLabel: { color: '#9ca3af', fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } }
      },
      series: series
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // Helpers — score lookup + release date.
  // (These are also used by W3/W7/W8/W9 in Phase 2.)
  // ====================================================================
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

  // ====================================================================
  // W6 — Math Progression Curve. Multi-line: math benchmarks vs release date.
  // ====================================================================
  function renderMathProgression() {
    _ensureMountPoint('ai4s-chart-math-progression',
      'Math Benchmark Progression',
      'Multi-line: each math benchmark over time. X = model release date, Y = score.');
    if (typeof echarts === 'undefined') return;

    var benches = ['math', 'math_500', 'imo_answerbench', 'frontiermath',
                   'matharena_apex', 'mathvision', 'matharena_final_answer'];

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

    var mountEl = document.getElementById('ai4s-chart-math-progression');
    if (!Object.keys(seriesByBench).length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No math scores loaded — verify App.data.scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-math-progression');
    if (!chart) return;

    var palette = ['#a78bfa', '#60a5fa', '#34d399', '#f59e0b', '#fb7185', '#22d3ee', '#fbbf24'];
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

  // ====================================================================
  // W10 — Benchmark Catalog Grid. DOM table with domain filter + search.
  // ====================================================================
  function renderBenchmarkCatalog() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('ai4s-charts');
    if (!host) return;
    var existing = document.getElementById('ai4s-bench-catalog-section');
    if (existing) return; // idempotent
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.benchmarks) return;

    var domainBenches = Object.keys(_BENCHMARK_DOMAIN_MAP);
    var rows = window.App.data.benchmarks
      .filter(function(b) { return domainBenches.indexOf(b.id) !== -1; })
      .map(function(b) {
        var n = _scoresFor(b.id).length;
        return {
          id: b.id,
          name: b.name || b.id,
          domain: _BENCHMARK_DOMAIN_MAP[b.id] || '?',
          n: n,
          paper: b.paper_url || b.url || ''
        };
      })
      .sort(function(a, b) { return b.n - a.n; });

    if (!rows.length) return;

    var section = document.createElement('div');
    section.id = 'ai4s-bench-catalog-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'AI4S Benchmark Catalog';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Searchable list of AI4S-tagged benchmarks. Click a row icon to open paper.';
    section.appendChild(sub);

    var searchRow = document.createElement('div');
    searchRow.className = 'flex gap-2 mb-2';
    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Filter by name or domain…';
    search.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs flex-1 text-gray-200';
    searchRow.appendChild(search);
    section.appendChild(searchRow);

    var table = document.createElement('table');
    table.className = 'w-full text-xs';
    var thead = document.createElement('thead');
    var trH = document.createElement('tr');
    trH.className = 'text-gray-400';
    ['Benchmark', 'Domain', 'Scores', 'Paper'].forEach(function(t) {
      var th = document.createElement('th');
      th.className = 'text-left px-2 py-1';
      th.textContent = t;
      trH.appendChild(th);
    });
    thead.appendChild(trH);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');

    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.className = 'border-t border-gray-800';
      tr.dataset.search = (r.name + ' ' + r.id + ' ' + r.domain).toLowerCase();

      var tdName = document.createElement('td');
      tdName.className = 'px-2 py-1 text-gray-200';
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      var tdDom = document.createElement('td');
      tdDom.className = 'px-2 py-1';
      var pill = document.createElement('span');
      pill.className = 'px-1.5 py-0.5 rounded text-[10px]';
      pill.style.background = _domainColor(r.domain) + '33';
      pill.style.color = _domainColor(r.domain);
      pill.textContent = r.domain;
      tdDom.appendChild(pill);
      tr.appendChild(tdDom);

      var tdN = document.createElement('td');
      tdN.className = 'px-2 py-1 tabular-nums text-gray-400';
      tdN.textContent = String(r.n);
      tr.appendChild(tdN);

      var tdP = document.createElement('td');
      tdP.className = 'px-2 py-1';
      if (r.paper) {
        var a = document.createElement('a');
        a.href = r.paper;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'text-blue-400 hover:underline';
        a.textContent = '↗';
        tdP.appendChild(a);
      } else {
        tdP.textContent = '—';
        tdP.className += ' text-gray-600';
      }
      tr.appendChild(tdP);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    section.appendChild(table);

    search.addEventListener('input', function() {
      var q = search.value.toLowerCase().trim();
      var trs = tbody.querySelectorAll('tr');
      for (var i = 0; i < trs.length; i++) {
        trs[i].style.display = (!q || trs[i].dataset.search.indexOf(q) !== -1) ? '' : 'none';
      }
    });

    host.appendChild(section);
  }

  // ====================================================================
  // W3 — Frontier vs Specialist Compare. Grouped bar.
  // For each math benchmark, show frontier LLM vs domain specialist.
  // ====================================================================
  var _FRONTIER_IDS_FOR_W3 = [
    'openai/gpt-5.5', 'anthropic/claude-opus-4.7', 'google/gemini-3.1-pro',
    'xai/grok-4.20', 'deepseek/deepseek-v4-pro'
  ];
  var _SPECIALIST_IDS_FOR_W3 = [
    // Math specialists — scored on PutnamBench (Lean theorem proving)
    // + MiniF2F (Olympiad theorem prove) + ProofNet + IMO-ProofBench
    'deepseek/deepseek-math-v2',           // Putnam 2024 98.33% / IMO 2025 35/42 / IMO-ProofBench-Basic 99
    'deepseek/deepseek-prover-v2-671b',    // PutnamBench 7.45 / MiniF2F 88.9 / ProofNet 37.1
    'deepseek/deepseek-prover-v2-7b',      // MiniF2F 82.0 / ProofNet 29.6 / PutnamBench 1.67
    'goedel-lm/goedel-prover-v2-32b',      // MiniF2F 90.4 / PutnamBench 13.03
    'princeton/goedel-prover-v2-8b',       // MiniF2F 86.7
    'deepmind/alphaproof', 'deepmind/alphageometry-2',  // IMO 2024 silver (qualitative)
    'deepmind/gemini-3-deep-think'          // IMO 2025 35/42
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

  function renderFrontierVsSpecialist() {
    _ensureMountPoint('ai4s-chart-frontier-vs-specialist',
      'Frontier LLM vs Domain Specialist',
      'Frontier general-purpose models vs domain specialists on shared benchmarks.');
    if (typeof echarts === 'undefined') return;

    var benches = ['math_500', 'imo_answerbench', 'frontiermath', 'matharena_apex',
                   'mathvision', 'putnambench'];
    var labels = []; var fr = []; var sp = [];
    benches.forEach(function(bid) {
      var f = _avgScoreForGroup(_FRONTIER_IDS_FOR_W3, bid);
      var s = _avgScoreForGroup(_SPECIALIST_IDS_FOR_W3, bid);
      if (f === null && s === null) return;
      labels.push(bid);
      fr.push(f === null ? null : Math.round(f * 10) / 10);
      sp.push(s === null ? null : Math.round(s * 10) / 10);
    });

    var mountEl = document.getElementById('ai4s-chart-frontier-vs-specialist');
    if (!labels.length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No shared benchmarks have both frontier + specialist scores yet';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-frontier-vs-specialist');
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
        { name: 'Domain Specialist (avg)', type: 'bar', data: sp, itemStyle: { color: '#a78bfa' } }
      ]
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // W5 — Per-Domain Mini-Leaderboard Modal. Opened from domain card Shift+click.
  // ====================================================================
  function _domainBenchmarks(domainKey) {
    var out = [];
    Object.keys(_BENCHMARK_DOMAIN_MAP).forEach(function(bid) {
      if (_BENCHMARK_DOMAIN_MAP[bid] === domainKey) out.push(bid);
    });
    return out;
  }

  function _perDomainComposite(modelId, benchmarkIds) {
    if (!benchmarkIds || !benchmarkIds.length) return null;
    var sum = 0; var cov = 0;
    for (var i = 0; i < benchmarkIds.length; i++) {
      var rows = _scoresFor(benchmarkIds[i]);
      var maxV = 0; var mine = null;
      for (var j = 0; j < rows.length; j++) {
        var r = rows[j];
        if (typeof r.value !== 'number') continue;
        if (r.value > maxV) maxV = r.value;
        if (r.model_id === modelId) mine = r.value;
      }
      if (mine !== null && maxV > 0) {
        sum += (mine / maxV) * 100;
        cov++;
      }
    }
    return cov >= 1 ? { score: sum / cov, coverage: cov } : null;
  }

  function openDomainLeaderboard(domainKey) {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    var benches = _domainBenchmarks(domainKey);
    if (!benches.length || !window.App || !window.App.data || !window.App.data.models) {
      if (typeof console !== 'undefined') console.warn('[AI4SCharts] No benches for domain', domainKey);
      return;
    }
    var rows = [];
    window.App.data.models.forEach(function(m) {
      var c = _perDomainComposite(m.id, benches);
      if (c) rows.push({ model: m, score: c.score, coverage: c.coverage });
    });
    rows.sort(function(a, b) { return b.score - a.score; });
    rows = rows.slice(0, 15);

    var overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });

    var box = document.createElement('div');
    box.className = 'bg-gray-900 border border-gray-700 rounded-lg p-5 max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto';
    var title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-gray-200 mb-1';
    title.textContent = domainKey + ' Leaderboard';
    box.appendChild(title);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Per-domain composite (mean of normalized scores). Coverage = # benches scored.';
    box.appendChild(sub);

    if (!rows.length) {
      var empty = document.createElement('div');
      empty.className = 'text-sm text-gray-400 italic';
      empty.textContent = 'No models with scores in this domain yet.';
      box.appendChild(empty);
    } else {
      var table = document.createElement('table');
      table.className = 'w-full text-xs';
      var thead = document.createElement('thead');
      var trH = document.createElement('tr');
      trH.className = 'text-gray-400';
      ['#', 'Model', 'Vendor', 'Composite', 'Coverage'].forEach(function(t) {
        var th = document.createElement('th'); th.className = 'text-left px-2 py-1';
        th.textContent = t; trH.appendChild(th);
      });
      thead.appendChild(trH); table.appendChild(thead);
      var tbody = document.createElement('tbody');
      rows.forEach(function(r, i) {
        var tr = document.createElement('tr'); tr.className = 'border-t border-gray-800';
        [String(i + 1), r.model.name || r.model.id, r.model.vendor || '—',
         r.score.toFixed(1), String(r.coverage)].forEach(function(v) {
          var td = document.createElement('td'); td.className = 'px-2 py-1 text-gray-200';
          td.textContent = v; tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody); box.appendChild(table);
    }

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mt-4 px-3 py-1.5 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', function() { overlay.remove(); });
    box.appendChild(closeBtn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  // ====================================================================
  // W7 — Weather Forecast Skill Curve. Lower-better RMSE, model release date X.
  // ====================================================================
  function renderWeatherSkillCurve() {
    _ensureMountPoint('ai4s-chart-weather-skill',
      'Weather Forecast Skill Progression',
      'Z500 RMSE on WeatherBench-2 by model release date. Lower is better.');
    if (typeof echarts === 'undefined') return;

    var rows = _scoresFor('weatherbench_z500_72h');
    var pts = [];
    rows.forEach(function(r) {
      var d = _modelReleaseDate(r.model_id);
      if (!d || typeof r.value !== 'number') return;
      pts.push([d, r.value, r.model_id]);
    });
    pts.sort(function(a, b) { return a[0].localeCompare(b[0]); });

    var mountEl = document.getElementById('ai4s-chart-weather-skill');
    if (pts.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient weather skill data — run Phase 2A Task 10 ingest first';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-weather-skill');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 50 },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var d = p[0];
          return d.value[0] + '<br><b>' + d.value[2] + '</b><br>RMSE: ' + d.value[1];
        }
      },
      xAxis: { type: 'time', axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      yAxis: { type: 'value', name: 'Z500 RMSE (m, lower=better)',
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [{
        name: 'Weather skill',
        type: 'line',
        data: pts.map(function(p) { return [p[0], p[1], p[2]]; }),
        symbol: 'circle', symbolSize: 8,
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
        areaStyle: { color: 'rgba(59,130,246,0.15)' }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // W8 — Protein folding (CASP) progression. Step-line by CASP edition.
  // ====================================================================
  function renderCASPProgression() {
    _ensureMountPoint('ai4s-chart-casp-progression',
      'Protein Folding (CASP) Progression',
      'Top GDT-TS by CASP edition. Stepwise → AlphaFold v1 → v2 → v3 → Chai-2.');
    if (typeof echarts === 'undefined') return;

    var caspBenches = ['casp12_gdt', 'casp13_gdt', 'casp14_gdt', 'casp15_gdt', 'casp16_gdt'];
    var caspYears  = { casp12: 2016, casp13: 2018, casp14: 2020, casp15: 2022, casp16: 2024 };
    var data = [];
    caspBenches.forEach(function(bid) {
      var rows = _scoresFor(bid);
      if (!rows.length) return;
      var top = rows.slice().sort(function(a, b) { return b.value - a.value; })[0];
      var ed = bid.split('_')[0];
      data.push([caspYears[ed], top.value, top.model_id, ed.toUpperCase()]);
    });
    data.sort(function(a, b) { return a[0] - b[0]; });

    var mountEl = document.getElementById('ai4s-chart-casp-progression');
    if (data.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient CASP data — run Phase 2A Task 11 ingest first';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-casp-progression');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 50, right: 24, top: 30, bottom: 50 },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          var d = p[0].data;
          return d[3] + ' (' + d[0] + ')<br><b>' + d[2] + '</b><br>GDT-TS: ' + d[1];
        }
      },
      xAxis: { type: 'value', name: 'Year', min: 2014, max: 2026,
        axisLabel: { color: '#9ca3af', formatter: '{value}' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      yAxis: { type: 'value', name: 'Top GDT-TS', min: 0, max: 100,
        nameTextStyle: { color: '#9ca3af' },
        axisLabel: { color: '#9ca3af' },
        axisLine: { lineStyle: { color: '#4b5563' } },
        splitLine: { lineStyle: { color: '#1f2937' } } },
      series: [{
        name: 'Top CASP GDT-TS',
        type: 'line',
        step: 'end',
        data: data,
        symbol: 'circle', symbolSize: 10,
        lineStyle: { color: '#10b981', width: 3 },
        itemStyle: { color: '#10b981' },
        areaStyle: { color: 'rgba(16,185,129,0.15)' },
        label: {
          show: true, position: 'top', color: '#d1d5db', fontSize: 10,
          formatter: function(p) { return p.data[3]; }
        }
      }]
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // W9 — Materials Discovery: side-by-side bar charts for two model classes.
  // Refactor 2026-05-12: Predictive (Matbench MAE/F1) vs Generative (SUN yield)
  // are separate evaluation regimes — splitting into 2 charts replaces the
  // earlier scatter that always had Y=0 because no model has both metrics.
  // ====================================================================
  function renderMaterialsYield() {
    _ensureMountPoint('ai4s-chart-materials-yield',
      'Materials Discovery — Predictive vs Generative',
      'LEFT: Predictive models on Matbench Discovery (F1, higher=better). ' +
      'RIGHT: Generative models on MatterGen-style SUN yield (% Stable+Unique+Novel).');
    if (typeof echarts === 'undefined') return;

    var maeRows = _scoresFor('matbench_discovery_mae');
    var f1Rows = _scoresFor('matbench_discovery_f1');
    var yieldRows = _scoresFor('mattergen_yield');

    // Predictive models: have F1 (or MAE) on Matbench Discovery
    var predictive = {};
    [['mae', maeRows], ['f1', f1Rows]].forEach(function(p) {
      var key = p[0]; var rows = p[1];
      rows.forEach(function(r) {
        if (typeof r.value !== 'number') return;
        predictive[r.model_id] = predictive[r.model_id] || {};
        predictive[r.model_id][key] = r.value;
      });
    });

    // Generative models: have mattergen_yield (SUN%)
    var generative = {};
    yieldRows.forEach(function(r) {
      if (typeof r.value !== 'number') return;
      generative[r.model_id] = r.value;
    });

    var predLabels = []; var predF1 = []; var predMAE = [];
    Object.keys(predictive).sort(function(a, b) {
      return (predictive[b].f1 || 0) - (predictive[a].f1 || 0);
    }).forEach(function(mid) {
      var d = predictive[mid];
      predLabels.push(mid.split('/').pop());
      predF1.push(typeof d.f1 === 'number' ? Math.round(d.f1 * 1000) / 1000 : null);
      predMAE.push(typeof d.mae === 'number' ? d.mae : null);
    });

    var genLabels = []; var genYield = [];
    Object.keys(generative).sort(function(a, b) {
      return generative[b] - generative[a];
    }).forEach(function(mid) {
      genLabels.push(mid.split('/').pop());
      genYield.push(generative[mid]);
    });

    var mountEl = document.getElementById('ai4s-chart-materials-yield');
    if (predLabels.length === 0 && genLabels.length === 0) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No materials data — run Phase 2A Task 12 ingest first';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('ai4s-chart-materials-yield');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      title: [
        { text: 'Predictive (Matbench Discovery F1)', left: '5%', top: 0,
          textStyle: { color: '#d1d5db', fontSize: 12, fontWeight: 'normal' } },
        { text: 'Generative (MatterGen SUN Yield %)', left: '55%', top: 0,
          textStyle: { color: '#d1d5db', fontSize: 12, fontWeight: 'normal' } }
      ],
      grid: [
        { left: '5%', right: '52%', top: 30, bottom: 60, containLabel: true },
        { left: '52%', right: '5%', top: 30, bottom: 60, containLabel: true }
      ],
      tooltip: { trigger: 'item', backgroundColor: 'rgba(17,24,39,0.95)',
        borderColor: '#374151', textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          if (p.seriesIndex === 0) {
            // predictive
            var mid = predLabels[p.dataIndex];
            var mae = predMAE[p.dataIndex];
            return '<b>' + mid + '</b><br>F1: ' + p.value +
              (mae !== null ? '<br>MAE: ' + mae.toFixed(3) : '');
          }
          return '<b>' + genLabels[p.dataIndex] + '</b><br>SUN Yield: ' + p.value + '%';
        }
      },
      xAxis: [
        { type: 'value', gridIndex: 0, max: 1,
          axisLabel: { color: '#9ca3af', fontSize: 9 },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } } },
        { type: 'value', gridIndex: 1, max: 100,
          axisLabel: { color: '#9ca3af', fontSize: 9, formatter: '{value}%' },
          axisLine: { lineStyle: { color: '#4b5563' } },
          splitLine: { lineStyle: { color: '#1f2937' } } }
      ],
      yAxis: [
        { type: 'category', gridIndex: 0, data: predLabels, inverse: true,
          axisLabel: { color: '#d1d5db', fontSize: 10 },
          axisLine: { lineStyle: { color: '#4b5563' } } },
        { type: 'category', gridIndex: 1, data: genLabels, inverse: true,
          axisLabel: { color: '#d1d5db', fontSize: 10 },
          axisLine: { lineStyle: { color: '#4b5563' } } }
      ],
      series: [
        { name: 'F1', type: 'bar', xAxisIndex: 0, yAxisIndex: 0, data: predF1,
          itemStyle: { color: '#60a5fa', opacity: 0.85 },
          label: { show: true, position: 'right', color: '#e5e7eb', fontSize: 10 } },
        { name: 'SUN Yield', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: genYield,
          itemStyle: { color: '#a78bfa', opacity: 0.85 },
          label: { show: true, position: 'right', color: '#e5e7eb', fontSize: 10,
            formatter: '{c}%' } }
      ]
    };
    chart.setOption(_applyToolbox(opt), true);
  }

  // ====================================================================
  // Public render orchestrator. Called from AI4S.render().
  // Phase 1: stub — actual widget calls added per Task 5-9.
  // ====================================================================
  function renderAll() {
    // Eager: above-the-fold widgets that fill the visible viewport on tab open.
    var eagerFns = [renderHeroCards, renderLabDomainMatrix, renderBreakthroughTimeline];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[AI4SCharts] eager failed:', fn.name, e);
      }
    });
    // Lazy: deferred to next idle frame so initial paint isn't blocked
    // by ~6 ECharts.init + setOption calls. setTimeout fallback for browsers
    // without requestIdleCallback (Safari < 17 etc.).
    var lazyFns = [
      renderMathProgression,
      renderFrontierVsSpecialist,
      renderWeatherSkillCurve,
      renderCASPProgression,
      renderMaterialsYield,
      renderBenchmarkCatalog
    ];
    function _runLazy() {
      lazyFns.forEach(function(fn) {
        try { fn(); } catch (e) {
          if (typeof console !== 'undefined') console.warn('[AI4SCharts] lazy failed:', fn.name, e);
        }
      });
    }
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(_runLazy, { timeout: 1500 });
    } else if (typeof setTimeout !== 'undefined') {
      setTimeout(_runLazy, 50);
    }
  }

  // ====================================================================
  // Hero breakthroughs — milestone events featured in W1 SOTA Watch tiles.
  // 8 entries spanning 4 domains (bio-genomics 3, math 2, physics-materials
  // 2, geo-climate 1). Updated when major AI4S milestones land.
  // ====================================================================
  var _BREAKTHROUGHS = [
    {
      title: 'AlphaFold 3',
      narrative: 'Single-model protein structure prediction with bound ligands',
      value: '~91 GDT-TS',
      domain: 'bio-genomics',
      model_id: 'deepmind/alphafold-3',
      benchmark_id: 'casp16_gdt',
      source_url: 'https://www.nature.com/articles/s41586-024-07487-w',
      year: 2024
    },
    {
      title: 'AlphaProof',
      narrative: 'IMO 2024 Silver Medal — RL-trained Lean proof system',
      value: 'Silver Medal',
      domain: 'math',
      model_id: 'deepmind/alphaproof',
      benchmark_id: 'imo_2024',
      source_url: 'https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/',
      year: 2024
    },
    {
      title: 'Aurora',
      narrative: '1.3B-param atmospheric foundation model — IFS-beating skill',
      value: 'IFS-beating RMSE',
      domain: 'geo-climate',
      model_id: 'microsoft/aurora-open',
      benchmark_id: 'aurora_rmse',
      source_url: 'https://www.nature.com/articles/s41586-025-09005-y',
      year: 2024
    },
    {
      title: 'MatterGen',
      narrative: 'Diffusion model for inorganic crystal generation',
      value: '~10x novel materials yield',
      domain: 'physics-materials',
      model_id: 'microsoft/mattergen',
      benchmark_id: 'mattergen_yield',
      source_url: 'https://www.nature.com/articles/s41586-025-08628-5',
      year: 2025
    },
    {
      title: 'Evo 2',
      narrative: 'Genome-scale foundation model across DNA / RNA / protein',
      value: '7B params, 9.3T tokens',
      domain: 'bio-genomics',
      model_id: 'arc-institute-stanford/evo-2',
      benchmark_id: 'evo2_zeroshot',
      source_url: 'https://arcinstitute.org/news/blog/evo2',
      year: 2025
    },
    {
      title: 'AlphaQubit',
      narrative: 'Neural decoder for quantum error correction below threshold',
      value: 'Sub-threshold decode',
      domain: 'physics-materials',
      model_id: 'deepmind/alphaqubit',
      benchmark_id: 'alphaqubit_decoder_acc',
      source_url: 'https://www.nature.com/articles/s41586-024-08148-8',
      year: 2024
    },
    {
      title: 'Chai-2',
      narrative: 'AlphaFold-3-class structure prediction with antibody focus',
      value: '~92% accuracy',
      domain: 'bio-genomics',
      model_id: 'isomorphic/iso-dde-chai-2',
      benchmark_id: 'chai2_pae',
      source_url: 'https://www.chai-discovery.com/blog/introducing-chai-2',
      year: 2025
    },
    {
      title: 'Goedel-Prover v2',
      narrative: 'Open-weight Lean theorem prover — Putnam SOTA',
      value: 'Putnam SOTA',
      domain: 'math',
      model_id: 'goedel/goedel-prover-v2',
      benchmark_id: 'putnambench',
      source_url: 'https://arxiv.org/abs/2502.07640',
      year: 2025
    },
    {
      title: 'AlphaProteo',
      narrative: 'DeepMind protein binder design — 88% experimental success on BHRF1',
      value: '88% BHRF1 hit rate',
      domain: 'bio-genomics',
      model_id: 'deepmind/alphaproteo',
      benchmark_id: 'bhrf1_binder',
      source_url: 'https://arxiv.org/abs/2409.08022',
      year: 2024
    },
    {
      title: 'TxGemma 27B',
      narrative: 'Google therapeutics foundation model — beats specialists on 50/66 TDC tasks',
      value: '50/66 TDC tasks',
      domain: 'bio-genomics',
      model_id: 'google/txgemma-27b',
      benchmark_id: 'tdc_66_vs_specialist',
      source_url: 'https://arxiv.org/abs/2504.06196',
      year: 2025
    },
    {
      title: 'ESM-3 (ESMGFP)',
      narrative: 'EvolutionaryScale generative protein FM — designed novel GFP at 58% identity',
      value: '58% identity to nearest natural',
      domain: 'bio-genomics',
      model_id: 'evolutionaryscale/esm-3',
      benchmark_id: 'esmgfp_sequence_identity',
      source_url: 'https://www.evolutionaryscale.ai/blog/esm3-release',
      year: 2024
    },
    {
      title: 'SDE-hard (GPT-5-Pro)',
      narrative: 'Scientific Discovery Evaluation hardest 86 questions — only frontier model ≥20%',
      value: '22.4% (only ≥20%)',
      domain: 'math',
      model_id: 'openai/gpt-5-pro',
      benchmark_id: 'sde_hard',
      source_url: 'https://arxiv.org/abs/2512.15567',
      year: 2026
    },
    {
      title: 'AI Co-Mathematician',
      narrative: 'DeepMind agentic math system — 48% on FrontierMath Tier 4 (+29pp over Gemini 3.1 Pro base)',
      value: '48% FrontierMath T4',
      domain: 'math',
      model_id: 'deepmind/ai-co-mathematician',
      benchmark_id: 'frontiermath_tier4',
      source_url: 'https://arxiv.org/abs/2605.06651',
      year: 2026
    }
  ];

  // ====================================================================
  // W1 — Breakthrough Hero Cards (DOM, no chart).
  // 5-8 hero tiles for SOTA Watch sub-section.
  // ====================================================================
  function _domainColor(domain) {
    var palette = {
      'bio-genomics':      '#10b981', // emerald
      'math':              '#a78bfa', // violet
      'physics-materials': '#f59e0b', // amber
      'geo-climate':       '#3b82f6', // blue
      'chemistry':         '#ec4899', // pink
      'astronomy':         '#8b5cf6', // purple
      'energy-grid':       '#eab308', // yellow
      'pharma':            '#14b8a6', // teal
      'co-scientist':      '#f97316'  // orange
    };
    return palette[domain] || '#6b7280';
  }

  function renderHeroCards() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('ai4s-charts');
    if (!host) return;
    var existing = document.getElementById('ai4s-hero-cards-section');
    if (existing) return; // idempotent
    var section = document.createElement('div');
    section.id = 'ai4s-hero-cards-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'SOTA Watch — Science Breakthroughs';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Milestone moments in AI for Science — primary-source links, no extrapolation.';
    section.appendChild(sub);

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3';

    _BREAKTHROUGHS.forEach(function(b) {
      var card = document.createElement('a');
      card.href = b.source_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'block rounded border bg-gray-950 border-gray-800 p-3 hover:border-blue-600 transition';
      card.style.borderLeft = '4px solid ' + _domainColor(b.domain);

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

  // ====================================================================
  // Public API.
  // ====================================================================
  var api = {
    _LAB_MAP: _LAB_MAP,
    _resolveLab: _resolveLab,
    _BENCHMARK_DOMAIN_MAP: _BENCHMARK_DOMAIN_MAP,
    _resolveDomain: _resolveDomain,
    _BREAKTHROUGHS: _BREAKTHROUGHS,
    _ensureMountPoint: _ensureMountPoint,
    _applyToolbox: _applyToolbox,
    renderHeroCards: renderHeroCards,
    renderLabDomainMatrix: renderLabDomainMatrix,
    renderBreakthroughTimeline: renderBreakthroughTimeline,
    renderMathProgression: renderMathProgression,
    renderBenchmarkCatalog: renderBenchmarkCatalog,
    renderFrontierVsSpecialist: renderFrontierVsSpecialist,
    renderWeatherSkillCurve: renderWeatherSkillCurve,
    renderCASPProgression: renderCASPProgression,
    renderMaterialsYield: renderMaterialsYield,
    _domainBenchmarks: _domainBenchmarks,
    _perDomainComposite: _perDomainComposite,
    openDomainLeaderboard: openDomainLeaderboard,
    renderAll: renderAll
  };

  root.AI4SCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
