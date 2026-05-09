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
  // Empty stub — populated as widgets land per Tasks 4-9.
  // ====================================================================
  function renderAll() {
    // Widgets registered as Phase 1B + Phase 2 tasks land. Empty for now.
  }

  var api = {
    _BENCHMARK_DIMENSION_MAP: _BENCHMARK_DIMENSION_MAP,
    _resolveDimension: _resolveDimension,
    _ensureMountPoint: _ensureMountPoint,
    _applyToolbox: _applyToolbox,
    renderAll: renderAll
  };

  root.SovereignCharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
