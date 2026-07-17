// Minify dashboard JS in place. Run at deploy time on the STAGED copy
// (public/js), never on the source tree — source stays readable/debuggable.
//
//   node scripts/minify-dashboard-js.mjs [dir]   (default dir: public/js)
//
// esbuild minifies each file independently (no bundling), preserving global
// names (window.App, var Theme, …) so the existing <script> load order and
// cross-file globals keep working. index.html references js/<name>.js by the
// same filename, so no HTML change is needed.
import { build } from 'esbuild';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const dir = process.argv[2] || 'public/js';
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));

let before = 0;
let after = 0;
for (const f of files) {
  const p = join(dir, f);
  before += statSync(p).size;
  await build({
    entryPoints: [p],
    outfile: p,
    minify: true,
    allowOverwrite: true,
    legalComments: 'none',
    logLevel: 'error',
    // Vanilla ES5/ES6 dashboard code — keep a conservative target so no
    // syntax is down/upleveled in a way that changes behavior.
    target: 'es2018',
  });
  after += statSync(p).size;
}

const pct = before ? Math.round((100 * (before - after)) / before) : 0;
console.log(
  `[minify:js] ${files.length} files in ${dir}: ` +
    `${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (${pct}% smaller)`
);
