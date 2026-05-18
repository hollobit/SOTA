# arxiv 2604.19533 — Cyber Defense Benchmark: Agentic Threat Hunting Evaluation for LLMs in SecOps

## Paper summary
- Title: "Cyber Defense Benchmark: Agentic Threat Hunting Evaluation for LLMs in SecOps" (p1 title block; not anonymous — authors disclosed)
- Authors: Alankrit Chona, Igor Kozlov, Ambuj Kumar (Simbian AI)
- Date / venue: Simbian AI Technical Report v1.0, April 2026 (page footer). arxiv 2604.19533
- New bench: **Cyber Defense Benchmark** (slug suggestion: `cyber-defense-benchmark` / `simbian-cdb`)
  - Primary metric: **Coverage Score** in [0,1] — instance-weighted fraction of coverable narrative (attack-chain) steps detected per run, averaged across 26 campaign instances (p4 §3.2, p9 Table 5 caption)
  - Wraps 106 OTRF Security-Datasets attack procedures spanning 93 MITRE ATT&CK sub-techniques across 13 tactics (12 kill-chain + Resource Development) into a Gymnasium RL env (p1 abstract, p6 Table 2)
  - Each episode: in-memory SQLite DB of 75k–135k logs, 50-query budget, 1.5x safety cap at 75 agent turns (p4 §3.1, p4 §4.1)
  - Pass bar: ≥50% recall on every ATT&CK tactic — **no model passes** (p2, p10 §9.2)
- Companion artifacts: simbian.ai/research/cyber-defense-benchmark; github.com/simbianai/cyber_defense_benchmark (p1)

## Score extractions

### Table 5: Leaderboard — primary Coverage Score (mean ± σ) (p9)
| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.6 | CyberDefenseBench / Coverage Score | 0.55 ± 0.05 | score [0,1] | p9 Table 5 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Coverage Score | 0.44 ± 0.08 | score [0,1] | p9 Table 5 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Coverage Score | 0.36 ± 0.13 | score [0,1] | p9 Table 5 |
| google/gemini-3.1-pro (Preview) | CyberDefenseBench / Coverage Score | 0.22 ± 0.13 | score [0,1] | p9 Table 5 |
| openai/gpt-5 | CyberDefenseBench / Coverage Score | 0.21 ± 0.13 | score [0,1] | p9 Table 5 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Coverage Score | 0.20 ± 0.14 | score [0,1] | p9 Table 5 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Coverage Score | 0.19 ± 0.11 | score [0,1] | p9 Table 5 |
| google/gemini-3-flash (Preview) | CyberDefenseBench / Coverage Score | 0.18 ± 0.08 | score [0,1] | p9 Table 5 |
| minimax/minimax-m2.7 | CyberDefenseBench / Coverage Score | 0.15 ± 0.10 | score [0,1] | p9 Table 5 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Coverage Score | 0.11 ± 0.13 | score [0,1] | p9 Table 5 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Coverage Score | 0.10 ± 0.07 | score [0,1] | p9 Table 5 |

### Table 5: Auxiliary — "Flags found %" (n_flags_in_submitted / total_flags at final step, mean ± σ) (p9)
| Model | Metric | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.6 | CyberDefenseBench / Flags-found % | 4.48 ± 1.40 | % | p9 Table 5 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Flags-found % | 3.43 ± 1.12 | % | p9 Table 5 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Flags-found % | 0.91 ± 1.59 | % | p9 Table 5 |
| google/gemini-3.1-pro (Preview) | CyberDefenseBench / Flags-found % | 2.01 ± 1.70 | % | p9 Table 5 |
| openai/gpt-5 | CyberDefenseBench / Flags-found % | 2.24 ± 1.13 | % | p9 Table 5 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Flags-found % | 1.15 ± 1.06 | % | p9 Table 5 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Flags-found % | 2.24 ± 2.59 | % | p9 Table 5 |
| google/gemini-3-flash (Preview) | CyberDefenseBench / Flags-found % | 1.44 ± 0.83 | % | p9 Table 5 |
| minimax/minimax-m2.7 | CyberDefenseBench / Flags-found % | 0.98 ± 0.64 | % | p9 Table 5 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Flags-found % | 0.86 ± 1.09 | % | p9 Table 5 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Flags-found % | 0.82 ± 0.79 | % | p9 Table 5 |

