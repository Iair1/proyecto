// back/tests/usuarios.test.js
import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../api/index.js";
import pkg from "pg";
import config from "../dbconfig.js";
const {Client} = pkg;

let tokenTemporal = null;

const ensureDatabaseSchema = async () => {
  const client = new Client(config);
  try {
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
    await client.query(`
      INSERT INTO peliculas (nombre, portada)
      VALUES 
        ('Ti', 'https://m.media-amazon.com/images/I/71rNJQ2g-EL._AC_SY679_.jpg')
      ON CONFLICT (nombre) DO NOTHING;
    `);
  } finally {
    await client.end();
  }
};

beforeAll(async () => {
  await ensureDatabaseSchema();
});

describe("POST /api/usuarios/registrarse", () => {

  it("crea una cuenta nueva correctamente", async () => {

    const client = new Client(config);
    await client.connect();
    await client.query("DELETE FROM usuarios WHERE nombre = $1", ["usuario.temporal"]);
    await client.end();

    const res = await request(app)
      .post("/api/usuarios/registrarse")
      .send({ nombre: "usuario.temporal", contrasena: "contraseña.temporal" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Cuenta creada exitosamente");
    expect(res.body.usuario).toBe("usuario.temporal");
  });

    it("intenta crear una cuenta ya existente", async () => {

    const res = await request(app)
      .post("/api/usuarios/registrarse")
      .send({ nombre: "usuario.temporal", contrasena: "contraseña.temporal" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Este usuario ya existe");
  });
});

describe("POST /api/usuarios/iniciarSesion", () => {

  it("devuelve 200 con token y mi_lista para credenciales válidas", async () => {
    const res = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ nombre: "usuario.temporal", contrasena: "contraseña.temporal" });

    tokenTemporal = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("mi_lista");
  });

  it("devuelve 500 si el usuario no existe", async () => {
    const res = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ nombre: "no_existe", contrasena: "cualquier_cosa" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Usuario o contraseña incorrectos");
  });
});

describe("POST /api/usuarios/ponerEnLista", () => {

  it("añade una película a la lista del usuario", async () => {
    const res = await request(app)
      .post("/api/usuarios/ponerEnLista")
      .set("authorization", `Bearer ${tokenTemporal}`)
      .send({ peli: "Ti" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Película añadida a la lista");
    expect(res.body.resultado).toEqual(expect.any(Object));;
  });

  it("intenta añadir una película ya existente en la lista", async () => {
    const res = await request(app)
      .post("/api/usuarios/ponerEnLista")
      .set("authorization", `Bearer ${tokenTemporal}`)
      .send({ peli: "Ti" });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Película ya perteneciente a la lista");
  });
});

describe("DELETE /api/usuarios/sacarDeLista", () => {

  it("elimina una película de la lista del usuario", async () => {
    const res = await request(app)
      .delete("/api/usuarios/sacarDeLista")
      .set("authorization", `Bearer ${tokenTemporal}`)
      .send({ peli: "Ti" });

    
    console.log("Status:", res.status);
    console.log("Body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Película eliminada de la lista exitosamente");
  });
});