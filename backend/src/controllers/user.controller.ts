import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcryptjs"; // Para encriptar contraseñas
import User from "../models/User";
import { AuthenticatedRequest } from "../utils/types/types";


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
        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = new User({ userName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
        return 
    } catch (error) {
        console.error("Error en registerUser:", error);
        res.status(500).json({ message: "Error al registrar usuario" });
        return 
    }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Usuario no encontrado" });
            return 
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: "Contraseña incorrecta" });
            return 
        }

        //  Genera el token  y hacemos que expire en 1 h 
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });
        res.cookie("authToken", token, {
            httpOnly: true, // Esto es para que JavaScript no pueda acceder a la cookie
            secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
            sameSite: "strict", // Protege contra ataques 
            maxAge: 60 * 60 * 1000, // tiempo de vida de la cookie
        });
        res.status(200).json({ message: "Inicio de sesión exitoso" });
        return 
    } catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
        return 
    }
};


export const logoutUser = (_req: Request, res: Response) => {
    res.clearCookie("authToken"); // Elimina la cookie de sesión
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
    return 
};


export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password"); // El guión le dice a Mongoose que excluya el password de los resultados de la consulta
        if (!user) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json(user);
        return 
    } catch (error) {
        console.error("Error en getUserById:", error);
        res.status(500).json({ message: "Error al obtener usuario" });
        return 
    }
};


export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password"); 
        if (!users || users.length === 0) {
            res.status(200).json({ message: "No hay usuarios registrados", users: [] });
            return 
        }
        res.status(200).json(users);
        return 
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
        return 
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, email, password } = req.body;

        const existingUser = await User.findById(id);
        if (!existingUser) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        } //Solo actualiza los campos que fueron enviados 
        const updateFields: { userName?: string; email?: string; password?: string } = {};
        if (userName) updateFields.userName = userName;
        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                res.status(400).json({ error: "Este email ya está en uso" });
                return 
            }

        }
        
        if (password) updateFields.password = await bcrypt.hash(password, 10); //  Encripta la nueva contraseña

        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");

        res.status(200).json({ message: "Usuario actualizado correctamente", user: updatedUser });
        return 
    } catch (error) {
        console.error("Error en updateUser:", error);
        res.status(500).json({ message: "Error al actualizar usuario" });
        return 
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ error: "El usuario no existe" });
            return 
        }
        res.status(200).json({ message: "Usuario eliminado correctamente" });
        return 
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: "Error al eliminar usuario" });
        return 
    }
};
