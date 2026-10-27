// Resumo ordenado do report.json do ui_audit
const fs = require('fs');
const r = JSON.parse(fs.readFileSync(process.argv[2] || 'test-results/ui-audit/report.json', 'utf8'));
const mode = process.argv[3] || 'summary';

if (mode === 'summary') {
  const rows = r.map((e) => ({
    k: `${e.viewport}/${e.theme}/${e.tab}`,
    score: e.error ? 999 : e.contrastFailCount * 5 + e.contrastLowCount + e.cutOff.length * 4 + e.themeLeaks.length * 2 + e.overflowOffenders.length * 4 + (e.docOverflow ? 10 : 0) + e.clipped.length * 2 + e.brokenText.length * 6,
    e,
  })).sort((a, b) => b.score - a.score);
  for (const { k, score, e } of rows.slice(0, 40)) {
    console.log(String(score).padStart(4), k.padEnd(34), e.error ? 'ERR ' + e.error : `fail=${e.contrastFailCount} low=${e.contrastLowCount} cut=${e.cutOff.length} leak=${e.themeLeaks.length} ovf=${e.overflowOffenders.length}${e.docOverflow ? '!' : ''} clip=${e.clipped.length} txt=${e.brokenText.length}`);
  }
  const tot = (f) => r.reduce((s, e) => s + (e[f] ? (Array.isArray(e[f]) ? e[f].length : e[f]) : 0), 0);
  console.log('\nTOTAIS pages=%d fail=%d low=%d cut=%d leak=%d ovf=%d clip=%d txt=%d', r.length, tot('contrastFailCount'), tot('contrastLowCount'), tot('cutOff'), tot('themeLeaks'), tot('overflowOffenders'), tot('clipped'), tot('brokenText'));
} else {
  // detalhe agregado por tipo, deduplicando por seletor
  const agg = (field, keyFn, fmt) => {
    const m = new Map();
    for (const e of r) for (const it of e[field] || []) {
      const k = keyFn(it);
      if (!m.has(k)) m.set(k, { it, where: new Set() });
      m.get(k).where.add(`${e.viewport[0]}/${e.theme[0]}/${e.tab}`);
    }
    console.log(`\n=== ${field} (${m.size} únicos) ===`);
    for (const { it, where } of [...m.values()].slice(0, +process.argv[4] || 40)) console.log(fmt(it), '\n     @', [...where].slice(0, 6).join(', '), where.size > 6 ? `(+${where.size - 6})` : '');
  };
  const f = process.argv[3];
  if (f === 'fails') agg('contrastFails', (i) => i.sel + i.text, (i) => `${i.ratio} fg=${i.fg} bg=${i.bg} "${i.text}" ${i.sel}`);
  if (f === 'lows') agg('contrastLows', (i) => i.sel, (i) => `${i.ratio} fg=${i.fg} bg=${i.bg} ${i.size}px "${i.text}" ${i.sel}`);
  if (f === 'cut') agg('cutOff', (i) => i.sel, (i) => `${i.visiblePct}% <${i.tag}> "${i.text}" ${i.sel} [${i.left}..${i.right}]`);
  if (f === 'leaks') agg('themeLeaks', (i) => i.sel, (i) => `bg=${i.bg} ${i.w}x${i.h} "${i.text}" ${i.sel}`);
  if (f === 'ovf') agg('overflowOffenders', (i) => i.sel, (i) => `${i.sel} [${i.left}..${i.right}] w=${i.width}`);
  if (f === 'clip') agg('clipped', (i) => i.sel, (i) => `${i.kind} ${i.sel} "${i.text}" ${i.sw}/${i.cw} ${i.sh}/${i.ch}`);
  if (f === 'txt') agg('brokenText', (i) => i, (i) => i);
  if (f === 'errs') agg('consoleErrors', (i) => i, (i) => i);
}
