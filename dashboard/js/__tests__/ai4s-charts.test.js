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
