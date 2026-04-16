"""Abstract base class for benchmark data parsers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, List


class BaseParser(ABC):
    """Base class that all parsers must implement."""

    @abstractmethod
    def parse(self, content: str, source_url: str = "") -> List[Dict[str, Any]]:
        """Return list of dicts with model_id, benchmark_id, value, unit keys."""
        ...
