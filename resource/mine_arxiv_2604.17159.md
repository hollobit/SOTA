# arxiv 2604.17159 — Cyber Capability Benchmarking

## Paper summary
- **Title**: Systematic Capability Benchmarking of Frontier Large Language Models for Offensive Cyber Tasks
- **Authors**: Tyler H. Merves, Michael H. Conaway, Joseph M. Escobar (Dept. of Cybersecurity, SUNY Albany); Hakan T. Otal (Dept. of Information Sciences and Technology); Unal Tatar* (corresponding, utatar@albany.edu)
- **Affiliation**: University at Albany, SUNY — College of Emergency Preparedness, Homeland Security, and Cybersecurity
- **Date**: 18 Apr 2026 (arxiv v1)
- **Benchmark**: NYU CTF Bench — 200 challenges (cryptography 52, reverse engineering 51, binary exploitation 39, miscellaneous 24, web 19, forensics 15) sourced from CSAW 2016–2024
- **Framework**: Extended D-CIPHER with Kali Linux env (100+ pentest tools), multi-provider backend (Anthropic, OpenAI, Google/Vertex AI, OpenRouter, Ollama, Together AI), tool-discovery agents
- **Hyperparams**: T=1.0, 30 planner rounds (100 executor rounds), $5.00 cost limit/challenge, 10-min wall-clock; all 10 models evaluated under Kali + Generic prompts, no AutoPrompt (RQ3 config)
- **Source code**: https://github.com/TATAR-LAB/ctf-agents

## Score extractions

### Table I — Overall Solve Rate on NYU CTF Bench (200 challenges, Kali + Generic prompts) — p4 T1

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.5 | nyu-ctf-bench | 59.0 | % (118/200) | p4 Table I |
| google/gemini-3-pro | nyu-ctf-bench | 52.0 | % (104/200) | p4 Table I |
| google/gemini-3-flash | nyu-ctf-bench | 27.0 | % (54/200) | p4 Table I |
| z-ai/glm-5 | nyu-ctf-bench | 19.5 | % (39/200) | p4 Table I |
| openai/gpt-5.2-codex | nyu-ctf-bench | 18.0 | % (36/200) | p4 Table I |
| openai/gpt-5.2 | nyu-ctf-bench | 13.5 | % (27/200) | p4 Table I |
| deepseek/deepseek-v3 | nyu-ctf-bench | 6.5 | % (13/200) | p4 Table I |
| deepseek/deepseek-r1 | nyu-ctf-bench | 4.0 | % (8/200) | p4 Table I |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench | 3.5 | % (7/200) | p4 Table I |
| meta/llama-3.3-70b | nyu-ctf-bench | 2.5 | % (5/200) | p4 Table I |

### Table I — Cost ($) per Run

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.5 | nyu-ctf-bench:cost | 249.92 | USD total | p4 Table I |
| google/gemini-3-pro | nyu-ctf-bench:cost | 44.23 | USD total | p4 Table I |
| google/gemini-3-flash | nyu-ctf-bench:cost | 2.69 | USD total | p4 Table I |
| z-ai/glm-5 | nyu-ctf-bench:cost | 22.09 | USD total | p4 Table I |
| openai/gpt-5.2-codex | nyu-ctf-bench:cost | 9.23 | USD total | p4 Table I |
| openai/gpt-5.2 | nyu-ctf-bench:cost | 7.47 | USD total | p4 Table I |
| deepseek/deepseek-v3 | nyu-ctf-bench:cost | 0.19 | USD total | p4 Table I |
| deepseek/deepseek-r1 | nyu-ctf-bench:cost | 0.13 | USD total | p4 Table I |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:cost | 1.39 | USD total | p4 Table I |
| meta/llama-3.3-70b | nyu-ctf-bench:cost | 0.03 | USD total | p4 Table I |

### Table I — Cost per Solve ($/Solve)

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.5 | nyu-ctf-bench:cost-per-solve | 2.12 | USD/solve | p4 Table I |
| google/gemini-3-pro | nyu-ctf-bench:cost-per-solve | 0.43 | USD/solve | p4 Table I |
| google/gemini-3-flash | nyu-ctf-bench:cost-per-solve | 0.05 | USD/solve | p4 Table I |
| z-ai/glm-5 | nyu-ctf-bench:cost-per-solve | 0.57 | USD/solve | p4 Table I |
| openai/gpt-5.2-codex | nyu-ctf-bench:cost-per-solve | 0.26 | USD/solve | p4 Table I |
| openai/gpt-5.2 | nyu-ctf-bench:cost-per-solve | 0.28 | USD/solve | p4 Table I |
| deepseek/deepseek-v3 | nyu-ctf-bench:cost-per-solve | 0.01 | USD/solve | p4 Table I |
| deepseek/deepseek-r1 | nyu-ctf-bench:cost-per-solve | 0.13 | USD/solve | p4 Table I |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:cost-per-solve | 1.39 | USD/solve | p4 Table I (sole solve denominator note: 7 solves → 0.20; paper reports 1.39 — verbatim) |
| meta/llama-3.3-70b | nyu-ctf-bench:cost-per-solve | 0.01 | USD/solve | p4 Table I |

