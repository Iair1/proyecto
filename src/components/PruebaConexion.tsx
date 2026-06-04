import React, { useState } from 'react'


let tokenF: string= "";

export function cerrarSesion () {
  tokenF = "";
}

export async function ponerEnLista(nombreP: string) {
  console.log("Token actual:", tokenF)
  console.log("No te preiugyocupes que me llamaron")
  if (tokenF != "") {
  const respuesta = await fetch("api/usuarios/ponerEnLista", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'authorization':`Bearer ${tokenF}`},
    body: JSON.stringify({peli: nombreP })
  });
    let r = await respuesta.json();
    console.log(r);
    return r;
  } else{
    console.log("Inicie sesion")
  }
}

export async function sacarDeLista(nombreP: string) {
  console.log("Token actual:", tokenF)
  console.log("No te preocupes que me llamaron")
  if (tokenF != "") {
  const respuesta = await fetch("api/usuarios/sacarDeLista", {
    method: 'DELETE',
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
    document.getElementById("nombre")?.setAttribute("value", "");
    document.getElementById("contrasena")?.setAttribute("value", "");
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
    document.getElementById("nombreCC")?.setAttribute("value", "");
    document.getElementById("contrasenaCC")?.setAttribute("value", "");
    const response = await fetch("/api/usuarios/registrarse", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, contrasena }),
    })
    const mensaje = await response.json();
    console.log(mensaje);
  }


  return (

    <div>

      <div id="login" style={{ width: "30%", height: "60%", position: "absolute", top: "20%", left: "40%",zIndex: "999999",
           backgroundColor: "black", display: "none", flexDirection: "column", alignItems: "center", justifyContent: "space-around",
          borderRadius: "20px", border: "1px solid white" }}> 
        <input style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        id="nombre"
        type="text"
        placeholder="Usuario"
      />
      <input style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        id="contrasena"
        type="password"
        placeholder="Contraseña"
      />
      <button style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        onClick={() => {
          const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
          const contrasena = (document.getElementById("contrasena") as HTMLInputElement).value;
          iniciarSesion(nombre, contrasena);
        }}
      >
        Iniciar Sesión
      </button>
      <button id="cerrarL" style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}>
        Cerrar 
      </button>
      </div>

        <div id="registrarse" style={{ width: "30%", height: "60%", position: "absolute", top: "20%", left: "40%", zIndex: "999999",
          backgroundColor: "black", display: "none", flexDirection: "column", alignItems: "center", justifyContent: "space-around",
          borderRadius: "20px", border: "1px solid white" }}>
        <input
        id="nombreCC" style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        type="text"
        placeholder="Usuario"
      />
      <input
        id="contrasenaCC" style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        type="password"
        placeholder="Contraseña"
      />
      <button style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}
        onClick={() => {
          const nombre = (document.getElementById("nombreCC") as HTMLInputElement).value;
          const contrasena = (document.getElementById("contrasenaCC") as HTMLInputElement).value;
          crearCuenta(nombre, contrasena);
        }}
      >
        Crear Cuenta
      </button>
      <button id="cerrarR" style={{  margin: "0", padding: "0", width: "71%", height: "20%", borderRadius: "5px", backgroundColor: "black", border: "1px solid white", color: "white" }}>
        Cerrar 
      </button>
      </div>

  </div>

  );
}