import UsuariosService from "../services/usuarios.service.js";

const crearCuenta = async (req, res) => {
    try{
        const { nombre, contrasena } = req.body;
        if (!nombre || !contrasena) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const usuario = await UsuariosService.crearCuenta(nombre, contrasena);
        res.status(201).json({ message: "Cuenta creada exitosamente", usuario });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const iniciarSesion = async (req, res) => {
    try{
        const { nombre, contrasena } = req.body;
        if (!nombre || !contrasena) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const token = await UsuariosService.iniciarSesion(nombre, contrasena);
        res.status(200).json({ token: token });
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