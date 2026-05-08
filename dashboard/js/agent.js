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
                'appworld',
                'visualwebarena',
                'online_mind2web',
                'webshop'
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
                'the_agent_company',
                'screenspot_pro',
                'oscopilot_gaia',
                'visualagentbench'
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

    // Benchmarks selectable in the Compare panel dropdown. The first entry is
    // the default selection.
    var COMPARE_BENCHMARKS = [
        { id: 'swe_bench_verified',   label: 'SWE-bench Verified' },
        { id: 'swe_bench_pro',        label: 'SWE-bench Pro' },
        { id: 'terminal_bench_2',     label: 'Terminal-Bench 2.0' },
        { id: 'osworld_verified',     label: 'OSWorld-Verified' },
        { id: 'gaia',                 label: 'GAIA' },
        { id: 'tau2_bench',           label: 'τ2-Bench' },
        { id: 'bfcl_v4',              label: 'BFCL v4' },
        { id: 'mobile_actions',       label: 'Mobile Actions' },
        { id: 'mobile_agent_bench',   label: 'MobileAgentBench' }
    ];

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

    // Classify a model id into one of three columns used by the Compare panel.
    // Membership is checked against the curated AGENT_PRODUCTS / EDGE_SLMS
    // arrays; everything else is treated as a frontier model.
    function _modelClass(modelId) {
        for (var i = 0; i < AGENT_PRODUCTS.length; i++) {
            if (AGENT_PRODUCTS[i] === modelId) return 'agent-product';
        }
        for (var j = 0; j < EDGE_SLMS.length; j++) {
            if (EDGE_SLMS[j] === modelId) return 'edge-slm';
        }
        return 'frontier';
    }

    // Returns the utility metrics object (size_gb, latency, cost, etc.) for a
    // model id, or {} if none registered. UTILITY_METRICS is filled by Task 17.
    function _utilityFor(modelId) {
        return UTILITY_METRICS[modelId] || {};
    }

    // Build one column body for the Compare panel. Returns a table element
    // with up to 10 rows, or a "No data" placeholder div when rows is empty.
    function _renderCompareColumn(rows, klass, showSize) {
        if (!rows || rows.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'text-xs text-gray-500 italic';
            empty.textContent = 'No data';
            return empty;
        }

        var table = document.createElement('table');
        table.className = 'w-full text-xs';

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');
        theadRow.className = 'text-gray-500';

        var thRank = document.createElement('th');
        thRank.className = 'text-left';
        thRank.textContent = '#';
        theadRow.appendChild(thRank);

        var thModel = document.createElement('th');
        thModel.className = 'text-left';
        thModel.textContent = 'Model';
        theadRow.appendChild(thModel);

        var thScore = document.createElement('th');
        thScore.className = 'text-right';
        thScore.textContent = 'Score';
        theadRow.appendChild(thScore);

        if (showSize === true) {
            var thSize = document.createElement('th');
            thSize.className = 'text-right';
            thSize.textContent = 'Size';
            theadRow.appendChild(thSize);
        }

        thead.appendChild(theadRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var top = rows.slice(0, 10);
        for (var i = 0; i < top.length; i++) {
            var r = top[i];
            var tr = document.createElement('tr');
            tr.className = 'border-t border-gray-800';

            var tdRank = document.createElement('td');
            tdRank.className = 'py-1';
            tdRank.textContent = String(i + 1);
            tr.appendChild(tdRank);

            var tdModel = document.createElement('td');
            tdModel.className = 'py-1';
            var nameSpan = document.createElement('span');
            nameSpan.textContent = _modelDisplayName(r.model_id);
            tdModel.appendChild(nameSpan);
            tr.appendChild(tdModel);

            var tdScore = document.createElement('td');
            tdScore.className = 'py-1 text-right text-gray-100';
            tdScore.textContent = String(r.value);
            tr.appendChild(tdScore);

            if (showSize === true) {
                var tdSize = document.createElement('td');
                tdSize.className = 'py-1 text-right text-gray-400';
                var sizeGb = _utilityFor(r.model_id).size_gb;
                tdSize.textContent = sizeGb ? (sizeGb + ' GB') : '—';
                tr.appendChild(tdSize);
            }

            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        return table;
    }

    // Renders the 3-column compare panel for the selected benchmark.
    // Defaults to the first entry of COMPARE_BENCHMARKS when called with no arg.
    function _renderCompare(benchmarkId) {
        var host = document.getElementById('agent-compare');
        if (!host) return;
        while (host.firstChild) host.removeChild(host.firstChild);

        var bid = benchmarkId || COMPARE_BENCHMARKS[0].id;

        var rows = _scoresFor(bid);
        var frontier = [], product = [], edge = [];
        for (var i = 0; i < rows.length; i++) {
            var k = _modelClass(rows[i].model_id);
            if (k === 'agent-product') product.push(rows[i]);
            else if (k === 'edge-slm') edge.push(rows[i]);
            else frontier.push(rows[i]);
        }
        var sortDesc = function(a, b) { return b.value - a.value; };
        frontier.sort(sortDesc);
        product.sort(sortDesc);
        edge.sort(sortDesc);

        // Heading
        var h = document.createElement('h2');
        h.className = 'text-lg font-semibold text-gray-200 mb-3 mt-6';
        h.textContent = 'Frontier vs Agent-Product vs On-device/Edge';
        host.appendChild(h);

        // Dropdown wrapper
        var ctrlWrap = document.createElement('div');
        ctrlWrap.className = 'mb-3 text-xs text-gray-300';
        ctrlWrap.appendChild(document.createTextNode('Benchmark: '));
        var sel = document.createElement('select');
        sel.id = 'agent-compare-bench';
        sel.className = 'bg-gray-900 border border-gray-700 rounded px-2 py-1 text-gray-200 text-xs';
        for (var c = 0; c < COMPARE_BENCHMARKS.length; c++) {
            var opt = document.createElement('option');
            opt.value = COMPARE_BENCHMARKS[c].id;
            opt.textContent = COMPARE_BENCHMARKS[c].label;
            if (COMPARE_BENCHMARKS[c].id === bid) opt.selected = true;
            sel.appendChild(opt);
        }
        sel.addEventListener('change', function(e) {
            _renderCompare(e.target.value);
        });
        ctrlWrap.appendChild(sel);
        host.appendChild(ctrlWrap);

        // Grid container
        var grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-3 gap-3';
        host.appendChild(grid);

        // Three columns
        var columns = [
            { rows: frontier, heading: 'Frontier (general-purpose)', klass: 'frontier',      showSize: false },
            { rows: product,  heading: 'Agent products',             klass: 'agent-product', showSize: false },
            { rows: edge,     heading: 'On-device / Edge',           klass: 'edge-slm',      showSize: true }
        ];
        for (var col = 0; col < columns.length; col++) {
            var box = document.createElement('div');
            box.className = 'rounded border bg-gray-900 border-gray-800 p-3';
            var subhead = document.createElement('div');
            subhead.className = 'text-xs font-semibold text-gray-200 mb-2';
            subhead.textContent = columns[col].heading;
            box.appendChild(subhead);
            box.appendChild(_renderCompareColumn(columns[col].rows, columns[col].klass, columns[col].showSize));
            grid.appendChild(box);
        }
    }

    function _allLowerBetterSet() {
        var s = {};
        for (var i = 0; i < CATEGORIES.length; i++) {
            var lb = CATEGORIES[i].lower_better;
            if (!lb) continue;
            for (var j = 0; j < lb.length; j++) s[lb[j]] = true;
        }
        return s;
    }

    function _benchmarkMaxes(benchIds) {
        var maxes = {};
        for (var i = 0; i < benchIds.length; i++) {
            var rows = _scoresFor(benchIds[i]);
            var m = 0;
            for (var j = 0; j < rows.length; j++) {
                if (rows[j].value > m) m = rows[j].value;
            }
            maxes[benchIds[i]] = m;
        }
        return maxes;
    }

    function _compositeScores() {
        var ids = _allAgentBenchmarks();
        var lowerSet = _allLowerBetterSet();
        var maxes = _benchmarkMaxes(ids);
        var byModel = {}; // model_id -> { sum, count }
        for (var i = 0; i < ids.length; i++) {
            var rows = _scoresFor(ids[i]);
            var maxV = maxes[ids[i]];
            if (!maxV) continue;
            var lower = !!lowerSet[ids[i]];
            for (var j = 0; j < rows.length; j++) {
                var v = rows[j].value;
                var norm = lower ? (1 - v / maxV) * 100 : (v / maxV) * 100;
                var mid = rows[j].model_id;
                if (!byModel[mid]) byModel[mid] = { sum: 0, count: 0 };
                byModel[mid].sum += norm;
                byModel[mid].count++;
            }
        }
        var arr = [];
        for (var mid in byModel) {
            if (!Object.prototype.hasOwnProperty.call(byModel, mid)) continue;
            if (byModel[mid].count < 3) continue;
            arr.push({
                model_id: mid,
                agent_score: byModel[mid].sum / byModel[mid].count,
                coverage: byModel[mid].count
            });
        }
        arr.sort(function(a, b) {
            if (b.agent_score !== a.agent_score) return b.agent_score - a.agent_score;
            return b.coverage - a.coverage;
        });
        return { rows: arr, totalBenchmarks: ids.length };
    }

    function _vendorOf(modelId) {
        if (!window.App || !App.data || !App.data.models) return '';
        for (var i = 0; i < App.data.models.length; i++) {
            if (App.data.models[i].id === modelId) return App.data.models[i].vendor || '';
        }
        return '';
    }

    function _classLabel(klass) {
        if (klass === 'agent-product') return 'Agent-Product';
        if (klass === 'edge-slm') return 'Edge-SLM';
        return 'Frontier';
    }

    function _renderLeaderboard() {
        var host = document.getElementById('agent-leaderboard');
        if (!host) return;
        while (host.firstChild) host.removeChild(host.firstChild);

        var data = _compositeScores();
        var rows = data.rows.slice(0, 25);

        var heading = document.createElement('h2');
        heading.className = 'text-lg font-semibold text-gray-200 mb-3 mt-6';
        heading.textContent = 'Composite Agent Score (Top 25)';
        host.appendChild(heading);

        var disc = document.createElement('div');
        disc.className = 'text-xs text-gray-400 mb-2';
        disc.textContent = 'Coverage threshold: ≥ 3 agentic benchmarks. Total tracked: ' + data.totalBenchmarks +
                           '. Safety ASR / jailbreak rows inverted (lower-better).';
        host.appendChild(disc);

        var tableWrap = document.createElement('div');
        tableWrap.className = 'overflow-x-auto rounded border border-gray-800';
        host.appendChild(tableWrap);

        var table = document.createElement('table');
        table.className = 'w-full text-xs';
        tableWrap.appendChild(table);

        var thead = document.createElement('thead');
        table.appendChild(thead);
        var trh = document.createElement('tr');
        trh.className = 'text-gray-500 bg-gray-900/50';
        thead.appendChild(trh);
        var headers = [
            { text: 'Rank', cls: 'text-left px-2 py-1' },
            { text: 'Model', cls: 'text-left px-2 py-1' },
            { text: 'Vendor', cls: 'text-left px-2 py-1' },
            { text: 'Class', cls: 'text-left px-2 py-1' },
            { text: 'Agent Score', cls: 'text-right px-2 py-1' },
            { text: 'Coverage', cls: 'text-right px-2 py-1' }
        ];
        for (var h = 0; h < headers.length; h++) {
            var th = document.createElement('th');
            th.className = headers[h].cls;
            th.textContent = headers[h].text;
            trh.appendChild(th);
        }

        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            var klass = _modelClass(r.model_id);
            var tr = document.createElement('tr');
            tr.className = 'border-t border-gray-800 hover:bg-gray-900/40 cursor-pointer';
            tr.dataset.model = r.model_id;
            tr.addEventListener('click', function() {
                if (window.Modal && Modal.showModel) Modal.showModel(this.dataset.model);
            });

            var cells = [
                { text: String(i + 1), cls: 'px-2 py-1 text-gray-400' },
                { text: _modelDisplayName(r.model_id), cls: 'px-2 py-1 text-gray-100' },
                { text: _vendorOf(r.model_id), cls: 'px-2 py-1 text-gray-300' },
                { text: _classLabel(klass), cls: 'px-2 py-1 text-gray-300' },
                { text: r.agent_score.toFixed(1), cls: 'px-2 py-1 text-right text-blue-400 font-semibold' },
                { text: r.coverage + '/' + data.totalBenchmarks, cls: 'px-2 py-1 text-right text-gray-400' }
            ];
            for (var c = 0; c < cells.length; c++) {
                var td = document.createElement('td');
                td.className = cells[c].cls;
                td.textContent = cells[c].text;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        if (!rows.length) {
            var empty = document.createElement('div');
            empty.className = 'text-xs text-gray-500 italic p-2';
            empty.textContent = 'No models meet the coverage threshold yet.';
            host.appendChild(empty);
        }
    }

    // Lazy-load edge model utility metrics (size_gb, ttft_ms, etc.) before rendering.
    // The fetch path mirrors how App.loadData resolves base — the dashboard symlinks
    // /data → ../data/export, so 'data/edge_models_utility.json' resolves correctly
    // when served from /dashboard/.
    function _loadUtility(cb) {
        if (Object.keys(UTILITY_METRICS).length) { cb(); return; }
        var base = (window.location.pathname.indexOf('/dashboard/') !== -1) ? '../data' : 'data';
        fetch(base + '/edge_models_utility.json')
            .then(function(r) { return r.ok ? r.json() : null; })
            .then(function(d) {
                UTILITY_METRICS = (d && d.models) || {};
                cb();
            })
            .catch(function() { cb(); }); // Fail-open: leave UTILITY_METRICS empty
    }

    function render() {
        _loadUtility(function() {
            _bootValidate();
            _renderSOTAWatch();
            _renderCategories();
            _renderCompare();
            // 8 graphical widgets — each renders independently, one failure
            // doesn't break the others. See dashboard/js/agent-charts.js.
            if (window.AgentCharts && AgentCharts.renderAll) {
                try { AgentCharts.renderAll(); }
                catch (e) { if (window.console) console.warn('[Agent] charts render failed:', e); }
            }
            _renderLeaderboard();
            // Widget 7 — fingerprint mini-radars hooked into leaderboard rows
            // after they've been rendered.
            if (window.AgentCharts && AgentCharts.renderFingerprintsInLeaderboard) {
                try { AgentCharts.renderFingerprintsInLeaderboard(); }
                catch (e) { if (window.console) console.warn('[Agent] fingerprint hook failed:', e); }
            }
        });
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
