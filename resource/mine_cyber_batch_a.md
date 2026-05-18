# Cyber Batch A — 3 papers

## Paper 1: arxiv 2605.06486 — Autonomous Adversary: Red-Teaming in the age of LLM
- Authors: Mohammad Mamun, Mohamed Gaber, Scott Buffett, Sherif Saad (NRC Canada / Univ. of Windsor)
- Date: 7 May 2026 (v1)
- New bench (NEW; not in DB):
  - slug: `autonomous_adversary_lateral_movement` — multi-host Windows AD lateral-movement chain
    - Two sub-scenarios, each evaluated under 3 operational modes (Fully Autonomous / Self-Scaffolded / Expert-defined)
    - Metric: tasks completed / total tasks (and per-run success rate %)
  - Suggested sub-slugs (per-mode, per-scenario):
    - `autoadversary_s1_expert` (9 tasks)
    - `autoadversary_s1_selfscaffold` (variable; baseline 20 tasks)
    - `autoadversary_s1_autonomous` (variable; baseline 20 tasks)
    - `autoadversary_s2_expert` (10 tasks)
    - `autoadversary_s2_selfscaffold` (variable; baseline 20 tasks)
    - `autoadversary_s2_autonomous` (variable; baseline 20 tasks)
- DB-canonical model mapping notes:
  - "anthropic/claude-sonnet-4.5" → `anthropic/claude-sonnet-4.6` is closest *newer* canonical, but the paper explicitly tests claude-sonnet-4.5 (which is older than DB lineup). KEEP raw paper string in `model_raw`; map to `anthropic/claude-sonnet-4.5` (not in canonical list — fallback: store as `anthropic/claude-sonnet-4.5` with note "pre-DB-floor").
  - "anthropic/claude-opus-4.5" → DB has `anthropic/claude-opus-4.5` (canonical match).
  - "openai/gpt-5.1" → DB has `openai/gpt-5` and `openai/gpt-5.2`. gpt-5.1 sits between; KEEP raw and flag for vendor confirmation. Suggested map: `openai/gpt-5` (conservative).
  - "google/gemini-3-pro-preview" → DB has `google/gemini-3-pro` (canonical match).
  - "deepseek/deepseek-v3.2-speciale" → DB has `deepseek/deepseek-v3.2` (canonical match; "speciale" is a variant tag).

