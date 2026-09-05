/**
 * Physical AI tab — graphical widgets (10 ECharts/DOM visualisations).
 *
 * Mirrors dashboard/js/medical-ai-charts.js patterns (UMD module +
 * _ensureMountPoint factory + Charts._getOrCreate + lazy render).
 */
(function(root) {
  'use strict';

  // ====================================================================
  // Robot family taxonomy. Resolves model IDs to robot/vendor family.
  // Keyword matching against id + (lowercase) name. 'other' fallback.
  // ====================================================================
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

  // ====================================================================
  // Benchmark → suite mapping. Used by W2 / W5 / W10.
  // ====================================================================
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
    // World model
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

  function _resolveSuite(benchmarkId) {
    if (!benchmarkId) return null;
    return Object.prototype.hasOwnProperty.call(_BENCHMARK_FAMILY_MAP, benchmarkId)
      ? _BENCHMARK_FAMILY_MAP[benchmarkId] : null;
  }

  // ====================================================================
  // Style block — mobile + a11y. Inject once on first mount.
  // ====================================================================
  function _ensurePhysicalAIChartsStyle() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('physical-ai-charts-style')) return;
    var s = document.createElement('style');
    s.id = 'physical-ai-charts-style';
    s.textContent = [
      '@media (max-width: 768px) {',
      '  .physical-ai-chart-mount { height: 320px !important; }',
      '  .physical-ai-chart-mount canvas { max-width: 100% !important; }',
      '  #physical-ai-charts h2 { font-size: 1rem !important; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .physical-ai-chart-mount * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }',
      '}',
      '.physical-ai-chart-mount:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ====================================================================
  // Mount-point factory.
  // ====================================================================
  function _ensureMountPoint(id, title, hint) {
    if (typeof document === 'undefined') return null;
    _ensurePhysicalAIChartsStyle();
    var host = document.getElementById('physical-ai-charts');
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
    chart.className = 'w-full physical-ai-chart-mount';
    chart.style.height = '420px';
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Chart: ' + title + (hint ? ' — ' + hint : ''));
    chart.setAttribute('tabindex', '0');
    section.appendChild(chart);
    host.appendChild(section);
    return section;
  }

  // ====================================================================
  // Toolbox helper.
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
  // W2 — Family × Benchmark Suite Coverage Matrix.
  // Rows: 11 robot/vendor families (incl. 'other'). Cols: 3 suite categories.
  // Cell value: count of distinct Physical AI models in that family that
  // have a score in any benchmark of that suite.
  // ====================================================================
  function _physicalAICategories() {
    if (typeof window === 'undefined') return [];
    if (typeof window.PhysicalAI !== 'undefined' && window.PhysicalAI.CATEGORIES) return window.PhysicalAI.CATEGORIES;
    return [];
  }

  // Returns [{model_id, family_key}] for all distinct Physical AI models.
  function _physicalAIModels() {
    var cats = _physicalAICategories();
    if (!cats.length || typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return [];
    var modelsById = {};
    window.App.data.models.forEach(function(m) { modelsById[m.id] = m; });
    var seen = {}; var out = [];
    cats.forEach(function(c) {
      (c.models || []).forEach(function(mid) {
        if (seen[mid]) return;
        seen[mid] = true;
        var m = modelsById[mid] || { id: mid, name: '' };
        var fam = _resolveFamily(mid, m.name);
        out.push({ model_id: mid, family_key: fam.key });
      });
    });
    return out;
  }

  function renderFamilyMatrix() {
    _ensureMountPoint('physical-ai-chart-family-matrix',
      'Family × Benchmark Suite Matrix',
      'Which robot/vendor families report on which benchmark suites. Cell = distinct model count.');
    if (typeof echarts === 'undefined') return;
    var mountEl = document.getElementById('physical-ai-chart-family-matrix');
    if (!mountEl) return;

    var entries = _physicalAIModels();
    if (!entries.length) return;

    var famOrder = _FAMILY_MAP.map(function(f) { return f.key; }).concat(['other']);
    var famLabel = {}; _FAMILY_MAP.forEach(function(f) { famLabel[f.key] = f.label; });
    famLabel['other'] = 'Other';
    var suites = ['vla-manipulation','world-model','embodied-reasoning'];
    var suiteLabel = {
      'vla-manipulation': 'VLA Manipulation',
      'world-model': 'World Model Quality',
      'embodied-reasoning': 'Embodied Reasoning'
    };

    var scoresByModel = {};
    if (window.App && window.App.data && window.App.data.scores) {
      window.App.data.scores.forEach(function(s) {
        var suite = _resolveSuite(s.benchmark_id);
        if (!suite) return;
        scoresByModel[s.model_id] = scoresByModel[s.model_id] || {};
        scoresByModel[s.model_id][suite] = true;
      });
    }

    var counts = {}; var maxV = 0;
    entries.forEach(function(e) {
      var sm = scoresByModel[e.model_id] || {};
      Object.keys(sm).forEach(function(s) {
        var k = e.family_key + '|' + s;
        counts[k] = (counts[k] || 0) + 1;
        if (counts[k] > maxV) maxV = counts[k];
      });
    });

    var data = [];
    for (var fi = 0; fi < famOrder.length; fi++) {
      for (var si = 0; si < suites.length; si++) {
        var v = counts[famOrder[fi] + '|' + suites[si]] || 0;
        data.push([si, fi, v === 0 ? '-' : v]);
      }
    }

    if (maxV === 0) {
      while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      var msg = document.createElement('div');
      msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
      msg.textContent = 'No physical AI scores loaded — verify App.data';
      mountEl.appendChild(msg);
      return;
    }

    var chart = Charts._getOrCreate('physical-ai-chart-family-matrix');
    if (!chart) return;
    var opt = {
      backgroundColor: 'transparent',
      grid: { left: 180, right: 24, top: 30, bottom: 80 },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(17,24,39,0.95)', borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: function(p) {
          return '<b>' + (famLabel[famOrder[p.value[1]]] || '?') + '</b><br>' +
            (suiteLabel[suites[p.value[0]]] || '?') + '<br>Models: ' +
            (p.value[2] === '-' ? 0 : p.value[2]);
        }
      },
      xAxis: {
        type: 'category',
        data: suites.map(function(s) { return suiteLabel[s] || s; }),
        axisLabel: { color: '#9ca3af', rotate: 20, fontSize: 10 },
        axisLine: { lineStyle: { color: '#4b5563' } }
      },
      yAxis: {
        type: 'category',
        data: famOrder.map(function(k) { return famLabel[k] || k; }),
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

  // ====================================================================
  // Shared helpers — used by W3/W6/W7/W9.
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

  function _modelDisplayName(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return modelId;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].name || modelId;
    }
    return modelId;
  }

  // ====================================================================
  // W3 — LIBERO Suite Radar.
  // Top 5 models on the 5 LIBERO sub-benches.
  // ====================================================================
  function renderLiberoSuiteRadar() {
    _ensureMountPoint('physical-ai-chart-libero-radar',
      'LIBERO Suite Radar',
      'Top 5 models on the 5 LIBERO sub-benches (libero / spatial / object / goal / long).');
    if (typeof echarts === 'undefined') return;

    var subs = ['libero', 'libero_spatial', 'libero_object', 'libero_goal', 'libero_long'];

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

    var mountEl = document.getElementById('physical-ai-chart-libero-radar');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient LIBERO coverage — need ≥2 models with ≥3 sub-benches';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('physical-ai-chart-libero-radar');
    if (!chart) return;
    var subLabels = ['LIBERO', 'Spatial', 'Object', 'Goal', 'Long'];
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

  function _modelReleaseDate(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return null;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].release_date || null;
    }
    return null;
  }

  // ====================================================================
  // W6 — LIBERO Progression Curve. Multi-line: each LIBERO sub-bench over time.
  // ====================================================================
  function renderLiberoProgression() {
    _ensureMountPoint('physical-ai-chart-libero-progression',
      'LIBERO Progression Curve',
      'Multi-line: each LIBERO sub-bench over time. X = model release date, Y = score.');
    if (typeof echarts === 'undefined') return;

    var benches = ['libero', 'libero_spatial', 'libero_object', 'libero_goal', 'libero_long'];

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

    var mountEl = document.getElementById('physical-ai-chart-libero-progression');
    if (!Object.keys(seriesByBench).length) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'No LIBERO scores loaded — verify App.data.scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('physical-ai-chart-libero-progression');
    if (!chart) return;

    var palette = ['#a78bfa', '#60a5fa', '#34d399', '#f59e0b', '#fb7185'];
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
  // W10 — Physical AI Benchmark Catalog Grid. DOM table with search.
  // ====================================================================
  function renderBenchmarkCatalog() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('physical-ai-charts');
    if (!host) return;
    var existing = document.getElementById('physical-ai-bench-catalog-section');
    if (existing) return;
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.benchmarks) return;

    var domainBenches = Object.keys(_BENCHMARK_FAMILY_MAP);
    var rows = window.App.data.benchmarks
      .filter(function(b) { return domainBenches.indexOf(b.id) !== -1; })
      .map(function(b) {
        var n = _scoresFor(b.id).length;
        return {
          id: b.id,
          name: b.name || b.id,
          suite: _BENCHMARK_FAMILY_MAP[b.id] || '?',
          n: n,
          paper: b.paper_url || b.url || ''
        };
      })
      .sort(function(a, b) { return b.n - a.n; });

    if (!rows.length) return;

    var section = document.createElement('div');
    section.id = 'physical-ai-bench-catalog-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'Physical AI Benchmark Catalog';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Searchable list of physical-AI-tagged benchmarks. Click a row icon to open paper.';
    section.appendChild(sub);

    var searchRow = document.createElement('div');
    searchRow.className = 'flex gap-2 mb-2';
    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Filter by name or suite…';
    search.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs flex-1 text-gray-200';
    searchRow.appendChild(search);
    section.appendChild(searchRow);

    var table = document.createElement('table');
    table.className = 'w-full text-xs';
    var thead = document.createElement('thead');
    var trH = document.createElement('tr');
    trH.className = 'text-gray-400';
    ['Benchmark', 'Suite', 'Scores', 'Paper'].forEach(function(t) {
      var th = document.createElement('th');
      th.className = 'text-left px-2 py-1';
      th.textContent = t;
      trH.appendChild(th);
    });
    thead.appendChild(trH);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');

    var suitePalette = {
      'vla-manipulation': '#10b981',
      'world-model': '#3b82f6',
      'embodied-reasoning': '#a78bfa'
    };
    function _suiteColor(s) { return suitePalette[s] || '#6b7280'; }

    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.className = 'border-t border-gray-800';
      tr.dataset.search = (r.name + ' ' + r.id + ' ' + r.suite).toLowerCase();

      var tdName = document.createElement('td');
      tdName.className = 'px-2 py-1 text-gray-200';
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      var tdSuite = document.createElement('td');
      tdSuite.className = 'px-2 py-1';
      var pill = document.createElement('span');
      pill.className = 'px-1.5 py-0.5 rounded text-[10px]';
      pill.style.background = _suiteColor(r.suite) + '33';
      pill.style.color = _suiteColor(r.suite);
      pill.textContent = r.suite;
      tdSuite.appendChild(pill);
      tr.appendChild(tdSuite);

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
  // W4 — World Model Quality Radar.
  // Top 5 models on world-model + cosmos sub-benches.
  // Coverage threshold ≥2 (sparser data than LIBERO).
  // ====================================================================
  function renderWorldModelRadar() {
    _ensureMountPoint('physical-ai-chart-world-model-radar',
      'World Model Quality Radar',
      'Top 5 models on world-model + cosmos sub-benches. Coverage threshold ≥2.');
    if (typeof echarts === 'undefined') return;

    var subs = [
      'cosmos_embodied_reasoning',
      'cosmos_intuitive_physics',
      'cosmos_physical_common_sense',
      'world_model_consistency',
      'world_model_fps',
      'world_model_visual_memory'
    ];

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
    }).filter(function(r) { return r.coverage >= 2; })
      .sort(function(a, b) { return b.mean - a.mean; })
      .slice(0, 5);

    var mountEl = document.getElementById('physical-ai-chart-world-model-radar');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient world-model coverage — need ≥2 models with ≥2 sub-benches';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('physical-ai-chart-world-model-radar');
    if (!chart) return;
    var subLabels = ['Embodied Reasoning','Intuitive Physics','Common Sense','Consistency','FPS','Visual Memory'];
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

  // ====================================================================
  // W5 — Per-Category Mini-Leaderboard Modal. Opened from category card Shift+click.
  // ====================================================================
  function _categoryBenchmarks(categoryCode) {
    // For Physical AI: categoryCode is from PhysicalAI.CATEGORIES[].code (e.g. 'world-models',
    // 'vla-policies'). Match against _BENCHMARK_FAMILY_MAP suite values:
    //   - 'world-models' / 'world-model' → suite 'world-model'
    //   - 'vla-policies' / 'industrial-robots' / 'manufacturing-fm' → suite 'vla-manipulation'
    //     (best approximation; users can refine later via more specific buckets)
    //   - 'human-centric-vision' → no direct benchmark suite mapping (returns [])
    var suiteMap = {
      'world-models': 'world-model',
      'world-model': 'world-model',
      'vla-policies': 'vla-manipulation',
      'industrial-robots': 'vla-manipulation',
      'manufacturing-fm': 'vla-manipulation'
    };
    var suite = suiteMap[categoryCode];
    if (!suite) return [];
    var out = [];
    Object.keys(_BENCHMARK_FAMILY_MAP).forEach(function(bid) {
      if (_BENCHMARK_FAMILY_MAP[bid] === suite) out.push(bid);
    });
    return out;
  }

  function _perCategoryComposite(modelId, benchmarkIds) {
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

  function openCategoryLeaderboard(categoryCode) {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    var cats = _physicalAICategories();
    var cat = cats.filter(function(c) { return c.code === categoryCode; })[0];
    if (!cat || !cat.models || !cat.models.length) {
      if (typeof console !== 'undefined') console.warn('[PhysicalAICharts] No models for category', categoryCode);
      return;
    }

    // Rank using ALL physical-AI benchmarks (any benchmark in _BENCHMARK_FAMILY_MAP)
    // — gives richer ranking than only the category-suite benchmarks.
    var allPhyBenches = Object.keys(_BENCHMARK_FAMILY_MAP);
    var rows = [];
    if (window.App && window.App.data && window.App.data.models) {
      var modelsById = {};
      window.App.data.models.forEach(function(m) { modelsById[m.id] = m; });
      cat.models.forEach(function(mid) {
        var c = _perCategoryComposite(mid, allPhyBenches);
        if (c) rows.push({ model: modelsById[mid] || { id: mid, name: mid, vendor: '' }, score: c.score, coverage: c.coverage });
      });
    }
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
    title.textContent = (cat.label || categoryCode) + ' Leaderboard';
    box.appendChild(title);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Per-category composite (mean of normalized scores across physical AI benchmarks). Coverage = # benches scored.';
    box.appendChild(sub);

    if (!rows.length) {
      var empty = document.createElement('div');
      empty.className = 'text-sm text-gray-400 italic';
      empty.textContent = 'No models with scores in this category yet.';
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
  // W7 — Sim-to-Real Compare. Bar showing top score per benchmark.
  // ====================================================================
  function renderSimToRealCompare() {
    _ensureMountPoint('physical-ai-chart-sim-to-real',
      'Sim-to-Real Compare',
      'Top model on each sim-to-real benchmark — simpler_env_avg / robocasa / robocasa365.');
    if (typeof echarts === 'undefined') return;

    var benches = ['simpler_env_avg', 'robocasa', 'robocasa365'];
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

    var mountEl = document.getElementById('physical-ai-chart-sim-to-real');
    if (data.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient sim-to-real scores';
        mountEl.appendChild(msg);
      }
      return;
    }

    var chart = Charts._getOrCreate('physical-ai-chart-sim-to-real');
    if (!chart) return;
    var palette = ['#10b981','#a78bfa','#f59e0b'];
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

  // ====================================================================
  // W8 — Industrial Deployment Map (DOM cards, no chart).
  // Shows real-world deployment status of industrial robotics + manufacturing
  // foundation models. Static metadata table — sources are vendor announcements.
  // ====================================================================
  var _DEPLOYMENT_STATUS = {
    'foxconn/foxbrain-70b':       { status: 'production', region: 'Taiwan / Asia', note: 'Deployed in Foxconn factories' },
    'figure-ai/helix':            { status: 'pilot',      region: 'US',            note: 'Real-world VLA in factory pilot' },
    'tesla/optimus-vlm':          { status: 'beta',       region: 'US',            note: 'Tesla factory walking tasks' },
    'apptronik/apollo-gemini':    { status: 'pilot',      region: 'US',            note: 'Mercedes-Benz pilot' },
    'agility/digit-arc':          { status: 'production', region: 'US',            note: 'Amazon warehouse' },
    'sanctuary/carbon':           { status: 'pilot',      region: 'Canada',        note: 'Sanctuary Phoenix' },
    'siemens/sifm':               { status: 'production', region: 'EU',            note: 'Industrial copilot deployment' },
    'bosch/industrial-genai':     { status: 'production', region: 'EU',            note: 'Factory automation copilot' },
    'covariant/rfm-1':            { status: 'production', region: 'Global',        note: 'Warehouse picking RFM' },
    'skild/skild-brain':          { status: 'beta',       region: 'US',            note: 'Generalist robotics brain' },
    'aveva/industrial-ai-assistant': { status: 'production', region: 'Global',     note: 'Industrial process AI' },
    'autodesk/bernini':           { status: 'beta',       region: 'Global',        note: 'Industrial design FM' }
  };

  function _statusColor(status) {
    var p = {
      'production': '#10b981',
      'pilot':      '#f59e0b',
      'beta':       '#a78bfa',
      'preview':    '#3b82f6'
    };
    return p[status] || '#6b7280';
  }

  function renderIndustrialDeployment() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('physical-ai-charts');
    if (!host) return;
    var existing = document.getElementById('physical-ai-industrial-deployment-section');
    if (existing) return;

    var cats = _physicalAICategories();
    var targetCats = cats.filter(function(c) {
      return c.code === 'manufacturing-fm' || c.code === 'industrial-robots';
    });
    if (!targetCats.length) return;

    var section = document.createElement('div');
    section.id = 'physical-ai-industrial-deployment-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'Industrial Deployment Map';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Real-world deployment status of industrial robots + manufacturing foundation models. Status colors: green=production, amber=pilot, violet=beta.';
    section.appendChild(sub);

    var modelsById = {};
    if (window.App && window.App.data && window.App.data.models) {
      window.App.data.models.forEach(function(m) { modelsById[m.id] = m; });
    }

    targetCats.forEach(function(cat) {
      var catTitle = document.createElement('h3');
      catTitle.className = 'text-sm font-semibold text-gray-300 mb-2 mt-3';
      catTitle.textContent = (cat.icon ? cat.icon + ' ' : '') + cat.label;
      section.appendChild(catTitle);

      var grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3';

      (cat.models || []).forEach(function(mid) {
        var info = _DEPLOYMENT_STATUS[mid];
        var m = modelsById[mid] || { id: mid, name: mid, vendor: '' };

        var card = document.createElement('div');
        card.className = 'rounded border bg-gray-950 border-gray-800 p-3';
        var leftColor = info ? _statusColor(info.status) : '#6b7280';
        card.style.borderLeft = '4px solid ' + leftColor;

        var titleRow = document.createElement('div');
        titleRow.className = 'flex items-baseline justify-between gap-2';

        var name = document.createElement('div');
        name.className = 'text-sm font-semibold text-gray-100';
        name.textContent = m.name || mid;
        titleRow.appendChild(name);

        if (info) {
          var pill = document.createElement('span');
          pill.className = 'text-[10px] px-1.5 py-0.5 rounded';
          pill.style.background = _statusColor(info.status) + '33';
          pill.style.color = _statusColor(info.status);
          pill.textContent = info.status;
          titleRow.appendChild(pill);
        }

        card.appendChild(titleRow);

        var vendor = document.createElement('div');
        vendor.className = 'text-[10px] text-gray-500 uppercase tracking-wider mt-0.5';
        vendor.textContent = (m.vendor || mid.split('/')[0]) + (info ? ' · ' + info.region : '');
        card.appendChild(vendor);

        if (info && info.note) {
          var note = document.createElement('div');
          note.className = 'text-xs text-gray-400 mt-1.5';
          note.textContent = info.note;
          card.appendChild(note);
        }

        grid.appendChild(card);
      });

      section.appendChild(grid);
    });

    host.appendChild(section);
  }

  // ====================================================================
  // W9 — Embodied Reasoning Heatmap.
  // Top 8 models × 3 cosmos sub-benches. Coverage threshold ≥1 (sparse data).
  // Cell color: red→green visualMap.
  // ====================================================================
  function renderEmbodiedHeatmap() {
    _ensureMountPoint('physical-ai-chart-embodied-heatmap',
      'Embodied Reasoning Heatmap',
      'Top 8 models × cosmos embodied/intuitive/common-sense sub-benches. Cell = score (higher = better).');
    if (typeof echarts === 'undefined') return;

    var subs = ['cosmos_embodied_reasoning','cosmos_intuitive_physics','cosmos_physical_common_sense'];

    var byModel = {};
    subs.forEach(function(b) {
      _scoresFor(b).forEach(function(s) {
        if (typeof s.value !== 'number') return;
        byModel[s.model_id] = byModel[s.model_id] || {};
        byModel[s.model_id][b] = s.value;
      });
    });

    var ranked = Object.keys(byModel).map(function(mid) {
      var sum = 0; var cov = 0;
      subs.forEach(function(b) {
        var v = byModel[mid][b];
        if (typeof v === 'number') { sum += v; cov++; }
      });
      return { model_id: mid, mean: cov > 0 ? sum / cov : 0, coverage: cov };
    }).filter(function(r) { return r.coverage >= 1; })
      .sort(function(a, b) { return b.mean - a.mean; })
      .slice(0, 8);

    var mountEl = document.getElementById('physical-ai-chart-embodied-heatmap');
    if (ranked.length < 2) {
      if (mountEl) {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
        var msg = document.createElement('div');
        msg.className = 'text-sm text-gray-400 italic flex items-center justify-center h-full';
        msg.textContent = 'Insufficient embodied reasoning scores — need ≥2 models with ≥1 cosmos sub-bench';
        mountEl.appendChild(msg);
      }
      return;
    }

    var subLabels = ['Embodied Reasoning','Intuitive Physics','Common Sense'];
    var data = [];
    var maxV = 0;
    ranked.forEach(function(r, ri) {
      subs.forEach(function(b, bi) {
        var v = byModel[r.model_id][b];
        var val = (typeof v === 'number') ? v : null;
        data.push([bi, ri, val === null ? '-' : Math.round(val * 10) / 10]);
        if (val !== null && val > maxV) maxV = val;
      });
    });

    var chart = Charts._getOrCreate('physical-ai-chart-embodied-heatmap');
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

  // ====================================================================
  // Public render orchestrator. Called from PhysicalAI.render().
  // ====================================================================
  function renderAll() {
    // Eager: above-the-fold widgets that fill the visible viewport on tab open.
    var eagerFns = [renderHeroCards, renderFamilyMatrix, renderLiberoSuiteRadar];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[PhysicalAICharts] eager failed:', fn.name, e);
      }
    });
    // Lazy: deferred to next idle frame so initial paint isn't blocked.
    // setTimeout fallback for browsers without requestIdleCallback.
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

  // ====================================================================
  // Physical AI breakthroughs — milestone events featured in W1 SOTA Watch.
  // ====================================================================
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
      model_id: 'nvidia/cosmos-transfer2.5',
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

  // ====================================================================
  // W1 — Physical AI Breakthrough Hero Cards (DOM, no chart).
  // ====================================================================
  function _categoryColor(domain) {
    var palette = {
      'world-models':         '#3b82f6', // blue
      'world-model':          '#3b82f6',
      'vla-policies':         '#10b981', // emerald
      'industrial-robots':    '#f59e0b', // amber
      'manufacturing-fm':     '#a78bfa', // violet
      'human-centric-vision': '#ec4899'  // pink
    };
    return palette[domain] || '#6b7280';
  }

  function renderHeroCards() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('physical-ai-charts');
    if (!host) return;
    var existing = document.getElementById('physical-ai-hero-cards-section');
    if (existing) return;
    var section = document.createElement('div');
    section.id = 'physical-ai-hero-cards-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'SOTA Watch — Physical AI Breakthroughs';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Milestone moments in Physical AI — primary-source links, no extrapolation.';
    section.appendChild(sub);

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3';

    _PHY_BREAKTHROUGHS.forEach(function(b) {
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

  // ====================================================================
  // Public API.
  // ====================================================================
  var api = {
    _FAMILY_MAP: _FAMILY_MAP,
    _resolveFamily: _resolveFamily,
    _BENCHMARK_FAMILY_MAP: _BENCHMARK_FAMILY_MAP,
    _resolveSuite: _resolveSuite,
    _ensureMountPoint: _ensureMountPoint,
    _applyToolbox: _applyToolbox,
    _PHY_BREAKTHROUGHS: _PHY_BREAKTHROUGHS,
    _scoresFor: _scoresFor,
    _modelDisplayName: _modelDisplayName,
    renderHeroCards: renderHeroCards,
    renderFamilyMatrix: renderFamilyMatrix,
    renderLiberoSuiteRadar: renderLiberoSuiteRadar,
    renderLiberoProgression: renderLiberoProgression,
    renderWorldModelRadar: renderWorldModelRadar,
    renderBenchmarkCatalog: renderBenchmarkCatalog,
    renderSimToRealCompare: renderSimToRealCompare,
    renderIndustrialDeployment: renderIndustrialDeployment,
    renderEmbodiedHeatmap: renderEmbodiedHeatmap,
    _DEPLOYMENT_STATUS: _DEPLOYMENT_STATUS,
    _categoryBenchmarks: _categoryBenchmarks,
    _perCategoryComposite: _perCategoryComposite,
    openCategoryLeaderboard: openCategoryLeaderboard,
    renderAll: renderAll
  };

  root.PhysicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
