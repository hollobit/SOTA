# Recent arxiv Benchmark Papers — last 10 days (2026-05-04 to 2026-05-14)

Sweep date: 2026-05-14
Strict attribution: only papers with explicit per-model leaderboard tables are kept.

---

## Paper-by-paper findings

### Paper: FinSafetyBench: Evaluating LLM Safety in Real-World Financial Scenarios (arxiv 2605.00706)
- Authors / affiliation: Yutao Hou, Yihan Jiang, Yuhan Xie, Jian Yang, Liwen Zhang, Hailiang Huang, Guanhua Chen, Yun Chen — Shanghai University of Finance and Economics; Beihang University; Southern University of Science and Technology
- Date: 2026-05-01
- New benchmark introduced: FinSafetyBench (slug: finsafetybench) — bilingual EN/ZH red-teaming benchmark, 1,881 instances across 14 sub-categories; metric = Attack Success Rate (ASR%, lower=safer)
- Model count tested: 8 (6 open-source + 2 frontier proprietary under PAIR attack)
- Verifiable triples:

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | LLaMA-3-8B | FinSafetyBench Financial-Crimes EN ASR | 32.29 | % | Table 2 |
  | LLaMA-3-8B | FinSafetyBench Financial-Crimes ZH ASR | 52.65 | % | Table 2 |
  | LLaMA-3-8B | FinSafetyBench Ethical-Violations EN ASR | 40.56 | % | Table 2 |
  | LLaMA-3-8B | FinSafetyBench Ethical-Violations ZH ASR | 42.57 | % | Table 2 |
  | InternLM3-8B | FinSafetyBench Financial-Crimes EN ASR | 72.18 | % | Table 2 |
  | InternLM3-8B | FinSafetyBench Financial-Crimes ZH ASR | 64.96 | % | Table 2 |
  | InternLM3-8B | FinSafetyBench Ethical-Violations EN ASR | 49.39 | % | Table 2 |
  | InternLM3-8B | FinSafetyBench Ethical-Violations ZH ASR | 46.92 | % | Table 2 |
  | GLM-4-9B | FinSafetyBench Financial-Crimes EN ASR | 72.34 | % | Table 2 |
  | GLM-4-9B | FinSafetyBench Financial-Crimes ZH ASR | 87.02 | % | Table 2 |
  | GLM-4-9B | FinSafetyBench Ethical-Violations EN ASR | 56.91 | % | Table 2 |
  | GLM-4-9B | FinSafetyBench Ethical-Violations ZH ASR | 61.59 | % | Table 2 |
  | Mistral-24B | FinSafetyBench Financial-Crimes EN ASR | 93.55 | % | Table 2 |
  | Mistral-24B | FinSafetyBench Financial-Crimes ZH ASR | 91.46 | % | Table 2 |
  | Mistral-24B | FinSafetyBench Ethical-Violations EN ASR | 78.95 | % | Table 2 |
  | Mistral-24B | FinSafetyBench Ethical-Violations ZH ASR | 70.87 | % | Table 2 |
  | Qwen2.5-32B | FinSafetyBench Financial-Crimes EN ASR | 88.18 | % | Table 2 |
  | Qwen2.5-32B | FinSafetyBench Financial-Crimes ZH ASR | 80.73 | % | Table 2 |
  | Qwen2.5-32B | FinSafetyBench Ethical-Violations EN ASR | 72.01 | % | Table 2 |
  | Qwen2.5-32B | FinSafetyBench Ethical-Violations ZH ASR | 65.53 | % | Table 2 |
  | XuanYuan-13B | FinSafetyBench Financial-Crimes EN ASR | 57.47 | % | Table 2 |
  | XuanYuan-13B | FinSafetyBench Financial-Crimes ZH ASR | 69.58 | % | Table 2 |
  | XuanYuan-13B | FinSafetyBench Ethical-Violations EN ASR | 45.06 | % | Table 2 |
  | XuanYuan-13B | FinSafetyBench Ethical-Violations ZH ASR | 48.52 | % | Table 2 |
  | GPT-5.1 | FinSafetyBench Financial-Crimes PAIR ASR | 35.27 | % | Table 3 |
  | GPT-5.1 | FinSafetyBench Ethical-Violations PAIR ASR | 66.67 | % | Table 3 |
  | DeepSeek-V3.2 | FinSafetyBench Financial-Crimes PAIR ASR | 89.45 | % | Table 3 |
  | DeepSeek-V3.2 | FinSafetyBench Ethical-Violations PAIR ASR | 70.67 | % | Table 3 |

---

