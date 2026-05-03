"""E2E: model modal renders all enhanced sections for a frontier model."""
from __future__ import annotations

import subprocess
import time
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright


HOST = "http://localhost:8765"


@pytest.fixture(scope="module")
def server():
    proc = subprocess.Popen(
        ["python3", "-m", "http.server", "8765"],
        cwd=str(Path(__file__).parent.parent),
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.0)
    yield
    proc.terminate()
    proc.wait(timeout=5)


def test_modal_shows_all_sections_for_frontier_model(server):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(HOST + "/index.html")
        page.wait_for_selector("text=Leaderboard", timeout=5000)

        page.click("text=EXAONE 4.5 33B", timeout=10000)
        page.wait_for_selector("#modal-content", timeout=3000)

        assert page.locator("text=Context Window").count() == 1
        assert page.locator("text=262,144 tokens").count() == 1
        assert page.locator("text=Knowledge Cutoff").count() == 1
        assert page.locator("text=Languages").count() == 1

        assert page.locator("text=Peer Comparison").count() == 1
        assert page.locator("text=Avg d").count() == 1

        assert page.locator("text=Strengths").count() >= 1

        page.wait_for_selector("text=Architecture / Training / Safety", timeout=3000)
        assert page.locator("text=DENSE").count() >= 1

        badges = page.locator("span[title*='SOTA'], span[title*='Top 3'], span[title*='Top 10']").count()
        assert badges >= 1, "expected at least one SOTA/Top-3/Top-10 inline badge"

        browser.close()


def test_modal_handles_unenriched_model_gracefully(server):
    """Models without enrichment must NOT show the architecture card."""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(HOST + "/index.html")
        page.wait_for_selector("text=Leaderboard", timeout=5000)

        page.click("text=EXAONE 3.0 7.8B", timeout=10000)
        page.wait_for_selector("#modal-content", timeout=3000)
        time.sleep(0.5)

        assert page.locator("text=Architecture / Training / Safety").count() == 0
        assert page.locator("#modal-title").count() == 1
        browser.close()
