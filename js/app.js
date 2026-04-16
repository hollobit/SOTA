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
            // Hash-based routing: #overview, #leaderboard, #trends, etc.
            self._navigateToHash();
            window.addEventListener('hashchange', function() { self._navigateToHash(); });
        });
    },

    _navigateToHash: function() {
        var hash = (window.location.hash || '').replace('#', '');
        if (!hash) { this.renderOverview(); return; }

        // Check if it's a benchmark or model deep link: #bench/gpqa_diamond or #model/anthropic/claude-opus-4.7
        if (hash.indexOf('bench/') === 0) {
            var benchId = hash.substring(6);
            this.renderOverview();
            setTimeout(function() { Modal.showBenchmark(benchId); }, 300);
            return;
        }
        if (hash.indexOf('model/') === 0) {
            var modelId = hash.substring(6);
            this.renderOverview();
            setTimeout(function() { Modal.showModel(modelId); }, 300);
            return;
        }

        // Tab navigation
        var tabBtn = document.querySelector('.tab-btn[data-tab="' + hash + '"]');
        if (tabBtn) {
            tabBtn.click();
        } else {
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

            // Load history data for SOTA trends
            return self._fetch(base + '/scores/history/2026-04-16.json').then(function(h1) {
                if (h1) self.data.history['2026-04-16'] = h1;
                return self._fetch(base + '/scores/history/2026-04-17.json');
            }).then(function(h2) {
                if (h2) self.data.history['2026-04-17'] = h2;
                return self._fetch(base + '/reports/changelog.json');
            });
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
                // Update URL hash without triggering hashchange re-navigation
                history.replaceState(null, '', '#' + btn.dataset.tab);
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

                var rows = Explorer.compare(modelIds, self.data.scores, self.data.benchmarks);
                Explorer.renderComparison('comparison-result', modelIds, self.data.models, rows);
                Explorer.renderRadar('explorer-radar', modelIds, self.data.models, self.data.scores, self.data.benchmarks);
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
            title: { text: title, left: 'center', textStyle: { color: '#e5e7eb', fontSize: 13 } },
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
                textStyle: { color: '#9ca3af', fontSize: 10 }
            },
            grid: { left: 50, right: 20, top: 40, bottom: 50 },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { color: '#9ca3af' },
                axisLine: { lineStyle: { color: '#374151' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: '#1f2937' } }
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
            { name: 'Gemma Model Card', url: 'https://ai.google.dev/gemma/docs/core/model_card_4', desc: 'Gemma 4 evaluation data' },
            { name: 'Scale Labs Leaderboard', url: 'https://labs.scale.com/leaderboard', desc: 'SWE-bench Pro, HLE, expert-driven benchmarks' },
            { name: 'BenchLM.ai', url: 'https://benchlm.ai', desc: 'Provisional + verified rankings, 100+ benchmarks' },
            { name: 'Klu LLM Leaderboard', url: 'https://klu.ai/llm-leaderboard', desc: '30+ frontier models, cost vs speed vs quality' },
            { name: 'APEX-Agents (Mercor)', url: 'https://www.mercor.com/apex/', desc: 'AI Productivity Index for professional tasks' },
            { name: 'TAU3-Bench', url: 'https://sierra.ai/blog/bench-advancing-agent-benchmarking-to-knowledge-and-voice', desc: 'Next-gen agent tool-use + knowledge + voice' },
            { name: 'DemandSphere Frontier Tracker', url: 'https://www.demandsphere.com/blog/ai-frontier-model-tracker-launch/', desc: 'Real-time frontier model tracking' },
            { name: 'Stanford HAI AI Index', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report/technical-performance', desc: '2026 AI Index technical performance report' }
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
