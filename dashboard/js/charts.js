/**
 * ECharts wrapper functions for the dashboard.
 */
var Charts = {
    _instances: {},

    _getOrCreate: function(containerId) {
        var el = document.getElementById(containerId);
        if (!el) return null;
        // If parent is display:none (offsetParent === null), can't measure — skip.
        // The caller can re-invoke when the tab becomes visible.
        if (el.offsetParent === null && el.offsetWidth === 0) return null;

        var existing = this._instances[containerId];
        if (existing) {
            // Detect cached chart with bad (zero) dimensions — happens when
            // ECharts.init ran while parent was display:none. Dispose + reinit.
            try {
                if (existing.getWidth() < 10 || existing.getHeight() < 10) {
                    existing.dispose();
                    existing = null;
                    delete this._instances[containerId];
                }
            } catch (e) {
                // Disposed already or in bad state
                existing = null;
                delete this._instances[containerId];
            }
        }
        if (existing) return existing;

        this._instances[containerId] = echarts.init(el, 'dark');
        var chart = this._instances[containerId];
        // Defer a resize to the next frame so any pending layout (e.g. tab
        // just transitioned from display:none) is reflected before ECharts
        // remeasures its container. setOption may run before this fires —
        // that's fine, resize() will repaint at correct dimensions.
        requestAnimationFrame(function() {
            try { chart.resize(); } catch (e) {}
        });
        // ResizeObserver covers the case where the element grows later
        // (e.g. parent grid finalising after fonts load).
        if (typeof ResizeObserver !== 'undefined') {
            try {
                var ro = new ResizeObserver(function() {
                    try { chart.resize(); } catch (e) {}
                });
                ro.observe(el);
            } catch (e) {}
        }
        window.addEventListener('resize', function() {
            try { chart.resize(); } catch (e) {}
        });
        return chart;
    },

    /**
     * Force resize all known chart instances. Call after a tab becomes visible.
     */
    resizeAll: function() {
        var self = this;
        Object.keys(this._instances).forEach(function(id) {
            try {
                var inst = self._instances[id];
                if (inst && !inst.isDisposed()) inst.resize();
            } catch (e) {}
        });
    },

    renderTrendLine: function(containerId, benchmarkId, historyData) {
        var chart = this._getOrCreate(containerId);
        if (!chart) return;

        var dates = Object.keys(historyData).sort();
        var modelSet = {};
        dates.forEach(function(d) {
            (historyData[d] || []).forEach(function(s) {
                if (s.benchmark_id === benchmarkId) modelSet[s.model_id] = true;
            });
        });
        var models = Object.keys(modelSet);

        var series = models.map(function(modelId) {
            return {
                name: modelId.split('/').pop(),
                type: 'line',
                smooth: true,
                data: dates.map(function(d) {
                    var entry = (historyData[d] || []).find(function(s) {
                        return s.model_id === modelId && s.benchmark_id === benchmarkId;
                    });
                    return entry ? entry.value : null;
                })
            };
        });

        chart.setOption({
            title: { text: benchmarkId.toUpperCase() + ' SOTA Trend', left: 'center' },
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0, type: 'scroll' },
            xAxis: { type: 'category', data: dates },
            yAxis: { type: 'value', name: 'Score' },
            series: series
        }, true);
    },

    renderRadar: function(containerId, modelsData, benchmarkIds) {
        var chart = this._getOrCreate(containerId);
        if (!chart) return;

        // Calculate per-axis max from actual data
        var axisMax = {};
        benchmarkIds.forEach(function(b) {
            var max = 0;
            modelsData.forEach(function(m) {
                var v = m.scores[b] || 0;
                if (v > max) max = v;
            });
            // Round up to nice number for axis
            if (max <= 100) axisMax[b] = 100;
            else if (max <= 1000) axisMax[b] = Math.ceil(max / 100) * 100;
            else axisMax[b] = Math.ceil(max / 1000) * 1000;
        });

        // Store raw values for tooltip
        var rawValues = {};
        modelsData.forEach(function(m) {
            rawValues[m.name] = {};
            benchmarkIds.forEach(function(b) {
                rawValues[m.name][b] = m.scores[b] || 0;
            });
        });

        var indicator = benchmarkIds.map(function(b) {
            var name = b.toUpperCase();
            if (axisMax[b] > 100) name += ' (max:' + axisMax[b] + ')';
            return { name: name, max: axisMax[b] };
        });

        var data = modelsData.map(function(m) {
            return {
                name: m.name,
                value: benchmarkIds.map(function(b) { return m.scores[b] || 0; })
            };
        });

        chart.setOption({
            title: { text: 'Model Comparison', left: 'center' },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (!params.value) return '';
                    var lines = [params.name];
                    benchmarkIds.forEach(function(b, i) {
                        var v = params.value[i];
                        if (v > 0) {
                            var display = v > 500 ? Math.round(v) : v.toFixed(1);
                            lines.push(b + ': ' + display);
                        }
                    });
                    return lines.join('<br>');
                }
            },
            legend: { bottom: 0 },
            radar: { indicator: indicator },
            series: [{ type: 'radar', data: data }]
        }, true);
    },

    renderHeatmap: function(containerId, models, benchmarks, matrix) {
        var chart = this._getOrCreate(containerId);
        if (!chart) return;

        // Normalize: for each column (benchmark), compute relative score 0-100
        var colMax = [];
        var colMin = [];
        benchmarks.forEach(function(b, j) {
            var max = 0, min = Infinity;
            matrix.forEach(function(row) {
                if (row[j] !== null) {
                    if (row[j] > max) max = row[j];
                    if (row[j] < min) min = row[j];
                }
            });
            colMax.push(max);
            colMin.push(min === Infinity ? 0 : min);
        });

        var data = [];
        matrix.forEach(function(row, i) {
            row.forEach(function(val, j) {
                if (val !== null) {
                    // Normalize to 0-100 within each benchmark column
                    var range = colMax[j] - colMin[j];
                    var norm = range > 0 ? ((val - colMin[j]) / range) * 100 : 50;
                    data.push([j, i, val, norm]);
                }
            });
        });

        chart.setOption({
            title: { text: 'Benchmark Scores Heatmap (normalized per column)', left: 'center', textStyle: { fontSize: 13 } },
            tooltip: {
                formatter: function(p) {
                    var raw = p.value[2];
                    var display = raw > 500 ? Math.round(raw) : raw.toFixed(1);
                    return models[p.value[1]] + '\n' + benchmarks[p.value[0]] + ': ' + display;
                }
            },
            xAxis: {
                type: 'category', data: benchmarks,
                axisLabel: { rotate: 45, fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'category', data: models,
                axisLabel: { fontSize: 10 },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            visualMap: {
                min: 0, max: 100, calculable: true,
                orient: 'horizontal', left: 'center', bottom: 0,
                inRange: { color: Theme.heatmap },
                textStyle: { color: Theme.textMuted },
                text: ['Best', 'Worst']
            },
            series: [{
                type: 'heatmap',
                data: data.map(function(d) { return [d[0], d[1], d[3]]; }),
                label: {
                    show: true, fontSize: 9, color: Theme.textPrimary,
                    formatter: function(p) {
                        // Show raw value, not normalized
                        var raw = data.find(function(d) { return d[0] === p.value[0] && d[1] === p.value[1]; });
                        if (raw) {
                            var v = raw[2];
                            return v > 500 ? Math.round(v) : v.toFixed(1);
                        }
                        return '';
                    }
                },
                emphasis: { itemStyle: { borderColor: Theme.textWhite, borderWidth: 1 } }
            }]
        }, true);
    }
};
