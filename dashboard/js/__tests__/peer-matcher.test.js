// Vanilla node assert harness.
// Run: node dashboard/js/__tests__/peer-matcher.test.js
'use strict';
var assert = require('assert');
var PeerMatcher = require('../peer-matcher.js');

assert.ok(PeerMatcher, 'PeerMatcher must be exported');

// ---- findPeers ----
var models = [
    {id: 'a', vendor: 'X', release_date: '2026-01-01'},
    {id: 'b', vendor: 'X', release_date: '2026-02-01'},
    {id: 'c', vendor: 'Y', release_date: '2026-03-01'},
    {id: 'd', vendor: 'Z', release_date: '2025-01-01'},
];
var scores = [];
['mmlu','gpqa','aime','hum_eval','math','swe','agi'].forEach(function(b, i) {
    scores.push({model_id: 'a', benchmark_id: b, value: 80 + i});
    scores.push({model_id: 'b', benchmark_id: b, value: 78 + i});
    scores.push({model_id: 'c', benchmark_id: b, value: 50 + i});
    if (i < 3) scores.push({model_id: 'd', benchmark_id: b, value: 90 + i});
});

var peers = PeerMatcher.findPeers('a', models, scores, 3);
assert.strictEqual(peers.length, 2, 'd is excluded -- only 3 shared benches');
assert.strictEqual(peers[0].modelId, 'b', 'b is closer (small avgDelta)');
assert.strictEqual(peers[0].overlap, 7);
console.log('findPeers basic OK');

var sparse = PeerMatcher.findPeers('a', [{id:'z',vendor:'Q',release_date:'2026-01-01'}], scores, 3);
assert.deepStrictEqual(sparse, []);
console.log('findPeers insufficient overlap OK');

var selfFiltered = PeerMatcher.findPeers('a', models, scores, 5).filter(function(p) { return p.modelId === 'a'; });
assert.strictEqual(selfFiltered.length, 0);
console.log('findPeers self-filtered OK');

// ---- sotaTier ----
var sotaModels = [];
var sotaScores = [];
for (var i = 0; i < 12; i++) {
    var pad = (((i % 12) + 1) < 10 ? '0' : '') + ((i % 12) + 1);
    sotaModels.push({id: 'm' + i, vendor: 'V', release_date: '2026-' + pad + '-01'});
    sotaScores.push({model_id: 'm' + i, benchmark_id: 'mmlu', value: 90 - i});
}
sotaModels.push({id: 'old', vendor: 'V', release_date: '2020-01-01'});
sotaScores.push({model_id: 'old', benchmark_id: 'mmlu', value: 99});

var tier1 = PeerMatcher.sotaTier(90, 'm0', 'mmlu', sotaModels, sotaScores);
assert.strictEqual(tier1.tier, 'sota');
assert.strictEqual(tier1.rank, 1);
assert.strictEqual(tier1.total, 12);

var tier3 = PeerMatcher.sotaTier(88, 'm2', 'mmlu', sotaModels, sotaScores);
assert.strictEqual(tier3.tier, 'top3');

var tier10 = PeerMatcher.sotaTier(83, 'm7', 'mmlu', sotaModels, sotaScores);
assert.strictEqual(tier10.tier, 'top10');
console.log('sotaTier 12-month + tiering OK');

var nullPop = PeerMatcher.sotaTier(90, 'a', 'unknown_bench', sotaModels, sotaScores);
assert.strictEqual(nullPop, null);
console.log('sotaTier insufficient population OK');

// ---- extractStrengthsWeaknesses ----
var sw = PeerMatcher.extractStrengthsWeaknesses('m0', sotaModels, sotaScores);
assert.ok(sw.strengths.length >= 1);
assert.strictEqual(sw.strengths[0].benchmark_id, 'mmlu');
console.log('extractStrengthsWeaknesses OK');

console.log('\nALL PEER MATCHER TESTS PASS');
