import express from 'express';
import cors from 'cors';
import "dotenv/config";

import UsuariosRouter from "./routers/usuarios.router.js";
//import PeliculasRouter from "./routers/peliculas.router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (__, res) => res.send("Bienvenido a la API de Películas"));
app.use("/usuarios", UsuariosRouter);
//app.use("/peliculas", PeliculasRouter);

//prueba
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});