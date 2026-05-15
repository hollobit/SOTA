# HAL — Holistic Agent Leaderboard (arxiv 2510.11977 + hal.cs.princeton.edu)

## Paper summary
- Authors / affiliation: Sayash Kapoor*, Benedikt Stroebl*, Peter Kirgis, Nitya Nadgir, Zachary S Siegel, Boyi Wei, Tianci Xue, Ziru Chen, Felix Chen, Saiteja Utpala, Franck Ndzomga, Sophie Luskin, Kangheng Liu, Botao Yu, Amit Arora, Dongyoon Hahm, Harsh Trivedi, Huan Sun, Juyong Lee, Tengjun Jin, Yifan Mai, Yifei Zhou, Yuxuan Zhu, Rishi Bommasani, Daniel Kang, Dawn Song, Peter Henderson, Yu Su, Percy Liang, Arvind Narayanan# — Princeton PLI + collaborators
- Date: 13 Oct 2025 (v1); accepted to ICLR 2026
- HAL is: **meta-aggregator / harness** (NOT a new composite benchmark). HAL is a unified evaluation framework + harness that orchestrates evaluation across 9 *existing* benchmarks. Adds: cost tracking, Pareto frontiers, scaffold dimension, Docent log analysis. Does NOT introduce a HAL composite score.
- New benchmark(s): **None.** The 9 benchmarks are all pre-existing (Online Mind2Web, AssistantBench, GAIA, CORE-Bench Hard, ScienceAgentBench, SciCode, SWE-bench Verified Mini, USACO, TAU-bench Airline). HAL says explicitly "HAL is the official leaderboard for CORE-Bench Hard" and "for ScienceAgentBench" — so those two benchmarks now live primarily on HAL, but they aren't HAL-defined.

### Headline framing (paper)
- 21,730 agent rollouts, 9 models × 9 benchmarks × multiple scaffolds, ~$40k compute, 2.5B tokens of LM-call logs analyzed via Docent (Meng et al. 2025).
- Three contributions: (1) standardized harness (Azure VM orchestration, LiteLLM, Weave logging), (2) multidimensional leaderboard (model × scaffold × benchmark with Pareto frontiers over cost AND accuracy), (3) automated log analysis revealing shortcuts/reliability failures.
- Key empirical findings: higher reasoning effort *reduces* accuracy in 21/36 model-bench combos; generalist scaffolds sacrifice 5-15pp accuracy vs task-specific; Pareto frontier dominated by Gemini 2.0 Flash (7/9 benches), GPT-5 Medium (4/9), o4-mini Low (4/9); DeepSeek R1 on frontier 0/9.

## HAL live leaderboard top scores (from hal.cs.princeton.edu, fetched 2026-05-13)

