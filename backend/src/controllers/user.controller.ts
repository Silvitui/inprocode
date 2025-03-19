import { Response } from "express";
import {AuthenticatedRequest } from "../interfaces/types";
import User from "../models/User";
import Itinerary from "../models/Itinerary";
import mongoose from "mongoose";



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

export const deleteUserTripActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { tripId } = req.params;
    const { activityId } = req.body;

    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return
    }

    if (!tripId || !activityId || !mongoose.Types.ObjectId.isValid(tripId) || !mongoose.Types.ObjectId.isValid(activityId)) {
      res.status(400).json({ error: "Datos inválidos. Revisar tripId y activityId" });
      return
    }
    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(new mongoose.Types.ObjectId(tripId))) {
      res.status(403).json({ error: "El trip no pertenece al usuario" });
      return
    }
    const itinerary = await Itinerary.findById(tripId);
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return
    }

    let activityRemoved = false;

    itinerary.days.forEach(day => {
      const initialLength = day.activities.length;
      day.activities = day.activities.filter(activity => activity.toString() !== activityId);
      
      if (day.activities.length !== initialLength) {
        activityRemoved = true;
      }
      if (day.lunch?.toString() === activityId) {
        itinerary.updateOne({ $unset: { "days.$.lunch": "" } }).exec();
        activityRemoved = true;
      }
      if (day.dinner?.toString() === activityId) {
        itinerary.updateOne({ $unset: { "days.$.dinner": "" } }).exec();
        activityRemoved = true;
      }
    });

    if (!activityRemoved) {
    res.status(404).json({ error: "Actividad no encontrada en el trip" });
    return
    }


    await itinerary.save();

    console.log(`✅ Actividad ${activityId} eliminada del trip ${tripId}`);
     res.status(200).json(itinerary);
     return
  } catch (error) {
    console.error("Error eliminando la actividad:", error);
     res.status(500).json({ error: "Error eliminando la actividad del trip" });
     return
  }
}

export const moveUserTripActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const { tripId } = req.params;
    const { activityId, fromDayDate, toDayDate } = req.body;

    if (!tripId || !activityId || !fromDayDate || !toDayDate || 
        !mongoose.Types.ObjectId.isValid(tripId) || !mongoose.Types.ObjectId.isValid(activityId)) {
      res.status(400).json({ error: "Datos inválidos. Revisar tripId, activityId y fechas" });
      return;
    }

    console.log(`Intentando mover actividad ${activityId} de ${fromDayDate} a ${toDayDate}`);

    // Verificar que el usuario tiene este trip en sus savedTrips
    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(new mongoose.Types.ObjectId(tripId))) {
      res.status(403).json({ error: "El trip no pertenece al usuario" });
      return;
    }

    // Buscar el itinerario del usuario
    const itinerary = await Itinerary.findById(tripId);
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    const startDate = new Date(itinerary.startDate);
    const fromDayIndex = new Date(fromDayDate).getDate() - startDate.getDate();
    const toDayIndex = new Date(toDayDate).getDate() - startDate.getDate();

    if (fromDayIndex < 0 || fromDayIndex >= itinerary.days.length || 
        toDayIndex < 0 || toDayIndex >= itinerary.days.length) {
      res.status(400).json({ error: "Las fechas no coinciden con los días del itinerario" });
      return;
    }

    const fromDay = itinerary.days[fromDayIndex];
    const toDay = itinerary.days[toDayIndex];

    // Remover la actividad del día original
    const activityIndex = fromDay.activities.findIndex(act => act.toString() === activityId);
    if (activityIndex === -1) {
      res.status(404).json({ error: "Actividad no encontrada en el día de origen" });
      return;
    }

    const [movedActivity] = fromDay.activities.splice(activityIndex, 1);
    toDay.activities.push(movedActivity);

    // Guardamos los cambios en la BD
    await itinerary.save();
    res.status(200).json(itinerary);
    return;
  } catch (error) {
    console.error("❌ Error moviendo la actividad:", error);
    res.status(500).json({ error: "Error al mover la actividad" });
    return;
  }
}