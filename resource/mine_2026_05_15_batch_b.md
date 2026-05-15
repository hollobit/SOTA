# Batch B — KnotBench + DRAT

Mining date: 2026-05-15
Strict-attribution rule: only (model, benchmark, value) triples explicitly tabulated against a named model in the PDF text.

---

## Paper 1: KnotBench (arxiv 2605.09900)

- Title: "The Gordian Knot for VLMs: Diagrammatic Knot Reasoning as a Hard Benchmark"
- Authors: Hao Liu (NYU), Jicheng Liu (USC)
- Date: 11 May 2026
- Eval set: 2,000-item locked split across 14 tasks, 4 models (Claude Opus 4.7 +/- thinking, GPT-5 +/- thinking)
- Bench slug: `knotbench` (overall) + `knotbench_<task>` per-task variant (14 tasks)
- Metric: strict-match accuracy (%) — exact string match on the `ANSWER:` line
- Random baselines: 50% for binary tasks (A0-A3, D0), 16.7% for B0, 25% for D1, 0% for C0/C1

### Verifiable triples — headline overall (Table 2, p9)

| Model | Benchmark | Value | Unit | Source (p+T) |
|---|---|---|---|---|
| anthropic/claude-opus-4.7 | knotbench | 51.65 | accuracy_pct | p9, Table 2 |
| anthropic/claude-opus-4.7-thinking | knotbench | 54.60 | accuracy_pct | p9, Table 2 |
| openai/gpt-5 | knotbench | 43.00 | accuracy_pct | p9, Table 2 |
| openai/gpt-5-thinking | knotbench | 52.25 | accuracy_pct | p9, Table 2 |

### Verifiable triples — per-task heatmap (Figure 1, p3)

Per-task accuracies for all 4 models across 14 tasks (A0_I, A0_S, A1_I, A1_S, A2_I, A2_S, A3_I, A3_S, B0_I, B0_S, C0, C1, D0, D1).

#### Claude Opus 4.7 (no thinking)
| Benchmark | Value | Unit |
|---|---|---|
| knotbench_a0_i | 52 | accuracy_pct |
| knotbench_a0_s | 52 | accuracy_pct |
| knotbench_a1_i | 46 | accuracy_pct |
| knotbench_a1_s | 65 | accuracy_pct |
| knotbench_a2_i | 67 | accuracy_pct |
| knotbench_a2_s | 97 | accuracy_pct |
| knotbench_a3_i | 90 | accuracy_pct |
| knotbench_a3_s | 50 | accuracy_pct |
| knotbench_b0_i | 30 | accuracy_pct |
| knotbench_b0_s | 84 | accuracy_pct |
| knotbench_c0 | 9 | accuracy_pct |
| knotbench_c1 | 0 | accuracy_pct |
| knotbench_d0 | 50 | accuracy_pct |
| knotbench_d1 | 32 | accuracy_pct |

#### Claude Opus 4.7 + thinking
| Benchmark | Value | Unit |
|---|---|---|
| knotbench_a0_i | 55 | accuracy_pct |
| knotbench_a0_s | 60 | accuracy_pct |
| knotbench_a1_i | 47 | accuracy_pct |
| knotbench_a1_s | 92 | accuracy_pct |
| knotbench_a2_i | 65 | accuracy_pct |
| knotbench_a2_s | 99 | accuracy_pct |
| knotbench_a3_i | 90 | accuracy_pct |
| knotbench_a3_s | 50 | accuracy_pct |
| knotbench_b0_i | 32 | accuracy_pct |
| knotbench_b0_s | 84 | accuracy_pct |
| knotbench_c0 | 14 | accuracy_pct |
| knotbench_c1 | 0 | accuracy_pct |
| knotbench_d0 | 47 | accuracy_pct |
| knotbench_d1 | 36 | accuracy_pct |

