import {} from "express";
import jwt, {} from 'jsonwebtoken';
import JWT_SECRET from './config.js';
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
//# sourceMappingURL=auth.middleware.js.map
