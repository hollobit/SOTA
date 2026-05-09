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
