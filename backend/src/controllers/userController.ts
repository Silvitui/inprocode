import { Request, Response } from 'express';
import User from "../models/user"

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
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
     } catch (error) {
            console.error("Error en registerUser:", error); 
            res.status(500).json({ message: "Error al registrar usuario" });
            return
        }
        
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, email, password } = req.body;
        const existingUser = await User.findById(id);
        if (!existingUser) {
            res.status(400).json({ error: "El usuario no existe" });
            return 
        }
        const updateFields : {userName?:string, email?:string; password?:string} = {};
        if (userName) updateFields.userName = userName;
        if (email) updateFields.email = email;
        if (password) updateFields.password = password;
        const updatedUser = await User.findByIdAndUpdate(id,updateFields, {new:true})
        res.status(200).json({messaje: "Usuario actualizado correctamente",user: updatedUser})
    } catch (error) {
        console.error("Error en editUser:", error);
        res.status(500).json({ message: "Error al actualizar usuario" });
        return
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: "Error al eliminar usuario"});
        return;
    }
}

export const getUserById = async (req: Request, res: Response ) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error en getUserById:", error);
        res.status(500).json({ message: "Error al obtener usuario"});
        return;        
    }
}

export const getUserByEmail = async (req: Request, res: Response ) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json(user);        
    } catch (error) {
        console.error("Error en getUserByEmail:", error);
        res.status(500).json({ message: "Error al obtener usuario"});
        return;        
        
    }
}

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            res.status(200).json({ error: "No hay usuarios registrados", users: [] });
            
        }
        res.status(200).json(users);
 
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        res.status(500).json({ message: "Error al obtener usuarios"});
        return;
        
    }
}