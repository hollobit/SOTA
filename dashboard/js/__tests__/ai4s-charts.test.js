'use strict';
var assert = require('assert');
var AI4SCharts = require('../ai4s-charts.js');

assert.ok(AI4SCharts, 'AI4SCharts must be exported');
assert.ok(AI4SCharts._resolveLab, '_resolveLab must be exported');

// known prefixes resolve correctly
assert.strictEqual(AI4SCharts._resolveLab('deepmind/alphafold-3').key, 'deepmind');
assert.strictEqual(AI4SCharts._resolveLab('mit-cfs/torax').key, 'mit-cfs');
assert.strictEqual(AI4SCharts._resolveLab('nvidia-clara/rnapro').key, 'nvidia');
assert.strictEqual(AI4SCharts._resolveLab('isomorphic/iso-dde-chai-2').key, 'isomorphic');
assert.strictEqual(AI4SCharts._resolveLab('ecmwf/aifs-single').key, 'ecmwf');

// unknown prefix falls into 'other'
assert.strictEqual(AI4SCharts._resolveLab('random-vendor/unknown').key, 'other');
assert.strictEqual(AI4SCharts._resolveLab('').key, 'other');

console.log('Task 1 _resolveLab OK');

// Task 2 — _resolveDomain
assert.ok(AI4SCharts._resolveDomain, '_resolveDomain must be exported');
assert.strictEqual(AI4SCharts._resolveDomain('casp16_gdt'), 'bio-genomics');
assert.strictEqual(AI4SCharts._resolveDomain('alphafold3_pae'), 'bio-genomics');
assert.strictEqual(AI4SCharts._resolveDomain('imo_answerbench'), 'math');
assert.strictEqual(AI4SCharts._resolveDomain('frontiermath'), 'math');
assert.strictEqual(AI4SCharts._resolveDomain('matharena_apex'), 'math');
assert.strictEqual(AI4SCharts._resolveDomain('unknown_benchmark'), null);

console.log('Task 2 _resolveDomain OK');

// Task 4 — _BREAKTHROUGHS schema
assert.ok(Array.isArray(AI4SCharts._BREAKTHROUGHS), '_BREAKTHROUGHS must be array');
assert.ok(AI4SCharts._BREAKTHROUGHS.length >= 5 && AI4SCharts._BREAKTHROUGHS.length <= 8,
    'expected 5-8 breakthrough tiles');

AI4SCharts._BREAKTHROUGHS.forEach(function(b, i) {
    assert.ok(b.title,        'entry ' + i + ' missing title');
    assert.ok(b.narrative,    'entry ' + i + ' missing narrative');
    assert.ok(b.value,        'entry ' + i + ' missing value');
    assert.ok(b.domain,       'entry ' + i + ' missing domain');
    assert.ok(b.source_url && b.source_url.indexOf('http') === 0,
        'entry ' + i + ' source_url must be http(s)://...');
    assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});

console.log('Task 4 _BREAKTHROUGHS schema OK');

// Task 14 — _perDomainComposite (pure logic test; no DOM)
assert.ok(AI4SCharts._perDomainComposite, '_perDomainComposite must be exported');

// Mock window.App for the test
global.window = global.window || {};
global.window.App = { data: { scores: [
  { model_id: 'm1', benchmark_id: 'math_500', value: 80 },
  { model_id: 'm2', benchmark_id: 'math_500', value: 100 },
  { model_id: 'm1', benchmark_id: 'frontiermath', value: 60 },
  { model_id: 'm2', benchmark_id: 'frontiermath', value: 50 }
]}};

var c1 = AI4SCharts._perDomainComposite('m1', ['math_500', 'frontiermath']);
assert.ok(c1, 'm1 should have composite');
assert.strictEqual(c1.coverage, 2);
// m1: math_500 = 80/100 * 100 = 80; frontiermath = 60/60 * 100 = 100
// composite = (80 + 100) / 2 = 90
assert.strictEqual(c1.score, 90);

var c2 = AI4SCharts._perDomainComposite('m2', ['math_500', 'frontiermath']);
assert.strictEqual(c2.coverage, 2);
// m2: math_500 = 100/100 * 100 = 100; frontiermath = 50/60 * 100 ≈ 83.33
// composite = (100 + 83.33) / 2 ≈ 91.67
assert.ok(Math.abs(c2.score - 91.6667) < 0.001);

// Model with no scores → null
assert.strictEqual(AI4SCharts._perDomainComposite('m3', ['math_500']), null);

console.log('Task 14 _perDomainComposite OK');