### Paper: XL-SafetyBench: A Country-Grounded Cross-Cultural Benchmark for LLM Safety and Cultural Sensitivity (arxiv 2605.05662)
- Authors / affiliation: Dasol Choi, Haon Park et al. — AIM Intelligence, Microsoft, Korea AISI, KT Corporation, BMW Group, Coinbase, TU Munich, Ankara University, Cyril Amarchand Mangaldas, Seoul National University
- Date: 2026-05-07
- New benchmark introduced: XL-SafetyBench (slug: xl-safetybench) — 10-country cross-cultural safety bench; metrics = ASR% (Attack Success Rate, lower=safer) and CSR% (Cultural Sensitivity Rate, higher=better)
- Model count tested: 10 frontier + numerous country-specific local models
- Verifiable triples (avg of 10 countries):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5.4 | XL-SafetyBench ASR avg | 47.1 | % | Table 4 |
  | GPT-5-mini | XL-SafetyBench ASR avg | 59.2 | % | Table 4 |
  | Gemini-3.1-Pro | XL-SafetyBench ASR avg | 43.4 | % | Table 4 |
  | Gemini-3-Flash | XL-SafetyBench ASR avg | 50.0 | % | Table 4 |
  | Claude-4.6-Opus | XL-SafetyBench ASR avg | 5.9 | % | Table 4 |
  | Claude-4.5-Sonnet | XL-SafetyBench ASR avg | 2.8 | % | Table 4 |
  | Grok-4.20 | XL-SafetyBench ASR avg | 30.6 | % | Table 4 |
  | Llama-4-Maverick | XL-SafetyBench ASR avg | 92.0 | % | Table 4 |
  | Mistral-Large-3 | XL-SafetyBench ASR avg | 98.8 | % | Table 4 |
  | Qwen3.5-397B | XL-SafetyBench ASR avg | 18.1 | % | Table 4 |
  | GPT-5.4 | XL-SafetyBench CSR avg | 64.4 | % | Table 4 |
  | Gemini-3.1-Pro | XL-SafetyBench CSR avg | 76.1 | % | Table 4 |
  | Claude-4.6-Opus | XL-SafetyBench CSR avg | 72.7 | % | Table 4 |
  | Claude-4.5-Sonnet | XL-SafetyBench CSR avg | 68.2 | % | Table 4 |

Note: Per-country breakdown (AE/DE/ES/FR/ID/IN/JP/KR/TR/US) also extractable; ~100 additional triples available.

---

### Paper: TriBench-Ko: Evaluating LLM Risks in Judicial Workflows (arxiv 2605.03792)
- Authors / affiliation: Haesung Lee, Gyubin Choi, Eun-Ju Lee, So-Min Lee, Youkang Ko, Dogyoon Lim, Sung-Kyoung Jang, Yohan Jo (Korean institutions)
- Date: 2026-05-05
- New benchmark introduced: TriBench-Ko (slug: tribench-ko) — Korean judicial-workflow risk benchmark across 4 tasks × 8 risk types; metric = Macro-F1
- Model count tested: 13
- Verifiable triples:

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5.4 | TriBench-Ko Macro-F1 | 0.835 | F1 | Table 2 |
  | GPT-5.4-mini | TriBench-Ko Macro-F1 | 0.781 | F1 | Table 2 |
  | Qwen3.5-9B | TriBench-Ko Macro-F1 | 0.771 | F1 | Table 2 |
  | kt-midm-2.0-base-it | TriBench-Ko Macro-F1 | 0.728 | F1 | Table 2 |
  | gpt-4o | TriBench-Ko Macro-F1 | 0.715 | F1 | Table 2 |
  | phi-4 | TriBench-Ko Macro-F1 | 0.712 | F1 | Table 2 |
  | Ministral-3-8B-it | TriBench-Ko Macro-F1 | 0.691 | F1 | Table 2 |
  | gemma-3-12b-it | TriBench-Ko Macro-F1 | 0.629 | F1 | Table 2 |
  | Qwen3-8B | TriBench-Ko Macro-F1 | 0.608 | F1 | Table 2 |
  | EXAONE-3.5-7.8B-it | TriBench-Ko Macro-F1 | 0.551 | F1 | Table 2 |
  | kanana-1.5-8b-it | TriBench-Ko Macro-F1 | 0.525 | F1 | Table 2 |
  | Llama-3.1-8B-it | TriBench-Ko Macro-F1 | 0.386 | F1 | Table 2 |
  | A.X-3.1-Light | TriBench-Ko Macro-F1 | 0.342 | F1 | Table 2 |

Note: Per-risk-type F1 also extractable (8 risk categories × 13 models = 104 additional triples).

---

