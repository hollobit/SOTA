/**
 * Agent tab — agentic AI benchmarks, evaluation results, SOTA models.
 * Renders 4 sections: SOTA Watch tiles, 10 category cards, Frontier-vs-Agent-vs-Edge
 * compare panel, and composite leaderboard.
 *
 * Data source: App.data.scores + App.data.benchmarks + App.data.enrichment.
 * Hardcoded benchmark-id arrays per category (no regex) — see CATEGORIES below.
 *
 * Reference patterns: dashboard/js/medical-ai.js, dashboard/js/ai4s.js.
 */
var Agent = (function() {

    // 10 agent benchmark categories in display order.
    // Each entry has key, icon, label, and the explicit set of benchmark IDs
    // that belong to that category. No regex — adding a benchmark requires
    // listing it here so the UI grouping stays deterministic.
    var CATEGORIES = [
        {
            key: 'coding',
            icon: '💻',
            label: 'Coding Agents',
            benchmarks: [
                'swe_bench_verified',
                'swe_bench_pro',
                'swe_bench_verified_mini',
                'swe_bench_multilingual',
                'swe_bench_multimodal',
                'swe_rebench',
                'multi_swe_bench',
                'swe_polybench',
                'expert_swe',
                'aider_polyglot',
                'swe_lancer',
                'mle_bench',
                'usaco'
            ]
        },
        {
            key: 'web-browse',
            icon: '🌐',
            label: 'Web & Browsing',
            benchmarks: [
                'browsecomp',
                'browsecomp_plus',
                'browsecomp_agent_swarm',
                'gaia',
                'gaia2',
                'webarena',
                'appworld'
            ]
        },
        {
            key: 'os-computer',
            icon: '🖥️',
            label: 'OS / Computer Use',
            benchmarks: [
                'osworld',
                'osworld_verified',
                'windows_agent_arena',
                'the_agent_company'
            ]
        },
        {
            key: 'tool-use',
            icon: '🔧',
            label: 'Tool Use & Function Calling',
            benchmarks: [
                'bfcl',
                'bfcl_v3',
                'bfcl_v3_live',
                'bfcl_v3_multi_turn',
                'bfcl_v4',
                'bfcl_v4_web_search'
            ]
        },
        {
            key: 'mcp',
            icon: '🔌',
            label: 'MCP (Model Context Protocol)',
            benchmarks: [
                'mcp_bench',
                'mcp_atlas',
                'mcpatlas_public',
                'mcpmark',
                'livemcpbench'
            ]
        },
        {
            key: 'customer-service',
            icon: '💼',
            label: 'Customer Service / Multi-turn',
            benchmarks: [
                'tau_bench',
                'tau2_bench',
                'tau2_airline',
                'tau2_retail',
                'tau2_telecom',
                'tau3_bench',
                'tau3_telecom'
            ]
        },
        {
            key: 'domain',
            icon: '🧪',
            label: 'Domain-Specific Agents',
            crossListed: ['medical-ai', 'ai4s'],
            benchmarks: [
                'finance_agent',
                'scienceagentbench',
                'agentclinic_medqa',
                'agentclinic_nejm',
                'medagentbench',
                'medagentsbench'
            ]
        },
        {
            key: 'safety',
            icon: '🛡️',
            label: 'Agent Safety & Security',
            lower_better: [
                'agentdojo_targeted_asr',
                'injecagent',
                'browserart',
                'anthropic_shade_browser_asr_attempts',
                'anthropic_shade_browser_asr_scenarios',
                'anthropic_shade_browser_asr_with_safeguards',
                'agent_red_teaming',
                'agentsmith_inf'
            ],
            benchmarks: [
                'agentdojo_targeted_asr',
                'agentdojo_utility',
                'injecagent',
                'browserart',
                'anthropic_shade_browser_asr_attempts',
                'anthropic_shade_browser_asr_scenarios',
                'anthropic_shade_browser_asr_with_safeguards',
                'agent_red_teaming',
                'agentsmith_inf'
            ]
        },
        {
            key: 'general',
            icon: '🚀',
            label: 'General / Composite',
            benchmarks: [
                'apex_agents',
                'apex_agents_hard',
                'terminal_bench_2',
                'terminal_bench_hard',
                'hal_overall_accuracy_at_fixed_cost'
            ]
        },
        {
            key: 'edge',
            icon: '📱',
            label: 'On-device / Edge Agents',
            utility_emphasis: true,
            benchmarks: [
                'mobile_actions',
                'healthslm_bench',
                'mobile_agent_bench',
                'mobilebench_v2',
                'mobilebench_xiaomi',
                'mlperf_mobile_llm',
                'mlperf_inference_edge_v5_1',
                'mlperf_tiny_v1_2',
                'tinyml_energy_v1',
                'function_gemma_calling'
            ]
        }
    ];

    // SOTA Watch tiles — 4 headline benchmarks shown at the top of the tab.
    var SOTA_WATCH = [
        { benchmark: 'swe_bench_verified', label: 'Top Coder', icon: '💻' },
        { benchmark: 'browsecomp', label: 'Top Web Agent', icon: '🌐' },
        { benchmark: 'osworld_verified', label: 'Top OS Agent', icon: '🖥️' },
        { benchmark: 'agentdojo_utility', label: 'Best Defense', icon: '🛡️' }
    ];

    // Curated list of 10 production agent products for the compare panel.
    var AGENT_PRODUCTS = [
        'anthropic/claude-code',
        'openai/codex-cli',
        'cursor/composer',
        'replit/agent',
        'cognition/devin',
        'manus-ai/manus',
        'anthropic/computer-use',
        'google/mariner',
        'openai/operator',
        'anthropic/claude-cowork'
    ];

    // Curated list of 9 on-device / edge SLMs for the compare panel.
    var EDGE_SLMS = [
        'apple/foundation-3b',
        'apple/foundation-private-cloud',
        'microsoft/phi-4-mini-instruct',
        'microsoft/phi-4',
        'google/gemma-3-270m',
        'google/gemma-3n',
        'google/function-gemma',
        'meta/llama-3.2-1b-instruct',
        'meta/llama-3.2-3b-instruct'
    ];

    // Utility-vs-cost / latency metrics map. Filled by _loadUtility (Task 17).
    var UTILITY_METRICS = {};

    // Returns the flat union of every category's benchmark IDs, deduped.
    function _allAgentBenchmarks() {
        var seen = {};
        var out = [];
        for (var i = 0; i < CATEGORIES.length; i++) {
            var ids = CATEGORIES[i].benchmarks || [];
            for (var j = 0; j < ids.length; j++) {
                var id = ids[j];
                if (!seen[id]) {
                    seen[id] = true;
                    out.push(id);
                }
            }
        }
        return out;
    }

    // Boot-time validation: warn (not throw) if any expected benchmark id is
    // missing from App.data.benchmarks. UI rows for missing ids will be hidden
    // by the per-section renderers in later tasks.
    function _bootValidate() {
        if (!(window.App && App.data && App.data.benchmarks)) {
            return;
        }
        var loaded = App.data.benchmarks;
        var present = {};
        if (Array.isArray(loaded)) {
            for (var i = 0; i < loaded.length; i++) {
                var b = loaded[i];
                if (b && b.id) present[b.id] = true;
            }
        } else {
            for (var k in loaded) {
                if (Object.prototype.hasOwnProperty.call(loaded, k)) {
                    present[k] = true;
                }
            }
        }
        var ids = _allAgentBenchmarks();
        var missing = [];
        for (var n = 0; n < ids.length; n++) {
            if (!present[ids[n]]) missing.push(ids[n]);
        }
        if (missing.length) {
            console.warn('[Agent] missing benchmarks (UI will hide these rows):', missing);
        }
    }

    // Helper used by the placeholder render() — creates a styled div with
    // the given text content. Real renderers in Tasks 4-7 will replace this.
    function _placeholder(host, text) {
        if (!host) return;
        while (host.firstChild) host.removeChild(host.firstChild);
        var div = document.createElement('div');
        div.className = 'text-meta';
        div.textContent = text;
        host.appendChild(div);
    }

    // Defensive lookup: returns all score rows for the given benchmark_id.
    // Returns [] if App data is not yet loaded.
    function _scoresFor(benchmarkId) {
        if (!(window.App && App.data && App.data.scores)) return [];
        var scores = App.data.scores;
        if (!scores || !scores.length) return [];
        var out = [];
        for (var i = 0; i < scores.length; i++) {
            var s = scores[i];
            if (s && s.benchmark_id === benchmarkId) out.push(s);
        }
        return out;
    }

    // Returns the top-1 score row for benchmarkId. lowerBetter inverts the sort.
    // Returns null if no scores match.
    function _topModel(benchmarkId, lowerBetter) {
        var rows = _scoresFor(benchmarkId);
        if (!rows.length) return null;
        rows.sort(function(a, b) {
            var av = (a && typeof a.value === 'number') ? a.value : -Infinity;
            var bv = (b && typeof b.value === 'number') ? b.value : -Infinity;
            return lowerBetter ? (av - bv) : (bv - av);
        });
        return rows[0];
    }

    // Resolve a model id → display name; falls back to the id if unknown.
    function _modelDisplayName(modelId) {
        if (!modelId) return '';
        if (window.App && App.data && App.data.models) {
            var models = App.data.models;
            if (Array.isArray(models)) {
                for (var i = 0; i < models.length; i++) {
                    var m = models[i];
                    if (m && m.id === modelId) {
                        if (m.name && String(m.name).length) return m.name;
                        return modelId;
                    }
                }
            } else if (typeof models === 'object') {
                var hit = models[modelId];
                if (hit && hit.name) return hit.name;
            }
        }
        return modelId;
    }

    // Resolve a benchmark id → display name; falls back to the id if unknown.
    function _benchmarkName(benchmarkId) {
        if (!benchmarkId) return '';
        if (window.App && App.data && App.data.benchmarks) {
            var benchmarks = App.data.benchmarks;
            if (Array.isArray(benchmarks)) {
                for (var i = 0; i < benchmarks.length; i++) {
                    var b = benchmarks[i];
                    if (b && b.id === benchmarkId) {
                        if (b.name && String(b.name).length) return b.name;
                        return benchmarkId;
                    }
                }
            } else if (typeof benchmarks === 'object') {
                var hit = benchmarks[benchmarkId];
                if (hit && hit.name) return hit.name;
            }
        }
        return benchmarkId;
    }

    // Defensive HTML escape — kept available for future use even though the
    // current renderers rely on textContent (which auto-escapes).
    function _escape(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Compute aggregate stats for a category card:
    //   { benchCount, modelCount, totalScores, top3 }
    // top3 is sorted descending by per-model best normalized score (0..100).
    // Normalization is per-benchmark: value/maxV*100, or (1 - v/maxV)*100 when
    // the benchmark id is in cat.lower_better. Benchmarks with maxV === 0 are
    // skipped to avoid divide-by-zero.
    function _categoryStats(cat) {
        var lowerBetterSet = {};
        if (cat && cat.lower_better && cat.lower_better.length) {
            for (var i = 0; i < cat.lower_better.length; i++) {
                lowerBetterSet[cat.lower_better[i]] = true;
            }
        }

        var ids = (cat && cat.benchmarks) ? cat.benchmarks : [];
        var modelSet = {};
        var totalScores = 0;
        var modelBest = {}; // model_id -> { model_id, norm, raw, bid }

        for (var b = 0; b < ids.length; b++) {
            var bid = ids[b];
            var rows = _scoresFor(bid);
            if (!rows.length) continue;

            // Compute maxV across rows (numeric values only).
            var maxV = 0;
            for (var r = 0; r < rows.length; r++) {
                var rv = rows[r];
                if (rv && typeof rv.value === 'number' && rv.value > maxV) {
                    maxV = rv.value;
                }
            }
            if (maxV === 0) {
                // Still count rows toward totals + model coverage even if
                // we can't normalize (avoids divide-by-zero).
                for (var c = 0; c < rows.length; c++) {
                    var rc = rows[c];
                    totalScores++;
                    if (rc && rc.model_id) modelSet[rc.model_id] = true;
                }
                continue;
            }

            for (var k = 0; k < rows.length; k++) {
                var row = rows[k];
                totalScores++;
                if (!row || row.model_id == null) continue;
                modelSet[row.model_id] = true;
                if (typeof row.value !== 'number') continue;

                var norm;
                if (lowerBetterSet[bid]) {
                    norm = (1 - row.value / maxV) * 100;
                } else {
                    norm = (row.value / maxV) * 100;
                }

                var prev = modelBest[row.model_id];
                if (!prev || norm > prev.norm) {
                    modelBest[row.model_id] = {
                        model_id: row.model_id,
                        norm: norm,
                        raw: row.value,
                        bid: bid
                    };
                }
            }
        }

        var modelCount = 0;
        for (var mk in modelSet) {
            if (Object.prototype.hasOwnProperty.call(modelSet, mk)) modelCount++;
        }

        var arr = [];
        for (var mb in modelBest) {
            if (Object.prototype.hasOwnProperty.call(modelBest, mb)) {
                arr.push(modelBest[mb]);
            }
        }
        arr.sort(function(a, b) { return b.norm - a.norm; });
        var top3 = arr.slice(0, 3);

        return {
            benchCount: ids.length,
            modelCount: modelCount,
            totalScores: totalScores,
            top3: top3
        };
    }

    // Build a single category card element. The 10th category (utility_emphasis)
    // spans the full row width via md:col-span-3.
    function _renderCategoryCard(cat) {
        var stats = _categoryStats(cat);

        var card = document.createElement('div');
        var cls = 'rounded border bg-gray-900 border-gray-800 hover:border-blue-600 p-4 cursor-pointer transition';
        if (cat.utility_emphasis) {
            cls = 'col-span-1 md:col-span-3 ' + cls;
        }
        card.className = cls;
        card.dataset.cat = cat.key;
        card.addEventListener('click', function() {
            console.log('[Agent] category click:', this.dataset.cat);
        });

        // Heading row: icon + label + optional crossListed badge.
        var head = document.createElement('div');
        head.className = 'flex items-baseline gap-2 flex-wrap';

        var iconEl = document.createElement('span');
        iconEl.className = 'text-xl';
        iconEl.textContent = cat.icon;
        head.appendChild(iconEl);

        var labelEl = document.createElement('span');
        labelEl.className = 'text-base font-semibold text-gray-100';
        labelEl.textContent = cat.label;
        head.appendChild(labelEl);

        if (cat.crossListed && cat.crossListed.length) {
            var badge = document.createElement('span');
            badge.className = 'text-xs text-amber-300 bg-amber-900/30 rounded px-1.5 py-0.5';
            badge.textContent = 'Also in ' + cat.crossListed.join(' / ');
            head.appendChild(badge);
        }
        card.appendChild(head);

        // Metric row.
        var metric = document.createElement('div');
        metric.className = 'text-xs text-gray-400 mt-1';
        metric.textContent = stats.benchCount + ' benchmarks · ' +
            stats.modelCount + ' models · ' +
            stats.totalScores + ' scores';
        card.appendChild(metric);

        // Optional lower-better microtext for safety category.
        if (cat.lower_better && cat.lower_better.length) {
            var lb = document.createElement('div');
            lb.className = 'text-xs text-gray-500 mt-0.5';
            lb.textContent = '↓ lower-better for ASR/jailbreak rows';
            card.appendChild(lb);
        }

        // Top-3 list.
        var ol = document.createElement('ol');
        ol.className = 'mt-2 list-decimal pl-5 text-xs text-gray-300 space-y-0.5';

        if (!stats.top3.length) {
            var emptyLi = document.createElement('li');
            emptyLi.className = 'text-gray-500';
            emptyLi.textContent = 'No scores yet.';
            ol.appendChild(emptyLi);
        } else {
            var top3 = stats.top3.slice(0, 3);
            for (var t = 0; t < top3.length; t++) {
                var entry = top3[t];
                var li = document.createElement('li');

                var mainSpan = document.createElement('span');
                mainSpan.textContent = _modelDisplayName(entry.model_id);
                li.appendChild(mainSpan);

                var subSpan = document.createElement('span');
                subSpan.className = 'text-gray-500 ml-1';
                subSpan.textContent = String(entry.raw) + ' (' + _benchmarkName(entry.bid) + ')';
                li.appendChild(subSpan);

                ol.appendChild(li);
            }
        }
        card.appendChild(ol);

        return card;
    }

    // Renders the 10 category cards into #agent-categories.
    function _renderCategories() {
        var host = document.getElementById('agent-categories');
        if (!host) return;
        while (host.firstChild) host.removeChild(host.firstChild);

        var heading = document.createElement('h2');
        heading.className = 'text-lg font-semibold text-gray-200 mb-3 mt-6';
        heading.textContent = 'Categories';
        host.appendChild(heading);

        var grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-3 gap-3';
        host.appendChild(grid);

        for (var i = 0; i < CATEGORIES.length; i++) {
            grid.appendChild(_renderCategoryCard(CATEGORIES[i]));
        }
    }

    // Renders the 4 SOTA Watch tiles into #agent-sota-watch.
    // Each tile shows: icon+label (top), top model name, top score, benchmark name.
    // Empty fallback (amber border) when a benchmark has 0 scores in the DB.
    function _renderSOTAWatch() {
        var host = document.getElementById('agent-sota-watch');
        if (!host) return;
        while (host.firstChild) host.removeChild(host.firstChild);

        var heading = document.createElement('h2');
        heading.className = 'text-section mb-3';
        heading.textContent = 'SOTA Watch';
        host.appendChild(heading);

        var grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3';
        host.appendChild(grid);

        for (var i = 0; i < SOTA_WATCH.length; i++) {
            var w = SOTA_WATCH[i];
            var top = _topModel(w.benchmark, false);
            var benchName = _benchmarkName(w.benchmark);

            if (!top) {
                // Empty-state tile — graceful fallback, no JS error.
                var emptyTile = document.createElement('div');
                emptyTile.className = 'bg-gray-900 border border-amber-700 rounded p-4';

                var emptyHead = document.createElement('div');
                emptyHead.className = 'text-xs text-amber-300';
                emptyHead.textContent = w.icon + ' ' + w.label;
                emptyTile.appendChild(emptyHead);

                var emptyDash = document.createElement('div');
                emptyDash.className = 'text-2xl mt-2 text-gray-500';
                emptyDash.textContent = '—';
                emptyTile.appendChild(emptyDash);

                var emptyMsg = document.createElement('div');
                emptyMsg.className = 'text-xs text-gray-500 mt-1';
                emptyMsg.textContent = 'No scores for ' + benchName;
                emptyTile.appendChild(emptyMsg);

                grid.appendChild(emptyTile);
                continue;
            }

            var tile = document.createElement('div');
            tile.className = 'bg-gray-900 border border-gray-800 rounded p-4 hover:border-blue-600 cursor-pointer transition';
            tile.dataset.bench = w.benchmark;
            tile.addEventListener('click', function() {
                if (window.Modal && Modal.showBenchmark) {
                    Modal.showBenchmark(this.dataset.bench);
                }
            });

            var head = document.createElement('div');
            head.className = 'text-xs text-gray-300';
            head.textContent = w.icon + ' ' + w.label;
            tile.appendChild(head);

            var modelEl = document.createElement('div');
            modelEl.className = 'text-base font-semibold mt-1 text-gray-100';
            modelEl.textContent = _modelDisplayName(top.model_id);
            tile.appendChild(modelEl);

            var valueEl = document.createElement('div');
            valueEl.className = 'text-2xl font-bold mt-1 text-blue-400';
            valueEl.textContent = top.value;
            tile.appendChild(valueEl);

            var benchEl = document.createElement('div');
            benchEl.className = 'text-xs text-gray-500 mt-1';
            benchEl.textContent = benchName;
            tile.appendChild(benchEl);

            grid.appendChild(tile);
        }
    }

    function render() {
        _bootValidate();
        _renderSOTAWatch();
        _renderCategories();
        // Real renderers added in Tasks 6-7
        _placeholder(document.getElementById('agent-compare'), '[Compare — Task 6]');
        _placeholder(document.getElementById('agent-leaderboard'), '[Leaderboard — Task 7]');
    }

    return {
        render: render,
        _CATEGORIES: CATEGORIES,
        _SOTA_WATCH: SOTA_WATCH,
        _AGENT_PRODUCTS: AGENT_PRODUCTS,
        _EDGE_SLMS: EDGE_SLMS,
        _allAgentBenchmarks: _allAgentBenchmarks
    };
})();
