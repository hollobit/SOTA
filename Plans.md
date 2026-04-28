# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Medical AI 메뉴 신설 + 종합 expansion (2026-04-26 ~ 04-28)
**~750 models · 188 benchmarks · ~1,500 scores · 30 Medical AI categories · 32 sub-suite leaderboards · BMT registry mapping (119/188 = 63%)**
**Live Site**: https://hollobit.github.io/SOTA/
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy.

## 2026-04-26 ~ 04-28 Medical AI Sessions (10+ batches)

### Medical AI 메뉴 초기 (2026-04-26)
- 신규 `tab-medical-ai` + `dashboard/js/medical-ai.js`
- 5 카테고리: Clinical LLMs · Biomedical LLMs · Medical Imaging FMs · Specialty FMs · Frontier Baselines
- 14 의료 벤치마크: HealthBench Pro, MedQA, MedMCQA, PubMedQA, MedXpertQA, NEJM Image, JAMA Clinical, Universal Med-Seg Dice, RetBench, RadBench, Path AUROC

### 메뉴 확장 — 7→12 카테고리: Multilingual + Encoder + Korean + VLM + Bio dual-use + Protein + Drug
- 🇰🇷 Korean Medical AI (SNUH KMed.ai KMLE 96.4 SOTA, Lunit MedScale 32B, Kakao Healthcare, MedKAIST)
- Medical VLMs: Med-Flamingo, MedDr 40B, HuatuoGPT-Vision 7B/34B, BiomedGPT
- Protein FMs: AlphaFold 2/3, ESM3 98B, RoseTTAFold 3, Boltz-1/2, Chai-1
- Drug Discovery: IBM MoLFormer, ChemFM 3B, TamGen, BioNeMo 2

### 12→27 카테고리: 10-country sovereign + safety/hallucination + radiology + clinical pred
- 10개국 sovereign: 🇯🇵 ELYZA-LLM-Med · 🇩🇪 DKFZ Delphi · 🇫🇷 BioMistral CNRS+Owkin · 🇬🇧 NHS AIDE · 🇨🇦 Vector · 🇮🇳 Vaidya 2.0 (HealthBench Hard 50.1 1위) · 🇦🇪 M42 Med42 · 🇸🇬 Synapxe · 🇨🇳 Alibaba SumiHealth · 🇺🇸 Stanford Almanac
- Safety: Med-HALT · MedHallu · MedSafetyBench · CSEDB · CRAFT-MD · MEDIC
- Radiology: MedVersa (ReXrank 1위) · MAIRA-2 · CheXagent · ReXrank 8-metric
- Clinical Outcome: MIMIC-IV Sepsis Bench · MIMIC-AKI XGBoost (AUROC 0.878)

### BMT registry 통합 (2026-04-26)
- `scripts/map_bmt_benchmarks.py`: idempotent — strict + loose + alpha-only + substring fallback. 100+ ALIASES
- BMT/BMT.json (2,559 entries 외부) → BMT-mapping.json (119 matched) + BMT-miss.json (69 misses)

### 27→30 카테고리: BMT round 2 + nursing + SAM 3 + TS/wearable + MLCommons
- **BMT round 2 (04-27)**: MSD Decathlon, BraTS 2023, ISIC, MedCalc-Bench, LongHealth, MedJourney, MedDialog, MedRAG, PharmKG, OpenI, PadChest-GR, ROCO v2, RSNA Pneumonia, VinDr-CXR, Ruijin-PD MICCAI 2025 (+22)
- **간호학 + advanced imaging**: NurseLLM 7B (Imperial+Manchester), NCLEX-RN, Chinese Nursing (Qwen-2.5 88.9 SOTA), CheXpert Plus, CXR-LT, Chest ImaGenome, HAM10000, DRIVE, DDSM (+18)
- **SAM 3 family (04-27)**: SAM 3 (Meta Nov 2025 PCS), SAM 3.1, SAM 3D, MedSAM 3 (Dice 91.5 SOTA), VISTA3D NVIDIA MONAI, SegVol, SAT-Pro, nnInteractive, MCP-MedSAM
- **Google TS+Wearable**: TimesFM 1/2.5, PH-LLM 1/2 (sleep 79 / fitness 88 beats human 76/71), LSM-1/2 (40M hrs Fitbit), Apple Wearable FM (2.5B hrs / 57-task)
- **MLCommons MedPerf**: FeTS 2.0 nnUNet 32 sites × 6 continents × 41 models, post-op GBM Dice 0.95 record (Nature Comm. 2025), GaNDLF, AILuminate v1.1, MLPerf v5.1

