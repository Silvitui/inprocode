import { Request, Response } from 'express';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            res.status(400).json({ error: "Todos los campos son obligatorios" });
            return 
        }

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "El email ya está registrado. Usa otro." });
            return 
        }

        const newUser = new User({ userName, email, password });

        const savedUser = await newUser.save();
        
        if(!savedUser) {
            res.status(400).json({ error: "Error al registrar usuario" });
            return 
        }
        
        res.status(201).json({ message: "Usuario registrado correctamente" });
        return
     } catch (error: unknown) {
            console.error("Error en registerUser:", error); 
            res.status(500).json({ message: "Error al registrar usuario", details: error });
            return
        }
        
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            res.status(400).json({ error: "Todos los campos son obligatorios" });
            return 
        }

        const existingUser = await User.findOne({ _id: id });
        if (!existingUser) {
            res.status(400).json({ error: "El usuario no existe" });
            return 
        }

        const editedUser = await User.updateOne({ _id: id }, { userName, email, password });
        if (!editedUser) {
            res.status(400).json({ error: "Error al actualizar usuario" });
            return 
        }

        res.status(200).json({ message: "Usuario actualizado correctamente" });
        return
    } catch (error: unknown) {
        console.error("Error en editUser:", error);
        res.status(500).json({ message: "Error al actualizar usuario", details: error });
        return
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existingUser = await User.findOne({ _id: id });

        if (!existingUser) {
            res.status(400).json({ error: "El usuario no existe" });
            return 
        }

        const deletedUser = await User.deleteOne({ _id: id });
        if (!deletedUser) {
            res.status(400).json({ error: "Error al eliminar usuario" });
            return 
        }
        
        res.status(200).json({ message: "Usuario eliminado correctamente" });
        return;
    } catch (error: unknown) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: "Error al eliminar usuario", details: error });
        return;
    }
}

export const getUserById = async (req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(400).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json(user);
        return 
    } catch (error: unknown) {
        console.error("Error en getUserById:", error);
        res.status(500).json({ message: "Error al obtener usuario", details: error });
        return;        
    }
}

export const getUserByEmail = async (req: Request, res: Response ) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json(user);        
        return 
    } catch (error: unknown) {
        console.error("Error en getUserByEmail:", error);
        res.status(500).json({ message: "Error al obtener usuario", details: error });
        return;        
        
    }
}

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            res.status(400).json({ error: "No hay usuarios registrados" });
            return 
        }
        res.status(200).json(users);
        return 
    } catch (error: unknown) {
        console.error("Error en getAllUsers:", error);
        res.status(500).json({ message: "Error al obtener usuarios", details: error });
        return;
        
    }
}