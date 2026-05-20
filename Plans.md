# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Session 20 — FactoryBench (industrial machine understanding) ingest (2026-05-21)
**1,465 models · 1,075 benchmarks · 5,787 scores · 14 active tabs + Frontier Compare composite split (composite_eci 33 cols / composite_aaii 13 cols)**
**Live Site**: https://hollobit.github.io/SOTA/
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy.

### 2026-05-21 Session 20 — FactoryBench industrial-robotics causal-reasoning benchmark
- **FactoryBench** (arxiv 2605.07675, Merzouki et al, May 8 2026, ETH + Forgis + UC3M + Imperial + UC Berkeley + KTH + U. Vienna): 4-level Pearl's-ladder reasoning over UR3 cobot + KUKA KR10 industrial-arm telemetry. 6 frontier LLMs × 4 levels (L1 State / L2 Intervention / L3 Counterfactual / L4 Decision) = **+4 benchmarks, +24 scores**
- **Headline**: Claude Sonnet 4.6 dominates L1-L3 (46.8/47.1/45.9%) but L4 decision-making collapses 10x to 4.3%; GPT-5.1 alone clears L4 at 17.7%; Qwen3-235B uniquely strong on counterfactual reasoning (L3 43.6%, ties Sonnet)
- **All 6 models pre-existing in DB** (anthropic/claude-sonnet-4.6, openai/gpt-5.1, deepseek/deepseek-v3.2, mistral/mistral-large-3, alibaba/qwen3-235b-a22b, alibaba/qwen3-4b) — data-only ingest, no new models
- **PDF archived** (15MB) at `resource/factorybench_2605_07675.pdf` per memory rule; Physical AI embodied-reasoning suite + Resources tab + seed_sources.yaml all patched; cache-bust physical-ai.js + app.js v=20260521a

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

### 2026-05-18 Session 17 — NVIDIA SANA-WM + xAI Grok Build CLI + cyber arxiv mega-batch (8 commits)
- **NVIDIA SANA-WM** — 1-min world-model benchmark + 6 model comparison (`409226a`)
- **xAI Grok Build CLI** (May 14 launch) + grok-code-fast-1 SWE-bench backfill (`c028e94`)
- **User refs (4 arxiv)** — Simbian Cyber Defense + NYU CTF + HarmfulSkillBench (`3866e44`)
- **10-paper cyber arxiv batch** — PACEbench + CTI-REALM + AISI + CyberTeam + Auto Adversary (`3bf5585`)

### 2026-05-17 Session 16 — GBA Eval + daily cyber sweep (4 commits)
- **GBA Eval** ingest — frontier coding agents building Game Boy Advance emulator from scratch (`9b628a6`)
- **2026-05-17 daily sweep** — MDASH CyberGym SOTA + CurveBench + 5 new benches (`dcfae29`)

### 2026-05-15 Session 15 — World FM + Science FM + arxiv ref-link sweep (8 commits)
- **2026-05-15 arxiv mine batch** — PDF mine of 5 May-11/13 benchmark papers (`6d02663`)
- **User refs** — SDE benchmark + HAL leaderboard + The Well (rejected) (`0def876`)
- **Science FM + Universal FM coverage expansion** (`d3f429a`)
- **World Foundation Models** — VBench + V-JEPA 2 + Meta Physical Reasoning + Cosmos Predict 2.5 (`cf1a93b`)

### 2026-05-14 Session 14 — arxiv sweep + deepfake/AIGC first-coverage (4 commits)
- **2026-05-14 arxiv sweep** — 11 new benchmarks + 12 new models + 104 scores (`9047176`)
- **Deepfake / AIGC detection benchmarks** — first DB coverage of media forensics (`767061a`)

### 2026-05-13 Session 13 — Sovereign AI 13-country sweep + PDF deep mining (8 commits)
- **2026-05-13 ref-link sweep** — new models/benchmarks from recent sources (`a80d526`)
- **Ref-link batch 2** — speech-to-speech + AI Co-Mathematician + OneManCompany (`6f81130`)
- **PDF deep mining batch** — OneManCompany + Agent-World + AI Co-Math additional scores (`af22a15`)
- **Sovereign AI 13-country sweep** (6-subagent parallel research) + Sovereign AI menu wiring (`9dce957`, `495ad9e`)

### 2026-05-12 Session 12 — Mythos cyber + Onyx Open LLM + Medical AI timeline (16+ commits)
- **Mythos cyber benchmarks** — +5 benches, +9 scores + W9 widget refactor (`b684a34`)
- **DELEGATE-52** Microsoft Research document corruption benchmark (arxiv 2604.15597) (`171c9d3`)
- **Onyx Open LLM Leaderboard 2026** — 19 open-source models × 10 benchmarks (`493f892`)
- **Medical AI Release Timeline** month-column infographic + 4 follow-up tuning fixes (`b0925b7` → `0599cb2`)
- **AA per-benchmark sub-scores** from frontier model detail pages (`b3f65f1`)
- **PDF deep mining** for math/materials specialists (MiniF2F + Rosetta Stone) (`fec77dd`, `326aa00`)
- **Changelog UI fix** — show all types + sort descending by date (`e5ac346`)

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
