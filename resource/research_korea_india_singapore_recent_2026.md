# Korea + India + Singapore — Recent (Mar-May 2026) Releases

Research window: 2026-03-15 → 2026-05-13 (last ~60 days, per strict-attribution rule).
Compiled: 2026-05-13.

## Currently in DB (already counted)

- **Korea (~50 models)**: LG EXAONE 4.5/4.0/Deep/3.5, K-EXAONE 236B-A23B (Dec 2025), Upstage Solar Pro 3/Open 100B, SKT AX K1/4.0, KT Mi:dm K2.5 Pro / Mi:dm 2.0, Naver HyperCLOVA-X SEED Think 32B/14B (Dec 2025) + Vision 3B + Text 0.5B/1.5B + Omni 8B (Dec 2025), Kakao Kanana 2 30B-A3B (instruct/base/thinking/mid; Dec 2025), NCSoft VARCO 2.0, Trillion Tri-21B / Tri-21B-Think (Feb 2026) / Tri-70B-preview-SFT (Sep 2025), Motif-2 12.7B, Konan Ond/Ent, Saltlux Luxia 21.4B, Samsung Gauss 2.x.
- **India (~13 models)**: Sarvam-105B / Sarvam-30B (Feb 2026) / Sarvam-M / Sarvam-1, BharatGen Param-1 / Param-1-2.9B-Instruct / Param-1-7B / FinanceParam / LegalParam / AgriParam / AyurParam (Nov 2025), Krutrim 2 12B, Soket Pragna 1B, AI4Bharat IndicLLM / Airavata 7B, CoRover BharatGPT, Reliance JioBrain (internal deploy), Tata MAITRI, Gnani Vachana STT/TTS (Feb 18, 2026), Sutra by TWO AI.
- **Singapore (~8 models)**: AI Singapore SEA-LION v4 (Apertus 8B-IT Feb 5 2026, Gemma 4B-VL Feb 5 2026, Gemma 27B-IT/VL, Qwen 32B-IT Oct 2025, Qwen 4B/8B-VL, Llama v3.5 70B/8B Apr 2025); SEA-Guard collection (Feb 4 2026, Qwen 4B/8B + Llama 8B + Gemma 12B); GoTo Sahabat-AI v2 70B/8B (Indonesia partnership).

## Found — to register (Korea)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| LG AI Research | EXAONE 4.5 (Vision-Language) | `exaone-4-5-33b` | 33B (31.7B LLM + 1.29B vision) | 2026-04-09 | EXAONE AI Model License Agreement 1.2-NC | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B ; https://www.koreaherald.com/article/10714004 ; arxiv 2604.08644 |
| LG AI Research | EXAONE 4.5 FP8 (quantized) | `exaone-4-5-33b-fp8` | 33B | 2026-04-09 | EXAONE 1.2-NC | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B-FP8 |
| LG AI Research | EXAONE 4.5 AWQ (quantized) | `exaone-4-5-33b-awq` | 33B (AWQ) | 2026-04-09 | EXAONE 1.2-NC | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B-AWQ |

Notes:
- **EXAONE 4.5** is the only confirmed new Korean release with a HF model card + arxiv paper in the window. Multimodal VLM, 256K context, 6 languages (Korean, English, Spanish, German, Japanese, Vietnamese). EXAONE 4.x family is already partially in DB; this is the 4.5 vision-language addition.
- **Kakao Kanana 2.5 (150B)** announced (Korea Herald, May 2026) but no HF artifact yet — roadmap only, skipped.
- **SKT A.X K2** announced (Seoul Economic Daily, 2026-04-22) — Phase 2 development, no public artifact yet, skipped.
- **Naver HyperCLOVA-X SEED** updates (Vision 3B, Text 0.5B/1.5B, Think 32B/14B, Omni 8B) all uploaded Dec 24, 2025 — outside the 60-day window. Already in DB.
- **K-EXAONE 236B-A23B** released 2025-12-31 — outside window; already in DB.
- **Tri-21B-Think / Tri-21B-Think-Preview** released 2026-02-10 — outside window. Tri-70B-preview-SFT released Sep 2025.

