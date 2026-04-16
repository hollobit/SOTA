"""CLI entry point: python -m cyber"""
import click


@click.group()
def cli():
    """LLM Benchmark SOTA Dashboard"""
    pass


if __name__ == "__main__":
    cli()
