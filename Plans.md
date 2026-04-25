# LLM Benchmark SOTA Dashboard — Plans

## Current Status: 19 regions, 461 models (Korea gap-fill + sortable cols) 2026-04-25
**461 models · 241 benchmarks · 1,130 scores · 186+ SOTA records · 19 PDF sources · 84+ web sources · 19 sovereign regions**
**Live Site**: https://hollobit.github.io/SOTA/
**Design Score**: C- → **B-** (GPA 1.73 → 2.73) · **AI Slop Score: B- → A-**
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy (no more manual bumps).

## 2026-04-25 Sessions (7 batches)

### RU/DE/UK + US-Open lineup (+72 models, 4 new regions)
- **Russia (15)**: Yandex 5 Pro/Lite 8B + YaLM 100B legacy; Sber GigaChat 3 Ultra Preview 702B-A36B MoE + Lightning + 2 MAX/Pro/Lite; Vikhr opensource; T-Bank
- **Germany (11)**: Aleph Alpha Pharia-1 7B + Pharia 2 T-Free + Luminous; Black Forest Labs FLUX.1 [pro/dev/schnell/Kontext]; TNG DeepSeek R1T/R1T2 Chimera
- **UK (7)**: Stability AI StableLM 2 12B/1.6B + Stable Code 3B + Zephyr + SD 3.5 Large; Synthesia VLM; Wayve Lingo-2
- **US-Open (39, NEW region)**: Meta Llama 4 Behemoth/Maverick/Scout + Llama 3.1-3.3; Phi-4 family; Gemma 3+2; IBM Granite 3.3/3.2/3.1; Allen AI OLMo 2 + Tülu 3 + Molmo; DBRX; Snowflake Arctic; Cohere Command A/R+/R + Aya; xAI Grok-1 (314B); StarCoder 2

### India + Israel param-scale lineup (+29 models)
- **India (17)**: Sarvam-30B/105B MoE (2.4B/10.3B active), BharatGen Param-1 2.9B + Sutra + 1T roadmap, Krutrim-2 12B + Spectre, Soket AI Pragna 1B + SUTRA + Project EKA, AI4Bharat IndicLLM/IndicBERT/IndicTrans2, JioBrain · Tata MAITRI · L&T-Vyoma Sovereign AI Compute (announced)
- **Israel (12)**: AI21 Jamba 1.0 (원조 SSM-Tx), Jamba 1.5/1.6/1.7 Mini, Jamba2 Mini + Jamba2 3B (2026), Jamba Reasoning + Maestro; DICTA DictaLM 2.0 + 3.0 24B (Hebrew sovereign)
- 카운트: 인도 5→22 · 이스라엘 2→14

### France param-scale lineup deep-dive (+32 models)
- **Mistral 풀 히스토리**: Mistral 7B 원조(2023-09), Mixtral 8x7B/8x22B MoE, Nemo 12B(NVIDIA), Saba 24B(Arabic), Codestral 22B + Codestral Mamba 7B, Mathstral 7B, Pixtral 12B 원조, Magistral/Devstral 1.0, Ministral 8B/3B v1, Small 1-3.1, Large 1-2, Medium 3
- **PleIAs (Common Corpus)**: 1.0 Pico 3.5B, OLMo 1B, RAG 1B/350M
- **CNRS / academic**: Lucie 7B (OpenLLM-France), CroissantLLM 1.3B (FR-EN)
- **HuggingFace SmolLM**: SmolLM3 3B, SmolLM2 1.7B/360M/135M, SmolLM v1 1.7B
- France region 카운트: 16 → 48

### SG / UAE / China param-scale lineup deep-dive (+59 models)
- **UAE TII Falcon (16)**: Falcon-H1 0.5B/1.5B/1.5B-Deep/3B/7B/34B + H1R 7B + H1 Arabic 34B; Falcon3 1B/3B/7B/10B; Falcon Mamba 7B; Falcon 180B; Falcon2 11B; Falcon Perception
- **UAE MBZUAI (3)**: LLM360 K2 65B (open-source), Atlas-Chat 9B (Moroccan Arabic), BiMediX
- **Singapore SEA-LION (6 + 2)**: Llama-SEA-LION v3.5 70B/8B-R, Gemma2-SEA-LION v3 9B-IT, SEA-LION v2.1 7B + Sahabat-AI v1 70B/8B (GoTo+AISG Indonesian)
- **China Qwen full lineup (16)**: Qwen3 dense 0.6B/1.7B/4B/8B/14B/32B, Qwen3 MoE 30B-A3B/235B-A22B (+Thinking +Instruct 2507), Qwen3-Next, Qwen2.5 7B/14B/32B/72B
- **China DeepSeek (4)**: V3.1-Terminus, V3, R1, R1-0528
- **China GLM (3)**: GLM-4.5, GLM-4.5-Air, GLM-4.6
- **China Kimi (3)**: K2-Base, K2-Instruct, K1.5
- **China Hunyuan (3)**: Hunyuan-Large 389B-A52B, Hunyuan-Turbo, Hunyuan-7B
- **China ERNIE (4)**: ERNIE 4.5 300B-A47B (open), Turbo, Speed, Lite
- **China Doubao Seed (3)**: 1.5 Pro/Lite, 1.6
- **China StepFun (2)**: Step-2 Pro, Step-2 Mini
- Sovereign 메뉴 region 카운트: SG 2→8 · UAE 3→19 · China 17→63

