import { test, expect } from '@playwright/test';

test.describe('Jornada do Aluno E2E — Learning AI (Navegador Real)', () => {
  test('deve carregar a aplicação com sucesso e renderizar a identidade visual', async ({ page }) => {
    // 1. Navega para a página principal
    await page.goto('/');

    // 2. Valida o título do documento e metadados
    await expect(page).toHaveTitle(/Learning AI|AprovaLens/i);

    // 3. Valida a presença da interface principal ou da landing page
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // 4. Confere que a página não possui erros fatais de renderização
    const errorBoundary = page.locator('text=Ops! Algo deu errado');
    await expect(errorBoundary).not.toBeVisible();
  });

  test('deve navegar para a página de Termos de Uso e exibir o conteúdo legal', async ({ page }) => {
    await page.goto('/termos');

    await expect(page).toHaveTitle(/Termos/i);
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Link para voltar ao início
    const backLink = page.locator('text=Voltar para o Início');
    await expect(backLink).toBeVisible();
  });

  test('deve navegar para a página de Privacidade e Política de Dados', async ({ page }) => {
    await page.goto('/privacidade');

    await expect(page).toHaveTitle(/Privacidade/i);
    const heading = page.getByRole('heading', { name: /Privacidade/i }).first();
    await expect(heading).toBeVisible();

    const lgpdMention = page.locator('text=LGPD').first();
    await expect(lgpdMention).toBeVisible();
  });

  test('deve responder com status 200 nas rotas de API públicas', async ({ request }) => {
    // Teste E2E das APIs em execução real
    const leadsRes = await request.get('/api/leads');
    expect(leadsRes.status()).toBe(200);

    const leadsData = await leadsRes.json();
    expect(leadsData.success).toBe(true);
    expect(typeof leadsData.totalLeads).toBe('number');
  });
});
