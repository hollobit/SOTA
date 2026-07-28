#!/usr/bin/env python3
"""Benchmark watchlist — surfaces benchmarks that were CAPTURED but need periodic
verification rather than being silently trusted or silently skipped:
  (a) category == 'in-house'  -> vendor-internal, single-source (quarantined)
  (b) model_count == 1        -> single-model, needs an independent 2nd source
Run after each ingest to review candidates for promotion (>=2 independent sources
=> reclassify + add to a suite) or continued watching. Writes a JSON report.
"""
import json, collections, os
EXPORT = os.path.join(os.path.dirname(__file__), '..', 'data', 'export')
def load(p):
    d = json.load(open(os.path.join(EXPORT, p)))
    return d if isinstance(d, list) else d.get(list(d.keys())[0], d)
benches = {b['id']: b for b in load('benchmarks.json')}
scores = load('scores/current.json')
by_bench = collections.defaultdict(set)
for s in scores:
    by_bench[s['benchmark_id']].add(s['model_id'])
inhouse, single = [], []
for bid, b in benches.items():
    n = len(by_bench.get(bid, ()))
    if b.get('category') == 'in-house':
        inhouse.append({'id': bid, 'name': b.get('name'), 'models': n})
    elif n == 1:
        single.append({'id': bid, 'name': b.get('name'), 'category': b.get('category'), 'model': list(by_bench[bid])[0]})
inhouse.sort(key=lambda x: -x['models'])
single.sort(key=lambda x: x['id'])
report = {
    'summary': {'in_house_benchmarks': len(inhouse), 'single_model_benchmarks': len(single),
                'total_benchmarks': len(benches)},
    'in_house': inhouse,
    'single_model': single,
    'note': "in_house: vendor-internal, quarantined from headline whitelists — promote when an independent 2nd source appears. single_model: has only one model's score — needs a 2nd independent source to be comparison-useful.",
}
out = os.path.join(EXPORT, 'reports', 'benchmark_watchlist.json')
json.dump(report, open(out, 'w'), ensure_ascii=False, indent=2)
print(f"in-house benchmarks: {len(inhouse)} | single-model benchmarks: {len(single)} | total: {len(benches)}")
print(f"report -> {out}")
