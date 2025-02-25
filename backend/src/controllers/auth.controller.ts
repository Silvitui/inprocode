import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest } from "../interfaces/types";


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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        res.cookie("authToken", token, {
            httpOnly: true,  //  Protege la cookie de javascript
            secure: process.env.NODE_ENV === "production", //  Solo en HTTPS en producción
            sameSite: "strict", // Previene ataques CSRF
            maxAge: 60 * 60 * 1000, // 1 hora de autorización 
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
    res.clearCookie("authToken");
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
    return 
};


export const checkAuth = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (req.user) {
            res.status(200).json(true);
            return;
        }
        res.status(401).json(false);
        return;
    } catch (error) {
        console.error("Error en checkAuth:", error);
        res.status(500).json({ error: "Error verificando autenticación" });
        return;
    }
};
