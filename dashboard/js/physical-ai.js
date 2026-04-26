/**
 * Physical AI tab: cross-comparison of World Foundation Models, VLA policies,
 * Industrial Robotics, and Manufacturing FMs. Pulls from the same model/score
 * registry as Sovereign AI but groups by embodied-intelligence category
 * instead of country.
 */
var PhysicalAI = {
    CATEGORIES: [
        {
            code: 'world-models',
            label: 'World Foundation Models',
            icon: '🌐',
            note: '시뮬레이션·예측·환경 생성 — NVIDIA Cosmos · DeepMind Genie · Tencent HY-World · AgiBot · Omniverse Mega',
            models: [
                'nvidia/cosmos-predict-2.5', 'nvidia/cosmos-reason-2', 'nvidia/cosmos-policy-robocasa',
                'nvidia/cosmos-reason-1',
                'google-deepmind/genie-3', 'google-deepmind/genie-2',
                'tencent/hy-world-2.0',
                'agibot/genie-envisioner',
                'nvidia/omniverse-mega'
            ]
        },
        {
            code: 'vla-policies',
            label: 'VLA Policies (generalist robots)',
            icon: '🦾',
            note: 'Vision-Language-Action 일반 로봇 정책 — GR00T · Pi-Zero · OpenVLA · Gemini Robotics-ER',
            models: [
                'nvidia/gr00t-n1.7', 'nvidia/gr00t-n1.6', 'nvidia/gr00t-n1.5', 'nvidia/gr00t-n1',
                'physical-intelligence/pi-zero', 'physical-intelligence/pi-zero-fast',
                'openvla/openvla-7b',
                'google-deepmind/gemini-robotics-er-1.6', 'google-deepmind/gemini-robotics-er-1.5'
            ]
        },
        {
            code: 'industrial-robots',
            label: 'Industrial Robotics',
            icon: '🤖',
            note: '휴머노이드·산업 통합 brain — Skild · Covariant · Figure · 1X · Apptronik · Agility · Sanctuary · Tesla',
            models: [
                'skild/skild-brain',
                'covariant/rfm-1',
                'figure-ai/helix',
                '1x/world-model',
                'apptronik/apollo-gemini',
                'agility/digit-arc',
                'sanctuary/carbon',
                'tesla/optimus-vlm'
            ]
        },
        {
            code: 'manufacturing-fm',
            label: 'Manufacturing & Industrial AI',
            icon: '🏭',
            note: '산업·공정·CAD·digital twin — Foxconn · Siemens · Hitachi · GE Vernova · Bosch · AVEVA · Autodesk · Landing AI · PTC · Dassault',
            models: [
                'foxconn/foxbrain-70b',
                'siemens/sifm',
                'hitachi/hal',
                'ge-vernova/predix-ai',
                'bosch/industrial-genai',
                'aveva/industrial-ai-assistant',
                'autodesk/bernini',
                'landing-ai/visionagent',
                'ptc/creo-copilot',
                'dassault/3dx-aura'
            ]
        }
    ],

    // Vendor cluster colors so timeline is readable across categories.
    VENDOR_GROUPS: {
        'NVIDIA':                          '#76b900',
        'Google DeepMind':                 '#4285f4',
        'Physical Intelligence':           '#ec4899',
        'OpenVLA Consortium':              '#a855f7',
        'AgiBot':                          '#0ea5e9',
        'Skild AI':                        '#f97316',
        'Covariant':                       '#14b8a6',
        'Figure AI':                       '#ef4444',
        '1X Technologies':                 '#22d3ee',
        'Apptronik + DeepMind':            '#3b82f6',
        'Agility Robotics':                '#fbbf24',
        'Sanctuary AI':                    '#a78bfa',
        'Tesla':                           '#dc2626',
        'Foxconn (Hon Hai Research)':      '#f59e0b',
        'Siemens':                         '#10b981',
        'Hitachi':                         '#06b6d4',
        'GE Vernova':                      '#84cc16',
        'Bosch':                           '#f43f5e',
        'AVEVA (Schneider Electric)':      '#22c55e',
        'Autodesk':                        '#0284c7',
        'Landing AI':                      '#facc15',
        'PTC':                             '#16a34a',
        'Dassault Systèmes':               '#9333ea'
    },

    // Benchmarks to surface in the cross-category leaderboard. Mix of robot
    // policy benches, world-model metrics, embodied reasoning, and industrial.
    BENCHMARKS: [
        'libero', 'robocasa', 'robotwin2', 'vlabench', 'open_x_embodiment',
        'world_model_consistency', 'world_model_fps',
        'gemini_instrument_reading', 'skild_failure_recovery',
        'mfg_news_rewrite', 'tmmlu_plus'
    ],

    // Model release dates (month precision). Re-uses Sovereign's RELEASE_DATES
    // map at runtime when available, with locally-required entries as fallback.
    _localReleaseDates: {
        'nvidia/cosmos-predict-2.5': '2025-09', 'nvidia/cosmos-reason-2': '2025-09', 'nvidia/cosmos-policy-robocasa': '2025-10',
        'nvidia/cosmos-reason-1': '2025-03',
        'nvidia/gr00t-n1.7': '2025-11', 'nvidia/gr00t-n1.6': '2025-08',
        'nvidia/gr00t-n1.5': '2025-06', 'nvidia/gr00t-n1': '2025-03',
        'google-deepmind/genie-3': '2025-08', 'google-deepmind/genie-2': '2024-12',
        'physical-intelligence/pi-zero': '2024-11', 'physical-intelligence/pi-zero-fast': '2025-04',
        'openvla/openvla-7b': '2024-06',
        'agibot/genie-envisioner': '2025-06',
        'tencent/hy-world-2.0': '2026-04'
    },

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

        this._renderCategoryMap();
        this._renderBenchmarkTable();
        this._renderTimeline();
        this._renderRadar();
        this._initialized = true;
    },

    // ─────────────── Helpers (mirror Sovereign's where useful) ───────────────
    _getModel: function(mid) {
        return this._models.find(function(m) { return m.id === mid; });
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
    _getReleaseDate: function(mid) {
        if (typeof Sovereign !== 'undefined' && Sovereign.RELEASE_DATES && Sovereign.RELEASE_DATES[mid]) {
            return Sovereign.RELEASE_DATES[mid];
        }
        return this._localReleaseDates[mid] || null;
    },
    _extractParamsB: function(modelName) {
        if (!modelName) return null;
        var matches = modelName.match(/(\d+(?:\.\d+)?)\s*B\b/gi);
        if (!matches || matches.length === 0) return null;
        var nums = matches.map(function(s) {
            var n = parseFloat(s.replace(/[Bb]/, '').trim());
            return isNaN(n) ? null : n;
        }).filter(function(n) { return n != null; });
        return nums.length === 0 ? null : Math.max.apply(null, nums);
    },
    _dateToTs: function(yyyyMm) {
        var parts = yyyyMm.split('-');
        var y = parseInt(parts[0], 10);
        var m = parts.length > 1 ? parseInt(parts[1], 10) : 6;
        return new Date(Date.UTC(y, m - 1, 15)).getTime();
    },
    _categoryOf: function(modelId) {
        for (var i = 0; i < this.CATEGORIES.length; i++) {
            if (this.CATEGORIES[i].models.indexOf(modelId) !== -1) return this.CATEGORIES[i];
        }
        return null;
    },

    // ─────────────── Category map cards ───────────────
    _renderCategoryMap: function() {
        var container = document.getElementById('phys-category-map');
        if (!container) return;
        container.textContent = '';
        var self = this;

        this.CATEGORIES.forEach(function(cat) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col';

            var head = document.createElement('div');
            head.className = 'flex items-center gap-2 mb-2';
            var icon = document.createElement('span');
            icon.style.fontSize = '20px';
            icon.textContent = cat.icon;
            head.appendChild(icon);
            var label = document.createElement('span');
            label.className = 'text-widget text-gray-200 font-semibold';
            label.textContent = cat.label;
            head.appendChild(label);
            var presentCnt = cat.models.filter(function(mid) { return self._getModel(mid); }).length;
            var count = document.createElement('span');
            count.className = 'ml-auto text-xs text-gray-500';
            count.textContent = presentCnt + ' models';
            head.appendChild(count);
            card.appendChild(head);

            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500 mb-3';
            note.textContent = cat.note;
            card.appendChild(note);

            var list = document.createElement('div');
            list.className = 'flex flex-col gap-1';

            // Sort by release date desc
            var sorted = cat.models.slice().sort(function(a, b) {
                var da = self._getReleaseDate(a) || '';
                var db = self._getReleaseDate(b) || '';
                if (!da && !db) return 0;
                if (!da) return 1;
                if (!db) return -1;
                return db.localeCompare(da);
            });

            sorted.forEach(function(mid) {
                var m = self._getModel(mid);
                if (!m) return;
                var releaseDate = self._getReleaseDate(mid);
                var row = document.createElement('div');
                row.className = 'flex items-center justify-between gap-2 text-xs';
                var name = document.createElement('span');
                name.className = 'text-gray-300 truncate cursor-pointer';
                name.textContent = m.name + (releaseDate ? '  (' + releaseDate + ')' : '');
                name.title = mid + ' — 클릭하면 모델 상세';
                name.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                row.appendChild(name);
                var meta = document.createElement('span');
                meta.className = 'text-xs text-gray-500';
                meta.textContent = m.vendor || '';
                meta.style.maxWidth = '40%';
                meta.style.textAlign = 'right';
                meta.style.whiteSpace = 'nowrap';
                meta.style.overflow = 'hidden';
                meta.style.textOverflow = 'ellipsis';
                row.appendChild(meta);
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

    // ─────────────── Benchmark leaderboard ───────────────
    _renderBenchmarkTable: function() {
        var el = document.getElementById('phys-benchmark-table');
        if (!el) return;
        el.textContent = '';
        var self = this;

        // Build rows: every model that has at least one Physical AI benchmark score.
        var allModelIds = [];
        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) {
                if (allModelIds.indexOf(mid) === -1 && self._getModel(mid)) allModelIds.push(mid);
            });
        });

        // Filter to active benchmarks (has ≥1 score among our model set)
        var activeBids = this.BENCHMARKS.filter(function(bid) {
            return allModelIds.some(function(mid) { return self._getScore(mid, bid) != null; });
        });

        // Filter rows to models with ≥1 score on active benches
        var rowIds = allModelIds.filter(function(mid) {
            return activeBids.some(function(bid) { return self._getScore(mid, bid) != null; });
        });

        // Sort rows by category (preserves CATEGORIES order), then by best avg
        rowIds.sort(function(a, b) {
            var ca = self._categoryOf(a), cb = self._categoryOf(b);
            var ia = self.CATEGORIES.indexOf(ca), ib = self.CATEGORIES.indexOf(cb);
            if (ia !== ib) return ia - ib;
            // within category: by sum of scores desc (richer models first)
            var sa = activeBids.reduce(function(s, bid) { var v = self._getScore(a, bid); return s + (v != null ? v : 0); }, 0);
            var sb = activeBids.reduce(function(s, bid) { var v = self._getScore(b, bid); return s + (v != null ? v : 0); }, 0);
            return sb - sa;
        });

        if (rowIds.length === 0 || activeBids.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— Physical AI 벤치마크 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        // Per-benchmark max for color coding
        var maxes = {};
        activeBids.forEach(function(bid) {
            var max = 0;
            rowIds.forEach(function(mid) {
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
        var thC = document.createElement('th'); thC.textContent = 'Category'; thC.style.fontSize = '11px'; hr.appendChild(thC);
        var thV = document.createElement('th'); thV.textContent = 'Vendor'; thV.style.fontSize = '11px'; hr.appendChild(thV);
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
        rowIds.forEach(function(mid) {
            var m = self._getModel(mid);
            var cat = self._categoryOf(mid);
            var tr = document.createElement('tr');

            var tdName = document.createElement('td');
            tdName.textContent = m ? m.name : mid;
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.cursor = 'pointer';
            tdName.title = mid;
            tdName.addEventListener('click', (function(modelId) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                };
            })(mid));
            tr.appendChild(tdName);

            var tdCat = document.createElement('td');
            tdCat.textContent = cat ? (cat.icon + ' ' + cat.label.split(' ')[0]) : '—';
            tdCat.style.fontSize = '11px';
            tdCat.style.color = Theme.textMuted;
            tr.appendChild(tdCat);

            var tdV = document.createElement('td');
            tdV.textContent = m ? (m.vendor || '—') : '—';
            tdV.style.fontSize = '11px';
            tdV.style.color = Theme.textMuted;
            tr.appendChild(tdV);

            activeBids.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var v = self._getScore(mid, bid);
                if (v != null) {
                    // Some benchmarks have non-percent units (fps, seconds, score). Render numerically.
                    var bench = self._getBenchmark(bid);
                    var unit = bench && bench.metric ? bench.metric : '';
                    td.textContent = v.toFixed(unit === 'fps' || unit === 'seconds' ? 0 : 1);
                    var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                    if (ratio >= 0.99) { td.style.color = Theme.series[0]; td.style.fontWeight = 'bold'; }
                    else if (ratio >= 0.85) td.style.color = Theme.series[1];
                    else if (ratio >= 0.7) td.style.color = Theme.series[2];
                    else td.style.color = Theme.series[3];
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.title = '클릭하면 검증 소스';
                    td.addEventListener('click', (function(m, b) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) Modal.showScoreSource(m, b);
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

    // ─────────────── Timeline scatter (x = date, y = category) ───────────────
    _renderTimeline: function() {
        var el = document.getElementById('phys-timeline');
        if (!el) return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        var pointsByVendor = {};
        var categoryLabels = this.CATEGORIES.map(function(c) { return c.icon + ' ' + c.label; });

        this.CATEGORIES.forEach(function(cat) {
            cat.models.forEach(function(mid) {
                var m = self._getModel(mid);
                var date = self._getReleaseDate(mid);
                if (!m || !date) return;
                var ts = self._dateToTs(date);
                var paramsB = self._extractParamsB(m.name);
                var symbolSize = paramsB ? Math.max(10, Math.min(38, Math.sqrt(paramsB) * 3)) : 14;
                var vendor = m.vendor || 'Other';
                if (!pointsByVendor[vendor]) pointsByVendor[vendor] = [];
                pointsByVendor[vendor].push({
                    value: [ts, cat.icon + ' ' + cat.label, mid, m.name, date, paramsB, vendor, cat.label],
                    symbolSize: symbolSize
                });
            });
        });

        var seriesData = Object.keys(pointsByVendor).map(function(vendor) {
            var color = self.VENDOR_GROUPS[vendor] || '#94a3b8';
            return {
                name: vendor,
                type: 'scatter',
                data: pointsByVendor[vendor],
                itemStyle: { color: color, opacity: 0.85, borderColor: '#0b0f17', borderWidth: 1 },
                emphasis: { focus: 'series', itemStyle: { borderColor: '#fff', borderWidth: 2, opacity: 1 } }
            };
        });

        if (seriesData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— 표시할 모델이 없습니다';
            el.appendChild(empty);
            return;
        }

        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var v = p.value;
                    var lines = [
                        '<strong>' + v[3] + '</strong>',
                        'Category: ' + v[7],
                        'Vendor: ' + v[6],
                        '출시: ' + v[4]
                    ];
                    if (v[5] != null) lines.push('파라미터: ~' + v[5] + 'B');
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: seriesData.map(function(s) { return s.name; }),
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0, type: 'scroll'
            },
            grid: { left: 8, right: 32, bottom: 50, top: 60, containLabel: true },
            xAxis: {
                type: 'time',
                axisLabel: { color: Theme.textMuted, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border, opacity: 0.3 } }
            },
            yAxis: {
                type: 'category', data: categoryLabels,
                axisLabel: { color: Theme.textMuted, fontSize: 11 },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { show: true, lineStyle: { color: Theme.border, opacity: 0.2 } }
            },
            dataZoom: [
                { type: 'inside', xAxisIndex: 0 },
                { type: 'slider', xAxisIndex: 0, height: 14, bottom: 8, textStyle: { color: Theme.textMuted, fontSize: 9 } }
            ],
            series: seriesData
        });
        chart.on('click', function(p) {
            if (p && p.value && p.value[2]) {
                if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(p.value[2]);
            }
        });
        window.addEventListener('resize', function() { chart.resize(); });
    },

    // ─────────────── Capability radar (4-axis) ───────────────
    _renderRadar: function() {
        var el = document.getElementById('phys-radar');
        if (!el) return;
        var prev = echarts.getInstanceByDom(el);
        if (prev) prev.dispose();
        el.textContent = '';
        var self = this;

        // 4-axis definition. Each axis aggregates a benchmark group.
        var AXES = [
            { name: 'VLA Policy',           benches: ['libero', 'robocasa', 'robotwin2', 'vlabench'] },
            { name: 'World Model Coherence',benches: ['world_model_consistency', 'world_model_fps'] },
            { name: 'Embodied Reasoning',   benches: ['gemini_instrument_reading', 'skild_failure_recovery'] },
            { name: 'Industrial Integration',benches: ['mfg_news_rewrite', 'tmmlu_plus'] }
        ];

        // For each category, compute axis score = mean of best-of-fleet across the axis benches.
        var radarData = [];
        this.CATEGORIES.forEach(function(cat, idx) {
            var values = AXES.map(function(axis) {
                var benchBests = axis.benches.map(function(bid) {
                    var best = null;
                    cat.models.forEach(function(mid) {
                        var v = self._getScore(mid, bid);
                        if (v != null && (best == null || v > best)) best = v;
                    });
                    return best;
                }).filter(function(v) { return v != null; });
                if (benchBests.length === 0) return 0;
                return benchBests.reduce(function(a, b) { return a + b; }, 0) / benchBests.length;
            });
            // Skip categories with all-zero values
            if (values.every(function(v) { return v === 0; })) return;
            radarData.push({
                value: values,
                name: cat.icon + ' ' + cat.label,
                idx: idx
            });
        });

        if (radarData.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-sm text-gray-500 italic';
            empty.textContent = '— Capability radar에 표시할 데이터가 부족합니다';
            el.appendChild(empty);
            return;
        }

        // Per-axis max for normalization (don't squash high-variance axes)
        var axisMax = AXES.map(function(_, ai) {
            return Math.max(100, Math.max.apply(null, radarData.map(function(d) { return d.value[ai]; })));
        });
        var indicators = AXES.map(function(axis, ai) {
            return { name: axis.name, max: axisMax[ai] };
        });

        var palette = [Theme.series[0], Theme.series[1], Theme.series[4], Theme.series[5]];
        var chart = echarts.init(el);
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var lines = [p.name];
                    p.value.forEach(function(v, i) {
                        lines.push(indicators[i].name + ': ' + (typeof v === 'number' ? v.toFixed(1) : v));
                    });
                    return lines.join('<br/>');
                }
            },
            legend: {
                data: radarData.map(function(d) { return d.name; }),
                textStyle: { color: Theme.textMuted, fontSize: 10 }, top: 0, type: 'scroll'
            },
            radar: {
                indicator: indicators, shape: 'polygon',
                axisName: { color: Theme.textMuted, fontSize: 11 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.border } }
            },
            series: [{
                type: 'radar',
                data: radarData.map(function(d) {
                    return {
                        value: d.value, name: d.name,
                        itemStyle: { color: palette[d.idx % palette.length] },
                        lineStyle: { color: palette[d.idx % palette.length], width: 2 },
                        areaStyle: { opacity: 0.1 }
                    };
                })
            }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
