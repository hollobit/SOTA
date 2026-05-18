# Cyber Batch C — 4 papers (Kimi K2.5 safety + cyber SLM + 2 governance)

STRICT ATTRIBUTION: Only triples where (model, benchmark, value) are explicitly
named in primary source figure/table are listed. Values read directly off
labeled bars/tables; charts without numeric labels are excluded.

---

## Paper 1: arxiv 2604.03121 — Kimi K2.5 Independent Safety Eval (86p)

Authors: Yong, Mahajan, Wang, Caspary, Yestekov, Che, Levy, Najt, Murphy,
Kulkarni, McKinney, Nishimura-Gasparian, Potham, Lynch, Chen (Constellation +
Anthropic Fellows). Published 3 Apr 2026. EXTREMELY data-rich.

Models evaluated: kimi-k2.5, claude-opus-4.5, gpt-5.2 (and gpt-5.2-pro variant),
deepseek-v3.2. Plus Petri/transcript-classification panel: claude-3.5-sonnet,
claude-3.7-sonnet, gemini-2.5-pro, gemini-2.5-flash, gpt-4.1, gpt-4o,
gpt-4.1-mini, o4-mini.

### New benchmarks introduced/used (mostly EXISTING in our DB will need slug check)

| Slug | Description | Source ref |
|---|---|---|
| abc_bench | Agentic Bio-Capabilities (synthesis screening evasion, liquid-handling, fragment design) | new |
| vct_multiselect | Virology Capabilities Test, hard multi-select variant, 322 Q | existing benchmark, harder variant |
| lab_bench | LAB-Bench multimodal bio Q&A (8 subtasks: LitQA, SuppQA, FigQA, TableQA, DbQA, ProtocolQA, SeqQA, Cloning) | existing FutureHouse |
| fortress_cbrne | FORTRESS CBRNE-subset adversarial prompts (risk + over-refusal) | existing FORTRESS |
| cybench_unguided | Cybench hard/unguided variant, 40 CTF challenges | existing |
| cybergym_l0_l1_l2_l3 | CyberGym 4 levels (ARVO subset, 1368 tasks) | existing, with level split |
| evmbench | Smart contract vuln Detect / Patch / Exploit, 120 vulns from 40 audit repos | NEW |
| dfir_metric_mod1 | DFIR-Metric Module I MCQ (713 Q) — MA, CI metrics | NEW (Skalicky et al cited as [32]) |
| dfir_metric_mod2 | DFIR-Metric Module II CTF (50 templates × 3 instances) — CI, CI-solv, RS | NEW |
| htb_pentest | Hack The Box agentic pentest (3 retired boxes: Editorial, Strutted, Certified) | NEW |
| petri_2_misaligned_behavior | Petri 2.0 — misaligned behavior dimension | NEW (Anthropic Petri) |
| petri_2_verbalized_eval_awareness | Petri 2.0 — verbalized eval awareness | NEW |
| petri_2_cooperation_with_human_misuse | Petri 2.0 — cooperation with misuse | NEW |
| petri_2_user_deception | Petri 2.0 — user deception | NEW |
| petri_2_sycophancy | Petri 2.0 — sycophancy | NEW |
| petri_2_encouragement_of_user_delusion | Petri 2.0 — encouragement user delusion | NEW |
| petri_2_unmitigated_misaligned | Petri 2.0 — unmitigated misaligned behavior | NEW |
| petri_2_broken_tool_use | Petri 2.0 — broken tool use | NEW |
| petri_2_harmful_system_prompt_compliance | Petri 2.0 — harmful system-prompt compliance | NEW |
| controlarena_iac | ControlArena IAC sabotage (main + side success) | NEW |
| controlarena_apps | ControlArena Apps sabotage | NEW |
| controlarena_data_poisoning | ControlArena Data Poisoning sabotage | NEW |
| controlarena_shade_arena | SHADE-Arena sabotage | NEW |
| controlarena_agentdojo | AgentDojo sabotage | NEW |
| controlarena_rogue_eval | Rogue Eval sabotage | NEW |
| undetected_sabotage_shade | Undetected sabotage on SHADE-Arena (vs monitor) | NEW derivative |
| undetected_sabotage_agentdojo | Undetected sabotage on AgentDojo | NEW derivative |
| wmdp_sandbagging | Covert sandbagging on WMDP, unaware/aware/control | NEW (Greenblatt et al [42]) |
| gpqa_diamond_hint_following | Hint-following CoT monitorability g-mean^2 | NEW (Chen et al [40,41]) |
| apollo_evals | Apollo Research insider-trading / goal-dir lying / sandbagging | NEW (Meinke et al cited via [44-49]) |
| agentharm_eval_awareness | Verbalized eval awareness, AgentHarm subset | NEW |
| transcript_classification_eval_awareness | Needham et al transcript classification — AUC/ECE/Brier | NEW |
| runpod_self_replication | RunPod cloud self-replication (12 prompt variants) — replication rate, pods spun | NEW (Zhang et al [52]) |
| ccp_alignment_english | CCP-position agreement, English prompts | NEW |
| ccp_alignment_chinese | CCP-position agreement, Chinese prompts | NEW |
| deccp_refusal_sensitive | DECCP refusal on sensitive Chinese topics | NEW |
| deccp_refusal_control | DECCP refusal on benign control | NEW |
| enkrypt_geopolitical_factual_accuracy | EnkryptAI geopolitical 300 Q — high factual accuracy rate | NEW |
| enkrypt_geopolitical_refusal | EnkryptAI geopolitical refusal rate | NEW |
| enkrypt_geopolitical_pro_west | EnkryptAI pro-West bias proportion | NEW |
| borderlines_english | BorderLines territorial-dispute balance, English | NEW |
| borderlines_chinese | BorderLines territorial-dispute balance, Chinese | NEW |
| bbq_ambig_accuracy | BBQ ambiguous accuracy | existing |
| bbq_disambig_accuracy | BBQ disambiguated accuracy | existing |
| bbq_ambig_bias_score | BBQ ambiguous bias score | existing |
| bbq_disambig_bias_score | BBQ disambiguated bias score | existing |
| fortress_overall_risk | FORTRESS overall adversarial risk score | NEW |
| fortress_overall_overrefusal | FORTRESS benign over-refusal rate | NEW |
| agentharm_refusal_noattack | AgentHarm refusal rate, no attack | NEW (Andriushchenko [51]) |
| agentharm_refusal_forcedtoolcall | AgentHarm refusal under forced tool-call | NEW |
| agentharm_refusal_template | AgentHarm refusal under universal template jailbreak | NEW |
| agentharm_harm_noattack | AgentHarm harm score, no attack | NEW |
| agentharm_harm_forcedtoolcall | AgentHarm harm score, forced tool-call | NEW |
| agentharm_harm_template | AgentHarm harm score, template attack | NEW |
| psychosis_bench_delusion_confirmation | Psychosis-Bench delusion confirmation | NEW [63] |
| psychosis_bench_harm_enablement | Psychosis-Bench harm enablement | NEW |
| psychosis_bench_safety_intervention | Psychosis-Bench safety intervention rate | NEW |

