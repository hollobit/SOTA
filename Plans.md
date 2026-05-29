# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 36 — 10-link multi-source analysis: 4 new models + 18 new benchmarks (2026-05-29)
**1,565 models · 1,245 benchmarks · 6,478 scores · 16 active tabs + Frontier Compare composite split (composite_eci 33 cols / composite_aaii 13 cols)**

### 2026-05-29 Session 36 — 10-link multi-source analysis (every result table direct-WebFetch verified)
- 10 user links → 4 NEW models, 18 NEW benchmarks, 46 scores. De-dups resolved: arxiv 2605.27365 == NVIDIA LocateAnything HF/project page; arxiv 2605.26302 == agingbench.github.io (already S30 — re-checked, SKIPPED: no composite, non-frontier board); arxiv 2605.28655 AutoScientists (S33, 3 scores) → +5 new table-based sub-scores.
- **Models**: AgentDoG 1.5-4B (Shanghai AI Lab, agent-safety judge) · Gemini Embedding 2 (Google, multimodal embedding, MTEB-Code 84.0 SOTA) · LocateAnything-3B (NVIDIA, vision grounding, ScreenSpot-Pro 60.3 SOTA@3B) · LFM2.5-8B-A1B (Liquid, on-device MoE 8B/A1B 128K)
- **Bench families**: AgentDoG R-Judge/ATBench (Gemini-3.1-Pro R-Judge 97.3) · Offensive Cyber Time Horizons (Lyptus, METR-style — GPT-5.5 saturates: P50 5.1h@2M, 92.4%@50M; Opus 4.6 3.2h) · embedding (MTEB-Code/CoIR/MSEB) · vision grounding (RefCOCOg/LVIS/COCO) · AA-Omniscience/Multi-IF · AutoScientists BioML sub-domains + TDC-hERG
- strict-attribution: comparison scores only on NEW benches (no REPLACE clobber). Excluded figure-only (AgentDoG ATBench-Claw/Codex, AutoScientists nanochat). 3 PDFs archived + Resources + seed_sources. Menus: Frontier Compare + Cyber & Coding. **+4 / +18 / +46** = 1565/1245/6478. v=20260529f

### 2026-05-29 Session 35 — Resolve stale monitoring TODOs (re-swept the cc:TODO watch-list)
- Re-investigated all 6 "Watch for future publications" cc:TODO items (last checked 2026-05-08, ~3 weeks stale) via 4 parallel research agents + **direct WebFetch verification of every source table** (not agent-relayed). Result: only **Video-MME + MMAU** yielded ingestible frontier data; the rest remain externally blocked (dates refreshed below).
- **NEW DATA** from two 2026 primary-source tech reports (official leaderboards video-mme.github.io / mmau_homepage STILL stale at 2025-09 / May-2025): **Qwen3.5-Omni Tech Report** (arxiv 2604.15804, 04-17) + **Step-Audio-R1.5 Tech Report** (arxiv 2604.25719, 04-28).
  - **MMAU first coverage** (was 0): Qwen3.5-Omni-Plus 82.2 (SOTA, >human 78) / Flash 80.4 / Gemini-3.1 Pro 81.1 / Gemini 3 Pro 79.8 / Gemini 3 Flash 75.9 / Step-Audio-R1.5 77.9 / Step-Audio-R1 77.0
  - **Video-MME** first 2026-frontier additions (w/o-sub): Omni-Plus 81.9 / Flash 77.0 (existing Qwen3.6-27B 87.7 stays SOTA)
  - **video_mme_audio** NEW bench (use_audio_in_video=True protocol, split from standard): Gemini-3.1 Pro 89.0 (SOTA) / Omni-Plus 83.7 / Omni-Flash 79.3
- first-party Qwen values used over StepFun's lower comparison figures (conflict resolved). 2 PDFs archived → resource/ + Resources tab + seed_sources. Menus: Frontier Compare multimodal (+video_mme_audio +mmau). **+1 model / +1 bench / +12 scores** = 1561/1227/6432. v=20260529e

