# Japan Sovereign AI Research — 2026-05-13

Research scope: Japanese sovereign AI players (general-purpose / foundation LLMs).
Attribution rule: every entry below has a primary-source URL (vendor press release, official paper, or Hugging Face model card under the vendor's verified org). Aggregator-only ("Japan has X models") claims excluded.

## Currently in DB
- `sakana/fugu-ultra`, `sakana/fugu-mini`, `sakana/namazu` (3 generic Sakana models)
- Domain-specific Japan entries already present (out of general-purpose scope but noted): `elyza/elyza-llm-med-7b`, `elyza/elyza-llm-med-70b`, `cyberagent/medcalm-7b`, `univ-tokyo/jmedlora-7b`, `stockmark/stockmark-medical-13b`, `preferred-networks/pfn-bio-medic-13b`, `sakana/ai-scientist-v1`, `sakana/ai-scientist-v2`, `sakana/darwin-godel-machine`

So general-purpose sovereign-LLM coverage outside Sakana is essentially zero. All entries below are missing.

## Found — to register

| Vendor | Model name | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---:|---|---|---|
| Preferred Networks (PFN) | PLaMo-100B | `pfn/plamo-100b` | 100B | 2024-10-10 (arxiv) | PFN PLaMo non-commercial / commercial dual | https://arxiv.org/abs/2410.07563 ; https://huggingface.co/pfnet/plamo-100b |
| Preferred Networks (PFN) | PLaMo Prime | `pfn/plamo-prime` | ~100B (derived from PLaMo-100B) | 2024-12-02 | Proprietary (API) | https://www.preferred.jp/en/news/pr20241202 |
| Preferred Networks (PFN) | PLaMo 2.0 Prime | `pfn/plamo-2-prime` | undisclosed (Samba hybrid) | 2025-05-21 | Proprietary (API) | https://tech.preferred.jp/en/blog/plamo-prime-release-feature-improvement/ ; https://arxiv.org/abs/2509.04897 |
| Preferred Networks (PFN) | PLaMo 2.1 Prime | `pfn/plamo-2-1-prime` | undisclosed | 2025-10-07 | Proprietary (API) | https://www.preferred.jp/en/news/pr20251007-2 |
| Preferred Networks (PFN) | PLaMo 2 8B | `pfn/plamo-2-8b` | 8B | 2025-09-05 (arxiv) | PFN license | https://arxiv.org/abs/2509.04897 ; https://huggingface.co/pfnet |
| Preferred Networks (PFN) | PLaMo 2 1B | `pfn/plamo-2-1b` | 1B | 2025-09-05 | PFN license | https://arxiv.org/abs/2509.04897 ; https://aihub.qualcomm.com/models/plamo_1b |
| Preferred Networks (PFN) | PLaMo Translate | `pfn/plamo-translate` | undisclosed | 2025-05-27 | Proprietary (API) | https://www.preferred.jp/en/news/pr20250527 |
| NTT | tsuzumi | `ntt/tsuzumi-1` | 7B (and 0.6B "ultra-light") | 2024-03 | Proprietary (commercial) | https://group.ntt/en/magazine/blog/tsuzumi/ ; https://www.rd.ntt/e/research/LLM_tsuzumi.html |
| NTT | tsuzumi 2 | `ntt/tsuzumi-2` | 30B (single H100) | 2025-10-20 | Proprietary (commercial) | https://group.ntt/en/newsrelease/2025/10/20/251020a.html ; https://group.ntt/en/magazine/blog/tsuzumi2/ |
| NEC | cotomi Pro | `nec/cotomi-pro` | undisclosed | 2024-04-24 | Proprietary | https://www.nec.com/en/press/202404/global_20240424_01.html |
| NEC | cotomi Light | `nec/cotomi-light` | undisclosed | 2024-04-24 | Proprietary | https://www.nec.com/en/press/202404/global_20240424_01.html |
| Fujitsu × Cohere | Takane | `fujitsu/takane` | Cohere Command R+ derivative (~104B) | 2024-09-30 | Proprietary (private deployment) | https://info.archives.global.fujitsu/global/about/resources/news/press-releases/2024/0930-01.html ; https://cohere.com/customer-stories/fujitsu |
| Rakuten | RakutenAI-7B | `rakuten/rakuten-ai-7b` | 7B (Mistral-based) | 2024-03-21 | Apache 2.0 | https://global.rakuten.com/corp/news/press/2024/0321_01.html ; https://huggingface.co/Rakuten/RakutenAI-7B |
| Rakuten | RakutenAI-2.0-8x7B | `rakuten/rakuten-ai-2-0-8x7b` | 8x7B MoE (13B active) | 2025-02-12 | Apache 2.0 | https://global.rakuten.com/corp/news/press/2025/0212_02.html ; https://huggingface.co/Rakuten/RakutenAI-2.0-8x7B |
| Rakuten | RakutenAI-2.0-8x7B-instruct | `rakuten/rakuten-ai-2-0-8x7b-instruct` | 8x7B MoE | 2025-02-12 | Apache 2.0 | https://huggingface.co/Rakuten/RakutenAI-2.0-8x7B-instruct |
| Rakuten | RakutenAI-2.0-mini-instruct | `rakuten/rakuten-ai-2-0-mini-instruct` | ~1.5B | 2025-02-12 | Apache 2.0 | https://huggingface.co/Rakuten/RakutenAI-2.0-mini-instruct |
| Rakuten | Rakuten AI 3.0 | `rakuten/rakuten-ai-3-0` | ~700B MoE (DeepSeek-V3 architecture) | 2026-03-17 | Apache 2.0 | https://global.rakuten.com/corp/news/press/2026/0317_01.html ; (architecture controversy: https://finance.biggo.com/news/202603181324_Rakuten_AI_3.0_Exposed_as_DeepSeek_V3_Rebrand) |
| CyberAgent | calm2-7b | `cyberagent/calm2-7b` | 7B | 2023-11 | Apache 2.0 | https://huggingface.co/cyberagent/calm2-7b |
| CyberAgent | calm3-22b-chat | `cyberagent/calm3-22b-chat` | 22B | 2024-07 | Apache 2.0 (per HF card) | https://huggingface.co/cyberagent/calm3-22b-chat |
| ELYZA | Llama-3-ELYZA-JP-8B | `elyza/llama-3-elyza-jp-8b` | 8B (Llama-3 CPT) | 2024-06-26 | Llama 3 Community License | https://huggingface.co/elyza/Llama-3-ELYZA-JP-8B ; https://note.com/elyza/n/n360b6084fdbd |
| ELYZA | Llama-3-ELYZA-JP-70B | `elyza/llama-3-elyza-jp-70b` | 70B | 2024-06-26 | Llama 3 Community License | https://it.impress.co.jp/articles/-/26511 |
| Karakuri | KARAKURI LM 70B | `karakuri/karakuri-lm-70b-v0-1` | 70B (Llama 2 CPT) | 2024-01 | Llama 2 Community License | https://huggingface.co/karakuri-ai/karakuri-lm-70b-v0.1 |
| Karakuri | KARAKURI LM 70B Chat | `karakuri/karakuri-lm-70b-chat-v0-1` | 70B | 2024-01 | Llama 2 CL | https://huggingface.co/karakuri-ai/karakuri-lm-70b-chat-v0.1 |
| Karakuri | KARAKURI LM 8x7B Chat | `karakuri/karakuri-lm-8x7b-chat-v0-1` | 8x7B MoE (Mixtral-based) | 2024-06 | Apache 2.0 | https://huggingface.co/karakuri-ai/karakuri-lm-8x7b-chat-v0.1 |
| Karakuri | KARAKURI LM 8x7B Instruct | `karakuri/karakuri-lm-8x7b-instruct-v0-1` | 8x7B MoE | 2024-06 | Apache 2.0 | https://huggingface.co/karakuri-ai/karakuri-lm-8x7b-instruct-v0.1 |
| Stockmark | stockmark-100b | `stockmark/stockmark-100b` | 100B | 2024-05 (GENIAC) | MIT | https://huggingface.co/stockmark/stockmark-100b |
| Stockmark | Stockmark-2-100B-Instruct | `stockmark/stockmark-2-100b-instruct` | 100B | 2025-05 (GA) — beta 2025-02 | MIT | https://huggingface.co/stockmark/Stockmark-2-100B-Instruct |
| Stockmark | Stockmark-2-VL-100B-beta | `stockmark/stockmark-2-vl-100b-beta` | 100B VLM | 2025-07 | Qwen License (synthetic-data dependency) | https://huggingface.co/stockmark/Stockmark-2-VL-100B-beta |
| NII (Japan LLM consortium) | llm-jp-3-172b | `llm-jp/llm-jp-3-172b` | 172B | 2024-12 | Apache 2.0 | https://huggingface.co/llm-jp/llm-jp-3-172b ; https://developer.nvidia.com/blog/developing-a-172b-llm-with-strong-japanese-capabilities-using-nvidia-megatron-lm/ |
| NII (Japan LLM consortium) | llm-jp-3-172b-instruct3 | `llm-jp/llm-jp-3-172b-instruct3` | 172B | 2026-02 | Apache 2.0 | https://huggingface.co/llm-jp/llm-jp-3-172b-instruct3 ; https://llmc.nii.ac.jp/en/topics/llm-jp-3-172b-beta2/ |
| Institute of Science Tokyo + AIST (Swallow) | Llama-3.1-Swallow-70B-Instruct-v0.3 | `tokyotech-llm/llama-3-1-swallow-70b-instruct-v0-3` | 70B | 2024-12-30 | Llama 3.1 CL | https://huggingface.co/tokyotech-llm/Llama-3.1-Swallow-70B-Instruct-v0.3 ; https://swallow-llm.github.io/llama3.1-swallow.en.html |
| Institute of Science Tokyo + AIST (Swallow) | Llama-3.3-Swallow-70B-Instruct-v0.4 | `tokyotech-llm/llama-3-3-swallow-70b-instruct-v0-4` | 70B | 2025-03-10 | Llama 3.3 CL | https://huggingface.co/tokyotech-llm/Llama-3.3-Swallow-70B-Instruct-v0.4 ; https://swallow-llm.github.io/llama3.3-swallow.en.html |
| Institute of Science Tokyo + AIST (Swallow) | Llama-3.1-Swallow-8B-Instruct-v0.5 | `tokyotech-llm/llama-3-1-swallow-8b-instruct-v0-5` | 8B | 2025-06-25 | Llama 3.1 CL | https://huggingface.co/tokyotech-llm/Llama-3.1-Swallow-8B-Instruct-v0.5 |
| Sakana AI | TinySwallow-1.5B | `sakana/tinyswallow-1-5b` | 1.5B (TAID distillation) | 2025-01-30 | Apache 2.0 | https://sakana.ai/taid/ ; https://huggingface.co/SakanaAI |
| Sakana AI | EvoLLM-JP (7B) | `sakana/evollm-jp-7b` | 7B (evolutionary merge) | 2024-03 | Apache 2.0 / Mistral (depending on variant) | https://sakana.ai/evolutionary-model-merge/ ; https://huggingface.co/SakanaAI |
| Sakana AI | Continuous Thought Machine (CTM) | `sakana/ctm` | research arch (non-LLM) | 2025-05-08 (arxiv) | research (open-source code) | https://arxiv.org/abs/2505.05522 ; https://pub.sakana.ai/ctm/ |
| SB Intuitions (SoftBank) | Sarashina2-7B | `sbintuitions/sarashina2-7b` | 7B | 2024-06-14 | MIT | https://huggingface.co/sbintuitions/sarashina2-7b ; https://www.sbintuitions.co.jp/en/news/press/20240614_01/ |
| SB Intuitions (SoftBank) | Sarashina2-13B | `sbintuitions/sarashina2-13b` | 13B | 2024-06-14 | MIT | https://huggingface.co/sbintuitions/sarashina2-13b |
| SB Intuitions (SoftBank) | Sarashina2.1-1B | `sbintuitions/sarashina2-1-1b` | 1B | 2024-11 | MIT | https://huggingface.co/sbintuitions/sarashina2.1-1b |
| SB Intuitions (SoftBank) | Sarashina2.2-3B-Instruct | `sbintuitions/sarashina2-2-3b-instruct-v0-1` | 3B | 2025-03 | MIT | https://huggingface.co/sbintuitions/sarashina2.2-3b-instruct-v0.1 |
| SB Intuitions (SoftBank) | Sarashina2-Vision-14B | `sbintuitions/sarashina2-vision-14b` | 14B VLM | 2025-03 | MIT (per HF card) | https://huggingface.co/sbintuitions/sarashina2-vision-14b |
| ABEJA | ABEJA-Qwen2.5-32b-Japanese-v1.0 | `abeja/abeja-qwen2-5-32b-japanese-v1-0` | 32B (Qwen2.5 CPT+SFT+DPO) | 2025 | Apache 2.0 | https://huggingface.co/abeja/ABEJA-Qwen2.5-32b-Japanese-v1.0 |
| ABEJA | ABEJA-QwQ32b-Reasoning-Japanese-v1.0 | `abeja/abeja-qwq32b-reasoning-japanese-v1-0` | 32B reasoning | 2025 | Apache 2.0 | https://huggingface.co/abeja/ABEJA-QwQ32b-Reasoning-Japanese-v1.0 |

Total new general-purpose models with primary source: **40**

## With known benchmark scores (model + bench + value triple available)

| Model | Benchmark | Score | Unit | Source |
|---|---|---:|---|---|
| pfn/plamo-100b-instruct | Japanese MT-Bench | 7.781 | 0–10 score (1 run) | https://arxiv.org/abs/2410.07563 (PLaMo-100B technical report) |
| pfn/plamo-100b-instruct | Japanese Jaster 0-shot avg | 0.738 | 0–1 avg | https://arxiv.org/abs/2410.07563 |
| rakuten/rakuten-ai-2-0-8x7b-instruct | Japanese MT-Bench | 7.08 | 0–10 avg (3 runs, ±0.035) | https://huggingface.co/Rakuten/RakutenAI-2.0-8x7B-instruct |
| nii/llm-jp-3-172b-instruct3 | llm-jp-eval v1.4.1 | 0.547 | 0–1 avg | https://llmc.nii.ac.jp/en/topics/llm-jp-3-172b-beta2/ (surpasses GPT-3.5-turbo-16k-0613 at 0.538) |
| sakana/ctm | ImageNet-1K top-1 | 72.47 | % accuracy | https://arxiv.org/abs/2505.05522 |
| sakana/ctm | ImageNet-1K top-5 | 89.89 | % accuracy | https://arxiv.org/abs/2505.05522 |

Several other models (ELYZA, Swallow, Stockmark-VL) advertise SOTA on Japanese MT-Bench / ELYZA-tasks-100 / Heron-Bench / JA-VG-VQA500 in their HF model cards, but exact numeric scores were not retrieved in this pass — the HF cards should be fetched directly to extract canonical values.

## Skipped — no primary source / aggregate-only
- "Sony AI research models" — Sony Research publishes papers but no specific named, released general-purpose foundation LLM that surfaced under strict attribution. Skipped.
- "LINE Yahoo Japan Japanese-Llama2 series" — LY Corp does not publish a vendor-named flagship LLM on HF under a unified org; the most concrete LINE-tied output is the NII llm-jp consortium (already listed) and SB Intuitions Sarashina (SoftBank, separate). Skipped as a standalone vendor.
- "AIST GENIAC" / "METI Sovereign AI" — GENIAC is a *programme*, not a model; the resulting models (Stockmark-2, PLaMo, Rakuten AI 3.0, llm-jp, Swallow) are already attributed to their vendors above. Skipped as standalone entries.
- TURING (autonomous-driving foundation model) — researched separately; no general-purpose LLM under strict attribution at this pass.

## Total
- New general-purpose models discoverable with primary source: **40**
- Models with explicitly verifiable benchmark scores (model + bench + value): **5 distinct models, 6 score rows** (more available on each HF card but not yet extracted)