### Korean sovereign deep-dive (40 new models, 13 benchmarks, 39 scores)
- **Param-scale variants registered**: LG EXAONE 4.0 32B/1.2B + 4.0.1 32B + Deep 32B/7.8B/2.4B + 3.5 32B/7.8B/2.4B; SKT A.X 4.0 (72B) + Light (7B) + VL-Light; KT Mi:dm 2.0 Base (11.5B) + Mini (2.3B); Upstage Solar Pro 2 (31B) + Pro 2 Preview + Pro + Mini + DocVision
- **New Korean foundation models**: Naver HyperCLOVA X SEED Think 14B/32B + SEED Omni 8B + SEED Vision 3B + HCX-005; Kakao Kanana 2 30B-A3B Thinking + Kanana 1.5 8B/15.7B-A3B + Flag 32.5B; NCSoft VARCO-Vision 2.0 14B + Llama-VARCO 8B; Trillion Tri-21B/7B; Motif-2 12.7B Reasoning/Instruct; Konan OND 4B + ENT-11; Saltlux Luxia 21.4B; Samsung Gauss 2 Supreme/Balanced/Compact
- **Korean benchmarks**: KMMLU, HAE-RAE, KoMT-Bench, K-MMBench, LogicKor, KoBALT-700, Ko-IFEval, HRM8K, OCRBench, MathVista (full), MT-Bench, WinoGrande, KOBEST
- **Sovereign menu UX**: 모델별 출시년도 `(YYYY-MM)` 표시 + 가장 최신 발표 모델순 정렬. RELEASE_DATES 맵 ~140 entries.
- **Frontier Compare**: 10개 한국 sovereign 모델 추가 (HyperCLOVA X Think 32B/14B, Kanana 2 + 1.5 8B, VARCO-Vision 2.0, Tri-21B, Motif-2, EXAONE 4.0 32B, A.X 4.0, Solar Pro 2)

### Sovereign AI menu (initial → country comparison → Manufacturing)
신규 탭 `tab-sovereign` (`dashboard/js/sovereign.js`) — 15 region cards × 3 dimension panels (Language/Medical/Government) + 국가별 3-axis radar + Best-of-Fleet 리더보드 + cross-region heatmap. 모든 score 셀 클릭 → Modal.showScoreSource. Manufacturing/Robotics/CAD region 추가 (Foxconn FoxBrain · Skild Brain · Gemini Robotics-ER 1.6 등 21개 모델, 4 verified scores).

### Physical AI / World Models (+11 models, +7 benchmarks)
NVIDIA Cosmos + GR00T N1.6/1.7, DeepMind Genie 3 (24fps@720p / 3min) + Genie 2, Pi-Zero, OpenVLA, AgiBot. LIBERO (Cosmos 98.5% SOTA), RoboCasa, RoboTwin 2.0, VLABench, Open X-Embodiment, World Model Consistency/FPS.

### 2026-04-25 earlier batches (compressed — see HISTORY.md)
Daily sweep + Regional v1 (+11) + Regional v2 (+2 models, +21 benches, +51 scores) + Mistral lineup (+13: Devstral 2 SWE-V 72.2, Pixtral Large DocVQA 93.3 SOTA)

## CI / Infrastructure (2026-04-24/25)
gh-pages rsync `--exclude='/data'` fix · curated seed score load step · auto cache-bust `?v=$BUILD_SHA[:8]` · score click-modal across 5 tables · sortable Frontier Compare columns

---

## Earlier sessions (compressed — see HISTORY.md)
- **2026-04-24**: GPT-5.5 + Pro, Kimi K2.6, Qwen3.6-27B (+9 benchmarks)
- **Phase 1-9 (2026-04-16/17/18)**: 67 models · 95 benchmarks · 721 scores · 78 SOTA

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
