# Leaderboard Sweep — 2026-05-14

**Window**: 2026-05-07 to 2026-05-14 (last 7 days)
**Current DB**: 1339 models / 935 benchmarks / 5102 scores
**Attribution policy**: STRICT — only primary-source URL with explicit (model, benchmark, value) triple.

## Leaderboard-by-leaderboard inventory

### 1. AA Intelligence Index v4.0.4 — https://artificialanalysis.ai/leaderboards/models

- **Last updated / version**: v4.0.4 (March 2026 — grader update only). No further AAII version bumps within the 2026-05-07 to 2026-05-14 window.
- **Methodology**: 10 benchmarks across 4 categories (Agents, Coding, General, Scientific Reasoning) — no change in last 7 days.
- **Top 10 with AAII scores**:
  1. GPT-5.5 (xhigh) — 60
  2. GPT-5.5 (high) — 59
  3. Claude Opus 4.7 (max) — 57
  4. Gemini 3.1 Pro Preview — 57
  5. GPT-5.5 (medium) — 57
  6. Kimi K2.6 — 54
  7. MiMo-V2.5-Pro — 54
  8. GPT-5.3 Codex (xhigh) — 54
  9. Grok 4.3 — 53
  10. Muse Spark — 52
- **New since 2026-05-07**: No "new" badges visible; no model identifiable as added during the window from the AA page alone.

### 2. AA Methodology page — https://artificialanalysis.ai/methodology/intelligence-benchmarking

- Current version v4.0.4 (March 2026), v4.0.3 (Feb 2026), v4.0 restructure (Jan 2026).
- No methodology change in 2026-05-07..2026-05-14.

### 3. LMArena / arena.ai — https://arena.ai/leaderboard

- **Last updated**: "1 day ago" (≈ 2026-05-13)
- **Top 10 (Text Arena Elo)**:
  1. claude-opus-4-6-thinking (Anthropic) — 1502
  2. claude-opus-4-7-thinking (Anthropic) — 1501
  3. claude-opus-4-6 (Anthropic) — 1498
  4. claude-opus-4-7 (Anthropic) — 1492
  5. muse-spark (Meta) — 1491
  6. gemini-3.1-pro-preview (Google) — 1490
  7. gemini-3-pro (Google) — 1486
  8. gpt-5.5-high (OpenAI) — 1484
  9. grok-4.20-beta1 (xAI) — 1479
  10. gpt-5.4-high (OpenAI) — 1479
- **New since 2026-05-07**: Page does not surface explicit add-dates per row. Cannot confirm any specific entry was added in the window — SKIP under strict attribution.

### 4. LiveBench — https://livebench.ai/

- **Live page**: returns only heading; no leaderboard payload via WebFetch.
- **Mirror (llm-stats.com, last updated 2026-05-14)**: only 13 models listed, top o3-mini 0.846 — this mirror is clearly stale relative to the actual livebench.ai full leaderboard (no GPT-5.x, no Claude Opus 4.x entries).
- **GitHub changelog**: only 2026-01-08 entry exists for 2026 — no Apr/May 2026 update logged.
- **Conclusion**: No verifiable new entries in window. SKIP.

### 5. Vellum — https://www.vellum.ai/llm-leaderboard

- **Last updated**: 2026-04-23 (pre-window).
- Featured per-benchmark leaders (already in DB):
  - GPQA Diamond: Claude 3 Opus 95.4% / Claude Opus 4.7 94.2% / GPT-5.5 93.6%
  - AIME 2025: Gemini 3 Pro 100% / GPT-5.2 100% / Claude Opus 4.6 99.8%
  - SWE-Bench: Claude Opus 4.7 87.6% / Claude Sonnet 4.5 82% / Claude Opus 4.5 80.9%
  - HLE: Gemini 3 Pro 45.8% / Kimi K2 Thinking 44.9% / GPT-5.5 Pro 43.1%
- No update inside the 2026-05-07..2026-05-14 window.

### 6. Epoch ECI — https://epoch.ai/data/eci_scores.csv

