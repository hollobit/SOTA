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

        // Infographic chart controls
        var rangeSel = document.getElementById('timeline-infographic-range');
        var groupSel = document.getElementById('timeline-infographic-groupby');
        var pngBtn = document.getElementById('timeline-download-png');
        var svgBtn = document.getElementById('timeline-download-svg');
        var csvBtn = document.getElementById('timeline-download-csv');
        if (rangeSel) rangeSel.addEventListener('change', function() { self._renderInfographic(); });
        if (groupSel) groupSel.addEventListener('change', function() { self._renderInfographic(); });
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

    _renderInfographic: function() {
        var host = document.getElementById('timeline-infographic-chart');
        if (!host || typeof echarts === 'undefined') return;
        var rangeSel = document.getElementById('timeline-infographic-range');
        var groupSel = document.getElementById('timeline-infographic-groupby');
        var monthsBack = parseInt((rangeSel || {}).value || '6', 10);
        var groupBy = (groupSel || {}).value || 'country';

        var entries = this._getInfographicEntries(monthsBack);
        // Clear host children safely
        while (host.firstChild) host.removeChild(host.firstChild);
        if (entries.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-gray-500 text-sm p-8 text-center';
            empty.textContent = 'No models with release dates in the selected range.';
            host.appendChild(empty);
            return;
        }

        var self = this;

        // Build month buckets (Y-axis): one row per YYYY-MM in range
        var months = [];
        var now = new Date();
        for (var i = monthsBack - 1; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            var ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            months.push(ym);
        }

        function getGroupKey(e) {
            if (groupBy === 'vendor') return e.vendor;
            if (groupBy === 'type') return e.type || 'unknown';
            return e.country;
        }
        function getColor(e) {
            if (groupBy === 'country') return self._COUNTRY_COLORS[e.country] || '#6b7280';
            if (groupBy === 'type') return self._TYPE_COLORS[e.type] || '#6b7280';
            return self._MONTH_COLORS[e.dt.getMonth()];
        }

        var seriesMap = {};
        entries.forEach(function(e) {
            var key = getGroupKey(e);
            if (!seriesMap[key]) seriesMap[key] = [];
            var ym = e.dt.getFullYear() + '-' + String(e.dt.getMonth() + 1).padStart(2, '0');
            var yIdx = months.indexOf(ym);
            if (yIdx < 0) return;
            var dayInMonth = e.dt.getDate();
            var jitter = (Math.abs(self._hashCode(e.id)) % 100) / 100 * 0.6 - 0.3;
            seriesMap[key].push({
                value: [dayInMonth, yIdx + jitter],
                entry: e,
                color: getColor(e)
            });
        });

        var series = Object.keys(seriesMap).map(function(key) {
            return {
                name: key,
                type: 'scatter',
                symbolSize: 14,
                data: seriesMap[key].map(function(p) {
                    return {
                        value: p.value,
                        entry: p.entry,
                        itemStyle: { color: p.color }
                    };
                }),
                emphasis: {
                    focus: 'series',
                    label: { show: true, position: 'right', formatter: function(p) { return p.data.entry.name; } }
                }
            };
        });

        var option = {
            title: {
                text: 'Model Releases — Last ' + monthsBack + ' Months',
                subtext: entries.length + ' models · grouped by ' + groupBy + ' · click any point for details',
                left: 'center',
                textStyle: { color: '#e5e7eb', fontSize: 16 },
                subtextStyle: { color: '#9ca3af', fontSize: 11 }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: '#1f2937',
                borderColor: '#374151',
                textStyle: { color: '#e5e7eb' },
                formatter: function(p) {
                    var e = p.data.entry;
                    var parts = [];
                    parts.push('<strong>' + e.name + '</strong>');
                    parts.push(e.vendor + (e.country ? ' · ' + e.country : ''));
                    parts.push('Released: <strong>' + e.date.slice(0, 10) + '</strong>');
                    if (e.type) parts.push('License: ' + e.type);
                    return parts.join('<br/>');
                }
            },
            legend: {
                top: 50,
                type: 'scroll',
                textStyle: { color: '#d1d5db', fontSize: 11 },
                inactiveColor: '#4b5563'
            },
            grid: { left: 60, right: 40, top: 100, bottom: 50, containLabel: true },
            xAxis: {
                type: 'value',
                name: 'Day of month',
                nameLocation: 'middle',
                nameGap: 28,
                nameTextStyle: { color: '#9ca3af' },
                min: 1,
                max: 31,
                interval: 5,
                axisLabel: { color: '#d1d5db' },
                axisLine: { lineStyle: { color: '#4b5563' } },
                splitLine: { lineStyle: { color: '#1f2937' } }
            },
            yAxis: {
                type: 'category',
                data: months,
                inverse: true,
                axisLabel: { color: '#d1d5db' },
                axisLine: { lineStyle: { color: '#4b5563' } },
                splitLine: { show: true, lineStyle: { color: '#1f2937', type: 'dashed' } }
            },
            series: series,
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true,
                        title: 'Save PNG',
                        backgroundColor: '#0f172a',
                        pixelRatio: 2,
                        name: 'model-timeline-' + monthsBack + 'mo-' + new Date().toISOString().slice(0, 10)
                    }
                },
                iconStyle: { borderColor: '#9ca3af' },
                right: 20, top: 20
            },
            animationDuration: 600
        };

        var chart = (typeof Charts !== 'undefined' && Charts._getOrCreate)
            ? Charts._getOrCreate('timeline-infographic-chart')
            : echarts.init(host, 'dark');
        if (!chart) return;
        this._infographicChart = chart;
        chart.setOption(option, true);

        chart.off('click');
        chart.on('click', function(p) {
            if (p && p.data && p.data.entry && typeof Modal !== 'undefined' && Modal.showModel) {
                Modal.showModel(p.data.entry.id);
            }
        });

        this._renderLegend(seriesMap, groupBy);
    },

    _renderLegend: function(seriesMap, groupBy) {
        var el = document.getElementById('timeline-infographic-legend');
        if (!el) return;
        while (el.firstChild) el.removeChild(el.firstChild);
        var self = this;
        Object.keys(seriesMap).sort().forEach(function(key) {
            var color = (groupBy === 'country' ? self._COUNTRY_COLORS[key]
                : groupBy === 'type' ? self._TYPE_COLORS[key]
                : self._MONTH_COLORS[(seriesMap[key][0] && seriesMap[key][0].entry.dt.getMonth()) || 0])
                || '#6b7280';
            var wrap = document.createElement('span');
            wrap.className = 'inline-flex items-center gap-1.5';
            var swatch = document.createElement('span');
            swatch.className = 'inline-block w-3 h-3 rounded-full';
            swatch.style.background = color;
            var label = document.createElement('span');
            label.className = 'text-gray-400';
            label.textContent = key;
            var count = document.createElement('span');
            count.className = 'text-gray-600';
            count.textContent = '(' + seriesMap[key].length + ')';
            wrap.appendChild(swatch);
            wrap.appendChild(label);
            wrap.appendChild(count);
            el.appendChild(wrap);
        });
    },

    _hashCode: function(s) {
        var h = 0;
        for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
        return h;
    },

    _downloadInfographic: function(format) {
        var chart = this._infographicChart;
        if (!chart) return;
        var rangeSel = document.getElementById('timeline-infographic-range');
        var monthsBack = (rangeSel || {}).value || '6';
        var stamp = new Date().toISOString().slice(0, 10);
        var filename = 'model-timeline-' + monthsBack + 'mo-' + stamp;

        if (format === 'png') {
            var url = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#0f172a' });
            this._triggerDownload(url, filename + '.png');
        } else if (format === 'svg') {
            try {
                var svgEl = chart.getDom().querySelector('svg');
                if (svgEl) {
                    var serializer = new XMLSerializer();
                    var svgStr = serializer.serializeToString(svgEl);
                    var blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
                    var blobUrl = URL.createObjectURL(blob);
                    this._triggerDownload(blobUrl, filename + '.svg');
                    setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 1000);
                    return;
                }
            } catch (e) {}
            var pngUrl = chart.getDataURL({ type: 'png', pixelRatio: 2, backgroundColor: '#0f172a' });
            this._triggerDownload(pngUrl, filename + '.png');
            alert('SVG renderer not active — saved as PNG instead.');
        }
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
