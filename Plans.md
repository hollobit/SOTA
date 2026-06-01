# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 45 — Qwen-VLA paper deep-mine (Alibaba Qwen Team, arxiv 2605.30280, 2026-06-01)
**1,612 models · 1,329 benchmarks · 6,944 scores · 16 active tabs + Frontier Compare composite split (composite_eci 33 cols / composite_aaii 13 cols)**

### 2026-06-01 Session 45 — Qwen-VLA unified VLA paper (2 user links → same release)
- **2 user-provided links converge**: qwen.ai/blog?id=qwenvla (JS-shell) + arxiv 2605.30280 (authoritative, 34pp). Qwen-VLA = **Qwen3.5-4B backbone + DiT flow-matching action decoder + 4-stage training** (T2A pre-train → CPT → SFT → RL on SimplerEnv). Unified VLA across tasks/environments/embodiments.
- **6 NEW models**: alibaba/qwen-vla-base · qwen-vla-instruct · qwen-vla-aloha-pretrain · qwen-vla-aloha-no-pretrain · amap-cvlab/abot-m0 (prior RoboTwin-Hard SOTA 85.0) · starvla/starvla-oft (prior Simpler-WidowX SOTA 64.6)
- **KEY SOTAs**: Qwen-VLA-Instruct **RoboTwin-Hard 87.2** (+2.2 over ABot-M0) · **Simpler-WidowX 73.7** (+9.1 over StarVLA-OFT) · **SimplerEnv-OOD 32.0** (vs π0.5 12.6 — **2.5x gap**) · **DOMINO zero-shot SR 26.6** (beats every fine-tuned baseline incl. PUMA 17.2) · ALOHA real hardware in-domain pretrain 83.6 vs no-pretrain 48.5 (**+35pp pretrain gain**) · **R2R nav SR 57.5** (beats StreamVLN 56.9)
- **8 NEW benches**: robotwin_easy/hard split · simpler_widowx · robocasa_gr1 · **simplerenv_ood (NEW dataset introduced by paper, 6 OOD WidowX tasks)** · domino_sr · aloha_real_in_domain · r2r_val_unseen_sr
- 8-tab audit: Sovereign CN Alibaba +4 Qwen-VLA + Physical AI VLA Manipulation Suites +6 models +8 benches. EXCLUDED comparison models (Being-H0.5/RDT-1B/InternVLA-M1/VLA-Adapter/PUMA/NaVid/NaVILA/StreamVLN) per scope. **+6/+8/+36** = 1612/1329/6944. v=20260601d

### 2026-06-01 Session 44 — MiniMax M3 release + Biohub ESM page confirmed S42 coverage
- MiniMax M3 native multimodal MSA 1M ctx open-weight, **SWE-Bench Pro 59.0%** (surpasses GPT-5.5+Gemini 3.1 Pro, approaches Opus 4.7), PostTrainBench 0.37. 3 NEW benches: PostTrainBench/SWE-fficiency/KernelBench Hard. Biohub ESM page 0 ingest (S42-covered). **+1/+3/+8** = 1606/1321/6908. v=20260601c

### 2026-06-01 Session 43 — NVIDIA Nemotron developer page deep-mine (4 family announcements)
- User-provided https://developer.nvidia.com/nemotron — main page description-only; 4 NEW Nemotron families surfaced. Sub-pages (/nemotron-rag/-parse/-speech/-safety) 404 — actual data on HF model cards (nvidia/*) + arxiv 2511.20478 + NVIDIA blog. Cherry-pick from 12 found models + 24 found benches.
- **Models** (7): nemotron-colembed-vl-8b-v2 (**ViDoRe V3 NDCG@10 63.54 SOTA**, V1 92.65) + 4b-v2 sibling · llama-embed-nemotron-8b (**MMTEB v2 Mean Task 69.46 leader**) · llama-nemotron-rerank-vl-1b-v2 · nemotron-parse-1.1 (885M VLM) · nemotron-ocr-v2 (83.9M, **OmniDoc EN NED 0.048 SOTA** lower=better) · parakeet-tdt-0.6b-v3 (**LibriSpeech clean WER 1.93%**, Open ASR avg 6.34%)
- **Bench families** (11): ViDoRe V1/V2/V3 (visual document retrieval) · MMTEB v2 (multilingual text embedding) · OmniDocBench EN/ZH (document understanding NED lower=better) · 5 ASR benches (LibriSpeech×2/AMI/GigaSpeech/Open ASR Leaderboard avg WER lower=better)
- 8-tab audit: FC multimodal +ViDoRe 3 +OmniDoc 2. ASR + MMTEB v2 data-driven only (FC no audio/embedding axis). SKIPPED: VDR rerank-only pipeline, MIRACL/MLDR/BEIR-TechQA (rerank), throughput, MMTEB Borda votes, OmniDoc Text/Table sub-NED, Parse TC variant, OCR-en sub, streaming-en, Safety Guard aggregate 84.2%, Content Safety 4B aggregate 84%. **+7/+11/+15** = 1605/1318/6900. v=20260601b

