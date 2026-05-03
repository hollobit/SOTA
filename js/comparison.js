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
        this._setupSearch();
        this._setupPresets();
        this._setupCounters();
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

    _setupSearch: function() {
        var self = this;
        var modelSel = document.getElementById('cmp-models');
        var benchSel = document.getElementById('cmp-benchmarks');
        var modelSearch = document.getElementById('cmp-models-search');
        var benchSearch = document.getElementById('cmp-benchmarks-search');

        // Cache original full options on first call
        if (modelSel && !modelSel._allOptions) {
            modelSel._allOptions = Array.prototype.slice.call(modelSel.options).map(function (o) {
                return { value: o.value, text: o.text };
            });
        }
        if (benchSel && !benchSel._allOptions) {
            benchSel._allOptions = Array.prototype.slice.call(benchSel.options).map(function (o) {
                return { value: o.value, text: o.text };
            });
        }

        function filterOptions(sel, query) {
            if (!sel || !sel._allOptions) return;
            var q = (query || '').toLowerCase();
            // Preserve currently-selected values
            var selected = {};
            Array.prototype.forEach.call(sel.selectedOptions, function (o) {
                selected[o.value] = true;
            });
            sel.textContent = '';
            sel._allOptions.forEach(function (opt) {
                if (q && opt.text.toLowerCase().indexOf(q) === -1 && opt.value.toLowerCase().indexOf(q) === -1) return;
                var o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.text;
                if (selected[opt.value]) o.selected = true;
                sel.appendChild(o);
            });
        }

        if (modelSearch && modelSel) {
            modelSearch.addEventListener('input', function () {
                filterOptions(modelSel, modelSearch.value);
            });
        }
        if (benchSearch && benchSel) {
            benchSearch.addEventListener('input', function () {
                filterOptions(benchSel, benchSearch.value);
            });
        }
    },

    _setupPresets: function() {
        var self = this;
        var presetButtons = document.querySelectorAll('.cmp-preset');
        var modelSel = document.getElementById('cmp-models');
        if (!modelSel) return;

        // Preset definitions
        var presets = {
            'frontier-top5': [
                'openai/gpt-5.5',
                'anthropic/claude-opus-4.7',
                'google/gemini-3.1-pro',
                'xai/grok-4.3',
                'deepseek/deepseek-v4-pro',
            ],
            'frontier-30': [
                'openai/gpt-5.5', 'openai/gpt-5.5-pro', 'openai/gpt-5.4', 'openai/gpt-5.4-thinking', 'openai/gpt-5.3-codex',
                'anthropic/claude-opus-4.7', 'anthropic/claude-mythos-preview', 'anthropic/claude-opus-4.6',
                'google/gemini-3.1-pro', 'google/gemini-3-pro',
                'xai/grok-4.3', 'xai/grok-4-heavy',
                'meta/muse-spark',
                'deepseek/deepseek-v4-pro', 'deepseek/deepseek-v4-flash',
                'moonshot/kimi-k2.6',
                'zhipu/glm-5.1', 'zhipu/glm-5',
                'alibaba/qwen3.6-27b', 'alibaba/qwen3.6-35b-a3b',
                'tencent/hy3-preview',
                'baidu/ernie-5.0',
                'lg/exaone-4.5-33b', 'lg/k-exaone-236b',
                'skt/ax-k1',
                'mistral/mistral-medium-3.5', 'mistral/mistral-small-4',
                'sber/gigachat-3.1-ultra',
                'dicta/dictalm-3.0-24b-thinking',
                'cohere/tiny-aya-3b',
            ],
            'korean-sovereign': [
                'lg/exaone-4.5-33b', 'lg/k-exaone-236b',
                'skt/ax-k1',
                'kakao/kanana-2-30b-a3b-thinking', 'kakao/kanana-1.5-o-9.8b',
                'upstage/solar-open-100b', 'upstage/solar-pro-3',
                'naver/hyperclova-x-think-32b',
            ],
        };

        function applyPreset(presetKey) {
            var ids;
            if (presetKey === 'open-weight' || presetKey === 'proprietary') {
                // Filter from all models by type
                ids = (self._allModels || []).filter(function (m) {
                    return m.type === presetKey;
                }).slice(0, 30).map(function (m) { return m.id; });
            } else {
                ids = presets[presetKey] || [];
            }

            // Clear current selection then select preset ids
            Array.prototype.forEach.call(modelSel.options, function (o) { o.selected = false; });
            ids.forEach(function (id) {
                var found = Array.prototype.find.call(modelSel.options, function (o) { return o.value === id; });
                if (found) found.selected = true;
            });
            // Update counters + render
            if (self._updateCounters) self._updateCounters();
            if (typeof self.render === 'function') self.render();
        }

        presetButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                applyPreset(btn.getAttribute('data-preset'));
            });
        });
    },

    _setupCounters: function() {
        var self = this;
        var modelSel = document.getElementById('cmp-models');
        var benchSel = document.getElementById('cmp-benchmarks');
        var modelCount = document.getElementById('cmp-models-count');
        var benchCount = document.getElementById('cmp-benchmarks-count');

        function updateModelCount() {
            if (modelCount && modelSel) modelCount.textContent = modelSel.selectedOptions.length;
        }
        function updateBenchCount() {
            if (benchCount && benchSel) benchCount.textContent = benchSel.selectedOptions.length;
        }
        if (modelSel) modelSel.addEventListener('change', updateModelCount);
        if (benchSel) benchSel.addEventListener('change', updateBenchCount);
        updateModelCount();
        updateBenchCount();

        // Expose so presets can call it
        this._updateCounters = function () { updateModelCount(); updateBenchCount(); };
    },

    _renderMetaTable: function(modelIds) {
        // Render Performance & Cost meta rows ABOVE the matrix
        var container = document.getElementById('cmp-meta-table');
        if (!container) return;
        container.textContent = '';
        if (!modelIds || modelIds.length === 0) return;

        // Build meta rows: Released, Arena Elo, Intelligence Index, Input price, Output price, Throughput
        var enrichmentMap = (typeof App !== 'undefined' && App.data && App.data.enrichment) || {};
        var pricingMap = (typeof App !== 'undefined' && App.data && App.data.pricing) || {};

        var self = this;

        function getCellValue(mid, key) {
            var ent = enrichmentMap[mid] || {};
            var price = pricingMap[mid] || {};
            switch (key) {
                case 'released':
                    var m = (self._allModels || []).find(function (x) { return x.id === mid; });
                    return m ? (m.release_date || m.released_at || '—') : '—';
                case 'arena_elo':
                    return (ent.benchmarks_meta || {}).arena_elo || '—';
                case 'intelligence':
                    return price.intelligence_index || '—';
                case 'input_price':
                    var ip = (ent.pricing || {}).input != null ? (ent.pricing || {}).input : price.input;
                    return ip != null ? '$' + ip : '—';
                case 'output_price':
                    var op = (ent.pricing || {}).output != null ? (ent.pricing || {}).output : price.output;
                    return op != null ? '$' + op : '—';
                case 'throughput':
                    return price.tokens_per_second != null ? price.tokens_per_second + ' t/s' : '—';
                default:
                    return '—';
            }
        }

        var rows = [
            { label: 'Released', key: 'released' },
            { label: 'Arena Elo', key: 'arena_elo' },
            { label: 'Intelligence Index', key: 'intelligence' },
            { label: 'Input $/1M', key: 'input_price' },
            { label: 'Output $/1M', key: 'output_price' },
            { label: 'Throughput', key: 'throughput' },
        ];

        var metaTable = document.createElement('table');
        metaTable.className = 'sota-table text-xs mb-2';
        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        var thCorner = document.createElement('th');
        thCorner.textContent = 'Metric';
        thCorner.className = 'text-left';
        hr.appendChild(thCorner);
        modelIds.forEach(function (mid) {
            var th = document.createElement('th');
            th.style.fontSize = '10px';
            th.style.whiteSpace = 'nowrap';
            var m = (self._allModels || []).find(function (x) { return x.id === mid; });
            th.textContent = m ? m.name : mid;
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        metaTable.appendChild(thead);

        var tbody = document.createElement('tbody');
        rows.forEach(function (row) {
            var tr = document.createElement('tr');
            var tdLabel = document.createElement('td');
            tdLabel.textContent = row.label;
            tdLabel.style.color = '#9ca3af';
            tr.appendChild(tdLabel);
            modelIds.forEach(function (mid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.fontFamily = 'monospace';
                td.style.fontSize = '11px';
                td.textContent = String(getCellValue(mid, row.key));
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        metaTable.appendChild(tbody);

        var wrapper = document.createElement('div');
        wrapper.className = 'overflow-x-auto bg-gray-900 rounded-lg p-3 border border-gray-800';
        var title = document.createElement('div');
        title.className = 'text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2';
        title.textContent = 'Performance & Cost (Meta Rows)';
        wrapper.appendChild(title);
        wrapper.appendChild(metaTable);
        container.appendChild(wrapper);
    },

    render: function() {
        var modelSel = document.getElementById('cmp-models');
        var selectedModelIds = modelSel ? Array.prototype.map.call(modelSel.selectedOptions, function(o) { return o.value; }) : [];
        // NEW: render meta-rows table at top
        if (this._renderMetaTable) this._renderMetaTable(selectedModelIds);
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
            var span = document.createElement('span');
            span.className = 'cursor-pointer hover:text-blue-400 transition';
            span.textContent = model ? model.name : mId.split('/').pop();
            span.onclick = (function(id) { return function() {
                if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(id);
            }; })(mId);
            th.appendChild(span);
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