- Verifiable triples (Tables 3, 4, 5, 6; explicit per-model per-mode rows):

  Scenario-1 (Table 3 + Table 4 — 9-task chain for expert-defined; 20-task variable for others):

  | Model | Benchmark | Value | Unit | Source (p+T) |
  |---|---|---|---|---|
  | claude-sonnet-4.5 | autoadversary_s1_autonomous | 16/20 | tasks_completed | p13 T3 |
  | claude-sonnet-4.5 | autoadversary_s1_autonomous_pct | 80.0 | % | p13 T4 |
  | claude-opus-4.5 | autoadversary_s1_autonomous | 5/20 | tasks_completed | p13 T3 |
  | claude-opus-4.5 | autoadversary_s1_autonomous_pct | 25.0 | % | p13 T4 |
  | gpt-5.1 | autoadversary_s1_autonomous | 2/10 | tasks_completed | p13 T3 |
  | gpt-5.1 | autoadversary_s1_autonomous_pct | 20.0 | % | p13 T4 |
  | gemini-3-pro-preview | autoadversary_s1_autonomous | 4/11 | tasks_completed | p13 T3 |
  | gemini-3-pro-preview | autoadversary_s1_autonomous_pct | 36.36 | % | p13 T4 |
  | claude-sonnet-4.5 | autoadversary_s1_selfscaffold | 10/20 | tasks_completed | p13 T3 |
  | claude-sonnet-4.5 | autoadversary_s1_selfscaffold_pct | 50.0 | % | p13 T4 |
  | claude-opus-4.5 | autoadversary_s1_selfscaffold | 19/20 | tasks_completed | p13 T3 |
  | claude-opus-4.5 | autoadversary_s1_selfscaffold_pct | 100.0 | % (atypical*) | p13 T4 |
  | gpt-5.1 | autoadversary_s1_selfscaffold | 6/13 | tasks_completed | p13 T3 |
  | gpt-5.1 | autoadversary_s1_selfscaffold_pct | 46.15 | % | p13 T4 |
  | gemini-3-pro-preview | autoadversary_s1_selfscaffold | 5/9 | tasks_completed | p13 T3 |
  | gemini-3-pro-preview | autoadversary_s1_selfscaffold_pct | 55.55 | % | p13 T4 |
  | deepseek-v3.2-speciale | autoadversary_s1_selfscaffold | 2/10 | tasks_completed | p13 T3 |
  | deepseek-v3.2-speciale | autoadversary_s1_selfscaffold_pct | 20.0 | % | p13 T4 |
  | claude-sonnet-4.5 | autoadversary_s1_expert | 9/9 | tasks_completed | p13 T3 |
  | claude-sonnet-4.5 | autoadversary_s1_expert_pct | 100.0 | % | p13 T4 |
  | claude-opus-4.5 | autoadversary_s1_expert | 9/9 | tasks_completed | p13 T3 |
  | claude-opus-4.5 | autoadversary_s1_expert_pct | 100.0 | % | p13 T4 |
  | gpt-5.1 | autoadversary_s1_expert | 9/9 | tasks_completed | p13 T3 |
  | gpt-5.1 | autoadversary_s1_expert_pct | 100.0 | % | p13 T4 |
  | gemini-3-pro-preview | autoadversary_s1_expert | 3/9 | tasks_completed | p13 T3 |
  | gemini-3-pro-preview | autoadversary_s1_expert_pct | 33.33 | % | p13 T4 |
  | deepseek-v3.2-speciale | autoadversary_s1_expert | 1/9 | tasks_completed | p13 T3 |
  | deepseek-v3.2-speciale | autoadversary_s1_expert_pct | 11.11 | % | p13 T4 |

  Scenario-2 (Table 5 + Table 6 — 10-task chain for expert-defined; 20-task variable for others):

  | Model | Benchmark | Value | Unit | Source (p+T) |
  |---|---|---|---|---|
  | claude-opus-4.5 | autoadversary_s2_autonomous | 7/20 | tasks_completed | p15 T5 |
  | claude-opus-4.5 | autoadversary_s2_autonomous_pct | 35.0 | % | p15 T6 |
  | claude-sonnet-4.5 | autoadversary_s2_autonomous | 10/20 | tasks_completed | p15 T5 |
  | claude-sonnet-4.5 | autoadversary_s2_autonomous_pct | 50.0 | % | p15 T6 |
  | gemini-3-pro-preview | autoadversary_s2_autonomous | 3/11 | tasks_completed | p15 T5 |
  | gemini-3-pro-preview | autoadversary_s2_autonomous_pct | 27.27 | % | p15 T6 |
  | gpt-5.1 | autoadversary_s2_autonomous | 3/16 | tasks_completed | p15 T5 |
  | gpt-5.1 | autoadversary_s2_autonomous_pct | 18.75 | % | p15 T6 |
  | claude-opus-4.5 | autoadversary_s2_selfscaffold | 8/20 | tasks_completed | p15 T5 |
  | claude-opus-4.5 | autoadversary_s2_selfscaffold_pct | 40.0 | % | p15 T6 |
  | claude-sonnet-4.5 | autoadversary_s2_selfscaffold | 4/20 | tasks_completed | p15 T5 |
  | claude-sonnet-4.5 | autoadversary_s2_selfscaffold_pct | 20.0 | % | p15 T6 |
  | gemini-3-pro-preview | autoadversary_s2_selfscaffold | 2/11 | tasks_completed | p15 T5 |
  | gemini-3-pro-preview | autoadversary_s2_selfscaffold_pct | 18.18 | % | p15 T6 |
  | gpt-5.1 | autoadversary_s2_selfscaffold | 2/15 | tasks_completed | p15 T5 |
  | gpt-5.1 | autoadversary_s2_selfscaffold_pct | 13.33 | % | p15 T6 |
  | claude-sonnet-4.5 | autoadversary_s2_expert | 6/10 | tasks_completed | p15 T5 |
  | claude-sonnet-4.5 | autoadversary_s2_expert_pct | 60.0 | % | p15 T6 |
  | gpt-5.1 | autoadversary_s2_expert | 5/10 | tasks_completed | p15 T5 |
  | gpt-5.1 | autoadversary_s2_expert_pct | 50.0 | % | p15 T6 |
  | gemini-3-pro-preview | autoadversary_s2_expert | 4/10 | tasks_completed | p15 T5 |
  | gemini-3-pro-preview | autoadversary_s2_expert_pct | 40.0 | % | p15 T6 |
  | claude-opus-4.5 | autoadversary_s2_expert | 6/10 | tasks_completed | p15 T5 |
  | claude-opus-4.5 | autoadversary_s2_expert_pct | 60.0 | % | p15 T6 |

  Total Paper-1 triples: 46 (23 fractional + 23 percent). If percent and fractional are treated as one logical score, count = 23.

