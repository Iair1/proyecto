import React, { useState } from 'react'

let tokenF: string= "";

export async function ponerEnLista(nombreP: string) {
  console.log("No te preocupes que me llamaron")
  if (tokenF != "") {
  const respuesta = await fetch("api/usuarios/ponerEnLista", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${tokenF}` },
    body: JSON.stringify({peli: nombreP })
  });
    let r = await respuesta.json();
    console.log(r);
    return r;
  }
}

export async function sacarDeLista(nombreP: string) {
  console.log("No te preocupes que me llamaron")
  if (tokenF != "") {
  const respuesta = await fetch("api/usuarios/sacarDeLista", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${tokenF}` },
    body: JSON.stringify({peli: nombreP })
  });
    let r = await respuesta.json();
    console.log(r);
    return r;
  }
}

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
    const data = await response.json();
    console.log(data);
    console.log(`Mi lista: ${data.mi_lista}`);
    tokenF = data.token;
      /**/
      const evento = new CustomEvent("usuarioLogueado", {
        detail: { mi_lista: data.mi_lista, token: data.token }
      });
      window.dispatchEvent(evento);
      /* */
  }

  const crearCuenta = async (nombre: string, contrasena: string) => {
    const response = await fetch("/api/usuarios/registrarse", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, contrasena }),
    })
    const mensaje = await response.json();
    console.log(mensaje);
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

      <div style={{ width: "100px", height: "25%", backgroundColor: "red"}}>
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

        <div style={{ width: "100px", height: "25%", backgroundColor: "green"}}>
        <input
        id="nombreCC"
        type="text"
        placeholder="Usuario"
      />
      <input
        id="contrasenaCC"
        type="password"
        placeholder="Contraseña"
      />
      <button
        onClick={() => {
          const nombre = (document.getElementById("nombreCC") as HTMLInputElement).value;
          const contrasena = (document.getElementById("contrasenaCC") as HTMLInputElement).value;
          crearCuenta(nombre, contrasena);
        }}
      >
        Crear Cuenta
      </button>
      </div>

  </div>

  );
}