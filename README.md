# SOTA
LLM benchmark &amp; SOTA
<!-- BADGES:START -->
![Total enrichment](https://img.shields.io/badge/enrichment-631%20models-blue) ![Manual curation](https://img.shields.io/badge/manual%20frontier-127-green)
<!-- BADGES:END -->

## Development setup

```bash
# Install Python dependencies
pip install -e '.[dev]'

# Install pre-commit hooks (first-time setup only)
pip install pre-commit
pre-commit install

# Run all tests
make test

# Validate enrichment YAML against schema
python3 scripts/validate_enrichment.py

# Refresh enrichment coverage badge
python3 scripts/update_coverage_badge.py
```

## Adding a new model

1. Cite a primary source URL where the model name + benchmark name + value all appear together
2. Add scores to `resource/zzz_<your_topic>_2026_MM_DD_scores.json`
3. (Frontier-30 only) Add enrichment to `config/model_enrichment.yaml`
4. Run `make load && make export`
5. Verify dashboard at localhost: `cd dashboard && python3 -m http.server 8765`
6. Open PR — the new-model checklist will guide you

## Project structure

- `cyber/` — Python pipeline (loader, exporter, schema)
- `scripts/` — Build-time scripts (HF fetch, enrichment auto-extract, badge)
- `config/` — YAML configs (seed sources, model enrichment, schema)
- `dashboard/` — Static dashboard (HTML + JS + ECharts) deployed to GitHub Pages
- `resource/` — Seed JSON files (model + benchmark + score data)
- `data/export/` — Build artifacts consumed by the dashboard
- `tests/` — pytest unit tests (Python)
- `dashboard/js/__tests__/` — vanilla node assert tests (JavaScript)
- `dashboard/tests/` — Playwright E2E tests

