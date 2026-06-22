/**
 * GraphRAG — client-side semantic + graph-relationship search.
 *
 * Data: fetched as `<base>/graphrag.json` where <base> is `../data` for
 *       local dashboard/ dev (`dashboard/data` symlinks to `../data/export/`)
 *       and `data` for the deployed `public/` directory.
 *   - nodes: model / benchmark / vendor / category
 *   - edges: SCORED_ON / TOP_RANKED_ON / MAKES / IN_CATEGORY /
 *            BENCH_RELATED / SAME_VENDOR_FAMILY
 *   - bm25:  inverted index for sparse retrieval
 *
 * Public API (window.GraphRAG):
 *   - load()                     — fetch & index (idempotent)
 *   - search(q, opts)            — returns ranked entities with neighbors
 *   - render()                   — renders the #tab-graphrag section
 *   - runQuery(q)                — invoked from the global search bar
 *
 * Lazy: graphrag.json is only fetched the first time it's needed.
 */
(function (root) {
    'use strict';

    var GraphRAG = {
        _loaded: false,
        _loading: null,
        _graph: null,
        _byId: null,
        _edgesOut: null,
        _edgesIn: null,
        _stopwords: {
            'the':1,'a':1,'an':1,'and':1,'or':1,'of':1,'in':1,'on':1,'for':1,'to':1,
            'by':1,'with':1,'at':1,'from':1,'is':1,'are':1,'was':1,'were':1,
            'be':1,'this':1,'that':1,'as':1,'it':1,'its':1,'into':1,'via':1,
            'per':1,'also':1,'not':1,'no':1,'new':1,'used':1,'based':1,'both':1
        },

        // Hangul → English alias lexicon. Almost all benchmark descriptions in
        // the corpus are English, so a Korean query like "한국어 의료 시험"
        // would never match. We expand each Hangul token to one or more English
        // tokens before BM25 lookup. A token can map to multiple English aliases
        // (joined by space) — all are added to the token list so any of them
        // can fire on the inverted index.
        _hangulAliases: {
            // Languages / locales
            '한국어':'korean','한국':'korean','한글':'korean','국어':'korean',
            '영어':'english','중국어':'chinese','일본어':'japanese',
            '다국어':'multilingual','다중언어':'multilingual',
            // Domains
            '의료':'medical clinical','의학':'medical','임상':'clinical',
            '간호':'nursing','약학':'pharmacology',
            '시험':'exam qa','문제':'problems','평가':'benchmark eval',
            '벤치마크':'benchmark','데이터셋':'dataset',
            // Math / science
            '수학':'math','산수':'math','수리':'math',
            '올림피아드':'olympiad','올림픽':'olympiad',
            '과학':'science','물리':'physics','화학':'chemistry','생물':'biology',
            // Robotics / physical AI
            '로봇':'robot robotics','로봇공학':'robotics',
            '조작':'manipulation','매니퓰레이션':'manipulation',
            '주행':'navigation driving','자율주행':'driving','내비게이션':'navigation',
            '비전':'vision','vla':'vla',
            // ML
            '모델':'model','오픈소스':'open source','오픈웨이트':'open weights',
            '추론':'reasoning inference','사고':'thinking',
            '코딩':'coding code','코드':'code',
            '에이전트':'agent','에이전트형':'agent','도구':'tool',
            '검색':'search retrieval','리트리벌':'retrieval',
            '임베딩':'embedding','리랭커':'reranker','재정렬':'reranker',
            '컨텍스트':'context','문맥':'context','롱컨텍스트':'long context',
            // Modalities
            '이미지':'image','영상':'video','비디오':'video','음성':'speech audio',
            '오디오':'audio','음악':'music','음원':'audio',
            '챗봇':'chat','대화':'chat',
            // Cyber / safety
            '사이버':'cyber security','보안':'security cyber','해킹':'cyber exploit',
            '취약점':'vulnerability cve','공격':'attack',
            '안전':'safety','정렬':'alignment',
            // Hardware / inference
            '엣지':'edge','온디바이스':'on-device edge','모바일':'mobile edge',
            '양자화':'quantization','추론속도':'inference throughput',
            '토큰':'tokens','속도':'throughput speed',
            '비용':'cost price','가격':'cost price'
        },

        _tokenize: function(q) {
            if (!q) return [];
            var s = q.toLowerCase().replace(/[^a-z0-9가-힣\s\-/.]/g, ' ');
            var out = [];
            var parts = s.split(/\s+/);
            for (var i = 0; i < parts.length; i++) {
                var t = parts[i].replace(/^[\-/.]+|[\-/.]+$/g, '');
                if (!t || t.length < 2 || this._stopwords[t]) continue;
                // Hangul alias expansion: replace Hangul token with its
                // English aliases (still keeping the original for any future
                // direct Hangul match).
                if (/[가-힣]/.test(t) && this._hangulAliases[t]) {
                    out.push(t);
                    var aliases = this._hangulAliases[t].split(/\s+/);
                    for (var j = 0; j < aliases.length; j++) {
                        if (aliases[j]) out.push(aliases[j]);
                    }
                } else {
                    out.push(t);
                }
            }
            return out;
        },

        load: function() {
            if (this._loaded) return Promise.resolve();
            if (this._loading) return this._loading;
            var self = this;
            // Resolve the dashboard's data base path the same way app.js does.
            // - Local dev:  dashboard/index.html, with `data/` symlinked to
            //               `../data/export/`, so `data/graphrag.json` works.
            // - Deployed:   public/index.html with `public/data/` containing
            //               the rsynced export — also `data/graphrag.json`.
            var base = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';
            this._loading = fetch(base + '/graphrag.json')
                .then(function(r) {
                    if (!r.ok) throw new Error('graphrag.json HTTP ' + r.status);
                    return r.json();
                })
                .then(function(g) {
                    self._graph = g;
                    self._byId = {};
                    g.nodes.forEach(function(n) { self._byId[n.id] = n; });
                    self._edgesOut = {};
                    self._edgesIn = {};
                    g.edges.forEach(function(e) {
                        (self._edgesOut[e.from] = self._edgesOut[e.from] || []).push(e);
                        (self._edgesIn[e.to] = self._edgesIn[e.to] || []).push(e);
                    });
                    self._loaded = true;
                    self._loading = null;
                    return g;
                });
            return this._loading;
        },

        search: function(query, opts) {
            opts = opts || {};
            var limit = opts.limit || 30;
            var typeFilter = opts.types || null;
            if (!this._loaded || !this._graph) return [];
            var bm = this._graph.bm25;
            if (!bm) return [];
            var tokens = this._tokenize(query);
            if (tokens.length === 0) return [];

            var scores = {};
            var k1 = bm.k1, b = bm.b, avgdl = bm.avgdl;
            for (var i = 0; i < tokens.length; i++) {
                var t = tokens[i];
                var idf = bm.idf[t];
                if (idf === undefined) continue;
                var posting = bm.inverted[t];
                if (!posting) continue;
                for (var j = 0; j < posting.length; j++) {
                    var docId = posting[j][0];
                    var tf = posting[j][1];
                    var dl = bm.doc_lengths[docId] || avgdl;
                    var denom = tf + k1 * (1 - b + b * dl / avgdl);
                    var s = idf * tf * (k1 + 1) / denom;
                    scores[docId] = (scores[docId] || 0) + s;
                }
            }

            var qLower = query.toLowerCase().trim();
            var self = this;
            Object.keys(scores).forEach(function(nid) {
                var n = self._byId[nid];
                if (!n) return;
                var nameLower = (n.name || n.label || '').toLowerCase();
                if (nameLower.indexOf(qLower) >= 0) scores[nid] *= 1.8;
                if (n.type === 'model') scores[nid] *= 1.1;
            });

            var ranked = Object.keys(scores)
                .map(function(nid) { return { id: nid, score: scores[nid] }; })
                .filter(function(r) {
                    if (!typeFilter) return true;
                    var n = self._byId[r.id];
                    return n && typeFilter.indexOf(n.type) >= 0;
                })
                .sort(function(a, b) { return b.score - a.score; })
                .slice(0, limit);
            return ranked;
        },

        neighbors: function(nodeId, perTypeLimit) {
            perTypeLimit = perTypeLimit || 8;
            var out = {};
            var push = function(typeKey, e, otherId, dir) {
                out[typeKey] = out[typeKey] || [];
                if (out[typeKey].length >= perTypeLimit) return;
                out[typeKey].push({ edge: e, otherId: otherId, dir: dir });
            };
            (this._edgesOut[nodeId] || []).forEach(function(e) { push(e.type, e, e.to, 'out'); });
            (this._edgesIn[nodeId] || []).forEach(function(e) { push(e.type, e, e.from, 'in'); });
            return out;
        },

        render: function() {
            var self = this;
            var container = document.getElementById('graphrag-results');
            if (!container) return;
            // Dispose previous ECharts instance to free WebGL contexts and
            // avoid leaks on re-render with new query.
            if (this._chart) { try { this._chart.dispose(); } catch (e) {} this._chart = null; }
            container.textContent = '';
            if (!this._loaded) {
                container.appendChild(this._loadingNote());
                this.load().then(function() { self.render(); });
                return;
            }
            var meta = this._graph._meta;
            var statsBar = document.createElement('div');
            statsBar.className = 'text-xs text-gray-500 mb-3';
            statsBar.textContent = 'Graph: ' + meta.counts.nodes + ' nodes · ' +
                meta.counts.models + ' models · ' +
                meta.counts.benchmarks + ' benchmarks · ' +
                meta.counts.vendors + ' vendors · ' +
                this._graph.edges.length + ' edges.';
            container.appendChild(statsBar);

            var q = this._lastQuery || '';
            if (!q) {
                container.appendChild(this._helpCard());
                return;
            }
            var results = this.search(q, { limit: 20 });
            if (results.length === 0) {
                var none = document.createElement('div');
                none.className = 'text-sm text-gray-400 p-4';
                none.textContent = 'No results for "' + q + '". Try simpler / fewer keywords.';
                container.appendChild(none);
                return;
            }
            var resHeader = document.createElement('div');
            resHeader.className = 'text-sm text-gray-300 mb-3';
            resHeader.appendChild(document.createTextNode('Results for '));
            var qb = document.createElement('b');
            qb.textContent = q;
            resHeader.appendChild(qb);
            resHeader.appendChild(document.createTextNode(' — ' + results.length + ' entities (BM25-ranked):'));
            container.appendChild(resHeader);

            // Knowledge-graph visualization for the top results + 1-hop
            // neighborhood. Placed above the result cards. Falls back to a
            // text hint if ECharts isn't available.
            container.appendChild(self._buildGraphPanel(results));

            results.forEach(function(r, idx) {
                container.appendChild(self._buildResultCard(r, idx));
            });
        },

        // ─── Knowledge-graph visualization (ECharts force layout) ─────────
        _buildGraphPanel: function(results) {
            var self = this;
            var wrap = document.createElement('div');
            wrap.className = 'bg-gray-900 border border-gray-800 rounded p-3 mb-4';

            var head = document.createElement('div');
            head.className = 'flex items-center justify-between mb-2';
            var title = document.createElement('div');
            title.className = 'text-xs text-gray-400';
            title.textContent = 'Knowledge graph — top results + 1-hop neighbors. Drag nodes to rearrange. Click a node to focus.';
            head.appendChild(title);
            wrap.appendChild(head);

            var div = document.createElement('div');
            div.id = 'graphrag-graph';
            div.style.height = '440px';
            div.style.width = '100%';
            wrap.appendChild(div);

            // Defer init until the container is in the DOM and ECharts has
            // parsed; render once on next animation frame.
            requestAnimationFrame(function() {
                if (typeof echarts === 'undefined') {
                    div.textContent = '(graph view requires ECharts; falling back to result list)';
                    div.style.cssText = 'color:#9ca3af;font-size:11px;padding:8px';
                    return;
                }
                self._renderGraphInto(div, results);
            });
            return wrap;
        },

        // Build the (nodes, edges) payload for the top results + neighbors
        // and instantiate the ECharts force-directed graph.
        _renderGraphInto: function(el, results) {
            var self = this;
            // Pick top N results to seed (don't overwhelm the canvas).
            var seeds = results.slice(0, 5).map(function(r) { return r.id; });
            // Collect nodes — seeds first, then 1-hop neighbors (≤4 per type).
            var nodeMap = {}; // id -> node spec
            seeds.forEach(function(id) { self._addGraphNode(nodeMap, id, true); });
            seeds.forEach(function(id) {
                var nbrs = self.neighbors(id, 4);
                Object.keys(nbrs).forEach(function(t) {
                    nbrs[t].forEach(function(x) { self._addGraphNode(nodeMap, x.otherId, false); });
                });
            });
            // Build edge list. Only emit each undirected edge once.
            var seenEdges = {};
            var edges = [];
            Object.keys(nodeMap).forEach(function(nid) {
                (self._edgesOut[nid] || []).forEach(function(e) {
                    if (!nodeMap[e.to]) return;
                    var k = e.from + '|' + e.to + '|' + e.type;
                    if (seenEdges[k]) return;
                    seenEdges[k] = true;
                    edges.push({
                        source: e.from, target: e.to,
                        value: e.type,
                        lineStyle: { color: self._edgeColor(e.type), width: e.type === 'TOP_RANKED_ON' ? 2 : 1 },
                        label: { show: false, formatter: e.type }
                    });
                });
            });
            var nodes = Object.values(nodeMap);

            // Init ECharts instance (dark theme matches dashboard).
            try {
                var chart = echarts.init(el, 'dark');
                chart.setOption({
                    backgroundColor: 'transparent',
                    tooltip: {
                        formatter: function(p) {
                            if (p.dataType === 'edge') return p.data.value;
                            return p.data.label + '<br/><span style="opacity:.7">' + p.data.type + '</span>';
                        }
                    },
                    legend: [{
                        data: ['model','benchmark','vendor','category'],
                        textStyle: { color: '#9ca3af', fontSize: 10 },
                        top: 4, right: 8, orient: 'horizontal'
                    }],
                    series: [{
                        type: 'graph', layout: 'force',
                        roam: true, draggable: true,
                        symbolSize: function(v, p) { return p.data.symbolSize || 18; },
                        label: {
                            show: true, position: 'right', formatter: '{b}',
                            color: '#e5e7eb', fontSize: 10
                        },
                        force: {
                            repulsion: 220, edgeLength: [50, 130],
                            gravity: 0.05, friction: 0.25, layoutAnimation: true
                        },
                        emphasis: { focus: 'adjacency', lineStyle: { width: 2 } },
                        edgeSymbol: ['none','arrow'], edgeSymbolSize: [4, 6],
                        categories: [
                            { name: 'model',     itemStyle: { color: '#60a5fa' } },
                            { name: 'benchmark', itemStyle: { color: '#34d399' } },
                            { name: 'vendor',    itemStyle: { color: '#c084fc' } },
                            { name: 'category',  itemStyle: { color: '#fbbf24' } }
                        ],
                        data: nodes, links: edges
                    }]
                });
                chart.on('click', function(p) {
                    if (p.dataType === 'node' && p.data && p.data.id) {
                        self._openNode(p.data.id);
                    }
                });
                // Keep a reference for resize / disposal.
                self._chart = chart;
                // Resize on window resize.
                window.addEventListener('resize', function() { try { chart.resize(); } catch(e){} });
            } catch (e) {
                console.warn('graph render failed', e);
                el.textContent = 'Graph render failed: ' + e.message;
            }
        },

        _addGraphNode: function(map, id, isSeed) {
            if (map[id]) {
                if (isSeed) map[id].symbolSize = 28; // promote seed-rank size
                return;
            }
            var n = this._byId[id];
            if (!n) return;
            var catIdx = ({model:0,benchmark:1,vendor:2,category:3})[n.type];
            map[id] = {
                id: id, name: this._labelize(n), label: n.name || n.label || id,
                type: n.type, category: catIdx == null ? 0 : catIdx,
                symbolSize: isSeed ? 28 : 14
            };
        },

        _labelize: function(n) {
            var s = n.name || n.label || n.id || '';
            return s.length > 28 ? (s.slice(0, 25) + '…') : s;
        },

        _edgeColor: function(type) {
            return ({
                TOP_RANKED_ON: '#fbbf24',
                SCORED_ON: '#60a5fa',
                MAKES: '#c084fc',
                IN_CATEGORY: '#f59e0b',
                BENCH_RELATED: '#34d399',
                SAME_VENDOR_FAMILY: '#6b7280'
            })[type] || '#4b5563';
        },

        _helpCard: function() {
            var hint = document.createElement('div');
            hint.className = 'text-sm text-gray-400 p-6 bg-gray-900 rounded border border-gray-800 leading-relaxed';
            var line1 = document.createElement('div');
            line1.textContent = 'Type a question in the global search bar at the top of the page. ' +
                'The query is BM25-matched against model and benchmark names, vendors, categories, and descriptions. ' +
                'Each result also shows its 1-hop neighborhood (vendor · category · top models · related benchmarks).';
            hint.appendChild(line1);
            var line2 = document.createElement('div');
            line2.className = 'mt-3 text-gray-500';
            line2.textContent = 'Examples: ';
            ['korean medical', 'long context', 'opus 4.8 cyber', 'edge slm under 4b',
             'image to video arena', 'usamo 2026 saturation'].forEach(function(ex, i) {
                if (i > 0) line2.appendChild(document.createTextNode(' · '));
                var code = document.createElement('code');
                code.className = 'bg-gray-800 px-1 rounded text-gray-300';
                code.textContent = ex;
                line2.appendChild(code);
            });
            hint.appendChild(line2);
            return hint;
        },

        _loadingNote: function() {
            var n = document.createElement('div');
            n.className = 'text-sm text-gray-400 p-4';
            n.textContent = 'Loading GraphRAG index (~1 MB gzipped)…';
            return n;
        },

        _typeBadge: function(type) {
            var colors = {
                model:     'bg-blue-900 text-blue-200',
                benchmark: 'bg-green-900 text-green-200',
                vendor:    'bg-purple-900 text-purple-200',
                category:  'bg-amber-900 text-amber-200'
            };
            var b = document.createElement('span');
            b.className = 'text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5 ' +
                (colors[type] || 'bg-gray-800 text-gray-300');
            b.textContent = type;
            return b;
        },

        _buildResultCard: function(r, idx) {
            var self = this;
            var node = this._byId[r.id];
            if (!node) {
                var miss = document.createElement('div');
                miss.textContent = 'Missing node ' + r.id;
                return miss;
            }
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded p-3 mb-3';

            var head = document.createElement('div');
            head.className = 'flex items-center gap-2 mb-1';
            head.appendChild(this._typeBadge(node.type));
            var title = document.createElement('div');
            title.className = 'flex-1 font-medium text-gray-100 truncate';
            title.textContent = node.name || node.label || r.id;
            head.appendChild(title);
            var score = document.createElement('span');
            score.className = 'text-[10px] text-gray-500 tabular-nums';
            score.textContent = 'BM25 ' + r.score.toFixed(2);
            head.appendChild(score);
            card.appendChild(head);

            var sub = document.createElement('div');
            sub.className = 'text-xs text-gray-400 mb-2';
            if (node.type === 'model') {
                sub.textContent = (node.vendor || '') + ' · ' + (node.model_type || '') +
                    (node.release_date ? ' · ' + node.release_date : '');
            } else if (node.type === 'benchmark') {
                sub.textContent = (node.category || '') + ' · ' + (node.metric || '') +
                    (node.description ? ' — ' + node.description.slice(0, 160) : '');
            } else if (node.type === 'vendor') {
                sub.textContent = 'Vendor — ' + (this._edgesOut[r.id] || []).length + ' models';
            } else if (node.type === 'category') {
                sub.textContent = 'Benchmark category';
            }
            card.appendChild(sub);

            var nbrs = this.neighbors(r.id, 6);
            var nbrWrap = document.createElement('div');
            nbrWrap.className = 'flex flex-wrap gap-1 mt-1';

            var order = [
                ['TOP_RANKED_ON','Top-ranked on'],
                ['SCORED_ON','Scored on'],
                ['MAKES','Made by'],
                ['IN_CATEGORY','In category'],
                ['BENCH_RELATED','Related benchmarks'],
                ['SAME_VENDOR_FAMILY','Family']
            ];
            order.forEach(function(pair) {
                var typeKey = pair[0];
                var label = pair[1];
                var arr = nbrs[typeKey];
                if (!arr || arr.length === 0) return;
                var line = document.createElement('div');
                line.className = 'w-full text-[11px] text-gray-500 mt-1';
                var lblSpan = document.createElement('span');
                lblSpan.className = 'text-gray-600';
                lblSpan.textContent = label + ':';
                line.appendChild(lblSpan);
                line.appendChild(document.createTextNode(' '));
                arr.forEach(function(item, i) {
                    var other = self._byId[item.otherId];
                    if (!other) return;
                    if (i > 0) line.appendChild(document.createTextNode(' · '));
                    var pill = document.createElement('a');
                    pill.href = '#';
                    pill.className = 'text-blue-300 hover:underline';
                    var lbl = other.name || other.label;
                    if (item.edge.type === 'TOP_RANKED_ON') {
                        lbl = '#' + item.edge.rank + ' ' + lbl + ' (' + item.edge.w + ')';
                    } else if (item.edge.type === 'SCORED_ON') {
                        lbl += ' (' + item.edge.w + ')';
                    }
                    pill.textContent = lbl;
                    pill.addEventListener('click', function(e) {
                        e.preventDefault();
                        self._openNode(item.otherId);
                    });
                    line.appendChild(pill);
                });
                nbrWrap.appendChild(line);
            });
            card.appendChild(nbrWrap);

            head.style.cursor = 'pointer';
            head.title = 'Open detail';
            head.addEventListener('click', function() { self._openNode(r.id); });
            return card;
        },

        _openNode: function(nodeId) {
            var n = this._byId[nodeId];
            if (!n) return;
            if (n.type === 'model' && typeof Modal !== 'undefined' && Modal.showModel) {
                Modal.showModel(n.id.replace(/^model:/, ''));
                return;
            }
            if (n.type === 'benchmark' && typeof Modal !== 'undefined' && Modal.showBenchmark) {
                Modal.showBenchmark(n.id.replace(/^benchmark:/, ''));
                return;
            }
            if (n.type === 'vendor' && typeof Modal !== 'undefined' && Modal.showVendor) {
                Modal.showVendor(n.id.replace(/^vendor:/, ''));
                return;
            }
            this._lastQuery = n.name || n.label || '';
            var inp = document.getElementById('global-search');
            if (inp) inp.value = this._lastQuery;
            this.render();
        },

        runQuery: function(q) {
            this._lastQuery = q;
            if (typeof App !== 'undefined' && App.setTab) {
                App.setTab('graphrag');
            }
            this.render();
        }
    };

    root.GraphRAG = GraphRAG;
})(typeof window !== 'undefined' ? window : this);
