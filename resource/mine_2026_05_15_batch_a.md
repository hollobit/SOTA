# Batch A — RealICU + ExploitBench + GeoBuildBench

Mining date: 2026-05-15
Source: 3 arxiv PDFs (local, downloaded 2026-05-15)

---

## Paper 1: RealICU (arxiv 2605.13542)

- Title: RealICU: Do LLM Agents Understand Long-Context ICU Data? A Benchmark Beyond Behavior Imitation
- Authors: Chengzhi Shen et al. (TUM, LMU, Oxford, Sheffield, Imperial)
- Bench slugs proposed: `realicu_gold`, `realicu_scale`
- Sub-tasks: Patient Status (Acc/F1), Acute Problems (Hit@5/R@5), Action Recommendation (Hit@5/R@5), Red Flags (HRR; lower better)
- Metric: heterogeneous (per-subtask); for "headline" use **Acute Problems Hit@5** (set-matching task most papers cite)
- Models evaluated: Gemini-3.1-pro, GPT-5.4, Qwen3-235B-A22B (note: Qwen3-235B is NOT in canonical map; closest = `alibaba/qwen3-32b` is wrong size — paper-specific model, may need new entry)
- Note: "ICU-Evo" is a memory framework wrapping each backbone — count as system, not as standalone model. Bare baselines: Full-context, Local-window, RAG. ICU-Evo is also reportable as that backbone under a specific scaffold.

### Verifiable triples — RealICU-GOLD (Table 2, p.7)

Reporting bare-model `Full-context` rows (model-level capability; ICU-Evo is scaffold). All set-matching scores at k=5.

| Model | Benchmark | Sub-metric | Value | Unit | Source |
|---|---|---|---:|---|---|
| Gemini 3.1 Pro | realicu_gold | Patient Status Acc | 0.298 | acc | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Patient Status F1 | 0.258 | f1 | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Acute Problems Hit@5 | 0.486 | hit@5 | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Acute Problems R@5 | 0.308 | recall@5 | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Action Recom Hit@5 | 0.259 | hit@5 | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Action Recom R@5 | 0.152 | recall@5 | p.7 Table 2 |
| Gemini 3.1 Pro | realicu_gold | Red Flags HRR@5 | 0.137 | rate(↓) | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Patient Status Acc | 0.294 | acc | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Patient Status F1 | 0.233 | f1 | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Acute Problems Hit@5 | 0.510 | hit@5 | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Acute Problems R@5 | 0.348 | recall@5 | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Action Recom Hit@5 | 0.404 | hit@5 | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Action Recom R@5 | 0.300 | recall@5 | p.7 Table 2 |
| GPT-5.4 | realicu_gold | Red Flags HRR@5 | 0.298 | rate(↓) | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Patient Status Acc | 0.225 | acc | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Patient Status F1 | 0.188 | f1 | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Acute Problems Hit@5 | 0.384 | hit@5 | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Acute Problems R@5 | 0.226 | recall@5 | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Action Recom Hit@5 | 0.329 | hit@5 | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Action Recom R@5 | 0.222 | recall@5 | p.7 Table 2 |
| Qwen3-235B-A22B | realicu_gold | Red Flags HRR@5 | 0.117 | rate(↓) | p.7 Table 2 |

### Verifiable triples — RealICU-SCALE (Table 4, p.15)

Note: Full-context omitted for Gemini/GPT due to compute cost. Reporting RAG rows as best-bare-memory baseline.

| Model | Benchmark | Sub-metric | Value | Unit | Source |
|---|---|---|---:|---|---|
| Gemini 3.1 Pro | realicu_scale | Patient Status Acc (RAG) | 0.442 | acc | p.15 Table 4 |
| Gemini 3.1 Pro | realicu_scale | Acute Problems Hit@5 (RAG) | 0.568 | hit@5 | p.15 Table 4 |
| Gemini 3.1 Pro | realicu_scale | Action Recom Hit@5 (RAG) | 0.466 | hit@5 | p.15 Table 4 |
| GPT-5.4 | realicu_scale | Patient Status Acc (RAG) | 0.411 | acc | p.15 Table 4 |
| GPT-5.4 | realicu_scale | Acute Problems Hit@5 (RAG) | 0.584 | hit@5 | p.15 Table 4 |
| GPT-5.4 | realicu_scale | Action Recom Hit@5 (RAG) | 0.509 | hit@5 | p.15 Table 4 |
| Qwen3-235B-A22B | realicu_scale | Patient Status Acc (Full-context) | 0.201 | acc | p.15 Table 4 |
| Qwen3-235B-A22B | realicu_scale | Acute Problems Hit@5 (Full-context) | 0.401 | hit@5 | p.15 Table 4 |
| Qwen3-235B-A22B | realicu_scale | Action Recom Hit@5 (Full-context) | 0.455 | hit@5 | p.15 Table 4 |

