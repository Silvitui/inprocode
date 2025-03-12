import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/types";
import User from "../models/User";
import Itinerary from "../models/Itinerary";

export const getAllUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) {
      res.status(200).json({ message: "No hay usuarios registrados", users: [] });
      return;
    }
    res.status(200).json(users);
    return;
  } catch (error) {
    console.error("Error en getAllUsers:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
    return;
  }
};



export const saveUserTrip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }
    const { city, days, startDate } = req.body;
    if (!city || !days || !Array.isArray(days) || !startDate) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }
    // Crear un nuevo itinerario y convertir el startDate a Date
    const newItinerary = new Itinerary({ city, days, startDate: new Date(startDate) });
    await newItinerary.save();
    
    // Asociar el nuevo itinerario al usuario (guardarlo en savedTrips)
    await User.findByIdAndUpdate(userId, { $push: { savedTrips: newItinerary._id } });
    
    // Poblar los lugares antes de devolver la respuesta (activities, lunch, dinner)
    const populatedItinerary = await Itinerary.findById(newItinerary._id)
      .populate("days.activities days.lunch days.dinner");
    
    console.log("✅ Itinerario guardado y persistido:", populatedItinerary);
    res.status(201).json(populatedItinerary);
  } catch (error) {
    console.error("Error al guardar el trip:", error);
    res.status(500).json({ error: "Error al guardar el itinerario" });
  }
};



export const getUserSavedTrips = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "No autorizado, inicia sesión" });
      return;
    }
   
    const user = await User.findById(userId).populate({
      path: "savedTrips",
      populate: {
        path: "days.activities days.lunch days.dinner",
        select: "name category coordinates"  
      }
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(user.savedTrips);
  } catch (error) {
    console.error("Error al obtener los trips guardados:", error);
    res.status(500).json({ error: "Error al obtener los trips guardados" });
  }
};

export const updateUserTrip = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const itineraryId = req.params.id; 
    const updatedData = req.body; 

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: please log in" });
      return;
    }

    const updatedTrip = await Itinerary.findByIdAndUpdate(
      itineraryId,
      updatedData,
      { new: true }
    ).populate("days.activities days.lunch days.dinner");

    if (!updatedTrip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Error updating trip" });
  }
};
