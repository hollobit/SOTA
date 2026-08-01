/**
 * Video Gen tab — text-to-video / image-to-video / video-edit arenas.
 * Data-driven discovery pattern identical to Image Gen tab.
 */
var VideoGen = {
    BOARDS: [
        { id: 'arena_text_to_video_elo',  label: 'arena.ai Text-to-Video',  icon: '🎬' },
        { id: 'aa_t2v_arena_elo_with_audio', label: 'Artificial Analysis Text-to-Video (with audio)', icon: '🎥' },
        { id: 'arena_image_to_video_elo', label: 'arena.ai Image-to-Video', icon: '📽️' },
        { id: 'arena_video_edit_elo',     label: 'arena.ai Video Edit',     icon: '✂️' }
    ],
    _initialized: false,

    render: function() {
        if (this._initialized) return;
        if (!window.App || !window.App.data) return;
        if (!window.ImageGen) return;
        var scores = window.App.data.scores || [];
        var models = window.App.data.models || [];
        var modelById = {};
        models.forEach(function(m) { modelById[m.id] = m; });

        var container = document.getElementById('video-gen-content');
        if (!container) return;
        container.textContent = '';

        var stack = document.createElement('div');
        stack.className = 'space-y-8';

        var videoModels = new Set();
        this.BOARDS.forEach(function(board) {
            var rows = scores.filter(function(s) { return s.benchmark_id === board.id; })
                              .sort(function(a, b) { return (b.value || 0) - (a.value || 0); });
            if (rows.length === 0) return;
            rows.forEach(function(s) { videoModels.add(s.model_id); });
            // Reuse ImageGen's card builder (same row shape)
            stack.appendChild(window.ImageGen._makeBoardCard(board, rows, modelById));
        });

        var vendorSet = new Set();
        videoModels.forEach(function(mid) { var m = modelById[mid]; if (m && m.vendor) vendorSet.add(m.vendor); });
        var meta = document.createElement('div');
        meta.className = 'text-xs text-gray-500 mt-4 px-2';
        meta.textContent = 'Video Gen coverage: ' + videoModels.size + ' models · ' + vendorSet.size + ' vendors · ' + this.BOARDS.length + ' arena boards';
        stack.appendChild(meta);

        container.appendChild(stack);
        this._initialized = true;
    }
};
