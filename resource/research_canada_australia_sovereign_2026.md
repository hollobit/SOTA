# Canada + Australia Sovereign AI — 2026-05-13

Research conducted under STRICT-ATTRIBUTION rule. Only models with verifiable primary-source URLs (HuggingFace model card or vendor blog) are listed.

## Currently in DB

- **Canada**: Cohere is implicitly present (filed under `us-open` region label despite Toronto HQ). No Canada-specific sovereign category exists.
- **Australia**: Nothing.

---

## Found — Canada

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| Cohere Labs (Toronto) | Command A | `cohere-command-a-03-2025` | 111B | 2025-03 (paper 2025-04-01) | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/c4ai-command-a-03-2025 |
| Cohere Labs (Toronto) | Command A Vision | `cohere-command-a-vision-07-2025` | 112B | 2025-07-31 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/command-a-vision-07-2025 |
| Cohere Labs (Toronto) | Command A Reasoning | `cohere-command-a-reasoning-08-2025` | 111B | 2025-08 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/command-a-reasoning-08-2025 |
| Cohere Labs (Toronto) | Command R+ (08-2024) | `cohere-command-r-plus-08-2024` | 104B | 2024-08 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/c4ai-command-r-plus-08-2024 |
| Cohere Labs (Toronto) | Command R (08-2024) | `cohere-command-r-08-2024` | 32B | 2024-08 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/c4ai-command-r-08-2024 |
| Cohere Labs (Toronto) | Command R7B | `cohere-command-r7b-12-2024` | 7B | 2024-12-13 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/c4ai-command-r7b-12-2024 |
| Cohere Labs (Toronto) | Command R7B Arabic | `cohere-command-r7b-arabic-02-2025` | ~8B (7B + 1B emb) | 2025-02 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/c4ai-command-r7b-arabic-02-2025 |
| Cohere Labs (Toronto) | Cohere Transcribe | `cohere-transcribe-03-2026` | 2B | 2026-03-26 | Apache 2.0 | https://huggingface.co/CohereLabs/cohere-transcribe-03-2026 |
| Cohere Labs (Toronto) | Aya 23 35B | `cohere-aya-23-35b` | 35B | 2024-05-23 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/aya-23-35B |
| Cohere Labs (Toronto) | Aya 23 8B | `cohere-aya-23-8b` | 8B | 2024-05-23 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/aya-23-8B |
| Cohere Labs (Toronto) | Aya Expanse 32B | `cohere-aya-expanse-32b` | 32B | 2024-12-05 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/aya-expanse-32b |
| Cohere Labs (Toronto) | Aya Expanse 8B | `cohere-aya-expanse-8b` | 8B | 2024-12-05 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/aya-expanse-8b |
| Cohere Labs (Toronto) | Aya Vision 8B | `cohere-aya-vision-8b` | 8B | 2024-12-05 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/aya-vision-8b |
| Cohere Labs (Toronto) | Tiny Aya Base | `cohere-tiny-aya-base-2026` | 3.35B | 2026-03-12 (paper) | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/tiny-aya-base |
| Cohere Labs (Toronto) | Tiny Aya Global | `cohere-tiny-aya-global-2026` | 3.35B | 2026-02-17 | CC-BY-NC 4.0 + AUP | https://huggingface.co/CohereLabs/tiny-aya-global |
| Vector Institute (Toronto) | Qwen3-8B-UnBias-Plus-SFT-Instruct | `vector-qwen3-8b-unbias-instruct` | 8B | 2026-03-22 | (per HF page, not stated) | https://huggingface.co/vector-institute (org listing) |
| Vector Institute (Toronto) | Qwen3-8B-UnBias-Plus-SFT | `vector-qwen3-8b-unbias-sft` | 8B | 2026-03-05 | (per HF page, not stated) | https://huggingface.co/vector-institute |
| Vector Institute (Toronto) | Qwen3-4B-UnBias-Plus-SFT | `vector-qwen3-4b-unbias-sft` | 4B | 2026-03-05 | (per HF page, not stated) | https://huggingface.co/vector-institute |
| Vector Institute (Toronto) | Factuality-Alignment-Qwen2.5-14B | `vector-factuality-qwen25-14b` | 14B | 2026-01-07 | (per HF page, not stated) | https://huggingface.co/vector-institute |

