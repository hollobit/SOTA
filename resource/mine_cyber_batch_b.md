# Cyber Batch B — 3 benchmark papers

STRICT-ATTRIBUTION: every score below is (model, benchmark, value) explicitly stated in the cited paper's tables/text. No extrapolation. Model IDs anonymized in source papers ("alias1", "alias0") preserved as-is — they are research-tagged CAI Robotics agents, not frontier models, so excluded from frontier leaderboard but kept for completeness in CAIBench section.

---

## Paper 1: arxiv 2509.23571 — CyberTeam (Blue Team Threat Hunting)

**Bench slug**: `cyberteam` (a.k.a. CYBERTEAM)
**Dataset**: 452,293 instances · 30 tasks across 4 phases (Threat Attribution, Behavior Analysis, Prioritization, Response & Mitigation) · 9 operational modules · 23 sources
**Metrics** (per Table 2, task-dependent): F1, Sim (BERTScore), Acc, Hit@10, Pass, Normalized Distance — scaled to [0,100]
**Modes**: Open-ended (ICL5, ICL10, CoT, ToT) vs Standardized (Ours = CyberTeam modular)

**Models evaluated** (Table 3 column headers):
- Cybersecurity Agents: LY=Lily-Cybersecurity-7B, DH=DeepHat-7B, SL=SevenLLM-7B
- Industry LLMs: G4o=GPT-4o, Go4=GPT-o4-mini, QW=Qwen3-32B, GM=Gemini-2.5, CD=Claude-Sonnet-4, L3.1=Llama-3.1-405B, L4=Llama-4-Scout-17B, GA=Gemma-3-27B

### Table 3 — Standardized (CyberTeam Ours) scores [scaled to 100]

#### Playbook Recommend (Hit@10)
| Model | Score |
|---|---|
| Lily-Cybersecurity-7B | 67.2 |
| DeepHat-7B | 58.4 |
| SevenLLM-7B | 66.8 |
| GPT-4o | 84.6 |
| GPT-o4-mini | 91.4 |
| Qwen3-32B | 79.3 |
| Gemini-2.5 | 91.8 |
| Claude-Sonnet-4 | 89.3 |
| Llama-3.1-405B | 89.7 |
| Llama-4-Scout-17B | 79.7 |
| Gemma-3-27B | 78.8 |

#### Security Control Adjust (Sim/BERTScore)
| Model | Score |
|---|---|
| Lily-Cybersecurity-7B | 74.2 |
| DeepHat-7B | 77.6 |
| SevenLLM-7B | 80.1 |
| GPT-4o | 82.1 |
| GPT-o4-mini | 89.7 |
| Qwen3-32B | 74.7 |
| Gemini-2.5 | 88.5 |
| Claude-Sonnet-4 | 86.5 |
| Llama-3.1-405B | 86.4 |
| Llama-4-Scout-17B | 76.4 |
| Gemma-3-27B | 75.5 |

#### Patch Code Generation (Pass)
| Model | Score |
|---|---|
| Lily-Cybersecurity-7B | 29.7 |
| DeepHat-7B | 63.4 |
| SevenLLM-7B | 60.2 |
| GPT-4o | 72.5 |
| GPT-o4-mini | 87.4 |
| Qwen3-32B | 65.4 |
| Gemini-2.5 | 82.6 |
| Claude-Sonnet-4 | 79.2 |
| Llama-3.1-405B | 80.6 |
| Llama-4-Scout-17B | 70.6 |
| Gemma-3-27B | 69.7 |

#### Patch Tool Suggestion (Hit@10)
| Model | Score |
|---|---|
| Lily-Cybersecurity-7B | 69.1 |
| DeepHat-7B | 76.5 |
| SevenLLM-7B | 77.7 |
| GPT-4o | 87.4 |
| GPT-o4-mini | 96.9 |
| Qwen3-32B | 83.6 |
| Gemini-2.5 | 93.2 |
| Claude-Sonnet-4 | 91.2 |
| Llama-3.1-405B | 92.1 |
| Llama-4-Scout-17B | 82.1 |
| Gemma-3-27B | 81.2 |

