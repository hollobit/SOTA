/**
 * Cyber & Coding tab: renders cybersecurity attack and coding capability views.
 */
var CyberCoding = {
    CYBER_BENCHMARKS: ['cybench', 'cvebench', 'cybergym', 'evmbench_exploit', 'evmbench_detect', 'airtbench', 'firefox_147', 'cyber_range', 'cyscenariobench', 'tlo_cyber_range', 'openai_ctf_professional', 'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion', 'uk_aisi_narrow_cyber',
        // 2026-05 ExploitBench (arxiv 2605.14153, CMU + exploitbench.ai live) — 41 V8 N-day exploit capability ladder
        'exploitbench_ace', 'exploitbench_t3', 'exploitbench_t4', 'exploitbench_mean_score', 'exploitbench_pct',
        // 2026-04 PACEbench (Shanghai AI Lab v1.5, arxiv 2602.14457)
        'pacebench_overall', 'pacebench_a_cve', 'pacebench_b_cve', 'pacebench_c_cve', 'pacebench_d_cve',
        // 2026-04 NYU CTF Bench (arxiv 2604.17159, SUNY Albany)
        'nyu_ctf', 'nyu_ctf_bench_crypto', 'nyu_ctf_bench_pwn', 'nyu_ctf_bench_web', 'nyu_ctf_bench_reverse',
        // 2026-05 UK AISI multi-step ranges (arxiv 2603.11214)
        'aisi_last_ones_100m_avg', 'aisi_cooling_tower_100m_avg',
        // 2026-04 Simbian Cyber Defense (arxiv 2604.19533) + CyberTeam blue-team (arxiv 2509.23571)
        'simbian_cyber_defense_coverage', 'cyberteam_rm_avg',
        // 2026-05 CTI-REALM detection rule generation (arxiv 2603.13517)
        'cti_realm_50',
        // 2026-05 Autonomous Adversary (arxiv 2605.06486, NRC Canada)
        'autoadversary_s1_autonomous_pct', 'autoadversary_s1_expert_pct',
        // 2026-05-21 Palisade Research GPT-5 at CTFs (arxiv 2511.04860) — live CTFTime 2025 competition percentiles
        'asis_ctf_quals_2025_percentile', 'corctf_2025_percentile', 'snakectf_quals_2025_percentile',
        // 2026-05-27 Lyptus Research — offensive-cyber time horizons (METR-style, 316 tasks × 7 benches); GPT-5.5 saturates
        'offensive_cyber_time_horizon_p50', 'offensive_cyber_success_rate',
        // 2026-05-28 S33 Claude Opus 4.8 System Card — harness-conflict cyber bench IDs (Section 3.3)
        'cybergym_targeted_repro', 'firefox_147_full_exploit', 'exploitbench_v2_flags', 'oss_fuzz_progress_rate',
        // 2026-06-19 S138 — Cyber refresh (AISI Advanced Suite + Meta CyberSecEval4 + Glasswing + Simbian CDB + ExploitBench tier)
        'aisi_advanced_suite_expert_pass_rate', 'aisi_tlo_32step_solves_at_10',
        'aisi_cooling_tower_solves_at_10', 'aisi_cyber_time_horizon_80pct_minutes',
        'cyberseceval4_overall', 'glasswing_critical_vulns_found_per_month',
        'simbian_cdb_cost_per_investigation_usd',
        'exploitbench_tier_reached_max', 'exploitbench_t3_bugs_breadth',
        // 2026-06-19 S140 — System card sub-benches (Opus 4.8 / GPT-5.5 / Gemini 3.1 Pro)
        'cybergym_targeted_reproduction_no_safeguards',
        'cybergym_targeted_reproduction_tier_3_safeguards',
        'firefox_147_exploits_0_5', 'firefox_147_exploits_full_working',
        // 2026-06-26 S145 — AI safety / preparedness new benches
        'aisi_realitytest_text_disclosure_rate',
        'aisi_last_ones_multistep_attack_pass_rate',
        'aisi_cooling_tower_ics_pass_rate',
        'openai_cyber_range_pass_rate', 'openai_vulnlmp_full_chain_exploit',
        // 2026-06-27 S148b — GPT-5.6 system card deep-mine cyber sub-benches (Irregular external)
        'openai_ctf_internal_curated',                  // S148: Sol 96.7 saturation
        'irregular_frontiercyber_easy', 'irregular_frontiercyber_medium',
        'irregular_frontiercyber_hard', 'irregular_frontiercyber_elite',
        'cyscenariobench_long_horizon_solve',
        'irregular_atomic_network_attack_sim',
        'irregular_atomic_vuln_research_exploit',
        'irregular_atomic_evasion',
        // 2026-06-27 S148 — ExploitGym (S136/S143 evolution)
        'exploitgym',
        // 2026-06-14 S111 — Cybersecurity benchmark refresh (frontier + agents + 2026 boards)
        'cybergym_v1', 'exploitbench_v8', 'firefox_147_anthropic', 'oss_fuzz_anthropic', 'cybergym_v1',
        'uk_aisi_narrow_cyber_expert', 'uk_aisi_cyber_range_last_ones', 'uk_aisi_cyber_range_doing_life',
        'uk_aisi_cyber_range_cooling_tower', 'openai_cyber_range_internal', 'cve_bench_v1_openai',
        'ctf_professional_openai', 'irregular_cyscenariobench', 'gemini_key_skills_v1_hard',
        'gemini_key_skills_v2_e2e', 'nyu_ctf_bench', 'cti-realm', 'sandbox-escape-bench', 'crackme-bench',
        'zero-day-bench', 'fuzzingbrain-v2-aixcc', 'sec-bench-pro', 'simbian-cyber-defense',
        'simbian-ai-soc', 'securewebarena', 'secureagentbench', 'ailuminate-continuous-stewardship',
        'aixcc_final', 'autopenbench___ai_pentest_benchmark', 'goad_active_directory', 'hackerone_us',
        'hackthebox', 'nyu_ctf_bench_2026', 'msrc_tcpip_recall', 'mdash_clfs_sys_recall',
        // 2026-07-05 S154 — Anthropic Mythos/Fable/Sonnet 5 system-card offensive cyber sub-benches
        'exploitbench_cap', 'exploitbench_mean_flags', 'oss_fuzz_any_crash', 'oss_fuzz_0_4',
        'oss_fuzz_write_primitive_or_better_0_4', 'firefox_147_zero_day_exploit_full_working_exploit_rate',
        'cybergym_pass_1_targeted_vuln_reproduction_1507_tasks',
        // 2026-07-27 S212 — Microsoft MAI-Cyber-1-Flash model card (External Cyber Benchmark Results)
        'crsbench', 'cyberseceval4_threat_intel', 'cyberseceval4_malware_analysis',
        // 2026-07-28 S212d — Google Gemini 3.5 Flash Cyber (DeepMind blog) V8 vuln-discovery count
        'v8_confirmed_vulns_google',
        // 2026 S217 audit — AgentCyberRange (Fudan, multi-host enterprise ranges)
        'agentcyberrange_web', 'agentcyberrange_post', 'container_sandbox_escape'
    ],
    DEFENSE_BENCHMARKS: ['autopatchbench', 'cybersoceval', 'zerodaybench', 'evmbench_patch', 'dfir_metric',
        // 2026-05-28 AgentDoG 1.5 (arxiv 2605.29801, Shanghai AI Lab) — agentic-trajectory safety judging
        'r_judge', 'atbench'],
    AGENT_BENCHMARKS: ['osworld_verified', 'gaia', 'gaia2', 'browsecomp', 'tau_bench', 'tau2_bench', 'tau3_bench', 'webarena', 'deepsearchqa', 'mcp_atlas', 'toolathlon', 'mcpmark', 'android_world', 'qwen_web_bench', 'arc_agi_3', 'claw_eval',
        // 2026-05-31 S40 — Opus 4.8 + SkillOpt agentic benches
        'automationbench', 'aeci_index', 'search_qa',
        // 2026-06-01 S44 MiniMax M3 — PostTrainBench autonomous 12h ML loop
        'posttrainbench',
        // 2026-06-02 S46 Qwen3.7-Plus — multimodal agent benches
        'mcp_mark', 'deep_planning', 'spreadsheetbench_v1', 'qwen_world_bench', 'cowork_bench', 'vitabench', 'clawval_mm', 'skillsbench',
        // 2026-06-02 S48 — Microsoft MAI Instruction Following benches
        'if_bench_precise', 'advanced_if_rubric', 'robust_if_diverse',
        // 2026-06-04 S52 — K-BrowseComp Korean browsing agent benches
        'k_browsecomp_verified', 'k_browsecomp_synthetic',
        // 2026-06-05 S54 — IBM Research + AA ITBench-AA (Kubernetes SRE)
        'itbench_aa',
        // 2026-06-06 S56 — SMAC-Talk + Opper Roundtable
        'smac_talk_5v5_no_comm_winrate', 'opper_roundtable_win_rate',
        // 2026-08-01 S220 — DeepSeek-V4-Flash-0731 agentic card (Toolathlon Verified subset)
        'toolathlon_verified',
        // 2026-08-02 S224b — arxiv benchmark sweep (agent leaderboards)
        'mcp_bench', 'mcpverse', 'browsecomp_plus', 'agent_planning_benchmark', 'datagovbench'],
    CODING_BENCHMARKS: ['swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual', 'terminal_bench_2', 'terminal_bench_2_1', 'livecodebench', 'livecodebench_v5', 'livecodebench_v6', 'nl2repo', 'codeforces_elo', 'deepswe_pass_at_1', 'programbench',
        'roadmapbench', 'chainswe_sequential', 'perfopt_bench',
        // 2026-07-08 S175 Grok 4.5 launch — SWE-Marathon (Grok #1 29) + DeepSWE 1.0/1.1 versioned splits (Datacurve/AA)
        'swe_marathon', 'deepswe_1_0', 'deepswe_1_1',
        // 2026-07-20 S189 Grok 4.5 card — Mercor ApexSWE (integration + observability SWE)
        'apexswe',
        // 2026-05 CAD-coding specialty (3 arxiv benches + SCADBench ELO arena)
        'cadbench_iou', 'benchcad_qa_vision', 'text2cad_l4_overall', 'scadbench_elo',
        // 2026-05-30 Session 39 BenchCAD sub-tasks (Edit / QA Code / Vision2Code)
        'benchcad_edit_acc', 'benchcad_qa_code', 'benchcad_vision2code',
        // 2026-06-01 S44 MiniMax M3 — KernelBench Hard + SWE-fficiency
        'kernelbench_hard', 'swe_fficiency',
        // 2026-06-02 S46 Qwen3.7-Plus — coding agent benches
        'terminal_bench_2_0', 'swe_multilingual', 'nl2repo_qwen', 'qwen_webdev_elo', 'qwen_svg_elo',
        // 2026-06-02 S48 — Microsoft MAI Code/Thinking benches
        'lcb_v6', 'artifacts_bench',
        // 2026-06-29 S156 — Epoch + METR MirrorCode (reimplement-from-black-box CLI)
        'mirrorcode', 'mirrorcode_solve_at_99',
        // 2026-06-29 S157 — MirrorCode deep re-mine (per-size + cheating-rate honesty signal)
        'mirrorcode_small', 'mirrorcode_medium', 'mirrorcode_large',
        'mirrorcode_cheating_rate', 'mirrorcode_cost_mean_usd', 'mirrorcode_cost_max_usd',
        // 2026-07-01 S160 — Sonnet 5 system card §8 coding benches
        'frontiercode_v1', 'swe_bench_multimodal_sonnet5', 'swe_bench_verified_sonnet5_card',
        // 2026-06-19 S136 — LoopCoder-v2 (arxiv 2606.18023) + VibeThinker-3B (arxiv 2606.16140) + LeetCode contests
        'multi_swe_bench', 'leetcode-contests',
        // 2026-06-25 S153 — DeepReinforce ORNITH 1.0 benchmark suite
        'terminal_bench_2_1_terminus_2', 'terminal_bench_2_1_claude_code',
        'swe_atlas_qna', 'swe_atlas_rf', 'swe_atlas_tw', 'claweval_avg',
        // 2026-07-05 S154 — Anthropic Mythos/Fable/Sonnet 5 system-card coding benches
        'frontierswe_mean_5', 'terminal_bench_2_1_mini_swe_agent_harness',
        // 2026-08-01 S220 — DeepSeek-V4-Flash-0731 agentic card (internal DSBench coding-agent sets)
        'dsbench_fullstack', 'dsbench_hard',
        // 2026-08-02 S224 — LiveSQLBench (text-to-SQL on live databases)
        'livesqlbench',
        // 2026-08-02 S224b — arxiv benchmark sweep (coding leaderboards)
        'swe_compass', 'nl2repo_bench', 'dataclaweval'],

    // ─── Performance Suites — multi-table leaderboard ───
    // 7 thematic groupings, each with its own table. Mirrors the
    // Physical AI / Sovereign AI 6-suite pattern but tuned for
    // cyber-attack / cyber-defense / coding / agent scope.
    PERF_SUITES: [
        {
            id: 'coding-se',
            label: '💻 Coding & Software Engineering',
            note: 'SWE-Verified · SWE-Pro · SWE-Multilingual · SWE-rebench · DeepSWE (Datacurve, contamination-free 113 tasks) · LiveCodeBench (+ v6) · HumanEval+ · MBPP+ · Aider Polyglot · Codeforces · GDPval-AA · SciCode · WebDev Arena · Monorepo-Bench · Expert-SWE · GSO · MLE-Bench · WeirdML v2 · PaperBench · Terminal-Bench 2 · NL2Repo · RepoBench · Vibe Code Bench',
            benchmarks: [
                'swe_bench_verified', 'swe_bench_pro', 'swe_bench_multilingual', 'swe_rebench',
                'deepswe_pass_at_1',
                'livecodebench', 'livecodebench_v5', 'livecodebench_v6', 'livecodebench_elo',
                'humaneval', 'humaneval_plus', 'mbpp', 'mbpp_plus',
                'aider_polyglot', 'codeforces_rating', 'codeforces_elo',
                'gdpval_aa', 'scicode', 'webdev_arena', 'monorepo_bench',
                'expert_swe', 'gso', 'mle_bench', 'weirdml_v2', 'paperbench',
                'terminal_bench_2', 'nl2repo', 'repobench', 'vibe_code_bench',
                // 2026-06-02 S46 Qwen3.7-Plus coding suite
                'terminal_bench_2_0', 'swe_multilingual', 'nl2repo_qwen', 'qwen_webdev_elo', 'qwen_svg_elo',
                // 2026-06-01 S44 MiniMax M3 — KernelBench Hard + SWE-fficiency
                'kernelbench_hard', 'swe_fficiency'
            ]
        },
        {
            id: 'cyber-attack',
            label: '🛡️ Cyber Attack / CTF',
            note: 'Cybench · CyberGym · CVE-Bench · EVMbench Detect/Exploit · The Last Ones (TLO) · OpenAI CTF Professional · Firefox 147 · Cyber Range · MHBench (Multi-Host) · AIRTBench · UK AISI Narrow Cyber · CyScenarioBench · Irregular Atomic 3-suite (Network/Vuln-Research/Evasion) · AIxCC · FORTRESS · ExploitBench (V8 N-day) · PACEbench (Shanghai AI Lab) · NYU CTF Bench · AISI multi-step (Last-Ones / Cooling Tower) · Autonomous Adversary (NRC Canada)',
            benchmarks: [
                'cybench', 'cybergym', 'cvebench',
                'evmbench_detect', 'evmbench_exploit',
                'tlo_cyber_range', 'openai_ctf_professional', 'firefox_147', 'cyber_range',
                'mhbench', 'airtbench', 'uk_aisi_narrow_cyber', 'cyscenariobench',
                'irregular_atomic_network', 'irregular_atomic_vuln_research', 'irregular_atomic_evasion',
                'aixcc_synth_vuln', 'fortress',
                // 2026-05 ExploitBench (arxiv 2605.14153) — V8 N-day exploit capability ladder
                'exploitbench_ace', 'exploitbench_t3', 'exploitbench_t4', 'exploitbench_mean_score', 'exploitbench_pct',
                // 2026-04 PACEbench (Shanghai AI Lab v1.5, arxiv 2602.14457)
                'pacebench_overall', 'pacebench_a_cve', 'pacebench_b_cve', 'pacebench_c_cve', 'pacebench_d_cve',
                // 2026-04 NYU CTF Bench (arxiv 2604.17159)
                'nyu_ctf', 'nyu_ctf_bench_crypto', 'nyu_ctf_bench_pwn', 'nyu_ctf_bench_web', 'nyu_ctf_bench_reverse',
                // 2026-05 UK AISI multi-step ranges (arxiv 2603.11214)
                'aisi_last_ones_100m_avg', 'aisi_cooling_tower_100m_avg',
                // 2026-05 Autonomous Adversary (arxiv 2605.06486, NRC Canada)
                'autoadversary_s1_autonomous_pct', 'autoadversary_s1_expert_pct',
                // 2026-05-21 Palisade Research GPT-5 at CTFs (arxiv 2511.04860) — live CTFTime 2025 percentile
                'asis_ctf_quals_2025_percentile', 'corctf_2025_percentile', 'snakectf_quals_2025_percentile',
                // 2026-05-28 Claude Opus 4.8 System Card cyber evals (Section 3.3)
                'cybergym_targeted_repro', 'firefox_147_full_exploit', 'exploitbench_v2_flags', 'oss_fuzz_progress_rate',
                // 2026-06-21 S138 AI safety preparedness (UK AISI Advanced Cyber Suite + Glasswing + Simbian)
                'aisi_advanced_suite_expert_pass_rate',
                'glasswing_critical_vulns_found_per_month',
                'simbian_cdb_cost_per_investigation_usd',
                'cyber_defense_benchmark_simbian',
                'exploitbench_tier_reached_max', 'exploitbench_t3_bugs_breadth',
                // 2026-06-26 S145 AISI Sabotage + RealityTest
                'aisi_sabotage_unprompted_rate', 'aisi_sabotage_continuation_rate',
                'aisi_realitytest_text_disclosure_rate',
                // 2026-06-27 S148b GPT-5.6 deep-mine cyber sub-benches
                'openai_ctf_internal_curated',
                'irregular_frontiercyber_easy', 'irregular_frontiercyber_medium',
                'irregular_frontiercyber_hard', 'irregular_frontiercyber_elite',
                'cyscenariobench_long_horizon_solve',
                'irregular_atomic_network_attack_sim',
                'irregular_atomic_vuln_research_exploit',
                'irregular_atomic_evasion',
                'exploitgym',
                'anthropic_firefox_zero_day_exploit_rate',
                // 2026-06-27 S148 OpenAI Daybreak / Patch the Planet
                'glasswing_critical_vulns_found_per_month',
                // 2026-06-28 S154 Mythos 5 + Fable 5 system card cyber benches
                'firefox_147_exploits', 'firefox_147_exploits_full_working',
                'exploitbench_cap_pct', 'exploitbench_t3',
                'cybergym_pass_at_1', 'cybergym_targeted_repro',
                // 2026-06-28 S154b Mythos 5 system card §3.2.2–3.2.4 deep-mine
                'firefox_147_full_working_exploit',
                'oss_fuzz_any_crash_rate', 'oss_fuzz_write_primitive_rate',
                'cybergym_any_crash_rate',
                // 2026-06-29 S155 Qihoo 360 Yitian Tulong (ISC.AI 2026, news_article-attribution)
                'cyber_vulnerabilities_disclosed_count', 'cyber_vulnerabilities_confirmed_count',
                // 2026-07-01 S160 — Sonnet 5 system card §3.2.1 + §3.2.2 detail metrics
                'exploitbench_mean', 'exploitbench_full_ace', 'oss_fuzz_no_score_pct'
            ]
        },
        {
            id: 'cyber-defense',
            label: '🔒 Cyber Defense / Safety',
            note: 'ZeroDayBench · SecRepoBench · EVMbench Patch · DFIR-Metric · Apollo Sabotage / Impossible-Task Lying / Eval-Awareness / Strategic Deception / Sandbagging · Dynamic Self-Harm / Mental Health / Emotional Reliance · CoT Controllability / Monitorability · Prompt Injection · First-Person Fairness · CyberSocEval · AutoPatchBench · Simbian Cyber Defense · CyberTeam (blue-team) · CTI-REALM (detection rule gen)',
            benchmarks: [
                'zerodaybench', 'secrepobench', 'evmbench_patch', 'dfir_metric',
                'apollo_sabotage_mean', 'apollo_impossible_task_lying', 'apollo_eval_awareness',
                'apollo_strategic_deception', 'apollo_sandbagging_qa',
                'dynamic_self_harm_adversarial', 'dynamic_mental_health', 'dynamic_emotional_reliance',
                'cot_controllability', 'cot_monitorability',
                'prompt_injection', 'first_person_fairness',
                'cybersoceval', 'autopatchbench', 'baxbench',
                // May 2026 — MLCommons AI safety v1.0 (12 hazard categories, 5-point grade scale)
                'ailuminate_v1',
                // 2026-04 Simbian Cyber Defense (arxiv 2604.19533) + CyberTeam blue-team (arxiv 2509.23571)
                'simbian_cyber_defense_coverage', 'cyberteam_rm_avg',
                // 2026-05 CTI-REALM detection-rule generation (arxiv 2603.13517)
                'cti_realm_50',
                // 2026-05-21 OpenAI Deployment Safety Hub — 8 production safety not_unsafe categories
                'not_unsafe_violent_illicit', 'not_unsafe_nonviolent_illicit',
                'not_unsafe_extremism', 'not_unsafe_hate', 'not_unsafe_self_harm',
                'not_unsafe_gore', 'not_unsafe_sexual', 'not_unsafe_sexual_minors',
                // 2026-04-21 ChatGPT Images 2.0 image-safety pipeline (5 metrics)
                'image_safety_violative_rate', 'image_safety_combined_detection',
                'image_safety_safe_output_rate', 'image_safety_image_layer_detection',
                'image_safety_prompt_layer_detection',
                // 2026-05-22 Anthropic Project Glasswing + Coordinated Vuln Disclosure (Mythos deployment metrics)
                'glasswing_high_crit_vulns_found', 'glasswing_true_positive_rate',
                'glasswing_cve_ghsa_assignments',
                'cvd_vulns_disclosed_oss', 'cvd_oss_projects_touched', 'cvd_patches_upstream',
                'enterprise_vuln_patching_count',
                'mozilla_firefox_vulns_discovered',
                'cloudflare_bugs_total', 'cloudflare_high_crit_bugs',
                // 2026-05-12 Microsoft MDASH — internal Windows kernel deployment metrics
                'mdash_storagedrive_recall', 'mdash_clfs_sys_recall',
                'mdash_tcpip_sys_recall', 'mdash_windows_networking_new_vulns',
                // 2026-06-28 S154b Mythos 5 system card §4 + §5 safeguards/agentic safety
                'single_turn_harmful_request_refusal_api', 'single_turn_harmful_request_refusal_claude_ai',
                'single_turn_benign_overrefusal_api', 'single_turn_benign_overrefusal_claude_ai',
                'election_integrity_harmful_api', 'election_integrity_benign_api',
                'claude_code_malicious_refusal', 'claude_code_dual_use_success',
                // 2026-07-01 S160 — Sonnet 5 system card §4.2 child-safety suite
                'child_safety_harmful_refusal_api', 'child_safety_benign_refusal_api',
                'child_safety_multiturn_appropriate_api',
                // 2026-07-01 S162 — Sonnet 5 SC deep re-mine §4.3-4.4 + §5 prompt injection bug bounty
                'suicide_self_harm_harmless_api', 'suicide_self_harm_multiturn_appropriate_claude_ai',
                'disordered_eating_harmless_api', 'bbq_disambiguated_accuracy', 'bbq_ambiguous_bias',
                'prompt_injection_bug_bounty_all', 'prompt_injection_bug_bounty_coding',
                'prompt_injection_bug_bounty_tool_use', 'prompt_injection_bug_bounty_computer_use'
            ]
        },
        {
            id: 'tool-agent',
            label: '🤖 Tool-use Agent',
            note: 'τ-bench · τ²-bench · τ³-bench (Sierra) · MCP-Atlas · MCPMark · BFCL V4 · Toolathlon · Finance-Agent · Vending-Bench 2',
            benchmarks: [
                'tau_bench', 'tau2_bench', 'tau3_bench',
                'mcp_atlas', 'mcpatlas_public', 'mcpmark',
                'bfcl', 'bfcl_v3', 'bfcl_v4',
                'toolathlon', 'finance_agent', 'vending_bench_2',
                'apex_agents_hard', 'apex_shortlist', 'skills_bench',
                // 2026-06-02 S46 Qwen3.7-Plus general-agent benches
                'mcp_mark', 'deep_planning', 'spreadsheetbench_v1', 'qwen_world_bench',
                'cowork_bench', 'vitabench', 'clawval_mm', 'skillsbench',
                // 2026-06-01 S44 MiniMax M3 PostTrainBench
                'posttrainbench',
                // 2026-06-23 S142 — tau3 full family (Banking + Airline + Retail) + finance tool benches
                'tau3_banking', 'tau3_airline', 'tau3_retail',
                'fintrace', 'finmcp_bench', 'fintoolbench'
            ]
        },
        {
            id: 'webcomputer-agent',
            label: '🌐 Web / Computer-use Agent',
            note: 'BrowseComp · OSWorld-Verified · WebArena · DeepSearchQA · METR Time Horizons · QwenWebBench · AndroidWorld · GAIA · GAIA-2',
            benchmarks: [
                'browsecomp', 'osworld_verified', 'webarena', 'deepsearchqa',
                'metr_time_horizons', 'qwen_web_bench', 'android_world',
                'gaia', 'gaia2'
            ]
        },
        {
            id: 'robotics-agent',
            label: '🦾 Robotics Agent (overlap with Physical AI)',
            note: 'LIBERO 4-suite · ALOHA 4-task · RoboCasa · Unitree G1 1K demos · GR-1 real lang following · OpenX Embodiment · DexMimicGen',
            benchmarks: [
                'libero', 'libero_spatial', 'libero_object', 'libero_goal', 'libero_long',
                'aloha_4task_avg', 'robocasa', 'robocasa365',
                'unitree_g1_1k_demos', 'gr1_real_lang_following', 'realworld_language_following',
                'open_x_embodiment', 'dexmimicgen', 'gr1_tabletop',
                'simpler_env_avg', 'roboarena_elo',
                // 2026-06-01 S45 Qwen-VLA paper benches
                'robotwin_easy', 'robotwin_hard', 'simpler_widowx', 'robocasa_gr1',
                'simplerenv_ood', 'domino_sr', 'aloha_real_in_domain', 'r2r_val_unseen_sr',
                // 2026-06-02 S46 Cosmos 3 robot policy + adaptation benches
                'robolab_droid_specific', 'libero_10_adaptation_2k'
            ]
        },
        {
            id: 'reasoning-agent',
            label: '⚡ Reasoning Agent',
            note: 'ARC-AGI-2 · ARC-AGI-3 · Claw-Eval (Xiaomi MiMo) · Skills-Bench',
            benchmarks: [
                'arc_agi_1', 'arc_agi_2', 'arc_agi_3', 'claw_eval'
            ]
        }
    ],

    BENCH_DESCRIPTIONS: {
        toolathlon_verified: {
            name: 'Toolathlon-Verified',
            desc: 'Toolathlon 에이전트 도구 사용 벤치마크의 검증(Verified) 서브셋 — 다양한 도구 + MCP 서비스에 걸친 통합 도구 사용 능력. 높을수록 우수. DeepSeek-V4-Flash-0731 70.3 / V4-Pro(preview) 55.9.',
            source: 'huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731'
        },
        dsbench_fullstack: {
            name: 'DSBench-FullStack (in-house)',
            desc: 'DeepSeek 내부(in-house) 풀스택 개발 코딩 에이전트 테스트셋. DeepSeek-V4-Flash-0731 68.7. 사내 벤치라 교차 비교 제한적.',
            source: 'huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731'
        },
        dsbench_hard: {
            name: 'DSBench-Hard (in-house)',
            desc: 'DeepSeek 내부(in-house) 고난도 코딩 에이전트 문제 테스트셋. DeepSeek-V4-Flash-0731 59.6. 사내 벤치라 교차 비교 제한적.',
            source: 'huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731'
        },
        v8_confirmed_vulns_google: {
            name: 'V8 Engine — Confirmed Vulns (Google)',
            desc: 'V8 JavaScript 엔진에서 고정 호출 예산 내 모델이 발견한 고유 확인(confirmed) 취약점 수. Google DeepMind Gemini 3.5 Flash Cyber 평가. 높을수록 우수(개수).',
            source: 'deepmind.google/blog/introducing-gemini-3-5-flash-cyber'
        },
        crsbench: {
            name: 'CRSBench',
            desc: 'Full-pipeline Cyber Reasoning System 평가 (discovery→validation→proof-of-vulnerability). MAI-Cyber-1-Flash 모델 카드 Section 3, POV=1200 구성.',
            source: 'microsoft.ai/models/mai-cyber-1-flash'
        },
        cyberseceval4_threat_intel: {
            name: 'CyberSecEval 4 — Threat Intel',
            desc: 'CyberSecEval 4의 위협 인텔리전스(threat intelligence) 역량 차원. Meta PurpleLlama 기반, 높을수록 우수.',
            source: 'github.com/meta-llama/PurpleLlama'
        },
        cyberseceval4_malware_analysis: {
            name: 'CyberSecEval 4 — Malware Analysis',
            desc: 'CyberSecEval 4의 악성코드 분석(malware analysis) 역량 차원. Meta PurpleLlama 기반, 높을수록 우수.',
            source: 'github.com/meta-llama/PurpleLlama'
        },
        cybench: {
            name: 'Cybench (CTF)',
            desc: '40개 professional-level CTF 과제 (crypto, web, reversing, forensics, exploitation). 에이전트의 자율 해킹 능력을 pass@1 비율로 측정.',
            source: 'cybench.github.io'
        },
        cvebench: {
            name: 'CVE-Bench',
            desc: '40개 critical-severity CVE 기반 실제 웹 앱 취약점 악용 벤치마크. 제로데이/원데이 시나리오에서 exploit 성공률 측정.',
            source: 'github.com/uiuc-kang-lab/cve-bench'
        },
        cybergym: {
            name: 'CyberGym',
            desc: '실제 오픈소스 프로젝트에서 기발견 취약점 재현 + 신규 제로데이 발견 능력. $2 비용 제한 내 성공률 측정.',
            source: 'cybergym.io'
        },
        evmbench_exploit: {
            name: 'EVMbench (Exploit)',
            desc: '120개 Ethereum 스마트 컨트랙트 취약점 exploit 생성. 로컬 EVM 환경에서 실제 exploit 성공률 측정.',
            source: 'github.com/openai/evmbench'
        },
        evmbench_detect: {
            name: 'EVMbench (Detect)',
            desc: '120개 Ethereum 스마트 컨트랙트 보안 감사. 취약점 탐지(Audit) 정확도 측정.',
            source: 'github.com/openai/evmbench'
        },
        airtbench: {
            name: 'AIRTBench',
            desc: '70개 AI/ML 시스템 대상 자율 레드팀 CTF. 프롬프트 인젝션, 모델 역추론, 시스템 악용 능력 측정.',
            source: 'github.com/dreadnode/AIRTBench-Code'
        },
        autopatchbench: {
            name: 'AutoPatchBench',
            desc: '136개 실제 C/C++ 취약점 자동 패치. Fuzzing + 차분 테스트로 패치 정확성 검증. (CyberSecEval 4)',
            source: 'github.com/facebookresearch/CyberSecEval'
        },
        cybersoceval: {
            name: 'CyberSOCEval',
            desc: '보안 운영센터(SOC) 맬웨어 분석 + 위협 인텔리전스 추론 능력 평가. Meta + CrowdStrike 공동 개발.',
            source: 'github.com/CrowdStrike/CyberSOCEval_data'
        },
        zerodaybench: {
            name: 'ZeroDayBench',
            desc: '미공개 제로데이 취약점 탐지 및 패치 능력. 정보 수준별(zero-day, +CWE, +description) 성공률 측정.',
            source: 'arxiv.org/abs/2603.02297'
        },
        baxbench: {
            name: 'BaxBench',
            desc: '392개 보안-critical 백엔드 코딩 과제. 14개 프레임워크 × 6개 언어. 정확성 + 보안 exploit 동시 평가.',
            source: 'baxbench.com'
        },
        osworld_verified: {
            name: 'OSWorld-Verified',
            desc: '실제 컴퓨터 환경(Ubuntu)에서 오픈엔디드 작업 수행. 멀티모달 에이전트의 GUI/CLI 조작 능력 측정.',
            source: 'os-world.github.io'
        },
        gaia: {
            name: 'GAIA',
            desc: '450+ 비자명 질문. 웹 검색, 파일 처리, 코드 실행 등 도구 활용 + 다단계 추론 능력 종합 평가.',
            source: 'huggingface.co/spaces/gaia-benchmark'
        },
        browsecomp: {
            name: 'BrowseComp',
            desc: '1,266개 난이도 높은 웹 정보 검색 과제. 지속적 탐색과 정보 종합 능력 측정. OpenAI 개발.',
            source: 'openai.com/index/browsecomp'
        },
        tau_bench: {
            name: 'TAU-bench',
            desc: '항공/리테일/통신 도메인 고객 서비스 에이전트 시뮬레이션. 도구-에이전트-사용자 상호작용 정확도 측정.',
            source: 'sierra.ai/blog/tau-bench'
        },
        metr_time_horizons: {
            name: 'METR Time Horizons',
            desc: 'AI 에이전트가 50% 성공률로 자율 완료할 수 있는 인간 작업 시간 측정. ML 연구/SWE/운영 과제.',
            source: 'metr.org/time-horizons'
        },
        tau2_bench: {
            name: 'τ2-bench',
            desc: 'Tool-Agent-User 상호작용 v2. Retail/Telecom 도메인 고객 서비스 에이전트 시뮬레이션.',
            source: 'sierra-research/tau2-bench'
        },
        webarena: {
            name: 'WebArena',
            desc: '실제 웹 애플리케이션에서 자율 작업 수행. CMS, 이커머스, 포럼 등 다양한 사이트 자동화.',
            source: 'webarena.dev'
        },
        deepsearchqa: {
            name: 'DeepSearchQA',
            desc: '다단계 웹 리서치. 깊은 브라우징과 정보 종합이 필요한 복잡한 질문에 대한 F1 점수 측정.',
            source: 'Anthropic internal'
        },
        mcp_atlas: {
            name: 'MCP-Atlas',
            desc: '36개 실제 MCP 서버, 220개 도구를 활용한 1,000개 멀티스텝 워크플로우 작업.',
            source: 'MCP-Atlas benchmark'
        },
        firefox_147: {
            name: 'Firefox 147 Exploitation',
            desc: '실제 브라우저 크래시 입력에서 JS shell exploit 생성. 코드 실행 성공률 측정.',
            source: 'Anthropic internal'
        },
        cyber_range: {
            name: 'Cyber Range',
            desc: '15개 네트워크 공격 시나리오 (C2, SSRF, Binary Exploit, EDR Evasion 등). 시나리오 통과율 측정.',
            source: 'OpenAI internal'
        },
        dfir_metric: {
            name: 'DFIR-Metric',
            desc: '디지털 포렌식 및 사고 대응 능력. Module I (MCQ 지식) + Module II (CTF 포렌식 실습).',
            source: 'DFIR-Metric benchmark'
        },
        evmbench_patch: {
            name: 'EVMbench (Patch)',
            desc: '스마트 컨트랙트 취약점 패치. 기능 보존하면서 보안 수정하는 능력 측정.',
            source: 'github.com/openai/evmbench'
        },
        swe_bench_verified: {
            name: 'SWE-bench Verified',
            desc: '실제 GitHub 이슈를 해결하는 능력 측정. 2,294개 검증된 태스크. 가장 널리 인용되는 코딩 벤치마크.',
            source: 'swebench.com'
        },
        swe_bench_pro: {
            name: 'SWE-bench Pro',
            desc: 'SWE-bench의 고급 버전. 복잡한 multi-step reasoning이 필요한 실제 SW 엔지니어링 과제. Verified의 80%가 Pro에서 46-58% 수준.',
            source: 'labs.scale.com'
        },
        terminal_bench_2: {
            name: 'Terminal-Bench 2.0',
            desc: '89개 Docker 컨테이너 과제 (SWE, 생물학, 보안, 게임). 자율 에이전트의 터미널 환경 작업 수행 능력 측정.',
            source: 'tbench.ai'
        },
        livecodebench: {
            name: 'LiveCodeBench',
            desc: '매월 갱신되는 contamination-free 코딩 벤치마크. 경쟁 프로그래밍 문제 기반 pass@1 정확도 측정.',
            source: 'livecodebench.github.io'
        },
        livecodebench_v6: {
            name: 'LiveCodeBench v6',
            desc: 'LiveCodeBench 6차 갱신본. 2026 경쟁 프로그래밍 문제 포함. Frontier 모델들이 80% 이상 넘어서면서 난이도 상향 필요성 대두.',
            source: 'livecodebench.github.io'
        },
        swe_bench_multilingual: {
            name: 'SWE-bench Multilingual',
            desc: 'SWE-bench 다국어 확장판. Python 외 Java/Go/TS/JS/C++/Rust/C 언어 리포지토리의 실제 GitHub 이슈 해결 능력 측정.',
            source: 'swebench.com'
        },
        cyscenariobench: {
            name: 'CyScenarioBench',
            desc: 'Irregular 팀 개발 멀티 스텝 사이버 공격 시나리오 평균 성공률. GPT-5.5에서 26% (GPT-5.4 9% 대비 +17pt).',
            source: 'Irregular external eval'
        },
        tlo_cyber_range: {
            name: 'The Last Ones (TLO)',
            desc: 'UK AISI 32단계 기업 네트워크 공격 시뮬레이션. 20 human-hour 난이도. GPT-5.5가 pass@10에서 1회 해결.',
            source: 'UK AISI research'
        },
        toolathlon: {
            name: 'Toolathlon',
            desc: '다영역 도구 활용 에이전트 벤치마크. 장기(long-horizon) 워크플로우에서의 도구 선택·연속 호출 정확도 측정. Kimi K2.6 릴리스에서 주요 지표.',
            source: 'Kimi K2.6 release'
        },
        mcpmark: {
            name: 'MCPMark',
            desc: 'Model Context Protocol 기반 에이전트 도구 사용 벤치마크. 다단계 MCP 서버 호출 정확도. Qwen3.6-35B-A3B 릴리스에서 도입.',
            source: 'Qwen3.6 release'
        },
        android_world: {
            name: 'AndroidWorld',
            desc: 'Android 모바일 OS 에이전트 벤치마크. 20개 실제 Android 앱에서 116개 과제 수행. Google Research.',
            source: 'arxiv.org/abs/2405.14573'
        },
        qwen_web_bench: {
            name: 'QwenWebBench',
            desc: 'Alibaba Qwen 팀의 웹 브라우징 에이전트 ELO 평가. 멀티턴 웹 네비게이션 태스크에서의 상대 순위.',
            source: 'Qwen3.6 release'
        },
        nl2repo: {
            name: 'NL2Repo',
            desc: '자연어 → 리포지토리 합성 벤치마크. 단일 함수가 아닌 전체 리포 구조를 NL 명세만으로 생성하는 정확도 측정.',
            source: 'Qwen3.6 release'
        },
        expert_swe: {
            name: 'Expert-SWE',
            desc: 'OpenAI 내부 expert-level 소프트웨어 엔지니어링 벤치마크. SWE-bench 대비 더 어려운 실제 시니어 엔지니어 시나리오.',
            source: 'GPT-5.5 launch'
        },
        openai_ctf_professional: {
            name: 'OpenAI CTF (Professional)',
            desc: 'OpenAI가 직접 큐레이션한 professional-level CTF (web/rev/pwn/crypto/misc). pass@12 over 16 rollouts. Stanford Cybench와 별개의 벤치마크.',
            source: 'System Card Figure 16'
        },
        irregular_atomic_network: {
            name: 'Irregular Atomic — Network Attack',
            desc: 'Irregular(ex-Pattern Labs)의 atomic challenge suite 중 Network Attack Simulation 카테고리. 개별 네트워크 공격 skill을 격리 평가.',
            source: 'Irregular publications'
        },
        irregular_atomic_vuln_research: {
            name: 'Irregular Atomic — Vuln Research',
            desc: 'Irregular atomic challenge의 Vulnerability Research & Exploitation 카테고리. 취약점 발견/익스플로잇 primitive 능력 측정.',
            source: 'Irregular publications'
        },
        irregular_atomic_evasion: {
            name: 'Irregular Atomic — Evasion',
            desc: 'Irregular atomic challenge의 Evasion 카테고리. 탐지 우회 및 방어 도구 회피 skill을 격리 평가.',
            source: 'Irregular publications'
        },
        uk_aisi_narrow_cyber: {
            name: 'UK AISI Narrow Cyber (pass@5)',
            desc: 'UK AI Security Institute의 expert-level narrow cyber 태스크. pass@5 with 50M-token budget per attempt. TLO 32-step range와 별개의 평가.',
            source: 'UK AISI research'
        }
    },

    // frontier models to highlight
    FRONTIER_MODELS: [
        // 2026-06-09 S65 — Claude Fable 5 (SWE-Bench Pro 80.3 NEW SOTA, FrontierCode Diamond 29.3 NEW SOTA) + Mythos 5 (ExploitBench 78 NEW SOTA)
        'anthropic/claude-fable-5',
        'anthropic/claude-mythos-5',
        // 2026-06-19 S136 — LoopCoder-v2 (arxiv 2606.18023 SWE-bench Verified 64.4) + VibeThinker-3B (arxiv 2606.16140 LiveCodeBench v6 80.2 / LeetCode 96.1)
        'multilingual-nlp/loopcoder-v2',
        'weibo/vibethinker-3b',
        // 2026-06-25 S153 — DeepReinforce ORNITH 1.0 family (self-scaffolding agentic coding)
        'deepreinforce-ai/ornith-1.0-397b',  // flagship — TB-2.1 77.5 / SWE-Verified 82.4
        'deepreinforce-ai/ornith-1.0-35b',   // MoE — beats Qwen 3.5-397B on TB-2.1
        'deepreinforce-ai/ornith-1.0-9b',    // edge — matches Gemma 4-31B
        // 2026-06-10 S67 — S66 coding-specialist additions
        'cohere/north-mini-code',                 // Apache 2.0 MoE 30B/3B AAII 28 Coding Index 33.4
        'xai/grok-code-fast-1',                   // AAII 29 coding-focused edge variant
        'anthropic/claude-opus-4.7',
        'anthropic/claude-mythos-preview',
        'anthropic/claude-opus-4.6',
        'anthropic/claude-opus-4.5',
        'anthropic/claude-sonnet-4.6',
        'google/gemini-3.5-flash',
        'google/gemini-3.1-pro',
        'google/gemini-3-pro',
        // 2026-06-25 S148 — GPT-5.6 family (Sol/Terra/Luna)
        'openai/gpt-5.6-sol-ultra', 'openai/gpt-5.6-sol', 'openai/gpt-5.6-terra', 'openai/gpt-5.6-luna',
        'openai/gpt-5.5-instant',
        'openai/gpt-5.5',
        'openai/gpt-5.5-pro',
        'openai/gpt-5.4',
        'openai/gpt-5.4-thinking',
        'openai/gpt-5.3-codex',
        'openai/gpt-5.3-codex-spark',  // 2026-02-24 S146 — >1000 tok/s on Cerebras, $1.75/$14 per Mtok
        'openai/gpt-5.2',
        'openai/gpt-5',
        'xai/grok-4.5',  // 2026-07-08 S175 — SWE-Marathon 29 SOTA, Terminal-Bench 2.1 83.3, SWE-Bench Pro 64.7, SWE-Multilingual 78.0, 4.2x token efficiency vs Opus 4.8
        'xai/grok-4-heavy',
        'xai/grok-4.20',
        'meta/muse-spark',
        'zhipu/glm-5',
        'zhipu/glm-5.1',
        'zhipu/glm-5.2',          // 2026-06-19 S137 — AAII v4.1 51 open-weights SOTA; FrontierSWE 74.4 / Terminal-Bench 2.1 82.7 / SWE-Pro 62.1 / DeepSWE 46.2
        'moonshot/kimi-k3',       // 2026-07-16 S182 — 2.8T MoE; Terminal-Bench 2.1 88.3 / FrontierSWE 81.2 / DeepSWE 67.5 / SWE-Marathon 42
        'tencent/hunyuan-hy3',    // 2026-07-06 S181 — GA 295B-A21B Apache; SWE-Verified 78 / SWE-Pro 57.9 / DeepSWE 28
        'alibaba/qwen3.7-plus',  // 2026-06-02 S46 GA
        'alibaba/qwen3.8-max-preview',  // 2026-07-19 S231 — Terminal-Bench 2.1 86.6, SWE-Bench Pro 67.7, DeepSWE 1.1 56.6
        'microsoft/mai-thinking-1',  // 2026-06-02 S48 — MS MAI Thinking-1 35B/1T MoE
        'microsoft/mai-code-1-flash',  // 2026-06-02 S48 — MS MAI Code-1-Flash 5B
        'microsoft/mai-cyber-1-flash',  // 2026-07-27 S212 — MS cyber-specialized fine-tune of MAI-Code-1-Flash (137B-A5B); CVEBench 31.4 / CRSBench 65.1 / ExploitGym 0 (defensive)
        'google/gemini-3.5-flash-cyber',  // 2026-07 S212d — Google CodeMender-embedded cyber variant of Gemini 3.5 Flash; V8 55 confirmed vulns
        'google/gemma-4-12b',  // 2026-06-03 S50 — Gemma 4 12B encoder-free multimodal
        'alibaba/qwen3.6-plus',
        'alibaba/qwen3.6-27b',
        'alibaba/qwen3.6-35b-a3b',
        'deepseek/deepseek-v4-pro-max',
        'deepseek/deepseek-v4-flash-0731',  // 2026-08-01 S220 — official 0731 release (AA Intelligence Index 50, Cybergym 76.7, DeepSWE 54.4)
        // 2026-08-01 S223 — arxiv 6-mo batch net-new coding/cyber models
        'kuaishou/kat-coder-v2.5',          // SWE-Bench-Pro 65.2, Terminal-Bench 2.1 60.7 (arxiv 2607.05471)
        'iquest/iquest-coder-v1-40b',       // SWE-Verified 76.2, LiveCodeBench-v6 81.1 (arxiv 2603.16733)
        'jetbrains/mellum-2',               // JetBrains 12B-A2.5B code MoE (arxiv 2605.31268)
        'cisco/foundation-sec-8b-reasoning',// Cisco cyber SLM — CTIBench/SecEval/CyberMetric (arxiv 2601.21051)
        'ibm/cyberpal-2.0-20b',             // IBM cyber SLM — CyberMetric-2000 89.05, CISSP 86.87 (arxiv 2510.14113)
        'deepseek/deepseek-v3.2',
        'moonshot/kimi-k2.6',
        'moonshot/kimi-k2.5',
        'moonshot/kimi-k2-thinking',
        'minimax/m3',  // 2026-06-01 S44 GA
        'minimax/m2.7',
        'baidu/ernie-5.0',
        'lg/exaone-4.5-33b',
        'skt/ax-k1',
        // Apr 2026 frontier sweep — coding/agent leaders
        'tencent/hy3-preview',
        'xiaomi/mimo-v2.5-pro',
        'inclusionai/ling-2.6-1t',
        'anthropic/claude-mythos-preview',

        // 2026-06-14 S111 — Cybersecurity benchmark refresh (autonomous cyber agents / pentesting)
        'microsoft/mdash',                  // MDASH CyberGym 96.55 SOTA (Build 2026)
        'team-atlanta/atlantis',            // AIxCC 2025 Final 1st place ($4M, DEF CON 33)
        'trailofbits/buttercup',            // AIxCC 2025 Final 2nd ($3M)
        'theori/roboduck',                  // AIxCC 2025 Final 3rd ($1.5M)
        'xbow/xbow',                        // HackerOne US #1 (first AI 1000+ reports)
        'dcipher/d-cipher',                 // NYU CTF 22.0 / Cybench 22.5 / HackTheBox 44.0
        'xoffense/xoffense',                // AutoPenBench 79.17 (Qwen3-32B, Apr 2026 v2)
        'excalibur/excalibur',              // Pentest agent ($28.50/engagement, Feb 2026)
        'pentestgpt/pentestgpt-v2',         // Pentest agent (v1.0.0 Dec 2025)
        // 2026-06-15 S119 — Edge LLM frontiers (sub-12B coding/reasoning)
        'nvidia/nemotron-nano-9b-v2',       // MATH-500 97.8 / AIME-25 72.1 / LCB 71.1 (hybrid Mamba)
        'ibm/granite-4.1-8b-instruct',      // HumanEval 87.20 / MBPP 82.54 / IFEval 87.06 (enterprise dense leader)
        'microsoft/phi-4-mini-instruct',    // GSM8K 88.6 / MATH 64.0 / MMLU-Pro 52.8 (sub-3B multi-bench)
        'huggingface/smollm3-3b',           // BFCL v3 92.3 — sub-3B tool-use SOTA beats all frontier
        'deepseek/deepseek-r1-distill-qwen-7b',  // MATH-500 92.8 / AIME-24 55.5

        // May 2026 sovereign batch — coding-relevant
        'mistral/mistral-medium-3.5',
        'mistral/mistral-small-4',
        'sber/gigachat-3.1-ultra',
        'sber/gigachat-3.1-lightning',
        'lg/k-exaone-236b',
        'lg/exaone-4.5-33b',
        'skt/ax-k1',
        'kakao/kanana-2-30b-a3b-thinking',
        'upstage/solar-open-100b',
        'tencent/hy3-preview',
        'dicta/dictalm-3.0-24b-thinking',

        // 2026-05-14 — xAI Grok Build CLI launch + GPT-5.5 Codex variant
        // (5-vendor agentic coding CLI race: Claude Code / Codex CLI / Gemini CLI / Qwen Code / Grok Build)
        'xai/grok-build',
        'openai/gpt-5.5-codex',
        // grok-code-fast-1 already in list (was earlier)

        // 2026-05-12 — Microsoft MDASH multi-agent cyber harness (NEW CyberGym SOTA 88.45)
        'microsoft/mdash',

        // 2026-05-14 — Baidu ERNIE 5.1
        'baidu/ernie-5.1',

        // 2026-05-09 — Anthropic safety-strong frontier
        'anthropic/claude-sonnet-4.5',

        // Cyber/coding-specialist variants from TAC program (already partially listed)
        'openai/gpt-5.5-cyber',

        // 2026-06-09 S63 audit propagation — newly ingested cyber/coding-relevant frontier models
        'china-mobile/jt-35b-flash',    // S57 — AAII 36 #1/131 FREE on AA, MoE 35B/3.7B active
        'microsoft/phi-4',              // S60 — 14B AAII 10 base coding LLM
        'microsoft/phi-4-multimodal'    // S60 — 5.6B small frontier with image+audio coding
    ],

    _models: [],
    _benchmarks: [],
    _scores: [],
    _sortStates: {},

    _cycleSort: function(tableId, key, defaultDir) {
        var s = this._sortStates[tableId] || { key: null, dir: null };
        if (s.key !== key) {
            this._sortStates[tableId] = { key: key, dir: defaultDir || 'desc' };
        } else if (s.dir === 'desc') {
            this._sortStates[tableId] = { key: key, dir: 'asc' };
        } else if (s.dir === 'asc') {
            this._sortStates[tableId] = { key: null, dir: null };
        } else {
            this._sortStates[tableId] = { key: key, dir: defaultDir || 'desc' };
        }
    },

    _sortIndicator: function(tableId, key) {
        var s = this._sortStates[tableId];
        if (!s || s.key !== key) return '';
        return s.dir === 'asc' ? ' ▲' : s.dir === 'desc' ? ' ▼' : '';
    },

    _makeSortableTh: function(tableId, key, label, defaultDir, onClick) {
        var th = document.createElement('th');
        th.textContent = label + this._sortIndicator(tableId, key);
        th.style.cursor = 'pointer';
        th.setAttribute('role', 'button');
        th.setAttribute('title', '클릭하여 정렬 (' + (defaultDir === 'asc' ? 'asc → desc → off' : 'desc → asc → off') + ')');
        var s = this._sortStates[tableId];
        if (s && s.key === key) {
            th.style.color = '#3b82f6';
            th.style.fontWeight = 'bold';
        }
        th.addEventListener('click', onClick);
        return th;
    },

    init: function(models, benchmarks, scores) {
        this._models = models;
        this._benchmarks = benchmarks;
        this._scores = scores;
        this._invalidateScoreCache();
        // Reset id->object maps so they rebuild against the new arrays.
        this._benchByIdMap = null;
        this._modelByIdMap = null;
    },

    render: function() {
        // Always refresh from App.data in case init was called before data loaded
        this._models = App.data.models;
        this._benchmarks = App.data.benchmarks;
        this._scores = App.data.scores;

        this._renderBarChart('cyber-chart', this.CYBER_BENCHMARKS, 'Cybersecurity');
        this._renderBarChart('coding-chart', this.CODING_BENCHMARKS, 'Coding');
        this._renderBarChart('defense-chart', this.DEFENSE_BENCHMARKS, 'Cyber Defense');
        this._renderBarChart('agent-chart', this.AGENT_BENCHMARKS, 'Agent');
        this._renderTable('cyber-table-container', this.CYBER_BENCHMARKS);
        this._renderTable('coding-table-container', this.CODING_BENCHMARKS);
        this._renderTable('defense-table-container', this.DEFENSE_BENCHMARKS);
        this._renderTable('agent-table-container', this.AGENT_BENCHMARKS);
        this._renderRadar();
        this._renderPerfSuites();
        this._renderDescriptions();
    },

    _getScoresForBenchmarks: function(benchmarkIds) {
        // Memoize per sorted-bench-list key — same tab re-renders hit cache.
        var key = benchmarkIds.slice().sort().join(',');
        this._scoreCache = this._scoreCache || {};
        if (this._scoreCache[key]) return this._scoreCache[key];
        var result = {};
        // Prefer shared index from App if available — turns O(N×M) into
        // O(matched scores only). Falls back to legacy forEach scan if the
        // index hasn't been built yet (scores still loading).
        var idx = (typeof App !== 'undefined' && App.getScoreIndex) ? App.getScoreIndex() : null;
        if (idx && idx.byBench) {
            benchmarkIds.forEach(function(bid) {
                var rows = idx.byBench[bid];
                if (!rows) return;
                for (var i = 0; i < rows.length; i++) {
                    var s = rows[i];
                    if (!result[s.model_id]) result[s.model_id] = {};
                    result[s.model_id][bid] = s.value;
                }
            });
        } else {
            this._scores.forEach(function(s) {
                if (benchmarkIds.indexOf(s.benchmark_id) === -1) return;
                if (!result[s.model_id]) result[s.model_id] = {};
                result[s.model_id][s.benchmark_id] = s.value;
            });
        }
        this._scoreCache[key] = result;
        return result;
    },

    // Drop the lookup cache whenever init runs (new scores arrived).
    _invalidateScoreCache: function() { this._scoreCache = null; },

    _getModelName: function(modelId) {
        var m = this._modelById(modelId);
        return m ? m.name : modelId.split('/').pop();
    },

    // O(1) score lookup via the shared index instead of an O(N) scan of ~18K
    // scores. The matrix render calls this inside nested benchmark×model loops
    // (tens of thousands of times); the linear .find made the tab take ~11s.
    _scoreEntry: function(mid, bid) {
        var idx = (typeof App !== 'undefined' && App.getScoreIndex) ? App.getScoreIndex() : null;
        if (idx && idx.byModelBench) return idx.byModelBench[mid + '|' + bid] || null;
        return this._scores.find(function(x) { return x.model_id === mid && x.benchmark_id === bid; }) || null;
    },

    // O(1) id->object lookups (maps built once per init) instead of O(N) .find
    // scans over ~3.9K benchmarks / ~4.7K models inside the render loops and
    // sort comparators — the remaining ~3.6s of the Cyber & Coding render.
    _benchById: function(bid) {
        if (!this._benchByIdMap) {
            var map = {}; (this._benchmarks || []).forEach(function(b) { map[b.id] = b; });
            this._benchByIdMap = map;
        }
        return this._benchByIdMap[bid] || null;
    },
    _modelById: function(mid) {
        if (!this._modelByIdMap) {
            var map = {}; (this._models || []).forEach(function(m) { map[m.id] = m; });
            this._modelByIdMap = map;
        }
        return this._modelByIdMap[mid] || null;
    },

    _renderBarChart: function(containerId, benchmarkIds, title) {
        var el = document.getElementById(containerId);
        if (!el) return;
        var chart = echarts.init(el);

        var modelScores = this._getScoresForBenchmarks(benchmarkIds);
        var self = this;

        // Exclude count-type benchmarks — a single Glasswing 6,202 row or
        // Tulongfeng 3,432 row destroys the y-axis for 0-100% benches.
        // Three-layer filter: (1) metric/unit metadata tags, (2) name keywords
        // for benches whose metadata is mistagged ('glasswing_critical_vulns_
        // found_per_month' has metric=score but contains counts), (3) actual
        // score magnitude as last-resort sanity bound.
        var COUNT_NAME_PAT = /(count|cumulative|discovered|found|patches|assignments|projects|bugs|cve\/?ghsa)/i;
        function isPercentLike(bid) {
            var b = self._benchmarks && self._benchById(bid);
            if (!b) return true;  // assume % if metadata missing
            var unit = (b.unit || '').toLowerCase();
            if (unit === 'count' || unit === 'usd' || unit === 's' || unit === 'sec' || unit === 'tokens') return false;
            var metric = (b.metric || '').toLowerCase();
            if (/_count$/.test(metric) || /count$/.test(metric)) return false;
            if (/_usd$/.test(metric) || /^cost/.test(metric)) return false;
            // Layer 2: name-pattern fallback for mistagged metric metadata.
            if (b.name && COUNT_NAME_PAT.test(b.name)) return false;
            // Layer 3: magnitude check — any score above 200 on a non-Elo
            // bench is almost certainly a count (Elo ranges live in /elo|arena/).
            var scores = (modelScores && Object.keys(modelScores)
                .map(function(mid) { return modelScores[mid] && modelScores[mid][bid]; })
                .filter(function(v) { return typeof v === 'number'; })) || [];
            if (scores.length && Math.max.apply(null, scores) > 200) {
                var nm = (b.name || '').toLowerCase();
                if (!/elo|arena|rating/.test(nm)) return false;
            }
            return true;
        }
        var droppedBids = benchmarkIds.filter(function(bid) { return !isPercentLike(bid); });
        var percentBids = benchmarkIds.filter(isPercentLike);

        // Benchmark-centric grouping: x-axis = benchmarks, series = top models.
        // Filter benchmarks that have at least one score, ordered by coverage
        // (most-evaluated first) so the densest columns sit on the left.
        var benchWithCoverage = percentBids.map(function(bid) {
            var count = 0;
            Object.keys(modelScores).forEach(function(mid) {
                if (modelScores[mid] && modelScores[mid][bid]) count++;
            });
            return { bid: bid, count: count };
        }).filter(function(x) { return x.count > 0; });
        benchWithCoverage.sort(function(a, b) { return b.count - a.count; });
        var activeBids = benchWithCoverage.map(function(x) { return x.bid; });

        // Filter to frontier models with ≥1 score across this benchmark set.
        var modelIds = this.FRONTIER_MODELS.filter(function(mid) {
            return modelScores[mid] && activeBids.some(function(bid) { return modelScores[mid][bid]; });
        });

        // Sort models by average score across the benchmark set, keep top-8
        // so the grouped-bar legend stays legible (7±2 rule).
        modelIds.sort(function(a, b) {
            var avgA = 0, cntA = 0, avgB = 0, cntB = 0;
            activeBids.forEach(function(bid) {
                if (modelScores[a] && modelScores[a][bid]) { avgA += modelScores[a][bid]; cntA++; }
                if (modelScores[b] && modelScores[b][bid]) { avgB += modelScores[b][bid]; cntB++; }
            });
            return (cntB ? avgB / cntB : 0) - (cntA ? avgA / cntA : 0);
        });
        modelIds = modelIds.slice(0, 8);

        var benchNames = activeBids.map(function(bid) {
            var b = self._benchById(bid);
            return b ? b.name : bid;
        });

        // One series per MODEL. Each series has a value for each benchmark on
        // the x-axis. ECharts renders clustered bars grouped by x-category,
        // so every benchmark column shows top-N models side-by-side.
        var modelNames = modelIds.map(function(mid) { return self._getModelName(mid); });
        var series = modelIds.map(function(mid, i) {
            return {
                name: modelNames[i],
                type: 'bar',
                data: activeBids.map(function(bid) {
                    return (modelScores[mid] && modelScores[mid][bid]) || 0;
                }),
                itemStyle: { color: Theme.series[i % Theme.series.length] },
                barGap: '10%'
            };
        });

        var option = {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: {
                data: modelNames,
                textStyle: { color: Theme.textMuted, fontSize: 10 },
                top: 0,
                type: 'scroll'
            },
            grid: { left: 8, right: 16, bottom: 60, top: 40, containLabel: true },
            xAxis: {
                type: 'category',
                data: benchNames,
                axisLabel: {
                    color: Theme.textMuted,
                    fontSize: 9,
                    rotate: 35,
                    interval: 0,
                    formatter: function(val) { return val.length > 22 ? val.slice(0, 20) + '…' : val; }
                },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: series
        };

        chart.setOption(option);
        window.addEventListener('resize', function() { chart.resize(); });
    },

    _renderTable: function(containerId, benchmarkIds) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.textContent = '';

        var modelScores = this._getScoresForBenchmarks(benchmarkIds);
        var self = this;
        var TABLE_ID = containerId;

        // get all models with scores
        var modelIds = Object.keys(modelScores);

        // Apply current sort, or default to descending average across the suite
        var s = this._sortStates[TABLE_ID];
        if (s && s.key && s.dir) {
            modelIds.sort(function(a, b) {
                var va, vb;
                if (s.key === 'model') { va = self._getModelName(a); vb = self._getModelName(b); }
                else { va = modelScores[a][s.key]; vb = modelScores[b][s.key]; }
                var aNull = va == null, bNull = vb == null;
                if (aNull && bNull) return 0;
                if (aNull) return 1;
                if (bNull) return -1;
                if (typeof va === 'string') {
                    return s.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                }
                return s.dir === 'asc' ? va - vb : vb - va;
            });
        } else {
            modelIds.sort(function(a, b) {
                var avgA = 0, cntA = 0, avgB = 0, cntB = 0;
                benchmarkIds.forEach(function(bid) {
                    if (modelScores[a][bid]) { avgA += modelScores[a][bid]; cntA++; }
                    if (modelScores[b][bid]) { avgB += modelScores[b][bid]; cntB++; }
                });
                return (cntB ? avgB / cntB : 0) - (cntA ? avgA / cntA : 0);
            });
        }

        var table = document.createElement('table');
        table.className = 'sota-table text-sm';

        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        hr.appendChild(self._makeSortableTh(TABLE_ID, 'model', 'Model', 'asc', function() {
            self._cycleSort(TABLE_ID, 'model', 'asc');
            self._renderTable(containerId, benchmarkIds);
        }));
        benchmarkIds.forEach(function(bid) {
            var b = self._benchById(bid);
            var label = b ? b.name : bid;
            var th = self._makeSortableTh(TABLE_ID, bid, label, 'desc', (function(localBid) {
                return function() {
                    self._cycleSort(TABLE_ID, localBid, 'desc');
                    self._renderTable(containerId, benchmarkIds);
                };
            })(bid));
            th.style.fontSize = '11px';
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        // find max for each benchmark for highlighting
        var maxes = {};
        benchmarkIds.forEach(function(bid) {
            var max = 0;
            modelIds.forEach(function(mid) {
                if (modelScores[mid][bid] && modelScores[mid][bid] > max) max = modelScores[mid][bid];
            });
            maxes[bid] = max;
        });

        modelIds.forEach(function(mid) {
            var tr = document.createElement('tr');
            var tdName = document.createElement('td');
            tdName.textContent = self._getModelName(mid);
            tdName.style.whiteSpace = 'nowrap';
            tdName.style.cursor = 'pointer';
            tdName.setAttribute('role', 'button');
            tdName.setAttribute('title', mid + ' — 클릭하면 모델 상세');
            tdName.addEventListener('click', (function(modelId) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(modelId);
                };
            })(mid));
            tr.appendChild(tdName);

            benchmarkIds.forEach(function(bid) {
                var td = document.createElement('td');
                td.style.textAlign = 'center';
                var val = modelScores[mid][bid];
                if (val) {
                    td.textContent = val.toFixed(1) + '%';
                    // color based on relative position
                    var ratio = maxes[bid] > 0 ? val / maxes[bid] : 0;
                    if (ratio >= 0.95) {
                        td.style.color = Theme.series[0];
                        td.style.fontWeight = 'bold';
                    } else if (ratio >= 0.8) {
                        td.style.color = Theme.series[1];
                    } else if (ratio >= 0.6) {
                        td.style.color = Theme.series[2];
                    } else {
                        td.style.color = Theme.series[3];
                    }
                    // Clickable \u2192 opens score source detail modal
                    td.style.cursor = 'pointer';
                    td.setAttribute('role', 'button');
                    td.setAttribute('title', '\ud074\ub9ad\ud558\uba74 \uac80\uc99d \uc18c\uc2a4\uc640 \uc218\uc9d1\uc77c \ud45c\uc2dc');
                    td.addEventListener('click', (function(modelId, benchId) {
                        return function() {
                            if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                                Modal.showScoreSource(modelId, benchId);
                            }
                        };
                    })(mid, bid));
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

    _renderRadar: function() {
        var el = document.getElementById('cyber-coding-radar');
        if (!el) return;
        var chart = echarts.init(el);
        var self = this;

        var allBenchmarks = this.CYBER_BENCHMARKS.concat(this.CODING_BENCHMARKS);

        // Pick top frontier models that have the most scores
        var modelScores = this._getScoresForBenchmarks(allBenchmarks);
        var topModels = this.FRONTIER_MODELS.filter(function(mid) {
            if (!modelScores[mid]) return false;
            var cnt = 0;
            allBenchmarks.forEach(function(bid) { if (modelScores[mid][bid]) cnt++; });
            return cnt >= 3;
        }).slice(0, 6);

        // Calculate per-axis max dynamically
        var indicators = allBenchmarks.map(function(bid) {
            var b = self._benchById(bid);
            var name = b ? b.name : bid;
            name = name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ');
            var axisMax = 0;
            topModels.forEach(function(mid) {
                var v = (modelScores[mid] && modelScores[mid][bid]) || 0;
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
                    value: allBenchmarks.map(function(bid) {
                        return (modelScores[mid] && modelScores[mid][bid]) || 0;
                    }),
                    lineStyle: { color: color, width: 2 },
                    itemStyle: { color: color },
                    areaStyle: { color: color, opacity: 0.08 }
                };
            })
        }];

        var option = {
            backgroundColor: 'transparent',
            tooltip: {},
            legend: {
                data: topModels.map(function(mid) { return self._getModelName(mid); }),
                textStyle: { color: Theme.textMuted, fontSize: 11 },
                top: 0
            },
            radar: {
                indicator: indicators,
                shape: 'polygon',
                splitNumber: 5,
                axisName: { color: Theme.textMuted, fontSize: 10 },
                splitLine: { lineStyle: { color: Theme.border } },
                splitArea: { areaStyle: { color: ['transparent'] } },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            series: series
        };

        chart.setOption(option);
        window.addEventListener('resize', function() { chart.resize(); });
    },

    // ─────────────── Performance Suites multi-table leaderboard ───────────────
    _renderPerfSuites: function() {
        var el = document.getElementById('cyber-coding-perf-suites');
        if (!el) return;
        el.textContent = '';
        var self = this;

        // Aggregate all unique benchmark IDs across the suites
        var allBenchIds = this.PERF_SUITES.reduce(function(acc, s) { return acc.concat(s.benchmarks); }, []);
        var allBenchSet = {};
        allBenchIds.forEach(function(b) { allBenchSet[b] = true; });

        // Find every model in DB that has at least one score on a Cyber/Coding/Agent
        // benchmark — covers FRONTIER_MODELS plus any model that scored on these benches.
        var modelsWithScores = {};
        this._scores.forEach(function(s) {
            if (allBenchSet[s.benchmark_id]) modelsWithScores[s.model_id] = true;
        });
        var rowIds = Object.keys(modelsWithScores).filter(function(mid) {
            return self._models.some(function(m) { return m.id === mid; });
        });

        // Summary banner
        var totalScores = 0;
        var benchHits = {};
        this._scores.forEach(function(s) {
            if (allBenchSet[s.benchmark_id] && modelsWithScores[s.model_id]) {
                totalScores++;
                benchHits[s.benchmark_id] = (benchHits[s.benchmark_id] || 0) + 1;
            }
        });
        var activeBenchCount = Object.keys(benchHits).length;
        var summary = document.createElement('p');
        summary.className = 'text-xs text-gray-500 mb-3';
        var sb = document.createElement('strong');
        sb.className = 'text-gray-300';
        sb.textContent = totalScores + ' verified scores';
        summary.appendChild(sb);
        summary.appendChild(document.createTextNode(' across '));
        var sc = document.createElement('strong');
        sc.className = 'text-gray-300';
        sc.textContent = String(activeBenchCount);
        summary.appendChild(sc);
        summary.appendChild(document.createTextNode(' active benchmarks · ' + rowIds.length + ' models · click any score cell for source/history modal · click model name for details'));
        el.appendChild(summary);

        // One table per suite
        this.PERF_SUITES.forEach(function(suite, suiteIdx) {
            var activeBids = suite.benchmarks.filter(function(bid) {
                return rowIds.some(function(mid) {
                    return (self._scoreEntry(mid, bid) != null);
                });
            });
            if (activeBids.length === 0) return;

            var suiteRowIds = rowIds.filter(function(mid) {
                return activeBids.some(function(bid) {
                    return (self._scoreEntry(mid, bid) != null);
                });
            });
            if (suiteRowIds.length === 0) return;

            var TABLE_ID = 'cyber-suite-' + suiteIdx;

            // Pre-build score lookup for this suite via the O(1) index instead
            // of scanning all ~18K scores (with indexOf checks) once per suite.
            var scoreLookup = {};
            suiteRowIds.forEach(function(mid) {
                activeBids.forEach(function(bid) {
                    var e = self._scoreEntry(mid, bid);
                    if (e) {
                        if (!scoreLookup[mid]) scoreLookup[mid] = {};
                        scoreLookup[mid][bid] = e.value;
                    }
                });
            });

            // Apply sort: explicit per-column when set, else default sum-of-scores desc
            var sortS = self._sortStates[TABLE_ID];
            if (sortS && sortS.key && sortS.dir) {
                suiteRowIds.sort(function(a, b) {
                    var va, vb;
                    if (sortS.key === 'model') { va = self._getModelName(a); vb = self._getModelName(b); }
                    else if (sortS.key === 'vendor') {
                        var ma = self._modelById(a);
                        var mb = self._modelById(b);
                        va = ma && ma.vendor ? ma.vendor : '';
                        vb = mb && mb.vendor ? mb.vendor : '';
                    } else {
                        va = scoreLookup[a] ? scoreLookup[a][sortS.key] : null;
                        vb = scoreLookup[b] ? scoreLookup[b][sortS.key] : null;
                    }
                    var aNull = va == null || va === '', bNull = vb == null || vb === '';
                    if (aNull && bNull) return 0;
                    if (aNull) return 1;
                    if (bNull) return -1;
                    if (typeof va === 'string') {
                        return sortS.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
                    }
                    return sortS.dir === 'asc' ? va - vb : vb - va;
                });
            } else {
                suiteRowIds.sort(function(a, b) {
                    var sa = activeBids.reduce(function(acc, bid) {
                        return acc + (scoreLookup[a] && scoreLookup[a][bid] ? scoreLookup[a][bid] : 0);
                    }, 0);
                    var sb2 = activeBids.reduce(function(acc, bid) {
                        return acc + (scoreLookup[b] && scoreLookup[b][bid] ? scoreLookup[b][bid] : 0);
                    }, 0);
                    if (sb2 !== sa) return sb2 - sa;
                    return self._getModelName(a).localeCompare(self._getModelName(b));
                });
            }

            // Cap to top-25 per suite
            var TOP_N = 25;
            var trimmed = suiteRowIds.length > TOP_N;
            if (trimmed) suiteRowIds = suiteRowIds.slice(0, TOP_N);

            // Per-benchmark max for color coding
            var maxes = {};
            activeBids.forEach(function(bid) {
                var max = 0;
                rowIds.forEach(function(mid) {
                    var sc = self._scoreEntry(mid, bid);
                    if (sc && sc.value > max) max = sc.value;
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

            // Table wrapped for horizontal scroll
            var wrap = document.createElement('div');
            wrap.className = 'overflow-x-auto';
            var table = document.createElement('table');
            table.className = 'sota-table text-sm';

            var thead = document.createElement('thead');
            var hr = document.createElement('tr');
            hr.appendChild(self._makeSortableTh(TABLE_ID, 'model', 'Model', 'asc', function() {
                self._cycleSort(TABLE_ID, 'model', 'asc');
                self._renderPerfSuites();
            }));
            var thV = self._makeSortableTh(TABLE_ID, 'vendor', 'Vendor', 'asc', function() {
                self._cycleSort(TABLE_ID, 'vendor', 'asc');
                self._renderPerfSuites();
            });
            thV.style.fontSize = '11px';
            hr.appendChild(thV);
            activeBids.forEach(function(bid) {
                var b = self._benchById(bid);
                var label = b ? b.name : bid;
                var th = self._makeSortableTh(TABLE_ID, bid, label, 'desc', (function(localBid) {
                    return function() {
                        self._cycleSort(TABLE_ID, localBid, 'desc');
                        self._renderPerfSuites();
                    };
                })(bid));
                th.style.fontSize = '10px';
                th.style.whiteSpace = 'nowrap';
                hr.appendChild(th);
            });
            thead.appendChild(hr);
            table.appendChild(thead);

            var tbody = document.createElement('tbody');
            suiteRowIds.forEach(function(mid) {
                var m = self._modelById(mid);
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
                    var scoreEntry = self._scoreEntry(mid, bid);
                    if (scoreEntry) {
                        var v = scoreEntry.value;
                        var bench = self._benchById(bid);
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

    _renderDescriptions: function() {
        var self = this;

        var cyberContainer = document.getElementById('cyber-bench-descriptions');
        if (cyberContainer) {
            cyberContainer.textContent = '';
            this.CYBER_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                cyberContainer.appendChild(div);
            });
        }

        var defenseContainer = document.getElementById('defense-bench-descriptions');
        if (defenseContainer) {
            defenseContainer.textContent = '';
            this.DEFENSE_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                defenseContainer.appendChild(div);
            });
        }

        var agentContainer = document.getElementById('agent-bench-descriptions');
        if (agentContainer) {
            agentContainer.textContent = '';
            this.AGENT_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                agentContainer.appendChild(div);
            });
        }

        var codingContainer = document.getElementById('coding-bench-descriptions');
        if (codingContainer) {
            codingContainer.textContent = '';
            this.CODING_BENCHMARKS.forEach(function(bid) {
                var info = self.BENCH_DESCRIPTIONS[bid];
                if (!info) return;
                var div = document.createElement('div');
                var strong = document.createElement('strong');
                strong.className = 'text-gray-200';
                strong.textContent = info.name;
                div.appendChild(strong);
                div.appendChild(document.createTextNode(' \u2014 ' + info.desc));
                var src = document.createElement('div');
                src.className = 'text-xs text-gray-500 mt-1';
                src.textContent = 'Source: ' + info.source;
                div.appendChild(src);
                codingContainer.appendChild(div);
            });
        }
    }
};
