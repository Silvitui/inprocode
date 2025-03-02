import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/types";
import User from "../models/User";


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