### 출시 타임라인 그래프 (Medical AI tab, 2026-04-26)
- x = 출시일, y = 파라미터 log scale, 색상 = 14개국. 기간 필터 + y축 모드 토글. 버블 클릭 → 모델 상세

### 2026-04-28 finalization
- BMT mapping 102 → **119** matched (script: alpha-only + substring fallback + 100+ aliases)
- Modal BMT registry block: `Modal.showScoreSource`에 Paper/GitHub/Leaderboard/BMT Registry 딥링크 + year + item_count 렌더링
- Exporter: YAML 메타데이터 → `data/export/benchmarks.json`로 자동 머지
- Cyber & Coding backfill: Claude Opus 4.7 SWE-bench Verified **87.6 SOTA**, Cybench 86.4, FORTRESS 92.7, HumanEval 96.5
- Physical AI backfill: NVIDIA GR00T N1.7 (Cosmos-Reason2-2B backbone) — LIBERO **98.7**, RoboCasa 71.4

---

## Earlier sessions (compressed — see HISTORY.md)
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

### Completed — 데이터 수집 자동화
- [x] `python -m cyber discover` 명령 — 새 벤치마크/모델 자동 감지 (이미 구현, seed_sources.yaml에서 68개 신규 등록 확인)
- [x] `python -m cyber collect` 명령 — 정기 데이터 수집 (이미 구현, scheduler 기반 due sources 필터)
- [x] GitHub Actions 파이프라인 — `discovery.yml` 주 2회 (수/토) discover+collect, `benchmark-update.yml` 일간 scout→analyze→export→build→deploy, `librarian-weekly.yml` 주간 trust/health 업데이트

### Completed — 대시보드 개선 (2026-04-18)
- [x] Cyber & Coding 탭에 방어 벤치마크 바 차트 추가 (commit `1657b90`)
- [x] 벤치마크 카테고리 필터 (Overview SOTA Leaderboard pill-filter, commit `3ec4a0f`)
- [x] 모델 간 head-to-head 비교 레이더 차트 개선 — shared-axis 우선 정렬, spread tiebreak, 풍부한 tooltip (commit `a268c3a`)
- [x] PDF 소스 출처 표시 — modal score row마다 vendor canonical URL로 링크 (commit `01dfd74`)

### Completed — 추가 데이터 소스 (2026-04-18)
- [x] Grok-4.20 벤치마크 점수 수집 — BenchLM + Arena에서 11 scores ingest (commit `f8b37f4`)
- [x] GPT-5.4 System Card — 이미 33 scores (gpt-5.4: 17, -thinking: 6, -mini: 8, -pro: 2) — resource/gpt-5-4-thinking.pdf 기반 완전 분석됨
- [x] Gemini 3.1 Pro — 이미 15 scores 수집됨
- [ ] **BLOCKED (외부 데이터 부재)**: AutoPatchBench / CyberSOCEval — 2026-04-18 재조사 결과, 해당 논문들은 pre-frontier 모델(Gemini 1.5 Pro, Llama 4 Maverick, o3, GPT-4o)만 테스트했고 값이 PNG 그림에만 있음. OCR 또는 후속 논문 발표 대기. ZeroDayBench는 3 frontier scores (Claude Sonnet 4.5, GPT-5, Grok 4) ingest 완료.

### Completed — 분석 기능 (2026-04-18)
- [x] 벤치마크 간 상관관계 분석 — Trends 탭 Cross-Benchmark Correlation heatmap (Top-15 benchmarks, Pearson r, red-neutral-green scale, commit `0f0f754`)
- [x] 시간별 SOTA 변화 추적 — Trends 탭 SOTA Handover Log + 동적 history index.json (commit `43248cd`)
- [x] 모델 성능/비용 효율성 — `data/export/aa_pricing.json` (20/22 모델 Intelligence Index + USD/1M + tokens/s) + Trends 탭 Intelligence vs Price scatter (log x, linear y, vendor-colored, size=speed)