---

## Paper 2: arxiv 2602.02595 — To Defend Against Cyber Attacks, We Must Teach AI Agents to Hack
- Authors: Terry Yue Zhuo (Monash/CSIRO Data61), Yangruibo Ding (UCLA), Wenbo Guo (UCSB), Ruijie Meng (NUS)
- Date: 1 Feb 2026 (v1) / preprint Feb 4 2026
- New bench (if any): NONE — this is a position paper. Table 1 summarises *SOTA agent* aggregate performance on existing benchmarks **without naming the underlying model**. The Performance column shows benchmark-level numbers attributed only to "SOTA agents" / cited via the benchmark paper, not to a specific (model, benchmark) pair.
- Verifiable triples: **NONE that satisfy STRICT-ATTRIBUTION**.
  - Table 1 (p5) rows are (Capability, Dataset, Performance %) tuples:
    - CyberSecEval-3 → 49% — *agent unspecified*, cite Wan et al. 2024 (benchmark paper)
    - SeCodePLT → 0.2% — agent unspecified
    - AutoPenBench → 54.5% — agent unspecified
    - CVE-Bench → 12.5% — agent unspecified
    - CyBench → 55% — agent unspecified
    - NYU (CTF) → 22% — agent unspecified
    - PrimeVul → 12.9% — agent unspecified
    - VulnLLM → 77.8% — agent unspecified
    - CyberGym (PoC generation) → 28.9% — agent unspecified
    - SEC-bench (Patching) → 22.3% — agent unspecified
    - SWE-bench-Verified → 78.8% — agent unspecified
  - All values are "best SOTA on this benchmark per cited paper" without (model_id, benchmark, value) triple. **No model attribution → all 11 rows are skipped per strict-attribution rule.**
- Table 2 (p6) is a qualitative capability/stage matrix — no numerical scores.
- Result: 0 extractable triples from Paper 2.

---

## Paper 3: arxiv 2603.11214 — Measuring AI Agents' Progress on Multi-Step Cyber Attack Scenarios
- Authors: Linus Folkerts, Will Payne, Simon Inman, Philippos Giavridis, Joe Skinner, Sam Deverett, James Aung, Ekin Zorer, Michael Schmatz, Mahmoud Ghanem, John Wilkinson, Alan Steer, Vy Hong, Jessica Wang — UK AI Security Institute (AISI)
- Date: 17 Mar 2026 (v3); preprint Mar 18 2026
- New bench (NEW; not in DB):
  - slug: `aisi_last_ones_32step` — "The Last Ones" — 32-step corporate network attack range (data exfiltration). Metric: avg / max steps completed. SpecterOps-built.
  - slug: `aisi_cooling_tower_7step` — "Cooling Tower" — 7-step ICS/power-plant attack range. Metric: avg / max steps. Hack The Box-built.
  - Sub-slugs by token budget:
    - `aisi_last_ones_10m` (10M token budget, avg + max)
    - `aisi_last_ones_100m` (100M token budget, avg + max)
    - `aisi_cooling_tower_10m`
    - `aisi_cooling_tower_100m`
- DB-canonical model mapping:
  - "GPT-4o" → `openai/gpt-4o` (canonical match)
  - "Sonnet 3.7" → no DB canonical (below floor); keep raw `anthropic/claude-sonnet-3.7`
  - "Sonnet 4.5" → no exact canonical; closest is `anthropic/claude-sonnet-4.6`. KEEP raw `anthropic/claude-sonnet-4.5`.
  - "Opus 4.5" → `anthropic/claude-opus-4.5` (canonical match)
  - "Opus 4.6" → `anthropic/claude-opus-4.6` (canonical match)
  - "5.1 Codex" → `openai/gpt-5-codex` variant; no canonical — keep raw `openai/gpt-5.1-codex`
  - "5.3 Codex" → no canonical — keep raw `openai/gpt-5.3-codex`

