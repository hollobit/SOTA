'use strict';
var assert = require('assert');
var M = require('../medical-ai-charts.js');

assert.ok(M, 'MedicalAICharts must be exported');
assert.ok(M._resolveSpecialty, '_resolveSpecialty must be exported');

assert.strictEqual(M._resolveSpecialty('google/med-gemini-3-pro').key, 'general');
assert.strictEqual(M._resolveSpecialty('saama/openbiollm-llama3-70b').key, 'biomedical');
assert.strictEqual(M._resolveSpecialty('huawei/dermavqa').key, 'dermatology');
assert.strictEqual(M._resolveSpecialty('virchow/path-vit').key, 'pathology');
assert.strictEqual(M._resolveSpecialty('').key, 'other');
assert.strictEqual(M._resolveSpecialty('random/unknown').key, 'other');

console.log('Task 1 _resolveSpecialty OK');

// Task 2
assert.ok(M._resolveCategory, '_resolveCategory must be exported');
assert.strictEqual(M._resolveCategory('medqa_usmle'), 'clinical-knowledge');
assert.strictEqual(M._resolveCategory('pubmedqa'), 'biomedical-research');
assert.strictEqual(M._resolveCategory('healthbench_pro_redteam'), 'healthbench');
assert.strictEqual(M._resolveCategory('mmedbench'), 'multilingual');
assert.strictEqual(M._resolveCategory('unknown_bench'), null);

console.log('Task 2 _resolveCategory OK');

// Task 4
assert.ok(Array.isArray(M._MED_BREAKTHROUGHS));
assert.ok(M._MED_BREAKTHROUGHS.length >= 6 && M._MED_BREAKTHROUGHS.length <= 8);
M._MED_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.domain, 'entry ' + i + ' missing domain');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 4 _MED_BREAKTHROUGHS schema OK');
