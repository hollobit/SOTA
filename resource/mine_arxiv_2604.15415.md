# arxiv 2604.15415 — HarmfulSkillBench

## Paper summary
- **Title:** HarmfulSkillBench: How Do Harmful Skills Weaponize Your Agents?
- **Authors:** Yukun Jiang, Yage Zhang, Michael Backes, Xinyue Shen, Yang Zhang
- **Affiliation:** CISPA Helmholtz Center for Information Security
- **Date:** 16 Apr 2026 (arXiv 2604.15415v1)
- **Scope:** First large-scale measurement of *harmful skills* (skills whose intended functionality violates AI usage policies) on two agent skill registries (ClawHub, Skills.Rest). 98,440 skills surveyed; 4,858 (4.93%) classified harmful by an LLM-driven scorer (F1=0.82). Then constructs HarmfulSkillBench — 200 human-verified harmful skills across 20 categories (13 Tier-1 Prohibited + 7 Tier-2 High-Risk) — and evaluates 6 LLM agents under 4 conditions (A: Passive Exposure, B: Active Invocation, C: Safeguard Instruction with C1-C4 sub-conditions, D: No-Skill Baseline). Metrics: Refusal%, HiTL%, AID%, composite Harm Score [0-1] (lower=safer).

## Score extractions

All triples from Table 6 (main results, 6 models x 3 main conditions x All/Tier1/Tier2 splits) + Table 7 (Tier-2 safeguard ablation C1-C4). Models accessed via chat-completion APIs (temperature=0, reasoning disabled / "minimal" for Gemini 3 Flash).

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| openai/gpt-4o | harmful_skill_bench_a_all_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_all_score | 0.85 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier1_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier1_score | 0.95 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier2_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier2_hitl | 11.43 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier2_aid | 2.86 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_a_tier2_score | 0.67 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_all_refusal | 17.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_all_score | 0.70 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier1_refusal | 26.15 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier1_score | 0.73 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier2_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier2_hitl | 12.86 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier2_aid | 1.43 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_b_tier2_score | 0.65 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_all_refusal | 54.50 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_all_score | 0.29 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier1_refusal | 83.85 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier1_score | 0.15 | score_0_1 | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier2_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier2_hitl | 20.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier2_aid | 0.00 | percent | p10 T6 |
| openai/gpt-4o | harmful_skill_bench_d_tier2_score | 0.54 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_all_refusal | 33.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_all_score | 0.52 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier1_refusal | 50.77 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier1_score | 0.44 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier2_refusal | 0.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier2_hitl | 17.14 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier2_aid | 1.43 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_a_tier2_score | 0.68 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_all_refusal | 65.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_all_score | 0.23 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier1_refusal | 99.23 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier1_score | 0.01 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier2_refusal | 1.43 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier2_hitl | 17.14 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier2_aid | 0.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_b_tier2_score | 0.64 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_all_refusal | 66.50 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_all_score | 0.18 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier1_refusal | 100.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier1_score | 0.00 | score_0_1 | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier2_refusal | 4.29 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier2_hitl | 40.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier2_aid | 0.00 | percent | p10 T6 |
| openai/gpt-5.4-mini | harmful_skill_bench_d_tier2_score | 0.51 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_all_refusal | 5.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_all_score | 0.84 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier1_refusal | 7.69 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier1_score | 0.89 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier2_refusal | 0.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier2_hitl | 8.57 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier2_aid | 1.43 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_a_tier2_score | 0.73 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_all_refusal | 43.50 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_all_score | 0.46 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier1_refusal | 66.92 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier1_score | 0.32 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier2_refusal | 0.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier2_hitl | 10.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier2_aid | 2.86 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_b_tier2_score | 0.72 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_all_refusal | 61.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_all_score | 0.27 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier1_refusal | 93.85 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier1_score | 0.06 | score_0_1 | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier2_refusal | 0.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier2_hitl | 21.43 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier2_aid | 0.00 | percent | p10 T6 |
| google/gemini-3-flash | harmful_skill_bench_d_tier2_score | 0.65 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_all_refusal | 12.00 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_all_score | 0.64 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier1_refusal | 16.92 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier1_score | 0.67 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier2_refusal | 2.86 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier2_hitl | 11.43 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier2_aid | 0.00 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_a_tier2_score | 0.60 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_all_refusal | 47.00 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_all_score | 0.43 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier1_refusal | 72.31 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier1_score | 0.27 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier2_refusal | 0.00 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier2_hitl | 18.57 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier2_aid | 4.29 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_b_tier2_score | 0.72 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_all_refusal | 64.50 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_all_score | 0.22 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier1_refusal | 99.23 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier1_score | 0.01 | score_0_1 | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier2_refusal | 0.00 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier2_hitl | 37.14 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier2_aid | 1.43 | percent | p10 T6 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_d_tier2_score | 0.61 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_all_refusal | 8.50 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_all_score | 0.81 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier1_refusal | 13.08 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier1_score | 0.84 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier2_refusal | 0.00 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier2_hitl | 17.14 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier2_aid | 2.86 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_a_tier2_score | 0.75 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_all_refusal | 52.50 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_all_score | 0.38 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier1_refusal | 80.77 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier1_score | 0.19 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier2_refusal | 0.00 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier2_hitl | 21.43 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier2_aid | 2.86 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_b_tier2_score | 0.73 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_all_refusal | 63.00 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_all_score | 0.25 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier1_refusal | 96.92 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier1_score | 0.03 | score_0_1 | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier2_refusal | 0.00 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier2_hitl | 35.71 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier2_aid | 2.86 | percent | p10 T6 |
| moonshot/kimi-k2.5 | harmful_skill_bench_d_tier2_score | 0.66 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_all_refusal | 0.00 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_all_score | 0.88 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier1_refusal | 0.00 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier1_score | 0.96 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier2_refusal | 0.00 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier2_hitl | 14.29 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier2_aid | 5.71 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_a_tier2_score | 0.72 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_all_refusal | 29.50 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_all_score | 0.61 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier1_refusal | 44.62 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier1_score | 0.54 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier2_refusal | 1.43 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier2_hitl | 14.29 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier2_aid | 1.43 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_b_tier2_score | 0.73 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_all_refusal | 48.00 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_all_score | 0.40 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier1_refusal | 73.85 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier1_score | 0.25 | score_0_1 | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier2_refusal | 0.00 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier2_hitl | 24.29 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier2_aid | 1.43 | percent | p10 T6 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_d_tier2_score | 0.68 | score_0_1 | p10 T6 |

