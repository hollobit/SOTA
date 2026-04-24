/**
 * Model Explorer: compare up to 4 models side-by-side with radar chart.
 * Uses safe DOM methods (createElement + textContent).
 */
var Explorer = {
    // Merge semantically identical benchmarks for display
    _MERGE_MAP: {
        'livecodebench_v6': 'livecodebench',
        'livecodebench_elo': null,  // exclude Elo (different unit)
        'tau_bench': 'tau2_bench',
        'arc_agi_1': 'arc_agi_2'
    },

    compare: function(modelIds, scores, benchmarks) {
        var mergeMap = this._MERGE_MAP;

        // Collect all benchmarks across selected models, merging similar ones
        var benchmarkSet = {};
        modelIds.forEach(function(mid) {
            scores.forEach(function(s) {
                if (s.model_id === mid) {
                    var bid = s.benchmark_id;
                    // Apply merge: skip excluded, redirect to canonical
                    if (mergeMap[bid] === null) return;
                    if (mergeMap[bid]) bid = mergeMap[bid];
                    benchmarkSet[bid] = true;
                }
            });
        });

        var scoreMap = {};
        scores.forEach(function(s) {
            var bid = s.benchmark_id;
            if (mergeMap[bid] === null) return;
            if (mergeMap[bid]) bid = mergeMap[bid];
            var key = s.model_id + '|' + bid;
            // Keep highest score if merged
            if (!scoreMap[key] || s.value > scoreMap[key].value) {
                scoreMap[key] = s;
            }
        });

        var rows = [];
        Object.keys(benchmarkSet).sort().forEach(function(bid) {
            var bench = benchmarks.find(function(b) { return b.id === bid; });
            var row = { benchmark: bid, benchName: bench ? bench.name : bid, category: bench ? bench.category : 'other', values: [] };
            var maxVal = -Infinity, maxIdx = -1;
            modelIds.forEach(function(mid, i) {
                var s = scoreMap[mid + '|' + bid];
                var val = s ? s.value : null;
                row.values.push(val);
                if (val !== null && val > maxVal) { maxVal = val; maxIdx = i; }
            });
            row.winner = maxIdx;
            rows.push(row);
        });

        // Sort by category then benchmark name
        var catOrder = ['reasoning', 'coding', 'math', 'cybersecurity', 'cyber_defense', 'agent', 'multimodal', 'multilingual', 'other'];
        rows.sort(function(a, b) {
            var ca = catOrder.indexOf(a.category), cb = catOrder.indexOf(b.category);
            if (ca === -1) ca = 99; if (cb === -1) cb = 99;
            if (ca !== cb) return ca - cb;
            return a.benchName.localeCompare(b.benchName);
        });

        return rows;
    },

    renderComparison: function(containerId, modelIds, models, rows) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.textContent = '';

        var modelNames = modelIds.map(function(mid) {
            var m = models.find(function(x) { return x.id === mid; });
            return m ? m.name : mid.split('/').pop();
        });

        // Summary: wins per model
        var wins = modelIds.map(function() { return 0; });
        rows.forEach(function(r) {
            if (r.winner >= 0 && r.values.filter(function(v) { return v !== null; }).length > 1) {
                wins[r.winner]++;
            }
        });

        // Count benchmark coverage stats
        var sharedCount = 0, totalCount = rows.length;
        rows.forEach(function(r) {
            var filled = r.values.filter(function(v) { return v !== null; }).length;
            if (filled >= 2) sharedCount++;
        });

        var summaryDiv = document.createElement('div');
        summaryDiv.className = 'flex gap-4 mb-4 flex-wrap';
        var colors = Theme.series.slice(0, 4);

        // Add coverage stats card
        var coverageCard = document.createElement('div');
        coverageCard.className = 'bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-center';
        var coverTitle = document.createElement('div');
        coverTitle.className = 'text-xs text-gray-500';
        coverTitle.textContent = 'Benchmarks';
        coverageCard.appendChild(coverTitle);
        var coverVal = document.createElement('div');
        coverVal.className = 'text-lg font-bold text-gray-300';
        coverVal.textContent = sharedCount + ' shared / ' + totalCount + ' total';
        coverageCard.appendChild(coverVal);
        summaryDiv.appendChild(coverageCard);

        modelIds.forEach(function(mid, i) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-center';
            card.style.borderLeftWidth = '3px';
            card.style.borderLeftColor = colors[i];

            var name = document.createElement('div');
            name.className = 'text-sm font-semibold text-gray-200';
            name.textContent = modelNames[i];
            card.appendChild(name);

            var winCount = document.createElement('div');
            winCount.className = 'text-2xl font-bold';
            winCount.style.color = colors[i];
            winCount.textContent = wins[i];
            card.appendChild(winCount);

            var label = document.createElement('div');
            label.className = 'text-xs text-gray-500';
            label.textContent = 'wins';
            card.appendChild(label);

            summaryDiv.appendChild(card);
        });
        container.appendChild(summaryDiv);

        // Table
        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        var thBench = document.createElement('th');
        thBench.textContent = 'Benchmark';
        headerRow.appendChild(thBench);
        var thCat = document.createElement('th');
        thCat.textContent = 'Category';
        thCat.style.fontSize = '11px';
        headerRow.appendChild(thCat);

        modelNames.forEach(function(name, i) {
            var th = document.createElement('th');
            th.textContent = name;
            th.style.color = colors[i];
            th.style.borderBottom = '2px solid ' + colors[i];
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var lastCat = '';
        rows.forEach(function(row) {
            var tr = document.createElement('tr');
            var filledCount = row.values.filter(function(v) { return v !== null; }).length;
            // Dim rows where only 1 model has data (unique to that model)
            if (filledCount === 1) {
                tr.style.opacity = '0.6';
            }

            // Benchmark name (clickable)
            var tdBench = document.createElement('td');
            var benchLink = document.createElement('span');
            benchLink.className = 'cursor-pointer hover:text-blue-400 transition';
            benchLink.textContent = row.benchName;
            benchLink.onclick = function() { Modal.showBenchmark(row.benchmark); };
            tdBench.appendChild(benchLink);
            tr.appendChild(tdBench);

            // Category
            var tdCat = document.createElement('td');
            var badge = document.createElement('span');
            badge.className = 'text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-500';
            badge.textContent = row.category;
            tdCat.appendChild(badge);
            tr.appendChild(tdCat);

            // Values
            row.values.forEach(function(val, i) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                if (val !== null) {
                    td.textContent = val > 500 ? Math.round(val) : val;
                    if (i === row.winner && row.values.filter(function(v) { return v !== null; }).length > 1) {
                        td.style.color = colors[i];
                        td.style.fontWeight = 'bold';
                    } else {
                        td.style.color = Theme.textSecondary;
                    }
                    // Clickable \u2192 opens Modal.showScoreSource for this (model, benchmark)
                    // The i-th column in the row corresponds to modelIds[i]
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.setAttribute('title', '\ud074\ub9ad\ud558\uba74 \uac80\uc99d \uc18c\uc2a4\uc640 \uc218\uc9d1\uc77c\u00b7\ubcc0\uacbd \uc774\ub825 \ud45c\uc2dc');
                    td.addEventListener('click', (function(mid, bid) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(mid, bid);
                            }
                        };
                    })(modelIds[i], row.benchmark));
                } else {
                    td.textContent = '\u2014';
                    td.style.color = Theme.textDisabled;
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    },

    renderRadar: function(containerId, modelIds, models, scores, benchmarks) {
        var el = document.getElementById(containerId);
        if (!el) return;
        var chart = echarts.init(el);
        var mergeMap = this._MERGE_MAP;

        var modelNames = modelIds.map(function(mid) {
            var m = models.find(function(x) { return x.id === mid; });
            return m ? m.name : mid.split('/').pop();
        });

        var scoreMap = {};
        scores.forEach(function(s) {
            var bid = s.benchmark_id;
            if (mergeMap[bid] === null) return;
            if (mergeMap[bid]) bid = mergeMap[bid];
            var key = s.model_id + '|' + bid;
            if (!scoreMap[key] || s.value > scoreMap[key]) {
                scoreMap[key] = s.value;
            }
        });

        // Count how many selected models have each benchmark
        var benchCount = {};
        benchmarks.forEach(function(b) {
            var cnt = 0;
            modelIds.forEach(function(mid) {
                if (scoreMap[mid + '|' + b.id]) cnt++;
            });
            if (cnt >= 1) benchCount[b.id] = cnt;
        });

        // Prefer benchmarks all selected models share; tiebreak on larger spread
        // so axes are informative. Drop non-percentage metrics.
        var radarBenchIds = Object.keys(benchCount).filter(function(bid) {
            var maxVal = 0;
            modelIds.forEach(function(mid) {
                var v = scoreMap[mid + '|' + bid] || 0;
                if (v > maxVal) maxVal = v;
            });
            return maxVal <= 100;
        }).sort(function(a, b) {
            // 1. more coverage first
            if (benchCount[b] !== benchCount[a]) return benchCount[b] - benchCount[a];
            // 2. bigger spread (max - min among scored models) first
            function spread(bid) {
                var vs = modelIds.map(function(m) { return scoreMap[m + '|' + bid]; }).filter(Boolean);
                if (vs.length < 2) return 0;
                return Math.max.apply(null, vs) - Math.min.apply(null, vs);
            }
            return spread(b) - spread(a);
        }).slice(0, 16);

        if (radarBenchIds.length < 3) return;

        // How many of the chosen axes are truly shared across ALL selected models?
        var fullyShared = radarBenchIds.filter(function(bid) { return benchCount[bid] === modelIds.length; }).length;

        var indicators = radarBenchIds.map(function(bid) {
            var b = benchmarks.find(function(x) { return x.id === bid; });
            var name = b ? b.name : bid;
            name = name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ').replace("Humanity's Last Exam", 'HLE');
            if (name.length > 20) name = name.substring(0, 18) + '..';
            var maxVal = 0;
            modelIds.forEach(function(mid) {
                var v = scoreMap[mid + '|' + bid] || 0;
                if (v > maxVal) maxVal = v;
            });
            return { name: name, max: maxVal <= 100 ? 100 : Math.ceil(maxVal / 100) * 100 };
        });

        var radarColors = Theme.series.slice(0, 4);

        var series = [{
            type: 'radar',
            data: modelIds.map(function(mid, i) {
                return {
                    name: modelNames[i],
                    value: radarBenchIds.map(function(bid) {
                        return scoreMap[mid + '|' + bid] || 0;
                    }),
                    lineStyle: { color: radarColors[i], width: 2 },
                    itemStyle: { color: radarColors[i] },
                    symbol: 'circle',
                    symbolSize: 5,
                    areaStyle: { color: radarColors[i], opacity: 0.08 }
                };
            })
        }];

        chart.setOption({
            backgroundColor: 'transparent',
            title: {
                text: 'Model Comparison Radar',
                subtext: radarBenchIds.length + ' axes · ' + fullyShared + ' shared by all ' + modelIds.length + ' models',
                left: 'center',
                textStyle: { color: Theme.textPrimary, fontSize: 13 },
                subtextStyle: { color: Theme.textMuted, fontSize: 10 }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var lines = ['<strong>' + params.name + '</strong>'];
                    (params.value || []).forEach(function(v, i) {
                        if (v && v > 0) {
                            var ind = indicators[i];
                            var pct = ind.max === 100 ? v.toFixed(1) + '%' : v.toFixed(1);
                            lines.push(ind.name + ': ' + pct);
                        } else {
                            lines.push('<span style="color:' + Theme.textDisabled + '">' + indicators[i].name + ': —</span>');
                        }
                    });
                    return lines.join('<br>');
                }
            },
            legend: {
                data: modelNames,
                textStyle: { color: Theme.textMuted, fontSize: 11 }, bottom: 0
            },
            radar: {
                indicator: indicators, shape: 'polygon', splitNumber: 5,
                axisName: { color: Theme.textMuted, fontSize: 9 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            series: series
        }, true);
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
