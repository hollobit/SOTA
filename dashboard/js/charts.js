/**
 * ECharts wrapper functions for the dashboard.
 */
var Charts = {
    _instances: {},

    _getOrCreate: function(containerId) {
        if (!this._instances[containerId]) {
            var el = document.getElementById(containerId);
            if (!el) return null;
            this._instances[containerId] = echarts.init(el, 'dark');
            var chart = this._instances[containerId];
            window.addEventListener('resize', function() { chart.resize(); });
        }
        return this._instances[containerId];
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

        var indicator = benchmarkIds.map(function(b) {
            return { name: b.toUpperCase(), max: 100 };
        });
        var data = modelsData.map(function(m) {
            return {
                name: m.name,
                value: benchmarkIds.map(function(b) { return m.scores[b] || 0; })
            };
        });

        chart.setOption({
            title: { text: 'Model Comparison', left: 'center' },
            tooltip: {},
            legend: { bottom: 0 },
            radar: { indicator: indicator },
            series: [{ type: 'radar', data: data }]
        }, true);
    },

    renderHeatmap: function(containerId, models, benchmarks, matrix) {
        var chart = this._getOrCreate(containerId);
        if (!chart) return;

        var data = [];
        matrix.forEach(function(row, i) {
            row.forEach(function(val, j) {
                if (val !== null) data.push([j, i, val]);
            });
        });

        chart.setOption({
            title: { text: 'Benchmark Scores Heatmap', left: 'center' },
            tooltip: {
                formatter: function(p) {
                    return models[p.value[1]] + '\n' + benchmarks[p.value[0]] + ': ' + p.value[2];
                }
            },
            xAxis: { type: 'category', data: benchmarks, axisLabel: { rotate: 45 } },
            yAxis: { type: 'category', data: models },
            visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0 },
            series: [{ type: 'heatmap', data: data, label: { show: true, fontSize: 10 } }]
        }, true);
    }
};