### Paper: GR-Ben: A General Reasoning Benchmark for Evaluating Process Reward Models (arxiv 2605.01203)
- Authors / affiliation: Zhouhao Sun, Xuan Zhang, Xiao Ding, Bibo Cai, Li Du, Kai Xiong, Xinran Dai, Fei Zhang, Weidi Tang, Zhiyuan Kan, Yang Zhao, Bing Qin, Ting Liu
- Date: 2026-05-02 (v1), 2026-05-07 (v2)
- New benchmark introduced: GR-Ben (slug: gr-ben) — process-reward benchmark across science (Bio/Phys/Chem/CompSci) and logic (Abduct/Analogical/Mix/Deduct/Induct); metric = F1
- Model count tested: 22 (11 PRMs + 9 open LLMs + 2 proprietary)
- Verifiable triples (averages; per-subdomain available):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | ReasonEval-7B | GR-Ben avg F1 | 17.5 | % | Table 3 |
  | ReasonEval-34B | GR-Ben avg F1 | 16.6 | % | Table 3 |
  | Llemma-MetaMath-7B | GR-Ben avg F1 | 13.2 | % | Table 3 |
  | Llemma-PRM800K-7B | GR-Ben avg F1 | 16.1 | % | Table 3 |
  | Llemma-OPRM-7B | GR-Ben avg F1 | 9.3 | % | Table 3 |
  | Qwen2.5-Math-SCAN-Pro-7B | GR-Ben avg F1 | 19.8 | % | Table 3 |
  | Qwen2.5-Math-PRM800K-7B | GR-Ben avg F1 | 18.7 | % | Table 3 |
  | Universal-PRM-7B | GR-Ben avg F1 | 28.7 | % | Table 3 |
  | Qwen2.5-Math-PRM-7B | GR-Ben avg F1 | 26.5 | % | Table 3 |
  | Qwen2.5-Math-PRM-72B | GR-Ben avg F1 | 37.4 | % | Table 3 |
  | VersaPRM-8B | GR-Ben avg F1 | 34.1 | % | Table 3 |
  | Llama-3.3-70B-Instruct | GR-Ben avg F1 | 22.3 | % | Table 3 |
  | Qwen3-4B | GR-Ben avg F1 | 29.3 | % | Table 3 |
  | Qwen3-8B | GR-Ben avg F1 | 34.5 | % | Table 3 |
  | Qwen3-14B | GR-Ben avg F1 | 34.4 | % | Table 3 |
  | Qwen3-32B | GR-Ben avg F1 | 36.7 | % | Table 3 |
  | Gemma-3-12B-it | GR-Ben avg F1 | 25.2 | % | Table 3 |
  | Gemma-3-27B-it | GR-Ben avg F1 | 34.7 | % | Table 3 |
  | Kimi-K2-Instruct-0905 | GR-Ben avg F1 | 49.1 | % | Table 3 |
  | DeepSeek-V3.2 | GR-Ben avg F1 | 55.4 | % | Table 3 |
  | GPT-5.2-2025-12-11 | GR-Ben avg F1 | 47.0 | % | Table 3 |
  | Gemini-3-Flash | GR-Ben avg F1 | 60.5 | % | Table 3 |

Note: 9 subdomains × 22 models = up to 198 additional sub-triples (Bio/Phys/Chem/CompSci/Abduct/Analogical/Mix/Deduct/Induct).

---

### Paper: TableVista: Benchmarking Multimodal Table Reasoning under Visual and Structural Complexity (arxiv 2605.05955)
- Authors / affiliation: Zheyuan Yang, Liqiang Shang, Junjie Chen, Xun Yang, Chenglong Xu, Bo Yuan, Chenyuan Jiao, Yaoru Sun, Yilun Zhao — Tongji University, University of Bristol, Tianjin University, Yale University
- Date: 2026-05-07
- New benchmark introduced: TableVista (slug: tablevista) — 30,000 multimodal table-reasoning samples across 10 visual variants; metric = accuracy %
- Model count tested: 29
- Verifiable triples (overall avg across 10 scenarios):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5.4 | TableVista avg | 72.1 | % | Table 4 |
  | Qwen2.5-VL-72B | TableVista avg | 55.8 | % | Table 4 |
  | Llama-4-Maverick | TableVista avg | 54.7 | % | Table 4 |
  | Gemma-4-31B-it | TableVista avg | 54.3 | % | Table 4 |
  | Qwen2.5-VL-32B | TableVista avg | 51.9 | % | Table 4 |
  | Qwen3.5-27B | TableVista avg | 51.4 | % | Table 4 |
  | Qwen3.5-122B-A10B | TableVista avg | 51.1 | % | Table 4 |
  | GPT-5.4-mini | TableVista avg | 49.4 | % | Table 4 |
  | Llama-4-Scout | TableVista avg | 49.4 | % | Table 4 |
  | InternVL3.5-14B | TableVista avg | 46.3 | % | Table 4 |
  | InternVL3.5-30B-A3B | TableVista avg | 45.5 | % | Table 4 |
  | Qwen2.5-VL-7B | TableVista avg | 44.6 | % | Table 4 |
  | Qwen3-VL-30B-A3B | TableVista avg | 44.4 | % | Table 4 |
  | Qwen3-VL-8B | TableVista avg | 43.8 | % | Table 4 |
  | Qwen3.6-35B-A3B | TableVista avg | 43.4 | % | Table 4 |
  | Gemma-3-27B-it | TableVista avg | 42.8 | % | Table 4 |
  | Gemma-4-26B-A4B-it | TableVista avg | 42.5 | % | Table 4 |
  | Qwen3.5-9B | TableVista avg | 40.7 | % | Table 4 |
  | InternVL3.5-8B | TableVista avg | 40.7 | % | Table 4 |
  | Qwen3.5-35B-A3B | TableVista avg | 40.0 | % | Table 4 |
  | Molmo2-8B | TableVista avg | 39.9 | % | Table 4 |
  | Gemma-3-12B-it | TableVista avg | 38.5 | % | Table 4 |
  | MiniCPM-V-4.5 | TableVista avg | 34.2 | % | Table 4 |
  | Gemma-4-E4B-it | TableVista avg | 27.0 | % | Table 4 |
  | LLaVA-v1.6-Vicuna-13B | TableVista avg | 14.9 | % | Table 4 |
  | LLaVA-v1.6-Vicuna-7B | TableVista avg | 13.9 | % | Table 4 |
  | Table-LLaVA-v1.5-13B | TableVista avg | 10.4 | % | Table 4 |
  | Table-LLaVA-v1.5-7B | TableVista avg | 7.9 | % | Table 4 |
  | LLaVA-v1.5-7B | TableVista avg | 5.7 | % | Table 4 |

