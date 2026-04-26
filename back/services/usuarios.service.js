import config from "../../dbconfig.js";
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
        return token;
    } catch (error) {
        throw error;
    } finally {
        await client.end();
    }
}

const UsuariosService = {
    crearCuenta,
    iniciarSesion
}
export default UsuariosService;