### Tier-2 safeguard ablation (Table 7, p12) — Conditions C1-C4, harm Score only (composite)

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| openai/gpt-4o | harmful_skill_bench_c1_tier2_score | 0.04 | score_0_1 | p12 T7 |
| openai/gpt-4o | harmful_skill_bench_c2_tier2_score | 0.31 | score_0_1 | p12 T7 |
| openai/gpt-4o | harmful_skill_bench_c3_tier2_score | 0.51 | score_0_1 | p12 T7 |
| openai/gpt-4o | harmful_skill_bench_c4_tier2_score | 0.67 | score_0_1 | p12 T7 |
| openai/gpt-5.4-mini | harmful_skill_bench_c1_tier2_score | 0.18 | score_0_1 | p12 T7 |
| openai/gpt-5.4-mini | harmful_skill_bench_c2_tier2_score | 0.34 | score_0_1 | p12 T7 |
| openai/gpt-5.4-mini | harmful_skill_bench_c3_tier2_score | 0.52 | score_0_1 | p12 T7 |
| openai/gpt-5.4-mini | harmful_skill_bench_c4_tier2_score | 0.73 | score_0_1 | p12 T7 |
| google/gemini-3-flash | harmful_skill_bench_c1_tier2_score | 0.17 | score_0_1 | p12 T7 |
| google/gemini-3-flash | harmful_skill_bench_c2_tier2_score | 0.36 | score_0_1 | p12 T7 |
| google/gemini-3-flash | harmful_skill_bench_c3_tier2_score | 0.55 | score_0_1 | p12 T7 |
| google/gemini-3-flash | harmful_skill_bench_c4_tier2_score | 0.80 | score_0_1 | p12 T7 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_c1_tier2_score | 0.07 | score_0_1 | p12 T7 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_c2_tier2_score | 0.36 | score_0_1 | p12 T7 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_c3_tier2_score | 0.70 | score_0_1 | p12 T7 |
| alibaba/qwen3-235b-a22b | harmful_skill_bench_c4_tier2_score | 0.79 | score_0_1 | p12 T7 |
| moonshot/kimi-k2.5 | harmful_skill_bench_c1_tier2_score | 0.08 | score_0_1 | p12 T7 |
| moonshot/kimi-k2.5 | harmful_skill_bench_c2_tier2_score | 0.46 | score_0_1 | p12 T7 |
| moonshot/kimi-k2.5 | harmful_skill_bench_c3_tier2_score | 0.71 | score_0_1 | p12 T7 |
| moonshot/kimi-k2.5 | harmful_skill_bench_c4_tier2_score | 0.81 | score_0_1 | p12 T7 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_c1_tier2_score | 0.03 | score_0_1 | p12 T7 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_c2_tier2_score | 0.37 | score_0_1 | p12 T7 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_c3_tier2_score | 0.46 | score_0_1 | p12 T7 |
| deepseek/deepseek-v3.2 | harmful_skill_bench_c4_tier2_score | 0.80 | score_0_1 | p12 T7 |

