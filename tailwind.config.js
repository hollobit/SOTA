/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './dashboard/**/*.html',
    './dashboard/**/*.js'
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontSize: {
        /* Semantic typography ramp — use these instead of text-{size} on
           headings so the scale stays consistent across the dashboard. */
        'display': ['1.875rem', { lineHeight: '1.2', fontWeight: '700' }],
        'section': ['1.25rem',  { lineHeight: '1.3', fontWeight: '600' }],
        'widget':  ['1rem',     { lineHeight: '1.4', fontWeight: '600' }],
        'meta':    ['0.75rem',  { lineHeight: '1.4' }]
      }
    }
  },
  plugins: []
};
