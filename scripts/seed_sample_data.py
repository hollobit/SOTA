"""Seed sample benchmark data for dashboard testing."""
import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))

from datetime import date
from cyber.db.connection import get_connection
from cyber.db.schema import (
    init_db, insert_model, insert_benchmark, insert_score, insert_leaderboard_ranking
)
from cyber.models.types import Model, Benchmark, Score, Source, LeaderboardRanking

DB_PATH = "data/benchmark.db"

models = [
    Model(id="anthropic/claude-4-opus", vendor="Anthropic", name="Claude 4 Opus", version="2026-03", type="proprietary", modalities=["text", "vision"]),
    Model(id="openai/gpt-4o", vendor="OpenAI", name="GPT-4o", version="2025-08", type="proprietary", modalities=["text", "vision", "audio"]),
    Model(id="google/gemini-2.5-pro", vendor="Google", name="Gemini 2.5 Pro", version="2025-12", type="proprietary", modalities=["text", "vision"]),
    Model(id="meta/llama-4-maverick", vendor="Meta", name="Llama 4 Maverick", version="2025-04", type="open-weight", modalities=["text", "vision"]),
    Model(id="deepseek/deepseek-r2", vendor="DeepSeek", name="DeepSeek R2", version="2026-01", type="open-weight", modalities=["text"]),
    Model(id="mistral/mistral-large-3", vendor="Mistral", name="Mistral Large 3", version="2026-02", type="open-weight", modalities=["text"]),
    Model(id="qwen/qwen3-235b", vendor="Alibaba", name="Qwen3 235B", version="2025-11", type="open-weight", modalities=["text"]),
]

benchmarks = [
    Benchmark(id="mmlu", name="MMLU", category="reasoning", description="Massive Multitask Language Understanding", metric="accuracy"),
    Benchmark(id="gpqa", name="GPQA Diamond", category="reasoning", description="Graduate-Level Google-Proof Q&A", metric="accuracy"),
    Benchmark(id="humaneval", name="HumanEval", category="coding", description="Code generation benchmark", metric="pass@1"),
    Benchmark(id="math", name="MATH", category="math", description="Competition mathematics", metric="accuracy"),
    Benchmark(id="gsm8k", name="GSM8K", category="math", description="Grade School Math", metric="accuracy"),
    Benchmark(id="mmmu", name="MMMU", category="multimodal", description="Multimodal Understanding", metric="accuracy"),
    Benchmark(id="swe_bench", name="SWE-bench Verified", category="agent", description="Software Engineering", metric="resolve_rate"),
    Benchmark(id="ifeval", name="IFEval", category="instruction_following", description="Instruction Following", metric="accuracy"),
    Benchmark(id="aime", name="AIME 2024", category="math", description="Math competition", metric="accuracy"),
    Benchmark(id="truthfulqa", name="TruthfulQA", category="safety", description="Truthfulness", metric="accuracy"),
]

