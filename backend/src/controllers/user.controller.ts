import { Response } from "express";
import { AuthenticatedRequest } from "../utils/types/types";
import User from "../models/User";

/**
 * Obtiene los datos del usuario autenticado
 */
export const getAuthenticatedUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId; // Extrae el ID del usuario desde el token
        if (!userId) {
            res.status(401).json({ error: "No autorizado" });
            return 
        }

        const user = await User.findById(userId).select("-password"); // No devolvemos la contraseña
        if (!user) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return 
        }

        res.status(200).json(user);
        return 
    } catch (error) {
        console.error("Error en getAuthenticatedUser:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
        return 
    }
};


export const getAllUsers = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await User.find().select("-password"); 
        if (!users.length) {
            res.status(200).json({ message: "No hay usuarios registrados", users: [] });
            return 
        }
        res.status(200).json(users);
        return 
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
        return 
    }
};
