#!/usr/bin/env python3
"""Auto-extract enrichment from seed file _note fields.

Reads all resource/*_scores.json files. For each model entry, scans
the model-level _note + the seed file's _meta._note for regex
patterns identifying architecture (params, MoE, attention),
training (phases, tokens), and known links (HF, arxiv, blog).

Also reads structured model fields:
  - parameters (string like "519B (33B active MoE)")
  - params_b / active_params_b (numeric)
  - languages (list)
  - context_window (int)
  - knowledge_cutoff (str)

Writes config/model_enrichment_auto.yaml. The exporter merges this
with config/model_enrichment.yaml (manual takes precedence).

This is v1.5 of the enrichment rollout — covers gaps that hand-curation
hasn't filled. Updates as new seed files land.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

SEED_DIR = Path("resource")
OUT_FILE = Path("config/model_enrichment_auto.yaml")
MANUAL_FILE = Path("config/model_enrichment.yaml")


# ----- regex patterns for free-form _note fields -----

# Matches patterns like:
#   "519B (33B active MoE)"   -> total=519, active=33
#   "236B (23B active MoE)"   -> total=236, active=23
#   "31.7B LM"                -> total=31.7
#   "33B params"              -> total=33
PARAM_WITH_ACTIVE_PATTERN = re.compile(
    r"(\d+(?:\.\d+)?)\s*B[^a-zA-Z]*?\((\d+(?:\.\d+)?)\s*B\s*active",
    re.IGNORECASE,
)
PARAM_TOTAL_ACTIVE_ALT = re.compile(
    r"total\s+(\d+(?:\.\d+)?)\s*B[^a-zA-Z]+(\d+(?:\.\d+)?)\s*B\s*active",
    re.IGNORECASE,
)
# "33B-A3B" style (e.g. "30B-A3B Thinking" → total=30, active=3)
PARAM_DASH_ACTIVE = re.compile(
    r"(\d+(?:\.\d+)?)B-A(\d+(?:\.\d+)?)B",
    re.IGNORECASE,
)
PARAM_SIMPLE = re.compile(r"(\d+(?:\.\d+)?)\s*B(?:\s*(?:params?|total))?", re.IGNORECASE)

ARCH_TYPE_PATTERNS = {
    "moe": re.compile(r"\b(MoE|Mixture[\s-]of[\s-]Experts)\b", re.IGNORECASE),
    "dense": re.compile(r"\b(dense|standard transformer)\b", re.IGNORECASE),
}

ATTENTION_PATTERNS = {
    "mla": re.compile(r"\b(MLA|Multi[\s-]Latent[\s-]Attention)\b", re.IGNORECASE),
    "gqa": re.compile(r"\b(GQA|Grouped[\s-]Query[\s-]Attention)\b", re.IGNORECASE),
    "mqa": re.compile(r"\b(MQA|Multi[\s-]Query[\s-]Attention)\b", re.IGNORECASE),
    "sliding_window": re.compile(r"\b(SWA|Sliding[\s-]Window[\s-]Attention)\b", re.IGNORECASE),
    "hybrid_swa_global": re.compile(
        r"hybrid[\s\-]attention.*?\(SWA.*?Global\)|hybrid.*?SWA.*?Global",
        re.IGNORECASE,
    ),
}

EXPERTS_PATTERN = re.compile(
    r"(\d+)\s*experts?(?:\s*total)?\b.*?(?:(\d+)\s*active\b)?",
    re.IGNORECASE,
)

PRETRAIN_TOKENS_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*T\s*(?:tokens?|pretrain)", re.IGNORECASE)
COMPUTE_FLOPS_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*[eE](\d+)\s*FLOPs", re.IGNORECASE)
CONTEXT_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*K\s*(?:ctx|context)", re.IGNORECASE)

LINK_PATTERNS = {
    "huggingface": re.compile(r"(https?://huggingface\.co/[^\s\"\']+)"),
    "paper": re.compile(
        r"(?:arxiv\s+|arxiv:|http://arxiv\.org/abs/|https://arxiv\.org/abs/)(\d{4}\.\d{4,5})",
        re.IGNORECASE,
    ),
    "github": re.compile(r"(https?://github\.com/[^\s\"\']+)"),
    "blog": re.compile(
        r"(https?://(?:www\.)?(?:lgresearch|aisi|anthropic|openai|deepseek|moonshot)\.[^\s\"\']+/blog[^\s\"\']*)",
        re.IGNORECASE,
    ),
}

LANG_PATTERN = re.compile(r"(\d+)\s*(?:languages?|langs?)\s*(?:\(([^)]+)\))?", re.IGNORECASE)

# Model name/id patterns to infer architecture
# Matches "34B", "9B", "1.5B", "100B" etc in model name
NAME_PARAM_PATTERN = re.compile(r"(\d+(?:\.\d+)?)\s*B(?:-A(\d+(?:\.\d+)?)B)?", re.IGNORECASE)
# Matches "8x7B" style MoE — NxMB
NAME_MOE_NxM_PATTERN = re.compile(r"(\d+)x(\d+(?:\.\d+)?)B", re.IGNORECASE)
# "A3B" style active param suffix in name (e.g. "35B-A3B")
NAME_ACTIVE_SUFFIX = re.compile(r"\bA(\d+(?:\.\d+)?)B\b", re.IGNORECASE)


def _extract_from_name(name: str, model_id: str) -> dict:
    """Extract architecture hints from model name and ID strings.

    These are lower-confidence signals (name-based inference), used when
    no direct note text or parameters field is available.
    """
    result: dict = {}
    if not name:
        return result

    # NxMB style MoE (e.g. "Mixtral 8x7B")
    m = NAME_MOE_NxM_PATTERN.search(name) or NAME_MOE_NxM_PATTERN.search(model_id)
    if m:
        try:
            n_experts = int(m.group(1))
            expert_size_b = float(m.group(2))
            total_b = n_experts * expert_size_b
            result["total_params_b"] = round(total_b, 1)
            result["experts_total"] = n_experts
            result["type"] = "moe"
        except ValueError:
            pass
        return result

    # Standard "NNB-AXB" or "NNB" pattern
    m = NAME_PARAM_PATTERN.search(name)
    if m:
        try:
            result["total_params_b"] = float(m.group(1))
            if m.group(2):
                result["active_params_b"] = float(m.group(2))
                result["type"] = "moe"
        except ValueError:
            pass

    # Infer MoE from "MoE" or "-A" suffix in name/id
    if re.search(r"\bMoE\b", name, re.IGNORECASE) or re.search(r"\bMoE\b", model_id, re.IGNORECASE):
        result["type"] = "moe"

    return result


def _parse_params_string(s: str) -> dict:
    """Parse a parameters string like '519B (33B active MoE)' or '236B-A23B'.

    Returns a dict with subset of: total_params_b, active_params_b, type.
    """
    result: dict = {}
    if not s or not isinstance(s, str):
        return result

    # Try "X B (Y B active [MoE])" pattern first
    m = PARAM_WITH_ACTIVE_PATTERN.search(s)
    if m:
        try:
            result["total_params_b"] = float(m.group(1))
            result["active_params_b"] = float(m.group(2))
        except ValueError:
            pass

    # "XB-AYB" style e.g. "30B-A3B"
    if not result:
        m = PARAM_DASH_ACTIVE.search(s)
        if m:
            try:
                result["total_params_b"] = float(m.group(1))
                result["active_params_b"] = float(m.group(2))
            except ValueError:
                pass

    # Simple "NNB" fallback
    if not result:
        m = PARAM_SIMPLE.search(s)
        if m:
            try:
                result["total_params_b"] = float(m.group(1))
            except ValueError:
                pass

    # Infer MoE type from the string
    if "MoE" in s or "active" in s.lower():
        result["type"] = "moe"
    elif "dense" in s.lower():
        result["type"] = "dense"

    return result


def extract_one(text: str) -> dict:
    """Extract enrichment fields from a single _note text."""
    out: dict = {}
    if not text or not isinstance(text, str):
        return out

    # Architecture
    arch_obj: dict = {}

    # Params: try patterns in priority order
    m = PARAM_WITH_ACTIVE_PATTERN.search(text)
    if m:
        try:
            arch_obj["total_params_b"] = float(m.group(1))
            arch_obj["active_params_b"] = float(m.group(2))
        except ValueError:
            pass
    else:
        m2 = PARAM_TOTAL_ACTIVE_ALT.search(text)
        if m2:
            try:
                arch_obj["total_params_b"] = float(m2.group(1))
                arch_obj["active_params_b"] = float(m2.group(2))
            except ValueError:
                pass
        else:
            m3 = PARAM_DASH_ACTIVE.search(text)
            if m3:
                try:
                    arch_obj["total_params_b"] = float(m3.group(1))
                    arch_obj["active_params_b"] = float(m3.group(2))
                except ValueError:
                    pass
            else:
                m4 = PARAM_SIMPLE.search(text)
                if m4:
                    try:
                        arch_obj["total_params_b"] = float(m4.group(1))
                    except ValueError:
                        pass

    for arch_name, pat in ARCH_TYPE_PATTERNS.items():
        if pat.search(text):
            arch_obj["type"] = arch_name
            break

    for att_name, pat in ATTENTION_PATTERNS.items():
        if pat.search(text):
            arch_obj["attention"] = att_name
            break

    em = EXPERTS_PATTERN.search(text)
    if em:
        try:
            total = int(em.group(1))
            active_str = em.group(2)
            arch_obj["experts_total"] = total
            if active_str:
                arch_obj["experts_active"] = int(active_str)
        except (ValueError, AttributeError):
            pass

    if arch_obj:
        out["architecture"] = arch_obj

    # Training
    train_obj: dict = {}
    pt = PRETRAIN_TOKENS_PATTERN.search(text)
    if pt:
        train_obj["pretrain_tokens"] = pt.group(1) + "T"
    cf = COMPUTE_FLOPS_PATTERN.search(text)
    if cf:
        try:
            train_obj["compute_flops"] = f"{cf.group(1)}e{cf.group(2)}"
        except (ValueError, IndexError):
            pass
    if train_obj:
        out["training"] = train_obj

    # Links
    links_obj: dict = {}
    for link_name, pat in LINK_PATTERNS.items():
        match = pat.search(text)
        if match:
            if link_name == "paper":
                url = f"https://arxiv.org/abs/{match.group(1)}"
            else:
                url = match.group(1)
            links_obj[link_name] = url
    if links_obj:
        out["links"] = links_obj

    # Languages count + list
    lm = LANG_PATTERN.search(text)
    if lm:
        try:
            count = int(lm.group(1))
            langs_text = lm.group(2)
            if langs_text:
                langs = re.split(r"[/,]", langs_text)
                langs = [lang.strip().lower() for lang in langs if lang.strip()]
                if 1 <= len(langs) <= count + 2:  # sanity
                    out["languages_extracted"] = langs
        except (ValueError, AttributeError):
            pass

    return out


def _merge_arch(base: dict, override: dict) -> dict:
    """Merge two arch dicts — override fills gaps in base."""
    result = dict(base)
    for k, v in override.items():
        if k not in result:
            result[k] = v
    return result


def main() -> int:
    seeds = sorted(SEED_DIR.glob("*_scores*.json"))
    if not seeds:
        print(f"[auto-enrich] no seed files in {SEED_DIR}", file=sys.stderr)
        return 1

    # Load manual enrichment to know what NOT to override
    manual_models: set = set()
    if MANUAL_FILE.exists():
        try:
            doc = yaml.safe_load(MANUAL_FILE.read_text()) or {}
            manual_models = set((doc.get("models") or {}).keys())
            print(f"[auto-enrich] manual covers {len(manual_models)} models", file=sys.stderr)
        except Exception as e:
            print(f"[auto-enrich] couldn't read manual: {e}", file=sys.stderr)

    auto_models: dict = {}
    skipped_count = 0

    for seed_file in seeds:
        try:
            data = json.loads(seed_file.read_text())
        except json.JSONDecodeError:
            continue

        meta_note = (data.get("_meta") or {}).get("_note") or ""
        scores = data.get("scores", []) or []
        models_listed = data.get("models", []) or []

        # Aggregate per-model text AND structured fields
        per_model_texts: dict = {}
        per_model_structured: dict = {}

        for m in models_listed:
            mid = m.get("id")
            if not mid:
                continue
            text = " ".join(filter(None, [
                m.get("_note", ""),
                m.get("description", ""),
                m.get("notes", ""),
            ]))
            per_model_texts.setdefault(mid, []).append(text)

            # Structured fields — extract directly from model entry
            structured: dict = {}
            params_str = m.get("parameters")
            if params_str:
                parsed = _parse_params_string(str(params_str))
                if parsed:
                    structured.setdefault("architecture", {}).update(parsed)

            params_b = m.get("params_b")
            if params_b is not None:
                try:
                    structured.setdefault("architecture", {})["total_params_b"] = float(params_b)
                except (ValueError, TypeError):
                    pass

            active_b = m.get("active_params_b")
            if active_b is not None:
                try:
                    structured.setdefault("architecture", {})["active_params_b"] = float(active_b)
                    structured.setdefault("architecture", {}).setdefault("type", "moe")
                except (ValueError, TypeError):
                    pass

            langs = m.get("languages")
            if langs and isinstance(langs, list) and len(langs) > 0:
                structured["languages"] = langs

            ctx = m.get("context_window")
            if ctx is not None:
                try:
                    structured["context_window"] = int(ctx)
                except (ValueError, TypeError):
                    pass

            cutoff = m.get("knowledge_cutoff")
            if cutoff:
                structured["knowledge_cutoff"] = str(cutoff)

            # Name-based inference (lowest confidence) — fills total_params_b if nothing
            # more authoritative is available. Applied only when structured arch is absent.
            model_name = m.get("name", "")
            if model_name and "architecture" not in structured:
                name_arch = _extract_from_name(model_name, mid)
                if name_arch:
                    structured["architecture"] = name_arch
                    structured["_arch_source"] = "name_inference"

            if structured:
                per_model_structured[mid] = structured

        # Also scan scores for model-specific notes (skip — mostly test conditions)
        # per the analysis, score _notes are about test conditions not architecture

        # Add the file-level meta note to each mentioned model (often contains arch info)
        if meta_note:
            for mid in per_model_texts:
                per_model_texts[mid].append(meta_note)

        # Extract per model — text + structured
        for mid in set(list(per_model_texts.keys()) + list(per_model_structured.keys())):
            if mid in manual_models:
                skipped_count += 1
                continue

            # Start with structured (most reliable)
            merged = dict(per_model_structured.get(mid) or {})

            # Layer on regex-extracted from notes
            texts = per_model_texts.get(mid) or []
            combined_text = " ".join(texts)
            extracted = extract_one(combined_text)

            for k, v in extracted.items():
                if k == "architecture" and "architecture" in merged:
                    # Merge arch — structured wins per-field
                    merged["architecture"] = _merge_arch(merged["architecture"], v)
                elif k not in merged:
                    merged[k] = v
                elif isinstance(v, dict) and isinstance(merged[k], dict):
                    for sk, sv in v.items():
                        merged[k].setdefault(sk, sv)

            if not merged:
                continue

            # Merge into auto_models — first-seen wins to avoid late-loading overwriting earlier
            existing = auto_models.get(mid, {})
            for k, v in merged.items():
                if k not in existing:
                    existing[k] = v
                elif k == "architecture" and isinstance(v, dict) and isinstance(existing[k], dict):
                    existing[k] = _merge_arch(existing[k], v)
                elif isinstance(v, dict) and isinstance(existing[k], dict):
                    for sk, sv in v.items():
                        existing[k].setdefault(sk, sv)
            auto_models[mid] = existing

    # Write the auto YAML
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    out_doc = {
        "schema_version": "1.0-auto",
        "_meta": {
            "generated_by": "scripts/extract_enrichment_from_notes.py",
            "covered_models": len(auto_models),
            "skipped_in_manual": skipped_count,
        },
        "models": auto_models,
    }
    OUT_FILE.write_text(yaml.safe_dump(out_doc, sort_keys=False, allow_unicode=True))
    print(
        f"[auto-enrich] wrote {OUT_FILE}: {len(auto_models)} models extracted, "
        f"{skipped_count} skipped (manual)",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