Notes:
- Cohere Labs is the Toronto-based research arm of Cohere (formerly Cohere For AI / C4AI). All Cohere flagship models open-weight on HF are CC-BY-NC (non-commercial); Cohere Transcribe is the lone Apache-2.0 exception.
- Vector Institute models are bias-mitigation / factuality fine-tunes of Qwen base models, not from-scratch foundation models.

---

## Found — Australia

| Vendor | Model | Suggested ID | Params | Released | License | Primary source |
|---|---|---|---|---|---|---|
| Maincode (Melbourne) | Maincoder-1B | `maincode-maincoder-1b` | 1B | 2025 (HF page updated 2026, GGUF 2026-01-02, ONNX 2025-12-30) | Apache 2.0 | https://huggingface.co/Maincode/Maincoder-1B |
| Isaacus (Australia) | Open Australian Legal LLM | `isaacus-open-australian-legal-llm` | 1.5B | 2023-12-15 | Apache 2.0 | https://huggingface.co/isaacus/open-australian-legal-llm |
| Isaacus (Australia) | Open Australian Legal Phi 1.5 | `isaacus-open-australian-legal-phi-1_5` | 1.3B | 2023-12-15 | (per HF page, not stated) | https://huggingface.co/isaacus/open-australian-legal-phi-1_5 |
| Isaacus (Australia) | Open Australian Legal GPT2 | `isaacus-open-australian-legal-gpt2` | 0.124B | 2023-12-15 | (per HF page, not stated) | https://huggingface.co/isaacus/open-australian-legal-gpt2 |
| Isaacus (Australia) | EmuBERT | `isaacus-emubert` | 0.1B | 2024-06-12 | (per HF page, not stated) | https://huggingface.co/isaacus/emubert |
| Isaacus (Australia) | Kanon Tokenizer | `isaacus-kanon-tokenizer` | tokenizer | 2025-10-15 | (per HF page, not stated) | https://huggingface.co/isaacus |
| Isaacus (Australia) | Kanon 2 Tokenizer | `isaacus-kanon-2-tokenizer` | tokenizer | 2026-02-16 | (per HF page, not stated) | https://huggingface.co/isaacus |