#### GPT-5 (no thinking)
| Benchmark | Value | Unit |
|---|---|---|
| knotbench_a0_i | 48 | accuracy_pct |
| knotbench_a0_s | 62 | accuracy_pct |
| knotbench_a1_i | 48 | accuracy_pct |
| knotbench_a1_s | 44 | accuracy_pct |
| knotbench_a2_i | 45 | accuracy_pct |
| knotbench_a2_s | 96 | accuracy_pct |
| knotbench_a3_i | 63 | accuracy_pct |
| knotbench_a3_s | 48 | accuracy_pct |
| knotbench_b0_i | 17 | accuracy_pct |
| knotbench_b0_s | 41 | accuracy_pct |
| knotbench_c0 | 8 | accuracy_pct |
| knotbench_c1 | 0 | accuracy_pct |
| knotbench_d0 | 50 | accuracy_pct |
| knotbench_d1 | 26 | accuracy_pct |

#### GPT-5 + thinking
| Benchmark | Value | Unit |
|---|---|---|
| knotbench_a0_i | 50 | accuracy_pct |
| knotbench_a0_s | 56 | accuracy_pct |
| knotbench_a1_i | 49 | accuracy_pct |
| knotbench_a1_s | 69 | accuracy_pct |
| knotbench_a2_i | 50 | accuracy_pct |
| knotbench_a2_s | 100 | accuracy_pct |
| knotbench_a3_i | 74 | accuracy_pct |
| knotbench_a3_s | 99 | accuracy_pct |
| knotbench_b0_i | 21 | accuracy_pct |
| knotbench_b0_s | 88 | accuracy_pct |
| knotbench_c0 | 11 | accuracy_pct |
| knotbench_c1 | 4 | accuracy_pct |
| knotbench_d0 | 58 | accuracy_pct |
| knotbench_d1 | 30 | accuracy_pct |

### Notes
- Thinking-mode deltas: Claude +1.65pt aggregate; GPT-5 +9.25pt aggregate
- C1 permissive Regina decode: gpt-5+thinking reaches 4/100, others 0/100 (text, p10)
- C0 strict-match: claude 9%, claude+T 14%, gpt-5 8%, gpt-5+T 11% (text, p10)
- A3-I gap (text, p10): Claude variants ~90%, gpt-5 63%, gpt-5+thinking 74.5%
- A3-S: claude ~chance, gpt-5+thinking 51% (text)
- B0-S R3 shortcut: gpt-5 no-thinking 84% R3; gpt-5+thinking 88% B0-S (text)

**KnotBench total**: 4 model rows × (1 overall + 14 tasks) = **60 triples**

---

## Paper 2: DRAT (arxiv 2605.13450)

- Title: "Assessing the Creativity of Large Language Models: Testing, Limits, and New Frontiers"
- Authors: Samuel Schapiro, Alexi Gladstone, Jonah Black, Heng Ji (UIUC)
- Date: 13 May 2026
- Per-model Table 3 (p27-29): n=54 LLMs across 10 providers
- Bench slugs introduced/measured here:
  - `drat` — Divergent Remote Association Test (NEW; this paper)
  - `dat` — Divergent Association Task (GloVe, T={1.0,1.5,2.0}, 120 trials)
  - `cdat` — Conditional DAT (SBERT, FDR-gated)
  - `cdat_n` — CDAT novelty facet (SBERT)
  - `cdat_a` — CDAT appropriateness facet (SBERT)
  - `pace` — Parallel Association Chain Evaluation (FastText, 50 seeds x 3 chains)
  - `rat` — Remote Associates Test (30-item zero-shot strict accuracy %)
- Metric: theoretical range [0, 200] for DAT/CDAT/CDAT-N/DRAT; [0..] for CDAT-A; PACE [0..1]; RAT [0..100]

### Verifiable triples — Table 3, p27-29