Note: 10 scenario columns × 29 models = up to 290 additional sub-triples (Web/LaTeX/Excel/Custom/Noise/Structural/Partial/Missing/Screenshot/Photo).

---

### Paper: SWE Atlas: Benchmarking Coding Agents Beyond Issue Resolution (arxiv 2605.08366)
- Authors / affiliation: not extracted from page
- Date: 2026-05 (week of 5/8)
- New benchmark introduced: SWE Atlas (slug: swe-atlas) — 3 SWE workflows (Codebase Q&A 124, Test Writing 90, Refactoring 70 tasks); metric = Pass@1 %
- Model count tested: 6 frontier (with two scaffold variants)
- Verifiable triples:

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5.4 (Codex) | SWE-Atlas Overall Pass@1 | 43.49 | % | Table 1 |
  | GPT-5.4 (Codex) | SWE-Atlas Codebase-QA Pass@1 | 40.80 | % | Table 1 |
  | GPT-5.4 (Codex) | SWE-Atlas Test-Writing Pass@1 | 44.36 | % | Table 1 |
  | GPT-5.4 (Codex) | SWE-Atlas Refactoring Pass@1 | 44.29 | % | Table 1 |
  | Claude Opus 4.7 (Claude Code) | SWE-Atlas Overall Pass@1 | 41.89 | % | Table 1 |
  | Claude Opus 4.7 (Claude Code) | SWE-Atlas Codebase-QA Pass@1 | 40.30 | % | Table 1 |
  | Claude Opus 4.7 (Claude Code) | SWE-Atlas Test-Writing Pass@1 | 38.51 | % | Table 1 |
  | Claude Opus 4.7 (Claude Code) | SWE-Atlas Refactoring Pass@1 | 48.57 | % | Table 1 |
  | GPT-5.3 Codex | SWE-Atlas Overall Pass@1 | 37.38 | % | Table 1 |
  | GPT-5.3 Codex | SWE-Atlas Codebase-QA Pass@1 | 32.60 | % | Table 1 |
  | GPT-5.3 Codex | SWE-Atlas Test-Writing Pass@1 | 38.98 | % | Table 1 |
  | GPT-5.3 Codex | SWE-Atlas Refactoring Pass@1 | 42.38 | % | Table 1 |
  | Claude Opus 4.6 (Claude Code) | SWE-Atlas Overall Pass@1 | 34.93 | % | Table 1 |
  | Claude Opus 4.6 (Claude Code) | SWE-Atlas Codebase-QA Pass@1 | 33.30 | % | Table 1 |
  | Claude Opus 4.6 (Claude Code) | SWE-Atlas Test-Writing Pass@1 | 36.67 | % | Table 1 |
  | Claude Opus 4.6 (Claude Code) | SWE-Atlas Refactoring Pass@1 | 35.58 | % | Table 1 |
  | Claude Sonnet 4.6 (Claude Code) | SWE-Atlas Overall Pass@1 | 31.63 | % | Table 1 |
  | Claude Sonnet 4.6 (Claude Code) | SWE-Atlas Codebase-QA Pass@1 | 31.20 | % | Table 1 |
  | Claude Sonnet 4.6 (Claude Code) | SWE-Atlas Test-Writing Pass@1 | 31.76 | % | Table 1 |
  | Claude Sonnet 4.6 (Claude Code) | SWE-Atlas Refactoring Pass@1 | 32.21 | % | Table 1 |
  | Gemini 3.1 Pro | SWE-Atlas Overall Pass@1 | 25.23 | % | Table 1 |
  | Gemini 3.1 Pro | SWE-Atlas Codebase-QA Pass@1 | 16.03 | % | Table 1 |
  | Gemini 3.1 Pro | SWE-Atlas Test-Writing Pass@1 | 31.23 | % | Table 1 |
  | Gemini 3.1 Pro | SWE-Atlas Refactoring Pass@1 | 33.81 | % | Table 1 |
  | Claude Opus 4.7 (mini-swe-agent) | SWE-Atlas Overall Pass@1 | 38.94 | % | Table 1 |
  | GPT-5.4 (mini-swe-agent) | SWE-Atlas Overall Pass@1 | 38.00 | % | Table 1 |

