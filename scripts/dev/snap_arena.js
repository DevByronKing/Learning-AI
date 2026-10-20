const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  // 1. Landing Page
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/landing_clean.png', fullPage: false });

  // 2. Open Pilar Conteúdo Dropdown via hover and click Smart Vade Mecum
  const conteudoBtn = await page.$('button[aria-label="Menu do pilar Conteúdo"]');
  if (conteudoBtn) {
    await conteudoBtn.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/pilar_dropdown_open.png', fullPage: false });

    // Click on Smart Vade Mecum inside dropdown
    const vadeBtn = await page.$('button:has-text("Smart Vade Mecum")');
    if (vadeBtn) {
      await vadeBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'public/vademecum_tab_navigated.png', fullPage: false });
    }
  }

  // 3. Arena Simulator
  await page.goto('http://localhost:3000/?tab=simulator', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/arena_final.png', fullPage: false });

  await browser.close();
  console.log('Saved snapshots');
})();