### Table 6: Per-tactic normalized recall (high-severity, high-relevance flags; 1.0 = best-of-pool for that tactic) (p11)
| Model | Tactic | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.6 | CyberDefenseBench / Defense Evasion | 0.59 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Execution | 0.56 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Persistence | 0.56 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Resource Development | 0.56 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Command and Control | 0.55 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Discovery | 0.54 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Privilege Escalation | 0.52 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Initial Access | 0.37 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Impact | 0.33 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Credential Access | 0.27 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Lateral Movement | 0.25 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Collection | 0.24 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.6 | CyberDefenseBench / Exfiltration | 0.24 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Defense Evasion | 0.49 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Execution | 0.45 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Persistence | 0.43 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Resource Development | 0.44 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Command and Control | 0.45 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Discovery | 0.37 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Privilege Escalation | 0.41 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Initial Access | 0.24 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Impact | 0.28 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Credential Access | 0.20 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Lateral Movement | 0.18 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Collection | 0.16 | norm recall | p11 Table 6 |
| anthropic/claude-sonnet-4.6 | CyberDefenseBench / Exfiltration | 0.17 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Defense Evasion | 0.38 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Execution | 0.36 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Persistence | 0.34 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Resource Development | 0.34 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Command and Control | 0.41 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Discovery | 0.37 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Privilege Escalation | 0.31 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Initial Access | 0.19 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Impact | 0.24 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Credential Access | 0.14 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Lateral Movement | 0.16 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Collection | 0.04 | norm recall | p11 Table 6 |
| anthropic/claude-opus-4.7 | CyberDefenseBench / Exfiltration | 0.15 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Defense Evasion | 0.25 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Execution | 0.23 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Persistence | 0.25 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Resource Development | 0.26 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Command and Control | 0.23 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Discovery | 0.20 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Privilege Escalation | 0.22 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Initial Access | 0.13 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Impact | 0.10 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Credential Access | 0.09 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Lateral Movement | 0.08 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Collection | 0.09 | norm recall | p11 Table 6 |
| google/gemini-3.1-pro | CyberDefenseBench / Exfiltration | 0.05 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Defense Evasion | 0.25 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Execution | 0.21 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Persistence | 0.27 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Resource Development | 0.20 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Command and Control | 0.23 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Discovery | 0.24 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Privilege Escalation | 0.26 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Initial Access | 0.02 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Impact | 0.22 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Credential Access | 0.07 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Lateral Movement | 0.04 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Collection | 0.05 | norm recall | p11 Table 6 |
| openai/gpt-5 | CyberDefenseBench / Exfiltration | 0.02 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Defense Evasion | 0.23 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Execution | 0.20 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Persistence | 0.19 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Resource Development | 0.20 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Command and Control | 0.21 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Discovery | 0.18 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Privilege Escalation | 0.20 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Initial Access | 0.10 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Impact | 0.13 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Credential Access | 0.12 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Lateral Movement | 0.09 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Collection | 0.07 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.6 | CyberDefenseBench / Exfiltration | 0.02 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Defense Evasion | 0.20 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Execution | 0.19 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Persistence | 0.21 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Resource Development | 0.17 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Command and Control | 0.22 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Discovery | 0.18 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Privilege Escalation | 0.14 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Initial Access | 0.12 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Impact | 0.15 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Credential Access | 0.03 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Lateral Movement | 0.09 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Collection | 0.17 | norm recall | p11 Table 6 |
| alibaba/qwen3.6-plus | CyberDefenseBench / Exfiltration | 0.05 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Defense Evasion | 0.21 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Execution | 0.19 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Persistence | 0.19 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Resource Development | 0.21 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Command and Control | 0.20 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Discovery | 0.16 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Privilege Escalation | 0.18 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Initial Access | 0.12 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Impact | 0.10 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Credential Access | 0.06 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Lateral Movement | 0.06 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Collection | 0.06 | norm recall | p11 Table 6 |
| google/gemini-3-flash | CyberDefenseBench / Exfiltration | 0.04 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Defense Evasion | 0.18 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Execution | 0.15 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Persistence | 0.16 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Resource Development | 0.12 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Command and Control | 0.16 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Discovery | 0.15 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Privilege Escalation | 0.15 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Initial Access | 0.04 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Impact | 0.11 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Credential Access | 0.05 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Lateral Movement | 0.03 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Collection | 0.02 | norm recall | p11 Table 6 |
| minimax/minimax-m2.7 | CyberDefenseBench / Exfiltration | 0.00 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Defense Evasion | 0.13 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Execution | 0.11 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Persistence | 0.13 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Resource Development | 0.14 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Command and Control | 0.12 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Discovery | 0.11 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Privilege Escalation | 0.11 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Initial Access | 0.06 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Impact | 0.06 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Credential Access | 0.06 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Lateral Movement | 0.05 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Collection | 0.04 | norm recall | p11 Table 6 |
| moonshot/kimi-k2.5 | CyberDefenseBench / Exfiltration | 0.02 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Defense Evasion | 0.11 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Execution | 0.10 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Persistence | 0.14 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Resource Development | 0.14 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Command and Control | 0.11 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Discovery | 0.10 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Privilege Escalation | 0.12 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Initial Access | 0.04 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Impact | 0.07 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Credential Access | 0.04 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Lateral Movement | 0.04 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Collection | 0.03 | norm recall | p11 Table 6 |
| deepseek/deepseek-v3.2 | CyberDefenseBench / Exfiltration | 0.01 | norm recall | p11 Table 6 |

