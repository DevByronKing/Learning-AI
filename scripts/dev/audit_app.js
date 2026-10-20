/* Audit automático de features: coleta erros de console, exceções, requests falhos,
 * overflow horizontal e imagens quebradas em cada aba, em desktop/mobile e tema claro/escuro.
 * Uso: node scripts/dev/audit_app.js [baseUrl]
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const TABS = [
  'landing', 'dashboard', 'simulator', 'flashcards', 'mistakes', 'vademecum', 'questions',
  'edital', 'cycle', 'discursivas', 'summaries', 'psychometrics', 'radar', 'guide',
  'pricing-plans', 'settings', 'checkout', 'subscription', 'help',
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const THEMES = ['light', 'dark'];

const IGNORED = [/favicon/i, /Download the React DevTools/i, /\[Fast Refresh\]/i, /webpack-hmr/i];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const report = [];

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      await context.addInitScript((t) => {
        try {
          localStorage.setItem('learning_ai_theme', t);
          localStorage.setItem('learning_ai_onboarding_completed', 'true');
          sessionStorage.setItem('learning_ai_splash_shown', 'true');
        } catch (e) {}
      }, theme);

      for (const tab of TABS) {
        const page = await context.newPage();
        const issues = [];
        page.on('console', (msg) => {
          const type = msg.type();
          if (type !== 'error' && type !== 'warning') return;
          const text = msg.text();
          if (IGNORED.some((r) => r.test(text))) return;
          issues.push({ kind: `console.${type}`, text: text.slice(0, 400) });
        });
        page.on('pageerror', (err) => issues.push({ kind: 'pageerror', text: String(err.message || err).slice(0, 400) }));
        page.on('requestfailed', (req) => {
          const url = req.url();
          if (IGNORED.some((r) => r.test(url))) return;
          issues.push({ kind: 'requestfailed', text: `${req.method()} ${url} :: ${req.failure()?.errorText}` });
        });
        page.on('response', (res) => {
          if (res.status() >= 400) issues.push({ kind: `http.${res.status()}`, text: res.url() });
        });

        try {
          await page.goto(`${BASE}/?tab=${tab}`, { waitUntil: 'networkidle', timeout: 45000 });
          await page.waitForTimeout(1200);

          const dom = await page.evaluate(() => {
            const de = document.documentElement;
            const brokenImgs = Array.from(document.images)
              .filter((i) => i.complete && i.naturalWidth === 0 && i.src)
              .map((i) => i.src);
            const h1 = document.querySelectorAll('h1').length;
            return {
              overflowX: de.scrollWidth - window.innerWidth,
              brokenImgs,
              h1,
              title: document.title,
              bodyTextLen: (document.body.innerText || '').length,
            };
          });
          if (dom.overflowX > 2) issues.push({ kind: 'layout.overflowX', text: `${dom.overflowX}px` });
          dom.brokenImgs.forEach((src) => issues.push({ kind: 'img.broken', text: src }));
          if (dom.bodyTextLen < 200) issues.push({ kind: 'render.empty', text: `texto=${dom.bodyTextLen}` });
        } catch (e) {
          issues.push({ kind: 'navigation', text: String(e.message).slice(0, 300) });
        }

        report.push({ viewport: vp.name, theme, tab, issues });
        await page.close();
      }
      await context.close();
    }
  }

  await browser.close();

  const out = path.join(__dirname, 'audit_report.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));

  // Resumo agrupado por (kind,text) para evitar ruído repetido
  const grouped = new Map();
  report.forEach((r) =>
    r.issues.forEach((i) => {
      const key = `${i.kind} :: ${i.text}`;
      if (!grouped.has(key)) grouped.set(key, new Set());
      grouped.get(key).add(`${r.viewport}/${r.theme}/${r.tab}`);
    })
  );
  console.log(`\n=== AUDIT: ${report.length} páginas, ${grouped.size} problemas únicos ===`);
  for (const [key, where] of grouped) {
    const list = Array.from(where);
    console.log(`\n• ${key}\n    em ${list.length} página(s): ${list.slice(0, 6).join(', ')}${list.length > 6 ? ', ...' : ''}`);
  }
  console.log(`\nRelatório completo: ${out}`);
})();