### 2026-05-29 Session 34 — Leaderboard sweep (new models)
- Swept llm-stats + AA + WhatLLM. All May-2026 launches already tracked except **SubQ 1M-Preview** (Subquadratic, May 5) — first sub-quadratic frontier LLM (SSA, 12M ctx). Vendor-reported (paper pending): RULER@128K 95.0 ($8 vs Opus 4.6 94.8 @ ~$2,600 = 325x cheaper) / MRCR v2@1M 65.9 / SWE-Verified 81.8. ruler_128k NEW bench (SubQ SOTA). Menus: Frontier+Agent+Resources. **+1/+1/+4**=1560/1226/6420. v=20260529d

### 2026-05-29 Session 33 — Claude Opus 4.8 System Card + AutoScientists + SkillOpt (4 links)
- **Claude Opus 4.8** (244pp card, 47 scores): SWE-Verified 88.6 / SWE-Pro 69.2 / USAMO 2026 96.7 (vs 4.7 69.3) / GDPval-AA 1890 ELO (+121 over GPT-5.5) / GraphWalks BFS 1M 68.1 (vs 4.7 40.3) / HealthBench Pro 55.8 / Terminal-Bench 2.1 74.6 / BioMysteryBench-Difficult 40.0 (beats Mythos 29.6). Cyber: CyberGym 78.8 / Firefox-147 8.8% / ExploitBench 5.02/16 (Mythos leads cyber). Weaker than Mythos overall
- **AutoScientists** (Harvard 2605.28655): BioML-Bench 74.40 percentile (vs Autoresearch 66.07), ProteinGym 217-assay 0.657→0.700, ACE2-Spike +12.5%, nanochat 0.9730 bpb. **SkillOpt** (Microsoft 2605.23904): GPT-5.5 skill uplift +23.5/+24.8/+19.1 (chat/Codex/Claude Code)
- harness-conflict benches → new IDs (cybergym_targeted_repro, firefox_147_full_exploit, terminal_bench_2_1). Menus: Frontier(Opus 4.8 top), Cyber, Agent(+11 benches), AI4S, Medical(frontier-baseline). 3 PDFs archived. **+3 models / +31 benches / +125 scores** = 1559/1219/6395. v=20260529a
- **33b ref-link sync**: Resources sites +6 (DeepSWE/FrontierSWE/Harvey LAB/Vending-Bench 2/AutoScientists/DeepRare) + seed_sources +10. 0 score delta. v=20260529b
- **33c completeness pass** (re-provided Opus 4.8 card): mined skipped §8.12 Multimodal + §8.11 Multi-Agent + §3.3.4 OSS-Fuzz. ChartMuseum 89.7 / LAB-Bench FigQA 87.3 (>human 77) / CharXiv 89.9 / BrowseComp multi-agent 88.5 / OSS-Fuzz 38.5% (Mythos 76.7). **+0/+6/+21**=1559/1225/6416. v=20260529c

### 2026-05-28 Session 32 — 4-link analysis: 2 references, 1 already-ingested, 1 out-of-scope
- 2405.17044 **SciMuse** already in DB (Session 30). 2605.00080 **World Model survey** (NTU+Berkeley+Stanford, ~50-policy taxonomy, no 1st-party scores) → Physical AI ref + PDF archived. 2605.22391 **Epicure** (food embedding, unreleased + out-of-scope) → excluded. **Google Threat Intel** (5/12, first AI zero-day, PROMPTSPY/Gemini-abuse, Big Sleep/CodeMender) → Cyber ref. **0 score delta**. Resources +2 refs, seed_sources +3. v=20260528e

### 2026-05-28 Session 31 — DeepSWE (Datacurve) + AA AAII delta sweep
- **DeepSWE** (deepswe.datacurve.ai NEW): 113 contamination-free SWE tasks × 91 repos × 5 lang. Pass@1: gpt-5.5 70 / gpt-5.4 56 / opus-4.7 54 / sonnet-4.6 32 / gemini-3.5-flash 28 / gpt-5.4-mini 24 / kimi-k2.6 24 / mimo-v2.5-pro 19 / glm-5.1 18 / gemini-3.1-pro 10 / ds-v4-pro 8 / gemini-3-flash 5. Inversion: 3.5-flash > 3.1-pro 3x. AAII fills: glm-5-turbo 47/glm-5v-turbo 43/mimo-v2.5 49/mimo-v2-omni 43/hy3-preview 42. Agent+Cyber menu +deepswe. **+1/+1/+13** = 1556/1188/6270. v=20260528d

