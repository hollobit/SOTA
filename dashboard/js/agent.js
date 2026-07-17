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
                'mle_bench_lite',  // 2026-06-19 S138 — Arbor RUC-NLPIR (arxiv 2606.11926)
                'usaco',
                // 2026-05-28 Session 31 — Datacurve DeepSWE (contamination-free SWE bench)
                'deepswe_pass_at_1',
                // 2026-07-08 S175/S176 — Grok 4.5 + GPT-5.6 launch coding benches (Datacurve/AA versioned)
                'deepswe_1_0', 'deepswe_1_1', 'swe_marathon',
                // 2026-06-19 S138 — CEO-Bench 500-day startup simulation (arxiv 2606.18543)
                'ceo_bench',
                // 2026-06-26 S153 — Sakana × KPMG Azusa CoffeeBench (ICML 2026 Workshop)
                'coffeebench_net_profit_90d_usd'
            ]
        },
        {
            key: 'web-browse',
            icon: '🌐',
            label: 'Web & Browsing',
            benchmarks: [
                'browsecomp',
                'browsecomp_multiagent',
                'browsecomp_multi_agent',  // 2026-06-14 S112 Mythos 5 = 93.3 SOTA
                'browsecomp_plus',
                'browsecomp_agent_swarm',
                'gaia',
                'gaia2',
                'webarena',
                'osworld_verified',  // 2026-06-14 S112 Mythos/Fable 5 tied 85.0 SOTA
                'appworld',
                'visualwebarena',
                'online_mind2web',
                'webshop',
                // 2026-06-14 S112 — HAL Princeton CITP per-sub-benchmark
                'hal_swe_bench_verified_mini', 'hal_usaco', 'hal_core_bench_hard', 'hal_tau_bench_airline'
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
                'visualagentbench',
                // 2026-06-29 S155 — OSWorld 2.0 (XLANG, 108 long-horizon tasks, 500-step canonical)
                'osworld_v2', 'osworld_v2_partial', 'osworld_v2_150step', 'osworld_v2_300step'
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
                'bfcl_v4_web_search',
                // 2026-05-31 S40 SkillOpt SearchQA (extractive search-augmented QA)
                'search_qa',
                // 2026-06-14 S112 — Function calling / tool-use frontier
                'bfcl_v4_overall', 'bfcl_v4_non_live_ast', 'bfcl_v4_live', 'bfcl_v4_multi_turn',
                'bfcl_v4_memory', 'bfcl_v4_irrelevance_detection',
                'tau2_bench_airline_pass1', 'tau2_bench_retail_pass1', 'tau2_bench_telecom_pass1',
                'tau2_bench_airline_pass4', 'tau2_bench_retail_pass4', 'tau2_bench_telecom_pass4',
                'tau2_bench_banking_knowledge_pass1', 'acebench_overall'
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
                'tau3_telecom',
                // 2026-06-23 S142 — tau3 full family (Banking replaces Telecom in AAII v4.1)
                'tau3_banking', 'tau3_airline', 'tau3_retail'
            ]
        },
        {
            key: 'finance',
            icon: '💰',
            label: 'Finance Agent / Tool-use (S142)',
            benchmarks: [
                'fintrace',
                'finmcp_bench',
                'fintoolbench',
                'finance_agent_benchmark',
                'vals_financial_agent_1_1'
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
                'medagentsbench',
                // 2026-05-28 Session 30 — DeepRare rare-disease agentic system
                'deeprare_aggregate_recall_at_1',
                'deeprare_aggregate_recall_at_3',
                'deeprare_physician_recall_at_1',
                'deeprare_physician_recall_at_5',
                'deeprare_reasoning_chain_agreement',
                // 2026-05-31 S40 — Zapier AutomationBench (47-app E2E business workflow)
                'automationbench',
                // 2026-07-08 S175 — Grok 4.5 launch: AA agentic SaaS + Harvey legal + business-ops + Snorkel GDPval+
                'automationbench_aa', 'harvey_lab_aa', 'enterpriseops_gym_aa', 'gdpval_plus_snorkel'
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
                'agentsmith_inf',
                'apollo_scheming_oversight_subversion',
                'apollo_scheming_persistence'
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
                'agentsmith_inf',
                'cot_faithfulness',
                'cot_faithfulness_misaligned',
                'apollo_scheming_oversight_subversion',
                'apollo_scheming_persistence',
                'rewardbench2_overall',
                // 2026-05-28 Session 36 — AgentDoG 1.5 (Shanghai AI Lab, arxiv 2605.29801)
                'r_judge', 'atbench',
                // 2026-06-28 S154b Mythos 5 system card §5.1 agentic safety
                'malicious_computer_use_refusal',
                'agentic_influence_voter_suppression',
                'agentic_influence_domestic_polarization'
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
                'hal_overall_accuracy_at_fixed_cost',
                'metr_autonomy_p50',
                'metr_autonomy_p80',
                'processbench_f1',
                'multiagentbench_research_task',
                'multiagentbench_coding_task',
                'multiagentbench_bargaining_task',
                'multiagentbench_minecraft_task',
                'agentbench_overall',
                'metagpt_softwaredev_executability',
                // 2026-05-28 Session 30 — AgingBench longitudinal Agent Lifespan Engineering
                'agingbench_overall',
                // 2026-05-28 Session 33 — Claude Opus 4.8 System Card agentic + long-context + research benches
                'terminal_bench_2_1', 'hle_with_tools', 'usamo_2026', 'arxivmath', 'draco', 'automation_bench', 'officeqa',
                // 2026-05-31 S40 — AECI (Agentic Economic Capability Index) from Opus 4.8 card
                'aeci_index',
                // 2026-06-01 S44 — MiniMax M3 PostTrainBench (autonomous 12h ML training loop)
                'posttrainbench',
                // 2026-06-02 S46 — Qwen3.7-Plus agent benches
                'terminal_bench_2_0', 'mcp_mark', 'deep_planning', 'spreadsheetbench_v1', 'spreadsheetbench_v2',
                'qwen_world_bench', 'cowork_bench', 'vitabench', 'clawval_mm', 'skillsbench',
                // 2026-06-02 S48 — Microsoft MAI Instruction Following + Frontier reasoning benches
                'if_bench_precise', 'advanced_if_rubric', 'robust_if_diverse', 'frontier_math_t1_3',
                // 2026-06-04 S52 — K-BrowseComp Korean web browsing agent
                'k_browsecomp_verified', 'k_browsecomp_synthetic', 'k_browsecomp_calibration_error',
                // 2026-06-05 S54 — IBM Research + AA ITBench-AA (Kubernetes SRE)
                'itbench_aa',
                // 2026-06-06 S56 — SMAC-Talk (LLM multi-agent coordination) + Opper AI Roundtable
                'smac_talk_5v5_no_comm_winrate', 'smac_talk_kdc_winrate', 'smac_talk_udc_winrate', 'opper_roundtable_win_rate',
                'graphwalks_bfs_256k', 'graphwalks_parents_256k', 'graphwalks_bfs_1m', 'graphwalks_parents_1m',
                // 2026-05-29 Session 34 — SubQ long-context (RULER@128K)
                'ruler_128k',
                // 2026-07-01 S160 — Sonnet 5 §8 + LongCat 2.0 blog general-agent benches
                'forte', 'rwsearch', 'aa_briefcase',
                // 2026-07-09 S176 — Agents' Last Exam ALE-V1 + GPT-5.6 card general/AI-R&D benches
                'agents_last_exam', 'agents_last_exam_score', 'toolathlon', 'posttrainbench_lite',
                'rsi_index', 'internal_research_debugging', 'kernelgen_1p', 'big_finance_bench', 'management_consulting_tasks_internal',
                // 2026-07-10 S180 — backfilled arxiv agentic benches (CoffeeBench in coding; these two here)
                'rng_bench', 'mapf_frozenlake',
                // 2026-07-11 S181 — Tencent Hy3 card agentic benches
                'wildclawbench', 'blind_expert_productivity_eval',
                // 2026-07-16 S182 — Kimi K3 card agentic benches
                'job_bench', 'deck_bench'
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
        'anthropic/claude-cowork',
        // 2026-05-21 Microsoft Fara 1.5 browser computer-use agent family (Qwen3.5-based)
        'microsoft/fara1.5-27b',
        'microsoft/fara1.5-9b',
        'microsoft/fara1.5-4b',
        'microsoft/fara-7b',
        // 2026-06-27 S149 — Browser/CUA agent refresh
        'google/gemini-2.5-computer-use',        // earlier Gemini 2.5 CU baseline
        'google/gemini-3.5-flash-computer-use',  // 2026-06-24 native CU preview, OSWorld 78.4
        'openai/chatgpt-atlas-agent',            // Operator deprecated 2025-08-31 → Atlas
        'hcompany/holo3.1-35b-a3b',              // H Company Holo3.1
        'hcompany/holo3.1-4b',
        'hcompany/holo3-122b-a10b',              // Holo3 flagship 78.85 OSWorld
        'alibaba/gui-owl-1.5-32b-thinking',      // Qwen GUI agent thinking variant
        'bytedance/ui-tars-2',                   // Online-Mind2Web 88.2 SOTA
        // 2026 computer-use agents from various vendors
        'google/gemini-2.5-cu',
        'alibaba/gui-owl-1.5-32b',
        'alibaba/gui-owl-1.5-8b',
        'yutori/navigator-n1',
        'holo/holo2-30b',
        'openai/o3-som',
        // 2026-05-28 Session 30 — Gemini for Science I/O 2026 + DeepRare rare-disease
        'google/alphaevolve',
        'google/antigravity-science-skills',
        'sjtu-xinhua-harvard/deeprare',
        'mit-mgb/mdagents',
        // 2026-05-29 Session 33 — Harvard AutoScientists (self-organizing science) + Microsoft SkillOpt (skill optimizer)
        'harvard/autoscientists',
        'microsoft/skillopt',
        // 2026-06-09 S63 — MiniMax M3 (IFBench 83 #1 SOTA, GDPval-AA 58 #3 agentic) + Anti-hallucination Non-Hall 84 #1
        'minimax/m3',
        // 2026-06-09 S65 — Claude Fable 5 + Mythos 5 (Toolathlon 61.7 NEW SOTA, OSWorld 85 NEW SOTA, BrowseComp 88)
        'anthropic/claude-fable-5',
        'anthropic/claude-mythos-5',
        // 2026-06-19 S136 — UI-TARS-1.5-7B (ByteDance) + computer-use-preview + SoM Agent variants (Fara-7B paper WebTailBench leaderboard)
        'bytedance/ui-tars-1.5-7b',
        'thudm/glm-4.1v-9b-thinking',
        'openai/computer-use-preview',
        'openai/som-agent-gpt-5',
        // 2026-06-28 S154 — Search/RAG frontier products
        'you-com/research-api',              // DeepSearchQA #1 83.67
        'openai/gpt-5.5-pro',                // BrowseComp #1 0.901
        'anthropic/web-search-tool',         // Opus 4.8 DeepSearchQA 0.931
        'parallel/ultra',                    // \$2B valuation
        'google/ai-mode',                    // Feb 19 2026
        'brave/leo-ai',                      // May 2026 agentic
        'perplexity/sonar-deep-research',
        'leni/leni',                         // DRACO #1 0.716
        'internlm/mindsearch'                // OSS search agent
    ];

    // Curated list of 9 on-device / edge SLMs for the compare panel.
    var EDGE_SLMS = [
        'apple/foundation-3b',
        'apple/foundation-private-cloud',
        'microsoft/phi-4-mini-instruct',
        'microsoft/phi-4',
        'microsoft/phi-4-multimodal',         // 2026-06-09 S60 — 5.6B text+image+audio AAII 10
        'google/gemma-3-270m',
        'google/gemma-3n',
        'google/function-gemma',
        'meta/llama-3.2-1b-instruct',
        'meta/llama-3.2-3b-instruct',
        // 2026-06-09 S60 — Amazon Nova Micro 1.3B AAII 10 (smallest from AMZN frontier line)
        'amazon/nova-micro',
        // 2026-06-19 S140 — Edge/Mobile SLM frontier refresh
        'apple/afm-3-core-3b',                // 2026-06-08 — 3B Apple Foundation Model 3 Core
        'apple/afm-3-core-advanced-20b',      // 2026-06-08 — 20B sparse (1-4B active)
        'apple/afm-3-pcc',                    // 2026-06-08 — Private Cloud Compute server-side
        'google/gemma-4-e2b-qat',             // 2026-06-05 — QAT mobile ~1GB
        'google/gemma-4-e4b-qat',             // 2026-06-05 — QAT edge
        'google/gemini-nano-v3',              // 2026-05-12 — Nano v3
        'microsoft/phi-4-reasoning-vision-15b', // 2026-03-04 — 15B reasoning VLM
        'openbmb/minicpm5-1b',                // 2026-05-19 — 1B AAII v4.1 = 17.9 SOTA
        'openbmb/minicpm-v-4.6',              // 2026-05-11 — iOS/Android/HarmonyOS VLM
        'alibaba/qwen-3.5-0.8b', 'alibaba/qwen-3.5-2b', 'alibaba/qwen-3.5-4b', 'alibaba/qwen-3.5-9b',
        'mistral/ministral-3-3b', 'mistral/ministral-3-8b', 'mistral/ministral-3-14b',
        'liquid/lfm2.5-8b-a1b',
        'liquid/lfm2.5-vl-1.6b', 'liquid/lfm2.5-vl-450m',
        'liquid/lfm2.5-audio-1.5b', 'liquid/lfm2.5-1.2b-jp'
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
        { id: 'tau3_bench',           label: 'τ3-Bench' },
        { id: 'bfcl_v4',              label: 'BFCL v4' },
        { id: 'mobile_actions',       label: 'Mobile Actions' },
        { id: 'mobile_agent_bench',   label: 'MobileAgentBench' },
        // 2026-04-22 — OneManCompany agent framework PRD benchmark (Section 36)
        { id: 'prdbench',             label: 'PRDBench' },
        // 2026-04 — Agent-World batch (Section 36)
        { id: 'mcpmark',              label: 'MCP-Mark' },
        // 2026-04-17 — Microsoft Research DELEGATE-52 (Section 32)
        { id: 'delegate_52',          label: 'DELEGATE-52' },
        // 2026-05-13 — Cybersecurity agent benches (Section 50/51)
        { id: 'exploitbench_ace',     label: 'ExploitBench (ACE)' },
        { id: 'simbian_cyber_defense_coverage', label: 'Simbian Cyber Defense' },
        { id: 'cyberteam_rm_avg',     label: 'CyberTeam (R&M avg)' },
        // 2026-05-15 — HAL Princeton meta-leaderboard sub-benches (Section 43)
        { id: 'corebench_hard',       label: 'CORE-Bench Hard' },
        { id: 'tau_bench_airline',    label: 'TAU-bench Airline' },
        // 2026-05-21 — Microsoft Fara 1.5 browser CU benchmarks (Session 23)
        { id: 'online_mind2web',      label: 'Online-Mind2Web' },
        { id: 'webvoyager',           label: 'WebVoyager' },
        { id: 'webtailbench_v15_outcome',  label: 'WebTailBench v1.5 (Outcome)' },
        { id: 'webtailbench_v15_process',  label: 'WebTailBench v1.5 (Process)' },
        // 2026-06-19 Session 136 — WebTailBench v1 + UI-TARS-1.5 (Fara-7B paper)
        { id: 'webtailbench',         label: 'WebTailBench v1 (Nov 2025)' },
        // 2026-05-26 — Open Agent Leaderboard HF Space sub-benches (Session 23)
        { id: 'open_agent_avg_success', label: 'Open Agent — Avg Success' },
        { id: 'open_agent_swe',       label: 'Open Agent — SWE' },
        { id: 'assistantbench',       label: 'AssistantBench' },
        // 2026-05-14 — Multi-constraint judge eval (Section 40)
        { id: 'mcjudgebench_cjar',    label: 'MCJudgeBench (CJAR)' },
        // 2026-05-14 — Sequential decision-making agent (Section 40)
        { id: 'agentick',             label: 'Agentick (ONS)' },
        // 2026-05-14 — MCP tool sandbox (Section 40)
        { id: 'complexmcp',           label: 'ComplexMCP' },
        // 2026-05-28 Session 30 — DeepRare rare-disease + AgingBench lifespan engineering
        { id: 'deeprare_aggregate_recall_at_1', label: 'DeepRare R@1 (HPO aggregate)' },
        { id: 'deeprare_physician_recall_at_1', label: 'DeepRare vs Physician R@1' },
        { id: 'agingbench_overall',   label: 'AgingBench (lifespan t½)' },
        // 2026-05-28 Session 31 — Datacurve DeepSWE contamination-free SWE bench
        { id: 'deepswe_pass_at_1',    label: 'DeepSWE Pass@1 (Datacurve)' },
        // 2026-05-28 Session 33 — Claude Opus 4.8 System Card benches
        { id: 'terminal_bench_2_1',   label: 'Terminal-Bench 2.1' },
        { id: 'hle_with_tools',       label: 'HLE (with tools)' },
        { id: 'usamo_2026',           label: 'USAMO 2026' },
        { id: 'graphwalks_bfs_1m',    label: 'GraphWalks BFS 1M' },
        // 2026-06-27 S149 — Browser/agent benches with real scores in DB
        { id: 'toolathlon_pass_all_3_trials', label: 'Toolathlon (pass all 3 trials)' },
        { id: 'navi_bench_v1',        label: 'NaviBench v1' },
        // 2026-06-28 S154 — DRACO deep-research (Perplexity)
        { id: 'draco_perplexity_deep_research', label: 'DRACO (Perplexity Deep Research)' }
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
    // Returns [] if App data is not yet loaded. Uses App's pre-built byBench
    // index (O(1)) when available; falls back to full scan only at startup.
    function _scoresFor(benchmarkId) {
        if (!(window.App && App.data && App.data.scores)) return [];
        if (App.getScoreIndex) {
            var idx = App.getScoreIndex();
            if (idx && idx.byBench) return idx.byBench[benchmarkId] || [];
        }
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

        // Header row: 'SOTA Watch' title + 'Export PDF' button on the right.
        // The button uses window.print(); a print-only stylesheet
        // (dashboard/css/print.css) hides the rest of the dashboard so the
        // browser's "Save as PDF" output contains only the Agent tab.
        var headRow = document.createElement('div');
        headRow.className = 'flex items-center justify-between mb-3 flex-wrap gap-2';

        var heading = document.createElement('h2');
        heading.className = 'text-section';
        heading.textContent = 'SOTA Watch';
        headRow.appendChild(heading);

        var exportBtn = document.createElement('button');
        exportBtn.id = 'agent-export-pdf-btn';
        exportBtn.type = 'button';
        exportBtn.className = 'no-print bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 text-gray-100 text-xs px-3 py-2 rounded transition';
        exportBtn.title = 'Print or save the Agent tab as a PDF (uses browser Print dialog)';
        exportBtn.setAttribute('aria-label', 'Export Agent tab as PDF');
        exportBtn.textContent = '🖨 Export PDF';
        exportBtn.addEventListener('click', function() {
            document.body.classList.add('print-agent');
            try { window.print(); }
            catch (e) { if (window.console) console.warn('[Agent] window.print() failed:', e); }
            finally { document.body.classList.remove('print-agent'); }
        });
        headRow.appendChild(exportBtn);

        host.appendChild(headRow);

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