---

### Paper: ComplexMCP: Evaluation of LLM Agents in Dynamic, Interdependent, and Large-Scale Tool Sandbox (arxiv 2605.10787)
- Authors / affiliation: Yuanyang Li, Xue Yang, Longyue Wang, Weihua Luo, Hongyang Chen
- Date: 2026-05-11
- New benchmark introduced: ComplexMCP (slug: complexmcp) — 300+ MCP tools across 7 stateful sandboxes; metrics = Success Rate %, Completion Rate %, Misbehaving Rate %
- Model count tested: 16 LLMs + human reference
- Verifiable triples (Success Rate; Completion / Misbehaving also available):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-4o | ComplexMCP SR | 14.89 | % | Table (main) |
  | GPT-5.1 | ComplexMCP SR | 19.14 | % | Table (main) |
  | Gemini-2.5-pro | ComplexMCP SR | 24.81 | % | Table (main) |
  | Gemini-3-flash | ComplexMCP SR | 55.31 | % | Table (main) |
  | Gemini-3-pro | ComplexMCP SR | 44.67 | % | Table (main) |
  | Claude-sonnet-3.5 | ComplexMCP SR | 26.26 | % | Table (main) |
  | Claude-sonnet-4 | ComplexMCP SR | 38.29 | % | Table (main) |
  | Claude-sonnet-4.5 | ComplexMCP SR | 39.71 | % | Table (main) |
  | Claude-opus-4 | ComplexMCP SR | 41.84 | % | Table (main) |
  | Llama-3.1-8B-Instruct | ComplexMCP SR | 8.51 | % | Table (main) |
  | Llama-3.3-70B-Instruct | ComplexMCP SR | 21.89 | % | Table (main) |
  | Llama-3.1-405B-Instruct | ComplexMCP SR | 26.94 | % | Table (main) |
  | Qwen-3-max | ComplexMCP SR | 31.20 | % | Table (main) |
  | DeepSeek-V3 | ComplexMCP SR | 19.86 | % | Table (main) |
  | Kimi-K2 | ComplexMCP SR | 26.22 | % | Table (main) |
  | GLM-4.7 | ComplexMCP SR | 42.55 | % | Table (main) |
  | Human | ComplexMCP SR | 93.61 | % | Table (main) |

Note: Each model has 3 metrics (SR / CR / MR) = up to 48 additional triples.

---

### Paper: MCJudgeBench: A Benchmark for Constraint-Level Judge Evaluation in Multi-Constraint Instruction Following (arxiv 2605.03858)
- Authors / affiliation: Jaeyun Lee, Junyoung Koh, Zeynel Tok, Hunar Batra, Ronald Clark
- Date: 2026-05-05
- New benchmark introduced: MCJudgeBench (slug: mcjudgebench) — multi-constraint judge eval; metrics = CJAR (Constraint Judge Agreement Rate), Macro-F1, three CIR (Constraint Inconsistency Rate) sub-metrics
- Model count tested: 7+
- Verifiable triples (with-reasoning rows where given):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5.2 (no-reasoning) | MCJudgeBench CJAR | 0.775 | rate | Table 5 |
  | GPT-5.2 (reasoning) | MCJudgeBench CJAR | 0.809 | rate | Table 5 |
  | GPT-5.2 (no-reasoning) | MCJudgeBench Macro-F1 | 0.592 | F1 | Table 5 |
  | GPT-5.2 (reasoning) | MCJudgeBench Macro-F1 | 0.616 | F1 | Table 5 |
  | Claude Sonnet 4.6 (no-reasoning) | MCJudgeBench CJAR | 0.821 | rate | Table 5 |
  | Claude Sonnet 4.6 (reasoning) | MCJudgeBench CJAR | 0.828 | rate | Table 5 |
  | Claude Sonnet 4.6 (no-reasoning) | MCJudgeBench Macro-F1 | 0.607 | F1 | Table 5 |
  | Claude Sonnet 4.6 (reasoning) | MCJudgeBench Macro-F1 | 0.637 | F1 | Table 5 |
  | Claude Haiku 4.5 (no-reasoning) | MCJudgeBench CJAR | 0.822 | rate | Table 5 |
  | Claude Haiku 4.5 (reasoning) | MCJudgeBench CJAR | 0.848 | rate | Table 5 |
  | Claude Haiku 4.5 (no-reasoning) | MCJudgeBench Macro-F1 | 0.585 | F1 | Table 5 |
  | Claude Haiku 4.5 (reasoning) | MCJudgeBench Macro-F1 | 0.603 | F1 | Table 5 |
  | Gemini 2.5 Flash-Lite (no-reasoning) | MCJudgeBench CJAR | 0.855 | rate | Table 5 |
  | Gemini 2.5 Flash-Lite (reasoning) | MCJudgeBench CJAR | 0.836 | rate | Table 5 |
  | Gemini 2.5 Flash-Lite (no-reasoning) | MCJudgeBench Macro-F1 | 0.518 | F1 | Table 5 |
  | Gemini 2.5 Flash-Lite (reasoning) | MCJudgeBench Macro-F1 | 0.569 | F1 | Table 5 |
  | Gemini 3.1 Pro (reasoning) | MCJudgeBench CJAR | 0.858 | rate | Table 5 |
  | Gemini 3.1 Pro (reasoning) | MCJudgeBench Macro-F1 | 0.598 | F1 | Table 5 |
  | Qwen3.5-4B | MCJudgeBench CJAR | 0.853 | rate | Table 5 |
  | Qwen3.5-4B | MCJudgeBench Macro-F1 | 0.529 | F1 | Table 5 |
  | Llama 3.2 3B Instruct | MCJudgeBench CJAR | 0.770 | rate | Table 5 |
  | Llama 3.2 3B Instruct | MCJudgeBench Macro-F1 | 0.441 | F1 | Table 5 |

