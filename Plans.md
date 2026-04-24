# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Sovereign AI menu + Physical AI 2026-04-25
**128 models · 224 benchmarks · 1,087 scores · 186 SOTA records · 19 PDF sources · 84+ web sources**
**Live Site**: https://hollobit.github.io/SOTA/
**Design Score**: C- → **B-** (GPA 1.73 → 2.73) · **AI Slop Score: B- → A-**
**CI**: workflow `benchmark-update.yml` deploys daily 06:00 UTC + on workflow_dispatch. Auto-rewrites JS `?v=` cache busters with commit SHA per deploy (no more manual bumps).

## 2026-04-25 Sessions (7 batches)

### Sovereign AI menu (NEW)
- New dashboard tab `Sovereign AI` (`dashboard/js/sovereign.js` + index markup) — 11 region cards × 3 dimension panels (Language Adaptation · Medical System Integration · Government/Regulated Domain) + cross-region heatmap. Each panel compares top sovereign models against frontier baselines (GPT-5.5/Claude/Gemini/Muse Spark) with desaturated frontier bars to make sovereign value gap visible. Score cells + heatmap clickable → Modal.showScoreSource.
- Frame: 한국(EXAONE/Solar/A.X/Mi:dm/KMed.ai) · 중국(DeepSeek/Qwen/Kimi/GLM/ERNIE/Hunyuan/Doubao) · 인도(Sarvam/BharatGen/Krutrim/BharatGPT) · UAE(Falcon-H1/BiMediX) · 이스라엘(AI21 Jamba) · 싱가포르(SEA-LION) · 스위스(Meditron/Apertus) · US Legal(Harvey/CoCounsel/Vincent/Oliver) · US Finance(BloombergGPT) · DARPA AIxCC.

### Physical AI / World Models (+11 models, +7 benchmarks)
- NVIDIA Cosmos suite (Predict 2.5, Reason 2, Policy-RoboCasa) + GR00T N1.6/N1.7 humanoid VLA
- DeepMind Genie 3 (24fps@720p, 3min consistency) + Genie 2
- Physical Intelligence Pi-Zero / Pi-Zero Fast, OpenVLA-7B, AgiBot Genie Envisioner
- Benchmarks: LIBERO (Cosmos Policy 98.5% SOTA), RoboCasa (67.1% / 50 demos), RoboTwin 2.0, VLABench, Open X-Embodiment, World Model Consistency, World Model FPS



### Daily monitoring sweep (no new frontier launches)
Confirmed via OpenAI Deployment Safety Hub, Anthropic Research, HF Qwen + DeepSeek orgs, Irregular publications, llm-stats updates. Only material change: DeepSeek V4 official API launch (`api-docs.deepseek.com/updates`, 2026-04-24) with confirmed pricing — V4-Pro $0.145 / $3.48, V4-Flash $0.14 / $0.28 per 1M tokens.

### Regional / domain-specialized models batch v1 (+11 models, +8 benchmarks)
- **France**: Mistral Small 4, Large 3, Voxtral TTS
- **Google medical**: MedGemma 27B, MedGemma 1.5 4B
- **UAE**: Falcon-H1 Arabic 34B, Falcon Perception 600M
- **Japan**: Sakana Namazu (alpha)
- **Singapore**: Apertus-SEA-LION v4 8B, Gemma-SEA-LION v4 4B-VL
- New medical benchmarks: medqa, medmcqa, pubmedqa, mmlu_med, medxpertqa, afrimed_qa, ehrqa + math_500

### Regional v2 deep-dive (+2 models, +21 benchmarks, +51 scores)
- HuggingFace model card pulls: Qwen3.6-35B-A3B (21→30 scores), Falcon-H1 34B (0→22), MedGemma 27B (+4 imaging), MedGemma 4B PT (10), Gemma 3 4B baseline
- 2 PDFs: `MedGemma-Technical-Report-2507.05201.pdf`, `MedGemma-1.5-Technical-Report-2604.05081.pdf`
- 21 new benchmarks across 5 categories

### Mistral lineup expansion (+13 models, +4 benchmarks)
- Devstral 2 (123B, SWE-Verified 72.2 SOTA among open) + Devstral Small 2 (24B, 68.0)
- Magistral Small 1.2 (24B reasoning: AIME24 86.14, GPQA 70.07)
- Codestral 25.08, Pixtral Large (124B vision SOTA: DocVQA 93.3, AI2D 93.8, ChartQA 88.1)
- Stubs: Mistral Medium 3.1, Small 3.2, Ministral 3 14B/8B/3B

## CI / Infrastructure improvements (2026-04-24/25)

- **Fixed gh-pages deploy**: cp-vs-symlink failure on `dashboard/data` resolved with rsync `--exclude='/data'`
- **Seed score load step** added to analyst job — curated PDF/blog scores ingest into CI DB
- **Auto cache-bust** (`?v=$BUILD_SHA[:8]`) eliminates manual JS version bumps
- **Score click-modal across 5 tables**: Frontier Compare heatmap, Cyber & Coding 4 tables, Explorer comparison, Comparison matrix, Overview SOTA Leaderboard
- **Sortable column headers** on Frontier Compare table

---

## 2026-04-24 Frontier Update (compressed — see HISTORY.md for detail)
+4 models (GPT-5.5 + Pro · Kimi K2.6 · Qwen3.6-27B), +9 benchmarks (HealthBench Pro, Toolathlon, MCPMark, QwenWebBench, NL2Repo, AndroidWorld, VLMs-Are-Blind, RealWorldQA, SkillsBench), +8 monitoring sources. Batch: `resource/frontier_2026_04_24_scores.json`.

## Completed Phases (compressed)
Phase 1-9 (2026-04-16/17/18) executed sequentially, ending in 67 models · 95 benchmarks · 721 scores · 78 SOTA on 2026-04-18 deploy. Full per-phase details in HISTORY.md.

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
