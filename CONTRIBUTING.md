# Contributing

## Adding new models / benchmarks / scores

Score files live in `resource/` with naming convention:

    resource/<prefix>_<topic>_<YYYY_MM_DD>_scores.json

**File name rules** (enforced by `scripts/load_benchmark_scores.py` glob patterns):

- Must end with `_scores.json`
- Must NOT contain `_scores_` mid-string (e.g. avoid `_my_scores_2026_05_08_scores.json`)
- The 2-pass loader (since 2026-05-08) makes file ordering irrelevant for FK
  constraints, but keep the convention to avoid future surprises.

## Strict-attribution rule

Every score row must have:

- `model_id` + `benchmark_id` + value visible in a cited primary source
  (vendor blog, tech report, leaderboard JSON)
- Anonymized model labels (e.g. AISI joint-testing "Model A") are rejected
- Aggregator sites (llm-stats.com, BenchLM) are acceptable when they cite an
  upstream primary source AND the value matches that source

## File schema

JSON shape:

```json
{
  "_meta": {
    "collected_at": "YYYY-MM-DD",
    "_note": "...",
    "sources": ["url1", "..."]
  },
  "models": [
    {
      "id": "vendor/model",
      "vendor": "...",
      "name": "...",
      "type": "proprietary|open-weight",
      "modalities": ["text"],
      "release_date": "YYYY-MM-DD",
      "_source": "url"
    }
  ],
  "benchmarks": [
    { "id": "snake_case_id", "name": "Display Name", "_source": "url", "_note": "..." }
  ],
  "scores": [
    {
      "model": "vendor/id",
      "benchmark": "id",
      "score": 87.6,
      "unit": "%",
      "_source": "url",
      "collected_at": "YYYY-MM-DD",
      "_note": "..."
    }
  ]
}
```

## Loading & verification

After authoring a new score file:

1. `python3 -c "import json; json.load(open('resource/<file>'))"`
2. `python scripts/load_benchmark_scores.py`
3. `python -m cyber export`
4. `python scripts/audit_version_date_consistency.py`  # expect "Contradictions found: 0"
5. `git add resource/<file> data/export/...`
6. `git commit -m "data: <one-line summary>"`
