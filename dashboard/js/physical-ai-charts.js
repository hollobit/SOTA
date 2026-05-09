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
  // Public API.
  // ====================================================================
  var api = {
    _FAMILY_MAP: _FAMILY_MAP,
    _resolveFamily: _resolveFamily,
    _BENCHMARK_FAMILY_MAP: _BENCHMARK_FAMILY_MAP,
    _resolveSuite: _resolveSuite
  };

  root.PhysicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