**RECOMMENDED MINIMAL INGEST**: pick one metric per bench. Suggest `realicu_gold` = Acute Problems Hit@5 (most stable, set-matching, all 3 models).

---

## Paper 2: ExploitBench (arxiv 2605.14153)

- Title: ExploitBench: A Capability Ladder Benchmark for LLM Cybersecurity Agents
- Authors: Seunghyun Lee, David Brumley (CMU)
- Bench slug: `exploitbench`
- Metric: count of bugs (of 41) where best-of-3-seeds union reached at least one capability flag in the named tier. Five tiers: T5 (Coverage), T4 (Triggering), T3 (Engine primitives), T2 (General primitives), `pc_control`, `ace`. Lower-tier reach is monotonically implied by higher-tier reach.
- Models evaluated (9): Mythos Preview (private, Anthropic), Claude Opus 4.7, Claude Sonnet 4.6, Claude Haiku 4.5, GPT-5.5, Gemini 3.1 Pro, GLM 5.1 (Z.ai), Kimi K2.6 (Moonshot), MiniMax M2.7
- 41 V8 bugs (JS + WebAssembly engine), N-day with patch given, 300-turn budget per cell.
- Primary arm only (bare `<model, env>`); skipping nudged/coaching/CLI variants except for harness-effect note.

### Verifiable triples (Table 1, p.9 — primary arm `<model, env>`)

Headline = `ace` (arbitrary code execution; top of ladder). Also include `pc_control` and `T2 General`.

| Model | Benchmark | Sub-metric | Value | Unit | Source |
|---|---|---|---:|---|---|
| Mythos Preview (private) | exploitbench | ace count (of 41) | 18 | bugs | p.9 Table 1 |
| Mythos Preview (private) | exploitbench | pc_control count | 18 | bugs | p.9 Table 1 |
| Mythos Preview (private) | exploitbench | T2 General count | 21 | bugs | p.9 Table 1 |
| Mythos Preview (private) | exploitbench | T3 Engine count | 35 | bugs | p.9 Table 1 |
| Mythos Preview (private) | exploitbench | T4 Triggering count | 38 | bugs | p.9 Table 1 |
| Mythos Preview (private) | exploitbench | T5 Coverage count | 41 | bugs | p.9 Table 1 |
| Claude Opus 4.7 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| Claude Opus 4.7 | exploitbench | pc_control count | 0 | bugs | p.9 Table 1 |
| Claude Opus 4.7 | exploitbench | T2 General count | 0 | bugs | p.9 Table 1 |
| Claude Opus 4.7 | exploitbench | T3 Engine count | 12 | bugs | p.9 Table 1 |
| Claude Opus 4.7 | exploitbench | T4 Triggering count | 24 | bugs | p.9 Table 1 |
| Claude Sonnet 4.6 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| Claude Sonnet 4.6 | exploitbench | T3 Engine count | 10 | bugs | p.9 Table 1 |
| Claude Sonnet 4.6 | exploitbench | T4 Triggering count | 21 | bugs | p.9 Table 1 |
| Claude Haiku 4.5 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| Claude Haiku 4.5 | exploitbench | T3 Engine count | 0 | bugs | p.9 Table 1 |
| Claude Haiku 4.5 | exploitbench | T4 Triggering count | 5 | bugs | p.9 Table 1 |
| GPT-5.5 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| GPT-5.5 | exploitbench | pc_control count | 1 | bugs | p.9 Table 1 |
| GPT-5.5 | exploitbench | T2 General count | 2 | bugs | p.9 Table 1 |
| GPT-5.5 | exploitbench | T3 Engine count | 13 | bugs | p.9 Table 1 |
| GPT-5.5 | exploitbench | T4 Triggering count | 27 | bugs | p.9 Table 1 |
| Gemini 3.1 Pro | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| Gemini 3.1 Pro | exploitbench | T3 Engine count | 16 | bugs | p.9 Table 1 |
| Gemini 3.1 Pro | exploitbench | T4 Triggering count | 23 | bugs | p.9 Table 1 |
| GLM 5.1 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| GLM 5.1 | exploitbench | T3 Engine count | 3 | bugs | p.9 Table 1 |
| GLM 5.1 | exploitbench | T4 Triggering count | 13 | bugs | p.9 Table 1 |
| Kimi K2.6 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| Kimi K2.6 | exploitbench | T3 Engine count | 0 | bugs | p.9 Table 1 |
| Kimi K2.6 | exploitbench | T4 Triggering count | 16 | bugs | p.9 Table 1 |
| MiniMax M2.7 | exploitbench | ace count (of 41) | 0 | bugs | p.9 Table 1 |
| MiniMax M2.7 | exploitbench | T3 Engine count | 0 | bugs | p.9 Table 1 |
| MiniMax M2.7 | exploitbench | T4 Triggering count | 6 | bugs | p.9 Table 1 |

