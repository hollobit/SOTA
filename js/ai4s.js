/**
 * AI for Science (AI4S) tab.
 * Categorizes science-specialized foundation models into 8 sub-categories
 * and renders grouped cards with click-to-modal navigation.
 */
var AI4S = {
    _models: [],

    // Sub-category resolver: id-prefix and id-substring rules.
    // Run in order; first match wins. Centralised here so adding a new
    // model just requires an entry in the data file (no UI change needed
    // unless the model_id pattern is genuinely unprecedented).
    _CATEGORIES: [
        { key: 'co-scientist', icon: '🧪', label: 'Co-Scientist / Research Agent', match: function(id) {
            return /\b(ai-co-scientist|ai-scientist|virtual-lab|paperqa|crow|owl|phoenix-chem|darwin-godel|a-lab|falcon-research)\b/i.test(id)
                || id.indexOf('futurehouse/') === 0
                || id.indexOf('lbnl/a-lab') === 0;
        }},
        { key: 'math', icon: '📐', label: 'Math / Formal Proof', match: function(id) {
            return /(prover|alphaproof|alphageometry|funsearch|llemma|openmath|mathfusion|reprover|lean-?star|stepprover|internlm.*math|gemini-deepthink-imo|imo-experimental)/i.test(id);
        }},
        { key: 'chemistry', icon: '⚗️', label: 'Chemistry', match: function(id) {
            return /(chemdfm|chemberta|chemgpt|chemformer|robochem|molgen|uni-mol|mole$|recursion\/mole)/i.test(id);
        }},
        { key: 'astronomy', icon: '🔭', label: 'Astronomy', match: function(id) {
            return /(astrollama|astropt|astrom3|aion-1|astroclip|astronn|multimodal-universe|polymathic\/aion)/i.test(id);
        }},
        { key: 'physics-materials', icon: '⚛️', label: 'Physics / Materials', match: function(id) {
            return /(mace-mp|orb-v|dpa-2|equiformer|uma-omat|mattergen|mattersim|gnome|chgnet|m3gnet|nequip|alphaqubit|multiple-physics|the-well|polymathic\/(multiple|the-well))/i.test(id);
        }},
        { key: 'geo-climate', icon: '🌍', label: 'Earth · Climate', match: function(id) {
            return /(aurora|pangu-weather|graphcast|gencast|aifs|fuxi|fengwu|climax|prithvi|climategpt)/i.test(id);
        }},
        { key: 'bio-genomics', icon: '🧬', label: 'Bio / Genomics', match: function(id) {
            return /(evo-1|evo-2|rfdiffusion|rosettafold|saprot|protgpt|genslms|scgpt|nucleotide-transformer|hyenadna|caduceus|alphamissense|alphagenome|chai-2)/i.test(id);
        }},
        { key: 'multi-disciplinary', icon: '🌐', label: 'Multi-disciplinary', match: function(id) {
            return /\bgalactica\b/i.test(id);
        }}
    ],

    init: function(allModels) {
        this._models = allModels || [];
        var self = this;
        var catSel = document.getElementById('ai4s-category-filter');
        var searchInput = document.getElementById('ai4s-search');
        if (catSel) catSel.addEventListener('change', function() { self.render(); });
        if (searchInput) searchInput.addEventListener('input', function() { self.render(); });
    },

    _getCategory: function(modelId) {
        for (var i = 0; i < this._CATEGORIES.length; i++) {
            if (this._CATEGORIES[i].match(modelId)) return this._CATEGORIES[i];
        }
        return null;
    },

    _getAI4SModels: function() {
        var self = this;
        var results = [];
        this._models.forEach(function(m) {
            var cat = self._getCategory(m.id);
            if (cat) {
                results.push({ model: m, category: cat });
            }
        });
        return results;
    },

    _flagFromVendor: function(vendor) {
        if (!vendor) return '🌐';
        // Country detected from vendor string suffix "(Country)" or substring
        var v = vendor.toLowerCase();
        if (v.indexOf('china') !== -1) return '🇨🇳';
        if (v.indexOf('usa') !== -1 || v.indexOf('us)') !== -1) return '🇺🇸';
        if (v.indexOf('uk') !== -1) return '🇬🇧';
        if (v.indexOf('japan') !== -1) return '🇯🇵';
        if (v.indexOf('korea') !== -1) return '🇰🇷';
        if (v.indexOf('france') !== -1) return '🇫🇷';
        if (v.indexOf('germany') !== -1) return '🇩🇪';
        if (v.indexOf('canada') !== -1) return '🇨🇦';
        if (v.indexOf('netherlands') !== -1) return '🇳🇱';
        if (v.indexOf('eu') !== -1 || v.indexOf('europe') !== -1) return '🇪🇺';
        if (v.indexOf('switzerland') !== -1) return '🇨🇭';
        if (v.indexOf('sweden') !== -1) return '🇸🇪';
        return '🌐';
    },

    render: function() {
        var container = document.getElementById('ai4s-container');
        var summaryEl = document.getElementById('ai4s-summary');
        var countEl = document.getElementById('ai4s-count');
        if (!container || !summaryEl) return;

        // Clear
        while (container.firstChild) container.removeChild(container.firstChild);
        while (summaryEl.firstChild) summaryEl.removeChild(summaryEl.firstChild);

        var catFilter = (document.getElementById('ai4s-category-filter') || {}).value || '';
        var searchQuery = ((document.getElementById('ai4s-search') || {}).value || '').toLowerCase().trim();

        var entries = this._getAI4SModels();

        // Apply filters
        if (catFilter) entries = entries.filter(function(e) { return e.category.key === catFilter; });
        if (searchQuery) {
            entries = entries.filter(function(e) {
                return e.model.id.toLowerCase().indexOf(searchQuery) !== -1
                    || (e.model.name || '').toLowerCase().indexOf(searchQuery) !== -1
                    || (e.model.vendor || '').toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        if (countEl) countEl.textContent = entries.length;

        // Summary tiles — count per category (always show all 8 categories regardless of filter)
        var allEntries = this._getAI4SModels();
        var counts = {};
        allEntries.forEach(function(e) {
            counts[e.category.key] = (counts[e.category.key] || 0) + 1;
        });
        this._CATEGORIES.forEach(function(cat) {
            var tile = document.createElement('div');
            tile.className = 'bg-gray-900 border border-gray-800 rounded p-3 hover:border-blue-600 cursor-pointer transition';
            tile.addEventListener('click', function() {
                var sel = document.getElementById('ai4s-category-filter');
                if (sel) {
                    sel.value = (sel.value === cat.key) ? '' : cat.key;
                    sel.dispatchEvent(new Event('change'));
                }
            });
            var head = document.createElement('div');
            head.className = 'flex items-baseline gap-2';
            var iconSpan = document.createElement('span');
            iconSpan.className = 'text-xl';
            iconSpan.textContent = cat.icon;
            head.appendChild(iconSpan);
            var titleSpan = document.createElement('span');
            titleSpan.className = 'text-xs text-gray-300 font-semibold';
            titleSpan.textContent = cat.label;
            head.appendChild(titleSpan);
            tile.appendChild(head);
            var num = document.createElement('div');
            num.className = 'text-2xl text-blue-400 font-bold mt-1';
            num.textContent = counts[cat.key] || 0;
            tile.appendChild(num);
            summaryEl.appendChild(tile);
        });

        if (entries.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'text-gray-500 text-sm p-8 text-center';
            empty.textContent = 'No AI4S models match the current filters.';
            container.appendChild(empty);
            return;
        }

        // Group by category
        var grouped = {};
        entries.forEach(function(e) {
            if (!grouped[e.category.key]) grouped[e.category.key] = { cat: e.category, items: [] };
            grouped[e.category.key].items.push(e.model);
        });

        // Render each group in canonical order
        var self = this;
        this._CATEGORIES.forEach(function(cat) {
            if (!grouped[cat.key]) return;
            var section = document.createElement('div');
            section.className = 'border-l-4 pl-4';
            section.style.borderColor = '#3b82f6';

            var hdr = document.createElement('h3');
            hdr.className = 'text-widget text-gray-200 mb-2 flex items-baseline gap-2';
            var icon = document.createElement('span');
            icon.className = 'text-xl';
            icon.textContent = cat.icon;
            hdr.appendChild(icon);
            var label = document.createElement('span');
            label.textContent = cat.label;
            hdr.appendChild(label);
            var countBadge = document.createElement('span');
            countBadge.className = 'text-xs text-gray-500 ml-2';
            countBadge.textContent = '(' + grouped[cat.key].items.length + ')';
            hdr.appendChild(countBadge);
            section.appendChild(hdr);

            var grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2';

            // Sort within category by release_date desc (newest first)
            grouped[cat.key].items.sort(function(a, b) {
                var ad = a.release_date || a.released_at || '';
                var bd = b.release_date || b.released_at || '';
                return bd.localeCompare(ad);
            });

            grouped[cat.key].items.forEach(function(m) {
                var card = document.createElement('div');
                card.className = 'bg-gray-900 border border-gray-800 hover:border-blue-600 rounded px-3 py-2 cursor-pointer transition';
                card.addEventListener('click', function() {
                    if (typeof Modal !== 'undefined' && Modal.showModel) Modal.showModel(m.id);
                });

                var topRow = document.createElement('div');
                topRow.className = 'flex items-baseline gap-2';
                var flag = document.createElement('span');
                flag.className = 'text-sm flex-shrink-0';
                flag.textContent = self._flagFromVendor(m.vendor);
                topRow.appendChild(flag);
                var nameEl = document.createElement('span');
                nameEl.className = 'text-sm text-blue-400 font-semibold truncate';
                nameEl.textContent = m.name || m.id.split('/').slice(1).join('/') || m.id;
                nameEl.title = m.id;
                topRow.appendChild(nameEl);
                card.appendChild(topRow);

                var meta = document.createElement('div');
                meta.className = 'text-xs text-gray-500 truncate mt-0.5';
                var rd = m.release_date || m.released_at;
                meta.textContent = (rd ? rd.slice(0, 10) + ' · ' : '') + (m.vendor || m.id.split('/')[0]);
                card.appendChild(meta);

                var bottom = document.createElement('div');
                bottom.className = 'flex gap-1 mt-1 flex-wrap';
                if (m.type) {
                    var typePill = document.createElement('span');
                    var pillClass = 'inline-block px-1.5 py-0.5 rounded text-xs ';
                    if (m.type === 'proprietary') pillClass += 'bg-red-900 text-red-300';
                    else if (m.type === 'open-weight' || m.type === 'open-weights') pillClass += 'bg-green-900 text-green-300';
                    else pillClass += 'bg-gray-700 text-gray-300';
                    typePill.className = pillClass;
                    typePill.textContent = m.type;
                    bottom.appendChild(typePill);
                }
                if (m.modalities && m.modalities.length) {
                    var modPill = document.createElement('span');
                    modPill.className = 'inline-block px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-400';
                    modPill.textContent = m.modalities.slice(0, 3).join('+');
                    bottom.appendChild(modPill);
                }
                card.appendChild(bottom);

                grid.appendChild(card);
            });
            section.appendChild(grid);
            container.appendChild(section);
        });
    }
};
