"""CLI entry point: python -m cyber"""
from __future__ import annotations

import asyncio
import importlib
import sys
from pathlib import Path
from typing import List, Optional

import click
import yaml
from rich.console import Console
from rich.table import Table

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CONFIG_DIR = PROJECT_ROOT / "config"
DB_PATH = str(DATA_DIR / "benchmark.db")

console = Console()


def _load_yaml(name: str) -> dict:
    """Load a YAML config file from the config/ directory."""
    path = CONFIG_DIR / name
    with open(path) as f:
        return yaml.safe_load(f) or {}


def _load_scouts_from_config(name: Optional[str] = None) -> List:
    """Dynamically load scout instances from scouts.yaml.

    If *name* is given, load only that scout; otherwise load all enabled scouts.
    """
    from cyber.scouts.base import BaseScout

    cfg = _load_yaml("scouts.yaml")
    scouts: List[BaseScout] = []
    for entry in cfg.get("scouts", []):
        if name and entry["name"] != name:
            continue
        if not name and not entry.get("enabled", False):
            continue
        mod = importlib.import_module(entry["module"])
        cls = getattr(mod, entry["class"])
        scouts.append(cls())
    return scouts


# ---------------------------------------------------------------------------
# CLI group
# ---------------------------------------------------------------------------
@click.group()
def cli() -> None:
    """LLM Benchmark SOTA Dashboard — scout, analyze, export, serve."""
    pass


# ---------------------------------------------------------------------------
# scout
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--name", default=None, help="Run a single scout by name.")
def scout(name: Optional[str]) -> None:
    """Run benchmark scouts to collect new data."""
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, insert_score
    from cyber.scouts.runner import run_scouts

    console.print("[bold cyan]Loading scouts...[/bold cyan]")
    scouts = _load_scouts_from_config(name)
    if not scouts:
        console.print("[yellow]No scouts matched. Check scouts.yaml or --name value.[/yellow]")
        return

    console.print(f"Running {len(scouts)} scout(s): {[s.name for s in scouts]}")
    results = asyncio.run(run_scouts(scouts))

    # Persist to DB
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)
    for score in results.scores:
        insert_score(conn, score)
    conn.close()

    console.print(f"[green]Collected {len(results.scores)} scores.[/green]")
    if results.errors:
        for err in results.errors:
            console.print(f"[red]ERROR: {err}[/red]")


# ---------------------------------------------------------------------------
# analyze
# ---------------------------------------------------------------------------
@cli.command()
def analyze() -> None:
    """Validate scores, mark SOTA, and print a summary table."""
    from cyber.analyst.normalizer import Normalizer
    from cyber.analyst.sota_tracker import SOTATracker
    from cyber.analyst.validator import Validator
    from cyber.db.connection import get_connection
    from cyber.db.schema import get_scores, init_db, insert_score

    conn = get_connection(DB_PATH)
    init_db(conn)
    scores = get_scores(conn)
    if not scores:
        console.print("[yellow]No scores in the database. Run 'scout' first.[/yellow]")
        conn.close()
        return

    # Build validator from benchmarks_meta
    meta = _load_yaml("benchmarks_meta.yaml")
    ranges = {}
    for b in meta.get("benchmarks", []):
        r = b.get("expected_range")
        if r and len(r) == 2:
            ranges[b["id"]] = (float(r[0]), float(r[1]))
    validator = Validator(benchmark_ranges=ranges)

    # Validate
    valid_scores = []
    for s in scores:
        result = validator.validate(s.benchmark_id, s.value)
        if not result.is_valid:
            console.print(
                f"[yellow]ANOMALY ({result.anomaly}): "
                f"{s.model_id}/{s.benchmark_id} = {s.value} — {result.message}[/yellow]"
            )
        else:
            valid_scores.append(s)

    # Mark SOTA
    tracker = SOTATracker()
    marked = tracker.mark_sota(valid_scores)

    # Persist updated SOTA flags
    for s in marked:
        insert_score(conn, s)
    conn.close()

    # Print summary table
    sota = tracker.compute_sota(valid_scores)
    table = Table(title="SOTA Leaderboard")
    table.add_column("Benchmark", style="cyan")
    table.add_column("Model", style="green")
    table.add_column("Score", justify="right", style="bold")
    table.add_column("Unit")
    for bench_id in sorted(sota.keys()):
        s = sota[bench_id]
        table.add_row(bench_id, s.model_id, f"{s.value:.2f}", s.unit)

    console.print(table)
    console.print(f"[green]Analyzed {len(scores)} scores, {len(valid_scores)} valid.[/green]")


# ---------------------------------------------------------------------------
# export
# ---------------------------------------------------------------------------
@cli.command()
def export() -> None:
    """Export SQLite data to JSON files."""
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db
    from cyber.publisher.exporter import Exporter

    output_dir = DATA_DIR / "export"
    output_dir.mkdir(parents=True, exist_ok=True)

    conn = get_connection(DB_PATH)
    init_db(conn)
    exporter = Exporter(conn, str(output_dir))
    exporter.export_all()
    conn.close()

    console.print(f"[green]Exported data to {output_dir}[/green]")


# ---------------------------------------------------------------------------
# serve
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--port", default=8000, type=int, help="Port to serve on.")
def serve(port: int) -> None:
    """Serve the dashboard/ directory locally."""
    import http.server
    import functools

    dashboard_dir = PROJECT_ROOT / "dashboard"
    if not dashboard_dir.exists():
        console.print(
            f"[yellow]Dashboard directory not found at {dashboard_dir}. "
            f"Creating empty directory.[/yellow]"
        )
        dashboard_dir.mkdir(parents=True, exist_ok=True)

    handler = functools.partial(
        http.server.SimpleHTTPRequestHandler,
        directory=str(dashboard_dir),
    )
    console.print(f"[bold green]Serving dashboard at http://localhost:{port}[/bold green]")
    console.print("Press Ctrl+C to stop.")
    server = http.server.HTTPServer(("", port), handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        console.print("\n[yellow]Server stopped.[/yellow]")
        server.server_close()


# ---------------------------------------------------------------------------
# run (all-in-one)
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--all", "run_all", is_flag=True, default=False, help="Run scout, analyze, export.")
def run(run_all: bool) -> None:
    """Run the full pipeline: scout -> analyze -> export."""
    if not run_all:
        console.print("[yellow]Use --all to run the full pipeline.[/yellow]")
        return

    ctx = click.get_current_context()
    console.rule("[bold]Step 1/3: Scout[/bold]")
    ctx.invoke(scout)
    console.rule("[bold]Step 2/3: Analyze[/bold]")
    ctx.invoke(analyze)
    console.rule("[bold]Step 3/3: Export[/bold]")
    ctx.invoke(export)
    console.print("[bold green]Pipeline complete.[/bold green]")


if __name__ == "__main__":
    cli()