- Verifiable triples (Table 1, p3) — Format: AvgSteps@TokenBudget; Max in parentheses. n=runs:

  "The Last Ones" (32 steps):

  | Model | Benchmark | Value | Unit | Source (p+T) |
  |---|---|---|---|---|
  | gpt-4o | aisi_last_ones_10m_avg | 1.7 | steps (n=10) | p3 T1 |
  | gpt-4o | aisi_last_ones_10m_max | 3 | steps | p3 T1 |
  | claude-sonnet-3.7 | aisi_last_ones_10m_avg | 5.8 | steps (n=10) | p3 T1 |
  | claude-sonnet-3.7 | aisi_last_ones_10m_max | 8 | steps | p3 T1 |
  | claude-sonnet-4.5 | aisi_last_ones_10m_avg | 6.1 | steps (n=10) | p3 T1 |
  | claude-sonnet-4.5 | aisi_last_ones_10m_max | 8 | steps | p3 T1 |
  | claude-sonnet-4.5 | aisi_last_ones_100m_avg | 9.4 | steps (n=5) | p3 T1 |
  | claude-sonnet-4.5 | aisi_last_ones_100m_max | 11 | steps | p3 T1 |
  | gpt-5.1-codex | aisi_last_ones_10m_avg | 8.0 | steps (n=10) | p3 T1 |
  | gpt-5.1-codex | aisi_last_ones_10m_max | 13 | steps | p3 T1 |
  | gpt-5.1-codex | aisi_last_ones_100m_avg | 9.8 | steps (n=5) | p3 T1 |
  | gpt-5.1-codex | aisi_last_ones_100m_max | 11 | steps | p3 T1 |
  | claude-opus-4.5 | aisi_last_ones_10m_avg | 7.6 | steps (n=10) | p3 T1 |
  | claude-opus-4.5 | aisi_last_ones_10m_max | 9 | steps | p3 T1 |
  | claude-opus-4.5 | aisi_last_ones_100m_avg | 11.0 | steps (n=5) | p3 T1 |
  | claude-opus-4.5 | aisi_last_ones_100m_max | 11 | steps | p3 T1 |
  | gpt-5.3-codex | aisi_last_ones_10m_avg | 7.2 | steps (n=5) | p3 T1 |
  | gpt-5.3-codex | aisi_last_ones_10m_max | 8 | steps | p3 T1 |
  | gpt-5.3-codex | aisi_last_ones_100m_avg | 11.0 | steps (n=5) | p3 T1 |
  | gpt-5.3-codex | aisi_last_ones_100m_max | 11 | steps | p3 T1 |
  | claude-opus-4.6 | aisi_last_ones_10m_avg | 9.8 | steps (n=5) | p3 T1 |
  | claude-opus-4.6 | aisi_last_ones_10m_max | 11 | steps | p3 T1 |
  | claude-opus-4.6 | aisi_last_ones_100m_avg | 15.6 | steps (n=5) | p3 T1 |
  | claude-opus-4.6 | aisi_last_ones_100m_max | 22 | steps | p3 T1 |

  "Cooling Tower" (7 steps):

  | Model | Benchmark | Value | Unit | Source (p+T) |
  |---|---|---|---|---|
  | gpt-4o | aisi_cooling_tower_10m_avg | 0.0 | steps (n=10) | p3 T1 |
  | gpt-4o | aisi_cooling_tower_10m_max | 0 | steps | p3 T1 |
  | claude-sonnet-3.7 | aisi_cooling_tower_10m_avg | 0.0 | steps (n=10) | p3 T1 |
  | claude-sonnet-3.7 | aisi_cooling_tower_10m_max | 0 | steps | p3 T1 |
  | claude-sonnet-4.5 | aisi_cooling_tower_10m_avg | 0.0 | steps (n=10) | p3 T1 |
  | claude-sonnet-4.5 | aisi_cooling_tower_10m_max | 0 | steps | p3 T1 |
  | claude-sonnet-4.5 | aisi_cooling_tower_100m_avg | 0.0 | steps (n=5) | p3 T1 |
  | claude-sonnet-4.5 | aisi_cooling_tower_100m_max | 0 | steps | p3 T1 |
  | gpt-5.1-codex | aisi_cooling_tower_10m_avg | 0.0 | steps (n=10) | p3 T1 |
  | gpt-5.1-codex | aisi_cooling_tower_10m_max | 0 | steps | p3 T1 |
  | gpt-5.1-codex | aisi_cooling_tower_100m_avg | 0.0 | steps (n=5) | p3 T1 |
  | gpt-5.1-codex | aisi_cooling_tower_100m_max | 0 | steps | p3 T1 |
  | claude-opus-4.5 | aisi_cooling_tower_10m_avg | 0.1 | steps (n=10) | p3 T1 |
  | claude-opus-4.5 | aisi_cooling_tower_10m_max | 1 | steps | p3 T1 |
  | claude-opus-4.5 | aisi_cooling_tower_100m_avg | 0.6 | steps (n=5) | p3 T1 |
  | claude-opus-4.5 | aisi_cooling_tower_100m_max | 1 | steps | p3 T1 |
  | gpt-5.3-codex | aisi_cooling_tower_10m_avg | 0.1 | steps (n=5) | p3 T1 |
  | gpt-5.3-codex | aisi_cooling_tower_10m_max | 1 | steps | p3 T1 |
  | gpt-5.3-codex | aisi_cooling_tower_100m_avg | 1.2 | steps (n=5) | p3 T1 |
  | gpt-5.3-codex | aisi_cooling_tower_100m_max | 3 | steps | p3 T1 |
  | claude-opus-4.6 | aisi_cooling_tower_10m_avg | 0.1 | steps (n=5) | p3 T1 |
  | claude-opus-4.6 | aisi_cooling_tower_10m_max | 1 | steps | p3 T1 |
  | claude-opus-4.6 | aisi_cooling_tower_100m_avg | 1.4 | steps (n=5) | p3 T1 |
  | claude-opus-4.6 | aisi_cooling_tower_100m_max | 2 | steps | p3 T1 |

  Total Paper-3 triples: 48 (24 avg + 24 max; or 24 (model, bench) pairs each with avg+max paired).

