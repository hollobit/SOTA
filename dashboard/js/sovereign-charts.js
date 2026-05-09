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

  var api = {
    _BENCHMARK_DIMENSION_MAP: _BENCHMARK_DIMENSION_MAP,
    _resolveDimension: _resolveDimension
  };

  root.SovereignCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
