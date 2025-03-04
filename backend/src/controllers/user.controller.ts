import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/types";
import User from "../models/User";
import Itinerary from "../models/Itinerary";


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

export const saveUserTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
  
      if (!userId) {
        res.status(401).json({ error: "No autorizado" });
        return;
      }
  
      const { city, days } = req.body;
  
      if (!city || !days || !Array.isArray(days)) {
        res.status(400).json({ error: "Datos inválidos" });
        return;
      }
  
      // Crea un NUEVO itinerario con un NUEVO "_id"
      const newItinerary = new Itinerary({ city, days });
      await newItinerary.save(); // Guarda el nuevo itinerario en la colección
  
      //  Poblar los lugares ANTES de devolver el itinerario al frontend
      const populatedItinerary = await Itinerary.findById(newItinerary._id)
        .populate("days.activities days.lunch days.dinner"); // Asegura que los lugares están populados
  
      // Agregar el NUEVO itinerario al usuario sin duplicar el mismo id.
      await User.findByIdAndUpdate(userId, { $push: { savedTrips: newItinerary._id } });
      res.status(201).json(populatedItinerary);
    } catch (error) {
      console.error("Error al guardar el trip:", error);
      res.status(500).json({ error: "Error al guardar el itinerario" });
    }
  };
  
  