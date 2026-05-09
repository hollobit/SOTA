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

// Task 11
assert.ok(P._perCategoryComposite, '_perCategoryComposite must be exported');
global.window = global.window || {};
global.window.App = { data: { scores: [
  { model_id: 'm1', benchmark_id: 'libero', value: 80 },
  { model_id: 'm2', benchmark_id: 'libero', value: 100 },
  { model_id: 'm1', benchmark_id: 'libero_spatial', value: 60 },
  { model_id: 'm2', benchmark_id: 'libero_spatial', value: 50 }
]}};
var c1 = P._perCategoryComposite('m1', ['libero','libero_spatial']);
assert.ok(c1, 'm1 should have composite');
assert.strictEqual(c1.coverage, 2);
assert.strictEqual(c1.score, 90);
var c2 = P._perCategoryComposite('m2', ['libero','libero_spatial']);
assert.strictEqual(c2.coverage, 2);
assert.ok(Math.abs(c2.score - 91.6667) < 0.001);
assert.strictEqual(P._perCategoryComposite('m3', ['libero']), null);
console.log('Task 11 _perCategoryComposite OK');
