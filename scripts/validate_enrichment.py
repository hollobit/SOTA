#!/usr/bin/env python3
"""Validate config/model_enrichment.yaml against the JSON schema."""
import json
import sys
from pathlib import Path

import yaml

try:
    from jsonschema import validate, ValidationError
except ImportError:
    print("[validate] jsonschema not installed; pip install jsonschema", file=sys.stderr)
    sys.exit(1)


def main() -> int:
    schema_file = Path("config/model_enrichment.schema.json")
    if not schema_file.exists():
        print("[validate] schema file missing", file=sys.stderr)
        return 1
    schema = json.loads(schema_file.read_text())

    yamls = [Path("config/model_enrichment.yaml"), Path("config/model_enrichment_auto.yaml")]
    errors = 0
    for yp in yamls:
        if not yp.exists():
            continue
        doc = yaml.safe_load(yp.read_text()) or {}
        try:
            validate(instance=doc, schema=schema)
            print(f"[validate] OK: {yp}")
        except ValidationError as e:
            errors += 1
            # Print only the first failure for clarity
            print(f"[validate] FAIL: {yp}")
            print(f"  Path: {' -> '.join(map(str, e.absolute_path))}")
            print(f"  Message: {e.message}")
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