## Found — to register (India)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| BharatGen | Param2-17B-A2.4B-Thinking | `bharatgen-param2-17b-thinking` | 17B total / 2.4B active (Hybrid MoE) | 2026-04-09 (HF mtime) | BharatGen Non-Commercial | https://huggingface.co/bharatgenai/Param2-17B-A2.4B-Thinking |
| BharatGen | Shrutam-2 (LLM-powered ASR) | `bharatgen-shrutam-2` | n/a (ASR, Conformer + LLM decoder + MoE projection) | 2026-05-02 (HF mtime, "11 days ago") | BharatGen Non-Commercial | https://huggingface.co/bharatgenai/Shrutam-2 ; arxiv 2601.19451 |
| Sarvam AI | sarvam-30b-fp8 (quantized) | `sarvam-30b-fp8` | 32B (FP8) | 2026-03-31 (HF mtime) | Apache 2.0 | https://huggingface.co/sarvamai/sarvam-30b-fp8 |
| Sarvam AI | sarvam-105b-fp8 (quantized) | `sarvam-105b-fp8` | 106B (FP8) | 2026-03-31 (HF mtime) | Apache 2.0 | https://huggingface.co/sarvamai/sarvam-105b-fp8 |
| Sarvam AI | sarvam-30b-gguf (quantized) | `sarvam-30b-gguf` | 32B (GGUF) | 2026-03-23 (HF mtime) | Apache 2.0 | https://huggingface.co/sarvamai/sarvam-30b-gguf |
| Sarvam AI | sarvam-105b-gguf (quantized) | `sarvam-105b-gguf` | 106B (GGUF) | 2026-03-23 (HF mtime) | Apache 2.0 | https://huggingface.co/sarvamai/sarvam-105b-gguf |

Notes:
- **Param2 17B base instruct** was launched Feb 18 2026 at IndiaAI Impact Summit; HF page is `Param2-17B-A2.4B-Instruct` (in DB). The **Thinking** variant is a separate reasoning post-train uploaded Apr 9 — new.
- **Krutrim 3 cancelled** — Ola Krutrim pivoted to cloud services in May 2026; Kruti AI assistant shut down. No new foundation model release. Source: TechCrunch 2026-05-05, Medianama 2026-04 and 2026-05.
- **Reliance JioBrain** continues internal deployment for telecom workflows; no public model artifact. Skipped.
- **Tata MAITRI** — no 2026 public LLM release detected. Skipped (existing DB entry remains as-is).
- **L&T Vyoma** is data-centre / sovereign-cloud infrastructure, not an LLM. Skipped (already excluded).
- **TCS / Wipro / Infosys** — Project Indus is collaborative with NVIDIA, no independent sovereign LLM model card; skipped.
- **Soket AI EKA Pro** — roadmap (Project EKA 1B→120B over 10 months), no released artifact yet. Skipped.
- **Gnani.ai Vachana STT/TTS** released 2026-02-18 — outside window, already in DB plan.

## Found — to register (Singapore)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| AI Singapore | SEA-LION-ModernBERT-600M | `sea-lion-modernbert-600m` | 600M (encoder) | 2026-03-16 | MIT | https://huggingface.co/aisingapore/SEA-LION-ModernBERT-600M |
| AI Singapore | SEA-LION-ModernBERT-300M | `sea-lion-modernbert-300m` | 300M (encoder) | 2026-03-16 | MIT | https://huggingface.co/aisingapore/SEA-LION-ModernBERT-300M |
| AI Singapore | SEA-LION-ModernBERT-Embedding-600M | `sea-lion-modernbert-embedding-600m` | 600M (embedding) | 2026-03-16 | MIT | https://huggingface.co/aisingapore/SEA-LION-ModernBERT-Embedding-600M |
| AI Singapore | SEA-LION-ModernBERT-Embedding-300M | `sea-lion-modernbert-embedding-300m` | 300M (embedding) | 2026-03-16 | MIT | https://huggingface.co/aisingapore/SEA-LION-ModernBERT-Embedding-300M |
| AI Singapore | SEA-LION-E5-Embedding-600M | `sea-lion-e5-embedding-600m` | 600M (embedding, fine-tuned multilingual-e5-large) | 2026-04-09 (HF mtime) | MIT | https://huggingface.co/aisingapore/SEA-LION-E5-Embedding-600M |

Notes:
- These 5 models are part of the **SEA-LION Embedding/encoder suite** announced March 2026 (sea-lion.ai blog). All have full model cards, training-data spec (245M contrastive pairs + 13M fine-tune pairs), MIT license, and exact compute disclosure (H200 GPU hours + CO2e).
- 13 SEA languages supported (Burmese, Chinese, English, Filipino, Indonesian, Javanese, Khmer, Lao, Malay, Sundanese, Tamil, Thai, Vietnamese).
- **SEA-LION v5 does not exist** — sea-lion.ai/models page still says "Updated as of 25 Oct 2025 – V4 Generation".
- **SeaLLMs (Alibaba DAMO Singapore)** — no new 2026 SeaLLM-v4 release found in window; not pursued further.
- **NTU / NUS / A\*STAR** — no new public LLM artifacts in the window.

