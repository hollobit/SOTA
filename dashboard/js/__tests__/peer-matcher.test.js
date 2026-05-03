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

// ---- sotaTier tied-score behavior ----
var tiedModels = [];
var tiedScores = [];
for (var ti = 0; ti < 6; ti++) {
    var tpad = ((ti + 1) < 10 ? '0' : '') + (ti + 1);
    tiedModels.push({id: 't' + ti, vendor: 'V', release_date: '2026-' + tpad + '-01'});
    tiedScores.push({model_id: 't' + ti, benchmark_id: 'mmlu', value: ti < 3 ? 90 : 80});
}
var tied1 = PeerMatcher.sotaTier(90, 't0', 'mmlu', tiedModels, tiedScores);
var tied2 = PeerMatcher.sotaTier(90, 't1', 'mmlu', tiedModels, tiedScores);
var tied3 = PeerMatcher.sotaTier(90, 't2', 'mmlu', tiedModels, tiedScores);
assert.strictEqual(tied1.rank, 1, 'tied at top all share rank 1');
assert.strictEqual(tied2.rank, 1, 'second 90 shares rank 1 not rank 2');
assert.strictEqual(tied3.rank, 1, 'third 90 shares rank 1 not rank 3');
assert.strictEqual(tied1.tier, 'sota');
assert.strictEqual(tied2.tier, 'sota');
console.log('sotaTier tied scores share rank OK');

// ---- extractStrengthsWeaknesses ----
var sw = PeerMatcher.extractStrengthsWeaknesses('m0', sotaModels, sotaScores);
assert.ok(sw.strengths.length >= 1);
assert.strictEqual(sw.strengths[0].benchmark_id, 'mmlu');
console.log('extractStrengthsWeaknesses OK');

// ---- extractStrengthsWeaknesses weakness path ----
// Build population where target model is far below peer avg on one bench
var weakModels = [];
var weakScores = [];
for (var wi = 0; wi < 6; wi++) {
    var wpad = ((wi + 1) < 10 ? '0' : '') + (wi + 1);
    weakModels.push({id: 'w' + wi, vendor: 'V', release_date: '2026-' + wpad + '-01'});
}
weakScores.push({model_id: 'w0', benchmark_id: 'hard_bench', value: 30});
for (var wj = 1; wj < 6; wj++) weakScores.push({model_id: 'w' + wj, benchmark_id: 'hard_bench', value: 80});
var swWeak = PeerMatcher.extractStrengthsWeaknesses('w0', weakModels, weakScores);
assert.strictEqual(swWeak.weaknesses.length, 1, 'should detect 1 weakness');
assert.strictEqual(swWeak.weaknesses[0].benchmark_id, 'hard_bench');
assert.ok(swWeak.weaknesses[0].delta < -10, 'delta below threshold');
console.log('extractStrengthsWeaknesses weakness path OK');

console.log('\nALL PEER MATCHER TESTS PASS');
