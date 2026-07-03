// e2e/catalogo.spec.js
import { test, expect } from '@playwright/test';

test.describe('Catálogo — búsqueda y filtros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');  
    await page.locator('#sacaraside').click();
  });

  test('buscar por nombre muestra solo las coincidencias', async ({ page }) => {
    // "Los impresionantes" aparece en 2 secciones (PodriaGustarte, Clasicos)
    // y es el único título que matchea "impresionantes".
    await page.locator('#buscador').fill('impresionantes');

    await expect(page.locator('.plcl')).toHaveCount(2);
    await expect(page.locator('.plcl').first()).toContainText('Los impresionantes');
  });

  test('buscar algo que no existe deja el catálogo vacío', async ({ page }) => {
    await page.locator('#buscador').fill('esta pelicula no existe');

    await expect(page.locator('.plcl')).toHaveCount(0);
  });

  test('filtrar por género muestra solo películas de ese género', async ({ page }) => {
    // "Romance" (filtro3) solo lo tiene "El fin del verano",
    // que aparece en 2 secciones (MasPopulares, LoMasNuevo).
    const filtroRomance = page.locator('#filtro3');
    await filtroRomance.click();

    await expect(filtroRomance).toHaveClass(/active/);
    await expect(page.locator('.plcl')).toHaveCount(2);
    await expect(page.locator('.plcl').first()).toContainText('El fin del verano');

    // Sacar el filtro vuelve a mostrar todo el catálogo
    await filtroRomance.click();
    await expect(filtroRomance).not.toHaveClass(/active/);
    await expect(page.locator('.plcl').first()).toBeVisible();
    await expect(page.locator('.plcl')).not.toHaveCount(2);
  });
});