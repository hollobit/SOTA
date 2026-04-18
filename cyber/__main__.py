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


# ---------------------------------------------------------------------------
# ingest (resource folder)
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--dir", "resource_dir", default=None, help="Path to resource directory.")
def ingest(resource_dir: Optional[str]) -> None:
    """Ingest benchmark data from files in the resource/ folder (PDF, MD, JSON, CSV, TXT)."""
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, insert_benchmark, insert_model, insert_score
    from cyber.models.types import Benchmark, Model
    from cyber.scouts.resource.scanner import ResourceScout

    if resource_dir is None:
        resource_dir = str(PROJECT_ROOT / "resource")

    scout = ResourceScout(resource_dir=resource_dir)
    console.print(f"[bold cyan]Scanning {resource_dir} for benchmark data...[/bold cyan]")
    records = asyncio.run(scout.discover())

    if not records:
        console.print("[yellow]No new files found in resource directory.[/yellow]")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    total_scores = 0
    for raw in records:
        scores = scout.parse(raw)
        for s in scores:
            # Auto-register model and benchmark if they don't exist yet
            insert_model(conn, Model(
                id=s.model_id, vendor=s.model_id.split("/")[0] if "/" in s.model_id else "unknown",
                name=s.model_id.split("/")[-1], version="",
                type="open-weight", modalities=["text"],
            ))
            insert_benchmark(conn, Benchmark(
                id=s.benchmark_id, name=s.benchmark_id.upper(),
                category="unknown", description="Auto-registered from resource",
                metric="accuracy",
            ))
            insert_score(conn, s)
        total_scores += len(scores)
        filename = raw.raw_data.get("filename", "")
        console.print(f"  [green]{filename}[/green]: {len(scores)} scores extracted")
        scout.mark_processed(filename)

    conn.close()
    console.print(f"[bold green]Ingested {total_scores} scores from {len(records)} file(s).[/bold green]")


# ---------------------------------------------------------------------------
# load-bmt (benchmark library)
# ---------------------------------------------------------------------------
@cli.command("load-bmt")
@click.option("--path", default=None, help="Path to BMT benchmark-library JSON file.")
@click.option("--export-map", is_flag=True, help="Export connection map to data/bmt_connections.json.")
def load_bmt(path: Optional[str], export_map: bool) -> None:
    """Load BMT benchmark dataset library and connect to scoring system."""
    from cyber.db.connection import get_connection
    from cyber.db.schema import init_db, insert_benchmark
    from cyber.scouts.resource.bmt_loader import BMTLoader

    if path is None:
        # Auto-detect BMT file in BMT/ directory
        bmt_dir = PROJECT_ROOT / "BMT"
        candidates = sorted(bmt_dir.glob("benchmark-library*.json"))
        if not candidates:
            console.print("[red]No BMT file found. Use --path to specify.[/red]")
            return
        path = str(candidates[-1])  # Latest file

    console.print(f"[bold cyan]Loading BMT library from {path}...[/bold cyan]")
    loader = BMTLoader(path)
    count = loader.load()
    console.print(f"  Loaded {count} benchmark dataset entries")

    # Register benchmarks in DB
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    benchmarks = loader.to_benchmarks()
    for b in benchmarks:
        insert_benchmark(conn, b)
    conn.close()
    console.print(f"  [green]Registered {len(benchmarks)} benchmarks in DB[/green]")

    # Build and show connection map
    connections = loader.build_connection_map()
    if connections:
        table = Table(title="BMT ↔ Score Connections")
        table.add_column("Score ID", style="cyan")
        table.add_column("BMT Dataset", style="green")
        table.add_column("Paper", style="dim")
        table.add_column("Year")
        for bench_id, info in sorted(connections.items()):
            table.add_row(
                bench_id,
                info["bmt_title"],
                info["paper_link"][:50] + "..." if len(info["paper_link"]) > 50 else info["paper_link"],
                info["year"],
            )
        console.print(table)
        console.print(f"  [green]{len(connections)} benchmark IDs connected to BMT entries[/green]")

    if export_map:
        import json
        map_path = DATA_DIR / "bmt_connections.json"
        map_path.parent.mkdir(parents=True, exist_ok=True)
        map_path.write_text(json.dumps(connections, ensure_ascii=False, indent=2))
        console.print(f"  [green]Connection map exported to {map_path}[/green]")

    # Also export full BMT catalog as JSON for dashboard
    import json
    catalog_path = DATA_DIR / "bmt_catalog.json"
    catalog_path.parent.mkdir(parents=True, exist_ok=True)
    catalog_path.write_text(json.dumps(loader.entries, ensure_ascii=False, indent=2))
    console.print(f"  [green]Full catalog exported to {catalog_path}[/green]")


