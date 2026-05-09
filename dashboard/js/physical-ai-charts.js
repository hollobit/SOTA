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
  // Public render orchestrator. Called from PhysicalAI.render().
  // Empty stub — populated as widgets land per Tasks 5-14.
  // ====================================================================
  function renderAll() {
    // Widgets registered as Phase 1B + Phase 2B tasks land. Empty for now.
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
      model_id: 'nvidia/cosmos-transfer-2.5',
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
    renderAll: renderAll
  };

  root.PhysicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
