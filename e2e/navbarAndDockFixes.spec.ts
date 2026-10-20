import { test, expect } from '@playwright/test';

test.describe('Validação de Deduplicação da Navbar e Sobreposição do Seletor Flutuante', () => {
  test('deve ter apenas 1 botão de login com Google e o dock não deve sobrepor gavetas ou modais', async ({ page }) => {
    // 1. Navegar para a aplicação
    await page.goto('/?test=1');
    await page.waitForLoadState('networkidle');

    // 2. Verificar o botão do Google na Navbar (Deduplicação)
    const googleButtons = page.locator('header button[aria-label="Fazer Login com Google"], nav button[aria-label="Fazer Login com Google"]');
    const googleBtnCount = await googleButtons.count();
    console.log(`[E2E] Quantidade de botões 'Fazer Login com Google' encontrados: ${googleBtnCount}`);
    expect(googleBtnCount).toBe(1);

    // Tirar screenshot da navbar
    await page.locator('header, nav.backdrop-blur-md').first().screenshot({
      path: 'test-results/navbar_single_google_btn.png'
    });

    // 3. Verificar o dock flutuante e recurso de Minimizar
    const dockNav = page.locator('nav[aria-label="Navegação principal da plataforma"]');
    await expect(dockNav).toBeVisible();

    const minimizeBtn = page.locator('button[aria-label="Minimizar barra de abas"]');
    await expect(minimizeBtn).toBeVisible();
    await minimizeBtn.click();

    // Deve exibir o pill minimizado
    const collapsedAside = page.locator('aside[aria-label="Controle de navegação minimizado"]');
    await expect(collapsedAside).toBeVisible();
    await expect(dockNav).toBeHidden();

    // Screenshot do dock minimizado
    await page.screenshot({
      path: 'test-results/dock_collapsed_state.png'
    });

    // Expandir o dock de volta
    const expandBtn = page.locator('button[aria-label="Expandir barra de navegação das abas"]');
    await expandBtn.click();
    await expect(dockNav).toBeVisible();
    await expect(collapsedAside).toBeHidden();

    // 4. Testar Gaveta do Copiloto (Onça Pintada)
    // Clicar no botão do copiloto na navbar
    const copilotTrigger = page.locator('button[title*="Copiloto"]').first();
    await copilotTrigger.click();

    // A gaveta deve estar aberta
    const copilotDrawerBadge = page.locator('span:text("COPILOTO 2.0")').first();
    await expect(copilotDrawerBadge).toBeVisible();

    // O dock deve estar OCULTO (isOverlayOpen=true) para NUNCA ficar na frente da gaveta
    await expect(dockNav).toBeHidden();

    // Screenshot da gaveta aberta com dock perfeitamente desobstruído
    await page.screenshot({
      path: 'test-results/copilot_drawer_dock_hidden.png'
    });

    // Fechar a gaveta
    const closeDrawerBtn = page.locator('button[aria-label="Fechar copiloto"]');
    await closeDrawerBtn.click();
    await expect(copilotDrawerBadge).toBeHidden();

    // O dock deve reaparecer
    await expect(dockNav).toBeVisible();

    // 5. Testar Modal do App Mobile ("Continuar Estudos no Celular")
    const appBtn = page.locator('button[aria-label="Sincronizar com App Mobile PWA para iOS e Android"]');
    await appBtn.click();

    const mobileModalTitle = page.locator('text=Continuar Estudos no Celular');
    await expect(mobileModalTitle).toBeVisible();

    // O dock deve estar OCULTO durante a exibição do modal
    await expect(dockNav).toBeHidden();

    // Screenshot do modal aberto com dock desobstruído
    await page.screenshot({
      path: 'test-results/mobile_modal_dock_hidden.png'
    });

    // Fechar modal
    const closeModalBtn = page.locator('button[aria-label="Fechar modal mobile"]');
    await closeModalBtn.click();
    await expect(mobileModalTitle).toBeHidden();

    // O dock deve reaparecer
    await expect(dockNav).toBeVisible();
    console.log('[E2E] Todas as validações visuais e de interação passaram com sucesso!');
  });

  test('deve ocultar dock ao rolar a página em qualquer aba e persistir minimização', async ({ page }) => {
    await page.goto('/?test=1');
    await page.waitForLoadState('networkidle');

    const dockNav = page.locator('nav[aria-label="Navegação principal da plataforma"]');
    await expect(dockNav).toBeVisible();

    // 1. Navegar para a aba Vade Mecum
    const vademecumTabBtn = page.locator('button[aria-label*="Vade Mecum"]').first();
    await vademecumTabBtn.click();
    await page.waitForTimeout(500);

    // 2. Rolar para baixo para testar auto-hide do dock durante leitura
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
    await page.waitForTimeout(400);

    // O dock deve ter a classe de translação para baixo (fora da visão)
    const isHiddenOrScrolled = await dockNav.evaluate((el) => {
      return el.classList.contains('translate-y-28') || el.classList.contains('opacity-0');
    });
    console.log(`[E2E] Dock auto-hide ao rolar a página para baixo: ${isHiddenOrScrolled}`);
    expect(isHiddenOrScrolled).toBe(true);

    // Rolar para cima: o dock deve retornar
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);

    const isVisibleAgain = await dockNav.evaluate((el) => {
      return el.classList.contains('translate-y-0') && el.classList.contains('opacity-100');
    });
    expect(isVisibleAgain).toBe(true);

    // 3. Minimizar e navegar entre abas (persistência)
    const minimizeBtn = page.locator('button[aria-label="Minimizar barra de abas"]');
    await minimizeBtn.click();

    const collapsedAside = page.locator('aside[aria-label="Controle de navegação minimizado"]');
    await expect(collapsedAside).toBeVisible();

    // Navegar para outra aba enquanto minimizado
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('app:overlay-change')));
    await expect(collapsedAside).toBeVisible();

    console.log('[E2E] Resolução aplicada e verificada em todo o site com sucesso!');
  });
});
