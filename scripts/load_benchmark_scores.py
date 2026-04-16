"""Load comprehensive benchmark scores from resource/benchmark_scores_*.json into the database."""
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from cyber.db.connection import get_connection
from cyber.db.schema import init_db, insert_model, insert_benchmark, insert_score
from cyber.models.types import Model, Benchmark, Score, Source

DB_PATH = "data/benchmark.db"


def main():
    resource_dir = Path("resource")
    json_files = sorted(resource_dir.glob("*_scores_*.json")) + sorted(resource_dir.glob("*_scores.json"))
    # Deduplicate
    seen = set()
    unique = []
    for f in json_files:
        if f.name not in seen:
            seen.add(f.name)
            unique.append(f)
    json_files = unique
    if not json_files:
        print("No *_scores_*.json files found in resource/")
        return

    Path("data").mkdir(exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    total_models = 0
    total_benchmarks = 0
    total_scores = 0

    for json_path in json_files:
        print(f"Loading {json_path.name}...")
        data = json.loads(json_path.read_text())
        meta = data.get("_meta", {})
        sources = meta.get("sources", [])
        collected_at_str = meta.get("collected_at", date.today().isoformat())
        collected_at = date.fromisoformat(collected_at_str)

        # Load models
        for m in data.get("models", []):
            insert_model(conn, Model(
                id=m["id"],
                vendor=m.get("vendor", "unknown"),
                name=m.get("name", m["id"]),
                version="",
                type=m.get("type", "proprietary"),
                modalities=m.get("modalities", ["text"]),
            ))
            total_models += 1

        # Load benchmarks
        for b in data.get("benchmarks", []):
            insert_benchmark(conn, Benchmark(
                id=b["id"],
                name=b.get("name", b["id"]),
                category=b.get("category", "other"),
                description=b.get("description", ""),
                metric=b.get("metric", "accuracy"),
            ))
            total_benchmarks += 1

        # Load scores
        source_url = sources[0] if sources else "https://llm-stats.com"
        for s in data.get("scores", []):
            insert_score(conn, Score(
                model_id=s["model"],
                benchmark_id=s["benchmark"],
                value=s["score"],
                unit=s.get("unit", "%"),
                source=Source(
                    type="leaderboard",
                    url=source_url,
                    date=collected_at_str,
                ),
                is_sota=False,
                collected_at=collected_at,
                notes=s.get("notes", ""),
            ))
            total_scores += 1

    # Mark SOTA
    from cyber.analyst.sota_tracker import SOTATracker
    from cyber.db.schema import get_scores
    tracker = SOTATracker()
    all_scores = get_scores(conn)
    marked = tracker.mark_sota(all_scores)
    for s in marked:
        insert_score(conn, s)

    conn.close()
    print(f"Loaded {total_models} models, {total_benchmarks} benchmarks, {total_scores} scores")
    print("SOTA flags updated")


if __name__ == "__main__":
    main()
