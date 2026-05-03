/**
 * Command palette — global Cmd+K / Ctrl+K search for models, benchmarks, vendors.
 * Lazy: builds search index on first open.
 */
(function (root) {
    'use strict';

    var CommandPalette = {
        _index: null,
        _isOpen: false,

        _fuzzyMatch: function(query, target) {
            // Returns score 0 if no match, higher = better match.
            // Token-based: each query word must appear in target. Bonus for prefix match.
            if (!query) return 1;
            var qLower = query.toLowerCase().trim();
            var tLower = target.toLowerCase();
            if (!qLower) return 1;
            // Quick exact substring
            var subIdx = tLower.indexOf(qLower);
            if (subIdx === 0) return 100; // prefix
            if (subIdx > 0) return 50; // substring
            // Token mode: split on space + slash + dash + dot
            var tokens = qLower.split(/[\s\/\-\._]+/).filter(function(t) { return t.length > 0; });
            if (tokens.length < 2) return 0; // didn't match above and no tokens to split
            // All tokens must appear (in any order)
            var allMatch = tokens.every(function(t) { return tLower.indexOf(t) !== -1; });
            if (!allMatch) return 0;
            // Score = number of tokens × 10 (higher for more matched tokens)
            return tokens.length * 10;
        },

        init: function() {
            var self = this;
            // Global keydown for Cmd+K / Ctrl+K
            document.addEventListener('keydown', function(e) {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    self.open();
                }
                if (e.key === 'Escape' && self._isOpen) {
                    e.preventDefault();
                    self.close();
                }
            });
            // Wire the header hint button if present
            var hint = document.getElementById('cmdk-hint');
            if (hint) hint.addEventListener('click', function() { CommandPalette.open(); });
        },

        _buildIndex: function() {
            var entries = [];
            var seen = {};
            var models = (typeof App !== 'undefined' && App.data && App.data.models) || [];
            var benchmarks = (typeof App !== 'undefined' && App.data && App.data.benchmarks) || [];

            // Models
            models.forEach(function(m) {
                entries.push({
                    type: 'model',
                    id: m.id,
                    name: m.name || m.id,
                    detail: (m.vendor || '') + ' · ' + (m.type || ''),
                    search: ((m.name || '') + ' ' + m.id + ' ' + (m.vendor || '')).toLowerCase(),
                });
                if (m.vendor && !seen[m.vendor]) {
                    seen[m.vendor] = true;
                    var vendorModels = models.filter(function(mm) { return mm.vendor === m.vendor; });
                    entries.push({
                        type: 'vendor',
                        id: m.vendor,
                        name: m.vendor,
                        detail: vendorModels.length + ' models',
                        search: m.vendor.toLowerCase(),
                    });
                }
            });

            // Benchmarks
            benchmarks.forEach(function(b) {
                entries.push({
                    type: 'benchmark',
                    id: b.id,
                    name: b.name || b.id,
                    detail: (b.category || '') + ' benchmark',
                    search: ((b.name || '') + ' ' + b.id + ' ' + (b.category || '')).toLowerCase(),
                });
            });

            this._index = entries;
        },

        open: function() {
            if (this._isOpen) return;
            if (!this._index) this._buildIndex();

            var self = this;
            var overlay = document.createElement('div');
            overlay.id = 'cmdk-overlay';
            overlay.className = 'fixed inset-0 z-[60] bg-black/70 flex items-start justify-center pt-24';
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) self.close();
            });

            var panel = document.createElement('div');
            panel.className = 'bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-xl mx-4';
            overlay.appendChild(panel);

            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Search models, vendors, benchmarks…';
            input.className = 'w-full bg-transparent text-gray-100 px-4 py-3 border-b border-gray-700 focus:outline-none text-sm';
            panel.appendChild(input);

            var resultsList = document.createElement('div');
            resultsList.className = 'max-h-96 overflow-y-auto';
            panel.appendChild(resultsList);

            var hint = document.createElement('div');
            hint.className = 'px-4 py-2 text-xs text-gray-500 border-t border-gray-700';
            hint.textContent = '↑↓ navigate · Enter open · Esc close';
            panel.appendChild(hint);

            document.body.appendChild(overlay);
            this._isOpen = true;
            this._overlay = overlay;
            this._selectedIdx = 0;

            var typeColor = {
                model: 'text-blue-400',
                vendor: 'text-purple-400',
                benchmark: 'text-green-400',
            };
            var typeIcon = {
                model: '◆',
                vendor: '◉',
                benchmark: '▣',
            };

            function render(query) {
                resultsList.textContent = '';
                var q = (query || '').toLowerCase().trim();
                var results;
                if (!q) {
                    // Show recent / popular suggestions when empty
                    results = self._index.filter(function(e) { return e.type === 'model'; }).slice(0, 12);
                } else {
                    results = self._index.map(function(e) {
                        return { entry: e, score: self._fuzzyMatch(q, e.search) };
                    }).filter(function(x) {
                        return x.score > 0;
                    }).sort(function(a, b) {
                        if (b.score !== a.score) return b.score - a.score;
                        return a.entry.name.localeCompare(b.entry.name);
                    }).map(function(x) { return x.entry; });
                    results = results.slice(0, 30);
                }

                results.forEach(function(r, idx) {
                    var item = document.createElement('div');
                    item.className = 'flex items-center gap-3 px-4 py-2 cursor-pointer transition' +
                        (idx === self._selectedIdx ? ' bg-gray-800' : ' hover:bg-gray-800/50');
                    item._selectIdx = idx;

                    var icon = document.createElement('span');
                    icon.className = 'text-xs ' + (typeColor[r.type] || '');
                    icon.textContent = typeIcon[r.type] || '·';
                    item.appendChild(icon);

                    var nameEl = document.createElement('div');
                    nameEl.className = 'flex-1 min-w-0';
                    var nm = document.createElement('div');
                    nm.className = 'text-sm text-gray-200 truncate';
                    nm.textContent = r.name;
                    nameEl.appendChild(nm);
                    var dt = document.createElement('div');
                    dt.className = 'text-xs text-gray-500 truncate';
                    dt.textContent = r.detail;
                    nameEl.appendChild(dt);
                    item.appendChild(nameEl);

                    var typeBadge = document.createElement('span');
                    typeBadge.className = 'text-[10px] uppercase tracking-wider ' + (typeColor[r.type] || 'text-gray-500');
                    typeBadge.textContent = r.type;
                    item.appendChild(typeBadge);

                    item.addEventListener('click', function() { self._activate(r); });
                    item.addEventListener('mouseenter', function() {
                        self._selectedIdx = idx;
                        // Update visual selection
                        Array.prototype.forEach.call(resultsList.children, function(c) {
                            c.classList.remove('bg-gray-800');
                        });
                        item.classList.add('bg-gray-800');
                    });

                    resultsList.appendChild(item);
                });

                self._currentResults = results;
            }

            input.addEventListener('input', function() {
                self._selectedIdx = 0;
                render(input.value);
            });

            input.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (self._currentResults && self._selectedIdx < self._currentResults.length - 1) {
                        self._selectedIdx++;
                        render(input.value);
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (self._selectedIdx > 0) {
                        self._selectedIdx--;
                        render(input.value);
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (self._currentResults && self._currentResults[self._selectedIdx]) {
                        self._activate(self._currentResults[self._selectedIdx]);
                    }
                }
            });

            render('');
            input.focus();
        },

        close: function() {
            if (!this._isOpen) return;
            if (this._overlay && this._overlay.parentNode) {
                this._overlay.parentNode.removeChild(this._overlay);
            }
            this._isOpen = false;
            this._overlay = null;
        },

        _activate: function(entry) {
            this.close();
            if (entry.type === 'model' && typeof Modal !== 'undefined' && Modal.showModel) {
                Modal.showModel(entry.id);
            } else if (entry.type === 'vendor' && typeof Modal !== 'undefined' && Modal.showVendor) {
                Modal.showVendor(entry.id);
            } else if (entry.type === 'benchmark' && typeof Modal !== 'undefined' && Modal.showBenchmark) {
                Modal.showBenchmark(entry.id);
            }
        },
    };

    root.CommandPalette = CommandPalette;
    document.addEventListener('DOMContentLoaded', function() { CommandPalette.init(); });
})(typeof window !== 'undefined' ? window : this);
