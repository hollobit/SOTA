"""Detect version vs release_date contradictions across model families.

Group models by (vendor, family) where family is derived by stripping
the trailing version/variant suffix. Within each group, parse the version
number and check that release_date is monotonically non-decreasing as
version increases.

Examples flagged:
- openai/gpt-5.2 (2025-11-10) is OLDER than openai/gpt-5.1 (2025-11-13) — contradiction
- openai/gpt-4.1 (2025-04) is partial; check sibling siblings for consistency

Run: python3 scripts/audit_version_date_consistency.py
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path


def parse_version_tuple(model_id: str):
    """Extract a version tuple from model_id for comparison.
    Returns (family_key, version_tuple, variant) where:
    - family_key: vendor/base-name (e.g., 'openai/gpt')
    - version_tuple: tuple of ints/floats (e.g., (5, 2) for gpt-5.2)
    - variant: trailing variant tag like 'mini', 'pro', 'thinking', '' for base
    """
    if "/" not in model_id:
        return None
    vendor, name = model_id.split("/", 1)

    # Patterns to extract: model name with version, optionally followed by variant
    # gpt-5.5 / gpt-5.5-pro / gpt-5.4-mini / gpt-5.4-thinking
    # claude-opus-4.7 / claude-sonnet-4.5 / claude-haiku-4.5
    # gemini-3-pro / gemini-3.1-flash-lite / gemini-2.5-pro
    # grok-4 / grok-4.20 / grok-4.3 / grok-4-heavy
    # llama-3.1-405b / llama-4-scout / llama-4-maverick
    # qwen3-32b / qwen3.5-122b / qwen3.6-27b
    # deepseek-v3 / deepseek-v3.1-terminus / deepseek-v4-pro / deepseek-r1
    # mistral-medium-3.1 / devstral-small-1.1 / magistral-small-1
    # phi-4 / phi-4-mini / phi-5-medium
    # gemma-2-27b / gemma-3-27b / gemma-4-31b
    # exaone-3.5-32b / exaone-4.0-32b / exaone-deep-32b
    # solar-pro-2 / solar-pro-3 / hyperclova-x-think-32b
    # glm-4.5 / glm-4.6 / glm-5.1
    # kimi-k2 / kimi-k2.6
    # gpt-5 / gpt-5.1 / gpt-5.2 / gpt-5-pro / gpt-5-mini / gpt-5.4-mini

    # Strategy: find the last numeric "version" component (with optional dots),
    # everything before it is family, everything after is variant.
    # Allow e.g. "claude-opus-4" (no version dots → version=(4,)) and
    # "claude-opus-4.7" (version=(4,7)).

    # Match: -<num>(.<num>)*(?:-<variant>)?$
    m = re.search(r"-((?:\d+)(?:\.\d+)*)(?:-(.+))?$", name)
    if not m:
        return None
    version_str, variant = m.group(1), (m.group(2) or "")
    family_name = name[: m.start()]
    family_key = f"{vendor}/{family_name}"
    try:
        version_tuple = tuple(int(x) if x.isdigit() else float(x) for x in version_str.split("."))
    except ValueError:
        return None
    return family_key, version_tuple, variant


def parse_date(d):
    """Return YYYY-MM-DD-comparable string, padding partial dates."""
    if not d:
        return None
    if len(d) == 7 and d[4] == "-":  # YYYY-MM
        return d + "-15"  # midpoint
    if len(d) == 4:  # YYYY
        return d + "-06-15"
    return d


def main():
    with open("data/export/models.json") as f:
        ms = json.load(f)
    ms = ms if isinstance(ms, list) else ms.get("models", [])

    # Group by (family_key, variant) — same variant should be monotonic in version
    groups = defaultdict(list)  # (family, variant) -> [(version_tuple, model_id, date)]
    unparsed = []
    for m in ms:
        mid = m.get("id", "")
        rd = m.get("release_date") or m.get("released_at")
        if not rd:
            continue
        parsed = parse_version_tuple(mid)
        if not parsed:
            unparsed.append(mid)
            continue
        family, ver, variant = parsed
        groups[(family, variant)].append((ver, mid, rd))

    # Known legitimate vendor non-sequential numbering. Each entry is a
    # set of (older_id, newer_id) pairs to silently ignore.
    KNOWN_NONSEQUENTIAL = {
        # OpenAI's GPT-4.5 ("Orion", Feb 2025) shipped before GPT-4.1 (Apr 2025)
        ("openai/gpt-4.1", "openai/gpt-4.5"),
        # xAI: Grok 4.20 (4/20 meme, Mar 2026) shipped before Grok 4.3 (May 2026)
        ("xai/grok-4.3", "xai/grok-4.20"),
        # NVIDIA: Nemotron-4 family (2024-06) shipped before Nemotron-3 family
        # (announced 2025-12-15) — NVIDIA reset version numbering with the new
        # Nano/Super/Ultra architecture.
        ("nvidia/nemotron-3-340b", "nvidia/nemotron-4-340b"),
    }

    # For each group, sort by version and check date monotonicity
    contradictions = []
    for (family, variant), entries in groups.items():
        if len(entries) < 2:
            continue
        # Sort by version tuple
        entries.sort(key=lambda x: x[0])
        prev_ver, prev_id, prev_date = entries[0]
        prev_norm = parse_date(prev_date)
        for ver, mid, date in entries[1:]:
            norm = parse_date(date)
            if prev_norm and norm and norm < prev_norm:
                if (prev_id, mid) in KNOWN_NONSEQUENTIAL:
                    pass  # documented vendor non-sequential numbering
                else:
                    contradictions.append({
                        "family": family,
                        "variant": variant,
                        "newer_id": mid,
                        "newer_ver": ver,
                        "newer_date": date,
                        "older_id": prev_id,
                        "older_ver": prev_ver,
                        "older_date": prev_date,
                    })
            # Update only if non-contradicting (else keep prev as anchor)
            prev_ver, prev_id, prev_date, prev_norm = ver, mid, date, norm

    print(f"Total models with release_date: {sum(len(v) for v in groups.values())}")
    print(f"Groups with ≥2 versioned siblings: {sum(1 for v in groups.values() if len(v)>=2)}")
    print(f"Contradictions found: {len(contradictions)}")
    print()
    for c in contradictions:
        variant_str = f" [{c['variant']}]" if c["variant"] else ""
        print(f"  {c['family']}{variant_str}:")
        print(f"    older: {c['older_id']:<45} v={c['older_ver']} date={c['older_date']}")
        print(f"    newer: {c['newer_id']:<45} v={c['newer_ver']} date={c['newer_date']}")
        print()


if __name__ == "__main__":
    main()
