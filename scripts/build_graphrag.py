#!/usr/bin/env python3
"""
Build a lightweight GraphRAG index for the SOTA dashboard.

Produces `data/export/graphrag.json` with:
  - nodes: models, benchmarks, vendors, categories, topic clusters
  - edges: SCORED_ON, MAKES, IN_CATEGORY, TOP_RANKED_ON,
           SAME_VENDOR_FAMILY, BENCH_RELATED (keyword overlap)
  - documents: per-node corpus text (name + description + neighbors)
    used by the client-side BM25-light search.

The output is consumed by `dashboard/js/graphrag.js`.
"""
import json
import re
import sqlite3
import math
from collections import defaultdict, Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB = ROOT / "data" / "benchmark.db"
EXPORT_DIR = ROOT / "data" / "export"
OUT = EXPORT_DIR / "graphrag.json"


STOPWORDS = {
    "the","a","an","and","or","of","in","on","for","to","by","with","at","from",
    "is","are","was","were","be","been","being","this","that","these","those",
    "as","it","its","into","over","under","via","per","also","not","no","new",
    "v1","v2","v3","v4","v5","v6","etc","based","using","used","both","only",
}


def tokenize(text):
    if not text:
        return []
    text = text.lower()
    text = re.sub(r"[^a-z0-9가-힣\s\-/.]", " ", text)
    raw = re.split(r"\s+", text)
    out = []
    for t in raw:
        t = t.strip("-/.")
        if not t or len(t) < 2 or t in STOPWORDS:
            continue
        out.append(t)
        # Also emit sub-tokens split on - / . so hyphenated/dotted names
        # (cxrmate-2, mimic-cxr, cxr-bert, gpt-5.5) are findable by their
        # parts — a query for "CXRMate" must match the node "CXRMate-2".
        if re.search(r"[-/.]", t):
            for sub in re.split(r"[-/.]+", t):
                if len(sub) >= 2 and sub not in STOPWORDS and sub != t:
                    out.append(sub)
    return out


def load_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    models = [dict(r) for r in conn.execute("SELECT * FROM models")]
    benches = [dict(r) for r in conn.execute("SELECT * FROM benchmarks")]
    scores = [dict(r) for r in conn.execute(
        "SELECT model_id, benchmark_id, value, unit, is_sota, source_url, source_type "
        "FROM scores"
    )]
    conn.close()
    return models, benches, scores