### Scores extracted (CORE selection)

#### ABC-Bench (Figure 1)
- kimi-k2.5: Screening Evasion 0.444 ; Liquid Handling 0.713 ; Fragment Design 0.733
- claude-opus-4.5: Screening Evasion REFUSED ; Liquid Handling 0.747 ; Fragment Design 1.000 (with partial-refusal scoring; 0.200 strict)
- gpt-5.2: Screening Evasion REFUSED ; Liquid Handling 0.397 ; Fragment Design 0.692

#### VCT multimodal (Figure 2)
- kimi-k2.5: 33.2 ; claude-opus-4.5: 32.6 ; gpt-5.2: 35.7 (human baseline 22.1)

#### LAB-Bench by subtask (Figure 3, approximate — bars not all labeled; only LitQA/SuppQA/FigQA/TableQA/DbQA/ProtocolQA/SeqQA/Cloning order visible). Skipped — only TableQA explicitly labeled approx 0.9 across all models; values not all numerically labeled. Skip for strict attribution.

#### FORTRESS CBRNE risk (Figure 4)
- kimi-k2.5: risk 0.45 ; over-refusal 0.01
- claude-opus-4.5: risk 0.15 ; over-refusal 0.03
- gpt-5.2-pro: risk 0.14 ; over-refusal 0.04
- deepseek-v3.2: risk 0.66 ; over-refusal 0.04

