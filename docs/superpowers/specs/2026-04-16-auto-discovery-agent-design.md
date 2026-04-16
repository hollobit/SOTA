# Auto-Discovery Benchmark Agent — Design Spec

## Overview

기존 LLM Benchmark SOTA Dashboard에 자동 소스 발견/수집/관리 에이전트 시스템을 추가한다. 3개의 전문 에이전트(Discovery, Collector, Librarian)가 소스 레지스트리를 중심으로 협업하며, 웹 검색과 링크 확장으로 새 벤치마크 소스를 자동 발견하고, 적응형 주기로 데이터를 수집하며, 신뢰도 기반으로 소스 품질을 관리한다.

## Goals

1. **완전 자동 소스 발견**: 웹 검색 + 시드 링크 확장으로 새 벤치마크 사이트/리더보드/논문을 사람 개입 없이 발견
2. **2계층 하이브리드 파싱**: 정규 파서(비용 $0)를 우선 사용하고, 비정형 소스만 Claude API로 처리하여 비용 최적화
3. **적응형 주기**: 소스별 변동 빈도를 학습하여 크롤링 주기 자동 최적화 + 컨퍼런스/신모델 이벤트 시 자동 강화
4. **신뢰도 관리**: 소스 품질을 자동 평가하고, 교차 검증으로 데이터 정확성 보장
5. **기존 호환**: 현재 Scout 프레임워크를 깨지 않고 점진적으로 통합

## Non-Goals

- 벤치마크를 직접 실행하는 것 (기존 결과 수집만)
- 유료 API 키가 필요한 소스 접근 (공개 데이터만)
- 실시간 스트리밍 (배치 기반 주기적 수집)

---

## Architecture: Role-Based Agent Team

```
┌───────────────────────────────────────────────────────┐
│  Scheduler (오케스트레이터)                             │
│  ├─ 적응형 주기 관리, 이벤트 감지, 에이전트 디스패치     │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Discovery    │  │ Collector    │  │ Librarian    │ │
│  │ Agent        │  │ Agent        │  │ Agent        │ │
│  │              │  │              │  │              │ │
│  │ 웹 검색      │  │ 등록된 소스   │  │ 레지스트리    │ │
│  │ 시드 확장    │  │ 순회/크롤링   │  │ 건강 관리    │ │
│  │ 새 소스 발견  │  │ 2계층 파싱   │  │ 신뢰도 관리  │ │
│  │ 후보 → 등록  │  │ Score 적재   │  │ 적응형 주기  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                │                │           │
│         └────────┬───────┘                │           │
│                  ▼                        │           │
│         ┌──────────────┐                  │           │
│         │ Source        │◀────────────────┘           │
│         │ Registry     │                              │
│         │ (sources DB) │                              │
│         └──────────────┘                              │
└───────────────────────────────────────────────────────┘
```

---

## Source Registry

### Data Model

```
SourceEntry
├── id: string (UUID)
├── url: string
├── name: string
├── type: "leaderboard" | "vendor_page" | "paper" | "blog" | "dataset_hub" | "evaluation_report"
├── format: "html_table" | "json_api" | "pdf" | "markdown" | "csv"
├── trust_score: float (0.0 ~ 1.0)
├── status: "active" | "candidate" | "dead" | "paused"
├── discovered_by: "seed" | "link_expansion" | "web_search"
├── discovered_at: date
├── last_crawled_at: date | null
├── last_changed_at: date | null
├── crawl_count: int
├── change_count: int
├── fail_count: int
├── crawl_interval_hours: int
├── benchmarks: list[string]
├── models_count: int
└── notes: string
```

### Adaptive Schedule