def build_graph(models, benches, scores):
    nodes = {}            # node_id -> dict
    edges = []            # list of dicts (from, to, type, weight)
    docs = {}             # node_id -> text corpus

    # --- Vendor nodes ---
    vendors = sorted({m.get("vendor") or "unknown" for m in models})
    for v in vendors:
        nid = f"vendor:{v}"
        nodes[nid] = {
            "id": nid, "type": "vendor", "label": v,
            "name": v, "description": "",
            "neighbors": 0,
        }
        docs[nid] = v.lower()

    # --- Category nodes ---
    categories = sorted({(b.get("category") or "uncategorized") for b in benches})
    for c in categories:
        nid = f"category:{c}"
        nodes[nid] = {
            "id": nid, "type": "category", "label": c,
            "name": c, "description": f"Benchmark category: {c}",
            "neighbors": 0,
        }
        docs[nid] = (c + " benchmark category").lower()

    # --- Model nodes ---
    model_by_id = {}
    for m in models:
        nid = f"model:{m['id']}"
        nodes[nid] = {
            "id": nid, "type": "model",
            "label": m.get("name") or m["id"],
            "name": m.get("name") or m["id"],
            "vendor": m.get("vendor") or "",
            "model_type": m.get("type") or "",
            "release_date": m.get("release_date") or "",
            "description": m.get("description") or "",
            "neighbors": 0,
        }
        docs[nid] = " ".join([
            m.get("name") or "", m["id"], m.get("vendor") or "",
            m.get("type") or "", m.get("description") or "",
        ]).lower()
        model_by_id[m["id"]] = nid
        # MAKES edge
        v = m.get("vendor") or "unknown"
        edges.append({"from": f"vendor:{v}", "to": nid, "type": "MAKES", "w": 1.0})

    # --- Benchmark nodes ---
    bench_by_id = {}
    for b in benches:
        nid = f"benchmark:{b['id']}"
        nodes[nid] = {
            "id": nid, "type": "benchmark",
            "label": b.get("name") or b["id"],
            "name": b.get("name") or b["id"],
            "category": b.get("category") or "",
            "metric": b.get("metric") or "",
            "description": b.get("description") or "",
            "neighbors": 0,
        }
        docs[nid] = " ".join([
            b.get("name") or "", b["id"], b.get("category") or "",
            b.get("metric") or "", b.get("description") or "",
        ]).lower()
        bench_by_id[b["id"]] = nid
        # IN_CATEGORY edge
        c = b.get("category") or "uncategorized"
        edges.append({"from": nid, "to": f"category:{c}", "type": "IN_CATEGORY", "w": 1.0})

    # --- SCORED_ON edges (limit per model + per bench to keep size sane) ---
    by_model = defaultdict(list)
    by_bench = defaultdict(list)
    for s in scores:
        try:
            v = float(s["value"])
        except (TypeError, ValueError):
            continue
        m_nid = model_by_id.get(s["model_id"])
        b_nid = bench_by_id.get(s["benchmark_id"])
        if not m_nid or not b_nid:
            continue
        by_model[m_nid].append((b_nid, v, s))
        by_bench[b_nid].append((m_nid, v, s))

    # SCORED_ON (top-15 per model by value)
    seen_scored = set()
    for m_nid, lst in by_model.items():
        lst.sort(key=lambda x: x[1], reverse=True)
        for b_nid, v, s in lst[:15]:
            key = (m_nid, b_nid)
            if key in seen_scored:
                continue
            seen_scored.add(key)
            edges.append({
                "from": m_nid, "to": b_nid, "type": "SCORED_ON",
                "w": float(v), "is_sota": bool(s.get("is_sota")),
            })

    # TOP_RANKED_ON (top-5 per benchmark)
    for b_nid, lst in by_bench.items():
        lst.sort(key=lambda x: x[1], reverse=True)
        for rank, (m_nid, v, s) in enumerate(lst[:5], start=1):
            edges.append({
                "from": m_nid, "to": b_nid, "type": "TOP_RANKED_ON",
                "w": float(v), "rank": rank,
            })

    # --- BENCH_RELATED (token overlap, top-3 per bench) ---
    bench_tokens = {bid: set(tokenize(docs[bid])) for bid in bench_by_id.values()}
    bench_list = list(bench_by_id.values())
    for i, a in enumerate(bench_list):
        ta = bench_tokens[a]
        if not ta:
            continue
        rel = []
        for b in bench_list:
            if a == b:
                continue
            tb = bench_tokens[b]
            if not tb:
                continue
            inter = len(ta & tb)
            if inter < 3:
                continue
            union = len(ta | tb)
            sim = inter / union if union else 0
            if sim < 0.20:
                continue
            rel.append((b, sim))
        rel.sort(key=lambda x: x[1], reverse=True)
        for b, sim in rel[:3]:
            edges.append({
                "from": a, "to": b, "type": "BENCH_RELATED",
                "w": round(sim, 3),
            })

    # --- SAME_VENDOR_FAMILY for models sharing vendor + prefix ---
    family_groups = defaultdict(list)
    for m in models:
        v = m.get("vendor") or "unknown"
        name = (m.get("name") or m["id"]).lower()
        # family token = first word before space/dash/digit
        m_fam = re.match(r"^([a-z]+)", name)
        fam = m_fam.group(1) if m_fam else name[:6]
        family_groups[(v, fam)].append(f"model:{m['id']}")
    for (v, fam), members in family_groups.items():
        if len(members) < 2:
            continue
        # connect each member to the first (representative) — light star topology
        rep = members[0]
        for other in members[1:]:
            edges.append({
                "from": rep, "to": other, "type": "SAME_VENDOR_FAMILY",
                "w": 0.5, "family": fam,
            })

    # --- Topic clusters: top frequent bigrams from bench descriptions ---
    # lightweight; just expose category counts as topic anchors
    cat_counts = Counter()
    for b in benches:
        c = b.get("category")
        if c:
            cat_counts[c] += 1

    # --- Update node neighbor counts ---
    deg = Counter()
    for e in edges:
        deg[e["from"]] += 1
        deg[e["to"]] += 1
    for nid, n in nodes.items():
        n["neighbors"] = deg[nid]

    # --- BM25 index pre-computation (light) ---
    # Build df + token freq per doc for client-side BM25.
    df = Counter()
    doc_tokens = {}
    for nid, text in docs.items():
        toks = tokenize(text)
        doc_tokens[nid] = toks
        for t in set(toks):
            df[t] += 1
    N = len(doc_tokens)
    avgdl = sum(len(v) for v in doc_tokens.values()) / max(N, 1)
    # idf
    idf = {t: math.log((N - cnt + 0.5) / (cnt + 0.5) + 1.0) for t, cnt in df.items()}
    # Keep every term that appears at least twice. Cap to top 12000 by idf to
    # bound payload. We deliberately do NOT drop high-df common words — names
    # like "korean", "long", "image", "video", "arena" appear in many
    # benchmarks but are exactly what users search for. The earlier <0.3*N
    # filter killed BM25 for common natural-language queries.
    filtered = {t: v for t, v in idf.items() if df[t] >= 2}
    top_terms = sorted(filtered.items(), key=lambda x: x[1], reverse=True)[:12000]
    idf = dict(top_terms)
    vocab = set(idf.keys())
    # Inverted index: term -> [(doc_id, tf_int), ...] keeps payload smaller
    # than per-doc dict-of-tf for long-tail vocab. We still emit doc lengths.
    inverted = defaultdict(list)
    doc_lengths = {}
    for nid, toks in doc_tokens.items():
        if len(toks) < 1:
            continue
        tf = Counter(t for t in toks if t in vocab)
        if not tf:
            continue
        doc_lengths[nid] = len(toks)
        for t, c in tf.items():
            inverted[t].append([nid, c])
    # Sort posting lists by doc_id for determinism.
    for t in inverted:
        inverted[t].sort()

    return {
        "_meta": {
            "schema": "graphrag-v1",
            "generated_at": Path(__file__).stat().st_mtime,
            "counts": {
                "nodes": len(nodes),
                "edges": len(edges),
                "models": sum(1 for n in nodes.values() if n["type"] == "model"),
                "benchmarks": sum(1 for n in nodes.values() if n["type"] == "benchmark"),
                "vendors": sum(1 for n in nodes.values() if n["type"] == "vendor"),
                "categories": sum(1 for n in nodes.values() if n["type"] == "category"),
            },
            "categories": dict(cat_counts.most_common(50)),
        },
        "nodes": list(nodes.values()),
        "edges": edges,
        "bm25": {
            "N": N,
            "avgdl": avgdl,
            "k1": 1.5,
            "b": 0.75,
            "idf": idf,
            "doc_lengths": doc_lengths,
            "inverted": dict(inverted),
        },
    }


def main():
    models, benches, scores = load_db()
    print(f"Loaded {len(models)} models / {len(benches)} benches / {len(scores)} scores")
    graph = build_graph(models, benches, scores)
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    with OUT.open("w") as f:
        json.dump(graph, f, separators=(",", ":"))
    sz = OUT.stat().st_size
    print(f"Wrote {OUT}  ({sz/1024:.1f} KB)")
    print(f"  nodes={graph['_meta']['counts']['nodes']}  edges={graph['_meta']['counts']['edges']}")
    print(f"  BM25: N={graph['bm25']['N']}  avgdl={graph['bm25']['avgdl']:.1f}  vocab={len(graph['bm25']['idf'])}  inverted_terms={len(graph['bm25']['inverted'])}")


if __name__ == "__main__":
    main()