- **Total rows**: 250 (up from 172 we ingested previously → +78 rows since last sync, though most added pre-window per the memory note dated arxiv 2512.00193).
- **Top 15** (model, ECI, 95% CI):
  1. GPT-5.5 Pro — 159.50 [157.32, 163.92]
  2. GPT-5.5 — 158.37 [156.40, 162.58]
  3. GPT-5.4 Pro — 158.16 [156.29, 162.22]
  4. Gemini 3.1 Pro — 156.77 [155.28, 160.87]
  5. GPT-5.4 — 156.30 [154.35, 159.20]
  6. GPT-5.3 Codex — 156.21 [153.86, 161.09]
  7. Claude Opus 4.7 — 156.09 [153.95, 159.52]
  8. Claude Opus 4.6 — 155.42 [153.94, 158.95]
  9. Muse Spark — 155.15 [152.99, 159.63]
  10. Grok 4.20 — 154.35 [145.86, 156.96]
  11. GPT-5.2 Pro — 154.25 [149.92, 159.04]
  12. GPT-5.2 — 153.81 [151.93, 156.27]
  13. Gemini 3 Pro — 153.52 [152.14, 157.26]
  14. Claude Sonnet 4.6 — 152.99 [149.96, 154.91]
  15. Kimi K2.6 — 151.65 [148.88, 154.42]
- **Date column**: empty per fetch — cannot attribute any row to 2026-05-07..2026-05-14 window. Pool growth (172 → 250) likely happened earlier; CSV does not date individual rows.

### 7. Onyx Open LLM — https://onyx.app/open-llm-leaderboard

- **Last updated**: 2026-03-24 (pre-window). SKIP.

### 8. LiveCodeBench — https://livecodebench.github.io/leaderboard.html

- Page renders "Loading leaderboard data..." via JS; WebFetch can't read live values.
- Per llm-stats.com mirror, v6 is current (problems May 2023–Apr 2025). No v7 visible.
- Per-model leaderboard top values (mirror, dates not per-row):
  - LCB v6 top: Kimi K2.6 0.896 / Seed 2.0 Pro 0.878 / Qwen3.6 Plus 0.871
  - LCB overall mirror (2026-05-08 snapshot): Gemini 3 Pro Preview 91.7 / Gemini 3 Flash Preview 90.8 / DeepSeek V3.2 Speciale 89.6
- Two mirrors disagree on top model → SKIP under strict attribution (no clean primary source within window).

### 9. SWE-Bench — https://www.swebench.com/

- swebench.com page truncated on fetch; cannot read raw table.
- Third-party mirrors agree on these primary-sourced submissions (model card / system card origin):
  - Claude Mythos Preview — 93.9% (announced 2026-04-07 in Anthropic system card; pre-window but already-canonical)
  - GPT-5.5 — 88.7% (OpenAI, 2026-04-23, pre-window)
  - Claude Opus 4.7 — 87.6% (Anthropic, 2026-04-16, pre-window)
- No new SWE-Bench Verified submission with a date stamped 2026-05-07..2026-05-14 surfaced from any primary source.

### 10. Terminal-Bench 2.0 — https://www.tbench.ai/leaderboard/terminal-bench/2.0

- **Top 5** (agent + model, score, date):
  1. Codex CLI + GPT-5.5 — 82.0% ±2.2 (2026-04-23)
  2. ForgeCode + GPT-5.4 — 81.8% ±2.0 (2026-03-12)
  3. TongAgents + Gemini 3.1 Pro — 80.2% ±2.6 (2026-03-13)
  4. ForgeCode + Claude Opus 4.6 — 79.8% ±1.6 (2026-03-12)
  5. SageAgent + GPT-5.3-Codex — 78.4% ±2.2 (2026-03-13)
- **New since 2026-05-07**: None — most recent dated entry is 2026-04-23.

### 11. HF Open LLM Leaderboard — https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard

- HF Space returns runtime error / launch timeout — leaderboard effectively offline. SKIP.

### 12. GPQA — https://gpqa.github.io/

