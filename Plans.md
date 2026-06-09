# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 63 — 7-tab audit propagation (2026-06-09)
**1,667 models · 1,449 benchmarks · 7,418 scores · 16 active tabs + Edge LLM 4w + Frontier Gap 3w + Intelligence×Price Pareto + 7-tab audit propagation**

### 2026-06-09 Session 63 — 7-tab audit propagation
- Audit S58-S62 누적 ingest 12개 모델 × 7 탭 매트릭스. **누락분 propagation**: Frontier Compare ← china-mobile/jt-35b-flash + microsoft/phi-4 + microsoft/phi-4-multimodal · Cyber-Coding ← same 3 · Agent AGENT_PRODUCTS ← minimax/m3 · Agent EDGE_SLMS ← microsoft/phi-4-multimodal + amazon/nova-micro · Sovereign FRONTIER_VENDOR_REGION ← amazon/ + minimax/ namespace fallback
- 검증: 12 모델 매트릭스 재실행 — Sovereign 100% / Frontier 6/12 / Cyber 6/12 / Agent 6/12 (TTS/ASR/QAT 변종은 Sovereign-only가 정상). Medical/Physical/AI4S 0% (general LLM 모델이므로 도메인 전파 불요)
- Cache-bust v=20260609f for frontier-compare.js / cyber-coding.js / sovereign.js / agent.js

