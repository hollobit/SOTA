"""Normalizer for model names, benchmark names, and notes."""

from __future__ import annotations

import re
from typing import Dict, Optional


class Normalizer:
    """Normalizes model/benchmark names and notes to canonical forms."""

    def __init__(
        self,
        aliases: Optional[Dict[str, str]] = None,
        benchmark_aliases: Optional[Dict[str, str]] = None,
    ) -> None:
        # Store aliases with lowercased keys for case-insensitive lookup
        self._aliases: Dict[str, str] = {}
        if aliases:
            for k, v in aliases.items():
                self._aliases[k.lower().strip()] = v

        self._benchmark_aliases: Dict[str, str] = {}
        if benchmark_aliases:
            for k, v in benchmark_aliases.items():
                self._benchmark_aliases[k.lower().strip()] = v

    def normalize_model(self, name: str) -> str:
        """Case-insensitive lookup, strip whitespace, return canonical or passthrough."""
        key = name.lower().strip()
        return self._aliases.get(key, name.strip())

    def normalize_benchmark(self, name: str) -> str:
        """Check benchmark_aliases first, else lowercase+strip."""
        key = name.lower().strip()
        if key in self._benchmark_aliases:
            return self._benchmark_aliases[key]
        return key

    def normalize_notes(self, notes: str) -> str:
        """Normalize common shorthand in notes.

        - "zero shot" -> "0-shot"
        - "N shot" -> "N-shot"
        - "chain-of-thought" -> "CoT"
        """
        result = notes
        # "zero shot" -> "0-shot"
        result = re.sub(r'\bzero\s+shot\b', '0-shot', result, flags=re.IGNORECASE)
        # "N shot" -> "N-shot" (digit followed by space and "shot")
        result = re.sub(r'\b(\d+)\s+shot\b', r'\1-shot', result, flags=re.IGNORECASE)
        # "chain-of-thought" -> "CoT"
        result = re.sub(r'\bchain-of-thought\b', 'CoT', result, flags=re.IGNORECASE)
        return result

    def add_alias(self, variant: str, canonical: str) -> None:
        """Add new model alias at runtime."""
        self._aliases[variant.lower().strip()] = canonical
