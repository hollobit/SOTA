/* Price tab — model token-price vs performance scatter.
 *
 * X = token price (input / output / blended $ per 1M, log or linear).
 * Y = a selectable performance metric.
 * Each point is a model version, positioned by (price, performance) and
 * colored by vendor; same-family versions are connected in release-date
 * order so you can read the price/performance trajectory across updates.
 * A period slider filters to models released within the last N months.
 *
 * Pricing is collected from multiple leaderboards (OpenRouter, Artificial
 * Analysis, llm-stats) and stored as scores on the *_price_per_mtok_lower_better
 * benchmarks, so this tab is fully data-driven from App.data.scores.
 */
window.Price = (function () {
    'use strict';

    var PRICE_IDS = {
        input:   'input_price_per_mtok_lower_better',
        output:  'output_price_per_mtok_lower_better',
        blended: 'blended_price_per_mtok_lower_better'
    };

    // Candidate Y-axis metrics (id -> label). Only those with real coverage
    // among priced models are shown in the dropdown (computed in init()).
    var METRICS = [
        ['aa_intelligence_index',    'AA Intelligence Index (AAII)'],
        ['epoch_capabilities_index', 'Epoch Capabilities Index (ECI)'],
        ['gpqa_diamond',             'GPQA Diamond'],
        ['mmlu_pro',                 'MMLU-Pro'],
        ['swe_bench_verified',       'SWE-bench Verified'],
        ['aime_2025',                'AIME 2025'],
        ['livecodebench',            'LiveCodeBench'],
        ['terminal_bench_2_1',       'Terminal-Bench 2.1'],
        ['hle',                      "Humanity's Last Exam (HLE)"],
        ['llm_stats_index',          'LLM-Stats Index']
    ];

    var VENDOR_COLORS = {
        openai: '#10a37f', anthropic: '#d97757', google: '#4285f4', 'google-deepmind': '#4285f4',
        xai: '#111827', meta: '#0866ff', deepseek: '#4d6bfe', alibaba: '#ff6a00', moonshot: '#6d28d9',
        zhipu: '#2563eb', mistral: '#fa5010', bytedance: '#325ab4', microsoft: '#00a4ef',
        nvidia: '#76b900', amazon: '#ff9900', cohere: '#39594d', minimax: '#e11d48', baidu: '#2932e1'
    };

    var _scoreIdx = {};   // benchmark_id -> { model_id: value }
    var _modelsById = {};
    var _urlKeys = {
        'price-metric': 'p_metric', 'price-basis': 'p_basis', 'price-period': 'p_period',
        'price-vendor': 'p_vendor', 'price-logscale': 'p_log', 'price-connect': 'p_conn'
    };
    var _wired = false, _chart = null;

    function _idx(scores) {
        var idx = {};
        (scores || []).forEach(function (s) {
            var b = s.benchmark_id || s.benchmark, m = s.model_id || s.model;
            var v = (s.value !== undefined && s.value !== null) ? s.value : s.score;
            if (!b || !m || v === undefined || v === null) return;
            (idx[b] || (idx[b] = {}))[m] = +v;
        });
        return idx;
    }

    function _vendor(id, model) {
        if (model && model.vendor) return String(model.vendor).toLowerCase();
        return (id.indexOf('/') !== -1 ? id.split('/')[0] : 'other').toLowerCase();
    }
    function _vendorColor(v) { return VENDOR_COLORS[v] || '#9ca3af'; }

    // Family key for trajectory grouping: vendor + base name with version-like
    // tokens removed, so claude-opus-4.7/4.8/5 collapse to one family.
    function _family(id) {
        var v = id.indexOf('/') !== -1 ? id.split('/')[0] : '';
        var base = id.indexOf('/') !== -1 ? id.split('/').slice(1).join('/') : id;
        var toks = base.split(/[-_.]/).filter(function (t) {
            return t && !/^\d/.test(t) && !/^v\d/.test(t);
        });
        return v + '/' + toks.join('-');
    }

    function _price(id, basis) {
        var inp = _scoreIdx[PRICE_IDS.input] && _scoreIdx[PRICE_IDS.input][id];
        var out = _scoreIdx[PRICE_IDS.output] && _scoreIdx[PRICE_IDS.output][id];
        if (basis === 'input')  return (inp != null) ? inp : null;
        if (basis === 'output') return (out != null) ? out : null;
        // blended: prefer a leaderboard-reported blended, else usage-weighted 1:3
        var bl = _scoreIdx[PRICE_IDS.blended] && _scoreIdx[PRICE_IDS.blended][id];
        if (bl != null) return bl;
        if (inp != null && out != null) return (inp + 3 * out) / 4;
        return null;
    }

    function _relDate(model) {
        var d = model && (model.release_date || model.released_at);
        return d || null;
    }

    // ---- URL state ---------------------------------------------------------
    function _syncUrl() {
        try {
            var params = new URLSearchParams(window.location.search);
            Object.keys(_urlKeys).forEach(function (elId) {
                var el = document.getElementById(elId);
                if (!el) return;
                var val = (el.type === 'checkbox') ? (el.checked ? '1' : '') : el.value;
                var key = _urlKeys[elId];
                if (val === '' || val === 'all') params.delete(key); else params.set(key, val);
            });
            var qs = params.toString();
            history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
        } catch (e) {}
    }
    function _applyUrl() {
        try {
            var params = new URLSearchParams(window.location.search);
            Object.keys(_urlKeys).forEach(function (elId) {
                var el = document.getElementById(elId);
                if (!el) return;
                var val = params.get(_urlKeys[elId]);
                if (val === null) return;
                if (el.type === 'checkbox') el.checked = (val === '1' || val === 'true');
                else el.value = val;
            });
            var pl = document.getElementById('price-period-label'), pr = document.getElementById('price-period');
            if (pl && pr) pl.textContent = pr.value;
        } catch (e) {}
    }

    function init(models) {
        _modelsById = {};
        (models || []).forEach(function (m) { _modelsById[m.id] = m; });
        _scoreIdx = _idx(App && App.data ? App.data.scores : []);

        // Populate metric dropdown with metrics that have coverage among priced.
        var priced = {};
        [PRICE_IDS.input, PRICE_IDS.output].forEach(function (pid) {
            var m = _scoreIdx[pid] || {}; Object.keys(m).forEach(function (id) { priced[id] = 1; });
        });
        var sel = document.getElementById('price-metric');
        if (sel && !sel.options.length) {
            METRICS.forEach(function (pair) {
                var cov = 0, mp = _scoreIdx[pair[0]] || {};
                Object.keys(priced).forEach(function (id) { if (mp[id] != null) cov++; });
                if (cov >= 5) {
                    var o = document.createElement('option');
                    o.value = pair[0]; o.textContent = pair[1] + ' (' + cov + ')';
                    sel.appendChild(o);
                }
            });
        }
        // Populate vendor filter from priced models.
        var vsel = document.getElementById('price-vendor');
        if (vsel && vsel.options.length <= 1) {
            var vs = {};
            Object.keys(priced).forEach(function (id) { vs[_vendor(id, _modelsById[id])] = 1; });
            Object.keys(vs).sort().forEach(function (v) {
                var o = document.createElement('option'); o.value = v; o.textContent = v; vsel.appendChild(o);
            });
        }
        _applyUrl();
    }

    function _wire() {
        if (_wired) return; _wired = true;
        ['price-metric', 'price-basis', 'price-vendor', 'price-logscale', 'price-connect'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('change', function () { _syncUrl(); render(); });
        });
        var pr = document.getElementById('price-period');
        if (pr) pr.addEventListener('input', function () {
            var pl = document.getElementById('price-period-label'); if (pl) pl.textContent = pr.value;
            _syncUrl(); render();
        });
        window.addEventListener('resize', function () { if (_chart) _chart.resize(); });
    }

    function _val(id, dflt) { var el = document.getElementById(id); return el ? el.value : dflt; }
    function _chk(id) { var el = document.getElementById(id); return !!(el && el.checked); }

    function render() {
        var el = document.getElementById('price-chart');
        if (!el || typeof echarts === 'undefined') return;
        _wire();
        if (!_scoreIdx[PRICE_IDS.output]) _scoreIdx = _idx(App && App.data ? App.data.scores : []);

        var metric = _val('price-metric', 'aa_intelligence_index');
        var basis  = _val('price-basis', 'output');
        var months = parseInt(_val('price-period', '12'), 10) || 12;
        var vendorF = _val('price-vendor', 'all');
        var useLog = _chk('price-logscale');
        var connect = _chk('price-connect');

        var metricLabel = (METRICS.filter(function (m) { return m[0] === metric; })[0] || [metric, metric])[1];
        var basisLabel = basis === 'input' ? 'Input $/1M' : basis === 'blended' ? 'Blended $/1M' : 'Output $/1M';

        // period cutoff
        var now = new Date();
        var cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
        var cutoffStr = cutoff.toISOString().slice(0, 10);

        // Build points
        var priceMap = _scoreIdx[PRICE_IDS.input] || {};
        var pts = [], families = {}, skippedNoPerf = 0, skippedOld = 0;
        Object.keys(priceMap).forEach(function (id) {
            var model = _modelsById[id]; if (!model) return;
            var ven = _vendor(id, model);
            if (vendorF !== 'all' && ven !== vendorF) return;
            var price = _price(id, basis); if (price == null || price <= 0) return;
            var perf = _scoreIdx[metric] && _scoreIdx[metric][id];
            if (perf == null) { skippedNoPerf++; return; }
            var rel = _relDate(model);
            if (rel && rel < cutoffStr) { skippedOld++; return; }
            var name = model.name || id;
            var p = {
                value: [price, perf], modelId: id, name: name, vendor: ven, rel: rel || '',
                itemStyle: { color: _vendorColor(ven) }
            };
            pts.push(p);
            var fk = _family(id);
            (families[fk] || (families[fk] = [])).push(p);
        });

        var series = [{
            type: 'scatter', symbolSize: 12, data: pts, z: 3,
            emphasis: { focus: 'series', label: { show: true, formatter: function (pp) { return pp.data.name; }, position: 'top' } },
            labelLayout: { hideOverlap: true }
        }];

        // Trajectory lines per family (>=2 points), sorted by release date.
        if (connect) {
            Object.keys(families).forEach(function (fk) {
                var arr = families[fk].filter(function (p) { return p.rel; });
                if (arr.length < 2) return;
                arr.sort(function (a, b) { return a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0; });
                series.push({
                    type: 'line', z: 1, silent: true, symbol: 'none',
                    lineStyle: { width: 1, color: _vendorColor(arr[0].vendor), opacity: 0.35 },
                    data: arr.map(function (p) { return p.value; })
                });
            });
        }

        var option = {
            backgroundColor: 'transparent',
            grid: { left: 60, right: 30, top: 20, bottom: 60 },
            tooltip: {
                trigger: 'item',
                formatter: function (pp) {
                    if (!pp.data || !pp.data.modelId) return '';
                    var d = pp.data;
                    return '<strong>' + d.name + '</strong><br/>' +
                        basisLabel + ': $' + d.value[0].toFixed(2) + '<br/>' +
                        metricLabel + ': ' + d.value[1] + '<br/>' +
                        (d.rel ? '출시: ' + d.rel + '<br/>' : '') +
                        '<span style="color:#888">클릭 시 상세정보</span>';
                }
            },
            xAxis: {
                type: useLog ? 'log' : 'value', name: basisLabel + (useLog ? ' (log)' : ''),
                nameLocation: 'middle', nameGap: 34, nameTextStyle: { color: '#9ca3af' },
                axisLabel: { color: '#9ca3af', formatter: function (v) { return '$' + v; } },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
            },
            yAxis: {
                type: 'value', name: metricLabel, nameLocation: 'middle', nameGap: 42,
                nameTextStyle: { color: '#9ca3af' }, scale: true,
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }
            },
            series: series
        };

        if (!_chart) _chart = echarts.init(el);
        _chart.setOption(option, true);
        _chart.resize();
        _chart.off('click');
        _chart.on('click', function (params) {
            var id = params && params.data && params.data.modelId;
            if (id && typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(id);
        });

        var note = document.getElementById('price-note');
        if (note) {
            note.textContent = pts.length + '개 모델 표시 (최근 ' + months + '개월 · ' + basisLabel +
                ' vs ' + metricLabel + '). 가격 출처: OpenRouter · Artificial Analysis · llm-stats. ' +
                (skippedOld ? skippedOld + '개는 기간 밖, ' : '') +
                (skippedNoPerf ? skippedNoPerf + '개는 선택 지표 점수 없음.' : '');
        }
    }

    return { init: init, render: render };
})();
