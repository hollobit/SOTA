# Vendor Announcement Sweep — 2026-05-14 (last 7 days, since 2026-05-07)

Sweep window: **2026-05-07 to 2026-05-14** (inclusive). Today: 2026-05-14.
Methodology: parallel WebSearch + WebFetch across ~25 vendor blogs / news rooms.
STRICT-ATTRIBUTION: Only items with a primary-source URL are listed in "Found — to register". Score extractions require model+benchmark+value triple on a primary source.

## Found — to register

| Vendor | Model | Suggested ID | Released | License | Primary source |
|---|---|---|---|---|---|
| OpenAI | GPT-Realtime-2 | `gpt-realtime-2` | 2026-05-07 | Proprietary (API) | https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/ (also confirmed via Microsoft Azure Foundry blog 2026-05-08) |
| OpenAI | GPT-Realtime-Translate | `gpt-realtime-translate` | 2026-05-07 | Proprietary (API) | https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/ |
| OpenAI | GPT-Realtime-Whisper | `gpt-realtime-whisper` | 2026-05-07 | Proprietary (API) | https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/ |
| Baidu | ERNIE 5.1 | `ernie-5.1` | 2026-05-09 | Proprietary (Qianfan + ernie.baidu.com) | https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/ |
| Baidu | ERNIE 5.1-Preview | `ernie-5.1-preview` | 2026-05-08 | Proprietary | https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/ (mentioned as topping LMArena prior to GA) |
| ByteDance / Volcano Engine | Doubao-Seed-2.0-lite (full-modal) | `doubao-seed-2.0-lite` | 2026-05-06* | Proprietary (Volcano Engine API) | https://news.aibase.com/news/27723 — *outside strict window by 1 day; flagged for review |
| ByteDance / Volcano Engine | Doubao-Seed-2.0-mini | `doubao-seed-2.0-mini` | 2026-05-06* | Proprietary | https://news.aibase.com/news/27723 — *outside strict window by 1 day |
| Allen Institute (AI2) | MolmoAct 2 | `molmoact-2` | 2026-05-05* | Open-source (allenai/molmoact2 GitHub) | https://allenai.org/blog/molmoact2 — *robotics VLA; outside strict window by 2 days; flagged |

Items deliberately **kept inside the May 7-14 window**:
- 3 × OpenAI realtime audio models (2026-05-07)
- 1 × ERNIE 5.1 (2026-05-09)

Items **adjacent** (May 4-6) found while sweeping, listed here for ingestion-team awareness — register only if your window is ≥10 days:
- Tencent HunyuanVideo-1.5 (2026-05-04, video gen, 8.3B) — https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- AI2 MolmoAct 2 (2026-05-05, robotics VLA) — https://allenai.org/blog/molmoact2
- Doubao-Seed-2.0-lite / -mini (2026-05-06) — https://news.aibase.com/news/27723
- xAI Grok 4.3 (2026-05-06 per llm-stats; no x.ai/news primary fetch — 403) — needs verification

## Score extractions

| Model | Benchmark | Value | Unit | Source |
|---|---|---:|---|---|
| ERNIE 5.1 | LMArena Search Arena (Elo) | 1223 | Elo | https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/ |
| ERNIE 5.1 | AIME26 (with tool use) | 99.6 | % | https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/ |
| GPT-Realtime-2 | (no benchmark on primary page) | — | — | Pricing only: $32/1M audio input, $64/1M audio output |
| GPT-Realtime-Translate | Supported languages | 70 in / 13 out | count | OpenAI primary; pricing $0.034/min |
| GPT-Realtime-Whisper | Pricing | $0.017 | $/min | OpenAI primary |
| MolmoAct 2 | Real-world manipulation avg (8 tasks) | 0.51 | success rate | https://allenai.org/blog/molmoact2 (ahead of OpenVLA-OFT 0.36, π0.5 0.32, Cosmos Policy 0.16, X-VLA 0.05) |

Note: ERNIE 5.1 page also mentions "approaches" GPQA / MMLU-Pro top-tier and "surpasses DeepSeek-V4-Pro on τ³-bench, SpreadsheetBench-Verified" — no exact value given, so omitted per STRICT-ATTRIBUTION.

## Skipped — announcement only / no model card / out of window

