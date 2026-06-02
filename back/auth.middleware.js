import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
        req.id = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Acceso denegado. Solo admins" });
        }
        next();
    });
};


export { verifyToken, verifyAdmin };