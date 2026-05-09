'use strict';
var assert = require('assert');
var S = require('../sovereign-charts.js');

assert.ok(S, 'SovereignCharts must be exported');
assert.ok(S._resolveDimension, '_resolveDimension must be exported');

assert.strictEqual(S._resolveDimension('mmmlu'), 'language');
assert.strictEqual(S._resolveDimension('chinese_simpleqa'), 'language');
assert.strictEqual(S._resolveDimension('kmle'), 'medical');
assert.strictEqual(S._resolveDimension('healthbench_professional'), 'medical');
assert.strictEqual(S._resolveDimension('vlair_doc_qa'), 'domain');
assert.strictEqual(S._resolveDimension('aixcc_synth_vuln'), 'domain');
assert.strictEqual(S._resolveDimension('unknown_bench'), null);

console.log('Task 1 _resolveDimension OK');

// Task 3
assert.ok(Array.isArray(S._SOV_BREAKTHROUGHS));
assert.ok(S._SOV_BREAKTHROUGHS.length >= 6 && S._SOV_BREAKTHROUGHS.length <= 8);
S._SOV_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.region, 'entry ' + i + ' missing region');
  assert.ok(b.flag, 'entry ' + i + ' missing flag');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 3 _SOV_BREAKTHROUGHS schema OK');

// Task 9
assert.ok(S._perDimensionComposite, '_perDimensionComposite must be exported');
global.window = global.window || {};
global.window.App = { data: { scores: [
  { model_id: 'm1', benchmark_id: 'mmmlu', value: 80 },
  { model_id: 'm2', benchmark_id: 'mmmlu', value: 100 },
  { model_id: 'm1', benchmark_id: 'c_eval', value: 60 },
  { model_id: 'm2', benchmark_id: 'c_eval', value: 50 }
]}};
var c1 = S._perDimensionComposite('m1', ['mmmlu','c_eval']);
assert.ok(c1, 'm1 should have composite');
assert.strictEqual(c1.coverage, 2);
assert.strictEqual(c1.score, 90);
var c2 = S._perDimensionComposite('m2', ['mmmlu','c_eval']);
assert.strictEqual(c2.coverage, 2);
assert.ok(Math.abs(c2.score - 91.6667) < 0.001);
assert.strictEqual(S._perDimensionComposite('m3', ['mmmlu']), null);
console.log('Task 9 _perDimensionComposite OK');