## New bench IDs / model IDs / skipped / total

### New bench ID
- `cyber-defense-benchmark` (Simbian AI Cyber Defense Benchmark — agentic threat hunting, Coverage Score in [0,1])
  - Tactic-level recall sub-benchmarks (13 ATT&CK tactics) optionally registerable as sub-IDs: `cdb-defense-evasion`, `cdb-execution`, `cdb-persistence`, `cdb-resource-development`, `cdb-command-and-control`, `cdb-discovery`, `cdb-privilege-escalation`, `cdb-initial-access`, `cdb-impact`, `cdb-credential-access`, `cdb-lateral-movement`, `cdb-collection`, `cdb-exfiltration`

### Model IDs covered (canonical mapping applied)
1. anthropic/claude-opus-4.6
2. anthropic/claude-sonnet-4.6
3. anthropic/claude-opus-4.7
4. google/gemini-3.1-pro (paper: "Gemini 3.1 Pro Preview")
5. openai/gpt-5
6. moonshot/kimi-k2.6
7. alibaba/qwen3.6-plus (paper: "Qwen3.6 Plus" — note: outside canonical `qwen3-{size}` list; kept as-disclosed)
8. google/gemini-3-flash (paper: "Gemini 3 Flash Preview")
9. minimax/minimax-m2.7 (paper: "MiniMax M2.7" — outside canonical list)
10. moonshot/kimi-k2.5 (canonical list has kimi-k2-instruct & kimi-k2.6; k2.5 is paper-disclosed)
11. deepseek/deepseek-v3.2

### Skipped
- No xai/grok-*, no meta/llama-*, no claude-opus-4.5 / sonnet-4.5 in this paper (not evaluated)
- Abstract mentions "GPT-5, Gemini 3.1 Pro" but body Table 4 reveals 11 models total (Sonnet 4.6, Opus 4.7, Gemini 3 Flash, MiniMax M2.7, Kimi K2.5 are body-only)
- "Best model Claude Opus 4.6" — verified passing-bar threshold checked at tactic level only; no model passes ≥50% on all 13 tactics (Opus 4.6 clears 7/13, paper says abstract "6 of 13 fails"; body §9.2 also says "clears bar on 7 of 13" — consistent)

### Totals
- Total leaderboard rows extracted: 11 (Coverage) + 11 (Flags-found %) = 22 primary
- Total per-tactic recall rows: 11 models × 13 tactics = 143
- **Grand total score extractions: 165 rows**
- Total runs reported by paper: 859 hunt runs, ~$1,672 USD total spend (p8 §8.2)
- Dataset stats (Table 2, p6): 106 procedures, 774,218 raw log records, 23,268 ground-truth flags, 93 sub-techniques, 12 tactics + 1 (Resource Development) = 13 covered

### Caveats (STRICT-ATTRIBUTION)
- All scores above carry explicit (model, benchmark, value) attribution from Tables 5 and 6 with page references — admissible.
- "Flags found %" in Table 5 is a per-run mean fraction at final hunt step (paper labels it "% mean±σ"); treat as auxiliary metric, NOT the headline.
- Table 6 values are **normalized** recall (1.0 = best-of-pool for that tactic), not absolute recall — must be labeled `metric=normalized_tactic_recall` if ingested, else misleading.
- Gemini variants tagged "Preview" — note if downstream UI requires GA-only.
- Paper authors are Simbian AI employees benchmarking competitor models on their own platform; potential vendor bias, but methodology + reproducibility (seeded deterministic) + GitHub release mitigate.
