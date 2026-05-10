"""Load comprehensive benchmark scores from resource/benchmark_scores_*.json into the database.

2-pass loader (since 2026-05-08):
  Pass 1 — register every models[] and benchmarks[] across ALL files.
  Pass 2 — insert every scores[] across ALL files.

This makes the order of files irrelevant for FK satisfaction: a score in file
A can reference a model registered only in file B without IntegrityError on a
fresh DB rebuild.
"""
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
    # Deduplicate (a file like foo_scores_2026_04_18.json matches both globs)
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

    # Pass 1 — register all models and benchmarks across every file first,
    # so any score in pass 2 can resolve its model_id / benchmark_id FK
    # regardless of which file (or glob ordering) declared it.
    for json_path in json_files:
        print(f"Loading [pass 1: schema] {json_path.name}...")
        data = json.loads(json_path.read_text())

        # Load models. INSERT OR REPLACE overwrites the row, so when a JSON
        # entry lacks `type`, we look up the existing value and preserve it
        # rather than blindly defaulting to "proprietary" (which historically
        # caused 90% of sovereign models to flip from open-weight to proprietary
        # over many score-batch loads).
        for m in data.get("models", []):
            mtype = m.get("type")
            if mtype is None:
                row = conn.execute("SELECT type FROM models WHERE id = ?", (m["id"],)).fetchone()
                mtype = (row[0] if row else None) or "proprietary"
            insert_model(conn, Model(
                id=m["id"],
                vendor=m.get("vendor", "unknown"),
                name=m.get("name", m["id"]),
                version="",
                type=mtype,
                modalities=m.get("modalities", ["text"]),
                parameters=m.get("parameters"),
                release_date=m.get("released_at") or m.get("release_date"),
                context_window=m.get("context_window"),
                knowledge_cutoff=m.get("knowledge_cutoff"),
                languages=m.get("languages"),
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

    # Pass 2 — insert all scores. Every model/benchmark FK target now exists.
    for json_path in json_files:
        print(f"Loading [pass 2: scores] {json_path.name}...")
        data = json.loads(json_path.read_text())
        meta = data.get("_meta", {})
        sources = meta.get("sources", [])
        collected_at_str = meta.get("collected_at", date.today().isoformat())
        collected_at = date.fromisoformat(collected_at_str)

        # Build source lookup: PDF sources get type "pdf", web sources get "leaderboard"
        pdf_sources = {s for s in sources if s.startswith("resource/") or s.endswith(".pdf")}
        default_source_url = sources[0] if sources else "https://llm-stats.com"

        # Load scores
        for s in data.get("scores", []):
            # Determine source per score: use _source if present, else infer from _note
            note = s.get("_note", "") or s.get("notes", "")
            score_source = s.get("_source", "")

            if score_source:
                src_type = "pdf" if score_source.endswith(".pdf") else "leaderboard"
                src_url = score_source
            elif any(kw in note.lower() for kw in ["system card", "model card", "from kimi", "from glm", "from opus", "from mythos", "self-reported"]):
                src_type = "pdf"
                src_url = "resource/"
            else:
                src_type = "leaderboard"
                src_url = default_source_url

            insert_score(conn, Score(
                model_id=s["model"],
                benchmark_id=s["benchmark"],
                value=s["score"],
                unit=s.get("unit", "%"),
                source=Source(
                    type=src_type,
                    url=src_url,
                    date=collected_at_str,
                ),
                is_sota=False,
                collected_at=collected_at,
                notes=note,
            ))
            total_scores += 1

    # Mark SOTA
    from cyber.analyst.sota_tracker import SOTATracker
    from cyber.db.schema import get_all_benchmarks, get_scores
    tracker = SOTATracker()
    all_scores = get_scores(conn)
    benchmarks = {b.id: b for b in get_all_benchmarks(conn)}
    marked = tracker.mark_sota(all_scores, benchmarks)
    for s in marked:
        insert_score(conn, s)

    conn.close()
    print(f"Loaded {total_models} models, {total_benchmarks} benchmarks, {total_scores} scores")
    print("SOTA flags updated")


if __name__ == "__main__":
    main()