### 2026-06-09 Sessions 60-62 (compressed)
- S62 NEW Intelligence×Price Pareto widget (10 모델, 4 Pareto-dominant: MiMo V2.5 Pro 270 ratio #1, MiniMax M3 250, Gemini 3.1 Pro 34, Opus 4.8 15). S61 MiniMax M3 deep ingest (22 sub-scores) + 🌍 IFBench 83 #1 + Non-Hall 84 #1 + 3 NEW AA perf benchmarks. S60 Frontier vs Small Gap 3-widget suite (Alibaba 56% catch-up winner / Meta 17% worst) + Phi-4 family + Nova Micro AAII. **+1/+3/+34** = 1667/1449/7418.

### 2026-06-09 Sessions 60-61 (compressed)
- S61 MiniMax M3 deep ingest (Playwright 12 sub-benches): GDPval-AA 58, τ²-Telecom 89, AA-LCR 74, AA-Omniscience Non-Hall **84** #1🌍, HLE 37, GPQA-D 93, IFBench **83** #1🌍, CritPt 4, MMMU-Pro 80. 3 NEW AA perf benchmarks: aa_output_tps (gpt-oss-120b 351 #1) / aa_ttft_sec / aa_blended_price (DeepSeek V4 Pro Max $0.2 #1). Architecture: MSA + 1M ctx + native video input. **+0/+3/+30** = 1667/1449/7418
- S60 18 frontier vendor audit + Frontier-vs-Small Gap 3-widget suite (bar/Pareto/table). 7 vendors frontier-only (Anthropic, OpenAI, xAI, DeepSeek, Moonshot, Zhipu, Tencent). Ingested phi-4-mini 8, phi-4-multimodal 10 (NEW 5.6B), phi-4 10, nova-micro 10. Alibaba winner 56% catch-up, Meta worst 17%. **+1/+0/+4** = 1667/1446/7388

### 2026-06-08~09 Sessions 58-59 (compressed)
- S59 NEW Physical AI Edge & Mobile Small-LLM subsection: 4 widgets (Device-class buckets / Pareto chart / Country donut/stack / sortable table). 66 ≤12B models / 12 countries. Top AAII qwen3.5-9b 32, gemma-4-12b 29. S58 🌍 NEW AA Transcribe SOTA fun-realtime-asr-preview 1.7% WER, xAI TTS Elo 1208, Gemma 4 12B AAII 29. **+2/+0/+3** = 1667/1446/7384.

### 2026-06-04~05 Sessions 51-55 (compressed)
- S55 AA T2I 2 NEW + TTS Quality Elo Fun-Realtime-TTS 1227 SOTA. S54 Nemotron 3 Ultra 550B/55B MoE AAII 48 + ITBench-AA Opus 4.7 47% SOTA. S53 NEW AA Transcribe SOTA: Scribe v2 2.2%. S52 AutoMedBench Opus 4.6 66.5 SOTA + K-BrowseComp 45.67%. S51 minimax/m3 AAII 55 + 3 arena.ai NEW (Reve 2.0 #2 1280 / Wan 2.7 1385 / Grok Imagine #1 1473) + 7-tab audit fix. **+21/+13/+108** cumulative.

### 2026-06-04 Session 50 — GPT-Rosalind + Gemma 4 12B (compressed)
- GPT-Rosalind 4 life-sci benches (LifeSciBench 63.4 SOTA). Gemma 4 12B encoder-free multimodal (MMLU Pro 77.2). 8 NEW benches. **+2/+8/+25** = 1637/1428/7246.

### 2026-06-03 Session 49 — Spacer + The AI Scientist (compressed)
- Spacer (Asteromorph, arxiv 2508.17661) — Nuri AUROC 0.737 / Weaver Overall 85.44 (158 papers). The AI Scientist (Sakana AI, Nature) — **🌍 WORLD FIRST: AI paper passed ICLR 2025 ICBINB blind peer review** (avg 6.33/10). Automated Reviewer F1 0.67 post-cutoff vs Human 0.49. **+5/+12/+15** = 1635/1420/7221.

### 2026-06-03 Session 48 — MS MAI 7-model launch (compressed)
- 7 NEW MAI: MAI-Thinking-1 35B/~1T MoE (SWE-Bench Pro 52.8 ~ Opus 4.6), MAI-Code-1-Flash 5B (beats Haiku 4.5 across 11 benches), MAI-Image-2.5+Flash, MAI-Transcribe-1.5 (AA WER 2.4%, 43 lang), MAI-Voice-2+Flash. 11 NEW benches. **🔧 BUG FIX**: exporter lower-better SOTA. **+7/+11/+49** = 1630/1408/7206.

### 2026-06-03 Session 47 — Leaderboard sweep (compressed)
- Opus 4.8 AAII 61 (#1 ever) / Gemini 3.5 Flash ECI 156.31 / Cosmos3-Super-T2I 1243 / DeepSeek V4 Flash High AAII 45→46. text_arena_elo NEW. **+0/+1/+12** = 1621/1397/7157.

### 2026-06-02 Session 46b — Cosmos 3 + Qwen3.7-Plus deep re-mine (compressed)
- Cosmos3-Edge HMMT25 76.3 vs Qwen3.5-2B 22.9. Cosmos HUE per-dim — **Cosmos3-Super AV 87.7 / Physics 91.5 SOTA**. Qwen3.7-Plus complete 69-bench + 6 comparison cols. 18 NEW benches. **+0/+18/+98** = 1621/1396/7145.

### 2026-06-02 Session 46 — Cosmos 3 + Qwen3.7-Plus GA (compressed)
- Cosmos 3 omnimodal MoT (5 NEW models) — UniGenBench 91.36 (AA T2I #1 open) / PAIBench-G T2V 80.0 / I2V 82.8 / Physics-IQ V2V 63.4 BoN / RoboLab 39.7 (RoboArena #1). Qwen3.7-Plus 1M ctx — Terminal-Bench 2.0 70.3 / MRCR-v2 128k 91.7 / ScreenSpot Pro 79.0. **+5/+49/+103** = 1621/1378/7047.

### 2026-06-01 Session 44 — MiniMax M3 release (compressed)
- MiniMax M3 native multimodal MSA 1M ctx open-weight, SWE-Bench Pro 59.0% (surpasses GPT-5.5+Gemini 3.1 Pro). 3 NEW benches: PostTrainBench/SWE-fficiency/KernelBench Hard. Biohub ESM 0 ingest. **+1/+3/+8** = 1606/1321/6908. v=20260601c

### 2026-06-01 Session 43 — NVIDIA Nemotron 4-family ingest (compressed)
- Nemotron RAG/Parse/Speech/Safety from HF cards + arxiv 2511.20478. 7 models, 11 bench families. SOTAs: ViDoRe V3 63.54 (colembed-vl-8b-v2) · MMTEB v2 69.46 (llama-embed-nemotron-8b) · OmniDoc EN NED 0.048 (ocr-v2) · LibriSpeech clean WER 1.93% (parakeet-tdt v3). **+7/+11/+15** = 1605/1318/6900. v=20260601b

### 2026-05-31 Session 42 — ESM Cambrian / ESMFold2 (compressed)
- Biohub+EvolutionaryScale 71MB PDF. 7 protein models. SOTAs: ESMFold2+MSA PPI 76% / AbAg 53% / ESMC 6B 0.725 contact / ESMFold2-Fast 9.4s. **+7/+9/+19** = 1598/1307/6885.

### 2026-05-31 Session 41 — WorldArena.ai HF Space (compressed)
- HF grew 6→86 baselines. 3 NEW video-gen: Veo 3.1 / Wan 2.2 / Wan 2.6 #2. Physical AI +16 sub-metrics. **+1/+16/+131** = 1591/1298/6866.

### 2026-05-31 Session 40 — Deep re-mine round 2 (compressed)
- Opus 4.8 sys card unmined +7 NEW + SkillOpt + WorldArena T2 + AA Playwright. **+0/+10/+35** = 1590/1282/6735.

### 2026-05-30 Session 39 — Deep re-mine S33-S38 (compressed)
- 7 models + 13 benches. MAJOR BACKFILL FACTS+CompassRank. **+7/+13/+143** = 1590/1272/6700.

### 2026-05-30 Session 38 — 13-link multi-source (compressed)
- 9 models + 6 benches. Cosmos3-Super PAI-Bench-G 83.9 SOTA. **+9/+6/+21** = 1583/1259/6557.

### 2026-05-30 Session 37 — 17-link multi-source (compressed)
- gemini-3-flash-preview + 8 CN VLMs + CAD benches + FACTS/CompassRank. **+9/+8/+58** = 1574/1253/6536.

### 2026-05-29 Session 36 — 10-link multi-source (compressed)
- AgentDoG 1.5-4B + Gemini Embedding 2 + LocateAnything-3B + LFM2.5. R-Judge/ATBench/Offensive Cyber/MTEB-Code/AutoScientists BioML. **+4/+18/+46** = 1565/1245/6478.

### 2026-05-29 Sessions 34-35 (compressed)
- S35 Qwen3.5-Omni + Step-Audio-R1.5 / MMAU NEW. S34 SubQ 1M-Preview Subquadratic (RULER@128K 95.0). **+2/+2/+16** = 1561/1227/6432.

### 2026-05-28 ~ 29 Sessions 31-33 (compressed — see HISTORY.md)
- **S33** Claude Opus 4.8 244pp card (47 scores SWE-Verified 88.6/USAMO 96.7/GDPval-AA 1890 ELO; Mythos leads cyber), AutoScientists BioML 74.40, SkillOpt headline. 33b/c sync + §8.11/12/3.3.4 mine (ChartMuseum 89.7). **+3/+37/+146** = 1559/1225/6416 v=20260529a-c
- **S32** 4-link: 2 refs (SciMuse/WorldModelSurvey/Epicure/Google ThreatIntel), 0 score delta v=20260528e. **S31** DeepSWE 113 SWE tasks (gpt-5.5 70 SOTA, 3.5-flash > 3.1-pro inversion) + AAII fills. **+1/+1/+13** v=20260528d

### 2026-05-28 Session 30 — DeepRare + AgingBench + SciMuse + Gemini-for-Science
- DeepRare HPO R@1 57.18% (vs Claude-3.7-thinking 33.39). Multimodal Xinhua 69.1 vs Exomiser 55.9. Physician 163 cases 64.4 vs 54.6. AgingBench (UT Austin) + SciMuse (Max Planck 0.51) + AlphaEvolve + Antigravity NEW. **+13/+18/+33**=1555/1187/6257. v=20260528b

### 2026-05-27~28 Sessions 26-29 (compressed)
- S29 ERA/Robin/AutoSOTA + S28 MDASH/Co-Sci + S27 SensorFM + S26 Image/Video tabs. **+12/+37/+46**
**Live**: https://hollobit.github.io/SOTA/ · **CI**: benchmark-update.yml daily 06:00 UTC + workflow_dispatch; cache-bust auto.

### 2026-05-23 ~ 27 Sessions 21-25 (compressed — see HISTORY.md)
- **S25-S21** Glasswing/CVD + menu propagation + 7 user refs + arena.ai 12-leaderboard sweep. **+58/+26/+170**

### 2026-05-22 Session 20 cont'd 6 — Qwen3.7-Max official split from preview ID
- Split alibaba/qwen3.7-max (May 20 official, 45 scores) from qwen3.7-max-preview (May 14 arena, Elo 1475 only). SQL migrated 45 rows + JSON re-attributed. Menu: sovereign + frontier-compare. **+1/0/0**=1471/1106/6008. v=20260522a

### 2026-05-21 Session 20 (compressed)
- Qwen3.7-Max launch + Qwen3.7 deep dive + OpenAI Safety Hub + Mythos cyber + Palisade GPT-5 CTFs + FactoryBench (industrial robot 4-level). **+5/+72/+150**

### 2026-05-19 ~ 20 Sessions 18-19 (compressed — see HISTORY.md for full details)
- **Session 19** (May 20): Gemini 3.5 Flash + Omni Flash launch (14 benches) + TextArena/arena.ai + Qwen 3.7 Max/Plus preview + 35 cross-model triples from Gemini PDF page-4 comparison table (GPT-5.5 MRCR 128k 94.8 top, Opus 4.7 59.3 weakness) + SWE-Bench Pro correction + changelog PDF export
- **Session 18** (May 19): ExploitBench leaderboard delta + FRONTIER_MODELS hardcoded propagation + deep menu audit pass 2 (Agent/AI4S/Physical AI) + cyber-coding menu surface

### 2026-05-12~18 Sessions 12-17 (compressed)
- S17 SANA-WM/Grok CLI/cyber arxiv; S16 GBA Eval; S15 World FM/V-JEPA 2; S14 deepfake/AIGC; S13 Sovereign 13-country.
- **Session 12** (May 12): Mythos cyber + DELEGATE-52 + Onyx Open LLM (19 models × 10 benches) + Medical AI timeline + AA per-bench sub-scores

### 2026-05-10~11 Session 11 — ECI + AAII composite mega-ingest (compressed)
- ECI 3→178 + AAII 29→178. FC composite_eci/aaii split. AI4S widget W3/W9. 6 PDFs.

## Previous: Agent menu launch (2026-05-08, Session 2)
**1,114 models · 854 benchmarks · 3,315 scores · 14 active tabs (Overview / Leaderboard / Trends / Timeline / Comparison / Frontier Compare / Cyber & Coding / Sovereign AI / Physical AI / Medical AI / AI4S / **Agent (10 sub-categories)** / Explorer / Resources / Changelog)**

### 2026-05-08 Session 2 — Agent menu launch
- 28-task plan executed via subagent-driven-development skill: `docs/superpowers/specs/2026-05-08-agent-menu-design.md` + `docs/superpowers/plans/2026-05-08-agent-menu.md`
- 14 commits (`079cac2` → `f34d77c`): UI scaffolding (Tasks 1-9), benchmark registration (10-12), model registration (13-17), score sweep (18-23), Resources/docs sync (24-28)
- 4 sub-section UI: SOTA Watch + Categories + Frontier-vs-AgentProduct-vs-Edge Compare + Composite Leaderboard
- Strict-attribution maintained for all 24 new score rows

## Earlier sessions (compressed — see HISTORY.md)

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

### Completed (compressed — see HISTORY.md)

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
| `resource/benchmark_scores_2026_04.json` / `lmcouncil_scores_2026_04.json` | 원천 시드 + LM Council |
| `data/export/models.json` | 빌드된 모델 63개 |
| `data/export/benchmarks.json` | 빌드된 벤치마크 91개 |
| `data/export/scores/current.json` | 현재 점수 707개 |
| `data/export/sota.json` / `history/YYYY-MM-DD.json` | SOTA + 일별 스냅샷 |
| `data/bmt_connections.json` / `bmt_catalog.json` | BMT 매핑 + 카탈로그 (2,559개) |