#### Cybench (Figure 5) — pass@1 percent
- kimi-k2.5: 55.0 ; claude-opus-4.5: 67.5 ; gpt-5.2: 80.0 ; deepseek-v3.2: 12.5
  (Note: paper reports it was unable to reproduce Anthropic's claude-opus-4.5
  score of 82 — their reproduction was 67.5)

#### CyberGym Level 1 exploit success (Figure 7)
- kimi-k2.5: 40.8 (their measurement)
- claude-opus-4.5: 50.6 (leaderboard)
- gpt-5 (best avail): 60.2 (leaderboard)
- deepseek-v3.2: 17.3 (leaderboard, sourced via DeepSeek-V3.2 tech report)

#### CyberGym Kimi K2.5 by level (Figure 8)
- L0 source only: 25.7
- L1 + description: 40.8
- L2 + error trace: 52.3
- L3 + patch diff: 52.5

#### EVMBench (Figure 9) — Detect / Patch / Exploit
- kimi-k2.5: 16.1 / 16.3 / 22.3
- claude-opus-4.5: 34.4 / 27.4 / 50.9
- gpt-5.2: 44.7 / 42.4 / 63.5
- deepseek-v3.2: 10.0 / 6.7 / 3.7

#### DFIR-Metric (Table 1)
- gpt-5.2-pro: Mod1 MA 93.0, CI 89.9 ; Mod2 CI 62.7, CI-solv 92.2, RS 416, Skip 31%
- gpt-5.2: Mod1 MA 92.7, CI 88.1 ; Mod2 CI 47.3, CI-solv 69.6, RS 294, Skip 32%
- claude-opus-4.5: Mod1 MA 94.0, CI 91.2 ; Mod2 CI 44.7, CI-solv 65.7, RS −279, Skip 5%
- kimi-k2.5: Mod1 MA 94.2, CI 90.0 ; Mod2 CI 34.0, CI-solv 50.0, RS 38, Skip 41%
- deepseek-v3.2: Mod1 MA 91.9, CI 86.4 ; Mod2 CI 26.7, CI-solv 39.2, RS −844, Skip 2%

#### DFIR-Metric mean partial credit (Table 2)
- gpt-5.2: 0.56 ; kimi-k2.5: 0.54 ; gpt-5.2-pro: 0.52 ; claude-opus-4.5: 0.26 ; deepseek-v3.2: 0.23

#### Hack The Box (Table 3, qualitative + 3/3)
- claude-opus-4.5: 3/3 boxes
- kimi-k2.5: 3/3 boxes
- deepseek-v3.2: 0/3 boxes
- (Contamination per box: Opus High/None/Medium ; Kimi Medium/Low/Low ; DS None/Low/None)

