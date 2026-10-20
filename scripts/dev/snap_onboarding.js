const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 1. Ir para a página e abrir onboarding
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Clicar no botão 'Testar Onboarding' no canto inferior ou no CTA do Hero
  const testOnboardingBtn = await page.$('button:has-text("Testar Onboarding")');
  if (testOnboardingBtn) {
    await testOnboardingBtn.click();
  } else {
    const diagBtn = await page.$('button:has-text("Fazer Diagnóstico Grátis")');
    if (diagBtn) await diagBtn.click();
  }

  await page.waitForTimeout(500);
  // Snapshot Step 1
  await page.screenshot({ path: 'public/onboarding_step1.png' });

  // Avançar para Step 2
  const nextBtn = await page.$('button:has-text("Mapear Campo de Batalha")');
  if (nextBtn) await nextBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'public/onboarding_step2.png' });

  // Avançar para Step 3
  const nextBtn2 = await page.$('button:has-text("Mapear Calcanhar de Aquiles")');
  if (nextBtn2) await nextBtn2.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'public/onboarding_step3.png' });

  // Avançar para Step 4
  const nextBtn3 = await page.$('button:has-text("Conhecer Seu Guardião")');
  if (nextBtn3) await nextBtn3.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'public/onboarding_step4.png' });

  // Avançar para Step 5 (Compilação)
  const nextBtn4 = await page.$('button:has-text("Compilar Meu Plano de Guerra")');
  if (nextBtn4) await nextBtn4.click();
  // Esperar a compilação de 1.5s terminar
  await page.waitForTimeout(2200);
  await page.screenshot({ path: 'public/onboarding_step5_passport.png' });

  // Testar Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'public/onboarding_dark_mode.png' });

  await browser.close();
  console.log('Todos os 5 passos do Onboarding foram capturados com sucesso!');
})();