### Vendor-CLI arm (Table 2, p.9) — only one notable result

| Model | Benchmark | Sub-metric | Value | Unit | Source |
|---|---|---|---:|---|---|
| GPT-5.5 (Codex CLI) | exploitbench | ace count (of 41) — vendor-CLI arm | 1 | bugs | p.9 Table 2 |

**RECOMMENDED MINIMAL INGEST**: pick `ace` count as the canonical headline (top-of-ladder, the only metric that survives all the harness/coaching ablations). Frontier separation is dramatic: Mythos Preview 18 vs all public models ≤1.

---

## Paper 3: GeoBuildBench (arxiv 2605.13167)

- Title: GeoBuildBench: A Benchmark for Interactive and Executable Geometry Construction from Natural Language
- Authors: Jinwoong Kim, Rui Yang, Huishuai Zhang (Peking University)
- Bench slug: `geobuildbench`
- Metric: **Success Rate (%)** — fraction of 489 Chinese plane-geometry problems where the agent's DSL program (i) executes, (ii) covers all required objects, (iii) satisfies all verification conditions within 5 iterations.
- Auxiliary metrics: avg steps, hallucinations/problem, missing objects, failed constraints (all lower-is-better)
- Models evaluated (4): GPT-5.1, Gemini-3-Flash, Qwen3-VL-235B-A22B-Instruct, LLaMA-3.2-90B-Vision-Instruct (vision-enabled mode)

### Verifiable triples (Table 1, p.7)

| Model | Benchmark | Sub-metric | Value | Unit | Source |
|---|---|---|---:|---|---|
| GPT-5.1 | geobuildbench | Success Rate | 78.9 | % | p.7 Table 1 |
| GPT-5.1 | geobuildbench | Avg Steps | 1.87 | steps | p.7 Table 1 |
| GPT-5.1 | geobuildbench | Hallucinations/problem | 0.40 | count | p.7 Table 1 |
| GPT-5.1 | geobuildbench | Missing Objects | 939 | count | p.7 Table 1 |
| GPT-5.1 | geobuildbench | Failed Constraints | 1119 | count | p.7 Table 1 |
| Gemini-3-Flash | geobuildbench | Success Rate | 75.3 | % | p.7 Table 1 |
| Gemini-3-Flash | geobuildbench | Avg Steps | 1.55 | steps | p.7 Table 1 |
| Gemini-3-Flash | geobuildbench | Hallucinations/problem | 0.34 | count | p.7 Table 1 |
| Gemini-3-Flash | geobuildbench | Missing Objects | 329 | count | p.7 Table 1 |
| Gemini-3-Flash | geobuildbench | Failed Constraints | 932 | count | p.7 Table 1 |
| Qwen3-VL-235B | geobuildbench | Success Rate | 42.2 | % | p.7 Table 1 |
| Qwen3-VL-235B | geobuildbench | Avg Steps | 2.30 | steps | p.7 Table 1 |
| Qwen3-VL-235B | geobuildbench | Hallucinations/problem | 2.30 | count | p.7 Table 1 |
| LLaMA-3.2-90B-Vision | geobuildbench | Success Rate | 21.3 | % | p.7 Table 1 |
| LLaMA-3.2-90B-Vision | geobuildbench | Avg Steps | 2.23 | steps | p.7 Table 1 |
| LLaMA-3.2-90B-Vision | geobuildbench | Hallucinations/problem | 2.38 | count | p.7 Table 1 |

