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

  // ====================================================================
  // Style block — mobile + a11y. Inject once on first mount.
  // ====================================================================
  function _ensureSovereignChartsStyle() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('sovereign-charts-style')) return;
    var s = document.createElement('style');
    s.id = 'sovereign-charts-style';
    s.textContent = [
      '@media (max-width: 768px) {',
      '  .sovereign-chart-mount { height: 320px !important; }',
      '  .sovereign-chart-mount canvas { max-width: 100% !important; }',
      '  #sovereign-charts h2 { font-size: 1rem !important; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  .sovereign-chart-mount * { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }',
      '}',
      '.sovereign-chart-mount:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }'
    ].join('\n');
    document.head.appendChild(s);
  }

  // ====================================================================
  // Mount-point factory. Idempotent.
  // ====================================================================
  function _ensureMountPoint(id, title, hint) {
    if (typeof document === 'undefined') return null;
    _ensureSovereignChartsStyle();
    var host = document.getElementById('sovereign-charts');
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
    chart.className = 'w-full sovereign-chart-mount';
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
  // Shared helpers — used by W2/W3/W4/W5.
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
  // W3 — VLAIR Legal Sub-benchmarks Radar.
  // Top 5 models on the 5 VLAIR legal sub-benches.
  // ====================================================================
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

  // ====================================================================
  // W6 — Sovereign Benchmark Catalog Grid. DOM table with search.
  // ====================================================================
  function renderBenchmarkCatalog() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('sovereign-charts');
    if (!host) return;
    var existing = document.getElementById('sovereign-bench-catalog-section');
    if (existing) return;
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.benchmarks) return;

    var domainBenches = Object.keys(_BENCHMARK_DIMENSION_MAP);
    var rows = window.App.data.benchmarks
      .filter(function(b) { return domainBenches.indexOf(b.id) !== -1; })
      .map(function(b) {
        var n = _scoresFor(b.id).length;
        return {
          id: b.id,
          name: b.name || b.id,
          dimension: _BENCHMARK_DIMENSION_MAP[b.id] || '?',
          n: n,
          paper: b.paper_url || b.url || ''
        };
      })
      .sort(function(a, b) { return b.n - a.n; });

    if (!rows.length) return;

    var section = document.createElement('div');
    section.id = 'sovereign-bench-catalog-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'Sovereign Benchmark Catalog';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Searchable list of sovereign-tagged benchmarks. Click a row icon to open paper.';
    section.appendChild(sub);

    var searchRow = document.createElement('div');
    searchRow.className = 'flex gap-2 mb-2';
    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Filter by name or dimension…';
    search.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs flex-1 text-gray-200';
    searchRow.appendChild(search);
    section.appendChild(searchRow);

    var table = document.createElement('table');
    table.className = 'w-full text-xs';
    var thead = document.createElement('thead');
    var trH = document.createElement('tr');
    trH.className = 'text-gray-400';
    ['Benchmark', 'Dimension', 'Scores', 'Paper'].forEach(function(t) {
      var th = document.createElement('th');
      th.className = 'text-left px-2 py-1';
      th.textContent = t;
      trH.appendChild(th);
    });
    thead.appendChild(trH);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');

    var dimPalette = {
      'language': '#3b82f6',
      'medical': '#10b981',
      'domain': '#a78bfa'
    };
    function _dimColor(d) { return dimPalette[d] || '#6b7280'; }

    rows.forEach(function(r) {
      var tr = document.createElement('tr');
      tr.className = 'border-t border-gray-800';
      tr.dataset.search = (r.name + ' ' + r.id + ' ' + r.dimension).toLowerCase();

      var tdName = document.createElement('td');
      tdName.className = 'px-2 py-1 text-gray-200';
      tdName.textContent = r.name;
      tr.appendChild(tdName);

      var tdDim = document.createElement('td');
      tdDim.className = 'px-2 py-1';
      var pill = document.createElement('span');
      pill.className = 'px-1.5 py-0.5 rounded text-[10px]';
      pill.style.background = _dimColor(r.dimension) + '33';
      pill.style.color = _dimColor(r.dimension);
      pill.textContent = r.dimension;
      tdDim.appendChild(pill);
      tr.appendChild(tdDim);

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
  // W2 — Frontier vs Sovereign-Specialist Compare. Grouped bar.
  // ====================================================================
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

  function _modelReleaseDate(modelId) {
    if (typeof window === 'undefined' || !window.App || !window.App.data || !window.App.data.models) return null;
    var ms = window.App.data.models;
    for (var i = 0; i < ms.length; i++) {
      if (ms[i].id === modelId) return ms[i].release_date || null;
    }
    return null;
  }

  // ====================================================================
  // W4 — Multi-language Progression Curve. Multi-line: each multilingual
  // benchmark over time. X = model release date, Y = score.
  // ====================================================================
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

  // ====================================================================
  // W5 — Per-Dimension Drill-down Modal. Opened from dimension card Shift+click.
  // ====================================================================
  function _dimensionBenchmarks(dimensionId) {
    var out = [];
    Object.keys(_BENCHMARK_DIMENSION_MAP).forEach(function(bid) {
      if (_BENCHMARK_DIMENSION_MAP[bid] === dimensionId) out.push(bid);
    });
    return out;
  }

  function _perDimensionComposite(modelId, benchmarkIds) {
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

  function openDimensionLeaderboard(dimensionId) {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    var benches = _dimensionBenchmarks(dimensionId);
    if (!benches.length || !window.App || !window.App.data || !window.App.data.models) {
      if (typeof console !== 'undefined') console.warn('[SovereignCharts] No benches for dimension', dimensionId);
      return;
    }

    var rows = [];
    window.App.data.models.forEach(function(m) {
      var c = _perDimensionComposite(m.id, benches);
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
    title.textContent = dimensionId + ' Leaderboard';
    box.appendChild(title);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Per-dimension composite (mean of normalized scores). Coverage = # benches scored.';
    box.appendChild(sub);

    if (!rows.length) {
      var empty = document.createElement('div');
      empty.className = 'text-sm text-gray-400 italic';
      empty.textContent = 'No models with scores in this dimension yet.';
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
  // Public render orchestrator. Called from Sovereign.render().
  // ====================================================================
  function renderAll() {
    // Eager: hero cards (always above the fold) + VLAIR radar (close to fold).
    var eagerFns = [renderHeroCards, renderVLAIRRadar];
    eagerFns.forEach(function(fn) {
      try { fn(); } catch (e) {
        if (typeof console !== 'undefined') console.warn('[SovereignCharts] eager failed:', fn.name, e);
      }
    });
    // Lazy: deferred to next idle frame so initial paint isn't blocked.
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

  // ====================================================================
  // Sovereign breakthroughs — 8 milestone tiles spanning 5 regions.
  // ====================================================================
  var _SOV_BREAKTHROUGHS = [
    {
      title: 'KMed.ai (SNUH × Naver)',
      narrative: 'Korean medical FM — KMLE 96.4 SOTA',
      value: 'KMLE 96.4%',
      region: 'kr',
      flag: '🇰🇷',
      model_id: 'snuh-naver/kmed-ai',
      benchmark_id: 'kmle',
      source_url: 'https://www.naver.com/healthcare-ai',
      year: 2025
    },
    {
      title: 'HyperCLOVA X',
      narrative: 'Naver Korean foundation model',
      value: 'Korea sovereign FM',
      region: 'kr',
      flag: '🇰🇷',
      model_id: 'naver/hyperclova-x',
      benchmark_id: 'kmlu',
      source_url: 'https://clova.ai/hyperclova',
      year: 2024
    },
    {
      title: 'DeepSeek V4 Pro',
      narrative: 'Open-weight Chinese frontier',
      value: 'Frontier-class V4',
      region: 'cn',
      flag: '🇨🇳',
      model_id: 'deepseek/deepseek-v4-pro',
      benchmark_id: 'chinese_simpleqa',
      source_url: 'https://www.deepseek.com/',
      year: 2025
    },
    {
      title: 'Qwen 3.6 Plus',
      narrative: 'Alibaba Tongyi flagship',
      value: 'C-Eval / CMMLU SOTA',
      region: 'cn',
      flag: '🇨🇳',
      model_id: 'alibaba/qwen-3.6-plus',
      benchmark_id: 'c_eval',
      source_url: 'https://qwenlm.github.io/',
      year: 2025
    },
    {
      title: 'Mistral Large 3',
      narrative: 'European frontier model',
      value: 'EU sovereign frontier',
      region: 'fr',
      flag: '🇫🇷',
      model_id: 'mistral/mistral-large-3',
      benchmark_id: 'mmmlu',
      source_url: 'https://mistral.ai/news/',
      year: 2025
    },
    {
      title: 'Falcon (TII)',
      narrative: 'UAE Technology Innovation Institute',
      value: 'Arabic medical SOTA',
      region: 'ae',
      flag: '🇦🇪',
      model_id: 'tii/falcon-h1-arabic-34b',
      benchmark_id: 'arabic_medical_eval',
      source_url: 'https://www.tii.ae/news/falcon-arabic',
      year: 2024
    },
    {
      title: 'Aya 23 (Cohere)',
      narrative: 'Multilingual covering 23 languages',
      value: 'Global PIQA SOTA',
      region: 'us-open',
      flag: '🌐',
      model_id: 'cohere/aya-23',
      benchmark_id: 'global_piqa',
      source_url: 'https://cohere.com/research/aya',
      year: 2024
    },
    {
      title: 'Sea-LION v4',
      narrative: 'AI Singapore SE Asian languages',
      value: 'SEA multilingual',
      region: 'sg',
      flag: '🇸🇬',
      model_id: 'ai-singapore/apertus-sea-lion-v4-8b',
      benchmark_id: 'mmmlu',
      source_url: 'https://aisingapore.org/sea-lion/',
      year: 2025
    }
  ];

  // ====================================================================
  // W1 — Sovereign Breakthrough Hero Cards (DOM, no chart).
  // ====================================================================
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

  function renderHeroCards() {
    if (typeof document === 'undefined') return;
    var host = document.getElementById('sovereign-charts');
    if (!host) return;
    var existing = document.getElementById('sovereign-hero-cards-section');
    if (existing) return;
    var section = document.createElement('div');
    section.id = 'sovereign-hero-cards-section';
    section.className = 'rounded border bg-gray-900 border-gray-800 p-4';

    var head = document.createElement('h2');
    head.className = 'text-lg font-semibold text-gray-200 mb-1';
    head.textContent = 'SOTA Watch — Sovereign Breakthroughs';
    section.appendChild(head);
    var sub = document.createElement('p');
    sub.className = 'text-xs text-gray-500 mb-3';
    sub.textContent = 'Milestone moments in regional sovereign AI — primary-source links.';
    section.appendChild(sub);

    var grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3';

    _SOV_BREAKTHROUGHS.forEach(function(b) {
      var card = document.createElement('a');
      card.href = b.source_url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.className = 'block rounded border bg-gray-950 border-gray-800 p-3 hover:border-blue-600 transition';
      card.style.borderLeft = '4px solid ' + _regionColor(b.region);

      var titleRow = document.createElement('div');
      titleRow.className = 'flex items-baseline gap-2';

      var flagSpan = document.createElement('span');
      flagSpan.className = 'text-base';
      flagSpan.textContent = b.flag;
      titleRow.appendChild(flagSpan);

      var title = document.createElement('div');
      title.className = 'text-sm font-semibold text-gray-100';
      title.textContent = b.title;
      titleRow.appendChild(title);

      card.appendChild(titleRow);

      var year = document.createElement('div');
      year.className = 'text-[10px] text-gray-500 uppercase tracking-wider mt-0.5';
      year.textContent = b.region + ' · ' + b.year;
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

  var api = {
    _BENCHMARK_DIMENSION_MAP: _BENCHMARK_DIMENSION_MAP,
    _resolveDimension: _resolveDimension,
    _ensureMountPoint: _ensureMountPoint,
    _applyToolbox: _applyToolbox,
    _SOV_BREAKTHROUGHS: _SOV_BREAKTHROUGHS,
    renderHeroCards: renderHeroCards,
    renderVLAIRRadar: renderVLAIRRadar,
    renderBenchmarkCatalog: renderBenchmarkCatalog,
    _FRONTIER_IDS_FOR_SOV: _FRONTIER_IDS_FOR_SOV,
    _SOV_SPECIALIST_IDS: _SOV_SPECIALIST_IDS,
    _avgScoreForGroup: _avgScoreForGroup,
    renderFrontierVsSovereign: renderFrontierVsSovereign,
    _modelReleaseDate: _modelReleaseDate,
    renderMultilangProgression: renderMultilangProgression,
    _dimensionBenchmarks: _dimensionBenchmarks,
    _perDimensionComposite: _perDimensionComposite,
    openDimensionLeaderboard: openDimensionLeaderboard,
    renderAll: renderAll
  };

  root.SovereignCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
