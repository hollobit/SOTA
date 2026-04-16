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

    init: function() {
        var self = this;
        this.loadData().then(function() {
            self.setupTabs();
            self.setupFilters();
            self.setupExplorer();
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
            tdName.appendChild(strong);
            tr.appendChild(tdName);

            var tdCat = document.createElement('td');
            var badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = bench ? bench.category : '\u2014';
            tdCat.appendChild(badge);
            tr.appendChild(tdCat);

            var tdModel = document.createElement('td');
            tdModel.textContent = info.model_id;
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
        var sorted = Filters.sortByValue(filtered);
        var container = document.getElementById('leaderboard-table-container');
        container.textContent = '';

        var table = document.createElement('table');
        table.className = 'sota-table';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['Model', 'Benchmark', 'Score', 'Source', 'Date'].forEach(function(text) {
            var th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        var self = this;
        sorted.slice(0, 200).forEach(function(s) {
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
        if (benchId && Object.keys(this.data.history).length > 0) {
            Charts.renderTrendLine('trend-chart', benchId, this.data.history);
        }

        var grouped = Filters.groupByModel(this.data.scores);
        var modelIds = Object.keys(grouped).slice(0, 20);
        var benchIds = [];
        var benchSet = {};
        this.data.scores.forEach(function(s) {
            if (!benchSet[s.benchmark_id]) {
                benchSet[s.benchmark_id] = true;
                benchIds.push(s.benchmark_id);
            }
        });
        benchIds = benchIds.slice(0, 15);
        var matrix = modelIds.map(function(m) {
            return benchIds.map(function(b) { return grouped[m][b] || null; });
        });
        var shortNames = modelIds.map(function(m) { return m.split('/').pop(); });
        Charts.renderHeatmap('heatmap-chart', shortNames, benchIds, matrix);
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
