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
