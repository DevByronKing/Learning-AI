/**
 * Argus — Auditor Visual (Claro/Escuro × Desktop/Mobile)
 *
 * Uso:
 *   node scripts/ui_audit.js
 *   AUDIT_TABS=simulator,mistakes AUDIT_THEMES=dark AUDIT_VIEWPORTS=mobile node scripts/ui_audit.js
 *
 * Saída: test-results/ui-audit/report.json + screenshots por viewport/tema/aba.
 * Requer o servidor rodando em AUDIT_BASE (padrão http://127.0.0.1:3000).
 */
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE = process.env.AUDIT_BASE || 'http://127.0.0.1:3000';
const OUT = path.resolve(process.env.AUDIT_OUT || 'test-results/ui-audit');

const ALL_TABS = [
  'landing', 'edital', 'cycle', 'simulator', 'flashcards', 'mistakes',
  'vademecum', 'summaries', 'discursivas', 'analytics', 'questions',
  'psychometrics', 'radar', 'settings', 'checkout', 'subscription',
  'help', 'pricing-plans',
];
const pick = (envName, all) =>
  process.env[envName] ? process.env[envName].split(',').map((s) => s.trim()).filter(Boolean) : all;

const TABS = pick('AUDIT_TABS', ALL_TABS);
const THEMES = pick('AUDIT_THEMES', ['light', 'dark']);
const VIEWPORT_DEFS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};
const VIEWPORTS = pick('AUDIT_VIEWPORTS', Object.keys(VIEWPORT_DEFS));
const OS_SCHEME = process.env.AUDIT_OS_SCHEME || ''; // força prefers-color-scheme (opcional)
const MAX_SHOT_HEIGHT = 5200;

