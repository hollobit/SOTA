#!/usr/bin/env python3
"""Generate CHANGELOG.md from git log using conventional commits format.

Walks `git log` from the most recent tag (or HEAD~50) to HEAD, groups commits
by type (feat / fix / refactor / data / docs / test / chore), and writes a
formatted CHANGELOG.md.
"""
from __future__ import annotations

import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path


CONVENTIONAL_PATTERN = re.compile(r"^(\w+)(?:\(([^)]+)\))?: (.+)$")
TYPE_ORDER = ["feat", "fix", "refactor", "data", "docs", "test", "chore"]
TYPE_LABELS = {
    "feat": "✨ Features",
    "fix": "🐛 Fixes",
    "refactor": "♻️ Refactors",
    "data": "📊 Data",
    "docs": "📝 Docs",
    "test": "🧪 Tests",
    "chore": "🔧 Chores",
}


def main() -> int:
    # Get last 50 commits
    try:
        result = subprocess.run(
            ["git", "log", "-50", "--pretty=format:%h|%s|%cI"],
            capture_output=True, text=True, check=True,
        )
    except subprocess.CalledProcessError:
        print("[changelog] git log failed", file=sys.stderr)
        return 1

    grouped = defaultdict(list)
    for line in result.stdout.strip().split("\n"):
        if not line:
            continue
        parts = line.split("|", 2)
        if len(parts) < 3:
            continue
        sha, subject, iso_date = parts
        m = CONVENTIONAL_PATTERN.match(subject)
        if m:
            ctype = m.group(1).lower()
            scope = m.group(2)
            description = m.group(3)
        else:
            ctype = "other"
            scope = None
            description = subject
        grouped[ctype].append({
            "sha": sha,
            "scope": scope,
            "description": description,
            "date": iso_date.split("T")[0],
        })

    out = ["# Changelog", "", "Auto-generated from `git log` (last 50 commits).", ""]
    for ctype in TYPE_ORDER:
        if ctype not in grouped:
            continue
        out.append(f"## {TYPE_LABELS[ctype]}")
        out.append("")
        for entry in grouped[ctype]:
            scope_str = f"**{entry['scope']}**: " if entry['scope'] else ""
            out.append(f"- ({entry['date']}) {scope_str}{entry['description']} `{entry['sha']}`")
        out.append("")

    if "other" in grouped:
        out.append("## Other")
        out.append("")
        for entry in grouped["other"]:
            out.append(f"- ({entry['date']}) {entry['description']} `{entry['sha']}`")
        out.append("")

    Path("CHANGELOG.md").write_text("\n".join(out))
    print(f"[changelog] wrote CHANGELOG.md with {sum(len(v) for v in grouped.values())} entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
