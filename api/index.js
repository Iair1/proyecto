import express from 'express';
import cors from 'cors';
import "dotenv/config";

import UsuariosRouter from "../back/routers/usuarios.router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (__, res) => res.send("Bienvenido a la API de Películas"));

app.use("/usuarios", UsuariosRouter);

// Este export es el que Vercel necesita
export default app;