(Mapping: OpenAI gpt-X → openai/gpt-X; Anthropic claude-* → anthropic/claude-*; Google gemini/gemma → google/...; Meta llama-* → meta/llama-*; etc. Reporting only the new in-paper test scores: DAT, CDAT, CDAT-N, CDAT-A, PACE, RAT, DRAT. Excluded: Table 4 columns are external benchmark snapshots, not this paper's contribution.)

#### OpenAI
| Model (canonical) | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| openai/gpt-3.5-turbo | 78.24 | 73.07 | 72.66 | 132.92 | 0.715 | 80 | 9.72 |
| openai/gpt-4.1 | 86.29 | 69.23 | 70.10 | 140.86 | 0.744 | 97 | 46.11 |
| openai/gpt-4.1-mini | 81.60 | 66.88 | 67.75 | 143.78 | 0.730 | 80 | 51.27 |
| openai/gpt-4.1-nano | 81.93 | 72.54 | 71.28 | 137.84 | 0.707 | 47 | 23.54 |
| openai/gpt-4-turbo | 84.84 | 66.49 | 66.92 | 144.02 | 0.732 | 93 | 29.65 |
| openai/gpt-4o | 82.94 | 65.14 | 66.26 | 144.54 | 0.729 | 93 | 36.41 |
| openai/gpt-4o-mini | 78.70 | 70.53 | 71.52 | 138.41 | 0.707 | 50 | 19.19 |
| openai/gpt-5 | 89.33 | 69.85 | 69.77 | 141.96 | 0.747 | 93 | 16.68 |
| openai/gpt-5-4 (= gpt-5.4) | 91.72 | 68.28 | 68.83 | 140.74 | 0.727 | 93 | 51.99 |
| openai/gpt-5-4-mini | 84.06 | 65.21 | 65.47 | 145.88 | 0.734 | 73 | 33.37 |
| openai/gpt-5-4-nano | 83.77 | 63.20 | 63.15 | 147.61 | 0.678 | 33 | 69.11 |
| openai/gpt-5-mini | 82.92 | 67.90 | 68.02 | 143.90 | 0.741 | 97 | 42.27 |
| openai/gpt-5-nano | 80.66 | 62.39 | 63.11 | 147.95 | 0.712 | 93 | 49.27 |
| openai/o3 | 89.46 | 70.09 | 70.06 | 142.25 | 0.748 | 93 | 33.28 |
| openai/o3-mini | 76.37 | 65.32 | 65.67 | 144.17 | 0.715 | 70 | 24.69 |
| openai/o4-mini | 84.44 | 68.32 | 68.77 | 142.61 | 0.732 | 93 | 44.32 |

#### Anthropic
| Model (canonical) | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| anthropic/claude-3.5-haiku | 87.36 | 66.62 | 67.95 | 141.52 | 0.726 | 63 | 38.35 |
| anthropic/claude-3-haiku | 78.87 | 62.85 | 62.53 | 146.22 | 0.697 | 70 | 28.77 |
| anthropic/claude-haiku-4.5 | 85.74 | 67.61 | 67.80 | 143.71 | 0.667 | 83 | 59.98 |
| anthropic/claude-opus-4.5 | 89.26 | 69.71 | 69.90 | 143.03 | 0.742 | 87 | 47.45 |
| anthropic/claude-opus-4.6 | 89.70 | — | 67.22 | 148.68 | 0.750 | 87 | 54.44 |
| anthropic/claude-sonnet-4 | 86.69 | 70.04 | 69.78 | 141.69 | 0.739 | 87 | 28.77 |
| anthropic/claude-sonnet-4.5 | 86.67 | 66.93 | 66.43 | 146.01 | 0.756 | 90 | 54.22 |
| anthropic/claude-sonnet-4.6 | 88.97 | — | — | — | 0.755 | 87 | 53.94 |

#### Google
| Model (canonical) | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| google/gemini-2-flash-001 | 82.32 | 70.72 | 70.32 | 139.44 | 0.730 | 87 | 38.80 |
| google/gemini-2.5-flash | 76.68 | 68.54 | 68.54 | 143.39 | 0.742 | 77 | 39.76 |
| google/gemini-2.5-pro | 89.69 | 71.18 | 71.13 | 139.02 | 0.761 | 93 | 0.00 |
| google/gemma-2-27b-it | 81.87 | 70.46 | 70.92 | 138.29 | 0.694 | 50 | 26.38 |
| google/gemma-2-9b-it | 77.89 | 74.09 | 72.77 | 133.71 | 0.728 | — | — |
| google/gemma-3-27b-it | 86.49 | 71.75 | 72.05 | 137.58 | 0.728 | 73 | 19.58 |

#### Meta
| Model (canonical) | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| meta/llama-3.1-70b-instruct | 84.78 | 71.10 | 68.19 | 141.56 | 0.713 | 83 | 12.46 |
| meta/llama-3.1-8b-instruct | 79.88 | — | 72.99 | 134.84 | 0.701 | 50 | 24.72 |
| meta/llama-3.2-1b-instruct | 81.20 | 52.46 | 58.92 | 146.46 | 0.586 | 0 | 6.56 |
| meta/llama-3.2-3b-instruct | 84.11 | 64.42 | 68.31 | 139.37 | 0.711 | 33 | 2.13 |
| meta/llama-3.3-70b-instruct | 82.47 | 68.36 | 69.81 | 139.24 | 0.718 | 80 | 9.78 |
| meta/llama-4-maverick | 85.28 | 67.34 | 67.45 | 141.98 | 0.707 | 77 | 35.43 |
| meta/llama-4-scout | 84.48 | 66.90 | 67.39 | 141.42 | 0.696 | 73 | 18.52 |

#### Mistral
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| mistralai/mistral-7b-instruct-v0.1 | 81.20 | 69.13 | 69.16 | 135.43 | 0.613 | 17 | 10.11 |
| mistralai/mistral-large-2407 | 88.15 | 70.71 | 70.36 | 138.80 | 0.737 | 97 | 23.76 |
| mistralai/mistral-large-2411 | 81.91 | 64.87 | 64.54 | 146.01 | 0.722 | 73 | 31.04 |
| mistralai/mistral-nemo | 78.17 | — | 71.09 | 137.00 | 0.709 | 43 | 19.57 |
| mistralai/mistral-small-24b-instruct-2501 | 82.39 | — | 73.56 | 132.24 | 0.717 | 70 | 4.61 |

#### Qwen
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| alibaba/qwen-2.5-72b-instruct | 72.28 | 68.89 | 68.98 | 138.68 | 0.703 | 23 | 23.81 |
| alibaba/qwen3-14b | 81.36 | — | 73.89 | 131.84 | 0.606 | 47 | 12.62 |
| alibaba/qwen3-235b-a22b | 84.95 | 68.65 | 69.10 | 142.18 | 0.725 | 90 | 68.43 |
| alibaba/qwen3-32b | 85.18 | — | 74.54 | 135.62 | 0.658 | 70 | 23.39 |
| alibaba/qwen3-8b | 83.31 | 67.53 | 68.50 | 141.87 | 0.694 | 40 | 34.50 |
| alibaba/qwq-32b | 82.63 | — | — | — | — | — | — |

#### DeepSeek
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| deepseek/deepseek-chat | 81.12 | 68.33 | 67.50 | 143.11 | 0.729 | 80 | 32.51 |
| deepseek/deepseek-chat-v3-0324 | 80.14 | 68.36 | 68.00 | 143.13 | 0.730 | 73 | 0.00 |
| deepseek/deepseek-r1 | 83.80 | 68.75 | 69.28 | 141.38 | 0.720 | 90 | 21.24 |

#### Cohere
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| cohere/command-a | 82.28 | 62.99 | 63.22 | 147.80 | 0.714 | 73 | — |
| cohere/command-r-plus-08-2024 | 87.69 | 69.61 | 69.44 | 138.70 | 0.722 | 83 | — |

#### NVIDIA
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| nvidia/llama-3.1-nemotron-70b-instruct | 84.38 | 70.27 | 69.62 | 140.32 | 0.638 | — | — |

#### Microsoft
| Model | DAT | CDAT | CDAT-N | CDAT-A | PACE | RAT | DRAT |
|---|---|---|---|---|---|---|---|
| microsoft/phi-4 | 74.29 | — | 72.71 | 134.34 | 0.680 | 63 | 19.28 |

### Notes
- All DRAT scores are mean over 30 anchor sets, k=4 scientific-terms bank, SBERT embedding (headline expert config)
- "—" cells: no valid score (e.g., CDAT temperature-gate failures, JSON parse failures, missing RAT runs)
- SEM values present in paper omitted here for compactness; can re-include if DB stores uncertainty
- Some "in-name only" mappings (e.g., `gpt-5-4` = GPT-5.4) follow the canonical mapping rules

**DRAT/creativity total** = 54 model rows × (up to 7 tests) ~= **350 potential cells**, with ~310 actually populated (excluding "—")

---

## Skipped per paper

### KnotBench skipped
- Section 5.1-5.6 prose mentions per-task numbers redundant with Figure 1 heatmap (already captured)
- "C1 permissive Regina decode" partial-credit (gpt-5+thinking 4/100) → keep as supplementary note, not main score
- Per-crossing-tier breakdown (Fig 10 in App B) — not in pages 1-10, would need App B read for completeness

### DRAT skipped
- Table 4 (Arena Overall Elo, MMLU-Pro, Arena CW Elo, EQ-Bench CW v3, Mazur CW, Hivemind diversity, NovBench Utility, LiveIdeaBench) — these are **external** benchmark snapshots transcribed from Chatbot Arena / TIGER-Lab leaderboards. They are NOT this paper's primary contribution; if registering, attribute to original sources (Chiang 2024, Wang 2024b, Paech 2023, Mazur 2025, Jiang 2025, Zhang 2025, Ruan 2026) — included list as informational sources but should be cross-referenced against the original leaderboards before DB ingest.
- Validity/specificity correlation matrix (Table 1) — these are aggregate r-values across the model pool, not (model, bench, value) triples
- DRAT correlations with existing tests (Table 2 in DRAT paper) — same: cross-test r-values, not model scores
- Anchor-count ablations (Fig 10, Table 6) — pool-level, not per-model
- Embedding-stratified blocks of Table 1 (GloVe / FastText / SBERT subsections) — already aggregated in Overall block, model scores in Table 3 use the canonical embedding per metric
- DAT Greedy Algorithm (Fig 11, App D) — algorithm baseline, not a model

---

## Total

- **New benchmarks**: 9
  - `knotbench` (1 overall + 14 sub-tasks)
  - `drat`
  - `dat`
  - `cdat`
  - `cdat_n`
  - `cdat_a`
  - `pace`
  - `rat`
- **New scores**: ~370
  - KnotBench: 60 triples (4 models × 15 = 60)
  - DRAT paper: ~310 populated triples (54 models × 7 tests minus "—" cells)

### Model-ID notes
- KnotBench evaluates `claude-opus-4.7` and `gpt-5` only; thinking-mode rows should be registered as separate model entries (`anthropic/claude-opus-4.7-thinking`, `openai/gpt-5-thinking`) if the DB supports policy/mode variants per the AA pattern.
- DRAT paper uses `claude-opus-4-5/4-6/sonnet-4-5/4-6` etc. — these correspond to claude-opus-4.5, 4.6, sonnet-4.5, 4.6 in the canonical IDs.
- `gpt-5-4` in DRAT Table 3 = GPT-5.4 → `openai/gpt-5.4`.
- Several Qwen3 / Llama-4 / Gemini-3 lineage models present but no Gemini-3 / Kimi-K2 found in either paper (out-of-pool for both studies).