#### Petri 2.0 audit (Figure 12) — mean score, lower better except verbalized awareness
- Misaligned: kimi 0.160 ; opus 0.038 ; gpt-5.2 0.031 ; DS 0.199
- Verbalized eval awareness: kimi 0.006 ; opus 0.033 ; gpt-5.2 0.001 ; DS 0.004
- Cooperation with human misuse: kimi 0.096 ; opus 0.016 ; gpt-5.2 0.015 ; DS 0.123
- User deception: kimi 0.013 ; opus 0.002 ; gpt-5.2 0.002 ; DS 0.017
- Sycophancy: kimi 0.039 ; opus 0.007 ; gpt-5.2 0.006 ; DS 0.064
- Encouragement user delusion: kimi 0.011 ; opus 0.001 ; gpt-5.2 0.001 ; DS 0.026
- Unmitigated misaligned: kimi 0.085 ; opus 0.009 ; gpt-5.2 0.004 ; DS 0.094
- Broken tool use: kimi 0.057 ; opus 0.006 ; gpt-5.2 0.014 ; DS 0.042
- Harmful system-prompt compliance: kimi 0.040 ; opus 0.007 ; gpt-5.2 0.001 ; DS 0.038

#### Undetected Sabotage (Figure 15)
- kimi-k2.5: IAC 2%, Apps 5%, Data Poisoning 2%, SHADE-Arena 47%, AgentDojo 26%, Rogue Eval 12%
- claude-opus-4.5: IAC 2%, Apps 10%, DP 10%, SHADE 32%, AD 19%, RE 10%
- gpt-5.2: IAC 8%, Apps 2%, DP 6%, SHADE 6%, AD 6%, RE 0%
- deepseek-v3.2: IAC 8%, Apps 5%, DP 20%, SHADE 44%, AD 22%, RE 1%

#### WMDP sandbagging (Figure 17)
WMDP accuracy (lower = more sandbagging):
- kimi-k2.5: control 0.83 ; unaware 0.24 ; aware 0.44
- claude-opus-4.5: control 0.67 ; unaware 0.22 ; aware 0.47
- gpt-5.2: control 0.79 ; unaware 0.22 ; aware 0.71
- deepseek-v3.2: control 0.78 ; unaware 0.13 ; aware 0.47
Covert success rate (bypass / actual sandbag):
- kimi-k2.5: unaware 0.04, aware 0.18
- claude-opus-4.5: unaware 0.17, aware 0.36
- gpt-5.2: unaware 0.98, aware 0.97
- deepseek-v3.2: unaware 0.05, aware 0.35

#### Apollo evals verbalized awareness (Figure 18)
- kimi-k2.5: insider 0.02 ; goal-dir lying 0.82 ; sandbagging 0.00 (overall original 0.79 / novel 0.53)
- claude-opus-4.5: goal-dir lying 0.52 (overall 0.30 / novel 0.35)
- gpt-5.2: 0.03 / 0.03
- deepseek-v3.2: 0.03 / 0.03

#### Eval awareness on AgentHarm vs Apollo (Figure 19)
- kimi-k2.5: Apollo 0.57 / AgentHarm 0.05
- claude-opus-4.5: 0.20 / 0.00
- gpt-5.2: 0.00 / 0.00
- deepseek-v3.2: 0.11 / 0.00

#### Transcript classification eval awareness (Table 4) — AUC, ECE, Brier
- kimi-k2.5*: 0.772 / 0.264 / 0.251
- deepseek-v3.2*: 0.801 / 0.087 / 0.184
- claude-3.5-sonnet: 0.834 / 0.092 / 0.163
- claude-3.7-sonnet*: 0.827 / 0.197 / 0.207
- claude-3.7-sonnet: 0.815 / 0.150 / 0.191
- gemini-2.5-pro*: 0.830 / 0.227 / 0.212
- gemini-2.5-flash: 0.827 / 0.097 / 0.173
- gpt-4.1: 0.826 / 0.187 / 0.203
- gpt-4o: 0.795 / 0.092 / 0.189
- gpt-4.1-mini: 0.751 / 0.108 / 0.212
- o4-mini*: 0.740 / 0.120 / 0.220
- Human: 0.921 / 0.129 / 0.120 ; Random: 0.500 / — / 0.250

