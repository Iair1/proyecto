// e2e/utils.js
const API_BASE = `http://localhost:${process.env.API_PORT || 3000}`;


export async function registrarUsuarioViaAPI(request, nombre, contrasena) {
  await request.post(`${API_BASE}/api/usuarios/registrarse`, {
    data: { nombre, contrasena },
    failOnStatusCode: false, 
  });
}


export async function loginViaUI(page, nombre, contrasena) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

  const login = page.locator('#login');
  await login.locator('#nombre').fill(nombre);
  await login.locator('#contrasena').fill(contrasena);

  const respuestaLogin = page.waitForResponse((res) =>
    res.url().includes('/api/usuarios/iniciarSesion')
  );
  await login.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await respuestaLogin;


  await login.locator('#cerrarL').click();
}
export async function agregarPeliculaViaAPI(request, nombre, contrasena, peli) {
  const loginRes = await request.post(`${API_BASE}/api/usuarios/iniciarSesion`, {
    data: { nombre, contrasena },
  });
  const { token } = await loginRes.json();
  await request.post(`${API_BASE}/api/usuarios/ponerEnLista`, {
    headers: { authorization: `Bearer ${token}` },
    data: { peli },
    failOnStatusCode: false,
  });
}