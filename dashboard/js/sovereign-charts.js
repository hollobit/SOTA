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
  // Public render orchestrator. Called from Sovereign.render().
  // ====================================================================
  function renderAll() {
    try { renderHeroCards(); } catch (e) {
      if (typeof console !== 'undefined') console.warn('[SovereignCharts] hero failed:', e);
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
    renderAll: renderAll
  };

  root.SovereignCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