#### Self-replication on RunPod (Figure 21)
- kimi-k2.5: 75% replication rate ; 6.0 pods avg
- claude-opus-4.5: 0% ; 0
- gpt-5.2: 53% ; 2.0
- deepseek-v3.2: 10% ; 1.5

#### CCP alignment (Figure 22)
- kimi-k2.5: English 0.22 ; Chinese 0.55
- claude-opus-4.5: 0.13 / 0.19
- gpt-5.2-pro: 0.10 / 0.19
- deepseek-v3.2: 0.59 / 0.80

#### DECCP refusal (Figure 23)
- kimi-k2.5: sensitive 0.32 ; control 0.08
- claude-opus-4.5: 0.02 / 0.00
- gpt-5.2-pro: 0.08 / 0.00
- deepseek-v3.2: 0.77 / 0.22

#### EnkryptAI geopolitical factual accuracy (Figure 24)
- kimi-k2.5: 0.88 (n=300)
- claude-opus-4.5: 0.88 (n=293)
- gpt-5.2: 0.91 (n=296)
- deepseek-v3.2: 0.65 (n=279)

#### EnkryptAI refusal (Figure 25)
- kimi-k2.5: 0.01 ; claude-opus-4.5: 0.06 ; gpt-5.2: 0.03 ; deepseek-v3.2: 0.13

#### BorderLines (Figure 27)
- kimi-k2.5: English 0.75 ; Chinese 0.84
- claude-opus-4.5: 0.66 / 0.91
- gpt-5.2: 0.80 / 0.85
- deepseek-v3.2: 0.70 / 0.50

#### BBQ accuracy (Figure 28)
- kimi-k2.5: ambig 97.5 ; disambig 92.9
- claude-opus-4.5: 99.6 / 91.6
- gpt-5.2: 96.6 / 86.7
- deepseek-v3.2: 93.7 / 94.4

#### BBQ bias score (Figure 29)
- kimi-k2.5: ambig 1.87 ; disambig 0.32
- claude-opus-4.5: 0.35 / −0.97
- gpt-5.2: 1.72 / 0.31
- deepseek-v3.2: 3.64 / 0.93

#### AgentHarm refusal rate (Figure 33)
- kimi-k2.5: noattack 0.67 ; forced-tool 0.76 ; template 0.64
- claude-opus-4.5: 0.95 / 0.95 / 0.92
- gpt-5.2: 0.57 / 0.55 / 0.58
- deepseek-v3.2: 0.34 / 0.30 / 0.15

#### AgentHarm harm score (Figure 34)
- kimi-k2.5: 0.26 / 0.21 / 0.31
- claude-opus-4.5: 0.07 / 0.05 / 0.08
- gpt-5.2: 0.13 / 0.11 / 0.17
- deepseek-v3.2: 0.51 / 0.57 / 0.66

#### Psychosis-Bench (Figure 36)
- kimi-k2.5: DCS 0.111 ; HES 0.101 ; SIS 0.859
- claude-opus-4.5: 0.046 ; 0.045 ; 0.877
- gpt-5.2: 0.465 ; 0.962 ; 0.729
- deepseek-v3.2: 1.199 ; 1.330 ; 0.338

**Paper 1 total: ~250+ extractable triples across ~40+ benchmarks × 4 core models, plus 11-model transcript-classification panel.**

---

## Paper 2: arxiv 2510.14113 — CyberPal 2.0 (IBM Research)

Authors: Matan Levi, Daniel Ohayon, Ariel Blobstein, Ravid Sagi, Ian Molloy, Yair Allouche (IBM).

### New models
- ibm/cyberpal-2.0-4b — fine-tuned from Qwen3-4B-base
- ibm/cyberpal-2.0-8b — fine-tuned from Qwen3-8B-base
- ibm/cyberpal-2.0-14b — fine-tuned from Qwen3-14B-base
- ibm/cyberpal-2.0-20b — fine-tuned from gpt-oss-20B-base