Live site has NEWER entries than paper: Claude Sonnet 4.5 (Sept 2025), Claude Haiku 4.5 (Oct 2025), Claude Opus 4.5 (Nov 2025), Gemini 3 Pro Preview (Nov 2025).

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| Claude Opus 4.5 | corebench_hard (Claude Code scaffold) | 77.78 | % | hal.cs.princeton.edu/corebench_hard |
| Claude Sonnet 4.5 | corebench_hard (Claude Code scaffold) | 62.22 | % | hal.cs.princeton.edu/corebench_hard |
| Claude Sonnet 4.5 High | swebench_verified_mini (SWE-Agent) | 72.00 | % | hal.cs.princeton.edu/swebench_verified_mini |
| Claude Sonnet 4.5 | swebench_verified_mini (SWE-Agent) | 68.00 | % | hal.cs.princeton.edu/swebench_verified_mini |
| Claude Opus 4.1 | swebench_verified_mini (SWE-Agent) | 61.00 | % | hal.cs.princeton.edu/swebench_verified_mini |
| GPT-5 Medium | swebench_verified_mini (SWE-Agent) | 46.00 | % | hal.cs.princeton.edu/swebench_verified_mini |
| Claude Sonnet 4.5 | gaia (HAL Generalist) | 74.55 | % | hal.cs.princeton.edu/gaia |
| Claude Sonnet 4.5 High | gaia (HAL Generalist) | 70.91 | % | hal.cs.princeton.edu/gaia |
| Claude Opus 4.1 High | gaia (HAL Generalist) | 68.48 | % | hal.cs.princeton.edu/gaia |
| GPT-5 Medium | gaia (HF Open Deep Research) | 62.80 | % | hal.cs.princeton.edu/gaia |
| Claude Haiku 4.5 | gaia (HAL Generalist) | 56.36 | % | hal.cs.princeton.edu/gaia |
| o4-mini High | tau_bench_airline (TAU Tool Calling) | 56.00 | % | hal.cs.princeton.edu/taubench_airline |
| Claude-3.7 Sonnet | tau_bench_airline (HAL Generalist) | 56.00 | % | hal.cs.princeton.edu/taubench_airline |
| o3 Medium | tau_bench_airline (TAU Tool Calling) | 54.00 | % | hal.cs.princeton.edu/taubench_airline |
| Claude Opus 4.1 | tau_bench_airline (HAL Generalist) | 54.00 | % | hal.cs.princeton.edu/taubench_airline |
| GPT-5 Medium | tau_bench_airline (TAU Tool Calling) | 48.00 | % | hal.cs.princeton.edu/taubench_airline |
| GPT-5 Medium | usaco (Episodic+Semantic) | 69.71 | % | hal.cs.princeton.edu/usaco |
| o4-mini High | usaco (Episodic+Semantic) | 57.98 | % | hal.cs.princeton.edu/usaco |
| Claude Opus 4.1 High | usaco (Episodic+Semantic) | 51.47 | % | hal.cs.princeton.edu/usaco |
| GPT-5 Medium | online_mind2web (SeeAct) | 42.33 | % | hal.cs.princeton.edu/online_mind2web |
| Claude Sonnet 4 | online_mind2web (Browser-Use) | 40.00 | % | hal.cs.princeton.edu/online_mind2web |
| Claude-3.7 Sonnet High | online_mind2web (Browser-Use) | 39.33 | % | hal.cs.princeton.edu/online_mind2web |
| o3 Medium | assistantbench (Browser-Use) | 38.81 | % | hal.cs.princeton.edu/assistantbench |
| GPT-5 Medium | assistantbench (Browser-Use) | 35.23 | % | hal.cs.princeton.edu/assistantbench |
| o3 Medium | scienceagentbench (SAB Self-Debug) | 33.33 | % | hal.cs.princeton.edu/scienceagentbench |
| Claude Sonnet 4.5 High | scienceagentbench (SAB Self-Debug) | 30.39 | % | hal.cs.princeton.edu/scienceagentbench |
| GPT-5 Medium | scienceagentbench (SAB Self-Debug) | 30.39 | % | hal.cs.princeton.edu/scienceagentbench |
| o4-mini Low | scicode (Zero Shot) | 9.23 | % | hal.cs.princeton.edu/scicode |
| o3 Medium | scicode (Tool Calling) | 9.23 | % | hal.cs.princeton.edu/scicode |
| Claude Opus 4.1 | scicode (Tool Calling) | 7.69 | % | hal.cs.princeton.edu/scicode |
| Gemini 3 Pro Preview High | corebench_hard (CORE-Agent) | 40.00 | % | hal.cs.princeton.edu/corebench_hard |

## Score extractions from paper tables

Paper Table 3 (p5) confirms scaffold-benchmark mapping. Concrete model-score triples in paper text/Figure 2 (p7):

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| o3 Medium | scienceagentbench | 27 | % | p5 narrative "o4-mini scores 27% while ... GPT-5 scores 30%" — note: paper text says o4-mini, not o3 |
| GPT-5 | scienceagentbench | 30 | % | p5 narrative |
| o4-mini (low/high) | various | <varies> | % | Figure 2 (p7) Pareto plots (visual; not table — defer to live leaderboard) |

Paper itself does NOT contain a master numeric table of all 9×9×scaffold scores in main body — those are visualized in Figure 2 (Pareto plots) and shipped as the live leaderboard. Appendix A6-A11 contain per-benchmark breakdowns and pricing (A11). For strict-attribution numeric triples, **the live leaderboard is the canonical source** (also stated on HuggingFace `agent-evals/hal_traces`).

## Cost extractions (notable, paper p4 + Figure 2)
- Claude Opus 4.1: $15/$75 per M input/output tokens (Sept 24, 2025 prices)
- GPT-5: $1.25/$10
- Gemini 2.0 Flash: $0.1/$0.4
- Most expensive single eval: Online Mind2Web ($450+ avg per model run); Opus 4.1 on Online Mind2Web estimated $20,000 → skipped
- Cheapest: ScienceAgentBench (~$13 avg per eval)

## New benchmark IDs to register

