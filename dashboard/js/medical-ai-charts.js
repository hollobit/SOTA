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

  var api = {
    _SPECIALTY_MAP: _SPECIALTY_MAP,
    _resolveSpecialty: _resolveSpecialty
  };

  root.MedicalAICharts = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