#### Advisory Correlation (Hit@10)
| Model | Score |
|---|---|
| Lily-Cybersecurity-7B | 73.4 |
| DeepHat-7B | 78.8 |
| SevenLLM-7B | 77.1 |
| GPT-4o | 80.3 |
| GPT-o4-mini | 92.3 |
| Qwen3-32B | 76.5 |
| Gemini-2.5 | 86.9 |
| Claude-Sonnet-4 | 84.5 |
| Llama-3.1-405B | 84.9 |
| Llama-4-Scout-17B | 74.9 |
| Gemma-3-27B | 74.0 |

**Composite cyberteam_avg5** (mean of the 5 Standardized sub-tasks above):
| Model | cyberteam_avg5 |
|---|---|
| Lily-Cybersecurity-7B | 62.72 |
| DeepHat-7B | 70.94 |
| SevenLLM-7B | 72.38 |
| GPT-4o | 81.38 |
| GPT-o4-mini | 91.54 |
| Qwen3-32B | 75.90 |
| Gemini-2.5 | 88.60 |
| Claude-Sonnet-4 | 86.14 |
| Llama-3.1-405B | 86.86 |
| Llama-4-Scout-17B | 76.74 |
| Gemma-3-27B | 75.84 |

Triples: 11 models × 5 sub-bench = **55 triples** (Standardized only — paper also reports ICL5/ICL10/CoT/ToT for each but kept just Standardized to avoid 275-row noise; full table available in paper p.7).

---

## Paper 2: arxiv 2510.24317 — CAIBench (Meta-Benchmark)

**Bench slug**: `caibench` (meta) + 4 new sub-benches
**Architecture**: 5 categories · 10,000+ instances · Docker + scripted infra
- Jeopardy CTF: Base (23 chals) + Cybench (35) + **RCTF2 (27, NEW — robotics)** + AutoPenBench (29)
- A&D CTF: 10 chals (Pingpong, Cowsay, Notes, Devops, Docuflow, Securevault, Hydrocore, Reactorwatch, Monolithsentinel, Fortress)
- Cyber Range: 10 chals
- Knowledge: SecEval (+2k), CTIBench (+3k MCQ+RCM), CyberMetric (+10k, eval on first 4,500)
- Privacy: **CyberPII-Bench (78, NEW)** — Precision/Recall/F1/F2 over memory01_78 dataset

**Metric**: pass@100 @ 1 for CTF/RCTF2, pass@200 @ 1 for Cyber Ranges, % for knowledge, P/R/F1/F2 for privacy, Win-Tie-Loss % for A&D.

### Table 5 — Master Scoreboard (CAIBench combined)

Note: `alias1` = CAI-tuned proprietary research model (Alias Robotics); `alias0` = base. Treated as research models, NOT frontier. Privacy/A&D marked N/A for non-GDPR-compliant providers in paper.

#### Jeopardy CTF — Base (% pass@100@1, 23 chals)
| Model | Score |
|---|---|
| alias1 | 67 |
| alias0 | 67 |
| GPT-5 | 58 |
| Claude-Sonnet-4.5 | 75 |
| Gemini-2.5-Pro | 54 |
| Qwen3-32B | 45 |

#### Jeopardy CTF — Cybench (% pass@100@1, 35 chals)
| Model | Score |
|---|---|
| alias1 | 31 |
| alias0 | 14 |
| GPT-5 | 28 |
| Claude-Sonnet-4.5 | 46 |
| Gemini-2.5-Pro | 18 |
| Qwen3-32B | 10 |

#### Jeopardy CTF — RCTF2 (% pass@100@1, 27 robotics chals) — NEW BENCH
| Model | Score |
|---|---|
| alias1 | 22 |

