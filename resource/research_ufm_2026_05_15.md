# Universal Foundation Models — 2026-05-15

Research scope: video gen, image gen, world models, robotic FMs, audio FMs, multi-modal native FMs, time-series FMs, tabular FMs. Strict attribution: only scores with model+benchmark+value cited from a primary or first-party leaderboard URL retained.

Current DB baseline: 1391 models / 994 benchmarks / 5408 scores.

## Category coverage matrix

| Category | Top FMs (≤2yr) — DB status | Key benchmarks — DB status |
|---|---|---|
| Video generation | Veo 3 / Veo 3.1 / Veo 3.1 Fast (in DB), Sora 2 (in DB), Sora 2 Pro (MISSING), Kling 2.0/2.5T/2.6 (in DB), Kling 3.0 family incl. Omni (MISSING — 4 SKUs), Wan 2.1/2.2/2.2 A14B MoE/2.6 (in DB), Seedance 2.0 / Dreamina Seedance 2.0 720p (in DB), Hailuo 02 (in DB), HunyuanVideo 1.5 (in DB), Pika 2.2 (in DB), Runway Gen-4/4.5 (in DB), MovieGen (NOT RELEASED, Meta paused), Grok Imagine Video (MISSING, xAI 2026-02), HappyHorse-1.0 (MISSING, Alibaba ATH 2026-04), Vidu Q3 Pro (MISSING, Shengshu 2026-01), LTX-2.3 Fast (MISSING, Lightricks). | WorldReasonBench (in DB), WorldScore static/dynamic/3D (in DB), VBench / **VBench-2.0** (MISSING — 5 categories: Human Fidelity, Controllability, Creativity, Physics, Commonsense + 18 sub-dim), AA Text-to-Video Arena Elo (MISSING), AA Image-to-Video Arena Elo (MISSING), AA Text-to-Video with Audio Arena Elo (MISSING), DesignArena Video Elo (MISSING), Video-Bench (Video-Bench/Video-Bench GH) (MISSING). |
| Image generation | FLUX.1 family + FLUX.2 dev / FLUX.2 dev Turbo (in DB), Imagen 4 (MISSING — only Imagen via Gemini-image referenced indirectly), Nano Banana 2 / Gemini 3.1 Flash Image Preview (MISSING), Nano Banana Pro / Gemini 3 Pro Image (MISSING), GPT Image 2 / GPT Image 1.5 (MISSING), Midjourney v7 (MISSING), DALL-E 4 (NOT RELEASED — DALL-E 3 superseded by GPT Image), Stable Diffusion 3.5 / SD4 (MISSING), Recraft v3 (MISSING), Ideogram 3.0 (MISSING), Adobe Firefly Image 4 (MISSING), Seedream 4.0 (MISSING), HiDream-O1-Image-Dev-2604 (MISSING — top open-weights). | GenEval / GenEval 2.0 (MISSING), AA Text-to-Image Arena Elo (MISSING), LM Arena Image Elo (MISSING), DesignArena Image Elo (MISSING), HRS-Bench (MISSING), PartiPrompts (MISSING), PaintRect (MISSING). |
| World models | Cosmos Predict 2.5 (2B/14B), Cosmos Reason 1/2, Cosmos Policy, Cosmos Transfer 2.5 (in DB), Genie 2/3 (in DB), MolmoAct / MolmoAct 2 (in DB), HY-World 2.0 Tencent (in DB), Genesis AI GENE-26.5 (in DB), AgiBot Genie-Envisioner (in DB), 1X World Model (in DB). | WorldReasonBench, EWMBench, WorldModelBench, PAI-Bench, Cosmos Embodied/Intuitive/Physical CS, 1X compression/sampling, SimplerEnv (in DB). RoboArena Elo (in DB). VLABench (in DB). |
| Audio / Voice | GPT-4o-Audio (in DB), Gemini 2.5 Flash Native Audio (in DB), Step-Audio R1.1 / Step-Audio-TTS / EditX (in DB), Kimi-Audio / Qwen2-Audio (in DB), LFM2-Audio (in DB), MiMo-Audio (in DB), CSM-1B (in DB). GPT-Realtime-2 / GPT-Realtime-Translate / GPT-Realtime-Whisper (MISSING, OpenAI 2026-05-08 GA), Grok Voice Agent / Grok Voice Think Fast 1.0 (MISSING, xAI), Sesame CSM-3B/8B (NOT OPEN-SOURCED — only CSM-1B public), Suno V5 / V5.5 (MISSING), Udio V2 (MISSING), Stable Audio 2.0 (MISSING). | Big Bench Audio (in DB), τ-Voice (in DB), Audio MultiChallenge (in DB), MMAU, AudioBench, Full Duplex Bench, Voice Interaction (in DB). Speech-to-Speech AA leaderboard (MISSING), DesignArena Music Elo (MISSING), Music side-by-side Suno Elo (MISSING). |
| Multi-modal native | Pixtral 12B / Large 124B (in DB), Qwen3-VL 8/30B-A3B/32B/235B (in DB), InternVL 2.5/3/3.5 family (in DB), Cohere Aya Vision 8B + Aya Expanse (in DB), Apple MM1.5 (MISSING), Molmo / Molmo2 (in DB). | MMMU, MMMU-Pro, MMStar, MMBench, OCRBench v2, ChartQA, BLINK, MathVista, MathVision, RealWorldQA, RefCOCO, MLVU, Video-MME, Video-MMMU, MMVU (all in DB). |
| Time-series | TimesFM 1.0 200M, TimesFM 2.5 200M (in DB), Chronos-T5 Large + Chronos-Bolt + Chronos 2 (in DB), Moirai 1.0-R-Large (in DB). Moirai 2.0 / Moirai-MoE (PARTIAL — Moirai-MoE MISSING; Moirai 2.0 paper 2025-11). | GIFT-Eval (in DB, single MASE score), TimesFM zero-shot eval (in DB). LSF-Eval (MISSING), TFB-Bench (MISSING), TS-Bench (MISSING). |
| Tabular | TabPFN v2 / TabPFN 2.5 (in DB). **TabPFN 3 / TabPFN-3-Plus / TabPFN-3-Plus (Thinking)** (MISSING — May 2026). TabLLM / TabFM (MISSING). | TabArena (MISSING), RelBenchV1 (MISSING), TabSTAR (MISSING), OpenML CC18 (MISSING), TabReD (MISSING). |