### 2026-05-28 Session 30 — DeepRare + AgingBench + SciMuse + Gemini-for-Science
- DeepRare HPO R@1 57.18% (vs Claude-3.7-thinking 33.39). Multimodal Xinhua 69.1 vs Exomiser 55.9. Physician 163 cases 64.4 vs 54.6. AgingBench (UT Austin) + SciMuse (Max Planck 0.51) + AlphaEvolve + Antigravity NEW. **+13/+18/+33**=1555/1187/6257. v=20260528b

### 2026-05-28 Session 29 — ERA + Robin + AutoSOTA per-task deep-mine
- ERA OpenProblems BBKNN(TS) +14%, CovidHub WIS 26 vs 29. Robin dAMD $10.76/200-fold + Ripasudil 1.89x/1.75x + Crow 0% vs o4-mini 44.5% hallucinated. AutoSOTA Top-5 avg 43.55%. **+3/+20/+24**=1542/1169/6224. v=20260528a

### 2026-05-27 Sessions 27-28 — SensorFM + 5-PDF deep-mine (compressed)
- **27 SensorFM** (2605.22759): 4 sizes pretrained 1T+ min/5M ppl. SensorFM-B wins 33/35. **+5/+10/+15**=1536/1140/6191. v=20260527b. **28 MDASH+AutoSOTA+3 Nature**: MDASH Windows kernel (StorageDrive 100%/clfs 96%/tcpip 100%/16 netstack vulns). AutoSOTA (8 agents/105 papers/max 63.64%). Co-Scientist + ERA + FutureHouse NEW. **+3/+9/+9**=1539/1149/6200. v=20260527c

### 2026-05-27 Session 26 — Multi-task maintenance + Image/Video Gen tabs (A-F batch, compressed)
- Scout +mai-image-2.5-preview T2I #3 1254 Elo, +hidream-o1 1189. DB: 3 Mythos dup IDs merged. Node 20→24 on 3 workflows. HISTORY +5 sections. **Image Gen + Video Gen 신규 탭** 14→16 (data-driven 7 arena boards). **+1/-2/-2** = 1531/1130/6176. v=20260527a
**Live Site**: https://hollobit.github.io/SOTA/
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy.

### 2026-05-27 Session 25 — Anthropic Glasswing + CVD (3 refs)
- Mythos: 6,202 high/crit OSS vulns (90.6% TPR), Firefox 271 (10x Opus 4.6), Cloudflare 2,000/400. CVD: 23,019→1,596 disclosed→97 patched/88 CVE. Cybersec Skills (754-skill lib) Resources. **+0/+10/+11**=1530/1132/6178. v=20260527a

### 2026-05-22 ~ 26 Sessions 22-24 (compressed)
- **Session 24** (menu propagation): 6 JS files patched. Frontier +18 models, Sovereign China-CN +25 models + 12-vendor auto-mapping, Physical AI +2 (Qwen-Robot), Medical +Asa-W1 + 4 HealthBench Pro slices, Agent +10 CU agents + 6 benches, Cyber & Coding +13 safety benches. 0 DB delta. v=20260526c
- **Session 23** (7 user refs): Microsoft Fara1.5 family (4B/9B/27B + 7B predecessor) — WebVoyager 88.6 beats Operator 87.0. NexgeneAI Asa-W1 HealthBench Pro 80.2 (+21.2 over ChatGPT-for-Clinicians). Open Agent Leaderboard 5×5 matrix. **+11 models / +8 benches / +35 scores**. v=20260526b
- **Session 22** (arena.ai refresh): WebDev + T2I rank 11-34. qwen3.7-max-20260517 WebDev #4. **+31 models / +48 scores**. v=20260526a

### 2026-05-23 Session 21 — arena.ai 12-leaderboard sweep
- 12-arena Playwright snapshot, +8 arena bench IDs (webdev/document/i2webdev/t2i/image-edit/t2v/i2v/v-edit). +16 models (Grok-Imagine, Kling v3/o1/o3, Wan 2.6, MAI-Image-2). GPT-Image-2 leads T2I 1389/edit 1467; Seedance 2.0 sweeps video; Opus 4.7 Thinking WebDev 1567. **+16/+8/+76**=1488/1114/6084. v=20260523a

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

