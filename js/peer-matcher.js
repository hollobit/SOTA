/**
 * Peer matcher and SOTA tier tracker (pure functions, no DOM).
 * Spec: docs/superpowers/specs/2026-05-03-model-modal-enhancements-design.md
 *
 * Browser usage: loaded via <script>, attaches PeerMatcher to window.
 * Node test usage: require('./peer-matcher.js') after setting global.window = global.
 */
(function (root) {
    'use strict';

    var MIN_OVERLAP = 5;
    var MIN_POPULATION = 5;
    var WINDOW_DAYS = 365;
    var WEAKNESS_DELTA_THRESHOLD = -10;
    var SCORE_FACTOR = 0.3;

    function _scoresByModel(modelId, allScores) {
        var out = {};
        for (var i = 0; i < allScores.length; i++) {
            var s = allScores[i];
            if (s.model_id === modelId) out[s.benchmark_id] = s.value;
        }
        return out;
    }

    function _cutoffStr(daysBack) {
        var d = new Date();
        d.setUTCDate(d.getUTCDate() - daysBack);
        return d.toISOString().slice(0, 10);
    }

    function _recentModelIds(allModels) {
        var cutoff = _cutoffStr(WINDOW_DAYS);
        var s = {};
        for (var i = 0; i < allModels.length; i++) {
            var m = allModels[i];
            if (m.release_date && m.release_date >= cutoff) s[m.id] = true;
        }
        return s;
    }

    function findPeers(modelId, allModels, allScores, k) {
        if (k == null) k = 3;
        var target = _scoresByModel(modelId, allScores);
        var targetBenches = Object.keys(target);
        if (targetBenches.length < MIN_OVERLAP) return [];
        var targetSet = {};
        for (var i = 0; i < targetBenches.length; i++) targetSet[targetBenches[i]] = true;

        var candidates = [];
        for (var j = 0; j < allModels.length; j++) {
            var mid = allModels[j].id;
            if (mid === modelId) continue;
            var s = _scoresByModel(mid, allScores);
            var overlap = [];
            for (var b in s) {
                if (targetSet[b]) overlap.push(b);
            }
            if (overlap.length < MIN_OVERLAP) continue;
            var sumDiff = 0;
            for (var x = 0; x < overlap.length; x++) {
                sumDiff += Math.abs(s[overlap[x]] - target[overlap[x]]);
            }
            var avgDelta = sumDiff / overlap.length;
            candidates.push({
                modelId: mid,
                overlap: overlap.length,
                avgDelta: avgDelta,
                sharedBenches: overlap.slice(),
                score: overlap.length / (1 + avgDelta * SCORE_FACTOR),
            });
        }
        candidates.sort(function (a, b) { return b.score - a.score; });
        return candidates.slice(0, k);
    }

    function sotaTier(score, modelId, benchmarkId, allModels, allScores) {
        var recent = _recentModelIds(allModels);
        var values = [];
        for (var i = 0; i < allScores.length; i++) {
            var s = allScores[i];
            if (s.benchmark_id === benchmarkId && recent[s.model_id]) values.push(s.value);
        }
        if (values.length < MIN_POPULATION) return null;
        values.sort(function (a, b) { return b - a; });
        var rank = values.indexOf(score) + 1;
        if (rank === 0) return null;
        var total = values.length;
        if (rank === 1) return { tier: 'sota', label: 'SOTA', rank: rank, total: total };
        if (rank <= 3) return { tier: 'top3', label: 'Top 3', rank: rank, total: total };
        if (rank <= 10) return { tier: 'top10', label: 'Top 10', rank: rank, total: total };
        if (rank / total <= 0.25) return { tier: 'q1', label: 'Top 25%', rank: rank, total: total };
        return null;
    }

    function _avgPeerScore(benchmarkId, allModels, allScores) {
        var recent = _recentModelIds(allModels);
        var sum = 0, n = 0;
        for (var i = 0; i < allScores.length; i++) {
            var s = allScores[i];
            if (s.benchmark_id === benchmarkId && recent[s.model_id]) {
                sum += s.value;
                n++;
            }
        }
        if (n < MIN_POPULATION) return null;
        return sum / n;
    }

    function extractStrengthsWeaknesses(modelId, allModels, allScores) {
        var modelScores = [];
        for (var i = 0; i < allScores.length; i++) {
            if (allScores[i].model_id === modelId) modelScores.push(allScores[i]);
        }
        var withTier = modelScores.map(function (s) {
            return {
                benchmark_id: s.benchmark_id,
                value: s.value,
                tier: sotaTier(s.value, modelId, s.benchmark_id, allModels, allScores),
            };
        });

        var strengths = withTier
            .filter(function (r) {
                return r.tier && (r.tier.tier === 'sota' || r.tier.tier === 'top3');
            })
            .sort(function (a, b) { return a.tier.rank - b.tier.rank; })
            .slice(0, 5);

        var weaknesses = withTier
            .map(function (r) {
                var avg = _avgPeerScore(r.benchmark_id, allModels, allScores);
                return {
                    benchmark_id: r.benchmark_id,
                    value: r.value,
                    peerAvg: avg,
                    delta: avg == null ? null : (r.value - avg),
                };
            })
            .filter(function (r) { return r.peerAvg != null && r.delta < WEAKNESS_DELTA_THRESHOLD; })
            .sort(function (a, b) { return a.delta - b.delta; })
            .slice(0, 5);

        return { strengths: strengths, weaknesses: weaknesses };
    }

    var api = {
        findPeers: findPeers,
        sotaTier: sotaTier,
        extractStrengthsWeaknesses: extractStrengthsWeaknesses,
        _avgPeerScore: _avgPeerScore,
        _MIN_OVERLAP: MIN_OVERLAP,
        _MIN_POPULATION: MIN_POPULATION,
        _WINDOW_DAYS: WINDOW_DAYS,
        _WEAKNESS_DELTA_THRESHOLD: WEAKNESS_DELTA_THRESHOLD,
        _SCORE_FACTOR: SCORE_FACTOR,
    };
    root.PeerMatcher = api;
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
