/**
 * Frontier Compare tab: heatmap + radar + bar chart
 * comparing latest frontier models on core benchmarks from PDF System Cards.
 */
var FrontierCompare = {
    // Core benchmarks appearing in 2+ PDF sources, grouped by category
    CORE_BENCHMARKS: {
        reasoning: ['gpqa_diamond', 'hle', 'mmlu_pro', 'mmmlu', 'simpleqa_verified', 'longbench_v2'],
        coding: ['swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual', 'terminal_bench_2', 'livecodebench', 'swe_rebench', 'gdpval_aa'],
        math: ['aime_2025', 'hmmt_2025', 'imo_answerbench'],
        agent: ['browsecomp', 'osworld_verified', 'tau2_bench', 'tau3_bench', 'mcp_atlas', 'webarena', 'deepsearchqa', 'vending_bench_2'],
        cybersecurity: ['cybench', 'cybergym', 'evmbench_exploit', 'evmbench_detect', 'cvebench', 'firefox_147', 'cyber_range'],
        multimodal: ['mmmu_pro', 'mathvision', 'video_mmmu', 'longvideobench', 'screenspot_pro', 'charxiv_reasoning']
    },

    // Top frontier models to compare
    FRONTIER_MODELS: [
        'anthropic/claude-opus-4.7',
        'anthropic/claude-mythos-preview',
        'anthropic/claude-opus-4.6',
        'anthropic/claude-opus-4.5',
        'google/gemini-3.1-pro',
        'google/gemini-3-pro',
        'openai/gpt-5.4',
        'openai/gpt-5.4-thinking',
        'openai/gpt-5.3-codex',
        'openai/gpt-5.2',
        'xai/grok-4-heavy',
        'meta/muse-spark',
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.5',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'alibaba/qwen3.6-plus',
        'minimax/m2.7',
        'baidu/ernie-5.0',
        'lg/exaone-4.5-33b',
        'skt/ax-k1',
        'upstage/solar-open-100b',
        'upstage/solar-pro-3',
        'google/gemma-4-31b',
        'mimo/mimo-v2-pro'
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],

    render: function(category) {
        this._models = App.data.models;
        this._benchmarks = App.data.benchmarks;
        this._scores = App.data.scores;

        category = category || 'all';
        var benchIds = this._getBenchmarkIds(category);
        this._renderHeatmap(benchIds);
        this._renderRadar(benchIds, category);
        this._populateBarSelect(benchIds, category);
        // Render bar with currently selected benchmark
        var barSel = document.getElementById('fc-bar-benchmark');
        var selectedBench = barSel ? barSel.value : '';
        this._renderBar(benchIds, category, selectedBench);
    },

    _populateBarSelect: function(benchIds, category) {
        var sel = document.getElementById('fc-bar-benchmark');
        if (!sel) return;
        var self = this;
        var prevVal = sel.value;
        sel.textContent = '';

        benchIds.forEach(function(bid) {
            var opt = document.createElement('option');
            opt.value = bid;
            opt.textContent = self._getBenchName(bid);
            sel.appendChild(opt);
        });

        // Restore previous selection if still valid, otherwise select default
        if (prevVal && benchIds.indexOf(prevVal) >= 0) {
            sel.value = prevVal;
        } else {
            // Default per category
            var defaults = { all: 'swe_bench_verified', coding: 'swe_bench_verified', cybersecurity: 'cybench', agent: 'browsecomp', math: 'aime_2025', multimodal: 'mmmu_pro', reasoning: 'gpqa_diamond' };
            var def = defaults[category] || benchIds[0];
            if (benchIds.indexOf(def) >= 0) sel.value = def;
        }

        // Attach change listener (remove old one first)
        var newSel = sel.cloneNode(true);
        sel.parentNode.replaceChild(newSel, sel);
        newSel.addEventListener('change', function() {
            self._renderBar(benchIds, category, newSel.value);
        });
    },

    _getBenchmarkIds: function(category) {
        if (category === 'all') {
            // Use the most commonly cited ones across all categories
            return [
                'gpqa_diamond', 'hle', 'mmlu_pro', 'mmmlu', 'aime_2025',
                'swe_bench_verified', 'swe_bench_pro', 'terminal_bench_2',
                'cybench', 'cybergym', 'firefox_147',
                'browsecomp', 'osworld_verified', 'mcp_atlas',
                'mmmu_pro', 'livecodebench', 'charxiv_reasoning'
            ];
        }
        return this.CORE_BENCHMARKS[category] || [];
    },

    _getScoreMap: function() {
        var map = {};
        this._scores.forEach(function(s) {
            var key = s.model_id + '|' + s.benchmark_id;
            map[key] = s.value;
        });
        return map;
    },

    _getModelName: function(modelId) {
        var m = this._models.find(function(m) { return m.id === modelId; });
        return m ? m.name : modelId.split('/').pop();
    },

    _getBenchName: function(benchId) {
        var b = this._benchmarks.find(function(b) { return b.id === benchId; });
        return b ? b.name : benchId;
    },

    _renderHeatmap: function(benchIds) {
        var container = document.getElementById('fc-heatmap');
        if (!container) return;
        container.textContent = '';

        var scoreMap = this._getScoreMap();
        var self = this;

        // Filter to models that have at least one score
        var modelIds = this.FRONTIER_MODELS.filter(function(mid) {
            return benchIds.some(function(bid) { return scoreMap[mid + '|' + bid] !== undefined; });
        });

        // Find max per benchmark for color scaling
        var maxes = {};
        benchIds.forEach(function(bid) {
            var max = 0;
            modelIds.forEach(function(mid) {
                var v = scoreMap[mid + '|' + bid];
                if (v !== undefined && v > max) max = v;
            });
            maxes[bid] = max;
        });

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';
        table.style.fontSize = '12px';

        // Header
        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        var thCorner = document.createElement('th');
        thCorner.textContent = 'Model';
        thCorner.style.position = 'sticky';
        thCorner.style.left = '0';
        thCorner.style.zIndex = '10';
        thCorner.style.background = '#111827';
        hr.appendChild(thCorner);

        benchIds.forEach(function(bid) {
            var th = document.createElement('th');
            th.style.fontSize = '10px';
            th.style.whiteSpace = 'nowrap';
            th.style.writingMode = 'vertical-lr';
            th.style.transform = 'rotate(180deg)';
            th.style.height = '120px';
            th.style.verticalAlign = 'bottom';
            th.style.padding = '4px 2px';
            th.textContent = self._getBenchName(bid);
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        // Body
        var tbody = document.createElement('tbody');
        modelIds.forEach(function(mid) {
            var tr = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.textContent = self._getModelName(mid);
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.fontWeight = '500';
            tdName.style.position = 'sticky';
            tdName.style.left = '0';
            tdName.style.background = '#111827';
            tdName.style.zIndex = '5';
            tr.appendChild(tdName);

            benchIds.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.padding = '4px 6px';
                td.style.minWidth = '55px';

                var v = scoreMap[mid + '|' + bid];
                if (v !== undefined) {
                    // Skip color-coding for non-percentage metrics
                    var isSpecial = (bid === 'vending_bench_2' || bid === 'gdpval_aa' || bid === 'metr_time_horizons' || bid === 'livecodebench');
                    var displayVal = v;

                    if (isSpecial) {
                        if (bid === 'vending_bench_2') displayVal = '$' + Math.round(v);
                        else if (bid === 'gdpval_aa' || bid === 'livecodebench') displayVal = Math.round(v);
                        else displayVal = v.toFixed(1);
                        td.textContent = displayVal;
                        td.style.color = '#d1d5db';
                    } else {
                        td.textContent = v.toFixed(1);
                        var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                        if (ratio >= 0.98) {
                            td.style.background = 'rgba(16, 185, 129, 0.35)';
                            td.style.color = '#34d399';
                            td.style.fontWeight = 'bold';
                        } else if (ratio >= 0.90) {
                            td.style.background = 'rgba(59, 130, 246, 0.2)';
                            td.style.color = '#93c5fd';
                        } else if (ratio >= 0.75) {
                            td.style.background = 'rgba(245, 158, 11, 0.15)';
                            td.style.color = '#fbbf24';
                        } else {
                            td.style.color = '#9ca3af';
                        }
                    }
                } else {
                    td.textContent = '\u2014';
                    td.style.color = '#374151';
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    },

    _renderRadar: function(benchIds, category) {
        var el = document.getElementById('fc-radar');
        if (!el) return;
        var chart = echarts.init(el);
        var self = this;
        var scoreMap = this._getScoreMap();

        // Pick top models with most coverage for radar (max 6)
        var coverage = {};
        this.FRONTIER_MODELS.forEach(function(mid) {
            var cnt = 0;
            benchIds.forEach(function(bid) { if (scoreMap[mid + '|' + bid] !== undefined) cnt++; });
            coverage[mid] = cnt;
        });

        var topModels = this.FRONTIER_MODELS.slice().sort(function(a, b) {
            return coverage[b] - coverage[a];
        }).filter(function(mid) { return coverage[mid] >= 3; }).slice(0, 6);

        // Filter benchIds to only those with % scores (exclude vending_bench, gdpval etc)
        var radarBench = benchIds.filter(function(bid) {
            return bid !== 'vending_bench_2' && bid !== 'gdpval_aa' && bid !== 'metr_time_horizons' && bid !== 'livecodebench';
        });

        // Calculate per-axis max dynamically
        var indicators = radarBench.map(function(bid) {
            var name = self._getBenchName(bid);
            name = name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ').replace("Humanity's Last Exam", 'HLE');
            var axisMax = 0;
            topModels.forEach(function(mid) {
                var v = (scoreMap[mid + '|' + bid]) || 0;
                if (v > axisMax) axisMax = v;
            });
            if (axisMax <= 100) axisMax = 100;
            else axisMax = Math.ceil(axisMax / 100) * 100;
            return { name: name, max: axisMax };
        });

        var colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        var series = [{
            type: 'radar',
            data: topModels.map(function(mid, i) {
                return {
                    name: self._getModelName(mid),
                    value: radarBench.map(function(bid) {
                        return scoreMap[mid + '|' + bid] || 0;
                    }),
                    lineStyle: { color: colors[i], width: 2 },
                    itemStyle: { color: colors[i] },
                    areaStyle: { color: colors[i], opacity: 0.06 }
                };
            })
        }];

        chart.setOption({
            backgroundColor: 'transparent',
            title: { text: 'Radar — ' + (category === 'all' ? 'Core' : category.charAt(0).toUpperCase() + category.slice(1)), left: 'center', textStyle: { color: '#e5e7eb', fontSize: 13 } },
            tooltip: {},
            legend: {
                data: topModels.map(function(mid) { return self._getModelName(mid); }),
                textStyle: { color: '#9ca3af', fontSize: 10 }, bottom: 0
            },
            radar: {
                indicator: indicators, shape: 'polygon', splitNumber: 5,
                axisName: { color: '#9ca3af', fontSize: 9 },
                splitLine: { lineStyle: { color: '#1f2937' } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            series: series
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderBar: function(benchIds, category, selectedBenchId) {
        var el = document.getElementById('fc-bar');
        if (!el) return;
        var chart = echarts.init(el);
        var self = this;
        var scoreMap = this._getScoreMap();

        // Use selected benchmark, or default per category
        var primaryBench = selectedBenchId || benchIds[0];
        if (!selectedBenchId) {
            var defaults = { all: 'swe_bench_verified', coding: 'swe_bench_verified', cybersecurity: 'cybench', agent: 'browsecomp', math: 'aime_2025', multimodal: 'mmmu_pro', reasoning: 'gpqa_diamond' };
            primaryBench = defaults[category] || benchIds[0];
        }

        // Get all models with this benchmark score, sorted desc
        var entries = [];
        this.FRONTIER_MODELS.forEach(function(mid) {
            var v = scoreMap[mid + '|' + primaryBench];
            if (v !== undefined) entries.push({ mid: mid, val: v });
        });
        entries.sort(function(a, b) { return b.val - a.val; });

        var colors = entries.map(function(e, i) {
            if (i === 0) return '#10b981';
            if (i === 1) return '#3b82f6';
            if (i === 2) return '#f59e0b';
            return '#6b7280';
        });

        chart.setOption({
            backgroundColor: 'transparent',
            title: { text: self._getBenchName(primaryBench) + ' — Ranking', left: 'center', textStyle: { color: '#e5e7eb', fontSize: 13 } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 8, right: 16, bottom: 40, top: 40, containLabel: true },
            xAxis: {
                type: 'category',
                data: entries.map(function(e) { return self._getModelName(e.mid); }),
                axisLabel: { color: '#9ca3af', fontSize: 9, rotate: 35 },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: '#1f2937' } }
            },
            series: [{
                type: 'bar',
                data: entries.map(function(e, i) {
                    return { value: e.val, itemStyle: { color: colors[i] } };
                }),
                label: { show: true, position: 'top', color: '#d1d5db', fontSize: 10, formatter: function(p) { return p.value.toFixed(1); } }
            }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
