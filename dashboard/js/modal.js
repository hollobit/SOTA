/**
 * Modal dialogs for benchmark detail and model detail views.
 * Uses safe DOM methods (createElement + textContent) for all dynamic content.
 */
var Modal = {
    _bmtData: null,

    init: function() {
        var base = window.location.pathname.indexOf('/dashboard/') !== -1 ? '../data' : 'data';
        fetch(base + '/bmt_connections.json').then(function(r) {
            return r.ok ? r.json() : {};
        }).then(function(d) { Modal._bmtData = d; }).catch(function() { Modal._bmtData = {}; });
    },

    _makeLabel: function(labelText, valueText) {
        var div = document.createElement('div');
        div.className = 'text-sm';
        var lbl = document.createElement('span');
        lbl.className = 'text-gray-500';
        lbl.textContent = labelText + ': ';
        div.appendChild(lbl);
        var val = document.createElement('span');
        val.className = 'text-gray-200';
        val.textContent = valueText;
        div.appendChild(val);
        return div;
    },

    showBenchmark: function(benchId) {
        var bench = App.data.benchmarks.find(function(b) { return b.id === benchId; });
        if (!bench) return;

        var bmt = (this._bmtData || {})[benchId] || (this._bmtData || {})[benchId.replace(/_/g, '')] || {};

        var scores = App.data.scores.filter(function(s) { return s.benchmark_id === benchId; });
        scores.sort(function(a, b) { return b.value - a.value; });

        var container = document.getElementById('modal-content');
        container.textContent = '';

        // Title
        var h2 = document.createElement('h2');
        h2.className = 'text-xl font-bold text-white mb-1';
        h2.textContent = bench.name;
        container.appendChild(h2);

        // Category badge
        var catBadge = document.createElement('span');
        catBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-300 mb-3';
        catBadge.textContent = bench.category;
        container.appendChild(catBadge);

        // Description
        if (bench.description) {
            var desc = document.createElement('p');
            desc.className = 'text-gray-400 text-sm mb-4';
            desc.textContent = bench.description;
            container.appendChild(desc);
        }

        // BMT metadata
        if (bmt.bmt_title || bmt.paper_link || bmt.github_link) {
            var metaDiv = document.createElement('div');
            metaDiv.className = 'bg-gray-800 rounded-lg p-4 mb-4 space-y-2';

            if (bmt.bmt_title) metaDiv.appendChild(this._makeLabel('Dataset', bmt.bmt_title));
            if (bmt.year) metaDiv.appendChild(this._makeLabel('Year', bmt.year));
            if (bmt.item_count) metaDiv.appendChild(this._makeLabel('Items', bmt.item_count));
            if (bmt.description) {
                var bmtDesc = document.createElement('div');
                bmtDesc.className = 'text-sm text-gray-400 mt-2';
                bmtDesc.textContent = bmt.description;
                metaDiv.appendChild(bmtDesc);
            }

            var linksDiv = document.createElement('div');
            linksDiv.className = 'flex gap-3 mt-3';
            if (bmt.paper_link) {
                var paperLink = document.createElement('a');
                paperLink.href = bmt.paper_link;
                paperLink.target = '_blank';
                paperLink.rel = 'noopener noreferrer';
                paperLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs rounded transition';
                paperLink.textContent = 'Paper';
                linksDiv.appendChild(paperLink);
            }
            if (bmt.github_link) {
                var ghLink = document.createElement('a');
                ghLink.href = bmt.github_link;
                ghLink.target = '_blank';
                ghLink.rel = 'noopener noreferrer';
                ghLink.className = 'inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition';
                ghLink.textContent = 'GitHub';
                linksDiv.appendChild(ghLink);
            }
            metaDiv.appendChild(linksDiv);
            container.appendChild(metaDiv);
        }

        // Scores table
        var h3 = document.createElement('h3');
        h3.className = 'text-sm font-semibold text-gray-300 mb-2';
        h3.textContent = 'Model Rankings (' + scores.length + ' models)';
        container.appendChild(h3);

        var table = document.createElement('table');
        table.className = 'w-full text-sm';
        var thead = document.createElement('thead');
        var hr = document.createElement('tr');
        ['#', 'Model', 'Score', 'Source'].forEach(function(t) {
            var th = document.createElement('th');
            th.className = 'text-left text-gray-500 pb-2 pr-3 text-xs';
            th.textContent = t;
            hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        scores.forEach(function(s, i) {
            var model = App.data.models.find(function(m) { return m.id === s.model_id; });
            var tr = document.createElement('tr');
            tr.className = 'border-t border-gray-800';

            var tdRank = document.createElement('td');
            tdRank.className = 'py-1.5 pr-3 text-gray-500';
            tdRank.textContent = i + 1;
            tr.appendChild(tdRank);

            var tdModel = document.createElement('td');
            tdModel.className = 'py-1.5 pr-3 text-gray-200';
            var modelSpan = document.createElement('span');
            modelSpan.className = 'cursor-pointer hover:text-blue-400 transition';
            modelSpan.textContent = model ? model.name : s.model_id.split('/').pop();
            modelSpan.onclick = (function(mid) { return function(e) { e.stopPropagation(); Modal.showModel(mid); }; })(s.model_id);
            tdModel.appendChild(modelSpan);
            if (i === 0 && s.is_sota) {
                var sota = document.createElement('span');
                sota.className = 'ml-2 px-1.5 py-0.5 bg-green-900 text-green-300 text-xs rounded';
                sota.textContent = 'SOTA';
                tdModel.appendChild(sota);
            }
            tr.appendChild(tdModel);

            var tdScore = document.createElement('td');
            tdScore.className = 'py-1.5 pr-3 font-mono';
            if (i === 0) tdScore.className += ' text-green-400 font-bold';
            else if (i < 3) tdScore.className += ' text-blue-400';
            else tdScore.className += ' text-gray-300';
            tdScore.textContent = s.value > 500 ? Math.round(s.value) : s.value;
            tr.appendChild(tdScore);

            var tdSrc = document.createElement('td');
            tdSrc.className = 'py-1.5 text-xs';
            var srcType = (s.source && s.source.type) || '';
            tdSrc.className += srcType === 'pdf' ? ' text-purple-400' : ' text-gray-500';
            tdSrc.textContent = srcType || 'web';
            tr.appendChild(tdSrc);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);

        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    showModel: function(modelId) {
        var model = App.data.models.find(function(m) { return m.id === modelId; });
        if (!model) return;

        var scores = App.data.scores.filter(function(s) { return s.model_id === modelId; });

        var byCategory = {};
        scores.forEach(function(s) {
            var bench = App.data.benchmarks.find(function(b) { return b.id === s.benchmark_id; });
            var cat = bench ? bench.category : 'other';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push({ bench: bench, score: s });
        });

        var container = document.getElementById('modal-content');
        container.textContent = '';

        var h2 = document.createElement('h2');
        h2.className = 'text-xl font-bold text-white mb-1';
        h2.textContent = model.name;
        container.appendChild(h2);

        var meta = document.createElement('div');
        meta.className = 'flex gap-2 mb-4';

        var vendorBadge = document.createElement('span');
        vendorBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300';
        vendorBadge.textContent = model.vendor;
        meta.appendChild(vendorBadge);

        var typeBadge = document.createElement('span');
        typeBadge.className = 'inline-block px-2 py-0.5 rounded text-xs';
        if (model.type === 'proprietary') typeBadge.className += ' bg-red-900 text-red-300';
        else if (model.type === 'open-weight') typeBadge.className += ' bg-green-900 text-green-300';
        else typeBadge.className += ' bg-blue-900 text-blue-300';
        typeBadge.textContent = model.type;
        meta.appendChild(typeBadge);

        var countBadge = document.createElement('span');
        countBadge.className = 'inline-block px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400';
        countBadge.textContent = scores.length + ' benchmarks';
        meta.appendChild(countBadge);
        container.appendChild(meta);

        var catOrder = ['reasoning', 'coding', 'math', 'cybersecurity', 'cyber_defense', 'agent', 'multimodal', 'multilingual', 'other'];
        var catNames = {
            reasoning: 'Reasoning', coding: 'Coding', math: 'Math',
            cybersecurity: 'Cybersecurity (Attack)', cyber_defense: 'Cyber Defense',
            agent: 'Agent', multimodal: 'Multimodal', multilingual: 'Multilingual', other: 'Other'
        };

        catOrder.forEach(function(cat) {
            var items = byCategory[cat];
            if (!items || items.length === 0) return;
            items.sort(function(a, b) { return b.score.value - a.score.value; });

            var section = document.createElement('div');
            section.className = 'mb-4';

            var h3 = document.createElement('h3');
            h3.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2';
            h3.textContent = catNames[cat] || cat;
            section.appendChild(h3);

            items.forEach(function(item) {
                var row = document.createElement('div');
                row.className = 'flex items-center justify-between py-1.5 border-t border-gray-800 hover:bg-gray-800 rounded px-2 -mx-2 cursor-pointer transition';
                row.onclick = (function(bid) { return function() { Modal.showBenchmark(bid); }; })(item.bench ? item.bench.id : item.score.benchmark_id);

                var left = document.createElement('span');
                left.className = 'text-sm text-gray-300';
                left.textContent = item.bench ? item.bench.name : item.score.benchmark_id;
                row.appendChild(left);

                var right = document.createElement('div');
                right.className = 'flex items-center gap-2';

                var val = document.createElement('span');
                val.className = 'text-sm font-mono';
                val.className += item.score.is_sota ? ' text-green-400 font-bold' : ' text-gray-200';
                val.textContent = item.score.value > 500 ? Math.round(item.score.value) : item.score.value;
                right.appendChild(val);

                if (item.score.is_sota) {
                    var sotaBadge = document.createElement('span');
                    sotaBadge.className = 'px-1.5 py-0.5 bg-green-900 text-green-300 text-xs rounded';
                    sotaBadge.textContent = 'SOTA';
                    right.appendChild(sotaBadge);
                }

                var srcBadge = document.createElement('span');
                srcBadge.className = 'text-xs';
                var st = (item.score.source && item.score.source.type) || '';
                srcBadge.className += st === 'pdf' ? ' text-purple-400' : ' text-gray-600';
                srcBadge.textContent = st || 'web';
                right.appendChild(srcBadge);

                row.appendChild(right);
                section.appendChild(row);
            });

            container.appendChild(section);
        });

        document.getElementById('modal-overlay').classList.remove('hidden');
    }
};
