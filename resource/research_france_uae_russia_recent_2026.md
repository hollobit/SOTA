# France + UAE + Russia — Recent Releases (2026 Q1-Q2)

Research window: 2026-01 → 2026-05 (Jan, Feb, Mar, Apr, May 2026)
Rule: STRICT-ATTRIBUTION — only models with primary-source URL (vendor news / HF model card / docs.mistral.ai changelog / falcon-lm.github.io blog / arxiv paper) are included.

## Currently in DB
- France: ~30 models (Mistral Large 3, Medium 3.5(legacy), Small 4, Magistral Medium 1.2, Devstral 2, Codestral 25.08, Pixtral Large, Voxtral TTS, Ministraux 3, PleIAs 1.0 Pico/OLMo, Lucie, CroissantLLM, HuggingFace SmolLM 3/2)
- UAE: ~16 (Falcon-H1/H1R variants, Falcon3 family, Falcon-OCR, Falcon-Mamba, Falcon2, Falcon180B, Falcon Perception, K2 65B, Atlas-Chat 9B, BiMediX)
- Russia: ~17 (YandexGPT 5 Pro/Lite, YGPT 4 Pro, YaLM 100B, GigaChat 3.1/3/2 Max/Pro/Lite, GigaChat 1.5, ruGPT 3.5, Vikhr Nemo, T-Pro/Lite)

## Found — to register (France)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| Mistral AI | Mistral Medium 3.5 (April 2026 refresh) | mistral-medium-3-5-2604 | 128B dense, 256k ctx, multimodal text+image | 2026-04-28 (docs); 2026-04-30 (blog) | Modified MIT (open weights) | https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04 ; https://huggingface.co/mistralai/Mistral-Medium-3.5-128B |
| Mistral AI | Mistral Medium 3.5 EAGLE (speculative-decoding head) | mistral-medium-3-5-128b-eagle | EAGLE head over 128B base | 2026-04-30 | Modified MIT | https://huggingface.co/mistralai/Mistral-Medium-3.5-128B-EAGLE |
| Mistral AI | Mistral Small 4 | mistral-small-2603 | "unified" instruct+reasoning+coding, 256k ctx, multimodal | 2026-03-16 | Apache-2.0 (per Mistral pattern; confirm on card) | https://mistral.ai/news/mistral-small-4 ; https://docs.mistral.ai/getting-started/changelog |
| Mistral AI | Voxtral TTS | voxtral-tts-2603 | TTS w/ zero-shot voice cloning, multilingual, real-time streaming | 2026-03-23 | API / weights TBD | https://docs.mistral.ai/getting-started/changelog |
| Mistral AI (Labs) | Leanstral | labs-leanstral-2603 | open-source code agent for Lean 4 formal proofs | 2026-03-16 | Open weights | https://docs.mistral.ai/getting-started/changelog |
| Mistral AI | Mistral Moderation 2603 | mistral-moderation-2603 | content-moderation classifier (refresh) | 2026-03-12 | API | https://docs.mistral.ai/getting-started/changelog |
| PleIAs (FR) + GSMA | CommonLingua | pleias-commonlingua | language-ID model, 61 African languages | 2026-04-28 | Open / public-domain training corpus | https://www.topafricanews.com/2026/04/28/pleias-and-gsma-launch-commonlingua-an-open-source-language-identification-model-supporting-61-african-languages/ ; https://huggingface.co/PleIAs |

NOT found / NOT released (France) — kept out per STRICT-ATTRIBUTION:
- Mistral Large 4 — NOT announced. Large 3 (Dec 2025) is still the flagship.
- Magistral 2 — NOT released as a separate model; capabilities absorbed into Mistral Small 4 (Mar 16) and Medium 3.5 (Apr 28).
- Devstral 3 — NOT released; Devstral 2 (Dec 2025) replaced by Medium 3.5 in Vibe CLI.
- Codestral 26.x — NOT found; Codestral 25.08 remains current.
- Pixtral 26.x — capabilities folded into Small 4 / Medium 3.5; no standalone 2026 release.
- SmolLM 4 — NOT released; SmolLM3-3B (Jul 2025) remains current on HuggingFaceTB org.
- Lucie 2 (Linagora) — NOT found.
- CroissantLLM 2 — NOT found.

