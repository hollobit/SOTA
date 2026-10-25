/**
 * Filtering and sorting logic for the leaderboard table.
 */
var Filters = {
    apply: function(scores, models, opts) {
        var filtered = scores.slice();

        if (opts.category) {
            var benchIds = {};
            (window._benchmarks || []).forEach(function(b) {
                if (b.category === opts.category) benchIds[b.id] = true;
            });
            filtered = filtered.filter(function(s) { return benchIds[s.benchmark_id]; });
        }

        if (opts.modelType) {
            var modelIds = {};
            models.forEach(function(m) {
                if (m.type === opts.modelType) modelIds[m.id] = true;
            });
            filtered = filtered.filter(function(s) { return modelIds[s.model_id]; });
        }

        if (opts.source) {
            filtered = filtered.filter(function(s) {
                return s.source && s.source.type === opts.source;
            });
        }

        if (opts.benchmark) {
            filtered = filtered.filter(function(s) {
                return s.benchmark_id === opts.benchmark;
            });
        }

        if (opts.search) {
            // Semantic-extended search: matches across model id+name+vendor and
            // benchmark id+name+description+category+metric. Multi-token
            // (whitespace-separated): every token must appear somewhere in the
            // combined haystack (any order). Empty input matches everything.
            var rawQ = opts.search.toLowerCase().trim();
            var tokens = rawQ.split(/\s+/).filter(function(t) { return t.length > 0; });
            if (tokens.length > 0) {
                var benchHay = {};
                (window._benchmarks || []).forEach(function(b) {
                    benchHay[b.id] = (
                        (b.name || '') + ' ' + b.id + ' ' +
                        (b.category || '') + ' ' + (b.metric || '') + ' ' +
                        (b.description || '')
                    ).toLowerCase();
                });
                var modelHay = {};
                models.forEach(function(m) {
                    modelHay[m.id] = (
                        (m.name || '') + ' ' + m.id + ' ' + (m.vendor || '')
                    ).toLowerCase();
                });
                filtered = filtered.filter(function(s) {
                    var combined = (modelHay[s.model_id] || s.model_id.toLowerCase()) +
                                   ' ' +
                                   (benchHay[s.benchmark_id] || s.benchmark_id.toLowerCase());
                    for (var i = 0; i < tokens.length; i++) {
                        if (combined.indexOf(tokens[i]) === -1) return false;
                    }
                    return true;
                });
            }
        }

        return filtered;
    },

    sortByValue: function(scores, ascending) {
        return scores.sort(function(a, b) {
            return ascending ? a.value - b.value : b.value - a.value;
        });
    },

    groupByModel: function(scores) {
        var grouped = {};
        scores.forEach(function(s) {
            if (!grouped[s.model_id]) grouped[s.model_id] = {};
            grouped[s.model_id][s.benchmark_id] = s.value;
        });
        return grouped;
    }
};