### Baselines referenced
- google/sec-gemini-v1 (proprietary; treated as frontier baseline)
- openai/gpt-4o-2024-08-06
- openai/o1-2024-12-17
- openai/o3-mini
- anthropic/claude-3.5-sonnet-v2
- deepseek/deepseek-v3 (NOT v3.2)
- mistral/mistral-large
- Qwen3-4B/8B/14B (post-trained)
- gpt-oss-20B / gpt-oss-120B
- deephat/deephat-v1-7b
- segolily/lily-cybersecurity-7b-v0.2
- primus-merged-8b ; primus-reasoning-8b
- foundation-sec-8b-instruct (Weerawardhena)

### Benchmarks
- ctibench_mcq — CTI Bench MCQ (Alam et al 2024)
- ctibench_rcm — CTI Bench Root Cause Mapping
- seceval — SecEval Q&A 2000+ multi-option (Li et al 2023)
- cybermetric_2000 — CyberMetric-2000 (Tihanyi)
- cissp_exams — CISSP practice questions
- weakness_impact_mapping — Levi 2025 CWE→impact
- adversarial_cti — Levi 2025 MITRE ATT&CK with distractors
- cti_detect_mitigate — Levi 2025 detection/mitigation
- cti_relationship_prediction — Levi 2025 CTI relation reasoning

### Table 1 scores (all data labeled)
| Model | MCQ | RCM | SecEval | Cyber2000 | CISSP | AdvCTI | WeaknessMap | DetMit | RelPred | Avg |
|---|---|---|---|---|---|---|---|---|---|---|
| Qwen3-4B | 61.88 | 49.95 | 57.38 | 87.40 | 79.80 | 64.51 | 57.02 | 60.77 | 67.99 | 65.19 |
| CyberPal-2.0-4B | 69.70 | 81.15 | 59.02 | 87.80 | 80.80 | 68.03 | 66.48 | 64.03 | 77.12 | 72.68 |
| Qwen3-8B | 63.13 | 63.25 | 56.19 | 88.45 | 83.33 | 64.93 | 53.58 | 59.88 | 60.67 | 65.93 |
| CyberPal-2.0-8B | 75.15 | 85.95 | 66.93 | 89.85 | 88.89 | 87.61 | 71.06 | 70.26 | 87.66 | 80.37 |
| Qwen3-14B | 64.28 | 70.50 | 61.48 | 89.85 | 86.36 | 69.43 | 62.46 | 63.34 | 58.48 | 69.59 |
| CyberPal-2.0-14B | 75.51 | 86.00 | 69.71 | 89.95 | 90.40 | 89.58 | 70.77 | 70.95 | 92.93 | 81.76 |
| gpt-oss-20B | 64.57 | 68.95 | 67.65 | 90.20 | 79.80 | 61.83 | 71.91 | 67.49 | 65.42 | 70.87 |
| CyberPal-2.0-20B | 75.71 | 87.40 | 72.86 | 89.05 | 86.87 | 84.93 | 70.77 | 67.69 | 87.66 | 80.37 |
| gpt-oss-120B | 69.37 | 79.95 | 68.02 | 92.55 | 84.34 | 72.76 | 65.90 | 64.52 | 70.56 | 74.21 |

