import React, { useEffect, useRef, useState } from 'react'

let tokenF: string = "";

export function cerrarSesion() {
  tokenF = "";
}

export async function ponerEnLista(nombreP: string) {
  console.log("Token actual:", tokenF)
  if (tokenF != "") {
    const respuesta = await fetch("api/usuarios/ponerEnLista", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${tokenF}` },
      body: JSON.stringify({ peli: nombreP })
    });
    let r = await respuesta.json();
    console.log(r);
    return r;
  } else {
    console.log("Inicie sesion")
  }
}

export async function sacarDeLista(nombreP: string) {
  console.log("Token actual:", tokenF)
  if (tokenF != "") {
    const respuesta = await fetch("api/usuarios/sacarDeLista", {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${tokenF}` },
      body: JSON.stringify({ peli: nombreP })
    });
    let r = await respuesta.json();
    console.log(r);
    return r;
  }
}

type EstadoFormulario = {
  cargando: boolean;
  error: string | null;
  exito: string | null;
}

const ESTADO_INICIAL: EstadoFormulario = { cargando: false, error: null, exito: null };

export default function PruebaConexion() {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [nombreCC, setNombreCC] = useState("");
  const [contrasenaCC, setContrasenaCC] = useState("");

  const [loginEstado, setLoginEstado] = useState<EstadoFormulario>(ESTADO_INICIAL);
  const [registroEstado, setRegistroEstado] = useState<EstadoFormulario>(ESTADO_INICIAL);

  const [modalActivo, setModalActivo] = useState<"login" | "registro" | null>(null);

  const cierreAutomatico = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelarCierreAutomatico = () => {
    if (cierreAutomatico.current) {
      clearTimeout(cierreAutomatico.current);
      cierreAutomatico.current = null;
    }
  };

  const limpiarLogin = () => {
    setNombre("");
    setContrasena("");
    setLoginEstado(ESTADO_INICIAL);
  };

  const limpiarRegistro = () => {
    setNombreCC("");
    setContrasenaCC("");
    setRegistroEstado(ESTADO_INICIAL);
  };

  useEffect(() => {
    const abrirLogin = () => {
      cancelarCierreAutomatico();
      limpiarRegistro();
      setModalActivo("login");
    };
    const abrirRegistro = () => {
      cancelarCierreAutomatico();
      limpiarLogin();
      setModalActivo("registro");
    };

    const btnLogin = document.getElementById("btn-login");
    const btnRegistrarse = document.getElementById("btn-registrarse");
    btnLogin?.addEventListener("click", abrirLogin);
    btnRegistrarse?.addEventListener("click", abrirRegistro);

    return () => {
      btnLogin?.removeEventListener("click", abrirLogin);
      btnRegistrarse?.removeEventListener("click", abrirRegistro);
      cancelarCierreAutomatico();
    };
  }, []);

  const handleCerrarLogin = () => {
    cancelarCierreAutomatico();
    setModalActivo(null);
    limpiarLogin();
  };

  const handleCerrarRegistro = () => {
    cancelarCierreAutomatico();
    setModalActivo(null);
    limpiarRegistro();
  };

  const iniciarSesion = async () => {
    if (loginEstado.cargando) return;
    if (!nombre.trim() || !contrasena) {
      setLoginEstado({ cargando: false, error: "Completá usuario y contraseña.", exito: null });
      return;
    }

    setLoginEstado({ cargando: true, error: null, exito: null });

    try {
      const response = await fetch("/api/usuarios/iniciarSesion", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, contrasena }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginEstado({ cargando: false, error: data.message || "No se pudo iniciar sesión.", exito: null });
        return;
      }

      tokenF = data.token;
      const evento = new CustomEvent("usuarioLogueado", {
        detail: { mi_lista: data.mi_lista ?? [], token: data.token }
      });
      window.dispatchEvent(evento);

      setLoginEstado({ cargando: false, error: null, exito: `¡Bienvenido/a, ${nombre}!` });
      setNombre("");
      setContrasena("");

      cierreAutomatico.current = setTimeout(() => {
        setModalActivo(null);
        setLoginEstado(ESTADO_INICIAL);
      }, 1200);
    } catch (error) {
      setLoginEstado({ cargando: false, error: "No se pudo conectar con el servidor. Intentá de nuevo.", exito: null });
    }
  };

  const crearCuenta = async () => {
    if (registroEstado.cargando) return;
    if (!nombreCC.trim() || !contrasenaCC) {
      setRegistroEstado({ cargando: false, error: "Completá usuario y contraseña.", exito: null });
      return;
    }

    setRegistroEstado({ cargando: true, error: null, exito: null });

    try {
      const response = await fetch("/api/usuarios/registrarse", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreCC, contrasena: contrasenaCC }),
      });
      const data = await response.json();

      if (!response.ok) {
        setRegistroEstado({ cargando: false, error: data.message || "No se pudo crear la cuenta.", exito: null });
        return;
      }

      const nombreCreado = nombreCC;
      setRegistroEstado({ cargando: false, error: null, exito: "¡Cuenta creada con éxito!" });
      setNombreCC("");
      setContrasenaCC("");

      cierreAutomatico.current = setTimeout(() => {
        setRegistroEstado(ESTADO_INICIAL);
        setNombre(nombreCreado);
        setModalActivo("login");
      }, 1300);
    } catch (error) {
      setRegistroEstado({ cargando: false, error: "No se pudo conectar con el servidor. Intentá de nuevo.", exito: null });
    }
  };

  const inputStyle: React.CSSProperties = {
    margin: "0", padding: "0 10px", width: "71%", height: "36px", borderRadius: "5px",
    backgroundColor: "black", border: "1px solid white", color: "white", fontSize: "14px", boxSizing: "border-box"
  };
  const botonStyle = (cargando: boolean): React.CSSProperties => ({
    margin: "0", padding: "0", width: "71%", height: "36px", borderRadius: "5px",
    backgroundColor: "black", border: "1px solid #e50914", color: "white", fontSize: "14px",
    cursor: cargando ? "default" : "pointer"
  });
  const botonSecundarioStyle: React.CSSProperties = {
    margin: "0", padding: "0", width: "71%", height: "32px", borderRadius: "5px",
    backgroundColor: "black", border: "1px solid white", color: "#aaa", fontSize: "13px", cursor: "pointer"
  };
  const modalStyle = (visible: boolean): React.CSSProperties => ({
    width: "30%", minWidth: "280px", position: "absolute", top: "20%", left: "40%", zIndex: 999999,
    backgroundColor: "black", display: visible ? "flex" : "none", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "14px", padding: "32px 0", borderRadius: "20px", border: "1px solid white"
  });
  const tituloStyle: React.CSSProperties = { color: "white", fontSize: "18px", letterSpacing: "1px", margin: "0 0 6px" };
  const mensajeErrorStyle: React.CSSProperties = { color: "#ff6b6b", fontSize: "13px", margin: "0", width: "71%", textAlign: "center" };
  const mensajeExitoStyle: React.CSSProperties = { color: "#2ecc71", fontSize: "13px", margin: "0", width: "71%", textAlign: "center" };

  return (
    <div>
      <div id="login" style={modalStyle(modalActivo === "login")}>
        <p style={tituloStyle}>Iniciar sesión</p>
        <input
          style={inputStyle}
          id="nombre"
          type="text"
          placeholder="Usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={loginEstado.cargando}
        />
        <input
          style={inputStyle}
          id="contrasena"
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") iniciarSesion(); }}
          disabled={loginEstado.cargando}
        />
        {loginEstado.error && <p style={mensajeErrorStyle}>{loginEstado.error}</p>}
        {loginEstado.exito && <p style={mensajeExitoStyle}>{loginEstado.exito}</p>}
        <button style={botonStyle(loginEstado.cargando)} disabled={loginEstado.cargando} onClick={iniciarSesion}>
          {loginEstado.cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        <button id="cerrarL" style={botonSecundarioStyle} onClick={handleCerrarLogin}>
          Cerrar
        </button>
      </div>

      <div id="registrarse" style={modalStyle(modalActivo === "registro")}>
        <p style={tituloStyle}>Crear cuenta</p>
        <input
          id="nombreCC"
          style={inputStyle}
          type="text"
          placeholder="Usuario"
          value={nombreCC}
          onChange={(e) => setNombreCC(e.target.value)}
          disabled={registroEstado.cargando}
        />
        <input
          id="contrasenaCC"
          style={inputStyle}
          type="password"
          placeholder="Contraseña"
          value={contrasenaCC}
          onChange={(e) => setContrasenaCC(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") crearCuenta(); }}
          disabled={registroEstado.cargando}
        />
        {registroEstado.error && <p style={mensajeErrorStyle}>{registroEstado.error}</p>}
        {registroEstado.exito && <p style={mensajeExitoStyle}>{registroEstado.exito}</p>}
        <button style={botonStyle(registroEstado.cargando)} disabled={registroEstado.cargando} onClick={crearCuenta}>
          {registroEstado.cargando ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
        <button id="cerrarR" style={botonSecundarioStyle} onClick={handleCerrarRegistro}>
          Cerrar
        </button>
      </div>
    </div>
  );
}