# ---------------------------------------------------------------------------
# discover
# ---------------------------------------------------------------------------
@cli.command()
def discover() -> None:
    """Load seed sources and register new ones in the DB."""
    from datetime import date as _date
    from urllib.parse import urlparse

    from cyber.agents.discovery import DiscoveryAgent
    from cyber.db.connection import get_connection
    from cyber.db.schema import get_sources, init_db, insert_source
    from cyber.models.types import SourceEntry

    cfg = _load_yaml("seed_sources.yaml")
    seeds = cfg.get("sources", [])
    if not seeds:
        console.print("[yellow]No seeds found in seed_sources.yaml.[/yellow]")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    existing_urls = {s.url for s in get_sources(conn)}
    agent = DiscoveryAgent()
    added = 0

    for seed in seeds:
        url = seed["url"]
        if url in existing_urls:
            continue
        entry = agent.create_candidate(url, seed.get("name", url), "seed")
        entry.type = seed.get("type", entry.type)
        entry.format = seed.get("format", entry.format)
        entry.status = "active"
        insert_source(conn, entry)
        added += 1
        console.print(f"  [green]+[/green] {entry.name} ({url})")

    conn.close()
    console.print(f"[bold green]Registered {added} new seed source(s).[/bold green]")


# ---------------------------------------------------------------------------
# collect
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--all", "collect_all", is_flag=True, default=False, help="Collect from all active sources.")
@click.option("--source", "source_id", default=None, help="Collect from a single source by ID.")
def collect(collect_all: bool, source_id: Optional[str]) -> None:
    """Collect benchmark data from sources."""
    from datetime import date as _date

    from cyber.agents.collector import CollectorAgent
    from cyber.agents.scheduler import Scheduler
    from cyber.db.connection import get_connection
    from cyber.db.schema import get_sources, get_source_by_id, init_db

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    if source_id:
        src = get_source_by_id(conn, source_id)
        if src is None:
            console.print(f"[red]Source '{source_id}' not found.[/red]")
            conn.close()
            return
        targets = [src]
    elif collect_all:
        targets = get_sources(conn, status="active")
    else:
        scheduler = Scheduler()
        targets = scheduler.filter_due(get_sources(conn), as_of=_date.today())

    if not targets:
        console.print("[yellow]No sources to collect from.[/yellow]")
        conn.close()
        return

    collector = CollectorAgent()
    console.print(f"Collecting from {len(targets)} source(s)...")
    for src in targets:
        parser = collector.select_parser(src.format)
        if parser is None:
            console.print(f"  [yellow]No parser for format '{src.format}' ({src.name})[/yellow]")
            continue
        console.print(f"  [cyan]{src.name}[/cyan] ({src.format})")

    conn.close()
    console.print("[bold green]Collection complete.[/bold green]")


# ---------------------------------------------------------------------------
# librarian
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--health", is_flag=True, default=False, help="Run health checks on all sources.")
@click.option("--trust", is_flag=True, default=False, help="Recompute trust scores.")
def librarian(health: bool, trust: bool) -> None:
    """Run Librarian agent to update source health and trust."""
    from datetime import date as _date

    from cyber.agents.librarian import LibrarianAgent
    from cyber.db.connection import get_connection
    from cyber.db.schema import get_sources, init_db, update_source

    if not health and not trust:
        console.print("[yellow]Specify --health and/or --trust.[/yellow]")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    agent = LibrarianAgent()
    sources = get_sources(conn)

    if not sources:
        console.print("[yellow]No sources in database.[/yellow]")
        conn.close()
        return

    updated = 0
    for src in sources:
        changed = False
        if health:
            new_status = agent.check_health(src, as_of=_date.today())
            if new_status != src.status:
                src.status = new_status
                changed = True
        if trust:
            new_trust = agent.compute_trust(src)
            if new_trust != src.trust_score:
                src.trust_score = new_trust
                changed = True
            new_interval = agent.compute_interval(src)
            if agent.is_conference_season(_date.today()):
                new_interval = agent.apply_boost(new_interval)
            if new_interval != src.crawl_interval_hours:
                src.crawl_interval_hours = new_interval
                changed = True
        if changed:
            update_source(conn, src)
            updated += 1

    conn.close()
    console.print(f"[bold green]Updated {updated} source(s).[/bold green]")


# ---------------------------------------------------------------------------
# sources
# ---------------------------------------------------------------------------
@cli.command()
@click.option("--status", default=None, help="Filter sources by status.")
@click.option("--add", "add_url", default=None, help="Add a new source URL.")
def sources(status: Optional[str], add_url: Optional[str]) -> None:
    """List or add benchmark sources."""
    from datetime import date as _date
    from urllib.parse import urlparse

    from cyber.agents.discovery import DiscoveryAgent
    from cyber.db.connection import get_connection
    from cyber.db.schema import get_sources, init_db, insert_source

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection(DB_PATH)
    init_db(conn)

    if add_url:
        agent = DiscoveryAgent()
        entry = agent.create_candidate(add_url, add_url, "seed")
        insert_source(conn, entry)
        console.print(f"[green]Added: {add_url}[/green]")

    all_sources = get_sources(conn, status=status)
    if not all_sources:
        console.print("[yellow]No sources found.[/yellow]")
        conn.close()
        return

    table = Table(title="Benchmark Sources")
    table.add_column("ID", style="dim", max_width=30)
    table.add_column("Name", style="cyan")
    table.add_column("Type")
    table.add_column("Format")
    table.add_column("Trust", justify="right")
    table.add_column("Status", style="bold")
    table.add_column("Crawls", justify="right")

    for s in all_sources:
        table.add_row(
            s.id[:30],
            s.name,
            s.type,
            s.format,
            f"{s.trust_score:.2f}",
            s.status,
            str(s.crawl_count),
        )

    console.print(table)
    conn.close()


if __name__ == "__main__":
    cli()
