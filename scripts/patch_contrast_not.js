const fs = require('fs');
const f = 'src/styles/globals.css';
let s = fs.readFileSync(f, 'utf8');
const marker = 'CONTRASTE WCAG AA';
const i = s.indexOf(marker);
if (i < 0) throw new Error('marker not found');
const head = s.slice(0, i);
let tail = s.slice(i);
tail = tail.split(':not(.preserve-dark *):not(.force-white *)').join(
  ':not(.preserve-dark *):not(.force-white *):not(.bg-slate-900 *):not(.bg-slate-950 *)'
);
fs.writeFileSync(f, head + tail, 'utf8');
console.log('ok');
