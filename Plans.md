# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 48 — Microsoft MAI 7-model family launch (2026-06-03)
**1,630 models · 1,408 benchmarks · 7,206 scores · 16 active tabs + Frontier Compare composite split (composite_eci 33 cols / composite_aaii 13 cols)**

### 2026-06-03 Session 48 — Microsoft AI 7-model launch (user-provided microsoft.ai blog)
- **7 NEW MAI models** (zero-distillation, clean-data philosophy): **MAI-Thinking-1** (35B-active/~1T MoE, 256k ctx — AIME25 97.0/AIME26 94.5/HMMT Feb26 84.9/GPQA 84.2/LCB v6 87.7/**SWE-Bench Pro 52.8 ~ Opus 4.6** 53.4; preferred to Sonnet 4.6 in 1,276 Surge blind human evals) · **MAI-Code-1-Flash** (5B agentic — beats Haiku 4.5 across 11 benches incl. **SWE-Bench Pro 51.2 vs 35.2 +16pp** / SWE-Bench Verified 71.6 with **60% fewer tokens** / IF Bench 75.0 vs 46.1 +28.9pp / GPQA 84.6 / τ²-Telecom 71.7) · **MAI-Image-2.5+Flash** (Arena T2I 1254 #3 +75pts vs MAI-Image-2; #2 Image Edit) · **MAI-Transcribe-1.5** (43 langs, **AA WER 2.4% #3, FLEURS #1**, 30% WER reduction with keyword biasing, 5x faster) · MAI-Voice-2+Flash (15 lang TTS)
- 11 NEW benches: hmmt_feb_2026 / lcb_v6 / amo_bench_olympiad / frontier_math_t1_3 / artifacts_bench / if_bench_precise / advanced_if_rubric / robust_if_diverse / fleurs_43lang_wer / aa_transcribe_wer / fleurs_keyword_biasing_wer_improvement. 14 cross-comparison cols ingested (Sonnet 4.6/Opus 4.6/GPT 5.4/K2.6/DeepSeek V3.2/V4 Pro/GLM-5.1). Mayo Clinic frontier health model collab announced.
- **🔧 BUG FIX**: exporter._export_sota() now passes benchmarks dict — **fixes lower-better SOTA detection** for ALL audio/document benches. MAI-Transcribe-1.5 WER 2.4 now SOTA on aa_transcribe_wer (was older MAI-Transcribe-1 2.6); Nemotron-OCR-v2 0.048 SOTA on omnidocbench_en NED. Bench id consolidation: orphan arena_t2i_aa_elo → aa_t2i_arena_elo (S47 canonical) + HiDream O1 1189 migrated.
- 8-tab propagation: FC FRONTIER_MODELS + math/coding/agent suites + Cyber-Coding FRONTIER + suites + Agent CATEGORIES + Resources +1 PDF entry. **+7/+11/+49** = 1630/1408/7206. v=20260603a

### 2026-06-03 Session 47 — Leaderboard sweep (compressed)
- Opus 4.8 AAII 61 (#1, highest ever) · Gemini 3.5 Flash ECI 156.31 · Cosmos3-Super-T2I AA T2I Arena 1243 (#4 overall, #1 open-weight) · arena.ai text/webdev/vision/image-edit Elo refresh · DeepSeek V4 Flash High AAII 45→46. text_arena_elo NEW. **+0/+1/+12** = 1621/1397/7157.

### 2026-06-02 Session 46b — Cosmos 3 + Qwen3.7-Plus deep re-mine (compressed)
- Cosmos3-Edge HMMT25 Feb 76.3 vs Qwen3.5-2B 22.9 (3.3x improvement). Cosmos HUE per-dim/per-domain — **Cosmos3-Super DOMINATES AV 87.7 + Physics 91.5** among open+closed. Super-I2V Visual Integrity 94.2 SOTA. PAIBench-G T2V/I2V Domain+Quality split. SoundBench PQ Seedance-1.5-Pro 7.06 SOTA. Qwen3.7-Plus complete 69-bench coverage + 6 cross-comparison cols. 30 bench ID remaps, 18 NEW benches. **+0/+18/+98** = 1621/1396/7145.

### 2026-06-02 Session 46 — NVIDIA Cosmos 3 + Qwen3.7-Plus GA (compressed)
- **Cosmos 3** (27MB tech report, omnimodal MoT, Qwen3-VL init): 5 NEW models — cosmos3-edge/-super-text2image/-super-image2video/-nano-policy-droid. NEW Cosmos-HUE eval suite. SOTAs: UniGenBench 91.36 (AA T2I #1 open) · PAIBench-G T2V 80.0 / I2V 82.8 · Physics-IQ I2V 48.9 / V2V 63.4 BoN · HWB 71.9 · SoundBench SAV 8.35 · RoboLab 39.7 (RoboArena #1) · LIBERO-10 MT-init 97.4
- **Qwen3.7-Plus** (1M ctx multimodal hybrid agent GA): SOTAs vs Qwen comparison cols — Terminal-Bench 2.0 70.3 / Deep-Planning 62.3 / MRCR-v2 128k 91.7 / ScreenSpot Pro 79.0 / AndroidWorld 81.0 / BabyVision 70.4 / OmniDocBench 1.5 91.4 / LingoQA 83.4 / VideoMMMU 85.4 / Ego3D 5.9 (lower)
- 8-tab + dual-layer Cyber-Coding propagation; Resources +2 PDFs. **+5/+49/+103** = 1621/1378/7047. v=20260602a→b (audit fix)

### 2026-06-01 Session 44 — MiniMax M3 release (compressed)
- MiniMax M3 native multimodal MSA 1M ctx open-weight, SWE-Bench Pro 59.0% (surpasses GPT-5.5+Gemini 3.1 Pro). 3 NEW benches: PostTrainBench/SWE-fficiency/KernelBench Hard. Biohub ESM 0 ingest. **+1/+3/+8** = 1606/1321/6908. v=20260601c

### 2026-06-01 Session 43 — NVIDIA Nemotron 4-family ingest (compressed)
- Nemotron RAG/Parse/Speech/Safety from HF cards + arxiv 2511.20478. 7 models, 11 bench families. SOTAs: ViDoRe V3 63.54 (colembed-vl-8b-v2) · MMTEB v2 69.46 (llama-embed-nemotron-8b) · OmniDoc EN NED 0.048 (ocr-v2) · LibriSpeech clean WER 1.93% (parakeet-tdt v3). **+7/+11/+15** = 1605/1318/6900. v=20260601b

### 2026-05-31 Session 42 — ESM Cambrian / ESMFold2 (compressed)
- Biohub+EvolutionaryScale 71MB PDF. 7 protein models. SOTAs: ESMFold2+MSA PPI 76% / AbAg 53% / ESMC 6B 0.725 contact / ESMFold2-Fast 9.4s. **+7/+9/+19** = 1598/1307/6885.

### 2026-05-31 Session 41 — WorldArena.ai HF Space (compressed)
- HF grew 6→86 baselines. 3 NEW video-gen: Veo 3.1 / Wan 2.2 / Wan 2.6 #2. Physical AI +16 sub-metrics. **+1/+16/+131** = 1591/1298/6866.

### 2026-05-31 Session 40 — Deep re-mine round 2 (compressed)
- Opus 4.8 sys card unmined (+7 NEW: AutomationBench/BioPipelineBench/BioMysteryBench Human-Solvable/GMMLU 90.4/MILU 90.3/INCLUDE 87.6/AECI 155.5 + 3 net-new). SkillOpt 2605.23904 (+SearchQA/LiveMath, GPT-5.5 +29.3pp uplift). WorldArena T2 Policy public (Ctrl-World 0.986 SOTA). AA CritPT/MMLU-Pro Playwright full charts (+17 net-new). Vellum CONFIRMED Resources-only. **+0/+10/+35** = 1590/1282/6735. v=20260531a

### 2026-05-30 Session 39 — Deep re-mine S33-S38 (compressed)
- User completeness audit. 7 models (gpt-5.3/nemotron-3-120b/rex-omni-3b/seed1.5-vl/cosmos-transfer2.5-2b/wan-2.2-fun-a14b/5b-control). 13 benches (LocateAnything 6, BenchCAD 3, FACTS multimodal, PAI-Bench-C quality). MAJOR BACKFILL: FACTS grounding 1→15, CompassRank 6 benches. **+7/+13/+143** = 1590/1272/6700.

### 2026-05-30 Session 38 — 13-link multi-source (compressed)
- 9 models (Cosmos3-Super/Nano, Cosmos-Reason2-32B/8B, Ctrl-World, IRASim, SmolVLA, Wan-2.2-I2V-A14B, Qwen3-VL-235B). 6 benches (WorldArena, PAI-Bench-G/U, PhAIL v1.0, MMLU-Pro AA, IPhO 2025). Cosmos3-Super PAI-Bench-G 83.9 first to exceed Source oracle 82.6. **+9/+6/+21** = 1583/1259/6557.

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
| `data/export/sota.json` / `history/YYYY-MM-DD.json` | SOTA + 일별 스냅샷 |
| `data/bmt_connections.json` / `bmt_catalog.json` | BMT 매핑 + 카탈로그 (2,559개) |
