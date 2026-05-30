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
            'gpqa_diamond', 'hle', 'mmlu_pro', 'mmlu_pro_aa', 'mmlu', 'mmlu_redux', 'mmmlu',
            'arc_agi_2', 'arc_agi_3', 'frontiermath', 'frontier_science', 'gdpval', 'officeqa_pro',
            'simpleqa_verified', 'chinese_simpleqa', 'facts_parametric', 'facts_score', 'facts_grounding_v2', 'facts_search', 'triviaqa',
            'longbench_v2', 'mrcr', 'corpusqa_1m', 'superqpga',
            'healthbench', 'healthbench_hard', 'healthbench_consensus', 'healthbench_professional',
            'virology_mcq', 'biochem_reward4', 'c_eval', 'cmmlu', 'agieval',
            // 2026-05-30 IPhO 2025 physics olympiad (llm-stats)
            'ipho_2025'
        ],
        coding: [
            'swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual',
            'terminal_bench_2', 'livecodebench', 'livecodebench_v6', 'swe_rebench',
            'gdpval_aa', 'nl2repo', 'expert_swe',
            'codeforces_rating', 'codeforces_elo', 'humaneval', 'humaneval_plus', 'bigcodebench',
            'mbpp', 'mbpp_plus', 'cruxeval', 'repobench',
            // 2026-05 CAD-coding specialty benches
            'cadbench_iou', 'benchcad_qa_vision', 'text2cad_l4_overall', 'scadbench_elo'
        ],
        math: ['aime_2025', 'aime_2026', 'aime_24', 'aime_2024', 'hmmt_2025', 'hmmt_2026', 'imo_answerbench', 'imo_2025', 'amc_23', 'usamo', 'gsm8k', 'math', 'math_500', 'putnambench', 'frontiermath', 'frontiermath_tier4', 'otis_aime', 'minif2f', 'proofnet', 'imo_proofbench_basic', 'imo_proofbench_advanced', 'cmo_2024'],
        agent: [
            'browsecomp', 'osworld_verified', 'tau2_bench', 'tau3_bench',
            'mcp_atlas', 'mcpatlas_public', 'mcpmark', 'webarena',
            'deepsearchqa', 'vending_bench_2', 'toolathlon',
            'android_world', 'qwen_web_bench', 'skills_bench', 'finance_agent',
            'apex_agents_hard', 'apex_shortlist',
            'gaia2', 'claw_eval',
            // 2026-05-12 — DELEGATE-52 from arxiv 2604.15597 (Microsoft Research)
            'delegate_52'
        ],
        cybersecurity: [
            'cybench', 'openai_ctf_professional', 'cybergym',
            'evmbench_exploit', 'evmbench_detect', 'cvebench',
            'firefox_147', 'cyber_range', 'cyscenariobench', 'tlo_cyber_range',
            'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion',
            'uk_aisi_narrow_cyber', 'offensive_cyber_time_horizon_p50', 'offensive_cyber_success_rate'
        ],
        cyber_defense: ['first_person_fairness', 'prompt_injection', 'harmbench', 'strongreject', 'airbench', 'r_judge', 'atbench'],
        multimodal: ['mmmu_pro', 'mathvision', 'video_mmmu', 'video_mme', 'video_mme_audio', 'mmau', 'longvideobench', 'screenspot_pro', 'compass_multimodal_avg', 'charxiv_reasoning', 'realworldqa', 'vlms_are_blind', 'docvqa', 'chartqa', 'vqav2', 'ai2d', 'mmbench_en'],
        // 2026-05 — Composite "general capability" indices (cross-benchmark)
        // ECI scores + the 24 underlying contributing benchmarks our DB covers
        // (per https://epoch.ai/data/eci-documentation/data — 42 total contributors,
        // 24 mapped to existing DB ids; 18 not in DB include: Chess Puzzles, BALROG,
        // GeoBench, The Agent Company, VPCT, plus 13 older NLP benches like
        // ANLI/PIQA/WinoGrande/SuperGLUE).
        // ECI composite (Epoch Capabilities Index): 42 contributing benchmarks per
        // https://epoch.ai/data/eci-documentation/data — 30 of those mapped to DB ids.
        composite_eci: [
            'epoch_capabilities_index', 'epoch_capabilities_index_swe',
            // Internal Evaluations (7 of 7 ingested from epoch.ai/data/benchmarks.csv)
            'gpqa_diamond', 'frontiermath', 'frontiermath_tier4', 'math_500',
            'simpleqa_verified', 'chess_puzzles', 'otis_aime',
            // External Leaderboards (15 of 15 ingested from epoch-research/benchmark-stitching)
            'aider_polyglot', 'apex_agents_hard', 'arc_agi_2', 'balrog',
            'deepsearchqa', 'fiction_livebench',
            'gso', 'hle', 'simplebench',
            'swe_bench_verified', 'terminal_bench_2', 'the_agent_company',
            'vpct', 'weirdml_v2',
            // Developer Reported (10+ of 20 ingested)
            'arc_agi_3', 'bbh', 'cybench', 'gsm8k', 'hellaswag', 'mmlu',
            'osworld_verified', 'triviaqa', 'video_mme'
        ],
        // AAII composite (Artificial Analysis Intelligence Index v4.0.4): 10 contributing
        // benchmarks across 4 categories per
        // https://artificialanalysis.ai/methodology/intelligence-benchmarking
        composite_aaii: [
            'aa_intelligence_index',
            // Agents (25%): GDPval-AA + τ²-Bench Telecom
            'gdpval_aa', 'tau2_telecom',
            // Coding (25%): Terminal-Bench Hard + SciCode
            'terminal_bench_hard', 'scicode',
            // General (25%): AA-LCR + AA-Omniscience + IFBench
            'aa_lcr', 'aa_omniscience_acc', 'aa_omniscience_non_hall', 'ifbench',
            // Scientific Reasoning (25%): HLE + GPQA Diamond + CritPt
            'hle', 'gpqa_diamond', 'critpt'
        ]
    },

    // Top frontier models to compare. Ordered by frontier tier and recency —
    // the most recently-announced, most-tracked models appear first so they
    // land at the top of the heatmap by default (before sort).
    FRONTIER_MODELS: [
        // 2026-05-28 Anthropic Claude Opus 4.8 — new flagship (SWE-Verified 88.6, USAMO 2026 96.7, GDPval-AA 1890 ELO)
        'anthropic/claude-opus-4.8',
        // 2026-05-05 Subquadratic SubQ 1M-Preview — first sub-quadratic frontier LLM, 12M ctx (RULER@128K 95.0, SWE-Verified 81.8, vendor-reported)
        'subquadratic/subq-1m-preview',
        // 2026-05 default ChatGPT model (replaces GPT-5.3 Instant)
        'openai/gpt-5.5-instant',
        // 2026-05-06 Zyphra ZAYA1-8B — small MoE frontier on AMD hardware
        'zyphra/zaya1-8b',
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
        'anthropic/claude-sonnet-4.6',
        'anthropic/claude-mythos-preview',
        'anthropic/claude-opus-4.6',
        'anthropic/claude-opus-4.5',
        'google/gemini-3.5-flash',
        'google/gemini-3.1-pro',
        'google/gemini-3-pro',
        'openai/gpt-5.4',
        'openai/gpt-5.4-thinking',
        'openai/gpt-5.3-codex',
        'openai/gpt-5.2',
        'xai/grok-4.3',
        'xai/grok-4-heavy',
        'xai/grok-4.20',
        'meta/muse-spark',

        // Open-weight frontier
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.5',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'alibaba/qwen3.7-max',
        'alibaba/qwen3.7-max-preview',
        'alibaba/qwen3.7-plus-preview',
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
        'inclusionai/ling-2.6-flash',

        // Apr 28-30 2026 additions
        'nvidia/nemotron-3-nano-omni',
        'reka/reka-edge-2603',
        'google/gemma-4-26b-a4b',

        // May 7 2026 — NVIDIA Nemotron Labs Elastic (3-in-1 nested 30B/23B/12B, ICML 2026)
        'nvidia/nemotron-labs-3-elastic-30b-a3b',

        // May 10 2026 — Epoch ECI canonical CSV ingest, frontier-eligible variants
        // (added after evaluating 16 newly-registered ECI-only models against latest-models rule)
        'openai/o3-pro',                  // ECI 148.11 — o3 family flagship reasoning
        'openai/gpt-5.4-nano',            // ECI 146.21 — GPT-5.4 edge variant
        'deepseek/deepseek-v3.2-exp',     // ECI 145.08 — recent open-weight flagship
        'xai/grok-4-fast',                // ECI 144.83 — Grok 4 family edge variant
        'alibaba/qwen3-max',              // ECI 144.52 — Qwen3 flagship (paired with 3.5/3.6 in list)
        'openai/gpt-oss-120b',            // ECI 140.71 — OpenAI open-weight flagship 2025-08

        // May 8 2026 — OpenAI Trusted Access for Cyber program (TAC) cyber-specialized variants
        'openai/gpt-5.5-cyber',           // Cyber-permissive variant of GPT-5.5; CyberGym 81.9%
        'openai/gpt-5.4-cyber',           // Cyber-permissive variant of GPT-5.4 (Feb 2026, scores undisclosed)

        // May 2026 sovereign batch — global flagships
        'mistral/mistral-medium-3.5',
        'sber/gigachat-3.1-ultra',
        'sber/gigachat-3.1-lightning',
        'kakao/kanana-1.5-o-9.8b',
        'dicta/dictalm-3.0-24b-thinking',
        'dicta/dictalm-3.0-24b-base',
        'dicta/dictalm-3.0-12b-instruct',
        'dicta/dictalm-3.0-1.7b-thinking',
        'cohere/tiny-aya-3b',
        'tii/falcon-ocr',
        'ai-singapore/gemma-sea-lion-v4-4b-vl',

        // 2026-05-14 — Baidu ERNIE 5.1 (AIME26 99.6 w/ tools, LMArena Search Elo 1223)
        'baidu/ernie-5.1',

        // 2026-05-14 — xAI Grok Build CLI launch + Codex CLI variant
        'xai/grok-build',
        'openai/gpt-5.5-codex',

        // 2026-05-12 — Microsoft MDASH multi-model agentic security harness (CyberGym 88.45 SOTA)
        'microsoft/mdash',

        // World Foundation Model frontier (May 2026 batch)
        'nvidia/sana-wm', 'nvidia/sana-wm-refiner',
        'meta/v-jepa-2', 'meta/v-jepa-2.1',
        'world-labs/marble', 'wayve/gaia-2',
        'allenai/molmoact-2',

        // Science FM frontier (Apr-May 2026 batch)
        'arc-institute/evo-2',
        'deepmind/alphaproteo',
        'google/txgemma-27b',

        // 2026-05 sovereign coverage additions
        'swiss-ai/apertus-70b', 'swiss-ai/apertus-70b-instruct',
        'cohere/command-a', 'cohere/command-a-reasoning',
        'pfn/plamo-2.1-prime', 'ntt/tsuzumi-2',
        'opengpt-x/teuken-7b-instruct-v0.6',
        'mistral/mistral-medium-3.5-eagle',

        // 2026-05-20 Qwen3.7-Max official launch + May 25 dated build
        'alibaba/qwen3.7-max-20260517',

        // 2026-05-23/26 arena.ai sweep — new reasoning/coding variants surfaced on WebDev arena
        'anthropic/claude-opus-4.5-thinking',
        'deepseek/deepseek-v4-pro-thinking',
        'openai/gpt-5.4-medium', 'openai/gpt-5.4-high',
        'openai/gpt-5.4-mini-high',
        'moonshot/kimi-k2.5-thinking', 'moonshot/kimi-k2.5-instant',
        'minimax/minimax-m2.7',
        'alibaba/qwen3.5-max-preview',
        'google/gemini-3-flash-thinking-minimal',

        // 2026-05-21 Microsoft Fara 1.5 computer-use agent family (Qwen3.5-based)
        'microsoft/fara1.5-27b', 'microsoft/fara1.5-9b',
        'microsoft/fara1.5-4b', 'microsoft/fara-7b',

        // 2026-05-22 NexgeneAI Asa-W1 medical reasoning foundational model
        'nexgene-ai/asa-w1',

        // 2026-05 xAI Grok 4.20 internal variants (arena listings)
        'xai/grok-4.20-beta1',
        'xai/grok-4.20-beta-0309-reasoning',
        'xai/grok-4.20-multi-agent-beta-0309',

        // 2026-05-28 Session 30 — DeepRare paper baseline reasoning variants + Gemini-for-Science
        'anthropic/claude-3.7-sonnet-thinking',
        'deepseek/deepseek-r1-search',
        'google/alphaevolve',
        'google/antigravity-science-skills',

        // 2026-05-29 Session 33 — Harvard AutoScientists + Microsoft SkillOpt agent systems
        'harvard/autoscientists',
        'microsoft/skillopt'
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],

    // ─── Model-class filter (Wave 6D1) ───
    // Three toggleable classes mirroring the Agent menu taxonomy.
    // State persists in LocalStorage under FC_CLASS_FILTER_KEY.
    // Class colors match agent-charts.js: frontier=#60a5fa, agent-product=#fbbf24, edge-slm=#34d399.
    FC_CLASS_FILTER_KEY: 'frontier-compare-class-filter',
    _classFilter: { 'frontier': true, 'agent-product': true, 'edge-slm': true },

    _loadClassFilter: function() {
        try {
            var raw = localStorage.getItem(this.FC_CLASS_FILTER_KEY);
            if (!raw) return;
            var parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                if (typeof parsed['frontier'] === 'boolean') this._classFilter['frontier'] = parsed['frontier'];
                if (typeof parsed['agent-product'] === 'boolean') this._classFilter['agent-product'] = parsed['agent-product'];
                if (typeof parsed['edge-slm'] === 'boolean') this._classFilter['edge-slm'] = parsed['edge-slm'];
            }
        } catch (e) { /* ignore corrupt state */ }
    },

    _saveClassFilter: function() {
        try {
            localStorage.setItem(this.FC_CLASS_FILTER_KEY, JSON.stringify(this._classFilter));
        } catch (e) { /* ignore quota errors */ }
    },

    _modelClass: function(modelId) {
        if (typeof Agent !== 'undefined') {
            var ap = Agent._AGENT_PRODUCTS || [];
            for (var i = 0; i < ap.length; i++) if (ap[i] === modelId) return 'agent-product';
            var es = Agent._EDGE_SLMS || [];
            for (var j = 0; j < es.length; j++) if (es[j] === modelId) return 'edge-slm';
        }
        return 'frontier';
    },

    // FRONTIER_MODELS list, filtered by the current class-filter toggles.
    _filteredModels: function() {
        var self = this;
        return this.FRONTIER_MODELS.filter(function(mid) {
            var k = self._modelClass(mid);
            return self._classFilter[k] !== false;
        });
    },

    // For the 'composite' category we want every model that has an ECI score,
    // not just the curated FRONTIER_MODELS pool — otherwise the heatmap shows
    // only ~18 of the 109 ECI-scored models. This helper expands the pool when
    // the user picks composite, and falls back to FRONTIER_MODELS otherwise.
    //
    // Contributing benchmarks (GPQA, HLE, MMLU, etc.) appear as extra columns,
    // but only models with an ECI score qualify for inclusion — otherwise the
    // heatmap balloons with hundreds of GPQA-scored-but-not-ECI-scored models
    // and the focus on "ECI + its evaluation data" is lost.
    // Per-category anchor benchmark sets — only models with a score in one of
    // these anchors qualify for the heatmap pool (so contributing benchmarks
    // appear as columns without ballooning the row count).
    _ANCHORS_BY_CATEGORY: {
        composite_eci: ['epoch_capabilities_index', 'epoch_capabilities_index_swe'],
        composite_aaii: ['aa_intelligence_index']
    },
    _anchorsFor: function(category) {
        return this._ANCHORS_BY_CATEGORY[category] || [];
    },
    _modelsForCategory: function(category, benchIds) {
        if (!this._ANCHORS_BY_CATEGORY[category]) return this._filteredModels();
        var self = this;
        var anchors = this._anchorsFor(category);
        var seen = {};
        var ids = [];
        this._scores.forEach(function(s) {
            if (anchors.indexOf(s.benchmark_id) === -1) return;
            if (seen[s.model_id]) return;
            seen[s.model_id] = true;
            // Apply class filter (frontier / agent-product / edge-slm)
            var k = self._modelClass(s.model_id);
            if (self._classFilter[k] === false) return;
            ids.push(s.model_id);
        });
        return ids;
    },

    _renderClassFilterUI: function() {
        var host = document.getElementById('fc-class-filter');
        if (!host) {
            // Inject the host directly after the existing category controls (above heatmap).
            var heatmap = document.getElementById('fc-heatmap');
            if (!heatmap || !heatmap.parentNode) return;
            host = document.createElement('div');
            host.id = 'fc-class-filter';
            host.className = 'flex gap-2 mb-3 items-center flex-wrap';
            heatmap.parentNode.insertBefore(host, heatmap);
        }
        host.textContent = '';

        var label = document.createElement('span');
        label.className = 'text-xs text-gray-400 mr-1';
        label.textContent = 'Model class:';
        host.appendChild(label);

        var classes = [
            { key: 'frontier',      label: 'Frontier',      color: '#60a5fa' },
            { key: 'agent-product', label: 'Agent-Product', color: '#fbbf24' },
            { key: 'edge-slm',      label: 'Edge-SLM',      color: '#34d399' }
        ];

        var self = this;
        classes.forEach(function(cls) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('role', 'switch');
            var on = self._classFilter[cls.key] !== false;
            btn.setAttribute('aria-checked', on ? 'true' : 'false');
            btn.className = 'px-3 py-1 rounded-full text-xs font-medium border transition-colors';
            btn.style.borderColor = cls.color;
            if (on) {
                btn.style.background = cls.color;
                btn.style.color = '#0f172a';
            } else {
                btn.style.background = 'transparent';
                btn.style.color = cls.color;
                btn.style.opacity = '0.55';
            }
            btn.textContent = (on ? '✓ ' : '○ ') + cls.label;
            btn.title = 'Toggle ' + cls.label + ' models';
            btn.addEventListener('click', function() {
                self._classFilter[cls.key] = !on;
                // Guard: never let all three turn off (would render an empty heatmap).
                var anyOn = ['frontier', 'agent-product', 'edge-slm'].some(function(k) {
                    return self._classFilter[k] !== false;
                });
                if (!anyOn) {
                    self._classFilter[cls.key] = true;
                }
                self._saveClassFilter();
                // Re-render whole tab with current category.
                var fcCat = document.getElementById('fc-category');
                self.render(fcCat ? fcCat.value : 'all');
            });
            host.appendChild(btn);
        });

        var hint = document.createElement('span');
        hint.className = 'text-xs text-gray-500 ml-2';
        // For composite, the heatmap pool expands beyond FRONTIER_MODELS, so
        // show the actual ECI-scored model count instead of the curated 75.
        var fcCat = document.getElementById('fc-category');
        var category = fcCat ? fcCat.value : 'all';
        if (this._ANCHORS_BY_CATEGORY[category]) {
            var benchIds = this._getBenchmarkIds(category);
            var visible = this._modelsForCategory(category, benchIds).length;
            // Total = all anchor-scored models for this category, regardless of class filter
            var anchors = this._anchorsFor(category);
            var total = (function() {
                var seen = {};
                var n = 0;
                self._scores.forEach(function(s) {
                    if (anchors.indexOf(s.benchmark_id) === -1) return;
                    if (seen[s.model_id]) return;
                    seen[s.model_id] = true; n++;
                });
                return n;
            })();
            var label = (category === 'composite_aaii') ? 'AAII-scored' : 'ECI-scored';
            hint.textContent = '(' + visible + ' / ' + total + ' ' + label + ' models visible)';
        } else {
            var visibleF = this._filteredModels().length;
            hint.textContent = '(' + visibleF + ' / ' + this.FRONTIER_MODELS.length + ' models visible)';
        }
        host.appendChild(hint);
    },

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
            note: 'MMMU-Pro · MathVision · CharXiv Reasoning · Video-MMMU · Video-MME · Video-MME (Audio) · MMAU · LongVideoBench · ScreenSpot-Pro · OmniDocBench · DocVQA · ChartQA · AI2D · MathVista · OCRBench · MMBench EN · RealWorldQA · VLMs-Are-Blind · VPCT · K-MMBench · VQAv2',
            benchmarks: [
                'mmmu_pro', 'mathvision', 'charxiv_reasoning',
                'video_mmmu', 'video_mme', 'video_mme_audio', 'mmau', 'longvideobench',
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

        // Load persisted class-filter state once per render cycle.
        this._loadClassFilter();
        this._renderClassFilterUI();

        category = category || 'all';
        var benchIds = this._getBenchmarkIds(category);
        this._renderHeatmap(benchIds, category);
        this._renderParetoChart();
        this._renderRadar(benchIds, category);
        this._populateBarSelect(benchIds, category);
        // Render bar with currently selected benchmark
        var barSel = document.getElementById('fc-bar-benchmark');
        var selectedBench = barSel ? barSel.value : '';
        this._renderBar(benchIds, category, selectedBench);
        this._renderPerfSuites();
    },

    _renderParetoChart: function() {
        var hostId = 'fc-pareto-chart';
        var el = document.getElementById(hostId);
        if (!el || typeof echarts === 'undefined') return;

        // Build category dropdown if not already present
        var section = document.getElementById('fc-pareto-section');
        var existingDropdown = document.getElementById('fc-pareto-cat');
        if (!existingDropdown && section) {
            var ctrls = document.createElement('div');
            ctrls.className = 'flex gap-2 mb-2 text-xs items-center';
            var catLabel = document.createElement('label');
            catLabel.className = 'text-gray-400';
            catLabel.textContent = 'Quality metric:';
            ctrls.appendChild(catLabel);
            var catSel = document.createElement('select');
            catSel.id = 'fc-pareto-cat';
            catSel.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs';
            [
                { v: 'all', l: 'All (Intelligence Index)' },
                { v: 'reasoning', l: 'Reasoning category avg' },
                { v: 'coding', l: 'Coding category avg' },
                { v: 'math', l: 'Math category avg' },
                { v: 'agent', l: 'Agent category avg' },
                { v: 'multimodal', l: 'Multimodal category avg' },
            ].forEach(function(opt) {
                var o = document.createElement('option');
                o.value = opt.v;
                o.textContent = opt.l;
                catSel.appendChild(o);
            });
            var self = this;
            catSel.addEventListener('change', function() {
                FrontierCompare._renderParetoChart();
            });
            ctrls.appendChild(catSel);
            // Insert before the chart element
            section.insertBefore(ctrls, el);
        }

        var catDropdown = document.getElementById('fc-pareto-cat');
        var catFilter = catDropdown ? catDropdown.value : 'all';

        // Build (cost, quality) points for FRONTIER_MODELS that have data
        var pricing = (typeof App !== 'undefined' && App.data && App.data.pricing) || {};
        var enrichment = (typeof App !== 'undefined' && App.data && App.data.enrichment) || {};
        var models = (typeof App !== 'undefined' && App.data && App.data.models) || this._models || [];
        var allScores = (typeof App !== 'undefined' && App.data && App.data.scores) || this._scores || [];
        var allBenchmarks = (typeof App !== 'undefined' && App.data && App.data.benchmarks) || this._benchmarks || [];

        var points = [];
        var ids = this._filteredModels();
        ids.forEach(function(mid) {
            var p = pricing[mid] || {};
            var ent = enrichment[mid] || {};
            var input = p.input != null ? p.input : (ent.pricing && ent.pricing.input);
            var output = p.output != null ? p.output : (ent.pricing && ent.pricing.output);
            if (input == null || output == null) return;
            var cost = input + 5 * output;
            var quality;
            if (catFilter === 'all') {
                quality = p.intelligence_index;
                if (quality == null && ent.benchmarks_meta && ent.benchmarks_meta.arena_elo) {
                    // Convert Elo (1100-1450 typical) to a 0-100 scale roughly comparable
                    quality = (ent.benchmarks_meta.arena_elo - 1100) / 4;
                }
            } else {
                // Compute category average from scores
                var catScores = allScores
                    .filter(function(s) {
                        if (s.model_id !== mid) return false;
                        var b = allBenchmarks.find(function(x) { return x.id === s.benchmark_id; });
                        return b && b.category === catFilter;
                    })
                    .map(function(s) { return s.value; });
                if (catScores.length === 0) return;
                quality = catScores.reduce(function(a, b) { return a + b; }, 0) / catScores.length;
            }
            if (quality == null) return;
            var m = models.find(function(x) { return x.id === mid; });
            points.push({
                modelId: mid,
                name: m ? m.name : mid,
                vendor: m ? m.vendor : '?',
                cost: cost,
                quality: quality,
                input: input,
                output: output,
            });
        });

        if (points.length < 3) {
            var msg = document.createElement('p');
            msg.className = 'text-gray-500 text-xs';
            msg.textContent = 'Insufficient pricing+quality data — need 3+ models.';
            el.textContent = '';
            el.appendChild(msg);
            return;
        }

        // Compute Pareto frontier (low cost + high quality)
        // A point is Pareto-optimal if no other point has both lower cost AND higher quality
        var pareto = [];
        points.forEach(function(p) {
            var dominated = points.some(function(other) {
                if (other === p) return false;
                return other.cost <= p.cost && other.quality >= p.quality
                    && (other.cost < p.cost || other.quality > p.quality);
            });
            if (!dominated) pareto.push(p);
        });
        // Sort frontier by cost ascending for the line
        pareto.sort(function(a, b) { return a.cost - b.cost; });

        // Build series data arrays
        var allSeries = points.map(function(p) {
            return [p.cost, p.quality, p.name, p.modelId, p.vendor];
        });
        var paretoSeries = pareto.map(function(p) {
            return [p.cost, p.quality, p.name, p.modelId];
        });

        var chart = echarts.init(el, (typeof Modal !== 'undefined' && Modal._currentThemeName) ? Modal._currentThemeName() : 'dark');
        chart.setOption({
            backgroundColor: 'transparent',
            grid: { left: 60, right: 30, top: 30, bottom: 60 },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var d = params.data;
                    return '<b>' + (d[2] || '?') + '</b><br/>' +
                        'Cost: $' + d[0].toFixed(2) + '/1M (blended)<br/>' +
                        'Quality: ' + d[1].toFixed(1);
                }
            },
            xAxis: {
                type: 'log',
                logBase: 10,
                name: 'Blended cost ($/1M, log scale)',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { color: '#9ca3af' },
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: 'rgba(160,160,160,0.15)' } },
            },
            yAxis: {
                type: 'value',
                name: catFilter === 'all'
                    ? 'Quality (Intelligence Index / Arena Elo×0.25)'
                    : (catFilter.charAt(0).toUpperCase() + catFilter.slice(1)) + ' category avg score',
                nameLocation: 'middle',
                nameGap: 45,
                nameTextStyle: { color: '#9ca3af' },
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: 'rgba(160,160,160,0.15)' } },
            },
            series: [
                {
                    type: 'scatter',
                    name: 'All models',
                    data: allSeries,
                    symbolSize: 14,
                    itemStyle: { color: '#6b7280', opacity: 0.7 },
                    emphasis: {
                        itemStyle: { color: '#60a5fa', opacity: 1, borderColor: '#fff', borderWidth: 2 },
                        scale: 1.5,
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: function(p) { return p.data[2]; },
                        color: '#d1d5db',
                        fontSize: 9,
                    }
                },
                {
                    type: 'line',
                    name: 'Pareto frontier',
                    data: paretoSeries,
                    showSymbol: true,
                    symbolSize: 18,
                    lineStyle: { color: '#10b981', width: 2 },
                    itemStyle: { color: '#10b981' },
                    emphasis: {
                        itemStyle: { color: '#34d399', opacity: 1, borderColor: '#fff', borderWidth: 2 },
                        scale: 1.4,
                    },
                    label: { show: false },
                    z: 5,
                }
            ]
        });

        // Click handler: open model modal
        chart.on('click', function(params) {
            var mid = params.data && params.data[3];
            if (mid && typeof Modal !== 'undefined' && Modal.showModel) {
                Modal.showModel(mid);
            }
        });

        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderPerfSuites: function() {
        var el = document.getElementById('fc-perf-suites');
        if (!el) return;
        el.textContent = '';
        var self = this;

        var rowIds = this._filteredModels().filter(function(mid) {
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

    _renderHeatmap: function(benchIds, category) {
        var container = document.getElementById('fc-heatmap');
        if (!container) return;
        container.textContent = '';

        var scoreMap = this._getScoreMap();
        var self = this;

        // Pool: composite expands beyond FRONTIER_MODELS to the full set of
        // models that have a score in the requested benchmarks (ECI: 109 models).
        var modelIds = this._modelsForCategory(category, benchIds).filter(function(mid) {
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
            self._renderHeatmap(benchIds, category);
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
                self._renderHeatmap(benchIds, category);
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
            tdName.style.cursor = 'pointer';
            tdName.setAttribute('role', 'button');
            tdName.setAttribute('title', mid + ' — 클릭하면 모델 상세');
            tdName.addEventListener('click', (function(modelId) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                };
            })(mid));
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

        // Pick top models with most coverage for radar (max 6) — class-filter applied
        var coverage = {};
        var filtered = this._filteredModels();
        filtered.forEach(function(mid) {
            var cnt = 0;
            benchIds.forEach(function(bid) { if (scoreMap[mid + '|' + bid] !== undefined) cnt++; });
            coverage[mid] = cnt;
        });

        var topModels = filtered.slice().sort(function(a, b) {
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

        // Get all models with this benchmark score, sorted desc (class-filter applied)
        var entries = [];
        this._filteredModels().forEach(function(mid) {
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