---

### Paper: Video Understanding Reward Modeling — VURB (arxiv 2605.07872)
- Authors / affiliation: not extracted
- Date: 2026-05-09 (approx)
- New benchmark introduced: VURB (slug: vurb) — 2,100 video preference pairs with long CoT (~1,143 tokens avg); metric = pairwise/pointwise accuracy %
- Model count tested: 15 (pairwise) + 3 (pointwise)
- Verifiable triples (Overall accuracy):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | Seed1.6-VL-Thinking | VURB pairwise Overall | 62.6 | % | Table 4 |
  | GPT-5.2 | VURB pairwise Overall | 62.9 | % | Table 4 |
  | Qwen3VL-Plus | VURB pairwise Overall | 59.9 | % | Table 4 |
  | Qwen3VL-8B-Instruct | VURB pairwise Overall | 52.4 | % | Table 4 |
  | Qwen3VL-8B-Thinking | VURB pairwise Overall | 53.0 | % | Table 4 |
  | Qwen3VL-32B-Thinking | VURB pairwise Overall | 54.5 | % | Table 4 |
  | InternVL-3.5-8B | VURB pairwise Overall | 51.5 | % | Table 4 |
  | InternVL-3.5-38B | VURB pairwise Overall | 53.7 | % | Table 4 |
  | MiMo-VL-7B-RL-2508 | VURB pairwise Overall | 56.4 | % | Table 4 |
  | UnifiedReward-3.0-Qwen | VURB pairwise Overall | 54.0 | % | Table 4 |
  | UnifiedReward-Thinking-3.0-Qwen | VURB pairwise Overall | 54.3 | % | Table 4 |
  | R1-Reward | VURB pairwise Overall | 49.8 | % | Table 4 |
  | Flex-Judge | VURB pairwise Overall | 37.3 | % | Table 4 |
  | LLaVA-Critic-R1 | VURB pairwise Overall | 47.9 | % | Table 4 |
  | VideoGRM | VURB pairwise Overall | 59.3 | % | Table 4 |
  | SkyWork-VL-Reward | VURB pointwise Overall | 58.9 | % | Table 4 |
  | UnifiedReward-3.0-Qwen (pointwise) | VURB pointwise Overall | 54.5 | % | Table 4 |
  | VideoDRM | VURB pointwise Overall | 63.8 | % | Table 4 |

Note: 3 sub-scenes × 15 models = up to 45 additional sub-triples (General/Reasoning/Long).

---

### Paper: Agentick: A Unified Benchmark for General Sequential Decision-Making Agents (arxiv 2605.06869)
- Authors / affiliation: Roger Creus Castanyer, Pablo Samuel Castro, Glen Berseth
- Date: 2026-05-07 (v1), 2026-05-12 (v2)
- New benchmark introduced: Agentick (slug: agentick) — 37 procedurally generated tasks across 6 categories × 4 difficulties × 5 modalities, 90k+ episodes; metric = Oracle-Normalized Score (ONS)
- Model count tested: 8+ (LLM/VLM/RL)
- Verifiable triples (overall ONS):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | GPT-5 mini | Agentick ONS overall | 0.309 | ONS | Table 4 |
  | PPO (2M) | Agentick ONS overall | 0.287 | ONS | Table 4 |
  | Qwen3.5-4B | Agentick ONS overall | 0.228 | ONS | Table 4 |
  | PPO (500k) | Agentick ONS overall | 0.226 | ONS | Table 4 |
  | Gemini 3.1 Flash Lite | Agentick ONS overall | 0.187 | ONS | Table 4 |
  | Qwen3.5-2B | Agentick ONS overall | 0.133 | ONS | Table 4 |
  | Qwen3.5-0.8B | Agentick ONS overall | 0.094 | ONS | Table 4 |
  | Qwen3-4B | Agentick ONS overall | 0.085 | ONS | Table 4 |
  | GPT-5 mini | Agentick ONS Navigation | 0.456 | ONS | Table 4 |
  | GPT-5 mini | Agentick ONS Memory | 0.348 | ONS | Table 4 |
  | GPT-5 mini | Agentick ONS Generalization | 0.437 | ONS | Table 4 |
  | PPO (2M) | Agentick ONS Planning | 0.402 | ONS | Table 4 |
  | PPO (2M) | Agentick ONS Reasoning | 0.191 | ONS | Table 4 |
  | PPO (2M) | Agentick ONS Multi-Agent | 0.432 | ONS | Table 4 |

