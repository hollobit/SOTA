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
  // Public API.
  // ====================================================================
  var api = {
    _LAB_MAP: _LAB_MAP,
    _resolveLab: _resolveLab,
    _BENCHMARK_DOMAIN_MAP: _BENCHMARK_DOMAIN_MAP,
    _resolveDomain: _resolveDomain
  };

  root.AI4SCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
