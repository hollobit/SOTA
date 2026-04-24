/**
 * Comparison tab — multi-model x multi-benchmark matrix with localStorage persistence.
 * Uses safe DOM methods throughout.
 */
var Comparison = {
    STORAGE_KEY: 'cyber_cmp_state',

    // Default top models and benchmarks (pre-selected on first load)
    DEFAULT_MODELS: [
        'anthropic/claude-opus-4.7',
        'openai/gpt-5.5',
        'google/gemini-3.1-pro',
        'moonshot/kimi-k2.6',
        'alibaba/qwen3.6-27b'
    ],
    DEFAULT_BENCHMARKS: [
        'gpqa_diamond',
        'swe_bench_verified',
        'swe_bench_pro',
        'aime_2026',
        'cybench'
    ],

    _state: { models: [], benchmarks: [] },

    init: function(allModels, allBenchmarks, scores) {
        this._allModels = allModels;
        this._allBenchmarks = allBenchmarks;
        this._scores = scores;
        this._populateSelectors();
        this._loadState();
        this._applySelections();
        this._bindEvents();
    },

    _populateSelectors: function() {
        var modelSel = document.getElementById('cmp-models');
        var benchSel = document.getElementById('cmp-benchmarks');
        modelSel.textContent = '';
        benchSel.textContent = '';

        this._allModels.forEach(function(m) {
            var opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name + ' (' + m.vendor + ')';
            modelSel.appendChild(opt);
        });

        this._allBenchmarks.forEach(function(b) {
            var opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            benchSel.appendChild(opt);
        });
    },

    _loadState: function() {
        try {
            var saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                this._state = JSON.parse(saved);
                return;
            }
        } catch(e) {}

        // First load: use defaults, filtered to what actually exists
        var modelIds = {};
        this._allModels.forEach(function(m) { modelIds[m.id] = true; });
        var benchIds = {};
        this._allBenchmarks.forEach(function(b) { benchIds[b.id] = true; });

        this._state = {
            models: this.DEFAULT_MODELS.filter(function(id) { return modelIds[id]; }),
            benchmarks: this.DEFAULT_BENCHMARKS.filter(function(id) { return benchIds[id]; })
        };

        // If defaults don't match data, pick top models by score count
        if (this._state.models.length < 3) {
            var counts = {};
            this._scores.forEach(function(s) {
                counts[s.model_id] = (counts[s.model_id] || 0) + 1;
            });
            var sorted = Object.keys(counts).sort(function(a, b) { return counts[b] - counts[a]; });
            this._state.models = sorted.slice(0, 5);
        }
        if (this._state.benchmarks.length < 3) {
            this._state.benchmarks = this._allBenchmarks.slice(0, 5).map(function(b) { return b.id; });
        }

        this._saveState();
    },

    _saveState: function() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._state));
        } catch(e) {}
    },

    _applySelections: function() {
        var modelSel = document.getElementById('cmp-models');
        var benchSel = document.getElementById('cmp-benchmarks');
        var stateModels = this._state.models;
        var stateBench = this._state.benchmarks;

        Array.from(modelSel.options).forEach(function(opt) {
            opt.selected = stateModels.indexOf(opt.value) !== -1;
        });
        Array.from(benchSel.options).forEach(function(opt) {
            opt.selected = stateBench.indexOf(opt.value) !== -1;
        });
    },

    _bindEvents: function() {
        var self = this;
        document.getElementById('cmp-update').addEventListener('click', function() {
            self._readSelections();
            self._saveState();
            self.render();
        });
        document.getElementById('cmp-reset').addEventListener('click', function() {
            localStorage.removeItem(self.STORAGE_KEY);
            self._loadState();
            self._applySelections();
            self.render();
        });
    },

    _readSelections: function() {
        var modelSel = document.getElementById('cmp-models');
        var benchSel = document.getElementById('cmp-benchmarks');
        this._state.models = Array.from(modelSel.selectedOptions).map(function(o) { return o.value; });
        this._state.benchmarks = Array.from(benchSel.selectedOptions).map(function(o) { return o.value; });
    },

    render: function() {
        this._renderMatrix();
        this._renderRadar();
    },

    _renderMatrix: function() {
        var container = document.getElementById('cmp-matrix-container');
        container.textContent = '';

        var models = this._state.models;
        var benchmarks = this._state.benchmarks;
        if (models.length === 0 || benchmarks.length === 0) {
            var p = document.createElement('p');
            p.className = 'text-gray-500';
            p.textContent = 'Select models and benchmarks, then click Update.';
            container.appendChild(p);
            return;
        }

        // Build score lookup
        var lookup = {};
        this._scores.forEach(function(s) {
            var key = s.model_id + '|' + s.benchmark_id;
            lookup[key] = s.value;
        });

        // Find best per benchmark for highlighting
        var bestPerBench = {};
        var worstPerBench = {};
        benchmarks.forEach(function(bId) {
            var vals = [];
            models.forEach(function(mId) {
                var v = lookup[mId + '|' + bId];
                if (v !== undefined) vals.push(v);
            });
            if (vals.length > 0) {
                bestPerBench[bId] = Math.max.apply(null, vals);
                worstPerBench[bId] = Math.min.apply(null, vals);
            }
        });

        var table = document.createElement('table');
        table.className = 'cmp-table';

        // Header row: blank corner + model names
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        var cornerTh = document.createElement('th');
        cornerTh.className = 'row-header';
        cornerTh.textContent = 'Benchmark \\ Model';
        headerRow.appendChild(cornerTh);

        var self = this;
        models.forEach(function(mId) {
            var th = document.createElement('th');
            var model = self._allModels.find(function(m) { return m.id === mId; });
            th.textContent = model ? model.name : mId.split('/').pop();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body rows: one per benchmark
        var tbody = document.createElement('tbody');
        benchmarks.forEach(function(bId) {
            var tr = document.createElement('tr');
            var benchTh = document.createElement('th');
            benchTh.className = 'row-header';
            var bench = self._allBenchmarks.find(function(b) { return b.id === bId; });
            benchTh.textContent = bench ? bench.name : bId;
            tr.appendChild(benchTh);

            models.forEach(function(mId) {
                var td = document.createElement('td');
                var val = lookup[mId + '|' + bId];
                if (val !== undefined) {
                    td.textContent = val.toFixed(1);
                    if (val === bestPerBench[bId] && models.length > 1) td.className = 'best';
                    else if (val === worstPerBench[bId] && models.length > 1 && bestPerBench[bId] !== worstPerBench[bId]) td.className = 'worst';
                    // Clickable \u2192 opens Modal.showScoreSource for this (model, benchmark)
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.setAttribute('title', '\ud074\ub9ad\ud558\uba74 \uac80\uc99d \uc18c\uc2a4\uc640 \uc218\uc9d1\uc77c\u00b7\ubcc0\uacbd \uc774\ub825 \ud45c\uc2dc');
                    td.addEventListener('click', (function(mid, bid) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(mid, bid);
                            }
                        };
                    })(mId, bId));
                } else {
                    td.textContent = '\u2014';
                    td.className = 'na';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    },

    _renderRadar: function() {
        var models = this._state.models;
        var benchmarks = this._state.benchmarks;
        if (models.length === 0 || benchmarks.length < 3) return;

        var lookup = {};
        this._scores.forEach(function(s) {
            var key = s.model_id + '|' + s.benchmark_id;
            lookup[key] = s.value;
        });

        var self = this;
        var modelsData = models.map(function(mId) {
            var model = self._allModels.find(function(m) { return m.id === mId; });
            var scores = {};
            benchmarks.forEach(function(bId) {
                var v = lookup[mId + '|' + bId];
                if (v !== undefined) scores[bId] = v;
            });
            return { name: model ? model.name : mId.split('/').pop(), scores: scores };
        });

        Charts.renderRadar('cmp-radar-chart', modelsData, benchmarks);
    }
};
