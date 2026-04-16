/**
 * Model comparison and exploration logic.
 * Uses safe DOM methods to prevent XSS from scraped data.
 */
var Explorer = {
    compare: function(modelA, modelB, scores) {
        var scoresA = scores.filter(function(s) { return s.model_id === modelA; });
        var scoresB = scores.filter(function(s) { return s.model_id === modelB; });

        var benchmarkSet = {};
        scoresA.forEach(function(s) { benchmarkSet[s.benchmark_id] = true; });
        scoresB.forEach(function(s) { benchmarkSet[s.benchmark_id] = true; });

        var comparison = [];
        Object.keys(benchmarkSet).sort().forEach(function(b) {
            var a = scoresA.find(function(s) { return s.benchmark_id === b; });
            var bS = scoresB.find(function(s) { return s.benchmark_id === b; });
            var diff = (a && bS) ? (a.value - bS.value).toFixed(1) : null;
            var winner = (a && bS) ? (a.value > bS.value ? 'A' : a.value < bS.value ? 'B' : 'tie') : null;
            comparison.push({
                benchmark: b,
                valueA: a ? a.value : null,
                valueB: bS ? bS.value : null,
                diff: diff,
                winner: winner
            });
        });

        return comparison;
    },

    renderComparison: function(containerId, modelA, modelB, comparison) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.textContent = '';

        var table = document.createElement('table');
        table.className = 'sota-table';

        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['Benchmark', modelA.split('/').pop(), modelB.split('/').pop(), 'Diff'].forEach(function(text) {
            var th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        comparison.forEach(function(row) {
            var tr = document.createElement('tr');

            var tdBench = document.createElement('td');
            tdBench.textContent = row.benchmark.toUpperCase();
            tr.appendChild(tdBench);

            var tdA = document.createElement('td');
            tdA.textContent = row.valueA !== null ? row.valueA : '\u2014';
            tr.appendChild(tdA);

            var tdB = document.createElement('td');
            tdB.textContent = row.valueB !== null ? row.valueB : '\u2014';
            tr.appendChild(tdB);

            var tdDiff = document.createElement('td');
            if (row.diff !== null) {
                tdDiff.textContent = (row.diff > 0 ? '+' : '') + row.diff;
                tdDiff.className = row.winner === 'A' ? 'text-green-400' :
                                   row.winner === 'B' ? 'text-red-400' : 'text-gray-400';
            } else {
                tdDiff.textContent = '\u2014';
            }
            tr.appendChild(tdDiff);

            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    }
};
