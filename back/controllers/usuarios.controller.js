import UsuariosService from "../services/usuarios.service.js";

const crearCuenta = async (req, res) => {
    try{
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const usuario = await UsuariosService.crearCuenta(userid, password);
        res.status(201).json({ message: "Cuenta creada exitosamente", usuario });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const iniciarSesion = async (req, res) => {
    try{
        const { userid, password } = req.body;
        if (!userid || !password) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const usuario = await UsuariosService.iniciarSesion(userid, password);
        res.status(200).json({ message: "Sesión iniciada exitosamente", usuario });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const UsuariosController = {
    crearCuenta,
    iniciarSesion
}
export default UsuariosController;