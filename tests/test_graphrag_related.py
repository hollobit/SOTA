"""BENCH_RELATED: the sparse-matrix path must give the same edges as the pure-Python all-pairs loop."""
import builtins
import importlib.util
import random
from pathlib import Path

import pytest

SPEC = importlib.util.spec_from_file_location("build_graphrag", Path(__file__).parent.parent / "scripts" / "build_graphrag.py")
bg = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(bg)


def _sample(n=300, vocab=60, seed=7):
    rnd = random.Random(seed)
    words = [f"w{i}" for i in range(vocab)]
    toks = {f"benchmark:b{i}": set(rnd.sample(words, rnd.randint(0, 12))) for i in range(n)}
    return list(toks), toks


def test_sparse_path_matches_pure_python(monkeypatch):
    pytest.importorskip("scipy")
    order, toks = _sample()
    fast = list(bg._bench_related(order, toks))
    real_import = builtins.__import__

    def no_scipy(name, *a, **k):
        if name.startswith("scipy"):
            raise ImportError(name)
        return real_import(name, *a, **k)

    monkeypatch.setattr(builtins, "__import__", no_scipy)
    slow = list(bg._bench_related(order, toks))
    assert fast == slow
    assert fast  # the sample produces some related pairs
