import config from "../../dbconfig.js";
import pkg from "pg";
const {Client} = pkg;

const crearCuenta = async (userid, password) => {
    return{"FUNCIONOOOOO": "FUNCIONOOOOO"}
}
const iniciarSesion = async (userid, password) => {
    return{"iniciasecion":"iniciasecion"}
}

const UsuariosService = {
    crearCuenta,
    iniciarSesion
}
export default UsuariosService;