(Only alias1 reported; paper notes 6/27 chals solved: CVE-2020-10270, CVE-2020-10279 on MiR 100; CVE-2020-10265 on UR CB3 & e-Series; Otto FLAG1; xArm RVD#3321.)

#### Knowledge — SecEval (%)
| Model | Score |
|---|---|
| alias1 | 72 |
| alias0 | 78 |
| GPT-5 | 70 |
| Qwen3-32B | 71 |
| DeepSeek-R1-0528 | 71 |

#### Knowledge — CTIBench MCQ (%)
| Model | Score |
|---|---|
| alias1 | 73 |
| alias0 | 75 |
| GPT-5 | 73 |
| Qwen3-32B | 67 |
| DeepSeek-R1-0528 | 74 |

#### Knowledge — CTIBench RCM (%)
| Model | Score |
|---|---|
| alias1 | 74 |
| alias0 | 74 |
| GPT-5 | 61 |
| Qwen3-32B | 63 |
| DeepSeek-R1-0528 | 69 |

#### Knowledge — CyberMetric-4500 (%)
| Model | Score |
|---|---|
| alias1 | 89 |
| alias0 | 88 |
| GPT-5 | 87 |
| Qwen3-32B | 88 |
| DeepSeek-R1-0528 | 88 |

#### Privacy — CyberPII-Bench (NEW; Precision / Recall / F1 / F2)
| Model | P | R | F1 | F2 |
|---|---|---|---|---|
| alias1 | 0.52 | 0.42 | 0.46 | 0.44 |
| alias0 | 0.36 | 0.38 | 0.37 | 0.37 |
| PrivateAI | 0.36 | 0.34 | 0.35 | 0.34 |

#### Cyber Ranges (% pass@200@1, 10 chals)
| Model | Score |
|---|---|
| alias1 | 50 |
| GPT-5 | 60 |
| Claude-Sonnet-4.5 | 50 |
| alias0 | 30 (from text §3.5, not Table 5) |

#### A&D Models (Win-Tie-Loss %, 10 machines, 20-min matchups)
| Model | W-T-L |
|---|---|
| alias1 | 30-50-20 |
| GPT-5 | 40-40-20 |
| Claude-Sonnet-4 | 20-50-30 |

(Per fig 12: alias1 vs GPT-5 = 20-40-40; alias1 vs Claude-Sonnet-4 = 30-50-20. Aggregates also reported.)

#### A&D Agent frameworks (Cowsay+Pingpong total points; Fig 14)
| Agent | Cowsay | Pingpong | Total |
|---|---|---|---|
| CAI/alias1 | 347 | 404 | 751 |
| Claude Code (claude-sonnet-4.5) | 143 | 143 | 286 |
| Codex (gpt-5-codex) | 143 | 143 | 286 |
| Gemini CLI (gemini-2.5-pro) | 104 | 104 | 208 |
| Qwen Coder (qwen3-coder) | 65 | 47 | 112 |

**Composite caibench score**: paper does not define single composite — each category reported separately. Knowledge avg 70-89%, A&D 20-40%, RCTF2 22%.

Triples (frontier-relevant models only, excluding alias*/PrivateAI research models): 
- Knowledge SecEval: 2 (GPT-5, Qwen3-32B; DeepSeek-R1-0528 = research)
- Knowledge CTIBench-MCQ: 2 (GPT-5, Qwen3-32B)
- Knowledge CTIBench-RCM: 2
- Knowledge CyberMetric-4500: 2
- Base CTF: 4 (GPT-5, Claude-Sonnet-4.5, Gemini-2.5-Pro, Qwen3-32B)
- Cybench: 4
- Cyber Ranges: 2 (GPT-5, Claude-Sonnet-4.5)
- A&D models: 2 (GPT-5, Claude-Sonnet-4)
- A&D agent: 4 (Claude Code, Codex, Gemini CLI, Qwen Code)
- DeepSeek-R1-0528: 4 (knowledge benches)
- alias1/alias0: track as research models

Frontier triples: 8+8+2+2+4+4 = **~28 frontier triples** (existing benches Cybench is `cybench` dedup; SecEval/CTIBench/CyberMetric are pre-existing — only RCTF2 and CyberPII-Bench are NEW slugs introduced by this paper).

---

## Paper 3: arxiv 2603.13517 — CTI-REALM

**Bench slug**: `cti_realm_25` (12L+9A+4C = 25 tasks) and `cti_realm_50` (25L+17A+8C = 50 tasks)
**Dataset**: 50 attack simulations across Linux endpoints / Azure Kubernetes Service / Azure Cloud, 37 source CTI reports (Microsoft Security, Datadog, Palo Alto, Splunk)
**Metric**: normalized reward in [0,1] = 0.35·R_checkpoint + 0.65·R_ground_truth
- C0 (CTI report analysis, w=0.125, LLM-as-judge)
- C1 (MITRE technique, w=0.075, Jaccard)
- C2 (Data exploration, w=0.10, Jaccard)
- C3 (Query execution, w=0.05, binary)
- C4 (Detection quality, w=0.65, F1+LLM-as-judge)

**Models evaluated**: 16 frontier configs

### Table 1 — CTI-REALM-50 Overall (normalized reward)
| Model | Provider | Reward | StdErr | 95% CI | CheckpointR | GT_Reward | C0 | C1 | C2 | C3 | Steps |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Claude Opus 4.6 (High) | Anthropic | 0.6373 | 0.0374 | [0.562, 0.712] | 0.266 | 0.372 | 0.83 | 0.50 | 0.82 | 0.86 | 31 |
| Claude Opus 4.5 | Anthropic | 0.6244 | 0.0338 | [0.556, 0.692] | 0.287 | 0.337 | 0.91 | 0.56 | 0.85 | 0.92 | 32 |
| Claude Sonnet 4.5 | Anthropic | 0.5872 | 0.0328 | [0.521, 0.653] | 0.278 | 0.310 | 0.85 | 0.54 | 0.87 | 0.88 | 37 |
| GPT-5 (Med) | OpenAI | 0.5720 | 0.0337 | [0.504, 0.640] | 0.235 | 0.337 | 0.72 | 0.54 | 0.86 | 0.38 | 32 |
| GPT-5.2 (Med) | OpenAI | 0.5716 | 0.0325 | [0.506, 0.637] | 0.226 | 0.346 | 0.60 | 0.37 | 0.86 | 0.72 | 31 |
| GPT-5 (High) | OpenAI | 0.5635 | 0.0329 | [0.497, 0.629] | 0.230 | 0.333 | 0.66 | 0.55 | 0.86 | 0.40 | 32 |
| GPT-5.2 (High) | OpenAI | 0.5513 | 0.0367 | [0.478, 0.625] | 0.232 | 0.319 | 0.60 | 0.40 | 0.85 | 0.84 | 35 |
| GPT-5 (Low) | OpenAI | 0.5413 | 0.0315 | [0.478, 0.605] | 0.204 | 0.337 | 0.61 | 0.45 | 0.84 | 0.22 | 25 |
| GPT-5.1 (Med) | OpenAI | 0.5133 | 0.0300 | [0.453, 0.574] | 0.244 | 0.269 | 0.72 | 0.62 | 0.87 | 0.42 | 26 |
| GPT-5.1 (High) | OpenAI | 0.5133 | 0.0373 | [0.439, 0.587] | 0.238 | 0.256 | 0.71 | 0.55 | 0.80 | 0.56 | 29 |
| GPT-5.2 (Low) | OpenAI | 0.4946 | 0.0248 | [0.440, 0.540] | 0.221 | 0.269 | 0.57 | 0.49 | 0.88 | 0.50 | 27 |
| O3 | OpenAI | 0.4707 | 0.0281 | [0.414, 0.527] | 0.204 | 0.263 | 0.51 | 0.38 | 0.78 | 0.68 | 33 |
| GPT-5-Mini | OpenAI | 0.4506 | 0.0292 | [0.392, 0.509] | 0.188 | 0.263 | 0.62 | 0.21 | 0.84 | 0.20 | 27 |
| GPT-4.1 | OpenAI | 0.4186 | 0.0235 | [0.371, 0.466] | 0.193 | 0.225 | 0.68 | 0.29 | 0.85 | 0.02 | 21 |
| GPT-5.1 (Low) | OpenAI | 0.3731 | 0.0211 | [0.331, 0.415] | 0.194 | 0.179 | 0.61 | 0.37 | 0.87 | 0.06 | 22 |
| O4-Mini | OpenAI | 0.3602 | 0.0238 | [0.312, 0.408] | 0.167 | 0.193 | 0.48 | 0.23 | 0.80 | 0.20 | 26 |

### Table 2 — CTI-REALM-25 Variance (3 epochs, top 5)
| Model | Mean | Std | Min | Max | 95% CI |
|---|---|---|---|---|---|
| Claude Opus 4.6 (High) | 0.6130 | 0.2626 | 0.0000 | 0.9426 | [0.553, 0.673] |
| Claude Opus 4.5 | 0.6124 | 0.2522 | 0.0000 | 0.9655 | [0.554, 0.670] |
| GPT-5 (Med) | 0.5454 | 0.2159 | 0.2406 | 0.9002 | [0.496, 0.594] |
| GPT-5.2 (Med) | 0.5331 | 0.2254 | 0.0000 | 0.9456 | [0.481, 0.585] |
| GPT-5.1 (Med) | 0.4815 | 0.1958 | 0.2416 | 0.9195 | [0.436, 0.527] |

Triples on cti_realm_50 (primary): **16 models × 1 = 16 triples** (overall reward). Plus C0/C1/C2/C3 per-checkpoint = 16×4 = 64 sub-checkpoint scores if treated as separate benches (cti_realm_50_c0/c1/c2/c3/c4). Excluding C4 (mechanically computed from F1+judge; reported as "GT_Reward" in Table 1).

Variance run on cti_realm_25: 5 models × 1 = 5 triples.

**Note on canonical IDs**: GPT-5.1 / GPT-5.2 here are paper's terminology (likely refer to internal OpenAI Aurora / Polaris variants per knowledge cutoff 2026-01). Claude Opus 4.6 / 4.5 / Sonnet 4.5 align with cyber batch A canonical IDs.

---

## Total

### New benchmarks introduced (4 unique slugs across 3 papers)
| Slug | Paper | Type | Size | Metric |
|---|---|---|---|---|
| `cyberteam` (+ 30 sub-tasks, 5 primary) | 2509.23571 | Blue team threat hunting | 452,293 inst, 30 tasks | F1/Sim/Acc/Hit@10/Pass/Norm-Dist, 0-100 |
| `rctf2` | 2510.24317 | Robotics CTF (Jeopardy) | 27 chals | pass@100@1 |
| `cyberpii_bench` | 2510.24317 | PII detection privacy | 78 entries | Precision/Recall/F1/F2 |
| `cti_realm_50` (+ `cti_realm_25` variant) | 2603.13517 | SOC detection rule generation | 50 / 25 tasks | normalized reward [0,1] |

### Composite/Meta slugs
- `caibench` — composite over Base + Cybench + RCTF2 + SecEval + CTIBench-MCQ + CTIBench-RCM + CyberMetric + CyberPII-Bench + Cyber Ranges + A&D. No single composite score; per-category only.
- `cyberteam_avg5` — mean of 5 Response & Mitigation sub-tasks (derived).

### New scores (frontier-only triples)
- Paper 1 cyberteam (Standardized, 11 models × 5 tasks): **55**
- Paper 2 caibench:
  - Knowledge (4 benches × 4 frontier+1 research models): ~16
  - CTF (Base+Cybench × 4 frontier): 8
  - Cyber Ranges: 2 frontier
  - A&D model + agent: 6 frontier
  - CyberPII-Bench: 2 (alias models only; research)
  - RCTF2: 1 (alias1 only; research)
  - **Frontier-relevant: ~32 triples**
- Paper 3 cti_realm_50: **16** (+ optional 64 checkpoint sub-scores + 5 variance reruns)

**TOTAL NEW SCORES (frontier-relevant, primary benches only): ~103 triples** (55 cyberteam + 32 caibench frontier + 16 cti_realm_50). With sub-checkpoint expansion of cti_realm: up to ~167 triples.

### Cross-vendor coverage
- **Anthropic**: Claude-Opus-4.6 (High), Claude-Opus-4.5, Claude-Sonnet-4.5, Claude-Sonnet-4 (P2, P3)
- **OpenAI**: GPT-5 / 5.1 / 5.2 (Low/Med/High), GPT-5-Mini, GPT-5-Codex, GPT-4.1, GPT-4o, GPT-o4-mini, O3, O4-Mini (all 3 papers)
- **Google**: Gemini-2.5, Gemini-2.5-Pro (P1, P2)
- **Meta**: Llama-3.1-405B, Llama-4-Scout-17B (P1)
- **Alibaba**: Qwen3-32B, Qwen3-Coder (P1, P2)
- **DeepSeek**: DeepSeek-R1-0528 (P2)
- **Google open**: Gemma-3-27B (P1)
- **Research**: Lily-Cybersecurity-7B, DeepHat-7B, SevenLLM-7B, alias0, alias1, PrivateAI (P1, P2)

### Dedup notes vs existing batch
- `cybench` (CAIBench section 3.2.2): EXISTING — already in seed; CAIBench numbers (Claude-Sonnet-4.5 46%, alias1 31%, GPT-5 28%, Gemini-2.5-Pro 18%, alias0 14%, Qwen3-32B 10%) are FRESH attribution to cybench from new harness.
- `secEval`, `ctiBench`, `cyberMetric` — EXISTING in literature; CAIBench numbers are new model attributions.
- No conflict with cybergym, nyu_ctf, simbian_cyber_defense_coverage, exploitbench_*, cyber_defense_bench, oss_fuzz_*, firefox_147_*, tlo_steps_completed.
