import { verifyToken } from "../lib/Token.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).json({message: "Unauthorized"});
        const decoded = verifyToken(token);
        if(!decoded) return res.status(401).json({message: "Unauthorized"});
        req.id = decoded.id;
        next();
    } catch (error) {

        res.status(401).json({message: "Unauthorized"});
    }
    
}

// Exportar a função verifyToken para uso nas rotas
export { verifyToken };