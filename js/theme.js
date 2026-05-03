/**
 * Design Token Theme for ECharts and JS-rendered UI.
 * Mirrors css/tokens.css. Do NOT hardcode hex values elsewhere — consume
 * Theme.* so a single edit here propagates everywhere.
 */
var Theme = {
    /* Surfaces */
    bgPage:    '#030712',
    bgSurface: '#111827',
    bgRaised:  '#1f2937',
    bgSunken:  '#0f172a',

    /* Text */
    textPrimary:   '#e5e7eb',
    textBody:      '#f3f4f6',
    textSecondary: '#d1d5db',
    textMuted:     '#9ca3af',
    textDim:       '#6b7280',
    textDisabled:  '#4b5563',
    textWhite:     '#fff',

    /* Lines */
    border:       '#1f2937',
    borderStrong: '#374151',

    /* Accent */
    accent:         '#60a5fa',
    accentStrong:   '#3b82f6',

    /* Semantic — chart cell fills (match css/tokens.css --color-*) */
    bestBg:  '#065f46',
    bestFg:  '#6ee7b7',
    worstBg: '#450a0a',
    worstFg: '#fca5a5',

    /* Chart series — rank 1..6 ordering; reuse for bar/line/radar */
    series: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    rankColor: function(i) { return Theme.series[i] || Theme.textDim; },

    /* Heatmap: indigo → green gradient */
    heatmap: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8', '#22c55e', '#4ade80'],

    /* Source tags */
    sourcePdf: '#8b5cf6',
    sourceWeb: '#6b7280',

    /* Accent hash-colors for source badges (modal, leaderboard) */
    accentEmerald: '#34d399',
    accentAmber:   '#fbbf24',
    accentBlue:    '#93c5fd'
};

// Theme toggle — applies a class to <html> and persists in localStorage
(function() {
    'use strict';

    var STORAGE_KEY = 'dashboard-theme';

    function getTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    function applyTheme(theme) {
        var root = document.documentElement;
        if (theme === 'light') {
            root.classList.remove('theme-dark');
            root.classList.add('theme-light');
            document.body.classList.remove('bg-gray-950', 'text-gray-100');
            document.body.classList.add('bg-gray-50', 'text-gray-900');
        } else {
            root.classList.remove('theme-light');
            root.classList.add('theme-dark');
            document.body.classList.remove('bg-gray-50', 'text-gray-900');
            document.body.classList.add('bg-gray-950', 'text-gray-100');
        }
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.textContent = theme === 'light' ? '☀️ Light' : '🌙 Dark';
        }
        // Notify charts that theme changed — they may want to reinit
        document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: theme } }));
    }

    // Apply on page load
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme(getTheme());
        var btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function() {
                var current = getTheme();
                var next = current === 'dark' ? 'light' : 'dark';
                try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
                applyTheme(next);
            });
        }
    });
}());
