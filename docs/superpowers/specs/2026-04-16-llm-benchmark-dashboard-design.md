# LLM Benchmark SOTA Dashboard — Design Spec

## Overview

다양한 소스로부터 주요 LLM/Foundation Model의 벤치마크 성능 평가 결과를 자동 수집, 분석, 정규화하여 최신 SOTA 값을 추적하는 인터랙티브 대시보드 시스템.

## Goals

1. **포괄적 수집**: 벤더 공식 자료(model card, system card), 학술 논문(arXiv), 독립 평가(CAISI), 주요 리더보드, 홈페이지 정보 등 가능한 모든 소스에서 벤치마크 데이터를 취합
2. **자동 SOTA 추적**: 벤치마크별 최고 성능(SOTA) 변동을 자동 감지하고 이력 관리
3. **인터랙티브 대시보드**: GitHub Pages에 호스팅되는 정적 HTML이지만 필터링/정렬/비교가 가능한 대시보드
4. **주기적 업데이트**: 스케줄 기반(daily cron) + 이벤트 기반(새 모델 출시 감지) 혼합 업데이트
5. **멀티 에이전트**: 역할별 전문화된 에이전트 팀이 수집/분석/발행을 병렬로 처리

## Non-Goals

- 자체 벤치마크 실행 (기존 결과를 수집만 함)
- 사용자 인증/로그인
- 서버 사이드 API

---

## Architecture: Role-Based Agent Team

```
┌─────────────────────────────────────────────────┐
│  Orchestrator (Claude Code / GitHub Actions)    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Scout Team (Python, 병렬)                      │
│  ├─ vendor-scout: 벤더 공식 소스 크롤링          │
│  ├─ paper-scout: arXiv/학술 논문 수집            │
│  ├─ leaderboard-scout: 리더보드 스크래핑          │
│  ├─ safety-scout: CAISI/안전성 평가 수집         │
│  └─ release-scout: 새 모델 출시 감지             │
│                                                 │
│  Analyst (Claude API)                           │
│  ├─ 데이터 검증, 정규화, 중복 제거               │
│  ├─ SOTA 변동 감지, 트렌드 분석                  │
│  └─ 새 모델/벤치마크 자동 발견                    │
│                                                 │
│  Publisher (Python + 정적 빌드)                  │
│  ├─ SQLite → JSON export                        │
│  ├─ 대시보드 HTML 빌드                           │
│  └─ GitHub Pages 배포, 변동 알림                 │
└─────────────────────────────────────────────────┘
```

---

## Data Model

### Core Entities

```
Model
├── id: string (정규화된 고유 식별자, e.g. "openai/gpt-4o-2025-01")
├── vendor: string
├── name: string
├── version: string
├── type: "proprietary" | "open-weight" | "open-source"
├── modalities: list["text", "vision", "audio", "video"]
└── meta: { parameters, release_date, ... }

Benchmark
├── id: string (e.g. "mmlu", "humaneval-pass1")
├── name: string
├── category: "reasoning" | "coding" | "safety" | "multimodal" | "agent" | ...
├── description: string
└── metric: "accuracy" | "pass@1" | "elo" | "score" | ...

Score
├── model_id → Model
├── benchmark_id → Benchmark
├── value: float
├── unit: string
├── source: { type: "vendor"|"paper"|"leaderboard"|"safety"|"release", url, date, citation }
├── is_sota: boolean
├── collected_at: date
└── notes: string (e.g. "5-shot, CoT prompting")

LeaderboardRanking
├── leaderboard: string (e.g. "chatbot-arena")
├── model_id → Model
├── rank: int
├── score: float
├── metric: string (e.g. "elo")
├── snapshot_date: date
└── source_url: string
```

### Storage Structure

```
data/
├── models.json              # 모델 레지스트리
├── benchmarks.json          # 벤치마크 정의
├── sota.json                # 벤치마크별 SOTA 요약
├── scores/
│   ├── current.json         # 최신 전체 점수 (대시보드용)
│   └── history/
│       └── YYYY-MM-DD.json  # 일별 스냅샷
├── leaderboards/
│   ├── chatbot-arena.json
│   ├── open-llm.json
│   ├── seal.json
│   └── ...
├── reports/
│   ├── changelog.json       # SOTA 변동 이력
│   └── weekly/              # 주간 다이제스트
└── sources/
    └── raw/                 # Scout 원본 (.gitignore)
```

