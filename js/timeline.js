/**
 * Timeline tab — chronological model list with sort/filter.
 * Sort modes: date-desc / date-asc / vendor / country.
 */
var Timeline = {
    _models: [],
    _benchmarks: [],
    _scores: [],
    _enrichment: null,

    // Vendor prefix → country (flag + name). Derived from model_id prefix.
    VENDOR_TO_COUNTRY: {
        // 🇺🇸 USA
        'openai': '🇺🇸 USA',
        'anthropic': '🇺🇸 USA',
        'google': '🇺🇸 USA',
        'google-deepmind': '🇺🇸 USA',
        'xai': '🇺🇸 USA',
        'meta': '🇺🇸 USA',
        'microsoft': '🇺🇸 USA',
        'apple': '🇺🇸 USA',
        'ibm': '🇺🇸 USA',
        'databricks': '🇺🇸 USA',
        'nvidia': '🇺🇸 USA',
        'reka': '🇺🇸 USA',
        'inflection': '🇺🇸 USA',
        'character': '🇺🇸 USA',
        'perplexity': '🇺🇸 USA',
        'groq': '🇺🇸 USA',
        'together': '🇺🇸 USA',
        'salesforce': '🇺🇸 USA',
        'stanford': '🇺🇸 USA',
        'mit': '🇺🇸 USA',
        'allenai': '🇺🇸 USA',
        'openpipe': '🇺🇸 USA',
        'fireworks': '🇺🇸 USA',
        'snowflake': '🇺🇸 USA',
        'amazon': '🇺🇸 USA',
        'aws': '🇺🇸 USA',
        // 🇨🇦 Canada
        'cohere': '🇨🇦 Canada',
        'cohereai': '🇨🇦 Canada',
        'CohereLabs': '🇨🇦 Canada',
        // 🇫🇷 France
        'mistral': '🇫🇷 France',
        'mistralai': '🇫🇷 France',
        'kyutai': '🇫🇷 France',
        // 🇰🇷 Korea
        'lg': '🇰🇷 Korea',
        'lgai-exaone': '🇰🇷 Korea',
        'skt': '🇰🇷 Korea',
        'naver': '🇰🇷 Korea',
        'naver-hyperclovax': '🇰🇷 Korea',
        'kakao': '🇰🇷 Korea',
        'kakaocorp': '🇰🇷 Korea',
        'kt': '🇰🇷 Korea',
        'k-intelligence': '🇰🇷 Korea',
        'ncsoft': '🇰🇷 Korea',
        'NCSOFT': '🇰🇷 Korea',
        'samsung': '🇰🇷 Korea',
        'upstage': '🇰🇷 Korea',
        'trillionlabs': '🇰🇷 Korea',
        '42dot': '🇰🇷 Korea',
        'motif': '🇰🇷 Korea',
        'snuh': '🇰🇷 Korea',
        'snuh-naver': '🇰🇷 Korea',
        'kaist': '🇰🇷 Korea',
        'krafton': '🇰🇷 Korea',
        'kanana': '🇰🇷 Korea',
        // 🇨🇳 China
        'deepseek': '🇨🇳 China',
        'deepseek-ai': '🇨🇳 China',
        'moonshot': '🇨🇳 China',
        'moonshotai': '🇨🇳 China',
        'zhipu': '🇨🇳 China',
        'zai-org': '🇨🇳 China',
        'alibaba': '🇨🇳 China',
        'qwen': '🇨🇳 China',
        'tencent': '🇨🇳 China',
        'baidu': '🇨🇳 China',
        'xiaomi': '🇨🇳 China',
        'mimo': '🇨🇳 China',
        'bytedance': '🇨🇳 China',
        'stepfun': '🇨🇳 China',
        'minimax': '🇨🇳 China',
        'inclusionai': '🇨🇳 China',
        'yi': '🇨🇳 China',
        '01-ai': '🇨🇳 China',
        'baichuan': '🇨🇳 China',
        'internlm': '🇨🇳 China',
        'shanghai-ai-lab': '🇨🇳 China',
        'thudm': '🇨🇳 China',
        'thu-coai': '🇨🇳 China',
        'chatglm': '🇨🇳 China',
        'freedomintelligence': '🇨🇳 China',
        'scutcyr': '🇨🇳 China',
        'openi-cn': '🇨🇳 China',
        'magic-ai4med': '🇨🇳 China',
        // 🇷🇺 Russia
        'sber': '🇷🇺 Russia',
        'ai-sage': '🇷🇺 Russia',
        'yandex': '🇷🇺 Russia',
        't-tech': '🇷🇺 Russia',
        // 🇮🇱 Israel
        'dicta': '🇮🇱 Israel',
        'dicta-il': '🇮🇱 Israel',
        'ai21': '🇮🇱 Israel',
        'ai21labs': '🇮🇱 Israel',
        // 🇦🇪 UAE
        'tii': '🇦🇪 UAE',
        'tiiuae': '🇦🇪 UAE',
        'falcon-llm': '🇦🇪 UAE',
        'inceptionai': '🇦🇪 UAE',
        'mbzuai': '🇦🇪 UAE',
        'mbzuai-oryx': '🇦🇪 UAE',
        // 🇸🇦 Saudi Arabia
        'allam': '🇸🇦 Saudi Arabia',
        'allam-ai': '🇸🇦 Saudi Arabia',
        'humain-ai': '🇸🇦 Saudi Arabia',
        'sdaia': '🇸🇦 Saudi Arabia',
        // 🇸🇬 Singapore
        'aisingapore': '🇸🇬 Singapore',
        'ai-singapore': '🇸🇬 Singapore',
        // 🇮🇳 India
        'sarvamai': '🇮🇳 India',
        'krutrim-ai-labs': '🇮🇳 India',
        'ai4bharat': '🇮🇳 India',
        'hanoomanai': '🇮🇳 India',
        'ola-krutrim': '🇮🇳 India',
        // 🇯🇵 Japan
        'sbintuitions': '🇯🇵 Japan',
        'rinna': '🇯🇵 Japan',
        'sakanaai': '🇯🇵 Japan',
        'SakanaAI': '🇯🇵 Japan',
        'preferred-networks': '🇯🇵 Japan',
        // 🇩🇪 Germany
        'aleph-alpha': '🇩🇪 Germany',
        'Aleph-Alpha': '🇩🇪 Germany',
        // 🇬🇧 UK
        'stabilityai': '🇬🇧 UK',
        'stability': '🇬🇧 UK',
        // 🇨🇭 Switzerland
        'swiss-ai': '🇨🇭 Switzerland',
        // Others
        'bigscience': '🇪🇺 Europe',
        'eleutherai': '🇺🇸 USA',
        'huggingface': '🇫🇷 France',
        'h2o': '🇺🇸 USA',
    },

    init: function(allModels, allBenchmarks, scores) {
        this._models = allModels || [];
        this._benchmarks = allBenchmarks || [];
        this._scores = scores || [];
        this._enrichment = (typeof App !== 'undefined' && App.data && App.data.enrichment) || {};

        var self = this;

        // Lazy-load enrichment (might not be ready yet)
        if (typeof App !== 'undefined' && App.loadEnrichment) {
            App.loadEnrichment().then(function(map) {
                self._enrichment = map || {};
                if (!document.getElementById('tab-timeline').classList.contains('hidden')) {
                    self.render();
                }
            });
        }

        var sortSel = document.getElementById('timeline-sort');
        var vendorSel = document.getElementById('timeline-vendor-filter');
        var countrySel = document.getElementById('timeline-country-filter');
        var typeSel = document.getElementById('timeline-type-filter');
        var searchInput = document.getElementById('timeline-search');

        if (sortSel) sortSel.addEventListener('change', function() { self.render(); });
        if (vendorSel) vendorSel.addEventListener('change', function() { self.render(); });
        if (countrySel) countrySel.addEventListener('change', function() { self.render(); });
        if (typeSel) typeSel.addEventListener('change', function() { self.render(); });
        if (searchInput) searchInput.addEventListener('input', function() { self.render(); });

        this._populateFilters();
    },

    _getCountry: function(modelId, model) {
        if (!modelId) return null;
        var prefix = modelId.split('/')[0];
        // Try exact prefix match (case-sensitive) first
        if (this.VENDOR_TO_COUNTRY[prefix]) return this.VENDOR_TO_COUNTRY[prefix];
        // Try lowercase
        var lower = prefix.toLowerCase();
        if (this.VENDOR_TO_COUNTRY[lower]) return this.VENDOR_TO_COUNTRY[lower];
        return '🌐 Other';
    },

    _getReleaseDate: function(model) {
        if (!model) return null;
        if (model.release_date) return model.release_date;
        if (model.released_at) return model.released_at;
        var ent = this._enrichment[model.id];
        if (ent && ent.release_date_inferred) return ent.release_date_inferred;
        return null;
    },

    _populateFilters: function() {
        var vendorSel = document.getElementById('timeline-vendor-filter');
        var countrySel = document.getElementById('timeline-country-filter');

        if (vendorSel && vendorSel.options.length <= 1) {
            var vendors = {};
            this._models.forEach(function(m) {
                if (m.vendor) vendors[m.vendor] = true;
            });
            Object.keys(vendors).sort().forEach(function(v) {
                var opt = document.createElement('option');
                opt.value = v;
                opt.textContent = v;
                vendorSel.appendChild(opt);
            });
        }

        if (countrySel && countrySel.options.length <= 1) {
            var countries = {};
            var self = this;
            this._models.forEach(function(m) {
                var c = self._getCountry(m.id, m);
                if (c) countries[c] = true;
            });
            Object.keys(countries).sort().forEach(function(c) {
                var opt = document.createElement('option');
                opt.value = c;
                opt.textContent = c;
                countrySel.appendChild(opt);
            });
        }
    },

    render: function() {
        var container = document.getElementById('timeline-container');
        if (!container) return;
        container.textContent = '';

        var sortMode = (document.getElementById('timeline-sort') || {}).value || 'date-desc';
        var vendorFilter = (document.getElementById('timeline-vendor-filter') || {}).value || '';
        var countryFilter = (document.getElementById('timeline-country-filter') || {}).value || '';
        var typeFilter = (document.getElementById('timeline-type-filter') || {}).value || '';
        var searchQuery = ((document.getElementById('timeline-search') || {}).value || '').toLowerCase().trim();

        var self = this;

        // Build entries with date + country
        var entries = this._models
            .map(function(m) {
                var date = self._getReleaseDate(m);
                if (!date) return null;
                var country = self._getCountry(m.id, m);
                return {
                    id: m.id,
                    name: m.name || m.id,
                    vendor: m.vendor || '',
                    type: m.type || '',
                    modalities: m.modalities || [],
                    date: date,
                    country: country,
                    isInferred: !m.release_date && !m.released_at,
                    scoreCount: self._scores.filter(function(s) { return s.model_id === m.id; }).length,
                };
            })
            .filter(function(e) { return e !== null; });

        // Apply filters
        if (vendorFilter) entries = entries.filter(function(e) { return e.vendor === vendorFilter; });
        if (countryFilter) entries = entries.filter(function(e) { return e.country === countryFilter; });
        if (typeFilter) entries = entries.filter(function(e) { return e.type === typeFilter; });
        if (searchQuery) {
            entries = entries.filter(function(e) {
                return e.name.toLowerCase().indexOf(searchQuery) !== -1
                    || e.id.toLowerCase().indexOf(searchQuery) !== -1
                    || e.vendor.toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        // Sort
        if (sortMode === 'date-asc') {
            entries.sort(function(a, b) { return a.date.localeCompare(b.date); });
        } else if (sortMode === 'date-desc') {
            entries.sort(function(a, b) { return b.date.localeCompare(a.date); });
        } else if (sortMode === 'vendor') {
            entries.sort(function(a, b) {
                if (a.vendor !== b.vendor) return a.vendor.localeCompare(b.vendor);
                return b.date.localeCompare(a.date);
            });
        } else if (sortMode === 'country') {
            entries.sort(function(a, b) {
                if (a.country !== b.country) return a.country.localeCompare(b.country);
                return b.date.localeCompare(a.date);
            });
        }

        // Update count
        var countEl = document.getElementById('timeline-count');
        if (countEl) countEl.textContent = entries.length;

        if (entries.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-gray-500 text-sm p-8 text-center';
            empty.textContent = 'No models match the current filters.';
            container.appendChild(empty);
            return;
        }

        // Render with group headers when sorting by vendor or country
        var lastGroup = null;
        var grouped = (sortMode === 'vendor' || sortMode === 'country');

        // Also when sorted by date, group by year-month for visual grouping
        var lastYearMonth = null;

        entries.forEach(function(e) {
            // Group header
            if (grouped) {
                var groupKey = sortMode === 'vendor' ? e.vendor : e.country;
                if (groupKey !== lastGroup) {
                    var hdr = document.createElement('div');
                    hdr.className = 'mt-4 mb-1 text-xs text-gray-500 uppercase tracking-wider font-semibold sticky top-0 bg-gray-950 py-1';
                    var groupCount = entries.filter(function(x) {
                        return (sortMode === 'vendor' ? x.vendor : x.country) === groupKey;
                    }).length;
                    hdr.textContent = groupKey + ' (' + groupCount + ')';
                    container.appendChild(hdr);
                    lastGroup = groupKey;
                }
            } else {
                // Date sort: group by YYYY-MM for visual chunking
                var ym = e.date.slice(0, 7);
                if (ym !== lastYearMonth) {
                    var dhdr = document.createElement('div');
                    dhdr.className = 'mt-3 mb-1 text-xs text-gray-500 uppercase tracking-wider font-semibold sticky top-0 bg-gray-950 py-1';
                    dhdr.textContent = ym;
                    container.appendChild(dhdr);
                    lastYearMonth = ym;
                }
            }

            // Row
            var row = document.createElement('div');
            row.className = 'flex items-center gap-3 px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded cursor-pointer transition';
            row.addEventListener('click', (function(mid) {
                return function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(mid);
                };
            })(e.id));

            // Date column
            var dateCol = document.createElement('div');
            dateCol.className = 'text-xs text-gray-400 font-mono w-24 flex-shrink-0';
            dateCol.textContent = e.date.slice(0, 10);
            if (e.isInferred) {
                dateCol.className += ' italic';
                dateCol.title = 'Inferred from seed file (no explicit release_date)';
            }
            row.appendChild(dateCol);

            // Country column
            var countryCol = document.createElement('div');
            countryCol.className = 'text-xs text-gray-400 w-32 flex-shrink-0 truncate';
            countryCol.textContent = e.country;
            row.appendChild(countryCol);

            // Vendor + name (main)
            var nameCol = document.createElement('div');
            nameCol.className = 'flex-1 min-w-0';
            var nameLine = document.createElement('div');
            nameLine.className = 'text-sm text-blue-400 truncate font-semibold';
            nameLine.textContent = e.name;
            nameCol.appendChild(nameLine);
            var vendorLine = document.createElement('div');
            vendorLine.className = 'text-xs text-gray-500 truncate';
            vendorLine.textContent = e.vendor + (e.modalities.length ? ' · ' + e.modalities.join(', ') : '');
            nameCol.appendChild(vendorLine);
            row.appendChild(nameCol);

            // Type badge
            var typeBadge = document.createElement('span');
            typeBadge.className = 'inline-block px-2 py-0.5 rounded text-xs flex-shrink-0';
            if (e.type === 'proprietary') typeBadge.className += ' bg-red-900 text-red-300';
            else if (e.type === 'open-weight') typeBadge.className += ' bg-green-900 text-green-300';
            else if (e.type === 'open-source') typeBadge.className += ' bg-blue-900 text-blue-300';
            else typeBadge.className += ' bg-gray-700 text-gray-300';
            typeBadge.textContent = e.type || '?';
            row.appendChild(typeBadge);

            // Score count
            var scoreCol = document.createElement('div');
            scoreCol.className = 'text-xs text-gray-500 w-16 text-right flex-shrink-0';
            scoreCol.textContent = e.scoreCount + ' scores';
            row.appendChild(scoreCol);

            container.appendChild(row);
        });
    },
};