**None new.** All 9 are pre-existing in literature. Mapping to your DB convention:

| HAL slug | Likely DB slug | Already in DB? |
|---|---|---|
| `swebench_verified_mini` | `swe_bench_verified_mini` (50-task subset by MariusHobbhahn HF) | Likely register as new — subset of swe_bench_verified |
| `taubench_airline` | `tau_bench_airline` (NOT tau2_airline — this is original TAU-bench, not TAU2) | Likely in DB |
| `gaia` | `gaia` or `gaia_validation` (not GAIA2) | Likely in DB |
| `corebench_hard` | `corebench_hard` | Register if missing |
| `scicode` | `scicode` | Likely in DB |
| `scienceagentbench` | `scienceagentbench` | Register if missing |
| `usaco` | `usaco` | Likely in DB |
| `assistantbench` | `assistantbench` | Likely in DB |
| `online_mind2web` | `online_mind2web` | Register if missing |

NOTE: HAL declares itself the **official leaderboard** for `corebench_hard` AND `scienceagentbench`. For those two, HAL scores ARE the canonical scores. The TAU-bench Airline scaffold is the *original* (Yao et al. 2024) tau-bench, NOT tau2_bench or tau3_bench — keep them separate.

## New model IDs to register
Live leaderboard surfaces models likely already in DB plus some that may need attention:

- `anthropic/claude-opus-4.5` (Nov 2025 — newest, only on CORE-Bench Hard so far)
- `anthropic/claude-sonnet-4.5` + `claude-sonnet-4.5-high` (Sept 2025)
- `anthropic/claude-haiku-4.5` + `claude-haiku-4.5-high` (Oct 2025)
- `google/gemini-3-pro-preview-high` (Nov 2025 — CORE-Bench Hard only)
- `anthropic/claude-opus-4.1` + `claude-opus-4.1-high` (Aug 2025)
- `anthropic/claude-opus-4` + `claude-opus-4-high` (May 2025)
- `anthropic/claude-sonnet-4` + `claude-sonnet-4-high` (May 2025)
- `anthropic/claude-3.7-sonnet` + `claude-3.7-sonnet-high` (Feb 2025)
- `openai/gpt-5-medium` (Aug 2025)
- `openai/gpt-4.1` (Apr 2025)
- `openai/o3-medium` + `openai/o4-mini-low` + `openai/o4-mini-high` (Apr 2025)
- `deepseek/deepseek-v3` (Mar 2025) + `deepseek/deepseek-r1` (Jan 2025 + May 2025 update)
- `google/gemini-2.0-flash` + `gemini-2.0-flash-high` (Feb 2025)

These are the 9 paper-model lineup + 5 newer additions on the live site.

## Skipped — aggregate-only / framework results
- Pareto frontier counts ("model X on frontier N/9 benchmarks") — meta-stat, not a per-bench score, skip
- 21,730 rollout count / $40k cost / 2.5B token totals — framework metadata, not model scores
- Docent rubric percentages (e.g., "tool call failure occurs in most runs" on SciCode/CORE — Figure 4) — qualitative log analysis, not model scores
- Figure 3 reasoning-effort delta percentages (21/36 negative) — relative deltas, not absolute scores
- Generalist-vs-specialist gap stats (CORE-Agent beats Generalist 9/12 runs) — meta-comparisons
- TAU-bench Few-Shot agent results — **invalidated due to data leakage**, paper explicitly excludes
- Paper Section 4.1 "AssistantBench Claude Opus refusal" anecdote — qualitative
- "Opus 4.1 not run on Online Mind2Web" — explicitly skipped due to $20k cost estimate

## Total
- **0** new benchmarks to register (all 9 pre-existing)
- **~5** new model IDs likely needed (Opus 4.5, Sonnet 4.5, Haiku 4.5, Gemini 3 Pro Preview High, plus variants)
- **~190** extractable model-benchmark-score triples across the 9 live leaderboards (sum of rows: AssistantBench 15 + CORE-Bench Hard ~49 + GAIA 32 + Online Mind2Web 22 + SciCode 33 + ScienceAgentBench 23 + SWE-bench Verified Mini 33 + TAU-bench Airline 26 + USACO ~30 — but most are scaffold-paired triples, so unique model-bench-best-score: ~85-100 after deduping to best scaffold per model)
- Recommended approach: ingest only `(model, benchmark, best_scaffold_score, cost_usd)` per model-benchmark pair, treating scaffold as metadata. ~95 unique triples.
