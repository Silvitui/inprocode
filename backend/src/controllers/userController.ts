import { Request, Response } from 'express';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El email ya está registrado. Usa otro." });
        }

        const newUser = new User({ userName, email, password });
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
        return
     } catch (error: unknown) {
            console.error("Error en registerUser:", error); 
            res.status(500).json({ message: "Error al registrar usuario", details: error });
            return
        }
        
};
