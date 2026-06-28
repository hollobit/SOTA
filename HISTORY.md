# LLM Benchmark SOTA Dashboard — Work History

## 2026-06-28~29 (Sessions 154–157): Anthropic Mythos/Fable 5 system card deep-mine + 4-source parallel sweep + double PDF re-mine

### 77. Sessions 154–157 — 4 commits, +9 models / +40 benches / +123 scores

A tightly-focused multi-session arc spanning two days. After S154's broad
3-parallel sweep (Anthropic Claude 5 system card + Search/RAG frontier +
Game AI), the user pushed for ever-deeper extraction from PDF tables that
the first-pass agents had deliberately omitted. Net DB delta:
3,533 → 3,542 models, 3,818 → 3,858 benchmarks, 16,895 → 17,018 scores.

**S154b — Anthropic Mythos 5 + Fable 5 system card deep re-mine** (`ed16b7e`,
17 new benches / 57 scores):

S154's broad sweep had captured §8 Capabilities (226 scores). User asked
whether numeric tables in the 10,609-line system-card PDF were missed.
Second pass found 7 untouched tables across §3 Cyber, §4 Safeguards,
and §5 Agentic Safety. Scores across 6 Claude models: Fable 5, Mythos 5,
Opus 4.8, Opus 4.7, Mythos Preview, Sonnet 4.6.

Headline from §3.2 Cyber:

| Benchmark | Mythos 5 | Mythos Preview | Opus 4.8 |
|---|---:|---:|---:|
| Firefox 147 full working exploit | **88.4%** | 70.8% | **8.8%** |
| OSS-Fuzz any-crash rate | 80.0% | 76.7% | 61.5% |
| OSS-Fuzz write-primitive (≥0.4) | 32.4% | 31.1% | 18.2% |
| CyberGym pass@1 | 83.8% | 83.1% | 78.1% |
| CyberGym any-crash | 99.4% | 97.1% | 95.7% |

The Mythos 5 → Opus 4.8 Firefox 147 jump of **10×** is the single most
dramatic capability gain we have recorded in the database.

§4 Safeguards (multilingual 7-language × 16-policy-area harmful-request
benchmark): single-turn harmful refusal API at-parity across recent
models (Fable 5 96.94, Mythos 5 97.09, Opus 4.8 97.46, Sonnet 4.6 97.71);
benign over-refusal Fable 5 + Mythos Preview tied lowest at 0.01% vs
Sonnet 4.6 0.40%. Election integrity (300 violative + 300 benign
prompts): all post-Opus-4.7 models score 100% harmful refusal.

§5 Agentic Safety — Claude Code malicious refusal: Mythos Preview 95.41
> Opus 4.8 95.24 > Mythos 5 90.25 > Sonnet 4.6 76.60. Dual-use success:
Mythos 5 99.64 (strongest among recent models). Computer-use refusal
Mythos Preview 93.75 > Mythos 5 85.71 > Sonnet 4.6 84.82 > Opus 4.8
81.70 (Mythos 5 slightly more compliant than the Preview). Agentic
Influence campaigns (helpful-only variant, 70 success criteria × 9 sims
each): Voter Suppression Opus 4.8 73.3 highest, Mythos 5 67.1, Opus 4.7
57.1, Sonnet 4.6 41.8 lowest; Domestic Polarization Opus 4.8 55.1
highest, Mythos 5 + Opus 4.7 tied at 46.8 — all below Tier 2 threshold.

Propagated to Cyber-Coding (offensive + cyber-defense suites), Frontier
Compare (cybersecurity + cyber_defense BENCHMARK_GROUPS), and Agent
(safety category).

**S155 — 3-parallel: OSWorld V2 + DeepSpec/DSpark + Qihoo 360 Yitian
Tulong** (`817ec80`, 3 models / 12 benches / 33 scores):

*OSWorld 2.0 (XLANG xlang.ai)*: 108 long-horizon real-world computer-use
workflows. Median 1.6 h human time per task, ~318 tool calls per task for
Opus 4.7 (max thinking). Primary metric = binary completion at 500-step
budget; secondary = partial reward over 27.25 avg checkpoints (11.53%
model-graded). 3 step-budget views (150/300/500). No Office/Web/OS
sub-suites — instead 10 non-exclusive "challenge phenomena" tags
(Cross-source Reasoning 42.6%, Visual-spatial 41.7%, Implicit-state
39.8%). vs OSWorld 1.0: agent steps <30 → >250, human time ~2 min →
~1.6 h, 0 → 31 self-hosted websites.

Frontier saturation reference: Opus 4.8 scores 83.5% on OSWorld-Verified
vs only **20.6% on OSWorld 2.0 — 4× harder**.

Leaderboard (500-step canonical):

| Model | binary | partial |
|---|---:|---:|
| Claude Opus 4.8 | **20.6** | **54.8** |
| Claude Opus 4.7 | 18.2 | 52.5 |
| Claude Sonnet 4.6 | 15.7 | 50.4 |
| GPT-5.5 (xhigh) | 13.0 | 49.5 |
| MiniMax M3 | 8.3 | 39.6 |
| Kimi K2.6 | 6.5 | 36.8 |
| Qwen3.7-Plus | 5.6 | 34.2 |

XLANG evaluated only 7 API-accessible families — no Gemini, no
DeepSeek V4-Pro, no Mythos 5, no Fable 5, no GLM 5.2, no Kimi K2.7-Code,
no GPT-5.5-Pro / 5.6 / 5.4-xhigh.

*DeepSeek DeepSpec / DSpark* (MIT 2026-06-26, 1,896 stars): NOT a model,
benchmark, or inference engine — a full-stack training+eval codebase for
speculative-decoding draft models. Ships three drafter algorithms
(DSpark new, Eagle3 / DFlash reimplementations) plus 12 HuggingFace
checkpoints across Qwen3-{4B, 8B, 14B} and Gemma4-12B targets.

DSpark = semi-autoregressive parallel drafter with confidence-scheduled
verification, deployed inside DeepSeek-V4 serving. Accepted-length macro
average across 9 tasks (GSM8K / MATH500 / AIME25 / MBPP / HumanEval /
LiveCodeBench / MT-Bench / Alpaca / Arena-Hard):

- Qwen3-4B target: 4.73 tokens/round
- Qwen3-8B target: 4.81
- Qwen3-14B target: 4.78
- Gemma4-12B target: 4.66

Production per-user speedup vs MTP-1 baseline at matched aggregate
throughput: 60–85% on V4-Flash (midpoint 72.5%), 57–78% on V4-Pro
(midpoint 67.5%).

*Qihoo 360 Yitian Tulong* (ISC.AI 2026 launch, covered by Quartz/Reuters):
two named cyber-agent products under the "Yitian Tulong" umbrella:
**Tulongfeng** (offensive automated vulnerability discovery) and
**Yitianzhen** (defensive incident response / SOC automation). Vendor-claimed
3,432 software vulnerabilities discovered cumulatively, 105 confirmed by
Chinese authorities (CNVD/CNNVD not named). Reuters could not independently
verify. Article never names Firefox 147 / OSS-Fuzz / CyberGym / ExploitBench
— so no Mythos 5 cross-check possible. Source flagged as
`source_type=news_article`, kept out of headline SOTAs. Zhou Hongyi quote:
"domestic models still have a 20–30% gap in base capability."

**S156 — 2-parallel: Epoch MirrorCode + NVIDIA GLM-5.2-NVFP4** (`0baa65d`,
1 model / 2 benches / 11 scores):

*Epoch AI + METR MirrorCode* (paper hash `_8ae911f`, 2026-06): NEW
long-horizon coding benchmark. Reimplement entire CLI program end-to-end
from black-box behavior alone — NO source-code access, NO internet,
byte-exact stdout/stderr match against visible + held-out tests. 25
targets (10 Small + 11 Medium + 4 Large; 22 OSS + 3 private held-out)
× 6 languages (Python / C / Rust / Go / OCaml / Ada) = 132 instances.
Up to 10B tokens per Large task (~$5k); one full leaderboard run = $2,600
over 19 days. Cheat protection: hidden tests (~34%) + separate-sandbox
scoring + no internet + memorization screen. Closest analog is
ProgramBench but with ~100× larger inference budget.

| Model | solve@100% | solve@≥99% |
|---|---:|---:|
| Claude Opus 4.7 | **56%** | **77%** |
| GPT-5.5 | 44% | 57% |
| Gemini 3.1 Pro Preview | 32% (Python-only) | 44% |

GPT-5 27% **excluded** as paper extrapolation (assumes 0 on L), not
measured. Opus 4.1/4.6 Figure 10 subsets excluded as "not directly
comparable to overall solve rates." Mythos / Fable / Opus 4.8 /
DeepSeek / Qwen / Kimi NOT evaluated yet.

*NVIDIA GLM-5.2-NVFP4* (HF card, uploaded 2026-06-25, MIT, 45,762
downloads/month): post-training quantization via nvidia-modelopt v0.46.0;
ONLY MoE expert linear ops quantized, shared expert untouched; blocksize
/ group-scale-type / calibration set undisclosed. **Critical attribution
caveat**: accuracy table reports vs FP8 baseline (`zai-org/GLM-5.2-FP8`),
NOT vs BF16/FP16 — so "preservation" framing doesn't match standard
quantization-vs-FP16 reporting. At-parity on 5 benches (avg ratio
100.27%): GPQA Diamond 89.39, SciCode 49.04, IFBench 75.81, AA-LCR
70.13, τ²-Bench Telecom 98.25. Throughput / memory / latency: NOT
published. 3 composite NVFP4 bench IDs (preservation, throughput,
memory) initially proposed but rejected — last two unpublished, accuracy
framing mismatch.

**S157 — Deep PDF re-mine: DSpark Eagle3+DFlash drafter grid +
MirrorCode per-size/honesty/cost** (`ac7a03e`, 2 models / 9 benches /
22 scores):

User asked whether the agents had missed PDF content in S155/S156.
Re-mined both papers for sections the first-pass agents had deliberately
omitted.

*DSpark paper Table 1 full grid* (33pp, lead Xin Cheng @ PKU +
DeepSeek-AI, stamped 2026-06-27): 4 target backbones × 9 tasks × 3
drafters = 108 cells + 12 macros captured. Computed macros validate
paper claims exactly (+30.9 / +26.7 / +30.0% over Eagle3; +16.3 / +18.4
/ +18.3% over DFlash on Qwen3 family).

**Buried asymmetry**: Eagle3 (4.376) actually BEATS DFlash (4.018) on
Gemma4-12B target — and DSpark's gain over Eagle3 there is only +6.6%
vs +26–31% on the Qwen3 family. DFlash is target-architecture-sensitive
in a way the headline numbers obscure.

New production data: V4-Flash +51% throughput at 80 tok/s SLA, V4-Pro
+52% at 35 tok/s SLA (distinct from the matched-throughput ranges
already in DB). Confidence-scheduled verification ablation: chat-task
acceptance ECE 5.7–8.2% raw → ~1% calibrated; acceptance rate 45.7% →
95.7%; ROC-AUC 0.81–0.91 per position.

Added safeai-lab/eagle3 + deepseek/dflash as 2 new draft-model entries.

*MirrorCode Figures 2 + 6 and Tables 6–7*:

Per-size derived from Fig 2 per-target heatmap. **Opus 4.7 is the ONLY
model to solve ANY Large target** (cprepro at 100%) — large_score = 1/4
= 25%. GPT-5.5 + Gemini 3.1 Pro Preview both 0/4 on Large. Opus 4.7
Small ≈ 92% (10-cell S-block derivation).

| Model | Small | Large |
|---|---:|---:|
| Claude Opus 4.7 | **92%** | **25%** |
| GPT-5.5 | — | 0% |
| Gemini 3.1 Pro Preview | — | 0% |

**Honesty signal — Fig 6 failure-mode cheating rate** (defined as
modifying test files or using non-functional shortcuts):

| Model | Cheating rate |
|---|---:|
| Claude Opus 4.7 | **0.0%** |
| GPT-5.5 | 14.2% |
| Gemini 3.1 Pro | 18.9% |

Cost table (Table 6): Opus 4.7 mean $106/task max $2,846; Gemini mean
$162/task max $2,698. Token-usage multipliers per language (Table 5,
Appendix C.1): Ada uses 1.26–1.34× tokens vs Python's 0.77–0.79×
baseline. Skipped per Latest-Models-Focus rule: Opus 4.1, GPT-5 Fig 10
subsets.

**Engineering notes**:
- All four sessions respected the Plans.md 200-line hard limit by
  extending the S113 deep-mine bullet inline rather than adding new
  date headings.
- 8-tab propagation rule honored: every new bench ID with frontier-model
  scores was registered in at least one hardcoded tab category
  (Cyber-Coding for cyber + coding sub-benches, Frontier Compare for
  cross-cutting heatmap, Agent for agent-eval benches).
- Strict-attribution rule: GPT-5 MirrorCode 27% extrapolation rejected;
  Opus 4.1/4.6 Figure 10 subsets rejected as not-comparable; Qihoo 360
  vendor numbers flagged news_article with verification_status=unverified.
- Latest-Models-Focus rule honored: Opus 4.1 (>18 months old), GPT-5
  (>18 months old) Figure 10 subsets dropped.

**Insights**:

- **Mythos 5 is the strongest cyber-offensive model in any system card
  to date** — 10× Firefox 147 jump from Opus 4.8, 99.4% CyberGym
  any-crash saturation, balanced against ASL-3 deployment controls.
- **OSWorld 2.0 successfully resets the OS/computer-use frontier** —
  Opus 4.8 drops from 83.5% (V1) to 20.6% (V2), giving room for the
  next 12–18 months of progress.
- **DSpark caps a 2-generation acceleration of speculative decoding**
  (Eagle3 → DFlash → DSpark, ~30% gain each step on Qwen3) but reveals
  drafter performance is target-architecture-sensitive — same algorithm
  wins on Qwen, loses to Eagle3 on Gemma.
- **MirrorCode honesty signal is a usable proxy for alignment in coding
  agents**: Opus 4.7's 0% cheating rate vs Gemini's 18.9% is a >18pt
  alignment gap that the headline solve-rate column doesn't surface.

## 2026-06-15~16 (Sessions 126-129): CI repairs + post-sync mining

### 76. Sessions 126-129 — Sync repairs + Kimi K2.7 Code + GLM-5.2 BridgeBench

Post-S125 sync work and targeted URL/Playwright mining.

**S126 — Main branch HISTORY sync** (`e265a36`):
User requested github push verification. ops already in sync. Per memory
rule (HISTORY.md/README.md/LICENSE only on main), synced HISTORY
Section 75 covering Sessions 111-125 marathon. Worktree-based approach
used to bypass `.remember/tmp/save-session.pid` index conflict.

**S127 — gh-pages deploy trigger** (succeeded after 2 failures):
Triggered `benchmark-update.yml` workflow_dispatch.
- Run 1 (`27553111928`): Analyst FK constraint at S110 ingest.
  Reproduced locally — S110/S111/S122 had prefix mismatches between
  `models[]` definitions and `scores[]` references:
    - `mistralai/mistral-small-3.2-24b-instruct` → `mistral/...`
    - `mistralai/pixtral-12b` → `mistral/pixtral-12b`
    - `anthropic/claude-opus-4-6-high` (dash) → `4.6-high` (dot)
    - `gpt-5-3-codex` (dash) → `openai/gpt-5.3-codex` (dot)
    - `healthbench-professional` (dash) → `_professional` (underscore)
  Fixed via 7 score remaps (`4b8d2cb`).
- Run 2 (`27553476378`): `python -m cyber analyze` TypeError at
  validator.py:40 — `if value < 0` failed because S91 deep re-mine
  contained 15 qualitative text values
  ('highest among Claude models (figure only)', etc.). Stripped all
  15 from ingest file (`bf718ae`).
- Run 3 (`27553718780`) succeeded: all 3 jobs (Scout/Analyst/Publish)
  passed. gh-pages deployed (`43cabc7`) with cache-bust `?v=bf718ae0`.

**S128 — 11-URL targeted Kimi K2.7 Code + GLM-5.2** (`241e4eb`):
Single agent on 11 URLs. **8/11 URLs blocked WebFetch**, only 3 mined
(kimi.com, OpenRouter, LushBinary).

K2.7 Code architecture (Moonshot launch page 2026-06-15):
- 1T total / 32B active MoE + MLA attention + MoonViT 400M vision
- 262K context, text + image + video
- Pricing: Kimi API $0.19/$0.95 in + $4.00 out per 1M; OpenRouter $0.75/$3.50
- Modified MIT open weights

K2.7 Code per-bench (Moonshot self-report, 6 NEW benches):
- Kimi Code Bench v2: 62.0
- Program Bench: 53.6
- MLS Bench Lite: 35.1
- Kimi Claw 24/7 Bench: 46.9
- MCP Atlas: 76.0
- MCP Mark Verified: 81.1

K2.7 Code positions between Opus 4.8 and GPT-5.5 on all 6 benches —
Moonshot pitches price/performance + open-weight leader, not capability
SOTA. GLM-5.2 had ZERO attributable scores from this pass — deferred
to Playwright retry (S129).

**S129 — GLM-5.2 BridgeBench Playwright retry** (`7a7f678`):
Playwright MCP successfully rendered BridgeBench JS-only pages.
Captured 7 boards with full leaderboard tables (+3 models / +13
benchmarks / +148 scores).

NEW benches: 7 BridgeBench boards (Reasoning v2, SpeedBench Throughput
+ TTFT, Debugging v2, Refactoring, Hallucination, Security) + 6
Reasoning sub-clusters (Stateful Execution / Constraint Reconciliation
/ Root Cause / Multi-Artifact / Counterexample / Uncertainty).