**RECOMMENDED MINIMAL INGEST**: Success Rate (%) is the obvious headline.

Note: GPT-5.1 is mentioned in paper but NOT in our canonical map. Treat as new model entry: `openai/gpt-5.1` (between GPT-5 and GPT-5.2). Paper cites OpenAI 2025 introduction blog.

---

## Skipped per paper

### Paper 1 (RealICU)
- Skipped per-disease tables (Tables 5/6/7, p.18–20): these are disease-stratified subsets of the same benchmark, not separate benchmarks. Worth ingesting only if we model per-disease as separate sub-benchmarks (low priority).
- Skipped ICU-Evo wrapped rows for primary attribution (kept bare-baseline rows only). ICU-Evo is a scaffold/framework; including it would conflate model capability with framework.
- Skipped Oracle annotator results (Table 1, p.5): not a model under test, but the LLM-validated annotator itself (Gemini-3.1-pro acting as labeler).
- Skipped ablation Table 3: leave-one-out memory variants are scaffold tuning, not model capability.

### Paper 2 (ExploitBench)
- Skipped Tier 5 Coverage column: paper explicitly notes "T5 is uninformative on its own" (mostly patch-reading exercise; all 9 models hit 38-41/41).
- Skipped `<model, env, adaptive coaching>` nudged-arm rows: paper labels these as harness-sensitivity, not headline capability ("we report `<model, env>` as the primary measurement").
- Skipped Table 3 time-to-tier (wall-clock seconds + turn counts): operational, not capability.
- Skipped Mythos Preview "nudged" row (ace=16): bare-arm number (18) is the headline.

### Paper 3 (GeoBuildBench)
- Skipped Table 3 vision ablation (no-vision rows for Qwen/LLaMA): ablations, not headline.
- Skipped English-translation supplementary (Appendix Table 17/18): not in main body.
- Skipped Table 2 recovery-behavior numbers: derived from hallucination dataset, not independent triple.

---

## Total

- New benchmarks: **4 distinct** (`realicu_gold`, `realicu_scale`, `exploitbench`, `geobuildbench`) — but `realicu_scale` is the same task family scaled by Oracle annotator. Conservative count = **3** if we collapse RealICU into one bench with two splits.
- New scores: **~50 high-quality triples** across all 3 papers (counting only bare-model primary-arm rows from main tables):
  - RealICU-Gold: 21 triples (3 models × 7 sub-metrics)
  - RealICU-Scale: 9 triples (3 models × 3 sub-metrics, RAG/Full-context baseline)
  - ExploitBench: 32 triples (9 models × multi-tier counts) + 1 vendor-CLI
  - GeoBuildBench: ~14 triples (4 models × headline + key sub-metrics)
- New models needed (paper-specific, not in DB canonical map):
  1. `openai/gpt-5.1` — referenced by GeoBuildBench paper
  2. `alibaba/qwen3-235b-a22b-instruct` — RealICU + GeoBuildBench (we only have `qwen3-{8b,14b,32b}` in map)
  3. `meta/llama-3.2-90b-vision-instruct` — GeoBuildBench (we have `llama-3.3-70b`/`llama-4-maverick`, not 3.2-90b)
  4. `anthropic/claude-haiku-4.5` — ExploitBench
  5. `anthropic/mythos-preview` (private, may need policy flag) — ExploitBench
  6. `zai/glm-5.1` — ExploitBench
  7. `moonshot/kimi-k2.6` — ExploitBench (we have `kimi-k2-instruct`, K2.6 is newer)
  8. `minimax/minimax-m2.7` — ExploitBench

  Total **K = 8 new model entries** likely needed.

### Top frontier scores observed

- **ExploitBench**: Mythos Preview ACE = 18/41 (43.9%). All public frontier ≤ 1/41. GPT-5.5 vendor-CLI = 1/41.
- **GeoBuildBench**: GPT-5.1 = 78.9%, Gemini-3-Flash = 75.3% (closest pair); huge gap to Qwen3-VL-235B = 42.2%.
- **RealICU-Gold Acute Problems Hit@5**: GPT-5.4 = 0.510, Gemini-3.1-pro = 0.486, Qwen3-235B = 0.384 (full-context baselines). Benchmark "remains unsolved" per paper Section 5.1 — all configurations far below Oracle F1 of 0.987.
