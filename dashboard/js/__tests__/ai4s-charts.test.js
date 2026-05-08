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