**Total triples: 168** (144 from Table 6 main: 6 models x 24 fields, + 24 from Table 7 ablation: 6 models x 4 conditions).

## New bench IDs to register

No collision with existing safety benches in DB (xl_safetybench_asr/csr, finsafetybench, harmbench, jailbreakbench, ailuminate_v1). Family slug `harmful_skill_bench` with sub-metric suffixes:

**Main conditions (Table 6):**
- `harmful_skill_bench_a_all_refusal` — Condition A (Passive Exposure), All Tier1+2, Refusal% (higher=safer)
- `harmful_skill_bench_a_all_score` — Condition A, All Tier1+2, composite harm score 0-1 (lower=safer)
- `harmful_skill_bench_a_tier1_refusal` — Condition A, Tier-1 Prohibited Use, Refusal%
- `harmful_skill_bench_a_tier1_score` — Condition A, Tier-1, composite harm score
- `harmful_skill_bench_a_tier2_refusal` — Condition A, Tier-2 High-Risk, Refusal%
- `harmful_skill_bench_a_tier2_hitl` — Condition A, Tier-2, HiTL% (Human-in-The-Loop recommend rate)
- `harmful_skill_bench_a_tier2_aid` — Condition A, Tier-2, AID% (AI Disclosure rate)
- `harmful_skill_bench_a_tier2_score` — Condition A, Tier-2, composite harm score
- `harmful_skill_bench_b_*` — Condition B (Active Invocation), same 8 sub-metrics
- `harmful_skill_bench_d_*` — Condition D (No-Skill Baseline), same 8 sub-metrics

**Tier-2 safeguard ablation (Table 7):**
- `harmful_skill_bench_c1_tier2_score` — C1 (HiTL+, AID+) explicit both safeguards
- `harmful_skill_bench_c2_tier2_score` — C2 (HiTL+, AID-)
- `harmful_skill_bench_c3_tier2_score` — C3 (HiTL-, AID+)
- `harmful_skill_bench_c4_tier2_score` — C4 (HiTL-, AID-) neither instructed

All scores are composites on [0,1]: lower = safer. Refusal%/HiTL%/AID% are [0,100]: higher = safer.

## New model IDs

All six already canonical (no new IDs):
- openai/gpt-4o
- openai/gpt-5.4-mini
- google/gemini-3-flash (reasoning set to "minimal")
- alibaba/qwen3-235b-a22b
- moonshot/kimi-k2.5
- deepseek/deepseek-v3.2

## Skipped

- **Condition C raw Refusal%/HiTL%/AID% (Table 7)** — captured composite Score only. Sub-rates available if needed: 6 models x 4 conditions x 3 rates = 72 more triples (omitted as derivative of score).
- **Heatmap per-category scores (Figure 11)** — 6 models x 20 categories x 3 conditions = 360 cells, image-only; would require pixel reading. Not extracted under strict-attribution.
- **AVG rows** (averages across the 6 models) — derivative, not per-model.
- **Skill prevalence stats (Tables 1, 3)** — ecosystem measurement (% harmful per registry), not model evaluations.
- **Threshold-tuning results (Table 2)** — scorer F1/precision/recall vs threshold, not model evals.
- **Appendix Tables 8-14** — referenced (full taxonomy, downstream policies, method validation, category examples, case studies) but no additional per-model benchmark scores.

## Total

**168 score triples** across 6 models x 28 bench-condition slugs (24 main + 4 Tier-2 safeguard ablation).
