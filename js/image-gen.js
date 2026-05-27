/**
 * Image Gen tab — text-to-image / image-edit / image-to-webdev arenas.
 * Pulls data-driven from arena_text_to_image_elo / arena_image_edit_elo /
 * arena_image_to_webdev_elo / arena_t2i_aa_elo benchmark scores.
 *
 * No hardcoded model list — discovers image-gen models dynamically from
 * the scores tied to these 4 benchmark IDs. New models surface
 * automatically once they have a score on any of the 4 boards.
 */
var ImageGen = {
    BOARDS: [
        { id: 'arena_text_to_image_elo',  label: 'arena.ai Text-to-Image',  icon: '🖼️' },
        { id: 'arena_image_edit_elo',     label: 'arena.ai Image Edit',     icon: '✏️' },
        { id: 'arena_image_to_webdev_elo', label: 'arena.ai Image-to-WebDev', icon: '🌐' },
        { id: 'arena_t2i_aa_elo',         label: 'Artificial Analysis T2I', icon: '📊' }
    ],
    _initialized: false,

    _makeRow: function(rank, name, vendor, value, modelId) {
        var tr = document.createElement('tr');
        tr.className = 'border-b border-gray-900';
        var medal = rank === 1 ? ' 🥇' : rank === 2 ? ' 🥈' : rank === 3 ? ' 🥉' : '';
        var tdRank = document.createElement('td');
        tdRank.className = 'py-2 pr-4 text-gray-500';
        tdRank.textContent = rank + medal;
        var tdName = document.createElement('td');
        tdName.className = 'py-2 pr-4';
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'hover:text-orange-400';
        a.textContent = name;
        a.addEventListener('click', function(e) { e.preventDefault(); if (window.App && App.showModel) App.showModel(modelId); });
        tdName.appendChild(a);
        var tdVendor = document.createElement('td');
        tdVendor.className = 'py-2 pr-4 text-gray-400';
        tdVendor.textContent = vendor;
        var tdVal = document.createElement('td');
        tdVal.className = 'py-2 pr-4 text-right font-mono';
        tdVal.textContent = Math.round(value);
        tr.appendChild(tdRank); tr.appendChild(tdName); tr.appendChild(tdVendor); tr.appendChild(tdVal);
        return tr;
    },

    _makeBoardCard: function(board, rows, modelById) {
        var div = document.createElement('div');
        div.className = 'bg-gray-900 border border-gray-800 rounded p-5';
        var h3 = document.createElement('h3');
        h3.className = 'text-lg font-semibold mb-3';
        h3.textContent = board.icon + ' ' + board.label + ' ';
        var span = document.createElement('span');
        span.className = 'text-xs text-gray-500 font-normal';
        span.textContent = '(' + rows.length + ' models)';
        h3.appendChild(span);
        div.appendChild(h3);

        var wrap = document.createElement('div');
        wrap.className = 'overflow-x-auto';
        var table = document.createElement('table');
        table.className = 'w-full text-sm';
        var thead = document.createElement('thead');
        thead.className = 'text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-800';
        var hr = document.createElement('tr');
        ['#', 'Model', 'Vendor', 'Elo'].forEach(function(label, idx) {
            var th = document.createElement('th');
            th.className = 'py-2 pr-4' + (idx === 3 ? ' text-right' : '');
            th.textContent = label;
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);
        var tbody = document.createElement('tbody');
        var self = this;
        rows.forEach(function(s, i) {
            var m = modelById[s.model_id];
            tbody.appendChild(self._makeRow(i + 1, m ? m.name : s.model_id, m ? (m.vendor || '') : '', s.value || 0, s.model_id));
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        div.appendChild(wrap);
        return div;
    },

    render: function() {
        if (this._initialized) return;
        if (!window.App || !window.App.data) return;
        var scores = window.App.data.scores || [];
        var models = window.App.data.models || [];
        var modelById = {};
        models.forEach(function(m) { modelById[m.id] = m; });

        var container = document.getElementById('image-gen-content');
        if (!container) return;
        container.textContent = '';

        var stack = document.createElement('div');
        stack.className = 'space-y-8';

        var self = this;
        var imageModels = new Set();
        this.BOARDS.forEach(function(board) {
            var rows = scores.filter(function(s) { return s.benchmark_id === board.id; })
                              .sort(function(a, b) { return (b.value || 0) - (a.value || 0); });
            if (rows.length === 0) return;
            rows.forEach(function(s) { imageModels.add(s.model_id); });
            stack.appendChild(self._makeBoardCard(board, rows, modelById));
        });

        var vendorSet = new Set();
        imageModels.forEach(function(mid) { var m = modelById[mid]; if (m && m.vendor) vendorSet.add(m.vendor); });
        var meta = document.createElement('div');
        meta.className = 'text-xs text-gray-500 mt-4 px-2';
        meta.textContent = 'Image Gen coverage: ' + imageModels.size + ' models · ' + vendorSet.size + ' vendors · ' + this.BOARDS.length + ' arena boards';
        stack.appendChild(meta);

        container.appendChild(stack);
        this._initialized = true;
    }
};
