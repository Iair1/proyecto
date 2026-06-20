import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// ── Mock de pg ANTES de importar la app ──
vi.mock("pg", () => {
  const Client = vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(undefined),
    query:   vi.fn(),
    end:     vi.fn().mockResolvedValue(undefined),
  }));
  return { default: { Client } };
});

import app from "../../api/index.js";

describe("GET /api/usuarios/prueba", () => {

  it("devuelve 200 y el mensaje de éxito", async () => {
    const res = await request(app).get("/api/usuarios/prueba");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      messaje: "Prueba exitosa",
      mensaje: { HOLA: "PASASTE LA PRUEBA EXITOSAMENTE" }
    });
  });

});