- 404 on the canonical /gpqa.github.io URL; no official live leaderboard page.
- Aggregated mirrors:
  - Claude Mythos Preview 94.6% (system-card, 2026-04-07; pre-window)
  - Gemini 3.1 Pro Preview 94.1% (AA, Feb 2026)
  - GPT-5.4 92.0%
- Benchmark is saturated. No new in-window primary-source submission.

## Recent arXiv (2026-04-30 to 2026-05-14)

Surfaced papers with explicit model × benchmark × score tables:

- **2605.06869 — Agentick**: 37 procedurally-generated tasks. Tested: GPT-5 mini, Gemini 3.1 Flash Lite, Claude Haiku 4.5, plus open-weight + RL agents. GPT-5 mini leads at 0.309 ONS (oracle-normalized score). Reports "ONS" not yet a tracked benchmark in our DB.
- **2605.05662 — XL-SafetyBench**: cross-cultural safety across 10 frontier models (GPT-5.4, GPT-5-mini, Gemini-3.1-Pro, Gemini-3-Flash, Claude-4.6-Opus, Claude-4.5-Sonnet, Grok-4.20, Llama-4-Maverick, Mistral-Large-3, Qwen3.5-397B). Paper exists; per-model numeric scores not extracted in this sweep.
- **2605.10876 — AssayBench**: assay-level virtual cell benchmark. Tests Gemini 3 Pro, Gemini 3 Flash, GPT-5.4, GPT-OSS-120B, Qwen3.5 family. Specific scores not surfaced.
- **2605.10787 — ComplexMCP**: dynamic tool sandbox, 300+ tools across 7 sandboxes.
- **2605.05726 — SkillRet**: 17,810 skills, 63k training samples, 5k eval.
- **2605.06910 — IoC Recovery under Adversarial Code Obfuscation**: cyber-relevant benchmark.
- **2605.05175 — MRI-Eval**: 5 models (GPT-5.4, Claude Opus 4.6, Claude Sonnet 4.6, Gemini 2.5 Pro, Llama 3.3 70B), MCQ accuracy 93.2%–97.1%.
- **2605.05973 — Adaptive Benchmarking / Winner's Curse correction** (methodology).
- **2605.04135 — Frontier Lag**: bibliometric audit of capability misrepresentation (methodology).
- **2605.01687 — MultiBreak**: 10,389 multi-turn adversarial prompts (safety benchmark).
- **2605.07635 — Multi-Dimensional GEC Eval** (grammar correction, niche).
- **2605.02199 — MemAudit** (long-term memory).
- **2605.12477 — MEME**: multi-entity evolving memory eval.

None of these papers provide a primary-source (model, benchmark, single-value) triple at frontier-model resolution that we can ingest without first downloading the PDF table.

## New scores to ingest (model × benchmark × value triples)

Under STRICT attribution (primary source URL + explicit triple + within window 2026-05-07..2026-05-14):

| Model | Benchmark | Value | Unit | Source | Already in DB? |
|---|---|---:|---|---|---|
| _(none)_ | — | — | — | — | — |

**Rationale**: every numeric triple surfaced in this sweep has either (a) a submission/release date that predates 2026-05-07 (Claude Mythos 04-07, GPT-5.5 04-23, Opus 4.7 04-16, Terminal-Bench top 04-23), or (b) appears only on third-party aggregator mirrors (llm-stats.com, benchlm.ai, pricepertoken.com, marc0.dev) that do not themselves count as primary sources, or (c) is a paper-table number that requires PDF parsing before strict-attribution ingest.

## New benchmarks (if any)

Candidates from arxiv (need PDF + numeric extraction before ingest):

- Agentick (2605.06869) — sequential decision-making, ONS metric
- XL-SafetyBench (2605.05662) — cross-cultural safety
- AssayBench (2605.10876) — virtual cell biology
- ComplexMCP (2605.10787) — tool-use sandbox
- SkillRet (2605.05726) — skill retrieval
- MultiBreak (2605.01687) — multi-turn jailbreak safety
- MEME (2605.12477) — evolving memory
- MRI-Eval (2605.05175) — MRI physics MCQ

None ingested yet — these are leads, not confirmed entries.

## New models (if any)

