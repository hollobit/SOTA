"""Parser for HTML pages containing benchmark data in <table> elements."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional, Set

from cyber.parsers.base import BaseParser

# Headers that should NOT be treated as benchmark columns.
_SKIP_HEADERS: Set[str] = {
    "rank", "#", "type", "license", "org", "organization",
    "params", "size", "date", "link", "source", "votes", "provider",
}


def _is_model_header(text: str) -> bool:
    """Return True if *text* looks like a model-name column header."""
    lower = text.strip().lower()
    return lower in ("model", "name", "model name", "model_name")


def _extract_number(text: str) -> Optional[float]:
    """Try to pull the first decimal / integer number from *text*."""
    m = re.search(r"[-+]?\d+(?:\.\d+)?", text.strip())
    if m:
        return float(m.group())
    return None


class HtmlTableParser(BaseParser):
    """Extract benchmark scores from the first <table> that has a model column."""

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        try:
            from bs4 import BeautifulSoup  # type: ignore[import-untyped]
        except ImportError:
            return []

        soup = BeautifulSoup(content, "html.parser")
        tables = soup.find_all("table")
        if not tables:
            return []

        for table in tables:
            results = self._try_table(table)
            if results:
                return results
        return []

    # ------------------------------------------------------------------

    def _try_table(self, table: Any) -> List[Dict[str, Any]]:
        """Attempt to parse a single <table> element."""
        headers_raw: List[str] = []
        header_row = table.find("tr")
        if header_row is None:
            return []

        for cell in header_row.find_all(["th", "td"]):
            headers_raw.append(cell.get_text(strip=True))

        if not headers_raw:
            return []

        # Identify model column index
        model_idx: Optional[int] = None
        for i, h in enumerate(headers_raw):
            if _is_model_header(h):
                model_idx = i
                break
        if model_idx is None:
            return []

        # Identify benchmark columns (skip non-benchmark ones)
        bench_cols: List[tuple] = []  # (index, benchmark_name)
        for i, h in enumerate(headers_raw):
            if i == model_idx:
                continue
            if h.strip().lower() in _SKIP_HEADERS:
                continue
            bench_cols.append((i, h.strip()))

        if not bench_cols:
            return []

        # Parse data rows
        results: List[Dict[str, Any]] = []
        rows = table.find_all("tr")[1:]  # skip header row
        for row in rows:
            cells = row.find_all(["td", "th"])
            if len(cells) <= model_idx:
                continue
            model_name = cells[model_idx].get_text(strip=True)
            if not model_name:
                continue
            for col_idx, bench_name in bench_cols:
                if col_idx >= len(cells):
                    continue
                value = _extract_number(cells[col_idx].get_text(strip=True))
                if value is not None:
                    results.append({
                        "model_id": model_name,
                        "benchmark_id": bench_name.lower(),
                        "value": value,
                        "unit": "%",
                    })
        return results
