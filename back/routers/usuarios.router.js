import Router from "express";
import UsuariosController from "../controllers/usuarios.controller.js";
import {verifyToken, verifyAdmin} from "../auth.middleware.js";

const router = Router();


router.post("/registrarse", UsuariosController.crearCuenta);
router.post("/iniciarSesion", UsuariosController.iniciarSesion);
router.get("/prueba", UsuariosController.prueba);
router.post("/ponerEnLista", verifyToken, UsuariosController.ponerEnLista);
router.delete("/sacarDeLista", verifyToken, UsuariosController.sacarDeLista);
//router.get("/perfil", verifyToken, UsuariosController.perfil);

export default router;