- **SQLite** (`data/benchmark.db`) — Scout/Analyst 작업용. 쿼리/중복감지/이력관리. `.gitignore` 대상
- **JSON** — 대시보드가 fetch하는 정적 파일. SQLite에서 export. git tracked
- **Raw files** — Scout 원본. 출처 추적 및 재처리용. `.gitignore` 대상

---

## Scout Team (Phase 1: Data Collection)

### Common Interface

```python
class BaseScout:
    def discover() → list[RawRecord]
    def parse(raw) → list[ScoreEntry]
    def save(entries) → None
```

### Scout Specifications

| Scout | Sources | Collection Method |
|-------|---------|-------------------|
| **vendor-scout** | OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek 등 공식 페이지/블로그 | HTTP + HTML 파싱 (BeautifulSoup). model card, system card, 블로그 포스트에서 표/수치 추출 |
| **paper-scout** | arXiv | arXiv API. 키워드 검색 → PDF 벤치마크 테이블 추출 (정규식 + LLM 보조) |
| **leaderboard-scout** | Chatbot Arena, Open LLM Leaderboard, SEAL, Artificial Analysis, LiveBench, BigCode, OpenCompass, AlpacaEval, WildBench, Aider Polyglot | API 또는 HTML 스크래핑. 리더보드별 전용 파서 모듈 |
| **safety-scout** | CAISI, TrustLLM, DecodingTrust | HTML 스크래핑 + PDF 파싱. 비정형 보고서는 LLM 보조 |
| **release-scout** | GitHub Releases, HuggingFace Model Hub | GitHub API, HF API. 새 모델 출시 감지 → 이벤트 트리거 |

### Extension Pattern

새 Scout 추가 시: `BaseScout` 상속 → `discover()`, `parse()` 구현 → `config/scouts.yaml`에 등록.

```yaml
# config/scouts.yaml
scouts:
  - name: vendor-scout
    module: scouts.vendor
    schedule: "daily"
    enabled: true
```

---

## Analyst (Phase 2: Analysis)

### Functions

#### Validate & Normalize
- 모델 이름 통일 (매핑 테이블 → 미등록 시 Claude API 엔티티 해소)
- 벤치마크 매핑 (동일 벤치마크 다른 표기 통일)
- 수치 검증 (이전 값 대비 비정상 편차 감지)
- 중복 제거 (같은 모델+벤치마크+조건의 중복 소스 병합)
- 조건 정규화 ("5-shot CoT" 등 통일 표현)

#### SOTA Tracker
- 벤치마크별 최고 점수 재계산
- 변동 감지: NEW_SOTA, NEW_MODEL, NEW_BENCHMARK, ANOMALY
- 변동 내역 changelog 기록

#### Trend Digest
- 주간/월간 SOTA 변동 요약
- 카테고리별 진전 상황
- `data/reports/weekly/` 출력

### Cost Control
- 배치 처리: 관련 레코드를 묶어서 한 번에 Claude API 호출
- 캐시: 정규화된 매핑을 `config/models-alias.yaml`에 축적
- LLM 최소 호출: 룰 기반 우선 처리, 불확실한 것만 Claude API

---

## Publisher (Phase 3: Build & Deploy)

### Dashboard Tabs

| Tab | Content |
|-----|---------|
| **Overview** | SOTA 리더보드, 주요 리더보드 순위 카드, 최근 변동 타임라인, 통계 |
| **Leaderboard** | 카테고리/모델타입/소스별 필터, 정렬, 모델 상세 클릭, 크로스 리더보드 비교 |
| **Trends** | 벤치마크별 SOTA 시계열, 모델 간 레이더 차트, 카테고리별 히트맵, 기간 필터 |
| **Explorer** | 모델 vs 모델 비교, 벤치마크 검색, 출처 링크, 모델별 리더보드 순위 |
| **Changelog** | SOTA 변동 이력, 등록 이력, Weekly Digest 아카이브 |

### Tech Stack

- **HTML/CSS/JS** — 단일 페이지 정적 사이트
- **ECharts** — 차트 (리더보드, 시계열, 레이더, 히트맵)
- **Tailwind CSS** (CDN) — 스타일링
- **Vanilla JS** — 프레임워크 없이 경량 유지
- 데이터는 런타임에 `fetch()`로 JSON 로드

### Deploy

- `gh-pages` 브랜치에 `dashboard/` + `data/*.json` push
- SOTA 변동 시 GitHub Issue 자동 생성

---