```
change_rate = change_count / crawl_count

change_rate > 0.5:    interval = 6h    (very active: leaderboards)
change_rate > 0.2:    interval = 24h   (moderate: vendor blogs)
change_rate > 0.05:   interval = 72h   (slow: evaluation reports)
change_rate <= 0.05:  interval = 168h  (static: papers)

Event boost:
  Conference season (NeurIPS Dec, ICML Jul, ICLR May, ACL Jul):
    All sources interval * 0.5 for 2 weeks
  New model release detected:
    All sources interval * 0.5 for 48 hours
  Specific source sudden change:
    That source interval * 0.25 for 72 hours
```

### Trust Score

```
Initial:
  seed: 0.9, link_expansion: 0.6, web_search: 0.4

Adjustments:
  + data consistency validation passed:     +0.10
  + cross-validation match with other src:  +0.10
  + known high-trust domain:                +0.10
  + first to report SOTA change:            +0.05
  + 10+ consecutive crawl successes:        +0.05
  - parse failure rate > 50%:               -0.15
  - anomaly rate > 30%:                     -0.15
  - 3+ consecutive failures:               -0.20
  - cross-validation mismatch:             -0.10

trust_score < 0.3 → status = "paused"
```

### Seed Sources (config/seed_sources.yaml)

12 initial sources across leaderboards (Chatbot Arena, Open LLM, SEAL, Artificial Analysis, LiveBench, LLM Stats, MathArena), vendor pages (Anthropic, OpenAI, Google AI), academic (arXiv), and evaluation (Epoch AI Benchmarks).

---

## Discovery Agent

### Two Strategies

**Link Expansion:** Crawl existing registered source pages → extract outbound links → filter for benchmark-related URLs → classify → register as candidate (trust 0.6).

**Active Search:** Auto-generate search queries from BMT catalog benchmark names, model names, and event keywords → WebSearch → filter duplicates → visit and classify → register as candidate (trust 0.4).

### Two-Tier Source Classifier

**Tier 1 (rule-based, cost $0):** URL domain matching (arxiv→paper, huggingface→dataset_hub, etc.) + path pattern matching (/leaderboard, /benchmark, /model-card).

**Tier 2 (Claude API, ambiguous only):** Page content analysis prompt returning JSON with: has_benchmark_data, source_type, format, benchmarks, models.

### Schedule

Base: 2x/week (Wed, Sat). Conference season: 4x/week. New model detected: +1 immediate run. Max 20 search queries + 30 LLM calls per run. ~$0.50/run.

---

## Collector Agent

### Two-Tier Parsing Pipeline

**Tier 1 (regular parsers, cost $0):**
- JsonApiParser: HTTP GET + JSON decode (HF Leaderboard, Arena API)
- HtmlTableParser: BeautifulSoup `<table>` extraction + regex
- CsvParser: csv.DictReader
- MarkdownParser: regex patterns (reuses resource scanner logic)

**Tier 2 (LLM parsers, cost per call):**
- PdfLlmParser: pdfplumber text extraction + Claude interpretation
- HtmlLlmParser: page text + Claude table extraction prompt
- Tier 1 failure auto-fallback to Tier 2

### Change Detection (Diff Engine)

Compare collected scores against DB existing scores:
- NEW_SCORE: new (model_id, benchmark_id) → INSERT
- UPDATED: same pair, value changed → UPDATE + changelog
- UNCHANGED: identical → skip
- DISAPPEARED: was present, now missing → flag only (no delete)

### Parallel Strategy

Group A (trust >= 0.8): max 10 parallel. Group B (0.5~0.8): max 5 parallel. Group C (<0.5, candidate): max 3 parallel, Tier 2 disabled.

Total concurrent HTTP: max 18. Per-source timeout: 30s. Total run timeout: 15min. Max 20 Tier 2 LLM calls per run. ~$0.30/run.

---

## Librarian Agent

### Four Functions

**Adaptive Scheduling:** Recalculate crawl_interval_hours after every Collector run based on observed change_rate. Apply event boosts from events_calendar.yaml.

**Trust Recalculation:** Weekly recalculation considering success rate, cross-validation results, domain reputation, SOTA reporting track record, parse failures, and anomaly rates.