/** Executado dentro da página. Precisa ser autocontido. */
function analyzeInPage() {
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const vw = window.innerWidth;

  const parse = (str) => {
    if (!str) return null;
    let m = str.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/);
    if (m) {
      const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      return { r: +m[1], g: +m[2], b: +m[3], a };
    }
    m = str.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\)$/);
    if (m) {
      const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      return { r: +m[1] * 255, g: +m[2] * 255, b: +m[3] * 255, a };
    }
    return null;
  };
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const contrast = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const rgbStr = (c) => `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;

  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const baseBg = bodyBg && bodyBg.a > 0.99 ? bodyBg : (theme === 'dark' ? { r: 8, g: 12, b: 20, a: 1 } : { r: 248, g: 250, b: 252, a: 1 });

  const effectiveBg = (el) => {
    const layers = [];
    let node = el;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      const hasImg = cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient|url/.test(cs.backgroundImage);
      const c = parse(cs.backgroundColor);
      if (hasImg && node !== document.body && node !== document.documentElement) {
        // Se ainda não achamos uma cor opaca por cima, o fundo real é desconhecido.
        if (!layers.some((l) => l.a >= 0.999)) return null;
      }
      if (c && c.a > 0) {
        layers.push(c);
        if (c.a >= 0.999) break;
      }
      node = node.parentElement;
    }
    let result = baseBg;
    for (let i = layers.length - 1; i >= 0; i--) result = over(layers[i], result);
    return result;
  };

  const sel = (el) => {
    const parts = [];
    let node = el;
    for (let i = 0; i < 4 && node && node.nodeType === 1 && node !== document.body; i++) {
      let s = node.tagName.toLowerCase();
      if (node.id) { s += '#' + node.id; parts.unshift(s); break; }
      const cls = (typeof node.className === 'string' ? node.className : '')
        .split(/\s+/).filter((c) => c && !/^(dark:|hover:|focus:|sm:|md:|lg:)/.test(c)).slice(0, 3);
      if (cls.length) s += '.' + cls.join('.');
      parts.unshift(s);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const isHiddenChain = (el) => {
    let op = 1;
    let node = el;
    while (node && node.nodeType === 1) {
      const s = getComputedStyle(node);
      if (s.display === 'none' || s.visibility === 'hidden') return { hidden: true, op: 0 };
      op *= parseFloat(s.opacity);
      node = node.parentElement;
    }
    return { hidden: op < 0.05, op };
  };

  // ---------- 1. Contraste de texto ----------
  const contrastFails = [];
  const contrastLows = [];
  let textChecked = 0;
  let textSkipped = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  let tn;
  while ((tn = walker.nextNode())) {
    const txt = tn.nodeValue.trim();
    if (!txt) continue;
    const el = tn.parentElement;
    if (!el || seen.has(el)) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT|TITLE)$/i.test(el.tagName)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const chain = isHiddenChain(el);
    if (chain.hidden) continue;
    const fill = cs.webkitTextFillColor;
    if (fill && /rgba\(0, 0, 0, 0\)|transparent/.test(fill)) { textSkipped++; continue; } // texto com gradiente
    const fg = parse(cs.color);
    const bg = effectiveBg(el);
    if (!fg || !bg) { textSkipped++; continue; }
    const fgA = { ...fg, a: fg.a * chain.op };
    const fgOver = over(fgA, bg);
    const ratio = contrast(fgOver, bg);
    textChecked++;
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const entry = {
      text: txt.slice(0, 60),
      ratio: Math.round(ratio * 100) / 100,
      fg: rgbStr(fgOver),
      bg: rgbStr(bg),
      size,
      weight,
      sel: sel(el),
    };
    if (ratio < 3) contrastFails.push(entry);
    else if (ratio < (large ? 3 : 4.5)) contrastLows.push(entry);
  }

  // ---------- 2. Overflow horizontal ----------
  const docOverflow = document.documentElement.scrollWidth > vw + 1;
  const overflowOffenders = [];
  const clippedByAncestor = (el) => {
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      if (s.overflowX !== 'visible') return true;
      node = node.parentElement;
    }
    return false;
  };
  const all = Array.from(document.body.querySelectorAll('*'));
  for (const el of all) {
    if (overflowOffenders.length >= 12) break;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.right <= vw + 1 && r.left >= -1) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) continue;
    if (cs.position === 'fixed' && (r.left >= vw - 1 || r.right <= 1)) continue; // drawers fora da tela
    if (clippedByAncestor(el)) continue;
    if (overflowOffenders.some((o) => o.el.contains(el))) continue;
    overflowOffenders.push({ el, sel: sel(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
  }

  // ---------- 2b. Elementos interativos/títulos parcialmente cortados ----------
  const cutOff = [];
  const clipRectsFor = (el) => {
    const rects = [{ left: 0, right: vw }];
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      if (s.overflowX !== 'visible') {
        const r = node.getBoundingClientRect();
        rects.push({ left: r.left, right: r.right });
      }
      node = node.parentElement;
    }
    return rects;
  };
  const interesting = document.body.querySelectorAll('button, a[href], input, select, textarea, h1, h2, h3, h4, [role="button"], [role="tab"], label, th, td, li, p, span');
  for (const el of interesting) {
    if (cutOff.length >= 20) break;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue;
    if (/^(SPAN|P|LI|TD|TH|LABEL)$/.test(el.tagName) && !Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.nodeValue.trim())) continue;
    if (isHiddenChain(el).hidden) continue;
    let fixedAncestor = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { if (getComputedStyle(n).position === 'fixed') { fixedAncestor = true; break; } }
    if (fixedAncestor && (r.left >= vw - 1 || r.right <= 1)) continue; // gaveta fora da tela de propósito
    let visL = r.left, visR = r.right;
    for (const c of clipRectsFor(el)) { visL = Math.max(visL, c.left); visR = Math.min(visR, c.right); }
    const visible = Math.max(0, visR - visL);
    const frac = visible / r.width;
    if (frac > 0.02 && frac < 0.92) {
      if (cutOff.some((o) => o.el.contains(el) || el.contains(o.el))) continue;
      cutOff.push({ el, sel: sel(el), tag: el.tagName.toLowerCase(), text: (el.innerText || el.value || '').trim().slice(0, 40), visiblePct: Math.round(frac * 100), left: Math.round(r.left), right: Math.round(r.right) });
    }
  }

  // ---------- 3. Texto cortado ----------
  const clipped = [];
  for (const el of all) {
    if (clipped.length >= 15) break;
    if (!el.childNodes.length) continue;
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!hasText) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const clipX = (cs.overflowX === 'hidden' || cs.overflowX === 'clip') && cs.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 3 && el.clientWidth > 0;
    const lineClamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none';
    const clipY = (cs.overflowY === 'hidden' || cs.overflowY === 'clip') && !lineClamp && el.scrollHeight > el.clientHeight + 3 && el.clientHeight > 0;
    if (clipX || clipY) {
      clipped.push({ kind: clipX ? 'x' : 'y', sel: sel(el), text: el.textContent.trim().slice(0, 50), sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight });
    }
  }

  // ---------- 4. Vazamento de tema (superfícies do tema errado) ----------
  const themeLeaks = [];
  for (const el of all) {
    if (themeLeaks.length >= 15) break;
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 8000) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.5) continue;
    const c = parse(cs.backgroundColor);
    if (!c || c.a < 0.95) continue;
    const L = lum(c);
    const wrongForTheme = theme === 'dark' ? L > 0.7 : L < 0.04;
    if (!wrongForTheme) continue;
    if (!el.textContent.trim() && !el.querySelector('input,button,svg,img,canvas')) continue;
    themeLeaks.push({ sel: sel(el), bg: rgbStr(c), w: Math.round(r.width), h: Math.round(r.height), text: el.textContent.trim().slice(0, 40) });
  }

  // ---------- 5. Textos quebrados ----------
  const bodyText = document.body.innerText || '';
  const brokenText = [];
  const re = /(\bundefined\b|\bNaN\b|\[object Object\]|\bnull\b|Infinity)/g;
  let m;
  while ((m = re.exec(bodyText)) && brokenText.length < 8) {
    brokenText.push(bodyText.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' '));
  }

  // ---------- 6. Imagens quebradas ----------
  const brokenImages = Array.from(document.images)
    .filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0)
    .map((i) => i.currentSrc || i.src)
    .slice(0, 8);

  // ---------- 7. Skeleton ainda visível ----------
  const skeletonVisible = !!document.querySelector('.animate-pulse') && document.querySelectorAll('.animate-pulse').length > 6;

  return {
    theme,
    docOverflow,
    scrollWidth: document.documentElement.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    overflowOffenders: overflowOffenders.map(({ el, ...rest }) => rest),
    cutOff: cutOff.map(({ el, ...rest }) => rest),
    contrastFails: contrastFails.slice(0, 30),
    contrastFailCount: contrastFails.length,
    contrastLows: contrastLows.slice(0, 20),
    contrastLowCount: contrastLows.length,
    textChecked,
    textSkipped,
    clipped,
    themeLeaks,
    brokenText,
    brokenImages,
    skeletonVisible,
  };
}

async function settle(page) {
  await page.waitForSelector('.tab-page-wrapper', { timeout: 60000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1800);
  // Rola a página inteira para disparar animações de entrada / lazy content.
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.7));
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(500);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = [];
  const started = Date.now();

  for (const vpName of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: VIEWPORT_DEFS[vpName],
        colorScheme: OS_SCHEME || theme,
        deviceScaleFactor: 1,
        isMobile: vpName === 'mobile',
        hasTouch: vpName === 'mobile',
      });
      await context.addInitScript((t) => {
        try {
          localStorage.setItem('argus_theme', t);
          localStorage.setItem('argus_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString() }));
        } catch (e) { /* noop */ }
      }, theme);

      for (const tab of TABS) {
        const page = await context.newPage();
        const consoleErrors = [];
        const failedRequests = [];
        page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 200)); });
        page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + String(err.message).slice(0, 200)));
        page.on('requestfailed', (req) => failedRequests.push(req.url().slice(0, 120)));

        const entry = { tab, theme, viewport: vpName };
        try {
          await page.goto(`${BASE}/?tab=${tab}&test=1`, { waitUntil: 'domcontentloaded', timeout: 90000 });
          await settle(page);
          const analysis = await page.evaluate(analyzeInPage);
          Object.assign(entry, analysis);
          const dir = path.join(OUT, vpName, theme);
          fs.mkdirSync(dir, { recursive: true });
          const file = path.join(dir, `${tab}.png`);
          const h = Math.min(analysis.docHeight, MAX_SHOT_HEIGHT);
          await page.screenshot({ path: file, clip: { x: 0, y: 0, width: VIEWPORT_DEFS[vpName].width, height: h }, fullPage: true });
          entry.screenshot = path.relative(process.cwd(), file);
          entry.consoleErrors = consoleErrors.slice(0, 6);
          entry.failedRequests = failedRequests.slice(0, 6);
        } catch (err) {
          entry.error = String(err.message).slice(0, 300);
        }
        report.push(entry);
        const flag = entry.error ? 'ERR' : `fail=${entry.contrastFailCount} low=${entry.contrastLowCount} ovf=${entry.overflowOffenders.length}${entry.docOverflow ? '!' : ''} cut=${entry.cutOff.length} clip=${entry.clipped.length} leak=${entry.themeLeaks.length} txt=${entry.brokenText.length}`;
        console.log(`[${vpName}/${theme}] ${tab.padEnd(14)} ${flag}`);
        await page.close();
      }
      await context.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`\nAuditoria concluída em ${Math.round((Date.now() - started) / 1000)}s → ${path.relative(process.cwd(), path.join(OUT, 'report.json'))}`);
})();
