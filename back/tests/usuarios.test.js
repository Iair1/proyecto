import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock de pg ANTES de importar el servicio ──
vi.mock("pg", () => {
  const Client = vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(undefined),
    query: vi.fn(),
    end:   vi.fn().mockResolvedValue(undefined),
  }));
  return { default: { Client } };
});

import UsuariosService from "../services/usuarios.service.js";

describe("UsuariosService.prueba()", () => {

  it("devuelve el mensaje de éxito", async () => {
    const resultado = await UsuariosService.prueba();
    expect(resultado).toEqual({ HOLA: "PASASTE LA PRUEBA EXITOSAMENTE" });
  });

});