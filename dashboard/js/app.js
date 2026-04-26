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
            if (typeof Sovereign !== 'undefined') {
                Sovereign.init(self.data.models, self.data.benchmarks, self.data.scores);
            }
            if (typeof PhysicalAI !== 'undefined') {
                PhysicalAI.init(self.data.models, self.data.benchmarks, self.data.scores);
            }
            Modal.init();
            // Frontier Compare category filter
            var fcCat = document.getElementById('fc-category');
            var fcBtn = document.getElementById('fc-render');
            if (fcCat && fcBtn) {
                fcBtn.addEventListener('click', function() {
                    FrontierCompare.render(fcCat.value);
                });
            }
            // Hash-based routing: #overview, #leaderboard, #trends, etc.
            self._navigateToHash();
            window.addEventListener('hashchange', function() { self._navigateToHash(); });
        });
    },

    _activateTab: function(tabName) {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.add('hidden'); });
        var btn = document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
        if (btn) btn.classList.add('active');
        var tab = document.getElementById('tab-' + tabName);
        if (tab) tab.classList.remove('hidden');
    },

    _navigateToHash: function() {
        var hash = (window.location.hash || '').replace('#', '');
        if (!hash) { this._activateTab('overview'); this.renderOverview(); return; }

        // Check if it's a benchmark or model deep link: #bench/gpqa_diamond or #model/anthropic/claude-opus-4.7
        if (hash.indexOf('bench/') === 0) {
            var benchId = hash.substring(6);
            this._activateTab('overview');
            this.renderOverview();
            setTimeout(function() { Modal.showBenchmark(benchId); }, 300);
            return;
        }
        if (hash.indexOf('model/') === 0) {
            var modelId = hash.substring(6);
            this._activateTab('overview');
            this.renderOverview();
            setTimeout(function() { Modal.showModel(modelId); }, 300);
            return;
        }

        // Explorer deep link: #explore/model1,model2,model3
        if (hash.indexOf('explore/') === 0) {
            var ids = hash.substring(8).split(',').filter(function(v) { return v; });
            if (ids.length >= 2) {
                var self = this;
                this._activateTab('explorer');
                setTimeout(function() {
                    // Set select values
                    var selIds = ['compare-model-a', 'compare-model-b', 'compare-model-c', 'compare-model-d'];
                    ids.forEach(function(mid, i) {
                        var sel = document.getElementById(selIds[i]);
                        if (sel) sel.value = mid;
                    });
                    // Trigger comparison
                    var rows = Explorer.compare(ids, self.data.scores, self.data.benchmarks);
                    Explorer.renderComparison('comparison-result', ids, self.data.models, rows);
                    Explorer.renderRadar('explorer-radar', ids, self.data.models, self.data.scores, self.data.benchmarks);
                }, 300);
                return;
            }
        }

        // Tab navigation
        var tabBtn = document.querySelector('.tab-btn[data-tab="' + hash + '"]');
        if (tabBtn) {
            tabBtn.click();
        } else {
            this._activateTab('overview');
            this.renderOverview();
        }
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

            // Load every historical snapshot listed in the index.
            return self._fetch(base + '/scores/history/index.json').then(function(idx) {
                var dates = (idx && idx.dates) || [];
                return Promise.all(dates.map(function(d) {
                    return self._fetch(base + '/scores/history/' + d + '.json').then(function(snap) {
                        if (snap) self.data.history[d] = snap;
                    });
                }));
            }).then(function() {
                return self._fetch(base + '/aa_pricing.json').then(function(pricing) {
                    if (pricing && pricing.models) self.data.pricing = pricing.models;
                    return self._fetch(base + '/reports/changelog.json');
                });
            });
        }).then(function(changelog) {
            self.data.changelog = changelog || [];

            var boardNames = ['chatbot-arena'];
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
        var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));

        function activate(btn, focusBtn) {
            tabBtns.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
                b.setAttribute('tabindex', '-1');
            });
            document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.add('hidden'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            btn.setAttribute('tabindex', '0');
            var tab = document.getElementById('tab-' + btn.dataset.tab);
            if (tab) tab.classList.remove('hidden');
            history.replaceState(null, '', '#' + btn.dataset.tab);
            if (focusBtn) btn.focus();

            if (btn.dataset.tab === 'overview') self.renderOverview();
            if (btn.dataset.tab === 'trends') self.renderTrends();
            if (btn.dataset.tab === 'leaderboard') self.renderLeaderboard();
            if (btn.dataset.tab === 'comparison') Comparison.render();
            if (btn.dataset.tab === 'frontier-compare') FrontierCompare.render(document.getElementById('fc-category').value);
            if (btn.dataset.tab === 'cyber-coding') CyberCoding.render();
            if (btn.dataset.tab === 'sovereign' && typeof Sovereign !== 'undefined') Sovereign.render();
            if (btn.dataset.tab === 'physical-ai' && typeof PhysicalAI !== 'undefined') PhysicalAI.render();
            if (btn.dataset.tab === 'resources') self.renderResources();
            if (btn.dataset.tab === 'changelog') self.renderChangelog();
        }

        tabBtns.forEach(function(btn, i) {
            btn.addEventListener('click', function() { activate(btn, false); });
            btn.addEventListener('keydown', function(e) {
                var next = null;
                if (e.key === 'ArrowRight')     next = tabBtns[(i + 1) % tabBtns.length];
                else if (e.key === 'ArrowLeft') next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
                else if (e.key === 'Home')      next = tabBtns[0];
                else if (e.key === 'End')       next = tabBtns[tabBtns.length - 1];
                if (next) {
                    e.preventDefault();
                    activate(next, true);
                }
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

        // Benchmark filter dropdown for leaderboard
        var benchFilter = document.getElementById('filter-benchmark');
        if (benchFilter) {
            var sortedBench = this.data.benchmarks.slice().sort(function(a, b) { return a.name.localeCompare(b.name); });
            sortedBench.forEach(function(b) {
                var opt = document.createElement('option');
                opt.value = b.id;
                opt.textContent = b.name;
                benchFilter.appendChild(opt);
            });
        }

        var trendBench = document.getElementById('trend-benchmark');
        this.data.benchmarks.forEach(function(b) {
            var opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            trendBench.appendChild(opt);
        });

        ['filter-category', 'filter-type', 'filter-source', 'filter-benchmark', 'filter-search'].forEach(function(id) {
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
        var selIds = ['compare-model-a', 'compare-model-b', 'compare-model-c', 'compare-model-d'];
        var selects = selIds.map(function(id) { return document.getElementById(id); });

        selects.forEach(function(sel) {
            if (!sel) return;
            self.data.models.forEach(function(m) {
                var opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.name + ' (' + m.vendor + ')';
                sel.appendChild(opt);
            });
        });

        var btn = document.getElementById('compare-btn');
        if (btn) {
            btn.addEventListener('click', function() {
                var modelIds = selects.map(function(sel) { return sel ? sel.value : ''; }).filter(function(v) { return v; });
                if (modelIds.length < 2) return;

                // Update URL hash with model IDs for sharing
                history.replaceState(null, '', '#explore/' + modelIds.join(','));

                var rows = Explorer.compare(modelIds, self.data.scores, self.data.benchmarks);
                Explorer.renderComparison('comparison-result', modelIds, self.data.models, rows);
                Explorer.renderRadar('explorer-radar', modelIds, self.data.models, self.data.scores, self.data.benchmarks);
            });
        }
    },

    renderOverview: function() {
        var self = this;
        try { self._renderSOTATable(); } catch(e) { console.warn('SOTA table error:', e); }
        try { self._renderLeaderboardCards(); } catch(e) { console.warn('Leaderboard cards error:', e); }
        try { self._renderRecentChanges(); } catch(e) { console.warn('Recent changes error:', e); }
    },

    _sotaCategoryFilter: null,

    _renderSOTACategoryFilter: function() {
        var self = this;
        var filterEl = document.getElementById('sota-category-filter');
        if (!filterEl) return;
        filterEl.textContent = '';

        var cats = {};
        Object.keys(this.data.sota).forEach(function(bid) {
            var b = self.data.benchmarks.find(function(x) { return x.id === bid; });
            var cat = b ? b.category : 'other';
            cats[cat] = (cats[cat] || 0) + 1;
        });
        var catNames = Object.keys(cats).sort(function(a, b) { return cats[b] - cats[a]; });

        function mkPill(label, key, count) {
            var btn = document.createElement('button');
            var isActive = (self._sotaCategoryFilter === key) || (key === null && self._sotaCategoryFilter === null);
            btn.className = 'text-xs px-2.5 py-1 rounded-full border transition ' +
                (isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500');
            btn.textContent = label + (count !== undefined ? ' · ' + count : '');
            btn.onclick = function() {
                self._sotaCategoryFilter = key;
                self._renderSOTACategoryFilter();
                self._renderSOTATable();
            };
            return btn;
        }

        var total = Object.keys(this.data.sota).length;
        filterEl.appendChild(mkPill('All', null, total));
        catNames.forEach(function(cat) { filterEl.appendChild(mkPill(cat, cat, cats[cat])); });
    },

    _renderSOTATable: function() {
        var container = document.getElementById('sota-table-container');
        container.textContent = '';
        this._renderSOTACategoryFilter();
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
        var filter = this._sotaCategoryFilter;
        var entries = Object.keys(this.data.sota).sort().filter(function(benchId) {
            if (filter === null) return true;
            var b = self.data.benchmarks.find(function(x) { return x.id === benchId; });
            return (b ? b.category : 'other') === filter;
        });
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
            sotaBadge.className = 'badge badge-sota cursor-pointer hover:brightness-110 transition';
            sotaBadge.textContent = info.value + (info.unit || '');
            sotaBadge.setAttribute('role', 'button');
            sotaBadge.setAttribute('title', '클릭하면 검증 소스와 수집일·변경 이력 표시');
            sotaBadge.onclick = (function(mid, bid) {
                return function(e) {
                    e.stopPropagation();
                    if (typeof Modal !== 'undefined' && Modal.showScoreSource) {
                        Modal.showScoreSource(mid, bid);
                    }
                };
            })(info.model_id, benchId);
            tdScore.appendChild(sotaBadge);
            tr.appendChild(tdScore);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    },

    _renderLeaderboardCards: function() {
        var container = document.getElementById('leaderboard-cards');
        if (!container) return;
        container.textContent = '';
        var self = this;
        var boards = Object.keys(self.data.leaderboards || {});
        if (boards.length === 0) {
            var p = document.createElement('p');
            p.className = 'text-gray-500';
            p.textContent = 'No leaderboard data';
            container.appendChild(p);
            return;
        }
        var boardMeta = {
            'chatbot-arena': { title: 'Chatbot Arena Elo', snapshot: 'snapshot from early 2025 — for reference only' }
        };
        boards.forEach(function(name) {
            var entries = self.data.leaderboards[name];
            var meta = boardMeta[name] || { title: name, snapshot: '' };
            var card = document.createElement('div');
            card.className = 'leaderboard-card';

            var h3 = document.createElement('h3');
            h3.className = 'text-widget text-gray-300 mb-1';
            h3.textContent = meta.title;
            card.appendChild(h3);

            if (meta.snapshot) {
                var snap = document.createElement('p');
                snap.className = 'text-xs text-gray-500 mb-2';
                snap.textContent = meta.snapshot;
                card.appendChild(snap);
            }

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
        // Show recent non-SOTA events first (max 10)
        var events = this.data.changelog.filter(function(c) { return c.type !== 'SOTA'; });
        var sotas = this.data.changelog.filter(function(c) { return c.type === 'SOTA'; }).slice(0, 10);

        events.slice(0, 8).forEach(function(change) {
            var card = document.createElement('div');
            card.className = 'change-card';
            var typeBadge = document.createElement('span');
            typeBadge.className = 'inline-block px-1.5 py-0.5 rounded text-xs mr-2';
            if (change.type === 'Feature') typeBadge.className += ' bg-blue-900 text-blue-300';
            else if (change.type === 'Deploy') typeBadge.className += ' bg-green-900 text-green-300';
            else typeBadge.className += ' bg-purple-900 text-purple-300';
            typeBadge.textContent = change.type;
            card.appendChild(typeBadge);
            card.appendChild(document.createTextNode(change.benchmark_id + ' \u2014 ' + change.new_value));
            container.appendChild(card);
        });

        if (sotas.length > 0) {
            var h4 = document.createElement('h4');
            h4.className = 'text-sm font-semibold text-gray-400 mt-4 mb-2';
            h4.textContent = 'Current SOTA Records';
            container.appendChild(h4);
            sotas.forEach(function(change) {
                var card = document.createElement('div');
                card.className = 'change-card';
                var sotaBadge = document.createElement('span');
                sotaBadge.className = 'inline-block px-1.5 py-0.5 rounded text-xs mr-2 bg-green-900 text-green-300';
                sotaBadge.textContent = 'SOTA';
                card.appendChild(sotaBadge);
                card.appendChild(document.createTextNode(change.benchmark_id + ' \u2014 ' + change.new_model + ' (' + change.new_value + ')'));
                container.appendChild(card);
            });
        }
    },

    renderLeaderboard: function() {
        var benchFilterEl = document.getElementById('filter-benchmark');
        var filters = {
            category: document.getElementById('filter-category').value,
            modelType: document.getElementById('filter-type').value,
            source: document.getElementById('filter-source').value,
            benchmark: benchFilterEl ? benchFilterEl.value : '',
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

        if (filtered.length > 200) {
            var note = document.createElement('p');
            note.className = 'text-gray-500 mt-2';
            note.textContent = 'Showing 200 of ' + filtered.length;
            container.appendChild(note);
        }
    },

    renderTrends: function() {
        this._renderSOTAChangeLog();
        this._renderCorrelationChart();
        this._renderPricingChart();
        var benchId = document.getElementById('trend-benchmark').value;
        if (!benchId) { this._renderSOTATrend(null); return; }

        var self = this;
        this._renderSOTATrend(benchId);
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
                if (e.source === 'pdf') return Theme.sourcePdf;
                return Theme.rankColor(i);
            });
            trendChart.setOption({
                title: { text: benchName + ' — Model Rankings', left: 'center', textStyle: { color: Theme.textPrimary } },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                grid: { left: 8, right: 16, bottom: 60, top: 40, containLabel: true },
                xAxis: {
                    type: 'category',
                    data: entries.map(function(e) { return e.name; }),
                    axisLabel: { color: Theme.textMuted, fontSize: 9, rotate: 35 },
                    axisLine: { lineStyle: { color: Theme.borderStrong } }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: Theme.textMuted },
                    splitLine: { lineStyle: { color: Theme.border } }
                },
                series: [{
                    type: 'bar',
                    data: entries.map(function(e, i) {
                        return { value: e.value, itemStyle: { color: colors[i] } };
                    }),
                    label: { show: true, position: 'top', color: Theme.textSecondary, fontSize: 9,
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

    _renderSOTAChangeLog: function() {
        var self = this;
        var container = document.getElementById('sota-changelog');
        if (!container) return;
        container.textContent = '';

        var dates = Object.keys(this.data.history || {}).sort();
        if (dates.length < 2) {
            var p = document.createElement('p');
            p.className = 'text-gray-500 text-sm';
            p.textContent = 'Need at least two historical snapshots to compute a handover log. Come back tomorrow.';
            container.appendChild(p);
            return;
        }

        function sotasAt(scoreArr) {
            var best = {};
            (scoreArr || []).forEach(function(s) {
                if (!best[s.benchmark_id] || s.value > best[s.benchmark_id].value) {
                    best[s.benchmark_id] = { model_id: s.model_id, value: s.value, unit: s.unit || '%' };
                }
            });
            return best;
        }

        var changes = [];
        for (var i = 1; i < dates.length; i++) {
            var prev = sotasAt(this.data.history[dates[i - 1]]);
            var curr = sotasAt(this.data.history[dates[i]]);
            Object.keys(curr).forEach(function(bid) {
                if (prev[bid] && prev[bid].model_id !== curr[bid].model_id) {
                    changes.push({
                        date: dates[i],
                        benchmark_id: bid,
                        from_model: prev[bid].model_id,
                        from_value: prev[bid].value,
                        to_model: curr[bid].model_id,
                        to_value: curr[bid].value,
                        unit: curr[bid].unit
                    });
                } else if (!prev[bid]) {
                    changes.push({
                        date: dates[i],
                        benchmark_id: bid,
                        from_model: null,
                        from_value: null,
                        to_model: curr[bid].model_id,
                        to_value: curr[bid].value,
                        unit: curr[bid].unit,
                        isNew: true
                    });
                }
            });
        }

        // Order: handovers first (model changes), then new benchmarks, newest date first
        changes.sort(function(a, b) {
            if (a.date !== b.date) return a.date < b.date ? 1 : -1;
            if (!!a.isNew !== !!b.isNew) return a.isNew ? 1 : -1;
            return 0;
        });

        if (changes.length === 0) {
            var none = document.createElement('p');
            none.className = 'text-gray-500 text-sm';
            none.textContent = 'No SOTA changes across tracked dates.';
            container.appendChild(none);
            return;
        }

        var handovers = changes.filter(function(c) { return !c.isNew; });
        var newAdds = changes.filter(function(c) { return c.isNew; });

        function benchName(bid) {
            var b = self.data.benchmarks.find(function(x) { return x.id === bid; });
            return b ? b.name : bid;
        }
        function modelName(mid) {
            var m = self.data.models.find(function(x) { return x.id === mid; });
            return m ? m.name : mid.split('/').pop();
        }

        if (handovers.length) {
            var h = document.createElement('h4');
            h.className = 'text-xs uppercase tracking-wider text-gray-500 mb-2';
            h.textContent = 'Handovers (' + handovers.length + ')';
            container.appendChild(h);

            handovers.forEach(function(c) {
                var row = document.createElement('div');
                row.className = 'py-1.5 border-b border-gray-800 last:border-b-0 flex items-baseline gap-3 flex-wrap';

                var bench = document.createElement('span');
                bench.className = 'text-gray-200 font-medium cursor-pointer hover:text-blue-400';
                bench.textContent = benchName(c.benchmark_id);
                bench.onclick = function() { Modal.showBenchmark(c.benchmark_id); };
                row.appendChild(bench);

                var flow = document.createElement('span');
                flow.className = 'text-gray-500 text-xs';
                flow.textContent = modelName(c.from_model) + ' (' + c.from_value + ') → ' + modelName(c.to_model) + ' (' + c.to_value + ')';
                row.appendChild(flow);

                var when = document.createElement('span');
                when.className = 'text-xs text-gray-600 ml-auto';
                when.textContent = c.date;
                row.appendChild(when);

                container.appendChild(row);
            });
        }

        if (newAdds.length) {
            var h2 = document.createElement('h4');
            h2.className = 'text-xs uppercase tracking-wider text-gray-500 mt-6 mb-2';
            h2.textContent = 'New benchmarks tracked (' + newAdds.length + ')';
            container.appendChild(h2);

            var summary = document.createElement('p');
            summary.className = 'text-gray-500 text-sm';
            summary.textContent = newAdds.slice(0, 8).map(function(c) { return benchName(c.benchmark_id); }).join(', ') +
                (newAdds.length > 8 ? ', … +' + (newAdds.length - 8) + ' more' : '');
            container.appendChild(summary);
        }
    },

    _renderCorrelationChart: function() {
        var self = this;
        var el = document.getElementById('correlation-chart');
        if (!el) return;

        // Build model→{benchId: value} table
        var modelScores = {};
        this.data.scores.forEach(function(s) {
            if (typeof s.value !== 'number') return;
            if (!modelScores[s.model_id]) modelScores[s.model_id] = {};
            // Prefer higher score if duplicates exist
            var prev = modelScores[s.model_id][s.benchmark_id];
            if (prev === undefined || s.value > prev) modelScores[s.model_id][s.benchmark_id] = s.value;
        });

        // Count coverage per benchmark, pick top 15 where the value range looks
        // like a percentage (so correlation is meaningful).
        var benchCount = {};
        var benchMax = {};
        Object.values(modelScores).forEach(function(bm) {
            Object.keys(bm).forEach(function(bid) {
                benchCount[bid] = (benchCount[bid] || 0) + 1;
                benchMax[bid] = Math.max(benchMax[bid] || 0, bm[bid]);
            });
        });

        var candidateIds = Object.keys(benchCount).filter(function(bid) {
            return benchCount[bid] >= 10 && benchMax[bid] <= 100;
        });
        candidateIds.sort(function(a, b) { return benchCount[b] - benchCount[a]; });
        var topIds = candidateIds.slice(0, 15);

        if (topIds.length < 3) {
            el.textContent = '';
            var p = document.createElement('p');
            p.className = 'text-gray-500 text-sm';
            p.textContent = 'Not enough benchmarks meet the coverage threshold (N ≥ 10 models).';
            el.appendChild(p);
            return;
        }

        function pearson(a, b) {
            var n = a.length;
            if (n < 5) return null;
            var sumA = 0, sumB = 0;
            for (var i = 0; i < n; i++) { sumA += a[i]; sumB += b[i]; }
            var meanA = sumA / n, meanB = sumB / n;
            var num = 0, denA = 0, denB = 0;
            for (var j = 0; j < n; j++) {
                var dA = a[j] - meanA, dB = b[j] - meanB;
                num += dA * dB; denA += dA * dA; denB += dB * dB;
            }
            var denom = Math.sqrt(denA * denB);
            return denom > 0 ? num / denom : null;
        }

        var data = [];
        for (var i = 0; i < topIds.length; i++) {
            for (var j = 0; j < topIds.length; j++) {
                var bidA = topIds[i], bidB = topIds[j];
                var va = [], vb = [];
                Object.values(modelScores).forEach(function(bm) {
                    if (bm[bidA] !== undefined && bm[bidB] !== undefined) {
                        va.push(bm[bidA]); vb.push(bm[bidB]);
                    }
                });
                var r = (i === j) ? 1 : pearson(va, vb);
                data.push([j, i, r === null ? null : +r.toFixed(2), va.length]);
            }
        }

        var labels = topIds.map(function(bid) {
            var b = self.data.benchmarks.find(function(x) { return x.id === bid; });
            var name = b ? b.name : bid;
            return name.replace('SWE-bench ', 'SWE-').replace('Terminal-Bench ', 'T-Bench ').replace("Humanity's Last Exam", 'HLE');
        });

        var chart = Charts._getOrCreate('correlation-chart');
        if (!chart) return;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                formatter: function(p) {
                    var r = p.value[2];
                    var n = p.value[3];
                    if (r === null) return labels[p.value[1]] + ' ↔ ' + labels[p.value[0]] + '<br/>(N = ' + n + ': too few shared models)';
                    return labels[p.value[1]] + ' ↔ ' + labels[p.value[0]] + '<br/>r = ' + r.toFixed(2) + ' (N = ' + n + ')';
                }
            },
            grid: { left: 140, right: 30, top: 20, bottom: 110 },
            xAxis: {
                type: 'category', data: labels,
                axisLabel: { rotate: 45, fontSize: 10, color: Theme.textMuted },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'category', data: labels,
                axisLabel: { fontSize: 10, color: Theme.textMuted },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            visualMap: {
                min: -1, max: 1, calculable: true, orient: 'horizontal',
                left: 'center', bottom: 30,
                inRange: { color: ['#ef4444', '#1f2937', '#10b981'] },
                textStyle: { color: Theme.textMuted },
                text: ['r = +1', 'r = -1']
            },
            series: [{
                type: 'heatmap',
                data: data.map(function(d) { return [d[0], d[1], d[2]]; }),
                label: {
                    show: true, fontSize: 9, color: Theme.textPrimary,
                    formatter: function(p) { return p.value[2] === null ? '—' : p.value[2].toFixed(2); }
                }
            }]
        }, true);
    },

    _renderPricingChart: function() {
        var self = this;
        var el = document.getElementById('pricing-chart');
        if (!el) return;

        var pricing = this.data.pricing || [];
        var points = pricing
            .filter(function(p) {
                return typeof p.intelligence_index === 'number' && typeof p.price_per_1m_output === 'number';
            })
            .map(function(p) {
                var model = self.data.models.find(function(m) { return m.id === p.model_id; });
                return {
                    name: model ? model.name : p.model_id.split('/').pop(),
                    value: [p.price_per_1m_output, p.intelligence_index, p.tokens_per_second || 0],
                    vendor: model ? model.vendor : p.model_id.split('/')[0],
                    model_id: p.model_id
                };
            });

        if (points.length === 0) {
            el.textContent = '';
            var msg = document.createElement('p');
            msg.className = 'text-gray-500 text-sm';
            msg.textContent = 'No pricing data available.';
            el.appendChild(msg);
            return;
        }

        var vendorColors = {
            'Anthropic': Theme.series[0],
            'OpenAI': Theme.series[1],
            'Google': Theme.series[2],
            'Moonshot AI': Theme.series[3],
            'DeepSeek': Theme.series[4],
            'Zhipu AI': Theme.series[5],
            'xAI': '#ec4899',
            'Meta': '#60a5fa'
        };

        // Group by vendor for colored legend
        var vendorGroups = {};
        points.forEach(function(p) {
            var v = p.vendor || 'Other';
            if (!vendorGroups[v]) vendorGroups[v] = [];
            vendorGroups[v].push(p);
        });

        var series = Object.keys(vendorGroups).map(function(vendor) {
            return {
                name: vendor,
                type: 'scatter',
                data: vendorGroups[vendor],
                symbolSize: function(val) {
                    var tps = val[2];
                    if (!tps) return 16;
                    return 10 + Math.min(18, tps / 10);
                },
                itemStyle: { color: vendorColors[vendor] || Theme.textMuted, opacity: 0.85 },
                label: {
                    show: true, position: 'right', fontSize: 9, color: Theme.textMuted,
                    formatter: function(p) { return p.data.name; }
                },
                emphasis: {
                    focus: 'series',
                    label: { fontSize: 11, color: Theme.textPrimary }
                }
            };
        });

        var chart = Charts._getOrCreate('pricing-chart');
        if (!chart) return;
        chart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(p) {
                    var d = p.data;
                    return '<strong>' + d.name + '</strong><br/>' +
                        'Intelligence: ' + d.value[1] + '<br/>' +
                        'Output price: $' + d.value[0].toFixed(2) + ' / 1M<br/>' +
                        (d.value[2] ? 'Speed: ' + d.value[2].toFixed(1) + ' tok/s<br/>' : '') +
                        '<span style="color:' + Theme.textDim + ';font-size:10px">' + d.model_id + '</span>';
                }
            },
            legend: {
                data: Object.keys(vendorGroups),
                textStyle: { color: Theme.textMuted },
                bottom: 0
            },
            grid: { left: 60, right: 100, top: 20, bottom: 60 },
            xAxis: {
                type: 'log', name: 'Output price ($/1M tokens, log)', nameLocation: 'middle', nameGap: 30,
                nameTextStyle: { color: Theme.textMuted, fontSize: 11 },
                axisLabel: { color: Theme.textMuted, formatter: function(v) { return '$' + v; } },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            yAxis: {
                type: 'value', name: 'Intelligence Index', nameLocation: 'middle', nameGap: 40,
                nameTextStyle: { color: Theme.textMuted, fontSize: 11 },
                axisLabel: { color: Theme.textMuted },
                axisLine: { lineStyle: { color: Theme.borderStrong } },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: series
        }, true);
    },

    _renderSOTATrend: function(selectedBenchId) {
        var el = document.getElementById('sota-trend-chart');
        if (!el) return;
        var chart = Charts._getOrCreate('sota-trend-chart');
        if (!chart) return;

        var self = this;
        var dates = Object.keys(this.data.history).sort();
        if (dates.length === 0) {
            el.textContent = 'No history data available yet.';
            return;
        }

        // Determine which benchmarks to show
        var benchIds;
        if (selectedBenchId) {
            benchIds = [selectedBenchId];
        } else {
            // Show top benchmarks by coverage
            var benchCount = {};
            dates.forEach(function(d) {
                (self.data.history[d] || []).forEach(function(s) {
                    benchCount[s.benchmark_id] = (benchCount[s.benchmark_id] || 0) + 1;
                });
            });
            benchIds = Object.keys(benchCount).sort(function(a, b) {
                return benchCount[b] - benchCount[a];
            }).slice(0, 10);
        }

        // For each date × benchmark, find SOTA (max score)
        var series = benchIds.map(function(bid) {
            var bench = self.data.benchmarks.find(function(b) { return b.id === bid; });
            var benchName = bench ? bench.name : bid;

            var dataPoints = dates.map(function(date) {
                var dayScores = (self.data.history[date] || []).filter(function(s) {
                    return s.benchmark_id === bid;
                });
                if (dayScores.length === 0) return null;
                var maxScore = dayScores.reduce(function(max, s) {
                    return s.value > max ? s.value : max;
                }, 0);
                return maxScore;
            });

            return {
                name: benchName,
                type: 'line',
                smooth: true,
                connectNulls: true,
                symbol: 'circle',
                symbolSize: 8,
                data: dataPoints,
                emphasis: { focus: 'series' }
            };
        });

        // Filter out series with all nulls
        series = series.filter(function(s) {
            return s.data.some(function(v) { return v !== null; });
        });

        var title = selectedBenchId
            ? (self.data.benchmarks.find(function(b) { return b.id === selectedBenchId; }) || {}).name + ' — SOTA Trend'
            : 'SOTA Score Trends (Top 10 Benchmarks)';

        chart.setOption({
            title: { text: title, left: 'center', textStyle: { color: Theme.textPrimary, fontSize: 13 } },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    var lines = [params[0].axisValue];
                    params.forEach(function(p) {
                        if (p.value !== null && p.value !== undefined) {
                            var display = p.value > 500 ? Math.round(p.value) : p.value.toFixed(1);
                            lines.push(p.marker + ' ' + p.seriesName + ': ' + display);
                        }
                    });
                    return lines.join('<br>');
                }
            },
            legend: {
                bottom: 0, type: 'scroll',
                textStyle: { color: Theme.textMuted, fontSize: 10 }
            },
            grid: { left: 50, right: 20, top: 40, bottom: 50 },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { color: Theme.textMuted },
                axisLine: { lineStyle: { color: Theme.borderStrong } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: Theme.textMuted },
                splitLine: { lineStyle: { color: Theme.border } }
            },
            series: series
        }, true);

        // Add data collection annotation
        if (!selectedBenchId && dates.length >= 2) {
            var container = document.getElementById('sota-trend-container');
            var existing = container.querySelector('.trend-note');
            if (existing) existing.remove();
            var note = document.createElement('p');
            note.className = 'trend-note text-xs text-gray-500 mt-2';
            note.textContent = 'Data points: ' + dates.join(', ') + ' — '
                + (self.data.history[dates[0]] || []).length + ' → '
                + (self.data.history[dates[dates.length-1]] || []).length + ' scores'
                + ' (growth: ' + Math.round(((self.data.history[dates[dates.length-1]] || []).length / (self.data.history[dates[0]] || []).length - 1) * 100) + '%)';
            container.appendChild(note);
        }
    },

    renderResources: function() {
        var pdfsContainer = document.getElementById('resource-pdfs');
        var sitesContainer = document.getElementById('resource-sites');
        if (!pdfsContainer || !sitesContainer) return;
        pdfsContainer.textContent = '';
        sitesContainer.textContent = '';

        var pdfDocs = [
            { name: 'GPT-5.5 System Card', file: 'GPT-5-5-System-Card.pdf', vendor: 'OpenAI', date: 'Apr 2026', url: 'https://deploymentsafety.openai.com/gpt-5-5/introduction' },
            { name: 'DeepSeek V4-Pro Technical Report', file: 'DeepSeek-V4-Pro-Technical-Report.pdf', vendor: 'DeepSeek', date: 'Apr 2026', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro' },
            { name: 'MedGemma Technical Report', file: 'MedGemma-Technical-Report-2507.05201.pdf', vendor: 'Google', date: 'Jul 2025', url: 'https://arxiv.org/abs/2507.05201' },
            { name: 'MedGemma 1.5 Technical Report', file: 'MedGemma-1.5-Technical-Report-2604.05081.pdf', vendor: 'Google', date: 'Jan 2026', url: 'https://arxiv.org/abs/2604.05081' },
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
            var row = document.createElement('div');
            row.className = 'py-2.5 border-b border-gray-800 last:border-b-0';

            var top = document.createElement('div');
            top.className = 'flex items-baseline justify-between gap-3';

            var titleEl = doc.url
                ? (function() { var a = document.createElement('a'); a.href = doc.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'font-semibold text-sm text-gray-200 hover:text-blue-400 transition'; a.textContent = doc.name; return a; })()
                : (function() { var s = document.createElement('span'); s.className = 'font-semibold text-sm text-gray-200'; s.textContent = doc.name; return s; })();
            top.appendChild(titleEl);

            var meta = document.createElement('span');
            meta.className = 'text-xs text-gray-500 whitespace-nowrap';
            meta.textContent = doc.vendor + ' · ' + doc.date;
            top.appendChild(meta);
            row.appendChild(top);

            pdfsContainer.appendChild(row);
        });

        var sites = [
            { name: 'Mistral AI News', url: 'https://mistral.ai/news', desc: 'Full Mistral lineup: Large 3, Small 4, Magistral 1.2 (reasoning), Devstral 2 (code agents, SWE-Verified 72.2%), Codestral 25.08, Pixtral Large, Voxtral TTS, Ministral 3 family' },
            { name: 'Mistral docs', url: 'https://docs.mistral.ai/models/overview', desc: 'Authoritative Mistral model registry — all current models with version codes (v25.06/25.08/25.09/25.12/26.03)' },
            { name: 'MedGemma — Health AI Foundations', url: 'https://developers.google.com/health-ai-developer-foundations/medgemma', desc: 'Google open medical LLM family. 27B text/multimodal + 4B 1.5. MedQA, MedMCQA, EHRQA leadership.' },
            { name: 'TII Falcon LLM', url: 'https://falconllm.tii.ae/', desc: 'UAE TII frontier models. Falcon-H1 Arabic 34B (Jan 2026, Mamba-Transformer), Falcon Perception 600M (Mar 2026 multimodal)' },
            { name: 'Sakana AI', url: 'https://sakana.ai/', desc: 'Japan-focused frontier models. Namazu series (Mar 2026 alpha), evolutionary model merge research' },
            { name: 'SEA-LION (AI Singapore)', url: 'https://sea-lion.ai/', desc: 'Southeast Asian multilingual models. v4 family (Mar 2026): Apertus-SEA-LION 8B, Gemma-SEA-LION 4B-VL, SEA-Guard safety' },
            { name: 'OpenAI Deployment Safety Hub', url: 'https://deploymentsafety.openai.com', desc: 'Canonical OpenAI system cards — GPT-5.5, GPT-5.4 Thinking, safety + cyber + bio evals' },
            { name: 'HuggingFace — DeepSeek V4', url: 'https://huggingface.co/collections/deepseek-ai/deepseek-v4', desc: 'DeepSeek V4 Pro / Flash preview models, 1T/49B MoE, 1M context, MIT license' },
            { name: 'Irregular Publications', url: 'https://www.irregular.com/publications', desc: 'External cyber security evals for frontier models (GPT-5.5, GPT-5.4-Thinking, Claude Sonnet 4.5 etc)' },
            { name: 'Kimi K2.6 Blog', url: 'https://www.kimi.com/blog/kimi-k2-6', desc: 'Moonshot AI Kimi K2.6 native multimodal launch coverage' },
            { name: 'Kimi Platform (API docs)', url: 'https://platform.kimi.ai/docs/guide/kimi-k2-6-quickstart', desc: 'Kimi K2.6 API — 256K context, OpenAI-compatible' },
            { name: 'Qwen3.6 — HuggingFace', url: 'https://huggingface.co/Qwen/Qwen3.6-27B', desc: 'Qwen3.6-27B dense + Qwen3.6-35B-A3B MoE model cards' },
            { name: 'LLM Stats — Model Updates', url: 'https://llm-stats.com/llm-updates', desc: 'Daily frontier model release feed (newest first)' },
            { name: 'LLM Stats', url: 'https://llm-stats.com', desc: 'GPQA, SWE-bench, AIME, HLE, ARC-AGI-2, MMLU-Pro' },
            { name: 'Chatbot Arena (LMSYS)', url: 'https://lmarena.ai', desc: 'Arena Elo rankings' },
            { name: 'Vellum LLM Leaderboard', url: 'https://www.vellum.ai/llm-leaderboard', desc: 'Multi-benchmark comparison' },
            { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai/leaderboards/models', desc: 'Intelligence Index, speed, pricing' },
            { name: 'ARC Prize / ARC-AGI', url: 'https://arcprize.org/leaderboard', desc: 'Abstract reasoning for AGI evaluation (ARC-AGI-1/2)' },
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
            { name: 'Gemma Model Card', url: 'https://ai.google.dev/gemma/docs/core/model_card_4', desc: 'Gemma 4 evaluation data' },
            { name: 'Scale Labs Leaderboard', url: 'https://labs.scale.com/leaderboard', desc: 'SWE-bench Pro, HLE, expert-driven benchmarks' },
            { name: 'BenchLM.ai', url: 'https://benchlm.ai', desc: 'Provisional + verified rankings, 100+ benchmarks' },
            { name: 'Klu LLM Leaderboard', url: 'https://klu.ai/llm-leaderboard', desc: '30+ frontier models, cost vs speed vs quality' },
            { name: 'APEX-Agents (Mercor)', url: 'https://www.mercor.com/apex/', desc: 'AI Productivity Index for professional tasks' },
            { name: 'TAU3-Bench', url: 'https://sierra.ai/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice', desc: 'Next-gen agent tool-use + knowledge + voice' },
            { name: 'DemandSphere Frontier Tracker', url: 'https://www.demandsphere.com/blog/ai-frontier-model-tracker-launch/', desc: 'Real-time frontier model tracking' },
            { name: 'Stanford HAI AI Index', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance', desc: '2026 AI Index technical performance report' },
            { name: 'UK AISI (AI Security Institute)', url: 'https://www.aisi.gov.uk/research', desc: 'Frontier AI Trends Report — cyber, bio, autonomy evaluations' },
            { name: 'UK AISI Blog', url: 'https://www.aisi.gov.uk/blog', desc: 'Evaluation insights and capability findings' },
            { name: 'US AISI (NIST)', url: 'https://www.nist.gov/artificial-intelligence/ai-safety-institute', desc: 'NIST AI 800-3, frontier model TEVV' },
            { name: 'Japan AISI', url: 'https://aisi.go.jp/', desc: 'Red-teaming methodology, safety evaluation guides' },
            { name: 'Singapore AISI', url: 'https://sgaisi.sg/', desc: 'Project Moonshot LLM eval, Red Teaming Challenge' },
            { name: 'Singapore IMDA', url: 'https://www.imda.gov.sg/about-imda/emerging-technologies-and-research/artificial-intelligence', desc: 'Agentic AI governance, safety reports' },
            { name: 'Korea AISI (K-AISI)', url: 'https://www.aisi.re.kr/eng', desc: 'AI Safety Forecast, Korean model assessment' },
            { name: 'International AI Safety Report', url: 'https://internationalaisafetyreport.org/', desc: '2026 joint international AI safety report' },
            { name: 'Future of Life AI Safety Index', url: 'https://futureoflife.org/ai-safety-index-winter-2025/', desc: 'Company-level AI safety scoring' },
            { name: 'Frontier Model Forum', url: 'https://www.frontiermodelforum.org/technical-reports/', desc: 'Joint industry capability assessments' },
            { name: 'China AISI Network', url: 'https://ai-development-and-safety-network.cn/', desc: 'PandaGuard, MultiTrust, Safe RLHF — 49 model jailbreak eval' },
            { name: 'China AISI Research', url: 'https://ai-development-and-safety-network.cn/research-progress', desc: 'LLM safety research: jailbreak, alignment, misinformation' },
            { name: 'China AISI Standards', url: 'https://ai-development-and-safety-network.cn/standards-and-norms', desc: 'Multimodal LLM safety specs, security assessment standards' },
            { name: 'Hack The Box AI Range', url: 'https://www.hackthebox.com/blog/ai-range-llm-security-benchmark', desc: 'AI vs human cybersecurity benchmark, NeuroGrid CTF' },
            { name: 'Awesome Agents Agentic', url: 'https://awesomeagents.ai/leaderboards/agentic-ai-benchmarks-leaderboard/', desc: 'GAIA, WebArena, BFCL V4, Tau2-bench rankings' },
            { name: 'Awesome Agents Computer Use', url: 'https://awesomeagents.ai/leaderboards/computer-use-leaderboard/', desc: 'OSWorld, ScreenSpot desktop agent rankings' },
            { name: 'MorphLLM Coding Guide', url: 'https://www.morphllm.com/ai-coding-benchmarks-2026', desc: 'Every coding eval explained and ranked' },
            { name: 'Vibe Bench', url: 'https://vibe-bench.com/', desc: 'Tool-level AI coding benchmarks for vibe coding' },
            { name: 'MLCommons AILuminate', url: 'https://mlcommons.org/benchmarks/ailuminate/', desc: 'Jailbreak benchmark, adversarial attack taxonomy' },
            { name: 'Humanity Last Exam (CAISI)', url: 'https://agi.safe.ai/', desc: 'Expert-level AGI benchmark, published in Nature' },
            { name: 'Convergence Analysis', url: 'https://www.convergenceanalysis.org/ai-regulatory-landscape', desc: 'AI safety regulatory landscape, CBRN analysis' },
            { name: 'Steel.dev Agent Results', url: 'https://leaderboard.steel.dev/results', desc: '121 results across 16 agent benchmarks' },
            { name: 'SWE-rebench', url: 'https://swe-rebench.com/', desc: 'Stricter SWE-bench re-evaluation' },
            { name: 'FORTRESS (Scale AI)', url: 'https://labs.scale.com/leaderboard/fortress', desc: 'CBRNE adversarial safety benchmark' },
            { name: 'BFCL V4 (Berkeley)', url: 'https://gorilla.cs.berkeley.edu/leaderboard.html', desc: 'Function calling accuracy, agentic web search eval' },
            { name: 'Aider LLM Leaderboard', url: 'https://aider.chat/docs/leaderboards/', desc: '225 Exercism problems, 6 languages coding benchmark' },
            { name: 'BenchLM Korean LLMs', url: 'https://benchlm.ai/leaderboards/korean-llm', desc: 'Korean model rankings: Solar, EXAONE, Mi:dm' },
            { name: 'HarmBench', url: 'https://www.harmbench.org/', desc: 'Automated red teaming and robust refusal eval' },
            { name: 'LM Market Cap', url: 'https://lmmarketcap.com/', desc: 'Model rankings, benchmarks, pricing comparison' },
            { name: 'AIRank.dev', url: 'https://airank.dev/', desc: 'Benchmark analysis with historical trends' },

            // ── Apr 2026 monitoring sweep — new sources ──
            { name: 'Tencent Hy3 (Hunyuan 3)', url: 'https://hy3ai.com/', desc: 'Tencent Hunyuan 3 (Hy3-preview, Apr 23 2026) — 295B-A21B MoE, 256K ctx. SWE-Verified 74.4 / Terminal-Bench 2.0 54.4 / MMLU-Pro 65.76' },
            { name: 'Tencent HY-World 2.0', url: 'https://3d-models.hunyuan.tencent.com/world/world2_0/', desc: '3D world foundation model (Apr 15 2026). WorldMirror 2.0 ~1.2B open-weight. Image/text/video → mesh/3DGS/point clouds' },
            { name: 'Xiaomi MiMo', url: 'https://mimo.xiaomi.com/', desc: 'Xiaomi MiMo V2.5 Pro (Apr 22 2026 beta) — 1T-A42B MoE, 1M ctx, 1000+ tool calls. τ³-Bench 72.9 LEADER, SWE-Pro 57.2' },
            { name: 'InclusionAI (Ant Group)', url: 'https://huggingface.co/inclusionAI', desc: 'Ant Group open-source AI org. Ling 2.6 1T (Apr 23 2026 trillion-param non-reasoning), Ling 2.6 Flash 104B-A7.4B, LLaDA 2.0 Uni 16B unified diffusion' },
            { name: 'Anthropic Mythos Preview (gated)', url: 'https://red.anthropic.com/2026/mythos-preview/', desc: 'Claude Mythos Preview (Apr 8 2026 cyber-restricted). SWE-Verified 93.9 SOTA / USAMO 97.6' },
            { name: 'Meta Muse Spark (Superintelligence Labs)', url: 'https://ai.meta.com/blog/introducing-muse-spark-msl/', desc: 'Meta first MSL flagship (Apr 8 2026). HealthBench Hard 42.8 SOTA / FrontierScience 38' },
            { name: 'ARC-AGI-3', url: 'https://arcprize.org/blog/arc-agi-3-launch', desc: 'Interactive agentic reasoning benchmark (Mar 25 2026). 1000+ levels / 150+ envs. $2M prize. Gemini 3.1 Pro 0.37%, humans 100%' },
            { name: 'OpenAI FrontierScience', url: 'https://openai.com/index/frontierscience/', desc: '700 expert-science Q (160 gold). Olympiad + Research splits. GPT-5.2 leads (Olymp 77 / Res 25)' },
            { name: 'KMMMU (Korean MMMU)', url: 'https://arxiv.org/abs/2604.13058', desc: 'Korean Multimodal MMMU — 3,466 Q + 300 culture-specific + 627 hard. 9 disciplines × 9 visual types. Open 42.05% / proprietary 52.42% on hard' },
            { name: 'TII QIMMA Arabic Leaderboard', url: 'https://huggingface.co/blog/tiiuae/qimma-arabic-leaderboard', desc: 'QIMMA (قِمّة) Arabic LLM quality-first — 52K samples / 109 subsets / 14 source benchmarks / 7 domains' },
            { name: 'GAIA-2', url: 'https://openreview.net/forum?id=9gw03JpKK4', desc: 'Dynamic/async agent environments benchmark. GPT-5 high 42% pass@1, Kimi K2 21% open SOTA' },
            { name: 'Google Gemma 4', url: 'https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/', desc: 'Gemma 4 family (Apr 2 2026, Apache 2.0): E2B/E4B/26B-A4B/31B-Dense. AIME-2026 89.2 / MMLU-Pro 85.2 / Codeforces 2150' }
        ];

        sites.forEach(function(site) {
            var row = document.createElement('div');
            row.className = 'py-2 border-b border-gray-800 last:border-b-0';

            var link = document.createElement('a');
            link.href = site.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'font-semibold text-sm text-blue-400 hover:text-blue-300 transition';
            link.textContent = site.name;
            row.appendChild(link);

            var desc = document.createElement('span');
            desc.className = 'text-xs text-gray-500 ml-2';
            desc.textContent = '— ' + site.desc;
            row.appendChild(desc);

            sitesContainer.appendChild(row);
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

        // Group by type
        var groups = {};
        this.data.changelog.forEach(function(c) {
            var type = c.type;
            if (!groups[type]) groups[type] = [];
            groups[type].push(c);
        });

        var typeOrder = ['Deploy', 'Feature', 'PDF Analysis', 'Web Collection', 'Data Collection', 'SOTA'];
        var typeColors = {
            'Deploy': 'bg-green-900 text-green-300',
            'Feature': 'bg-blue-900 text-blue-300',
            'PDF Analysis': 'bg-purple-900 text-purple-300',
            'Web Collection': 'bg-yellow-900 text-yellow-300',
            'Data Collection': 'bg-gray-700 text-gray-300',
            'SOTA': 'bg-emerald-900 text-emerald-300'
        };

        typeOrder.forEach(function(type) {
            var items = groups[type];
            if (!items || items.length === 0) return;

            var section = document.createElement('div');
            section.className = 'mb-6';

            var h3 = document.createElement('h3');
            h3.className = 'text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3';
            h3.textContent = type + ' (' + items.length + ')';
            section.appendChild(h3);

            items.forEach(function(change) {
                var card = document.createElement('div');
                card.className = 'flex items-start gap-3 py-2 border-t border-gray-800';

                var badge = document.createElement('span');
                badge.className = 'inline-block px-2 py-0.5 rounded text-xs whitespace-nowrap mt-0.5 ' + (typeColors[type] || 'bg-gray-800 text-gray-400');
                badge.textContent = change.date || '';
                card.appendChild(badge);

                var content = document.createElement('div');
                content.className = 'text-sm';

                var title = document.createElement('span');
                title.className = 'text-gray-200 font-medium';
                title.textContent = change.benchmark_id;
                content.appendChild(title);

                if (change.new_model) {
                    content.appendChild(document.createTextNode(' \u2014 '));
                    var model = document.createElement('span');
                    model.className = 'text-gray-400';
                    model.textContent = change.new_model;
                    content.appendChild(model);
                }

                if (change.new_value) {
                    var val = document.createElement('span');
                    val.className = 'ml-2 text-gray-500';
                    val.textContent = '(' + change.new_value + ')';
                    content.appendChild(val);
                }

                card.appendChild(content);
                section.appendChild(card);
            });

            container.appendChild(section);
        });
    }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
