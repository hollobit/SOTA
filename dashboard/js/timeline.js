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

        // Infographic controls
        var rangeSel = document.getElementById('timeline-infographic-range');
        var pngBtn = document.getElementById('timeline-download-png');
        var svgBtn = document.getElementById('timeline-download-svg');
        var csvBtn = document.getElementById('timeline-download-csv');
        if (rangeSel) rangeSel.addEventListener('change', function() { self._renderInfographic(); });
        if (pngBtn) pngBtn.addEventListener('click', function() { self._downloadInfographic('png'); });
        if (svgBtn) svgBtn.addEventListener('click', function() { self._downloadInfographic('svg'); });
        if (csvBtn) csvBtn.addEventListener('click', function() { self._downloadCSV(); });

        this._populateFilters();
    },

    // Color scheme: 12 distinct hues, one per month-of-year
    _MONTH_COLORS: [
        '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
        '#f97316', '#eab308', '#84cc16', '#22c55e',
        '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'
    ],

    _COUNTRY_COLORS: {
        '🇺🇸 USA': '#3b82f6',
        '🇨🇳 China': '#ef4444',
        '🇰🇷 Korea': '#a855f7',
        '🇫🇷 France': '#0ea5e9',
        '🇨🇦 Canada': '#dc2626',
        '🇯🇵 Japan': '#f43f5e',
        '🇮🇱 Israel': '#3aa6e8',
        '🇦🇪 UAE': '#10b981',
        '🇸🇦 Saudi Arabia': '#16a34a',
        '🇸🇬 Singapore': '#f87171',
        '🇮🇳 India': '#f59e0b',
        '🇩🇪 Germany': '#facc15',
        '🇬🇧 UK': '#1d4ed8',
        '🇨🇭 Switzerland': '#dc2626',
        '🇷🇺 Russia': '#ec4899',
        '🇪🇺 Europe': '#6366f1',
        '🌐 Other': '#6b7280'
    },

    _TYPE_COLORS: {
        'proprietary': '#ef4444',
        'open-weight': '#22c55e',
        'open-weights': '#22c55e',
        'open-source': '#3b82f6'
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
        // Use ONLY canonical release_date / released_at — not system registration date
        if (model.release_date) return model.release_date;
        if (model.released_at) return model.released_at;
        return null;
    },

    _getSystemRegisteredDate: function(model) {
        if (!model) return null;
        var ent = this._enrichment[model.id];
        if (ent && ent.system_registered_date) return ent.system_registered_date;
        // backwards compat — old name
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

    _getInfographicEntries: function(monthsBack) {
        var self = this;
        var now = new Date();
        var cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
        var entries = [];
        this._models.forEach(function(m) {
            var d = self._getReleaseDate(m);
            if (!d || d.length < 7) return;
            var dt = new Date(d.length >= 10 ? d.slice(0, 10) : d.slice(0, 7) + '-15');
            if (isNaN(dt.getTime()) || dt < cutoff || dt > now) return;
            entries.push({
                id: m.id,
                name: m.name || m.id,
                vendor: m.vendor || (m.id.split('/')[0] || ''),
                type: m.type || '',
                date: d,
                dt: dt,
                country: self._getCountry(m.id, m),
                ts: dt.getTime()
            });
        });
        return entries;
    },

    // Country flag extraction from "🇺🇸 USA" → "🇺🇸"
    _flagFromCountry: function(country) {
        if (!country) return '';
        var m = country.match(/^(\p{Extended_Pictographic}\p{Extended_Pictographic}?)/u);
        return m ? m[0] : (country.split(' ')[0] || '');
    },

    // First letter of vendor for the simple vector "logo" tile
    _vendorLogoLetter: function(vendor) {
        if (!vendor) return '?';
        var clean = vendor.replace(/\s*\(.*\)\s*$/, '').trim();
        return clean.charAt(0).toUpperCase();
    },

    // Stable colour per vendor for the logo tile (consistent across renders)
    _vendorTileColor: function(vendor) {
        var palette = ['#1d4ed8', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04',
            '#65a30d', '#16a34a', '#0d9488', '#0891b2', '#2563eb', '#4f46e5'];
        var h = this._hashCode(vendor || '');
        return palette[Math.abs(h) % palette.length];
    },

    _renderInfographic: function() {
        var host = document.getElementById('timeline-infographic-host');
        if (!host) return;
        var rangeSel = document.getElementById('timeline-infographic-range');
        var monthsBack = parseInt((rangeSel || {}).value || '6', 10);

        var entries = this._getInfographicEntries(monthsBack);

        while (host.firstChild) host.removeChild(host.firstChild);

        if (entries.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-gray-500 text-sm p-8 text-center';
            empty.textContent = 'No models with release dates in the selected range.';
            host.appendChild(empty);
            return;
        }

        // Build month columns (left = oldest, right = newest)
        var months = [];
        var now = new Date();
        for (var i = monthsBack - 1; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                ym: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
                year: d.getFullYear(),
                month: d.getMonth(),
                label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                color: this._MONTH_COLORS[d.getMonth()],
                entries: []
            });
        }
        // Bucket entries
        entries.forEach(function(e) {
            var ym = e.dt.getFullYear() + '-' + String(e.dt.getMonth() + 1).padStart(2, '0');
            months.forEach(function(col) {
                if (col.ym === ym) col.entries.push(e);
            });
        });
        // Sort within each month: ascending by date (top = earliest day, bottom = latest day)
        months.forEach(function(col) {
            col.entries.sort(function(a, b) { return a.ts - b.ts; });
        });

        // Dynamic layout: pick column width and card height so EVERY release fits.
        // Strategy:
        //   1. Column width scales up with the busiest month's release count
        //      (more cards in a column => need slightly wider so the model name
        //      doesn't truncate aggressively, and so multi-column busy months can
        //      split into card sub-columns inside one month).
        //   2. Card height stays at 84 if all months fit; otherwise we shrink down
        //      to a 60 minimum and split overflow into card sub-columns.
        //   3. SVG height grows beyond 1080 if needed — host has overflow-x:auto so
        //      tall infographics still look complete on download.
        var maxPerCol = 0;
        months.forEach(function(c) { if (c.entries.length > maxPerCol) maxPerCol = c.entries.length; });

        var PAD_TOP = 80;
        var PAD_LEFT = 60;
        var PAD_RIGHT = 60;
        var PAD_BOTTOM = 50;
        var COL_GAP = 20;
        var HEADER_H = 56;
        var CARD_GAP = 6;
        var INNER_COL_GAP = 8;

        // Decide how many sub-columns of cards per month column. We want enough
        // sub-columns that every card fits in a reasonable card height.
        // Target: card height between 60 and 84 px; SVG max height around 2400.
        var CARD_H_PREF = 84;
        var CARD_H_MIN = 64;
        var CARD_W_BASE = 280;  // sub-column card width
        var SUBCOL_GAP = 6;

        // Try card height = 84 first; reduce if SVG would exceed 2400 height.
        var SVG_W, SVG_H, COL_W, CARD_H, subColsPerMonth, CARD_AREA_TOP, CARD_AREA_H, TIMELINE_AXIS_Y;
        function computeLayout(cardH) {
            // total card sub-column rows we need given cardH
            var rowCapacity = function(maxCardsInCol) {
                // Per-card-stack height capacity at cardH
                return Math.max(1, Math.floor((MAX_AVAILABLE_H + CARD_GAP) / (cardH + CARD_GAP)));
            };
            // We bake SVG height to fit; choose subColsPerMonth so each sub-column has
            // <= ceil(maxPerCol / subCols) cards, and SVG height = headers + axis + that*cardH
            // Try increasing sub-cols until SVG height fits within 2400.
            for (var sc = 1; sc <= 4; sc++) {
                var perStack = Math.ceil(maxPerCol / sc);
                var stackH = perStack * (cardH + CARD_GAP) - CARD_GAP;
                var totalH = PAD_TOP + HEADER_H + 22 + 28 + stackH + PAD_BOTTOM;
                if (totalH <= 2400) {
                    return { subCols: sc, cardH: cardH, totalH: totalH, perStack: perStack };
                }
            }
            // Fall back to 4 subcolumns
            return { subCols: 4, cardH: cardH, totalH: PAD_TOP + HEADER_H + 22 + 28 + Math.ceil(maxPerCol / 4) * (cardH + CARD_GAP) - CARD_GAP + PAD_BOTTOM, perStack: Math.ceil(maxPerCol / 4) };
        }
        var MAX_AVAILABLE_H = 2400 - PAD_TOP - HEADER_H - 22 - 28 - PAD_BOTTOM;

        var layout = computeLayout(CARD_H_PREF);
        if (layout.totalH > 2200 && CARD_H_PREF > CARD_H_MIN) {
            layout = computeLayout(72);
        }
        if (layout.totalH > 2200) {
            layout = computeLayout(CARD_H_MIN);
        }

        subColsPerMonth = layout.subCols;
        CARD_H = layout.cardH;

        // Column width fits subColsPerMonth side-by-side card sub-columns
        COL_W = subColsPerMonth * CARD_W_BASE + (subColsPerMonth - 1) * SUBCOL_GAP;

        // SVG dims
        SVG_W = PAD_LEFT + months.length * COL_W + (months.length - 1) * COL_GAP + PAD_RIGHT;
        SVG_H = layout.totalH;
        TIMELINE_AXIS_Y = PAD_TOP + HEADER_H + 22;
        CARD_AREA_TOP = TIMELINE_AXIS_Y + 28;
        CARD_AREA_H = SVG_H - CARD_AREA_TOP - PAD_BOTTOM;

        var SVG_NS = 'http://www.w3.org/2000/svg';
        function el(tag, attrs, parent) {
            var node = document.createElementNS(SVG_NS, tag);
            if (attrs) Object.keys(attrs).forEach(function(k) { node.setAttribute(k, attrs[k]); });
            if (parent) parent.appendChild(node);
            return node;
        }

        var svg = el('svg', {
            xmlns: SVG_NS,
            viewBox: '0 0 ' + SVG_W + ' ' + SVG_H,
            width: '100%',
            height: '100%',
            preserveAspectRatio: 'xMidYMid meet'
        });
        // White background (download keeps it)
        el('rect', { x: 0, y: 0, width: SVG_W, height: SVG_H, fill: '#ffffff' }, svg);

        // Title
        var title = el('text', {
            x: SVG_W / 2,
            y: 44,
            'text-anchor': 'middle',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '24',
            'font-weight': '700',
            fill: '#0f172a'
        }, svg);
        title.textContent = 'AI Model Release Timeline · Last ' + monthsBack + ' Months';
        var subtitle = el('text', {
            x: SVG_W / 2,
            y: 68,
            'text-anchor': 'middle',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '13',
            fill: '#64748b'
        }, svg);
        subtitle.textContent = entries.length + ' verified releases · column = month · color = month band · sorted earliest → latest within column';

        // Main horizontal timeline axis
        el('line', {
            x1: PAD_LEFT,
            y1: TIMELINE_AXIS_Y,
            x2: SVG_W - PAD_RIGHT,
            y2: TIMELINE_AXIS_Y,
            stroke: '#cbd5e1',
            'stroke-width': '2'
        }, svg);

        var self = this;

        months.forEach(function(col, idx) {
            var colX = PAD_LEFT + idx * (COL_W + COL_GAP);
            var headerY = PAD_TOP;

            // Month header pill
            el('rect', {
                x: colX,
                y: headerY,
                width: COL_W,
                height: HEADER_H,
                rx: 8,
                fill: col.color,
                opacity: '0.95'
            }, svg);
            var hdrText = el('text', {
                x: colX + COL_W / 2,
                y: headerY + 24,
                'text-anchor': 'middle',
                'font-family': 'system-ui, -apple-system, sans-serif',
                'font-size': '17',
                'font-weight': '700',
                fill: '#ffffff'
            }, svg);
            hdrText.textContent = col.label;
            var hdrCount = el('text', {
                x: colX + COL_W / 2,
                y: headerY + 44,
                'text-anchor': 'middle',
                'font-family': 'system-ui, -apple-system, sans-serif',
                'font-size': '12',
                fill: '#ffffff',
                opacity: '0.85'
            }, svg);
            hdrCount.textContent = col.entries.length + ' release' + (col.entries.length === 1 ? '' : 's');

            // Column node on timeline axis
            el('circle', {
                cx: colX + COL_W / 2,
                cy: TIMELINE_AXIS_Y,
                r: 7,
                fill: col.color,
                stroke: '#ffffff',
                'stroke-width': '2'
            }, svg);

            // Vertical connector from axis node down to first card
            if (col.entries.length > 0) {
                el('line', {
                    x1: colX + COL_W / 2,
                    y1: TIMELINE_AXIS_Y + 7,
                    x2: colX + COL_W / 2,
                    y2: CARD_AREA_TOP - 6,
                    stroke: col.color,
                    'stroke-width': '1.5',
                    'stroke-dasharray': '3,3',
                    opacity: '0.5'
                }, svg);
            }

            // Render every card — distribute across sub-columns within this month column
            // Sub-columns are filled top-to-bottom, left-to-right (column-major order)
            // so the first card (earliest in month) is top-left and reading flows naturally.
            var totalCards = col.entries.length;
            var perStack = Math.ceil(totalCards / subColsPerMonth);
            for (var k = 0; k < totalCards; k++) {
                var e = col.entries[k];
                var subColIdx = Math.floor(k / perStack);
                var rowIdx = k % perStack;
                var cardX = colX + subColIdx * (CARD_W_BASE + SUBCOL_GAP);
                var cardY = CARD_AREA_TOP + rowIdx * (CARD_H + CARD_GAP);
                self._renderCard(svg, el, cardX, cardY, CARD_W_BASE, CARD_H, col.color, e);
            }
        });

        // Footer caption
        var footer = el('text', {
            x: SVG_W - PAD_RIGHT,
            y: SVG_H - 14,
            'text-anchor': 'end',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '11',
            fill: '#94a3b8'
        }, svg);
        footer.textContent = 'hollobit.github.io/SOTA · generated ' + new Date().toISOString().slice(0, 10);

        host.appendChild(svg);
        this._currentSvg = svg;
    },

    _renderCard: function(svg, el, x, y, w, h, accentColor, e) {
        var self = this;

        // Card background
        el('rect', {
            x: x,
            y: y,
            width: w,
            height: h,
            rx: 6,
            fill: '#ffffff',
            stroke: '#e2e8f0',
            'stroke-width': '1'
        }, svg);
        // Left accent stripe (month colour)
        el('rect', {
            x: x,
            y: y,
            width: 4,
            height: h,
            fill: accentColor
        }, svg);

        // Vendor logo tile
        var tileSize = 36;
        var tileX = x + 12;
        var tileY = y + 10;
        el('rect', {
            x: tileX,
            y: tileY,
            width: tileSize,
            height: tileSize,
            rx: 7,
            fill: this._vendorTileColor(e.vendor)
        }, svg);
        var tileText = el('text', {
            x: tileX + tileSize / 2,
            y: tileY + tileSize / 2 + 7,
            'text-anchor': 'middle',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '20',
            'font-weight': '700',
            fill: '#ffffff'
        }, svg);
        tileText.textContent = this._vendorLogoLetter(e.vendor);

        // Date badge (MM.DD)
        var mm = String(e.dt.getMonth() + 1).padStart(2, '0');
        var dd = String(e.dt.getDate()).padStart(2, '0');
        var dateBadge = el('text', {
            x: x + w - 12,
            y: y + 22,
            'text-anchor': 'end',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '14',
            'font-weight': '700',
            fill: accentColor
        }, svg);
        dateBadge.textContent = mm + '.' + dd;

        // Country flag (top-right, just under date)
        var flagText = el('text', {
            x: x + w - 12,
            y: y + 42,
            'text-anchor': 'end',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '14'
        }, svg);
        flagText.textContent = this._flagFromCountry(e.country);

        // Model name (precise version, large) — clip if too long
        var nameText = el('text', {
            x: tileX + tileSize + 10,
            y: y + 28,
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '14',
            'font-weight': '700',
            fill: '#0f172a'
        }, svg);
        // Strip vendor prefix if present (model name only — no path)
        var displayName = e.name;
        if (displayName.indexOf('/') !== -1) {
            displayName = displayName.split('/').slice(1).join('/');
        }
        // Width-aware truncation
        var maxNameLen = 26;
        if (displayName.length > maxNameLen) displayName = displayName.slice(0, maxNameLen - 1) + '…';
        nameText.textContent = displayName;
        // Tooltip with full version
        var nameTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        nameTitle.textContent = e.name + '\n' + e.vendor + '\nReleased: ' + e.date.slice(0, 10);
        nameText.appendChild(nameTitle);

        // Vendor name (smaller, gray)
        var vendorText = el('text', {
            x: tileX + tileSize + 10,
            y: y + 47,
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '11',
            fill: '#64748b'
        }, svg);
        var vendorClean = e.vendor.replace(/\s*\(.*\)\s*$/, '');
        var maxVendorLen = 32;
        if (vendorClean.length > maxVendorLen) vendorClean = vendorClean.slice(0, maxVendorLen - 1) + '…';
        vendorText.textContent = vendorClean;

        // Bottom row: license badge + country full label
        var licenseColors = {
            'proprietary': { bg: '#fef2f2', fg: '#b91c1c' },
            'open-weight': { bg: '#f0fdf4', fg: '#15803d' },
            'open-weights': { bg: '#f0fdf4', fg: '#15803d' },
            'open-source': { bg: '#eff6ff', fg: '#1d4ed8' }
        };
        var lc = licenseColors[e.type] || { bg: '#f1f5f9', fg: '#475569' };
        var licenseLabel = e.type || 'unknown';
        // estimate badge width
        var badgeW = Math.max(58, licenseLabel.length * 6 + 14);
        el('rect', {
            x: tileX + tileSize + 10,
            y: y + h - 26,
            width: badgeW,
            height: 18,
            rx: 9,
            fill: lc.bg
        }, svg);
        var licenseText = el('text', {
            x: tileX + tileSize + 10 + badgeW / 2,
            y: y + h - 13,
            'text-anchor': 'middle',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '10',
            'font-weight': '600',
            fill: lc.fg
        }, svg);
        licenseText.textContent = licenseLabel;

        // Country full label after license badge
        var countryLabel = (e.country || '').replace(/^\S+\s*/, ''); // strip flag, keep name
        var countryText = el('text', {
            x: tileX + tileSize + 10 + badgeW + 8,
            y: y + h - 13,
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-size': '10',
            fill: '#94a3b8'
        }, svg);
        countryText.textContent = countryLabel;

        // Click target — invisible rect on top routing to modal
        var click = el('rect', {
            x: x,
            y: y,
            width: w,
            height: h,
            fill: 'transparent',
            style: 'cursor: pointer'
        }, svg);
        click.addEventListener('click', function() {
            if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(e.id);
        });
        var clickTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        clickTitle.textContent = e.name + ' · ' + e.vendor + ' · ' + e.date.slice(0, 10);
        click.appendChild(clickTitle);
    },

    _hashCode: function(s) {
        var h = 0;
        for (var i = 0; i < (s || '').length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
        return h;
    },

    _downloadInfographic: function(format) {
        if (!this._currentSvg) return;
        var rangeSel = document.getElementById('timeline-infographic-range');
        var monthsBack = (rangeSel || {}).value || '6';
        var stamp = new Date().toISOString().slice(0, 10);
        var filename = 'model-timeline-' + monthsBack + 'mo-' + stamp;

        var serializer = new XMLSerializer();
        var svgStr = serializer.serializeToString(this._currentSvg);

        if (format === 'svg') {
            var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            var blobUrl = URL.createObjectURL(blob);
            this._triggerDownload(blobUrl, filename + '.svg');
            setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 1500);
            return;
        }

        // PNG: rasterize via canvas. Read viewBox to get true SVG dimensions
        // (which now adapt to release count) so the PNG is sharp regardless of size.
        var viewBox = (this._currentSvg.getAttribute('viewBox') || '0 0 1920 1080').split(/\s+/);
        var nativeW = parseFloat(viewBox[2]) || 1920;
        var nativeH = parseFloat(viewBox[3]) || 1080;

        var img = new Image();
        var svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        var svgUrl = URL.createObjectURL(svgBlob);
        var self = this;
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var scale = 2;
            canvas.width = nativeW * scale;
            canvas.height = nativeH * scale;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(svgUrl);
            canvas.toBlob(function(blob) {
                if (!blob) return;
                var url = URL.createObjectURL(blob);
                self._triggerDownload(url, filename + '.png');
                setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
            }, 'image/png');
        };
        img.onerror = function() {
            URL.revokeObjectURL(svgUrl);
            alert('PNG export failed — try SVG download instead.');
        };
        img.src = svgUrl;
    },

    _downloadCSV: function() {
        var rangeSel = document.getElementById('timeline-infographic-range');
        var monthsBack = parseInt((rangeSel || {}).value || '6', 10);
        var entries = this._getInfographicEntries(monthsBack);
        entries.sort(function(a, b) { return b.ts - a.ts; });
        var rows = [['release_date', 'model_id', 'name', 'vendor', 'country', 'type']];
        entries.forEach(function(e) {
            rows.push([e.date.slice(0, 10), e.id, e.name, e.vendor, e.country, e.type]);
        });
        var csv = rows.map(function(r) {
            return r.map(function(c) {
                var s = String(c == null ? '' : c).replace(/"/g, '""');
                return /[,"\n]/.test(s) ? '"' + s + '"' : s;
            }).join(',');
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var stamp = new Date().toISOString().slice(0, 10);
        this._triggerDownload(url, 'model-timeline-' + monthsBack + 'mo-' + stamp + '.csv');
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    _triggerDownload: function(url, filename) {
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },

    render: function() {
        this._renderInfographic();
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
                var sysDate = self._getSystemRegisteredDate(m);
                var country = self._getCountry(m.id, m);
                return {
                    id: m.id,
                    name: m.name || m.id,
                    vendor: m.vendor || '',
                    type: m.type || '',
                    modalities: m.modalities || [],
                    date: date,
                    sysDate: sysDate,
                    country: country,
                    scoreCount: self._scores.filter(function(s) { return s.model_id === m.id; }).length,
                };
            })
            .filter(function(e) { return e !== null; });

        // Show exclusion count for models without a canonical release_date
        var totalModels = this._models.length;
        var excludedCount = totalModels - entries.length;
        var note = document.getElementById('timeline-exclusion-note');
        if (note) note.textContent = excludedCount > 0
            ? excludedCount + ' models excluded (no release date)'
            : '';

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

            // Release date (canonical — vendor announcement)
            var dateCol = document.createElement('div');
            dateCol.className = 'text-xs text-gray-300 font-mono w-24 flex-shrink-0';
            dateCol.textContent = e.date.slice(0, 10);
            dateCol.title = 'Release date (vendor announcement)';
            row.appendChild(dateCol);

            // System registration date (smaller, gray — when WE first ingested this model)
            var sysCol = document.createElement('div');
            sysCol.className = 'text-xs text-gray-600 font-mono w-24 flex-shrink-0 italic';
            if (e.sysDate) {
                sysCol.textContent = '+' + e.sysDate.slice(0, 10);
                sysCol.title = '시스템 등록일 (when we first ingested data for this model)';
            } else {
                sysCol.textContent = '';
            }
            row.appendChild(sysCol);

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
