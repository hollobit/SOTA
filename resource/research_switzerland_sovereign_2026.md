# Switzerland Sovereign AI Research — 2026-05-13

## Currently in DB
- `epfl/meditron-70b`, `epfl/meditron-7b`, `epfl/llama-3-meditron-70b` (3 medical models)

## Found — to register

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| Swiss AI Initiative (ETH Zurich + EPFL + CSCS) | Apertus 8B (base) | `swiss-ai/Apertus-8B-2509` | 8B | 2025-09-02 (announced) / 2025-09-17 (HF) | Apache 2.0 | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Swiss AI Initiative (ETH Zurich + EPFL + CSCS) | Apertus 70B (base) | `swiss-ai/Apertus-70B-2509` | 70B (HF card lists 71B) | 2025-09-02 (announced) / 2025-09-17 (HF) | Apache 2.0 | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Swiss AI Initiative (ETH Zurich + EPFL + CSCS) | Apertus 8B Instruct | `swiss-ai/Apertus-8B-Instruct-2509` | 8B | 2025-09-17 | Apache 2.0 | https://huggingface.co/swiss-ai/Apertus-8B-Instruct-2509 |
| Swiss AI Initiative (ETH Zurich + EPFL + CSCS) | Apertus 70B Instruct | `swiss-ai/Apertus-70B-Instruct-2509` | 70B (71B on card) | 2025-09-17 | Apache 2.0 | https://huggingface.co/swiss-ai/Apertus-70B-Instruct-2509 |

Architecture notes (from HF cards + tech report arxiv 2509.14233):
- Decoder-only transformer, bfloat16, pretrained on 15T tokens
- xIELU activation, AdEMAMix optimizer, post-train QRPO alignment
- 1,811 natively supported languages, 65,536-token context
- Trained on Alps supercomputer at CSCS (4,096 GPUs cited in tech report)
- Swiss German + Romansh included
- Backbone of Singapore AI's SEA-LION v4 8B variant (`ai-singapore/apertus-sea-lion-v4-8b`)

## With known benchmark scores

All numbers below come from the HuggingFace model cards (which mirror Table values from arxiv 2509.14233 Section 5 pretraining eval). Posttraining-phase scores (MMLU/GSM8K/HumanEval/IFEval) are referenced in the tech report but were NOT visible on the HF cards or PDF text extraction — therefore omitted under STRICT-ATTRIBUTION.

| Model | Benchmark | Score | Unit | Source |
|---|---|---|---|---|
| Apertus-8B | ARC | 72.7 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | HellaSwag | 59.8 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | WinoGrande | 70.6 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | XNLI | 45.2 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | XCOPA | 66.5 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | PIQA | 79.8 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-8B | Average (6-bench) | 65.8 | % | https://huggingface.co/swiss-ai/Apertus-8B-2509 |
| Apertus-70B | ARC | 70.6 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | HellaSwag | 64.0 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | WinoGrande | 73.3 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | XNLI | 45.3 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | XCOPA | 69.8 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | PIQA | 81.9 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |
| Apertus-70B | Average (6-bench) | 67.5 | % | https://huggingface.co/swiss-ai/Apertus-70B-2509 |

Tech report (full eval suite incl. multilingual + long-context): https://arxiv.org/abs/2509.14233

## Skipped — no primary source / not foundation models

- **Lakera (Zurich/SF)** — AI security firm (Lakera Guard, Lakera Red, Gandalf dataset). Acquired by Cisco in May 2025. Defense/red-team models exist but **no public weights or model IDs** to register. Not a foundation-model vendor. (https://www.lakera.ai/)
- **DeepJudge (Zurich, ETH spinout)** — Legal AI knowledge search (Colinear retrieval tech). $42M Series A in 2025. **Proprietary, no public model weights.** (https://www.deepjudge.ai/)
- **PolyAI** — Voice-AI vendor; Raven v2 LLM is proprietary. Headquartered in London, not Swiss — not a Swiss sovereign-AI vendor. Skipped on attribution + nationality. (https://poly.ai/)
- **NetMind** — Inference platform aggregating 200+ third-party models; **does not train its own foundation models**, and Swiss tie unverified. Skipped.
- **AI21 Switzerland** — No primary source for a Swiss-specific entity or model. AI21 Labs is Israeli; no separate Swiss sovereign-AI release. Skipped.
- **xAI Memphis** — Confirmed not Swiss; skipped per request.
- **Apertus 2 / Apertus follow-ups** — Swissinfo (2026) confirms the team will "focus on user features and ecosystem" but no second-generation model has been named/released as of 2026-05-13. No primary HF/arxiv source. Skipped.
- **swiss-ai/apertus-pretrain-toxicity** — Toxicity classifier (XLM-R + MLP), not a generative LLM. Skipped (out of scope for sovereign-LLM lineup).
- **CHUV Meditron deployment (May 2026)** — Operational deployment of existing `epfl/meditron-*` models in the Lausanne University Hospital ER, not a new model. Already in DB.

## Total
- New models discoverable: **4** (Apertus 8B base, 8B Instruct, 70B base, 70B Instruct)
- Models with verifiable scores: **2** (Apertus-8B and Apertus-70B base have 6-benchmark pretraining-eval table on HF cards; Instruct variants reference tech-report Section 5 but cards do not surface posttraining numbers)