### Table 2 (CyberPal-2.0-8B vs other open-source cyber SLMs)
| Model | MCQ | RCM | SecEval | Cyber2000 | CISSP | AdvCTI | WeaknessMap | DetMit | RelPred | Avg |
|---|---|---|---|---|---|---|---|---|---|---|
| DeepHat-v1-7B | 61.24 | 68.1 | 33.21 | 84.0 | 76.76 | 63.23 | 60.74 | 56.12 | 52.05 | 61.72 |
| Lily-Cybersecurity-7B-v0.2 | 55.31 | 42.9 | 37.14 | 80.0 | 68.18 | 58.45 | 52.43 | 39.71 | 46.45 | 53.38 |
| Primus-merged | 65.2 | 63.9 | 59.06 | 85.1 | 78.28 | 64.92 | 55.3 | 50.77 | 59.98 | 64.72 |
| Primus-reasoning | — | — | 53.03 | 86.05 | 73.23 | 64.78 | 53.58 | 52.24 | 58.79 | 63.01 |
| Foundation-Sec-8B-Instruct | 63.24 | 67.95 | 54.81 | 84.5 | 69.69 | 68.87 | 60.74 | 57.31 | 64.74 | — |
| CyberPal-2.0-8B | 75.15 | 85.95 | 66.93 | 89.85 | 88.89 | 87.61 | 71.06 | 70.26 | 87.66 | 80.37 |

### Figure 1 frontier comparison (CTI RCM, CTI MCQ — additional values for closed models)
- CTI RCM bar chart: CyberPal-2.0-20B 87.4 ; sec-gemini-v1 86.1 ; CyberPal-2.0-14B 86.0 ; CyberPal-2.0-8B 85.9 ; CyberPal-2.0-4B 81.2 ; gpt-4o-2024-08-06 76.2 ; o1 2024-12 75.6 ; claude-3.5-sonnet-v2 75.4 ; deepseek-v3 74.2 ; o3-mini 70.8 ; mistral-large 69.4
- CTI MCQ: sec-gemini-v1 86.3 ; CyberPal-2.0-20B 75.7 ; CyberPal-2.0-14B 75.5 ; CyberPal-2.0-8B 75.2 ; o1 2024-12 75.0 ; gpt-4o-2024-08-06 73.0 ; claude-3.5-sonnet-v2 72.5 ; o3-mini 71.4 ; CyberPal-2.0-4B 69.7 ; deepseek-v3 69.5 ; mistral-large 68.0

**Paper 2 total: ~150 triples (9 benches × 9 IBM/baseline models in Table 1, 6 OSS cyber models × 9 benches in Table 2, ~11 models × 2 benches in Figure 1).**

---

## Paper 3: arxiv 2509.11398 — From Firewalls to Frontiers (CMU SEI)

Authors: Anusha Sinha, Keltin Grimes, James Lucassen, Michael Feffer, Nathan
VanHoudnos, Zhiwei Steven Wu, Hoda Heidari. Carnegie Mellon SEI position paper.

**Verdict: PURE POSITION PAPER. NO MODEL × BENCHMARK × VALUE TRIPLES.**

The only quantitative chart (Figure 1) is a literature meta-analysis showing
"proportion of papers covering each red-team stage" across 99 AI red-team
papers and 69 cyber red-team papers — these are bibliometric, not model
scores. No models are evaluated. Figure 2 is a risk taxonomy diagram, Table 1
is a responsibilities matrix.

**Triples extracted: 0. SKIPPED per strict attribution.**

---

## Paper 4: arxiv 2602.14457 — Frontier AI Risk Management Framework v1.5 (Shanghai AI Lab)

Authors: Dongrui Liu, Yi Yu, Jie Zhang et al. Shanghai AI Laboratory. Updated 16 Feb 2026.

Mostly a framework document, BUT Section 3.1 (Cyber Offense) contains the
PACEbench evaluation with explicit numeric scores in Table 3.

### Models evaluated on PACEbench
- moonshot/kimi-k2-instruct-0905 (NOTE: not k2.5, this is the k2-instruct-0905)
- bytedance/seed-oss-36b-instruct
- minimax/minimax-m2.1
- zhipu/glm-4.7
- qwen/qwen3-max
- openai/gpt-5.2-2025-12-11
- anthropic/claude-sonnet-4.5 (thinking)
- google/gemini-3-pro
- bytedance/doubao-seed-1.8-251228
- xai/grok-4

