# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 80 — Nature + Text2CAD + DELEGATE-52 (2026-06-10)
**1,696 models · 1,565 benchmarks · 7,738 scores · 🌍 7 NEW SOTAs (DELEGATE-52 Gemini 3.1 Pro 2 + Text2CAD 4 + Automated Reviewer F1)**

### 2026-06-10 Sessions 79-80 (compressed)
- S80 🌍 7 NEW SOTAs: DELEGATE-52 (Microsoft 19 models) Gemini 3.1 Pro RS@20 80.9 + RS@2 96.8 (top frontier 'ready' only 11/52 domains). Text2CAD-Bench: DeepSeek-V3.2 L4 Overall 8.26 / GPT-5.2 L1 Geo CD 44.31 + IoU 0.59 / Gemini 3 Flash L4 IR 17%. Sakana Automated Reviewer Pre-cutoff F1 0.62 (Human 0.49)
- S79 🌍 15 NEW SOTAs: FACTS Google dominance (Gemini 3 Pro Score 68.8 / Parametric 76.4 / Search 83.8 + Gemini 2.5 Pro Grounding 74.2 + Multimodal 46.9). Qwen-VLA-Instruct LIBERO 97.9 (ABot-M0 98.6), Simpler-WidowX 73.7, RoboTwin-Hard 87.2, R2R 57.5, DOMINO 26.6, ALOHA pretrain 83.6+76.9 (1.85x π0.5 lift). AgentDog 1.5-4B-U ATBench 78.4 + Fine-Grained 55.2. Gemini 3.1 Pro R-Judge 97.3. **+5/+22/+28** cumulative = 1696/1565/7738

### 2026-06-10 Sessions 77-78 (compressed)
- S78 🌍 9 NEW SOTAs: DSPV2-671B FormalMATH-All 28.31 / Lite 61.88 / ProverBench 59.1 / MiniF2F p@8192 88.9. BenchCAD Qwen3-VL-2B RL-IID Vision2Code 0.7682 (CAD specialist > Gemini 3.1 Pro 0.397 general) / GPT-5.3 CodeEdit 0.865 / Gemini 3.1 Pro VisionQA 0.587 + CodeQA 0.838. o3 MedQA TTS 93.3
- S77 🌍 14 NEW SOTAs: Qwen3.5-Omni-Plus Audio dominance (LibriSpeech 1.11 3x, KeSpeech 3.46 6.8x, VoiceBench 93.1, RUL-MuchoMusic 72.4). MathVista 86.9, SuperGPQA 67.4. CosyVoice 3 SEED-TTS-zh 0.71. GPT-5 Pro Epoch ECI 2.65. SensorFM-B Age 0.920 + Cardiovascular 0.712 + Insulin 0.761

### 2026-06-10 Sessions 75-76 (compressed)
- S76 🌍 15 NEW SOTAs: Cosmos 3 Reasoner 4 categories (Super General 73.7, Robotics 57.8, Smart-Infra 62.6, Driving 79.3). Opus 4.8 bio/safety 11 SOTAs: Mythos Preview Virology Task 2 e2e 0.94 (Opus 4.8 0.89) / VCT 0.574 / Black-box RNA 11.22 / BioPipelineBench 88.1 / Sonnet 4.6 BBQ Disambiguated 88.1 (Opus 4.8 72.1) / Mythos BBQ Ambiguous 100.0 / SHADE-Arena 21% (Opus 4.8 93%, 4.4x gap) / Opus 4.7 ART k=100 4.8 / Sonnet 4.6 Single-Turn Harmful 98.18 / Child Safety 95%. *Capability ≠ Safety tier*
- S75 🌍 20 NEW SOTAs: Goedel-Prover-V2-32B extended MiniF2F 92.7. Gemini 3 Pro Med 4 SOTAs (MedQA 95.1 / MedMCQA 86.1 / MMLU Med 88.1 / PubMedQA 82.2). Gemini 3 Pro Audio 5 SOTAs. GPT-5.5 UK AISI Cyber pass@5 90.5 + Biochem 39.26 Pro + Bio Tacit 81.67 Pro. MedGemma 1.5 EHRNoteQA 80.4. **+0/+40/+82** cumulative = 1689/1528/7682

### 2026-06-10 Session 74 — Final PDF complete mine (compressed)
- 🌍 4 NEW SOTAs: Mythos 5 AECI **161.29** (Anthropic Effective Capability Index). Long-form virology Task 1 **0.77** (3.5x expert). Opus 4.8 unavailable-tool **95** (Mythos 5 87 regression). Mythos Preview missing-reference **94** (Mythos 5 82 regression). *Capability ↑ but hallucination resistance ↓*. 8-pass S65-S74 누적 **~81 NEW SOTAs 단일 Anthropic 출시**. **+0/+4/+8** = 1689/1493/7608

