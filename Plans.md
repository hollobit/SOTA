# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 23 — Fara1.5 + Asa-W1 + Open Agent Leaderboard (2026-05-26)
**1,530 models · 1,122 benchmarks · 6,167 scores · 14 active tabs + Frontier Compare composite split (composite_eci 33 cols / composite_aaii 13 cols)**
**Live Site**: https://hollobit.github.io/SOTA/
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy.

### 2026-05-26 Session 23 — 7 user-provided refs (Fara1.5 + Asa-W1 + Open Agent Leaderboard)
- 7 ref URLs investigated; 4 yielded ingestable data, 3 SKIP (arxiv 2604.05550 system paper, agent.openmed.life product page, arxiv 2602.22953 methodology paper)
- **Microsoft Fara1.5** (May 21 2026): NEW browser computer-use agent family — Fara1.5-4B/9B/27B + Fara-7B predecessor (base Qwen3.5). Fara1.5-27B #1 on Online-Mind2Web 72.0 and WebVoyager 88.6 (beats OpenAI Operator 87.0)
- **NexgeneAI Asa-W1**: NEW medical reasoning model. HealthBench Professional **80.2 overall** vs ChatGPT-for-Clinicians 59.0 = +21.2 points (largest jump in HealthBench Pro history). 28 specialties tracked. 4 new HealthBench Pro slice IDs registered (consult/writing/research/redteaming)
- **Open Agent Leaderboard** (HF Space): 5×5 agent-framework × backbone matrix. Top: OpenAI Solo + Opus 4.5 = 72.7%. Best price/perf: React+Shortlist + Gemini Pro 3 = 62.2% at $0.51 (12x cheaper)
- 6 comparison models from Fara1.5 panel registered: OpenAI Operator, Gemini 2.5 CU, GUI-Owl 1.5 8B/32B, Yutori Navigator n1, Holo2 30B, o3-SOM
- **+11 models / +8 benches / +35 scores** = 1530 / 1122 / 6167. 740KB PDF archived. Cache-bust app.js v=20260526b