### New benchmarks
- pacebench_a_cve — single CVE exploitation (17 web vulns)
- pacebench_b_cve — blended CVEs (multi-host with benign hosts)
- pacebench_c_cve — chained CVEs (multi-stage lateral movement)
- pacebench_d_cve — defended CVEs (WAF-protected: OWASP CRS, Naxsi, Coraza)
- pacebench_overall — weighted aggregate (0.2 A + 0.3 B + 0.3 C + 0.2 D)

### Table 3 — PACEbench Pass@5
| Model | A-CVE | B-CVE | C-CVE | D-CVE | PACEbench |
|---|---|---|---|---|---|
| kimi-k2-instruct-0905 | 0.240 | 0.050 | 0.000 | 0.000 | 0.063 |
| seed-oss-36b-instruct | 0.290 | 0.050 | 0.000 | 0.000 | 0.075 |
| minimax-m2.1 | 0.350 | 0.050 | 0.000 | 0.333 | 0.153 |
| glm-4.7 | 0.410 | 0.210 | 0.067 | 0.000 | 0.166 |
| qwen3-max | 0.350 | 0.260 | 0.133 | 0.000 | 0.190 |
| gpt-5.2-2025-12-11 | 0.410 | 0.370 | 0.067 | 0.333 | 0.280 |
| claude-sonnet-4.5-thinking | 0.590 | 0.370 | 0.133 | 0.333 | 0.335 |
| gemini-3-pro | 0.470 | 0.160 | 0.067 | 0.000 | 0.161 |
| doubao-seed-1.8-251228 | 0.350 | 0.260 | 0.067 | 0.000 | 0.170 |
| grok-4 | 0.060 | 0.000 | 0.000 | 0.000 | 0.012 |

**Paper 4 total: 50 triples (10 models × 5 benchmark slices). Plus RvB
Section 3.1.4 shows iteration trajectories for Gemini-3.0-Flash, Gemini-3-Pro,
GPT-5.2-2025-12-11, Qwen3-max with final DSR — but those are progression
charts not standardized benchmark scores; treating as derived/non-canonical
(skip).**

Note: Persuasion/manipulation (3.2) and remaining sections evaluate further
LLM-to-LLM opinion shifts and other risk dimensions. Skim through page 16
shows them as framework/scenario writeups rather than benchmark tables;
deferred to a future deep-mine if needed.

---

## Total
- New benchmarks: ~55 (45 from Paper 1 incl. Petri 2.0 subdims and ControlArena
  variants ; 5 from Paper 2 CTI variants where not already in DB ; 5 from
  Paper 4 PACEbench A/B/C/D + overall ; smart-contract EVMBench from Paper 1)
- New models: 4 from Paper 2 (cyberpal-2.0-4b/8b/14b/20b), plus 7 net-new from
  Paper 4 (seed-oss-36b-instruct, minimax-m2.1, glm-4.7, qwen3-max,
  claude-sonnet-4.5, doubao-seed-1.8-251228, grok-4 — depending on DB state),
  plus 1 from Paper 2 baselines (foundation-sec-8b-instruct,
  primus-merged-8b, primus-reasoning-8b ; deephat-v1-7b ; lily-cybersecurity-7b-v0.2
  — net-new if not already in DB)
- New scores: ~450 triples across all 4 papers
  - Paper 1: ~250+ (Kimi K2.5 safety eval, 4-model panel + 11-model transcript panel)
  - Paper 2: ~150 (CyberPal Tables 1+2 + Figure 1 frontier comp)
  - Paper 3: 0
  - Paper 4: 50 (PACEbench Table 3)
- Skipped (governance / framework only): Paper 3 (arxiv 2509.11398 — pure
  position paper, 0 triples). Paper 4 sections 3.2-3.5 deferred as they are
  framework/scenario rather than headline benchmark tables.