# Scores: model_id, benchmark_id, value
scores_data = [
    ("anthropic/claude-4-opus", "mmlu", 93.2), ("anthropic/claude-4-opus", "gpqa", 71.5),
    ("anthropic/claude-4-opus", "humaneval", 92.8), ("anthropic/claude-4-opus", "math", 82.1),
    ("anthropic/claude-4-opus", "gsm8k", 97.3), ("anthropic/claude-4-opus", "mmmu", 72.1),
    ("anthropic/claude-4-opus", "swe_bench", 62.4), ("anthropic/claude-4-opus", "ifeval", 91.2),
    ("anthropic/claude-4-opus", "aime", 55.0), ("anthropic/claude-4-opus", "truthfulqa", 88.7),

    ("openai/gpt-4o", "mmlu", 91.8), ("openai/gpt-4o", "gpqa", 68.3),
    ("openai/gpt-4o", "humaneval", 90.2), ("openai/gpt-4o", "math", 78.5),
    ("openai/gpt-4o", "gsm8k", 96.1), ("openai/gpt-4o", "mmmu", 70.5),
    ("openai/gpt-4o", "swe_bench", 58.7), ("openai/gpt-4o", "ifeval", 89.3),
    ("openai/gpt-4o", "aime", 48.0), ("openai/gpt-4o", "truthfulqa", 85.2),

    ("google/gemini-2.5-pro", "mmlu", 92.5), ("google/gemini-2.5-pro", "gpqa", 69.8),
    ("google/gemini-2.5-pro", "humaneval", 89.1), ("google/gemini-2.5-pro", "math", 80.3),
    ("google/gemini-2.5-pro", "gsm8k", 96.8), ("google/gemini-2.5-pro", "mmmu", 73.2),
    ("google/gemini-2.5-pro", "swe_bench", 55.2), ("google/gemini-2.5-pro", "ifeval", 88.1),
    ("google/gemini-2.5-pro", "aime", 52.0), ("google/gemini-2.5-pro", "truthfulqa", 82.9),

    ("meta/llama-4-maverick", "mmlu", 88.5), ("meta/llama-4-maverick", "gpqa", 61.2),
    ("meta/llama-4-maverick", "humaneval", 85.0), ("meta/llama-4-maverick", "math", 72.3),
    ("meta/llama-4-maverick", "gsm8k", 94.1), ("meta/llama-4-maverick", "mmmu", 65.0),
    ("meta/llama-4-maverick", "swe_bench", 45.8), ("meta/llama-4-maverick", "ifeval", 87.1),
    ("meta/llama-4-maverick", "aime", 38.0), ("meta/llama-4-maverick", "truthfulqa", 79.5),

    ("deepseek/deepseek-r2", "mmlu", 90.1), ("deepseek/deepseek-r2", "gpqa", 67.9),
    ("deepseek/deepseek-r2", "humaneval", 88.5), ("deepseek/deepseek-r2", "math", 85.2),
    ("deepseek/deepseek-r2", "gsm8k", 95.8), ("deepseek/deepseek-r2", "swe_bench", 51.3),
    ("deepseek/deepseek-r2", "ifeval", 86.5), ("deepseek/deepseek-r2", "aime", 60.0),
    ("deepseek/deepseek-r2", "truthfulqa", 81.0),

    ("mistral/mistral-large-3", "mmlu", 87.2), ("mistral/mistral-large-3", "gpqa", 58.1),
    ("mistral/mistral-large-3", "humaneval", 82.3), ("mistral/mistral-large-3", "math", 68.7),
    ("mistral/mistral-large-3", "gsm8k", 92.5), ("mistral/mistral-large-3", "swe_bench", 42.1),
    ("mistral/mistral-large-3", "ifeval", 85.0), ("mistral/mistral-large-3", "truthfulqa", 77.8),

    ("qwen/qwen3-235b", "mmlu", 89.3), ("qwen/qwen3-235b", "gpqa", 63.5),
    ("qwen/qwen3-235b", "humaneval", 86.1), ("qwen/qwen3-235b", "math", 74.8),
    ("qwen/qwen3-235b", "gsm8k", 95.0), ("qwen/qwen3-235b", "swe_bench", 48.5),
    ("qwen/qwen3-235b", "ifeval", 84.2), ("qwen/qwen3-235b", "truthfulqa", 80.1),
]

arena_rankings = [
    ("anthropic/claude-4-opus", 1, 1350.0),
    ("openai/gpt-4o", 2, 1320.0),
    ("google/gemini-2.5-pro", 3, 1305.0),
    ("deepseek/deepseek-r2", 4, 1280.0),
    ("meta/llama-4-maverick", 5, 1265.0),
    ("qwen/qwen3-235b", 6, 1250.0),
    ("mistral/mistral-large-3", 7, 1235.0),
]

def main():
    import pathlib
    pathlib.Path("data").mkdir(exist_ok=True)

    conn = get_connection(DB_PATH)
    init_db(conn)

    for m in models:
        insert_model(conn, m)
    for b in benchmarks:
        insert_benchmark(conn, b)

    from cyber.analyst.sota_tracker import SOTATracker
    tracker = SOTATracker()

    all_scores = []
    src = Source(type="leaderboard", url="https://example.com", date="2026-04-16")
    for model_id, bench_id, value in scores_data:
        s = Score(model_id=model_id, benchmark_id=bench_id, value=value, unit="%",
                  source=src, is_sota=False, collected_at=date(2026, 4, 16))
        all_scores.append(s)

    marked = tracker.mark_sota(all_scores)
    for s in marked:
        insert_score(conn, s)

    for model_id, rank, elo in arena_rankings:
        insert_leaderboard_ranking(conn, LeaderboardRanking(
            leaderboard="chatbot-arena", model_id=model_id,
            rank=rank, score=elo, metric="elo",
            snapshot_date=date(2026, 4, 16),
            source_url="https://lmarena.ai",
        ))

    conn.close()
    print(f"Seeded {len(models)} models, {len(benchmarks)} benchmarks, {len(marked)} scores, {len(arena_rankings)} arena rankings")

if __name__ == "__main__":
    main()
