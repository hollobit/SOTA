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
        history: {},
        enrichment: null,
        hfMetadata: null
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
            if (typeof Timeline !== 'undefined') {
                Timeline.init(self.data.models, self.data.benchmarks, self.data.scores);
            }
            if (typeof AI4S !== 'undefined') {
                AI4S.init(self.data.models);
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
            // Also check ?model=X / ?benchmark=X / ?vendor=X query params (for deep-link sharing)
            self._navigateFromUrl();
            window.addEventListener('hashchange', function() { self._navigateToHash(); });

            // Watchlist button
            document.addEventListener('DOMContentLoaded', function() {
                var wlBtn = document.getElementById('watchlist-btn');
                if (wlBtn) {
                    wlBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var existing = document.getElementById('watchlist-panel');
                        if (existing) {
                            existing.parentNode.removeChild(existing);
                            return;
                        }

                        // Build watchlist panel
                        var watched = [];
                        for (var i = 0; i < localStorage.length; i++) {
                            var k = localStorage.key(i);
                            if (k && k.indexOf('watchlist:') === 0 && localStorage.getItem(k) === '1') {
                                watched.push(k.replace('watchlist:', ''));
                            }
                        }

                        var panel = document.createElement('div');
                        panel.id = 'watchlist-panel';
                        panel.className = 'fixed top-14 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-80 max-h-[70vh] overflow-y-auto';

                        var hd = document.createElement('div');
                        hd.className = 'flex justify-between items-center px-4 py-2 border-b border-gray-700';
                        var title = document.createElement('h3');
                        title.className = 'text-sm font-semibold text-gray-200';
                        title.textContent = '★ Watchlist (' + watched.length + ')';
                        hd.appendChild(title);
                        var closeBtn = document.createElement('button');
                        closeBtn.className = 'text-gray-500 hover:text-gray-200 text-lg';
                        closeBtn.textContent = '\xd7';
                        closeBtn.title = 'Close';
                        closeBtn.addEventListener('click', function() {
                            panel.parentNode.removeChild(panel);
                        });
                        hd.appendChild(closeBtn);
                        panel.appendChild(hd);

                        if (watched.length === 0) {
                            var empty = document.createElement('div');
                            empty.className = 'p-4 text-xs text-gray-500';
                            empty.textContent = 'No models watched yet. Open any model and click ☆ Watch to add.';
                            panel.appendChild(empty);
                        } else {
                            var ul = document.createElement('ul');
                            ul.className = 'divide-y divide-gray-800';
                            watched.forEach(function(mid) {
                                var m = (App.data.models || []).find(function(x) { return x.id === mid; });
                                var li = document.createElement('li');
                                li.className = 'px-3 py-2 hover:bg-gray-800 cursor-pointer flex items-center justify-between';
                                li.addEventListener('click', function(ev) {
                                    if (ev.target.tagName === 'BUTTON') return;
                                    panel.parentNode.removeChild(panel);
                                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid);
                                });

                                var info = document.createElement('div');
                                info.className = 'flex-1 min-w-0';
                                var nm = document.createElement('div');
                                nm.className = 'text-sm text-blue-400 truncate';
                                nm.textContent = m ? m.name : mid;
                                info.appendChild(nm);
                                var meta = document.createElement('div');
                                meta.className = 'text-xs text-gray-500 truncate';
                                meta.textContent = (m ? m.vendor : '?') + ' \xb7 ' + (m && m.type ? m.type : '');
                                info.appendChild(meta);
                                li.appendChild(info);

                                // Diff badge — has watched score changed since snapshot?
                                try {
                                    var snapStr = localStorage.getItem('watchlist-snap:' + mid);
                                    if (snapStr) {
                                        var snap = JSON.parse(snapStr);
                                        var changes = 0;
                                        (App.data.scores || []).forEach(function(s) {
                                            if (s.model_id !== mid) return;
                                            var old = snap.scores && snap.scores[s.benchmark_id];
                                            if (old != null && Math.abs(s.value - old) > 0.05) changes++;
                                        });
                                        if (changes > 0) {
                                            var badge = document.createElement('span');
                                            badge.className = 'bg-yellow-900 text-yellow-300 text-xs px-1.5 py-0.5 rounded ml-2';
                                            badge.textContent = changes + ' changed';
                                            li.appendChild(badge);
                                        }
                                    }
                                } catch (e) {}

                                var rmBtn = document.createElement('button');
                                rmBtn.className = 'text-gray-500 hover:text-red-400 text-xs ml-2';
                                rmBtn.textContent = '✕';
                                rmBtn.title = 'Remove from watchlist';
                                rmBtn.addEventListener('click', function(ev) {
                                    ev.stopPropagation();
                                    try {
                                        localStorage.removeItem('watchlist:' + mid);
                                        localStorage.removeItem('watchlist-snap:' + mid);
                                    } catch (e) {}
                                    li.parentNode.removeChild(li);
                                    title.textContent = '★ Watchlist (' + (watched.length - 1) + ')';
                                });
                                li.appendChild(rmBtn);

                                ul.appendChild(li);
                            });
                            panel.appendChild(ul);
                        }

                        // Footer
                        var footer = document.createElement('div');
                        footer.className = 'px-4 py-2 border-t border-gray-700 text-xs text-gray-500';
                        footer.textContent = 'Click model to open. ✕ to remove. Score changes since first watched are highlighted.';
                        panel.appendChild(footer);

                        document.body.appendChild(panel);

                        // Click-away to close
                        setTimeout(function() {
                            document.addEventListener('click', function closer(ev) {
                                if (panel.contains(ev.target)) return;
                                if (ev.target === wlBtn) return;
                                if (panel.parentNode) panel.parentNode.removeChild(panel);
                                document.removeEventListener('click', closer);
                            });
                        }, 0);
                    });
                }
            });
        });
    },

    _navigateFromUrl: function() {
        // Try query params first (?model=X, ?benchmark=X, ?vendor=X)
        try {
            var params = new URLSearchParams(window.location.search);
            var queryModel = params.get('model');
            var queryBench = params.get('benchmark');
            var queryVendor = params.get('vendor');
            if (queryModel && typeof Modal !== 'undefined' && Modal.showModel) {
                this._activateTab('overview');
                this.renderOverview();
                var qm = queryModel;
                setTimeout(function() { Modal.showModel(qm); }, 300);
                return;
            }
            if (queryBench && typeof Modal !== 'undefined' && Modal.showBenchmark) {
                this._activateTab('overview');
                this.renderOverview();
                var qb = queryBench;
                setTimeout(function() { Modal.showBenchmark(qb); }, 300);
                return;
            }
            if (queryVendor && typeof Modal !== 'undefined' && Modal.showVendor) {
                this._activateTab('overview');
                this.renderOverview();
                var qv = decodeURIComponent(queryVendor);
                setTimeout(function() { Modal.showVendor(qv); }, 300);
                return;
            }
            var queryCompare = params.get('compare');
            if (queryCompare) {
                // Switch to Comparison tab + pre-select models
                var modelIds = queryCompare.split(',').map(function(s) { return s.trim(); }).filter(Boolean);
                if (modelIds.length > 0) {
                    var tabBtn = document.getElementById('tabbtn-comparison');
                    if (tabBtn) tabBtn.click();
                    setTimeout(function() {
                        var msel = document.getElementById('cmp-models');
                        if (!msel) return;
                        Array.prototype.forEach.call(msel.options, function(o) { o.selected = false; });
                        modelIds.forEach(function(id) {
                            var found = Array.prototype.find.call(msel.options, function(o) { return o.value === id; });
                            if (found) found.selected = true;
                        });
                        if (typeof Comparison !== 'undefined' && Comparison.render) {
                            if (Comparison._updateCounters) Comparison._updateCounters();
                            Comparison.render();
                        }
                    }, 200);
                    return;
                }
            }
        } catch (e) { /* URLSearchParams not supported — fall through */ }
        // Fallback to hash-based routing
        this._navigateToHash();
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
        if (hash.indexOf('vendor/') === 0) {
            var vendorName = decodeURIComponent(hash.substring(7));
            this._activateTab('overview');
            this.renderOverview();
            setTimeout(function() { Modal.showVendor(vendorName); }, 300);
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

        // Leaderboard with query: #leaderboard?cat=...&q=...
        if (hash.indexOf('leaderboard?') === 0 || hash === 'leaderboard') {
            var self = this;
            var leaderboardBtn = document.querySelector('.tab-btn[data-tab="leaderboard"]');
            if (leaderboardBtn) leaderboardBtn.click();
            var qIdx = hash.indexOf('?');
            if (qIdx > -1) {
                var query = hash.substring(qIdx + 1);
                setTimeout(function() {
                    if (self._applyLeaderboardHash(query)) self.renderLeaderboard();
                }, 50);
            }
            return;
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
            var footerModelCount = document.getElementById('footer-model-count');
            var footerBenchCount = document.getElementById('footer-bench-count');
            if (footerModelCount) footerModelCount.textContent = self.data.models.length;
            if (footerBenchCount) footerBenchCount.textContent = self.data.benchmarks.length;

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
                var historyCountEl = document.getElementById('history-count');
                if (historyCountEl) {
                    historyCountEl.textContent = Object.keys(self.data.history || {}).length;
                }
                return self._fetch(base + '/aa_pricing.json').then(function(pricing) {
                    if (pricing && pricing.models) {
                        // Convert array → map keyed by model_id for O(1) lookup
                        var pmap = {};
                        if (Array.isArray(pricing.models)) {
                            pricing.models.forEach(function (m) {
                                if (m && m.model_id) {
                                    pmap[m.model_id] = {
                                        input: m.price_per_1m_input,
                                        output: m.price_per_1m_output,
                                        cached_input: m.price_per_1m_cached_input,
                                        tokens_per_second: m.tokens_per_second,
                                        intelligence_index: m.intelligence_index
                                    };
                                }
                            });
                        } else {
                            pmap = pricing.models;
                        }
                        self.data.pricing = pmap;
                    }
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

            // Defer renders to next animation frame so the tab's display:block
            // is reflected in the layout before ECharts measures dimensions.
            // Without this, charts in newly-shown tabs init with 0x0 size.
            // Use double-RAF: outer waits for display:block to flush, inner
            // waits for grid layout to compute final widths. Charts then init
            // with correct dimensions on first try.
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    if (btn.dataset.tab === 'overview') self.renderOverview();
                    if (btn.dataset.tab === 'trends') self.renderTrends();
                    if (btn.dataset.tab === 'leaderboard') self.renderLeaderboard();
                    if (btn.dataset.tab === 'comparison') Comparison.render();
                    if (btn.dataset.tab === 'frontier-compare') FrontierCompare.render(document.getElementById('fc-category').value);
                    if (btn.dataset.tab === 'cyber-coding') CyberCoding.render();
                    if (btn.dataset.tab === 'sovereign' && typeof Sovereign !== 'undefined') Sovereign.render();
                    if (btn.dataset.tab === 'physical-ai' && typeof PhysicalAI !== 'undefined') PhysicalAI.render();
                    if (btn.dataset.tab === 'medical-ai' && typeof MedicalAI !== 'undefined') MedicalAI.render();
                    if (btn.dataset.tab === 'ai4s' && typeof AI4S !== 'undefined') AI4S.render();
                    if (btn.dataset.tab === 'agent' && typeof Agent !== 'undefined') Agent.render();
                    if (btn.dataset.tab === 'timeline' && typeof Timeline !== 'undefined') Timeline.render();
                    if (btn.dataset.tab === 'resources') self.renderResources();
                    if (btn.dataset.tab === 'changelog') self.renderChangelog();
                    // resize after renders, then again on next frame to catch
                    // any chart whose container width finalised mid-render.
                    if (typeof Charts !== 'undefined' && Charts.resizeAll) {
                        Charts.resizeAll();
                        requestAnimationFrame(function() { Charts.resizeAll(); });
                    }
                });
            });
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

    _LEADERBOARD_FILTER_IDS: ['filter-category', 'filter-type', 'filter-source', 'filter-benchmark', 'filter-search'],
    _LEADERBOARD_HASH_KEYS: { 'filter-category': 'cat', 'filter-type': 'type', 'filter-source': 'src', 'filter-benchmark': 'bench', 'filter-search': 'q' },

    // Build "#leaderboard?cat=...&q=..." from current filter state. Empty fields
    // are dropped so default state is just "#leaderboard". The bare tab still
    // works (existing tab-click handler keeps using location.hash directly).
    _syncLeaderboardHash: function() {
        var self = this;
        var params = [];
        self._LEADERBOARD_FILTER_IDS.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el || !el.value) return;
            params.push(self._LEADERBOARD_HASH_KEYS[id] + '=' + encodeURIComponent(el.value));
        });
        var hash = '#leaderboard' + (params.length ? '?' + params.join('&') : '');
        if (window.location.hash !== hash) {
            history.replaceState(null, '', hash);
        }
    },

    // Reverse mapping: read query params from hash and push values into the
    // 5 filter inputs without firing input/change handlers (we'll re-render
    // once at the end). Returns true if any value was applied.
    _applyLeaderboardHash: function(query) {
        if (!query) return false;
        var keyToId = {};
        Object.keys(this._LEADERBOARD_HASH_KEYS).forEach(function(id) {
            keyToId[App._LEADERBOARD_HASH_KEYS[id]] = id;
        });
        var pairs = query.split('&');
        var applied = false;
        pairs.forEach(function(p) {
            var idx = p.indexOf('=');
            if (idx < 0) return;
            var key = p.substring(0, idx);
            var val = decodeURIComponent(p.substring(idx + 1));
            var id = keyToId[key];
            if (!id) return;
            var el = document.getElementById(id);
            if (el) {
                el.value = val;
                applied = true;
            }
        });
        return applied;
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
        // Sort benchmarks by score-coverage so the most-covered ones surface
        // first in the dropdown. This is also how we pick the default.
        var benchCoverage = {};
        (this.data.scores || []).forEach(function(s) {
            benchCoverage[s.benchmark_id] = (benchCoverage[s.benchmark_id] || 0) + 1;
        });
        var benchesSorted = this.data.benchmarks.slice().sort(function(a, b) {
            return (benchCoverage[b.id] || 0) - (benchCoverage[a.id] || 0);
        });
        benchesSorted.forEach(function(b) {
            var opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.name;
            trendBench.appendChild(opt);
        });
        // Default-select the most-covered benchmark so Model Rankings,
        // Category Radar, and Cross-Benchmark Heatmap render on first view
        // instead of showing the "Choose a benchmark above" placeholder.
        if (benchesSorted.length > 0 && !trendBench.value) {
            trendBench.value = benchesSorted[0].id;
        }

        ['filter-category', 'filter-type', 'filter-source', 'filter-benchmark', 'filter-search'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', function() {
                    self._syncLeaderboardHash();
                    self.renderLeaderboard();
                });
                el.addEventListener('input', function() {
                    self._syncLeaderboardHash();
                    self.renderLeaderboard();
                });
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

                var search = document.createElement('input');
                search.type = 'search';
                search.id = 'compare-search-' + idx;
                search.placeholder = '검색 (모델/벤더)';
                search.autocomplete = 'off';
                search.className = 'bg-gray-800 border border-gray-700 rounded px-2 py-1 w-56 text-xs mb-1';
                wrap.appendChild(search);

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

                // Filter <option>s as the user types. Matches model name, vendor, id.
                // Hides via display:none + disabled (so keyboard nav skips them).
                // If the current value is filtered out, blank the select.
                search.addEventListener('input', function() {
                    var q = (search.value || '').trim().toLowerCase();
                    var visibleCount = 0;
                    var currentValid = false;
                    sel.querySelectorAll('option').forEach(function(opt) {
                        if (!opt.value) {
                            opt.hidden = false;
                            opt.disabled = false;
                            return;
                        }
                        var text = (opt.textContent + ' ' + opt.value).toLowerCase();
                        var hit = !q || text.indexOf(q) >= 0;
                        opt.hidden = !hit;
                        opt.disabled = !hit;
                        if (hit) {
                            visibleCount++;
                            if (opt.value === sel.value) currentValid = true;
                        }
                    });
                    if (sel.value && !currentValid) sel.value = '';
                    sel.title = visibleCount + ' match';
                });

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
        try { self._renderRecentDataFeed(); } catch(e) { console.warn('Recent data feed error:', e); }
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
            // BMT badge — shown if benchmark is mapped to BMT registry
            if (typeof Modal !== 'undefined' && Modal._bmtData && Modal._bmtData[benchId]) {
                var bmtB = document.createElement('span');
                bmtB.className = 'inline-block ml-1 px-1.5 rounded align-middle';
                bmtB.style.cssText = 'font-size:10px;font-weight:700;background:#064e3b;color:#6ee7b7;border:1px solid #047857;letter-spacing:0.5px;cursor:help';
                bmtB.title = 'BMT registry: ' + (Modal._bmtData[benchId].bmt_title || '');
                bmtB.textContent = 'BMT';
                tdName.appendChild(document.createTextNode(' '));
                tdName.appendChild(bmtB);
            }
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
                left.className = 'cursor-pointer hover:text-blue-400 transition';
                left.textContent = '#' + e.rank + ' ' + e.model_id.split('/').pop();
                left.onclick = (function(mid) { return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid);
                }; })(e.model_id);
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

    _renderRecentDataFeed: function() {
        var container = document.getElementById('recent-data-feed');
        if (!container) return;
        container.textContent = '';

        var sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        var cutoffStr = sevenDaysAgo.toISOString().slice(0, 10);

        // New models in last 7 days
        var newModels = (App.data.models || []).filter(function(m) {
            var d = m.release_date || m.released_at;
            return d && d >= cutoffStr;
        });

        // New scores: scores with source.date >= cutoff
        var newScoresByModel = {};
        (App.data.scores || []).forEach(function(s) {
            if (s.source && s.source.date && s.source.date >= cutoffStr) {
                newScoresByModel[s.model_id] = (newScoresByModel[s.model_id] || 0) + 1;
            }
        });
        var modelsWithNewScores = Object.keys(newScoresByModel)
            .map(function(mid) {
                var m = App.data.models.find(function(x) { return x.id === mid; });
                return { id: mid, name: m ? m.name : mid, count: newScoresByModel[mid] };
            })
            .sort(function(a, b) { return b.count - a.count; })
            .slice(0, 8);

        var section = document.createElement('div');
        section.className = 'bg-gray-900 border border-gray-800 rounded-lg p-4';

        var title = document.createElement('h3');
        title.className = 'text-widget text-gray-300 mb-2';
        title.textContent = '🆕 Last 7 days';
        section.appendChild(title);

        var meta = document.createElement('p');
        meta.className = 'text-xs text-gray-500 mb-3';
        meta.textContent = 'Auto-computed from data: ' + newModels.length + ' new models · ' + Object.keys(newScoresByModel).length + ' models received new scores';
        section.appendChild(meta);

        if (newModels.length > 0) {
            var newModelsTitle = document.createElement('div');
            newModelsTitle.className = 'text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1';
            newModelsTitle.textContent = 'New models';
            section.appendChild(newModelsTitle);

            var ul = document.createElement('ul');
            ul.className = 'mb-3';
            newModels.slice(0, 6).forEach(function(m) {
                var li = document.createElement('li');
                li.className = 'flex justify-between text-xs py-0.5 border-b border-gray-800 cursor-pointer hover:bg-gray-800 px-1 -mx-1 rounded';
                li.addEventListener('click', (function(mid) {
                    return function() { Modal.showModel(mid); };
                })(m.id));
                var name = document.createElement('span');
                name.className = 'text-blue-400';
                name.textContent = m.name;
                li.appendChild(name);
                var date = document.createElement('span');
                date.className = 'text-gray-500';
                date.textContent = (m.release_date || m.released_at || '').slice(0, 10);
                li.appendChild(date);
                ul.appendChild(li);
            });
            if (newModels.length > 6) {
                var more = document.createElement('li');
                more.className = 'text-xs text-gray-500 py-0.5';
                more.textContent = '+ ' + (newModels.length - 6) + ' more';
                ul.appendChild(more);
            }
            section.appendChild(ul);
        }

        if (modelsWithNewScores.length > 0) {
            var scoresTitle = document.createElement('div');
            scoresTitle.className = 'text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1';
            scoresTitle.textContent = 'Models with new scores';
            section.appendChild(scoresTitle);

            var sul = document.createElement('ul');
            modelsWithNewScores.forEach(function(m) {
                var li = document.createElement('li');
                li.className = 'flex justify-between text-xs py-0.5 border-b border-gray-800 cursor-pointer hover:bg-gray-800 px-1 -mx-1 rounded';
                li.addEventListener('click', (function(mid) {
                    return function() { Modal.showModel(mid); };
                })(m.id));
                var name = document.createElement('span');
                name.className = 'text-blue-400';
                name.textContent = m.name;
                li.appendChild(name);
                var count = document.createElement('span');
                count.className = 'text-gray-500';
                count.textContent = '+' + m.count + ' score' + (m.count > 1 ? 's' : '');
                li.appendChild(count);
                sul.appendChild(li);
            });
            section.appendChild(sul);
        }

        if (newModels.length === 0 && modelsWithNewScores.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-xs text-gray-500';
            empty.textContent = 'No new models or score updates in the last 7 days.';
            section.appendChild(empty);
        }

        container.appendChild(section);
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
            var modelSpan = document.createElement('span');
            modelSpan.className = 'cursor-pointer hover:text-blue-400 transition';
            modelSpan.textContent = model ? model.name : s.model_id.split('/').pop();
            modelSpan.onclick = (function(mid) { return function() {
                if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid);
            }; })(s.model_id);
            tdModel.appendChild(modelSpan);
            if (model) {
                var badge = document.createElement('span');
                badge.className = 'badge badge-' + model.type;
                badge.textContent = ' ' + model.type;
                tdModel.appendChild(document.createTextNode(' '));
                tdModel.appendChild(badge);
            }
            tr.appendChild(tdModel);

            var tdBench = document.createElement('td');
            var benchObj = self.data.benchmarks.find(function(b) { return b.id === s.benchmark_id; });
            var benchSpan = document.createElement('span');
            benchSpan.className = 'cursor-pointer hover:text-blue-400 transition';
            benchSpan.textContent = benchObj ? benchObj.name : s.benchmark_id.toUpperCase();
            benchSpan.onclick = (function(bid) { return function() {
                if (typeof Modal !== 'undefined' && Modal.showBenchmark) Modal.showBenchmark(bid);
            }; })(s.benchmark_id);
            tdBench.appendChild(benchSpan);

            // BMT badge — shown if benchmark is mapped to a BMT registry entry
            if (typeof Modal !== 'undefined' && Modal._bmtData && Modal._bmtData[s.benchmark_id]) {
                var bmtBadge = document.createElement('span');
                bmtBadge.className = 'inline-block ml-1 px-1.5 rounded align-middle';
                bmtBadge.style.cssText = 'font-size:10px;font-weight:700;background:#064e3b;color:#6ee7b7;border:1px solid #047857;letter-spacing:0.5px;cursor:help';
                bmtBadge.title = 'BMT registry: ' + (Modal._bmtData[s.benchmark_id].bmt_title || '');
                bmtBadge.textContent = 'BMT';
                tdBench.appendChild(document.createTextNode(' '));
                tdBench.appendChild(bmtBadge);
            }
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
        // SOTA highlights + trend overview always render (don't depend on benchmark selection)
        App._renderSotaHighlights();
        App._renderTrendOverview();
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

    _renderSotaHighlights: function() {
        var container = document.getElementById('sota-highlights-list');
        if (!container) return;
        container.textContent = '';

        // Build list of SOTA scores: for each benchmark, find the highest-value score.
        // Sort by source.date desc.
        var benchSota = {};
        (App.data.scores || []).forEach(function(s) {
            if (!s.is_sota) return;
            var existing = benchSota[s.benchmark_id];
            if (!existing || (s.value > existing.value)) {
                benchSota[s.benchmark_id] = s;
            }
        });

        var sotaList = Object.values(benchSota);
        // Sort by source.date descending; fallback to value desc
        sotaList.sort(function(a, b) {
            var ad = (a.source && a.source.date) || '';
            var bd = (b.source && b.source.date) || '';
            if (ad !== bd) return bd.localeCompare(ad);
            return b.value - a.value;
        });

        if (sotaList.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-gray-500 text-sm';
            empty.textContent = 'No SOTA-flagged scores in the dataset.';
            container.appendChild(empty);
            return;
        }

        var grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3';

        var topN = Math.min(sotaList.length, 30);
        for (var i = 0; i < topN; i++) {
            var s = sotaList[i];
            var bench = (App.data.benchmarks || []).find(function(b) { return b.id === s.benchmark_id; });
            var model = (App.data.models || []).find(function(m) { return m.id === s.model_id; });

            var card = document.createElement('div');
            card.className = 'bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-blue-500 cursor-pointer transition';
            (function(mid) {
                card.addEventListener('click', function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid);
                });
            })(s.model_id);

            var topRow = document.createElement('div');
            topRow.className = 'flex justify-between items-start mb-1';
            var benchName = document.createElement('div');
            benchName.className = 'text-xs text-gray-400 uppercase tracking-wider';
            benchName.textContent = bench ? bench.name : s.benchmark_id;
            topRow.appendChild(benchName);
            var dateBadge = document.createElement('div');
            dateBadge.className = 'text-xs text-gray-600';
            dateBadge.textContent = (s.source && s.source.date) ? s.source.date : '—';
            topRow.appendChild(dateBadge);
            card.appendChild(topRow);

            var midRow = document.createElement('div');
            midRow.className = 'flex justify-between items-baseline';
            var modelName = document.createElement('div');
            modelName.className = 'text-sm text-blue-400 font-semibold truncate';
            modelName.textContent = model ? model.name : s.model_id;
            midRow.appendChild(modelName);
            var val = document.createElement('div');
            val.className = 'text-lg font-mono text-yellow-300';
            val.textContent = (typeof s.value === 'number') ? s.value.toFixed(1) : s.value;
            midRow.appendChild(val);
            card.appendChild(midRow);

            var bottom = document.createElement('div');
            bottom.className = 'text-xs text-gray-500';
            bottom.textContent = (model && model.vendor) || '';
            card.appendChild(bottom);

            grid.appendChild(card);
        }
        container.appendChild(grid);

        if (sotaList.length > topN) {
            var more = document.createElement('p');
            more.className = 'text-xs text-gray-500 mt-3';
            more.textContent = 'Showing top ' + topN + ' SOTA records out of ' + sotaList.length + '.';
            container.appendChild(more);
        }
    },

    _renderTrendOverview: function() {
        var host = document.getElementById('trend-overview-chart');
        if (!host || typeof echarts === 'undefined') return;

        var catSel = document.getElementById('trend-overview-cat');
        var topNSel = document.getElementById('trend-overview-topn');
        var historyDates = Object.keys(App.data.history || {}).sort();

        function showMsg(text) {
            host.textContent = '';
            var p = document.createElement('p');
            p.className = 'text-gray-500 text-sm p-4';
            p.textContent = text;
            host.appendChild(p);
        }

        if (historyDates.length < 1) {
            showMsg('No history snapshots yet. Daily snapshots accumulating.');
            return;
        }

        // Populate category dropdown (once)
        if (catSel && catSel.options.length <= 1) {
            var cats = {};
            (App.data.benchmarks || []).forEach(function(b) { if (b.category) cats[b.category] = true; });
            Object.keys(cats).sort().forEach(function(c) {
                var opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                catSel.appendChild(opt);
            });
        }

        function render() {
            var selectedCat = catSel ? catSel.value : 'all';
            var topN = topNSel ? parseInt(topNSel.value, 10) : 15;
            var benches = (App.data.benchmarks || []).filter(function(b) {
                return selectedCat === 'all' || b.category === selectedCat;
            });

            // For each benchmark, find SOTA over time across history snapshots
            var benchSeries = [];
            benches.forEach(function(b) {
                var pts = historyDates.map(function(d) {
                    var snap = App.data.history[d] || [];
                    var best = null;
                    snap.forEach(function(s) {
                        if (s.benchmark_id === b.id) {
                            if (best === null || s.value > best) best = s.value;
                        }
                    });
                    return best;
                });
                var hasData = pts.some(function(v) { return v != null; });
                if (!hasData) return;
                var latest = pts.slice().reverse().find(function(v) { return v != null; });
                benchSeries.push({ name: b.name, data: pts, latest: latest });
            });
            benchSeries.sort(function(a, b) { return (b.latest || 0) - (a.latest || 0); });
            benchSeries = benchSeries.slice(0, topN);

            if (benchSeries.length === 0) {
                showMsg('No benchmark data in history snapshots for the selected category.');
                return;
            }

            var chart = echarts.getInstanceByDom(host);
            if (chart) chart.dispose();
            chart = echarts.init(host, 'dark');
            chart.setOption({
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis' },
                legend: {
                    textStyle: { color: '#d1d5db', fontSize: 9 },
                    top: 0,
                    type: 'scroll',
                },
                grid: { left: 50, right: 30, top: 50, bottom: 40 },
                xAxis: {
                    type: 'category',
                    data: historyDates,
                    axisLabel: { color: '#9ca3af', fontSize: 10 },
                },
                yAxis: {
                    type: 'value',
                    name: 'SOTA score',
                    axisLabel: { color: '#9ca3af', fontSize: 10 },
                    splitLine: { lineStyle: { color: 'rgba(160,160,160,0.15)' } },
                },
                series: benchSeries.map(function(s) {
                    return {
                        name: s.name,
                        type: 'line',
                        data: s.data,
                        smooth: true,
                        connectNulls: true,
                        showSymbol: false,
                    };
                }),
            });
            window.addEventListener('resize', function() { chart.resize(); });
        }

        if (catSel) catSel.onchange = render;
        if (topNSel) topNSel.onchange = render;
        render();
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

        // pricing is exported as object keyed by model_id, not an array.
        // Normalise to array of {model_id, price_per_1m_output, intelligence_index, tokens_per_second}.
        var pricingRaw = this.data.pricing || {};
        var pricing = Array.isArray(pricingRaw)
            ? pricingRaw
            : Object.keys(pricingRaw).map(function(mid) {
                var p = pricingRaw[mid] || {};
                return {
                    model_id: mid,
                    price_per_1m_output: typeof p.output === 'number' ? p.output : p.price_per_1m_output,
                    intelligence_index: p.intelligence_index,
                    tokens_per_second: p.tokens_per_second
                };
            });
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
            { name: 'LLM-Of-China-Comparison (GitHub)', url: 'https://github.com/happypaul2139-svg/LLM-Of-China-Comparison', desc: '6 frontier 중국 LLM 비교 (Kimi K2.6 / MiniMax M2.7 / MiMo v2.5-Pro / GLM 5.1 / DeepSeek V4-Pro / Qwen3.6-Plus) on 5 practical scenarios — Long Doc / Code / Professional Writing / Data Analysis / Research & Planning. Composite leaderboard 0.8 effect + 0.1 cost + 0.1 speed.' },
            // ---- AI4S leaderboards (math / formal proof) ----
            { name: 'MathArena', url: 'https://matharena.ai/', desc: 'AI4S Math · ETH Zurich SRI Lab — uncontaminated AIME/HMMT/USAMO/BrUMO live leaderboard, 4 runs per model, cost reported.' },
            { name: 'MiniF2F GitHub', url: 'https://github.com/openai/miniF2F', desc: 'AI4S Math — formal-proof benchmark across Lean/Isabelle/Metamath/HOL Light (244 olympiad-level statements).' },
            { name: 'PutnamBench GitHub', url: 'https://github.com/trishullab/PutnamBench', desc: 'AI4S Math — Putnam competition formalization benchmark across Lean 4, Coq, Isabelle (NeurIPS 2024 D&B).' },
            { name: 'OlympiadBench GitHub', url: 'https://github.com/OpenBMB/OlympiadBench', desc: 'AI4S Math+Physics — bilingual EN/CN olympiad-level multimodal reasoning (8,476 problems, ACL 2024).' },
            { name: 'IMO-Bench (DeepMind ProofBench)', url: 'https://imobench.github.io/', desc: 'AI4S Math — IMO-level proof + answer benchmark with ProofAutoGrader. Gemini Deep Think 89% Basic / 65.7% Advanced.' },
            { name: 'OlympicArena', url: 'https://gair-nlp.github.io/OlympicArena/', desc: 'AI4S — 11,163 problems × 7 disciplines (Math/Physics/Chem/Bio/Geo/Astro/CS); image+text.' },
            // ---- AI4S leaderboards (materials / chemistry) ----
            { name: 'Matbench Discovery', url: 'https://matbench-discovery.materialsproject.org/', desc: 'AI4S Materials — live leaderboard for ML interatomic potentials and crystal stability prediction (F1, DAF, kappa).' },
            { name: 'Matbench v0.1', url: 'https://matbench.materialsproject.org/', desc: 'AI4S Materials — 13-task supervised property prediction benchmark.' },
            { name: 'Open Catalyst Project Leaderboard', url: 'https://opencatalystproject.org/leaderboard.html', desc: 'AI4S Materials/Chemistry — OC20/OC22/ODAC23/OMat24/OMol25 evaluation server. EquiformerV2 leads.' },
            { name: 'FAIR Chemistry (Meta)', url: 'https://fair-chem.github.io/', desc: 'AI4S Chemistry — Meta FAIR datasets and baselines for catalysis & molecular ML (UMA models).' },
            { name: 'GuacaMol', url: 'https://github.com/BenevolentAI/guacamol', desc: 'AI4S Chemistry — de novo molecular design benchmark (5 distribution-learning + 20 goal-directed).' },
            { name: 'MoleculeNet', url: 'https://moleculenet.org/', desc: 'AI4S Chemistry — 17-task molecular ML benchmark (QM/physchem/biophys/physiology).' },
            { name: 'Open Reaction Database', url: 'https://open-reaction-database.org/', desc: 'AI4S Chemistry — open repository of organic reaction data for ML training.' },
            // ---- AI4S leaderboards (bio / protein) ----
            { name: 'CASP Prediction Center', url: 'https://predictioncenter.org/', desc: 'AI4S Bio — Critical Assessment of Structure Prediction (CASP15/16); GDT-TS/lDDT/TM-score/DockQ.' },
            { name: 'ProteinGym', url: 'https://proteingym.org/benchmarks', desc: 'AI4S Bio — protein fitness prediction across 250+ DMS assays + clinical (zero-shot + supervised tracks, NeurIPS 2023).' },
            { name: 'PDB Statistics', url: 'https://www.rcsb.org/stats', desc: 'AI4S Bio — Protein Data Bank weekly stats; experimental structure availability.' },
            // ---- AI4S leaderboards (climate / weather) ----
            { name: 'WeatherBench 2', url: 'https://sites.research.google/weatherbench/', desc: 'AI4S Climate — live continuously-updated benchmark (Google + ECMWF, JAMES 2024). GraphCast/Pangu/AIFS/Aurora/NeuralGCM scoring.' },
            { name: 'ECMWF AIFS Blog', url: 'https://www.ecmwf.int/en/about/media-centre/aifs-blog', desc: 'AI4S Climate — ECMWF AIFS development blog with operational scorecards.' },
            { name: 'ECMWF Charts (AIFS+Aurora)', url: 'https://charts.ecmwf.int/', desc: 'AI4S Climate — live experimental ML weather charts (AIFS, Aurora).' },
            { name: 'Microsoft Aurora GitHub', url: 'https://github.com/microsoft/aurora', desc: 'AI4S Climate — Earth-system foundation model; outperforms IFS on 91-92% of targets (Nature 2025).' },
            // ---- AI4S leaderboards (robotics / physical AI) ----
            { name: 'RoboArena', url: 'https://sites.google.com/view/corl-roboarena', desc: 'AI4S Robotics — distributed real-world VLA Elo leaderboard (DROID platform, 7 sites). NVIDIA GR00T N2 #1.' },
            { name: 'LIBERO', url: 'https://libero-project.github.io/main.html', desc: 'AI4S Robotics — lifelong robot-learning benchmark; dominant VLA evaluation suite (Spatial/Object/Goal/Long).' },
            { name: 'RoboCasa', url: 'https://robocasa.ai/', desc: 'AI4S Robotics — large-scale kitchen simulation benchmark (365 tasks, 2500+ scenes, ICLR 2026).' },
            { name: 'NVIDIA Cosmos Physical AI', url: 'https://www.nvidia.com/en-us/ai/cosmos/', desc: 'AI4S Robotics — Physical AI Bench + world foundation models (Cosmos-Reason 2 leads).' },
            // ---- AI4S leaderboards (astronomy / cosmology / particle physics) ----
            { name: 'Polymathic AI', url: 'https://polymathic-ai.org/', desc: 'AI4S Astronomy — multimodal scientific FMs and astronomy benchmarks (AION-1, MultiModalUniverse).' },
            { name: 'Multimodal Universe (Flatiron)', url: 'https://users.flatironinstitute.org/~polymathic/data/MultimodalUniverse/', desc: 'AI4S Astronomy — 100TB curated astronomy ML dataset (NeurIPS 2024 D&B).' },
            { name: 'DESI', url: 'https://www.desi.lbl.gov/', desc: 'AI4S Cosmology — Dark Energy Spectroscopic Instrument data releases for cosmology ML.' },
            { name: 'SDSS', url: 'https://www.sdss.org/', desc: 'AI4S Astronomy — Sloan Digital Sky Survey data releases for astronomy ML.' },
            { name: 'LHC Olympics 2020', url: 'https://lhco2020.github.io/homepage/', desc: 'AI4S Particle Physics — community anomaly-detection challenge in HEP.' },
            { name: 'ML4Jets', url: 'https://indico.cern.ch/event/1526677/', desc: 'AI4S Particle Physics — annual workshop tracking ML methods and datasets.' },
            { name: 'Dark Machines', url: 'https://www.darkmachines.org/', desc: 'AI4S Particle Physics — community group running Anomaly Score Challenge and dark-matter ML benchmarks.' },
            // ---- AI4S leaderboards (nuclear / fusion) ----
            { name: 'DisruptionBench (MIT PSFC)', url: 'https://github.com/MIT-PSFC/DisruptionBench', desc: 'AI4S Fusion — multi-tokamak ML disruption-prediction benchmark (Alcator C-Mod, DIII-D, EAST).' },
            { name: 'DisruptionPy', url: 'https://github.com/MIT-PSFC/DisruptionPy', desc: 'AI4S Fusion — open-source physics-based framework for disruption analysis.' },
            // ---- AI4S aggregators / DOE national labs ----
            { name: 'SciArena (Ai2)', url: 'https://sciarena.allen.ai/', desc: 'AI4S Aggregator — open Elo platform for LLMs on scientific literature tasks (23 models, >13k votes).' },
            { name: 'Papers with Code — Physics', url: 'https://paperswithcode.com/area/physics', desc: 'AI4S Aggregator — aggregated SOTA tracking across physics ML benchmarks.' },
            { name: 'Hugging Face Papers', url: 'https://huggingface.co/papers', desc: 'AI4S Aggregator — daily curated AI papers incl. AI4Science track.' },
            { name: 'DOE Office of Science AI', url: 'https://www.energy.gov/science/articles/department-energy-launches-new-ai-initiatives', desc: 'AI4S — DOE national-lab AI initiatives (Genesis Mission across 17 labs).' },
            { name: 'Argonne ALCF AI4Science', url: 'https://www.alcf.anl.gov/science/ai-science', desc: 'AI4S — Argonne AI-for-Science portal (AuroraGPT, protein design FM).' },
            { name: 'ORNL AI Initiative', url: 'https://www.ornl.gov/initiative/artificial-intelligence', desc: 'AI4S — Oak Ridge National Lab AI programs (ORBIT, GPGP, APPL).' },
            { name: 'Chatbot Arena (LMSYS / lmarena.ai → arena.ai)', url: 'https://lmarena.ai', desc: 'Crowd-sourced pairwise battle leaderboard. Users compare two anonymous model responses; aggregated votes produce Arena Elo. Industry-standard for human-preference ranking; site now redirects to arena.ai.' },
            { name: 'Vellum LLM Leaderboard', url: 'https://www.vellum.ai/llm-leaderboard', desc: 'Multi-benchmark comparison' },
            { name: 'Artificial Analysis Leaderboard', url: 'https://artificialanalysis.ai/leaderboards/models', desc: '356+ 모델을 4축으로 랭킹 — Intelligence Index (composite quality), 속도 (tokens/s), 가격 ($/1M tokens), 시간-to-first-token (latency). Reasoning vs non-reasoning, open vs proprietary 분리 비교. 현재 top: GPT-5.5 (xhigh) intelligence 60.' },
            { name: 'ARC Prize / ARC-AGI', url: 'https://arcprize.org/leaderboard', desc: 'Abstract reasoning for AGI evaluation (ARC-AGI-1/2)' },
            { name: 'LM Council', url: 'https://lmcouncil.ai/benchmarks', desc: '18 independent benchmarks' },
            { name: 'Epoch AI Benchmarks', url: 'https://epoch.ai/benchmarks', desc: '40+ benchmark trends' },
            { name: 'LiveBench', url: 'https://livebench.ai/#/', desc: 'Contamination-free benchmark suite — math, coding, reasoning, language, data-analysis, instruction-following 6 카테고리. 매월 신규 문제 (월별 refresh). 정답이 학습 데이터에 없도록 설계. Abacus.AI + NYU + Princeton 운영.' },
            { name: 'EQ-Bench Creative Writing Longform', url: 'https://eqbench.com/creative_writing_longform.html', desc: 'LLM 창작 능력 평가 — 8장 1000-word longform 스토리 생성. Claude Sonnet 4.6 judge가 14-criterion 루브릭 (Nuanced Characters / Emotionally Engaging / Weak Dialogue / Purple Prose 등) + Slop Score (LLM 상투 표현) + 단락 degradation 자동 감지. Composite 0-100. 창작 분야 표준 벤치.' },
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
            { name: 'UK AISI (AI Security Institute)', url: 'https://www.aisi.gov.uk/research', desc: 'Frontier AI Trends Report — cyber, bio, autonomy, agentic evaluations of 30+ models since 2023' },
            { name: 'UK AISI Blog', url: 'https://www.aisi.gov.uk/blog', desc: 'Recent: Microsoft frontier safety partnership (May 5, 2026), GPT-5.5 cyber eval (Apr 30), Mythos cyber eval (Apr 13), OpenClaw sandboxed-agent recon, sycophancy reduction, alignment-sabotage testing' },
            { name: 'US CAISI (NIST)', url: 'https://www.nist.gov/caisi', desc: 'Center for AI Standards and Innovation (renamed from US AISI). Frontier AI agreements with Google DeepMind/Microsoft/xAI, DeepSeek V4 evaluation (May 2026), Red-teaming competitions (Mar 2026), AI Agent Standards Initiative, OpenMined secure-eval partnership' },
            { name: 'Japan AISI', url: 'https://aisi.go.jp/', desc: 'AI Safety Annual Report 2025 (Apr 28, 2026), Known Attacks and Their Impacts on AI Systems EN/JP (Apr 24, 2026), FY2025 Conformity Assessment SWG report, red-teaming methodology' },
            { name: 'Singapore AISI', url: 'https://sgaisi.sg/', desc: 'Project Moonshot LLM eval toolkit, IMDA Red Teaming Challenge (350+ participants, 9 countries), International Joint Testing (3JT) AI agent eval, multilingual LLM eval (with UK/Japan), AI agent data leakage testing (with Korea), Singapore Consensus on AI Safety (SCAI 2025)' },
            { name: 'Singapore IMDA', url: 'https://www.imda.gov.sg/about-imda/emerging-technologies-and-research/artificial-intelligence', desc: 'Agentic AI governance, safety reports' },
            { name: 'Korea AISI (K-AISI)', url: 'https://www.aisi.re.kr/kor', desc: 'AI Safety Policy / Assessment / Research / Collaboration tracks; Korean model safety assessment, AI Safety Forecast (eng mirror at /eng)' },
            { name: 'Australia AISI (DISR)', url: 'https://www.industry.gov.au/science-technology-and-innovation/technology/artificial-intelligence/ai-safety-science', desc: 'Australian AI Safety Institute under Dept of Industry Science and Resources — operational early 2026, A$30M, evaluates emerging AI capabilities, advises industry/agencies/ministers, joined International Network July 2025 Vancouver meeting' },
            { name: 'Canada AISI / CAISI Canada', url: 'https://ised-isde.canada.ca/site/ised/en/canadian-artificial-intelligence-safety-institute', desc: 'Canadian Artificial Intelligence Safety Institute under ISED — C$50M over 5 years, NRC research arm, founding member of International Network. Focus: synthetic content risks, dangerous systems, AI safety guidance' },
            { name: 'CAISI Research Program (CIFAR)', url: 'https://cifar.ca/ai/caisi/', desc: "CAISI Canada's independent scientific engine. 2026 calls: interpretability, robustness testing, AI cybersecurity misuse. 2025 Year-in-Review at report.buildingsafeai.ca" },
            { name: 'France INESIA', url: 'https://www.inria.fr/en/ai-security-and-sovereignty-inesia-unveils-its-roadmap-2026-2027', desc: "France's Institut national pour l'évaluation et la sécurité de l'IA — federation of ANSSI + LNE + PEReN + Inria, piloted by SGDSN (PM) + DGE. Created Jan 31 2025. 2026-2027 roadmap: systemic risk analysis, AI Act support, model performance/reliability eval. AGENTIA agent eval (Jul 2025)" },
            { name: 'India AISI (IndiaAI MeitY)', url: 'https://indiaai.gov.in/article/india-takes-the-lead-establishing-the-indiaai-safety-institute-for-responsible-ai-innovation', desc: 'IndiaAI Safety Institute under MeitY — announced Jan 30 2025 by Minister Vaishnaw. Hub-and-spoke model with academic+private partner cells. 7-Sutras techno-legal framework launched at India AI Impact Summit 2026. Indigenous AI governance R&D' },
            { name: 'EU AI Office', url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-office', desc: "European Commission's AI expertise centre. Implements EU AI Act for general-purpose AI. GPAI obligations applicable Aug 2 2025; high-risk system rules Aug 2 2026. Council+Parliament simplification deal May 7 2026. Founding member of International Network" },
            { name: 'AISI International Network', url: 'https://ised-isde.canada.ca/site/ised/en/international-network-ai-safety-institutes-mission-statement', desc: 'Founding members (Nov 2024 SF convening): US/UK/Japan/Singapore/Korea/Australia/Canada/France/EU/Kenya. Mission: scientific cooperation on safety eval. 2nd convening Vancouver Jul 2025; capacity building → mini-AISIs in Africa/SEA/LATAM' },
            { name: '3rd Joint Testing — Agentic Eval Report', url: 'https://sgaisi.sg/resources/international-joint-testing-exercise-agentic-testing-evaluation-report/', desc: 'Singapore AISI lead (leakage/fraud) + UK AISI lead (cybersecurity), Jul 17 2025. ~1,500 tasks/1,200 tools. Cybench + Intercode. Models anonymized (A-F): leakage pass rate ~57%/35% (open vs closed agent), judge discrepancy 23%/28% vs human. 9 institutes participated' },
            { name: 'Synthetic Content Research Agenda', url: 'https://www.industry.gov.au/publications/research-agenda-risks-synthetic-content', desc: 'AISI International Network research track co-led by Australia + Canada (Jul 14 2025). Risks of AI-generated synthetic content: scope, science state, research priorities. Mirror at ised-isde.canada.ca/.../research-agenda-risks-synthetic-content' },
            { name: 'GPAI Code of Practice (final)', url: 'https://code-of-practice.ai/', desc: 'EU AI Office voluntary compliance tool for general-purpose AI providers. Final version Jul 10 2025. Signatories: Anthropic, Google, IBM, Microsoft, OpenAI, Amazon, Mistral, Aleph Alpha (full); xAI (Safety & Security chapter only); Meta declined. Enforcement Aug 2 2026' },
            { name: 'GPAI Code Signatory Taskforce', url: 'https://digital-strategy.ec.europa.eu/en/policies/signatory-taskforce-gpai-code-practice', desc: 'EU AI Office maintained list of GPAI Code of Practice signatories and their commitments. Safety & Security chapter applies to providers above 10^25 FLOP threshold (~5-15 companies)' },
            { name: 'UK AISI Research Agenda', url: 'https://www.aisi.gov.uk/research-agenda', desc: 'UK AISI evaluation taxonomy: agentic, cyber, bio/chem, alignment. Roadmap of capability/risk areas, evaluation methodology priorities' },
            { name: 'UK AISI 2025 Year in Review', url: 'https://www.aisi.gov.uk/blog/our-2025-year-in-review', desc: 'UK AISI tested 30+ frontier models in 2025. New tools: self-replication early-signal benchmark, sandbagging detection, 76,000-participant AI persuasion study (Science). Evaluation domains: agentic, cyber, chem/bio, alignment' },
            { name: 'International AI Safety Report', url: 'https://internationalaisafetyreport.org/', desc: '2026 joint international AI safety report' },
            { name: 'Future of Life AI Safety Index', url: 'https://futureoflife.org/ai-safety-index-winter-2025/', desc: 'Company-level AI safety scoring' },
            { name: 'Frontier Model Forum', url: 'https://www.frontiermodelforum.org/technical-reports/', desc: 'Joint industry capability assessments' },
            { name: 'China AISI Network', url: 'https://ai-development-and-safety-network.cn/', desc: 'PandaGuard, MultiTrust, Safe RLHF — 49 model jailbreak eval' },
            { name: 'China AISI Research', url: 'https://ai-development-and-safety-network.cn/research-progress', desc: 'LLM safety research: jailbreak, alignment, misinformation' },
            { name: 'China AISI Standards', url: 'https://ai-development-and-safety-network.cn/standards-and-norms', desc: 'Multimodal LLM safety specs, security assessment standards' },
            { name: 'Hack The Box AI Range', url: 'https://www.hackthebox.com/blog/ai-range-llm-security-benchmark', desc: 'AI vs human cybersecurity benchmark, NeuroGrid CTF' },
            { name: 'Awesome Agents Agentic', url: 'https://awesomeagents.ai/leaderboards/agentic-ai-benchmarks-leaderboard/', desc: 'GAIA, WebArena, BFCL V4, Tau2-bench rankings' },
            { name: 'Awesome Agents Computer Use', url: 'https://awesomeagents.ai/leaderboards/computer-use-leaderboard/', desc: 'OSWorld, ScreenSpot desktop agent rankings' },
            { name: 'HAL — Holistic Agent Leaderboard', url: 'https://hal.cs.princeton.edu/', desc: 'Princeton ICLR 2026, cost-controlled, 9 models × 9 benchmarks 21,730 rollouts. Standardized harness, reliability dimension' },
            { name: 'HAL Reliability Dashboard', url: 'https://hal.cs.princeton.edu/reliability/', desc: '14 agents × 12 metrics across 4 reliability dimensions (consistency, predictability, robustness, safety, self-awareness)' },
            { name: 'HAL GAIA Leaderboard', url: 'https://hal.cs.princeton.edu/gaia', desc: 'GAIA aggregate ranking under HAL infrastructure (HAL Generalist Agent + HF Open Deep Research)' },
            { name: 'HAL USACO Leaderboard', url: 'https://hal.cs.princeton.edu/usaco', desc: 'Competitive programming agentic eval — 307 USACO problems Bronze→Platinum' },
            { name: 'AA Coding Agents Comparison', url: 'https://artificialanalysis.ai/agents/coding', desc: 'Cursor / Claude Code / Codex CLI / Cline / Aider / Copilot side-by-side, IDE/CLI/Cloud deployment' },
            { name: 'BenchLM Agent', url: 'https://benchlm.ai/llm-agent-benchmarks', desc: '24 agentic benchmarks aggregated: function calling, MCP tool use, browsing, terminal, computer-use' },
            { name: 'AI Agent Square 2026', url: 'https://aiagentsquare.com/blog/ai-agent-benchmarks-2026.html', desc: 'Performance × cost agent benchmark comparison' },
            { name: 'Rapid Claw Framework Scorecard', url: 'https://rapidclaw.dev/blog/ai-agent-benchmarks-2026', desc: 'LangGraph / CrewAI / AutoGen agent framework scorecard 2026' },
            { name: 'MorphLLM Coding Agents 2026', url: 'https://www.morphllm.com/ai-coding-agent', desc: '15 coding agents validated, real-world ship test (Cursor / Claude Code / Codex / Cline / Aider)' },
            { name: 'Helicone Manus Benchmark', url: 'https://www.helicone.ai/blog/manus-benchmark-operator-comparison', desc: 'Manus vs Operator vs Claude Computer Use 7-task test (Mar 2026)' },
            { name: 'Phil Schmid Agent Compendium', url: 'https://github.com/philschmid/ai-agent-benchmark-compendium', desc: '50+ agent benchmarks indexed across function calling / general / coding / computer interaction' },
            { name: 'MobileAgentBench', url: 'https://mobileagentbench.github.io/', desc: 'Mobile LLM agent benchmark — 100 tasks × 10 OSS apps, OpenReview 2024' },
            { name: 'Xiaomi Mobile-Bench', url: 'https://github.com/XiaoMi/MobileBench', desc: 'LLM-based mobile agent benchmark, 103 APIs to accelerate task completion' },
            { name: 'MLCommons MLPerf Mobile', url: 'https://mlcommons.org/benchmarks/inference-mobile/', desc: 'Android/iOS LoadGen single-stream + offline LLM inference latency' },
            { name: 'MLCommons MLPerf Tiny', url: 'https://mlcommons.org/benchmarks/inference-tiny/', desc: '<100kB models for MCUs/DSPs, 10–250 MHz, <50 mW power draw' },
            { name: 'MLCommons MLPerf Inference Edge', url: 'https://mlcommons.org/benchmarks/inference-edge/', desc: 'Edge accelerator latency, 99/99.9% reference-model accuracy bound' },
            { name: 'Google AI Edge LiteRT-LM', url: 'https://github.com/google-ai-edge/LiteRT-LM', desc: 'FunctionGemma + LiteRT-LM Tool Use APIs — on-device function calling' },
            { name: 'Apple ML Research', url: 'https://machinelearning.apple.com/', desc: 'Apple Foundation Models on-device + Private Cloud Compute architecture' },
            { name: 'HuggingFace SmolLM Blog', url: 'https://huggingface.co/blog/smollm', desc: 'HF SLM curation (135M–1.7B), tokenizer + training cookbook' },
            { name: 'Local AI Master SLM Guide 2026', url: 'https://localaimaster.com/blog/small-language-models-guide-2026', desc: '17 SLM benchmark comparison for local inference (Phi-4, Gemma 3, Qwen 3, Llama 3.2)' },
            { name: 'MorphLLM Coding Guide', url: 'https://www.morphllm.com/ai-coding-benchmarks-2026', desc: 'Every coding eval explained and ranked' },
            { name: 'Vibe Bench', url: 'https://vibe-bench.com/', desc: 'Tool-level AI coding benchmarks for vibe coding' },
            { name: 'MLCommons AILuminate', url: 'https://mlcommons.org/benchmarks/ailuminate/', desc: 'Jailbreak benchmark, adversarial attack taxonomy' },
            { name: 'AILuminate v1.0 Leaderboard', url: 'https://ailuminate.mlcommons.org/benchmarks/', desc: 'MLCommons AI safety v1.0 industry-standard benchmark — 12 hazard categories × 24,000 prompts/lang. Overall 5-point grade (Poor/Fair/Good/Very Good/Excellent). 20+ models tested as of arxiv 2503.05731. Top: Claude 3.5 Haiku/Sonnet, Mistral Large 2402, Phi 4, Gemma 2 9b at "Very Good". No model has reached "Excellent" yet.' },
            { name: 'AILuminate paper (arxiv 2503.05731)', url: 'https://arxiv.org/abs/2503.05731', desc: 'AILuminate v1.0 paper introducing the AI Risk and Reliability Benchmark — methodology details for 12-hazard taxonomy, prompt construction, grade scoring rubric. Mar 2025.' },
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
            { name: 'Awesome Multimodal Medical Imaging', url: 'https://github.com/richard-peng-xia/awesome-multimodal-in-medical-imaging', desc: 'Curated multimodal medical imaging paper repository' },

            // ─── SAM 3 / 3D medical segmentation (2025-11) ───
            { name: 'SAM 3 Paper (arXiv 2511.16719)', url: 'https://arxiv.org/abs/2511.16719', desc: 'Meta SAM 3 — Promptable Concept Segmentation. Doubles SAM 2 on PCS. SA-Co 214K phrases × 126K media' },
            { name: 'SAM 3 GitHub (Meta)', url: 'https://github.com/facebookresearch/sam3', desc: 'SAM 3 + SAM 3D inference + finetuning code, checkpoints, notebooks' },
            { name: 'SAM 3.1 Real-time Video', url: 'https://ai.meta.com/blog/segment-anything-model-3/', desc: 'SAM 3.1 Object Multiplex (Mar 2026) — real-time video detection + tracking with multiplexing + global reasoning' },
            { name: 'MedSAM 3 Paper (arXiv 2511.19046)', url: 'https://arxiv.org/abs/2511.19046', desc: 'MedSAM 3 — text-promptable medical segmentation. SAM 3 + medical concepts. 14 modalities SOTA. Nov 2025' },
            { name: 'MedSAM 3 GitHub', url: 'https://github.com/Joey-S-Liu/MedSAM3', desc: 'MedSAM 3 code — pure text-guided medical segmentation + MedSAM 3 Agent (MLLM iterative refinement)' },
            { name: 'VISTA3D (NVIDIA MONAI)', url: 'https://arxiv.org/html/2406.05285v3', desc: 'Unified 3D medical imaging FM — 127-class organ + lesion CT segmentation. NVIDIA MONAI' },
            { name: 'SAM-Med3D GitHub', url: 'https://github.com/uni-medical/SAM-Med3D', desc: 'OpenMEDLab SAM-Med3D + Turbo — efficient promptable volumetric medical seg' },
            { name: 'MCP-MedSAM (MELBA)', url: 'https://www.melba-journal.org/papers/2025:008.html', desc: 'Lightweight MedSAM trained on single GPU in 1 day. Match competitor performance' },
            { name: 'SAM Medical Comparative (Wiley 2025)', url: 'https://aapm.onlinelibrary.wiley.com/doi/full/10.1002/mp.17470', desc: 'Specialization necessity for medical foundation segmentation. SAM2.1/SAM3/MedSAM2/SAM-Med2D/3D/nnInteractive/VISTA3D' },

            // ─── Google Time-series & Wearable FM ───
            { name: 'TimesFM GitHub (Google)', url: 'https://github.com/google-research/timesfm', desc: 'Google decoder-only time-series foundation model — 200M params. Zero-shot forecasting across retail/finance/healthcare' },
            { name: 'TimesFM 2.5 (HuggingFace)', url: 'https://huggingface.co/google/timesfm-2.5-200m-pytorch', desc: 'TimesFM 2.5 200M PyTorch — Sept 2025 release, Flax version for faster inference' },
            { name: 'TimesFM Blog (Google Research)', url: 'https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/', desc: 'TimesFM design + zero-shot forecasting motivation' },
            { name: 'PH-LLM Paper (Nature Medicine 2025)', url: 'https://www.nature.com/articles/s41591-025-03888-0', desc: 'Personal Health LLM — Gemini-based for sleep + fitness coaching. PH-LLM beats human experts: sleep 79% vs 76%, fitness 88% vs 71%' },
            { name: 'Wearable Health LLM Agent (Nat. Comm. 2025)', url: 'https://www.nature.com/articles/s41467-025-67922-y', desc: 'Transforming wearable data into personal health insights using LLM agents' },
            { name: 'LSM-2 Paper (arXiv)', url: 'https://arxiv.org/abs/2506.05321', desc: 'Large Sensor Model 2 with Adaptive+Inherited Masking — 40M hours Fitbit + Pixel Watch. Handles incomplete sensor data' },
            { name: 'LSM-2 Google Blog', url: 'https://research.google/blog/lsm-2-learning-from-incomplete-wearable-sensor-data/', desc: 'LSM-2 — robust wearable FM. 165K participants, hypertension/anxiety/BMI prediction' },
            { name: 'Apple Wearable FM (ICML 2025)', url: 'https://machinelearning.apple.com/research/beyond-sensor', desc: 'Apple wearable FM — 2.5B hours, 162K subjects, 57 health-related tasks. Beyond Sensor Data paper' },
            { name: 'Empirical Health JEPA Wearable', url: 'https://www.empirical.health/blog/wearable-foundation-model-jets/', desc: 'JEPA-based wearable FM — 87% high blood pressure detection accuracy' },
            { name: 'Cardio Wearable HIV (Comm Med 2025)', url: 'https://www.nature.com/articles/s43856-025-01331-6', desc: 'Wearable signal CVD screening for HIV+ population. Stanford' },

            // ─── MLCommons MedPerf ───
            { name: 'MLCommons Medical AI Working Group', url: 'https://mlcommons.org/working-groups/data/medical/', desc: 'MLCommons medical AI evaluation initiative — federated benchmarks, datasets, FDA engagement' },
            { name: 'MedPerf GitHub', url: 'https://github.com/mlcommons/medperf', desc: 'Open benchmarking platform for medical AI using federated evaluation. Data never leaves provider premises' },
            { name: 'MedPerf Paper (Nature MI 2023)', url: 'https://www.nature.com/articles/s42256-023-00652-2', desc: 'Federated benchmarking of medical AI with MedPerf — 32 sites, OpenFL framework, nnUNet' },
            { name: 'FeTS 2.0 Paper (Nature Comm. 2025)', url: 'https://www.nature.com/articles/s41467-025-60466-1', desc: 'Federated Tumor Segmentation FeTS 2.0 — post-op GBM Dice 0.95/0.94/0.89/0.77 (TIE/ET/RC/NE) record' },
            { name: 'FeTS Challenge (UPenn CBICA)', url: 'https://www.med.upenn.edu/cbica/fets/', desc: 'Federated Tumor Segmentation initiative — MICCAI challenge with MedPerf orchestrator' },
            { name: 'FeTS 2024 Aggregation Methods', url: 'https://arxiv.org/html/2512.06206', desc: 'MICCAI FeTS Challenge 2024 — efficient + robust federated aggregation' },
            { name: 'AILuminate v1.1', url: 'https://mlcommons.org/benchmarks/ailuminate/', desc: 'MLCommons chatbot safety benchmark — medical advice + harmful misinformation subset' },
            { name: 'MLPerf Inference v5.1 Medical', url: 'https://mlcommons.org/2025/09/mlperf-inference-v5-1-results/', desc: '3D U-Net medical imaging benchmark — KiTS19 kidney tumor seg throughput' },

            // ─── MathArena.ai (Apr 2026) ───
            { name: 'MathArena.ai', url: 'https://matharena.ai/', desc: '독립 수학 경시대회 LLM 평가. 모델당 4번 평가 후 평균 보고. ArXivLean/BrokenArxiv/ArXivMath/Visual Math/Final-Answer/Apex/AIME/HMMT/USAMO/IMO/Putnam/BRUMO/SMT/Project Euler/Miklós Schweitzer 추적' },
            { name: 'MathArena Competitions Page', url: 'https://matharena.ai/competitions', desc: 'MathArena 추적 경시대회 목록 — ArXiv-based + Visual Math + Olympiad/Tournament + Specialized' },
            { name: 'MathArena GPT-5.5 (xhigh)', url: 'https://matharena.ai/models/openai_gpt_55', desc: 'GPT-5.5 xhigh: Apex 80.21 SOTA, USAMO 2026 98.21, HMMT Feb 2026 97.73, AIME 2026 97.50, Visual Math 94.93. Final-Answer Comps 92.30 rank 1/23' },
            { name: 'MathArena Gemini 3.1 Pro', url: 'https://matharena.ai/models/gemini_gemini_31_pro', desc: 'Gemini 3.1 Pro: AIME 2026 98.33 rank 2/25, Apex 60.94 rank 3/41, Apex Shortlist 89.06 rank 2/32, USAMO 74.40' },
            { name: 'MathArena DeepSeek V4-Pro', url: 'https://matharena.ai/models/deepseek_deepseek_v4_pro', desc: 'DeepSeek V4-Pro: AIME 2026 95.83, HMMT 93.94, Apex 28.12, Apex Shortlist 86.46, USAMO 60.71' },
            { name: 'MathArena Claude Opus 4.7', url: 'https://matharena.ai/models/anthropic_opus_47', desc: 'Claude Opus 4.7: AIME 2026 95.83, HMMT 93.94, Apex 40.62, Apex Shortlist 63.02. Struggles with broken arxiv (4.92)' },
            { name: 'MathArena Kimi K2.6', url: 'https://matharena.ai/models/moonshot_k26', desc: 'Kimi K2.6: AIME 2026 95.83, HMMT 94.70, Apex 23.96, USAMO 51.19' },
            { name: 'MathArena Apex (LLM Stats)', url: 'https://llm-stats.com/benchmarks/matharena-apex', desc: 'MathArena Apex aggregator — DeepSeek V4-Pro-Max 0.902 (self-reported), V4-Flash-Max 0.857, Gemini 3 Pro 0.234' },

            // ─── April 2026 frontier refresh ───
            { name: 'SWE-bench Pro Public Leaderboard', url: 'https://labs.scale.com/leaderboard/swe_bench_pro_public', desc: 'Scale Labs SWE-bench Pro — harder real-world coding. Apr 2026: Claude Mythos 77.8 SOTA, Opus 4.7 64.3, GPT-5.5 58.6' },
            { name: 'BenchLM SWE-bench Pro', url: 'https://benchlm.ai/benchmarks/swePro', desc: 'BenchLM SWE-bench Pro aggregator — 28 LLMs evaluated' },
            { name: 'Claude Mythos Benchmarks (NxCode)', url: 'https://www.nxcode.io/resources/news/claude-mythos-benchmarks-93-swe-bench-every-record-broken-2026', desc: 'Claude Mythos Preview Apr 7 2026 — SWE-Verified 93.9, GPQA Diamond 94.6. Project Glasswing 50-org restricted access' },
            { name: 'DeepSeek V4-Pro VentureBeat', url: 'https://venturebeat.com/technology/deepseek-v4-arrives-with-near-state-of-the-art-intelligence-at-1-6th-the-cost-of-opus-4-7-gpt-5-5', desc: 'DeepSeek V4-Pro 1.6T MoE Apr 24 2026 — MMLU-Pro 87.5, LiveCodeBench 93.5 SOTA, SWE-Verified 80.6, $1.74/1M tokens (1/6 cost of Opus 4.7)' },
            { name: 'DeepSeek V4-Pro HuggingFace', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro', desc: 'DeepSeek V4-Pro/V4-Flash — 1.6T-A49B / 284B-A13B MoE, 1M context (Engram conditional memory), MIT license' },
            { name: 'Vellum Claude Opus 4.7 Benchmarks', url: 'https://www.vellum.ai/blog/claude-opus-4-7-benchmarks-explained', desc: 'Claude Opus 4.7 Apr 16 2026 — SWE-Verified 87.6, SWE-Pro 64.3 (Adaptive scaffolding)' },
            { name: 'Office Chai DeepSeek V4 Pricing', url: 'https://officechai.com/ai/deepseek-v4-pro-deepseek-v4-flash-benchmarks-pricing/', desc: 'DeepSeek V4 Pro+Flash benchmarks + pricing breakdown' },
            { name: 'Office Chai Claude Mythos', url: 'https://officechai.com/ai/claude-mythos-preview-benchmarks-swe-bench-pro/', desc: 'Anthropic Claude Mythos Preview SWE-Pro 77.8 SOTA breakdown' },
            { name: 'AI Models April 2026 (RenovateQR)', url: 'https://renovateqr.com/blog/ai-models-april-2026', desc: 'April 2026 release calendar — Gemma 4 (Apr 2), Llama 4 Scout/Maverick (Apr 5), Claude Mythos (Apr 7), Muse Spark (Apr 8), Opus 4.7 (Apr 16), Gemini 3.1 Ultra (Apr 12), Grok 4.3 (Apr 22), DeepSeek V4 + GPT-5.5 (Apr 24)' },
            { name: 'AI Releases April 2026 (Searchcans)', url: 'https://www.searchcans.com/blog/ai-model-releases-april-2026/', desc: 'AA Intelligence Index Apr 2026 — Gemini 3.1 Ultra & GPT-5.4 Pro tied 57' },

            // ─── Cyber attack / CBRN / Jailbreak audit fills (2026-04-28) ───
            { name: 'NYU CTF Bench', url: 'https://nyu-llm-ctf.github.io/', desc: '200 CTF challenges — Claude Opus 4.7 59% solve, Gemini 3.1 Pro 52%, Opus 4.6 56%' },
            { name: 'NYU CTF Paper (NeurIPS 2024)', url: 'https://arxiv.org/abs/2406.05590', desc: 'NYU CTF Bench — scalable open-source benchmark for LLMs in offensive security' },
            { name: 'CAIBench Paper (arXiv 2510)', url: 'https://arxiv.org/html/2510.24317v1', desc: 'Cybersecurity AI Meta-Benchmark — aggregates NYU CTF, AIRTBench, Cybench, CTI-Bench, AIxCC' },
            { name: 'AIRTBench Code (Dreadnode)', url: 'https://github.com/dreadnode/AIRTBench-Code', desc: 'AI red-team CTF benchmark — adversarial prompt + cybersecurity exploitation' },
            { name: 'CTI-Bench (xashru)', url: 'https://github.com/xashru/cti-bench', desc: 'Cyber Threat Intelligence comprehension + threat analysis benchmark' },
            { name: 'AI Cyber Challenge (DARPA AIxCC)', url: 'https://aicyberchallenge.com/', desc: 'DARPA AI Cyber Challenge — synthetic vulnerability detection + patching' },
            { name: 'MegaVul GitHub', url: 'https://github.com/Icyrockton/MegaVul', desc: 'Large-scale software vulnerability dataset for LLM security evaluation' },
            { name: 'HarmBench (Emergent Mind)', url: 'https://www.emergentmind.com/topics/harmbench-framework', desc: 'Standardized LLM red teaming framework — multi-attack jailbreak benchmark' },
            { name: 'StrongREJECT Paper (arXiv)', url: 'https://arxiv.org/pdf/2402.10260', desc: 'StrongREJECT — automated jailbreak evaluator. Berkeley AI Research. Apr 2026: Opus 4.6 4.39 ASR (lowest), Gemini 2.5 Pro 16.08' },
            { name: 'JailbreakBench', url: 'https://jailbreakbench.github.io/', desc: 'Open robustness benchmark for jailbreaking LLMs. Apr 2026: Opus 4.7 4.1 ASR, GPT-5.5 6.4, Gemini 3.1 14.2' },
            { name: 'General Analysis AI Security', url: 'https://www.generalanalysis.com/benchmarks', desc: 'AI Security benchmarks aggregator — LLM Adversarial Robustness Leaderboard. ASR across HarmBench + StrongREJECT + MultiTurn' },
            { name: 'Epoch AI Biorisk Evals', url: 'https://epoch.ai/gradient-updates/do-the-biorisk-evaluations-of-ai-labs-actually-measure-the-risk-of-developing-bioweapons', desc: 'Critical analysis of biorisk evaluations — VCT vs WMDP vs LAB-Bench coverage gaps' },
            { name: 'WMDP Benchmark (CAIS)', url: 'https://safe.ai/blog/wmdp-benchmark', desc: 'Center for AI Safety WMDP — 1,273 bio + 408 chem hazardous knowledge MCQs. Apr 2026: Mythos 86.5 bio / 81.4 chem, GPT-5.5 84.2/79.5' },
            { name: 'LAB-Bench (FutureHouse)', url: 'https://www.futurehouse.org/research-announcements/lab-bench', desc: 'Lab-Bench biology task benchmark — protocol design, mol cloning, virology. Complement to WMDP/VCT' },

            // ─── Claude Mythos Preview comprehensive (2026-04-28) ───
            { name: 'Anthropic Red — Mythos Preview', url: 'https://red.anthropic.com/2026/mythos-preview/', desc: 'Mythos cybersecurity capability report — OSS-Fuzz 595 tier-1/2 crashes + 10 tier-5 control-flow hijacks, Firefox 181 exploits + 29 register control, 89% severity match on 198 vuln reports' },
            { name: 'Anthropic Project Glasswing', url: 'https://www.anthropic.com/glasswing', desc: 'Project Glasswing — Mythos restricted access for cybersecurity defense (AWS, Apple, Cisco, CrowdStrike, Google, JPMorgan, Linux Foundation, Microsoft, NVIDIA, Palo Alto)' },
            { name: 'Mythos NxCode Full Benchmarks', url: 'https://www.nxcode.io/resources/news/claude-mythos-benchmarks-93-swe-bench-every-record-broken-2026', desc: 'Mythos comprehensive benchmark report — SWE-Verified 93.9, USAMO 2026 97.6 (+55.3 over Opus 4.6), GPQA 94.5, HLE w/ tools 64.7, GraphWalks BFS 80, CharXiv w/ tools 93.2, OSWorld 79.6, BrowseComp 86.9' },
            { name: 'BenchLM Mythos Profile', url: 'https://benchlm.ai/models/claude-mythos-preview', desc: 'BenchLM provisional rank #1/115 overall 99/100 — Agentic 100, Coding 100, Multilingual 100, Knowledge 99.2' },
            { name: 'Mythos Schneier on Security', url: 'https://www.schneier.com/blog/archives/2026/04/on-anthropics-mythos-preview-and-project-glasswing.html', desc: "Schneier's analysis of Mythos Preview cybersecurity implications" },
            { name: 'Mythos Foreign Policy', url: 'https://foreignpolicy.com/2026/04/20/claude-mythos-preview-anthropic-project-glasswing-cybersecurity-ai-hacking-danger/', desc: 'Foreign Policy — Mythos changes cyber calculus, autonomous zero-day discovery in every major OS+browser' },
            { name: 'Mythos Help Net Security', url: 'https://www.helpnetsecurity.com/2026/04/14/claude-mythos-test-attack-capabilities-limits/', desc: 'UK AISI testing — Mythos exceeds prior models on CTF + multi-step attacks but cannot reliably autonomously attack hardened networks' },
            { name: 'Mythos Cybersecurity (Zvi)', url: 'https://thezvi.substack.com/p/claude-mythos-2-cybersecurity-and', desc: "Zvi's deep-dive — Mythos cybersecurity capabilities + Project Glasswing analysis" },
            { name: 'Mythos Fortune', url: 'https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/', desc: 'Fortune launch coverage — early access to firms for cybersecurity defense bolstering' },
            { name: 'Mythos CETaS Turing', url: 'https://cetas.turing.ac.uk/publications/claude-mythos-future-cybersecurity', desc: 'Centre for Emerging Technology and Security analysis of Mythos cybersecurity future' },
            { name: 'Mythos LLM Stats', url: 'https://llm-stats.com/models/claude-mythos-preview', desc: 'LLM Stats Mythos profile + benchmark aggregator' },

            // ─── Agent / Agentic AI Leaderboards & Benchmarks (Wave 6D3) ───
            { name: 'AgentBench (THUDM)', url: 'https://github.com/THUDM/AgentBench', desc: 'Tsinghua THUDM — first comprehensive LLM-as-agent evaluation across 8 distinct environments (OS / DB / KG / DCG / LTP / House / WebShop / Web Browsing). Reasoning + decision-making benchmark.' },
            { name: 'VisualAgentBench (THUDM)', url: 'https://github.com/THUDM/VisualAgentBench', desc: 'Tsinghua THUDM — multimodal large model (LMM) agent benchmark spanning embodied, GUI, and visual design tasks. Successor to AgentBench for vision-grounded agents.' },
            { name: 'VisualWebArena', url: 'https://jykoh.com/vwa', desc: 'CMU — multimodal autonomous-agent benchmark for realistic visually-grounded web tasks (Classifieds / Shopping / Reddit). Extends WebArena with screenshots and image I/O.' },
            { name: 'Online-Mind2Web', url: 'https://mind2web-live.github.io/', desc: 'OSU NLP Group — live online evaluation harness for general-purpose web agents. Supersedes static Mind2Web with real-site rollouts and human-judge scoring.' },
            { name: 'ScreenSpot-Pro (GUI Grounding)', url: 'https://gui-agent.github.io/grounding-leaderboard/', desc: 'GUI agent grounding leaderboard — high-resolution professional-app screenshots (CAD, IDE, scientific software) for click-target localization. ScreenSpot v1/v2/Pro tracks.' },
            { name: 'OS-Copilot / GAIA-OSC', url: 'https://github.com/OS-Copilot/OS-Copilot', desc: 'OS-Copilot framework + FRIDAY agent — generalist computer-using agent across OS-level apps. Reference implementation evaluated on GAIA-OSC tasks.' },
            { name: 'WebShop', url: 'https://webshop-pnlp.github.io/', desc: 'Princeton NLP — interactive e-commerce simulation benchmark. 1.18M real products, 12K crowd-sourced text instructions; agents must browse, search, and purchase to match user intent.' },
            { name: 'BrowseComp (OpenAI)', url: 'https://openai.com/index/browsecomp/', desc: 'OpenAI — benchmark for browsing agents finding hard-to-locate web information. 1,266 questions stress-testing persistence and creativity in deep web search. Mythos 86.9 leads.' },
            { name: 'Terminal-Bench', url: 'https://www.terminal-bench.dev/', desc: 'Stanford + Laude Institute — benchmark for AI agents performing real terminal/CLI tasks. Container-isolated tasks across sysadmin, dev workflows, debugging. v2 active.' },
            { name: 'SWE-Bench / SWE-Bench Verified', url: 'https://swebench.com/', desc: 'Princeton + Stanford — software-engineering agent benchmark from real GitHub issues + PRs across 12 popular Python repos. Verified subset (500 human-validated tasks) is the canonical metric.' },
            { name: 'Tau-bench (Sierra)', url: 'https://github.com/sierra-research/tau-bench', desc: 'Sierra Research — tool-agent benchmark in retail + airline customer-service domains. Tests dialogue, tool use, and policy adherence; precursor to τ²-bench and τ³-bench.' },
            { name: 'AgentDojo (SPY Lab)', url: 'https://agentdojo.spylab.ai/', desc: 'ETH Zurich SPY Lab — adversarial robustness benchmark for LLM agents. 97 realistic tasks + 629 prompt-injection attacks across email, banking, travel, Slack tool environments.' },
            { name: 'Apollo Research — Scheming Evals', url: 'https://www.apolloresearch.ai/research', desc: 'Apollo Research — frontier-model deceptive-alignment and in-context-scheming evaluations. Reference for sandbagging, alignment-faking, and covert subversion testing methodology.' },
            { name: 'RewardBench 2 (AI2)', url: 'https://huggingface.co/spaces/allenai/reward-bench', desc: 'Allen Institute for AI — reward-model and LLM-judge evaluation. RewardBench 2 ships harder generative + classifier RM benchmarks tied to RLHF/RLAIF agent training.' },
            { name: 'ProcessBench (QwenLM)', url: 'https://github.com/QwenLM/ProcessBench', desc: 'Alibaba Qwen — process-supervision benchmark for math reasoning. 3,400 problems with step-level error annotations to evaluate process reward models / critic agents.' },
            { name: 'USACO Olympiad', url: 'https://usaco.org/', desc: 'USA Computing Olympiad — primary source for the 307 Bronze→Platinum problems used by HAL USACO and many agentic-coding evaluations. Canonical test bank.' },
            { name: 'AppWorld', url: 'https://appworld.dev/', desc: 'Stony Brook + AI2 — high-fidelity simulator of 9 day-to-day apps (Amazon, Gmail, Spotify, Venmo, etc.) with 750 tool-use tasks; ACL 2024 best resource paper.' },
            { name: 'MetaGPT', url: 'https://github.com/geekan/MetaGPT', desc: 'DeepWisdom — multi-agent software-company framework (PM/Architect/Engineer/QA roles). Reference codebase for SoftwareDev agent research; widely benchmarked on HumanEval and MBPP.' },

            // ── 2026-05-10 robot-manipulation + foundational AI ──
            { name: 'CaP-X (CaP-Bench)', url: 'https://capgym.github.io/', desc: 'NVIDIA + Stanford + Berkeley + UT Austin (Mar 2026, arxiv 2603.22435). First comprehensive benchmark for LLM coding agents on robot manipulation. 39 tasks × 8 tiers (S1-S4 single-turn + M1-M4 multi-turn) across Robosuite + LIBERO-PRO + BEHAVIOR-1K. 12 frontier models evaluated (Gemini-3-Pro / GPT o1/5.1/5.2 / Claude Opus 4.5 / Qwen3 235B / DeepSeek-V3.1-Terminus etc.). Companion: CaP-Gym + CaP-Agent0 + CaP-RL.' },
            { name: 'CaP-X GitHub', url: 'https://github.com/capgym/cap-x', desc: 'CaP-X open-source codebase — interactive coding-agent environments (CaP-Gym), benchmark suite (CaP-Bench), training-free agentic framework (CaP-Agent0), RL pipeline (CaP-RL). v0.0.1 released Apr 1 2026.' },
            { name: 'CaP-X Paper (arxiv 2603.22435)', url: 'https://arxiv.org/abs/2603.22435', desc: 'CaP-X paper — "A Framework for Benchmarking and Improving Coding Agents for Robot Manipulation". Authors include Fei-Fei Li, Linxi "Jim" Fan, Ken Goldberg, Yuke Zhu, Shankar Sastry. Mar 23 2026.' },
            { name: 'Genesis AI GENE-26.5', url: 'https://www.genesis.ai/press/press-release-gene-265', desc: 'Genesis AI robotic foundation model (May 6 2026). Proprietary dexterous hand + tactile-sensing data-collection glove (5× data efficiency vs teleoperation, 100× cheaper hardware). Tasks: cooking, pipetting, wire harnessing, Rubik\'s cube, piano. Backers: Eclipse + Khosla + Bpifrance + HSG; Eric Schmidt + Xavier Niel investors. No standardized benchmark scores published yet.' },

            // ── 2026-05-10 link-investigation additions ──
            // Epoch Capabilities Index ecosystem (composite "general capability" scale)
            { name: 'Epoch Capabilities Index (ECI)', url: 'https://epoch.ai/eci', desc: 'Composite metric combining 40+ AI benchmarks into a single linear "general capability" scale. Calibrated so Claude 3.5 Sonnet = 130 and GPT-5 (medium) = 150 (current top). Domain-specific subsets (Software Engineering, Math) use the same Rosetta Stone methodology applied to single-domain benchmark sets.' },
            { name: 'Epoch ECI methodology — "stitches across difficulties"', url: 'https://epochai.substack.com/p/epochs-capabilities-index-stitches', desc: 'Epoch AI substack — explains how ECI infers benchmark difficulty statistically from overlapping model results, weights harder benchmarks more, and compares models even when single benchmarks saturate.' },
            { name: 'Epoch — RIP Classic Reasoning Benchmarks', url: 'https://epochai.substack.com/p/rip-classic-reasoning-benchmarks', desc: 'Epoch AI saturation analysis (May 2026) — GPQA / GraphWalks / SimpleBench saturating. Cites Claude Mythos GraphWalks 80% (verified in DB). Recommends replacement benchmarks: SpatialBench, IRGB, ARC-AGI, FrontierMath Open Problems, ALE-bench, AlgoTune, CRUX, IKEA assembly, Magic: the Gathering, IMO grading.' },
            { name: 'LessWrong — Introducing the ECI', url: 'https://www.lesswrong.com/posts/2RtuThoZwP4o8aEpS/introducing-the-epoch-capabilities-index-eci', desc: 'Reference post explaining ECI scaling rationale — "we\'ve chosen to scale things such that Claude 3.5 Sonnet gets 130 and GPT-5 (medium) gets 150". Linear scale by design: 10-pt jumps equivalent across the range.' },
            { name: 'Epoch AI ECI Benchmarks page', url: 'https://epoch.ai/benchmarks/eci', desc: 'Direct ECI benchmarks page (alternative URL) for the Capabilities Index data explorer.' },
            { name: 'A Rosetta Stone for AI Benchmarks (arxiv 2512.00193)', url: 'https://arxiv.org/abs/2512.00193', desc: 'Methodology paper underlying ECI (Anson Ho, Jean-Stanislas Denain, David Atanasov, Samuel Albanie, Rohin Shah). IRT-style statistical model that "stitches benchmarks together, putting model capabilities and benchmark difficulties on a single numerical scale" without temporal/compute assumptions. Applications: AI progress velocity forecasting, algorithmic efficiency rate estimation, acceleration detection.' },
            { name: 'Epoch ECI canonical CSV (172 models)', url: 'https://epoch.ai/data/eci_scores.csv', desc: 'Authoritative ECI leaderboard data export — 172 models with ECI score + 95% bootstrap confidence intervals, organization, accessibility group, and model versions. Source for full ECI ingest in this dashboard.' },
            { name: 'Epoch eci-public GitHub repo', url: 'https://github.com/epoch-research/eci-public', desc: 'Open-source companion repo for ECI methodology — calibration data, scoring scripts, and reproducibility artefacts for the Rosetta Stone framework.' },
            { name: 'Epoch ECI Documentation — Data', url: 'https://epoch.ai/data/eci-documentation/data', desc: 'Official ECI data documentation. Lists the 42 contributing benchmarks across 3 categories: (Internal Evals 7) Chess Puzzles · FrontierMath T1-3 · FrontierMath T4 · GPQA Diamond · MATH L5 · OTIS Mock AIME · SimpleQA Verified · (External Leaderboards 15) Aider polyglot · APEX-Agents · ARC-AGI-2 · BALROG · DeepResearch · Fiction.liveBench · GeoBench · GSO · HLE · SimpleBench · SWE-bench Bash · Terminal-Bench · Agent Company · VPCT · WeirdML V2 · (Developer Reported 20) ANLI · ARC AI2 · ARC-AGI · BBH · CADEval · CSQA2 · Cybench · GSM8K · HellaSwag · LAMBADA · Lech Mazur · MMLU · OpenBookQA · OSWorld · PIQA · ScienceQA · SuperGLUE · TriviaQA · Video MME · WinoGrande. Inclusion criteria: ≥4 benchmark scores per model, post-2023 release. 24 of the 42 mapped to existing DB ids — visible in Frontier Compare → Composite category.' },
            { name: 'Epoch benchmarks.csv (per-model internal evals)', url: 'https://epoch.ai/data/benchmarks.csv', desc: '5542-row CSV with per-(model, task, score, stderr) data for the 7 ECI internal evaluations: Chess Puzzles, FrontierMath {Public/Private × Tier 1-3 / Tier 4}, GPQA Diamond, MATH Level 5, OTIS Mock AIME, SWE-Bench Verified, SimpleQA Verified. Schema: id_runs, task, model, Best score, Scores, Display name, mean_score, stderr, etc. Source for our 2026-05-10 internal evals ingest (+111 new scores).' },
            { name: 'epoch-research/benchmark-stitching GitHub data/', url: 'https://github.com/epoch-research/benchmark-stitching/tree/main/data', desc: 'GitHub repo cited by Rosetta Stone paper (arxiv 2512.00193). data/ directory has 33 external_benchmark_*.csv files for the External Leaderboards + Developer Reported ECI contributors. Each CSV has Source + Source link columns providing primary-source attribution per (model, score). Source for our 2026-05-10 bulk ingest (+594 new scores, +10 new benchmark registrations including arc_ai2_easy, lech_mazur_writing, piqa, scienceqa, winogrande, openbookqa, lambada, csqa2, anli, superglue, boolq, cadeval).' },
            { name: 'Rosetta Stone Tables 3 & 4 — ECI benchmark list', url: 'https://arxiv.org/html/2512.00193v1', desc: 'HTML version of the Rosetta Stone paper. Tables 3 (5 internal benchmarks) + 4 (33 external benchmarks) enumerate the 38 benchmarks fitted in the paper across 179 models with 1324 total scores. Table 1: capability estimates for 16 notable models (GPT-5-high 2.65 → GPT-4 1.60). Figure 20: predicted vs actual scores by benchmark. Underlying data lives in epoch-research/benchmark-stitching repo (linked above).' },

            // 2026-05-11 — Archived paper PDFs (local copies in resource/)
            { name: 'Paper PDF (local) — A Rosetta Stone for AI Benchmarks', url: 'resource/A_Rosetta_Stone_for_AI_Benchmarks_arxiv_2512.00193.pdf', desc: 'Local PDF — Rosetta Stone for AI Benchmarks methodology paper (arxiv 2512.00193, Ho et al.). IRT-style statistical stitching that places models and benchmarks on a single capability scale. Underlying methodology for Epoch ECI.' },
            { name: 'Paper PDF (local) — DeepSeekMath V2', url: 'resource/DeepSeek-Math_V2_arxiv_2511.22570.pdf', desc: 'Local PDF — DeepSeekMath-V2: Towards Self-Verifiable Mathematical Reasoning (arxiv 2511.22570). Achieved 118/120 on Putnam 2024 with self-verifying reasoning protocol.' },
            { name: 'Paper PDF (local) — Goedel-Prover-V2', url: 'resource/Goedel-Prover-V2_arxiv_2508.03613.pdf', desc: 'Local PDF — Goedel-Prover-V2: open-source formal theorem proving model (arxiv 2508.03613). Lean 4 formalization improvements; competitive with frontier closed models on miniF2F / PutnamBench.' },
            { name: 'Paper PDF (local) — DeepSeek-Prover-V2', url: 'resource/DeepSeek-Prover-V2_arxiv_2504.21801.pdf', desc: 'Local PDF — DeepSeek-Prover-V2 (arxiv 2504.21801). Lean 4 theorem proving with subgoal decomposition + RL on proof traces. Frontier-class results on miniF2F and PutnamBench.' },
            { name: 'Paper PDF (local) — MatterGen (Nature 2025 preprint)', url: 'resource/MatterGen_Nature_2025_s41586-025-08628-5.pdf', desc: 'Local PDF — MatterGen: a generative model for inorganic materials design (Nature 2025, s41586-025-08628-5; arxiv 2312.03687 preprint). Diffusion model for stable crystal structures across the periodic table, conditioned on target properties.' },
            { name: 'Paper PDF (local) — AILuminate v1.0', url: 'resource/AILuminate_v1_arxiv_2503.05731.pdf', desc: 'Local PDF — AILuminate v1.0 AI Risk and Reliability Benchmark (arxiv 2503.05731). MLCommons safety benchmark — 12 hazard categories × 24k prompts/lang, 5-point grade rubric.' },

            // 2026-05-10 — AAII (Artificial Analysis Intelligence Index) composite
            { name: 'Artificial Analysis Intelligence Index (AAII)', url: 'https://artificialanalysis.ai/leaderboards/models', desc: 'AAII v4.0.4 (March 2026) leaderboard — composite intelligence metric on 0-100 scale. Top: GPT-5.5 (xhigh) = 60. Weighted avg across 4 categories (each 25%): Agents (GDPval-AA + τ²-Bench Telecom), Coding (Terminal-Bench Hard + SciCode), General (AA-LCR + AA-Omniscience + IFBench), Scientific Reasoning (HLE + GPQA Diamond + CritPt). Apr 2026 v4.0.4 changed grader for GDPval-AA to Gemini 3.1 Pro Preview. Visible alongside ECI in Frontier Compare → Composite category.' },
            { name: 'AAII Methodology page', url: 'https://artificialanalysis.ai/methodology/intelligence-benchmarking', desc: 'Detailed AAII v4.0.4 methodology — exact per-benchmark weights (GDPval-AA 16.7%, Terminal-Bench Hard 16.7%, AA-Omniscience 12.5%, HLE 12.5%, τ²-Bench Telecom 8.3%, SciCode 8.3%, AA-LCR 6.25%, IFBench 6.25%, GPQA Diamond 6.25%, CritPt 6.25%). Pass@1 vs Elo scoring per benchmark. AA-Omniscience composite = 50% Accuracy + 50% (1 - Hallucination Rate). 95% confidence interval ±1%. Version history: v1.0 (Jan 2024) → v4.0.4 (Mar 2026). Excludes price/latency/multimodal — those tracked separately.' },
            { name: 'AAII Trends — Intelligence Index by Model Type', url: 'https://artificialanalysis.ai/trends#artificial-analysis-intelligence-index-by-model-type', desc: 'Time-series AAII chart by model type (Reasoning vs Non-Reasoning, Proprietary vs Open Weights). 514+ tracked models with reasoning-level breakdown. Source for our 2026-05-10 full ingest of 154 AAII scores via Playwright scrape (down through rank ~170, AAII 5-60 range).' },

            // 2026-05-10 — OpenAI Trusted Access for Cyber (TAC) program — GPT-5.5-Cyber + GPT-5.4-Cyber
            { name: 'OpenAI — Scaling Trusted Access for Cyber Defense', url: 'https://openai.com/index/scaling-trusted-access-for-cyber-defense/', desc: 'OpenAI TAC (Trusted Access for Cyber) program announcement. Vetted-defender access to cyber-permissive model variants: GPT-5.4-Cyber (Feb 2026) and GPT-5.5-Cyber (May 2026). Lower refusal boundary for legitimate security research; binary reverse engineering capabilities. Includes $10M API credit Cybersecurity Grant Program partnership with Trail of Bits.' },
            { name: 'OpenAI — GPT-5.5 with Trusted Access for Cyber', url: 'https://openai.com/index/gpt-5-5-with-trusted-access-for-cyber/', desc: 'GPT-5.5-Cyber introduction (2026-05-08). CyberGym = 81.9% (vs base GPT-5.5 81.8%). Cyber-permissive variant for elite defenders — vulnerability research, threat assessment, enterprise/critical infrastructure security workflows.' },
            { name: 'AISI — Our evaluation of OpenAI\'s GPT-5.5 cyber capabilities', url: 'https://www.aisi.gov.uk/blog/our-evaluation-of-openais-gpt-5-5-cyber-capabilities', desc: 'UK AI Security Institute external evaluation of GPT-5.5 cyber capabilities. Advanced Cyber Tasks expert tier: GPT-5.5 71.4% ±8.0%, Mythos Preview 68.6% ±8.7%, GPT-5.4 52.4% ±9.8%, Opus 4.7 48.6% ±10.0%. The Last Ones (TLO) corporate network attack: GPT-5.5 completed 2 of 10 attempts at 100M-token budget. rust_vm reverse-engineering challenge: GPT-5.5 solved in ~10:22 minutes at $1.73 (expert human ~12 hours). Cooling Tower ICS attack: 0 successes by any model.' },

            // 2026-05-12 — DELEGATE-52 (Microsoft Research)
            { name: 'DELEGATE-52 paper (arxiv 2604.15597)', url: 'https://arxiv.org/abs/2604.15597', desc: 'Philippe Laban, Tobias Schnabel, Jennifer Neville — "LLMs Corrupt Your Documents When You Delegate" (April 17 2026). Introduces DELEGATE-52 benchmark for long delegated document-editing workflows across 52 professional domains. RS@20 metric = % original content preserved after 20 LLM interactions. Frontier models average ~25% degradation. Tested 19 LLMs — Gemini 3.1 Pro tops at 80.9%, GPT-5 Nano bottom at 10.0%, only Python achieves "ready" (≥98%) across most models.' },
            { name: 'DELEGATE-52 GitHub + HuggingFace', url: 'https://github.com/microsoft/DELEGATE52', desc: 'Microsoft Research DELEGATE-52 benchmark repo. Dataset: https://huggingface.co/datasets/microsoft/DELEGATE52. 52 professional domains incl coding, crystallography, music notation. Used for our 2026-05-12 ingest (1 benchmark + 19 model scores).' },

            // 2026-05-12 — Onyx Open LLM Leaderboard 2026 (Onyx AI, Roshan Desai)
            { name: 'Onyx Open LLM Leaderboard 2026', url: 'https://onyx.app/open-llm-leaderboard', desc: 'Open-source LLM leaderboard maintained by Onyx AI (Roshan Desai). 19 models × 10 benchmarks: MMLU / MMLU-Pro / GPQA Diamond / IFEval / Chatbot Arena Elo / SWE-bench Verified / HumanEval / LiveCodeBench / AIME 2025 / MATH-500. Sub-categories: Overall / Coding / Math / Chat / Reasoning. Scores from official tech reports. Last updated 2026-03-24. Top picks: Kimi K2.5 (1T params), GLM-5 (744B), Qwen 3.5 (397B), DeepSeek V3.2 (685B).' },
            { name: 'Onyx — EnterpriseRAG-Bench', url: 'https://github.com/onyx-dot-app/EnterpriseRAG-Bench', desc: 'Onyx AI enterprise RAG benchmark GitHub repo. Companion to Onyx Open LLM Leaderboard. Not yet registered in our DB.' },

            // 2026-05-17 — Daily sweep batch
            { name: 'Microsoft MDASH — new CyberGym SOTA', url: 'https://www.microsoft.com/en-us/security/blog/2026/05/12/defense-at-ai-speed-microsofts-new-multi-model-agentic-security-system-tops-leading-industry-benchmark/', desc: 'Microsoft Security multi-model agentic scanning harness (May 12 2026) orchestrating 100+ specialized AI agents. NEW SOTA on CyberGym at 88.45% — 5pp ahead of next entry (Claude Mythos Preview 83.1%). System-level harness, not a single model SKU.' },
            { name: 'CurveBench (arxiv 2605.14068)', url: 'https://arxiv.org/abs/2605.14068', desc: 'May 13 2026 — Jordan-curve topological reasoning benchmark. 756 images × 5 difficulty levels. Gemini 3.1 Pro: 71.1% Easy / 19.1% Hard (-52pp drop reveals topological reasoning is a current capability cliff). Qwen3-VL-8B 2.8% Easy baseline, 33.3% after fine-tune (+30.5pp).' },
            { name: 'MemLens (arxiv 2605.14906)', url: 'https://arxiv.org/abs/2605.14906', desc: 'May 14 2026 — Multimodal Long-Term Memory benchmark for large VLMs. 789 questions × 4 context lengths (32K-256K) × 5 memory abilities. 27 VLMs + 7 memory agents tested.' },
            { name: 'MemEye (arxiv 2605.15128)', url: 'https://arxiv.org/abs/2605.15128', desc: 'May 14 2026 — Visual-centric evaluation framework for multimodal agent memory. 8 life-scenario tasks × 13 memory methods × 4 VLM backbones.' },
            { name: 'ViMU — Video Metaphorical Understanding (arxiv 2605.14607)', url: 'https://arxiv.org/abs/2605.14607', desc: 'May 14 2026 — Video subtext understanding: metaphor / irony / social commentary. Hint-free open-ended + MCQ.' },
            { name: 'PROVE-Bench (arxiv 2605.14534)', url: 'https://arxiv.org/abs/2605.14534', desc: 'May 14 2026 — Perceptual RemOVal cohErence Benchmark for visual media. PROVE-M (80 paired videos) + PROVE-H (100 challenge videos). RC-S/RC-T metrics.' },

            // 2026-05-17 — GBA Eval
            { name: 'GBA Eval — Frontier coding agents build a GBA emulator', url: 'https://gbaeval.com/', desc: '9 frontier AI agents asked to write a Game Boy Advance emulator in WebAssembly from scratch. Output graded against Mesen2 reference across 27 testcases × 3 sections (procedural 20% / replay 60% / audio 20%). Overall #1: GPT-5.5 53.22% / Sonnet 4.6 48.76% / Opus 4.6 44.12% / Opus 4.7 43.81% / GPT-5.4 31.60%. Surprising bottom-tier: Gemini 3.1 Pro 0.85% / Kimi K2.6 0.86% / GLM 5.1 = MiniMax M2.7 = 0%. Sub-score asymmetry: Opus 4.7 leads procedural (CPU/memory tests) at 53.26%, GPT-5.5 leads replay (actual gameplay) at 60.93% and audio 58.88%.' },

            // 2026-05-15 — World Foundation Model sweep
            { name: 'VBench Leaderboard (Vchitect, HF Space)', url: 'https://huggingface.co/spaces/Vchitect/VBench_Leaderboard', desc: 'Gold-standard video gen benchmark — 16 dimensions (Quality + Semantic). Top: Vchitect IPOW 88.26% Total / Vidu Q1 87.41 / Wan 2.1 86.22 / Veo 3 85.06 / Sora (original) 84.28. Open-source SOTA at 88.26%.' },
            { name: 'VBench-2.0 (arxiv 2503.21755)', url: 'https://arxiv.org/abs/2503.21755', desc: 'VBench-2.0 — Intrinsic Faithfulness eval across 5 categories (Creativity / Commonsense / Controllability / Human Fidelity / Physics) × 18 sub-dimensions. Veo 3 Total 66.72% (Physics 69.35, Human Fidelity 86.88, Controllability 47.04).' },
            { name: 'V-JEPA 2 (arxiv 2506.09985, Meta)', url: 'https://arxiv.org/abs/2506.09985', desc: 'Meta\'s flagship video world model (Yann LeCun). 1.2B JEPA architecture. SSv2 Top-1 77.3% / Epic-Kitchens R@5 39.7 / Perception Test 84.0 / TempCompass 76.9.' },
            { name: 'Meta Physical Reasoning Leaderboard', url: 'https://huggingface.co/spaces/facebook/physical_reasoning_leaderboard', desc: 'IntPhys 2 + MVPBench + CausalVQA — three Meta benches for physical reasoning. Gemini 1.5 Pro: IntPhys 2 92.44% / CausalVQA 84.78% (best frontier on commonsense physics). Cosmos Reason 2 8B: IntPhys 2 58.14% (best WFM specialist).' },
            { name: 'NVIDIA Cosmos Predict 2.5 (arxiv 2511.00062)', url: 'https://arxiv.org/abs/2511.00062', desc: 'Cosmos Predict 2.5 14B Physical AI world model. PAI-Bench Text2World post-train 0.768, Image2World 0.810, FVD AV-multiview 23.06 (down from Predict 1\'s 63.69, 2.8x improvement).' },
            { name: 'World Labs Marble (Fei-Fei Li, Nov 2025)', url: 'https://www.worldlabs.ai/', desc: 'Fei-Fei Li\'s World Labs first commercial product (Nov 12 2025) — 3D persistent scene generation WFM. No public quantitative benchmark claims yet; model registered for taxonomy.' },
            { name: 'Wayve GAIA-2 (arxiv 2503.20523)', url: 'https://wayve.ai/thinking/gaia-2/', desc: 'Wayve UK driving world model — latent-diffusion multi-view. No canonical leaderboard table in paper; registered as model only. (Note: distinct from HF\'s GAIA Level-2 agent benchmark.)' },
            { name: 'OpenVLA-OFT (arxiv 2502.19645)', url: 'https://arxiv.org/abs/2502.19645', desc: 'OpenVLA fine-tuning paper with LIBERO suite breakdowns. π-zero-fast: LIBERO Spatial 96.4 / Object 96.8 / Goal 88.6 / Long 60.2. DiT-Policy strong: Spatial 84.2 / Object 96.3 / Goal 85.4 / Long 63.8.' },

            // 2026-05-15 — Science FM + Universal FM sweep
            { name: 'AlphaFold 3 (Nature 2024)', url: 'https://www.nature.com/articles/s41586-024-07487-w', desc: 'DeepMind biomolecular FM. PoseBusters v2 76% success (RMSD<2Å + PB-valid), +50% rel. accuracy improvement over Vina/RFAA on protein-ligand docking.' },
            { name: 'AlphaProteo (arxiv 2409.08022)', url: 'https://arxiv.org/abs/2409.08022', desc: 'DeepMind protein binder design FM. 88% experimental success rate on BHRF1; 3-300x tighter binding affinity vs prior best across 7-target panel.' },
            { name: 'Aurora weather FM (Nature 2025)', url: 'https://www.nature.com/articles/s41586-025-09005-y', desc: 'Microsoft Aurora 1.3B param weather FM. Beats IFS on 92% of WeatherBench-2 variable/level/lead-time targets. 24% RMSE reduction at >12h lead time. 5000x compute speedup vs IFS.' },
            { name: 'TxGemma (arxiv 2504.06196)', url: 'https://arxiv.org/abs/2504.06196', desc: 'Google therapeutics FM. TDC 66-task suite: 64/66 ≥ Tx-LLM baseline, 50/66 ≥ specialist. TxGemma Agentic-Tx: +52.3% rel. over o3-mini-high on HLE chem/bio, +26.7% on GPQA-Chemistry.' },
            { name: 'Evo 2 (arxiv 2502.13778, Arc Institute)', url: 'https://arxiv.org/abs/2502.13778', desc: 'Arc Institute 7B+40B DNA-RNA-protein FM. Nature 2025. Trained on full tree of life. Benchmarks: ClinVar pathogenicity, BRCA1 SGE Spearman, GUE-28.' },
            { name: 'ESM-3 (EvolutionaryScale 2024)', url: 'https://www.evolutionaryscale.ai/blog/esm3-release', desc: 'EvolutionaryScale (Meta spinout) generative protein FM. ESMGFP generated novel GFP with only 58% sequence similarity to closest natural homolog.' },
            { name: 'MatBench Discovery (Materials Project)', url: 'https://matbench-discovery.materialsproject.org/', desc: 'Materials Project leaderboard for crystal stability prediction. OAM track top: EquiformerV3+DeNS-OAM 0.931 F1 / 0.018 eV/atom MAE; PET-OAM-XL 0.924; eSEN-30M-OAM 0.925; Orb v3 0.905.' },
            { name: 'Open Catalyst (OC20/OC22) Leaderboard', url: 'https://opencatalystproject.org/leaderboard.html', desc: 'OC20 S2EF (Structure to Energy and Forces) catalyst benchmark. EquiformerV2-153M: force MAE 14.2 meV/Å, energy MAE 15.0 meV.' },
            { name: 'AA Text-to-Image Arena Leaderboard', url: 'https://artificialanalysis.ai/image/leaderboard/text-to-image', desc: 'Artificial Analysis head-to-head image gen arena. Top: OpenAI GPT Image 2 1336 Elo / GPT Image 1.5 1268 / Google Nano Banana 2 1263 / Nano Banana Pro 1219 / ByteDance Seedream 4.0 1197 / HiDream-O1 1187 (open-weights leader) / FLUX.2 dev Turbo 1161 / FLUX.2 dev 1159.' },
            { name: 'AA Text-to-Video Arena Leaderboard', url: 'https://artificialanalysis.ai/video/leaderboard/text-to-video', desc: 'AA T2V arena (with audio). Top: ByteDance Dreamina Seedance 2.0 720p 1222 Elo / Alibaba HappyHorse 1.0 1214 / Kling 3.0 Omni 1080p Pro 1105 / Veo 3.1 1102 / Sora 2 (December) 1087 / Vidu Q3 Pro 1086 / LTX-2.3 Fast 979 (top open-weights).' },
            { name: 'TimesFM 2.0 / 2.5 (Google)', url: 'https://github.com/google-research/timesfm', desc: 'Google time-series FM. v2.0 (Jan 2025) +6% MASE vs next best on GIFT-Eval. v2.5 (Sep 2025) zero-shot rank #1.' },
            { name: 'Moirai 2.0 (Salesforce)', url: 'https://www.salesforce.com/blog/moirai-2-0/', desc: 'Salesforce time-series FM v2 (Sep 2025). GIFT-Eval rank #1 among non-leaking pretrained models.' },
            { name: 'Suno V5 (music gen)', url: 'https://suno.com/blog/v5-5', desc: 'Suno music generation V5. Side-by-side Elo 1293 — AI music leader.' },

            // 2026-05-15 — User-provided refs: SDE + HAL + The Well
            { name: 'SDE — Scientific Discovery Evaluation (arxiv 2512.15567)', url: 'https://arxiv.org/abs/2512.15567', desc: 'Deep Principle + 35 academic groups (May 8 2026) — scenario-grounded scientific discovery benchmark. 4 domains (Biology 200q / Chemistry 276q / Materials 486q / Physics 163q) × 43 scenarios × 1,125 questions, plus SDE-hard (86 hardest) + sde-harness (8 project-level optimization loops). SDE-avg top: GPT-5 0.658 / Sonnet 4.5 0.637 / o3 0.627. SDE-hard top: GPT-5-Pro 22.4% (only frontier ≥20%; all others ≤12%). Project leaders rotate: DeepSeek R1 protein design 0.871 / Sonnet 4.5 molecule-opt 0.756 / GPT-5 crystal design 0.632 / R1 Ising model 1.000 (=GT).' },
            { name: 'Princeton HAL — Holistic Agent Leaderboard (arxiv 2510.11977)', url: 'https://hal.cs.princeton.edu/', desc: 'Kapoor + Stroebl + Narayanan et al. (Princeton PLI, Oct 2025, ICLR 2026) — unified evaluation framework wrapping 9 existing agent benchmarks (Online Mind2Web / AssistantBench / GAIA / CORE-Bench Hard / ScienceAgentBench / SciCode / SWE-bench Verified Mini / USACO / TAU-bench Airline). Adds: Azure VM orchestration, LiteLLM cost tracking, Pareto frontiers, Docent log analysis. Live leaderboard top: Claude Opus 4.5 77.78% CORE-Bench Hard / Sonnet 4.5 74.55% GAIA / GPT-5 Medium 69.71% USACO. Key insight: higher reasoning effort REDUCES accuracy in 21/36 model-bench combos.' },
            { name: 'The Well (PolymathicAI dataset)', url: 'https://github.com/PolymathicAI/the_well', desc: 'Polymathic AI (Simons Foundation) — 15TB of physics-simulation training data across 16 datasets. Primarily a TRAINING dataset for physics-ML foundation models (FNO/CNO/MPP/Stable-Sci), not a frontier-LLM eval suite. Paper authors note baseline results "should not be considered state-of-the-art". NeurIPS 2024 D&B (arxiv 2412.00568). Skipped from SOTA frontier dashboard.' },

            // 2026-05-15 — Arxiv PDF mine batch (May 11-13 papers)
            { name: 'ExploitBench (arxiv 2605.14153)', url: 'https://arxiv.org/abs/2605.14153', desc: 'CMU Lee & Brumley (May 13 2026) — capability ladder bench for LLM cybersec agents. 41 V8 N-day bugs, 5-tier ladder (T5 Coverage → T4 Triggering → T3 Engine → T2 General → pc_control → ACE). HEADLINE: Mythos Preview (private Anthropic) achieves ACE on 18/41 bugs (43.9%). All 8 public frontiers (Opus 4.7, Sonnet 4.6, GPT-5.5, Gemini 3.1 Pro, etc.) score 0/41 ACE bare-arm; GPT-5.5 Codex CLI raises to 1/41.' },
            { name: 'GeoBuildBench (arxiv 2605.13167)', url: 'https://arxiv.org/abs/2605.13167', desc: 'Peking University (May 13 2026) — interactive Chinese geometry construction from natural language via DSL execution. 489 problems. GPT-5.1 78.9% Success Rate / Gemini-3-Flash 75.3% / Qwen3-VL-235B 42.2% / Llama-3.2-90B-Vision 21.3%.' },
            { name: 'RealICU (arxiv 2605.13542)', url: 'https://arxiv.org/abs/2605.13542', desc: 'TUM+LMU+Oxford+Sheffield+Imperial (May 13 2026) — long-context ICU agent bench. RealICU-Gold 94 MIMIC-IV patients / 930 windows; RealICU-Scale 11,862 windows. GPT-5.4 0.510 Acute Problems Hit@5 best, Gemini-3.1-Pro 0.486, Qwen3-235B 0.384. Paper declares "remains unsolved" (Oracle annotator F1=0.987).' },
            { name: 'KnotBench (arxiv 2605.09900)', url: 'https://arxiv.org/abs/2605.09900', desc: 'NYU+USC Liu & Liu (May 11 2026) — diagrammatic knot reasoning for VLMs. 2,000 items × 14 tasks. Claude Opus 4.7+thinking 54.60% (best), GPT-5+thinking 52.25%, Claude Opus 4.7 51.65%, GPT-5 43.00%. Thinking-mode uplift: GPT-5 +9.25pt vs Claude +2.95pt.' },
            { name: 'DRAT (arxiv 2605.13450)', url: 'https://arxiv.org/abs/2605.13450', desc: 'UIUC (May 13 2026) — LLM creativity benchmarks. 7 tests (DAT/CDAT/CDAT-N/CDAT-A/PACE/RAT/DRAT) × 54 models × 10 vendors. DRAT top: GPT-5.4-nano 69.11 / Qwen3-235B 68.43 / Claude Opus 4.6 54.44. DAT top: GPT-5.4 91.72 / Claude Opus 4.6 89.70. RAT-30 tied #1: GPT-5-mini=GPT-4.1=Mistral-Large-2407 at 97/30.' },

            // 2026-05-14 — Deepfake / AIGC detection benchmark family (first DB coverage)
            { name: 'FaceForensics++ (arxiv 1901.08971)', url: 'https://kaldir.vc.in.tum.de/faceforensics_benchmark/', desc: 'Rössler et al ICCV 2019 — classic video deepfake bench, 4 manipulation types (DeepFakes / Face2Face / FaceSwap / NeuralTextures) × 1.8M images. Official leaderboard maintained at kaldir.vc.in.tum.de. Top: DirichletEnsemble 97.3% / Beijing ZKJ 94.1% / ZAntiFakeBio 94.0%. Paper: arxiv.org/abs/1901.08971' },
            { name: 'DFDC — Deepfake Detection Challenge (Meta, arxiv 2006.07397)', url: 'https://ai.meta.com/blog/deepfake-detection-challenge-results-an-open-initiative-to-advance-ai/', desc: 'Facebook/Meta Kaggle 2020 — 124k clips from 3,426 paid actors. Selim Seferbekov #1: log-loss 0.428, black-box AP 65.18%. Open-sourced winner ensemble.' },
            { name: 'Celeb-DF v2 (arxiv 1909.12962)', url: 'https://arxiv.org/abs/1909.12962', desc: 'Li et al CVPR 2020 — 5,639 high-quality DeepFake videos of celebrities. Cross-dataset hard test target. SPSL 76.5% AUC best.' },
            { name: 'DeepfakeBench (NeurIPS 2023, arxiv 2307.01426)', url: 'https://github.com/SCLBD/DeepfakeBench', desc: 'Yan et al — umbrella benchmark unifying 9 deepfake datasets × 15+ detectors. Within-domain FF++_c23 AUC: UCF 0.9705 / Xception 0.9637 / RECCE 0.9621 / SPSL 0.9610 / EfficientNet-B4 0.9567. Cross-dataset Celeb-DF v2 AUC drops to 0.73-0.77. Single-citation unlocks comprehensive deepfake coverage.' },
            { name: 'DF40 (NeurIPS 2024, arxiv 2406.13495)', url: 'https://github.com/YZY-stack/DF40', desc: 'Yan et al — next-gen deepfake bench with 40 manipulation methods (10 face-swap / 13 reenactment / 12 face-synthesis / 5 editing). CLIP-Large 0.746 best (non-face AIGC) / SBI 0.734 / Xception baseline 0.535.' },
            { name: 'AV-Deepfake1M (ACM MM 2024 Best Paper, arxiv 2311.15308)', url: 'https://github.com/ControlNet/AV-Deepfake1M', desc: 'Cai et al — 1M+ audio-visual deepfake videos, 2,000+ subjects, content-driven LLM-edited manipulations. Temporal-localization AP@0.5: Pindrop Labs (Challenge winner) 77.94 / UMMAFormer 51.64 / BA-TFD+ 44.42.' },
            { name: 'ASVspoof 5 — Audio Spoofing (arxiv 2408.08739)', url: 'https://www.asvspoof.org/', desc: 'Wang et al 2024 — speech deepfake detection challenge. Track 1 closed condition #1: T32 min-DCF 0.2436 / EER 8.61%. Open condition: T45 min-DCF 0.075 / EER 2.59%. SZU-AFS strong: min-DCF 0.115 / EER 4.04%.' },
            { name: 'GenImage (NeurIPS 2023, arxiv 2306.08571)', url: 'https://github.com/GenImage-Dataset/GenImage', desc: 'Zhu et al — AI-generated image detection, ~1M images across 8 generators (Midjourney/SDv1.4/SDv1.5/ADM/GLIDE/Wukong/VQDM/BigGAN). Swin-T 74.8% avg / ResNet-50 72.1% / CNNSpot 64.2%.' },
            { name: 'DIRE / DiffusionForensics (ICCV 2023, arxiv 2303.09295)', url: 'https://github.com/ZhendongWang6/DIRE', desc: 'Wang et al — diffusion-generated image detection via Diffusion Reconstruction Error. DIRE ACC 99.9% / AP 100% avg cross-diffusion (near-saturated).' },
            { name: 'Deepfake-Eval-2024 (arxiv 2503.02857)', url: 'https://huggingface.co/datasets/nuriachandra/Deepfake-Eval-2024', desc: 'Chandra et al 2025 — first in-the-wild 2024 deepfake bench. 45 hours video / 56.5 hours audio / 1,975 images from 88 sites in 52 languages. Reveals 45-50% AUC drop vs academic benchmarks. Best open-source: GenConViT video 0.63 AUC / P3 audio 0.58 / UFD image 0.56. Commercial detectors (anonymized): video 0.79 / audio 0.93 / image 0.90.' },
            { name: 'VLM Deepfake Detection (arxiv 2506.10474)', url: 'https://arxiv.org/abs/2506.10474', desc: 'Zero-shot frontier VLM deepfake detection. GPT-4o 0.77/0.67 (faceswap+reenactment / synthetic) best. Claude Sonnet 4 0.30/0.60. Gemini 2.5 Flash 0.10/0.27. Grok 3 0.00/0.27. Title: "LLMs Are Not Yet Ready for Deepfake Image Detection".' },

            // 2026-05-14 — Arxiv sweep batch (11 new benchmark papers May 1-14)
            { name: 'TableVista (arxiv 2605.05955)', url: 'https://arxiv.org/abs/2605.05955', desc: 'Tongji/Bristol/Tianjin/Yale (May 7 2026) — multimodal table reasoning bench, 30,000 samples × 10 visual variants × 8 difficulty buckets. 29 models evaluated. GPT-5.4 72.1% avg leads; long tail of open VLMs to LLaVA-v1.5-7B 5.7%.' },
            { name: 'XL-SafetyBench (arxiv 2605.05662)', url: 'https://arxiv.org/abs/2605.05662', desc: 'AIM Intelligence + Korea AISI + Microsoft + 7 institutions (May 7 2026) — 10-country cross-cultural safety bench (AE/DE/ES/FR/ID/IN/JP/KR/TR/US). Frontier models + country-specific local models. Claude-Sonnet-4.5 2.8% ASR (safest) vs Mistral-Large-3 98.8% (least safe).' },
            { name: 'GR-Ben (arxiv 2605.01203)', url: 'https://arxiv.org/abs/2605.01203', desc: 'General Reasoning Bench for process reward models — science (Bio/Phys/Chem/CompSci) + logic (Abduct/Analogical/Mix/Deduct/Induct), 22 models tested. Gemini-3-Flash 60.5% / DeepSeek-V3.2 55.4% / Kimi-K2 49.1% / GPT-5.2 47.0%.' },
            { name: 'SWE-Atlas (arxiv 2605.08366)', url: 'https://arxiv.org/abs/2605.08366', desc: 'Coding agent bench beyond issue resolution — 3 SWE workflows (Codebase Q&A 124 + Test Writing 90 + Refactoring 70). GPT-5.4 Codex 43.49% leads, Claude Opus 4.7 Claude Code 41.89%, Gemini 3.1 Pro 25.23%.' },
            { name: 'ComplexMCP (arxiv 2605.10787)', url: 'https://arxiv.org/abs/2605.10787', desc: 'MCP agent eval — 300+ tools across 7 stateful sandboxes, 16 LLMs + human reference. Gemini-3-Flash 55.31% SR best LLM; GLM-4.7 42.55%; Claude-Opus-4 41.84%; Human 93.61% (gap ~38pp to best LLM).' },
            { name: 'MCJudgeBench (arxiv 2605.03858)', url: 'https://arxiv.org/abs/2605.03858', desc: 'Multi-constraint judge eval — CJAR + Macro-F1 over LLMs as judges. Gemini 3.1 Pro CJAR 0.858 (best), Claude Sonnet 4.6 Macro-F1 0.637 (best on F1).' },
            { name: 'VURB (arxiv 2605.07872)', url: 'https://arxiv.org/abs/2605.07872', desc: 'Video Understanding Reward Bench — 2,100 video preference pairs with long CoT (~1,143 tokens avg). GPT-5.2 62.9% pairwise (best LLM); VideoDRM 63.8% pointwise.' },
            { name: 'Agentick (arxiv 2605.06869)', url: 'https://arxiv.org/abs/2605.06869', desc: 'Castanyer/Castro/Berseth (May 7 2026) — unified sequential decision-making agent bench, 37 procedurally generated tasks × 6 categories × 4 difficulties × 5 modalities, 90k+ episodes. GPT-5 mini 0.309 ONS (best LLM, barely beats PPO 2M 0.287).' },
            { name: 'ProgramBench (arxiv 2605.03546)', url: 'https://arxiv.org/abs/2605.03546', desc: 'John Yang / Diyi Yang / Ofir Press et al — full-program rebuild from scratch. All 9 frontier models score 0% Resolved; Claude Opus 4.7 leads "Almost" at 3.0% (≥95% tests passing). Useful as a "wall" benchmark.' },
            { name: 'TriBench-Ko (arxiv 2605.03792)', url: 'https://arxiv.org/abs/2605.03792', desc: 'Korean judicial-workflow risk bench, 4 tasks × 8 risk types × 13 models. GPT-5.4 0.835 Macro-F1; KT Mi:dm 2.0-base 0.728 (best Korean sovereign); EXAONE-3.5-7.8B 0.551; SKT A.X-3.1-Light 0.342.' },
            { name: 'FinSafetyBench (arxiv 2605.00706)', url: 'https://arxiv.org/abs/2605.00706', desc: 'Bilingual EN/ZH financial-domain LLM red-teaming bench, 1,881 instances × 14 sub-categories. 8 models tested. Frontier GPT-5.1 35.27% ASR vs DeepSeek-V3.2 89.45% ASR (Financial-Crimes domain).' },
            { name: 'Baidu ERNIE 5.1 release blog', url: 'https://ernie.baidu.com/blog/posts/ernie-5.1-0508-release/', desc: 'Baidu ERNIE 5.1 (May 9 2026) — total params ~1/3 of ERNIE 5.0, trained at ~6% the cost. AIME 2026 99.6% (with tool use); LMArena Search Arena Elo 1223 (4th global, 1st Chinese). Claims to surpass DeepSeek V4 Pro on τ³-bench and SpreadsheetBench-Verified.' },
            { name: 'AI2 MolmoAct 2 release', url: 'https://allenai.org/blog/molmoact2', desc: 'Allen AI MolmoAct 2 (May 5 2026) — open-source bimanual robot foundation model + largest open two-arm tabletop dataset. Real-world manipulation avg 0.51 success vs OpenVLA-OFT 0.36 / π0.5 0.32 / Cosmos Policy 0.16. Up to 37× faster than predecessor.' },

            // 2026-05-13 — Batch 2 ref links (user-provided 6 URLs)
            { name: 'AI Co-Mathematician (arxiv 2605.06651)', url: 'https://arxiv.org/abs/2605.06651', desc: 'Daniel Zheng et al (DeepMind, May 7 2026) — "AI Co-Mathematician: Accelerating Mathematicians with Agentic AI". Interactive workbench for mathematicians (ideation, lit search, computational exploration, theorem proving, theory building). Achieves 48% on FrontierMath Tier 4 (SOTA).' },
            { name: 'OneManCompany (OMC) — arxiv 2604.22446', url: 'https://arxiv.org/abs/2604.22446', desc: 'Yu et al (April 24 2026) — heterogeneous agent organization framework as a real-world company. Full PRDBench leaderboard mined from Table 2: OMC 84.67% (multi-agent) tops 12 baselines. Top minimal-agent: Claude-4.5 69.19, GPT-5.2 62.49, Qwen3-Coder 43.84, DeepSeek-V3.2 40.11, GLM-4.7 38.39, Gemini-3-Pro 22.76, Kimi-K2 20.52, Minimax-M2 17.60. Commercial: CodeX 62.09, Claude Code 56.65, Qwen Code 39.91, Gemini CLI 11.29.' },
            { name: 'Artificial Analysis Speech-to-Speech leaderboard', url: 'https://artificialanalysis.ai/speech-to-speech', desc: 'AA speech-to-speech evaluation suite. 3 benchmarks: Big Bench Audio (1,000 audio questions adapted from Big Bench Hard), Full Duplex Bench (pause/turn-taking/interruption handling), τ-Voice (Airline/Retail/Telecom customer service scenarios). 6 models tracked: Step-Audio R1.1, Grok Voice Think Fast, GPT-Realtime-2 (High+Minimal), Gemini 3.1 Flash Live, Qwen3.5 Omni Plus.' },
            { name: 'Agent-World (arxiv 2604.18292)', url: 'https://arxiv.org/abs/2604.18292', desc: 'Dong et al (April 20 2026) — Scaling Real-World Environment Synthesis for general agent intelligence. 23 challenging agent benchmarks tested. Agent-World 8B/14B (Qwen3 base + continuous self-evolution RL) competes with proprietary frontiers. Full Table 1 (13 models × MCP-Mark + BFCL-V4 + τ²-Bench) and Table 2 (self-evolution rounds) extracted from PDF. tau2-Bench Avg leaders: Gemini-3-Pro 85.4 / Claude-Sonnet-4.5 84.7 / Seed-2.0 83.0 / GPT-5.2-High 80.2. mcpmark Avg: Seed-2.0 54.7 / GPT-5.2 53.1 / Gemini-3-Pro 50.8. Body-text adds SkillsBench/ARC-AGI-2/Claw-Eval triples for AW-8B/14B.' },
            { name: 'Recursive Multi-Agent Systems (arxiv 2604.25917)', url: 'https://arxiv.org/abs/2604.25917', desc: 'Yang et al (April 28 2026) — Recursive multi-agent framework across 9 benchmarks (math/science/medicine/search/code). Aggregate gains: +8.3% accuracy, 1.2-2.4x speedup, 34.6-75.6% token reduction. Project: recursivemas.github.io. (Specific per-model-per-benchmark numbers not extracted.)' },
            { name: 'Epoch FrontierMath Tiers 1-4', url: 'https://epoch.ai/frontiermath/tiers-1-4', desc: 'FrontierMath official leaderboard page. Difficulty Tiers 1-3 (undergrad through early postdoc) + Tier 4 (research-level math). Note: Page mentions "AI-assisted review flagged fatal errors in about a third of problems" — scores under revision. JS-rendered table not directly extractable; see arxiv 2511.04338 paper for baseline numbers.' },

            // NVIDIA Nemotron Labs Elastic family (3-in-1 nested 30B/23B/12B; Mamba+Transformer MoE)
            { name: 'NVIDIA Nemotron Labs Elastic 30B (BF16)', url: 'https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-BF16', desc: 'NVIDIA Nemotron Labs 3 Elastic — 3-in-1 nested checkpoint (30B/23B/12B in single 58.9 GB BF16 file via zero-shot slicing). Hybrid Mamba-2 + Transformer MoE, 3.6B/2.8B/2.0B active params. AIME-2025 88.54 / GPQA 72.10 / LiveCodeBench v5 72.70 / MMLU-Pro 78.63 / IFBench 73.96. Released 2026-05-07.' },
            { name: 'NVIDIA Nemotron Elastic 30B FP8', url: 'https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-FP8', desc: 'FP8 quantization of Elastic 30B — 98.69% accuracy recovery on 30B variant via per-tensor weight_scale. Same nested 30B/23B/12B slicing.' },
            { name: 'NVIDIA Nemotron Elastic 30B NVFP4', url: 'https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-NVFP4', desc: 'NVFP4 (4-bit) quantization via Quantization-Aware Distillation from BF16 teacher. 97.79% accuracy recovery on 30B; preserves nested weight-sharing.' },
            { name: 'Star Elastic ICML 2026 paper', url: 'https://arxiv.org/abs/2511.16664', desc: 'Star Elastic — "Many-in-One Reasoning LLMs with Efficient Budget Control" (ICML 2026). Elastic post-training framework: ~160B tokens (0.6% of parent\'s 25T pretraining) produces 3-in-1 nested checkpoint with 1.8x/2.4x throughput at 23B/12B vs 30B baseline.' },

            // OpenAI Voice / Realtime models (May 2026 release)
            { name: 'OpenAI — Advancing Voice Intelligence (May 2026)', url: 'https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/', desc: 'OpenAI Realtime API trio (May 7 2026): GPT-Realtime-2 (GPT-5-class reasoning, $32/1M audio in / $64 audio out), GPT-Realtime-Translate ($0.034/min real-time translation), GPT-Realtime-Whisper ($0.017/min streaming STT). GPT-Realtime-2 high: Big Bench Audio 96.6 (vs 1.5 baseline 81.4) / Audio MultiChallenge 48.5 (vs 34.7).' },

            // Luma Labs UNI-1 (multimodal image generation FM)
            { name: 'Luma Labs UNI-1', url: 'https://lumalabs.ai/uni-1', desc: 'Luma multimodal image-generation foundation model (May 2026). Text-to-image, multi-reference, image editing, common-sense scene completion, culture-aware aesthetics. Token-based pricing ($0.50/1M text in, $45.45/1M image out). Human-preference Elo: #1 Style/Editing + #1 Reference-Based, #2 Text-to-Image. Quantitative benchmarks not yet published.' },

            // MolmoAct2 / MolmoER (Allen AI VLA + embodied reasoning)
            { name: 'MolmoAct2 / MolmoER paper', url: 'https://arxiv.org/abs/2605.02881', desc: 'Allen AI MolmoAct2 — open Vision-Language-Action model for real-world deployment. MolmoER specialized VLM backbone (claims to surpass GPT-5 + Gemini Robotics ER-1.5 on 13 embodied-reasoning benchmarks). 7 sim+real benchmarks, MolmoAct2-BimanualYAM (720 hr teleoperated trajectories — largest open bimanual dataset to date), OpenFAST action tokenizer, MolmoThink adaptive-depth reasoning.' }
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
            var type = c.type || 'Other';
            if (!groups[type]) groups[type] = [];
            groups[type].push(c);
        });

        // Sort each group by date descending (newest first)
        Object.keys(groups).forEach(function(t) {
            groups[t].sort(function(a, b) {
                return (b.date || '').localeCompare(a.date || '');
            });
        });

        // Type order — known types first, then any unknown types alphabetically
        var typeOrder = ['Deploy', 'Feature', 'Data', 'Fix', 'Bugfix', 'Docs', 'Correction',
                         'PDF Analysis', 'Web Collection', 'Data Collection', 'Reference', 'SOTA'];
        var typeColors = {
            'Deploy': 'bg-green-900 text-green-300',
            'Feature': 'bg-blue-900 text-blue-300',
            'Data': 'bg-cyan-900 text-cyan-300',
            'Fix': 'bg-orange-900 text-orange-300',
            'Bugfix': 'bg-orange-900 text-orange-300',
            'Docs': 'bg-slate-700 text-slate-300',
            'Correction': 'bg-red-900 text-red-300',
            'PDF Analysis': 'bg-purple-900 text-purple-300',
            'Web Collection': 'bg-yellow-900 text-yellow-300',
            'Data Collection': 'bg-gray-700 text-gray-300',
            'Reference': 'bg-indigo-900 text-indigo-300',
            'SOTA': 'bg-emerald-900 text-emerald-300',
            'Other': 'bg-gray-800 text-gray-400'
        };

        // Auto-append any types not in typeOrder (e.g. future-added types)
        Object.keys(groups).forEach(function(t) {
            if (typeOrder.indexOf(t) === -1) typeOrder.push(t);
        });

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

App.loadEnrichment = function () {
    if (App.data.enrichment !== null) return Promise.resolve(App.data.enrichment);
    if (App._enrichmentPromise) return App._enrichmentPromise;
    App._enrichmentPromise = fetch('data/model_enrichment.json')
        .then(function (r) { return r.ok ? r.json() : { models: {} }; })
        .then(function (d) {
            App.data.enrichment = d.models || {};
            return App.data.enrichment;
        })
        .catch(function () {
            console.warn('[modal] model_enrichment.json not loadable; architecture sections hidden');
            App.data.enrichment = {};
            return App.data.enrichment;
        });
    return App._enrichmentPromise;
};

App.loadHFMetadata = function () {
    if (App.data.hfMetadata !== undefined && App.data.hfMetadata !== null) {
        return Promise.resolve(App.data.hfMetadata);
    }
    if (App._hfMetadataPromise) return App._hfMetadataPromise;
    App._hfMetadataPromise = fetch('data/hf_metadata.json')
        .then(function (r) { return r.ok ? r.json() : { models: {} }; })
        .then(function (d) {
            App.data.hfMetadata = d.models || {};
            return App.data.hfMetadata;
        })
        .catch(function () {
            console.warn('[modal] hf_metadata.json not loadable');
            App.data.hfMetadata = {};
            return App.data.hfMetadata;
        });
    return App._hfMetadataPromise;
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
