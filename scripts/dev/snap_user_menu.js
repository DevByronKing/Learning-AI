const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/?tab=simulator', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Click on user menu
  await page.locator('button[aria-label="Abrir menu da conta e configurações"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/user_menu_open.png', fullPage: false });

  await browser.close();
  console.log('Saved public/user_menu_open.png');
})();
