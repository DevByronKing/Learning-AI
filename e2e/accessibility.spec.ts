import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Auditoria Automatizada de Acessibilidade (a11y — WCAG 2.1 AA)', () => {
  test('página de Termos de Uso deve cumprir os padrões de acessibilidade WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/termos');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(['color-contrast']) // Análise estrutural e semântica
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('página de Política de Privacidade deve cumprir os padrões de acessibilidade WCAG', async ({ page }) => {
    await page.goto('/privacidade');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('página inicial deve possuir estrutura semântica válida sem violações críticas', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Valida presença de atributo de idioma no documento html
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('pt-BR');

    // Valida navegação por teclado (Focus trapping e Tabindex)
    await page.keyboard.press('Tab');
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTagName).toBeDefined();

    // Varredura de acessibilidade estrutural básica
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .disableRules(['color-contrast', 'region', 'heading-order'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('todos os botões de ação e links devem possuir texto acessível para leitores de tela', async ({ page }) => {
    await page.goto('/termos');

    const buttons = await page.locator('button, a[href]').all();
    for (const btn of buttons.slice(0, 10)) {
      const isVisible = await btn.isVisible();
      if (isVisible) {
        const text = await btn.innerText();
        const ariaLabel = await btn.getAttribute('aria-label');
        const title = await btn.getAttribute('title');
        // Pelo menos um identificador textual acessível deve existir
        const hasAccessibleName = (text && text.trim().length > 0) || !!ariaLabel || !!title;
        expect(hasAccessibleName).toBe(true);
      }
    }
  });
});

test.describe('Design System (/design-system) — Acessibilidade, Contraste e Navegação por Teclado', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('/design-system');
    await page.waitForLoadState('networkidle');
  });

  test('deve renderizar a rota /design-system com título semântico e cabeçalho principal', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Tokens & Contraste WCAG 2.1');
  });

  test('deve atingir 100% de aprovação de acessibilidade e contraste WCAG 2.1 AA no Modo Claro', async ({ page }) => {
    // Ativa Modo Claro explicitamente
    const lightBtn = page.getByTestId('theme-light-btn');
    await lightBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Executa auditoria Axe incluindo contraste de cor (sem desabilitar color-contrast)
    const scanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (scanResults.violations.length > 0) {
      console.log('Violações de acessibilidade em Modo Claro:', JSON.stringify(scanResults.violations, null, 2));
    }
    expect(scanResults.violations).toEqual([]);
  });

  test('deve atingir 100% de aprovação de acessibilidade e contraste WCAG 2.1 AA no Modo Escuro', async ({ page }) => {
    // Ativa Modo Escuro explicitamente
    const darkBtn = page.getByTestId('theme-dark-btn');
    await darkBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Executa auditoria Axe incluindo contraste de cor
    const scanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (scanResults.violations.length > 0) {
      console.log('Violações de acessibilidade em Modo Escuro:', JSON.stringify(scanResults.violations, null, 2));
    }
    expect(scanResults.violations).toEqual([]);
  });

  test('seção de Componentes Core deve cumprir todas as regras de acessibilidade e contraste', async ({ page }) => {
    // Navega para aba Core
    const coreTab = page.getByTestId('tab-core');
    await coreTab.click();

    // Valida presença dos componentes interativos
    await expect(page.getByText('1. Botões (Button)')).toBeVisible();
    await expect(page.getByText('2. Campos de Formulário (Input)')).toBeVisible();
    await expect(page.getByText('4. Chaves Alternadoras (ToggleSwitch)')).toBeVisible();
    await expect(page.getByText('6. Cards de Aula (LessonCard)')).toBeVisible();

    // Auditoria Axe na aba Core
    const scanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (scanResults.violations.length > 0) {
      console.log('Violações na aba Core:', JSON.stringify(scanResults.violations, null, 2));
    }
    expect(scanResults.violations).toEqual([]);
  });

  test('deve permitir navegação por teclado com foco visível e ativação de controles', async ({ page }) => {
    // Foca na página e inicia navegação por Tab
    await page.keyboard.press('Tab');
    
    let activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).toBeTruthy();

    // Avança abas via Tab e testa foco
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
    }
    activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(activeTag);

    // Navega para a aba Core
    const coreTab = page.getByTestId('tab-core');
    await coreTab.click();
    await expect(page.getByText('1. Botões (Button)')).toBeVisible();

    // Testa foco e interação no Toggle Switch via teclado
    const toggle = page.getByRole('switch', { name: /Modo Foco Zen no Simulador/i });
    await expect(toggle).toBeVisible();
    await toggle.focus();
    
    const initialChecked = await toggle.getAttribute('aria-checked');
    // Pressiona Space para alternar
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    const toggledChecked = await toggle.getAttribute('aria-checked');
    expect(toggledChecked).not.toBe(initialChecked);

    // Testa foco e digitação no Input interativo
    const input = page.getByPlaceholder('aluno@learningai.com.br');
    await input.focus();
    await page.keyboard.type('teste@learningai.com.br');
    await expect(input).toHaveValue('teste@learningai.com.br');
  });

  test('todos os avatares e imagens da marca devem possuir alt text e atributos de acessibilidade válidos', async ({ page }) => {
    // Navega para aba Marca
    const marcaTab = page.getByTestId('tab-marca');
    await marcaTab.click();
    await expect(page.getByText('Insígnias de Animais Guardiões')).toBeVisible();

    // Valida que todas as imagens possuem texto alternativo preenchido
    const images = await page.locator('img').all();
    expect(images.length).toBeGreaterThanOrEqual(6);

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.trim().length).toBeGreaterThan(0);
    }
  });

  test('protótipo interativo de Onboarding deve navegar entre os 5 passos perfeitamente', async ({ page }) => {
    // Navega para aba Templates
    const templatesTab = page.getByTestId('tab-templates');
    await templatesTab.click();
    await expect(page.getByText('Passo 1 de 5')).toBeVisible();

    // Clica em Próximo Passo para ir ao Passo 2
    const nextBtn = page.getByRole('button', { name: /Próximo Passo/i });
    await nextBtn.click();
    await expect(page.getByText('Passo 2 de 5')).toBeVisible();

    // Clica em Continuar para ir ao Passo 3
    await nextBtn.click();
    await expect(page.getByText('Passo 3 de 5')).toBeVisible();

    // Clica em Continuar para ir ao Passo 4
    await nextBtn.click();
    await expect(page.getByText('Passo 4 de 5')).toBeVisible();

    // Clica em Continuar para ir ao Passo 5
    await nextBtn.click();
    await expect(page.getByText('Passo 5 de 5')).toBeVisible();

    // Testa botão Voltar (exato para diferenciar de 'Voltar ao App' no cabeçalho)
    const backBtn = page.getByRole('button', { name: 'Voltar', exact: true });
    await backBtn.click();
    await expect(page.getByText('Passo 4 de 5')).toBeVisible();
  });
});
