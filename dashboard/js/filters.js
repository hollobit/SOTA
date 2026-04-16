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
            var q = opts.search.toLowerCase();
            // Build benchmark name lookup
            var benchNames = {};
            (window._benchmarks || []).forEach(function(b) {
                benchNames[b.id] = b.name.toLowerCase();
            });
            filtered = filtered.filter(function(s) {
                var matchModel = s.model_id.toLowerCase().indexOf(q) !== -1;
                var benchName = benchNames[s.benchmark_id] || s.benchmark_id.toLowerCase();
                var matchBench = benchName.indexOf(q) !== -1 || s.benchmark_id.toLowerCase().indexOf(q) !== -1;
                return matchModel || matchBench;
            });
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