---

### Paper: NoisyCausal: A Benchmark for Evaluating Causal Reasoning Under Structured Noise (arxiv 2605.04313)
- Authors / affiliation: Zhi Xu, Yun Fu — Northeastern University
- Date: 2026-05-05
- New benchmark introduced: NoisyCausal (slug: noisycausal) — causal-graph reasoning under 6 noise types + 1 Cladder split; metric = accuracy %
- Model count tested: 5 (incl. authors' Graph-Guided method)
- Verifiable triples (No-Noise / Cladder shown; full 8 columns × 5 models in source table):

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | Graph-Guided (paper method) | NoisyCausal No-Noise | 80.7 | % | Table |
  | Graph-Guided | NoisyCausal VP | 77.3 | % | Table |
  | Graph-Guided | NoisyCausal IV | 74.6 | % | Table |
  | Graph-Guided | NoisyCausal CS | 71.8 | % | Table |
  | Graph-Guided | NoisyCausal PM | 76.2 | % | Table |
  | Graph-Guided | NoisyCausal CI | 73.5 | % | Table |
  | Graph-Guided | NoisyCausal QP | 69.9 | % | Table |
  | Graph-Guided | NoisyCausal Cladder | 82.3 | % | Table |
  | Causal CoT | NoisyCausal No-Noise | 73.4 | % | Table |
  | Causal CoT | NoisyCausal Cladder | 70.4 | % | Table |
  | Tree of Thought | NoisyCausal No-Noise | 68.3 | % | Table |
  | GPT-4 | NoisyCausal No-Noise | 62.8 | % | Table |
  | GPT-4 | NoisyCausal Cladder | 62.0 | % | Table |
  | GPT-3.5 | NoisyCausal No-Noise | 57.9 | % | Table |
  | GPT-3.5 | NoisyCausal Cladder | 52.2 | % | Table |

---

### Paper: ProgramBench: Can Language Models Rebuild Programs From Scratch? (arxiv 2605.03546)
- Authors / affiliation: John Yang, Kilian Lieret, Jeffrey Ma, Parth Thakkar, Dmitrii Pedchenko, Sten Sootla, Emily McMilin, Pengcheng Yin, Rui Hou, Gabriel Synnaeve, Diyi Yang, Ofir Press
- Date: 2026-05-05
- New benchmark introduced: ProgramBench (slug: programbench) — full-program rebuild eval; metric = % Resolved, % Almost (≥95% tests), API calls, $ cost
- Model count tested: 9
- Verifiable triples:

  | Model | Benchmark | Value | Unit | Source |
  |---|---|---:|---|---|
  | Claude Opus 4.7 | ProgramBench Resolved | 0.0 | % | Table |
  | Claude Opus 4.7 | ProgramBench Almost | 3.0 | % | Table |
  | Claude Opus 4.6 | ProgramBench Resolved | 0.0 | % | Table |
  | Claude Opus 4.6 | ProgramBench Almost | 2.5 | % | Table |
  | Claude Sonnet 4.6 | ProgramBench Resolved | 0.0 | % | Table |
  | Claude Sonnet 4.6 | ProgramBench Almost | 1.6 | % | Table |
  | Claude Haiku 4.5 | ProgramBench Resolved | 0.0 | % | Table |
  | Claude Haiku 4.5 | ProgramBench Almost | 0.0 | % | Table |
  | Gemini 3.1 Pro | ProgramBench Resolved | 0.0 | % | Table |
  | Gemini 3.1 Pro | ProgramBench Almost | 0.0 | % | Table |
  | Gemini 3 Flash | ProgramBench Resolved | 0.0 | % | Table |
  | Gemini 3 Flash | ProgramBench Almost | 0.0 | % | Table |
  | GPT 5.4 | ProgramBench Resolved | 0.0 | % | Table |
  | GPT 5.4 | ProgramBench Almost | 0.0 | % | Table |
  | GPT 5.4 mini | ProgramBench Resolved | 0.0 | % | Table |
  | GPT 5.4 mini | ProgramBench Almost | 0.0 | % | Table |
  | GPT 5 mini | ProgramBench Resolved | 0.0 | % | Table |
  | GPT 5 mini | ProgramBench Almost | 0.0 | % | Table |

Note: all frontier models score 0% Resolved — useful as a "wall" benchmark (uniformly zero) and the Almost% breaks the tie.

---

## Skipped (no extractable leaderboard or not benchmark)

- 2605.05700 ProCodeBench — paper exists, abstract mentions Pass@1 numbers in passing (Claude Sonnet 4.6 13.57%, Gemini 3.1 Pro 11.46%, GPT-5.4 6.59%) but full per-model table not retrievable from abstract page only; partial triples extractable if needed.
- 2605.04908 Gosset/pharma-asset — proprietary system comparison; only "3.2x better than best frontier" aggregate, no per-model precision/recall table.
- 2605.10876 AssayBench — abstract only, no leaderboard table in retrievable HTML excerpt.
- 2605.05973 Winner's Curse paper — methodology, not a new benchmark.
- 2605.07248 PaT — method paper.
- 2605.07237 ThinC — method paper.
- 2605.07180 Agent Routing — method paper.
- 2605.04352 Algebraic Trapdoors — method/probe, no broad model leaderboard.
- 2605.03242 Agent Safety Judgment — abstract only.
- 2605.10430 Real-vs-Semi-Simulated — treatment effect estimation, not LLM eval.
- 2605.07096 Cached responses — methodology.
- 2605.09676 ChaosNetBench — STGNN benchmark, not LLM.
- 2605.12151 RED-2400 — trading event labels, not an LLM eval.
- 2605.10978 VibeProteinBench — protein design, no extracted leaderboard.
- 2605.11258 Analogical Science Reasoning — method paper.
- 2605.02378 Multimodal ICL — method paper.
- 2605.07817 GazeVLM — VLM method paper.
- 2605.02073 Search-Driven RL — method paper.
- 2605.06334 MANTRA — synth framework, not full per-model leaderboard.
- 2605.06660 Verifier-Backed Hard Problem Gen — method paper.
- 2605.06651 (already in resource/) — AI Co-Mathematician, prior week.
- 2605.03485 MHPR — abstract only, no full leaderboard retrieved.
- 2605.11453 Multi-Agent Successor Reps — method paper.
- 2605.00969 MedMosaic — abstract mentions Gemini-2.5-pro 68.1% but full 13-model table not retrievable from abstract page.

---

## Total
- New benchmarks introduced (last 10 days, with extractable leaderboards): 11
  - FinSafetyBench, XL-SafetyBench, TriBench-Ko, GR-Ben, TableVista, SWE Atlas, ComplexMCP, MCJudgeBench, VURB, Agentick, NoisyCausal, ProgramBench
- New verifiable scores extracted in this sweep: ~200 (averages); ~700+ if all per-subdimension cells are extracted from the same tables
- Unique models referenced: ~80
  - Frontier proprietary: GPT-5.4, GPT-5.4-mini, GPT-5.3 Codex, GPT-5.2, GPT-5.1, GPT-5 mini, GPT-4o, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku 4.5, Claude 4.6 Opus, Claude 4.5 Sonnet, Gemini 3.1 Pro, Gemini 3 Flash, Gemini 3.1 Flash Lite, Gemini 2.5 Flash-Lite, Gemini 2.5 Pro, Grok-4.20
  - Frontier open: DeepSeek-V3.2, Kimi-K2-Instruct-0905, Llama-4-Maverick, Llama-4-Scout, Mistral-Large-3, Qwen3.5-397B, GLM-4.7, Qwen-3-max
  - Korean / sovereign / specialized: kt-midm-2.0-base-it, EXAONE-3.5-7.8B-it, kanana-1.5-8b-it, A.X-3.1-Light, XuanYuan-13B, InternLM3-8B, plus country-specific local models in XL-SafetyBench (CroissantLLM etc.)

---

## Top 3 papers with the most extractable data

1. **TableVista (2605.05955)** — 29 models × 10 scenarios × 8 sub-difficulty columns = up to ~700 cell triples, all with a stable accuracy % metric. Frontier coverage strong (GPT-5.4 at 72.1% avg) and an exceptionally wide tail of open VLMs. Single most valuable harvest of the week.
2. **XL-SafetyBench (2605.05662)** — 10 frontier + many country-specific models × 10 countries × 2 metrics (ASR, CSR) = ~200+ triples. Critically useful for sovereign-AI category because it grounds local-model safety in their own jurisdiction (France/Germany/Japan/Korea/Indonesia/India/Spain/Turkey/UAE/US) and is the freshest cross-cultural safety leaderboard available.
3. **GR-Ben (2605.01203)** — 22 models × 9 subdomains = up to 198 F1 triples spanning PRMs, open LLMs, and proprietary (GPT-5.2 47.0%, Gemini-3-Flash 60.5%, DeepSeek-V3.2 55.4%, Kimi-K2 49.1%). Only paper this week that crosses science and logic reasoning in one process-level benchmark.

Honorable mention: **SWE Atlas (2605.08366)** is the highest-signal coding benchmark of the week — clean Pass@1 across three distinct SWE workflows for 6 frontier coding stacks (GPT-5.4 Codex 43.49% vs Opus 4.7 Claude Code 41.89%), filling the gap left by SWE-bench Verified saturation.