## New benchmarks to register

| id | description | metric | source |
|---|---|---|---|
| `vbench_2_0_overall` | VBench-2.0 overall score — intrinsic faithfulness across 5 categories (Human Fidelity, Controllability, Creativity, Physics, Commonsense) + 18 sub-dim. | weighted % | https://huggingface.co/spaces/Vchitect/VBench_Leaderboard ; arxiv 2503.21755 |
| `vbench_2_0_physics` | VBench-2.0 Physics sub-dim. | % | same |
| `vbench_2_0_human_fidelity` | VBench-2.0 Human Fidelity sub-dim. | % | same |
| `vbench_2_0_commonsense` | VBench-2.0 Commonsense sub-dim. | % | same |
| `aa_t2v_arena_elo` | Artificial Analysis Text-to-Video Arena (blind pairwise Elo, with audio). | Elo | https://artificialanalysis.ai/video/leaderboard/text-to-video |
| `aa_i2v_arena_elo` | Artificial Analysis Image-to-Video Arena Elo. | Elo | https://artificialanalysis.ai/video/leaderboard/image-to-video |
| `aa_t2i_arena_elo` | Artificial Analysis Text-to-Image Arena Elo. | Elo | https://artificialanalysis.ai/image/leaderboard/text-to-image |
| `aa_speech_to_speech_elo` | Artificial Analysis Speech-to-Speech model leaderboard. | Elo | https://artificialanalysis.ai/speech-to-speech |
| `designarena_video_elo` | DesignArena (Arcada Labs) Video Arena Elo + Video Editing Arena Elo + I2V Elo. | Elo | DesignArena public leaderboard (per xAI / Grok announce posts) |
| `geneval_overall` | GenEval compositional accuracy — object/count/position/color/attribute. | % | https://github.com/djghosh13/geneval |
| `geneval_2_0` | GenEval 2.0 compositional accuracy (newer). | % | per AA / 2026 image-gen literature references |
| `tabarena_elo` | TabArena unified tabular leaderboard (incl. TabPFN-3-Plus Thinking lead at +200/+420 Elo). | Elo | TabPFN-3 technical report (arxiv 2605.13986) |
| `relbench_v1` | RelBench V1 relational-data SOTA. | task-avg | TabPFN-3 tech report |
| `tabstar` | TabSTAR tabular-text benchmark. | task-avg | TabPFN-3 tech report |
| `gift_eval_mape_median` | GIFT-Eval median MAPE (vs Seasonal Naive). 97 task configs / 55 datasets / 144k series. | normalized MAPE | https://huggingface.co/spaces/Salesforce/GIFT-Eval ; arxiv 2410.10393 |
| `gift_eval_crps_median` | GIFT-Eval median CRPS. | normalized CRPS | same |
| `gift_eval_rank` | GIFT-Eval cross-task rank. | rank | same |
| `suno_elo` | Suno side-by-side music ELO (blind listening). | Elo | Suno V5.5 blog / Suno research notes (suno.com/blog/v5-5) |