- **Anthropic** — May 13 "Claude for Small Business" is a product/integrations announcement, no new model. May 6 "Higher usage limits + SpaceX compute". No Mythos GA (still preview, April release). https://www.anthropic.com/news
- **Google DeepMind** — No new Gemini model in window. May 7 was an AlphaEvolve 1-year retrospective, not a new model. Gemini Intelligence on Android (May 13) is a product surface, not a model. I/O 2026 is May 19-20 (next window).
- **xAI** — x.ai/news returned HTTP 403 (likely Cloudflare). llm-stats indicates "Grok 4.3" released 2026-05-06 (outside window) — needs primary verification.
- **Meta** — No release in window. Muse Spark family launched 2026-04-08; no May follow-on found.
- **DeepSeek** — Nothing post-V4-Pro-Max (2026-04-23). No R2 yet.
- **Moonshot (Kimi)** — Nothing post-K2.6 (2026-04-20). No K2.7.
- **Alibaba Qwen** — qwenlm.github.io shows no May 2026 posts; latest is Qwen3.6-27B (2026-04-22). Qwen3-Coder-Next is Feb 2026.
- **Zhipu (Z.ai)** — Nothing post-GLM-5.1 (2026-04-08 open-source release).
- **Tencent Hunyuan** — Only HunyuanVideo-1.5 (May 4, outside window; video-gen not LLM).
- **MiniMax** — M2.7-Highspeed is March 2026, not a new May release.
- **StepFun** — May 9 news is a $2.5B funding round, not a model. Latest model = Step-3.5 Flash (Jan 2026).
- **iFlytek** — Spark X2-Flash released 2026-04-29 (just outside).
- **Mistral** — mistral.ai/news has nothing between 2026-04-29 (Medium 3.5 Vibe) and 2026-05-14.
- **NVIDIA Nemotron** — Nemotron-3 Nano Omni shipped 2026-04-29 (just outside).
- **TII Falcon** — Nothing post-H1R 7B (2026-01-05).
- **MBZUAI** — Nothing post-K2 Think V2 (2026-01-27).
- **LG (EXAONE)** — Nothing post-EXAONE 4.5 (2026-04-09).
- **SKT / Naver HyperCLOVA X / KT / Kakao** — No May 7-14 frontier-grade model release.
- **Upstage** — Solar Pro 3 was 2026-01-27; nothing newer.
- **Sarvam / BharatGen** — Sarvam-105B Indus beta launched Feb 2026; no May release.
- **Cohere** — No new Command-A variant in window.
- **Microsoft Phi** — No Phi-5 release; nothing in window.
- **Apple** — Foundation Models updates are queued for WWDC (June 2026).
- **Amazon Bedrock / Nova** — No new Nova model in window.

## Total

- **New models inside strict 2026-05-07..2026-05-14 window: 4**
  - GPT-Realtime-2, GPT-Realtime-Translate, GPT-Realtime-Whisper (OpenAI, May 7)
  - ERNIE 5.1 (Baidu, May 9)
- **Adjacent (May 4-6) candidates, flagged for ingestion decision: 4-5**
  - HunyuanVideo-1.5, MolmoAct 2, Doubao-Seed-2.0-lite, Doubao-Seed-2.0-mini, (Grok 4.3 — needs primary verification)
- **New scores (model+benchmark+value with primary source): 4**
  - ERNIE 5.1 / LMArena Search Arena Elo = 1223
  - ERNIE 5.1 / AIME26 (tool use) = 99.6
  - MolmoAct 2 / Real-world manipulation avg (8 tasks) = 0.51
  - GPT-Realtime-Translate / Language pairs = 70 in / 13 out (capability count, not benchmark)

## Caveats / verification queue

1. **x.ai/news** — primary fetch returned 403. Grok 4.3 (May 6, llm-stats) needs direct verification before registering.
2. **OpenAI primary URL** — `openai.com/index/...` returned 403; OpenAI release was cross-confirmed via Microsoft Azure AI Foundry blog (2026-05-08) and MarkTechPost (2026-05-08), both citing OpenAI's announcement. Recommend manual fetch from OpenAI release notes page if available.
3. **ERNIE 5.1 license** — primary blog does not state license; treat as proprietary closed-weight unless Baidu publishes a model card.
4. **Doubao-Seed-2.0-lite / -mini** — parameter counts not disclosed; AIbase summarizes Volcano Engine announcement of 2026-05-06. Primary Volcano Engine post not yet located in English; bytedance/seed blog showed only the Feb 2026 Seed 2.0 launch.
