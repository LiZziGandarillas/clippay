import { AuthService } from "../services/AuthService.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.replace("Bearer ", "");

        const supabaseUser = await AuthService.verifyToken(token);

        const user = await AuthService.getUserById(supabaseUser.id);

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token",
            message: error.message,
        });
    }
};

export const requireType = (type) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication required" });
        }

        if (req.user.type !== type) {
            return res.status(403).json({
                error: "Forbidden",
                message: `Only ${type} users can access this endpoint`,
            });
        }

        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.replace("Bearer ", "");
            const supabaseUser = await AuthService.verifyToken(token);
            const user = await AuthService.getUserById(supabaseUser.id);
            req.user = user;
        }
    } catch (error) {
        // Ignorar errores, el usuario no está autenticado
    }
    
    next();
};