---

## Skipped per paper
- **Paper 1**: gpt-4o-mini explicitly excluded by authors (consistently failed structured tool-call output, p13 narrative). Not a verifiable score → skipped.
- **Paper 2**: All 11 Table-1 rows skipped — benchmark-level performance numbers cite only the benchmark paper (Wan et al. / Nie et al. / Gioacchini et al. / Zhu et al. / Zhang et al. / Shao et al. / Ding et al. / Wang et al. / Lee et al. / Yang et al.), not a specific evaluated model. Position paper, no fresh evaluation. Table 2 is qualitative (no scores).
- **Paper 3**: Figure 1 / Figure 2 are visual restatements of Table 1 — no new triples.

## Total
- New benchmarks: 8 logical benchmarks (2 ranges × 2 token-budgets × 2 metrics=avg/max = 8 sub-slugs for Paper 3) + 6 sub-slugs (Paper 1: 2 scenarios × 3 modes) = **14 new benchmark sub-slugs across 2 papers**
  - If collapsed to top-level ranges: 3 new benchmarks (`autonomous_adversary_lateral_movement`, `aisi_last_ones_32step`, `aisi_cooling_tower_7step`)
- New scores: **94 triples total** (Paper 1: 46 [23 fractional + 23 % pairs]; Paper 2: 0; Paper 3: 48 [24 avg + 24 max pairs])
  - If avg+max treated as a single (model, bench) row: 23 (P1) + 0 (P2) + 24 (P3) = **47 model-benchmark pairs**

## Notes on canonical-ID drift
- Paper 1 + Paper 3 both use **claude-sonnet-4.5 / claude-opus-4.5 / gpt-5.1** and Paper 3 adds **opus-4.6 / sonnet-3.7 / gpt-4o / 5.1-codex / 5.3-codex**.
- DB canonical floor is gpt-5 / claude-opus-4.5 / claude-sonnet-4.6. Recommend introducing canonical entries for:
  - `anthropic/claude-sonnet-4.5` (cited by 2 papers)
  - `openai/gpt-5.1` (cited by Paper 1)
  - `openai/gpt-5.1-codex`, `openai/gpt-5.3-codex` (Paper 3)
  - `anthropic/claude-sonnet-3.7` (Paper 3, historical baseline)
  - `google/gemini-3-pro-preview` → alias of `google/gemini-3-pro`
  - `deepseek/deepseek-v3.2-speciale` → variant of `deepseek/deepseek-v3.2`
