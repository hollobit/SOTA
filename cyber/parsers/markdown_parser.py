"""Parser for Markdown tables containing benchmark data."""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from cyber.parsers.base import BaseParser


def _extract_number(text: str) -> Optional[float]:
    m = re.search(r"[-+]?\d+(?:\.\d+)?", text.strip())
    if m:
        return float(m.group())
    return None


class MarkdownParser(BaseParser):
    """Parse pipe-delimited Markdown tables.

    Assumes first column is the model name and remaining columns are benchmarks.
    """

    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        lines = content.splitlines()

        # Find table lines (contain |)
        table_lines = [l for l in lines if "|" in l]
        if len(table_lines) < 3:  # header + separator + at least 1 data row
            return []

        # Detect header + separator
        header_line: Optional[str] = None
        data_start: int = 0
        for i, line in enumerate(table_lines):
            # separator line looks like |---|---|
            if re.match(r"^\s*\|?\s*[-:]+\s*\|", line):
                if i > 0:
                    header_line = table_lines[i - 1]
                    data_start = i + 1
                break

        if header_line is None:
            return []

        headers = [c.strip() for c in header_line.split("|") if c.strip()]
        if len(headers) < 2:
            return []

        # First column = model, rest = benchmarks
        bench_names = headers[1:]

        results: List[Dict[str, Any]] = []
        for line in table_lines[data_start:]:
            cells = [c.strip() for c in line.split("|") if c.strip()]
            if not cells:
                continue
            model_name = cells[0]
            for j, bench in enumerate(bench_names):
                if j + 1 >= len(cells):
                    continue
                value = _extract_number(cells[j + 1])
                if value is not None:
                    results.append({
                        "model_id": model_name,
                        "benchmark_id": bench.lower(),
                        "value": value,
                        "unit": "%",
                    })
        return results