### Figure 3 — Per-Category Solve Rates (10 models × 6 categories) — p5 Fig 3

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.5 | nyu-ctf-bench:crypto | 61.5 | % | p5 Fig 3 |
| anthropic/claude-opus-4.5 | nyu-ctf-bench:forensics | 53.3 | % | p5 Fig 3 |
| anthropic/claude-opus-4.5 | nyu-ctf-bench:misc | 79.2 | % | p5 Fig 3 |
| anthropic/claude-opus-4.5 | nyu-ctf-bench:pwn | 41.0 | % | p5 Fig 3 |
| anthropic/claude-opus-4.5 | nyu-ctf-bench:reverse | 64.7 | % | p5 Fig 3 |
| anthropic/claude-opus-4.5 | nyu-ctf-bench:web | 52.6 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:crypto | 53.8 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:forensics | 46.7 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:misc | 70.8 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:pwn | 33.3 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:reverse | 58.8 | % | p5 Fig 3 |
| google/gemini-3-pro | nyu-ctf-bench:web | 47.4 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:crypto | 36.5 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:forensics | 13.3 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:misc | 29.2 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:pwn | 28.2 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:reverse | 17.6 | % | p5 Fig 3 |
| google/gemini-3-flash | nyu-ctf-bench:web | 31.6 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:crypto | 13.5 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:forensics | 20.0 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:misc | 29.2 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:pwn | 15.4 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:reverse | 23.5 | % | p5 Fig 3 |
| z-ai/glm-5 | nyu-ctf-bench:web | 21.1 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:crypto | 23.1 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:forensics | 6.7 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:misc | 25.0 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:pwn | 20.5 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:reverse | 9.8 | % | p5 Fig 3 |
| openai/gpt-5.2-codex | nyu-ctf-bench:web | 21.1 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:crypto | 19.2 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:forensics | 0.0 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:misc | 25.0 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:pwn | 5.1 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:reverse | 11.8 | % | p5 Fig 3 |
| openai/gpt-5.2 | nyu-ctf-bench:web | 15.8 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:crypto | 1.9 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:forensics | 6.7 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:misc | 12.5 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:pwn | 7.7 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:reverse | 9.8 | % | p5 Fig 3 |
| deepseek/deepseek-v3 | nyu-ctf-bench:web | 0.0 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:crypto | 0.0 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:forensics | 0.0 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:misc | 8.3 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:pwn | 2.6 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:reverse | 5.9 | % | p5 Fig 3 |
| deepseek/deepseek-r1 | nyu-ctf-bench:web | 10.5 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:crypto | 1.9 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:forensics | 6.7 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:misc | 8.3 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:pwn | 0.0 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:reverse | 5.9 | % | p5 Fig 3 |
| alibaba/qwen-3.5-397b-a17b | nyu-ctf-bench:web | 0.0 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:crypto | 0.0 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:forensics | 0.0 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:misc | 12.5 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:pwn | 0.0 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:reverse | 3.9 | % | p5 Fig 3 |
| meta/llama-3.3-70b | nyu-ctf-bench:web | 0.0 | % | p5 Fig 3 |

### Figure 2 — RQ1+RQ2 Ablation: Solve Rates by Configuration (Gemini 3 Pro only, 8 configs × 6 categories + Overall) — p4 Fig 2

Format: `OS | Tips | AP | Crypto | Forensics | Misc | Pwn | Reverse | Web | Overall`