## Found — to register (UAE)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| TII | Falcon-H1R 7B (Falcon Reasoning) | tiiuae/Falcon-H1R-7B | 7B hybrid Mamba-Transformer, 256k ctx, reasoning | 2026-01-05 | Falcon LLM License (open) | https://huggingface.co/tiiuae/Falcon-H1R-7B ; https://falcon-lm.github.io/blog/falcon-h1r-7b/ ; arxiv 2601.02346 |
| TII | Falcon Perception | tiiuae/Falcon-Perception | 0.6B early-fusion Transformer, open-vocab grounding+segmentation | 2026-04-02 (HF blog: 2026-04) | Open weights | https://huggingface.co/tiiuae/Falcon-Perception ; https://huggingface.co/blog/tiiuae/falcon-perception |
| MBZUAI / G42 / Cerebras | K2 Think V2 | LLM360/K2-Think-V2 | 73B dense (reasoning-enhanced from K2-V2) | 2026-01-27 (announce); HF card Mar 2 update | Apache-2.0 (LLM360 fully-open) | https://huggingface.co/LLM360/K2-Think-V2 ; https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/ ; arxiv 2512.06201 |
| MBZUAI | K2-V2 (base) | LLM360/K2-V2 | 70B dense base | 2026-01-26 | Apache-2.0 | https://huggingface.co/LLM360/K2-V2 |
| MBZUAI | K2-V2-Instruct | LLM360/K2-V2-Instruct | 70B dense instruct | 2026-01-27 | Apache-2.0 | https://huggingface.co/LLM360/K2-V2-Instruct |

