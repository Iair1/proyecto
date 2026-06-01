import React, { useState } from 'react'

export default function PruebaConexion() {
  const [resultado, setResultado] = useState<string>("");

  const handleClick = async () => {
    try {
      const res = await fetch("/api/usuarios/prueba");
      const data = await res.json();
      console.log(data);
      setResultado(JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const iniciarSesion = async (nombre: string, contrasena: string) => {
    const response = await fetch("/api/usuarios/iniciarSesion", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, contrasena }),
    })
    const token = await response.json();
    console.log(token);
  }

  return (

    <div style={{ width: "100px", height: "100%" }}>
      <button
        id="pruebaConexion"
        onClick={handleClick}
        style={{ width: "100px", height: "50%" }}
      >
        Probar conexión
        
      </button>

      <div style={{ width: "100px", height: "50%", backgroundColor: "red"}}>
        <input
        id="nombre"
        type="text"
        placeholder="Usuario"
      />
      <input
        id="contrasena"
        type="password"
        placeholder="Contraseña"
      />
      <button
        onClick={() => {
          const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
          const contrasena = (document.getElementById("contrasena") as HTMLInputElement).value;
          iniciarSesion(nombre, contrasena);
        }}
      >
        Iniciar Sesión
      </button>
      </div>
  </div>

  );
}