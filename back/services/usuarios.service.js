import config from "../dbconfig.js";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const {Client} = pkg;

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const crearCuenta = async (nombre, contrasena) => {
    const client = new Client(config);
    try {
        await client.connect();
        const hasheada = await bcrypt.hash(contrasena, 11);
        const result = await client.query(
            "INSERT INTO usuarios (nombre, contrasena) VALUES ($1, $2) RETURNING id, nombre",
            [nombre, hasheada]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}
const iniciarSesion = async (nombre, contrasena) => {
    const client = new Client(config);
    try {
        await client.connect();
        const result = await client.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
        if (result.rowCount === 0) {
            throw new Error("Usuario no encontrado");
        }
        const dbUser = result.rows[0];
        const contraCorrecta = await bcrypt.compare(contrasena, dbUser.contrasena);
        if (!contraCorrecta) {
            throw new Error("Contraseña invalida");
        }
        const token = jwt.sign(
        { userid: dbUser.userid, nombre: dbUser.nombre, rol: dbUser.rol },
        JWT_SECRET,
        { expiresIn: "1h" }
        );
        const ML = await client.query("SELECT P.nombre FROM mi_lista M INNER JOIN peliculas P ON M.peli_id = P.id WHERE M.user_id = $1", [dbUser.userid]);
        const inf = {
            token: token,
            mi_lista: ML.rows
        }
        return inf;
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

const ponerEnLista = async (userid, peli) => {
    const client = new Client(config);
    try {
        await client.connect();
        const peli_id_filas = await client.query("SELECT id FROM peliculas WHERE titulo = $1", [peli]);
        const result = await client.query(
            "INSERT INTO mi_lista (user_id, peli_id) VALUES ($1, $2) RETURNING *",
            [userid, peli_id_filas.rows[0].id]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

const sacarDeLista = async (userid, peli) => {
    const client = new Client(config);
    try {
        await client.connect();
        const peli_id_filas = await client.query("SELECT id FROM peliculas WHERE titulo = $1", [peli]);
        const result = await client.query(
            "DELETE FROM mi_lista WHERE user_id = $1 AND peli_id = $2 RETURNING *",
            [userid, peli_id_filas.rows[0].id]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}


const prueba = async()=>{
    const client = new Client(config);
    try{
        await client.connect();
        return{"HOLA": "PASASTE LA PRUEBA EXITOSAMENTE"}
    }catch(error){
        throw error;
    }finally{
        await client.end()
    }
}

const UsuariosService = {
    crearCuenta,
    iniciarSesion,
    ponerEnLista,
    sacarDeLista,
    prueba
}
export default UsuariosService;