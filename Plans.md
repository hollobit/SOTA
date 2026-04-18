# LLM Benchmark SOTA Dashboard — Plans

## Current Status: Phase 9 완료 — `/design-review` 16 atomic fixes (2026-04-18)
63 models · 91 benchmarks · 707 scores · 78 SOTA records · 15 PDF sources · 26 web sources
**Live Site**: https://hollobit.github.io/SOTA/
**Design Score**: C- → **B-** (GPA 1.73 → 2.73) · **AI Slop Score: B- → A-** (see `.gstack/design-reports/final-report-2026-04-18.md`)

---

## Completed Tasks

- [x] Phase 1: 최신 벤치마크 데이터 수집 (웹 리더보드 6개 소스)
- [x] Phase 2: Cyber & Coding 전용 탭 구현 (4축: Attack/Defense/Coding/Agent)
- [x] Phase 3: BMT 카탈로그 연결 + 시드 소스 확장 (13개 추가)
- [x] Phase 4: PDF System Card/논문 8개 완전 분석 및 데이터 추출
- [x] Phase 5: MiniMax M2.7 + Gemma 4 Model Card 웹 소스 통합
- [x] Phase 5b: Gemini 3 Pro 전체 테이블, Kimi K2.5 Table 4, GLM-5 Table 7 완전 추출
- [x] Phase 6: GPT-5.4 Thinking, EXAONE 4.5, Solar Open, A.X K1, Mi:dm K 2.5 Pro, ERNIE 5.0, Qwen 3.6-Plus 분석
- [x] Phase 7: Claude Opus 4.7 System Card 완전 분석 (40+ 벤치마크)
- [x] Phase 8: 전체 PDF 커버리지 리뷰 및 누락 보충
- [x] Phase 9 (2026-04-18): `/design-review` — 18 findings → 16 atomic 수정 커밋 (Design Score C- → B-)
- [x] GitHub Pages 배포: https://hollobit.github.io/SOTA/

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

### cc:TODO — 데이터 수집 자동화
- [ ] `cyber scouts discover` 명령으로 새 벤치마크/모델 자동 감지
- [ ] `cyber scouts collect` 명령으로 정기 데이터 수집
- [ ] GitHub Actions 주간 자동 수집 파이프라인 활성화

### cc:TODO — 대시보드 개선
- [ ] Cyber & Coding 탭에 방어 벤치마크 바 차트 추가
- [ ] 벤치마크 카테고리 필터 (multimodal, math, long-context 등) 추가
- [ ] 모델 간 head-to-head 비교 레이더 차트 개선
- [ ] PDF 소스 출처 표시 기능 (System Card 링크)

### cc:TODO — 추가 데이터 소스
- [ ] Grok-4.20 벤치마크 점수 수집 (xAI system card 발표 대기)
- [ ] GPT-5.4 전체 System Card 분석 (발표 대기)
- [ ] Gemini 3.1 Pro 전체 평가 데이터 수집
- [ ] 방어 벤치마크 점수 보충 (AutoPatchBench, CyberSOCEval 구체적 모델별 점수)

### cc:TODO — 분석 기능
- [ ] 벤치마크 간 상관관계 분석 (공격 능력 ↔ 방어 능력 ↔ 코딩 능력)
- [ ] 시간별 SOTA 변화 추적 (트렌드 차트 데이터)
- [ ] 모델 성능/비용 효율성 분석 (Artificial Analysis 데이터 연동)

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
