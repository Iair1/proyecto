import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const adminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Acceso denegado. Solo admins" });
        }
        next();
    });
};