## New models to register

| model_id | vendor | release | sources |
|---|---|---|---|
| `xai/grok-imagine-video-1.0` | xAI | 2026-02-02 | https://artificialanalysis.ai/video/models/grok-imagine-video |
| `openai/sora-2-pro` | OpenAI | 2025-12 (Sora 2 (December)) — service discontinued 2026-03-24 per coverage; preserve for historical scores | AA T2V leaderboard |
| `bytedance/dreamina-seedance-2.0-720p` | ByteDance Seed | 2026-03 | AA T2V leaderboard #1 with audio (Elo 1222) |
| `alibaba-ath/happyhorse-1.0` | Alibaba ATH Innovation Unit | 2026-04-27 (grayscale CN) | AA T2V Elo 1214 #2 (with audio) / 1354 (no audio #1) |
| `kuaishou/kling-3.0` | Kuaishou | 2026-02 | AA T2V — Kling 3.0 Omni 1080p Pro Elo 1105, Kling 3.0 1080p Pro Elo 1102, Kling 3.0 720p Std Elo 1089, Kling 3.0 Omni 720p Std Elo 1085 |
| `kuaishou/kling-3.0-omni-1080p-pro` | Kuaishou | 2026-02 | same |
| `vidu/vidu-q3-pro` | Shengshu Tech (Vidu) | 2026-01 | AA T2V Elo 1086; #1 in CN, #2 global per AA |
| `lightricks/ltx-2.3-fast` | Lightricks | 2026 | AA T2V top open-weights Elo 979 |
| `openai/gpt-image-2-high` | OpenAI | 2026 | https://artificialanalysis.ai/image/leaderboard/text-to-image — Elo 1336 (9576 samples) |
| `openai/gpt-image-1.5-high` | OpenAI | 2025 | AA T2I Elo 1268 |
| `google/nano-banana-2` | Google (Gemini 3.1 Flash Image Preview) | 2026 | AA T2I Elo 1263; LM Arena leader |
| `google/nano-banana-pro` | Google (Gemini 3 Pro Image) | 2026 | AA T2I Elo 1219; LM Arena +171 record |
| `bytedance/seedream-4.0` | ByteDance | 2026 | AA T2I Elo 1197 |
| `hidream/hidream-o1-image-dev-2604` | HiDream | 2026 | AA T2I open-weights leader Elo 1187 |
| `black-forest-labs/flux.2-dev-turbo` | BFL | 2026 | AA T2I Elo 1161 (open) |
| `midjourney/midjourney-v7` | Midjourney | 2025-06 default | press / Midjourney site |
| `ideogram/ideogram-3.0` | Ideogram | 2025 | press; 90-95% text rendering claim |
| `recraft/recraft-v3` | Recraft | 2025 | press (SVG-native) |
| `adobe/firefly-image-4` | Adobe | 2025-2026 | Adobe Firefly product page |
| `stabilityai/stable-diffusion-3.5-large` | Stability AI | 2024-10 / refresh 2026 | HF model card |
| `openai/gpt-realtime-2` | OpenAI | 2026-05-08 (GA) | https://earezki.com/ai-news/2026-05-08-openai-releases-three-realtime-audio-models- |
| `openai/gpt-realtime-translate` | OpenAI | 2026-05-08 | same |
| `openai/gpt-realtime-whisper` | OpenAI | 2026-05-08 | same |
| `xai/grok-voice-think-fast-1.0` | xAI | 2026 | AA / Big Bench Audio leaderboard cited via @ArtificialAnlys |
| `xai/grok-voice-agent` | xAI | 2026 | same |
| `suno/suno-v5` | Suno | 2026 | https://suno.com/blog/v5-5 |
| `suno/suno-v5.5` | Suno | 2026 | same |
| `udio/udio-v2` | Udio | 2026 | press |
| `stabilityai/stable-audio-2.0` | Stability AI | 2024-2025 (active product) | stability.ai |
| `apple/mm1.5` | Apple | 2024-10 + refresh 2026 | Apple research paper |
| `salesforce/moirai-2.0` | Salesforce | 2025-11 | arxiv 2511.11698 |
| `salesforce/moirai-moe` | Salesforce | 2024-2025 | arxiv 2410.10469 |
| `priorlabs/tabpfn-3` | Prior Labs | 2026-05 | https://priorlabs.ai/technical-reports/tabpfn-3 ; arxiv 2605.13986 |
| `priorlabs/tabpfn-3-plus-thinking` | Prior Labs | 2026-05 | same |

