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

  // ====================================================================
  // Benchmark → category mapping. Used by W2 / W5 / W10.
  // ====================================================================
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

  // ====================================================================
  // Style block — mobile + a11y. Inject once on first mount.
  // ====================================================================
  function _ensureMedicalAIChartsStyle() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('medical-ai-charts-style')) return;
    var s = document.createElement('style');
    s.id = 'medical-ai-charts-style';
    s.textContent = [
      '@media (max-width: 768px) {',
      '  .medical-ai-chart-mount { height: 320px !important; }',
      '  .medical-ai-chart-mount canvas { max-width: 100% !important; }',
      '  #medical-ai-charts h2 { font-size: 1rem !important; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .medical-ai-chart-mount * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }',
      '}',
      '.medical-ai-chart-mount:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ====================================================================
  // Mount-point factory. Idempotent — safe to call repeatedly.
  // ====================================================================
  function _ensureMountPoint(id, title, hint) {
    if (typeof document === 'undefined') return null;
    _ensureMedicalAIChartsStyle();
    var host = document.getElementById('medical-ai-charts');
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
    chart.className = 'w-full medical-ai-chart-mount';
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
  // W1 — Medical Breakthrough Hero Cards (DOM, no chart).
  // ====================================================================
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

  // ====================================================================
  // W2 — Specialty × Benchmark Coverage Matrix.
  // Rows: 12 specialties (incl. 'other'). Cols: 6 benchmark categories.
  // Cell value: count of distinct Medical AI models in that specialty
  // that have a score in any benchmark of that category.
  // ====================================================================
  function _medicalAICategories() {
    if (typeof window === 'undefined') return [];
    if (typeof window.MedicalAI !== 'undefined' && window.MedicalAI.CATEGORIES) return window.MedicalAI.CATEGORIES;
    return [];
  }

  // Returns [{model_id, specialty_key}] for all distinct models in any
  // Medical AI category (deduplicated across categories).
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
    var specLabel = {}; _SPECIALTY_MAP.forEach(function(s) { specLabel[s.key] = s.label; });
    specLabel['other'] = 'Other';
    var categories = ['clinical-knowledge','biomedical-research','healthbench','specialty','multilingual','dialog'];
    var categoryLabel = {
      'clinical-knowledge': 'Clinical Knowledge',
      'biomedical-research': 'Biomedical Research',
      'healthbench': 'HealthBench Family',
      'specialty': 'Specialty Eval',
      'multilingual': 'Multi-language',
      'dialog': 'Dialog / Safety'
    };

    // Index scores by model: which categories does each model have any score in?
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

  // ====================================================================
  // Shared helpers — used by W3/W4/W6/W7/W8/W9.
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

  function _modelDisplayName(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return modelId;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].name || modelId;
    }
    return modelId;
  }

  // ====================================================================
  // W4 — HealthBench Sub-benchmarks Radar.
  // Top 5 models on the 7 HealthBench-Pro sub-benches.
  // ====================================================================
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

  // ====================================================================
  // W6 — USMLE Progression Curve.
  // medqa_usmle scores over model release date.
  // ====================================================================
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

  // ====================================================================
  // W10 — Medical Benchmark Catalog Grid. DOM table with search.
  // ====================================================================
  function renderBenchmarkCatalog() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('medical-ai-charts');
    if (!host) return;
    var existing = document.getElementById('medical-ai-bench-catalog-section');
    if (existing) return;
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.benchmarks) return;

    var domainBenches = Object.keys(_BENCHMARK_CATEGORY_MAP);
    var rows = window.App.data.benchmarks
      .filter(function(b) { return domainBenches.indexOf(b.id) !== -1; })
      .map(function(b) {
        var n = _scoresFor(b.id).length;
        return {
          id: b.id,
          name: b.name || b.id,
          category: _BENCHMARK_CATEGORY_MAP[b.id] || '?',
          n: n,
          paper: b.paper_url || b.url || ''
        };
      })
      .sort(function(a, b) { return b.n - a.n; });

    if (!rows.length) return;

    var section = document.createElement('div');
    section.id = 'medical-ai-bench-catalog-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'Medical AI Benchmark Catalog';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Searchable list of medical-tagged benchmarks. Click a row icon to open paper.';
    section.appendChild(sub);

    var searchRow = document.createElement('div');
    searchRow.className = 'flex gap-2 mb-2';
    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Filter by name or category…';
    search.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs flex-1 text-gray-200';
    searchRow.appendChild(search);
    section.appendChild(searchRow);

    var table = document.createElement('table');
    table.className = 'w-full text-xs';
    var thead = document.createElement('thead');
    var trH = document.createElement('tr');
    trH.className = 'text-gray-400';
    ['Benchmark', 'Category', 'Scores', 'Paper'].forEach(function(t) {
      var th = document.createElement('th');
      th.className = 'text-left px-2 py-1';
      th.textContent = t;
      trH.appendChild(th);
    });
    thead.appendChild(trH);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');

    // Map category key → color (use _categoryColor where applicable, else fallback)
    var catPalette = {
      'clinical-knowledge': '#10b981',
      'biomedical-research': '#a78bfa',
      'healthbench': '#3b82f6',
      'specialty': '#f59e0b',
      'multilingual': '#ec4899',
      'dialog': '#fb7185'
    };
    function _catColor(cat) { return catPalette[cat] || '#6b7280'; }

    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.className = 'border-t border-gray-800';
      tr.dataset.search = (r.name + ' ' + r.id + ' ' + r.category).toLowerCase();

      var tdName = document.createElement('td');
      tdName.className = 'px-2 py-1 text-gray-200';
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      var tdCat = document.createElement('td');
      tdCat.className = 'px-2 py-1';
      var pill = document.createElement('span');
      pill.className = 'px-1.5 py-0.5 rounded text-[10px]';
      pill.style.background = _catColor(r.category) + '33';
      pill.style.color = _catColor(r.category);
      pill.textContent = r.category;
      tdCat.appendChild(pill);
      tr.appendChild(tdCat);

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
  // W3 — Frontier vs Medical-Specialist Compare. Grouped bar.
  // ====================================================================
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

  // ====================================================================
  // W5 — Per-Category Mini-Leaderboard Modal. Opened from category card Shift+click.
  // ====================================================================
  function _categoryBenchmarks(categoryKey) {
    var out = [];
    Object.keys(_BENCHMARK_CATEGORY_MAP).forEach(function(bid) {
      if (_BENCHMARK_CATEGORY_MAP[bid] === categoryKey) out.push(bid);
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
    // For Medical AI: categoryCode comes from MedicalAI.CATEGORIES[].code (e.g. 'clinical-llm').
    // We need to either:
    //   (a) Use _BENCHMARK_CATEGORY_MAP keys directly if categoryCode matches one
    //       (clinical-knowledge / biomedical-research / etc.)
    //   (b) Look up the category's models via MedicalAI.CATEGORIES and rank them
    //       across all medical benchmarks they have scores in.
    // Take approach (b) — uses the actual category card's model list for natural UX.

    var cats = _medicalAICategories();
    var cat = cats.filter(function(c) { return c.code === categoryCode; })[0];
    if (!cat || !cat.models || !cat.models.length) {
      if (typeof console !== 'undefined') console.warn('[MedicalAICharts] No models for category', categoryCode);
      return;
    }

    // Build ranking: for each model in this category, compute a per-category
    // composite over ALL medical benchmarks (i.e., any benchmark in
    // _BENCHMARK_CATEGORY_MAP) where the model has a score.
    var allMedBenches = Object.keys(_BENCHMARK_CATEGORY_MAP);
    var rows = [];
    if (window.App && window.App.data && window.App.data.models) {
      var modelsById = {};
      window.App.data.models.forEach(function(m) { modelsById[m.id] = m; });
      cat.models.forEach(function(mid) {
        var c = _perCategoryComposite(mid, allMedBenches);
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
    sub.textContent = 'Per-category composite (mean of normalized scores across medical benchmarks). Coverage = # benches scored.';
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
  // W7 — Multi-language Medical Compare. Bar chart top-model per benchmark.
  // ====================================================================
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

  // ====================================================================
  // W8 — Medical Safety / Hallucination Heatmap.
  // Top models × HealthBench safety sub-benches.
  // ====================================================================
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

  // ====================================================================
  // Public render orchestrator. Called from MedicalAI.render().
  // ====================================================================
  function renderAll() {
    var fns = [renderHeroCards, renderSpecialtyMatrix, renderHealthBenchRadar, renderUSMLEProgression, renderFrontierVsMedicalSpecialist, renderBenchmarkCatalog, renderMultilangCompare, renderSafetyHeatmap];
    for (var i = 0; i < fns.length; i++) {
      try { fns[i](); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[MedicalAICharts] failed:', fns[i].name || i, e);
      }
    }
  }

  // ====================================================================
  // Medical breakthroughs — milestone events featured in W1 SOTA Watch tiles.
  // ====================================================================
  var _MED_BREAKTHROUGHS = [
    {
      title: 'Med-Gemini-3-Pro',
      narrative: 'Frontier medical reasoning + multimodal',
      value: 'MedQA SOTA',
      domain: 'clinical-llm',
      model_id: 'google/med-gemini-3-pro',
      benchmark_id: 'medqa_usmle',
      source_url: 'https://arxiv.org/abs/2404.18416',
      year: 2025
    },
    {
      title: 'Med-PaLM 2',
      narrative: 'First model to pass USMLE expert level',
      value: 'USMLE 86.5%',
      domain: 'clinical-llm',
      model_id: 'google/med-palm-2',
      benchmark_id: 'medqa_usmle',
      source_url: 'https://www.nature.com/articles/s41591-024-02855-5',
      year: 2023
    },
    {
      title: 'MedGemma 27B',
      narrative: 'Open-weight Gemma-class medical FM',
      value: 'MedQA 87.7%',
      domain: 'clinical-llm',
      model_id: 'google/medgemma-27b',
      benchmark_id: 'medqa_usmle',
      source_url: 'https://huggingface.co/google/medgemma-27b-it',
      year: 2025
    },
    {
      title: 'Polaris-3',
      narrative: 'Hippocratic AI 70B clinical conversation',
      value: 'HealthBench top',
      domain: 'clinical-llm',
      model_id: 'hippocratic-ai/polaris-3',
      benchmark_id: 'healthbench',
      source_url: 'https://www.hippocraticai.com/research/polaris-3',
      year: 2025
    },
    {
      title: 'OpenBioLLM-70B',
      narrative: 'Open biomedical LLM (Saama)',
      value: 'PubMedQA 80%',
      domain: 'biomedical-llm',
      model_id: 'saama/openbiollm-llama3-70b',
      benchmark_id: 'pubmedqa',
      source_url: 'https://huggingface.co/aaditya/Llama3-OpenBioLLM-70B',
      year: 2024
    },
    {
      title: 'M42 Med42-v2-70B',
      narrative: 'UAE Cerebras-trained clinical LLM',
      value: 'MedQA Foundation-class',
      domain: 'biomedical-llm',
      model_id: 'm42-health/med42-v2-70b',
      benchmark_id: 'medqa_usmle',
      source_url: 'https://m42.ae/media-resources/news/m42-announces-new-clinical-llm-to-transform-the-future-of-ai-in-healthcare/',
      year: 2024
    },
    {
      title: 'HuatuoGPT-o1 72B',
      narrative: 'Chinese medical reasoning LLM',
      value: 'climedbench_cn SOTA',
      domain: 'multilingual-medical',
      model_id: 'freedomintelligence/huatuogpt-o1-72b',
      benchmark_id: 'climedbench_cn',
      source_url: 'https://github.com/FreedomIntelligence/HuatuoGPT-o1',
      year: 2024
    },
    {
      title: 'KMed.ai (SNUH × Naver)',
      narrative: 'Korean medical FM — KMLE 96.4 SOTA',
      value: 'KMLE 96.4%',
      domain: 'korean-medical',
      model_id: 'snuh-naver/kmed-ai',
      benchmark_id: 'kmle',
      source_url: 'https://www.naver.com/healthcare-ai',
      year: 2025
    }
  ];

  var api = {
    _SPECIALTY_MAP: _SPECIALTY_MAP,
    _resolveSpecialty: _resolveSpecialty,
    _BENCHMARK_CATEGORY_MAP: _BENCHMARK_CATEGORY_MAP,
    _resolveCategory: _resolveCategory,
    _ensureMountPoint: _ensureMountPoint,
    _applyToolbox: _applyToolbox,
    _MED_BREAKTHROUGHS: _MED_BREAKTHROUGHS,
    renderHeroCards: renderHeroCards,
    renderSpecialtyMatrix: renderSpecialtyMatrix,
    renderHealthBenchRadar: renderHealthBenchRadar,
    renderUSMLEProgression: renderUSMLEProgression,
    renderFrontierVsMedicalSpecialist: renderFrontierVsMedicalSpecialist,
    renderBenchmarkCatalog: renderBenchmarkCatalog,
    renderMultilangCompare: renderMultilangCompare,
    renderSafetyHeatmap: renderSafetyHeatmap,
    _categoryBenchmarks: _categoryBenchmarks,
    _perCategoryComposite: _perCategoryComposite,
    openCategoryLeaderboard: openCategoryLeaderboard,
    renderAll: renderAll
  };

  root.MedicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