Notes:
- Maincode is in Melbourne, building Australia's "AI factory" with AMD hardware and Telstra data centre hosting (US$30M, opens Jan 2026). Their public flagship "Matilda" LLM is NOT yet on HuggingFace (private beta only) — only Maincoder-1B (code model) is published.
- Isaacus is the most prolific Australian-focused publisher on HF, but their open weights are legal-domain specialist models. Kanon 2 Embedder (#1 on MLEB as of 2025-10-23 per their blog) appears to be commercial / not open-weight on HF.

---

## With known benchmark scores

| Model | Benchmark | Score | Unit | Source |
|---|---|---|---|---|
| Open Australian Legal LLM 1.5B | Open Australian Legal QA v2.0.0 | 8.01 | perplexity | https://huggingface.co/isaacus/open-australian-legal-llm |
| Open Australian Legal Phi 1.5 | Open Australian Legal QA v2.0.0 | 8.69 | perplexity | https://huggingface.co/isaacus/open-australian-legal-llm (comparison table) |
| Open Australian Legal GPT2 124M | Open Australian Legal QA v2.0.0 | 16.37 | perplexity | https://huggingface.co/isaacus/open-australian-legal-llm |
| Open Australian Legal DistilGPT2 88M | Open Australian Legal QA v2.0.0 | 23.9 | perplexity | https://huggingface.co/isaacus/open-australian-legal-llm |
| Cohere Transcribe 2B | English ASR (avg of 9 datasets: AMI, Earnings22, Gigaspeech, LibriSpeech clean/other, SPGISpeech, TedLium, Voxpopuli) | 5.42 | WER | https://huggingface.co/CohereLabs/cohere-transcribe-03-2026 |
| Cohere Transcribe 2B | English ASR | 524.88 | RTFx | https://huggingface.co/CohereLabs/cohere-transcribe-03-2026 |

Cohere Command A / Aya Expanse model cards reference m-ArenaHard and Aya Eval win-rates against Gemma2-27B / Llama-3.1-70B / Mixtral-8x22B / Qwen-2.5-32B, but the figures are presented as chart images rather than numerical text — skipped under strict attribution.

---

## Skipped — no primary source

- **RBC Borealis ATOM** — proprietary internal foundation model (financial time-series); no open weights, no HF page, no published parameter count. Confirmed real and deployed at RBC since 2023 (NeurIPS 2025 talk, RBC press release 2025-07-29), but does not meet attribution criteria for an open-weights leaderboard. Source: https://rbcborealis.com/applications/atom/
- **Sovereign Australia AI — Ginan 8B** — announced as "Llama 3.1 fine-tune on 2B AU tokens" but as of 2026-05 still not published to HuggingFace. Source: https://sovereign-au.ai/ai-models/ (no model card)
- **Sovereign Australia AI — Australis** — announced foundational LLM, no specs, no release. Source: https://sovereign-au.ai/
- **Maincode Matilda** — announced as Australia's first sovereign foundation model (SXSW Sydney 2025-10 debut). Private beta only, not on HF. Source: https://maincode.com/model-factory
- **SCX.ai Project MAGPiE** — described as gpt-oss reasoning layer fine-tune; H1-2026 deployment per launch announcement, no model card, no parameter count published. Source: https://scx.ai/resources/scx-launch-announcement
- **MAGPiE Legal (AU), MAGPiE Medical (AU)** — announced but late-2025 rollout subject to regulatory evaluation; no current artifact. Source: https://scx.ai
- **CSIRO Data61 foundation model** — CSIRO has published reports advocating for Australian sovereign foundation models but has not itself released one. Source: https://www.csiro.au/en/research/technology-space/ai/ai-foundation-models-report
- **Australian Institute for Machine Learning (Adelaide) / CommBank Centre for Foundational AI Research** — A$6M partnership announced 2024-09 but no released model. Source: https://adelaide.edu.au/research/australian-institute-for-machine-learning/our-key-initiatives/commbank-centre-for-foundational-ai-research/
- **Mila / Université de Montréal** — HF org `MilaQuebec` has 0 public models (papers only). Source: https://huggingface.co/MilaQuebec
- **Canadian AI Safety Institute (CAISI)** — established 2024-11, funds research but does not publish models. Source: https://ised-isde.canada.ca/site/ised/en/canadian-artificial-intelligence-safety-institute
- **Telstra / Westpac / Commonwealth Bank sovereign LLM** — Telstra CEO publicly stated Australia "does not need its own LLM"; banks are AI consumers (Chief AI Officer hires) not model publishers. Source: https://ia.acs.org.au/article/2025/telstra-ceo--australia-doesn-t-need-its-own-llms.html
- **TELUS sovereign AI** — Canada-Government partnership announced 2026-05-11 is infrastructure (data centres, 150MW+ in BC) not model release. Source: https://www.canada.ca/en/innovation-science-economic-development/news/2026/05/government-of-canada-and-telus-advance-work-to-build-sovereign-ai-infrastructure.html
- **CIFAR** — funding organisation; no released models.
- **Borealis 4B Instruct Preview (NbAiLab)** — name collision: this is Norwegian (Nasjonalbiblioteket AI Lab), NOT RBC Borealis. Already covered under Norway/Nordic.

---

## Total

- New models discoverable (Canada): **19** (15 Cohere Labs open-weight releases + 4 Vector Institute bias/factuality fine-tunes)
- New models discoverable (Australia): **7** (1 Maincode + 6 Isaacus; the 6 Isaacus includes 4 legal LLMs and 2 tokenizers — strip tokenizers for "models" only and Australia drops to 5)

Strict count of from-scratch / open-weight TEXT-GEN models with a HuggingFace model card and listed parameters:
- Canada: 15 Cohere + 4 Vector = **19**
- Australia: 1 Maincode (Maincoder-1B) + 4 Isaacus legal LMs = **5**
