import { type Request,type Response,type NextFunction } from "express";
import jwt , {type JwtPayload} from 'jsonwebtoken';
import JWT_SECRET from './config.js';

export interface AuthRequest extends Request {
    userId?:string;
}

export const verifyToken = (req:AuthRequest,res:Response,next:NextFunction) => {
    try{
        const authHeader = req.header('Authorization');

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        const token = authHeader.split(' ')[1] as string;

        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload;

        req.userId = decoded.id as string;

        next();
    }
    catch(err)
    {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