## Extractable scores (strict attribution — model + benchmark + value + URL all present)

### AA Text-to-Video Arena Elo (with audio) — source: https://artificialanalysis.ai/video/leaderboard/text-to-video (2026-05)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| ByteDance Dreamina Seedance 2.0 720p | aa_t2v_arena_elo | 1222 | Elo | AA T2V LB |
| Alibaba-ATH HappyHorse-1.0 | aa_t2v_arena_elo | 1214 | Elo | AA T2V LB |
| KlingAI Kling 3.0 Omni 1080p (Pro) | aa_t2v_arena_elo | 1105 | Elo | AA T2V LB |
| KlingAI Kling 3.0 1080p (Pro) | aa_t2v_arena_elo | 1102 | Elo | AA T2V LB |
| Google Veo 3.1 | aa_t2v_arena_elo | 1102 | Elo | AA T2V LB |
| Google Veo 3.1 Fast | aa_t2v_arena_elo | 1098 | Elo | AA T2V LB |
| KlingAI Kling 3.0 720p (Standard) | aa_t2v_arena_elo | 1089 | Elo | AA T2V LB |
| OpenAI Sora 2 (December) | aa_t2v_arena_elo | 1087 | Elo | AA T2V LB |
| Vidu Q3 Pro | aa_t2v_arena_elo | 1086 | Elo | AA T2V LB |
| KlingAI Kling 3.0 Omni 720p (Standard) | aa_t2v_arena_elo | 1085 | Elo | AA T2V LB |
| Lightricks LTX-2.3 Fast | aa_t2v_arena_elo | 979 | Elo | AA T2V LB (top open-weights) |

### AA Image-to-Video Arena Elo — source: https://artificialanalysis.ai/video/leaderboard/image-to-video

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| Google Veo 3.1 Fast | aa_i2v_arena_elo | 1086 | Elo | AA I2V LB (with audio) |
| Google Veo 3.1 | aa_i2v_arena_elo | 1083 | Elo | AA I2V LB (with audio) |

