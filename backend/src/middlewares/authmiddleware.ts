import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response } from "express";
import process from 'process';
import { AuthenticatedRequest } from '../interfaces/types';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken; // Leer el token desde las cookies
    const secret = process.env.JWT_SECRET as string;

    if (!token) {
        res.status(401).json({ error: 'No autorizado, inicia sesión' });
      return; 
    }
  
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded as JwtPayload; // Guardamos los datos del usuario en `req.user` , JWPayload es el tipo de datos que devuelve jwt.verify (código desencriptado)
      next();
      return;
    } catch (error) {
      res.status(403).json({ message: 'Token inválido o expirado',error});
      return;
    }
  };
  
  export default authMiddleware;
  

