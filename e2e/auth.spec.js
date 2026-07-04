// e2e/auth.spec.js
import { test, expect } from '@playwright/test';
import { loginViaUI, esperarAppLista } from './utils.js';

const USUARIO = 'e2e_usuario';
const CONTRASENA = 'e2e_contrasena_123';

test.describe('Autenticación', () => {
  test('un usuario nuevo puede registrarse y luego iniciar sesión', async ({ page }) => {
    await esperarAppLista(page);


    await page.getByRole('button', { name: 'Registrarse' }).click();
    const registro = page.locator('#registrarse');
    await expect(registro).toBeVisible();

    await registro.locator('#nombreCC').fill(USUARIO);
    await registro.locator('#contrasenaCC').fill(CONTRASENA);

    const respuestaRegistro = page.waitForResponse((res) =>
      res.url().includes('/api/usuarios/registrarse')
    );
    await registro.getByRole('button', { name: 'Crear Cuenta' }).click();
    expect((await respuestaRegistro).status()).toBe(201);

    // ── Login con la cuenta recién creada ──
    await registro.locator('#cerrarR').click();
    await loginViaUI(page, USUARIO, CONTRASENA);


    page.once('dialog', (d) => d.dismiss());
    await page.locator('.plcl').first().click();
    await page.getByRole('button', { name: /Agregar a mi lista/ }).click();

    await expect(page.locator('#MiLista .plcl')).toHaveCount(1);
  });

  test('con contraseña incorrecta no se otorga acceso a Mi Lista', async ({ page }) => {
    await esperarAppLista(page);
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    const login = page.locator('#login');
    await login.locator('#nombre').fill(USUARIO);
    await login.locator('#contrasena').fill('contraseña_incorrecta');

    const respuestaLogin = page.waitForResponse((res) =>
      res.url().includes('/api/usuarios/iniciarSesion')
    );
    await login.getByRole('button', { name: 'Iniciar Sesión' }).click();
    expect((await respuestaLogin).status()).toBe(500);
    await login.locator('#cerrarL').click();

    const dialogPromise = page.waitForEvent('dialog');
    await page.locator('.plcl').first().click();
    await page.getByRole('button', { name: /Agregar a mi lista/ }).click();
    await (await dialogPromise).dismiss();

    await expect(page.locator('#MiLista .plcl')).toHaveCount(0);
  });

  test('cerrar sesión vacía Mi Lista en pantalla', async ({ page }) => {
    await loginViaUI(page, USUARIO, CONTRASENA);

    page.once('dialog', (d) => d.dismiss());
    await page.locator('.plcl').first().click();
    await page.getByRole('button', { name: /Agregar a mi lista/ }).click();
    await expect(page.locator('#MiLista .plcl')).toHaveCount(1);

    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();

    await expect(page.locator('#MiLista')).toBeEmpty();
  });
});