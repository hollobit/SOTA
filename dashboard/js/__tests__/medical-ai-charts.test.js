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