### 2026-06-10 Sessions 70-73 (compressed)
- S73 🌍 7 NEW SOTAs: DeepSearchQA F1 Preview 94.4 / Mythos 5 87 (was Kimi 92.5/83). Gray Swan ART k=100 Mythos 5 4.8. ⚠ Browser injection Mythos 5 29.7% (60x worse Opus 4.8 0.5). *Capability ↑ Robustness ↓ trade-off*
- S72 🌍 8 NEW SOTAs: SWE-Verified Mythos 5 95.5 / SWE-Multilingual 92.2 / ProgramBench 88.5 / DRACO 86.4 / Multi-Agent BrowseComp async 93.3 / ChartMuseum 93.2 / LAB-Bench FigQA 90.7 / BenchCAD 1000-file 0.650. 5 NEW benches
- S71 PDF §3.2.x 🌍 **12 NEW cyber SOTAs**: Firefox 147 Mythos 5 88.4% (Opus 4.8 8.8 = 10x gap). CyberGym 99.4 EFFECTIVELY SATURATED. OSS-Fuzz + ExploitBench autonudge 10.75. UK AISI doing_life 21/23. Fable 5 cyber_classifier 99.3%
- S70 🌍 HLE no-tools 59 + gemini-3.5-audio + 4 cyber benches (firefox_148_149 PoC 14, windows BSOD 18 + priv-esc 8). **+2/+25/+80** cumulative S70-73 = 1689/1489/7600

### 2026-06-09~10 Sessions 65-69 (compressed)
- S69 6 NEW audio/T2I vendors (bytedance/hidream-o1-image-1.5 T2I #3 1265, mistral voxtral-small-transcribe 2.8%, cohere/xai/gladia/amazon ASR). AA TTS refresh Fun-Realtime-TTS 1231→1228 #1
- S68 PDF deep re-mine 🌍 **14 NEW SOTAs** (8.5-8.20.7): Mythos 5 arxivmath 78.52 / USAMO 99.8 / USAMO 2026 99.8 / officeqa 79 / proteingym_hard 44.8 / terminal_bench_2_1 88 / structural_biology 87.2 / gmmlu 93.2 / include 90.5 / labbench2_avg 80.2. Fable 5 cursorbench 72.9 / riemannbench 55 / frontier_swe_mean5 2.12 / real_world_finance_v2_elo 1374. S67 audit propagation Frontier/Cyber/Sovereign
- S66 🌍 Fable 5 AAII **65** #1 (was Opus 4.8 61). GDPval-AA Elo 1932, SWE-Verified 95.0, Blueprint-Bench 2 38.6. NEW Cohere North Mini Code + MS MAI. S65 🌍 13 NEW SOTAs Fable/Mythos 5: Fable 5 SWE-Pro 80.3 / FrontierCode 29.3+46.3 / GDP.pdf 29.8. Mythos 5 ExploitBench 78 / OSWorld 85 / Toolathlon 61.7+58.3 / BioMystery 83.9+46.1 / LatchBio 69.2+59.3 / BrowseComp 88. **+19/+15/+95** = 1688/1467/7520

### 2026-06-09 Sessions 60-64 (compressed)
- S64 NEW Physical AI VLA generalistai/gen-1 🌍 3 NEW SOTAs (multitask 99%, box-folding 12.1s 2.8x π0, phone-packing 15.5s). +gen-0. 1X World Model Lab launched. S63 7-tab audit (12 models × 7 tabs) Frontier/Cyber/Agent propagation. S62 NEW Intelligence×Price Pareto widget (4 dominant: MiMo V2.5 Pro 270 #1, M3 250, Gemini 3.1 Pro 34, Opus 4.8 15). S61 MiniMax M3 22 sub-scores + 🌍 IFBench 83 #1 + Non-Hall 84 #1 + 3 NEW AA perf benchmarks. S60 18-vendor audit + Frontier-vs-Small Gap 3-widget suite. **+3/+6/+41** cumulative = 1669/1452/7425.

### 2026-06-04~09 Sessions 51-59 (compressed)
- S59 NEW Physical AI Edge & Mobile Small-LLM 4-widget subsection (66 ≤12B / 12 countries). S58 🌍 NEW AA Transcribe SOTA fun-realtime-asr-preview 1.7% WER, xAI TTS Elo 1208. S55 AA T2I 2 NEW + TTS Quality Elo Fun-Realtime-TTS 1227 SOTA. S54 Nemotron 3 Ultra AAII 48 + ITBench-AA Opus 4.7 47% SOTA. S53 NEW AA Transcribe Scribe v2 2.2%. S52 AutoMedBench Opus 4.6 66.5 + K-BrowseComp 45.67%. S51 minimax/m3 AAII 55 + 3 arena.ai NEW. **+23/+13/+111** cumulative.

### 2026-06-03~04 Sessions 47-50 (compressed)
- S50 GPT-Rosalind 4 life-sci (LifeSciBench 63.4) + Gemma 4 12B (MMLU Pro 77.2). S49 The AI Scientist 🌍 **WORLD FIRST: AI paper passed ICLR 2025 ICBINB blind peer review** (avg 6.33/10), Automated Reviewer F1 0.67. S48 MS 7 NEW MAI (MAI-Thinking-1 SWE-Pro 52.8, MAI-Code-1-Flash 5B, MAI-Transcribe-1.5 2.4% / 43 lang, MAI-Voice-2). 🔧 exporter bug fix. S47 Opus 4.8 AAII 61 #1 + Gemini 3.5 Flash ECI 156.31. **+14/+32/+101** cumulative = 1637/1428/7246

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
| `resource/*scores_2026_*.json` | 원천 시드 + LM Council |
| `data/export/{models,benchmarks,scores/current,sota}.json` · `history/*.json` | 모델/벤치/점수/SOTA + 일별 스냅샷 |
| `data/bmt_connections.json` / `bmt_catalog.json` | BMT 매핑 + 카탈로그 (2,559개) |
