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

  return (
    <button
      id="pruebaConexion"
      onClick={handleClick}
      style={{ width: "100px", height: "100%" }}
    >
      Probar conexión
      
    </button>
  );
}