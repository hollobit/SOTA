'use strict';
var assert = require('assert');
var P = require('../physical-ai-charts.js');

assert.ok(P, 'PhysicalAICharts must be exported');
assert.ok(P._resolveFamily, '_resolveFamily must be exported');

assert.strictEqual(P._resolveFamily('nvidia/gr00t-n1.7').key, 'gr00t');
assert.strictEqual(P._resolveFamily('physical-intelligence/pi-zero').key, 'pi');
assert.strictEqual(P._resolveFamily('openvla/openvla-7b').key, 'openvla');
assert.strictEqual(P._resolveFamily('octo/octo-base').key, 'octo');
assert.strictEqual(P._resolveFamily('google-deepmind/gemini-robotics-er-1.6').key, 'gemini-robotics');
assert.strictEqual(P._resolveFamily('figure-ai/helix').key, 'industrial-humanoid');
assert.strictEqual(P._resolveFamily('foxconn/foxbrain-70b').key, 'industrial-fm');
assert.strictEqual(P._resolveFamily('meta/sapiens2-5b').key, 'human-vision');
assert.strictEqual(P._resolveFamily('').key, 'other');
assert.strictEqual(P._resolveFamily('random/unknown').key, 'other');

console.log('Task 1 _resolveFamily OK');

// Task 2
assert.ok(P._resolveSuite, '_resolveSuite must be exported');
assert.strictEqual(P._resolveSuite('libero'), 'vla-manipulation');
assert.strictEqual(P._resolveSuite('libero_spatial'), 'vla-manipulation');
assert.strictEqual(P._resolveSuite('cosmos_embodied_reasoning'), 'world-model');
assert.strictEqual(P._resolveSuite('world_model_consistency'), 'world-model');
assert.strictEqual(P._resolveSuite('unknown_bench'), null);
console.log('Task 2 _resolveSuite OK');

// Task 4
assert.ok(Array.isArray(P._PHY_BREAKTHROUGHS));
assert.ok(P._PHY_BREAKTHROUGHS.length >= 6 && P._PHY_BREAKTHROUGHS.length <= 8);
P._PHY_BREAKTHROUGHS.forEach(function(b, i) {
  assert.ok(b.title, 'entry ' + i + ' missing title');
  assert.ok(b.narrative, 'entry ' + i + ' missing narrative');
  assert.ok(b.value, 'entry ' + i + ' missing value');
  assert.ok(b.domain, 'entry ' + i + ' missing domain');
  assert.ok(b.source_url && b.source_url.indexOf('http') === 0, 'entry ' + i + ' source_url must be http(s)');
  assert.ok(typeof b.year === 'number', 'entry ' + i + ' year must be number');
});
console.log('Task 4 _PHY_BREAKTHROUGHS schema OK');