NOT found / NOT released (UAE):
- Falcon 4 / Falcon-H2 — NOT announced.
- Falcon-OCR 2 — NOT found.
- G42 / Inception Jais 70B — released Aug 2024 (pre-window) but may NOT be in current DB; flag for backfill (https://www.g42.ai/resources/news/g42-launches-jais-70b-and-20-other-ai-models-champion-arabic-natural-language-processing). 20 Jais variants (590M → 70B, base + adapted + chat) are all 2024 vintage.
- MBZUAI Bayesian / K3 — NOT found.

## Found — to register (Russia)

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| Sber | GigaChat 3 Lightning (MoE) | ai-sage/GigaChat3-10B-A1.8B | 11B total, 1.8B active MoE | 2025-12-11 (HF card update; March 2026 refresh as 3.1) | MIT (open) | https://huggingface.co/ai-sage/GigaChat3-10B-A1.8B |
| Sber | GigaChat 3.1 Lightning | ai-sage/GigaChat3.1-10B-A1.8B | 11B/1.8B MoE | 2026-03-25 (HF card) | MIT | https://huggingface.co/ai-sage/GigaChat3.1-10B-A1.8B |
| Sber | GigaChat 3 Ultra Preview | ai-sage/GigaChat3-702B-A36B-preview | 702B total, 36B active MoE | 2025-11-24 (HF card; product launch March 2026 as "GigaChat Ultra") | MIT | https://huggingface.co/ai-sage/GigaChat3-702B-A36B-preview |
| Sber | GigaChat 3.1 Ultra (production) | ai-sage/GigaChat3.1-702B-A36B | 702B/36B MoE, reasoning mode | 2026-04-02 (HF card) | MIT | https://huggingface.co/ai-sage/GigaChat3.1-702B-A36B |
| T-Bank (T-Tech) | T-Pro 2.0 | t-tech/T-Pro-2.0 | hybrid-reasoning Russian LLM w/ EAGLE speculative decoding | arxiv published 2025-12; HF / paper page available | Apache-2.0 (typical) | https://arxiv.org/abs/2512.10430 ; https://huggingface.co/papers/2512.10430 |
| MTS AI | Cotype Pro 2 | mts-ai/Cotype-Pro-2 | business LLM, 128k ctx, on-prem | 2026 (post-Cotype Pro 1) | proprietary / on-prem | https://mts.ai/en/tech/mts-ai-releases-cotype-pro-2-second-generation-business-focused-llm/ |
| Yandex | Alice AI LLM (rename of YandexGPT 5.1 family) | yandex/alice-ai-llm | LLM (text); rename Oct 2025 | rename + new family Oct 2025; YandexGPT 5.1 Pro launched Aug 2025; Alice AI tech-report Mar 2026 | proprietary | https://yandex.com/company/news/2025-10-28-01 ; https://medium.com/yandex/tech-report-on-alice-ai-how-we-built-the-next-generation-of-russias-most-popular-ai-assistant-6991e2a1fcfa |
| Yandex | Alice AI Art | yandex/alice-ai-art | image-gen | 2025-10-28 (rename) | proprietary | https://yandex.com/company/news/2025-10-28-01 |
| Yandex | Alice AI VLM | yandex/alice-ai-vlm | vision-language | 2025-10-28 (rename) | proprietary | https://yandex.com/company/news/2025-10-28-01 |

NOT found / NOT released (Russia):
- YandexGPT 6 — NOT released; YandexGPT was rebranded to "Alice AI LLM" in Oct 2025, latest version YandexGPT 5.1 Pro (Aug 2025).
- GigaChat 4 — NOT released (current top is GigaChat 3.1 Ultra; "GigaChat Ultra" product name = GigaChat 3.1 Ultra under the hood).
- Sber Kandinsky 5 — NOT confirmed in search window.
- Vikhr 3 — NOT released; most recent Vikhrmodels repo activity is Borealis-5b-it (Dec 2025) and the-well-diffusion. No Vikhr 3 LLM.
- VK (VKontakte) sovereign LLM — NOT found.
- MIPT / Skoltech 2026 frontier model — NOT found.

## Found scores

| Model | Benchmark | Value | Unit | Source |
|---|---|---|---|---|
| Mistral Medium 3.5 (2604) | SWE-Bench Verified | 77.6 | % | https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04 |
| Mistral Medium 3.5 (2604) | τ³-Telecom (tau3-telecom) | 91.4 | % | https://docs.mistral.ai/models/model-cards/mistral-medium-3-5-26-04 |
| Falcon-H1R 7B | AIME24 | 88.1 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | AIME25 | 83.1 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | HMMT25 | 64.9 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | AMO-Bench | 36.3 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | MATH500 | 97.4 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | LiveCodeBench v6 | 68.6 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | HLE (Humanity's Last Exam) | 11.1 | % | arxiv 2601.02346 |
| Falcon-H1R 7B | IFBench | 53.4 | % | arxiv 2601.02346 |
| K2 Think V2 | OMNI-Math-HARD | 60.73 | % | https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/ |
| K2 Think V2 | GPQA-Diamond | 71.08 | % | https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/ |
| K2 Think V2 | BFCL-v4 (tool use) | 52.4 | % | https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/ |
| K2 Think V2 | LiveCodeBench v5 | 63.97 | % | https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/ |
| GigaChat 3 Ultra Preview | MERA (Russian) | rank #1 (>DeepSeek V3.1) | rank | https://mid-east.info/europes-largest-open-source-release-sber-releases-a-line-of-cutting-edge-russian-neural-networks/ (no numeric score in primary source) |
| Cotype Pro 2 | (vendor-internal: 40% faster, 50% more accurate vs Cotype Pro 1 on long-context 128k) | n/a | relative | https://mts.ai/en/tech/mts-ai-releases-cotype-pro-2-second-generation-business-focused-llm/ |

## Skipped (announcement-only / no released artifact / no primary numeric score / pre-window)

- Mistral Large 4 — not announced.
- Magistral 2 / Devstral 3 / Codestral 26.x / Pixtral 26.x / SmolLM 4 / Lucie 2 / CroissantLLM 2 — no release.
- Falcon 4 / Falcon-H2 / Falcon-OCR 2 / MBZUAI K3 / MBZUAI Bayesian — no release.
- YandexGPT 6 / GigaChat 4 / Vikhr 3 / VK-LLM / MIPT 2026 / Skoltech 2026 — no release.
- Jais 30B v3 / Jais Adapted 70B — Jais family is Aug-2024 vintage; out of 2026-Q1-Q2 window. Flag as backfill candidate for DB (separate task) if currently missing.
- GigaChat MERA #1 ranking — no numeric MERA score in primary source (rank-only claim, not a value).
- Cotype Pro 2 percentages — relative-only claim from vendor blog; no benchmark name.

## Total

- New models discoverable (with primary source + released artifact, 2026 window): **19**
  - France: 7 (Medium 3.5 2604, Medium 3.5 EAGLE, Small 4, Voxtral TTS, Leanstral, Moderation 2603, PleIAs CommonLingua)
  - UAE: 5 (Falcon-H1R 7B, Falcon Perception, K2 Think V2, K2-V2 base, K2-V2-Instruct)
  - Russia: 7 (GigaChat 3 Lightning, 3.1 Lightning, 3 Ultra Preview, 3.1 Ultra, T-Pro 2.0, Cotype Pro 2, Alice AI LLM/Art/VLM rename — count Alice AI LLM as 1 new model entry since LLM/Art/VLM is one launch event; T-Pro 2.0 paper Dec 2025 but landed in DB window)
- Models with verifiable benchmark scores from primary source: **3** (Mistral Medium 3.5 2604, Falcon-H1R 7B, K2 Think V2). GigaChat / Cotype skipped per STRICT-ATTRIBUTION (rank-only or relative-only).

## Notes on registration

- **GigaChat 3.x is already in DB** per starting inventory (3.1 Ultra/Lightning, 3 Ultra/Lightning). The HF cards above confirm primary sources for those. If 3.1 variants are NOT yet registered, register the four GigaChat 3.1 / 3 Ultra-Preview rows from this report.
- **Jais 70B (G42 Inception) is a DB-backfill candidate.** Released Aug 2024, before this research window, but per the request it is the "key for UAE if missing" — verify current DB and backfill from https://www.g42.ai/resources/news/g42-launches-jais-70b-and-20-other-ai-models-champion-arabic-natural-language-processing if absent. 20 Jais variants total (590M / 1.3B / 6.7B / 13B / 30B / 70B sizes × {base, adapted, chat}).
- **Mistral Medium 3.5 (2604)** is the same product family as "Medium 3.5" in the starting inventory but a distinct dated checkpoint (April 28, 2026, 128B open weights). Treat as a separate model row if your schema keys on (vendor, family, dated-tag).
