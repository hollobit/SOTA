"""BaseScout ABC — interface all scouts must implement."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List

from cyber.models.types import RawRecord, Score


class BaseScout(ABC):
    """Abstract base class for benchmark data scouts."""

    name: str = "unnamed"

    @abstractmethod
    async def discover(self) -> List[RawRecord]:
        """Fetch raw data from an external source and return RawRecords."""
        ...

    @abstractmethod
    def parse(self, raw: RawRecord) -> List[Score]:
        """Parse a single RawRecord into a list of Score objects."""
        ...
