import { expect, test } from '@playwright/test';

test.describe('report form flow', () => {
  test('should submit form and display mocked result', async ({ page }) => {
    await page.route('**/reports', async (route) => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 800);
      });
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'report-e2e-1',
          category: 'Via Pública',
          priority: 'Alta',
          summary: 'Buraco com risco de acidente.',
        }),
      });
    });
    await page.goto('/');
    const locationInput = page.getByLabel('Localização');
    await expect(locationInput).not.toHaveValue('');
    await page.getByLabel('Título').fill('Buraco na rua principal');
    await page.getByLabel('Descrição').fill('Existe um buraco grande no cruzamento.');
    const reportRequestPromise = page.waitForRequest('**/reports');
    await page.getByRole('button', { name: 'Enviar solicitação' }).click();
    const reportRequest = await reportRequestPromise;
    const reportRequestBody =
      reportRequest.postDataJSON() as Record<string, unknown>;
    await expect(page.getByText('Processando... por favor aguarde.')).toBeVisible();
    await expect(page.getByText('Solicitação registrada')).toBeVisible();
    await expect(page.getByText('report-e2e-1')).toBeVisible();
    await expect(page.getByText('Via Pública')).toBeVisible();
    await expect(page.getByText('Alta')).toBeVisible();
    await expect(page.getByText('Buraco com risco de acidente.')).toBeVisible();
    await expect(page.getByText('Erro ao enviar solicitação')).toHaveCount(0);
    expect(reportRequest.method()).toBe('POST');
    expect(reportRequestBody).toEqual(
      expect.objectContaining({
      title: 'Buraco na rua principal',
      description: 'Existe um buraco grande no cruzamento.',
      }),
    );
    const locationValue: unknown = reportRequestBody.location;
    expect(locationValue).toEqual(expect.any(String));
    expect((locationValue as string).trim().length).toBeGreaterThan(0);
  });
});