### 2026-05-10 ~ 11 Session 11 — ECI + AAII composite mega-ingest (16+ commits)
- **ECI ingest**: 3 → 178 scores (incl. reasoning-effort variants) via canonical CSV `https://epoch.ai/data/eci_scores.csv` (172 rows) + Rosetta Stone paper (arxiv 2512.00193) + benchmark-stitching repo 33 external CSVs
- **AAII ingest**: 29 → 178 scores (incl. variants) via Playwright scrape of `artificialanalysis.ai/leaderboards/models` (216 rows) + per-benchmark sub-scores from `/models/gpt-5-5` (11 SVG charts × 28 frontier models)
- **Frontier Compare composite split**: 1 → 2 categories — composite_eci (ECI + 30 contributing benchmarks) / composite_aaii (AAII + 11 contributing benchmarks)
- **AI4S widget activation**: W3 Frontier vs Specialist (DeepSeek-Math V2 / Goedel-Prover-V2 / DeepSeek-Prover-V2 on PutnamBench), W9 Materials Yield mattergen_yield (MatterGen 38.57 / CDVAE 13.99 / DiffCSP 12.71)
- **SOTA harness fix**: lower-better 메트릭 (RMSE/MAE/loss 등) min-based SOTA detection (commit `58c5be4`)
- **Cyber variants**: GPT-5.5-Cyber + GPT-5.4-Cyber 등록 (CyberGym 81.9% verified)
- **6 PDFs archived to resource/** (22.67 MB): Rosetta Stone, DeepSeek-Math V2, Goedel-Prover-V2, DeepSeek-Prover-V2, MatterGen Nature, AILuminate v1
- **3 new memory files**: AA SVG chart pattern + cyber variant publishing + AA benchmarking data sources

## Previous: Agent menu launch (2026-05-08, Session 2)
**1,114 models · 854 benchmarks · 3,315 scores · 14 active tabs (Overview / Leaderboard / Trends / Timeline / Comparison / Frontier Compare / Cyber & Coding / Sovereign AI / Physical AI / Medical AI / AI4S / **Agent (10 sub-categories)** / Explorer / Resources / Changelog)**

### 2026-05-08 Session 2 — Agent menu launch
- 28-task plan executed via subagent-driven-development skill: `docs/superpowers/specs/2026-05-08-agent-menu-design.md` + `docs/superpowers/plans/2026-05-08-agent-menu.md`
- 14 commits (`079cac2` → `f34d77c`): UI scaffolding (Tasks 1-9), benchmark registration (10-12), model registration (13-17), score sweep (18-23), Resources/docs sync (24-28)
- 4 sub-section UI: SOTA Watch + Categories + Frontier-vs-AgentProduct-vs-Edge Compare + Composite Leaderboard
- Strict-attribution maintained for all 24 new score rows

## Earlier sessions (compressed — see HISTORY.md for full details)
- **2026-04-26 ~ 04-28 Medical AI Sessions (10+ batches)**: 750 models · 188 benchmarks · 1,500 scores · 30 Medical AI categories · 32 sub-suite leaderboards · BMT registry mapping (119/188 = 63%). Initial Medical AI tab launch, expansion through 7→12→27→30 categories (Multilingual + Encoder + Korean + VLM + Protein + Drug + 10-country sovereign + Safety + Radiology + Clinical Outcome + Nursing + SAM 3 family + Google TS/Wearable + MLCommons MedPerf). BMT registry integration, release timeline chart. (See HISTORY.md for full breakdown.)
- **2026-04-25 (7 batches)**: RU/DE/UK +US-Open lineup (+72 models, 4 new regions) · India+Israel param-scale (+29) · France Mistral/PleIAs/CNRS (+32) · SG/UAE/China param-scale (+59) · Korean sovereign deep-dive (+40 models / 13 benches) · Sovereign AI menu (15 region cards) · Physical AI / World Models (+11 models / +7 benchmarks)
- **2026-04-24**: GPT-5.5 + Pro, Kimi K2.6, Qwen3.6-27B (+9 benchmarks)
- **2026-04-23**: Sovereign timeline + map view toggle (461 models · 241 benchmarks · 1,130 scores)
- **Phase 1-9 (2026-04-16/17/18)**: 67 models · 95 benchmarks · 721 scores · 78 SOTA
- **CI / Infrastructure (2026-04-24/25)**: gh-pages rsync `--exclude='/data'` fix · curated seed score load step · auto cache-bust `?v=$BUILD_SHA[:8]` · score click-modal across 5 tables · sortable Frontier Compare columns

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
