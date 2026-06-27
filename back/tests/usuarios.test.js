// back/tests/usuarios.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../api/index.js";

describe("POST /api/usuarios/iniciarSesion", () => {

  it("devuelve 200 con token y mi_lista para credenciales válidas", async () => {
    const res = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ nombre: "testUsuario", contrasena: "testContrasena" });

    console.log("Status:", res.status);
    console.log("Body:", res.body);
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

  it("devuelve 400 si faltan campos", async () => {
    const res = await request(app)
      .post("/api/usuarios/iniciarSesion")
      .send({ nombre: "test.usuario" }); // sin contraseña

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Debe completar todos los campos");
  });

});