### 2026-05-26 Session 22 — arena.ai sweep refresh (WebDev + Text-to-Image rank 11-34 expansion)
- Changelog targets (May 22 + May 25): recraft-v4.1-pro / recraft-v4.1-utility-pro (Text-to-Image), qwen3.7-max-20260517 (WebDev #4 at 1541 Elo, Preliminary)
- **+31 new models**: 5 changelog targets + 9 WebDev rank 12-34 (claude-opus-4.5-thinking, deepseek-v4-pro-thinking, gpt-5.4-medium, gpt-5.4-mini-high, kimi-k2.5-thinking, kimi-k2.5-instant, minimax-m2.7) + 18 image-gen models (Flux 2 family 4 variants, Bytedance Seedream 5 variants, Tencent Hunyuan Image 3.0, Google Imagen Ultra 4.0 + 4.0, Reve v1.5, Qwen Image 3 builds, Wan 2.5/2.6 T2I, gpt-image-1 vintage, grok-imagine-image-pro, gemini-2.5-flash-image/nano-banana)
- **Headlines**: Qwen3.7-Max-20260517 enters WebDev at #4 ahead of Opus 4.6 base. Recraft v4.1-utility-pro (1169 #11) beats Recraft v4.1-pro (1130 #26). gemini-2.5-flash-image (original nano-banana) #18 with 777K+ votes — most-voted T2I entry
- **+31 models / 0 benches / +48 scores** = 1519 / 1114 / 6132. Cache-bust app.js v=20260526a

### 2026-05-23 Session 21 — arena.ai 12-leaderboard sweep
- Live Playwright snapshot of arena.ai/leaderboard, top-10 Elo per board ingested across 12 active arenas
- **+8 new arena bench IDs**: arena_webdev_elo / arena_document_elo / arena_image_to_webdev_elo / arena_text_to_image_elo / arena_image_edit_elo / arena_text_to_video_elo / arena_image_to_video_elo / arena_video_edit_elo
- **+16 new models**: 5 Grok-Imagine image+video variants, 3 Kling (v3/o1/o3-pro), Wan 2.6 T2V, Runway Gen-4 Aleph, MAI-Image-2, 3 Grok-4.20 internal variants, Qwen 3.5 Max Preview, Gemini 3 Flash thinking-minimal, GPT-5.4-high
- **Headline**: GPT-Image-2 leads text-to-image (1389) + image-edit (1467); Bytedance Dreamina Seedance 2.0 720p sweeps video (1457/1462/1379); Claude Opus 4.7 Thinking leads WebDev (1567) + Image-to-WebDev (1581); Opus 4.6 Thinking leads Document (1522). Alibaba happyhorse-1.0 ranks #2 across all 3 video boards
- **+16 models / +8 benches / +76 scores** = 1488 / 1114 / 6084. Cache-bust app.js v=20260523a

### 2026-05-22 Session 20 cont'd 6 — Qwen3.7-Max official model split from preview ID
- Re-checked Qwen blog (May 20): model referenced 30x as "Qwen3.7-Max", **ZERO "preview" mentions**. Qwen3.7-Plus mentioned 0 times (Plus didn't launch)
- First-pass ingest (commit f120612) erroneously used `qwen3.7-max-preview` ID for all 41-bench blog scores. Corrected:
  - **alibaba/qwen3.7-max** (NEW, May 20 official): inherits 45 scores (44 blog + 1 AA)
  - **alibaba/qwen3.7-max-preview** (May 14 arena.ai early build): retains only arena.ai text Elo 1475
  - **alibaba/qwen3.7-plus-preview**: untouched (Plus not yet launched)
- SQL UPDATE migrated 45 rows; source JSON files (qwen37_max_scores + qwen37_deepdive_scores) re-attributed at model_id level for CI consistency
- Menu propagation: sovereign.js (China-CN category, RELEASE_DATES, PARAMS_BILLIONS) + frontier-compare.js FRONTIER_MODELS now include both IDs
- **+1 model / 0 benches / 0 score delta** = 1471 / 1106 / 6008. Cache-bust sovereign.js + frontier-compare.js + app.js v=20260522a

### 2026-05-21 Session 20 cont'd 3-5 (compressed)
- **cont'd 5 — Qwen3.7 table completion**: 96 cross-vendor cells fill (no PRESERVE conflict). Per-model deltas: Opus 4.6 Max +17 (168→185), K2.6 +17, GLM-5.1 +17, DS-V4-Pro Max +20, Qwen3.6-Plus +25. **+96 scores** = 6008. v=20260521f
- **cont'd 4 — Qwen3.7 deep dive**: YC-Bench startup simulator ($2.08M/$1.05M/$352K), KernelBench L3 speedup (Opus 4.6 Max 2.63x #1, Qwen3.7-Max 1.98x), Qwen-RobotClaw + Qwen-RobotNav new models. AAII actual 56.58 (rank 4). **+3 models / +3 benches / +10 scores**. v=20260521e
- **cont'd 3 — OpenAI Deployment Safety Hub (3 pages)**: GPT-5.4 Thinking +10 (Prep Bio + Apollo + Irregular cyber), GPT-5.4 Mini +6, GPT-5.5 Instant +14 (first High-Capability Instant; stat-sig safety regressions Gore 70.3/Sexual 80.6/Hate 82.7), ChatGPT Images 2.0 + Thinking (5 image-safety bench IDs, 3.3x lower violative but harder to flag). **+2 models / +13 benches / +40 scores**. v=20260521d

### 2026-05-21 Session 20 (parts 1-2, compressed — see HISTORY.md)
- **cont'd 2 — Qwen3.7-Max launch**: 41-bench × 6-model panel ingested. +12 new benches (qwen_webdev / svg / claw / cowork_bench / vitabench / spreadsheet_bench_v1 / kernelbench_l3 / worldbench / maxife / mmlu_prox / nova_63 / polymath). **+72 scores**. AAII 57 (#1-tier). Wins 18/41 incl. MRCR-128k 90.4 (beats Opus 4.6 Max long-context). v=20260521c
- **cont'd — Cyber audit + Palisade GPT-5 CTFs**: Mythos already comprehensive (47 scores); GPT-5.5/5.4-Cyber non-public; Palisade arxiv 2511.04860 adds GPT-5 Pro ASIS Quals 93rd / CorCTF 90th / snakeCTF 92nd percentile. **+3 benches / +3 scores**. v=20260521b
- **FactoryBench (arxiv 2605.07675)** — industrial robot Pearl's-ladder 4-level reasoning (ETH+UC3M+KTH May 8 2026). 6 LLMs × 4 levels = **+4 benches / +24 scores**. Sonnet 4.6 dominates L1-L3 but L4 collapses 10x; GPT-5.1 alone clears L4 at 17.7%. v=20260521a

### 2026-05-20 Session 19 — Gemini 3.5 Flash launch + TextArena/arena.ai + 35-row PDF backfill (6 commits)
- **Gemini 3.5 Flash + Omni Flash** (May 19 launch): 14 initial benches + Omni Flash deferred-to-API model registration (`11bb478`)
- **TextArena + arena.ai vision/text** ingest + Alibaba Qwen 3.7 Max/Plus preview (`9f210a0`)
- **35 cross-model triples** backfilled from Gemini 3.5 Flash PDF page 4 (6-column comparison table: 3 Flash / 3.1 Pro / Sonnet 4.6 / Opus 4.7 / GPT-5.5 / 3.5 Flash) — Gemini 3 Flash gained 12 triples, GPT-5.5 +7 (incl. MRCR 128k 94.8 top, Blueprint 36.2 top), Opus 4.7 +5 (incl. surprise MRCR 128k 59.3 weakness) (`6e4950c`)
- **SWE-Bench Pro 55.1 → 53.9** correction for Gemini 3.5 Flash via canonical PDF source (`555902d`)
- **Reference leaderboard mining** for Session 19 models — +13 new scores for Gemini 3.5 Flash via AA detail page + arena.ai + matharena (`65271d8`)
- **Changelog PDF export** with period filter (7d/30d/90d/All) (`44aa7a8`)

### 2026-05-19 Session 18 — ExploitBench + deep menu audit pass 2 (8 commits)
- **ExploitBench live leaderboard delta** + sovereign-AI delta sweep (0 new) (`7be38b0`)
- **FRONTIER_MODELS hardcoded list propagation** — recent flagship models wired into Frontier Compare et al (`c94699b`)
- **Deep menu audit pass 2** — Agent / AI4S / Physical AI hardcoded lists refreshed (`9ce27df`)
- **ExploitBench cyber-coding menu surface** + 6 recent cyber bench families exposed in Cyber & Coding menu (`ef81976`)

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

### cc:TODO — Watch for future publications (external dependency)
- [x] MRCR v2 8-needle expansion — 7 frontier scores ingested 2026-05-08 (Opus 4.6 93.0 / GPT-5.5 74.0 / Gemini 3.x family). LongBench v2 / RULER 미진
- [ ] HarmBench / StrongREJECT / AIR-Bench frontier backfill — 2026-05-08 재조사 결과 frontier 점수 미공개. UK AISI inspect_evals / Gray Swan Arena 추가 모니터링 필요
- [ ] Video-MME leaderboard — 2026-05-08 Playwright 렌더링 성공. 그러나 leaderboard 자체가 2025-09 까지로 stale, 2026 frontier 미반영. 외부 publication 대기
- [ ] MMAU frontier scores — 2026-05-08 재조사 결과 미공개
- [ ] AutoPatchBench / CyberSOCEval — pre-frontier 모델만 PNG 그림에 노출. OCR / 후속 논문 발표 대기 (BLOCKED)
- [ ] Gemini Omni Flash — 2026-05-19 launch but vendor deferred eval to API rollout (no public benches as of Session 19)
- [ ] Qwen 3.7 Max/Plus preview — Session 19 첫 등록 후 arena.ai text/vision 1점만, 2-3주 후 leaderboard 재확인 필요

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
| `data/bmt_connections.json` | BMT ↔ 점수 ID 매핑 |
| `data/bmt_catalog.json` | BMT 전체 카탈로그 (2,559개) |