## Found scores

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| EXAONE 4.5 33B | MMLU-Pro | 83.3 | % | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B |
| EXAONE 4.5 33B | GPQA-Diamond | 80.5 | % | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B |
| EXAONE 4.5 33B | AIME 2025 | 92.9 | % | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B |
| EXAONE 4.5 33B | AIME 2026 | 92.6 | % | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B |
| EXAONE 4.5 33B | LiveCodeBench v6 | 81.4 | % | https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B ; Korea Herald 10714004 |
| EXAONE 4.5 33B | ChartQA Pro | 62.2 | % | Korea Herald 10714004 |
| EXAONE 4.5 33B | STEM-5 average | 77.3 | composite | Korea Herald 10714004 |
| BharatGen Param2-17B-Thinking | MMLU | 57.79 | % | https://huggingface.co/bharatgenai/Param2-17B-A2.4B-Thinking |
| BharatGen Param2-17B-Thinking | ARC-Challenge | 56.83 | % | HF card |
| BharatGen Param2-17B-Thinking | HellaSwag | 77.43 | % | HF card |
| BharatGen Param2-17B-Thinking | GSM8K | 57.32 | % | HF card |
| BharatGen Param2-17B-Thinking | HumanEval | 36.59 | % | HF card |
| BharatGen Param2-17B-Thinking | MBPP | 47.00 | % | HF card |
| BharatGen Param2-17B-Thinking | MathQA | 40.23 | % | HF card |
| BharatGen Param2-17B-Thinking | Sanskriti | 66.54 | % | HF card |
| BharatGen Param2-17B-Thinking | Indic BoolQ | 75.98 | % | HF card |
| BharatGen Param2-17B-Thinking | MMLU Hindi | 59.23 | % | HF card |
| BharatGen Param2-17B-Thinking | TriviaQA Indic MCQ | 72.95 | % | HF card |

(SEA-LION ModernBERT / Embedding models report SEA-BED retrieval and contrastive metrics qualitatively as "state-of-the-art on 10 regional languages" but the HF cards do not publish concrete per-benchmark numbers in primary text — skipped under strict-attribution rule.)

## Skipped — roadmap/announce only

- **Kakao Kanana 2.5 (150B)** — May 2026 Korea Herald roadmap mention; no HF artifact or model card.
- **SKT A.X K2** — 2026-04-22 announcement of NVIDIA collaboration; Phase 2 of Korean Sovereign AI project runs through June 2026. No public artifact.
- **LG EXAONE 5** — not announced; Phase 2 of national project targets late-2026 frontier release.
- **Upstage Solar Pro 4** — Solar Pro 3 (Jan 27 2026) still current; no Solar Pro 4 announced; SK Networks invested ₩50B more on 2026-04-29 (Series C).
- **KT Mi:dm K3** — Mi:dm K 2.5 Pro (arxiv 2603.18788, March 2026) is latest; no K3.
- **Samsung Gauss 3** — Gauss 2.3 / 2.3-Think / O-Flash referenced internally; no public 2026 release.
- **Krutrim 3 (India)** — explicitly cancelled; company pivoted to cloud services (TechCrunch 2026-05-05).
- **Reliance JioBrain** — internal-only deployment; no public model card.
- **Soket EKA Pro (120B)** — roadmap only; no released artifact.
- **TCS / Wipro / Infosys / Tech Mahindra sovereign LLM** — Project Indus collaborations with NVIDIA; no independent model cards.
- **Hyundai sovereign in-vehicle LLM** — collaboration with Naver + NVIDIA Nemotron; arrives 2026 in vehicles but no public artifact.
- **POSCO HoloIQ / industrial LLM** — Pohang AI hub investment (₩24B 2026-2030); no LLM release.
- **SEA-LION v5** — no announcement; still v4 generation per sea-lion.ai.
- **SeaLLMs v4 (Alibaba DAMO Singapore)** — no 2026 release found.

## Total

- **New models discoverable in window**: **14**
  - Korea: 3 (EXAONE 4.5 base + FP8 + AWQ — count as 1 model + 2 quantized variants if registering one; otherwise 3 HF artifacts)
  - India: 6 (Param2-Thinking, Shrutam-2, sarvam-30b-fp8, sarvam-105b-fp8, sarvam-30b-gguf, sarvam-105b-gguf)
  - Singapore: 5 (SEA-LION ModernBERT 300M/600M, ModernBERT Embedding 300M/600M, SEA-LION-E5-Embedding-600M)

  *If you exclude quantized variants and count only distinct architectures: **Korea 1, India 2 (Param2-Thinking + Shrutam-2), Singapore 5 = 8 distinct new models.***

- **Models with verifiable scores**: **2** (EXAONE 4.5 33B — 7 benchmarks; BharatGen Param2-17B-Thinking — 11 benchmarks). 18 score rows total.
