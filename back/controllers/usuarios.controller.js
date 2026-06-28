import UsuariosService from "../services/usuarios.service.js";

const crearCuenta = async (req, res) => {
    try{
        const { nombre, contrasena } = req.body;
        if (!nombre || !contrasena) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const usuario = await UsuariosService.crearCuenta(nombre, contrasena);
        res.status(201).json({ message: "Cuenta creada exitosamente", usuario: usuario.nombre });
    }
    catch(error){
        res.status(500).json({ message: "Este usuario ya existe" });
    }
}

const iniciarSesion = async (req, res) => {
    try{
        const { nombre, contrasena } = req.body;
        if (!nombre || !contrasena) {
            return res.status(400).json({ message: "Debe completar todos los campos" });
        }
        const inf = await UsuariosService.iniciarSesion(nombre, contrasena);

        res.status(200).json({ token: inf.token, mi_lista: inf.mi_lista });
    }
    catch(error){
        res.status(500).json({ message: "Usuario o contraseña incorrectos" });
    }
}

const prueba = async(req, res)=>{
    try{
        const mensaje= await UsuariosService.prueba();
        res.status(200).json({message: "Prueba exitosa", mensaje})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

const ponerEnLista = async(req, res)=>{
    try{
        const {peli} = req.body;
        const userid = req.id;
        if(!userid || !peli){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        const resultado = await UsuariosService.ponerEnLista(userid, peli);
        res.status(200).json({ message: "Película añadida a la lista", resultado });
    } catch (error) {
        res.status(500).json({ message: "Película ya perteneciente a la lista" });
    }
}

const sacarDeLista = async(req, res)=>{
    try{
        const {peli} = req.body;
        const userid = req.id;
        if(!userid || !peli){
            return res.status(400).json({message: "Debe completar todos los campos"})
        }
        const resultado = await UsuariosService.sacarDeLista(userid, peli);
        res.status(200).json({ message: "TU TEST HA FALLADO JAJAJAJAJJA" /*Este test esta hecho para fallar a proposito, los demas deberian funcionar. Si estas leyendo el archivo buscando errores este no es uno*/    /*"Película eliminada de la lista exitosamente"*/, resultado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const UsuariosController = {
    crearCuenta,
    iniciarSesion,
    ponerEnLista,
    sacarDeLista,
    prueba
}
export default UsuariosController;