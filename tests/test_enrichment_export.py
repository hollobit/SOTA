"""Verify enrichment YAML to JSON sidecar pipeline."""
from __future__ import annotations

import json
import sqlite3
import tempfile
from pathlib import Path

import yaml

from cyber.db.schema import init_db
from cyber.publisher.exporter import JSONExporter


def _write_yaml(path: Path, data: dict) -> None:
    path.write_text(yaml.safe_dump(data, sort_keys=False))


def test_enrichment_yaml_compiles_to_json(monkeypatch):
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        cfg_dir = td_path / "config"
        cfg_dir.mkdir()
        _write_yaml(cfg_dir / "model_enrichment.yaml", {
            "schema_version": "1.0",
            "models": {
                "lg/exaone-4.5-33b": {
                    "architecture": {
                        "type": "dense",
                        "total_params_b": 33,
                        "attention_pattern": "16 x (3 SWA + 1 Global)",
                    },
                    "quantizations": ["fp8", "awq", "gguf"],
                    "_sources": ["https://huggingface.co/LGAI-EXAONE/EXAONE-4.5-33B"],
                }
            }
        })

        monkeypatch.chdir(td_path)
        out_dir = td_path / "out"
        out_dir.mkdir()
        conn = sqlite3.connect(":memory:")
        init_db(conn)

        exporter = JSONExporter(conn, out_dir)
        exporter._export_enrichment()

        out_file = out_dir / "model_enrichment.json"
        assert out_file.exists()
        data = json.loads(out_file.read_text())
        assert data["_meta"]["schema_version"] == "1.0"
        assert data["_meta"]["covered_models"] == 1
        m = data["models"]["lg/exaone-4.5-33b"]
        assert m["architecture"]["type"] == "dense"
        assert m["architecture"]["total_params_b"] == 33
        assert m["quantizations"] == ["fp8", "awq", "gguf"]
        assert m["training"] == {"pretrain_tokens": None, "compute_flops": None, "phases": []}
        assert m["safety"] == {"aisi_cyber_tier": None, "cbrn_risk": None, "self_reported_safety_card": None}
        assert m["throughput"] == {"tokens_per_second": None, "latency_p50_ms": None}
        assert m["api_providers"] == []


def test_enrichment_missing_yaml_writes_empty_sidecar(monkeypatch):
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        (td_path / "config").mkdir()
        monkeypatch.chdir(td_path)
        out_dir = td_path / "out"
        out_dir.mkdir()
        conn = sqlite3.connect(":memory:")
        init_db(conn)
        exporter = JSONExporter(conn, out_dir)
        exporter._export_enrichment()
        data = json.loads((out_dir / "model_enrichment.json").read_text())
        assert data["models"] == {}
        assert data["_meta"]["covered_models"] == 0
