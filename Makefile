.PHONY: help test test-py test-js test-e2e export load lint badge coverage changelog clean

help:
	@echo "Common targets:"
	@echo "  test         Run all tests (python + node)"
	@echo "  test-py      pytest"
	@echo "  test-js      node assert tests"
	@echo "  test-e2e     Playwright E2E"
	@echo "  load         Reload DB from seed files"
	@echo "  export       Export JSON sidecars to data/export/"
	@echo "  badge        Refresh README enrichment badge"
	@echo "  lint         Run ruff over python files"
	@echo "  coverage     Print enrichment coverage stats"
	@echo "  changelog    Generate CHANGELOG.md from git log"
	@echo "  clean        Remove __pycache__"

test: test-py test-js

test-py:
	PYTHONPATH=. pytest tests/ -v

test-js:
	node dashboard/js/__tests__/peer-matcher.test.js

test-e2e:
	cd dashboard && python3 -m pytest tests/test_modal_e2e.py -v

load:
	python3 scripts/load_benchmark_scores.py

export:
	PYTHONPATH=. python3 -m cyber export
	python3 scripts/build_graphrag.py

badge:
	python3 scripts/update_coverage_badge.py

lint:
	ruff check cyber/ scripts/ tests/

coverage:
	@python3 -c "import json; d=json.load(open('data/export/model_enrichment.json')); print(f'Total enrichment: {d[\"_meta\"][\"covered_models\"]} models'); print(f'Schema version: {d[\"_meta\"][\"schema_version\"]}')"

changelog:
	python3 scripts/generate_changelog.py

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name '*.pyc' -delete 2>/dev/null || true
