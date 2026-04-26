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

        // Explorer deep link: #explore/model1,model2,...,modelN  (up to 10)
        if (hash.indexOf('explore/') === 0) {
            var ids = hash.substring(8).split(',').filter(function(v) { return v; }).slice(0, 10);
            if (ids.length >= 2) {
                var self = this;
                this._activateTab('explorer');
                setTimeout(function() {
                    // Rebuild selectors to match the deep-linked model count.
                    self._compareCount = ids.length;
                    self._renderCompareSelectors();
                    ids.forEach(function(mid, i) {
                        var sel = document.getElementById('compare-model-' + i);
                        if (sel) sel.value = mid;
                    });
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
            if (btn.dataset.tab === 'medical-ai' && typeof MedicalAI !== 'undefined') MedicalAI.render();
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

    _compareCount: 2,
    _COMPARE_MIN: 2,
    _COMPARE_MAX: 10,

    _renderCompareSelectors: function() {
        var self = this;
        var list = document.getElementById('compare-model-list');
        if (!list) return;
        // Capture current values to preserve them across re-render
        var existing = {};
        list.querySelectorAll('select').forEach(function(s) {
            existing[s.id] = s.value;
        });
        list.textContent = '';

        for (var i = 0; i < self._compareCount; i++) {
            (function(idx) {
                var wrap = document.createElement('div');
                wrap.className = 'flex flex-col';

                var labelRow = document.createElement('div');
                labelRow.className = 'flex items-center gap-1 mb-1';
                var label = document.createElement('label');
                label.className = 'block text-xs text-gray-400';
                label.textContent = 'Model ' + (idx + 1);
                labelRow.appendChild(label);
                if (self._compareCount > self._COMPARE_MIN) {
                    var rm = document.createElement('button');
                    rm.type = 'button';
                    rm.textContent = '×';
                    rm.title = '이 모델 제거';
                    rm.className = 'text-gray-500 hover:text-red-400 text-xs leading-none px-1';
                    rm.addEventListener('click', function() {
                        // Collect remaining values, then drop this slot.
                        var values = [];
                        for (var j = 0; j < self._compareCount; j++) {
                            if (j === idx) continue;
                            var s = document.getElementById('compare-model-' + j);
                            values.push(s ? s.value : '');
                        }
                        self._compareCount--;
                        self._renderCompareSelectors();
                        values.forEach(function(v, k) {
                            var s = document.getElementById('compare-model-' + k);
                            if (s) s.value = v;
                        });
                    });
                    labelRow.appendChild(rm);
                }
                wrap.appendChild(labelRow);

                var sel = document.createElement('select');
                sel.id = 'compare-model-' + idx;
                sel.className = 'bg-gray-800 border border-gray-700 rounded px-3 py-2 w-56 text-sm';
                var blank = document.createElement('option');
                blank.value = '';
                blank.textContent = idx < 2 ? 'Select Model ' + (idx + 1) : '— none —';
                sel.appendChild(blank);
                self.data.models.forEach(function(m) {
                    var opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = m.name + ' (' + m.vendor + ')';
                    sel.appendChild(opt);
                });
                if (existing['compare-model-' + idx]) sel.value = existing['compare-model-' + idx];
                wrap.appendChild(sel);

                list.appendChild(wrap);
            })(i);
        }

        var addBtn = document.getElementById('compare-add-btn');
        if (addBtn) {
            addBtn.disabled = self._compareCount >= self._COMPARE_MAX;
            addBtn.classList.toggle('opacity-50', addBtn.disabled);
            addBtn.classList.toggle('cursor-not-allowed', addBtn.disabled);
        }
        var hint = document.getElementById('compare-count-hint');
        if (hint) hint.textContent = self._compareCount + ' / ' + self._COMPARE_MAX + ' 모델';
    },

    setupExplorer: function() {
        var self = this;
        self._renderCompareSelectors();

        var addBtn = document.getElementById('compare-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                if (self._compareCount >= self._COMPARE_MAX) return;
                self._compareCount++;
                self._renderCompareSelectors();
            });
        }

        var btn = document.getElementById('compare-btn');
        if (btn) {
            btn.addEventListener('click', function() {
                var modelIds = [];
                for (var i = 0; i < self._compareCount; i++) {
                    var sel = document.getElementById('compare-model-' + i);
                    if (sel && sel.value) modelIds.push(sel.value);
                }
                if (modelIds.length < 2) return;

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
            { name: 'Gemma 4/Phi-4/Qwen3 MoE Comparison', file: '2604.07035v1.pdf', vendor: 'RPI', date: 'Apr 2026', url: 'https://arxiv.org/abs/2604.07035' },
            { name: 'Med-Gemini — Capabilities of Gemini Models in Medicine', file: 'med-gemini-2404.18416.pdf', vendor: 'Google DeepMind', date: 'Apr 2024', url: 'https://arxiv.org/abs/2404.18416' },
            { name: 'Med-PaLM 2 — Towards Expert-Level Medical QA', file: 'med-palm-2-2305.09617.pdf', vendor: 'Google', date: 'May 2023', url: 'https://arxiv.org/abs/2305.09617' },
            { name: 'BioMistral — Open-Source Biomedical LLMs', file: 'biomistral-2402.10373.pdf', vendor: 'Avignon Univ', date: 'Feb 2024', url: 'https://arxiv.org/abs/2402.10373' },
            { name: 'MedSAM — Segment Anything in Medical Images', file: 'medsam-paper.pdf', vendor: 'Bowang Lab (UoT)', date: 'Jan 2024', url: 'https://github.com/bowang-lab/MedSAM' },
            { name: 'Virchow2 — Pathology Foundation Model', file: 'virchow2-2408.00738.pdf', vendor: 'Paige AI + MSK', date: 'Aug 2024', url: 'https://arxiv.org/abs/2408.00738' },
            { name: 'Prov-GigaPath — Whole-Slide Pathology FM (Nature)', file: 'prov-gigapath-nature.pdf', vendor: 'Microsoft + Providence', date: 'May 2024', url: 'https://www.nature.com/articles/s41586-024-07441-w' },
            { name: 'RETFound — Retinal Foundation Model (Nature)', file: 'retfound-nature.pdf', vendor: 'Moorfields + UCL', date: 'Sep 2023', url: 'https://www.nature.com/articles/s41586-023-06555-x' },
            { name: 'RadFM — Radiology Foundation Model (Nat. Comm.)', file: 'radfm-2025.pdf', vendor: 'Shanghai AI Lab', date: 'Aug 2025', url: 'https://www.nature.com/articles/s41467-025-62385-7' },
            { name: 'Polaris — Safety-focused LLM Constellation for Healthcare', file: 'polaris-2403.13313.pdf', vendor: 'Hippocratic AI', date: 'Mar 2024', url: 'https://arxiv.org/abs/2403.13313' },
            { name: 'Llama-3-Meditron Open-Weight Medical LLM Suite', file: 'meditron3-llama3.pdf', vendor: 'OpenMeditron (EPFL+Yale)', date: 'Dec 2024', url: 'https://openreview.net/pdf?id=ZcD35zKujO' },
            { name: 'Towards Building Multilingual Language Model for Medicine (MMedLM)', file: 'mmedlm-2402.13963.pdf', vendor: 'MAGIC-AI4Med (SJTU)', date: 'Sep 2024', url: 'https://arxiv.org/html/2402.13963v4' },
            { name: 'Med-Flamingo — Multimodal Medical Few-shot Learner', file: 'med-flamingo-2307.15189.pdf', vendor: 'Stanford + Hospital Italiano', date: 'Jul 2023', url: 'https://arxiv.org/abs/2307.15189' },
            { name: 'MedDr — Diagnosis-Guided Bootstrapping VLM', file: 'meddr-2404.15127.pdf', vendor: 'SmartLab HKUST', date: 'Apr 2024', url: 'https://arxiv.org/html/2404.15127v1/' },
            { name: 'BiomedGPT — Generalist Biomedical Vision-Language FM', file: 'biomedgpt-pmc.pdf', vendor: 'Lehigh + IBM', date: 'Aug 2024', url: 'https://pubmed.ncbi.nlm.nih.gov/39112796/' },
            { name: 'EchoCLIP — Vision-Language FM for Echocardiogram (Nature Med)', file: 'echoclip-nature-med.pdf', vendor: 'Cedars-Sinai', date: 'May 2024', url: 'https://www.nature.com/articles/s41591-024-02959-y' },
            { name: 'Echo-Vision-FM (Nature Comm.)', file: 'echo-vision-fm.pdf', vendor: 'Cedars-Sinai', date: 'Aug 2025', url: 'https://www.nature.com/articles/s41467-025-66340-4' },
            { name: 'PanDerm — Multimodal Vision FM for Clinical Dermatology (Nature Med)', file: 'panderm-nature-med.pdf', vendor: 'Monash University', date: 'Jun 2025', url: 'https://www.nature.com/articles/s41591-025-03747-y' },
            { name: 'AlphaFold 3 — Biomolecular Interactions (Nature)', file: 'alphafold-3-nature.pdf', vendor: 'Google DeepMind + Isomorphic Labs', date: 'May 2024', url: 'https://www.nature.com/articles/s41586-024-07487-w' },
            { name: 'GatorTron — Clinical NLP LLM (medRxiv)', file: 'gatortron-2022.pdf', vendor: 'Univ Florida + NVIDIA', date: 'Feb 2022', url: 'https://www.medrxiv.org/content/10.1101/2022.02.27.22271257v2.full' },
            { name: 'WMDP Benchmark — Hazardous Knowledge + Unlearning', file: 'wmdp-2403.03218.pdf', vendor: 'Center for AI Safety', date: 'Mar 2024', url: 'https://arxiv.org/abs/2403.03218' },
            { name: 'BioLP-bench — Biological Lab Protocol Errors (bioRxiv)', file: 'biolp-bench-2024.pdf', vendor: 'SecureBio + UK AISI', date: 'Aug 2024', url: 'https://www.biorxiv.org/content/10.1101/2024.08.21.608694v3.full' },
            { name: 'MedSafetyBench (NeurIPS 2024)', file: 'medsafetybench-2403.03744.pdf', vendor: 'NeurIPS 2024', date: 'Mar 2024', url: 'https://arxiv.org/abs/2403.03744' },
            { name: 'MedHallu — Medical Hallucination Detection', file: 'medhallu-2502.14302.pdf', vendor: 'MIT Media Lab', date: 'Feb 2025', url: 'https://arxiv.org/html/2502.14302v1' },
            { name: 'CSEDB — Clinical Safety/Effectiveness Dual-Track (Nature npj)', file: 'csedb-nature-npj-2025.pdf', vendor: 'Nature npj Digital Medicine', date: 'Jul 2025', url: 'https://www.nature.com/articles/s41746-025-02277-8' },
            { name: 'ReXrank — Public Leaderboard for Radiology Report Generation', file: 'rexrank-2411.15122.pdf', vendor: 'Harvard MGB', date: 'Nov 2024', url: 'https://arxiv.org/abs/2411.15122' },
            { name: 'AfriMed-QA — Pan-African Medical QA (ACL 2025)', file: 'afrimed-qa-2411.15640.pdf', vendor: 'Google Research + UCT', date: 'Nov 2024', url: 'https://arxiv.org/abs/2411.15640' },
            { name: 'BiMediX — Bilingual Medical MoE (MBZUAI)', file: 'bimedix-2402.13253.pdf', vendor: 'MBZUAI Oryx', date: 'Feb 2024', url: 'https://arxiv.org/html/2402.13253v1' },
            { name: 'MedAraBench — Arabic Medical QA (24,883 MCQs)', file: 'medarabench-2602.01714.pdf', vendor: 'MBZUAI', date: 'Feb 2026', url: 'https://arxiv.org/html/2602.01714v1' },
            { name: 'JMedLoRA — Japanese Medical LoRA Adaptation', file: 'jmedlora-2310.10083.pdf', vendor: 'Univ Tokyo Hospital', date: 'Oct 2023', url: 'https://arxiv.org/html/2310.10083' },
            { name: 'Aignostics × Mayo Pathology FM', file: 'aignostics-mayo-2501.05409.pdf', vendor: 'Aignostics + Mayo', date: 'Jan 2025', url: 'https://arxiv.org/html/2501.05409v1' },
            { name: 'Apollo — Lightweight Multilingual Medical LLM', file: 'apollo-2403.03640.pdf', vendor: 'FreedomIntelligence (CUHK)', date: 'Mar 2024', url: 'https://arxiv.org/abs/2403.03640' },
            { name: 'MedXpertQA — Expert-Level Medical Reasoning', file: 'medxpertqa-2501.18362.pdf', vendor: 'arXiv', date: 'Jan 2025', url: 'https://arxiv.org/abs/2501.18362' },
            { name: 'MIMIC-Sepsis Benchmark (arXiv 2510)', file: 'mimic-sepsis-2510.24500.pdf', vendor: 'MIT LCP', date: 'Oct 2025', url: 'https://arxiv.org/html/2510.24500v1' },
            { name: 'ChemFM — 3B Chemistry FM (Nature Comm. Chem.)', file: 'chemfm-nature-comm-chem.pdf', vendor: 'UC San Diego', date: 'May 2025', url: 'https://www.nature.com/articles/s42004-025-01793-8' },
            { name: 'TamGen — Target-Aware Molecule Generation (Nature Comm.)', file: 'tamgen-nature-comm.pdf', vendor: 'Microsoft Research Asia', date: 'Oct 2024', url: 'https://www.nature.com/articles/s41467-024-53632-4' },
            { name: 'Prov-GigaPath — Whole-Slide Pathology FM (Nature)', file: 'prov-gigapath-nature.pdf', vendor: 'Microsoft + Providence', date: 'May 2024', url: 'https://www.nature.com/articles/s41586-024-07441-w' },
            { name: 'Pathology FM Clinical Benchmarking (PMC)', file: 'pathology-fm-bench-pmc.pdf', vendor: 'PMC', date: 'Apr 2025', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12003829/' }
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
            { name: 'Google Gemma 4', url: 'https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/', desc: 'Gemma 4 family (Apr 2 2026, Apache 2.0): E2B/E4B/26B-A4B/31B-Dense. AIME-2026 89.2 / MMLU-Pro 85.2 / Codeforces 2150' },

            // ── Physical AI / World Model leaderboards & datasets ──
            { name: 'NVIDIA Cosmos Lab', url: 'https://research.nvidia.com/labs/cosmos-lab/', desc: 'Cosmos suite — Predict 2.5 (PAI-Bench T2W 0.768/I2W 0.810 SOTA), Reason 1+2 (Physical AI Bench #1 open), Policy (LIBERO 98.5 SOTA, RoboCasa 67.1 with 50 demos)' },
            { name: 'NVIDIA GEAR Lab (GR00T)', url: 'https://research.nvidia.com/labs/gear/', desc: 'GR00T N1/N1.5/N1.6/N1.7 humanoid VLA. N1.5 GR-1 lang-following 93.3% / Unitree G1 98.8% / RoboCasa365 unseen 20.0% SOTA' },
            { name: 'Stanford WorldScore', url: 'https://haoyi-duan.github.io/WorldScore/', desc: 'Unified eval for 3D/4D/video world models. 19+ models. Tencent HunyuanWorld-Voyager 77.62 #1 static, WonderWorld 86.87 3D-consistency leader' },
            { name: 'Cosmos-Reason1 Tech Report', url: 'https://arxiv.org/abs/2503.15558', desc: 'Cosmos Reason 1 56B/8B physical common sense + embodied reasoning + intuitive physics post-RL. Beats o1 (60.2 vs 59.9 PCS avg)' },
            { name: 'OpenVLA / OpenVLA-OFT', url: 'https://openvla.github.io', desc: 'OpenVLA-7B (Bridge V2 73.5%) and OpenVLA-OFT (LIBERO 97.1% avg full-split SOTA, 26× inference speedup, ALOHA 4-task 87.8% leader)' },
            { name: 'Pi (Physical Intelligence)', url: 'https://www.pi.website/research', desc: 'Pi-Zero (LIBERO 94.2 avg) + Pi-Zero Fast (5× training speedup) + Pi-0.5 (94% out-of-distribution new homes)' },
            { name: 'AgiBot Genie Envisioner', url: 'https://arxiv.org/abs/2508.05635', desc: 'GE-Base + GE-Act + GE-Sim + EWMBench. Spatial 0.94 / Temporal 0.98 / Dynamic 0.85 / Scene 0.91. Beats Pi-0/GO-1 on 3 of 4 RoboTwin tasks' },
            { name: 'Figure Helix Logistics', url: 'https://www.figure.ai/news/scaling-helix-logistics', desc: 'Figure 02 + Helix S1 — 4.31 sec/pkg, 94.4% barcode read, T_eff 1.1 vs human demonstrator' },
            { name: '1X World Model Challenge', url: 'https://arxiv.org/abs/2510.07092', desc: '1X humanoid world model — 23.0 PSNR sampling + 6.6386 CE compression (1st place both tracks)' },
            { name: 'VLABench', url: 'https://arxiv.org/abs/2412.18194', desc: 'ICCV 2025 large-scale language-conditioned VLA benchmark. 100 categories, 2000+ objects, long-horizon. Pi-0.5 47% Track 1 primitive' },
            { name: 'SimplerEnv', url: 'https://simpler-env.github.io', desc: 'Open-source robot simulator + policy leaderboard. Octo-Base ~62% baseline. Used by GR00T, Pi-Zero, OpenVLA' },
            { name: 'RoboArena', url: 'https://robo-arena.github.io', desc: 'Distributed real-world double-blind pairwise robot policy evaluation. ELO ranking from 4284+ episodes' },
            { name: 'WorldModelBench', url: 'https://world-model-bench.github.io', desc: 'NeurIPS 2025 — 7 domains × 56 sub-tasks, 350 prompts. Instruction Following / Common Sense / Physical Adherence (67K human labels)' },
            { name: 'Sierra τ³-Bench (Tau3)', url: 'https://sierra.ai/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice', desc: 'Tool-agent + voice + knowledge retrieval benchmark. ~700 policy docs. MiMo V2.5 Pro 72.9 leader' },
            { name: 'LIBERO Benchmark', url: 'https://libero-project.github.io', desc: 'Lifelong Robotic Manipulation (Spatial / Object / Goal / Long suites). VLA generalist standard. Cosmos Policy 98.5 / OpenVLA-OFT 97.1 / Pi-Zero 94.2 avg' },
            { name: 'RoboCasa', url: 'https://robocasa.ai', desc: 'Large-Scale household task simulation. 100+ atomic tasks × 24 environments. Cosmos Policy 67.1 with 50 demos vs GR00T N1 17.4 / N1.5 47.5' },
            { name: 'Skild AI Brain', url: 'https://www.skild.ai/blogs/building-the-general-purpose-robotic-brain', desc: 'Omni-bodied robot brain. Sim failure recovery 85% (vs RT-2/PaLM-E ~60%). Limb-loss adaptation 7.5s' },
            { name: 'Covariant RFM-1', url: 'https://covariant.ai/insights/rfm-1-update-higher-quality-grasp-accuracy/', desc: '8B robot foundation model. -43% pick retry rate, 99% real-world precision, 1000 cycles/hour' },
            { name: 'Apptronik Apollo', url: 'https://apptronik.com/apollo', desc: 'Humanoid (DeepMind Gemini Robotics partnership): 25 kg payload, 4 hr battery, 71 DOF, 5 min battery swap' },
            { name: 'Sanctuary AI Carbon (Phoenix)', url: 'https://www.sanctuary.ai/blog', desc: 'Gen 8 Phoenix — task automation in 24 hours (down from weeks)' },
            { name: 'Landing AI VisionAgent', url: 'https://landing.ai/blog/what-is-agentic-object-detection', desc: 'Agentic object detection — internal F1 79.7% (beats GPT-4o, Qwen2.5-VL, Florence-2, OWLv2)' },
            { name: 'OpenAI ChatGPT for Clinicians', url: 'https://openai.com/index/making-chatgpt-better-for-clinicians/', desc: 'Free clinician-tier ChatGPT (Apr 2026) — GPT-5.4 scores 59.0 on HealthBench Professional vs 43.7 human physicians' },
            { name: 'OpenAI HealthBench Professional', url: 'https://openai.com/index/healthbench/', desc: 'Open clinician chat benchmark — 525 tasks, 3 use cases (care consult / writing / research), physician rubrics' },
            { name: 'Med-Gemini (Google Research)', url: 'https://research.google/blog/advancing-medical-ai-with-med-gemini/', desc: 'Med-Gemini family — MedQA 91.1% via uncertainty-guided search. NEJM Image, JAMA, MIMIC-IV evals' },
            { name: 'Med-PaLM (Google)', url: 'https://sites.research.google/med-palm/', desc: 'Med-PaLM 2 — first to reach human-expert MedQA 86.5%. Med-PaLM M multimodal fork (DeID radiology)' },
            { name: 'MedSAM (Bowang Lab)', url: 'https://github.com/bowang-lab/MedSAM', desc: 'Universal med-image segmentation — 11 modalities, 1M image-mask pairs. Median Dice 92% (CT ICH 94, glioma MR 94.4)' },
            { name: 'SAM-Med2D / SAM-Med3D', url: 'https://github.com/OpenGVLab/SAM-Med2D', desc: 'Shanghai AI Lab universal med-seg — 4.6M images / 19.7M masks. 2D + 3D variants' },
            { name: 'OpenBioLLM (Saama)', url: 'https://huggingface.co/blog/aaditya/openbiollm', desc: 'OpenBioLLM-70B (Llama 3) — outperforms GPT-4/Med-PaLM-2/Meditron on 9 biomedical datasets, avg 86.06%' },
            { name: 'Meditron (EPFL/Yale)', url: 'https://huggingface.co/epfl-llm/meditron-70b', desc: 'Meditron 7B/70B — Llama-2 medical fine-tune on PubMed + clinical guidelines' },
            { name: 'Mahmood Lab Pathology FMs', url: 'https://github.com/mahmoodlab', desc: 'UNI / UNI2 / CONCH / TITAN — Harvard pathology FMs, no TCGA contamination, public benchmark-ready' },
            { name: 'Paige AI Virchow', url: 'https://arxiv.org/abs/2408.00738', desc: 'Virchow2 (ViT-H) and Virchow2G (ViT-G) — 1.7B-1.9B-tile pathology DINOv2 FMs, external avg AUROC 0.82' },
            { name: 'Microsoft Prov-GigaPath', url: 'https://www.nature.com/articles/s41586-024-07441-w', desc: 'Whole-slide pathology FM — 1.3B tiles / 171K WSIs from Providence. 17 genomic + 9 cancer subtyping evals' },
            { name: 'RETFound (Moorfields/UCL)', url: 'https://www.nature.com/articles/s41586-023-06555-x', desc: 'Retinal FM — 1.6M unlabeled retinal images, sight-threatening + systemic disease prediction' },
            { name: 'RadFM (Shanghai AI Lab)', url: 'https://www.nature.com/articles/s41467-025-62385-7', desc: 'Generalist radiology FM — 13M 2D + 615K 3D scans, RadBench, beats GPT-4V' },

            // ─── Medical safety / hallucination / radiology gen / VQA ───
            { name: 'Med-HALT (Medical Hallucination Test)', url: 'https://medhalt.github.io/', desc: 'Multinational medical exam-derived hallucination benchmark. GPT-5.5 81.3, Med-Gemini 76.4' },
            { name: 'MedHallu Paper (arXiv)', url: 'https://arxiv.org/html/2502.14302v1', desc: 'MIT Media Lab 10K medical hallucination QA from PubMedQA. Trained detector 84.1' },
            { name: 'MedHallBench (UCSD)', url: 'https://arxiv.org/abs/2412.18947', desc: 'Comprehensive medical hallucination eval — expert-validated case scenarios' },
            { name: 'MedSafetyBench (NeurIPS 2024)', url: 'https://arxiv.org/abs/2403.03744', desc: 'AMA 9-principle medical safety. 450 prompts. Lower=safer. ChatGPT for Clinicians 5.2 vs Meditron 18.6' },
            { name: 'CSEDB (Nature npj 2025)', url: 'https://www.nature.com/articles/s41746-025-02277-8', desc: 'Clinical Safety-Effectiveness Dual-Track — 30 metrics. Avg safety 54.7, effectiveness 62.3, -13.3% in high-risk' },
            { name: 'PatientSafeBench Paper', url: 'https://openreview.net/pdf/12a1638233ed711151b702a35d81c3a4572fb475.pdf', desc: 'Patient-use safety eval — Polaris 92.4, ChatGPT for Clinicians 88.5' },
            { name: 'MEDIC Clinical LLM Indicators (arXiv 2409)', url: 'https://arxiv.org/pdf/2409.07314', desc: 'Yale + Google 5-axis comprehensive clinical LLM eval' },
            { name: 'ReXrank Public Leaderboard', url: 'https://rexrank.ai/', desc: 'Radiology report generation — 8 metrics (RadGraph-F1, BERTScore, RadCliQ, GREEN, FineRadScore, BLEU-2, RaTEScore, SembScore). MedVersa 2025 SOTA' },
            { name: 'ReXrank Paper', url: 'https://arxiv.org/abs/2411.15122', desc: 'Harvard MGB technical paper for ReXrank' },
            { name: 'VQA-RAD Dataset (Nature Sci Data)', url: 'https://www.nature.com/articles/sdata2018251', desc: '315 images, 3,515 questions. Standard radiology VQA since 2018' },
            { name: 'SLAKE-VQA Paper', url: 'https://arxiv.org/abs/2102.09542', desc: 'Bilingual EN-CN medical VQA — 642 images + 14K questions. MedDr 89.2 SOTA' },
            { name: 'Path-VQA Paper', url: 'https://arxiv.org/abs/2003.10286', desc: 'Pathology VQA — 32K Q-A pairs. MedDr 87.2 SOTA' },
            { name: 'PMC-VQA Paper', url: 'https://arxiv.org/abs/2305.10415', desc: 'Large-scale medical VQA from PubMed Central figures' },

            // ─── Multilingual regional medical ───
            { name: 'AfriMed-QA Project Page', url: 'https://afrimedqa.com/', desc: 'Pan-African multi-specialty 15,275 questions. Google Research + UCT' },
            { name: 'AfriMed-QA Paper (ACL 2025)', url: 'https://arxiv.org/abs/2411.15640', desc: 'First pan-African medical benchmark technical paper' },
            { name: 'BiMediX (MBZUAI Oryx)', url: 'https://github.com/mbzuai-oryx/BiMediX', desc: 'Arabic-English bilingual medical MoE — 1.3M instructions, 632M tokens. BiMediX 65.4 avg' },
            { name: 'MedAraBench Paper', url: 'https://arxiv.org/html/2602.01714v1', desc: 'Arabic medical benchmark — 24,883 MCQs × 19 specialties × 5 difficulty levels' },
            { name: 'Apollo Multilingual Medical Paper', url: 'https://arxiv.org/abs/2403.03640', desc: 'Apollo 0.5B-7B — best small-model multilingual medical performance. CUHK+India consortium' },
            { name: 'MMedLM GitHub', url: 'https://github.com/MAGIC-AI4Med/MMedLM', desc: 'MMedLM 2 (1.8B/7B/70B) — 6-language medical model, MMedBench evaluation' },

            // ─── Clinical outcome prediction (MIMIC/eICU) ───
            { name: 'MIMIC-IV (PhysioNet)', url: 'https://physionet.org/content/mimiciv/3.1/', desc: 'Critical care DB — 364K patients, 553K admissions, 95K ICU stays. Beth Israel Deaconess (Boston)' },
            { name: 'eICU Collaborative Research DB', url: 'https://physionet.org/content/eicu-crd/2.0/', desc: '200+ US hospital ICU DB. Cross-generalization with MIMIC-IV transferability eval' },
            { name: 'MIMIC-CXR JPG (PhysioNet)', url: 'https://physionet.org/content/mimic-cxr-jpg/2.1.0/', desc: '377K chest X-ray images, 227K studies. Reference for CXR report generation' },
            { name: 'MIMIC-Sepsis Benchmark Paper', url: 'https://arxiv.org/html/2510.24500v1', desc: 'MIMIC-IV sepsis trajectory benchmark — 35,239 ICU patients' },

            // ─── Bio dual-use / safety / protein / drug ───
            { name: 'WMDP Benchmark (CAIS)', url: 'https://safe.ai/blog/wmdp-benchmark', desc: 'Hazardous bio/chem/cyber knowledge proxy for LLM dual-use risk. RMU unlearning method reference' },
            { name: 'WMDP arXiv Paper', url: 'https://arxiv.org/abs/2403.03218', desc: 'WMDP technical paper — 3,668 MCQs across bio/cyber/chem hazardous knowledge' },
            { name: 'BioLP-bench (bioRxiv)', url: 'https://www.biorxiv.org/content/10.1101/2024.08.21.608694v3.full', desc: 'Biological lab protocol benchmark — find/correct mistakes in real lab protocols' },
            { name: 'Epoch AI Biorisk Evals', url: 'https://epoch.ai/gradient-updates/do-the-biorisk-evaluations-of-ai-labs-actually-measure-the-risk-of-developing-bioweapons', desc: 'VCT (Virology Capabilities Test) — frontier models beat 94% expert virologists. SecureBio + UK AISI' },
            { name: 'AlphaFold 3 (Nature)', url: 'https://www.nature.com/articles/s41586-024-07487-w', desc: 'Protein-ligand-nucleic acid structure prediction. PDBBind 1.65Å, beats specialized docking' },
            { name: 'AlphaFold/Boltz/Chai-1 Comparison', url: 'https://blog.booleanbiotech.com/alphafold3-boltz-chai1', desc: 'Boolean Biotech ABCs of AlphaFold 3, Boltz-1/2 (binding affinity), Chai-1' },
            { name: 'TamGen — Target-Aware Molecule Generation', url: 'https://www.nature.com/articles/s41467-024-53632-4', desc: 'Microsoft Research Asia GPT-like chemical LM for drug design' },
            { name: 'ChemFM Paper (Nature Comm. Chem.)', url: 'https://www.nature.com/articles/s42004-025-01793-8', desc: 'UCSD ChemFM 3B — pre-trained on 178M molecules. +67.48% gain on 34 property prediction benches' },
            { name: 'GP-MoLFormer (RSC Digital Discovery)', url: 'https://pubs.rsc.org/en/content/articlepdf/2025/dd/d5dd00122f', desc: 'IBM GP-MoLFormer 1.1B — pair-tuning, MoleculeNet 78.4' },
            { name: 'Pathology FM External Benchmarking (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12003829/', desc: 'Clinical benchmark of public pathology SSL FMs. Virchow2 0.82, UNI2 0.79, Prov-GigaPath 0.787' },
            { name: 'Mahmood Lab GitHub', url: 'https://github.com/mahmoodlab', desc: 'UNI / UNI2 / CONCH / TITAN — Harvard pathology FMs, no TCGA contamination' },
            { name: 'EvolutionaryScale (ESM3)', url: 'https://www.evolutionaryscale.ai/', desc: 'ESM3 98B frontier protein FM. ex-Meta team' },
            { name: 'IPD UW Baker Lab', url: 'https://www.bakerlab.org/', desc: 'RoseTTAFold 3 all-atom protein structure prediction' },

            // ─── National sovereign medical AI sites (10 countries) ───
            { name: 'ELYZA-LLM-Med (Japan)', url: 'https://itbusinesstoday.com/health-tech/elyza-develops-japan-focused-medical-llm-platform/', desc: 'Japanese medical LLM — IgakuQA national SOTA 87.5. 7B + 70B variants' },
            { name: 'JMedLoRA Paper', url: 'https://arxiv.org/html/2310.10083', desc: 'Univ Tokyo Hospital Japanese medical instruction-tuning eval' },
            { name: 'Japanese Bilingual Medical LLM', url: 'https://arxiv.org/html/2409.11783v1', desc: 'Bilingual JP-EN medical LLM — JMedBench reference' },
            { name: 'DKFZ+EMBL Delphi (Nature 2025)', url: 'https://www.dkfz.de/en/news/press-releases/detail/ai-model-predicts-disease-risks-decades-in-advance', desc: 'German Cancer Research Center+EMBL — 1,000-disease risk FM. 400K UK Biobank + 1.9M Denmark validation' },
            { name: 'Aignostics × Mayo Pathology FM', url: 'https://arxiv.org/html/2501.05409v1', desc: 'Charité Berlin spin-off Aignostics + Mayo Clinic pathology FM (Jan 2025)' },
            { name: 'Aignostics Pathology FM Blog', url: 'https://www.aignostics.com/blog/towards-robust-foundation-models-for-digital-pathology', desc: 'Rudolf pathology FM results — robust digital pathology' },
            { name: 'Owkin (France)', url: 'https://www.owkin.com/', desc: 'H-Optimus 1.1B pathology FM, DRAGON 2 multimodal pathology+omics' },
            { name: 'Raidium MedFound (France)', url: 'https://www.raidium.fr/', desc: 'Raidium France radiology FM — chest X-ray + multi-modal report generation' },
            { name: 'NHS England AI', url: 'https://transform.england.nhs.uk/', desc: 'NHS England AIDE clinical LLM — primary care decision support deployment' },
            { name: 'UCL AI Centre', url: 'https://www.ucl.ac.uk/ai-centre/', desc: 'University College London — UCL AISL Clinical 13B' },
            { name: 'Imperial College London Medical AI', url: 'https://www.imperial.ac.uk/', desc: 'Imperial Medical LLM — clinical research foundation model' },
            { name: 'UHN AI Hub (Toronto)', url: 'https://uhnhub.ai/', desc: 'University Health Network Toronto — UHN Foundation 7B + Vector Institute collaboration' },
            { name: 'Vector Institute (Toronto)', url: 'https://vectorinstitute.ai/', desc: "Canada's AI ecosystem hub. Clairvoyance 13B clinical model. 60+ healthcare partners" },
            { name: 'Mila + McGill Medical AI', url: 'https://mila.quebec/', desc: 'Mila Quebec + McGill — CliniCLM 7B clinical model' },
            { name: 'T-CAIREM (Univ Toronto)', url: 'https://tcairem.utoronto.ca/', desc: 'Temerty Centre for AI Research and Education in Medicine — HealthBench 7B' },
            { name: 'Fractal Vaidya 2.0 (India)', url: 'https://fractal.ai/about-us/media/fractal-launches-vaidya-2.0', desc: 'India AI Impact Summit 2026 — HealthBench Hard 50.1 world 1st 50+, beat GPT-5+Gemini Pro 3' },
            { name: 'Vaidya AI Project Page', url: 'https://vaidya.ai/modelsOverview', desc: 'Free AI health companion — 850K+ training images+text, 30B+ params. India 1st medical LLM' },
            { name: 'AI4Bharat (IIT Madras)', url: 'https://ai4bharat.iitm.ac.in/', desc: 'Indic LLMs — Airavata Medical multilingual Indian medical' },
            { name: 'M42 Med42 Clinical LLM (UAE)', url: 'https://m42.ae/media-resources/news/m42-announces-new-clinical-llm-to-transform-the-future-of-ai-in-healthcare/', desc: 'M42 (G42 Healthcare + Mubadala) Med42 70B — Cerebras-trained, Core42 collab' },
            { name: 'TII Falcon (UAE)', url: 'https://falconllm.tii.ae/', desc: 'TII Falcon Bio-Medical — UAE sovereign medical foundation' },
            { name: 'Synapxe (Singapore MOH)', url: 'https://www.synapxe.sg/', desc: 'Singapore Ministry of Health digital arm — Clinical-CLM 7B sovereign healthcare LLM' },
            { name: 'AI Singapore Health Models', url: 'https://aisingapore.org/', desc: 'AI Singapore SEA-MedLex 13B Southeast Asian medical lexicon' },
            { name: 'Alibaba DAMO Health', url: 'https://damo.alibaba.com/', desc: 'DAMO Academy SumiHealth 72B — Chinese medical LLM, CMExam 82.4 SOTA' },
            { name: 'Tencent Yuanbao Health', url: 'https://yuanbao.tencent.com/', desc: 'Tencent MedLLM-2 multimodal Chinese medical' },
            { name: 'Baidu Wenxin Yiyi', url: 'https://yiyan.baidu.com/', desc: 'Baidu Wenxin Yiyi medical specialization Chinese assistant' },
            { name: 'Shanghai AI Lab Puyu Medical', url: 'https://internlm.intern-ai.org.cn/', desc: 'Puyu Medical 7B — InternLM medical fine-tune. RadFM/VisionFM/SAM-Med parent' },
            { name: 'Tsinghua THUDM Medical', url: 'https://github.com/THUDM/', desc: 'GLM-Medical 9B — Tsinghua THUDM. PromedQA 81.7 SOTA. DoctorGLM parent' },
            { name: 'iFLYTEK Spark Medical', url: 'https://xinghuo.xfyun.cn/', desc: 'Spark Medical 3.0 — iFLYTEK multimodal Chinese medical' },
            { name: 'FreedomIntelligence Medical', url: 'https://github.com/FreedomIntelligence/HuatuoGPT', desc: 'HuatuoGPT-II/o1, HuatuoGPT-Vision 7B/34B Chinese medical LLM/VLM. CUHK' },
            { name: 'KMed.ai (SNUH+Naver)', url: 'http://www.snuh.org/global/en/about/newsView.do?bbs_no=7384', desc: 'Seoul National University Hospital + Naver — Korean medical sovereign LLM. KMLE 96.4 (3-yr avg)' },
            { name: 'Hippocratic AI Polaris', url: 'https://hippocraticai.com/polaris-3/', desc: 'Polaris 3.0 — 4.2T 22-LLM constellation. Patient-facing clinical accuracy 99.38%' },
            { name: 'Stanford Almanac (NEJM AI)', url: 'https://ai.nejm.org/doi/full/10.1056/AIoa2300068', desc: 'RAG-augmented clinical LLM — factuality + completeness + adversarial safety gains' },
            { name: 'OpenMeditron (HuggingFace)', url: 'https://huggingface.co/OpenMeditron/Meditron3-8B', desc: 'Llama-3-Meditron 8B/70B — open-weight medical LLM, surpasses Llama 3.1 by +3% on MedQA/MedMCQA/PubMedQA' },
            { name: 'Aaditya OpenBioLLM Blog', url: 'https://huggingface.co/blog/aaditya/openbiollm', desc: 'OpenBioLLM-Llama3 8B/70B — outperforms GPT-4 on 9 biomedical datasets, avg 86.06%' },
            { name: 'M42 Health Med42 (HF)', url: 'https://huggingface.co/m42-health/Llama3-Med42-70B', desc: 'M42-v2 70B Llama-3 medical fine-tune, MedQA 79.1' },
            { name: 'HPAI BSC Aloe', url: 'https://huggingface.co/HPAI-BSC/Llama3.1-Aloe-Beta-70B', desc: 'Aloe-Beta 8B/70B Spanish HPAI BSC medical LLM — MedQA 80.5' },
            { name: 'BiomedGPT (PMC)', url: 'https://pubmed.ncbi.nlm.nih.gov/39112796/', desc: 'Generalist biomedical vision-language FM — 16/25 SOTA experiments. Lehigh + IBM' },
            { name: 'On-device Medical LLMs (arXiv 2502)', url: 'https://arxiv.org/html/2502.08954v1', desc: 'AMEGA on-device benchmark — Med42 + Aloe lead on-device deployment' },

            // ─── BMT registry ───
            { name: 'BMT — Benchmark/Dataset Registry (local)', url: 'https://github.com/hollobit/SOTA/blob/ops/BMT/BMT.json', desc: '2,559-entry curated benchmark/dataset registry. Automatic mapping in scripts/map_bmt_benchmarks.py' },
            { name: 'BMT-mapping.json (matched)', url: 'https://github.com/hollobit/SOTA/blob/ops/BMT/BMT-mapping.json', desc: '57 medical/general benchmarks enriched with paper/github/year/item_count from BMT registry' },
            { name: 'BMT-miss.json (missed)', url: 'https://github.com/hollobit/SOTA/blob/ops/BMT/BMT-miss.json', desc: '35 benchmarks not found in BMT — candidates for upstream BMT registry submission' },

            // ─── Open Medical-LLM Leaderboard ───
            { name: 'HuggingFace Open Medical-LLM Leaderboard', url: 'https://huggingface.co/blog/leaderboard-medicalllm', desc: 'Open leaderboard — MedQA + MedMCQA + PubMedQA + MMLU Medical (6-subject) avg' },
            { name: 'Open Medical-LLM Leaderboard Space', url: 'https://huggingface.co/spaces/openlifescienceai/open_medical_llm_leaderboard', desc: 'HF Space — model rankings on standard medical QA suite' },
            { name: 'NEJM AI Journal', url: 'https://ai.nejm.org/', desc: 'New England Journal of Medicine AI — peer-reviewed medical AI research (MedAgentBench, Almanac)' },

            // ─── BMT-sourced medical leaderboards (2026 update) ───
            { name: 'MedHELM Leaderboard (Stanford CRFM)', url: 'https://crfm.stanford.edu/helm/medhelm/latest/', desc: 'Stanford holistic medical LLM eval — 5 categories × 22 subcategories × 121 tasks × 35 benchmarks. Claude Opus 4.6 81.5, GPT-5.5 78.4, Med-Gemini 76.2' },
            { name: 'MedHELM Paper (arXiv)', url: 'https://arxiv.org/abs/2505.23802', desc: 'MedHELM technical paper — 29-clinician taxonomy, LLM-jury method ICC=0.47 vs clinician-clinician 0.43' },
            { name: 'MedHELM Docs (CRFM HELM)', url: 'https://crfm-helm.readthedocs.io/en/latest/medhelm/', desc: 'MedHELM framework documentation — extensible HELM medical evaluation' },
            { name: 'AgentClinic Project', url: 'https://agentclinic.github.io/', desc: 'Multimodal clinical agent benchmark — AgentClinic-MedQA + AgentClinic-NEJM. Claude-3.5 leads. GPT-4 52% MedQA, drops <10% of original' },
            { name: 'AgentClinic GitHub', url: 'https://github.com/SamuelSchmidgall/AgentClinic', desc: 'AgentClinic eval code — sequential decision-making clinical interactions' },
            { name: 'AgentClinic Paper (arXiv)', url: 'https://arxiv.org/abs/2405.07960', desc: 'AgentClinic technical paper — multimodal agent benchmark for simulated clinical environments' },
            { name: 'MedAgentBench (NEJM AI 2025)', url: 'https://ai.nejm.org/doi/full/10.1056/AIdbp2500144', desc: 'Virtual EHR agent benchmark — 300 patient tasks, 100 patient profiles, 700K data elements, FHIR-compliant. Stanford' },
            { name: 'MedAgentBench arXiv', url: 'https://arxiv.org/abs/2501.14654', desc: 'Realistic Virtual EHR Environment to Benchmark Medical LLM Agents' },
            { name: 'MedAgentsBench (Complex Reasoning)', url: 'https://arxiv.org/html/2503.07459v1', desc: 'Benchmarking thinking models + agent frameworks for complex medical reasoning' },
            { name: 'Vals AI MedQA Leaderboard', url: 'https://www.vals.ai/benchmarks/medqa', desc: 'Live MedQA leaderboard. Apr 2026: o4-mini-high 95.2, Gemini 2.5 Pro 94.6, Claude 3.7 Sonnet 92.3' },
            { name: 'Stanford HAI MedArena', url: 'https://hai.stanford.edu/news/medarena-comparing-llms-for-medicine-in-the-wild', desc: 'Head-to-head LLM comparison for medicine in the wild — clinician vote-based pairwise preference Elo' },
            { name: 'MedMNIST (GitHub)', url: 'https://github.com/MedMNIST/MedMNIST', desc: 'MedMNIST v2 — 708,069 2D + 10,214 3D biomedical images across 18 datasets. CT/MRI/X-ray/OCT/Ultrasound/EM' },
            { name: 'MedMNIST Paper (arXiv)', url: 'https://arxiv.org/abs/2110.14795', desc: 'MedMNIST v2 — large-scale standardized biomedical image classification benchmark' },
            { name: 'EHRNoteQA (arXiv 2402)', url: 'https://arxiv.org/abs/2402.16040', desc: 'MIMIC-IV EHR-grounded clinical QA — discharge summaries / progress notes / radiology reports' },
            { name: 'Stanford Healthcare AI Benchmarks (HAI)', url: 'https://hai.stanford.edu/news/stanford-develops-real-world-benchmarks-for-healthcare-ai-agents', desc: 'Stanford HAI real-world healthcare AI benchmark development. HealthAdminBench, MedInsightBench' },

            // ─── BMT round 2 (2026-04-27) — MSD/BraTS/ISIC/MedCalc/LongHealth/Chinese ───
            { name: 'Medical Segmentation Decathlon', url: 'http://medicaldecathlon.com/', desc: '10-task biomedical segmentation challenge (Liver/Brain/Hippocampus/Lung/Prostate/Cardiac/Pancreas/Colon/Hepatic Vasc/Spleen)' },
            { name: 'MSD Paper (Nature Comm. 2022)', url: 'https://www.nature.com/articles/s41467-022-30695-9', desc: 'Medical Segmentation Decathlon — algorithm generalization across organs/modalities' },
            { name: 'BraTS 2024 (UPenn CBICA)', url: 'https://www.med.upenn.edu/cbica/brats2024/', desc: 'MICCAI Brain Tumor Segmentation — gliomas/meningiomas/metastases multi-modal MRI' },
            { name: 'ISIC Challenge (Skin Cancer)', url: 'https://challenge.isic-archive.com/', desc: 'ISIC 2020 melanoma classification — 33,126 dermoscopic images' },
            { name: 'Hyper-Kvasir Dataset', url: 'https://datasets.simula.no/hyper-kvasir/', desc: 'GI endoscopy comprehensive dataset — images + videos + landmarks + pathology' },
            { name: 'MedCalc-Bench (NeurIPS 2024)', url: 'https://arxiv.org/abs/2406.12036', desc: 'Medical calculation eval — 1,000+ instances × 55 calc tasks. Patient note → compute medical value' },
            { name: 'MedCalc-Bench GitHub', url: 'https://github.com/ncbi-nlp/MedCalc-Bench', desc: 'NCBI NLM MedCalc-Bench code + dataset' },
            { name: 'MedJourney (NeurIPS 2024)', url: 'https://openreview.net/pdf?id=XXaIoJyYs7', desc: 'Chinese clinical-journey benchmark — 12 datasets × 12 tasks across 4 patient-flow stages' },
            { name: 'LongHealth Paper (Springer)', url: 'https://link.springer.com/article/10.1007/s41666-025-00204-w', desc: 'Long-context clinical QA — 20 patient cases × 400 MCQ across extraction/negation/sorting' },
            { name: 'Awesome Radiology Report Generation', url: 'https://github.com/mk-runner/Awesome-Radiology-Report-Generation', desc: 'Curated paper list, datasets, and tools for radiology report generation' },
            { name: 'OpenI Indiana Univ. Chest X-ray', url: 'https://openi.nlm.nih.gov/', desc: 'Indiana Univ. CXR + report dataset for report generation benchmarking' },
            { name: 'VinDr-CXR (Vietnamese Open CXR)', url: 'https://vindr.ai/datasets/cxr', desc: 'Open CXR with radiologist annotations — thoracic disease classification + bbox' },
            { name: 'RSNA Pneumonia Detection', url: 'https://www.kaggle.com/c/rsna-pneumonia-detection-challenge', desc: 'Kaggle pneumonia detection — bbox annotations on chest radiographs' },
            { name: 'MedRAG GitHub', url: 'https://github.com/Teddy-XiongGZ/MedRAG', desc: 'Retrieval-augmented medical QA across PubMed/Textbook/StatPearls/Wikipedia/MedCorp' },

            // ─── Nursing AI (NCLEX) ───
            { name: 'NurseLLM Paper (arXiv 2510)', url: 'https://arxiv.org/html/2510.07173v1/', desc: 'First nursing-specialized LLM. Imperial College London + Manchester. NCLEX-RN 88.4' },
            { name: 'ChatGPT NCLEX Performance (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11466054/', desc: 'ChatGPT 4.0 88.7% on NCLEX-RN, 79.3% on Chinese-translated. 150 practical questions' },
            { name: 'JMIR Medical Education NCLEX', url: 'https://mededu.jmir.org/2024/1/e52746', desc: 'Cross-sectional study — ChatGPT on US + China nursing licensure' },
            { name: 'Chinese Nursing Licensure Comparison', url: 'https://medinform.jmir.org/2025/1/e63731', desc: 'JMIR Medical Informatics — Qwen-2.5 88.9 SOTA, GPT-4o 80.7, ERNIE Bot-3.5 78.1, GPT-4.0 70.3' },
            { name: 'JMIR Nursing Concept Analysis', url: 'https://nursing.jmir.org/2025/1/e77948', desc: 'Concept analysis of LLMs in nursing education across domains' },
            { name: 'Nursing Education PAGER Review', url: 'https://www.sciencedirect.com/science/article/pii/S0260691725002588', desc: 'PAGER scoping review — patterns, advances, gaps in ChatGPT for nursing education' },

            // ─── Advanced medical imaging benchmarks ───
            { name: 'CheXpert Plus Dataset', url: 'https://stanfordmlgroup.github.io/competitions/chexpert/', desc: 'Largest English paired CXR image-text dataset — DICOM/PNG + reports + RadGraph + metadata. Stanford AIMI' },
            { name: 'CheXpert Plus Paper (CVPR 2025)', url: 'https://arxiv.org/abs/2410.00379', desc: 'CXPMRG-Bench — pre-training and benchmarking for X-ray report generation on CheXpert Plus' },
            { name: 'CXR-LT 2024 Paper', url: 'https://arxiv.org/html/2506.07984', desc: 'MICCAI 2024 long-tailed multi-label zero-shot disease classification from chest X-ray' },
            { name: 'MCA-RG (MICCAI 2025)', url: 'https://link.springer.com/chapter/10.1007/978-3-032-04971-1_36', desc: 'Medical Concept Alignment for Radiology Report Generation. MIMIC-CXR + CheXpert Plus eval' },
            { name: 'Structured Radiology (EMNLP 2025)', url: 'https://aclanthology.org/2025.emnlp-main.392.pdf', desc: 'Structuring radiology reports — challenging LLMs with section-level extraction' },
            { name: 'Awesome Multimodal Medical Imaging', url: 'https://github.com/richard-peng-xia/awesome-multimodal-in-medical-imaging', desc: 'Curated multimodal medical imaging paper repository' }
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