None confirmed inside the 2026-05-07..2026-05-14 window from primary sources. Press coverage explicitly stated "as of 2026-05-06 no new frontier LLM has launched in May" — the model layer is quiet relative to April's 9-model surge (DeepSeek V4 Pro, Claude Opus 4.7, GPT-5.5, Kimi K2.6, Qwen 3.6 Plus, Muse Spark, Mistral Medium 3.5, Grok 4.20, MiMo-V2.5 etc.). May 5 events were operational (GPT-5.5 Instant promoted to ChatGPT default, Subquadratic SubQ-12M-context seed funding, US DoC pre-release testing expansion) — not new model entries.

## Skipped

- **LiveBench.ai** — page renders empty / mirror stale; no verifiable window-dated update.
- **LiveCodeBench** — leaderboard JS-rendered; mirrors disagree.
- **HF Open LLM Leaderboard** — Space runtime error.
- **GPQA gpqa.github.io** — 404, no canonical live leaderboard.
- **SWE-Bench Verified / Multilingual pages** — WebFetch returned truncated structure only; no per-row date data extractable.
- **Onyx Open LLM** — last update 2026-03-24, pre-window.
- **Vellum** — last update 2026-04-23, pre-window.
- **Terminal-Bench 2.0** — confirmed read; no in-window entries.
- **AA leaderboard / methodology** — read; no in-window changes.

## Total

- **New scores (window-attributed, strict)**: 0
- **New benchmarks (confirmed)**: 0 (8 arxiv candidates flagged for follow-up)
- **New models (confirmed)**: 0

---

## Brief summary (top 5 most impactful findings)

1. **The model layer is genuinely quiet 2026-05-07..05-14.** Multiple independent sources (Air Street press, futureagi, llm-stats trend report) state May has had zero frontier-LLM launches as of 2026-05-06, contrasting with April's 9 major releases. The DB therefore needs no urgent ingest cycle for this window.

2. **Epoch ECI CSV has grown from 172 → 250 rows since our last sync.** This is the single largest ingestable delta surfaced, but: (a) the CSV has no per-row date column so we cannot confirm rows are *in-window*, (b) the +78 rows likely accumulated since 2026-04-25 not in the last 7 days. Recommend a full re-ingest of `epoch.ai/data/eci_scores.csv` regardless of window framing — it gives 78 fresh model-level ECI values with 95% CIs.

3. **Claude Mythos Preview (93.9 SWE-Bench Verified, 94.6 GPQA Diamond, 64.7 HLE)** continues to lead three frontier benchmarks per BenchLM tracking on 2026-05-12, but the model card is dated 2026-04-07 and the model is closed (Project Glasswing, no public API). All three scores should already be in our DB from the April Mythos system-card ingest; verify.

4. **HLE has bifurcated reporting.** Artificial Analysis caps top scores at ~44.7% (Gemini 3.1 Pro Preview), but BenchLM/PricePerToken cite Claude Mythos at 64.7%. This is a known evaluation-protocol divergence (AA runs its own pipeline; provider self-reports are higher). Strict attribution implies we should record AA values as `aa_pipeline` and provider values as `self_report` — not blend them.

5. **arXiv May 2026 produced 8+ new benchmark papers** (Agentick, XL-SafetyBench, AssayBench, ComplexMCP, SkillRet, MultiBreak, MEME, MRI-Eval, plus methodology papers Frontier Lag and Adaptive Benchmarking Winner's Curse). None had clean (model, benchmark, value) triples extractable via WebSearch alone — they require PDF parsing. Highest ingest priority: **Agentick** (frontier-LLM sequential decision-making) and **XL-SafetyBench** (10 frontier models tested, cross-cultural). Both papers reference our existing tracked models so they slot cleanly into the DB once benchmark rows are added.

**Recommendation**: skip a "scores delta" ingest this week; instead schedule one offline pass to (a) re-pull `eci_scores.csv` for the +78 rows, (b) PDF-parse arxiv 2605.06869 and 2605.05662 for new benchmark tables, (c) audit Mythos entries already in DB for HLE protocol-tag consistency.
