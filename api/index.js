import express from 'express';
import cors from 'cors';
import "dotenv/config";

import UsuariosRouter from "../back/routers/usuarios.router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", (__, res) => res.send("Bienvenido a la API de Películas"));

app.use("/api/usuarios", UsuariosRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3000}`);
});


// Este export es el que Vercel necesita
export default app;