## Orchestration & CI/CD

### GitHub Actions Workflows

```yaml
# .github/workflows/benchmark-update.yml — 메인 파이프라인
on:
  schedule:
    - cron: "0 6 * * *"      # 매일 06:00 UTC
  workflow_dispatch:           # 수동 실행
  repository_dispatch:         # 이벤트 트리거
    types: [new-model-detected]

jobs:
  scout → analyst → publish (순차)

# .github/workflows/event-monitor.yml — 이벤트 감시
on:
  schedule:
    - cron: "0 */6 * * *"    # 6시간마다
jobs:
  release-scout만 경량 실행 → 새 모델 감지 시 repository_dispatch

# .github/workflows/manual-scout.yml — 특정 Scout 수동 실행
on:
  workflow_dispatch:
    inputs:
      scout_name: ...
```

### Error Handling

- **Scout 실패**: 개별 실패 시 해당 소스만 건너뜀. 3회 재시도 후 실패 시 Issue 생성
- **Analyst 실패**: Claude API 에러 시 exponential backoff 재시도. 비용 상한 초과 시 중단 + Issue
- **Publish 실패**: 이전 버전 유지, 재시도

### Cost Guardrails

```yaml
# config/limits.yaml
cost_limits:
  claude_api:
    daily_max_usd: 5.00
    per_run_max_usd: 2.00
    max_tokens_per_batch: 50000
  github_actions:
    max_runtime_minutes: 30
  alerts:
    warn_at_percent: 80
```

---

## Project Structure

```
cyber/
├── .github/workflows/           # CI/CD
│   ├── benchmark-update.yml
│   ├── event-monitor.yml
│   └── manual-scout.yml
├── config/                      # 설정
│   ├── scouts.yaml
│   ├── limits.yaml
│   ├── models-alias.yaml
│   └── benchmarks-meta.yaml
├── scouts/                      # Phase 1
│   ├── base.py
│   ├── vendor/
│   ├── paper/
│   ├── leaderboard/
│   ├── safety/
│   └── release/
├── analyst/                     # Phase 2
│   ├── normalizer.py
│   ├── validator.py
│   ├── sota_tracker.py
│   ├── trend_digest.py
│   └── entity_resolver.py
├── publisher/                   # Phase 3
│   ├── exporter.py
│   ├── builder.py
│   └── notifier.py
├── dashboard/                   # 정적 대시보드
│   ├── index.html
│   ├── css/style.css
│   └── js/{app,charts,filters,explorer}.js
├── data/                        # 데이터
├── tests/                       # 테스트
├── __main__.py                  # CLI 진입점 (python -m cyber)
├── pyproject.toml
└── requirements.txt
```

### Dependencies

```
httpx, beautifulsoup4, lxml, arxiv, anthropic,
pyyaml, click, rich, pdfplumber
```

---

## CLI

```bash
python -m cyber run --all            # 전체 파이프라인
python -m cyber scout --name <name>  # 특정 Scout 실행
python -m cyber analyze              # Analyst만 실행
python -m cyber export               # SQLite → JSON
python -m cyber serve                # 대시보드 로컬 프리뷰
```

---

## Tracked Leaderboards

| Leaderboard | Operator | Key Metric |
|-------------|----------|------------|
| Chatbot Arena | LMSYS / UC Berkeley | ELO |
| Open LLM Leaderboard | HuggingFace | 종합점수 |
| SEAL | Scale AI | 전문가 평가 |
| Artificial Analysis | Artificial Analysis | 성능+가격+속도 |
| LiveBench | Community | 라이브 벤치마크 |
| BigCode Leaderboard | HuggingFace | 코딩 점수 |
| OpenCompass | 상하이AI연구소 | 종합점수 |
| AlpacaEval | Stanford | 승률 |
| WildBench | AI2 | 실사용 질의 평가 |
| Aider Polyglot | Aider | 코딩 에이전트 성능 |

---

## Benchmark Categories

| Category | Examples |
|----------|----------|
| Reasoning | MMLU, GPQA, ARC, HellaSwag, BBH |
| Math | MATH, GSM8K, AIME |
| Coding | HumanEval, MBPP, LiveCodeBench, SWE-bench |
| Multimodal | MMMU, MathVista, DocVQA |
| Safety | TruthfulQA, BBQ, CAISI, DecodingTrust |
| Agent | SWE-bench, WebArena, GAIA |
| Instruction Following | IFEval, AlpacaEval, MT-Bench |
