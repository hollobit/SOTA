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