🏆 NEW SOTA: **GLM 5.2 = 42.8 on BridgeBench Reasoning v2 (z.ai #1)** —
beating Nemotron 3 Ultra 41.7, Fable 5 41.5, GPT-5.4 40.6, K2.7 Code
40.1 (#11).

Other BridgeBench board SOTAs:
- SpeedBench Throughput: Gemini 3.5 Flash 581.1 t/s
- SpeedBench TTFT: Elephant Alpha 508ms (lower=better)
- Debugging v2: Kimi K2.6 87.4 (GLM 5.2 86.6 #5)
- Refactoring: Claude Opus 4.7 75.2 (GLM 5.2 72.9 #4)
- Hallucination: Grok 4.3 79.8 (GLM 5.2 77.4 #6)
- Security: GPT-5.4 87.6 (K2.7 Code 84.4 #4; GLM 5.2 not entered)

GLM 5.2 per-cluster Reasoning detail (from model detail page):
- Stateful Execution: 71.1
- Constraint Reconciliation: 49.6
- Root Cause: 37.2
- Multi-Artifact: 32.2
- Counterexample: 30.6
- Uncertainty: 36.0

NEW models (3): cursor/composer-2.5-fast, openrouter/owl-alpha,
openrouter/elephant-alpha (frontier preview).

Canonical ID corrections during ingest:
- `qwen/qwen3.7-max` → `alibaba/qwen3.7-max`
- `qwen/qwen3.6-max-preview` → `alibaba/qwen3.6-max-preview`
- `qwen/qwen3.6-plus` → `alibaba/qwen3.6-plus`
- `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` → suffix dropped

UI + BS BridgeBench leaderboard pages 404 (not yet published).

**Insights**:
- **GLM 5.2 = reasoning specialist** (Reasoning SOTA + Refactoring #4)
- **K2.7 Code = cyber + code specialist** (Security #4 + Kimi-branded
  code benches)
- Two models targeting different niches in the open-weight tier

## 2026-06-15 (Sessions 111-125): June 2026 frontier sweep

### 75. Sessions 111-125 — 15-session marathon (+664 models / +662 benchmarks / +3,138 scores)

A 4-day intensive sweep covering 13 frontier topics + 2 propagation/re-mine
sessions. Database grew from 2,555 → 3,097 models, 2,738 → 3,254 benchmarks,
12,435 → 15,148 scores.

**Session-by-session highlights**:

| S | Topic | Δ Models | Δ Benches | Δ Scores | Headline SOTA |
|---|---|---:|---:|---:|---|
| 111 | Cybersecurity refresh | +17 | +61 | +94 | MDASH CyberGym 96.55 + Atlantis AIxCC 1st $4M |
| 112 | Function calling / tool use | +28 | +18 | +216 | Opus 4.5 BFCL v4 77.47 + Mythos 5 BrowseComp multi-agent 93.3 |
| 113 | Deep re-mine (Anthropic+Google+DeepSeek cards) | +6 | +81 | +410 | Mythos 5 USAMO 2026 99.8 + V4-Pro-Max Putnam-2025 120/120 |
| 114 | Image & Video gen | +41 | +14 | +146 | GPT-Image-2 AA T2I 1339 + Dreamina Seedance 2.0 AA T2V/I2V SOTA |
| 115 | Robotics / VLA / Humanoid | +15 | +13 | +44 | Xiaomi-Robotics-0 LIBERO 98.7 + Atlas Electric 56 DoF |
| 116 | Medical AI | +16 | +12 | +106 | Gemini 3.1 Pro MedQA-USMLE 97.4 (Nature Med) + Fable 5 HealthBench Pro 0.660 |
| 117 | Audio / Speech | +72 | +37 | +214 | Qwen3.5-Omni-Plus VoiceBench 93.1 + Fun-Realtime-ASR 1.7% |
| 118 | OCR / Doc Understanding | +85 | +49 | +321 | PaddleOCR-VL 1.6 OmniDocBench v1.6 = 96.33 |
| 119 | Edge LLM / SLM | +40 | +41 | +545 | SmolLM3-3B BFCL v3 92.3 BEATS ALL FRONTIER + Nemotron Nano 9B v2 MATH-500 97.8 |
| 120 | 3D / Scene generation | +59 | +59 | +234 | Hunyuan3D 2.5 Hi3DEval 16.561 + SPAR3D GSO F-Score@0.2 0.850 |
| 121 | 8-tab propagation | — | — | — | 6 JS files patched, 70 model IDs across 8 hardcoded tabs |
| 122 | Deep re-mine post-S113 | +35 | +52 | +174 | Claude Fable 5 AAII 64.9 #1 + Gemini 3.5 Flash MCP-Atlas 83.6 |
| 123 | Time-series / Forecasting | +51 | +29 | +73 | Chronos-2 #1 GIFT-Eval + GenCast 97.2 CRPS WB-2 |
| 124 | 5-URL targeted (DiffusionGemma + MiniCPM5 + SUSVIBES) | +1 | +9 | +34 | DiffusionGemma >1000 tok/s H100 + Gemini 3 Pro SUSVIBES FuncPass 53.5 |
| 125 | Music generation | +76 | +39 | +102 | Suno V5.5 AA Arena Instrumental 1186 + Vocals 1163 SOTA |

**Cross-cutting findings**:
- **AAII v4.0 snapshot 2026-06-15**: Claude Fable 5 = 64.9 #1, displaces Opus 4.8 (61.0). GPT-5.5-xhigh + GPT-5.5 = 60.0 overtake Opus 4.7 tier.
- **Strict-attribution catches**: 100+ NOT-EXIST claims documented across sessions (GPT-5.6/6, Gemini 4, Grok 4.5/5, Llama 5.5, DeepSeek V5/R2, Qwen 3.8/4, Phi-5, Marker 2, Nougat 2, TableTransformer v3, Donut V2/V3, Hunyuan3D 3.0, Luma Genie 2, Wonder3D-XL, NVIDIA Acoustica (=PersonaPlex), Anthropic music/voice — all confirmed null).
- **Open vs commercial gaps**: music ~25% behind (YuE-7B FAD 1.624 vs Suno V4 1.544 / Udio 1.222), 3D ~similar headroom; edge LLM closing fast (SmolLM3-3B tool-use beats all frontier).
- **Data-hygiene fixes**: openai/realtime-tts-2 misattributed (actual Inworld); aa-intelligence-index dash/underscore variants merged.
- **8-tab propagation (S121)**: 70 S111-S120 model IDs propagated across hardcoded dashboard tabs with canonical-ID corrections (gigapath, vista-3d, medsam, unitree-h1, bitnet variants).
- **Playwright gaps**: swebench/livebench/llm-stats/HF Open LLM v3 leaderboards remain client-rendered; deferred for future tooling sweep.

**New benchmark categories debuted**:
- **3D gen** (S120): GSO, Hi3DEval, T3Bench, Toys4k img-to-3D, ULIP-T/Uni3D-I, V-IoU/S-IoU
- **Time-series** (S123): GIFT-Eval, fev-bench, BOOM observability, WeatherBench-2 CRPS/RMSE targets, MIRA OOD/ID
- **Music gen** (S125): AA Music Arena Instrumental/Vocals Elo, MMAR, MUSDB18-HQ SDR, MusicCaps FAD, SongBench
- **OCR/Doc** (S118): OmniDocBench v1.5/1.6/1.7, olmOCR-Bench 5-category, Fox-Bench, XDocParse, CC-OCR, MMLongBench-Doc
- **Cyber** (S111): CTI-REALM, SandboxEscape, CrackMe/RE/CRE Bench, FuzzingBrain V2, ExploitBench V8, Cyber Defense

**Process notes**:
- 3 parallel agents per session (run_in_background) became standard pattern; ~2-3 sessions/hour throughput.
- Some agents socket-crashed (S115 robotics-bench, S120 initial 3D agents) — VLA agent's overlapping coverage prevented critical loss.
- Plans.md compression dance kept file at ≤200 lines via per-session merger of older 4-session compressed blocks.

## 2026-05-20 (Session 19 cont'd 3): Reference leaderboard mining for new Session 19 models

### 59. Cross-leaderboard mining for Gemini 3.5 Flash + Omni Flash + Qwen 3.7 Max/Plus preview

User asked us to mine reference leaderboards and find additional benchmark coverage for the 4 newly-added Session 19 models. Subagent systematically checked: **AA Intelligence Index** (per-model detail page), **arena.ai** (text + vision + webdev + sub-categories), **LMArena**, **LiveBench**, **MathArena** (Final-Answer Comps), **Aider Polyglot**, **Epoch ECI CSV**, **Scale SEAL**, **OpenRouter**, **VBench**, **VBench-2.0**, **Bambooshi**, **Hugging Face Video Generation Arena**.

**Results per model**:

| Model | Existing scores | New scores | Total |
|---|---:|---:|---:|
| `google/gemini-3.5-flash` | 14 | **+13** | 27 |
| `google/gemini-omni-flash` | 0 | 0 (absent across all video gen leaderboards) | 0 |
| `alibaba/qwen3.7-max-preview` | 1 | 0 (no new leaderboard appearances yet) | 1 |
| `alibaba/qwen3.7-plus-preview` | 1 | 0 (no new leaderboard appearances yet) | 1 |

**13 NEW scores for Gemini 3.5 Flash**:

| Bench | Value | Source |
|---|---:|---|
| `aa_intelligence_index` | 55 | AA detail page (rank 5/28) |
| `terminal_bench_hard` | 41% | AA detail (pos 23/28) — distinct from terminal_bench_2/2.1 |
| `tau2_telecom` | 95% | AA detail (pos 9/28) — strong agentic-tool signal |
| `aa_lcr` | 69% | AA detail (pos 18/28) |
| `aa_omniscience_acc` | 52% | AA detail (pos 6/28) |
| `aa_omniscience_non_hall` | 39% | AA detail (pos 15/28) |
| `gpqa_diamond` | 92% | AA detail (pos 5/28) |
| `scicode` | 53% | AA detail (pos 9/28) |
| `ifbench` | 76% | AA detail (pos 7/28) |
| `critpt` | 13% | AA detail (pos 7/28) |
| `arena_ai_text_elo` | 1480 | arena.ai/leaderboard/text rank 9 / 5907 votes / ±8 |
| `webdev_arena` | 1507 | arena.ai/leaderboard/code/webdev rank 9 / 2148 votes / ±14 |
| `matharena_final_answer` | 51.22% | matharena.ai rank 5 / ±8.83 / $0.22 cost / 24812 tokens |

**Skipped per preservation policy** (existing primary-source preserved):
- `gemini-3.5-flash/gdpval_aa` AA shows 58% but DB has 1656 Elo (metric encoding mismatch — accuracy vs Elo)
- `gemini-3.5-flash/hle` AA shows 41% rounded vs DB 40.2% Google primary
- `gemini-3.5-flash/mmmu_pro` AA shows 84% rounded vs DB 83.6% Google primary

**Confirmed absent everywhere**:
- `google/gemini-omni-flash`: absent from AA T2V/I2V, arena.ai T2V/I2V, VBench (HF), VBench-2.0, Bambooshi (site down). Confirms vendor's deferred-to-API-rollout note — no public benchmark exposure as of 2026-05-20.
- `alibaba/qwen3.7-max-preview`: no scores beyond arena.ai text 1475 — absent from AA, LMArena, LiveBench, MathArena, Aider, Epoch ECI, Scale SEAL.
- `alibaba/qwen3.7-plus-preview`: no scores beyond arena.ai vision 1260.

**Insight**: Both Qwen 3.7 previews + Omni Flash are recent-week launches still in early arena rotation. Re-check in 2-3 weeks for broader leaderboard coverage.

**Files patched**:
- `resource/zzz_2026_05_20_gemini_3_5_flash_leaderboard_mine_scores.json` (new, 13 scores)
- No new models, no new benchmarks (all 14 target benchmark IDs already in DB)
- Data-only ingest, no code/UI changes

## 2026-05-20 (Session 19 cont'd 2): Gemini 3.5 Flash PDF backfill — 6-column comparison table

### 58. Gemini 3.5 Flash + Omni Flash PDF model card analysis (35 backfill triples)

User asked us to analyze the actual PDF model cards (vs HTML summaries used in Section 56). The PDFs revealed:

**Gemini 3.5 Flash PDF page 4** — full 14-benchmark × 6-model comparison table with comparison columns I previously missed:

| Benchmark | 3.5 Flash | 3 Flash | 3.1 Pro | Sonnet 4.6 | Opus 4.7 | GPT-5.5 |
|---|---:|---:|---:|---:|---:|---:|
| Terminal-Bench 2.1 | **76.2** | 58.0 | 70.3 | - | 66.1 | **78.2** |
| SWE-Bench Pro Public | 53.9 | 48.4 | 54.2 | 53.0 | **64.3** | 58.6 |
| MCP Atlas | **83.6** | 62.0 | 78.2 | 69.5 | 79.1 | 75.3 |
| Toolathlon | **56.5** | 49.4 | - | - | - | 55.6 |
| OSWorld-Verified | 78.4 | 65.1 | 76.2 | 72.5 | 78.0 | **78.7** |
| Finance Agent v2 | **57.9** | 42.6 | 43.0 | 51.0 | 51.5 | 51.8 |
| GDPval-AA Elo | 1656 | 1204 | 1314 | 1674 | 1753 | **1773** |
| CharXiv Reasoning | **84.2** | 80.3 | 83.3 | 70.5 | 82.1 | 84.1 |
| MMMU-Pro | **83.6** | 81.2 | 80.5 | 74.5 | 75.2 | 81.2 |
| Blueprint-Bench 2 | 33.6 | 0.0 | 26.5 | 6.7 | 24.5 | **36.2** |
| MRCR v2 128k | 77.3 | 67.2 | 84.9 | 84.9 | 59.3 | **94.8** |
| MRCR v2 1M | 26.6 | 22.1 | 26.3 | n/a | n/a | n/a |
| Humanity's Last Exam | 40.2 | 33.7 | 44.4 | 33.2 | **46.9** | 41.4 |
| ARC-AGI-2 | 72.1 | 33.6 | 77.1 | 58.3 | 75.8 | **85.0** |

**1 correction (via SQL UPDATE)**: Gemini 3.5 Flash SWE-Bench Pro `55.1 → 53.9` — earlier WebFetch + llm-stats both reported 55.1, but canonical PDF page 4 shows 53.9. Updated source_url to PDF.

**35 backfill triples loaded** (only NEW model+bench pairs not already in DB):

| Model | New triples | Notes |
|---|---:|---|
| `google/gemini-3-flash` | **12** | Massive backfill — Gemini 3 Flash had only 2 of 14 benches. Blueprint-Bench 2 = 0.0% (complete failure); 3.5 Flash jumps to 33.6%. |
| `google/gemini-3.1-pro` | 5 | terminal_bench_2_1 70.3 (distinct from existing terminal_bench_2 v2.0 68.5), osworld_verified 76.2, finance_agent_v2 43.0, charxiv 83.3, blueprint 26.5 |
| `anthropic/claude-sonnet-4.6` | 6 | swe_bench_pro 53.0, finance v2 51.0, charxiv 70.5, mmmu_pro 74.5, blueprint 6.7, mrcr_128k 84.9 |
| `anthropic/claude-opus-4.7` | 5 | terminal_2_1 66.1, finance v2 51.5, charxiv 82.1, blueprint 24.5, mrcr_128k 59.3 (surprise weakness on long-context recall) |
| `openai/gpt-5.5` | **7** | terminal_2_1 78.2 (top), mcp_atlas 75.3, toolathlon 55.6, finance v2 51.8, charxiv 84.1, blueprint 36.2 (top), mrcr_128k 94.8 (top) |

**Skipped per strict-attribution preservation policy** (preserved existing primary-source scores):
- `gemini-3.1-pro/swe_bench_pro 48.4` (sakana.ai third-party eval) — PDF shows 54.2 (Google internal), both primary, keep first
- `gemini-3.1-pro/mcp_atlas 69.2` vs PDF 78.2 — different harness, preserve existing
- `claude-sonnet-4.6/hle 49.0` vs PDF 33.2 — different harness/full-set, preserve
- `claude-opus-4.7/mmmu_pro 80.6` vs PDF 75.2 — different version, preserve
- `gpt-5.5/gdpval_aa 84.9` (legacy accuracy-encoding) vs PDF 1773 (Elo) — metric encoding mismatch, defer to data quality cleanup
- `-` cells (Terminal-Bench 2.1 + Toolathlon for Sonnet 4.6 / Opus 4.7; Toolathlon for Gemini 3.1 Pro): not evaluated, no data
- `Not supported` cells (MRCR v2 1M for Sonnet 4.6 / Opus 4.7 / GPT-5.5): vendor limitation

**Gemini Omni Flash PDF** (5 pages) — confirmed NO benchmark scores. Verbatim from page 2: "We will share Gemini Omni Flash's evaluations for the following capabilities – T2VA, I2VA, R2VA, video editing, and image generation – when we roll out to developers and enterprise customers via APIs." Additional model details extracted (training on TPUs / JAX + ML Pathways, pre-training synthetic captioning mitigations, SynthID post-training watermarking, restricted speech-conversion capability) — all qualitative, no new scores.

**Headline insights uncovered**:
- GPT-5.5 tops 4 of 14 PDF benches (Terminal-Bench 2.1, GDPval-AA, Blueprint-Bench 2, MRCR v2 128k 94.8 ← strongest long-context model in panel) + ARC-AGI-2 85.0
- Claude Opus 4.7 surprisingly weak on long-context: MRCR 128k only 59.3 vs panel average ~80. Likely reasoning-tuning trade-off.
- Gemini 3 Flash is a baseline 0.0% on Blueprint-Bench 2 (agentic spatial reasoning) — entire new benchmark family for 3 Flash to fail at
- Sonnet 4.6 ties Gemini 3.1 Pro on MRCR 128k at exactly 84.9 (rounded — suspicious coincidence, may indicate different harnesses converging)

**Files patched**:
- `resource/zzz_2026_05_20_gemini_3_5_flash_pdf_backfill_scores.json` (new, 35 scores)
- SQL UPDATE on gemini-3.5-flash/swe_bench_pro
- No code/UI changes needed (data-only ingest visible via existing model modals + frontier comparison views)

## 2026-05-20 (Session 19 cont'd): TextArena + arena.ai vision/text + Qwen 3.7 Max/Plus preview

### 57. TextArena + arena.ai Vision/Text leaderboard ingest + 2 new Alibaba Qwen 3.7 models

User-provided 5 reference links investigated (Playwright + subagent verification):
- `https://www.textarena.ai/` (Next.js SPA + Supabase RPC backend)
- `https://x.com/arena/status/2056400044862111757` (X/Twitter — 402 paywall, SKIPPED)
- `https://atalupadhyay.wordpress.com/2026/05/19/qwen-3-7-deep-dive-honest-review-hands-on-testing-and-when-to-use-max-vs-plus/` (qualitative-only, SKIPPED per strict-attribution)
- `https://arxiv.org/abs/2504.11442` (TextArena paper, Guertler et al CFAR @ A*STAR)
- `https://arena.ai/leaderboard/vision` (Sierra Arena vision leaderboard — initially flagged as possibly hallucinated WebFetch, but **verified GENUINE** via Playwright DOM read)

**Verification note**: `dola-seed-2.0-pro` on arena.ai is real — Bytedance has a Dola Seed product line distinct from Doubao (confirmed via `seed.bytedance.com/en/blog/dola-seed-2-0-preview-model-release-on-arena`). Aliased to existing DB id `bytedance/seed-2.0-pro` (same upstream model, different vendor naming on Arena).

**2 new models added**:

| Model | Vendor | Released | Note |
|---|---|---|---|
| `alibaba/qwen3.7-max-preview` | Alibaba | 2026-05-14 | Flagship preview on arena.ai text leaderboard. Thinking mode required. 1475 Elo. Preview-only — no weights/API yet. |
| `alibaba/qwen3.7-plus-preview` | Alibaba | 2026-05-14 | Mid-tier preview on arena.ai vision leaderboard. 1260 Elo. |

**2 new benchmarks registered**:
- `textarena_trueskill_balanced` — TextArena TrueSkill (Balanced Subset). Open-source competitive text-game benchmark (~100 envs in v0.6.9: chess/diplomacy/secret mafia/negotiation/codenames/etc). Tests dynamic social skills.
- `arena_ai_text_elo` — arena.ai Text Elo (distinct from existing `lmarena` for lmarena.ai/LMSYS).

**28 scores ingested** across 3 benchmarks:

| Benchmark | Scores | Source date |
|---|---:|---|
| `textarena_trueskill_balanced` | 10 (frontier-relevant models from Balanced Subset top 21) | 2026-05-20 |
| `arena_vision_elo` | 17 (top frontier from May 17 snapshot — refreshed from 7 → 19 total DB coverage) | 2026-05-17 |
| `arena_ai_text_elo` | 1 (qwen3.7-max-preview 1475) | 2026-05-19 |

**Top arena_vision_elo May 17 2026 snapshot** (870706 votes / 126 models):
- Claude Opus 4.7 Thinking 1306 / Opus 4.7 1304 / Opus 4.6 Thinking 1300 / Muse Spark 1296 / Opus 4.6 1293 / Gemini 3 Pro 1289 / GPT-5.5 1288
- **Qwen 3.7 Plus Preview debut**: 1260 (Alibaba's first entry on Vision Arena)
- **Bytedance Seed 2.0 Pro (Dola)**: 1259 (Bytedance Dola line)

**Top textarena_trueskill_balanced** (Balanced Subset):
- Claude 3.5 Sonnet 30.61 / Llama-4-Maverick 28.46 / Qwen2.5-VL-72B 28.44 / Nova Pro 27.84 / Gemini 2.0 Flash Lite 27.72 / Mistral Ministral 8B 27.68 / Claude 3.5 Haiku 27.59

Skipped per strict-attribution:
- TextArena scores for `qwen-maxa(deletethe-a)` (deliberately scrambled admin marker)
- TextArena scores for very old models (Llama 3.1, Gemma 3, DeepSeek R1 Distill — 2-year-old SKUs per user memory rule)
- Variant model rows (`gpt-5.2-chat-latest-20260210`, `gemini-3-flash thinking-minimal`) — variant subscript naming on Arena, not canonical SKUs
- All Qwen 3.7 wordpress blog content (qualitative-only review)

**Files patched**:
- `resource/zzz_2026_05_20_arena_textarena_scores.json` (new, +2 models / +2 benches / +28 scores)
- `dashboard/js/app.js` Resources tab +6 entries (TextArena live + paper + GitHub + Qwen blog + arena.ai vision + arena.ai text)
- `dashboard/js/frontier-compare.js` FRONTIER_MODELS +2 Qwen 3.7 entries
- `dashboard/js/sovereign.js` China REGIONS +2 Qwen 3.7 + RELEASE_DATE + PARAMS maps
- Cache-bust `app.js v=20260520b, frontier-compare.js v=20260520b, sovereign.js v=20260520b`

## 2026-05-20 (Session 19): Gemini 3.5 Flash + Omni Flash launch ingest

### 56. Google DeepMind Gemini 3.5 Flash + Omni Flash (May 19 2026)

User-provided 4 reference links investigated and ingested:
- `https://deepmind.google/models/model-cards/gemini-3-5-flash/`
- `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/`
- `https://deepmind.google/models/model-cards/gemini-omni-flash/`
- `https://llm-stats.com/blog/research/gemini-3.5-flash-launch`

**Two new models added** (commit pending):

| Model | Type | Modalities | Released | Note |
|---|---|---|---|---|
| `google/gemini-3.5-flash` | proprietary | text/image/audio/video/code/agentic | 2026-05-19 | Default model in Gemini app + AI Mode in Search + Antigravity. 1M context, 64K output. Pricing $1.50/$9.00/$0.15 cached. 4× faster, <half the cost of competing frontier models. |
| `google/gemini-omni-flash` | proprietary | text/image/audio/video | 2026-05-19 | Multimodal video+audio generation FM. Outputs high-res video with audio. T2VA/I2VA/R2VA + video editing + image gen. Distributed via Gemini App / YouTube / Google Flow. **No benchmark scores published yet** ("will share when rolled out via APIs"). |

**Gemini 3.5 Pro** mentioned as "rolling out next month" but **NOT YET RELEASED** — skipped per STRICT-ATTRIBUTION.

**14 Gemini 3.5 Flash scores** (deepmind.google model card, cross-confirmed by llm-stats.com):

| Benchmark | Gemini 3.5 Flash | vs Gemini 3.1 Pro |
|---|---:|---|
| Terminal-Bench 2.1 (NEW bench) | 76.2% | +5.9 |
| SWE-Bench Pro (Public) | 55.1% | +0.9 |
| MCP Atlas | 83.6% | +5.4 |
| Toolathlon | 56.5% | +7.1 |
| OSWorld-Verified | 78.4% | +2.2 |
| Finance Agent v2 (NEW bench) | 57.9% | **+14.9** ← biggest delta |
| GDPval-AA Elo | 1656 | +342 |
| CharXiv (no tools) | 84.2% | +0.9 |
| MMMU-Pro | 83.6% | +3.1 |
| Blueprint-Bench 2 (NEW bench) | 33.6% | +7.1 |
| MRCR v2 128k | 77.3% | **-7.6** ← long-context regression |
| MRCR v2 1M | 26.6% | +0.3 (tied) |
| HLE (text + multimodal) | 40.2% | **-4.2** ← reasoning regression |
| ARC-AGI-2 | 72.1% | **-5.0** ← abstract reasoning regression |

**3 new benchmarks registered**:
- `terminal_bench_2_1` (Terminal-Bench 2.1, revised task set vs v2.0; v2.0 Gemini 3.1 Pro 68.5 vs v2.1 70.3 confirms split difference)
- `finance_agent_v2` (Finance Agent Benchmark v2)
- `blueprint_bench_2` (Blueprint-Bench 2 image-to-floor-plan reasoning)

**Profile**: Flash variant trades **long-context recall + abstract reasoning depth** for **speed + cost**. Wins on every agentic/coding/multimodal bench except 4 reasoning/long-context outliers. Largest improvements on agentic workflows (Finance Agent v2 +14.9, Toolathlon +7.1, MCP Atlas +5.4).

**Files patched**:
- `resource/zzz_2026_05_20_gemini_3_5_flash_scores.json` (new, +2 models / +3 benches / +14 scores)
- `resource/Gemini-3-5-Flash-Model-Card.pdf` (downloaded, 557KB)
- `resource/Gemini-Omni-Flash-Model-Card.pdf` (downloaded, 178KB)
- `dashboard/js/app.js` Resources tab +4 URLs (2 model cards + Google blog + llm-stats blog) + 2 PDF entries
- `dashboard/js/frontier-compare.js` FRONTIER_MODELS +`google/gemini-3.5-flash`
- `dashboard/js/cyber-coding.js` FRONTIER_MODELS +`google/gemini-3.5-flash`
- `dashboard/js/sovereign.js` RELEASE_DATE_OVERRIDES + PARAMS maps +2 models
- `config/seed_sources.yaml` +2 paper_pdf entries
- Cache-bust `app.js v=20260520a, frontier-compare.js v=20260520a, cyber-coding.js v=20260520a, sovereign.js v=20260520a`

## 2026-05-19 (Session 18): ExploitBench live + sovereign delta + 7-menu hardcoded-list refresh

### 52. ExploitBench live leaderboard delta + sovereign-AI delta (commit `7be38b0`)

User-provided links: `https://arxiv.org/abs/2605.14153` (already mined as ExploitBench Sept 2026) + `https://exploitbench.ai` (live leaderboard).

**Live leaderboard adds 3 new dimensions** vs paper version:
1. **AutoNudge scaffold variants** (improved coaching prompts) for every model
2. **GPT-5.5 Codex CLI scaffold** as separate row from bare GPT-5.5
3. **Aggregate mean-score-per-(model, scaffold) across 41 V8 bugs** (0-16 scale, T1/ACE=16)

**Ingest**: +1 model (`openai/gpt-5.5-codex`) / +2 benchmarks (`exploitbench_mean_score`, `exploitbench_pct`) / +8 scores.

**Live leaderboard top 6**:

| Rank | Model | Scaffold | Mean | % of max |
|---:|---|---|---:|---:|
| 1 | Mythos Preview | AutoNudge | **9.90** | **68.9%** |
| 2 | Mythos Preview | bare | 9.55 | 67.5% |
| 3 | GPT-5.5 | Codex+AutoNudge | 5.51 | 40.9% |
| 4 | GPT-5.5 | AutoNudge | 4.44 | 34.5% |
| 5 | GPT-5.5 | Codex (bare) | 3.76 | 32.6% |
| 6 | Claude Opus 4.7 | AutoNudge | 3.66 | 26.5% |

**Notable**: GPT-5.5 + Codex CLI scaffold grew T3 reach from 13→20 bugs at ~1/5 per-episode cost vs bare arm. Scaffolding dominates capability gain.

**Sovereign-AI delta sweep (2026-05-13 → 2026-05-19)**: **0 new sovereign SKUs** from any of 13 countries. Window was quiet — frontier cadence clustered just before window; widely held for Google I/O 2026 (May 19-20). Audit-trail: `resource/sovereign_delta_2026_05_19.md`.

### 55. ExploitBench surfaced in Cyber & Coding menu (commit `ef81976`)

User follow-up: "ExploitBench에 대한 사항은 Cyber & Coding 메뉴에서도 보이게 해주세요." Section 52 had ingested ExploitBench scores into the DB and the Agent menu already exposed `exploitbench_ace`, but the **Cyber & Coding multi-table leaderboard** (the natural home for offensive-security benches) was still missing all 5 ExploitBench dimensions — they appeared only in the modal score-history when drilling into a model. The fix surfaces them as first-class columns in both relevant suite tables.

**`cyber-coding.js` patch** (1 file, 2 arrays):

| Suite | Additions |
|---|---|
| `PERF_SUITES.cyber-attack` | **+18 bench IDs**: ExploitBench 5 (ace / t3 / t4 / mean_score / pct) + PACEbench 5 (overall + a/b/c/d_cve) + NYU CTF Bench 5 (top + crypto / pwn / web / reverse) + AISI 2 (last_ones_100m_avg, cooling_tower_100m_avg) + AutoAdversary 2 (s1_autonomous_pct, s1_expert_pct) |
| `PERF_SUITES.cyber-defense` | **+3 bench IDs**: Simbian Cyber Defense Coverage + CyberTeam RM-avg (blue-team) + CTI-REALM 50 (detection-rule generation) |

The legacy `CYBER_BENCHMARKS` filter-chip array was already updated in Session 18's deep audit pass; this commit completes the menu-surface symmetry by also wiring the same IDs into the suite-based table view. Cache-bust `cyber-coding.js` `20260519a → 20260519b`.

**Outcome**: Cyber & Coding tab now shows ExploitBench scores side-by-side with Cybench / CVE-Bench / CyberGym in the Cyber-Attack suite table — drilling into any frontier model surfaces the 41 V8 N-day ladder leaderboard directly.

### 54. Deep menu audit pass 2 — Agent / AI4S / Physical AI hardcoded lists (commit `9ce27df`)

User re-prompted: same menu audit, but this time with **deeper inspection** beyond just FRONTIER_MODELS arrays. Found 7 additional hardcoded structures that needed refresh:

| File | Hardcoded list | Before → After | Additions |
|---|---|---|---|
| `agent.js` | `COMPARE_BENCHMARKS` | 9 → 22 | +13 agent benches: prdbench, mcpmark, tau3_bench, delegate_52, exploitbench_ace, simbian_cyber_defense_coverage, cyberteam_rm_avg, corebench_hard, tau_bench_airline, assistantbench, mcjudgebench_cjar, agentick, complexmcp |
| `agent-charts.js` | `_HEATMAP_BENCHMARKS` | 12 → 21 | Same 9 most-important agent benches for heatmap |
| `ai4s-charts.js` | `_BENCHMARK_DOMAIN_MAP` | 43 → 65 | All 14 SDE family + 5 SciFM Section 44 (posebusters_v2, bhrf1_binder, tdc_66_vs_*, esmgfp_sequence_identity, oc20_s2ef_*) + weatherbench_2_ifs_targets |
| `ai4s-charts.js` | `_BREAKTHROUGHS` hero cards | 8 → 13 | AlphaProteo, TxGemma 27B, ESM-3 ESMGFP, SDE-hard (GPT-5-Pro 22.4%), AI Co-Mathematician |
| `physical-ai.js` | `CATEGORIES.world-models` | +10 | SANA-WM + refiner, V-JEPA 2 + 2.1, World Labs Marble, Wayve GAIA-2, LingBot-World, Matrix-Game 3.0, HY-WorldPlay, Infinite-World |
| `physical-ai.js` | `BENCHMARK_SUITES.world-model` | 16 → 32 | VBench 9 IDs + SANA-WM 1-min 7 IDs + PAI-Bench Cosmos Predict 2.5 |
| `physical-ai.js` | `BENCHMARK_SUITES.embodied-reasoning` | +7 | Meta Physical Reasoning (intphys2, mvpbench, causalvqa) + V-JEPA 2 video (ss_v2_top1, epic_kitchens_recall5, perception_test, tempcompass) |

**Menus confirmed clean (no patch needed)**:
- **Medical AI**: classification is keyword-based via `_SPECIALTIES` array — auto-matches new med models without per-category lists
- **Sovereign AI / Frontier Compare / Cyber & Coding**: already patched in commit `c94699b`

**Cache-bust**: `agent.js / agent-charts.js / ai4s-charts.js / physical-ai.js` all → `20260519b`.

### 53. 7-menu hardcoded-list refresh (commit `c94699b`)

User-prompted audit: "Frontier Compare / Cyber & Coding / Sovereign AI / Medical AI / Physical AI / AI4S / Agent menus에 추가하고 반영해야 할 업데이트 사항".

**Audit findings**:
- **Frontier Compare** + **Cyber & Coding** had stale hardcoded `FRONTIER_MODELS` arrays missing 24+ recent flagship additions
- **Sovereign AI** REGIONS map missing `baidu/ernie-5.1` in China region
- **Medical AI / Physical AI / AI4S / Agent**: data-driven (no hardcoded model lists) — auto-include from `data/export/models.json` and `benchmarks.json`, no patch needed

**Patches**:

(1) `frontier-compare.js` FRONTIER_MODELS: **83 → 107 models** (+24)
   - World Foundation Models: SANA-WM + refiner, V-JEPA 2 + 2.1, World Labs Marble, Wayve GAIA-2, MolmoAct 2
   - Science FMs: Evo 2 (Arc), AlphaProteo (DeepMind), TxGemma 27B
   - Cyber agents: Microsoft MDASH, xAI Grok Build, GPT-5.5 Codex
   - Frontiers: Baidu ERNIE 5.1
   - Sovereign: Swiss-AI Apertus 70B/Instruct, Cohere Command A/Reasoning, PFN PLaMo 2.1, NTT tsuzumi 2, OpenGPT-X Teuken, Mistral Medium 3.5 EAGLE

(2) `cyber-coding.js` FRONTIER_MODELS: **47 → 53 models** (+6)
   - 5-vendor agentic coding CLI race: Grok Build, GPT-5.5 Codex (joining Claude Code / Codex CLI / Gemini CLI / Qwen Code)
   - Microsoft MDASH (CyberGym SOTA 88.45)
   - Baidu ERNIE 5.1
   - Claude Sonnet 4.5
   - GPT-5.5 Cyber

(3) `sovereign.js` China region: +1 entry (`baidu/ernie-5.1`)

**Cache-bust**: `frontier-compare.js v=20260512c → 20260519a`, `cyber-coding.js v=20260510c → 20260519a`, `sovereign.js v=20260513b → 20260519a`

**Medical AI / Physical AI / AI4S / Agent menus require no patch** — all 4 read directly from `data/export/models.json` and benchmark JSON, so they automatically pick up the 200+ models added since Session 14. No hardcoded model lists in any of these 4 files.

### Session 18 cumulative deltas (running)

| Metric | Before Session 18 | After | Δ |
|---|---:|---:|---:|
| Models | 1460 | **1461** | **+1** |
| Benchmarks | 1064 | **1066** | **+2** |
| Scores | 5670 | **5678** | **+8** |

---

## 2026-05-18 (Session 17): NVIDIA SANA-WM + xAI Grok Build CLI + 14-paper cyber megabatch

### 51. 10-paper cyber arxiv batch — PACEbench + CTI-REALM + AISI + CyberTeam + Auto Adversary (commit `3bf5585`)

User provided 10 arxiv links (all cyber-themed). Dispatched 3 parallel mining subagents covering ~640 potential triples. Strategic ingest of **5 highest-value benchmark families**; 5 papers deferred (2 position papers, plus Kimi K2.5 safety eval 86p needing dedicated pass).

**Ingest deltas**:
- Models: 1460 → 1460 (all referenced IDs map to existing canonical)
- Benchmarks: 1054 → **1064** (+10 new IDs)
- Scores: 5624 → **5670** (+46 new)

**5 papers INGESTED**:

| Paper | Bench introduced | Top finding |
|---|---|---|
| **PACEbench** (arxiv 2602.14457, Shanghai AI Lab v1.5) | `pacebench_a/b/c/d_cve` + `_overall` | **Claude Sonnet 4.5 thinking 0.335 overall** leader. GPT-5.2 #2 at 0.280. Surprise: MiniMax M2.1 ties top WAF bypass (D-CVE 0.333). Grok 4 near-zero (0.012). |
| **CTI-REALM** (arxiv 2603.13517) | `cti_realm_50` | Anthropic sweeps top 3 detection-rule gen: **Opus 4.6 High 0.6373** / Opus 4.5 0.6244 / Sonnet 4.5 0.5872. GPT-5 Med 0.572 best OpenAI. |
| **Autonomous Adversary** (arxiv 2605.06486, NRC Canada) | `autoadversary_s1_autonomous_pct/_expert_pct` | All 3 frontier hit 100% with expert plan but drop sharply autonomous: **Sonnet 4.5 80% > Opus 4.5 25% > GPT-5.1 20%**. Scaffolding dominates raw capability. |
| **UK AISI multi-step** (arxiv 2603.11214) | `aisi_last_ones_100m_avg` + `aisi_cooling_tower_100m_avg` | 'The Last Ones' 32-step corp exfil: Opus 4.6 **15.6/32 avg** (+42% over Opus 4.5's 11.0). 'Cooling Tower' 7-step ICS: only **1.4/7 (20%)** — frontier ICS capability still floored. |
| **CyberTeam** (arxiv 2509.23571) | `cyberteam_rm_avg` | Blue-team Response & Mitigation: **GPT-o4-mini 91.5/100 best**; Gemini 2.5 Pro 88.6; Llama 3.1 405B 86.9. |

**5 papers DEFERRED** (5 of 10):
- arxiv 2602.02595 "Hack-to-Defend" — position paper, 0 attribution
- arxiv 2509.11398 "AI Red-Teaming evolution" — position paper, 0 triples
- arxiv 2604.03121 "Kimi K2.5 Independent Safety Eval" — 86p, 250+ triples; needs dedicated ingest with bench-id reconciliation. ABC-Bench / VCT-multiselect / EVMBench / DFIR-Metric / Petri 2.0 / ControlArena / WMDP-sandbagging / BBQ / AgentHarm
- arxiv 2510.14113 "CyberPal-2.0 IBM SLM" — small SLM tier (cyberpal-2.0-4b/8b/14b/20b), thin frontier signal
- arxiv 2510.24317 "CAIBench" meta-benchmark — mostly aggregates over existing benches; new rctf2/cyberpii_bench only 1-3 frontier entries

**Notable cross-cutting patterns**:

1. **Scaffolding dominates raw capability on hard cyber tasks.** Autonomous Adversary: all 3 frontiers hit 100% with expert plan, but autonomous mode drops to 20-80% — same model, same task, 5× scaffolding gap.

2. **Frontier ICS (industrial control) is STILL the wall.** Opus 4.6 only 1.4/7 (20%) on Cooling Tower power-plant attack chain. Best frontier model cannot yet execute multi-step physical-process attacks.

3. **Anthropic dominates cyber detection generation.** Claude Opus 4.6 / 4.5 / Sonnet 4.5 sweep CTI-REALM top 3 (0.63/0.62/0.59). GPT-5 Med best OpenAI at 0.572.

4. **Grok 4 cyber-offense outlier weakness.** PACEbench overall 0.012 (10th of 10). Same pattern as earlier GBA Eval finding — long-horizon agentic eval reveals differential model strength not visible on standard Q&A.

5. **Sonnet > Opus on autonomous adversary** (80% vs 25%). Mid-tier MoE model beats top reasoning model when scaffold is removed. Recurrent pattern of Sonnet > Opus on agentic-execution benches.

**Loader FK gotcha caught**: `bytedance/doubao-seed-1.6` → `doubao-1.5-pro`; `minimax/m2.1` → `minimax-2.1`. Papers commonly use non-canonical model names; map to existing canonical or register variant.

9 new Resources entries (5 ingested + 4 deferred-tagged). Cache-bust `app.js v=20260518c → 20260518d`. 10 PDFs archived (614KB-10.5MB each). 3 audit-trail markdowns at `resource/mine_cyber_batch_*.md` (969 lines total).

### Session 17 cumulative deltas (final)

| Metric | Before Session 17 | After | Δ |
|---|---:|---:|---:|
| Models | 1453 | **1460** | **+7** |
| Benchmarks | 1038 | **1064** | **+26** |
| Scores | 5543 | **5670** | **+127** |

---

## 2026-05-18 (Session 17): NVIDIA SANA-WM + xAI Grok Build CLI + user refs (4 arxiv: Simbian Cyber Defense + NYU CTF + HarmfulSkillBench + WAM survey)

### 50. User refs (4 arxiv) — Cyber Defense + NYU CTF + HarmfulSkillBench (commit `3866e44`)

User provided 4 arxiv links. Dispatched 4 parallel mining subagents.

**Ingest deltas**:
- Models: 1460 → 1460 (all referenced IDs already in DB)
- Benchmarks: 1045 → **1054** (+9 new IDs)
- Scores: 5586 → **5624** (+38 new)

**Per-paper yields**:

| Paper | What it is | Top finding |
|---|---|---|
| arxiv 2604.19533 | **Simbian Cyber Defense Benchmark** — agentic threat-hunting via raw Windows event logs + 50-query budget | Claude Opus 4.6 **0.55 Coverage** (clears 7/13 ATT&CK tactics); NO model crosses ≥50% per-tactic bar |
| arxiv 2604.17159 | **NYU CTF Bench systematic** (SUNY Albany) — 10 LLMs × 200 CSAW challenges via D-CIPHER + Kali | Claude Opus 4.5 **59.0%** ($2.12/solve); Gemini 3 Pro 52.0% ($0.43/solve, 6× cheaper); Gemini 3 Flash 27.0% (cost-efficiency $0.05/solve) |
| arxiv 2604.15415 | **HarmfulSkillBench** (CISPA) — first harmful-skill agent registry eval | **GPT-5.4-mini safest** (Score_B 0.23, 100% Tier-1 refusal); GPT-4o + DeepSeek V3.2 least safe (Score_A 0.85, 0.88); skill-reading exploit raises harm 0.27 → 0.76 |
| arxiv 2605.12090 | **World Action Models survey** (Fudan) — 69-page taxonomy of ~150 WAM methods | **SKIPPED** — survey, 0 extractable triples |

**Notable cross-cutting patterns**:

1. **Cyber defense vs offense generation split**: Claude Opus 4.6 LEADS cyber defense (Simbian 0.55) but trails Claude Opus 4.5 on cyber offense (NYU CTF: 4.6 = 56% vs 4.5 = 59%). Different generation strengths on attacker vs defender roles.

2. **NYU CTF cost-efficiency tiering**:
   - Gemini 3 Flash $0.05/solve (27.0%) — cheapest competent
   - Gemini 3 Pro $0.43/solve (52.0%) — best value (12pp ahead at 6× cheaper)
   - Claude Opus 4.5 $2.12/solve (59.0%) — best accuracy but priciest

3. **Skill-reading is a novel attack vector**: HarmfulSkillBench exposes a *passive exposure* exploit where reading (not invoking) a harmful skill raises harm score from 0.27 (no skill) to 0.76 (Cond A). GPT-4o + DeepSeek V3.2 fail safety checks under this pattern.

4. **GPT-5.4-mini > GPT-4o safety generational jump**: Score_A 0.52 vs 0.85 (+63pp safer under passive exposure). Major safety improvement in the GPT-5 series.

**Tooling note**: This batch caught a loader-file-glob bug — `*_scores*.json` pattern requires `_scores` in filename. Initial commit name lacked it; renamed to `zzz_2026_05_18_user_refs_4papers_scores.json` and re-ran loader to land the data. See feedback memory candidate.

4 new Resources entries. Cache-bust `app.js v=20260518b → 20260518c`. 4 PDFs archived (1.3-2.2 MB each). 4 audit-trail markdowns at `resource/mine_arxiv_*.md` (787 lines total).

### Session 17 cumulative deltas (final)

| Metric | Before Session 17 | After | Δ |
|---|---:|---:|---:|
| Models | 1453 | **1460** | **+7** |
| Benchmarks | 1038 | **1054** | **+16** |
| Scores | 5543 | **5624** | **+81** |

---

## 2026-05-18 (Session 17): NVIDIA SANA-WM + xAI Grok Build CLI

### 49. xAI Grok Build CLI launch (commit `c028e94`)

User-provided link: `https://x.ai/news/grok-build-cli`. Direct curl blocked by Cloudflare (403); data cross-confirmed via 6+ news outlets and AA / llm-stats / OpenRouter pages for the underlying model.

**Grok Build** = xAI's agentic coding CLI (rival to Anthropic Claude Code, OpenAI Codex CLI, Google Gemini CLI, Alibaba Qwen Code). Launched **2026-05-14**. Powered by `grok-code-fast-1` (already in DB).

**Ingest deltas**:
- Models: 1459 → **1460** (+1: `xai/grok-build`)
- Benchmarks: 1045 → 1045 (0 new)
- Scores: 5585 → **5586** (+1: grok-code-fast-1 SWE-bench Verified backfill)

**Key product details**:
- Up to **8 concurrent sub-agents** on parallel branches
- Plan-mode approval gating before file writes
- Beta access via SuperGrok Heavy ($299/mo) or SuperHeavy intro tier ($99/mo, 67% discount first 6 months)

**Score backfill** (grok-code-fast-1 was in DB but missing SWE-bench Verified):
- **70.8% SWE-bench Verified** via xAI internal harness
- Just below Claude Sonnet 4.6 (72.7%)
- Well behind Claude Opus 4.7 (87.6%) and Claude Mythos Preview (93.9%)
- Strategy positioning: **speed** (~92 tok/sec) **+ price** ($0.20/$1.50 per M tokens — orders of magnitude cheaper than frontier coding models)

**Competitive landscape update** — agentic coding CLI race now has **5+ vendor entries**:
- Anthropic Claude Code
- OpenAI Codex CLI
- Google Gemini CLI
- Alibaba Qwen Code
- **xAI Grok Build (NEW)**
- Plus multi-agent OneManCompany framework (84.67% PRDBench)

xAI pricing is the cheapest in the tier; trade-off is 16-23pp accuracy gap vs Claude Opus 4.7 / Mythos Preview on SWE-bench Verified.

1 new Resources entry. Cache-bust `app.js v=20260518a → 20260518b`.

### Session 17 cumulative deltas (final)

| Metric | Before Session 17 | After | Δ |
|---|---:|---:|---:|
| Models | 1453 | **1460** | **+7** |
| Benchmarks | 1038 | **1045** | **+7** |
| Scores | 5543 | **5586** | **+43** |

---

## 2026-05-18 (Session 17): NVIDIA SANA-WM — efficient minute-scale world model + 1-min benchmark

### 48. NVIDIA SANA-WM 1-minute world-model benchmark (commit `409226a`)

User-provided link: `nvlabs.github.io/Sana/WM/` (initially typo "nviabs", corrected to NVIDIA Labs). Paper: arxiv 2605.15178 (May 14 2026, 19.3 MB PDF).

NVIDIA SANA-WM: 2.6B open-source efficient minute-scale world model with hybrid Gated DeltaNet + softmax attention, dual-branch UCPE+Plucker camera control, native 60s 720p generation. Introduces NEW benchmark with 2 splits (Simple + Hard trajectories).

**Ingest deltas**:
- Models: 1453 → **1459** (+6 new world models)
- Benchmarks: 1038 → **1045** (+7 new IDs)
- Scores: 5543 → **5585** (+42 new)

**New models (6)**:
- `nvidia/sana-wm` (2.6B, 720p), `nvidia/sana-wm-refiner` (2.6B + 17B refiner)
- `lingbot/lingbot-world` (14B+14B large industrial baseline, ref [7])
- `tencent/hy-worldplay` (8B, 480p, distinct from existing `tencent/hy-world-2.0`)
- `skywork/matrix-game-3.0` (5B, 720p)
- `infinite-world/infinite-world` (1.3B small baseline, ref [8])

**Headline finding — SANA-WM+refiner ties LingBot-World on quality but wins on efficiency**:

| Metric | SANA-WM+refiner | LingBot-World | Advantage |
|---|---:|---:|---|
| VBench-Overall (Hard) | **81.89** | 81.89 | tie |
| PoseAcc-R (Hard) | **8.34°** | 18.99° | **2.3× better** camera control |
| Throughput | **22.0 vid/hr** | 0.6 vid/hr | **36× faster** |
| Peak memory | **74.7 GB** | 454.1 GB | **6× less** |

Open-source 2.6B+17B competitive with proprietary 14B+14B.

**HY-WorldPlay (Tencent) catastrophic temporal drift**:
- dIQ Simple = **23.59** (vs LingBot 0.04, SANA-WM 3.79). Image quality degrades 70.08 → 46.50 over 60s.
- dIQ Hard even worse: 25.88
- Tencent's HY-WorldPlay is much weaker than competitors on minute-scale generation. (Note: distinct from Tencent's HY-World 2.0 which is already in DB.)

**Throughput leaderboard reveals scale-vs-speed tradeoff**:

| Model | Params | vid/hr |
|---|---|---:|
| SANA-WM | 2.6B | **24.1** |
| SANA-WM+refiner | 2.6B+17B | 22.0 |
| Infinite-World | 1.3B | 5.9 |
| Matrix-Game 3.0 | 5B | 3.1 |
| HY-WorldPlay | 8B | 1.1 |
| LingBot-World | 14B+14B | 0.6 |

**Camera control = SANA-WM's strongest dimension**: dominates ALL splits + both metrics. PoseAcc-R Hard: SANA-WM+refiner 8.34° < SANA-WM 10.02° < Matrix-Game 18.79° < LingBot 18.99° < HY-WorldPlay 35.46° < Infinite-World 41.31°.

**Skipped** per STRICT-ATTRIBUTION:
- Tables 3-5, 9-10 (internal SANA-WM ablations only — Plucker/UCPE/PRoPE variants)
- "36× speedup" claim (derived from throughput ratios, not separate Table cell)
- RTX 5090 / NVFP4 34s claim (efficiency narrative, not a benchmark cell)

1 new Resources entry. Cache-bust `app.js v=20260517b → 20260518a`. PDF archived to `resource/arxiv_2605.15178.pdf` (19.3 MB) per system_card_pdf_storage rule.

---

## 2026-05-17 (Session 16): GBA Eval ingest + daily ref-link sweep (MDASH CyberGym SOTA + CurveBench + 5 new benches)

### 47. Daily ref-link sweep — Microsoft MDASH CyberGym SOTA + CurveBench (commit `dcfae29`)

User-prompted daily sweep covering 2026-05-15 → 2026-05-17 (~48 hours).

**Ingest deltas**:
- Models: 1452 → **1453** (+1: `microsoft/mdash`)
- Benchmarks: 1030 → **1038** (+8 new)
- Scores: 5537 → **5543** (+6 new)

**Headline finding — Microsoft MDASH new CyberGym SOTA**:
- 88.45% on CyberGym, **5pp ahead** of next entry (Claude Mythos Preview 83.1%)
- Multi-Model Agentic Scanning Harness orchestrating 100+ specialized AI agents
- System-level harness, not single-model SKU
- Source: Microsoft Security Blog, 2026-05-12

**Frontier vendor week QUIET**: Zero new model SKUs from OpenAI / Anthropic / Google / xAI / DeepSeek / Moonshot / Qwen / Zhipu / Mistral / Cohere / Apple / Microsoft / NVIDIA / TII / MBZUAI / Korean / Chinese in 48-hour window. AAII top-15 + arena.ai top-15 unchanged.

**False rumors filtered out** (failed STRICT-ATTRIBUTION):
- "Qwen3 Coder Next May 15 release" — actual launch 2026-02-04; May 15 = Bedrock availability
- "MiniMax M2.7 May 15" — actual launch 2026-03-18
- "Gemini Omni leak May 14" — no model card; Google I/O 2026 is May 19-20

**6 new benchmarks from May 13-14 arxiv** (PDF mining deferred for most):

| Bench | arxiv | What it tests |
|---|---|---|
| **CurveBench** | 2605.14068 | Jordan-curve topological reasoning, 756 images × 5 difficulty |
| **MemLens** | 2605.14906 | Multimodal Long-Term Memory, 789 Q × 32K-256K context |
| **MemEye** | 2605.15128 | Visual-centric agent memory eval, 8 life-scenario tasks |
| **ViMU** | 2605.14607 | Video Metaphorical Understanding (subtext) |
| **PROVE-Bench** | 2605.14534 | Perceptual RemOVal cohErence (visual media) |
| **SVC mobile EER** | 2605.14845 | Signature Verification Challenge — GPT-5.2 0.32% EER |

**Notable CurveBench finding**: Gemini 3.1 Pro 71.1% Easy → **19.1% Hard** = 52pp drop. Topological reasoning is a current capability cliff even for top frontier VLMs. Qwen3-VL-8B 2.8% baseline → 33.3% after CurveBench fine-tune (+30.5pp), showing the task is learnable but not zero-shot solvable.

**SKIPPED per strict-attribution**:
- SU-01 (arxiv 2605.13301, 30B-A3B math model) — no quantitative scores in abstract; defer
- TRAIL eval framework (arxiv 2605.14865) — methodology paper, not benchmark
- Most CyberGym scores (Opus 4.7 Adaptive, Sonnet 4.6, etc.) — already in DB; dedup avoided

6 new Resources entries. Cache-bust `app.js v=20260517a → 20260517b`. Audit trail: `resource/sweep_2026_05_17.md`.

### Session 16 cumulative deltas

| Metric | Before Session 16 | After | Δ |
|---|---:|---:|---:|
| Models | 1452 | **1453** | **+1** |
| Benchmarks | 1026 | **1038** | **+12** |
| Scores | 5511 | **5543** | **+32** |

---

## 2026-05-17 (Session 16): GBA Eval ingest — real-world coding agent benchmark

### 46. GBA Eval — Frontier coding agents writing a Game Boy Advance emulator from scratch (commit `9b628a6`)

User provided link: `http://gbaeval.com`. Discovered the underlying JSON API at `https://gbaeval.com/results/leaderboard.json` by inspecting the SPA's results module. 9 frontier AI coding agents asked to write a GBA emulator in WebAssembly from scratch; output graded against Mesen2 reference across 27 testcases × 3 sections (procedural 20% / replay 60% / audio 20%).

**Ingest deltas**:
- Models: 1452 → 1452 (0 new — all 9 IDs already in DB)
- Benchmarks: 1026 → **1030** (+4 GBA Eval IDs)
- Scores: 5511 → **5537** (+26 new)

**4 new benchmarks**: `gba_eval_overall` (composite), `gba_eval_procedural` (CPU/memory/timer/DMA correctness), `gba_eval_replay` (13 game walkthroughs incl. Celeste / Spout / Heartwrench / piuGBA / etc.), `gba_eval_audio` (tonc-snd1 + gameplay audio).

**Leaderboard (Overall)**:

| # | Model | Overall | Procedural | Replay | Audio |
|---:|---|---:|---:|---:|---:|
| 1 | **GPT-5.5** | **0.5322** | 0.2444 | **0.6093** | **0.5888** |
| 2 | Claude Sonnet 4.6 | 0.4876 | 0.4840 | 0.5941 | 0.1714 |
| 3 | Claude Opus 4.6 | 0.4412 | 0.4354 | 0.5853 | 0.0145 |
| 4 | Claude Opus 4.7 | 0.4381 | **0.5326** | 0.5196 | 0.0993 |
| 5 | GPT-5.4 | 0.3160 | 0.2931 | 0.5329 | 0.3655 |
| 6 | Kimi K2.6 (via Goose) | 0.0086 | 0 | 0.0144 | 0 |
| 7 | Gemini 3.1 Pro | 0.0085 | 0 | 0.0141 | 0 |
| 8= | GLM 5.1 (via Goose) | 0.0000 | 0 | 0 | 0 |
| 8= | MiniMax M2.7 (via Goose) | 0.0000 | 0 | 0 | 0 |

**Notable findings**:

1. **GPT-5.4 → 5.5 jump is +21pp** (0.316 → 0.532) — largest generational gap on this benchmark.

2. **Claude-vs-GPT sub-score asymmetry**:
   - Claude Opus 4.7 leads **procedural** (CPU/memory tests) at 53.26%
   - But GPT-5.5 leads both **replay** (60.93%) and **audio** (58.88%)
   - Claude better at "correct emulator instructions"; GPT better at "playable game output"

3. **Opus 4.6 → 4.7 mild regression** on overall (0.4412 → 0.4381). New model gains +9pp on procedural but loses on replay (-6.6pp). Sample of one but notable.

4. **Gemini 3.1 Pro shockingly weak at 0.0085** — bottom-tier alongside the Goose-wrapped open-source models. One of the rare benchmarks where Gemini 3.1 Pro doesn't compete. Likely because it's a long-horizon coding task (>300k tokens, multi-hour wall-clock) where Gemini's agentic loop underperforms.

1 new Resources entry. Cache-bust `app.js v=20260515d → 20260517a`.

---

## 2026-05-15 (Session 15): Daily ref-link sweep + user-provided refs (SDE + HAL + The Well) + Science FM / Universal FM / World FM coverage expansion

### 45. World Foundation Models — VBench + V-JEPA 2 + Cosmos Predict 2.5 (commit `cf1a93b`)

User-prompted: "World foundation model 들에 대해 조사하고 벤치마크 데이터셋과 평가 결과들이 있는지 조사해주세요". Most major WFMs already in DB from prior sessions (Cosmos, GR00T, Genie, π-zero, OpenVLA, MolmoAct 2, HY-World 2.0). This batch fills the **canonical evaluation benchmark side**.

**Ingest deltas**:

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1433 | **1452** | **+19** |
| Benchmarks | 1006 | **1026** | **+20** |
| Scores | 5452 | **5511** | **+59** |

**Benchmarks added** (20 across 4 families):

**VBench family (9 IDs)** — gold-standard video gen evaluation:
- `vbench_total` / `vbench_quality` / `vbench_semantic` (Vchitect HF leaderboard, 16 dimensions)
- `vbench2_total` + 5 category splits per arxiv 2503.21755: `vbench2_physics`, `vbench2_commonsense`, `vbench2_controllability`, `vbench2_human_fidelity`, `vbench2_creativity`

**Meta Physical Reasoning Leaderboard (3 IDs)**:
- `intphys2` (arxiv 2506.09849) — physical plausibility
- `mvpbench` (arxiv 2506.09987) — minimal video pairs
- `causalvqa` (arxiv 2506.09943) — counterfactual physical VQA

**V-JEPA video understanding (4 IDs)**:
- `ss_v2_top1`, `epic_kitchens_recall5`, `perception_test`, `tempcompass`

**NVIDIA Cosmos PAI-Bench (3 IDs)**:
- `pai_bench_text2world_post`, `pai_bench_image2world_overall`, `fvd_av_multiview`

Plus `assistantbench` (HAL-related fix).

**Models added (19)**:
- `meta/v-jepa-2` + `meta/v-jepa-2.1` — Yann LeCun's video WFM flagship
- `world-labs/marble` (Fei-Fei Li's first commercial product, Nov 2025)
- `wayve/gaia-2` (UK driving WFM)
- `vchitect/ipow` (VBench #1 at 88.26%)
- 11 video gen models for VBench coverage (Vidu Q1, Wan 2.1/2.2, JT-3.5, MiracleVision V5, Veo 3, original Sora, Open-Sora 2.0, LanDiff, HunyuanVideo, CogVideoX 1.5, Kling 1.6)
- 3 Cosmos lineage (Reason 1 7B, Predict 1 7B, Predict 2.5 14B)
- `meta/plm-8b`, `alibaba/qwen2.5-vl`

**Notable cross-cutting findings**:

1. **VBench leaderboard is Chinese-dominated** — top 8 entries (88.26% to 85.06%) are all Chinese (IPOW, Vidu Q1, JT-3.5, Wan 2.1, MiracleVision V5, etc.). Veo 3 at 85.06% (USA leader). Open-Sora 2.0 at 84.34% (top open-weights).

2. **Frontier LLMs still strong on physical reasoning despite specialist WFMs**:
   - Gemini 1.5 Pro **92.44% IntPhys 2** (best overall), 84.78% CausalVQA
   - NVIDIA Cosmos Reason 2 8B 58.14% IntPhys 2 — specialist closing gap at SLM scale
   - V-JEPA 2 (1.2B) competitive at 56.4 / 44.5 / 44.89 (much smaller than frontier)

3. **Cosmos Predict 2.5 14B**: 2.8× FVD improvement vs Predict 1 7B (23.06 vs 63.69) — major progress on physical world generation quality

4. **VBench-2.0 reveals frontier weakness areas**:
   - Veo 3 Controllability only **47.04%** (vs Human Fidelity 86.88%) — frontier struggles with precise control more than realism
   - Complex Plot universally hard: HunyuanVideo 10.11%, Sora dynamic attribute 8.06%

**Skipped per strict-attribution**:
- World Labs Marble (qualitative claims only, no numerics)
- Wayve GAIA-2 (paper has validation loss but no leaderboard table)
- Sora 2 Pro (no separate eval distinct from Sora 2 base)
- 1X Redwood (no primary benchmark)
- CALVIN / MetaWorld (no canonical leaderboard for current WFM policies)
- PhysReasonBench (conflated with Meta Physical Reasoning Leaderboard above)

**Live deploy**: 8 new Resources tab entries. Cache-bust `app.js v=20260515c → 20260515d`. Audit trail: `resource/research_wfm_2026_05_15.md` (248 lines).

### Session 15 cumulative deltas (final)

| Metric | Before Session 15 | After | Δ |
|---|---:|---:|---:|
| Models | 1386 | **1452** | **+66** |
| Benchmarks | 966 | **1026** | **+60** |
| Scores | 5261 | **5511** | **+250** |

---

## 2026-05-15 (Session 15): Daily ref-link sweep + user-provided refs (SDE + HAL + The Well) + Science FM / Universal FM coverage expansion

### 44. Science FM + Universal FM coverage expansion (commit `d3f429a`)

User-prompted: "Science Foundation model 및 Universal foundation model 들에 대해 조사하고 벤치마크 데이터셋과 평가 결과들이 있는지 조사해주세요". Dispatched 2 parallel research subagents covering 22 SciFM families + 17 UFM categories.

**Ingest deltas**:

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1391 | **1433** | **+42** |
| Benchmarks | 994 | **1006** | **+12** |
| Scores | 5408 | **5452** | **+44** |

**SCIENCE FM ADDITIONS** (drug discovery + materials + climate + bio + time series):

| Domain | Top FM | Headline |
|---|---|---|
| Protein-ligand docking | **AlphaFold 3** | PoseBusters v2 76% success (+50% rel. vs Vina/RFAA), Nature 2024 |
| Protein binder design | **AlphaProteo** | BHRF1 88% experimental success, 3-300× tighter affinity |
| Weather | **Aurora (MSFT)** | Beats IFS on 92% of WeatherBench-2 targets; 24% RMSE reduction at >12h; 5000× compute speedup |
| Drug discovery | **TxGemma 27B** | TDC 64/66 ≥ Tx-LLM, 50/66 ≥ specialist |
| Drug discovery (agentic) | **TxGemma Agentic-Tx** | +52.3% rel. over o3-mini on HLE chem/bio |
| Genomics | **Evo 2** (Arc Institute) | 7B+40B DNA-RNA-protein FM, Nature 2025 |
| Protein generation | **ESM-3** | ESMGFP novel design at 58% sequence similarity to natural |
| Materials | **EquiformerV3+DeNS-OAM** | MatBench Discovery 0.931 F1 / 0.018 eV/atom MAE |
| Time series | **Moirai 2.0 / TimesFM 2.5** | GIFT-Eval rank #1 |
| Catalyst | **EquiformerV2-153M** | OC20 S2EF force MAE 14.2 meV/Å |

**UNIVERSAL FM ADDITIONS** (image + video + voice + music):

| Category | Top model | Score |
|---|---|---:|
| 🖼️ AA T2I Arena | **OpenAI GPT Image 2** | **1336 Elo** #1 |
| 🖼️ AA T2I Arena | Google Nano Banana 2 (Gemini 3.1 Flash Image) | 1263 |
| 🖼️ AA T2I Arena | HiDream-O1 (open-weights leader) | 1187 |
| 🖼️ AA T2I Arena | BFL FLUX.2 dev | 1159 |
| 🎬 AA T2V Arena | **ByteDance Dreamina Seedance 2.0** | **1222 Elo** #1 |
| 🎬 AA T2V Arena | Alibaba HappyHorse 1.0 | 1214 |
| 🎬 AA T2V Arena | Veo 3.1 | 1102 |
| 🎬 AA T2V Arena | Sora 2 December | 1087 |
| 🎬 AA T2V Arena | LTX-2.3 Fast (top open-weights) | 979 |
| 🎤 Big Bench Audio | xAI Grok Voice Think Fast 1.0 | 97.1% |
| 🎤 Big Bench Audio | xAI Grok Voice Agent | 92.3% |
| 🎵 Suno music Elo | Suno V5 | 1293 |

**Cross-cutting findings**:

1. **Specialist-vs-Generalist asymmetry confirmed across SciFM**: AlphaFold 3 / Aurora / MatterGen / Evo dominate all in-domain metrics; frontier LLMs (GPT-5/Claude/Gemini) compete only on text-reasoning chem/bio benches. TDC ADMET had a 2026 reproducibility scandal (only 3/22 top models reproducible per bioRxiv 2026.02.26.708193) — register but be conservative.

2. **Image gen frontier dominated by API-only**: GPT Image 2 + Nano Banana 2 lead open-weights by ~120 Elo (HiDream-O1 best open at 1187 vs GPT Image 2 1336).

3. **Video gen has Chinese dominance**: Top 2 (Dreamina Seedance + HappyHorse) at >1200 Elo are Chinese. Veo 3.1 and Sora 2 sub-1110. Open-weights LTX-2.3 ~250 Elo behind frontier.

4. **Time-series FMs converging at similar level**: Moirai 2.0, TimesFM 2.5, Chronos-2 all claim GIFT-Eval rank #1 with relative-only margins. Hard to register absolute scores without HF Space scraping.

**Skipped** (no clean absolute scores):
- TabPFN-3 (relative-only +200/+420 Elo deltas)
- GIFT-Eval full leaderboard (rank-only metadata)
- VBench-2.0 sub-dimensions (HF Space iframe-rendered)
- DALL-E 4 (does not exist; OpenAI now uses GPT Image naming)
- MovieGen (Meta, not released)

**Live deploy**: 13 new Resources tab entries. Cache-bust `app.js v=20260515b → 20260515c`. Audit trail: `resource/research_scifm_2026_05_15.md` + `research_ufm_2026_05_15.md`.

### Session 15 cumulative deltas (final)

| Metric | Before Session 15 | After | Δ |
|---|---:|---:|---:|
| Models | 1386 | **1433** | **+47** |
| Benchmarks | 966 | **1006** | **+40** |
| Scores | 5261 | **5452** | **+191** |

---

## 2026-05-15 (Session 15): Daily ref-link sweep + user-provided refs (SDE + HAL + The Well)

### 43. User-provided refs — SDE + HAL + The Well evaluation (commit `0def876`)

User provided 4 specific links: arxiv 2512.15567 (SDE), arxiv 2510.11977 (HAL paper), hal.cs.princeton.edu (HAL live leaderboard), github.com/PolymathicAI/the_well. Dispatched 3 parallel subagents (SDE PDF mine, HAL PDF + live fetch, The Well GitHub research).

**Ingest deltas**:

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1388 | **1391** | **+3** |
| Benchmarks | 978 | **994** | **+16** |
| Scores | 5340 | **5408** | **+68** |

**SDE — Scientific Discovery Evaluation (arxiv 2512.15567)**

Comprehensive AI-for-Science benchmark from Deep Principle + 35 academic groups (May 8 2026). 14 new benchmark IDs registered:
- `sde_avg` (43 scenarios × 1,125 questions composite)
- `sde_hard` (86 hardest)
- 4 domain splits: `sde_biology` (200q) / `sde_chemistry` (276q) / `sde_materials` (486q) / `sde_physics` (163q)
- 8 project tracks via sde-harness: `sde_protein_design`, `sde_gene_editing`, `sde_retrosynthesis`, `sde_molecule_optimization`, `sde_tmc_optimization`, `sde_crystal_design`, `sde_ising_model`, `sde_symbolic_regression`

**Top SDE findings**:
- **SDE-avg**: GPT-5 **0.658** leads, Sonnet 4.5 0.637, o3 0.627, Grok-4 0.619, Opus 4.1 0.610
- **SDE-hard**: GPT-5-Pro **22.4%** is ONLY frontier ≥20% — others all ≤12%
- **Project-level leadership rotates by task**:
  - DeepSeek R1 wins protein design (0.871) and Ising model (1.000 = ground truth)
  - Claude Sonnet 4.5 wins molecule optimization (0.756, gsk3β AUC 0.981 perfect)
  - GPT-5 wins crystal design (0.632, MatLLMSearch S.U.N. 55.31%)
- **Dissociation from GPQA/MMMU/AIME**: GPT-5 scores 0.86/0.84/0.94 on those but only 0.658 on SDE → SDE is distinct, non-saturated frontier eval

**HAL — Holistic Agent Leaderboard (arxiv 2510.11977 + hal.cs.princeton.edu)**

Princeton PLI (Kapoor + Stroebl + Narayanan et al., Oct 2025, ICLR 2026). HAL is a **meta-aggregator/harness**, not a new composite benchmark. Wraps 9 existing benches (Online Mind2Web, AssistantBench, GAIA, CORE-Bench Hard, ScienceAgentBench, SciCode, SWE-bench Verified Mini, USACO, TAU-bench Airline) with Azure VM orchestration + cost Pareto frontiers + Docent log analysis.

Registered 2 new bench IDs not yet in DB: `corebench_hard` (HAL is the OFFICIAL leaderboard) + `tau_bench_airline` (original Yao 2024, distinct from tau2/tau3).

**Top HAL live scores (2026-05-15)**:
- **Claude Opus 4.5** 77.78% CORE-Bench Hard #1 (Sonnet 4.5 62.22%, Gemini 3 Pro Preview 40.00%)
- **Sonnet 4.5** 74.55% GAIA #1
- **GPT-5 Medium** 69.71% USACO best
- **SciCode is a wall**: all frontier <10% (o4-mini = o3 = 9.23%, Opus 4.1 7.69%)
- **Key insight from paper**: higher reasoning effort REDUCES accuracy in 21/36 model-bench combos (counterintuitive)

**The Well (Polymathic AI dataset) — REJECTED from frontier SOTA dashboard**

Polymathic AI Simons Foundation flagship — 15TB across 16 physics-simulation datasets. Primarily a TRAINING dataset for physics-ML foundation models (FNO/CNO/U-Net/MPP/Stable-Sci). Only 4 physics-surrogate baselines evaluated (paper authors explicitly note "should not be considered state-of-the-art"). Zero frontier LLM scores. Out of scope for the frontier benchmark dashboard.

**3 new models registered**: `openai/gpt-5-chat-latest`, `openai/gpt-5-medium`, `anthropic/claude-opus-4.1-high`.

**Live deploy**: 3 new Resources tab entries. Cache-bust `app.js v=20260515a → 20260515b`. 2 arxiv PDFs archived (12-17MB, 63-66 pages each) per system_card_pdf_storage rule.

Audit trail: `resource/mine_arxiv_2512_15567.md`, `mine_arxiv_2510_11977_hal.md`, `research_the_well_polymathic.md`.

---

## 2026-05-15 (Session 15): Daily ref-link sweep — May 11-13 arxiv PDF mine, 5 new benchmark papers

User-prompted daily sweep. Initial scout found frontier vendor week was quiet (zero new SKUs Mon-Wed from OpenAI/Anthropic/Google/xAI/etc.) but identified 14 new arxiv benchmark papers from May 11-13. Dispatched 2 parallel mining subagents on the 5 highest-yield papers; the all-14-at-once approach hit a 32MB request-size guardrail and was split into focused batches.

### 42. Arxiv PDF mine — May 11-13 benchmark papers (commit `6d02663`)

**Ingest deltas** (verified from `data/export/`):

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1386 | **1388** | **+2** (thinking-mode variants) |
| Benchmarks | 966 | **978** | **+12** |
| Scores | 5261 | **5340** | **+79** |

**5 papers ingested with headline findings**:

| Paper | Bench(s) | Top finding |
|---|---|---|
| **ExploitBench** (CMU, arxiv 2605.14153) | `exploitbench_ace` / `_t3` / `_t4` | **Mythos Preview ACE = 18/41 bugs (43.9%)**. ALL 8 public frontiers score 0/41 ACE bare-arm; GPT-5.5 Codex CLI raises to 1/41. First bench surfacing Mythos's quiet dominance |
| **RealICU** (TUM+LMU+Oxford+Sheffield+Imperial, arxiv 2605.13542) | `realicu_gold` + `_scale` | GPT-5.4 **0.510** Acute Problems Hit@5; paper declares "remains unsolved" (Oracle F1=0.987). Long-context ICU is a current capability cliff |
| **GeoBuildBench** (PKU, arxiv 2605.13167) | `geobuildbench` | GPT-5.1 **78.9%** Success Rate, Gemini-3-Flash 75.3% (close pair); Qwen3-VL-235B 42.2%, Llama-3.2-90B-Vision 21.3% |
| **KnotBench** (NYU+USC, arxiv 2605.09900) | `knotbench` | Claude Opus 4.7+thinking **54.60%** > GPT-5+thinking 52.25% > Claude 51.65% > GPT-5 43.00%. GPT-5 thinking uplift +9.25pt is **3× larger** than Claude's +2.95pt |
| **DRAT/creativity family** (UIUC, arxiv 2605.13450) | `drat` / `dat` / `cdat` / `rat_30` / `pace_creativity` | GPT-5.4-**nano** leads DRAT at 69.11 (beats gpt-5.4 51.99); Qwen3-235B 68.43 close 2nd. RAT-30 tied #1: GPT-5-mini = GPT-4.1 = Mistral-Large-2407 at 97/30. Bigger isn't always better for creativity |

**2 new models registered**:
- `anthropic/claude-opus-4.7-thinking` — separate row for thinking-mode evaluations
- `openai/gpt-5-thinking` — same pattern; large KnotBench delta from non-thinking

**Cross-cutting observations**:
- **Mythos Preview's exploit ceiling matters**: This is the first benchmark where Anthropic's private Mythos Preview shows a 18× advantage over all public frontiers on a cybersec capability — and the only public model that reaches even 1 ACE bug is GPT-5.5 with the Codex CLI harness.
- **Thinking-mode asymmetry**: GPT-5's thinking-mode uplift (+9.25pt on KnotBench) is 3× larger than Claude Opus 4.7's (+2.95pt) — suggesting different RL strategies dominate at different points.
- **Creativity inverse-scaling**: GPT-5.4-nano > GPT-5.4 on DRAT (69.11 vs 51.99), GPT-5-mini = GPT-4.1 on RAT-30. Specialist creativity tests reward smaller models with less "anchored" generation.

**Quiet on vendors**: Zero new frontier model SKUs from OpenAI, Anthropic, Google, xAI, DeepSeek, Moonshot, Qwen, Zhipu, Mistral, Cohere, Apple, Microsoft Phi, NVIDIA, LG, SKT, KT, Sber, Yandex, TII, MBZUAI in the 36-hour window. Only product/distribution announcements: OpenAI Codex on mobile, Anthropic × Gates Foundation $200M partnership, Anthropic "Claude for Small Business" — none model-level. Google I/O 2026 scheduled May 19-20.

**Skipped per strict-attribution**: VectraYX-Nano (42M Spanish cybersec LM, paper has internal evals only — no frontier comparison); 7 May-11 papers (SciVQR, AgentRx, GraphInstruct, TeleResilienceBench, gwBenchmarks, CommonWhy, ATD-Trans) deferred to next pass; Epoch ECI CSV grew claim was incorrect (172 → still 172, subagent misread).

**Live deploy**: 5 new Resources tab entries. Cache-bust `app.js v=20260514b → 20260515a`. 4 audit-trail markdowns (`sweep_2026_05_15.md` + `mine_2026_05_15_batch_a.md` + `_batch_b.md`). 5 arxiv PDFs archived per system_card_pdf_storage rule.

---

## 2026-05-14 (Session 14): Recent arxiv sweep + deepfake / media forensics benchmark family (first DB coverage)

### 41. Deepfake / AIGC detection benchmarks (commit `767061a`)

User-prompted: "BMT.json 내용을 기반으로 deepfake 관련 벤치마크 데이터셋에 대한 평가 결과들을 조사해서 업데이트". Investigation revealed `BMT/BMT-mapping.json` (331 benchmarks) had **zero** deepfake / media-forensics entries, and DB had zero too — this batch establishes the entire category.

Dispatched research subagent to map the major deepfake / AIGC detection benchmark families with strict-attribution rule.

**Ingest deltas**:

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1351 | **1386** | **+35** |
| Benchmarks | 950 | **966** | **+16** |
| Scores | 5206 | **5261** | **+55** |

**12 benchmark families covered** (16 IDs incl. metric-split variants):

| Sub-domain | Benchmark | Year | Top SOTA |
|---|---|---|---|
| Video | **FaceForensics++** (FF++) | 2019 (ICCV) | DirichletEnsemble **97.3%** accuracy (5-way) |
| Video | **DFDC** | 2020 (Meta) | Seferbekov #1: log-loss 0.428, AP 65.18% |
| Video | **Celeb-DF v2** | 2020 (CVPR) | SPSL **0.7650** AUC cross-dataset |
| Video | **DF40** (40 manipulation methods) | 2024 (NeurIPS) | CLIP-Large **0.746** AUC (non-face AIGC) |
| Video | **DeepfakeBench** umbrella | 2023 (NeurIPS) | UCF **0.9705** AUC (FF++ within-domain) |
| Video | **Deepfake-Eval-2024** in-the-wild | 2025 | GenConViT **0.63** AUC (45-50% drop vs academic) |
| Audio-Video | **AV-Deepfake1M** | 2024 (ACM MM Best Paper) | Pindrop Labs **77.94** AP@0.5 (Challenge winner) |
| Audio | **ASVspoof 5** | 2024 | T45 open: **min-DCF 0.075, EER 2.59%** |
| Audio | Deepfake-Eval-2024 audio | 2025 | P3 0.58 AUC (open-source best) |
| Image (AIGC) | **GenImage** (8 generators) | 2023 (NeurIPS) | Swin-T **74.8%** avg |
| Image (AIGC) | **DIRE / DiffusionForensics** | 2023 (ICCV) | DIRE **99.9% ACC** (near-saturated) |
| Image (AIGC) | Deepfake-Eval-2024 image | 2025 | UFD 0.56 AUC (open-source best) |
| VLM zero-shot | **VLM-Deepfake** (frontier evaluation) | 2025 | GPT-4o **0.77** faceswap / **0.67** synthetic |

**Frontier VLM evaluation** (arxiv 2506.10474, only primary source with explicit VLM × bench × score triples):

| VLM | Faceswap+Reenactment | Synthetic (GAN+Diffusion) |
|---|---:|---:|
| OpenAI GPT-4o | **0.77** | **0.67** |
| Anthropic Claude Sonnet 4 | 0.30 | 0.60 |
| Google Gemini 2.5 Flash | 0.10 | 0.27 |
| xAI Grok 3 | 0.00 | 0.27 |

Paper title says it all: *"LLMs Are Not Yet Ready for Deepfake Image Detection"*. Specialist CNN/Transformer detectors (UCF, DIRE, CLIP-Large) dominate frontier VLMs by wide margins.

**Cross-dataset generalization remains the hard problem**:
- Within-domain FF++ AUC ~0.96-0.97 → Celeb-DF v2 drops to ~0.73-0.77 (cross-dataset eval, train FF++ c23 → test Celeb-DF v2)
- Deepfake-Eval-2024 (2024 in-the-wild data): 45-50% AUC drop vs academic benchmarks
- Commercial detectors in Deepfake-Eval-2024 (anonymized per contract): video 0.79 / audio 0.93 / image 0.90 — still better than open-source SOTA

**35 detection-specialist models registered** under various vendor namespaces (sclbd/, gen-image/, ustc/, df40/, av-deepfake1m/, asvspoof/, tum-vc/). Plus 4 existing frontier VLMs (gpt-4o, claude-sonnet-4, gemini-2.5-flash, grok-3) scored on VLM benchmarks.

**Skipped per strict-attribution**: WildDeepfake (no maintained leaderboard), DF-Platter, DF-TIMIT, WaveFake, ADD 2023, AIGCDetectBenchmark, Sentry, WildFake, DeepfakeArt, Mirage. DeeperForensics-1.0 superseded by DeepfakeBench's cross-dataset eval.

**Live deploy**: 11 new Resources tab entries, cache-bust `app.js v=20260514a → 20260514b`.

Audit trail: `resource/research_deepfake_benchmarks_2026_05_14.md`.

### Session 14 cumulative deltas (final, verified from `data/export/`)

| Metric | Before Session 14 | After | Δ |
|---|---:|---:|---:|
| Models | 1339 | **1386** | **+47** |
| Benchmarks | 935 | **966** | **+31** |
| Scores | 5102 | **5261** | **+159** |

---

### Session 14 — also (Recent arxiv sweep — 11 new benchmarks + frontier safety/coding/agent SOTAs)

User-prompted: "참조 링크들을 조사해 새로운 모델, 벤치마크 데이터셋, 평가 결과로 추가할 내용이 있는지 확인하고 업데이트". Dispatched 3 parallel subagents:

1. **Major leaderboards** (LMArena / AA / LiveBench / Vellum / Onyx / Terminal-Bench / SWE-Bench / Epoch ECI) → 0 new entries this week; AA / Epoch / LiveBench all quiet since 2026-05-07.
2. **Vendor announcements** (OpenAI / Anthropic / Google / Meta / DeepSeek / Moonshot / Qwen / 18 others) → 3 new releases: Baidu ERNIE 5.1, AI2 MolmoAct 2, OpenAI Realtime trio (already in DB).
3. **Recent arxiv** (2026-05-04 to 2026-05-14) → **12 new benchmark papers** with explicit leaderboard tables, ~200 verifiable triples.

### 40. Arxiv sweep batch (commit `9047176`)

**11 new benchmarks ingested** (15 IDs incl. sub-metric variants):

| Bench | arxiv | What it measures | Top finding |
|---|---|---|---|
| **TableVista** | 2605.05955 | Multimodal table reasoning, 30K samples × 10 visual variants × 29 models | GPT-5.4 **72.1%** leads; long tail to LLaVA-1.5-7B 5.7% |
| **XL-SafetyBench** | 2605.05662 | 10-country cross-cultural safety (ASR + CSR) | Claude Sonnet 4.5 **2.8% ASR** safest, Mistral-Large-3 98.8% least safe |
| **GR-Ben** | 2605.01203 | Process-reward + science/logic reasoning, 22 models | Gemini-3-Flash **60.5%** F1 best frontier |
| **TableVista** subdomain richness | — | 10 scenarios × 29 models | up to 290 sub-triples available |
| **SWE-Atlas** | 2605.08366 | Coding agent beyond issue resolution (3 SWE workflows) | GPT-5.4 Codex **43.49%** vs Claude Opus 4.7 41.89% |
| **ComplexMCP** | 2605.10787 | MCP agent eval, 300+ tools × 7 stateful sandboxes | Gemini-3-Flash **55.31%** SR (best LLM); Human 93.61% |
| **MCJudgeBench** | 2605.03858 | Multi-constraint judge eval (CJAR + Macro-F1) | Gemini 3.1 Pro **0.858** CJAR; Claude Sonnet 4.6 0.637 Macro-F1 |
| **VURB** | 2605.07872 | Video understanding reward, 2,100 video pairs | GPT-5.2 **62.9%** pairwise; VideoDRM 63.8% pointwise |
| **Agentick** | 2605.06869 | Sequential decision-making agent, 37 tasks × 90k episodes | GPT-5 mini **0.309 ONS** (barely beats PPO 2M 0.287) |
| **ProgramBench** | 2605.03546 | Full-program rebuild from scratch | ALL frontier **0% Resolved**; Claude Opus 4.7 leads "Almost" 3.0% |
| **TriBench-Ko** | 2605.03792 | Korean judicial-workflow risk, 4 tasks × 8 risk types × 13 models | GPT-5.4 **0.835 F1**; KT Mi:dm 2.0-base 0.728 (best Korean sovereign) |
| **FinSafetyBench** | 2605.00706 | Bilingual EN/ZH financial safety red-team | Frontier GPT-5.1 **35.27% ASR** vs DeepSeek V3.2 89.45% (Financial-Crimes) |

**+12 new models registered**:
- `baidu/ernie-5.1` (May 9 2026 — ~1/3 params of 5.0, ~6% cost; AIME26 99.6% w/ tools)
- `allenai/molmoact-2` (May 5 2026 — bimanual robot FM, 0.51 real-world manipulation avg)
- `alibaba/qwen3-vl-{8b,30b-a3b}`, `qwen3.5-{9b,35b-a3b}`
- `allenai/molmo2-8b`
- `shanghai-ai-lab/internvl-3.5-{8b,14b,30b-a3b}`
- `openbmb/minicpm-v-4.5`
- `skt/ax-3.1-light` (Korean sovereign)
- `duxiaoman/xuanyuan-13b` (Chinese financial-domain)
- `videoresearch/videogrm`, `videodrm`

**Ingest deltas** (verified from `data/export/`):

| Metric | Before | After | Δ |
|---|---:|---:|---:|
| Models | 1339 | **1351** | **+12** |
| Benchmarks | 935 | **950** | **+15** |
| Scores | 5102 | **5206** | **+104** |

**Notable cross-cutting findings**:
- **Frontier safety asymmetry**: Claude family dramatically safer than other frontiers on XL-SafetyBench cross-cultural (Sonnet 4.5 = 2.8% ASR vs Mistral Large 3 = 98.8%, 35× gap).
- **Coding agent ceiling**: SWE-Atlas reveals GPT-5.4 Codex (43.49%) and Claude Opus 4.7 (41.89%) within 2pp on a 3-workflow eval, but ProgramBench (full rebuild) is a wall — every frontier scores 0% Resolved.
- **MCP tool-use frontier**: ComplexMCP shows surprising Gemini-3-Flash 55.31% > Gemini-3-Pro 44.67% on success rate; Human still 38pp ahead at 93.61%.
- **Korean sovereign coverage**: TriBench-Ko provides first Korean judicial F1 leaderboard with KT/EXAONE/kanana/A.X all scored.

**Skipped** (under strict-attribution): AssayBench (abstract only), MedMosaic (partial), ProCodeBench (partial), plus 18 method-only papers with no per-model leaderboard tables.

**Live deploy**: cache-bust `app.js v=20260513b → 20260514a`. 13 new Resources tab entries.

3 audit-trail sweep markdowns in `resource/sweep_*_2026_05_14.md`.

---

## 2026-05-13 (Session 13): Post-closeout ingest sweep + Medical AI timeline widget + CI test drift fix + PDF deep mining + sovereign AI 13-country sweep

Session 12 final sync (commit `9058ab5`) declared closeout, but a string of user-prompted ref-link investigations + a major Medical AI widget request + a pre-existing CI red flag + a follow-up PDF deep-mining pass added 11 commits across 2026-05-12 evening → 2026-05-13 morning. Captured here for completeness.

### 38. PDF deep mining batch — 4 parallel subagents (commit `af22a15`)

User-prompted re-investigation of the same 6 ref links from Section 36, but this time with explicit instruction to **download PDFs and analyze deeply** (vs prior abstract-only pass). Downloaded the 3 missing arxiv PDFs (2604.22446 / 2604.18292 / 2604.25917, 9-13 MB each, 33-48 pages) and dispatched 4 parallel subagents to mine each paper for benchmark tables.

**Per-paper yields:**

| Paper | Prior pass | Deep mine | Delta |
|---|---:|---:|---:|
| OneManCompany (2604.22446) | 1 score | **13 scores** | +12 |
| AI Co-Mathematician (2605.06651) | 1 score | **5 scores** | +4 |
| Agent-World (2604.18292) | 0 scores (rejected as "abstract only") | **62 scores** | +62 |
| Recursive Multi-Agent (2604.25917) | 0 scores (rejected as "aggregate only") | **0 scores** (still rejected per §B.3 — framework paper, all rows attribute to systems not base LLMs) | 0 |

**Key extractions**:

- **OneManCompany Table 2 page 14** — full 13-model PRDBench leaderboard. New rows: Claude-4.5 69.19, GPT-5.2 62.49, CodeX 62.09, Claude Code 56.65, Qwen3-Coder 43.84, Qwen Code 39.91, DeepSeek-V3.2 40.11, GLM-4.7 38.39, Gemini-3-Pro 22.76, Kimi-K2 20.52, Minimax-M2 17.60, Gemini CLI 11.29 (OMC 84.67 already in DB).

- **AI Co-Mathematician** — Figure 5 page 13 internal-100-Q research-math leaderboard: AI Co-Math 87 / Gemini Deep Think 70 / Gemini 3.1 Pro 57. Plus FrontierMath Tier 4 paired baseline (Gemini 3.1 Pro 19 vs AI Co-Math 48). New benchmark: `deepmind_internal_research_math_100`.

- **Agent-World Tables 1 + 2 page 14-16** — 13-model × {MCP-Mark, BFCL-V4, τ²-Bench} score matrix incl. all sub-categories that existed in DB. τ²-Bench Avg leaders: Gemini-3-Pro 85.4 / Claude-Sonnet-4.5 84.7 / Seed-2.0 83.0 / GPT-5.2-High 80.2. New canonical IDs: `ruc-bytedance/agent-world-{8b,14b}` (own models), `alibaba/qwen3-{8b,14b,32b,235b-a22b}` (base comparators), `google/gemini-cli`, `alibaba/qwen-code`, `minimax/m2`. Plus inline body-text triples for SkillsBench/ARC-AGI-2/Claw-Eval on AW-8B/14B.

- **Recursive Multi-Agent Systems** — still rejected. Subagent confirmed: Tables 2/3/4/5/9 attribute to systems (RecursiveMAS / MoA / TextGrad / LoopLM), Tables 6/7/8 with single-LLM agent rows are explicitly fine-tuned with role-specific supervised targets via inner-loop RecursiveLink (§B.3) — they do not represent raw base-model capability. Zero frontier models tested.

**Non-PDF links** (AA speech-to-speech leaderboard + Epoch FrontierMath tiers-1-4 page): both JS-rendered without exposed CSV/JSON endpoints. AA speech-to-speech was already exhausted in Section 36 (12 scores). Epoch FrontierMath page itself notes "AI-assisted review flagged fatal errors in ~1/3 problems" → strict-attribution defer (data quality red flag from the source).

**Batch deltas (verified from data/export/)**:
- Models: 1279 → **1284** (+5 net new — paper used different naming so most mapped to existing IDs)
- Benchmarks: 924 → **925** (+1 net new: deepmind_internal_research_math_100)
- Scores: 4994 → **5059** (+65 net new of 78 inserted; 13 absorbed by INSERT OR REPLACE on existing rows)

**Artifacts archived**:
- 3 new PDFs in `resource/arxiv_*.pdf` (per system_card_pdf_storage rule)
- 4 audit-trail findings files in `resource/mine_*.md` for downstream review

**Cache-bust**: `app.js v=20260513a → 20260513b`. Resources tab descriptions for OneManCompany + Agent-World entries upgraded with leaderboard summaries.

### 32. DELEGATE-52 benchmark — Microsoft Research document corruption (commit `171c9d3`)

User-provided: arxiv `2604.15597` — "LLMs Corrupt Your Documents When You Delegate" (Philippe Laban, Tobias Schnabel, Jennifer Neville, MSR, Apr 17 2026).

**New benchmark `delegate_52`** (agent category, percent metric):
- 52 professional domains (coding, crystallography, music notation, etc.)
- RS@20 metric = % original document content preserved after 20 LLM editing interactions in delegated workflow
- Headline finding: frontier models average **~25% degradation**, only Python achieves "ready" status (≥98% preservation) across most models

**+1 model**: `openai/gpt-5-chat` (Chat variant separate from base gpt-5).
**+19 scores** (full Table 1 leaderboard):
- Top 5: Gemini 3.1 Pro **80.9** / Claude Opus 4.6 73.1 / GPT-5.4 71.5 / GPT-5.2 66.1 / Claude Sonnet 4.6 66.0
- Mid: Kimi K2.5 64.1, GPT-5.1 60.5, Grok 4 59.3, GPT-4.1 49.5, GPT-5 48.3, o3 48.2, o1 48.1, GPT-5 Chat 46.8, GPT-5 Mini 45.1
- Bottom: Gemini 3 Flash 35.8, Mistral Large 3 35.5, gpt-oss-120B 19.2, GPT-4o 14.7, GPT-5 Nano 10.0

PDF archived to `resource/` per system_card_pdf_storage rule.

### 33. Onyx Open LLM Leaderboard 2026 ingest (commit `493f892`)

User-provided: `onyx.app/open-llm-leaderboard` (Roshan Desai's Onyx AI maintainer page). 19 models × 10 benchmarks (MMLU, MMLU-Pro, GPQA Diamond, IFEval, LMArena Elo, SWE-bench Verified, HumanEval, LiveCodeBench, AIME 2025, MATH-500), scores sourced from official tech reports. Last updated 2026-03-24.

- **+1 model**: `stepfun/step3` (316B params)
- **+93 (model, benchmark) score pairs** — many duplicates rejected via INSERT OR REPLACE (already in DB from primary sources)

Score distribution by benchmark: lmarena 19 / livecodebench 14 / humaneval 10 / ifeval+mmlu 9 / mmlu_pro+aime_2025 8 / math_500 6 / swe_bench_verified+gpqa_diamond 5.

### 34. Medical AI Release Timeline month-column infographic (commits `b0925b7` → `0599cb2`)

User-prompted: "Medical AI 메뉴에 ... 타임라인 그래픽 ... timeline-infographic 스킬을 이용". Built vanilla-SVG month-column timeline per `timeline-infographic` skill rules.

**Initial implementation** (`b0925b7`):
- Mount: `#med-timeline-infographic-host` (below existing scatter timeline)
- Month buckets, 12-color palette (Jan blue → Dec cyan)
- Variable sub-column width (1–4 cols/month based on density)
- 4-corner card layout: vendor logo (TL) / MM.DD date (TR) / license pill (BL) / country name (BC) / flag tile (BR)
- Header pills + axis line + dotted connectors
- Footer attribution (author + source + generated date)
- 3 download handlers: PNG (2× scale via Canvas) / SVG (XMLSerializer) / CSV (RFC 4180)

**Tuning iterations**:
- `250637e`: extended window to 12 months + horizontal scroll for very wide timelines
- `54f1680`: 6mo window + 8 subcols + 220px cards
- `14a355c`: **user-flagged scope bug** — only 65/211 medical models rendered because code only read `release_date`; switched to `release_date || released_at` fallback (207 of 211 models now eligible)
- `0599cb2`: user requested "3개월, 6개월, 12개월만 선택 가능" — restricted window selector to 3/6/12 (from 12/24/36/60/all)

**Final state**: 207-model candidate pool, 3/6/12 month selector, all 4 corner anchors validated, no card truncation across density ranges.

### 35. 2026-05-13 ref-link sweep — broad SOTA gather (commit `a80d526`)

Strict-attribution ingest of 64 new (model, benchmark, score) tuples from primary publications between 2026-04-26 → 2026-05-13:

**Sources**:
- **Scale SWE-Bench Pro Public leaderboard** — new bench `swe_bench_pro_public`, 24 model scores incl. gpt-5.4-xhigh **59.10**, Muse Spark 55.0, Claude Opus 4.6 thinking 51.90 down to Codestral 24.05 1.51
- **Soohak research-math** (arxiv 2605.09063) — 19 scores across Mini/Challenge/Refusal subsets; GPT-OSS-120B hard-reasoning + 81920-ctx achieves **80.91 on Soohak-Mini**
- **WorldReasonBench** (arxiv 2605.10434) — 11 video-model overall ScorePR scores; Seedance2.0 39.8, Veo3.1-Fast 35.3
- **Anthropic Claude Opus 4.7 launch page** — CursorBench (70 vs 4.6=58), XBOW visual-acuity (98.5 vs 4.6=54.5), BigLaw Bench (Harvey, 90.9)
- **Vellum-compiled OpenAI GPT-5.5 launch numbers** — MRCR v2 (74.0 / 36.6 / 32.2) + GDPval pairs for GPT-5.5-Pro and Claude Opus 4.7

**+9 new benchmark IDs**: `swe_bench_pro_public`, `soohak_mini_avg3`, `soohak_challenge_avg3`, `soohak_refusal_avg3`, `worldreasonbench_overall`, `cursor_bench`, `xbow_visual_acuity`, `biglaw_bench_harvey`, `mrcr_v2`.
**+6 new model IDs** (text variants + select cycles).

### 36. Ref-link batch 2 — speech-to-speech + AI Co-Mathematician + OneManCompany (commit `6f81130`)

User-provided 6 URLs. Per strict-attribution rule: 3 yielded primary-source data, 3 rejected (abstract-only / aggregate-only / JS-rendered with explicit "fatal errors flagged in ~1/3 problems" note).

**Yields**:
1. **arxiv 2604.22446 (OneManCompany)** → `+1 model onemancompany/omc`, `+1 benchmark prdbench`, **84.67%** score
2. **artificialanalysis.ai/speech-to-speech** → `+4 audio models` (stepfun/step-audio-r1.1, xai/grok-voice-think-fast, google/gemini-3.1-flash-live, alibaba/qwen3.5-omni-plus-realtime), `+2 benchmarks` (full_duplex_bench, tau_voice), 9 scores across Big Bench Audio + Full Duplex Bench + τ-Voice
3. **arxiv 2605.06651 (AI Co-Mathematician, DeepMind)** → `+1 model deepmind/ai-co-mathematician`, **FrontierMath Tier 4 = 48%** — significant SOTA leap (vs prior <20% on this benchmark). Daniel Zheng et al.

**Rejected**:
4. arxiv 2604.18292 (Agent-World) — abstract only, no per-model scores
5. arxiv 2604.25917 (Recursive Multi-Agent Systems) — aggregate framework results only
6. epoch.ai/frontiermath/tiers-1-4 — JS-rendered table + page itself notes "AI-assisted review flagged fatal errors in ~1/3 problems" (data quality warning ⇒ defer)

**Highlights** post-ingest:
- `frontiermath_tier4` top 2: GPT-5.4 50% / **AI Co-Math 48%** (new #2)
- `big_bench_audio` top 3: Step-Audio R1.1 98 / Grok Voice 97 / GPT-Realtime-2 97
- `full_duplex_bench`: GPT-Realtime-2 95.3 / Grok Voice 77.8
- `tau_voice`: Grok Voice **52.1** / GPT-Realtime-2 39.8 / Gemini 3.1 Flash Live 37.7

AI Co-Mathematician paper PDF (851 KB) archived to `resource/AI_Co-Mathematician_arxiv_2605.06651.pdf` per system_card_pdf_storage rule. Resources tab: +6 entries.

### 37. CI red on stale safety-dict test (commit `deaa61d`)

**Pre-existing failure surfaced**: Dashboard Tests had been red since `0599cb2` due to test/schema drift in `tests/test_enrichment_export.py:58`.

`cyber/publisher/exporter.py:111-117` had been expanded with 2 new safety dimensions:
- `metr_autonomy_50pct` — METR autonomous task ladder 50% threshold
- `apollo_schemer_score` — Apollo Research scheming evaluation

…but the unit test assertion still expected the old 3-key shape `{aisi_cyber_tier, cbrn_risk, self_reported_safety_card}`.

**Fix**: updated test assertion to match exporter's actual 5-key schema. 237/237 tests now pass locally; Dashboard Tests green on next CI run.

**Note for ops hygiene**: this kind of test/schema drift was hidden because Dashboard Tests was the only CI gate that ran on Python schema changes, and the failure had been quietly accumulating across 5 commits before anyone noticed.

### Session 13 cumulative deltas (verified from `data/export/`)

| Metric | Session 12 close | Session 13 close | Delta |
|---|---:|---:|---:|
| Models | 1259 | **1279** | **+20** |
| Benchmarks | 902 | **924** | **+22** |
| Scores | 4672 | **4994** | **+322** |

**Top benchmark adds**: delegate_52, prdbench, full_duplex_bench, tau_voice, swe_bench_pro_public, soohak_mini/challenge/refusal_avg3, worldreasonbench_overall, cursor_bench, xbow_visual_acuity, biglaw_bench_harvey, mrcr_v2 (+13 of 22 net new benches captured here).

**Notable SOTA shifts**:
- FrontierMath Tier 4: AI Co-Mathematician **48%** (was prior <20% range) — new #2 behind GPT-5.4 50%
- SWE-Bench Pro Public: gpt-5.4-xhigh **59.10%** as new headline
- DELEGATE-52: Gemini 3.1 Pro 80.9 leads document-preservation
- τ-Voice: Grok Voice Think Fast **52.1** SOTA on voice-agent customer service

**Live deploy**: CI run for `6f81130` pushed; `deaa61d` test fix re-triggered CI clean. Cache-bust: `app.js v=20260513a`.

### 39. Sovereign AI 13-country sweep — 6 parallel subagents (commit `9dce957`)

User-prompted: "한국, 중국, 프랑스, 일본, 인도, 독일, UAE, 싱가폴, 스위스, 러시아, 미국, 캐나다, 호주 등에서 새롭게 발표된 소버린 AI 모델은 없는지 조사".

**6 parallel subagents** dispatched per region cluster: Japan / Switzerland / Canada+Australia / Germany / Korea+India+Singapore-recent / France+UAE+Russia-recent. Each produced an audit-trail markdown in `resource/research_*_2026.md` and a strict-attribution table of new findings.

**Total batch deltas (verified from data/export/)**:
- Models: 1284 → **1339** (+55 net new — many candidates absorbed into existing IDs)
- Benchmarks: 925 → **935** (+10 net new)
- Scores: 5059 → **5102** (+43 net new)

**Key regional additions**:

| Region | Headline | Highlights |
|---|---|---|
| 🇨🇭 Switzerland | **Apertus 8B/70B** (ETH+EPFL+CSCS) | 4 models + 12 scores; Apache 2.0; 1,811 languages incl. Swiss German + Romansh; arxiv 2509.14233 |
| 🇨🇦 Canada | **NEW `ca` region** | Cohere Labs (Toronto): Command A / A Vision / A Reasoning / R7B Arabic / Cohere Transcribe (Apache 2.0) / Aya 23 35B / Aya Vision 8B / Tiny Aya Base. Previously misfiled under us-open. |
| 🇦🇺 Australia | **NEW `au` region** | Maincoder 1B (Melbourne, Apache 2.0); Isaacus Open Australian Legal LLM 1.5B; EmuBERT. First Australian entries. |
| 🇩🇪 Germany | **OpenGPT-X Teuken** | EU sovereign LLM (Fraunhofer + Jülich + TU Dresden + DFKI), 24 EU languages; Aleph Alpha TFree-HAT (byte-level, tokenizer-free); FLUX.2 dev (32B); Ellamind Propella; Occiglot 7B EU5 |
| 🇯🇵 Japan | **20 models added (3 → 23)** | PFN PLaMo (100B + 2 Prime + 2.1 + 2-8B, GENIAC Phase 1); NTT tsuzumi 1/2; NEC cotomi Pro/Light; Fujitsu Takane (Cohere partnership); Rakuten AI 3.0 (700B MoE, DeepSeek-V3 arch); ELYZA Llama-3-JP; Karakuri 8x7B; Stockmark 2 100B; NII LLM-JP 3 172B; Tokyo Tech Swallow; SB Intuitions Sarashina2; CyberAgent calm3; ABEJA |
| 🇦🇪 UAE | **Falcon-H1R 7B + K2 Think V2** | Falcon-H1R reasoning: AIME24 88.1 / MATH500 97.4 / LiveCodeBench v6 68.6 SOTA-class. K2 Think V2 (MBZUAI + G42 + Cerebras): 73B fully-open Apache-2.0 reasoning, OMNI-Math-HARD 60.73 / GPQA-D 71.08. Falcon Perception 0.6B VLM. |
| 🇰🇷 Korea | **EXAONE 4.5 scores** | +3 benchmark scores: AIME 2026 92.6, AIME 2025 92.9, LiveCodeBench v6 81.4 (LG AI Research vision-language flagship) |
| 🇮🇳 India | **BharatGen Param2-17B-Thinking** | +8 benchmark scores incl. Indic-specific Sanskriti 66.5, MMLU Hindi 59.2. Plus Shrutam-2 ASR for 12 Indic languages. |
| 🇸🇬 Singapore | **SEA-LION ModernBERT/E5** | 3 encoder/embedding models (Mar-Apr 2026, MIT, 13 SEA languages) |
| 🇫🇷 France | **Mistral Medium 3.5 EAGLE + Leanstral** | Speculative-decoding head; open-source Lean 4 proof agent |
| 🇷🇺 Russia | **GigaChat 3 Ultra Preview + T-Pro 2.0 + Cotype Pro 2** | 702B MoE preview of 3.1 production; T-Bank hybrid-reasoning with EAGLE; MTS AI 128k-ctx business LLM |

**New benchmarks registered (+10)**: `xnli`, `xcopa`, `amo_bench`, `omni_math_hard`, `eu21_avg`, `japanese_mt_bench`, `llm_jp_eval`, `japanese_jaster`, `sanskriti`, `mmlu_hindi`.

**Dashboard wiring (sovereign.js REGIONS map)**:
- **NEW**: `ca` Canada (8 Cohere Labs models)
- **NEW**: `au` Australia (3 Maincode + Isaacus models)
- **EXPANDED**: jp (3 → 23), ch (3 → 7), de (11 → 19), ae (+H1R/Perception/K2 Think V2/K2-V2 Instruct), in (+2), sg (+3), ru (+4), fr (+2)
- Cache-bust `sovereign.js v=20260509c → 20260513a`

**Skipped per strict-attribution**:
- Krutrim 3 cancelled (Ola pivoted to cloud); Reliance JioBrain internal-only deploy
- Maincode Matilda (private beta, no HF artifact); Soket EKA Pro (roadmap only)
- Kakao Kanana 2.5 / SKT AX K2 / LG EXAONE 5 / Samsung Gauss 3 / Mistral Large 4 / YandexGPT 6 / GigaChat 4 / Vikhr 3 (no release)
- TELUS / Telstra / CSIRO sovereign LLMs (infrastructure announcements only)
- RBC Borealis ATOM, DeepJudge, Lakera (proprietary or non-LLM tooling)

**Artifacts**: 7 audit-trail research markdowns in `resource/research_*_2026.md`.

### Session 13 cumulative deltas (final, verified from `data/export/`)

| Metric | Session 12 close | Session 13 close | Δ |
|---|---:|---:|---:|
| Models | 1259 | **1339** | **+80** |
| Benchmarks | 902 | **935** | **+33** |
| Scores | 4672 | **5102** | **+430** |

---

## 2026-05-10 (Session 11): Reference-link investigation sweeps — 5 ingest rounds (21 models, 6 benchmarks, 38 scores, 15 Resources refs)

### 17. 5-round 참조 링크 조사 (commits `45c1035` → `25b3c55`)

User-provided reference links 13개 (3 batches: 5+3+3+2)를 조사하고 strict-attribution rule 하에 1차 source에서 확인 가능한 정량 데이터만 ingest. 매 round는 별도 JSON file + 별도 changelog entry로 분리해서 추적성 유지.

**Round 1 — Nemotron Elastic + OpenAI Voice + Luma UNI-1** (commit `45c1035`):
- 5 links: HF model card BF16/FP8/NVFP4 (×3) + Luma UNI-1 + OpenAI Voice announcement
- **+8 models**: nvidia/nemotron-labs-3-elastic-30b/23b/12b-a3b (3 sliced variants from Star Elastic ICML 2026 paper) + openai/gpt-realtime-1.5/2/translate/whisper (4 voice models May 2026 release) + luma/uni-1 (image FM, no scores)
- **+3 benchmarks**: livecodebench_v5, big_bench_audio, audio_multichallenge
- **+19 scores**: 3 elastic × 5 benchmarks (AIME/GPQA/LiveCodeBench v5/MMLU-Pro/IFBench) + gpt-realtime-2 + 1.5 × audio benchmarks (96.6/81.4 + 48.5/34.7)

**Round 2 — Epoch ECI + MolmoAct2 + saturation analysis** (commit `a0a4878`):
- 3 links: epoch.ai/eci + arxiv 2605.02881 (MolmoAct2) + Epoch substack RIP Classic Reasoning Benchmarks
- **+2 models**: allenai/molmoact2, allenai/molmoer (VLM backbone, metadata only — PDF >10MB)
- **+2 benchmarks**: epoch_capabilities_index, epoch_capabilities_index_swe (composite metric registered)
- **+2 scores**: ECI calibration anchors per primary source explicit definition (claude-3.5-sonnet=130, gpt-5=150)
- 검증: substack 인용 "Claude Mythos GraphWalks 80%" → DB의 graphwalks_bfs 80.0과 정확 일치

**Round 3 — Resources references** (commit `461c850`):
- **+11 references** to dashboard/js/app.js 통합 그룹 `// ── 2026-05-10 link-investigation additions ──`
- Epoch ECI ecosystem 5 (epoch.ai/eci, 2 substacks, LessWrong intro, Benchmarks alt URL)
- NVIDIA Nemotron Elastic 4 (BF16/FP8/NVFP4 HF cards + arxiv 2511.16664 Star Elastic ICML 2026)
- OpenAI Voice 1, Luma UNI-1 1, MolmoAct2 1
- Cache-bust app.js v=20260510a, deploy 검증 461c8505 SHA prefix

**Round 4 — Audio MultiChallenge + Big Bench Audio deep-dive** (commit `db64d5b`):
- Round 3에서 추가한 references를 deep-dive: Scale Labs Audio MultiChallenge leaderboard (labs.scale.com/leaderboard/audiomc, arxiv 2512.14865) 30 entries 채굴 + HF Big Bench Audio release blog
- **+9 models**: gemini-3.1-flash-live-preview, gemini-2.5-flash-native-audio-preview, gpt-4o-audio-preview, gpt-4o-mini-audio-preview, gpt-realtime-mini, qwen3-omni-30b-a3b-instruct (separate from existing thinking variant), mimo-audio-7b-instruct, kimi-audio-7b-instruct, lfm2-audio-1.5b
- **+17 scores**: 16 Audio MultiChallenge (gemini-3-pro-preview 54.65 rank #1 / gemini-2.5-pro 46.90 / gemini-2.5-flash 40.04 / 등) + 1 Big Bench Audio (gpt-4o = 92 text-only baseline)
- Skipped duplicates: gpt-realtime-2 48.45 = 48.5 in DB; gpt-realtime-1.5 34.73 = 34.7

**Round 5 — CaP-X + Genesis AI GENE-26.5** (commit `25b3c55`):
- 3 links: github.com/capgym/cap-x + arxiv 2603.22435 + genesis.ai/press
- **+2 models**: genesis-ai/gene-26.5 (robotic FM May 6 2026, Eric Schmidt + Xavier Niel 투자) + nvidia/cap-agent0 (training-free agentic framework, NVIDIA + Stanford + Berkeley + UT Austin, Fei-Fei Li / Linxi Jim Fan 저자)
- **+1 benchmark**: cap_bench (39 robot manipulation tasks × 8 tiers S1-S4 + M1-M4, Robosuite + LIBERO-PRO + BEHAVIOR-1K, 12 frontier models 평가)
- **+0 scores** (arxiv PDF >10MB / HTML 추출에서 Appendix B Full Benchmark Table 미포함, qualitative claims만 — strict-attribution defer)
- **+4 Resources references**: CaP-X project page + GitHub + paper + Genesis AI

**스코어카드 Total (5 rounds)**:
- 신규 모델: **+21** (1721 → 1742)
- 신규 benchmarks: **+6** (933 → 939)
- 신규 scores: **+38** (3785 → 3823)
- Resources references: **+15** (Audio + Robotics + Foundational AI sources)
- Audio MultiChallenge benchmark: 0 → 16 entries with full leaderboard top-N coverage
- Big Bench Audio: 0 → 3 entries

**파일 deltas**:
- 5 new ingest JSON files in `resource/zzz_2026_05_10_*.json`
- `dashboard/js/app.js`: +15 Resources entries (~25 LOC)
- `data/export/reports/changelog.json`: +5 detailed per-round entries

**병렬 작업 패턴**: Round별 sequential. 각 round = WebFetch/WebSearch 조사 + DB 매핑 확인 + JSON 작성 + loader 검증 + commit + push + CI deploy + live 검증. 매 round 평균 ~12-15분. CI race condition 1회 발생 (Round 3 deploy → 첫 trigger가 이전 commit 기준 → 재trigger로 해결).

**Strict-attribution rule 효과**:
- Total candidate ingest items: 약 60건 (5 rounds 합산)
- Actual ingest: 38 scores + 21 models + 6 benchmarks
- Reject 사유: PDF 크기 한계 (CaP-X / MolmoAct2), Elo-only / qualitative claims (Luma UNI-1 / Genesis AI), 모델 attribution 부재 (PostTrainBench 51.1%, IKEA assembly ~40%)

**Live deploy**: 매 round CI run completion + cache-bust 검증. 최종 cache-bust SHA prefix `25b3c55` (round 5 commit).

### 18. Round 6 — AILuminate v1.0 + Epoch ECI full leaderboard (172 → 109 ingested)

ECI 점수가 단 3개 (calibration anchors + GPT-5.5 Pro)뿐이라는 한계를 해결하기 위해 Epoch ECI deep-dive 진행.

**Round 6a — MLCommons AILuminate v1.0** (commit `167ff2d`):
- 1차 source: `https://ailuminate.mlcommons.org/benchmarks/` + arxiv 2503.05731
- **+7 model registrations**: amazon/nova-lite, google/gemini-2.0-flash-lite, nexusflow/athene-v2-chat, cohere/aya-expanse-8b, alibaba/qwen1.5-110b-chat, mistral/mistral-large-24.11, allenai/olmo-7b-0724-instruct
- **+1 benchmark**: ailuminate_v1 (12 hazard categories × 24,000 prompts/lang × 5-point overall grade)
- **+21 scores**: 20 AILuminate v1.0 grades (Claude 3.5 Haiku/Sonnet 4 / Mistral Large 2 / Gemma 2 9b / Phi 3.5 MoE / Phi 4 = Very Good 4/5; OLMo 7b = Poor 1/5) + GPT-5.5 Pro ECI = 159 (Manifold market resolution Apr 28 2026)

**Round 6b — Epoch ECI canonical CSV ingest** (this commit):
- 1차 source: `https://epoch.ai/data/eci_scores.csv` (172 rows full leaderboard, 17.9 KB)
- Methodology: arxiv 2512.00193 "A Rosetta Stone for AI Benchmarks" (Anson Ho et al, IRT-style stitching)
- 매핑 전략: CSV `Display name` → manual_map (90 entries) + normalized name lookup → 109 unique model_ids matched
- **+16 new model registrations**: openai/o3-pro, openai/gpt-5.4-nano, openai/gpt-4.1-mini/nano, openai/o1-mini/preview, openai/gpt-oss-120b, deepseek/deepseek-v3.2-exp/v3.1, xai/grok-4-fast/grok-3-mini, alibaba/qwen3-max/qwen2.5-max, google/gemini-2.0-flash-thinking/gemini-2.0-pro, mistral/mistral-large
- **+106 new ECI scores** (3 → 109 total): top 159.50 (GPT-5.5 Pro), bottom 93.31 (StarCoder2-7B). 95% bootstrap CI included in `_note`. Time-versioned variants (예: 'Gemini 2.5 Pro (Mar 2025)' vs '(Jun 2025)') deduped to highest-ECI per canonical model_id.
- **+3 Resources references**: arxiv 2512.00193 (Rosetta Stone paper), epoch.ai/data/eci_scores.csv (canonical CSV), github.com/epoch-research/eci-public (open repo)
- 매뉴 propagation 생략: 16개 신규 model_ids는 대부분 2024-2025 older variants → "latest models focus" 메모리 룰에 따라 Frontier Compare hardcoded 리스트에 추가하지 않음. ECI 테이블에서만 노출.

**Round 6 cumulative deltas**:
- 신규 모델: +23 (1742 → 1765)
- 신규 benchmarks: +1 (939 → 940)
- 신규 scores: +127 (3823 → 3950)
- Resources references: +3
- ECI table: 3 → 109 entries (36× 데이터 증대)

### 19. AI4S Phase 2B verification + Frontier Compare ECI heatmap (commits `4e13ec6` `80aa467`)

User-prompted: "Frontier Compare에 composite 카테고리 추가하고 109개 ECI 점수가 heatmap에서 직접 비교 가능하도록".

**Frontier Compare composite category** (commits `20ba001` `4e13ec6` `80aa467`):
- 기존 7개 hardcoded 카테고리(reasoning/coding/math/agent/cybersecurity/cyber_defense/multimodal)에 `composite` 추가 → epoch_capabilities_index + epoch_capabilities_index_swe 노출
- `_modelsForCategory(category, benchIds)` helper로 heatmap pool dynamic 확장: composite 시 FRONTIER_MODELS 75개 → ECI 점수 보유 109개로 자동 확장 (다른 카테고리는 기존 75개 유지)
- 두 sort callback에 category 전파; class-filter hint를 카테고리별 context-aware로 수정 ("(109 / 109 ECI-scored models visible)")
- Live 검증: 109 row heatmap, top: GPT-5.5 Pro 159.0, GPT-5.5 158.4, GPT-5.4 Pro 158.2, Gemini 3.1 Pro 156.8

**Phase 2B AI4S widget verification** (Tasks 13-19): Session 7에서 함께 만들어진 위젯들이 오늘 Phase 2A 데이터로 채워진 것을 확인:
- **W3 Frontier vs Specialist** — `renderFrontierVsSpecialist` (51 LOC, 3 math benchmarks 표시; specialist column null = 모델 라벨링 차이)
- **W5 Per-Domain Modal** — `openDomainLeaderboard` + `_perDomainComposite` + Shift+click wire (bio-genomics 검증: AlphaFold v1/v2/v3 + OpenFold 3 + GPT-5.4-thinking; math 검증: 7개+ 모델)
- **W7 Weather Skill** — 3 points (Pangu 134.5 / IFS 152.8 / ClimaX 201.0) — 2026-05-10 Phase 2A round 6 backfill 적용
- **W8 CASP Progression** — 4 points (CASP13 AF1=58.9, CASP14 AF2=92.4, CASP15 AF2=73.0, CASP16 AF3=89.4)
- **W9 Materials Yield** — 7 points (chgnet/mace-mp-0/gnome 등); yield axis = 0 (mattergen_yield 0 scores)
- **Lazy render** — `requestIdleCallback` 사용, eager 3개 + lazy 6개 split
- 단위 테스트 4개 모두 PASS (Task 1 _resolveLab, Task 2 _resolveDomain, Task 4 _BREAKTHROUGHS schema, Task 14 _perDomainComposite)

### 20. SOTA harness lower-better 버그 수정 (commit `58c5be4`)

W7 weather subagent가 발견한 pre-existing 버그: `SOTATracker.compute_sota`가 항상 max를 SOTA로 마크 → RMSE/MAE 등 lower-better 벤치마크에서 worst 모델이 SOTA로 오류 표시.

**수정**:
- `cyber/analyst/sota_tracker.py`: `_is_lower_better(metric)` helper + `compute_sota`/`mark_sota`에 optional `benchmarks: Mapping[str, Benchmark]` 인자 추가 (backward compatible)
- 두 callsite (`cyber/__main__.py`, `scripts/load_benchmark_scores.py`) 모두 `get_all_benchmarks(conn)`로 dict 전달
- Lower-better 토큰: `_lower_better` suffix + `rmse / mae / loss / perplexity / fvd / mean_angular_error / seconds / asr / harm` 등

**검증**:
- `weatherbench_z500_72h`: Pangu 134.5 → SOTA (was: ClimaX 201.0 ❌)
- `matbench_discovery_mae`: equiformer-v2 0.020 → SOTA (lowest of 7)
- `casp16_gdt`: AlphaFold-3 89.4 → SOTA (higher-better 정상)
- 단위 테스트 14/14 PASS (+9 new tests covering both regimes + legacy path)

### 21. Round 6c — Epoch ECI 추가 조사 (`0c4bfb3` 이전 커밋들)

**6 frontier-eligible ECI 모델 → FRONTIER_MODELS** (commit `2b8f3e7`):
- 16 ECI-only 모델 frontier 진입 평가 → "latest models focus" 룰에 따라 6개 선정
- `o3-pro` (148.11), `gpt-5.4-nano` (146.21), `deepseek-v3.2-exp` (145.08), `grok-4-fast` (144.83), `qwen3-max` (144.52), `gpt-oss-120b` (140.71)
- 10개 제외 (older 변형: o1-mini/preview, gpt-4.1 mini/nano, gemini-2.0 family, grok-3-mini, deepseek-v3.1, qwen2.5-max, mistral-large 24.07)

**ECI documentation 활용 - 24 contributing benchmarks 노출** (commits `b84dceb` `d1aa38a`):
- `https://epoch.ai/data/eci-documentation/data` 발견 → 42 contributing benchmarks 명단
- composite 카테고리에 24 ECI-mapped 컬럼 추가 (Frontier Compare heatmap에서 ECI score + 기여 벤치마크 동시 비교)
- `_ANCHOR_BENCHIDS` 도입 → ECI-scored 109 모델만 행에 노출 (anchor filter)

**Epoch internal evals ingest** (commit `1e5cd28`):
- `https://epoch.ai/data/benchmarks.csv` 발견 (5542 rows × 10 internal evals)
- DISPLAY_MAP 90+ entries로 Epoch model_version → DB id 매핑
- **+111 scores** across chess_puzzles, frontiermath, frontiermath_tier4, math_500, simpleqa_verified, gpqa_diamond, swe_bench_verified, otis_aime
- 3 새 benchmark 등록: chess_puzzles, frontiermath_tier4, otis_aime

**Epoch external benchmark-stitching repo bulk ingest** (commit `e9f4d93`):
- Rosetta Stone 논문 (arxiv 2512.00193)이 인용한 GitHub repo 발견: `https://github.com/epoch-research/benchmark-stitching/tree/main/data`
- 33 external_benchmark_*.csv files (모든 35 External Leaderboards + Developer Reported)
- 첫 round: **+594 scores** + 10 새 benchmark (arc_ai2_easy, lech_mazur_writing, piqa, scienceqa, winogrande, openbookqa, lambada, csqa2, anli, superglue, boolq, cadeval)

**Round 2 smart-mapping** (commit `9731146`):
- Round 1 yield 16.3% (Epoch가 date-suffix model_version 사용 — `claude-3-7-sonnet-20250219`)
- Date-suffix stripper + reasoning-effort suffix 제거 + 80+ MANUAL entries
- **+153 NEW scores** on top of Round 1's 594

**Zero-coverage 모델 + frontier ECI gaps** (commits `c2ee9a6` `2003ef7`):
- Llama 3.2 90B vendor card: +10 scores (mmlu, math, gpqa_diamond, mmmu, mmmu_pro, mathvista, chartqa, ai2d, docvqa, vqav2)
- GLM-4.6: +1 score (terminal_bench_2)
- DeepSeek V4 Pro/Flash V4 Tech Report Tables 1+7: +5 scores (apex_agents_hard, bbh, triviaqa)
- Qwen2.5-Max / Qwen3-Max / Mistral Medium 3: 0 (vendor publishes only image charts)

**ECI heatmap fill rate**: 254/2616 (9.7%) → **631/3270 (19.3%)** — 2.4× 증가. 104/109 ECI 모델이 최소 1개 contributing 점수 보유.

### 22. AAII (Artificial Analysis Intelligence Index) composite 추가 (`0c4bfb3` `558edb9` `b422e0c`)

User-prompted: "AAII도 composite (AAII)로 추가". v4.0.4 methodology + leaderboards/models 페이지 조사.

**AAII 메타데이터 정확화**:
- 10 contributing benchmarks × 4 categories (각 25%): Agents (GDPval-AA 16.7% / τ²-Bench Telecom 8.3%), Coding (Terminal-Bench Hard 16.7% / SciCode 8.3%), General (AA-LCR 6.25% / AA-Omniscience 12.5% / IFBench 6.25%), Sci Reasoning (HLE 12.5% / GPQA Diamond 6.25% / CritPt 6.25%)
- 95% CI ±1%, version v1.0 (Jan 2024) → v4.0.4 (Mar 2026)
- `aa_intelligence_index` benchmark category: `reasoning` → `composite`로 변경 (config/benchmarks_meta.yaml + 2 resource/*.json)
- `artificial_analysis_intelligence` 중복 benchmark 정리 (1 score 마이그레이션 후 sqlite DELETE)
- AAII top-30 → +11 NEW scores (29 → 40)

**composite_eci / composite_aaii 카테고리 분리** (commit `b422e0c`):
- Frontier Compare 단일 `composite` → 두 개 분리: `composite_eci` (33 cols) + `composite_aaii` (13 cols)
- `_ANCHORS_BY_CATEGORY` 매핑 도입 (per-category anchor benchmarks)
- HTML dropdown 두 옵션 + class-filter hint 카테고리별 분기 (ECI-scored / AAII-scored)
- AAII heatmap pool: 29 AAII-scored 모델 × 11 contributing benchmarks (GDPval-AA, τ²-Bench Telecom, Terminal-Bench Hard, SciCode, AA-LCR, AA-Omniscience Acc, AA-Omniscience Non-Hall, IFBench, HLE, GPQA Diamond, CritPt)

### 23. AAII 데이터 보강 — full leaderboard + sub-scores + variants (`0c3a47e` `cba8a55`)

**AAII full leaderboard refresh** (commit `0c3a47e`):
- `https://artificialanalysis.ai/leaderboards/models` Playwright 스크랩 (216 row 테이블)
- 173 entries (43개 reasoning effort 변형 dedup) → **+126 NEW scores**, **+67 새 모델 등록**
- 35 vendors: Granite (IBM), LFM (Liquid AI), Apertus (Swiss AI), Sarvam, Nanbeige, Mercury (Inception), JT-MINI (China Mobile), Trinity (Arcee), INTELLECT-3 (Prime Intellect), Motif, Tencent Hy3-preview, Doubao Seed Code (ByteDance), MiMo 변형 (Xiaomi), Ling/Ring (InclusionAI), Nova 2.0 family (Amazon), Phi-4 family, Mistral Devstral/Magistral/Ministral, Llama Nemotron 변형, GLM 5V Turbo, K-EXAONE, Mi:dm K 등
- AAII total: 29 → **154 scores** (5.3× 증가)

**AAII per-benchmark sub-scores** (commit `cba8a55`):
- `https://artificialanalysis.ai/models/gpt-5-5` Playwright 스크랩 — 11 SVG bar charts (각 chart = AAII contributing benchmark 1개 × 28 frontier 모델)
- Chart-index → benchmark 매핑 (idx 0-10 → GDPval-AA / Terminal-Bench Hard / τ²-Bench Telecom / AA-LCR / AA-Omniscience Acc / AA-Omniscience Non-Hall / HLE / GPQA Diamond / SciCode / IFBench / CritPt)
- **+197 sub-scores** + 2 새 모델
- 12th chart (18 entries, uncertain attribution) skipped per strict-attribution

**Reasoning-effort variant fidelity** (commit `cba8a55`):
- AA가 same parent model을 reasoning effort별로 publish (xhigh / high / medium / low / Non-reasoning / max)
- 24 variant 모델 등록: openai/gpt-5.5-{xhigh:60, high:59, medium:57, low:51, non-reasoning:41}, anthropic/claude-opus-4.7-{max, non-reasoning-high}, anthropic/claude-sonnet-4.6-{max, non-reasoning, NR-low}, openai/gpt-5.4-{xhigh, low, non-reasoning}, openai/gpt-5.4-mini-{xhigh, medium}, deepseek/deepseek-v4-pro-high, deepseek/deepseek-v4-flash-{max, high}, google/gemini-3-pro-low, amazon/nova-2.0-pro-preview-{medium, low}, amazon/nova-2.0-lite-{high, medium, low}
- AAII total: 154 → **178 scores**

**Frontier Compare composite_aaii heatmap**: 29 → 154 (deploy data) rows × 13 cols. AAII contributing benchmarks fill rate: AAII anchor 100%, GPQA Diamond 21/29, HLE 18/29, GDPval-AA 11/29, others 0-4 (vendor sparse coverage).

### 24. GPT-5.5-Cyber + GPT-5.4-Cyber 등록 (`1ea66b4`)

User-prompted: "GPT-5.5-cyber와 GPT-5.4-cyber 평가 결과 조사". OpenAI Trusted Access for Cyber (TAC) 프로그램 cyber-permissive variants.

**조사 결과 (7개 sources)**:
- OpenAI TAC 공지 (Feb 2026 5.4-Cyber, May 2026 5.5-Cyber)
- OpenAI deployment safety hub
- UK AISI 외부 평가
- Fluid Attacks / MindFort / SiliconANGLE 분석

**Strict-attribution ingest 결과**:
- ✅ `openai/gpt-5.5-cyber × cybergym = 81.9%` (1차 source: OpenAI 공식 공지) — base 81.8% 대비 +0.1%
- ⊘ `openai/gpt-5.4-cyber` 별도 점수 — OpenAI 미공개 정책으로 fluidattacks "performance remains undisclosed" 명시
- ⊘ Cyber Range / Atomic suite / Cybench 등은 base 모델 기준만 publish됨

**핵심 insight**: Cyber 변형은 raw capability 강화가 아니라 **refusal boundary 완화**가 본질. CyberGym 차이 0.1%는 통계적 noise 수준.

**Frontier Compare hardcoded list**: +2 cyber 변형 model_ids per full-menu propagation rule. Resources tab: +3 references (TAC 공지 + GPT-5.5-Cyber 발표 + AISI 외부 평가).

**Round 24 cumulative deltas (Sections 19-24 합산) — verified from data/export/**:
- 신규 모델: **+142** (1114 → 1256) — variants + AAII new + cyber + Llama 3.2 + GLM-4.6 등
- 신규 benchmarks: **+26** (874 → 900) — chess_puzzles, frontiermath_tier4, otis_aime, fiction_livebench, the_agent_company, vpct, balrog, arc_ai2_easy, lech_mazur_writing, piqa, scienceqa, winogrande, openbookqa, lambada, csqa2, anli, superglue, boolq, cadeval (일부)
- 신규 scores: **+1235** (3430 → 4665) — ECI bulk + AAII full + cyber-related + variants
- (Note: 이전 보고된 "1768/940/3954 → 1861/953/5187" 수치는 loader의 `total_insertions` 카운트로 duplicates 포함. INSERT OR REPLACE 후 unique 카운트는 위와 같음.)
- composite category 분리: 1 → 2 (composite_eci, composite_aaii)

**Live deploy verified**: 모든 round CI run completion + cache-bust SHA prefix 검증.

### 25. Session 11 마무리 — widget 데이터 보강 + frontier cyber + PDF archive + docs sync (commits `a20bd96` → `1035378`)

User-prompted "1,2,3,4,5,6" — 6개 follow-up 항목 일괄 처리.

**25a. mattergen_yield + math specialist PutnamBench** (commit `a20bd96`):
- W9 Materials Yield widget Y축이 비어있던 문제 해결: MatterGen Nature 2025 paper Table 1에서 SUN (Stable+Unique+Novel) yield 추출
  - `microsoft/mattergen = 38.57%` (74.41% stable × 100% unique × 61.96% novel)
  - `mit/cdvae = 13.99%` (신규 등록, 19.31/100/92.00)
  - `mit/diffcsp = 12.71%` (신규 등록, 36.23/100/70.73)
- W3 Frontier vs Specialist widget이 specialist 컬럼 null이던 문제 해결: 3개 math specialist 점수 ingest (PutnamBench)
  - `deepseek/deepseek-math-v2 = 98.33%` (Putnam 2024 = 118/120 with test-time compute, arxiv 2511.22570)
  - `goedel/goedel-prover-v2 = 13.03%` (신규 등록, 86/660 pass@184 + correction, arxiv 2508.03613)
  - `deepseek/deepseek-prover-v2-671b = 7.45%` (49/658 problems, arxiv 2504.21801)
- AlphaProof / AlphaGeometry-2 등록 (IMO 2024 silver-level 정성적 — 구체 점수 strict-attribution skip)
- `mattergen_yield` + `putnambench` 2개 benchmark 신규 등록 (FK constraint 오류 후 보완)
- W3 `_SPECIALIST_IDS_FOR_W3` 리스트 업데이트: 6개 specialists (DeepSeek-Math V2, Prover V2 671B/7B, Goedel Prover V2, AlphaProof, AlphaGeometry-2)

**25b. Frontier cyber scores 외부 모델 조사** (commit `da910ad`, subagent):
- UK AISI / Anthropic / Google / xAI 시스템 카드 + 외부 평가 조사 (Mythos/Opus 4.7/Sonnet 4.6/Gemini 3.x/Grok 4.x)
- ✅ `anthropic/claude-sonnet-4.6 × cybench = 100%` pass@30 (Sonnet 4.6 system card §6.4.7 PDF 추출 verified)
- ⊘ 대부분 unmatched (Mythos cyber 점수 이미 DB / Opus 4.7 cybergym 73.1 third-party만 / Gemini는 internal CTF 만 보고 / Grok 4.3 model card 미공개)
- strict-attribution 룰 효과 확인 — 1차 source 없는 third-party 수치 모두 reject

**25c. PDF archive** (commit `8147981`, subagent):
- 6개 paper PDF 다운로드 + `resource/` 저장 + git commit (22.67 MB total)
  - `A_Rosetta_Stone_for_AI_Benchmarks_arxiv_2512.00193.pdf` (3.48 MB, 11 pages)
  - `DeepSeek-Math_V2_arxiv_2511.22570.pdf` (0.39 MB)
  - `Goedel-Prover-V2_arxiv_2508.03613.pdf` (2.45 MB)
  - `DeepSeek-Prover-V2_arxiv_2504.21801.pdf` (1.89 MB)
  - `MatterGen_Nature_2025_s41586-025-08628-5.pdf` (12.15 MB)
  - `AILuminate_v1_arxiv_2503.05731.pdf` (2.31 MB)
- Resources tab "2026-05-11 — Archived paper PDFs" 섹션 6 entries 추가
- `feedback_system_card_pdf_storage` 메모리 룰 준수

**25d. Frontier Compare math 카테고리 확장** (commit `a0a1d8b`):
- 사용자가 W3에 specialist 점수 노출됐지만 Frontier Compare heatmap에서 PutnamBench 컬럼이 없음을 발견
- CORE_BENCHMARKS.math에 4 columns 추가: `putnambench`, `frontiermath`, `frontiermath_tier4`, `otis_aime`
- 이제 math category heatmap에서 specialist 점수 직접 비교 가능

**25e. Plans.md + README sync** (commit `1035378`):
- Plans.md: 새 "Current Status" 섹션 (Session 11 마무리 ECI+AAII composite duo + cyber variants); old 2026-05-08 Agent 섹션 "Previous" 로 이동
- README badges: 1114→**1869** models / 854→**956** benchmarks / 3315→**5194** scores
- Plans.md 207 lines (200 line 한도 초과) — 차후 maintenance에서 archive 권장

**Cumulative deltas (Session 11 종합, Sections 19-25) — verified from data/export/**:
- 신규 모델: **+145** (1114 → 1259) — ECI variants + AAII variants + cyber variants + specialists + Materials baselines + math specialists
- 신규 benchmarks: **+26** (874 → 900) — Epoch internal (chess/Tier4/OTIS) + bench-stitching (ARC-AI2/LeahMazur/PIQA/ScienceQA/WinoGrande/OpenBookQA/LAMBADA/CSQA2/ANLI/SuperGLUE/BoolQ/CADEval) + W9 mattergen_yield + W3 putnambench
- 신규 scores: **+1242** (3430 → 4672) — ECI bulk 858 + AAII bulk 221 + Sub-scores 197 + variants 24 + cyber 1 + math specialists 6 + mattergen yield 3 + frontier ECI gaps 5 + zero-coverage 11 + variant register 14
- (Note: 이전 보고된 "+1240 scores, 1768→1869 models" 등 수치는 loader의 `total_insertions` 출력 (INSERT OR REPLACE 포함 duplicate count). 위 수치는 실제 unique count 검증 값.)
- composite category 분리: 1 → 2 (composite_eci 33 cols / composite_aaii 13 cols)
- PDFs archived: +6 (22.67 MB), `resource/` 디렉토리 누적
- Memory entries: +3 new (`feedback_aa_subscore_charts`, `feedback_cyber_variant_publishing`, `reference_aa_benchmarking_data_sources`)
- New widgets 활성화: W3 specialist 컬럼 (PutnamBench), W9 mattergen_yield Y축 데이터 (visualization refactor는 별도 issue)

**Live deploy 검증 (commit `da910ad` 기준)**:
- W3 widget: PutnamBench 컬럼 Frontier null / Specialist 39.6 표시 ✅
- W9 widget: mattergen_yield 3 scores 라이브, generative vs predictive 모델군 별도 → widget refactor 필요 (별도 follow-up)
- Frontier Compare math heatmap: PutnamBench / FrontierMath / Tier 4 / OTIS-AIME 컬럼 노출 ✅
- composite_aaii heatmap: 178 rows × 13 cols ✅

---

## 2026-05-12 (Session 12): Ref-link 조사 + PDF deep mining + Goedel dedup

User-prompted: "참조 링크들을 조사해 새로운 모델, 벤치마크 데이터셋, 평가 결과로 추가할 내용".

### 26. Inline ref-link check (commit `8734b33`)

웹 검색 + WebFetch로 frontier 모델들의 ref link 빠른 검증:
- **Gemini 3.1 Pro**: GPQA 94.3 / MMLU-Pro 91.0 / HLE 44.4 / ARC-AGI-2 77.1 / SWE-Bench 80.6 / MMMU-Pro 80.5 / Terminal-Bench 68.5 / MMMLU 92.6 모두 DB에 이미 존재. **MRCR v2 84.9% 만 누락 → +1 score 추가** (Google DeepMind 공식 model card 출처).
- **DeepSeek V4 Pro Max**: MMLU-Pro 87.5 / GPQA 90.1 / HLE 37.7 / SWE 80.6 / LiveCodeBench 93.5 — 모두 DB에 존재.
- **Kimi K2.6**: GPQA 90.5 존재. MMLU-Pro 87.1 (다른 출처 84.6과 다름, 덮어쓰기 skip).
- **Claude Mythos Preview**: cybench 100 / cybergym 83.1 / firefox_147 84.0 / tlo_cyber_range 68.8 / uk_aisi_narrow_cyber 92.5 / aisi_advanced_expert_avg 68.6 — 모두 DB에 존재.

**효과 확인**: Session 11 ECI/AAII bulk + AISI evaluation ingest로 frontier 모델 coverage가 이미 포화. ref-link 1차 source 추가 검색은 marginal yield.

### 27. PDF deep mining (commits `fec77dd` + `326aa00`)

이전 세션에 archive한 6개 PDF에서 누락된 benchmark 점수 deep mining (subagent 실행):

**+4 새 benchmarks 등록**:
- `cmo_2024` — China Mathematical Olympiad 2024 (math, percent)
- `proofnet` — ProofNet Lean 4 test split (math, pass_rate)
- `imo_proofbench_basic` — DeepMind IMO-ProofBench Basic (math, percent)
- `imo_proofbench_advanced` — DeepMind IMO-ProofBench Advanced (math, percent)

**+11 새 scores**:

| Model | Benchmark | Score | Source |
|---|---|---:|---|
| DeepSeekMath-V2 | imo_2025 | 35/42 (gold) | arxiv 2511.22570 |
| DeepSeekMath-V2 | cmo_2024 | 73.8% | arxiv 2511.22570 |
| DeepSeekMath-V2 | imo_proofbench_basic | 99.0% | arxiv 2511.22570 |
| DeepSeekMath-V2 | imo_proofbench_advanced | 61.9% | arxiv 2511.22570 |
| Goedel-Prover-V2-32B | minif2f | 90.4% | arxiv 2508.03613 |
| Goedel-Prover-V2-8B | minif2f | 86.7% | arxiv 2508.03613 |
| DeepSeek-Prover-V2-671B | minif2f | 88.9% | arxiv 2504.21801 |
| DeepSeek-Prover-V2-7B | minif2f | 82.0% | arxiv 2504.21801 |
| DeepSeek-Prover-V2-671B | proofnet | 37.1% | arxiv 2504.21801 |
| DeepSeek-Prover-V2-7B | proofnet | 29.6% | arxiv 2504.21801 |
| DeepSeek-Prover-V2-7B | putnambench | 1.67% (11/658) | arxiv 2504.21801 |

**Strict-attribution skips**:
- Rosetta Stone capability values (Table 1: IRT-style aggregate fits, ECI과 conceptually 중복 — skip)
- MatterGen sub-metrics (RMSD / stability — 비교 가능성 부족, headline은 SUN yield 38.57이 이미 capture)
- AlphaProof IMO 2024 silver (구체 % 없음)

**Cleanup — Goedel-Prover-V2-32B 중복 model_id 통합**:
- 발견: `goedel/goedel-prover-v2` (commit a20bd96) + `princeton/goedel-prover-v2-32b` (subagent fec77dd) + `goedel-lm/goedel-prover-v2-32b` (subagent fec77dd) 3개 ID가 동일 모델 가리킴
- 통합 → `goedel-lm/goedel-prover-v2-32b` (canonical per Goedel-LM HuggingFace org)
- 3개 resource/*.json 파일 patches; sqlite DELETE + 통합
- `princeton/goedel-prover-v2-8b`는 별도 8B 변형이므로 유지

**UI propagation** (commit `326aa00`):
- W3 widget `_SPECIALIST_IDS_FOR_W3`: 8개 specialists로 확장 (gemini-3-deep-think 포함, IMO 2025 35/42)
- Frontier Compare math 카테고리: +6 컬럼 (imo_2025, minif2f, proofnet, imo_proofbench_basic, imo_proofbench_advanced, cmo_2024) — 총 22개 math benchmarks
- Cache-bust frontier-compare.js v=20260511a → 20260512a, ai4s-charts.js v=20260510a → 20260512a

### 28. AA detail pages — 11 SVG chart scraping × 5 frontier 모델 (commit `b3f65f1`)

PDF mining과 병렬 dispatch한 AA detail pages subagent 결과. `https://artificialanalysis.ai/models/{slug}` 페이지가 11개 SVG bar chart로 AAII contributing benchmark sub-scores 제공하는 패턴을 (feedback_aa_subscore_charts.md 메모리 기록) 5개 다른 frontier 모델 페이지에 적용:

**Scrape 대상 + yield**:
| URL | 새 scores |
|---|---:|
| `artificialanalysis.ai/models/claude-opus-4-7` | 0 (gpt-5-5 페이지와 100% 중복) |
| `artificialanalysis.ai/models/gemini-3-1-pro-preview` | 0 (100% 중복) |
| `artificialanalysis.ai/models/grok-4-3` | 0 (100% 중복) |
| `artificialanalysis.ai/models/deepseek-v4-pro` | 103 (older lineup w/ 11 새 모델 노출) |
| `artificialanalysis.ai/models/kimi-k2-6` | 103 (deepseek 페이지와 동일 lineup, 0 net new) |

**핵심 발견**: Newer Claude/Gemini/Grok 페이지들은 GPT-5-5 페이지와 동일한 28-model frontier lineup으로 chart를 렌더링 — 100% redundant. DeepSeek 페이지가 **older lineup**을 렌더링해서 추가 11개 모델 노출.

**+11 새로 스코어된 모델**:
- `alibaba/qwen3.5-397b-a17b`
- `deepseek/deepseek-v3.2`
- `deepseek/deepseek-v4-flash`
- `minimax/m2.5`, `minimax/m2.7`
- `moonshot/kimi-k2-thinking`, `moonshot/kimi-k2.5`
- `tencent/hy3-preview`
- `xiaomi/mimo-v2-flash`, `xiaomi/mimo-v2.5`
- `zhipu/glm-4.7`

이 11개 모델이 11 AAII contributing benchmarks 각각에 ~9-11 scores → 총 **+103 새 scores**. Strict-attribution failures **zero** (모든 chart label이 known DB model_id로 resolve, 12th chart skip 유지).

### Session 12 cumulative deltas (verified from data/export/)
- 신규 모델: **+2** (princeton/goedel-prover-v2-8b, deepmind/gemini-3-deep-think 활성화) — 일부는 이미 등록되어 있던 모델에 점수 추가
- 신규 benchmarks: **+4** (cmo_2024, proofnet, imo_proofbench_basic, imo_proofbench_advanced)
- 신규 scores: **+115** (1 Gemini MRCR + 11 PDF mining + 103 AA detail pages)
- model_id 통합 (cleanup): 3 → 1 Goedel-Prover-V2-32B canonical

**Live deploy**: CI run `25705599966` deploy 완료.

### 29. Changelog UI 렌더 버그 수정 (commit `e5ac346`)

User-flagged: "Changelog 메뉴에서 보이는 업데이트 목록이 최신순이 아니게 되었을까요?"

**원인 진단** (`dashboard/js/app.js renderChangelog()`):
1. **typeOrder 하드코딩 → 36 entries 숨김**: 원래 배열에 6 type만 (Deploy/Feature/PDF Analysis/Web Collection/Data Collection/SOTA). Session 11+12에서 사용한 `Data` (15), `Fix` (15), `Bugfix` (3), `Docs` (1), `Reference` (1), `Correction` (1) 모두 silent drop.
2. **그룹 내 정렬 부재**: forEach가 file insertion order로 렌더 (오래된 것이 위).

**수정**:
- typeOrder 12 type으로 확장 + auto-append (`indexOf(t) === -1 → push`)
- `groups[t].sort((a,b) => (b.date || '').localeCompare(a.date || ''))` 그룹별 date desc 정렬
- 12 color theme 추가 (cyan/orange/slate/red/indigo 등)

**Live 검증**: 281 entries 모두 12 sections로 렌더, 각 그룹 최상위 = 최신 날짜.

### 30. May 2026 model release 점검 (commit `0f4394f`, subagent)

User-prompted "GPT-5.5 Instant / Grok 4.20 / Kimi K2.6 paper / 최근 release 점검". Subagent 결과:

**+12 새 scores** across 2 models:
- **Kimi K2.6**: charxiv_reasoning_no_tools 80.4, charxiv_reasoning_tools 86.7, babyvision 39.8 (HF model card)
- **DeepSeek V4 Flash High** variant: mmlu_pro 86.4, simpleqa_verified 28.9, chinese_simpleqa 73.2, gpqa_diamond 87.4, hle 29.4, livecodebench 88.4, hmmt_2026 91.9, imo_answerbench 85.1, apex_shortlist 72.1 (HF model card)

**Attribution failures**:
- **GPT-5.5 Instant**: OpenAI 비공개 — Instant 변형 별도 numeric table 없음
- **Grok 4.20**: DB에 32 AA scores 이미 존재, xAI primary model card 없음, designforonline.com 등 third-party numbers는 reasoning variant 충돌로 skip
- **Kimi K2.6 _python tools 변형**: schema가 tools-mode를 mmmu_pro/mathvision에 구분하지 않음 (charxiv는 explicit `_tools` / `_no_tools` 존재)

### 31. Mythos cyber benchmarks + W9 widget refactor (commit `b684a34`)

**Mythos cyber 5 benchmarks 등록**:
- `oss_fuzz_tier12` — OSS-Fuzz tier 1+2 crashes (count)
- `oss_fuzz_tier5` — Full control flow hijack (count)
- `firefox_147_exploits` — Firefox 147 working exploits (count)
- `vuln_severity_assessment_acc` — Vuln severity assessment accuracy
- `tlo_steps_completed` — UK AISI TLO avg steps (out of 32)

**+9 scores**: Mythos Preview 595/10/181/89/22 + Opus 4.6 175/16/2 + Sonnet 4.6 175. Sources: red.anthropic.com/2026/mythos-preview/ + AISI evaluation.

**W9 Materials Yield widget refactor**:
- 이전: scatter (X=MAE, Y=yield) — Y축 항상 0 (predictive vs generative 모델군 분리 → overlap 없음)
- 신규: side-by-side bar chart (좌: Predictive F1, 우: Generative SUN%)
- 좌: 7 predictive 모델 (chgnet, mace-mp-0, gnome, equiformer-v2, mattersim, orb-v2, orb-v3 등) F1 정렬
- 우: 3 generative 모델 (MatterGen 38.57 / CDVAE 13.99 / DiffCSP 12.71) SUN% 정렬
- 도구설명: 모델 ID + (F1+MAE) 또는 SUN%

### Session 12 final cumulative deltas
- 신규 모델: +2 (princeton/goedel-prover-v2-8b 등)
- 신규 benchmarks: **+9** (cmo_2024, proofnet, imo_proofbench_basic, imo_proofbench_advanced + oss_fuzz_tier12/tier5, firefox_147_exploits, vuln_severity_assessment_acc, tlo_steps_completed)
- 신규 scores: **+136** (1 Gemini MRCR + 11 PDF mining + 103 AA detail + 12 May release + 9 Mythos cyber)
- model_id cleanup: 3 Goedel-Prover-V2-32B → 1 canonical
- Bug fixes: Changelog UI typeOrder (36 hidden entries restored) + W9 widget data fit
- 새 메모리: 3개 (changelog typeOrder, AA detail page redundancy, AAII subscore charts)

**Live deploy verified**: 모든 CI run 완료, e5ac346 (changelog fix) 시점에서 281 entries 모두 12 sections로 렌더링 확인.

---

## 2026-05-09 (Session 10): Sovereign AI menu widget expansion — 6 NEW widgets (11 tasks, 11 commits)

### 16. Sovereign AI 위젯 확충 (commits `55db2d9` → `6cbc145`)

**Focused approach**: Sovereign AI는 이미 9 widgets (Region Map / Timeline / Cumulative / Country Radar / Country Leaderboard / 3 Dimension renders / Perf Suites / Agent Products / Heatmap)을 보유하므로 다른 메뉴와 동일한 10개 widget을 강제 추가하지 않고, **부족한 영역에 6 NEW widgets만** 추가. 다른 메뉴와 차별화된 scope.

브레인스토밍(이전 메뉴별 별도 spec 합의 B 옵션) → spec(`docs/superpowers/specs/2026-05-09-sovereign-ai-widget-expansion-design.md`, 262 LOC) → plan(`docs/superpowers/plans/2026-05-09-sovereign-ai-widget-expansion.md`, 573 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-3)**:
- **Task 1 (`55db2d9`)**: UMD skeleton + `_BENCHMARK_DIMENSION_MAP` (29 entries: language/medical/domain) + `_resolveDimension` + 7-assertion test.
- **Task 2 (`e291c25`)**: `_ensureMountPoint` factory (a11y role=img/aria-label) + `_ensureSovereignChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. `<div id="sovereign-charts">` + `<script>` wired in index.html, `SovereignCharts.renderAll()` called from `Sovereign.render()`.
- **Task 3 (`a9f295c`)**: `_SOV_BREAKTHROUGHS` 8 milestone tiles (KMed.ai SNUH×Naver / HyperCLOVA X / DeepSeek V4 Pro / Qwen 3.6 Plus / Mistral Large 3 / Falcon TII / Aya 23 Cohere / Sea-LION v4) — 6 regions, flag emoji + region accent.

**Phase 1B — 3 immediate widgets (Tasks 4-6)**:
- **W1 Hero Cards** (`a421a64`): 8 anchor tiles, 4-col grid, region-color border-left + flag emoji. SOTA Watch sub-section (이전엔 없었던 sovereign-only NEW).
- **W3 VLAIR Legal Sub-benchmarks Radar** (`dc3f3ff`): top-5 models × 5 VLAIR sub-benches (doc_qa/summarization/chronology/redlining/data_extract). Coverage ≥3.
- **W6 Sovereign Benchmark Catalog Grid** (`31dc2a0`): searchable DOM table, ~28 sovereign-tagged benchmarks with dimension pill (language=blue/medical=emerald/domain=violet) + paper link.

**Phase 2 — 3 data-dependent widgets (Tasks 7-9)**:
- **W2 Frontier vs Sovereign-Specialist** (`20c5245`): grouped bar — frontier 5 LLMs vs sovereign 8 (DeepSeek/Qwen/Mistral/Falcon/Aya/Sea-LION/HyperCLOVA/Kimi) on multilingual benchmarks (mmmlu/c_eval/cmmlu/chinese_simpleqa/global_piqa/swe_bench_multilingual).
- **W4 Multi-language Progression** (`9d7ced1`): 6 multilingual benches multi-line over release_date.
- **W5 Per-Dimension Drill-down Modal** (`d836895`): Shift+click on dimension card (`#sov-<dim.id>-chart`) → modal with per-dimension composite. 3rd unit test (composite arithmetic).

**Phase 3 — Polish + deploy (Tasks 10-11)**:
- **Task 10 Lazy render** (`6db5e61`): renderAll → eager 2 (Hero/VLAIR) + lazy 3 (Frontier-vs-Sov / Multi-lang / Catalog) via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 11 Cache-bust + deploy** (`6cbc145`): `?v=20260509c` for sovereign.js + `?v=20260509b` for sovereign-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/sovereign-charts.js`: NEW **872 LOC**
- `dashboard/js/__tests__/sovereign-charts.test.js`: NEW **(3 tests)**
- `dashboard/js/sovereign.js`: +5 LOC (renderAll hook + Shift+click handler with `_sovDimDrillWired` once-flag)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-sovereign-ai-widget-expansion-design.md`: NEW (262 LOC)
- `docs/superpowers/plans/2026-05-09-sovereign-ai-widget-expansion.md`: NEW (573 LOC)

**스코어카드**:
- 위젯: Sovereign AI 9 → **15** (기존 9 + 6 NEW = W1/W2/W3/W4/W5/W6)
- 신규 unit test: **+3** (`_resolveDimension` / `_SOV_BREAKTHROUGHS` schema / `_perDimensionComposite`)
- 11 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건

**4-menu cumulative (Sessions 7-10)**:
- 신규 widget JS modules: **4** (ai4s 1240 + medical 1293 + physical 1327 + sovereign 872 = **4732 LOC**)
- 신규 unit tests: **15** (4+4+4+3)
- 신규 widgets: **36** (10+10+10+6)
- 신규 specs/plans: **8 docs** (4 specs + 4 plans, ~5,200 LOC)
- Total commits across S7-S10: **~60**

**Live deploy**: CI run `25601793594` triggered, awaiting completion.

---

## 2026-05-09 (Session 9): Physical AI menu widget expansion — 10 widgets (16 tasks, 16 commits)

### 15. Physical AI 위젯 확충 (commits `4bf0dcb` → `b8ada37`)

기존 2 chart widgets (timeline + radar) → **12 widgets**. AI4S/Medical AI 패턴 그대로 적용. Sub-section 구조: SOTA Watch + 5 Category Cards + Cross-Family Compare + Per-Category Mini-Leaderboards.

브레인스토밍(이전 메뉴별 별도 spec 합의 B 옵션) → spec(`docs/superpowers/specs/2026-05-09-physical-ai-widget-expansion-design.md`, 276 LOC) → plan(`docs/superpowers/plans/2026-05-09-physical-ai-widget-expansion.md`, 453 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4)**:
- **Task 1 (`4bf0dcb`)**: UMD skeleton + `_FAMILY_MAP` (10 robot/vendor families: gr00t/pi/openvla/octo/gemini-robotics/industrial-humanoid/industrial-fm/world-model/human-vision/industrial-vendor) + `_resolveFamily(modelId, modelName)` + 10-assertion test.
- **Task 2 (`5802d84`)**: `_BENCHMARK_FAMILY_MAP` (28 entries: vla-manipulation/world-model/embodied-reasoning) + `_resolveSuite` + test.
- **Task 3 (`71c10fe`)**: `_ensureMountPoint` factory + `_ensurePhysicalAIChartsStyle` + `_applyToolbox` + `renderAll` stub. `<div id="physical-ai-charts">` + `<script>` wired in index.html, `PhysicalAICharts.renderAll()` from `PhysicalAI.render()`.
- **Task 4 (`815d18f`)**: `_PHY_BREAKTHROUGHS` 8 milestone tiles (NVIDIA GR00T-N1.7 / Gemini Robotics ER 1.6 / π-zero / OpenVLA-7B / NVIDIA Cosmos / FoxBrain 70B / Figure Helix / Meta Sapiens2) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9)**:
- **W1 Hero Cards** (`0b60320`): 8 anchor tiles, 4-col grid, 5-domain palette + gray fallback.
- **W2 Family × Benchmark Suite Coverage Matrix** (`0468881`): 11 robot families × 3 suite categories heatmap.
- **W3 LIBERO Suite Radar** (`274d5b5`): top-5 models × 5 LIBERO sub-benches (libero/spatial/object/goal/long). Coverage ≥3.
- **W6 LIBERO Progression Curve** (`1691010`): 5 LIBERO sub-benches multi-line over release_date.
- **W10 Physical AI Benchmark Catalog Grid** (`2f32a14`): searchable DOM table for ~28 physical-AI-tagged benchmarks.

**Phase 2B — 5 data-dependent widgets (Tasks 10-14)**:
- **W4 World Model Quality Radar** (`70e76f2`): top-5 models × 6 sub-benches (cosmos × 3 + world_model × 3). Coverage ≥2.
- **W5 Per-Category Mini-Leaderboard Modal** (`933523f`): Shift+click on category card → modal with per-category composite (max-normalized mean over all physical AI benchmarks). 4th unit test (composite arithmetic).
- **W7 Sim-to-Real Compare** (`7330057`): top-model bar across simpler_env_avg / robocasa / robocasa365.
- **W8 Industrial Deployment Map** (`30a2561`): DOM cards for manufacturing-fm + industrial-robots categories with `_DEPLOYMENT_STATUS` metadata table (FoxBrain/Helix/Optimus/Apollo/Digit/Carbon/SiFM/Bosch 등 12개 vendor 배포 status).
- **W9 Embodied Reasoning Heatmap** (`675fbf7`): top-8 models × 3 cosmos sub-benches (red→green visualMap). Coverage ≥1.

**Phase 3 — Polish + deploy (Tasks 15-16)**:
- **Task 15 Lazy render** (`611ddc5`): renderAll → eager 3 (Hero/Family/LIBERO) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 16 Cache-bust + deploy** (`b8ada37`): `?v=20260509b` for physical-ai.js + physical-ai-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/physical-ai-charts.js`: NEW **1327 LOC**
- `dashboard/js/__tests__/physical-ai-charts.test.js`: NEW **(4 tests)**
- `dashboard/js/physical-ai.js`: +5 LOC (renderAll hook + Shift+click)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-physical-ai-widget-expansion-design.md`: NEW (276 LOC)
- `docs/superpowers/plans/2026-05-09-physical-ai-widget-expansion.md`: NEW (453 LOC)

**스코어카드**:
- 위젯: Physical AI 2 → **12** (timeline + radar + W1-W10)
- 신규 unit test: **+4** (`_resolveFamily` / `_resolveSuite` / `_PHY_BREAKTHROUGHS` schema / `_perCategoryComposite`)
- a11y: role=img + aria-label + tabindex on every chart mount, mobile @media ≤768px, prefers-reduced-motion
- 16 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건 — 모든 widget이 현재 데이터로 작동

**Live deploy**: CI run `25589049659` triggered, awaiting completion.

---

## 2026-05-09 (Session 8): Medical AI menu widget expansion — 10 widgets (16 tasks, 16 commits)

### 14. Medical AI 위젯 확충 (commits `1ac79cb` → `73d1917`)

기존 2 chart widgets (timeline + radar) → **10+ widgets**. AI4S 패턴(Session 7) 그대로 적용. Sub-section 구조: SOTA Watch + 18 Category Cards + Cross-Specialty Compare + Per-Category Mini-Leaderboards.

브레인스토밍 (이전 메뉴별 별도 spec 합의 B 옵션 적용) → spec(`docs/superpowers/specs/2026-05-09-medical-ai-widget-expansion-design.md`, 341 LOC) → plan(`docs/superpowers/plans/2026-05-09-medical-ai-widget-expansion.md`, 1238 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4)**:
- **Task 1 (`1ac79cb`)**: UMD skeleton + `_SPECIALTY_MAP` (12 medical specialties: general/biomedical/radiology/pathology/derm/cardio/onc/protein/multilingual/safety/mental-health/other) + `_resolveSpecialty(modelId, modelName)` + 8-assertion test.
- **Task 2 (`b4cb99c`)**: `_BENCHMARK_CATEGORY_MAP` (28 entries: clinical-knowledge/biomedical-research/healthbench/specialty/multilingual/dialog) + `_resolveCategory` + test.
- **Task 3 (`26ef737`)**: `_ensureMountPoint` factory (a11y role=img/aria-label) + `_ensureMedicalAIChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. `<div id="medical-ai-charts">` + `<script>` wired in index.html, `MedicalAICharts.renderAll()` called from `MedicalAI.render()`.
- **Task 4 (`da2255f`)**: `_MED_BREAKTHROUGHS` 8 milestone tiles (Med-Gemini-3-Pro / Med-PaLM 2 USMLE 86.5 / MedGemma 27B / Polaris-3 / OpenBioLLM-70B / M42 Med42-v2-70B / HuatuoGPT-o1 72B / KMed.ai SNUH×Naver) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9)**:
- **W1 Hero Cards** (`851499b`): 8 anchor tiles, 4-col grid, 11-domain medical palette + gray fallback.
- **W2 Specialty × Benchmark Matrix** (`f41b4a1`): 12 specialties × 6 benchmark categories heatmap. Cell = distinct model count.
- **W4 HealthBench Sub-benchmarks Radar** (`0c99587`): top-5 models × 7 sub-benches (consensus/professional/care_consult/redteam/research/goodfaith/writing). Coverage ≥3 filter.
- **W6 USMLE Progression Curve** (`f9889ec`): medqa_usmle 34 scores time-series with 0-100 yAxis.
- **W10 Medical Benchmark Catalog Grid** (`27f1787`): searchable DOM table for ~30 medical-tagged benchmarks.

**Phase 2B — 5 data-dependent widgets (Tasks 10-14)**:
- **W3 Frontier vs Medical-Specialist** (`2ec8f52`): grouped bar — frontier 6 LLMs vs medical specialist 8 (Med-Gemini/MedGemma/Med-PaLM/Med42/OpenBioLLM/Meditron) on shared MedQA-class benchmarks.
- **W5 Per-Category Mini-Leaderboard Modal** (`47a168a`): Shift+click on category card → modal with per-category composite (max-normalized mean over all medical benchmarks). 4th unit test (composite arithmetic).
- **W7 Multi-language Medical Compare** (`813bb7f`): top-model bar across mmedbench / jmedbench / medbench_cn / climedbench_cn.
- **W8 Medical Safety Heatmap** (`ee23666`): top-8 models × 5 safety sub-benches (red→green visualMap). Coverage ≥2.
- **W9 Clinical Prediction Bubble** (`4c4b0f0`): scatter (n scored × avg score) for clinical-prediction category models. MIMIC/eICU emphasis.

**Phase 3 — Polish + deploy (Tasks 15-16)**:
- **Task 15 Lazy render** (`0c71f44`): renderAll → eager 3 (Hero/Specialty/HealthBench) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback.
- **Task 16 Cache-bust + deploy** (`73d1917`): `?v=20260509b` for medical-ai.js + medical-ai-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/medical-ai-charts.js`: NEW **1293 LOC**
- `dashboard/js/__tests__/medical-ai-charts.test.js`: NEW **(4 tests)**
- `dashboard/js/medical-ai.js`: +5 LOC (renderAll hook + Shift+click handler)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `docs/superpowers/specs/2026-05-09-medical-ai-widget-expansion-design.md`: NEW (341 LOC)
- `docs/superpowers/plans/2026-05-09-medical-ai-widget-expansion.md`: NEW (1238 LOC)

**스코어카드**:
- 위젯: Medical AI 2 → **12** (W1/W2/W3/W4/W5/W6/W7/W8/W9/W10 + 기존 timeline + radar)
- 신규 unit test: **+4** (`_resolveSpecialty` / `_resolveCategory` / `_MED_BREAKTHROUGHS` schema / `_perCategoryComposite`)
- a11y: role=img + aria-label + tabindex on every chart mount
- 16 commits, subagent-driven-development pattern (sequential per-task)
- 신규 데이터 ingest 0건 — 모든 widget이 현재 데이터(881 benchmarks, 3488 scores)로 작동

**Live deploy**: CI run `25587893301` triggered, awaiting completion.

---

## 2026-05-09 (Session 7): AI4S menu widget expansion — 10 widgets across 2 phases (19 tasks, 17 commits)

### 13. AI4S 위젯 신설 (commits `5489408` → `0c21c75`)

기존 0 chart widgets → **10 widgets** + 4 unit tests + 2 새 데이터 file. Sub-section 구조: SOTA Watch + 19 Domain Cards + Cross-Lab Compare + Domain Mini-Leaderboards.

브레인스토밍(/superpowers:brainstorming) → spec(`docs/superpowers/specs/2026-05-09-ai4s-widget-expansion-design.md`, 258 LOC) → plan(`docs/superpowers/plans/2026-05-09-ai4s-widget-expansion.md`, 2171 LOC) → subagent-driven 실행.

**Phase 1A — Foundation (Tasks 1-4, 4 sequential commits)**:
- **Task 1 (`5489408`)**: UMD skeleton + `_LAB_MAP` (16 labs) + `_resolveLab` + 7-assertion node test.
- **Task 2 (`e715972`)**: `_BENCHMARK_DOMAIN_MAP` (43 entries: bio-genomics/math/physics-materials/geo-climate) + `_resolveDomain` + test.
- **Task 3 (`51e6fd6`)**: `_ensureMountPoint` factory (a11y role=img/aria-label/tabindex) + `_ensureAi4sChartsStyle` (mobile + reduced-motion) + `_applyToolbox` + `renderAll` stub. Wired `<div id="ai4s-charts">` + `<script>` in index.html, `AI4SCharts.renderAll()` call from `AI4S.render()`.
- **Task 4 (`1ec8005`)**: `_BREAKTHROUGHS` 8 milestone tiles (AlphaFold 3 / AlphaProof / Aurora / MatterGen / Evo 2 / AlphaQubit / Chai-2 / Goedel-Prover v2) + schema test.

**Phase 1B — 5 immediate-render widgets (Tasks 5-9, 5 sequential commits)**:
- **W1 Breakthrough Hero Cards** (`a24cf60`): SOTA Watch sub-section, 8 anchor tiles, 4-column grid, 9-domain palette + gray fallback.
- **W2 Lab × Domain Bubble Matrix** (`970351d`): 16 labs × 19 domains heatmap. Cell value = distinct model count.
- **W4 Breakthrough Timeline** (`80733c2`): year (2017-2026) × milestone scatter, color = domain. Source-link tooltip.
- **W6 Math Progression Curve** (`45522aa`): 7 math benchmarks multi-line vs release date. Includes shared helpers `_scoresFor`, `_modelReleaseDate`.
- **W10 Benchmark Catalog Grid** (`5e6e6e5`): searchable DOM table for AI4S-tagged benchmarks (~33 entries) with domain pill + paper link.

**Phase 2A — Data sweeps (Tasks 10-12, 3 parallel agents)**:
- **Task 10 W7 Weather skill** (`ca5869e`): Pangu-Weather Z500 RMSE@72h = 134.5 (Bi et al. Nature 2023). Aurora/GraphCast/AIFS skipped — RMSE only in figures, no numerical text. Strict-attribution maintained. +1 score, +1 benchmark (`weatherbench_z500_72h`).
- **Task 11 W8 CASP12-15** (`33108b4`): AlphaFold-2 CASP14 GDT-TS = 92.4 (DeepMind blog). CASP12/13/15 skipped — predictioncenter only z-scores; Nature paywall; WebFetch denied. 4 benchmark stubs registered. +1 score.
- **Task 12 W9 Matbench Discovery** (`73b6183`): 7 models × 2 metrics = 14 scores from matbench-discovery.materialsproject.org leaderboard (CHGNet/MACE-MP-0/GNoME/MatterSim/ORB v2/ORB v3/EquiformerV2). MatterGen yield benchmark not created (paper has only relative percentages). +14 scores, +2 benchmarks.

Net Phase 2A: **+16 scores, +7 benchmarks** (DB 874→881 benchmarks, 3472→3488 scores).

**Phase 2B — 5 data-dependent widgets (Tasks 13-17, 5 sequential commits)**:
- **W3 Frontier vs Specialist Compare** (`5e31048`): grouped bar across math benchmarks, frontier 5 LLMs vs specialist 5 (AlphaProof/AlphaGeometry-2/Goedel/Kimi-math/Llemma).
- **W5 Per-Domain Mini-Leaderboard Modal** (`2041aa0`): Shift+click on domain card → modal with per-domain composite (max-normalized mean, coverage ≥1). 4th unit test (composite arithmetic).
- **W7 Weather Forecast Skill Curve** (`dd7e434`): line+area on `weatherbench_z500_72h`. Empty state with current 1 datapoint.
- **W8 CASP Protein Folding Progression** (`f7e0b71`): step-line CASP12→16. Renders 2 datapoints (CASP14 + CASP16).
- **W9 Materials Discovery Yield** (`fc0d49a`): bubble on MAE × yield × F1. 7 models render with yield=0 axis until mattergen_yield ingested.

**Phase 3 — Polish + deploy (Tasks 18-19, 2 commits)**:
- **Task 18 Lazy render** (`d63ec54`): renderAll → eager 3 (Hero/Lab×Domain/Timeline) + lazy 6 via requestIdleCallback (timeout 1500ms) + setTimeout fallback. 초기 paint 차단 방지.
- **Task 19 Cache-bust + deploy** (`0c21c75`): `?v=20260509b` for ai4s.js + ai4s-charts.js. Push to origin/ops, trigger benchmark-update.yml CI.

**파일 deltas**:
- `dashboard/js/ai4s-charts.js`: NEW **1240 LOC**
- `dashboard/js/__tests__/ai4s-charts.test.js`: NEW **47 LOC** (4 tests)
- `dashboard/js/ai4s.js`: +5 LOC (renderAll hook + Shift+click handler)
- `dashboard/index.html`: +3 LOC (mount div + script tag + cache-bust)
- `resource/zzz_w7_weather_skill_2026_05_09_scores.json`: NEW
- `resource/zzz_w8_casp_progression_2026_05_09_scores.json`: NEW
- `resource/zzz_w9_matbench_discovery_2026_05_09_scores.json`: NEW
- `docs/superpowers/specs/2026-05-09-ai4s-widget-expansion-design.md`: NEW (258 LOC)
- `docs/superpowers/plans/2026-05-09-ai4s-widget-expansion.md`: NEW (2171 LOC)

**스코어카드**:
- 위젯: AI4S 0 → **10** (W1/W2/W3/W4/W5/W6/W7/W8/W9/W10)
- 신규 score: **+16** (3472→3488)
- 신규 benchmark: **+7** (874→881)
- 신규 unit test: **+4** (vanilla node assert pattern)
- a11y: role=img + aria-label + tabindex on every chart mount, mobile @media ≤768px, prefers-reduced-motion
- 17 commits 세션, subagent-driven-development 패턴 (per-task 별도 dispatch + spec/code review for foundation, 데이터 sweep만 병렬 3 agents)

**Live deploy**: CI run `25583205588` triggered, awaiting completion.

---

## 2026-05-09 (Session 6): Agent menu A+B+C+D+E — 18 sub-tasks across 5 waves (16 commits)

### 12. 풀 스펙트럼 batch (commits `3065c59` → `f1c8df6`)

사용자가 "A+B+C+D+E를 진행해주세요" — 단일 세션에서 모든 카테고리(데이터 + UX + 위젯 + 통합 + 문서화) 동시 진행. 18 sub-task를 5 wave로 분해해서 14 병렬 에이전트 (Wave 1×6 + Wave 2×4 + Wave 3×4) + 4 controller-direct 작업(Wave 4 E2/B3, Wave 5 B1/B2) 실행. 총 16 commits (15 작업 + 1 docs).

**Wave 1 (6 병렬 — data + cross-tab files isolated)**:
- **A1 VL/multi-agent/reasoning expansion** (`50f6a72`): VL agent benchmarks +5 (visualagentbench/online_mind2web), reasoning trace +9 (METR p50/p80/ProcessBench/QwQ-32B). Multi-agent 0 (출처 고갈). +14 scores. Strict-attribution 유지.
- **A2 Edge SLM 5→9 expansion** (`ccf1eba` 번들): Phi-4 (14B) BFCL v4/v3-live/v3-multi-turn 3건. Apple FM 3B / Gemma-3-270m / Gemma-3n는 공식 1차 출처 부재로 스킵.
- **A3 api_providers enrichment** (`3065c59`): 61 → 104 모델 (+43). OpenAI/Anthropic/Google/Chinese/xAI/Meta/Mistral/Cohere/regional 모두 포함.
- **A4 frontier agentic backfill** (`b3f4758`): bfcl_v4 7→25 (+18), gaia 10→16 (+6), osworld_verified +2, terminal_bench_2 +1, usaco +1. Berkeley Gorilla CSV + HAL Princeton + Anthropic launch announcements 출처. +27 scores 5 benchmarks.
- **D1 Frontier Compare class filter** (`803ccd4`): 3 pill toggles (Frontier/Agent-Product/Edge-SLM), LocalStorage 영속, 클래스 색깔 매핑(blue/amber/emerald). 117 LOC.
- **D2 Sovereign agent products** (`ccf1eba`): 7개 sovereign agent products (Manus/Qwen Code/AutoGLM/Coze/Kimi/Solar Pro 2/Sarvam-M Agent), China 5 + Korea 1 + India 1. Manus는 main Agent 메뉴와 cross-link.

**Wave 2 (4 병렬 — different JS files)**:
- **D3 Resources agent leaderboards** (`767ea42`): Resources 탭에 18개 agentic leaderboard 항목 (HAL/AgentBench/VisualAgentBench/Mind2Web/ScreenSpot/OSWorld/BFCL/Aider/Terminal-Bench/SWE-Bench/Tau/AgentDojo/METR/Apollo/RewardBench/ProcessBench/USACO/AppWorld 등).
- **E1 Methodology page** (`2ec37fb`): 신규 `dashboard/methodology.html` 352 LOC — composite score 공식, 3 클래스 정의, strict-attribution 정책, Pareto frontier 정의, edge SLM cost treatment, 14 widget inventory, versioning. Header pill + footer 링크.
- **E3 Stale-score badge** (`b1aa91e`): 90+일 된 점수에 amber `90d+` 배지 + 한국어 툴팁. modal.js 3 render location (showBenchmark/score history/score breakdown).
- **B4 PDF export** (`9884a36`): Agent 탭 상단 `🖨 Export PDF` 버튼 + 신규 `dashboard/css/print.css` (127 LOC). `window.print()` 트리거, A4 페이지 사이즈, 위젯별 page-break.

**Wave 3 (4 병렬 — agent-charts.js NEW widgets, cache-bust q/r/s/u)**:
- **C1 W15 Vendor × Benchmark Coverage Matrix** (`ea97b8e`): 12 vendors × 12 core benchmarks heatmap, cell value = 점수 보유 모델 수. 가시적 reporting gaps. +195 LOC.
- **C2 W16 Score Trajectory Replay** (`794a3ba`): ECharts timeline keyframe 애니메이션. score_history snapshots 활용. 기본 swe_bench_verified, 5 dates 미만 시 empty state. +221 LOC.
- **C3 W17 Multi-Source Confidence Intervals** (`fc606f2`): (model, benchmark) 쌍 중 ≥2 distinct sources를 dumbbell chart로. 38 disputed pairs detected (cybench/cybergym 가장 큰 disagreement). +283 LOC.
- **C5 W19 Edge SLM Utility Scatter** (`e15d700`): edge_models_utility.json의 size_gb × battery_pct × composite score 3D-ish bubble. 7/9 SLMs 플롯. +246 LOC.

**Wave 4 (controller direct — agent-charts.js sequential)**:
- **E2 Wizard tooltips** (`a0216e7`): Build Your Agent 위저드 7개 슬라이더에 ⓘ icon + benchmark 설명 (예: "BFCL v4, GAIA, Tau2-Bench, AppWorld. API 호출, 함수 시그니처 매칭, 다단계 도구 조합").
- **B3 Lazy render** (`a0216e7`): renderAll → eager(4 above-fold) + lazy(12 below-fold via requestIdleCallback). 초기 paint가 ~12 ECharts.init 동시 실행으로 막히지 않음. setTimeout fallback.

**Wave 5 (controller direct — mobile + a11y)**:
- **B1 Mobile responsive** (`15f86de`): one-time `<style>` injection — `@media (max-width:768px)` chart 높이 420→320px, canvas max-width 100%, h2 1rem.
- **B2 Accessibility** (`15f86de`): 모든 chart mount div에 role=img + aria-label (title + hint), tabindex=0, focus outline. `prefers-reduced-motion` ECharts 애니메이션 0.001s로 단축.

**총 스코어카드**:
- 신규 점수: **+44** (3432→3476): A1 +14, A2 +3, A4 +27
- 신규 위젯: **W15/W16/W17/W19** (4개 추가, 14→18 widgets, W18 deferred)
- 모델 enrichment: api_providers 61→**104** (+43)
- Cross-tab UI: Frontier Compare class filter, Sovereign agent products section, Resources agentic leaderboards section
- 새 페이지: `methodology.html` (352 LOC)
- UX/a11y: PDF export, stale-score badge, wizard tooltips, lazy render, mobile responsive, role=img/aria-label/reduced-motion

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 3877 → **4883 LOC** (+1006)
- `dashboard/js/app.js`: +20 (D3)
- `dashboard/js/frontier-compare.js`: +117 (D1)
- `dashboard/js/sovereign.js`: +174 (D2)
- `dashboard/js/modal.js`: stale-badge function + 3 callsites (E3)
- `dashboard/js/agent.js`: +PDF button (B4)
- `dashboard/methodology.html`: NEW 352 LOC
- `dashboard/css/print.css`: NEW 127 LOC
- `config/model_enrichment.yaml`: +220 lines (A3)
- `resource/zzz_w6a2_edge_slm_2026_05_09_scores.json`: NEW (A2)
- `resource/zzz_w6a4_frontier_agentic_2026_05_09_scores.json`: NEW (A4)

**병렬 작업 패턴**:
- Wave 1 6 에이전트가 6개 독립 파일 → conflict 없이 병렬 진행. D2가 D1+A2 변경을 같은 commit에 번들한 마이너 race 발생.
- Wave 2 4 에이전트가 다른 4개 JS 파일 → 충돌 없음.
- Wave 3 4 에이전트 모두 agent-charts.js NEW 함수 → cache-bust race-aware bumping (q→r→s→t→u, C3가 t 충돌 보고 u로 점프).

**Live deploy**: CI runs `25575571685` (Wave 5 push) + `25575673196` (docs push). 라이브 cache-bust SHA prefix `f1c8df64`. 라이브 JS에서 `renderVendorCoverageMatrix`(3) / `renderTrajectoryReplay`(3) / `renderConfidenceIntervals`(3) / `renderEdgeUtilityScatter`(3) / `requestIdleCallback`(3) / `_ensureAgentChartsStyle`(2) 마커 모두 확인.

**Main 동기화**: `cc88549` (HISTORY.md only, docs-only main rule 준수).

---

## 2026-05-08 (Session 5): Agent menu A+B+C — loader 2-pass + 20 new benchmarks + 3 new widgets + cross-widget brushing

### 11. Agent 탭 다음 라운드 (commits `5a0128b` → `f0a77b9`)

Session 4 batch 직후 사용자가 "A+B+C를 진행해주세요. 동시 작업이 가능하면 병렬 에이전트로 작업해주세요"로 추가 요청. A(loader 견고화 + cross-widget brushing) + B(신규 벤치마크 3개 카테고리) + C(신규 위젯 3개)로 분해. 3-wave 병렬 패턴:

**Wave 1 (4 병렬, 독립 파일)**:
- **A1 Loader 2-pass** (`5a0128b`): `scripts/load_benchmark_scores.py`를 두 단계로 리팩터 — 1) 모든 파일에서 모델/벤치마크 등록, 2) 모든 파일에서 점수 삽입. 파일 순서에 무관하게 FK constraint 통과. CONTRIBUTING.md 신설(74 LOC) — 파일 명명 규칙(`*_scores.json` suffix), 엄격 출처 규칙, JSON 스키마, 로딩 검증법 문서화. Session 4 `cbc1916` 임시 수정의 영구 해결책.
- **B1 Vision-Language agent benchmarks** (`7c8c7e4`): VisualWebArena / Online-Mind2Web / ScreenSpot-Pro / OSCopilot-GAIA / WebShop / VisualAgentBench, 6 benchmarks + 31 scores.
- **B2 Multi-agent collaboration** (`e5447e6`): AgentBench / MetaGPT-Eval / MultiAgentBench 외 3종, 6 benchmarks + 19 scores.
- **B3 Reasoning trace quality** (bundled into `e5447e6`): METR autonomy P50/P80, CoT faithfulness, Apollo scheming oversight subversion/persistence, RewardBench2, ProcessBench-F1 — 8 benchmarks + 39 scores.

**Wave 2 (3 병렬, agent-charts.js NEW 함수)**:
- **C1 Cost Simulator (W12)** (`9a816e1`): 일일 요청 수 / 평균 입출력 토큰 / reasoning toggle 슬라이더 → 모델별 월 비용 ranked 테이블. Sanity: Opus 4.7 = $22.50/일 (예상치와 일치). 348 LOC.
- **C2 Provider Availability Map (W13)** (`edb03e4`): top-25 모델 × 14 클라우드 프로바이더 ECharts heatmap. `config/model_enrichment.yaml`에 22개 새 모델의 `api_providers` 필드 채움 (총 61개 모델 enrichment 보유).
- **C4 Recommendation Breakdown (W14)** (`cb2741a`): "Build Your Agent" 위저드의 각 결과 행에 "Why?" 버튼 추가 → 카테고리별 기여도를 보여주는 horizontal bar chart 모달.

**Wave 3 (controller 직접, 기존 위젯 augment)**:
- **A2 Cross-widget linked brushing** (`f0a77b9`): IIFE 상단에 `_brush.on/off/emit/current` pub/sub 추가. 리더보드 행 hover → W1 Cost Scatter의 매칭 bubble을 `dispatchAction({type:'highlight'})`로 강조 + 행 내 fingerprint 캔버스에 violet ring + scale(1.08) + 행에 violet 틴트. 데이터셋 가드(`brushBound`/`brushSub`)로 재렌더 시 리스너 누적 방지.
- **A3 Pareto frontier 라벨**: `_paretoFrontier()` 결과 model_id를 set으로 모은 후, 프론티어에 있는 bubble만 model 이름 라벨 표시. 약 3-6개 "best-in-class" 마커가 라벨링되고 나머지는 깨끗.

**병렬 작업 흥미점**:
- Wave 1 4개 에이전트는 완전 독립 파일(scripts/, resource/×3)이라 충돌 0건.
- Wave 2 3개 에이전트가 `agent-charts.js` 동시 편집 — 각자 _NEW_ 함수만 추가하는 패턴으로 conflict-free. 각 에이전트가 cache-bust를 다른 letter로 bump.
- Wave 3는 기존 함수 augment라 controller 직접 작업.

**DB delta**:
- 신규 벤치마크: **+20** (855 → 875)
- 신규 점수: **+89** (3343 → 3432)
- API providers 채워진 모델: 39 → **61**

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 2961 → **3877 LOC** (+916, 3 new widgets + brushing)
- `dashboard/index.html`: agent-charts.js cache-bust `?v=20260508o` → `?v=20260508p`
- `scripts/load_benchmark_scores.py`: 1-pass → **2-pass refactor**
- `CONTRIBUTING.md`: NEW (74 LOC)
- `config/model_enrichment.yaml`: 39 → **61** entries with `api_providers`
- `resource/zzz...vl_agent_benchmarks_2026_05_08_scores.json`: NEW (6 benches, 31 scores)
- `resource/zzz...multi_agent_2026_05_08_scores.json`: NEW (6 benches, 19 scores)
- `resource/zzz...reasoning_trace_2026_05_08_scores.json`: NEW (8 benches, 39 scores)

**Live deploy**: CI run `25546781257` (1m42s 성공), 캐시-버스트 SHA prefix `f0a77b92`. 라이브 JS에서 `_brush`(8) / `frontierIds`(3) / `_bubbleWithLabel`(4) 마커 모두 확인.

---

## 2026-05-08 (Session 4): Agent menu A+B+C+E batch — 3 new widgets + polish + data fills

### 10. Agent 탭 종합 보강 (commits `6bbfe57` → `cbc1916`)

이전 세션의 8개 위젯을 ship한 후 사용자 피드백 반영. A(데이터 채우기) + B(위젯 폴리시) + C(새 위젯) + E(housekeeping) 4 카테고리 동시 진행. 9개 병렬 에이전트가 2 wave로 작업:

**Wave 1 (5 병렬, 분리된 파일)**:
- **E1 README** (`6bbfe57`): 14 tabs + 8 widgets 문서화, screenshot embed, CI workflow 노트.
- **E2+E3 Modal** (`3142413`): agent-product 모달에 "Built on: <base model>" 링크 + Devin/Manus 'subscription' 태그.
- **A3 HAL composite** (`d92dd53`): HAL Princeton 9 sub-leaderboard에서 11 모델 cost-controlled aggregate score 추출.
- **A1 Edge SLM** (`97bdbb9`): Phi-4-mini / Gemma 3 / FunctionGemma / Llama 3.2의 BFCL/mobile_actions 점수 6건 (DONE_WITH_CONCERNS — Apple FM, Phi-4 14B는 vendor 미공개).
- **A2 Agent product** (`0488ff3`): Cursor / Devin / Manus / Operator / Mariner / Computer Use / Claude Code 11 신규 점수.

**Wave 2 (4 병렬, agent-charts.js NEW 함수)**:
- **C1 Capability Sankey** (`0f30aef`): 12 모델 → 10 카테고리 → 20 벤치마크 flow. ECharts sankey, 42 nodes / 97 edges.
- **C2 Cumulative SOTA Wins** (`bd73921`): 11 history snapshot 활용한 시간별 SOTA 보유 일수 stacked area.
- **C4 Build Your Agent wizard** (`d70a40c`): 7개 priority slider + 2 toggle → top-10 추천. 374 LOC. Default state top: claude-mythos-preview 350.0.
- **B-polish bundle** (`64cdeec`): 모든 ECharts 위젯에 toolbox (PNG/dataView/restore), 모든 위젯에 ⓘ help icon, W3/W5/W8/C2/C4에 LocalStorage 상태 저장.

**Wave 3 (controller fix)**:
- **CI 로더 버그 수정** (`cbc1916`): W1A/W1B 파일명에 `_scores_<date>_<scores>` 패턴이 있어 로더 glob `*_scores_*.json`이 모델 등록 파일(`*_scores.json`)보다 먼저 처리되어 FK constraint failure. 파일명에서 mid-string `_scores_` 제거.

**병렬 작업 패턴 흥미점**:
- 모든 5+4 = 9 에이전트가 같은 작업 디렉토리(/Users/user/git/cyber)에서 cwd-isolated 모드로 동작.
- agent-charts.js 동시 편집 시 W2B/W2C 에이전트가 다른 에이전트들의 WIP를 stash로 처리 후 자기 작업만 깔끔하게 commit (Python 원자적 rewrite 패턴 사용).
- Race conditions 발생했으나 stash + atomic rewrite로 모두 복구. 최종 commit chain은 깔끔.

**DB delta**:
- 신규 점수: 28 (W1A 6 + W1B 11 + W1C 11)
- agent-products with scores: 1 → **8** (10개 중)
- edge-SLMs with scores: 0 → **5** (9개 중)
- HAL composite: 0 → **11**
- TOTAL scores: 3315 → **3343**
- TOTAL benchmarks: 854 → **855** (+1, swe_bench original)

**파일 deltas**:
- `dashboard/js/agent-charts.js`: 2181 → **2961 LOC** (+780, 3 new widgets + polish)
- `dashboard/js/modal.js`: +69
- `README.md`: 47 → 71 LOC + 1 screenshot
- 4 신규 resource JSON ingest 파일

**라이브 deploy**: gh-pages `7e0cb7e`, cache-bust `?v=cbc19163`. 11개 위젯(8 + Sankey + Cumulative SOTA + Wizard) + leaderboard fingerprints 모두 라이브.

**Deferred (backlog)**:
- B1 Linked brushing (cross-widget 모델 hover→highlight) — 복잡도 높고 ROI 제한적. 각 위젯이 독립적으로 toolbox/info/click-to-modal을 갖춘 상태라 나중에 단계적으로.
- C3 Pareto frontier 시간 애니메이션 — 가격 historical data 부재로 부분 구현만 가능.
- Edge SLM 추가 점수 (Apple FM / Phi-4 14B vendor 미공개) — 외부 publication 대기.

---

## 2026-05-08 (Session 3): Agent menu graphical widgets — 8 ECharts visualisations via parallel agents

### 9. Agent 탭에 8개 그래픽 비교 위젯 추가 (commits `b24fcaf` → `82dcdef`)

기존 텍스트 위주 Agent 탭에 ECharts 기반 그래픽 위젯 8개를 추가. 5개의 병렬 worktree-격리 에이전트가 동시 작업하여 ~60분에 완성.

**구현된 위젯 8개**:
1. **💰 Cost vs Performance Scatter** (`agent-chart-cost-scatter`) — Y=종합 Agent Score, X=$/1M out (log scale), 색=class, 크기=coverage, 보라색 dashed Pareto frontier 라인. 의사결정 도구 1순위 차트.
2. **🔥 Capability Heatmap** (`agent-chart-heatmap`) — Top 20 agents × 12 핵심 벤치마크. red→green 색상 스케일, 정규화된 점수, 클릭 → Modal.showModel.
3. **🕸️ Category Radar** (`agent-chart-radar`) — 카테고리 선택 + top 8 에이전트 체크박스 (최대 5개 동시 overlay). 사용자가 비교할 에이전트를 직접 선택.
4. **⚖️ Frontier vs Agent-Product vs Edge Dot Plot** (`agent-chart-classplot`) — 10개 벤치마크 행마다 3 클래스 best 점수의 점 + 연결선. "scaffolding tax" / "edge gap" 시각화.
5. **⏱️ SOTA Timeline** (`agent-chart-sota-timeline`) — 벤치마크 선택 가능. `data/scores/history/<date>.json` 일별 스냅샷 11일치 활용. SOTA holder 전환 시 색 밴드 변경 + handover 라벨.
6. **📊 Vendor × Benchmark Bubble Matrix** (`agent-chart-vendor-matrix`) — Top 12 벤더 × 10 벤치마크. 버블 크기/색=벤더 best score. viridis 색상 스케일.
7. **🧬 Capability Fingerprint Mini-Radar** — Composite Leaderboard 각 행에 60×60 Canvas2D 4축 (Coding/Web/OS/Tool-use) 마이크로 레이더. 25개 행 = 25개 미니 시그니처.
8. **📈 Score Distribution Violin** (`agent-chart-class-violin`) — Frontier/Agent-Product/Edge 3개 boxplot + horizontal jitter 점들. ECharts custom series 사용. 클래스 간 분포 차이 시각화.

**병렬 작업 패턴 (worktree-격리 에이전트 5명)**:
- Agent A: Widget 1 — `5a44392` (250 LOC body, ~3분)
- Agent B: Widget 2 — `31b7c34` (193 LOC body)
- Agent C: Widget 3+7 — bundled into `f0c18cf` + `cb50c36` (radar 59+~200 helpers, fingerprints 45+~150 helpers)
- Agent D: Widget 4+6 — `cb50c36` (153+168 LOC, vendor canonicalization 포함)
- Agent E: Widget 5+8 — `82dcdef` (8+15 entry + 600 LOC helpers like `_drawSOTATimeline`/`_drawClassViolin`/`_loadHistoryIndex`)

다섯 에이전트가 동시에 같은 파일(`dashboard/js/agent-charts.js`)에 작업했으나 각자 다른 함수를 추가하는 구조라 머지 충돌 없음. 병렬화로 실시간 약 12분 만에 8개 위젯 완성 (직렬이었으면 5-6시간 추정).

**파일 deltas**: `dashboard/js/agent-charts.js` 0 → **2,181 LOC** (신규), `dashboard/index.html` +1 (script tag + cache-bust), `dashboard/js/agent.js` +14 (renderAll 호출 wiring).

**라이브 검증**: Playwright headless 로 `http://localhost:8765/index.html#agent` 접속, 7개 ECharts 캔버스 렌더링 + 25개 fingerprint 미니레이더 + Fingerprint 헤더 모두 확인. DevTools console: 0개 errors (favicon 404 만 — 무관).

**아키텍처 노트**:
- 모든 위젯 mount-point lazy 생성 (`_ensureMountPoint`) → 한 위젯이 실패해도 다른 위젯 무관.
- 데이터 fetch는 promise-cached (`_pricingPromise`, `_loadHistoryIndex`) → 사용자 dropdown 토글 시 재페치 없음.
- 모든 DOM 조작 `createElement`/`appendChild`/`textContent` (security hook 통과). innerHTML 0건.
- ECharts 'dark' 테마 일관 사용 (`Charts._getOrCreate` 팩토리).
- 공유 헬퍼 (`_normalizedScore`, `_categoryCoverage`, `_classColor`, `_modelClass`, `_canonVendor` 등) 8개 위젯이 재사용.

**남은 한계**: Edge SLM 점수 부족 (Cost Scatter 상의 Edge 점이 placeholder `$0.01` 위치, agentic 점수 0건이라 종합 점수 계산에 진입 못 함). Edge 컬럼 데이터는 후속 sweep 필요.

**Cache-bust 최종**: `agent.js?v=20260508g`, `agent-charts.js?v=20260508f`, `modal.js?v=20260508a`. CI 자동으로 `?v=<commit-sha-prefix>` 로 재작성하여 deploy.

---

## 2026-05-08 (Session 2): Agent menu launch + agentic data sweep

### 8. Agent menu — new top-level tab + 28-task plan execution

새로운 `Agent` 탭을 메뉴 바에 추가 (AI4S 와 Explorer 사이). 4개 sub-section 구조:

**4 sub-section UI** (vanilla ES5 + Tailwind dark theme, ~990 LOC `dashboard/js/agent.js`):
- **SOTA Watch** (4 tiles): Top Coder / Top Web Agent / Top OS Agent / Best Defense — 매핑은 swe_bench_verified / browsecomp / osworld_verified / agentdojo_utility
- **Categories** (10 cards, edge spans full row): Coding / Web & Browsing / OS-Computer Use / Tool Use & Function Calling / MCP / Customer Service / Domain (cross-listed Medical/AI4S) / Safety (lower-better marked) / General/Composite / On-device-Edge
- **Compare** (3-column dropdown-switchable): Frontier (general-purpose) / Agent Products / On-device-Edge — switches across SWE Verified / SWE Pro / Terminal-Bench 2.0 / OSWorld-V / GAIA / TAU2 / BFCL v4 / Mobile Actions / MobileAgentBench
- **Composite Leaderboard** (top 25): normalized agent_score across all agentic benchmarks, coverage threshold ≥3, safety ASR/jailbreak rows inverted (lower-better)

**Modal extension**: 2 new `scale_class` badges added — `agent-product` (amber `🛠️ Agent product`), `edge-slm` (green `📱 Edge SLM`).

**Data deltas (Tasks 10-23)**:
- 14 new agentic benchmarks: aider_polyglot, swe_lancer, mle_bench, usaco, appworld, hal_overall_accuracy_at_fixed_cost, mobile_agent_bench, mobilebench_v2, mobilebench_xiaomi, mlperf_mobile_llm, mlperf_inference_edge_v5_1, mlperf_tiny_v1_2, tinyml_energy_v1, function_gemma_calling
- 19 new model_ids registered (10 agent-product wrappers: Claude Code/Codex CLI/Cursor Composer/Replit Agent/Devin/Manus/Computer Use/Mariner/Operator/Cowork; 9 edge-SLMs: Apple FM 3B+Private Cloud/Phi-4+mini/Gemma 3-270M+3n+Function/Llama 3.2 1B+3B)
- 10 retag candidates upgraded to `scale_class: edge-slm` in `model_enrichment.yaml` (Phi-4, Jamba 1.5/1.6/1.7/2 mini, Jamba2 3B, Qwen 1.5/2.5 7B, Qwen3 8B, OLMo 2 7B)
- 24 new score rows via Playwright + WebFetch primary-source extraction: USACO 8 (HAL Princeton) / GAIA 5 (HAL) / Aider Polyglot 7 (aider.chat) / Claude Code SWE-Verified 87.6 (Anthropic) / Codex CLI SWE-Verified 85.0 + Terminal-Bench 82.0 + SWE-Pro 56.8 (OpenAI/Scale SEAL)
- 20 Resources entries added (11 agent leaderboards + 9 on-device sites): HAL Princeton (4 sub-leaderboards) / AA Coding Agents / BenchLM Agent / AI Agent Square / Rapid Claw Framework Scorecard / MorphLLM Coding Agents / Helicone Manus / Phil Schmid Compendium / MobileAgentBench / Xiaomi Mobile-Bench / MLCommons MLPerf Mobile/Tiny/Edge / Google AI Edge LiteRT-LM / Apple ML / HuggingFace SmolLM / Local AI Master SLM Guide

**Edge utility metrics file** (`config/edge_models_utility.json`): 9 SLM entries with size_gb / battery_pct_per_25_conversations citations from primary sources (Apple ML, HuggingFace, Google blog "Pixel 9 Pro 0.75% per 25 conversations").

**Strict-attribution applied throughout**: every score row has model_id + benchmark_id + value visible in cited primary source. Anonymized AISI joint-testing scores excluded. SWE-bench self-reporting concerns flagged in benchmark notes.

**DB final state**: benchmarks 842 → **854** (+12 net), models 1096 → **1114** (+18), scores 3261 → **3315** (+54). Coverage gap warning eliminated for all 72 hardcoded benchmark IDs in `agent.js CATEGORIES`.

**14 commits** (`079cac2` → `f34d77c`) — see `git log --oneline 3559b5d..f34d77c` for the chronological build sequence.

---

## 2026-05-08: AA Intelligence Index sweep + Resources tab refresh + ZAYA1/PhysForge daily ingest + AISI 13건 reference 보강

### Session overview
오늘 세션은 (1) ZAYA1-8B (Zyphra MoE on AMD) + PhysForge (HKU 3D physical-AI) 2건 daily-sweep ingest, (2) 4개 reference leaderboard (artificialanalysis.ai, lmarena.ai/arena.ai, livebench.ai, eqbench.com) Resources 탭 description 보강 + EQ-Bench Creative Writing Longform 신규 등록, (3) artificialanalysis.ai top-25 leaderboard 에서 AA Intelligence Index 신규 점수 10건 ingest, (4) 6개 기존 AISI(US/UK/JP/SG/KR/CN) reference description 갱신 + US AISI → CAISI URL 교체, (5) 7개 신규 AISI(호주/캐나다/CIFAR/프랑스 INESIA/인도/EU AI Office/Network mission) Resources 탭 등록, (6) 6개 AISI 1차 출처 문서(Joint Testing 보고서/Synthetic Content Research Agenda/GPAI Code of Practice/UK 연구 agenda + Year in Review) 추가로 구성됨.

### 1. AA Intelligence Index 5/8 sweep (commit `c577b4f`)
artificialanalysis.ai/leaderboards/models top-25 를 직접 fetch 해서, DB에 model 은 있지만 `aa_intelligence_index` 점수가 없던 10개에 대해 strict-attribution 으로 점수 추가:

| Rank | Model | Score |
|------|-------|-------|
| 4 | google/gemini-3.1-pro (Gemini 3.1 Pro Preview) | 57 |
| 8 | openai/gpt-5.3-codex (GPT-5.3 Codex xhigh) | 54 |
| 10 | meta/muse-spark | 52 |
| 12 | alibaba/qwen3.6-max-preview | 52 |
| 13 | anthropic/claude-sonnet-4.6 (Sonnet 4.6 max) | 52 |
| 14 | deepseek/deepseek-v4-pro-max (V4 Pro Max) | 52 |
| 15 | zhipu/glm-5.1 | 51 |
| 17 | alibaba/qwen3.6-plus | 50 |
| 19 | zhipu/glm-5 | 50 |
| 20 | minimax/m2.7 | 50 |

기존 5건(gpt-5.5 60, claude-opus-4.7 57, mimo-v2.5-pro 54, kimi-k2.6 54, grok-4.3 53.2) 은 leaderboard 값과 일치하므로 그대로 유지. `aa_intelligence_index` 커버리지 8 → 18 (+10).

**다른 reference 사이트의 한계**: lmarena.ai (→ arena.ai 리디렉트), livebench.ai/#/, eqbench.com/creative_writing_longform.html 모두 client-side React/Vue 로 leaderboard table 을 렌더링 → WebFetch 는 빈 헤더만 반환. 강한 추출은 browser automation 필요. Resources 탭 discovery link 로 유지하되 자동 ingest 는 보류.

### 2. Resources 탭 + seed_sources.yaml 보강 (commit `e1b323b`, `13c37a9`)
4개 reference 사이트에 대해 description 을 기능적으로 보강:
- **Chatbot Arena (lmarena.ai → arena.ai)**: redirect 노트 + 모달리티/scoring 설명 추가
- **Artificial Analysis Leaderboard**: "356+ models, 4-axis Intelligence/Speed/Cost/Context ranking" 명시
- **LiveBench (livebench.ai)**: 6 categories, monthly refresh, contamination-free 강조
- **EQ-Bench Creative Writing Longform**: 신규 등록 (1 entry, paragraph-level analytical writing 평가)

`config/seed_sources.yaml` 에 EQ-Bench, LiveBench(refreshed), AA Leaderboard 3건 등록.

### 3. ZAYA1-8B + PhysForge daily sweep (commit `9f5929f`)
2026-05-06 ~ 05-08 window 에서 strict-attribution 으로 검증된 2건:
- **Zyphra ZAYA1-8B (MoE, 2026-05-06)**: 8.4B total / 760M active, AMD 하드웨어 전용 학습, Markovian RSA test-time compute 도입. 8개 점수 (AIME 2026: 89.1, HMMT 2026: 71.6, HMMT 2025: 89.6, IMO-AnswerBench: 59.3, LiveCodeBench-v6: 65.8, GPQA-Diamond: 71.0, MMLU-Pro: 74.2, IFEval: 85.58)
- **HKU MMLab PhysForge (2026-05-06)**: VLM physical-architect + physics-grounded diffusion (KineVoxel Injection), PhysDB 150k assets, ICML 2026 — `scale_class=agent-system` 로 등록.

Frontier Compare 메뉴 `FRONTIER_MODELS` 에 zaya1-8b 추가.

### 4. Frontier Compare + Cyber & Coding 메뉴 propagation
AA Intelligence Index 데이터로 점수 커버리지가 확장된 모델 중 menu 누락분 보강:
- **Frontier Compare**: `anthropic/claude-sonnet-4.6` 추가 (Sonnet 4.6 max — 36개 score 보유, opus 와 함께 비교 가능)
- **Cyber & Coding**: `deepseek/deepseek-v4-pro-max` 추가 (24개 score, 코딩계열 reasoning 비교)
- `qwen3.6-max-preview` 는 AA 점수 단 1건뿐이라 menu propagation 보류.

cache-bust: `frontier-compare.js?v=20260508b`, `cyber-coding.js?v=20260508a`

### 5. AISI Resources 탭 13건 신규/갱신 (commits `c6cc9fc` / `a210daa` / `d386060`)

기존 등록되어 있던 6개 AISI(US/UK/JP/SG/KR/CN) description 을 구체적 최근 작업 기준으로 갱신하고, 누락된 7개 AISI 와 6개 1차 출처 문서를 추가했습니다.

**기존 AISI 6건 갱신** (`c6cc9fc`):
- **US AISI → US CAISI**: 2025년 중반 정부 개편으로 NIST 산하 "Center for AI Standards and Innovation" 으로 재명명. URL `nist.gov/artificial-intelligence/ai-safety-institute` → `nist.gov/caisi`. 새 활동: Google DeepMind/MS/xAI Frontier 사전배포 평가 합의(May 2026), DeepSeek V4 평가(May 2026), AI Agent Red-Teaming Competition(Mar 2026), AI Agent Standards Initiative, OpenMined 보안 평가 파트너십.
- **UK AISI Blog**: 최근 6편 게시물(MS 파트너십 May 5/GPT-5.5 사이버 평가 Apr 30/Mythos 사이버 평가 Apr 13/OpenClaw sandboxed-agent recon/sycophancy 감소/alignment-sabotage 평가) 명시.
- **Japan AISI**: AI Safety Annual Report 2025 (Apr 28), Known Attacks and Their Impacts EN/JP (Apr 24), FY2025 Conformity Assessment SWG (Apr 23) 반영.
- **Singapore AISI**: International Joint Testing(3JT), 다국어 LLM 평가 (UK+Japan), AI 에이전트 데이터 유출 테스트(Korea), SCAI 2025 + Singapore Consensus 추가.
- **Korea AISI**: URL `/eng` → `/kor` (사용자 지정), 4개 트랙 명시.
- **China AISI** (3건): 변경 없음 (이미 충분).

**신규 AISI 7건** (`a210daa`) — International Network of AI Safety Institutes 10개 창립 멤버 100% 커버리지 달성:
| AISI | URL | 메타 |
|------|-----|------|
| Australia AISI (DISR) | industry.gov.au | A$30M, 2026 초 운영 시작 |
| Canada AISI / CAISI Canada (ISED) | ised-isde.canada.ca | C$50M/5y, NRC 연구팀 + CIFAR |
| CAISI Research Program (CIFAR) | cifar.ca/ai/caisi | 2026 calls: interpretability/robustness/cyber-misuse |
| France INESIA | inria.fr | ANSSI+LNE+PEReN+Inria 4-org federation, 2026-2027 roadmap |
| India AISI (IndiaAI MeitY) | indiaai.gov.in | 2025-01-30 발표, 7-Sutras 프레임워크 India AI Impact Summit 2026 |
| EU AI Office | digital-strategy.ec.europa.eu | GPAI 의무 2025-08-02, high-risk 2026-08-02 |
| AISI International Network Mission | ised-isde.canada.ca | 10개 창립 멤버, Vancouver 2nd convening Jul 2025 |

UAE는 별도 국가 AISI 없음 → MBZUAI Institute of Foundation Models는 LLM 연구소(국가 안전 평가 기관 X), 기존 TII Falcon 등록으로 충분 → 추가 보류.
Kenya는 Network 멤버이나 독립 사이트 미존재 → Network mission entry 로 커버.

**AISI 1차 출처 6건** (`d386060`):
- 3rd Joint Testing Exercise — Agentic Eval Report (sgaisi.sg, Jul 17 2025) — Singapore lead 누출/사기 + UK lead 사이버보안, ~1500 tasks/1200 tools, Cybench+Intercode 사용. **모델 익명화 (A-F)** 으로 strict-attribution 규칙상 점수 적재 불가; pass rate 만 공개 (~57% / ~35% leakage, 23%/28% judge discrepancy). 9개 AISI 참가.
- Synthetic Content Research Agenda (DISR + ISED 공동, Jul 14 2025) — AI 생성 합성 콘텐츠 위험 연구 의제.
- GPAI Code of Practice 최종본 (code-of-practice.ai, EU AI Office Jul 10 2025) — 전체 signatory: Anthropic / Google / IBM / Microsoft / OpenAI / Amazon / Mistral / Aleph Alpha. xAI는 Safety & Security 챕터만 부분 서명. **Meta 미서명** (2026-01 기준).
- GPAI Signatory Taskforce.
- UK AISI Research Agenda.
- UK AISI 2025 Year in Review — 30+ frontier 모델 평가, self-replication 벤치마크, sandbagging 탐지, 76K 참가 설득력 연구 (Science 발표).

**Strict-attribution rule 적용 결과**: 신규 모델 0건, 신규 벤치마크 점수 0건. AISI joint testing 보고서가 모델명을 의도적으로 익명화하기 때문. 새 점수 적재는 불가능했으나 **메타데이터 layer (1차 출처 reference)** 로는 13건 모두 가치 보존됨.

Resources 탭: 404 → 417 entries. seed_sources.yaml 일치.

### 6. Playwright sweep — LiveBench / EQ-Bench / Arena 46 점수 ingest (commit `7568163`)

이전 5/8 sweep 에서 client-side rendered table 때문에 WebFetch 로 추출 불가했던 3개 leaderboard 를 Playwright headless browser 로 직접 렌더링해서 strict-attribution 으로 ingest:

- **LiveBench Global Average** (기존 `livebench`): top 30 frontier 모델 중 DB 매핑 가능한 20개. 1위 GPT-5.5 80.71 / 2위 GPT-5.4-thinking 80.28 / 3위 Gemini 3.1 Pro 79.93 / Claude Opus 4.7 76.91 / Sonnet 4.6 75.47 / DeepSeek V4 Pro 73.58 / Kimi K2.6 72.17 / GLM-5.1 70.18 / Grok 4.20 67.96 / Grok 4.3 66.74 / Minimax M2.7 63.49 등.
- **EQ-Bench Creative Writing Longform** (NEW 벤치마크 `eq_bench_creative_writing_longform`): top 10 등록. 1위 Claude Opus 4.7 81.8 / Sonnet 4.6 79.9 / Kimi K2.6 78.5 / GPT-5.4 78.3 / GPT-5.5 78.2 / Opus 4.6 77.7 / DeepSeek V4 Pro 75.6 / Kimi K2.5 74.9 / GLM-5.1 73.5 / Opus 4.5 73.1.
- **Arena Text** (기존 `lmarena` — lmarena.ai → arena.ai 리브랜딩): top 10 → unique 8개. Opus 4.7-thinking 1503 / Opus 4.6-thinking 1502 / Gemini 3.1 Pro 1492 / Muse Spark 1490 / Gemini 3 Pro 1486 / GPT-5.5 1484 / Grok 4.20 1480 / GPT-5.2 1477.
- **Arena WebDev** (기존 `webdev_arena`): top 10 → unique 8개. Opus 4.7 1570 / Opus 4.6 1549 / GLM-5.1 1531 / Sonnet 4.6 1524 / Kimi K2.6 1523 / Muse Spark 1509 / GPT-5.5 1491 / Opus 4.5 1490.

Variant convention: 다중 effort/thinking 변형이 있는 경우 모델별 highest variant 선택 (기존 80.3/79.9/76.3 이 LiveBench top-effort 와 일치하는 관행 따름).

DB delta: benchmarks 887 → 888 (+1), scores 3508 → 3554 (+46).

Vision Arena 와 Search Arena 는 별도 신규 benchmark 등록 + 이름 매핑 필요로 다음 sweep 으로 보류.

### 7. Playwright sweep R2 — cc:TODO 부분 closure + Arena V/S + MRCR v2 + LiveBench backlog (commit `4f6e06e`)

Plans.md "Next Steps" 의 cc:TODO 항목 4건 + 오늘 sweep 의 deferred 항목 2건을 일괄 처리:

**신규 벤치마크 3건**:
- `arena_vision_elo` — arena.ai Vision Arena Elo
- `arena_search_elo` — arena.ai Search/grounding Arena Elo
- `mrcr_v2_8needle` — OpenAI MRCR v2 8-needle (1M long-context retrieval)

**신규 점수 30건**:
- Arena Vision Elo: 7 (Opus 4.7 thinking 1305 / Opus 4.6 1300 / Muse Spark 1298 / Gemini 3 Pro 1288 / GPT-5.5 1288 / GPT-5.2 1279 / Gemini 3.1 Pro 1277)
- Arena Search Elo: 10 (Opus 4.6-search 1255 / GPT-5.5-search 1235 / Opus 4.7 1233 / Sonnet 4.6-search 1221 / Gemini 3.1 Pro grounding 1218 / GPT-5.2-search 1213 / Gemini 3 Pro grounding 1210 / Grok 4.20 1209 / Gemini 3 Flash grounding 1208 / Grok 4.3 1205)
- MRCR v2 8-needle: 7 (Opus 4.6 93.0 / GPT-5.5 74.0 / Gemini 3.1 Flash-Lite 60.1 / GPT-5.4 mini 33.6 / Gemini 3 Pro 26.3 / Gemini 3.1 Pro 26.3 / Gemini 3 Flash 22.1)
- LiveBench backlog: 6 (GPT-5.1 Codex Max 73.98 / Gemini 3 Flash 72.40 / GPT-5 Pro 70.48 / Sonnet 4.5 68.19 / GPT-5.4 mini 67.54 / GPT-5 mini 65.91)

**cc:TODO 상태 업데이트**:
- ✅ MRCR v2 8-needle: closure
- ⚠️ Video-MME: Playwright 렌더링 성공 (technical block 해제) 했으나 leaderboard 가 2025-09 까지로 stale. 2026 frontier 모델 미반영 → BLOCKED on external publication 그대로
- ❌ HarmBench / StrongREJECT / AIR-Bench: 2026 frontier 점수 미발견 (이전 sweep 과 동일)
- ❌ MMAU: 2026 frontier 점수 미발견
- ✅ UK AISI Cyber Expert tier: 이미 DB 적재 (verified — gpt-5.5 71.4 / mythos 68.6 / gpt-5.4 52.4 / opus 4.7 48.6 on aisi_advanced_expert_avg)

DB final delta (오늘 세션 누적): benchmarks 839 → 842 (+3 today, +4 this session if EQ-Bench Longform counted from earlier), distinct scores 3261 → 3291 (+30 this round).

### Reproducibility
```bash
python scripts/load_benchmark_scores.py resource/zzzz...aa_intelligence_2026_05_08_scores.json
python -m cyber export
python scripts/audit_version_date_consistency.py   # 0 contradictions
```

---

## 2026-05-06: AI4S menu + nuclear/energy expansion + open-weight curation + non-FM scale_class

### Session overview
하루 동안 5개 영역 작업: (1) AI4S(AI for Science) 신규 메뉴 + 배경 데이터 적재 + 6개월 업데이트 + reference 사이트, (2) 모델 detail link 일괄 enrichment, (3) open-weight 모델 검증 (실제 weight 공개 여부), (4) 비-FM(narrow ML, agent system, dataset, tool) 메타데이터 분류, (5) 모달 UI에 scale_class 배지 표시.

### 1. AI for Science (AI4S) 메뉴 신설 + 모델 적재 (commit `2829449`)
text LLM 중심 dashboard를 13개 foundation model 카테고리로 확장. 93개 신규 모델 + 8개 sub-category:

| 카테고리 | 핵심 |
|---------|------|
| 🧪 Co-Scientist (10) | Google AI Co-Scientist, Sakana AI Scientist v1/v2/DGM, FutureHouse PaperQA2-Crow/Falcon/Owl/Phoenix, Stanford Virtual Lab (Nature 2025 SARS-CoV-2 nanobodies), LBNL A-Lab |
| 📐 Math / Formal Proof (15) | DeepMind AlphaProof + AlphaGeometry-2 (IMO 2024 silver), DeepSeek-Prover V1.5/V2 671B+7B, Goedel-Prover V2 32B+8B (Princeton+Tsinghua), HunyuanProver, Llemma 7B+34B, OpenMath2-70B, MathFusion, ReProver, Lean-STaR, InternLM2-Math/StepProver, Gemini Deep Think IMO 2025 gold |
| ⚗️ Chemistry (8) | ChemDFM 13B/v1.5-8B, ChemBERTa-2/3, Recursion MolE (Nature Comm), ChemGPT, MolGen, Chemformer, RoboChem (Nature), Uni-Mol V2 |
| 🔭 Astronomy (7) | AstroLLaMA, AstroPT (DESI galaxy stamps), AstroM3 tri-modal, Polymathic AION-1/AstroCLIP/Multimodal-Universe (100TB), AstroNN-Stars |
| ⚛️ Physics / Materials (15) | MACE-MP, Orb v1/v2, DPA-2, EquiformerV2, UMA OMat24, MatterGen + MatterSim (Microsoft), GNoME (Nature), CHGNet, M3GNet, NequIP, AlphaQubit (Nature), Polymathic Multiple-Physics + The-Well |
| 🌍 Earth / Climate (11) | Microsoft Aurora (Nature 2025), Pangu-Weather, GraphCast, GenCast (Nature 2024), ECMWF AIFS-1.0, FuXi, FengWu, ClimaX, IBM-NASA Prithvi WxC + EO-2.0, ClimateGPT |
| 🧬 Bio / Genomics (16) | Arc Evo 1/2 (40B+7B 1Mb-context), Baker Lab RFdiffusion + RoseTTAFold-AA + RFdiffusion-AA, SaProt 650M+1.3B, ProtGPT2, GenSLMs (Gordon Bell), scGPT (Nature Methods), Nucleotide Transformer, HyenaDNA, Caduceus, AlphaMissense (Science), AlphaGenome, Chai-2 |
| 🌐 Multi-disciplinary (2) | Galactica 30B+120B (Meta) |

UI: tab between Medical AI and Explorer, 8 summary tiles + category filter + search, cards grouped by category sorted by release_date desc, click→Modal.showModel.

### 2. AI4S 확장 — 원자력/에너지/양자화학 등 11 sub-categories (commit `4e772a2`)
84개 신규 모델 (8 → 19 sub-categories):

| 신규 카테고리 | 모델 수 | 핵심 |
|------|------|------|
| ☢️ Nuclear / Fusion (15) | DeepMind TORAX (JAX tokamak transport), TCV plasma RL (Nature 2022), TCV rampdown (Nat Comm 2025), PPPL Diag2Diag/ELM/Plasma-Heating, KFE+DIII-D Tearing RL (Nature 2024), AHU XiHeFusion, Proxima ConStellaRation, MIT-CFS, INL+NVIDIA Prometheus |
| ⚡ Energy / Grid / Battery (16) | ECMWF AIFS Single/Ensemble, ETH+IBM GAIA Power Dispatch, IBM GridFM, NREL eGridGPT, EnergyGPT 8B, EF-LLM, PowerGraph-LLM, PBT Battery Transformer, TRI D3BATT, IBM-NASA Surya 1.0 (366M heliophysics) |
| 🔬 Quantum Chemistry / DFT (11) | DeepMind FermiNet/Psiformer/DM21, FU Berlin PauliNet, Princeton NeuralXC, Caltech OrbNet + Entos Denali, U.Florida ANI-1ccx/2x, CMU AIMNet2, NVIDIA PhysicsNeMo |
| ✨ Cosmology / Particle Physics (5) | Simons CAMELS (4,233 sims), MIT AI Feynman, ATLAS+CMS CERN anomaly detection, Polymathic Walrus 1.3B |
| 🌋 Geosciences / Seismology (5) | Stanford EQTransformer + PhaseNet, USTC SeisCLIP, Tsinghua Seismic FM, GEM-3D |
| 💨 Atmospheric Chemistry (5) | Juelich+CERN AtmoRep 3.5B, ECMWF AIFS-COMPO, Zeeman ML-CTM, ECCC EnsAI, PCDC-Net |
| 💧 Hydrology / Water (3) | Google+JKU NeuralHydrology, Google Caravan, Fine Flood FM |
| 🌾 Agriculture / Plant (13) | AgriGPT, AgriGPT-VL, MBZUAI AgroGPT, InstaDeep AgroNT, PlantRNA-FM, scPlantLLM, NASA Harvest GeoCIF/ARYA/VeRCYe, ORNL APPL/GPGP |
| 💊 Pharma / Drug Discovery (4) | Recursion Phenom-Beta, Isomorphic Iso-DDE, Insilico Chemistry42 |
| 🤖 Lab Automation (3) | CMU Coscientist (Nature 2023), ChemCrow, ANL protein-design FM |
| ➕ Co-Scientist 추가 | AuroraGPT (Argonne exascale), Khanmigo (pedagogy) |

기존 카테고리 보강: ORNL ORBIT 113B + ORBIT-2, Helmholtz HClimRep, Polymathic Walrus 1.3B.

### 3. AI4S 6개월 업데이트 (commit `15e496f`)
2025-11-01 ~ 2026-05-06 윈도우 신규 24 모델 + 16 벤치마크 + 10 점수:

- **Climate**: WeatherNext 2 (Google, 8x faster), Aurora Open full weights (Microsoft), AIFS 1.1.0 (ECMWF)
- **Nuclear**: TORAX-CFS 파트너십, TokaMind (UKAEA+IBM, MAST tokamak FM)
- **Energy**: GridFM v0.5 (IBM+LF Energy)
- **Math**: **Goedel-Prover V2 32B (88.1%/90.4% MiniF2F, ICLR 2026)**, **Gemini 3 Deep Think (gold IMO/ICPC/IPhO/IChO)**
- **Bio/Pharma**: BoltzGen 1 (MIT), AneWomni 2026, NVIDIA RNAPro/ReaSyn v2
- **Materials**: Orb v3 (10-40x faster), ALCHEMI TorchSim, AlphaChip 2026 open checkpoint, GR00T N1.5/N1.7, Cosmos-Transfer 2.5
- **Time-series**: TimesFM 2.5 (16384 context, 60% smaller)

신규 벤치마크: Physical AI Bench (NVIDIA), WxC-Bench (NASA+IBM), AI AgriBench (UIUC), TokaMark (UKAEA), DisruptionBench (MIT PSFC), MOFSimBench, AgriBench-13K, MiniF2F, IMO 2025, ICPC 2025, IPhO/IChO 2025, AIFS 1.1↑1.0, AlphaGenome 24-task/26-task.

### 4. AI4S Reference 사이트 36개 추가 (commit `f8fbe1f`)
9개 도메인의 leaderboard / benchmark / dataset / DOE national lab 사이트:
- Math: MathArena (ETH 라이브), MiniF2F GitHub, PutnamBench, OlympiadBench, IMO-Bench (DeepMind ProofBench), OlympicArena
- Materials: Matbench Discovery, Matbench v0.1, Open Catalyst Project, FAIR Chemistry, GuacaMol, MoleculeNet, Open Reaction Database
- Bio: CASP Prediction Center, ProteinGym, PDB Statistics
- Climate: WeatherBench 2 (Google+ECMWF 라이브), ECMWF AIFS Blog/Charts, Microsoft Aurora GitHub
- Robotics: RoboArena (DROID Elo), LIBERO, RoboCasa 365, NVIDIA Cosmos
- Astronomy/Cosmology: Polymathic AI, MultiModalUniverse, DESI, SDSS
- Particle Physics: LHC Olympics 2020, ML4Jets, Dark Machines
- Nuclear: DisruptionBench, DisruptionPy
- Aggregators: SciArena (Allen AI Elo), Papers with Code, HF Papers, DOE Office of Science, Argonne ALCF, ORNL AI

dashboard Resources 탭 + config/seed_sources.yaml 양쪽 등록.

### 5. 모델별 1차 출처 링크 enrichment (commits `16e333b`, `df3bdb1`, `3eb6d73`)
175개 AI4S 모델에 `links.{huggingface, github, paper, blog, model_card, system_card, homepage}` 7-필드 enrichment 추가. 모달이 자동 인식하여 컬러 코딩된 Reference Links 버튼으로 표시.

이후 4-pass deep audit:
- Pass 1 (이전): 75 링크 + 66 reclassify
- Pass 2 (`curate_open_links_v2.py`): Major-vendor 329 모델 verified URL +352 fields
- Pass 3 (extension): Arcee Trinity, EleutherAI Polyglot-Ko, Physical Intelligence Pi-Zero, OpenMEDLab, Audio family, Video gen, Time-series, Tabular +86 fields
- Pass 4 (long-tail): Cohere Aya, Databricks DBRX, Bowang MedSAM, ELYZA Med, AI Singapore SEA-LION v4, JMedLLM +33 fields
- Pass 5 (reclassify): paper-only academic 109건 → proprietary
- Pass 6 (cleanup): 마지막 2개 outlier 수작업

**최종 100% open-weight 모델 HF/GitHub 커버리지 달성** (이전 27%):
- proprietary 500 (46%) / open-weight 485 (44%) / open-weights 85 (8%) / open-source 23 (2%)
- Open w/o HF/GitHub: **0개** (이전 511)

### 6. 비-FM `scale_class` 메타데이터 + 모달 배지 (commit `d3ce2f2`)
사용자 audit 발견: 1,093개 dashboard 항목 중 ~127개가 large-scale LLM/FM이 아님 (narrow specialty network, agent system, dataset, simulator/tool, benchmark baseline, product wrapper 등). 사용자가 Option A(메타데이터 표시) 선택.

`scripts/tag_non_fm_class.py` — 216개 항목을 22개 카테고리로 태깅:

| 분류 | 개수 | 라벨 |
|------|-----|------|
| classical-ml | 21 | 🔬 Classical ML (M3GNet 250K, NequIP 1M, MACE, CHGNet, Orb v1/v2/v3, ChemBERTa) |
| narrow-encoder | 17 | 🎨 Narrow encoder (CONCH, UNI2, TITAN, Virchow2, Prov-GigaPath, RAD-DINO, RETFound) |
| narrow-segmentation | 15 | ✂️ Narrow segmentation (MedSAM, SAM-Med2D/3D, SAM 1/2.1/3/3D) |
| agent-system | 15 | 🤖 Agent system (AI Co-Scientist, Sakana AI Scientist, ChemCrow, FutureHouse) |
| product-wrapper | 15 | 🏷 Product wrapper (Khanmigo, Harvey, CoCounsel, Runway/Kling/Pika/Luma/Sora) |
| narrow-timeseries | 11 | 📈 Narrow time-series (TimesFM, Chronos, Lag-Llama, Moirai, MOMENT) |
| classical-bert | 10 | 📚 Classical BERT (BiomedCLIP, BioGPT, PubMedBERT, ClinicalBERT, BioBERT, GatorTron) |
| benchmark-baseline | 9 | 🎯 Benchmark baseline (CheXpert, MIMIC-CXR, MedPerf-FETs, MedHallu) |
| narrow-tts | 7 | 🔊 Narrow TTS (Kokoro, Spark-TTS, CosyVoice 2/3, ChatTTS, F5-TTS) |
| robotics-policy | 7 | 🤖 Robotics policy (Octo, OpenVLA, Pi-Zero/0.5, RDT-1B) |
| dataset | 6 | 📦 Dataset (MultiModalUniverse, CAMELS, The Well, MPP) |
| dft-functional | 4 | ⚛️ DFT functional (DM21, NeuralXC, OrbNet) |
| analysis-pipeline | 4 | 🔬 Analysis pipeline (ATLAS/CMS CERN, Fermilab Genesis) |
| simulator-tool | 3 | 🛠 Simulator/Tool (TORAX, PhysicsNeMo) |
| wavefunction-net | 3 | ⚛️ Wavefunction net (FermiNet, PauliNet, Psiformer) |
| small-mlp-potential | 3 | ⚛️ Small MLP potential (ANI-1ccx/2x, AIMNet2) |
| rl-search-system | 3 | 🔍 RL-search system (FunSearch, AlphaChip, GNoME) |
| hydrology-lstm | 3 | 💧 Hydrology LSTM (NeuralHydrology, Caravan) |
| roadmap | 3 | 🗺 Roadmap (placeholder) |
| narrow-task | 24 | 🎯 Narrow task (RFdiffusion, RoseTTAFold-AA, AlphaFold 2/3, Boltz, EQTransformer, FLUX.1) |
| narrow-tabular | 2 | 📊 Narrow tabular (TabPFN v2/2.5) |
| qec-decoder | 2 | 🧊 QEC decoder (AlphaQubit) |
| audio-codec / symbolic-regression / human-baseline | 1+1+1 | 🎙 ∑ 👤 |

**모달 UI 변경**: `_renderHeader`가 enrichment.scale_class를 읽어 amber 배지로 표시. Frontier FM (GPT-5.5, Claude, Llama 등)은 배지 없음 (clean default).

라이브 검증 8개 sample 전부 정확:
- cmu/coscientist → 🤖 Agent system
- deepmind/torax → 🛠 Simulator/Tool
- meta/sam-3 → ✂️ Narrow segmentation
- prior-labs/tabpfn-v2 → 📊 Narrow tabular
- google/timesfm-2.5 → 📈 Narrow time-series
- simons-flatiron/camels → 📦 Dataset
- stanford/eqtransformer → 🎯 Narrow task
- khan-academy-openai/khanmigo → 🏷 Product wrapper
- openai/gpt-5.5 → (no badge — frontier FM)

### 데이터 규모 증분 (Day-of-day, 5/5 종료 → 5/6 종료)
| 항목 | 5/5 | 5/6 | 증가 |
|------|------|------|------|
| 모델 | 893 | **1,093** | +200 |
| AI4S 카테고리 | 0 | **19 sub-categories** | NEW |
| AI4S 모델 | 0 | **177~200** | NEW |
| Resource sites | 311 | **347** | +36 (모두 AI4S leaderboards) |
| Enrichment 항목 | 130 | **305** | +175 |
| 1차 링크 보유 모델 | ~32 | **593 (100% open)** | +561 |
| Open w/o HF/GitHub | 511 | **0** | -511 |
| Type 분포 | 64% open | 54% open / 46% proprietary | 109 reclassify |
| scale_class 태깅 | 0 | **216** | NEW (22 categories) |
| Version-vs-date 모순 | 0 | **0** | 유지 |

### 커밋 시퀀스 (2026-05-06)
- `2829449` AI4S 메뉴 신설 + 93 모델 + 8 sub-categories
- `4e772a2` AI4S 11 sub-categories 추가 (nuclear/energy/quantum-chem 등 +84 모델)
- `15e496f` AI4S 6-month updates (+24 모델 +16 benchmarks +10 scores)
- `f8fbe1f` AI4S Resource 사이트 36개 추가
- `16e333b` 175 AI4S 모델 enrichment 1차 링크
- `df3bdb1` 67 mis-classified open→proprietary + 75 HF/GitHub 링크 보강
- `3eb6d73` 4-pass open-weight 100% 커버리지 달성 (1093 → 0 missing)
- `d3ce2f2` 비-FM scale_class 배지 시스템 (216 entries × 22 categories)

---

## 2026-05-05: 13-category foundation expansion + Timeline infographic + version-vs-date audit + partial-date v6

### Session overview
하루 동안 7개 영역에서 데이터·코드·시각화 작업을 동시에 진행. Text LLM 중심 dashboard를 13개 foundation 카테고리(audio/video/3D/VLM/VLA/reasoning/diffusion-LM/code/math/medical/legal/bio/time-series/tabular)로 확장하고, Timeline 메뉴에 카드형 인포그래픽 + 다운로드 기능을 추가. 사용자가 발견한 GPT-5.1/5.2 출시일 모순을 시작점으로 전수 audit 자동화 수행.

### 1. Foundation model 13개 카테고리 확장 (commit `a4e063e`)
이전까지는 text LLM 중심이었던 dashboard를 95개 신규 모델로 비-text foundation까지 cross-category 비교 가능하게 확장. 모든 entry는 1차 출처 검증.

| 카테고리 | 신규 | 핵심 모델 |
|---------|-----|----------|
| 🎙️ Audio/Speech | 16 | ElevenLabs v3, Voxtral Small/Mini, Step-Audio R1/EditX, Moshi+Mimi, Sesame CSM-1B, ChatTTS, F5-TTS, Kokoro, Spark-TTS, CosyVoice 2/3, Whisper-v3-turbo |
| 🎬 Video Gen | 16 | Sora 2, Veo 3/3.1, Kling 2.0/2.5/2.6, HunyuanVideo 1.5/I2V, Wan 2.1/2.2, Mochi 1, CogVideoX 5B/1.5, Pika 2.2, Runway Gen-4/4.5, MiniMax Video-01/Hailuo 02, Luma Ray 2, Pyramid Flow |
| 🌐 3D/World | 9 | SV4D 2.0, TRELLIS/TRELLIS.2, Hunyuan3D 2/2.1, DUSt3R+MASt3R, Depth-Anything v2, Marigold v1.1, VGGT |
| 👁️ VLM | 12 | Molmo 7B-D, Janus-Pro, Pixtral 12B/Large 124B, LLaVA-OneVision, Qwen2.5-VL/Omni, Qwen3-VL/Omni, InternVL 2.5/3.5 |
| 🧠 Reasoning | 10 | DeepSeek-R1, Qwen3-Thinking 235B/30B/4B, Magistral Small, Skywork-OR1, GLM-Z1, Doubao 1.5 Pro, Phi-4-reasoning-vision |
| 🌊 Diffusion-LM | 1 | Mercury Coder |
| 💻 Code | 6 | Qwen2.5/3-Coder, Devstral 2, Granite 34B Code, Seed-Coder, Doubao Seed-Code |
| ➗ Math | 4 | Qwen2.5-Math, NuminaMath 7B/72B, DeepSeek-Math V2 |
| 🩺 Medical | 3 | HuatuoGPT-o1 72B/8B, Med42 v2 70B |
| ⚖️ Legal | 2 | Harvey Protégé, CoCounsel Legal |
| 🧬 Bio/Protein | 5 | AlphaFold-3, Boltz-1/2, ESM-3 98B, Chai-1 |
| 📈 Time-series | 8 | Chronos-T5/Bolt/2, TimesFM 2.5, Lag-Llama, Moirai, MOMENT |
| 📊 Tabular | 2 | TabPFN v2 / 2.5 |

### 2. Timeline 메뉴 카드형 인포그래픽 추가 + skill 저장 (commits `0307724` → `d57d534`)
사용자 스펙: 가로 16:9, 월별 컬럼, 좌→우 시간 진행, 카드형 이벤트 표시, 정확한 버전명 필수, 모호한 표현 금지. ECharts 산점차트에서 hand-rolled SVG 인포그래픽으로 완전 재구성.

**최종 구현:**
- **SVG 동적 viewBox**: 16:9 base 1920×1080, 카드 수에 따라 너비/높이 확장 (6개월 3064×1490, 12개월 7132×2030)
- **월별 가변 너비**: 1~14건 280px / 15~28건 566px / 29~42건 852px / 43+건 1138px (sub-column fan-out)
- **모든 카드 빠짐없이 렌더**: `+N more` truncation 0 (114/114, 12개월 모드 223/223)
- **카드 4-코너 레이아웃**: 좌상 logo / 우상 MM.DD / 본문 모델명+벤더 / 좌하 license pill / 중하 country / 우하 28×28 flag tile (24px emoji)
- **국가 매핑 보강**: Sakana(JP), Kakao Healthcare(KR), Arcee/Inception(US), Fractal(IN) prefix 추가
- **컨테이너 스크롤 0**: `overflow:hidden` + SVG `width:100%` + viewBox 비례 축소로 좁은 viewport에서도 모든 카드 visible
- **다운로드 3종**: PNG (2x raster, ~3840×2030 native) / SVG (vector ~79KB) / CSV (release_date,model_id,name,vendor,country,type)
- **Footer attribution**: `Author: Jonghong Jeon · hollobit@etri.re.kr` + `Source: https://hollobit.github.io/SOTA/#timeline · data verified against vendor blogs, llm-stats.com, HuggingFace model cards` + `Generated YYYY-MM-DD`
- **Skill 저장**: `~/.claude/skills/timeline-infographic/skill.md` + 프로젝트 `.claude/skills/` 미러 — 13개 hard rules + 5단계 구현 절차 + 7-point Playwright 검증 체크리스트 + 9개 anti-patterns 문서화

### 3. Version vs date contradiction 자동 audit + corrections v5 (commit `70b7ceb`)
사용자 발견: GPT-5.1(2025-11-13) 보다 GPT-5.2(2025-11-10)가 먼저인 모순. 전수 audit 스크립트 작성.

`scripts/audit_version_date_consistency.py` — model_id를 `(family, version_tuple, variant)`로 파싱, 같은 family/variant 그룹에서 version 오름차순 vs date 오름차순 일치 여부 검사. 4건 모순 발견:

| # | 진단 | 조치 |
|---|------|------|
| 1 | gpt-5.1 (11-13) > gpt-5.2 (**11-10**) | gpt-5.2 → **2025-12-11** ([OpenAI 공식](https://openai.com/index/introducing-gpt-5-2/), Code Red Gemini 3 대응); gpt-5.1 → **2025-11-12** |
| 2 | gpt-4.1 vs gpt-4.5 | OpenAI 비순차 명명 (4.5 Orion이 먼저) — 사실, whitelist |
| 3 | nemotron-3-340b (2025-08) vs nemotron-4-340b (2024-06) | nemotron-3-340b → **2025-12-15** (family 발표일) + whitelist |
| 4 | grok-4.3 vs grok-4.20 | xAI 농담 명명 (420 meme이 먼저) — 사실, whitelist |

추가 partial date 보강 (8건): gpt-3.5-turbo-0125/0301/0613, gpt-4(2023-03-14), gpt-4-0125-preview, gpt-4-turbo-2024-04-09, gpt-5-nano(2025-08-07), **gpt-5.4-mini(2026-03-17)** (5.4 base 12일 후, OpenAI release notes).

**최종 결과: 0 contradictions** (54 versioned groups). KNOWN_NONSEQUENTIAL whitelist에 3개 vendor의 정당한 비순차 명명 inline 문서화.

### 4. Partial-date v6 — 77건 YYYY-MM → YYYY-MM-DD (commit `d57d534`)
audit으로 230개 partial-date 항목 발견. 검증 가능한 77개를 정확한 일자로 업그레이드:

- **Meta**: Llama 2 7B/13B (2023-07-18), Llama 3 8B/70B (2024-04-18), SAM 1 (2023-04-05), SAM 2.1 (2024-09-30), SAM 3/3D (2025-11-19)
- **Anthropic**: Claude 2.1 (2023-11-21), Claude 3 Sonnet (2024-03-04)
- **Google**: Gemini 1.0 Pro (2023-12-06), Gemini 1.5 Pro (2024-02-15), Gemini 2.5 Flash (2025-04-09), Gemma 7B (2024-02-21), MedGemma 9B/27B (2025-05-20), Med-PaLM 1/2, PH-LLM, Tx-LLM, Med-Gemini-L-1
- **DeepMind**: AlphaFold 2 (2021-07-15 Nature), AlphaFold 3 (2024-05-08), AlphaFold Server (2024-11-13)
- **Alibaba/Qwen**: Qwen 1.5 7B/32B/72B (2024-02-04), Qwen 2.5 32B/72B (2024-09-19), Qwen3-30B, Qwen3.5-397B-A17B
- **Amazon**: Nova Micro (2024-12-03 re:Invent)
- **Medical foundation**: Meditron 7B/70B, HuatuoGPT-II/Vision, RETFound, Clinical Camel, Med-Flamingo, MedAlpaca, PMC-LLaMA, DoctorGLM, Apollo 2B/6B/7B/MedLM-7B, MedSAM 1/2, SAM-Med2D/3D, H-Optimus, CONCH, UNI2, Virchow2, OpenBioLLM 8B/70B, BioMistral, Med42 v1/v2, BiomedCLIP, BioGPT, LLaVA-Med, PubMedBERT, ClinicalBERT, BioBERT, BlueBERT, GatorTron, MolFormer, BiomedLM-2.7B

남은 153건: 주로 specialty medical/research 모델 (명확한 public release 이벤트 없음, YYYY-MM 자체가 best signal).

### 5. May 2026 weekly batch (commit `0de4888`)
2026-05-01~05 윈도우는 frontier 모델 출시 공백기 — llm-stats / aiflashreport / mean.ceo / HF Daily Papers 모두 0건 확인. 유일한 backfill: **Inception Mercury 2** (2026-04-23, diffusion-based parallel-token reasoning, 1009 tok/s on Blackwell, 128k ctx) + 신규 벤치마크 **MemRouter** (arxiv 2605.00356, LoCoMo conversational memory routing).

### 6. ThinkPol AI Coding Contest + NIST CAISI evaluation (commit `696e86e`)
2개 1차 출처 보고서로 51개 신규 점수:

**(1) ThinkPol Word Gem Puzzle**: 오픈웨이트 Kimi K2.6가 frontier closed 모델들을 제치고 우승. 9개 모델 ranking + cumulative 77 (Kimi 1위) + AA Intelligence Index (GPT-5.5: 60, Opus 4.7: 57)

**(2) NIST CAISI DeepSeek V4 Pro 평가**: DeepSeek V4 Pro vs GPT-5.5/5.4-mini/Opus 4.6 9개 차원 평가, IRT Elo composite. 핵심 결론: DeepSeek V4 Pro lag ~8개월. 신규 벤치마크 7개 (ctf_archive_diamond, portbench, arc_agi_2_semi_private, pumac_2024, ai_coding_contest_word_gem/cumulative, irt_capability_elo) + 신규 모델 2개 (xai/grok-expert-4.2, deepseek/deepseek-v4 base).

### 7. Trinity family 정확한 메타데이터 + 4 benchmark scores (commit `e8accab`)
사용자 제공 링크 (arcee.ai blog + arxiv 2602.17004)로 placeholder `trinity-large-thinking`을 5개 정확한 entries로 교체:
- arcee/trinity-large-preview/base/truebase (2026-01-27, 400B/13B-active sparse MoE 256 experts × 4 active, 17T tokens, 2048 B300 GPU × 33일, $20M)
- arcee/trinity-mini (26B/3B-active, 2026-02-19)
- arcee/trinity-nano (6B/1B-active, 2026-02-19)

벤치마크 점수 4건 (Trinity Large Preview vs Llama-4-Maverick): MMLU 87.2, MMLU-Pro 75.2, GPQA-Diamond 63.3, AIME-2025 24.0.

### 8. National attribution 5건 수정 (commit `e75e4fe`)
사용자 지적: vendor → country 매핑 오류. timeline.js `VENDOR_TO_COUNTRY`에 prefix 추가:
- `sakana/` → 🇯🇵 Japan (이전엔 sakanaai만 매핑)
- `kakao-healthcare/` → 🇰🇷 Korea
- `arcee/` `arcee-ai/` → 🇺🇸 USA
- `inception/` `inceptionlabs/` → 🇺🇸 USA
- `fractal/` `fractalanalytics/` → 🇮🇳 India

DB vendor 라벨도 `(Country)` suffix 정규화 (Sakana AI (Japan), Arcee AI (USA) 등).

### 데이터 규모 증분 (Day-of-day)
| 항목 | 시작 (5/4 종료) | 종료 (5/5) | 증가 |
|------|---------------|-----------|------|
| 모델 | 795 | **893** | +98 |
| 벤치마크 | 855 | **863** | +8 |
| 점수 | 3,369 | **3,424** | +55 |
| 출시일 보유 | 757 | ~880+ | +120 (포함 partial→exact upgrade) |
| Partial date (YYYY-MM only) | 230 | 153 | -77 (정확한 일자로 업그레이드) |
| Version-vs-date 모순 | (검사 안됨) | **0 / 59 그룹** | audit 자동화 |
| Foundation 카테고리 커버 | text+VLA | **13개** | +12 카테고리 |

### 커밋 시퀀스 (2026-05-05)
- `0de4888` May 2026 daily sweep + Mercury 2 + MemRouter
- `696e86e` ThinkPol coding contest + NIST CAISI evaluation (51 scores)
- `e8accab` Arcee Trinity family proper entries + 4 benchmarks
- `70b7ceb` Version vs date audit script + 11 corrections (GPT-5.2 한 달 오류 등)
- `0307724` → `0d8a9e7` → `02138d5` → `029cb3b` → `a89f5b8` Timeline 인포그래픽 진화 (column-card → 가변 너비 → 큰 국기 → 4-코너 → 스크롤 제거 → 저자/출처 footer → #timeline anchor)
- `1ba0d4a` Timeline 인포그래픽 skill 저장
- `a4e063e` 13개 foundation 카테고리 95개 모델 신규
- `e75e4fe` Sakana/Kakao Healthcare/Arcee/Inception/Fractal 국가 매핑
- `d57d534` Partial-date v6 — 77건 YYYY-MM → YYYY-MM-DD

---

## 2026-05-04: May 2026 batch + release_date backfill (635→757) + type misclassification fix + Trends repair

### Session overview
하루 동안 5개 영역에서 데이터·코드·UX를 동시 개선. 사용자가 발견한 두 개의 잠재 회귀(Trends 빈 화면, sovereign type 오분류)는 모두 silent 회귀 — 누적 데이터 인제스트가 일으킨 것이지 비즈니스 변화가 아님.

### 1. May 2026 weekly batch (commit `a85f078`)
신규 모델 7개·벤치마크 3개·점수 38개 추가. 모두 1차 출처 검증.

| 항목 | 출처 | 비고 |
|------|------|------|
| Qwen3.6-Max preview (Alibaba) | qwen.ai/blog | 1M context MoE flagship |
| Hunyuan HY3 preview (Tencent) | arena.ai changelog | frontier-tier |
| GLM-5V Turbo (Zhipu) | arena.ai changelog | vision variant of GLM-5.1 |
| ERNIE 5.1 preview (Baidu) | arena.ai changelog | text |
| MiMo-v2 Omni (Xiaomi) | arena.ai changelog | text+image+audio |
| Grok 4.3 (xAI) | arena.ai changelog | multimodal |
| Trinity Large Thinking (Arcee) | arena.ai changelog | ~400B reasoning open-weight |
| HealthBench Professional (OpenAI) | cdn.openai.com | 525 clinician tasks |
| DoctorBench LLM (Diagens) | pharmiweb release | LLM/VLM/Agent 3 tracks |
| REBench | arxiv 2604.27319 | reverse engineering |

신규 점수 38개: DeepSeek V4 Pro Max(12 benches from HF card), Qwen3.6-27B(10 benches), Claude Opus 4.7(9 benches via Vellum), GPT-5.5/Pro(3 benches via Vellum), Kimi K2.6(AA Intelligence Index).

### 2. Release date backfill: 361 → 757 (+396, 95.2%) (commits `4bfa970`, `a85f078`, `4c3b33f`, `368e9ec`)
출시일 보유율을 4단계 작업으로 45.7% → 95.2%로 끌어올림. 검증 출처: `llm-stats.com/models/<slug>` per-model 페이지, vendor blog 발표일, HuggingFace upload timestamp, arxiv paper 날짜.

| 단계 | 추가 | 누적 | 커버리지 | 핵심 카테고리 |
|------|------|------|---------|--------------|
| v1 (기존) | — | 361 | 45.7% | 90 popular flagship |
| v2 | +121 | 482 | 61.1% | GPT-5.x family, Claude 4.x, Grok 1/3/4/4.20, Llama 4 Scout/Maverick, DeepSeek family, Qwen3 + 3.6, Kimi K1.5/K2/K2.6, Mistral Large/Medium/Small/Devstral/Magistral/Codestral, Phi-4, GLM-4.5/4.6, Hunyuan-Large/T1/Turbo, Baichuan-2/3/4/M1/Omni, ERNIE 4.5, EXAONE 3.0/3.5/4.0/Deep, HyperCLOVA-X, Solar 10.7B/Pro/Pro2, SmolLM, Yi 1.5 |
| v3 | +153 | 635 | 79.9% | Mythos preview (2026-04-07 Project Glasswing), Opus 4.6, GPT-4.5/o4-mini/5.2-pro/5.3-codex, Llama 3.2 family, Mistral 7B/Mixtral/Nemo/Saba/Pixtral/Mathstral/Codestral-Mamba/Ministral/Voxtral, QvQ-72B/QwQ-32B/Qwen3.5-27B/122B/397B, GLM-4.7/5/5.1, MiniMax M2.5, ByteDance Seed 1.5/1.6/2.0, AI21 Jamba 1.0~1.7+Reasoning+Maestro, IBM Granite 3.1~3.3, TII Falcon Mamba+3+H1, Stability AI 전체, Black Forest FLUX.1+Kontext, Allen AI OLMo-2/Tulu-3/Molmo, Naver HyperCLOVA-X SEED, KT Mid-m, Kakao Kanana/KoGPT, LG EXAONE 4.0.1/Atelier, Yandex YaLM/GPT-4/5, Sber GigaChat 2.x, Sarvam-1/M, Krutrim, AI Singapore SEA-LION |
| v4 | +122 | 757 | **95.2%** | Pi-Zero/0.5/Pi-Zero-Fast/RDT-1B, GR00T N1/1.5/1.6, Cosmos Reason 1/2 + Predict 1/2.5, Figure Helix, 1X World Model, Tesla Optimus VLM, Genie 2/3, Gemini Robotics ER 1.5/1.6, Devstral Small 2, Ministral 3 family, Jamba 2 (Jamba2-Mini/3B), Step 2/3.5, Huawei Pangu 5/Embedding/Ultra-MoE, iFlytek Spark 4/X1, SenseTime SenseNova v6, BAAI Aquila 2/Wudao 2, Skywork R1V-3, TNG R1T/R1T2 Chimera, Aleph Alpha Luminous/Pharia 1/2, Lucie-7B, CroissantLLM, PleIAs, AI4Bharat 전체, BharatGen Param 1/2, Sarvam 30B/105B, Krutrim Spectre, MBZUAI K2/Atlas/BiMediX, DICTA Lm 2/3, Samsung Gauss 2, SKT A.X 4.0, NCSoft VARCO, Kanana 2 Thinking/Flag, Motif/Trillion, T-Bank, Siemens SIFM/Autodesk Bernini/PTC/Dassault/AVEVA, EPFL Meditron/HuatuoGPT-II/FoxBrain, Sakana Namazu, Bloomberg GPT, Llama 4 Behemoth |

남은 38개는 commercial-only product, roadmap entry, 비공개 specialty(Harvey/Vincent/Oliver/Riiid/Lunit/VUNO/JioBrain/Maitri 등).

### 3. Sovereign AI 모델 type 오분류 일괄 수정 (commit `b338b24`)
사용자 보고: "대부분의 소버린 AI 모델이 open weight에서 proprietary로 바뀌었다." 진단 결과 비즈니스 변화가 아니라 **데이터 인제스트 누적 회귀** — 354개 sovereign 모델 중 321개(90.7%)가 잘못 proprietary로 표시.

**근본 원인 (2개 결함의 결합):**
- `scripts/load_benchmark_scores.py:54`의 `m.get("type", "proprietary")` 디폴트
- `cyber/db/schema.py:106`의 `INSERT OR REPLACE INTO models` (UPSERT 아님)
- 누적 효과: ~30개 score batch가 매번 type을 `proprietary`로 silent overwrite

**수정:**
1. **Stop the bleed**: loader가 type 미지정시 기존 DB 값 보존
2. **Heal existing**: `scripts/reclassify_model_types.py` 신규 — per-model override + pattern rule + vendor default 3계층 룰로 489건 수정
   - 339건 `proprietary → open-weight` (silent flips 복구)
   - 8건 `open-weight → proprietary` (정확화: Solar-Pro/2/3, MiMo-v2-flash/pro, Konan, GigaChat 3 등)
   - 140건 표기 정규화

| 분류 | 이전 | 이후 |
|------|------|------|
| proprietary | 511 | 255 (-256) |
| open-weight | 64 | 379 (+315) |
| open-weights | 220 | 161 |

검증된 spot check: Qwen3.6-27B / DeepSeek V4 Pro / Kimi K2.6 / EXAONE 4.0 / Mistral 7B / Llama 4 Scout / Gemma 3 27B / Hunyuan-Large / ERNIE 4.5-300B / GLM-4.6 / HyperCLOVA-X Think / Mid-m 2.0 / Solar Mini → all `open-weight`. Solar Pro 3 / GPT-5.5 / Claude Opus 4.7 / Gemini 3 Pro / Grok 4 / GLM-5.1 / A.X 4.0 / HyperCLOVA-X → all `proprietary`. Grok 1 → `open-weight` (xAI 2024-03 release).

### 4. Trends 메뉴 그래프 미렌더링 픽스 (commits `7eecf5b`, `8216c42`)
사용자 보고: "여전히 Trends의 그래프들이 안보인다." Playwright로 라이브 진단.

**원인 1 — Silent JS 에러로 후속 차트 모두 abort:**
`App.data.pricing`은 `aa_pricing.json` 재구성 이후 **model_id 키의 object**로 export되는데, `_renderPricingChart`가 `.filter()`를 호출 → `TypeError: pricing.filter is not a function`. 이 에러가 `renderTrends()` 후속 호출(`_renderSotaHighlights`, `_renderTrendOverview`, `_renderSOTATrend`)을 모두 abort. 결과: sota-changelog와 correlation-chart만 보이고 나머지는 모두 빈 화면.
- 수정: object → array 정규화, `output → price_per_1m_output` 키 변환

**원인 2 — 조건부 차트 기본 빈 상태:**
trend-chart, radar-chart, heatmap-chart는 `#trend-benchmark` 드롭다운 선택시에만 렌더되는데 기본값이 빈 문자열. 첫 방문자는 항상 placeholder만 봄.
- 수정: 벤치마크 옵션을 score-coverage 내림차순 정렬 + 첫 항목(`gpqa_diamond`) 자동 선택

**보강 (commit `7eecf5b`)**: `Charts._getOrCreate`에 ResizeObserver + post-init RAF resize 추가, `_activateTab`에 double-RAF 패턴으로 grid layout 안정화 보장.

라이브 검증 결과: 7개 차트(SOTA Trend / Model Rankings / Category Radar / Cross-Benchmark Heatmap / Correlation / Pricing / Trend Overview) + SOTA Highlights 리스트 모두 정상 페인트.

### 5. Timeline 메뉴 출시일 / 시스템 등록일 분리 (이전 commit `4bfa970`)
사용자 지적: 모델 공개일과 시스템 등록일은 다른 의미인데 같이 사용하고 있음. Timeline은 모델 공개일 기준으로 정렬해야 함.
- `scripts/extract_enrichment_from_notes.py`: `release_date_inferred` → `system_registered_date` 필드 rename (filename date는 우리가 등록한 날짜이지 모델 출시일이 아님)
- `dashboard/js/timeline.js`: `_getReleaseDate()`는 `model.release_date` 또는 `released_at`만 반환 (fallback 제거). `_getSystemRegisteredDate()` 별도 메서드 신설. 두 컬럼 표시 — primary(실제 출시일) + secondary(`+YYYY-MM-DD` 회색 italic, 시스템 등록일).
- `dashboard/js/modal.js`: misleading "Released (inferred)" 행을 "시스템 등록일" 별도 italic 행으로 분리.

### 데이터 규모 증분 (Day-of-day)
| 항목 | 시작 | 종료 | 증가 |
|------|------|------|------|
| 모델 | 789 | **795** | +6 |
| 벤치마크 | 852 | **855** | +3 |
| 점수 | 3,331 | **3,369** | +38 |
| 출시일 보유 | 361 | **757** | +396 |
| 출시일 커버리지 | 45.7% | **95.2%** | +49.5pp |
| open-weight 모델 | 64 | **379** | +315 |
| proprietary 모델 | 511 | **255** | -256 |

### 커밋 시퀀스
- `4bfa970` Timeline release_date / system_registered_date 분리
- `a85f078` May 2026 weekly batch (7 models, 3 benches, 38 scores)
- `4c3b33f` Release date v3 backfill (+153)
- `368e9ec` Release date v4 backfill (+122, 95.2%)
- `7eecf5b` Trends ResizeObserver + double-RAF
- `8216c42` Trends pricing TypeError + auto-select default benchmark
- `b338b24` Sovereign AI type 오분류 489건 수정 + loader bug fix

---

## 2026-04-25: Sovereign AI menu + Physical AI / World Models (7 batches)

### Sovereign AI dashboard menu (NEW)
2026년 frontier 경쟁의 새 axis — **언어 적응 · 의료 시스템 통합 · 정부 정책 정합** — 을 frontier-only metric과 구분하여 비교하는 신규 메뉴 추가.

- **위치**: `dashboard/index.html` 신규 섹션 `tab-sovereign` + `dashboard/js/sovereign.js`
- **구조**:
  - **Region Map (11 cards)**: Korea / China / Japan / India / Israel / UAE / Singapore / Switzerland / US-Legal / US-Finance / DARPA AIxCC — 각 카드에 vendor·model name·type badge·sovereign 메타데이터.
  - **Dimension panels (3)**: Language Adaptation · Medical System Integration · Government / Regulated Domain — 각 차원 별로 sovereign 모델 top-6 vs frontier baseline (Claude/GPT-5.5/Gemini/Muse Spark) top-3 비교 막대 차트 + 표.
  - **Cross-region heatmap**: 각 region 대표 모델 × 전체 sovereign 벤치마크 union — 셀 클릭 시 검증 소스/이력 모달.
- **시각 설계**: sovereign 모델은 채도 높은 `Theme.series`, frontier reference는 `Theme.textMuted` + 0.55 opacity + border 처리하여 sovereign value gap을 시각적으로 표시.
- **Click handlers**: 모든 점수 셀 → `Modal.showScoreSource(modelId, benchId)`, 모델명 → `Modal.showModel(modelId)`. Heatmap은 ECharts `chart.on('click')`로 동일 모달 라우팅.

### Physical AI / World Models batch
NVIDIA Cosmos World Foundation Models, GR00T 휴머노이드 VLA, DeepMind Genie 3, Physical Intelligence Pi-Zero, OpenVLA-7B, AgiBot Genie Envisioner — 11개 모델, 7개 벤치마크.

| Benchmark | SOTA | Score |
|-----------|------|-------|
| LIBERO (4-suite avg) | NVIDIA Cosmos Policy | 98.5% |
| RoboCasa (50 demos) | NVIDIA Cosmos Policy | 67.1% |
| World Model FPS | DeepMind Genie 3 | 24fps @ 720p |
| World Model Consistency | DeepMind Genie 3 | ~180s (3x Genie 2) |

### 데이터 규모 증분
| 항목 | 2026-04-25 (이전) | 2026-04-25 (현재) | 증가 |
|-----|-------------|-------------|----|
| 모델 | 96 | **128** | +32 |
| 벤치마크 | 203 | **224** | +21 |
| 점수 | 1,045 | **1,087** | +42 |
| SOTA | 172 | **186** | +14 |
| 모니터링 소스 | 75+ | **84+** | +9 |

---

## 2026-04-25: Regional + Mistral lineup expansion (4 batches)

### Session Overview
After daily monitoring sweep confirmed no new frontier launches between Apr 23 → Apr 25, four sequential batches added regional and domain-specialized models that the dashboard had been ignoring.

### Batch summary
| 배치 | 신규 모델 | 신규 벤치마크 | 신규 점수 | PDFs |
|-----|--------|-----------|---------|-----|
| Daily sweep | 0 | 0 | 0 | — |
| Regional v1 | 11 | 8 | 16 | 0 |
| Regional v2 | 2 | 21 | 51 | 2 (MedGemma TR + 1.5 TR) |
| Mistral lineup | 13 | 4 | 22 | 0 |
| **합계 (4/24 → 4/25)** | **+26** | **+33** | **+89** | **+2 PDF** |

### 신규 모델 (지역/도메인별, 26개)
- **France (Mistral, 16개)**: Large 3, Small 4, Magistral Small/Medium 1.2, Devstral 2, Devstral Small 2/Medium/Small 1.1, Codestral 25.08, Pixtral Large, Voxtral TTS, Mistral Medium 3.1, Small 3.2, Ministral 3 14B/8B/3B
- **Google Medical (3개)**: MedGemma 27B, MedGemma 4B-PT, MedGemma 1.5 4B + Gemma 3 27B/4B baselines
- **UAE TII (2개)**: Falcon-H1 Arabic 34B (hybrid Mamba-Transformer), Falcon Perception 600M
- **Japan Sakana (1개)**: Namazu (alpha)
- **Singapore AI Singapore (2개)**: Apertus-SEA-LION v4 8B-IT, Gemma-SEA-LION v4 4B-VL

### 신규 벤치마크 33개 (5 카테고리)
- **의료**: medqa, medmcqa, pubmedqa, mmlu_med, medxpertqa, afrimed_qa, ehrqa, mimic_cxr_f1, chexpert_f1, dermmcqa, vqa_rad
- **수학**: math_500, amc_23, aime_24, gsm8k
- **추론**: arc_challenge, truthfulqa, hellaswag, ifeval, bbh, mtbench, alpaca_eval_v2
- **코딩**: mbpp, mbpp_plus, humaneval_plus, cruxeval, repobench
- **멀티모달**: mathvista_mini, mmbench_en, ai2d, docvqa, chartqa, vqav2

### 새 SOTA Highlights
- **MedQA**: MedGemma 27B 87.7% (Gemma 3 27B 74.9% baseline)
- **MIMIC-CXR**: MedGemma 27B Multimodal 90.0 F1
- **DocVQA**: Pixtral Large 93.3 ANLS
- **AI2D (BBox)**: Pixtral Large 93.8%
- **HellaSwag**: Falcon-H1 34B 81.94% (size class SOTA)
- **MATH-500**: Mistral Large 3 93.60%
- **MedXpertQA**: MedGemma 27B 25.7%
- **SWE-Verified (open-weight)**: Devstral 2 72.2%

### CI / Infrastructure
- **Auto cache-bust**: `?v=$BUILD_SHA[:8]` rewriting in publish step — no more manual JS version bumps after every JS change
- **2 PDFs saved**: MedGemma TR (2.7 MB) + 1.5 TR (3.7 MB)
- **5 deploy fixes during session**: 2 FK violations resolved with self-contained batch declarations; CDN cache TTL accommodated via cache-bust query strings
- **3 Resources/Changelog menu syncs** (per memory rule)

### 데이터 규모 증분
| 항목 | 2026-04-24 종료 | 2026-04-25 종료 | 증가 |
|-----|-------------|-------------|----|
| 모델 | 70 | **96** | +26 |
| 벤치마크 | 170 | **203** | +33 |
| 점수 | 956 | **1,045** | +89 |
| SOTA | 140 | **172** | +32 |
| 모니터링 소스 | 67 | **75+** | +8 |

---

## 2026-04-24: Frontier Model Refresh (GPT-5.5, Kimi K2.6, Qwen3.6-27B/35B-A3B)

### Session Overview
4개 신규 URL 소스를 기반으로 frontier 모델 4개 · 벤치마크 9개 · 점수 48개를 추가 ingest.
Primary sources: `deploymentsafety.openai.com/gpt-5-5/introduction`, `qwen.ai/blog?id=qwen3.6-35b-a3b`, `llm-stats.com/llm-updates`, `platform.kimi.ai/docs/guide/kimi-k2-6-quickstart`.

### 추가된 모델
| 모델 | 벤더 | 릴리스 | 타입 | 점수 수 |
|-----|-----|-------|-----|------|
| GPT-5.5 | OpenAI | 2026-04-23 | proprietary | 9 |
| GPT-5.5 Pro | OpenAI | 2026-04-23 | proprietary | 2 |
| Kimi K2.6 | Moonshot AI | 2026-04-20 | open-weight (multimodal) | 16 |
| Qwen3.6-27B | Alibaba | 2026-04-22 | open-weight (dense, multimodal) | 13 |
| Qwen3.6-35B-A3B | Alibaba | 2026-04-16 | open-weight (MoE) | +8 (backfill) |

### 추가된 벤치마크 (9개)
`healthbench_professional` (reasoning) · `toolathlon` (agent) · `mcpmark` (agent) · `qwen_web_bench` (agent, ELO) · `nl2repo` (coding) · `android_world` (agent) · `vlms_are_blind` (multimodal) · `realworldqa` (multimodal) · `skills_bench` (agent)

### 주요 Frontier 비교 하이라이트
- **Kimi K2.6 vs GPT-5.4 xhigh vs Claude Opus 4.6 max vs Gemini 3.1 Pro thinking high**: AIME 2026 96.4, SWE-Verified 80.2, BrowseComp 83.2 (swarm 86.3)
- **GPT-5.5 cyber**: CTF 85% pass@12 · Cyber Range 93.33% (14/15) · CyScenarioBench 26% (+17pt vs GPT-5.4) · UK AISI 32-step corporate attack 1/10 solved
- **Qwen3.6-27B dense breakout**: SWE-Pro 53.5 > Qwen3.5-397B-A17B's 50.9 (dense 27B outperforms 397B MoE)

### 데이터 규모 증분
| 항목 | 2026-04-18 | 2026-04-24 | 증가 |
|-----|----------|----------|----|
| 모델 | 63 | 67 | +4 |
| 벤치마크 | 95 | 126 | +9 (+22 pre-existing reload) |
| 점수 | 721 | 797 | +76 |
| SOTA | 78 | 96 | +18 |
| 웹 소스 | 26 | 34 | +8 |

### 파일 변경 내역
- `resource/frontier_2026_04_24_scores.json` — 신규 배치 파일 (4 모델 + 9 벤치마크 + 48 점수)
- `config/seed_sources.yaml` — 8 신규 모니터링 소스 등록
- `Plans.md`, `HISTORY.md` — 세션 기록

---

## 2026-04-17: Cybersecurity/Coding/Agent Benchmark Expansion

### Session Overview
Frontier 모델들의 사이버보안 공격/방어 능력, 코딩 능력, 에이전트 능력을 종합 평가하기 위한 벤치마크 데이터 수집 및 대시보드 확장 작업.

### Phase 1: 최신 벤치마크 데이터 수집
- 주요 리더보드(LLM Stats, Vellum, Artificial Analysis, Chatbot Arena, ARC Prize, LM Council)에서 최신 점수 수집
- 새 모델 9개 추가: GPT-5.3 Codex, GPT-5.4 mini, Muse Spark, GLM-5/5.1, Step-3.5-Flash, MiMo-V2-Pro, DeepSeek V3.2 Speciale, Grok-4.20
- 새 벤치마크 2개 추가: HLE (Humanity's Last Exam), ARC-AGI-2
- DB 재로드 + export + 대시보드 확인 완료

### Phase 2: Cyber & Coding 탭 신설
- `dashboard/js/cyber-coding.js` 생성 — 4축 뷰 (Attack / Defense / Coding / Agent)
- 사이버보안 공격 벤치마크 6개: Cybench, CVE-Bench, CyberGym, EVMbench Exploit/Detect, AIRTBench
- 사이버보안 방어 벤치마크 3개: AutoPatchBench, CyberSOCEval, ZeroDayBench
- 코딩 벤치마크 4개: SWE-bench Verified/Pro, Terminal-Bench 2.0, LiveCodeBench
- 에이전트 벤치마크 4개: OSWorld-Verified, GAIA, BrowseComp, TAU-bench
- 바 차트 + 데이터 테이블 + 레이더 차트 + 벤치마크 설명 패널 구현
- `App.data` 참조 버그 수정 (데이터 로딩 타이밍 이슈)

### Phase 3: BMT 카탈로그 연결 및 시드 소스 확장
- BMT (Benchmark Library) 2,559개 엔트리에서 97개 사이버보안 관련 벤치마크 식별
- `bmt_loader.py`에 12개 사이버보안/코딩 벤치마크 매핑 추가
- `config/seed_sources.yaml`에 시드 소스 13개 추가 (Wiz Cyber Model Arena, EVMbench, AIRTBench, CyberSecEval 4, CyberSOCEval, Cybench, CyberGym, OSWorld, GAIA, BrowseComp, TAU-bench, METR, BaxBench)

### Phase 4: PDF System Card / Model Card / 논문 분석
8개 PDF에서 벤치마크 데이터를 병렬 에이전트로 완전 추출:

| PDF 문서 | 추출 벤치마크 수 |
|---------|-------------|
| Claude Opus 4.6 System Card (Feb 2026) | 27개 |
| GPT-5.3-Codex System Card (Feb 2026) | 13개 (CTF 88%, CVE-Bench 90%, Cyber Range 80%) |
| Claude Mythos Preview System Card (Apr 2026) | 5개 (Cybench 100%, CyberGym 83%, Firefox 147 84%) |
| Gemini 3 Pro Model Card (Nov 2025) | 22개 벤치마크 × 4모델 전체 테이블 |
| Kimi K2.5 Safety Evaluation (2604.03121) | 12개 사이버보안 (EVMbench 3종, DFIR, HTB Pentest) |
| Kimi K2.5 Technical Report (2602.02276) | 55+ 벤치마크 Table 4 완전 추출 |
| GLM-5 Paper (2602.15763) | 30+ 벤치마크 Table 7 + SWE-rebench Table 9 |
| Gemma 4/Phi-4/Qwen3 MoE (2604.07035) | 참조용 (efficiency vs accuracy) |

### Phase 5: 추가 웹 소스 통합
- MiniMax M2.7 발표 (minimax.io): SWE-bench Pro 56.2%, Terminal-Bench 57.0%, GDPval-AA Elo 1495
- Gemma 4 Model Card (ai.google.dev): Gemma 4 31B + 26B-A4B 전체 벤치마크

### Phase 6: 추가 PDF 문서 분석 (3차 배치)
- **GPT-5.4 Thinking System Card** (Mar 2026): CTF 88.2%, CVE-Bench 86.3%, Cyber Range 73.3%, MLE-Bench 23.3%, Monorepo-Bench 59.3%, CyScenarioBench 11%
- **EXAONE 4.5 Technical Report** (LG AI, Apr 2026): 33개 벤치마크 (비전 21 + 언어 12), AIME 92.6%, LiveCodeBench 81.4%
- **Solar Open Technical Report** (Upstage, Jan 2026): 30개 벤치마크 (한국어 13 + 영어 17), GPQA 68.1%, AIME 84.3%
- **A.X K1 Technical Report** (SK Telecom, Feb 2026): 28개 벤치마크, AIME 89.8%, 한국어 SOTA
- **Mi:dm K 2.5 Pro** (KT, Mar 2026): 32B 엔터프라이즈 모델, tau2-Bench Telecom 89.0
- **ERNIE 5.0 Technical Report** (Baidu, Feb 2026): 80+ 벤치마크, SimpleQA 74.0%, 멀티모달+오디오
- **Qwen 3.6-Plus 블로그**: 45+ 벤치마크, SWE-bench Pro 56.6%, Terminal-Bench 61.6%, MathVision 88.0%

### Phase 7: Claude Opus 4.7 System Card (Apr 2026)
- **40+ 벤치마크** 완전 추출
- SWE-bench Verified **87.6%** (SOTA), SWE-bench Pro **64.3%** (SOTA)
- OSWorld **78.0%**, GDPval-AA Elo **1753** (SOTA)
- CyberGym 73%, Firefox 147 exploitation 45.2%
- Vending-Bench 2: **$10,937** (Max effort, SOTA)
- 비교 모델 점수: GPT-5.4, GPT-5.4 Pro, Gemini 3.1 Pro, Claude Mythos

### Phase 8: 커버리지 갭 분석 및 보충
- 21개 frontier 모델 × 22개 핵심 벤치마크 커버리지 매트릭스 분석
- 45% → 63% 커버리지 개선 (209/462 → 149/234 기준)
- Grok-4 Heavy/4: SWE-bench, LiveCodeBench, MMLU-Pro 점수 추가
- Gemini 3.1 Pro: BrowseComp 85.9%, LiveCodeBench 2887 Elo 추가
- Claude Mythos Preview: ARC-AGI-2 98.7%, MMLU-Pro 97.8% 추가
- 각 모델별 누락 벤치마크 리스트 정리 (미평가 vs 미공개 구분)

### 최종 데이터 규모
| 항목 | 세션 시작 (4/16 기준) | 세션 종료 (4/17) | 증가 |
|------|----------------|-------------|------|
| 모델 수 | 39 | 64 | +25 |
| 벤치마크 수 | 9 | 74 | +65 |
| 점수 엔트리 | ~130 | 625 | +495 |
| PDF 소스 | 0 | 15 | +15 |
| 웹 소스 | 6 | 26 | +20 |
| GitHub Pages | - | hollobit.github.io/SOTA | live |

### 벤치마크 카테고리별 최종 현황
| 카테고리 | 수 | 대표 벤치마크 |
|---------|---|------------|
| Coding | 13 | SWE-bench (4종), Terminal-Bench, LiveCodeBench, PaperBench, SciCode, GDPval-AA |
| Agent | 13 | OSWorld, GAIA, BrowseComp, TAU/τ2-bench, WebArena, DeepSearchQA, MCP-Atlas, Vending-Bench 2 |
| Reasoning | 11 | GPQA, HLE, ARC-AGI-2, MMLU-Pro, FACTS, SimpleQA, LongBench v2 |
| Cybersecurity Attack | 8 | Cybench, CVE-Bench, CyberGym, EVMbench Exploit/Detect, AIRTBench, Firefox 147, Cyber Range |
| Math | 8 | AIME, HMMT, IMO-AnswerBench, MathArena Apex |
| Multimodal | 8 | MMMU-Pro, MathVision, Video-MMMU, LongVideoBench, ScreenSpot-Pro, CharXiv, OmniDocBench |
| Cyber Defense | 5 | AutoPatchBench, CyberSOCEval, ZeroDayBench, EVMbench Patch, DFIR-Metric |
| Multilingual | 2 | MMMLU, Global PIQA |

### 파일 변경 내역
- `resource/benchmark_scores_2026_04.json` — 주 데이터 파일, 54모델 × 68벤치마크 × 470점수
- `config/seed_sources.yaml` — 시드 소스 24개
- `cyber/scouts/resource/bmt_loader.py` — BMT 매핑 12개 추가
- `dashboard/index.html` — Cyber & Coding 탭 추가
- `dashboard/js/cyber-coding.js` — 신규 (4축 뷰 렌더링)
- `dashboard/js/app.js` — CyberCoding 통합
- `scripts/load_benchmark_scores.py` — 변경 없음 (기존 로직 활용)

---

## 2026-04-16: 초기 구축 세션

### 작업 내용
- LLM Benchmark SOTA Dashboard 설계 및 구현
- Python 데이터 파이프라인 (Scout → Analyst → Publisher)
- SQLite DB 스키마 + 데이터 모델
- 정적 대시보드 (ECharts + Tailwind CSS + Vanilla JS)
- CLI 명령어 (`scout`, `analyze`, `export`, `serve`, `run`)
- GitHub Actions CI/CD 파이프라인
- 15개 시드 소스 수집 (Chatbot Arena, Open LLM, SEAL, Artificial Analysis, Vellum, LiveBench, Onyx, LLM Stats, MathArena, Epoch AI, LM Council 등)
- 초기 데이터: 39모델, 9벤치마크, ~130점수