### AA Text-to-Image Arena Elo — source: https://artificialanalysis.ai/image/leaderboard/text-to-image (2026-05)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| OpenAI GPT Image 2 (high) | aa_t2i_arena_elo | 1336 | Elo (9576 comparisons) | AA T2I LB |
| OpenAI GPT Image 1.5 (high) | aa_t2i_arena_elo | 1268 | Elo | AA T2I LB |
| Google Nano Banana 2 (Gemini 3.1 Flash Image Preview) | aa_t2i_arena_elo | 1263 | Elo | AA T2I LB |
| Google Nano Banana Pro (Gemini 3 Pro Image) | aa_t2i_arena_elo | 1219 | Elo | AA T2I LB |
| ByteDance Seedream 4.0 | aa_t2i_arena_elo | 1197 | Elo | AA T2I LB |
| HiDream-O1-Image-Dev-2604 | aa_t2i_arena_elo | 1187 | Elo | AA T2I LB open-weights |
| BFL FLUX.2 [dev] Turbo | aa_t2i_arena_elo | 1161 | Elo | AA T2I LB open-weights |
| BFL FLUX.2 [dev] | aa_t2i_arena_elo | 1159 | Elo | AA T2I LB open-weights |

### Big Bench Audio (speech reasoning) — source: @ArtificialAnlys X post + AA speech-to-speech LB

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| StepFun Step-Audio R1.1 (Realtime) | big_bench_audio | 97.6 | % | AA SS LB (existing 98.0 row in DB — verify exact value; X post says 97.6 leader, DB shows 98.0 — discrepancy, do not overwrite without re-fetch) |
| xAI Grok Voice Think Fast 1.0 | big_bench_audio | 97.1 | % | https://x.com/ArtificialAnlys/status/2001388724987527353 |
| OpenAI GPT-Realtime-2 (high) | big_bench_audio | 96.6 | % | OpenAI launch / build-fast-with-ai writeup |
| xAI Grok Voice Agent | big_bench_audio | 92.3 | % | AA X post (cited as #1 vs Gemini 2.5 / GPT Realtime at announcement) |

### Music side-by-side ELO — source: suno.com/blog/v5-5 + 2026 press

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| Suno V5 | suno_elo | 1293 | Elo (side-by-side) | suno.com/blog/v5-5 and aggregator coverage |

### TabArena Elo — source: TabPFN-3 technical report (priorlabs.ai/technical-reports/tabpfn-3 ; arxiv 2605.13986)

| model | benchmark | value | unit | source |
|---|---|---|---|---|
| TabPFN-3-Plus (Thinking) | tabarena_elo | +200 vs non-TabPFN baseline (overall); +420 on largest subset | Elo delta | TabPFN-3 tech report |

(Numeric absolute Elo not exposed in the tech report summary; treat as relative-only until full table fetched.)

### Video Generation Benchmarks Leaderboard 2026 — composite of VBench / VBench-2.0 published rankings

Wan 2.2 overall VBench: **84.7%** (open-source leader claim) — source: awesomeagents.ai 2026 leaderboard digest citing VBench HF Space; treat as secondary citation until raw HF Space CSV exported.

### GIFT-Eval — source: arxiv 2410.10393 + HF Space Salesforce/GIFT-Eval

DB already has placeholder MASE values for TimesFM 1.0 (0.82) and TimesFM 2.5 (0.74). Full leaderboard (Chronos-2, Moirai, Moirai 2.0, Moirai-MoE, TTM, 30+ models, 97 task configs) requires Playwright fetch of HF Space — WebFetch returned only metadata. Do not stub more scores until full table extracted.

## Skipped (no clean primary source today)

- **MovieGen (Meta)** — not released publicly as a foundation model; only the research paper. Skip.
- **DALL-E 4** — not released; OpenAI shifted to GPT Image branding. Treat GPT Image 1.5 / GPT Image 2 as the OpenAI image-FM lineup; do not register DALL-E 4.
- **Sesame CSM-2 / Sesame-1** — only CSM-1B is publicly released; CSM-3B and CSM-8B were trained but not open-sourced. No public benchmark scores. Skip.
- **Apple MM1.5** — released 2024-10 as a research paper; production deployment unclear and no fresh 2026 leaderboard score under that name. Register model row only, no scores yet.
- **VBench-2.0 per-model sub-dimension scores** — HF Space WebFetch returned only metadata, not the data table. Need Playwright with the Gradio iframe loaded to extract rows for Veo, Vidu, Wan, Seedance, Kling, HunyuanVideo, Pika. Deferred to a follow-up Playwright pass (see CLAUDE.md AA pattern).
- **Stable Diffusion 3.5 → SD4** — SD 4 not released; only SD 3.5 Large (Oct 2024) is the latest Stability image flagship. Register SD 3.5 Large but no SD4.
- **Pika 2.x ELO** — Pika 2.2 in DB has no Elo score on AA leaderboard top-10 cut; skip pending lower-rank fetch.
- **Composite "Big Bench Audio" Step-Audio R1.1 mismatch** — DB has 98.0, AA X-post cites 97.6 leader. Re-fetch live AA page before correcting.
- **HRS-Bench / PaintRect / PartiPrompts** — older static benchmarks, mostly superseded by GenEval 2 + arena Elo. Register descriptors only if score extraction is feasible.
- **TabLLM / TabFM** — niche academic baselines, no public live leaderboard. Skip until needed.
- **TFB-Bench / LSF-Eval / TS-Bench** — academic benchmarks, GIFT-Eval is the practical SOTA hub. Skip unless requested.

---

## Summary brief

Top 5 UFM categories with clean extractable benchmark data right now:

1. **Image generation (AA T2I Arena)** — 8 ranked models with explicit Elo + sample-count. Cleanest single-source extraction; GPT Image 2 high at 1336 Elo is the SOTA marker. None of the top 5 (GPT Image 2, GPT Image 1.5, Nano Banana 2/Pro, Seedream 4.0) are in DB.
2. **Video generation (AA T2V Arena)** — 10+ ranked models with audio variant, 4 Kling 3.0 SKUs MISSING from DB plus Grok Imagine, HappyHorse, Vidu Q3, Dreamina Seedance 2.0 720p, LTX-2.3 Fast.
3. **Audio/voice (Big Bench Audio + AA Speech-to-Speech)** — GPT-Realtime-2 96.6, Grok Voice Think Fast 1.0 97.1, Grok Voice Agent 92.3; all three OpenAI 2026-05-08 GA models plus xAI's two voice models are missing.
4. **Tabular FMs (TabPFN-3)** — Brand-new model (May 2026) with TabArena +200/+420 Elo deltas vs. non-TabPFN baselines on standard / largest splits, plus RelBenchV1 and TabSTAR SOTA. No tabular benchmark currently registered in DB.
5. **Time-series (GIFT-Eval)** — Already partially covered (TimesFM rows). Need full Salesforce HF Space extraction via Playwright to populate Chronos-2, Moirai, Moirai 2.0, Moirai-MoE, TTM on MAPE/CRPS/rank.

**Total new yield (registrable today, strict attribution):** ~34 new models, 17 new benchmarks, ~25 high-confidence scores (AA T2I 8, AA T2V 11, AA I2V 2, Big Bench Audio 3 fresh, Suno Elo 1), with TabPFN-3 deltas as soft scores pending absolute-Elo table extraction.

**Biggest gaps:**
- **Image generation arena coverage is essentially zero** in DB — no Elo score for any image-gen model despite 8+ models with public Elo. This is the single biggest miss and trivial to fix from one AA page.
- **VBench-2.0 per-model sub-dimension scores** — the most authoritative video-gen benchmark (intrinsic faithfulness, physics, commonsense) is gated behind a Gradio HF Space that needs Playwright to enumerate rows. High-leverage extraction but requires JS rendering.
- **Music/audio generation models** (Suno V5/V5.5, Udio V2, Stable Audio 2.0) — entire category missing; only Suno V5 has a clean public Elo (1293).
- **Tabular FMs** — TabPFN-3 (May 2026) is a category-defining release with no Elo benchmark registered in DB at all.
- **Real-time voice (OpenAI 2026-05-08 GA: GPT-Realtime-2 / Translate / Whisper, xAI Grok Voice family)** — three new OpenAI models and at least two xAI models with Big Bench Audio scores, none registered.

Recommended next step: Playwright pass on `artificialanalysis.ai/image/leaderboard/text-to-image`, `/video/leaderboard/text-to-video`, `/video/leaderboard/image-to-video`, `/speech-to-speech`, and the Vchitect VBench_Leaderboard Gradio frame to land 50+ strict-attribution scores in one session.
