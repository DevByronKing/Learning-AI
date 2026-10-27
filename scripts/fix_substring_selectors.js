/**
 * Migração única: troca seletores de substring [class*="from-x-950"] etc. por casamento de TOKEN
 * INTEIRO, para que NÃO casem com variantes "dark:from-x-950/25" (exclusivas do modo escuro).
 *
 * Uso: node scripts/fix_substring_selectors.js [--write]
 */
const fs = require('fs');
const path = require('path');

const file = path.resolve('src/styles/globals.css');
const src = fs.readFileSync(file, 'utf8');

const exactWithOpacity = (t) => `:is([class~="${t}"], [class*=" ${t}/"], [class^="${t}/"])`;
const prefixAnyShade = (t) => `:is([class*=" ${t}-"], [class^="${t}-"])`;

let count = 0;
const skipped = new Set();

const out = src.replace(/\[class\*="([^"]+)"\]/g, (full, token) => {
  // from-slate-950, bg-indigo-600, via-teal-50 ...
  if (/^(from|via|to|bg)-[a-z]+-\d+$/.test(token)) { count++; return exactWithOpacity(token); }
  // bg-dark-surface / bg-dark-card
  if (/^bg-dark-(surface|card)$/.test(token)) { count++; return exactWithOpacity(token); }
  // from-blue, from-indigo (qualquer tom)
  if (/^(from|via|to)-[a-z]+$/.test(token)) { count++; return prefixAnyShade(token); }
  skipped.add(token);
  return full;
});

console.log(`Seletores migrados: ${count}`);
console.log('Mantidos (genéricos de propósito):', [...skipped].join(', '));

if (process.argv.includes('--write')) {
  fs.writeFileSync(file, out, 'utf8');
  console.log('globals.css atualizado.');
} else {
  console.log('(dry-run) use --write para aplicar');
}
