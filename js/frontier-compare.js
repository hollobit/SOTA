/**
 * Frontier Compare tab: heatmap + radar + bar chart
 * comparing latest frontier models on core benchmarks from PDF System Cards.
 */
var FrontierCompare = {
    // Core benchmarks appearing in 2+ system cards or frontier launch comparisons,
    // grouped by category. Ordered roughly by frequency of cross-vendor citation
    // so the leftmost columns in the heatmap are the most-compared benchmarks.
    CORE_BENCHMARKS: {
        reasoning: [
            'gpqa_diamond', 'hle', 'mmlu_pro', 'mmlu', 'mmlu_redux', 'mmmlu',
            'arc_agi_2', 'arc_agi_3', 'frontiermath', 'frontier_science', 'gdpval', 'officeqa_pro',
            'simpleqa_verified', 'chinese_simpleqa', 'facts_parametric', 'triviaqa',
            'longbench_v2', 'mrcr', 'corpusqa_1m', 'superqpga',
            'healthbench', 'healthbench_hard', 'healthbench_consensus', 'healthbench_professional',
            'virology_mcq', 'biochem_reward4', 'c_eval', 'cmmlu', 'agieval'
        ],
        coding: [
            'swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual',
            'terminal_bench_2', 'livecodebench', 'livecodebench_v6', 'swe_rebench',
            'gdpval_aa', 'nl2repo', 'expert_swe',
            'codeforces_rating', 'codeforces_elo', 'humaneval', 'humaneval_plus', 'bigcodebench',
            'mbpp', 'mbpp_plus', 'cruxeval', 'repobench'
        ],
        math: ['aime_2025', 'aime_2026', 'aime_24', 'aime_2024', 'hmmt_2025', 'hmmt_2026', 'imo_answerbench', 'amc_23', 'usamo', 'gsm8k', 'math', 'math_500'],
        agent: [
            'browsecomp', 'osworld_verified', 'tau2_bench', 'tau3_bench',
            'mcp_atlas', 'mcpatlas_public', 'mcpmark', 'webarena',
            'deepsearchqa', 'vending_bench_2', 'toolathlon',
            'android_world', 'qwen_web_bench', 'skills_bench', 'finance_agent',
            'apex_agents_hard', 'apex_shortlist',
            'gaia2', 'claw_eval'
        ],
        cybersecurity: [
            'cybench', 'openai_ctf_professional', 'cybergym',
            'evmbench_exploit', 'evmbench_detect', 'cvebench',
            'firefox_147', 'cyber_range', 'cyscenariobench', 'tlo_cyber_range',
            'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion',
            'uk_aisi_narrow_cyber'
        ],
        cyber_defense: ['first_person_fairness', 'prompt_injection', 'harmbench', 'strongreject', 'airbench'],
        multimodal: ['mmmu_pro', 'mathvision', 'video_mmmu', 'video_mme', 'longvideobench', 'screenspot_pro', 'charxiv_reasoning', 'realworldqa', 'vlms_are_blind', 'docvqa', 'chartqa', 'vqav2', 'ai2d', 'mmbench_en']
    },

    // Top frontier models to compare. Ordered by frontier tier and recency —
    // the most recently-announced, most-tracked models appear first so they
    // land at the top of the heatmap by default (before sort).
    FRONTIER_MODELS: [
        // 2026-04 frontier launches (50+ scores each)
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
        'moonshot/kimi-k2.6',
        'alibaba/qwen3.6-27b',
        'deepseek/deepseek-v4-pro-max',
        'deepseek/deepseek-v4-pro',
        'deepseek/deepseek-v4-flash',

        // Existing frontier leaders
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
        'xai/grok-4.20',
        'meta/muse-spark',

        // Open-weight frontier
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.5',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'alibaba/qwen3.6-plus',
        'alibaba/qwen3.6-35b-a3b',
        'minimax/m2.7',
        'baidu/ernie-5.0',
        // Mistral specialist line (2025-09 to 2025-12 open-weight)
        'mistral/mistral-large-3',
        'mistral/devstral-2',
        'mistral/devstral-small-2',
        'mistral/magistral-small-1.2',
        'mistral/mistral-small-4',
        'mistral/pixtral-large',

        // Regional / secondary
        'lg/exaone-4.5-33b',
        'skt/ax-k1',
        'upstage/solar-open-100b',
        'upstage/solar-pro-3',
        'google/gemma-4-31b',
        'mimo/mimo-v2-pro',
        'lg/k-exaone-236b',
        'kt/midm-k2.5-pro',

        // Korean sovereign foundation models — 독자 AI 파운데이션 모델 경쟁 (2024-2026)
        'naver/hyperclova-x-think-32b',
        'naver/hyperclova-x-think-14b',
        'kakao/kanana-2-30b-a3b-thinking',
        'kakao/kanana-1.5-8b',
        'ncsoft/varco-vision-2.0-14b',
        'trillionlabs/tri-21b',
        'motif/motif-2-12.7b-reasoning',
        'lg/exaone-4.0-32b',
        'skt/ax-4.0',
        'upstage/solar-pro-2',

        // Apr 2026 frontier sweep — new flagships discovered this week
        'tencent/hy3-preview',
        'xiaomi/mimo-v2.5-pro',
        'inclusionai/ling-2.6-1t',
        'inclusionai/ling-2.6-flash'
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],

    // ─── Performance Suites (multi-table leaderboard, full coverage) ───
    // 8 thematic groupings, each with its own table. Surfaces the FULL set
    // of frontier-scored benchmarks (vs Heatmap's hand-curated CORE_BENCHMARKS).
    PERF_SUITES: [
        {
            id: 'reasoning',
            label: '🧠 Reasoning & General',
            note: 'GPQA Diamond · HLE · MMLU · MMLU-Pro · MMLU-Redux · SimpleQA Verified · ARC-AGI-1/2/3 · IFBench · LongBench v2 · MRCR · HealthBench 4-suite · LiveBench · Arena Hard v2 · SuperGPQA · GDPval · OfficeQA Pro · Virology MCQ · DNA Sequence Design · Protein Binding · TriviaQA · SimpleBench · TroubleshootingBench · Bio Tacit Knowledge · Biochem Reward@4',
            benchmarks: [
                'gpqa_diamond', 'hle', 'mmlu', 'mmlu_pro', 'mmlu_redux',
                'simpleqa_verified', 'arc_agi_1', 'arc_agi_2', 'arc_agi_3',
                'ifbench', 'longbench_v2', 'mrcr',
                'healthbench', 'healthbench_hard', 'healthbench_consensus', 'healthbench_professional',
                'livebench', 'arena_hard_v2', 'supergpqa', 'superqpga',
                'gdpval', 'officeqa_pro',
                'virology_mcq', 'dna_design', 'protein_binding', 'triviaqa', 'simplebench',
                'troubleshootingbench', 'tacit_knowledge_bio', 'biochem_reward4'
            ]
        },
        {
            id: 'math',
            label: '🧮 Math & Olympiad',
            note: 'AIME 2024-26 · HMMT 2025/26 · MATH · MATH-500 · GSM8K · IMO-AnswerBench · USAMO · OTIS-AIME 2025 · MathArena Apex · FrontierMath',
            benchmarks: [
                'aime_2024', 'aime_2025', 'aime_2026', 'aime_24',
                'hmmt_2025', 'hmmt_2026',
                'math', 'math_500', 'gsm8k',
                'imo_answerbench', 'usamo',
                'otis_aime_2025', 'matharena_apex', 'frontiermath'
            ]
        },
        {
            id: 'coding',
            label: '💻 Coding & Software Engineering',
            note: 'SWE-Verified/Pro/Multilingual/rebench · LiveCodeBench (+ v6 + Elo) · HumanEval · MBPP · BigCodeBench · Aider Polyglot · Codeforces Rating/ELO · GDPval-AA · SciCode · WebDev Arena · Monorepo-Bench · Expert-SWE · GSO · MLE-Bench · WeirdML v2 · PaperBench · NL2Repo · Vibe Code Bench',
            benchmarks: [
                'swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual', 'swe_rebench',
                'livecodebench', 'livecodebench_v6', 'livecodebench_elo',
                'humaneval', 'mbpp', 'bigcodebench',
                'aider_polyglot', 'codeforces_rating', 'codeforces_elo',
                'gdpval_aa', 'scicode',
                'webdev_arena', 'monorepo_bench', 'expert_swe', 'gso',
                'mle_bench', 'weirdml_v2', 'paperbench', 'nl2repo', 'vibe_code_bench',
                'repobench'
            ]
        },
        {
            id: 'multimodal',
            label: '🖼️ Multimodal',
            note: 'MMMU-Pro · MathVision · CharXiv Reasoning · Video-MMMU · Video-MME · LongVideoBench · ScreenSpot-Pro · OmniDocBench · DocVQA · ChartQA · AI2D · MathVista · OCRBench · MMBench EN · RealWorldQA · VLMs-Are-Blind · VPCT · K-MMBench · VQAv2',
            benchmarks: [
                'mmmu_pro', 'mathvision', 'charxiv_reasoning',
                'video_mmmu', 'video_mme', 'longvideobench',
                'screenspot_pro', 'omnidocbench',
                'docvqa', 'chartqa', 'ai2d', 'mathvista', 'mathvista_mini',
                'ocrbench', 'mmbench_en', 'realworldqa',
                'vlms_are_blind', 'vpct', 'k_mmbench', 'vqav2',
                'mmmu'
            ]
        },
        {
            id: 'multilingual',
            label: '🌐 Multilingual',
            note: 'MMMLU · KMMLU · HAE-RAE · KOBEST · KoMT-Bench · C-Eval · CMMLU · Chinese-SimpleQA · Global PIQA · TMMLU+ · IndoMMLU · QIMMA · SEA-HELM · KMMMU',
            benchmarks: [
                'mmmlu', 'kmmlu', 'haerae', 'kobest', 'komt_bench',
                'c_eval', 'cmmlu', 'chinese_simpleqa', 'global_piqa',
                'tmmlu_plus', 'indo_mmlu', 'qimma', 'sea_helm', 'kmmmu'
            ]
        },
        {
            id: 'agent',
            label: '🤖 Agent (Tool · Web · Computer)',
            note: 'Terminal-Bench 2 · τ-bench / τ²-bench / τ³-bench · BrowseComp · OSWorld-Verified · MCP-Atlas (+ Public) · MCPMark · DeepSearchQA · Vending-Bench 2 · WebArena · Toolathlon · GAIA · GAIA-2 · METR Time Horizons · Apex Hard / Shortlist · Skills-Bench · ARC-AGI-3 · Claw-Eval · Finance-Agent · QwenWebBench · AndroidWorld',
            benchmarks: [
                'terminal_bench_2', 'tau_bench', 'tau2_bench', 'tau3_bench',
                'browsecomp', 'osworld_verified',
                'mcp_atlas', 'mcpatlas_public', 'mcpmark',
                'deepsearchqa', 'vending_bench_2',
                'webarena', 'toolathlon',
                'gaia', 'gaia2', 'metr_time_horizons',
                'apex_agents_hard', 'apex_shortlist', 'skills_bench',
                'arc_agi_3', 'claw_eval',
                'finance_agent', 'qwen_web_bench', 'android_world',
                'bfcl', 'bfcl_v3', 'bfcl_v4'
            ]
        },
        {
            id: 'cyber-attack',
            label: '🛡️ Cyber Attack / CTF',
            note: 'CyberGym · Cybench · CVE-Bench · EVMbench Detect/Exploit · The Last Ones (TLO) · OpenAI CTF Pro · Firefox 147 · Cyber Range · CyScenarioBench · UK AISI Narrow · FORTRESS · Irregular Atomic 3-suite · AIRTBench · AIxCC · MHBench',
            benchmarks: [
                'cybergym', 'cybench', 'cvebench',
                'evmbench_detect', 'evmbench_exploit',
                'tlo_cyber_range', 'openai_ctf_professional',
                'firefox_147', 'cyber_range', 'cyscenariobench',
                'uk_aisi_narrow_cyber', 'fortress',
                'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion',
                'airtbench', 'aixcc_synth_vuln', 'mhbench'
            ]
        },
        {
            id: 'cyber-defense',
            label: '🔒 Cyber Defense / Safety',
            note: 'EVMbench Patch · Apollo 5-suite (Sabotage · Lying · Eval-Awareness · Strategic Deception · Sandbagging) · Dynamic 3-suite (Self-Harm · Mental Health · Emotional Reliance) · CoT Controllability / Monitorability · Prompt Injection · First-Person Fairness · DFIR-Metric · ZeroDayBench · SecRepoBench',
            benchmarks: [
                'evmbench_patch',
                'apollo_sabotage_mean', 'apollo_impossible_task_lying', 'apollo_eval_awareness',
                'apollo_strategic_deception', 'apollo_sandbagging_qa',
                'dynamic_self_harm_adversarial', 'dynamic_mental_health', 'dynamic_emotional_reliance',
                'cot_controllability', 'cot_monitorability',
                'prompt_injection', 'first_person_fairness',
                'dfir_metric', 'zerodaybench', 'secrepobench',
                'cybersoceval', 'autopatchbench', 'baxbench'
            ]
        }
    ],

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
        this._renderPerfSuites();
    },

    _renderPerfSuites: function() {
        var el = document.getElementById('fc-perf-suites');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var rowIds = this.FRONTIER_MODELS.filter(function(mid) {
            return self._models.some(function(m) { return m.id === mid; });
        });

        // Build a fast score lookup
        var scoreMap = {};
        this._scores.forEach(function(s) { scoreMap[s.model_id + '|' + s.benchmark_id] = s.value; });

        // Summary banner
        var allBenchIds = this.PERF_SUITES.reduce(function(acc, s) { return acc.concat(s.benchmarks); }, []);
        var allBenchSet = {};
        allBenchIds.forEach(function(b) { allBenchSet[b] = true; });
        var totalScores = 0;
        var benchHits = {};
        this._scores.forEach(function(s) {
            if (allBenchSet[s.benchmark_id] && rowIds.indexOf(s.model_id) !== -1) {
                totalScores++;
                benchHits[s.benchmark_id] = (benchHits[s.benchmark_id] || 0) + 1;
            }
        });
        var activeBenchCount = Object.keys(benchHits).length;
        var summary = document.createElement('p');
        summary.className = 'text-xs text-gray-500 mb-3';
        var sb = document.createElement('strong');
        sb.className = 'text-gray-300';
        sb.textContent = totalScores + ' verified frontier scores';
        summary.appendChild(sb);
        summary.appendChild(document.createTextNode(' across '));
        var sc = document.createElement('strong');
        sc.className = 'text-gray-300';
        sc.textContent = String(activeBenchCount);
        summary.appendChild(sc);
        summary.appendChild(document.createTextNode(' active benchmarks · ' + rowIds.length + ' frontier models · click any score cell for source/history modal · click model name for details'));
        el.appendChild(summary);

        this.PERF_SUITES.forEach(function(suite) {
            var activeBids = suite.benchmarks.filter(function(bid) {
                return rowIds.some(function(mid) { return scoreMap[mid + '|' + bid] !== undefined; });
            });
            if (activeBids.length === 0) return;

            var suiteRowIds = rowIds.filter(function(mid) {
                return activeBids.some(function(bid) { return scoreMap[mid + '|' + bid] !== undefined; });
            });
            if (suiteRowIds.length === 0) return;

            // Sort by sum-of-scores desc within suite
            suiteRowIds.sort(function(a, b) {
                var sa = activeBids.reduce(function(acc, bid) { var v = scoreMap[a + '|' + bid]; return acc + (v != null ? v : 0); }, 0);
                var sb2 = activeBids.reduce(function(acc, bid) { var v = scoreMap[b + '|' + bid]; return acc + (v != null ? v : 0); }, 0);
                if (sb2 !== sa) return sb2 - sa;
                return self._getModelName(a).localeCompare(self._getModelName(b));
            });

            var TOP_N = 25;
            var trimmed = suiteRowIds.length > TOP_N;
            if (trimmed) suiteRowIds = suiteRowIds.slice(0, TOP_N);

            // Per-benchmark max for color coding
            var maxes = {};
            activeBids.forEach(function(bid) {
                var max = 0;
                rowIds.forEach(function(mid) {
                    var v = scoreMap[mid + '|' + bid];
                    if (v != null && v > max) max = v;
                });
                maxes[bid] = max;
            });

            // Suite header
            var head = document.createElement('div');
            head.className = 'mt-6 mb-2';
            var title = document.createElement('h4');
            title.className = 'text-sm font-semibold text-gray-200';
            title.textContent = suite.label + '  (' + activeBids.length + ' benchmarks · ' + (trimmed ? 'top ' + TOP_N + ' / ' : '') + suiteRowIds.length + ' models)';
            head.appendChild(title);
            var note = document.createElement('p');
            note.className = 'text-xs text-gray-500';
            note.textContent = suite.note;
            head.appendChild(note);
            el.appendChild(head);

            var wrap = document.createElement('div');
            wrap.className = 'overflow-x-auto';
            var table = document.createElement('table');
            table.className = 'sota-table text-sm';

            var thead = document.createElement('thead');
            var hr = document.createElement('tr');
            var thM = document.createElement('th'); thM.textContent = 'Model'; hr.appendChild(thM);
            var thV = document.createElement('th'); thV.textContent = 'Vendor'; thV.style.fontSize = '11px'; hr.appendChild(thV);
            activeBids.forEach(function(bid) {
                var th = document.createElement('th');
                var b = self._benchmarks.find(function(x) { return x.id === bid; });
                th.textContent = b ? b.name : bid;
                th.style.fontSize = '10px';
                th.style.whiteSpace = 'nowrap';
                hr.appendChild(th);
            });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = document.createElement('tbody');
            suiteRowIds.forEach(function(mid) {
                var m = self._models.find(function(x) { return x.id === mid; });
                var tr = document.createElement('tr');

                var tdName = document.createElement('td');
                tdName.textContent = m ? m.name : mid;
                tdName.style.whiteSpace = 'nowrap';
                tdName.style.cursor = 'pointer';
                tdName.title = mid + ' — 클릭하면 모델 상세';
                tdName.addEventListener('click', (function(modelId) {
                    return function() {
                        if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                    };
                })(mid));
                tr.appendChild(tdName);

                var tdV = document.createElement('td');
                tdV.textContent = m ? (m.vendor || '—') : '—';
                tdV.style.fontSize = '11px';
                tdV.style.color = Theme.textMuted;
                tdV.style.whiteSpace = 'nowrap';
                tr.appendChild(tdV);

                activeBids.forEach(function(bid) {
                    var td = document.createElement('td');
                    td.style.textAlign = 'center';
                    var v = scoreMap[mid + '|' + bid];
                    if (v != null) {
                        var bench = self._benchmarks.find(function(x) { return x.id === bid; });
                        var unit = bench && bench.metric ? bench.metric : '';
                        td.textContent = v.toFixed(unit === 'fps' || unit === 'seconds' || unit === 'hours' || unit === 'elo' ? 0 : 1);
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
            wrap.appendChild(table);
            el.appendChild(wrap);
        });
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

    // Sort state for the heatmap table. key: 'model' | benchmarkId. dir: 'asc' | 'desc' | null.
    _sortState: { key: null, dir: null },

    _sortModels: function(modelIds, scoreMap) {
        var s = this._sortState;
        if (!s.key || !s.dir) return modelIds.slice();  // original order
        var self = this;
        var sorted = modelIds.slice();
        sorted.sort(function(a, b) {
            var va, vb;
            if (s.key === 'model') {
                va = self._getModelName(a).toLowerCase();
                vb = self._getModelName(b).toLowerCase();
                if (va < vb) return s.dir === 'asc' ? -1 : 1;
                if (va > vb) return s.dir === 'asc' ? 1 : -1;
                return 0;
            }
            // benchmark column: undefined sinks to bottom regardless of direction
            va = scoreMap[a + '|' + s.key];
            vb = scoreMap[b + '|' + s.key];
            var aNull = va === undefined, bNull = vb === undefined;
            if (aNull && bNull) return 0;
            if (aNull) return 1;
            if (bNull) return -1;
            return s.dir === 'asc' ? va - vb : vb - va;
        });
        return sorted;
    },

    _cycleSort: function(key) {
        var s = this._sortState;
        if (s.key !== key) {
            // New column: benchmarks start desc (highest first), model starts asc
            this._sortState = { key: key, dir: key === 'model' ? 'asc' : 'desc' };
        } else if (s.dir === 'desc') {
            this._sortState = { key: key, dir: 'asc' };
        } else if (s.dir === 'asc') {
            this._sortState = { key: null, dir: null };  // clear
        } else {
            this._sortState = { key: key, dir: key === 'model' ? 'asc' : 'desc' };
        }
    },

    _sortIndicator: function(key) {
        var s = this._sortState;
        if (s.key !== key) return '';
        return s.dir === 'asc' ? ' ▲' : s.dir === 'desc' ? ' ▼' : '';
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

        // Apply current sort
        modelIds = this._sortModels(modelIds, scoreMap);

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
        thCorner.textContent = 'Model' + self._sortIndicator('model');
        thCorner.style.position = 'sticky';
        thCorner.style.left = '0';
        thCorner.style.zIndex = '10';
        thCorner.style.cursor = 'pointer';
        thCorner.setAttribute('role', 'button');
        thCorner.setAttribute('title', 'Click to sort by model name (asc → desc → off)');
        if (self._sortState.key === 'model') {
            thCorner.style.background = Theme.bgRaised;
            thCorner.style.color = Theme.accentBlue;
            thCorner.style.fontWeight = 'bold';
        } else {
            thCorner.style.background = Theme.bgSurface;
        }
        thCorner.addEventListener('click', function() {
            self._cycleSort('model');
            self._renderHeatmap(benchIds);
        });
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
            th.style.cursor = 'pointer';
            th.setAttribute('role', 'button');
            th.setAttribute('title', 'Click to sort by ' + self._getBenchName(bid) + ' (desc → asc → off)');
            // Emphasize the currently-sorted column
            if (self._sortState.key === bid) {
                th.style.background = Theme.bgRaised;
                th.style.color = Theme.accentBlue;
                th.style.fontWeight = 'bold';
            }
            th.textContent = self._getBenchName(bid) + self._sortIndicator(bid);
            th.addEventListener('click', function() {
                self._cycleSort(bid);
                self._renderHeatmap(benchIds);
            });
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
            tdName.style.background = Theme.bgSurface;
            tdName.style.zIndex = '5';
            tr.appendChild(tdName);

            benchIds.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                td.style.padding = '4px 6px';
                td.style.minWidth = '55px';

                var v = scoreMap[mid + '|' + bid];
                if (v !== undefined) {
                    // Clickable → opens Modal.showScoreSource for this (model, benchmark) pair
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.setAttribute('title', '클릭하면 검증 소스와 수집일 표시');
                    td.addEventListener('click', (function(modelId, benchId) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(modelId, benchId);
                            }
                        };
                    })(mid, bid));
                    // Skip color-coding for non-percentage metrics
                    var isSpecial = (bid === 'vending_bench_2' || bid === 'gdpval_aa' || bid === 'metr_time_horizons' || bid === 'livecodebench');
                    var displayVal = v;

                    if (isSpecial) {
                        if (bid === 'vending_bench_2') displayVal = '$' + Math.round(v);
                        else if (bid === 'gdpval_aa' || bid === 'livecodebench') displayVal = Math.round(v);
                        else displayVal = v.toFixed(1);
                        td.textContent = displayVal;
                        td.style.color = Theme.textSecondary;
                    } else {
                        td.textContent = v.toFixed(1);
                        var ratio = maxes[bid] > 0 ? v / maxes[bid] : 0;
                        if (ratio >= 0.98) {
                            td.style.background = 'rgba(16, 185, 129, 0.35)';
                            td.style.color = Theme.accentEmerald;
                            td.style.fontWeight = 'bold';
                        } else if (ratio >= 0.90) {
                            td.style.background = 'rgba(59, 130, 246, 0.2)';
                            td.style.color = Theme.accentBlue;
                        } else if (ratio >= 0.75) {
                            td.style.background = 'rgba(245, 158, 11, 0.15)';
                            td.style.color = Theme.accentAmber;
                        } else {
                            td.style.color = Theme.textMuted;
                        }
                    }
                } else {
                    td.textContent = '\u2014';
                    td.style.color = Theme.borderStrong;
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

        var series = [{
            type: 'radar',
            data: topModels.map(function(mid, i) {
                var color = Theme.rankColor(i);
                return {
                    name: self._getModelName(mid),
                    value: radarBench.map(function(bid) {
                        return scoreMap[mid + '|' + bid] || 0;
                    }),
                    lineStyle: { color: color, width: 2 },
                    itemStyle: { color: color },
                    areaStyle: { color: color, opacity: 0.06 }
                };
            })
        }];

        chart.setOption({
            backgroundColor: 'transparent',
            title: { text: 'Radar — ' + (category === 'all' ? 'Core' : category.charAt(0).toUpperCase() + category.slice(1)), left: 'center', textStyle: { color: Theme.textPrimary, fontSize: 13 } },
            tooltip: {},
            legend: {
                data: topModels.map(function(mid) { return self._getModelName(mid); }),
                textStyle: { color: Theme.textMuted, fontSize: 10 }, bottom: 0
            },
            radar: {
                indicator: indicators, shape: 'polygon', splitNumber: 5,
                axisName: { color: Theme.textMuted, fontSize: 9 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
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
            return i < 3 ? Theme.series[i] : Theme.textDim;
        });

        chart.setOption({
            backgroundColor: 'transparent',
            title: { text: self._getBenchName(primaryBench) + ' — Ranking', left: 'center', textStyle: { color: Theme.textPrimary, fontSize: 13 } },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 8, right: 16, bottom: 40, top: 40, containLabel: true },
            xAxis: {
                type: 'category',
                data: entries.map(function(e) { return self._getModelName(e.mid); }),
                axisLabel: { color: Theme.textMuted, fontSize: 9, rotate: 35 },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: [{
                type: 'bar',
                data: entries.map(function(e, i) {
                    return { value: e.val, itemStyle: { color: colors[i] } };
                }),
                label: { show: true, position: 'top', color: Theme.textSecondary, fontSize: 10, formatter: function(p) { return p.value.toFixed(1); } }
            }]
        });
        window.addEventListener('resize', function() { chart.resize(); });
    }
};
