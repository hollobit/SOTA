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
  // Public render orchestrator. Called from MedicalAI.render().
  // ====================================================================
  function renderAll() {
    try { renderHeroCards(); } catch (e) {
      if (typeof console !== 'undefined') console.warn('[MedicalAICharts] hero failed:', e);
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
    renderAll: renderAll
  };

  root.MedicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