### 2026-05-31 Session 42 — ESM Cambrian / ESMFold2 deep-mine (71MB PDF, 104pp; compressed)
- Candido et al Biohub+EvolutionaryScale. 7 models (ESMC 300M/600M/6B · ESMFold2/-Fast · ESM2-15B · Boltz-2). FoldBench 6 modality sub-benches + Recent-PDB PPI + p_at_l_lr + megascale_dg. SOTAs: ESMFold2+MSA PPI 76% (vs AF3 73%) · AbAg 53% (vs AF3 47%) · ESMC 6B contact 0.725 (+22% vs ESM2-15B) · ESMFold2-Fast 9.4s @L=1024 (2.2x AF3). **+7/+9/+19** = 1598/1307/6885. v=20260531c

### 2026-05-31 Session 41 — WorldArena.ai HF Space re-investigation (compressed)
- HF Space grew 6→86 baselines since S38. 3 NEW frontier video-gen: Veo 3.1 (#3 EWMScore 0.578, Persp 0.996+Instr 0.971 SOTA), Wan 2.2 (0.549), **Wan 2.6 #2 0.592**. Per-dim SOTAs: Wan 2.6 Image/Motion · Veo 3.1 BG/Interact/Persp/Instr · Ctrl-World Trajectory 0.482. Physical AI +16 sub-metrics +3 models. **+1/+16/+131** = 1591/1298/6866. v=20260531b

### 2026-05-31 Session 40 — Deep re-mine round 2 (compressed)
- Opus 4.8 sys card unmined (+7 NEW: AutomationBench/BioPipelineBench/BioMysteryBench Human-Solvable/GMMLU 90.4/MILU 90.3/INCLUDE 87.6/AECI 155.5 + 3 net-new). SkillOpt 2605.23904 (+SearchQA/LiveMath, GPT-5.5 +29.3pp uplift). WorldArena T2 Policy public (Ctrl-World 0.986 SOTA). AA CritPT/MMLU-Pro Playwright full charts (+17 net-new). Vellum CONFIRMED Resources-only. **+0/+10/+35** = 1590/1282/6735. v=20260531a

### 2026-05-30 Session 39 — Deep re-mine of S33-S38 sources (user-requested completeness audit)
- User: "꼼꼼하게 읽고 표 등에서 누락된 모델/벤치마크/평가결과 조사." Re-mine S33-S38 partial ingests where scope-tight decisions left value on the table. Direct WebFetch verification of FACTS Table 1 (all 4 sub-benches × 15 frontier), PAI-Bench Conditional JSON, CompassRank per-model sub-scores.
- **Models** (7): openai/gpt-5.3 + nvidia/nemotron-3-120b (BenchCAD comparison) · idea/rex-omni-3b + bytedance/seed1.5-vl (LocateAnything baselines; SEED1.5-VL HumanRef 81.6 SOTA) · nvidia/cosmos-transfer2.5-2b + alibaba/wan-2.2-fun-a14b-control + alibaba/wan-2.2-fun-5b-control (PAI-Bench-C, 5B Depth 9.317 SOTA)
- **Bench families** (13): 6 LocateAnything detection (dense200/visdrone/doclaynet/m6doc/totaltext/humanref) · 3 BenchCAD sub-tasks (Edit Acc — GPT-5.3 thinking 0.865 SOTA / QA Code Total — Gemini 3.1 Pro 0.838 / Vision2Code — Gemini 3.1 Pro 0.397) · facts_multimodal (Gemini 2.5 Pro 46.9 leads) · pai_bench_c_quality · mmvet + mmbench_v1_1 (CompassRank)
- **MAJOR BACKFILL**: FACTS grounding_v2/parametric/search filled 1→15 each (Gemini 2.5 Pro 74.2 grounding leader, Gemini 3 Pro 76.4 parametric SOTA, Gemini 3 Pro 83.8 search SOTA). CompassRank 6 existing benches enriched (mmmu 9→17, mathvista 2→10, mmstar 1→9, ai2d 4→12, hallusionbench 1→9). SKIPPED OCRBench (unit conflict).
- 8-tab audit ran post-ingest per new memory rule → 4 tabs patched (FC reasoning/coding/multimodal, Cyber-Coding CODING, Physical AI). LocateAnything 6 specialist detection benches deliberately not propagated to FC (would render empty columns). **+7/+13/+143** = 1590/1272/6700. v=20260530d

### 2026-05-30 Session 38 — 13-link multi-source ingest (every key JSON source direct-WebFetch verified)
- 13 user links → 9 NEW models, 6 NEW benchmarks, 21 scores. Critical de-dup: arxiv 2512.01989 = PAI-Bench (NOT PhysBench — PhysBench is arxiv 2501.16411, ICLR 2025). PhysBench JS-rendered no data, SKIPPED. PIQA frontier-dead (no 2026 vendors), CodeSOTA Robotics editorial/loose, SAILResearch top 5 already in DB → Resources only.
- **Models** (9): NVIDIA Cosmos3-Super (PAI-Bench-G SOTA 83.9 — first to exceed Source oracle 82.6) · Cosmos3-Nano · Cosmos-Reason2-32B (PAI-Bench-U SOTA 70.8 — beats GPT-5 thinking 69.8) · Cosmos-Reason2-8B · Tsinghua Ctrl-World (WorldArena named-baseline leader 0.6006) · ByteDance IRASim · HuggingFace SmolVLA · Alibaba Wan-2.2-I2V-A14B · Qwen3-VL-235B-A22B-Instruct
- **Bench families** (6): WorldArena (Tsinghua FIB embodied world models, EWMScore over 16 metrics) · PAI-Bench-G + PAI-Bench-U (SHI Labs/CMU physical-AI generation+understanding) · PhAIL v1.0 UPH (Positronic real-hardware bin-picking — Pi 0.5 59.2 SOTA, Human 1330.8 = 22x gap) · MMLU-Pro AA (AA independent re-run, SEPARATE bench to avoid clobbering vendor mmlu_pro) · IPhO 2025 (Meta Muse Spark 82.6 SOTA on freshly-minted physics olympiad)
- strict-attribution: CritPT additions only net-new model rows (gpt-5.5-pro 30.6 SOTA, gpt-5.4-pro 30.0), existing gpt-5.5 27.0 preserved. MMLU-Pro AA registered separately (73 vendor mmlu_pro scores untouched). 1 PDF archived + 12 Resources/seed entries. Menus: FC reasoning(+mmlu_pro_aa +ipho_2025), Physical AI VLA Manipulation(+phail) + World Model(+worldarena +pai_bench_g) + Embodied Reasoning(+pai_bench_u). **+9 / +6 / +21** = 1583/1259/6557. v=20260530b

### 2026-05-30 Session 37 — 17-link multi-source ingest (compressed)
- gemini-3-flash-preview + 8 sovereign-CN VLMs (JT3.5/SenseNova-V6.5-Pro/TeleMM-2.0±Thinking/InternVL3-78B/MiniCPM-o-4.5/Ovis2.5-9B/Step-1o). Benches: 3 CAD code-gen (CADBench MIT / BenchCAD UVA-Rice / Text2CAD L1-L4) + SCADBench ELO arena (gemini-3.1-pro-preview 1721 SOTA) + FACTS suite (Gemini 3 Pro 68.8 SOTA) + CompassRank multimodal (JT3.5 82.7 sovereign-CN SOTA) + T-Bench 2.1 net-new. SKIP: Modelrift/world-models/GigaBrain/Kilo TB2/official SWE/T-Bench v1.0/Vellum (Resources). **+9/+8/+58**=1574/1253/6536. v=20260530a

### 2026-05-29 Session 36 — 10-link multi-source analysis (compressed)
- AgentDoG 1.5-4B (Shanghai agent-safety) · Gemini Embedding 2 (MTEB-Code 84.0 SOTA) · LocateAnything-3B (NVIDIA, ScreenSpot-Pro 60.3 SOTA@3B) · LFM2.5-8B-A1B (Liquid MoE). Benches: R-Judge/ATBench, Offensive Cyber Time Horizons (Lyptus — GPT-5.5 P50 5.1h saturates), MTEB-Code/CoIR/MSEB embedding, vision grounding, AA-Omniscience, AutoScientists BioML sub-domains + TDC-hERG. De-dup: 2605.27365=LocateAnything, 2605.26302=AgingBench (S30 covered). **+4/+18/+46**=1565/1245/6478. v=20260529f

### 2026-05-29 Session 35 — Resolve stale monitoring TODOs (compressed — see HISTORY.md)
- Re-swept 6 cc:TODOs. Only Video-MME + MMAU ingestable (Qwen3.5-Omni 2604.15804 + Step-Audio-R1.5 2604.25719). MMAU first coverage (Omni-Plus 82.2 SOTA), Video-MME +2 2026-frontier, video_mme_audio NEW bench (Gemini-3.1 Pro 89.0). 3 still blocked, dates refreshed. **+1/+1/+12** = 1561/1227/6432. v=20260529e

### 2026-05-29 Session 34 — Leaderboard sweep (new models)
- Swept llm-stats + AA + WhatLLM. All May-2026 launches already tracked except **SubQ 1M-Preview** (Subquadratic, May 5) — first sub-quadratic frontier LLM (SSA, 12M ctx). Vendor-reported (paper pending): RULER@128K 95.0 ($8 vs Opus 4.6 94.8 @ ~$2,600 = 325x cheaper) / MRCR v2@1M 65.9 / SWE-Verified 81.8. ruler_128k NEW bench (SubQ SOTA). Menus: Frontier+Agent+Resources. **+1/+1/+4**=1560/1226/6420. v=20260529d

### 2026-05-28 ~ 29 Sessions 31-33 (compressed — see HISTORY.md)
- **S33** Claude Opus 4.8 244pp card (47 scores SWE-Verified 88.6/USAMO 96.7/GDPval-AA 1890 ELO; Mythos leads cyber), AutoScientists BioML 74.40, SkillOpt headline. 33b/c sync + §8.11/12/3.3.4 mine (ChartMuseum 89.7). **+3/+37/+146** = 1559/1225/6416 v=20260529a-c
- **S32** 4-link: 2 refs (SciMuse/WorldModelSurvey/Epicure/Google ThreatIntel), 0 score delta v=20260528e. **S31** DeepSWE 113 SWE tasks (gpt-5.5 70 SOTA, 3.5-flash > 3.1-pro inversion) + AAII fills. **+1/+1/+13** v=20260528d

### 2026-05-28 Session 30 — DeepRare + AgingBench + SciMuse + Gemini-for-Science
- DeepRare HPO R@1 57.18% (vs Claude-3.7-thinking 33.39). Multimodal Xinhua 69.1 vs Exomiser 55.9. Physician 163 cases 64.4 vs 54.6. AgingBench (UT Austin) + SciMuse (Max Planck 0.51) + AlphaEvolve + Antigravity NEW. **+13/+18/+33**=1555/1187/6257. v=20260528b

### 2026-05-27 ~ 28 Sessions 26-29 (compressed — see HISTORY.md)
- **S29** ERA+Robin+AutoSOTA deep-mine (Crow 0% vs o4-mini 44.5%; **+3/+20/+24** v=20260528a). **S28** MDASH+AutoSOTA+3 Nature (Co-Scientist/ERA/FutureHouse NEW; **+3/+9/+9** v=20260527c). **S27** SensorFM 4 sizes (33/35 wins; **+5/+10/+15** v=20260527b). **S26** Image/Video Gen 신규 탭(14→16); **+1/-2/-2** v=20260527a
**Live Site**: https://hollobit.github.io/SOTA/
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy.

### 2026-05-23 ~ 27 Sessions 21-25 (compressed — see HISTORY.md)
- **S25** Anthropic Glasswing/CVD (Mythos OSS vulns 90.6% TPR, Firefox 271; **+0/+10/+11** v=20260527a). **S24** menu propagation (6 JS patched, 0 DB delta v=20260526c). **S23** 7 user refs (Fara1.5, Asa-W1 HealthBench Pro 80.2; **+11/+8/+35** v=20260526b). **S22** arena.ai refresh (**+31/0/+48** v=20260526a). **S21** arena.ai 12-leaderboard sweep (+8 arena IDs, GPT-Image-2 T2I 1389 SOTA; **+16/+8/+76** v=20260523a)

### 2026-05-22 Session 20 cont'd 6 — Qwen3.7-Max official split from preview ID
- Split alibaba/qwen3.7-max (May 20 official, 45 scores) from qwen3.7-max-preview (May 14 arena, Elo 1475 only). SQL migrated 45 rows + JSON re-attributed. Menu: sovereign + frontier-compare. **+1/0/0**=1471/1106/6008. v=20260522a

### 2026-05-21 Session 20 cont'd 3-5 (compressed — see HISTORY.md)
- **cont'd 5** Qwen3.7 table completion (96 cross-vendor cells, +96 scores). **cont'd 4** Qwen3.7 deep dive (YC-Bench, KernelBench L3, Qwen-RobotClaw/Nav, AAII 56.58; +3 models/+3 benches/+10). **cont'd 3** OpenAI Deployment Safety Hub (GPT-5.4 Thinking/Mini, GPT-5.5 Instant first High-Capability, ChatGPT Images 2.0; +2 models/+13 benches/+40). v=20260521d-f

### 2026-05-21 Session 20 (parts 1-2, compressed — see HISTORY.md)
- **cont'd 2 — Qwen3.7-Max launch**: 41-bench × 6-model panel ingested. +12 new benches (qwen_webdev / svg / claw / cowork_bench / vitabench / spreadsheet_bench_v1 / kernelbench_l3 / worldbench / maxife / mmlu_prox / nova_63 / polymath). **+72 scores**. AAII 57 (#1-tier). Wins 18/41 incl. MRCR-128k 90.4 (beats Opus 4.6 Max long-context). v=20260521c
- **cont'd — Cyber audit + Palisade GPT-5 CTFs**: Mythos already comprehensive (47 scores); GPT-5.5/5.4-Cyber non-public; Palisade arxiv 2511.04860 adds GPT-5 Pro ASIS Quals 93rd / CorCTF 90th / snakeCTF 92nd percentile. **+3 benches / +3 scores**. v=20260521b
- **FactoryBench (arxiv 2605.07675)** — industrial robot Pearl's-ladder 4-level reasoning (ETH+UC3M+KTH May 8 2026). 6 LLMs × 4 levels = **+4 benches / +24 scores**. Sonnet 4.6 dominates L1-L3 but L4 collapses 10x; GPT-5.1 alone clears L4 at 17.7%. v=20260521a

### 2026-05-19 ~ 20 Sessions 18-19 (compressed — see HISTORY.md for full details)
- **Session 19** (May 20): Gemini 3.5 Flash + Omni Flash launch (14 benches) + TextArena/arena.ai + Qwen 3.7 Max/Plus preview + 35 cross-model triples from Gemini PDF page-4 comparison table (GPT-5.5 MRCR 128k 94.8 top, Opus 4.7 59.3 weakness) + SWE-Bench Pro correction + changelog PDF export
- **Session 18** (May 19): ExploitBench leaderboard delta + FRONTIER_MODELS hardcoded propagation + deep menu audit pass 2 (Agent/AI4S/Physical AI) + cyber-coding menu surface

### 2026-05-12 ~ 18 Sessions 12-17 (compressed — see HISTORY.md for full details)
- **Session 17** (May 18): NVIDIA SANA-WM + xAI Grok Build CLI + 10-paper cyber arxiv batch (PACEbench/CTI-REALM/AISI/CyberTeam/Auto Adversary) + 4-paper user refs (Simbian/NYU CTF/HarmfulSkillBench)
- **Session 16** (May 17): GBA Eval + daily sweep (MDASH CyberGym SOTA + CurveBench + 5 benches)
- **Session 15** (May 15): arxiv mine + World FM (VBench/V-JEPA 2/Meta Physical/Cosmos Predict 2.5) + Science FM + user refs (SDE/HAL)
- **Session 14** (May 14): arxiv sweep (11 benches, 12 models, 104 scores) + first deepfake/AIGC media-forensics coverage
- **Session 13** (May 13): Sovereign AI 13-country sweep + PDF deep mining (OneManCompany/Agent-World/AI Co-Math)
- **Session 12** (May 12): Mythos cyber + DELEGATE-52 + Onyx Open LLM (19 models × 10 benches) + Medical AI timeline + AA per-bench sub-scores

### 2026-05-10 ~ 11 Session 11 — ECI + AAII composite mega-ingest (compressed — see HISTORY.md)
- ECI ingest 3→178 (canonical CSV + Rosetta Stone paper 2512.00193 + 33 external CSVs). AAII 29→178 (Playwright /leaderboards/models 216 rows + per-bench sub-scores). FC composite_eci/composite_aaii split. AI4S widget W3/W9 + SOTA lower-better fix. GPT-5.5/5.4-Cyber + 6 PDFs + 3 memory files (AA SVG/cyber variants/AA data sources)

## Previous: Agent menu launch (2026-05-08, Session 2)
**1,114 models · 854 benchmarks · 3,315 scores · 14 active tabs (Overview / Leaderboard / Trends / Timeline / Comparison / Frontier Compare / Cyber & Coding / Sovereign AI / Physical AI / Medical AI / AI4S / **Agent (10 sub-categories)** / Explorer / Resources / Changelog)**

### 2026-05-08 Session 2 — Agent menu launch
- 28-task plan executed via subagent-driven-development skill: `docs/superpowers/specs/2026-05-08-agent-menu-design.md` + `docs/superpowers/plans/2026-05-08-agent-menu.md`
- 14 commits (`079cac2` → `f34d77c`): UI scaffolding (Tasks 1-9), benchmark registration (10-12), model registration (13-17), score sweep (18-23), Resources/docs sync (24-28)
- 4 sub-section UI: SOTA Watch + Categories + Frontier-vs-AgentProduct-vs-Edge Compare + Composite Leaderboard
- Strict-attribution maintained for all 24 new score rows

## Earlier sessions (compressed — see HISTORY.md for full details)
- **2026-04-26~28 Medical AI 10+ batches**: 750 models / 188 benches / 1500 scores / 30 categories / 32 sub-suites / BMT registry 63%. **2026-04-25 7 batches**: sovereign param-scale (+232 models, 15 region cards), Physical AI/World Models. **2026-04-24**: GPT-5.5/Pro, Kimi K2.6, Qwen3.6-27B. **2026-04-23**: Sovereign timeline+map. **Phase 1-9 (04-16/17/18)**: 67 models/95 benches/721 scores. **CI infra (04-24/25)**: gh-pages rsync fix, auto cache-bust, click-modal, sortable cols

---

## Active Monitoring Sources (24개)

### Leaderboards (실시간 업데이트)
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| LLM Stats | llm-stats.com | GPQA, SWE-bench, AIME, HLE, ARC-AGI-2, MMLU-Pro 등 |
| Vellum | vellum.ai/llm-leaderboard | 6개 주요 벤치마크 비교 |
| Artificial Analysis | artificialanalysis.ai | Intelligence Index, 10개 평가 |
| Chatbot Arena | lmarena.ai | Arena Elo |
| ARC Prize | arcprize.org/leaderboard | ARC-AGI-2 |
| LM Council | lmcouncil.ai/benchmarks | 18개 독립 벤치마크 |
| LiveBench | livebench.ai | Contamination-free 코딩 |
| Onyx | onyx.app/llm-leaderboard | 18개 벤치마크 |

### Cybersecurity & Coding
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| Cybench | cybench.github.io | CTF 40개 과제 |
| CyberGym | cybergym.io | 1,507 취약점 |
| Wiz Cyber Model Arena | wiz.io/cyber-model-arena | 257 실전 과제 |
| EVMbench | github.com/openai/evmbench | 스마트 컨트랙트 |
| AIRTBench | github.com/dreadnode/AIRTBench-Code | AI 레드팀 CTF |
| CyberSecEval 4 | github.com/facebookresearch/CyberSecEval | AutoPatchBench |
| CyberSOCEval | github.com/CrowdStrike/CyberSOCEval_data | SOC 방어 |
| BaxBench | baxbench.com | 보안 백엔드 코딩 |

### Agent
| 소스 | URL | 벤치마크 |
|-----|-----|---------|
| OSWorld | os-world.github.io | 컴퓨터 사용 |
| GAIA | huggingface.co/spaces/gaia-benchmark | 도구 활용 |
| BrowseComp | llm-stats.com/benchmarks/browsecomp | 웹 탐색 |
| TAU-bench | benchlm.ai/benchmarks/tauBench | 고객 서비스 |
| METR Time Horizons | metr.org/time-horizons | 자율 에이전트 |

### Evaluation Reports
| 소스 | URL | 내용 |
|-----|-----|-----|
| Epoch AI | epoch.ai/benchmarks | 40+ 벤치마크 트렌드 |

---

## Next Steps (향후 작업)

### Completed (2026-04-18 batches — full details in HISTORY.md)
데이터 수집 자동화 (discover/collect, GitHub Actions discovery·benchmark-update·librarian-weekly) · 대시보드 개선 (Cyber & Coding bar chart, category pill-filter, head-to-head radar, PDF source linking) · 추가 데이터 소스 (Grok-4.20, GPT-5.4 System Card, Gemini 3.1 Pro) · 분석 기능 (correlation heatmap, SOTA handover log, intelligence-vs-price scatter) · BMT batch-1 P1–P11 (26 benchmarks, 33 frontier scores) · `/design-review` follow-up (22 atomic commits: IA 재구성, Tailwind 빌드, typography ramp, motion 언어)

### cc:TODO — Watch for future publications (external dependency) — last full re-sweep 2026-05-29 (Session 35)
- [x] MRCR v2 8-needle — ingested 2026-05-08 (Opus 4.6 93.0 / GPT-5.5 74.0 / Gemini 3.x)
- [x] Video-MME — **RESOLVED S35**: official board still stale (2025-09), but ingested 2026-frontier from Qwen3.5-Omni report (Omni-Plus 81.9/Flash 77.0 w/o-sub) + new `video_mme_audio` bench (Gemini-3.1 Pro 89.0)
- [x] MMAU — **RESOLVED S35**: first coverage (7 scores) from Qwen3.5-Omni + Step-Audio-R1.5 reports; Omni-Plus 82.2 SOTA (>human 78)
- [x] Qwen 3.7 Max/Plus preview — **RESOLVED-superseded**: official qwen3.7-max ingested S20 (45 scores); previews stay arena-Elo-only (category boards rank-only)
- [ ] HarmBench / StrongREJECT / AIR-Bench — **STILL BLOCKED** (rechecked 2026-05-29): Opus 4.8/GPT-5.5/Gemini 3.5 cards dropped these public benches for internal evals; HELM AIR-Bench frozen v1.1.0 (2024)
- [ ] Gemini Omni Flash — **STILL BLOCKED** (rechecked 2026-05-29): generative-media model, benches still deferred to API rollout; AA model page 404
- [ ] AutoPatchBench / CyberSOCEval — **STILL BLOCKED** (rechecked 2026-05-29): per-model scores image-only (PNG figures); paper lineups predate current frontier

---

## Architecture

```
resource/                    → PDF 원본 + 수집된 JSON 데이터
config/seed_sources.yaml     → 모니터링 소스 레지스트리
cyber/scouts/                → 데이터 수집 에이전트
cyber/analyst/               → SOTA 분석 + 정규화
data/benchmark.db            → SQLite 통합 DB
data/export/                 → 대시보드용 JSON export
dashboard/                   → 정적 대시보드 (ECharts + Tailwind)
  ├── js/app.js              → 메인 앱 (탭 라우팅, 데이터 로딩)
  ├── js/cyber-coding.js     → Cyber & Coding 4축 뷰
  ├── js/charts.js           → ECharts 래퍼
  ├── js/comparison.js       → 모델 비교 매트릭스
  └── js/explorer.js         → 1:1 모델 비교
BMT/                         → Benchmark Library 카탈로그 (2,559 엔트리)
```

## Key Data Files

| 파일 | 내용 |
|-----|-----|
| `resource/benchmark_scores_2026_04.json` | 원천 시드 점수 데이터 (PDF + 웹 수집) |
| `resource/lmcouncil_scores_2026_04.json` | LM Council 18개 독립 벤치마크 |
| `data/export/models.json` | 빌드된 모델 63개 |
| `data/export/benchmarks.json` | 빌드된 벤치마크 91개 |
| `data/export/scores/current.json` | 현재 점수 707개 |
| `data/export/sota.json` | SOTA 레코드 78개 |
| `data/export/scores/history/YYYY-MM-DD.json` | 일별 스냅샷 (2026-04-16 ~ 04-18) |
| `data/bmt_connections.json` / `bmt_catalog.json` | BMT 매핑 + 카탈로그 (2,559개) |
