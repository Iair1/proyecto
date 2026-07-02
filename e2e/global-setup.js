// e2e/global-setup.js
// Corre UNA vez antes de toda la suite E2E. Prepara la base de datos para
// que los tests no dependan de que alguien haya sembrado datos a mano.
import 'dotenv/config';
import pkg from 'pg';
import config from '../back/dbconfig.js';

const { Client } = pkg;

export default async function globalSetup() {
  const client = new Client(config);
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS peliculas (
      id SERIAL PRIMARY KEY,
      nombre TEXT UNIQUE NOT NULL,
      portada TEXT NOT NULL
    );
  `);
  await client.query(`
    CREATE TABLE IF NOT EXISTS mi_lista (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES usuarios(id),
      peli_id INTEGER NOT NULL REFERENCES peliculas(id),
      UNIQUE (user_id, peli_id)
    );
  `);

  // IMPORTANTE: "peliculas" se vincula por NOMBRE con el catálogo
  // hardcodeado en src/components/script.astro. Si falta la fila acá,
  // "Agregar a mi lista" falla en el backend aunque el front se vea bien.
  // Sembramos las mismas películas que aparecen primero en el catálogo.
  await client.query(`
    INSERT INTO peliculas (nombre, portada) VALUES
      ('El fin del verano', 'https://example.com/portada.webp'),
      ('Ti', 'https://example.com/portada.webp')
    ON CONFLICT (nombre) DO NOTHING;
  `);

  // Limpieza de usuarios de corridas anteriores para que los tests
  // sean idempotentes (evita choques con la constraint UNIQUE(nombre)).
  await client.query(`DELETE FROM usuarios WHERE nombre LIKE 'e2e\\_%';`);

  await client.end();
}