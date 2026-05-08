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
    'weatherbench_z500_72h':     'geo-climate'
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
  // Public render orchestrator. Called from AI4S.render().
  // Phase 1: stub — actual widget calls added per Task 5-9.
  // ====================================================================
  function renderAll() {
    // Widgets are registered as Phase 1 tasks land. Empty for now.
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
    }
  ];

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
    renderAll: renderAll
  };

  root.AI4SCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