| Config | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| google/gemini-3-pro (Ubuntu, no-tips, no-AP) | nyu-ctf-bench:overall | 42.5 | % (85/200) | p4 Fig 2 |
| google/gemini-3-pro (Ubuntu, no-tips, AP) | nyu-ctf-bench:overall | 30.5 | % (61/200) | p4 Fig 2 |
| google/gemini-3-pro (Ubuntu, tips, no-AP) | nyu-ctf-bench:overall | 44.5 | % | p4 Fig 2 |
| google/gemini-3-pro (Ubuntu, tips, AP) | nyu-ctf-bench:overall | 16.0 | % (32/200) | p4 Fig 2 |
| google/gemini-3-pro (Kali, no-tips, no-AP) | nyu-ctf-bench:overall | 52.0 | % | p4 Fig 2 |
| google/gemini-3-pro (Kali, no-tips, AP) | nyu-ctf-bench:overall | 39.5 | % (79/200) | p4 Fig 2 |
| google/gemini-3-pro (Kali, tips, no-AP) | nyu-ctf-bench:overall | 40.0 | % (80/200) | p4 Fig 2 |
| google/gemini-3-pro (Kali, tips, AP) | nyu-ctf-bench:overall | 48.5 | % | p4 Fig 2 |

### Table II — Planner/Executor Architecture (RQ4, Gemini 3 Pro/Flash, Kali + Generic) — p5 Table II

| Planner | Executor | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|---|
| Gemini 3 Pro | Gemini 3 Pro | nyu-ctf-bench (planner/executor) | 52.0 | % (104 solved, $44.23) | p5 Table II |
| Gemini 3 Pro | Gemini 3 Flash | nyu-ctf-bench (planner/executor) | 28.5 | % (57 solved, $3.90) | p5 Table II |
| Gemini 3 Flash | Gemini 3 Flash | nyu-ctf-bench (planner/executor) | 27.0 | % (54 solved, $2.69) | p5 Table II |
| Gemini 3 Flash | Gemini 3 Pro | nyu-ctf-bench (planner/executor) | 23.5 | % (47 solved, $2.92) | p5 Table II |

### Prior SOTA baselines mentioned (p4) — informational, not own measurement

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| D-CIPHER (Claude 3.5 Sonnet) | nyu-ctf-bench | 22.0 | % | p4 §IV-B (cites [7]) |
| CRAKEN (Claude 3.5 Sonnet) | nyu-ctf-bench | 22.0 | % | p4 §IV-B (cites [8]) |
| openai/gpt-4 | nyu-ctf-bench | single-digit | % | p4 §IV-B (cites [5]/[9]) |

## New bench IDs to register
- **`nyu-ctf-bench`** (200 CTF challenges from CSAW 2016–2024) — metric: `solve_rate` (% of 200) ; sub-metrics: `crypto`, `forensics`, `misc`, `pwn`, `reverse`, `web` (per-category solve %), `cost`, `cost-per-solve`
- Existing as ref [5] (arxiv 2406.05590, Shao et al.). Use slug `nyu-ctf-bench` or `nyu-ctf`.

## New model IDs (if any)
- `anthropic/claude-opus-4.5` — Claude 4.5 Opus (already canonical)
- `google/gemini-3-pro` — Gemini 3 Pro
- `google/gemini-3-flash` — Gemini 3 Flash
- `openai/gpt-5.2` — GPT-5.2 (base)
- `openai/gpt-5.2-codex` — GPT-5.2-Codex (code-specialized variant)
- `z-ai/glm-5` — GLM-5 (Z-AI / Zhipu) — verify provider slug
- `deepseek/deepseek-v3` — DeepSeek-V3
- `deepseek/deepseek-r1` — DeepSeek-R1
- `alibaba/qwen-3.5-397b-a17b` — Qwen 3.5 397B-A17B (MoE)
- `meta/llama-3.3-70b` — Llama 3.3 70B

All 10 are present-day frontier candidates; verify each against registry before insert.

## Skipped
- Cost-per-solve for Qwen 3.5 397B-A17B in Table I prints `1.39` — same as total cost; this looks like a typo in the paper (true value should be ~$0.20). Kept verbatim per strict-attribution.
- Figure 4 (cost-performance scatter): no new numeric data beyond Table I.
- Cyber-permissive variants (per memory): no Claude/GPT cyber-policy variants reported here — all evaluated under default refusal policy.

## Total
- **Table I** (overall solve, cost, cost-per-solve): 10 models × 3 metrics = **30 triples**
- **Figure 3** (per-category): 10 models × 6 categories = **60 triples**
- **Figure 2** (Gemini-3-Pro ablation overall only): **8 config triples** (configuration metadata, not pure model rows)
- **Table II** (planner/executor pairs): **4 architecture triples** (compound model rows)
- **Prior SOTA**: 3 informational triples (Claude 3.5 Sonnet × D-CIPHER/CRAKEN; GPT-4 baseline)

**Total scored triples: 90 model-level (Table I + Fig 3) + 12 ablation/architecture + 3 historical baselines = 105 triples total**
