"""Resource folder scout — extracts benchmark data from local files (PDF, MD, JSON, CSV, TXT)."""

from __future__ import annotations

import csv
import io
import json
import re
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

from cyber.models.types import RawRecord, Score, Source
from cyber.scouts.base import BaseScout

# Supported file extensions
SUPPORTED_EXTENSIONS = {".pdf", ".md", ".txt", ".json", ".csv"}


class ResourceScout(BaseScout):
    """Scout that reads local files from a resource directory and extracts benchmark scores."""

    name = "resource-scout"

    def __init__(self, resource_dir: str = "resource"):
        self._dir = Path(resource_dir)

    # ------------------------------------------------------------------
    # discover
    # ------------------------------------------------------------------

    async def discover(self) -> List[RawRecord]:
        if not self._dir.exists():
            return []

        processed = self._load_processed()
        records: List[RawRecord] = []
        today = date.today()

        for path in sorted(self._dir.iterdir()):
            if path.name.startswith("."):
                continue
            if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
                continue
            if path.name in processed:
                continue

            file_type = path.suffix.lstrip(".").lower()
            raw_data: Dict[str, Any] = {
                "filename": path.name,
                "file_type": file_type,
            }

            if file_type == "pdf":
                raw_data["content"] = self._read_pdf(path)
            else:
                raw_data["content"] = path.read_text(errors="replace")

            records.append(RawRecord(
                scout_name=self.name,
                source_url=str(path),
                raw_data=raw_data,
                collected_at=today,
            ))

        return records

    # ------------------------------------------------------------------
    # parse
    # ------------------------------------------------------------------

    def parse(self, raw: RawRecord) -> List[Score]:
        file_type = raw.raw_data.get("file_type", "")
        content = raw.raw_data.get("content", "")
        filename = raw.raw_data.get("filename", "")

        if file_type == "json":
            return self._parse_json(content, raw)
        elif file_type == "csv":
            return self._parse_csv(content, raw)
        elif file_type in ("md", "txt", "pdf"):
            return self._parse_text(content, raw)
        return []

    # ------------------------------------------------------------------
    # mark_processed
    # ------------------------------------------------------------------

    def mark_processed(self, filename: str) -> None:
        """Append filename to .processed manifest to avoid re-processing."""
        self._dir.mkdir(parents=True, exist_ok=True)
        manifest = self._dir / ".processed"
        with open(manifest, "a") as f:
            f.write(filename + "\n")

    # ------------------------------------------------------------------
    # internal helpers
    # ------------------------------------------------------------------

    def _load_processed(self) -> Set[str]:
        manifest = self._dir / ".processed"
        if not manifest.exists():
            return set()
        return set(line.strip() for line in manifest.read_text().splitlines() if line.strip())

    def _read_pdf(self, path: Path) -> str:
        """Extract text from PDF using pdfplumber. Falls back to empty string."""
        try:
            import pdfplumber
            text_parts = []
            with pdfplumber.open(path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                    # Also try extracting tables
                    for table in page.extract_tables():
                        for row in table:
                            text_parts.append(" | ".join(str(c) if c else "" for c in row))
            return "\n".join(text_parts)
        except Exception:
            return ""

    def _parse_json(self, content: str, raw: RawRecord) -> List[Score]:
        """Parse JSON: supports array-of-scores or dict-with-scores."""
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            return []

        source = Source(
            type="vendor",
            url=raw.source_url,
            date=str(raw.collected_at),
        )

        scores: List[Score] = []

        if isinstance(data, list):
            for entry in data:
                model_id = entry.get("model", entry.get("model_id", "unknown"))
                benchmark = entry.get("benchmark", entry.get("benchmark_id", ""))
                value = entry.get("score", entry.get("value"))
                if benchmark and value is not None:
                    scores.append(Score(
                        model_id=model_id,
                        benchmark_id=benchmark.lower(),
                        value=float(value),
                        unit=entry.get("unit", "%"),
                        source=source,
                        is_sota=False,
                        collected_at=raw.collected_at,
                        notes="from " + raw.raw_data.get("filename", ""),
                    ))

        elif isinstance(data, dict):
            model_id = data.get("model", data.get("model_id", "unknown"))
            scores_dict = data.get("scores", {})
            for bench, value in scores_dict.items():
                if value is not None:
                    scores.append(Score(
                        model_id=model_id,
                        benchmark_id=bench.lower(),
                        value=float(value),
                        unit="%",
                        source=source,
                        is_sota=False,
                        collected_at=raw.collected_at,
                        notes="from " + raw.raw_data.get("filename", ""),
                    ))

        return scores

    def _parse_csv(self, content: str, raw: RawRecord) -> List[Score]:
        """Parse CSV with columns: model, benchmark, score."""
        source = Source(
            type="vendor",
            url=raw.source_url,
            date=str(raw.collected_at),
        )
        scores: List[Score] = []
        reader = csv.DictReader(io.StringIO(content))
        for row in reader:
            model_id = row.get("model", row.get("model_id", "unknown"))
            benchmark = row.get("benchmark", row.get("benchmark_id", ""))
            value = row.get("score", row.get("value"))
            if benchmark and value is not None:
                try:
                    scores.append(Score(
                        model_id=model_id,
                        benchmark_id=benchmark.lower(),
                        value=float(value),
                        unit=row.get("unit", "%"),
                        source=source,
                        is_sota=False,
                        collected_at=raw.collected_at,
                        notes="from " + raw.raw_data.get("filename", ""),
                    ))
                except ValueError:
                    continue
        return scores

    def _parse_text(self, content: str, raw: RawRecord) -> List[Score]:
        """Parse Markdown/TXT/PDF text — looks for benchmark tables and key-value patterns."""
        source = Source(
            type="vendor",
            url=raw.source_url,
            date=str(raw.collected_at),
        )
        scores: List[Score] = []
        filename = raw.raw_data.get("filename", "")

        # Try extracting model name from content
        model_id = self._extract_model_name(content, filename)

        # Pattern 1: Markdown table rows  "| BenchmarkName | 92.3 |"
        table_pattern = re.compile(
            r"\|\s*([A-Za-z][\w\s\-@]+?)\s*\|\s*([\d]+(?:\.[\d]+)?)\s*%?\s*\|"
        )
        for match in table_pattern.finditer(content):
            bench_name = match.group(1).strip()
            value = float(match.group(2))
            # Skip table header separators
            if set(bench_name) <= {"-", " ", "|"}:
                continue
            scores.append(Score(
                model_id=model_id,
                benchmark_id=bench_name.lower().replace(" ", "_"),
                value=value,
                unit="%",
                source=source,
                is_sota=False,
                collected_at=raw.collected_at,
                notes="from " + filename,
            ))

        # Pattern 2: "BenchmarkName: 92.3" or "BenchmarkName = 92.3"
        if not scores:
            kv_pattern = re.compile(
                r"^([A-Za-z][\w\s\-@]+?)\s*[:=]\s*([\d]+(?:\.[\d]+)?)\s*%?\s*$",
                re.MULTILINE,
            )
            for match in kv_pattern.finditer(content):
                bench_name = match.group(1).strip()
                value = float(match.group(2))
                scores.append(Score(
                    model_id=model_id,
                    benchmark_id=bench_name.lower().replace(" ", "_"),
                    value=value,
                    unit="%",
                    source=source,
                    is_sota=False,
                    collected_at=raw.collected_at,
                    notes="from " + filename,
                ))

        return scores

    def _extract_model_name(self, content: str, filename: str) -> str:
        """Try to extract model name from file content or filename."""
        # Look for "Model: X" or "# Model Card: X" patterns
        patterns = [
            re.compile(r"#\s*(?:Model\s*Card:?)\s*(.+)", re.IGNORECASE),
            re.compile(r"(?:Model|Name)\s*[:=]\s*(.+)", re.IGNORECASE),
        ]
        for p in patterns:
            match = p.search(content)
            if match:
                return match.group(1).strip()

        # Fall back to filename without extension
        return Path(filename).stem
