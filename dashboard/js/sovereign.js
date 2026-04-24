/**
 * Sovereign AI tab: compares regional/sovereign LLMs against frontier baselines
 * across three axes that frontier-only metrics don't capture:
 *   1. Language Adaptation       — regional language / cultural reasoning
 *   2. Medical System Integration — regional medical licensing / clinical
 *   3. Government / Regulated Domain — legal, finance, sovereign cyber
 *
 * Sovereign AI is the new axis of frontier competition in 2026: language
 * adaptation, healthcare-system fit, and government-policy alignment. This
 * tab makes those values legible alongside the global frontier leaderboard.
 */
var Sovereign = {
    REGIONS: [
        {
            code: 'kr', label: 'Korea', flag: '🇰🇷',
            note: '한국어 의료 시스템 / 정부·대기업 sovereign LLM',
            models: [
                'lg/exaone-4.5-33b', 'lg/exaone-4.5',
                'upstage/solar-pro-2', 'upstage/solar-pro-2-think',
                'skt/ax-k1',
                'kt/midm-k',
                'snuh-naver/kmed-ai'
            ]
        },
        {
            code: 'cn', label: 'China', flag: '🇨🇳',
            note: '중국 frontier — DeepSeek·Qwen·Kimi·GLM·ERNIE·Hunyuan·Doubao Seed',
            models: [
                'alibaba/qwen3.6-plus', 'alibaba/qwen3.6-27b', 'alibaba/qwen3.6-35b-a3b',
                'deepseek/deepseek-v4-pro-max', 'deepseek/deepseek-v4-pro', 'deepseek/deepseek-v4-flash', 'deepseek/deepseek-v3.2',
                'zhipu/glm-5', 'zhipu/glm-5.1',
                'moonshot/kimi-k2.6', 'moonshot/kimi-k2.5', 'moonshot/kimi-k2-thinking',
                'minimax/m2.7', 'minimax/m2',
                'mimo/mimo-pro',
                'baidu/ernie-5.0',
                'tencent/hunyuan-t1',
                'bytedance/seed-2.0-pro',
                'stepfun/step-r1',
                'freedomintelligence/huatuogpt-ii'
            ]
        },
        {
            code: 'jp', label: 'Japan', flag: '🇯🇵',
            note: 'Sakana AI evolutionary models',
            models: ['sakana/japanese-evo-llm']
        },
        {
            code: 'in', label: 'India', flag: '🇮🇳',
            note: 'Sarvam · BharatGen · Krutrim · BharatGPT (정부 AI Mission)',
            models: [
                'sarvam/sarvam-1', 'sarvam/sarvam-m',
                'bharatgen/param2-17b',
                'ola/krutrim',
                'corover/bharatgpt'
            ]
        },
        {
            code: 'il', label: 'Israel', flag: '🇮🇱',
            note: 'AI21 Jamba SSM-Transformer hybrid',
            models: ['ai21/jamba-large-1.5', 'ai21/jamba-large-1.7']
        },
        {
            code: 'ae', label: 'UAE', flag: '🇦🇪',
            note: 'TII Falcon-H1 · MBZUAI BiMediX (Arabic)',
            models: ['tii/falcon-h1-34b', 'tii/falcon-h1-7b', 'mbzuai/bimedix']
        },
        {
            code: 'sg', label: 'Singapore', flag: '🇸🇬',
            note: 'AI Singapore SEA-LION (동남아 언어)',
            models: ['aisingapore/sea-lion-v3-70b', 'aisingapore/sea-lion-v3-8b']
        },
        {
            code: 'ch', label: 'Switzerland', flag: '🇨🇭',
            note: 'EPFL Meditron / Apertus (의료·인도주의)',
            models: ['epfl/meditron-70b', 'epfl/meditron-7b', 'epfl/llama-3-meditron-70b']
        },
        {
            code: 'us-legal', label: 'US (Legal AI)', flag: '⚖️',
            note: 'Vertical legal AI (Harvey · CoCounsel · Vincent · Oliver)',
            models: [
                'harvey/harvey-assistant',
                'thomson-reuters/cocounsel-2',
                'vlex/vincent-ai',
                'vecflow/oliver'
            ]
        },
        {
            code: 'us-fin', label: 'US (Finance)', flag: '💰',
            note: 'Bloomberg sovereign-data finance LLM',
            models: ['bloomberg/bloomberg-gpt']
        },
        {
            code: 'darpa', label: 'DARPA AIxCC', flag: '🛡️',
            note: 'DARPA 국방·도메인 Cyber Reasoning System',
            models: ['darpa/aixcc-team-atlanta']
        }
    ],

    FRONTIER_REFERENCE: [
        'anthropic/claude-opus-4.7',
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
        'google/gemini-3.1-pro',
        'meta/muse-spark'
    ],

    DIMENSIONS: [
        {
            id: 'language',
            label: '🌐 Language Adaptation',
            desc: '지역 언어·문화 적응 능력 — frontier MMLU로는 드러나지 않는 다국어 적용 수준을 측정.',
            benchmarks: ['mmmlu', 'c_eval', 'cmmlu', 'chinese_simpleqa', 'global_piqa', 'swe_bench_multilingual']
        },
        {
            id: 'medical',
            label: '🏥 Medical System Integration',
            desc: '지역 의료 시스템·면허 정합성 — KMLE · USMLE · Arabic medical · AfriMed-QA 등 의료 시스템별 평가.',
            benchmarks: ['kmle', 'medqa', 'medqa_5op', 'pubmedqa', 'mmlu_med', 'medxpertqa', 'medmcqa', 'med_avg', 'healthbench', 'healthbench_professional', 'afrimed_qa', 'ehrqa']
        },
        {
            id: 'domain',
            label: '🏛️ Government / Regulated Domain',
            desc: '법률·금융·사이버 방어 등 sovereign 도메인 — VLAIR 변호사 평가 · DARPA AIxCC · Bloomberg finance.',
            benchmarks: ['vlair_doc_qa', 'vlair_summarization', 'vlair_chronology', 'vlair_redlining', 'vlair_data_extract', 'vlair_transcript', 'aixcc_synth_vuln', 'fpb', 'convfinqa', 'finqa']
        }
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],
    _initialized: false,

    init: function(models, benchmarks, scores) {
        this._models = models || [];
        this._benchmarks = benchmarks || [];
        this._scores = scores || [];
    },

    render: function() {
        this._models = App.data.models;
        this._benchmarks = App.data.benchmarks;
        this._scores = App.data.scores;

        this._renderRegionMap();
        var self = this;
        this.DIMENSIONS.forEach(function(dim) {
            self._renderDimension(dim);
        });
        this._renderHeatmap();
        this._initialized = true;
    },

    _getModelName: function(mid) {
        var m = this._models.find(function(m) { return m.id === mid; });
        return m ? m.name : mid.split('/').pop();
    },

    _getBenchmark: function(bid) {
        return this._benchmarks.find(function(b) { return b.id === bid; });
    },

    _getScore: function(modelId, benchId) {
        var s = this._scores.find(function(s) {
            return s.model_id === modelId && s.benchmark_id === benchId;
        });
        return s ? s.value : null;
    },

    _allSovereignIds: function() {
        var present = {};
        this._models.forEach(function(m) { present[m.id] = true; });
        var ids = [];
        this.REGIONS.forEach(function(r) {
            r.models.forEach(function(mid) {
                if (present[mid]) ids.push(mid);
            });
        });
        return ids;
    },

    _regionFor: function(modelId) {
        for (var i = 0; i < this.REGIONS.length; i++) {
            if (this.REGIONS[i].models.indexOf(modelId) !== -1) return this.REGIONS[i];
        }
        return null;
    },

    _renderRegionMap: function() {
        var container = document.getElementById('sov-region-map');
        if (!container) return;
        container.textContent = '';
        var self = this;

        this.REGIONS.forEach(function(region) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col';

            var head = document.createElement('div');
            head.className = 'flex items-center gap-2 mb-2';
            var flag = document.createElement('span');
            flag.style.fontSize = '20px';
            flag.textContent = region.flag;
            head.appendChild(flag);
            var label = document.createElement('span');
            label.className = 'text-widget text-gray-200 font-semibold';
            label.textContent = region.label;
            head.appendChild(label);
            var presentCnt = region.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            }).length;
            var count = document.createElement('span');
            count.className = 'ml-auto text-xs text-gray-500';
            count.textContent = presentCnt + ' models';
            head.appendChild(count);
            card.appendChild(head);

            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500 mb-3';
            note.textContent = region.note;
            card.appendChild(note);

            var list = document.createElement('div');
            list.className = 'flex flex-col gap-1';
            region.models.forEach(function(mid) {
                var m = self._models.find(function(x) { return x.id === mid; });
                if (!m) return;
                var row = document.createElement('div');
                row.className = 'flex items-center justify-between gap-2 text-xs';
                var name = document.createElement('span');
                name.className = 'text-gray-300 truncate cursor-pointer';
                name.textContent = m.name;
                name.title = mid + ' — 클릭하면 모델 상세';
                name.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                row.appendChild(name);
                var badge = document.createElement('span');
                badge.className = 'badge badge-' + (m.type || 'open-weight');
                badge.textContent = (m.type || 'open-weight').replace('-', ' ');
                row.appendChild(badge);
                list.appendChild(row);
            });
            if (presentCnt === 0) {
                var empty = document.createElement('div');
                empty.className = 'text-xs text-gray-600 italic';
                empty.textContent = '— no models tracked yet';
                list.appendChild(empty);
            }
            card.appendChild(list);
            container.appendChild(card);
        });
    },

    _renderDimension: function(dim) {
        var self = this;
        var sovIds = this._allSovereignIds();
        var sovScored = sovIds.map(function(mid) {
            var sum = 0, cnt = 0;
            dim.benchmarks.forEach(function(bid) {
                var v = self._getScore(mid, bid);
                if (v != null) { sum += v; cnt++; }
            });
            return { mid: mid, avg: cnt ? sum / cnt : null, cnt: cnt };
        }).filter(function(x) { return x.cnt > 0; });
        sovScored.sort(function(a, b) {
            if (b.cnt !== a.cnt) return b.cnt - a.cnt;
            return (b.avg || 0) - (a.avg || 0);
        });

        var frScored = this.FRONTIER_REFERENCE.filter(function(mid) {
            return dim.benchmarks.some(function(bid) {
                return self._getScore(mid, bid) != null;
            });
        });

        var topSov = sovScored.slice(0, 6).map(function(x) { return x.mid; });
        var topFrontier = frScored.slice(0, 3);

        var combined = topSov.concat(topFrontier);
        var activeBids = dim.benchmarks.filter(function(bid) {
            return combined.some(function(mid) { return self._getScore(mid, bid) != null; });
        });

        var chartEl = document.getElementById('sov-' + dim.id + '-chart');
        var tableEl = document.getElementById('sov-' + dim.id + '-table');
        if (!chartEl || !tableEl) return;
        chartEl.textContent = '';
        tableEl.textContent = '';

        if (activeBids.length === 0 || combined.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 이 차원에 해당하는 데이터가 아직 없습니다';
            chartEl.appendChild(empty);
            return;
        }

        this._renderDimChart(chartEl, dim, activeBids, topSov, topFrontier);
        this._renderDimTable(tableEl, dim, activeBids, topSov, topFrontier);
    },

    _renderDimChart: function(el, dim, activeBids, sovIds, frIds) {
        var chart = echarts.init(el);
        var self = this;
        var benchNames = activeBids.map(function(bid) {
            var b = self._getBenchmark(bid);
            return b ? b.name : bid;
        });

        function buildSeries(modelIds, isFrontier) {
            return modelIds.map(function(mid, i) {
                var color = isFrontier ? Theme.textMuted : Theme.series[i % Theme.series.length];
                return {
                    name: self._getModelName(mid) + (isFrontier ? '  · frontier' : ''),
                    type: 'bar',
                    data: activeBids.map(function(bid) {
                        var v = self._getScore(mid, bid);
                        return v != null ? v : null;
                    }),
                    itemStyle: {
                        color: color,
                        opacity: isFrontier ? 0.55 : 1.0,
                        borderColor: isFrontier ? Theme.borderStrong : 'transparent',
                        borderWidth: isFrontier ? 1 : 0
                    }
                };
            });
        }

        var series = buildSeries(sovIds, false).concat(buildSeries(frIds, true));
        var legend = sovIds.map(function(mid) { return self._getModelName(mid); })
            .concat(frIds.map(function(mid) { return self._getModelName(mid) + '  · frontier'; }));

        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: legend, textStyle: { color: Theme.textMuted, fontSize: 10 }, top: 0, type: 'scroll' },
            grid: { left: 8, right: 16, bottom: 70, top: 40, containLabel: true },
            xAxis: {
                type: 'category', data: benchNames,
                axisLabel: {
                    color: Theme.textMuted, fontSize: 9, rotate: 30, interval: 0,
                    formatter: function(v) { return v.length > 22 ? v.slice(0, 20) + '…' : v; }
                },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value', axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: series
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderDimTable: function(el, dim, activeBids, sovIds, frIds) {
        var self = this;
        var rows = sovIds.concat(frIds);
        var rowKind = {};
        sovIds.forEach(function(m) { rowKind[m] = 'sovereign'; });
        frIds.forEach(function(m) { rowKind[m] = 'frontier'; });

        var maxes = {};
        activeBids.forEach(function(bid) {
            var max = 0;
            rows.forEach(function(mid) {
                var v = self._getScore(mid, bid);
                if (v != null && v > max) max = v;
            });
            maxes[bid] = max;
        });

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        var thM = document.createElement('th'); thM.textContent = 'Model'; hr.appendChild(thM);
        var thR = document.createElement('th'); thR.textContent = 'Region'; hr.appendChild(thR);
        activeBids.forEach(function(bid) {
            var th = document.createElement('th');
            var b = self._getBenchmark(bid);
            th.textContent = b ? b.name : bid;
            th.style.fontSize = '11px';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        rows.forEach(function(mid) {
            var tr = document.createElement('tr');
            if (rowKind[mid] === 'frontier') tr.style.opacity = '0.7';

            var tdName = document.createElement('td');
            tdName.textContent = self._getModelName(mid);
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.cursor = 'pointer';
            tdName.title = mid + ' — 클릭하면 모델 상세';
            tdName.addEventListener('click', (function(m) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(m);
                };
            })(mid));
            tr.appendChild(tdName);

            var tdRegion = document.createElement('td');
            var region = self._regionFor(mid);
            tdRegion.textContent = region ? (region.flag + ' ' + region.label) : (rowKind[mid] === 'frontier' ? 'frontier' : '—');
            tdRegion.style.fontSize = '11px';
            tdRegion.style.color = rowKind[mid] === 'frontier' ? Theme.textMuted : Theme.textPrimary;
            tr.appendChild(tdRegion);

            activeBids.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var v = self._getScore(mid, bid);
                if (v != null) {
                    td.textContent = v.toFixed(1);
                    var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                    if (ratio >= 0.95) { td.style.color = Theme.series[0]; td.style.fontWeight = 'bold'; }
                    else if (ratio >= 0.85) td.style.color = Theme.series[1];
                    else if (ratio >= 0.7) td.style.color = Theme.series[2];
                    else td.style.color = Theme.series[3];
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.title = '클릭하면 검증 소스·수집일 이력';
                    td.addEventListener('click', (function(m, b) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(m, b);
                            }
                        };
                    })(mid, bid));
                } else {
                    td.textContent = '—';
                    td.style.color = Theme.textDisabled;
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        el.appendChild(table);
    },

    _renderHeatmap: function() {
        var el = document.getElementById('sov-heatmap');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var modelIds = [];
        this.REGIONS.forEach(function(r) {
            var present = r.models.filter(function(mid) {
                return self._models.some(function(m) { return m.id === mid; });
            });
            modelIds = modelIds.concat(present.slice(0, 2));
        });

        var unionBids = [];
        this.DIMENSIONS.forEach(function(d) { unionBids = unionBids.concat(d.benchmarks); });

        var activeBids = unionBids.filter(function(bid) {
            var cnt = 0;
            modelIds.forEach(function(mid) {
                if (self._getScore(mid, bid) != null) cnt++;
            });
            return cnt >= 2;
        });

        if (activeBids.length === 0 || modelIds.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 히트맵에 표시할 교차 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        var modelLabels = modelIds.map(function(mid) {
            var r = self._regionFor(mid);
            return self._getModelName(mid) + (r ? '  ' + r.flag : '');
        });
        var benchLabels = activeBids.map(function(bid) {
            var b = self._getBenchmark(bid);
            return b ? b.name : bid;
        });
        var data = [];
        modelIds.forEach(function(mid, mi) {
            activeBids.forEach(function(bid, bi) {
                var v = self._getScore(mid, bid);
                data.push([bi, mi, v != null ? v : '-']);
            });
        });

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                position: 'top',
                formatter: function(p) {
                    return benchLabels[p.data[0]] + ' → ' + modelLabels[p.data[1]] + '<br/>' +
                        (typeof p.data[2] === 'number' ? p.data[2].toFixed(1) : 'no data');
                }
            },
            grid: { left: 8, right: 16, bottom: 80, top: 30, containLabel: true },
            xAxis: {
                type: 'category', data: benchLabels,
                splitArea: { show: true },
                axisLabel: {
                    color: Theme.textMuted, rotate: 35, fontSize: 9, interval: 0,
                    formatter: function(v) { return v.length > 18 ? v.slice(0, 16) + '…' : v; }
                }
            },
            yAxis: {
                type: 'category', data: modelLabels,
                splitArea: { show: true },
                axisLabel: { color: Theme.textMuted, fontSize: 10 }
            },
            visualMap: {
                min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                inRange: { color: ['#1f2937', '#3b82f6', '#10b981', '#fbbf24'] }
            },
            series: [{
                name: 'score', type: 'heatmap',
                data: data.filter(function(d) { return typeof d[2] === 'number'; }),
                label: {
                    show: true, color: '#fff', fontSize: 9,
                    formatter: function(p) { return typeof p.data[2] === 'number' ? p.data[2].toFixed(0) : ''; }
                }
            }]
        });
        chart.on('click', function(p) {
            var mid = modelIds[p.data[1]];
            var bid = activeBids[p.data[0]];
            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                Modal.showScoreSource(mid, bid);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
