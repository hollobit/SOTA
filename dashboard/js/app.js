/**
 * Main application: data loading, tab routing, rendering.
 * Uses safe DOM methods (createElement + textContent) for all dynamic content.
 */
var App = {
    data: {
        models: [],
        benchmarks: [],
        scores: [],
        sota: {},
        leaderboards: {},
        changelog: [],
        history: {}
    },

    // Leaderboard sort state
    _lbSort: { column: 'value', ascending: false },

    init: function() {
        var self = this;
        this.loadData().then(function() {
            self.setupTabs();
            self.setupFilters();
            self.setupExplorer();
            Comparison.init(self.data.models, self.data.benchmarks, self.data.scores);
            CyberCoding.init(self.data.models, self.data.benchmarks, self.data.scores);
            Modal.init();
            // Frontier Compare category filter
            var fcCat = document.getElementById('fc-category');
            var fcBtn = document.getElementById('fc-render');
            if (fcCat && fcBtn) {
                fcBtn.addEventListener('click', function() {
                    FrontierCompare.render(fcCat.value);
                });
            }
            self.renderOverview();
        });
    },

    loadData: function() {
        var self = this;
        var base = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';

        return Promise.all([
            this._fetch(base + '/models.json'),
            this._fetch(base + '/benchmarks.json'),
            this._fetch(base + '/scores/current.json'),
            this._fetch(base + '/sota.json')
        ]).then(function(results) {
            self.data.models = results[0] || [];
            self.data.benchmarks = results[1] || [];
            self.data.scores = results[2] || [];
            self.data.sota = results[3] || {};
            window._benchmarks = self.data.benchmarks;

            document.getElementById('model-count').textContent = self.data.models.length;
            document.getElementById('benchmark-count').textContent = self.data.benchmarks.length;

            if (self.data.scores.length > 0) {
                var latest = self.data.scores.reduce(function(max, s) {
                    return s.collected_at > max ? s.collected_at : max;
                }, '');
                document.getElementById('last-updated').textContent = latest;
            }

            return self._fetch(base + '/reports/changelog.json');
        }).then(function(changelog) {
            self.data.changelog = changelog || [];

            var boardNames = ['chatbot-arena', 'open-llm', 'seal'];
            var base2 = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';
            return Promise.all(boardNames.map(function(name) {
                return self._fetch(base2 + '/leaderboards/' + name + '.json').then(function(data) {
                    if (data) self.data.leaderboards[name] = data;
                });
            }));
        });
    },

    _fetch: function(url) {
        return fetch(url).then(function(resp) {
            if (!resp.ok) return null;
            return resp.json();
        }).catch(function() { return null; });
    },

    setupTabs: function() {
        var self = this;
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
                document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.add('hidden'); });
                btn.classList.add('active');
                var tab = document.getElementById('tab-' + btn.dataset.tab);
                if (tab) tab.classList.remove('hidden');
                if (btn.dataset.tab === 'trends') self.renderTrends();
                if (btn.dataset.tab === 'leaderboard') self.renderLeaderboard();
                if (btn.dataset.tab === 'comparison') Comparison.render();
                if (btn.dataset.tab === 'frontier-compare') FrontierCompare.render(document.getElementById('fc-category').value);
                if (btn.dataset.tab === 'cyber-coding') CyberCoding.render();
                if (btn.dataset.tab === 'resources') self.renderResources();
                if (btn.dataset.tab === 'changelog') self.renderChangelog();
            });
        });
    },

    setupFilters: function() {
        var self = this;
        var categories = {};
        this.data.benchmarks.forEach(function(b) { categories[b.category] = true; });
        var catSelect = document.getElementById('filter-category');
        Object.keys(categories).forEach(function(c) {
            var opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            catSelect.appendChild(opt);
        });

        var sources = {};
        this.data.scores.forEach(function(s) {
            if (s.source && s.source.type) sources[s.source.type] = true;
        });
        var srcSelect = document.getElementById('filter-source');
        Object.keys(sources).forEach(function(s) {
            var opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            srcSelect.appendChild(opt);
        });

        var trendBench = document.getElementById('trend-benchmark');
        this.data.benchmarks.forEach(function(b) {
            var opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            trendBench.appendChild(opt);
        });

        ['filter-category', 'filter-type', 'filter-source', 'filter-search'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function() { self.renderLeaderboard(); });
                el.addEventListener('input', function() { self.renderLeaderboard(); });
            }
        });

        // Trends tab filters
        var trendBenchSel = document.getElementById('trend-benchmark');
        var trendPeriod = document.getElementById('trend-period');
        if (trendBenchSel) {
            trendBenchSel.addEventListener('change', function() { self.renderTrends(); });
        }
        if (trendPeriod) {
            trendPeriod.addEventListener('change', function() { self.renderTrends(); });
        }
    },

    setupExplorer: function() {
        var self = this;
        var selA = document.getElementById('compare-model-a');
        var selB = document.getElementById('compare-model-b');
        this.data.models.forEach(function(m) {
            var optA = document.createElement('option');
            optA.value = m.id;
            optA.textContent = m.name + ' (' + m.vendor + ')';
            selA.appendChild(optA);

            var optB = document.createElement('option');
            optB.value = m.id;
            optB.textContent = m.name + ' (' + m.vendor + ')';
            selB.appendChild(optB);
        });

        var btn = document.getElementById('compare-btn');
        if (btn) {
            btn.addEventListener('click', function() {
                var a = selA.value;
                var b = selB.value;
                if (a && b) {
                    var result = Explorer.compare(a, b, self.data.scores);
                    Explorer.renderComparison('comparison-result', a, b, result);
                }
            });
        }
    },

    renderOverview: function() {
        this._renderSOTATable();
        this._renderLeaderboardCards();
        this._renderRecentChanges();
    },

    _renderSOTATable: function() {
        var container = document.getElementById('sota-table-container');
        container.textContent = '';
        var table = document.createElement('table');
        table.className = 'sota-table';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['Benchmark', 'Category', 'SOTA Model', 'Score'].forEach(function(text) {
            var th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var self = this;
        var entries = Object.keys(this.data.sota).sort();
        entries.forEach(function(benchId) {
            var info = self.data.sota[benchId];
            var bench = self.data.benchmarks.find(function(b) { return b.id === benchId; });
            var tr = document.createElement('tr');

            var tdName = document.createElement('td');
            var strong = document.createElement('strong');
            strong.textContent = bench ? bench.name : benchId;
            strong.className = 'cursor-pointer hover:text-blue-400 transition';
            strong.onclick = (function(bid) { return function() { Modal.showBenchmark(bid); }; })(benchId);
            tdName.appendChild(strong);
            tr.appendChild(tdName);

            var tdCat = document.createElement('td');
            var badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = bench ? bench.category : '\u2014';
            tdCat.appendChild(badge);
            tr.appendChild(tdCat);

            var tdModel = document.createElement('td');
            var modelLink = document.createElement('span');
            modelLink.textContent = info.model_id.split('/').pop();
            modelLink.className = 'cursor-pointer hover:text-blue-400 transition';
            modelLink.onclick = (function(mid) { return function() { Modal.showModel(mid); }; })(info.model_id);
            tdModel.appendChild(modelLink);
            tr.appendChild(tdModel);

            var tdScore = document.createElement('td');
            var sotaBadge = document.createElement('span');
            sotaBadge.className = 'badge badge-sota';
            sotaBadge.textContent = info.value + (info.unit || '');
            tdScore.appendChild(sotaBadge);
            tr.appendChild(tdScore);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    },

    _renderLeaderboardCards: function() {
        var container = document.getElementById('leaderboard-cards');
        container.textContent = '';
        var boards = Object.keys(this.data.leaderboards);
        if (boards.length === 0) {
            var p = document.createElement('p');
            p.className = 'text-gray-500';
            p.textContent = 'No leaderboard data';
            container.appendChild(p);
            return;
        }
        boards.forEach(function(name) {
            var entries = this.data.leaderboards[name];
            var card = document.createElement('div');
            card.className = 'leaderboard-card';

            var h3 = document.createElement('h3');
            h3.className = 'font-semibold text-sm text-gray-300 mb-2';
            h3.textContent = name;
            card.appendChild(h3);

            entries.slice(0, 5).forEach(function(e) {
                var row = document.createElement('div');
                row.className = 'flex justify-between text-sm py-1';
                var left = document.createElement('span');
                left.textContent = '#' + e.rank + ' ' + e.model_id.split('/').pop();
                var right = document.createElement('span');
                right.className = 'text-gray-400';
                right.textContent = e.score + ' ' + e.metric;
                row.appendChild(left);
                row.appendChild(right);
                card.appendChild(row);
            });

            container.appendChild(card);
        }.bind(this));
    },

    _renderRecentChanges: function() {
        var container = document.getElementById('recent-changes');
        container.textContent = '';
        if (!this.data.changelog.length) {
            var p = document.createElement('p');
            p.className = 'text-gray-500';
            p.textContent = 'No changes recorded yet.';
            container.appendChild(p);
            return;
        }
        this.data.changelog.forEach(function(change) {
            var card = document.createElement('div');
            card.className = 'change-card';
            var text = change.type + ': ' + change.benchmark_id +
                       ' \u2014 ' + change.new_model + ' (' + change.new_value + ')';
            if (change.old_value) {
                text += ' prev: ' + change.old_model + ' (' + change.old_value + ')';
            }
            card.textContent = text;
            container.appendChild(card);
        });
    },

    renderLeaderboard: function() {
        var filters = {
            category: document.getElementById('filter-category').value,
            modelType: document.getElementById('filter-type').value,
            source: document.getElementById('filter-source').value,
            search: document.getElementById('filter-search').value
        };

        var filtered = Filters.apply(this.data.scores, this.data.models, filters);

        // Sort by current column
        var col = this._lbSort.column;
        var asc = this._lbSort.ascending;
        var self = this;
        filtered.sort(function(a, b) {
            var va, vb;
            if (col === 'model') { va = a.model_id.toLowerCase(); vb = b.model_id.toLowerCase(); }
            else if (col === 'benchmark') { va = a.benchmark_id.toLowerCase(); vb = b.benchmark_id.toLowerCase(); }
            else if (col === 'value') { va = a.value; vb = b.value; }
            else if (col === 'source') { va = (a.source && a.source.type) || ''; vb = (b.source && b.source.type) || ''; }
            else if (col === 'date') { va = a.collected_at || ''; vb = b.collected_at || ''; }
            else { va = a.value; vb = b.value; }
            if (va < vb) return asc ? -1 : 1;
            if (va > vb) return asc ? 1 : -1;
            return 0;
        });

        var container = document.getElementById('leaderboard-table-container');
        container.textContent = '';

        var table = document.createElement('table');
        table.className = 'sota-table';

        // Sortable header
        var columns = [
            { key: 'model', label: 'Model' },
            { key: 'benchmark', label: 'Benchmark' },
            { key: 'value', label: 'Score' },
            { key: 'source', label: 'Source' },
            { key: 'date', label: 'Date' }
        ];
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        columns.forEach(function(c) {
            var th = document.createElement('th');
            th.className = 'sortable';
            th.textContent = c.label;
            if (self._lbSort.column === c.key) {
                var arrow = document.createElement('span');
                arrow.className = 'sort-arrow ' + (self._lbSort.ascending ? 'asc' : 'desc');
                th.appendChild(arrow);
            }
            th.addEventListener('click', function() {
                if (self._lbSort.column === c.key) {
                    self._lbSort.ascending = !self._lbSort.ascending;
                } else {
                    self._lbSort.column = c.key;
                    self._lbSort.ascending = c.key === 'value' ? false : true;
                }
                self.renderLeaderboard();
            });
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        filtered.slice(0, 200).forEach(function(s) {
            var model = self.data.models.find(function(m) { return m.id === s.model_id; });
            var tr = document.createElement('tr');

            var tdModel = document.createElement('td');
            tdModel.textContent = s.model_id.split('/').pop();
            if (model) {
                var badge = document.createElement('span');
                badge.className = 'badge badge-' + model.type;
                badge.textContent = ' ' + model.type;
                tdModel.appendChild(document.createTextNode(' '));
                tdModel.appendChild(badge);
            }
            tr.appendChild(tdModel);

            var tdBench = document.createElement('td');
            tdBench.textContent = s.benchmark_id.toUpperCase();
            tr.appendChild(tdBench);

            var tdScore = document.createElement('td');
            if (s.is_sota) {
                var sotaBadge = document.createElement('span');
                sotaBadge.className = 'badge badge-sota';
                sotaBadge.textContent = 'SOTA';
                tdScore.appendChild(sotaBadge);
                tdScore.appendChild(document.createTextNode(' '));
            }
            tdScore.appendChild(document.createTextNode(s.value));
            tr.appendChild(tdScore);

            var tdSrc = document.createElement('td');
            tdSrc.textContent = (s.source && s.source.type) || '\u2014';
            tr.appendChild(tdSrc);

            var tdDate = document.createElement('td');
            tdDate.className = 'text-gray-400';
            tdDate.textContent = s.collected_at;
            tr.appendChild(tdDate);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);

        if (sorted.length > 200) {
            var note = document.createElement('p');
            note.className = 'text-gray-500 mt-2';
            note.textContent = 'Showing 200 of ' + sorted.length;
            container.appendChild(note);
        }
    },

    renderTrends: function() {
        var benchId = document.getElementById('trend-benchmark').value;
        if (!benchId) return;

        var self = this;
        var bench = this.data.benchmarks.find(function(b) { return b.id === benchId; });
        var benchName = bench ? bench.name : benchId;

        // Get all scores for this benchmark, sorted descending
        var entries = [];
        this.data.scores.forEach(function(s) {
            if (s.benchmark_id === benchId) {
                var model = self.data.models.find(function(m) { return m.id === s.model_id; });
                entries.push({
                    model_id: s.model_id,
                    name: model ? model.name : s.model_id.split('/').pop(),
                    value: s.value,
                    source: (s.source && s.source.type) || 'unknown'
                });
            }
        });
        entries.sort(function(a, b) { return b.value - a.value; });
        entries = entries.slice(0, 25);

        // Bar chart: top models for selected benchmark
        var trendChart = Charts._getOrCreate('trend-chart');
        if (trendChart) {
            var colors = entries.map(function(e, i) {
                if (e.source === 'pdf') return '#8b5cf6';
                if (i === 0) return '#10b981';
                if (i === 1) return '#3b82f6';
                if (i === 2) return '#f59e0b';
                return '#6b7280';
            });
            trendChart.setOption({
                title: { text: benchName + ' — Model Rankings', left: 'center', textStyle: { color: '#e5e7eb' } },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: 8, right: 16, bottom: 60, top: 40, containLabel: true },
                xAxis: {
                    type: 'category',
                    data: entries.map(function(e) { return e.name; }),
                    axisLabel: { color: '#9ca3af', fontSize: 9, rotate: 35 },
                    axisLine: { lineStyle: { color: '#374151' } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#9ca3af' },
                    splitLine: { lineStyle: { color: '#1f2937' } }
                },
                series: [{
                    type: 'bar',
                    data: entries.map(function(e, i) {
                        return { value: e.value, itemStyle: { color: colors[i] } };
                    }),
                    label: { show: true, position: 'top', color: '#d1d5db', fontSize: 9,
                        formatter: function(p) { return p.value > 500 ? Math.round(p.value) : p.value.toFixed(1); }
                    }
                }]
            }, true);
        }

        // Radar chart: compare top 6 models across all benchmarks in same category
        var category = bench ? bench.category : 'other';
        var sameCatBenches = this.data.benchmarks.filter(function(b) {
            return b.category === category;
        }).slice(0, 8);
        var sameCatIds = sameCatBenches.map(function(b) { return b.id; });

        // Pick top 6 models from the selected benchmark
        var topModels = entries.slice(0, 6);
        var grouped = Filters.groupByModel(this.data.scores);

        var radarData = topModels.map(function(m) {
            return {
                name: m.name,
                scores: {}
            };
        });
        topModels.forEach(function(m, i) {
            var g = grouped[m.model_id] || {};
            sameCatIds.forEach(function(bid) {
                radarData[i].scores[bid] = g[bid] || 0;
            });
        });

        Charts.renderRadar('radar-chart', radarData, sameCatIds);

        // Heatmap: all models × benchmarks in this category
        var hmModelIds = Object.keys(grouped);
        // Filter to models that have at least one score in this category
        hmModelIds = hmModelIds.filter(function(mid) {
            return sameCatIds.some(function(bid) { return grouped[mid] && grouped[mid][bid]; });
        }).slice(0, 25);
        var hmMatrix = hmModelIds.map(function(m) {
            return sameCatIds.map(function(b) { return (grouped[m] && grouped[m][b]) || null; });
        });
        var hmNames = hmModelIds.map(function(m) { return m.split('/').pop(); });
        var hmBenchNames = sameCatIds.map(function(bid) {
            var b = self.data.benchmarks.find(function(x) { return x.id === bid; });
            return b ? b.name : bid;
        });
        Charts.renderHeatmap('heatmap-chart', hmNames, hmBenchNames, hmMatrix);
    },

    renderResources: function() {
        var pdfsContainer = document.getElementById('resource-pdfs');
        var sitesContainer = document.getElementById('resource-sites');
        if (!pdfsContainer || !sitesContainer) return;
        pdfsContainer.textContent = '';
        sitesContainer.textContent = '';

        var pdfDocs = [
            { name: 'Claude Opus 4.7 System Card', file: 'Claude Opus 4.7 System Card.pdf', vendor: 'Anthropic', date: 'Apr 2026', url: 'https://www.anthropic.com/research' },
            { name: 'Claude Opus 4.6 System Card', file: 'Claude Opus 4.6 System Card 02-05.pdf', vendor: 'Anthropic', date: 'Feb 2026', url: 'https://www.anthropic.com/research' },
            { name: 'Claude Mythos Preview System Card', file: 'Claude Mythos Preview System Card.pdf', vendor: 'Anthropic', date: 'Apr 2026', url: 'https://www.anthropic.com/research' },
            { name: 'GPT-5.4 Thinking System Card', file: 'gpt-5-4-thinking.pdf', vendor: 'OpenAI', date: 'Mar 2026', url: 'https://openai.com/index/introducing-gpt-5-4/' },
            { name: 'GPT-5.3-Codex System Card', file: 'GPT-5-3-Codex-System-Card-02.pdf', vendor: 'OpenAI', date: 'Feb 2026', url: 'https://openai.com/index/introducing-gpt-5-3-codex/' },
            { name: 'Gemini 3 Pro Model Card', file: 'Gemini-3-Pro-Model-Card.pdf', vendor: 'Google', date: 'Nov 2025', url: 'https://deepmind.google/models/gemini-3-pro/' },
            { name: 'Kimi K2.5 Technical Report', file: '2602.02276v1.pdf', vendor: 'Moonshot AI', date: 'Feb 2026', url: 'https://arxiv.org/abs/2602.02276' },
            { name: 'Kimi K2.5 Safety Evaluation', file: '2604.03121v1.pdf', vendor: 'Constellation', date: 'Apr 2026', url: 'https://arxiv.org/abs/2604.03121' },
            { name: 'GLM-5: Vibe Coding to Agentic Engineering', file: '2602.15763v2.pdf', vendor: 'Zhipu AI', date: 'Feb 2026', url: 'https://arxiv.org/abs/2602.15763' },
            { name: 'ERNIE 5.0 Technical Report', file: '2602.04705v1.pdf', vendor: 'Baidu', date: 'Feb 2026', url: 'https://arxiv.org/abs/2602.04705' },
            { name: 'EXAONE 4.5 Technical Report', file: '2604.08644v1.pdf', vendor: 'LG AI Research', date: 'Apr 2026', url: 'https://arxiv.org/abs/2604.08644' },
            { name: 'Solar Open Technical Report', file: '2601.07022v1.pdf', vendor: 'Upstage', date: 'Jan 2026', url: 'https://arxiv.org/abs/2601.07022' },
            { name: 'A.X K1 Technical Report', file: '2601.09200v5.pdf', vendor: 'SK Telecom', date: 'Feb 2026', url: 'https://arxiv.org/abs/2601.09200' },
            { name: 'Mi:dm K 2.5 Pro', file: '2603.18788v2.pdf', vendor: 'KT', date: 'Mar 2026', url: 'https://arxiv.org/abs/2603.18788' },
            { name: 'Gemma 4/Phi-4/Qwen3 MoE Comparison', file: '2604.07035v1.pdf', vendor: 'RPI', date: 'Apr 2026', url: 'https://arxiv.org/abs/2604.07035' }
        ];

        pdfDocs.forEach(function(doc) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-600 transition';

            var title = document.createElement('div');
            title.className = 'font-semibold text-sm text-gray-200 mb-1';
            title.textContent = doc.name;
            card.appendChild(title);

            var metaRow = document.createElement('div');
            metaRow.className = 'flex gap-2 mb-2';
            var vBadge = document.createElement('span');
            vBadge.className = 'text-xs px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded';
            vBadge.textContent = doc.vendor;
            metaRow.appendChild(vBadge);
            var dBadge = document.createElement('span');
            dBadge.className = 'text-xs px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded';
            dBadge.textContent = doc.date;
            metaRow.appendChild(dBadge);
            card.appendChild(metaRow);

            if (doc.url) {
                var link = document.createElement('a');
                link.href = doc.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'text-xs text-blue-400 hover:text-blue-300 transition';
                link.textContent = doc.url.length > 50 ? doc.url.substring(0, 50) + '...' : doc.url;
                card.appendChild(link);
            }
            pdfsContainer.appendChild(card);
        });

        var sites = [
            { name: 'LLM Stats', url: 'https://llm-stats.com', desc: 'GPQA, SWE-bench, AIME, HLE, ARC-AGI-2, MMLU-Pro' },
            { name: 'Chatbot Arena (LMSYS)', url: 'https://lmarena.ai', desc: 'Arena Elo rankings' },
            { name: 'Vellum LLM Leaderboard', url: 'https://www.vellum.ai/llm-leaderboard', desc: 'Multi-benchmark comparison' },
            { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai/leaderboards/models', desc: 'Intelligence Index, speed, pricing' },
            { name: 'ARC Prize', url: 'https://arcprize.org/leaderboard', desc: 'ARC-AGI-2 leaderboard' },
            { name: 'LM Council', url: 'https://lmcouncil.ai/benchmarks', desc: '18 independent benchmarks' },
            { name: 'Epoch AI Benchmarks', url: 'https://epoch.ai/benchmarks', desc: '40+ benchmark trends' },
            { name: 'LiveBench', url: 'https://livebench.ai', desc: 'Contamination-free coding' },
            { name: 'Cybench', url: 'https://cybench.github.io', desc: 'CTF cybersecurity evaluation' },
            { name: 'CyberGym', url: 'https://www.cybergym.io', desc: 'Real-world vulnerability discovery' },
            { name: 'Wiz Cyber Model Arena', url: 'https://www.wiz.io/cyber-model-arena', desc: '257 offensive security challenges' },
            { name: 'EVMbench', url: 'https://github.com/openai/evmbench', desc: 'Smart contract security' },
            { name: 'CyberSecEval 4', url: 'https://github.com/facebookresearch/CyberSecEval', desc: 'AutoPatchBench, CyberSOCEval' },
            { name: 'OSWorld', url: 'https://os-world.github.io', desc: 'Computer use agent benchmark' },
            { name: 'GAIA', url: 'https://huggingface.co/spaces/gaia-benchmark/leaderboard', desc: 'Tool-use agent benchmark' },
            { name: 'METR Time Horizons', url: 'https://metr.org/time-horizons', desc: 'Autonomous agent capability' },
            { name: 'BaxBench', url: 'https://baxbench.com', desc: 'Secure backend coding' },
            { name: 'Qwen Blog', url: 'https://qwen.ai/blog', desc: 'Qwen model announcements' },
            { name: 'MiniMax', url: 'https://www.minimax.io/news', desc: 'MiniMax model releases' },
            { name: 'Gemma Model Card', url: 'https://ai.google.dev/gemma/docs/core/model_card_4', desc: 'Gemma 4 evaluation data' }
        ];

        sites.forEach(function(site) {
            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-600 transition';

            var link = document.createElement('a');
            link.href = site.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'font-semibold text-sm text-blue-400 hover:text-blue-300 transition';
            link.textContent = site.name;
            card.appendChild(link);

            var desc = document.createElement('div');
            desc.className = 'text-xs text-gray-500 mt-1';
            desc.textContent = site.desc;
            card.appendChild(desc);

            sitesContainer.appendChild(card);
        });
    },

    renderChangelog: function() {
        var container = document.getElementById('changelog-list');
        container.textContent = '';
        if (!this.data.changelog.length) {
            var p = document.createElement('p');
            p.className = 'text-gray-500';
            p.textContent = 'No changes recorded yet.';
            container.appendChild(p);
            return;
        }
        this.data.changelog.forEach(function(change) {
            var card = document.createElement('div');
            card.className = 'change-card';

            var strong = document.createElement('strong');
            strong.textContent = change.type;
            card.appendChild(strong);
            card.appendChild(document.createTextNode(': ' + change.benchmark_id +
                ' \u2014 ' + change.new_model + ' (' + change.new_value + ')'));
            if (change.old_value) {
                card.appendChild(document.createTextNode(
                    ' prev: ' + change.old_model + ' (' + change.old_value + ')'));
            }
            container.appendChild(card);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
