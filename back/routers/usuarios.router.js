import Router from "express";
import UsuariosController from "../controllers/usuarios.controller.js";
//import {verifyToken, verifyAdmin} from "../middlewares/auth.js";

const router = Router();

router.post("/registrarse", UsuariosController.crearCuenta);
router.post("/iniciarSesion", UsuariosController.iniciarSesion);
router.get("/prueba", UsuariosController.prueba);
router.post("/ponerEnLista", UsuariosController.ponerEnLista);
router.delete("/sacarDeLista", UsuariosController.sacarDeLista);
//router.get("/perfil", verifyToken, UsuariosController.perfil);

export default router;