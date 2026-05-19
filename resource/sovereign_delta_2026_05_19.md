# Sovereign AI delta sweep — 2026-05-13 → 2026-05-19

Sweep date: 2026-05-19
Window: 6 days (since previous sweep 2026-05-13)
Countries scanned: Korea, China, France, Japan, India, Germany, UAE, Singapore, Switzerland, Russia, USA, Canada, Australia
Verdict: **Very quiet window.** Only one tangential new release with primary-source artifact. No major sovereign-lab launches.

## Found — NEW releases

| Country | Vendor | Model | Suggested ID | Released | License | Primary source |
|---|---|---|---|---|---|---|
| — (Spain*) | Juan S. Santillana (independent) | VectraYX-Nano (Spanish cybersecurity SLM, 41.95M params) | jsantillana/vectrayx-nano | 2026-05-13 (arxiv v1; revised v2 2026-05-18) | open-weight (HF release, GGUF F16) | https://arxiv.org/abs/2605.13989 ; https://huggingface.co/jsantillana/vectrayx-nano |

*Spain is **not** in the 13-country list. Single independent author, no Spanish sovereign lab affiliation. Logged for completeness; do not ingest as sovereign-AI.

## Score extractions (if any)

None. VectraYX-Nano paper reports internal-only metrics on private corpus; no externally comparable benchmark scores published with strict attribution.

## Skipped — already in DB / not new SKU / no primary source

| Item | Reason |
|---|---|
| Google I/O 2026 keynote (May 19) | **Live today** but as of sweep time no Gemini model name has been officially released with primary source. Pre-event coverage names "Gemini 3.2 Flash" (May 5 stealth deploy — already pre-window, already trickling into DB via API gateways), "Gemini Spark" (agent product, not a new base model), "Gemini Omni" (leaked, not released), "Gemini 4" (rumor). Re-sweep after May 20 when blog.google posts confirmed model card. |
| Qwen3-Coder-Next (Alibaba) | Initial search hit suggested May 14, 2026 release. Cross-verified with HuggingFace card, the-decoder, and Qwen blog: actual release **Feb 4, 2026**. Already in DB. |
| Tencent Hunyuan Hy3-Preview (295B/21B MoE) | Released 2026-04-22/24, **before** window. HuggingFace model card dated 2026-04-23. Already in DB or backlog. |
| DeepSeek V4 Flash / V4 Pro | Released 2026-04-24. Before window. Already in DB. |
| Sakana KAME / TwELL (Japan) | KAME: 2026-05-03. TwELL: 2026-05-11. Before window. Already in or due for DB. |
| TII Falcon Perception (UAE) | Released 2026-05-03. Before window. Already in DB. |
| MiniMax M2.7 / M2.5 Highspeed | Initial "May 15" claim wrong — actual M2.7 release **2026-03-18**, M2.5 release 2026-02-12. Already in DB. |
| GigaChat Ultra (Sber/Russia) | March 2026. Before window. May 7 news = MPEI exam result, not new model. |
| Sarvam Vikram 30B / 105B + BharatGen Param2-17B-Thinking | AI Impact Summit Feb 2026. Before window. Already in DB. |
| Yandex search reasoning update | UI/product feature, not a new released foundation model artifact. |
| Naver / Kakao / Samsung / KT / Trillion (Korea) | No new model releases in window. Korea sovereign-AI contest second-round selection still pending. |
| Cohere (Canada) | No new model release in window. Tiny Aya = Feb 2026 already in DB. |
| MainCode / Isaacus (Australia) | Matilda / Kanon-2 = already in DB. No new release in window. |
| Aleph Alpha / Fraunhofer (Germany) | Aleph-Alpha-GermanWeb dataset = arxiv 2505.00022 (May 2025). No new model release in window. Cohere–Aleph Alpha merger talks are corporate, not a model artifact. |
| SEA-LION (Singapore) | Last update SEA-LION-Embedding suite March 2026. No release in window. |
| Apertus (Switzerland) | Released September 2025. No update in window. |
| Mistral (France) | Last release Mistral Medium 3.5 on 2026-04-29. No release in window. |
| Microsoft Copilot Cowork, Anthropic Claude Platform on AWS, Claude for Small Business | Platform / distribution events, not new base-model releases. Excluded by strict-attribution rule. |
| Notion Developer Platform, Dotmatics Luma Agent, Broadridge agentic, Sweet Attack (May 13) | Application-layer / agent products, not sovereign-AI foundation models. |

## Total
- New models: **0** matching sovereign-AI strict-attribution criteria across the 13 specified countries.
- New scores: **0**.
- Tangential (logged for context, not ingested): 1 — VectraYX-Nano (Spain, individual researcher, outside 13-country scope).

## Notes for next sweep (2026-05-20+)
1. **Re-pull Google I/O 2026 keynote results** the morning of May 20 — official Gemini model name + capability tier + Gemma 4 weights are expected. Search `blog.google` and `developers.googleblog.com` for canonical post.
2. Anthropic Mythos full release rumored June-July; track for window after that.
3. Korea sovereign-AI contest second-round selection (Kakao/KT/Konan re-bid) — outcome could land any time H1 2026.
4. Hy3-preview (Tencent) is the largest unsung model from the previous April window — confirm it's been ingested into DB; if not, backfill (295B/21B MoE, SWE-Bench Verified 74.4, GPQA Diamond 87.2, MIT-style Tencent Hy Community License).