### Completed — BMT batch-1 priorities 1-11 (2026-04-18)
26 benchmarks registered, 33 real frontier scores ingested from 9 agent research passes. Metadata-only for benchmarks whose paper cohorts predate 2026 frontier models.

- [x] P1 HealthBench + Arena-Hard-Auto — 20 scores (o3, gpt-5, gpt-5.1, gpt-5.2, gpt-5.4-thinking, claude-3.7-sonnet, gemini-3.1-pro, grok-4.20 across HB/Hard/Consensus); Arena-Hard v1 superseded by v2
- [x] P2 HarmBench + StrongREJECT + AIR-Bench — metadata only; frontier evals have migrated to Gray Swan Arena / Anthropic Petri / OpenAI Preparedness
- [x] P3 Multi-SWE-bench + SWE-PolyBench — metadata only; consolidated on SWE-bench Verified/Pro/rebench/Multilingual
- [x] P4 CTI-Bench + CyberMetric — metadata only; 2024 cohorts
- [x] P5 Video-MME — 2 provisional Gemini scores (78.2% each)
- [x] P6 HELMET — metadata only; frontier uses MRCR/RULER/LongBench v2 instead
- [x] P7 AudioBench + MMAU — metadata only; opens new 'audio' category
- [x] P8 Windows Agent Arena + ScienceAgentBench + MCP-Bench + LiveMCPBench + BrowseComp-Plus — 5 benchmarks metadata only
- [x] P9 SuperGPQA + ZebraLogic + LiveBench — 4 scores (LiveBench: gpt-5.4-thinking 80.3 / gemini-3.1-pro 79.9 / claude-opus-4.6 76.3 · SuperGPQA: glm-5 92.0); ZebraLogic deprecated
- [x] P10 SecRepoBench + MegaVul — 3 scores (gpt-5 39.3 / o3 32.4 / claude-sonnet-4.5 31.1 secure-pass@1)
- [x] P11 BLINK + Finance Agent — 4 scores (Finance Agent Anthropic sweep: opus-4.7 64.37 / sonnet-4.6 63.33 / opus-4.6 60.05 / o3 48.3)

### cc:TODO — Watch for future publications (external dependency)
- [ ] MRCR / RULER / LongBench v2 expansion — frontier long-context SOTA (current LongBench v2 tracked)
- [ ] HarmBench / StrongREJECT / AIR-Bench frontier backfill (watch Stanford HELM Safety, UK AISI inspect_evals, Gray Swan Arena)
- [ ] Video-MME leaderboard live scrape for Claude/GPT/Gemini-3 family (video-mme.github.io client-side render)
- [ ] MMAU frontier scores (watch Gemini 3 audio model card, GPT-5 audio, Claude 4.x audio evaluation)

### Completed (2026-04-18 `/design-review` follow-up — 22 atomic commits)
- [x] F-005: Overview 탭 IA 재구성 — SOTA Leaderboard를 full-width primary로 승격, Leaderboard Rankings + Recent Changes는 2-column secondary로 강등 (commit `c199996`)
- [x] F-006: 카드 → 레이아웃 전환 — Resources PDF/Sites를 bordered-row 리스트로, Cyber & Coding benchmark descriptions를 uppercase-tracked 4-column glossary로 재구성 (commit `ad8cda7`)
- [x] F-016: Tailwind Play CDN → 빌드 파이프라인 — `package.json` + `tailwind.config.js` + `dashboard/src/tailwind.css` + `npm run build:css` → 13.7KB 번들 (commit `59f8ca9`)
- [x] Typography ramp — `text-display / text-section / text-widget / text-meta` 시맨틱 스케일을 Tailwind theme에 등록. H3가 더 이상 본문보다 작지 않음 (commit `b7acce2`)
- [x] Motion 언어 — modal fade+scale (160ms), tab-panel enter (120ms), `@media (prefers-reduced-motion: reduce)` 전면 적용 (commit `dbe7462`)

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
