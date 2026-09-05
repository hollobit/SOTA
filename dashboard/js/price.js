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
        blended: 'blended_price_per_mtok_lower_better',
        cached:  'cached_input_price_per_mtok_lower_better'
    };

    // Candidate Y-axis metrics [id, label, 분류명(category)]. Only those with
    // real coverage among priced models are shown (computed in init()); the
    // dropdown/axis show the category in parentheses after the name.
    var METRICS = [
        // 종합 (composite)
        ['aa_intelligence_index',    'AA Intelligence Index (AAII)', '종합'],
        ['aa_intelligence_index_v4_2', 'AA Intelligence Index v4.2', '종합'],
        ['epoch_capabilities_index', 'Epoch Capabilities Index (ECI)', '종합'],
        ['llm_stats_index',          'LLM-Stats Index', '종합'],
        // 추론 (reasoning)
        ['gpqa_diamond',             'GPQA Diamond', '추론'],
        ['mmlu_pro',                 'MMLU-Pro', '추론'],
        ['aime_2025',                'AIME 2025', '추론'],
        ['aime_2026',                'AIME 2026', '추론'],
        ['hle',                      "Humanity's Last Exam", '추론'],
        ['frontiermath',             'FrontierMath', '추론'],
        ['livebench',                'LiveBench', '추론'],
        ['critpt',                   'CritPt', '추론'],
        ['simplebench',              'SimpleBench', '추론'],
        // 코딩 (coding)
        ['swe_bench_verified',       'SWE-bench Verified', '코딩'],
        ['swe_bench_pro',            'SWE-bench Pro', '코딩'],
        ['livecodebench',            'LiveCodeBench', '코딩'],
        ['terminal_bench_2_1',       'Terminal-Bench 2.1', '코딩'],
        ['aider_polyglot',           'Aider Polyglot', '코딩'],
        ['deepswe_1_1',              'DeepSWE 1.1', '코딩'],
        // 에이전트 (agent)
        ['gaia',                     'GAIA', '에이전트'],
        ['osworld_verified',         'OSWorld-Verified', '에이전트'],
        ['browsecomp',               'BrowseComp', '에이전트'],
        ['tau2_telecom',             'τ²-Bench Telecom', '에이전트'],
        // 사이버 (cyber)
        ['cybench',                  'Cybench (CTF)', '사이버'],
        ['nyu_ctf',                  'NYU CTF Bench', '사이버'],
        ['cybergym_success_rate',    'CyberGym Success Rate', '사이버'],
        ['cvebench',                 'CVE-Bench', '사이버'],
        // 안전 (safety) — note: ASR-style metrics are lower=safer
        ['strongreject',             'StrongREJECT', '안전'],
        ['airtbench',                'AIRTBench', '안전'],
        ['r_judge',                  'R-Judge', '안전'],
        // AGI
        ['arc_agi_2',                'ARC-AGI-2', 'AGI'],
        ['arc_agi_3',                'ARC-AGI-3', 'AGI'],
        ['agieval',                  'AGIEval', 'AGI'],
        // 과학 (AI4S)
        ['scicode',                  'SciCode', '과학'],
        // 아레나 (human-preference / Elo)
        ['arena_agent_net_improvement', 'Agent Arena (arena.ai)', '아레나'],
        ['arena_ai_text_elo',           'Text Arena (arena.ai Elo)', '아레나'],
        ['arena_webdev_elo',            'Code Arena (WebDev Elo)', '아레나']
    ];

    var VENDOR_COLORS = {
        openai: '#10a37f', anthropic: '#d97757', google: '#4285f4', 'google-deepmind': '#4285f4',
        xai: '#111827', meta: '#0866ff', deepseek: '#4d6bfe', alibaba: '#ff6a00', moonshot: '#6d28d9',
        zhipu: '#2563eb', mistral: '#fa5010', bytedance: '#325ab4', microsoft: '#00a4ef',
        nvidia: '#76b900', amazon: '#ff9900', cohere: '#39594d', minimax: '#e11d48', baidu: '#2932e1'
    };

    // Plain system UI font for chart text (axes / labels / tooltip).
    var NORMAL_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    // Per-vendor marker shape (secondary channel to color) — mirrors the AA
    // reference chart (Google/NVIDIA diamonds, MiniMax triangles, etc.).
    var VENDOR_SHAPES = {
        google: 'diamond', 'google-deepmind': 'diamond', nvidia: 'diamond',
        minimax: 'triangle', meta: 'roundRect', mistral: 'rect', amazon: 'pin',
        alibaba: 'triangle', zhipu: 'rect', bytedance: 'roundRect'
    };
    function _vendorShape(v) { return VENDOR_SHAPES[v] || 'circle'; }

    var _scoreIdx = {};   // benchmark_id -> { model_id: value }
    var _modelsById = {};
    var _urlKeys = {
        'price-metric': 'p_metric', 'price-basis': 'p_basis', 'price-period': 'p_period',
        'price-vendor': 'p_vendor', 'price-country': 'p_country', 'price-logscale': 'p_log', 'price-connect': 'p_conn',
        'price-labels': 'p_lbl', 'price-flags': 'p_flag', 'price-hitrate': 'p_hit',
        'price-pareto': 'p_pareto'
    };
    var _wired = false, _chart = null;
    var _sortKey = 'output', _sortDir = 'desc';   // price-table sort state
    var _lastRows = [];

    function _esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    // Country (with flag) via Timeline's authoritative VENDOR_TO_COUNTRY map
    // (loaded as a price-tab dependency); graceful fallback if unavailable.
    function _country(id, model) {
        // _getCountry returns flag-prefixed strings like "🇺🇸 USA".
        if (typeof Timeline !== 'undefined' && Timeline._getCountry) {
            return Timeline._getCountry(id, model) || '';
        }
        return '';
    }
    // Just the flag emoji for a model (via Timeline's country map).
    function _flag(id, model) {
        if (typeof Timeline !== 'undefined' && Timeline._getCountry && Timeline._flagFromCountry) {
            return Timeline._flagFromCountry(Timeline._getCountry(id, model)) || '';
        }
        return '';
    }

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

    function _price(id, basis, hitRate) {
        var inp = _scoreIdx[PRICE_IDS.input] && _scoreIdx[PRICE_IDS.input][id];
        var out = _scoreIdx[PRICE_IDS.output] && _scoreIdx[PRICE_IDS.output][id];
        var cch = _scoreIdx[PRICE_IDS.cached] && _scoreIdx[PRICE_IDS.cached][id];
        if (basis === 'input')  return (inp != null) ? inp : null;
        if (basis === 'output') return (out != null) ? out : null;
        if (basis === 'cached') return (cch != null) ? cch : null;
        if (basis === 'effective') {
            // effective input = hit*cacheRead + (1-hit)*input (article's math)
            if (inp == null) return null;
            var h = (hitRate == null ? 0 : hitRate) / 100;
            var cache = (cch != null) ? cch : inp;   // no cache price → no discount
            return h * cache + (1 - h) * inp;
        }
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
            var hl = document.getElementById('price-hit-label'), hr = document.getElementById('price-hitrate');
            if (hl && hr) hl.textContent = hr.value;
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
                    o.value = pair[0];
                    o.textContent = pair[1] + ' (' + (pair[2] || '') + ') · ' + cov;
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
        // Populate country filter (via Timeline's country map).
        var csel = document.getElementById('price-country');
        if (csel && csel.options.length <= 1) {
            var cs = {};
            Object.keys(priced).forEach(function (id) { var cc = _country(id, _modelsById[id]); if (cc) cs[cc] = 1; });
            Object.keys(cs).sort().forEach(function (cc) {
                var o = document.createElement('option'); o.value = cc; o.textContent = cc; csel.appendChild(o);
            });
        }
        _applyUrl();
    }

    function _wire() {
        if (_wired) return; _wired = true;
        ['price-metric', 'price-basis', 'price-vendor', 'price-country', 'price-logscale', 'price-connect', 'price-labels', 'price-flags', 'price-pareto'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('change', function () { _syncUrl(); render(); });
        });
        var pr = document.getElementById('price-period');
        if (pr) pr.addEventListener('input', function () {
            var pl = document.getElementById('price-period-label'); if (pl) pl.textContent = pr.value;
            _syncUrl(); render();
        });
        var hr = document.getElementById('price-hitrate');
        if (hr) hr.addEventListener('input', function () {
            var hl = document.getElementById('price-hit-label'); if (hl) hl.textContent = hr.value;
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
        var countryF = _val('price-country', 'all');
        var useLog = _chk('price-logscale');
        var connect = _chk('price-connect');
        var showLabels = _chk('price-labels');
        var showFlags = _chk('price-flags');
        var showPareto = _chk('price-pareto');
        var hitRate = parseInt(_val('price-hitrate', '0'), 10) || 0;

        var mDef = METRICS.filter(function (m) { return m[0] === metric; })[0] || [metric, metric, ''];
        var metricLabel = mDef[1] + (mDef[2] ? ' (' + mDef[2] + ')' : '');
        var BASIS_LABELS = {
            input: 'Input $/1M', output: 'Output $/1M', blended: 'Blended $/1M',
            cached: 'Cached input $/1M', effective: '유효 입력단가 $/1M (hit ' + hitRate + '%)'
        };
        var basisLabel = BASIS_LABELS[basis] || 'Output $/1M';

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
            if (countryF !== 'all' && _country(id, model) !== countryF) return;
            var price = _price(id, basis, hitRate); if (price == null || price <= 0) return;
            var perf = _scoreIdx[metric] && _scoreIdx[metric][id];
            if (perf == null) { skippedNoPerf++; return; }
            var rel = _relDate(model);
            if (rel && rel < cutoffStr) { skippedOld++; return; }
            var name = model.name || id;
            var p = {
                value: [price, perf], modelId: id, name: name, vendor: ven, rel: rel || '',
                flag: _flag(id, model), symbol: _vendorShape(ven), itemStyle: { color: _vendorColor(ven) }
            };
            pts.push(p);
            var fk = _family(id);
            (families[fk] || (families[fk] = [])).push(p);
        });

        // Point label per the 모델명/국기 toggles: flag + full name (either alone).
        function _ptLabel(pp) {
            var d = pp.data || {}, parts = [];
            if (showFlags && d.flag) parts.push(d.flag);
            if (showLabels && d.name) parts.push(d.name);
            return parts.join(' ');
        }
        // Pareto frontier (斬殺線): a point is non-dominated if no other point is
        // both cheaper-or-equal AND better-or-equal. Walk points by price asc,
        // keep those beating the running best perf. Dominated points are dimmed.
        var frontierPts = [];
        if (showPareto && pts.length) {
            var sortedP = pts.slice().sort(function (a, b) {
                return a.value[0] - b.value[0] || b.value[1] - a.value[1];
            });
            var maxPerf = -Infinity;
            sortedP.forEach(function (p) {
                if (p.value[1] > maxPerf) { frontierPts.push(p); maxPerf = p.value[1]; p._frontier = true; }
            });
            pts.forEach(function (p) {
                if (!p._frontier) p.itemStyle = { color: _vendorColor(p.vendor), opacity: 0.25 };
            });
        }

        var series = [{
            type: 'scatter', symbolSize: 12, data: pts, z: 3,
            label: {
                show: showLabels || showFlags, position: 'right', formatter: _ptLabel,
                fontFamily: NORMAL_FONT, fontSize: 11, color: '#cbd5e1'
            },
            emphasis: { focus: 'series', label: {
                show: true, formatter: function (pp) { return (pp.data.flag ? pp.data.flag + ' ' : '') + pp.data.name; },
                position: 'top', fontFamily: NORMAL_FONT
            } },
            // When labels/flags are explicitly on, show ALL of them (no overlap
            // culling); only hide-on-overlap for the hover-only emphasis labels.
            labelLayout: { hideOverlap: !(showLabels || showFlags) }
        }];

        // Trajectory lines per family (>=2 points), sorted by release date, with
        // an arrow on each segment pointing old -> new (direction of updates).
        if (connect) {
            var segs = [];
            Object.keys(families).forEach(function (fk) {
                var arr = families[fk].filter(function (p) { return p.rel; });
                if (arr.length < 2) return;
                arr.sort(function (a, b) { return a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0; });
                for (var i = 0; i < arr.length - 1; i++) {
                    segs.push({
                        coords: [arr[i].value, arr[i + 1].value],
                        lineStyle: { color: _vendorColor(arr[0].vendor) }
                    });
                }
            });
            if (segs.length) {
                series.push({
                    type: 'lines', coordinateSystem: 'cartesian2d', z: 1, silent: true,
                    symbol: ['none', 'arrow'], symbolSize: 7,
                    lineStyle: { width: 1, opacity: 0.4, curveness: 0 },
                    data: segs
                });
            }
        }

        // Efficient-frontier line (amber dashed) through the non-dominated points.
        if (showPareto && frontierPts.length >= 2) {
            series.push({
                type: 'line', z: 2, silent: true, symbol: 'none', smooth: false,
                lineStyle: { width: 2, color: '#fbbf24', opacity: 0.9, type: 'dashed' },
                data: frontierPts.map(function (p) { return p.value; })
            });
        }

        var option = {
            backgroundColor: 'transparent',
            textStyle: { fontFamily: NORMAL_FONT },
            // Extra right room when labels are on so right-edge (priciest) point
            // labels aren't clipped.
            grid: { left: 60, right: (showLabels || showFlags) ? 150 : 30, top: 20, bottom: 60 },
            tooltip: {
                trigger: 'item',
                textStyle: { fontFamily: NORMAL_FONT },
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

        // ---- per-model price table (input/output/blended + release/vendor/country) ----
        var inMap = _scoreIdx[PRICE_IDS.input] || {}, outMap = _scoreIdx[PRICE_IDS.output] || {};
        var tableIds = {};
        Object.keys(inMap).forEach(function (id) { tableIds[id] = 1; });
        Object.keys(outMap).forEach(function (id) { tableIds[id] = 1; });
        var cchMap = _scoreIdx[PRICE_IDS.cached] || {};
        var rows = [];
        Object.keys(tableIds).forEach(function (id) {
            var model = _modelsById[id]; if (!model) return;
            var ven = _vendor(id, model);
            if (vendorF !== 'all' && ven !== vendorF) return;
            if (countryF !== 'all' && _country(id, model) !== countryF) return;
            var rel = _relDate(model);
            if (rel && rel < cutoffStr) return;
            var inp = (inMap[id] != null ? inMap[id] : null);
            var cch = (cchMap[id] != null ? cchMap[id] : null);
            var disc = (inp != null && inp > 0 && cch != null) ? Math.round((1 - cch / inp) * 100) : null;
            rows.push({
                id: id, name: model.name || id, vendor: model.vendor || ven,
                country: _country(id, model),
                input: inp,
                output: (outMap[id] != null ? outMap[id] : null),
                blended: _price(id, 'blended'),
                cached: cch, discount: disc,
                rel: rel || ''
            });
        });
        _lastRows = rows;
        _renderTable(rows);
    }

    function _renderTable(rows) {
        var wrap = document.getElementById('price-table-wrap');
        if (!wrap) return;
        var cols = [
            { key: 'name',    label: '모델',        num: false },
            { key: 'vendor',  label: '제조사',      num: false },
            { key: 'country', label: '국가',        num: false },
            { key: 'input',   label: 'Input $/1M',  num: true },
            { key: 'output',  label: 'Output $/1M', num: true },
            { key: 'blended', label: 'Blended $/1M',num: true },
            { key: 'cached',  label: 'Cached in $/1M', num: true },
            { key: 'discount',label: '캐시 할인율 %',  num: true },
            { key: 'rel',     label: '출시일',      num: false }
        ];
        var dir = _sortDir === 'asc' ? 1 : -1;
        rows.sort(function (a, b) {   // null-safe: blanks/nulls always last
            var av = a[_sortKey], bv = b[_sortKey];
            var an = (av == null || av === ''), bn = (bv == null || bv === '');
            if (an && bn) return 0;
            if (an) return 1;
            if (bn) return -1;
            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
            return String(av).localeCompare(String(bv)) * dir;
        });
        var h = '<table class="w-full text-sm border-collapse"><thead><tr class="text-gray-400 border-b border-gray-700">';
        cols.forEach(function (c) {
            var arrow = _sortKey === c.key ? (_sortDir === 'asc' ? ' ▲' : ' ▼') : '';
            h += '<th data-key="' + c.key + '" class="px-3 py-2 ' + (c.num ? 'text-right' : 'text-left') +
                ' cursor-pointer select-none hover:text-gray-200 whitespace-nowrap">' + c.label + arrow + '</th>';
        });
        h += '</tr></thead><tbody>';
        var fmt = function (v) { return v == null ? '—' : '$' + (+v).toFixed(v < 0.1 ? 4 : 2); };
        var pct = function (v) { return v == null ? '—' : v + '%'; };
        rows.forEach(function (r) {
            h += '<tr class="border-b border-gray-800 hover:bg-gray-800/40">' +
                '<td class="px-3 py-1.5 text-left"><button data-model="' + _esc(r.id) + '" class="price-tbl-model text-blue-400 hover:text-blue-300">' + _esc(r.name) + '</button></td>' +
                '<td class="px-3 py-1.5 text-left text-gray-300 whitespace-nowrap">' + _esc(r.vendor) + '</td>' +
                '<td class="px-3 py-1.5 text-left text-gray-300 whitespace-nowrap">' + _esc(r.country) + '</td>' +
                '<td class="px-3 py-1.5 text-right tabular-nums">' + fmt(r.input) + '</td>' +
                '<td class="px-3 py-1.5 text-right tabular-nums">' + fmt(r.output) + '</td>' +
                '<td class="px-3 py-1.5 text-right tabular-nums">' + fmt(r.blended) + '</td>' +
                '<td class="px-3 py-1.5 text-right tabular-nums text-gray-300">' + fmt(r.cached) + '</td>' +
                '<td class="px-3 py-1.5 text-right tabular-nums text-emerald-400">' + pct(r.discount) + '</td>' +
                '<td class="px-3 py-1.5 text-left text-gray-400 whitespace-nowrap">' + _esc(r.rel || '—') + '</td>' +
                '</tr>';
        });
        h += '</tbody></table>';
        wrap.innerHTML = h;

        wrap.querySelectorAll('th[data-key]').forEach(function (th) {
            th.addEventListener('click', function () {
                var k = th.getAttribute('data-key');
                if (_sortKey === k) _sortDir = (_sortDir === 'asc' ? 'desc' : 'asc');
                else { _sortKey = k; _sortDir = (k === 'input' || k === 'output' || k === 'blended' || k === 'cached' || k === 'discount') ? 'desc' : 'asc'; }
                _renderTable(_lastRows);   // re-sort table only (chart unchanged)
            });
        });
        wrap.querySelectorAll('.price-tbl-model').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-model');
                if (id && typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(id);
            });
        });
    }

    return { init: init, render: render };
})();