**Health Check (weekly):**
- active + fail_count >= 5 → dead
- active + trust < 0.3 → paused
- candidate + first success → active
- candidate + 14 days + 0 success → dead
- dead + 30 days elapsed → 1 retry, success → candidate
- DISAPPEARED 3x consecutive → trigger format reclassification

**Cross-Validation (weekly):** For (model_id, benchmark_id) reported by multiple sources, compute median. Sources deviating >15% from median get trust penalty of -0.10.

### Output: Weekly Health Report

```json
{
  "total_sources": 85,
  "by_status": {"active": 62, "candidate": 15, "paused": 5, "dead": 3},
  "trust_changes": [...],
  "schedule_changes": [...],
  "status_changes": [...],
  "cross_validation_anomalies": 2
}
```

---

## Scheduler (Orchestrator)

### Execution Flow

1. Query sources WHERE status='active' AND due for crawl → sorted by trust DESC
2. Dispatch Collector Agent with source list
3. Librarian adaptive schedule update (post-collection)
4. Existing Analyst pipeline (normalize, validate, SOTA)
5. Publisher (export JSON, deploy gh-pages)

Separately scheduled: Discovery (2x/week), Librarian weekly review (Sundays).

### GitHub Actions Workflows (3 new)

- `discovery.yml`: cron Wed+Sat 03:00 UTC + repository_dispatch
- `librarian-weekly.yml`: cron Sunday 02:00 UTC
- `librarian-boost.yml`: repository_dispatch for conference season start/end

---

## Project Structure (new/changed files)

```
cyber/
├─ agents/                   (NEW)
│   ├─ __init__.py
│   ├─ discovery.py          # Discovery Agent
│   ├─ collector.py          # Collector Agent
│   ├─ librarian.py          # Librarian Agent
│   └─ scheduler.py          # Scheduler
├─ parsers/                  (NEW)
│   ├─ __init__.py
│   ├─ base.py               # BaseParser ABC
│   ├─ json_api.py
│   ├─ html_table.py
│   ├─ csv_parser.py
│   ├─ markdown_parser.py
│   └─ llm_parser.py
├─ db/schema.py              (MODIFY: add sources table)
├─ config/
│   ├─ seed_sources.yaml     (NEW)
│   └─ events_calendar.yaml  (NEW)
├─ scouts/                   (UNCHANGED, backward compatible)
└─ __main__.py               (MODIFY: add discover/collect/librarian/sources commands)
```

### Backward Compatibility

Existing Scout framework (BaseScout, run_scouts, open_llm, chatbot_arena) remains unchanged. New Agent framework adds a registry-based collection path alongside it. Existing `python -m cyber scout` continues to work. Gradual migration: register existing scout sources in registry over time.

---

## CLI Extensions

```bash
python -m cyber discover                     # Discovery Agent run
python -m cyber discover --strategy search   # Active search only
python -m cyber discover --strategy expand   # Link expansion only
python -m cyber collect                      # Collector: scheduled sources
python -m cyber collect --all                # Collector: all active sources
python -m cyber collect --source <name>      # Collector: specific source
python -m cyber librarian                    # Full weekly review
python -m cyber librarian --health           # Health check only
python -m cyber librarian --trust            # Trust recalc only
python -m cyber sources                      # Registry status table
python -m cyber sources --status active      # Filter by status
python -m cyber sources --add <url>          # Manual add (seed, trust 0.9)
python -m cyber sources --remove <name>      # Remove source
```

---

## Cost Estimate

```
Normal week:
  Collector (daily): ~$0.30/day × 7 = ~$2.10/week
  Discovery (2x/week): ~$0.50 × 2 = ~$1.00/week
  Librarian (weekly): ~$0.20/week
  Total: ~$3.30/week ≈ $14/month

Conference season (1-2x/month, 2 weeks each):
  +$5/week × 2 weeks = +$10/event
  Monthly max: ~$24/month
```
