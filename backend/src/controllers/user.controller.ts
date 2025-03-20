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
    const newItinerary = new Itinerary({ city, days, startDate: new Date(startDate) });
    await newItinerary.save();
    
    await User.findByIdAndUpdate(userId, { $push: { savedTrips: newItinerary._id } });
    
    const populatedItinerary = await Itinerary.findById(newItinerary._id)
      .populate("days.activities");
    
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
        path: "days.activities",
        model: "Place",
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
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!tripId || !activityId || !mongoose.Types.ObjectId.isValid(tripId) || !mongoose.Types.ObjectId.isValid(activityId)) {
      res.status(400).json({ error: "Invalid data. Check tripId and activityId" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(tripId as unknown as mongoose.Types.ObjectId)) {
      res.status(403).json({ error: "Trip does not belong to the user" });
      return;
    }

    const itinerary = await Itinerary.findById(tripId);
    if (!itinerary) {
      res.status(404).json({ error: "Itinerary not found" });
      return;
    }

    let activityRemoved = false;

    itinerary.days.forEach(day => {
      const initialLength = day.activities.length;
      day.activities = day.activities.filter(activity => !activity.equals(activityId));

      if (day.activities.length !== initialLength) {
        activityRemoved = true;
      }
    });

    if (!activityRemoved) {
      res.status(404).json({ error: "Activity not found in the trip" });
      return;
    }

    await itinerary.save();
    res.status(200).json(itinerary);
    return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: "Error removing the activity from the trip" });
    return;
  }
};

export const moveUserTripActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { itineraryId } = req.params;
    const { activityId, fromDayDate, toDayDate } = req.body;

    if (!itineraryId || !activityId || !fromDayDate || !toDayDate || 
        !mongoose.Types.ObjectId.isValid(itineraryId) || !mongoose.Types.ObjectId.isValid(activityId)) {
      res.status(400).json({ error: "Invalid data. Check itineraryId, activityId, and dates" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(itineraryId as unknown as mongoose.Types.ObjectId)) {
      res.status(403).json({ error: "Trip does not belong to the user" });
      return;
    }

    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      res.status(404).json({ error: "Itinerary not found" });
      return;
    }

    const startDate = new Date(itinerary.startDate);
    const fromDayIndex = Math.round((new Date(fromDayDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1); // Calcula el número de día dentro del itinerario basado en la diferencia de días desde la fecha de inicio.
    // Se suma 1 para que el primer día del itinerario sea 1 en lugar de 0.
    
    const toDayIndex = Math.round((new Date(toDayDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1);

    if (fromDayIndex < 0 || fromDayIndex >= itinerary.days.length || 
        toDayIndex < 0 || toDayIndex >= itinerary.days.length) {
      res.status(400).json({ error: "Dates do not match itinerary days" });
      return;
    }

    const fromDay = itinerary.days[fromDayIndex];
    const toDay = itinerary.days[toDayIndex];

    const activityIndex = fromDay.activities.findIndex(act => act.equals(activityId)); // moongose tiene el método EQUALS que permite comparar objects id 
    if (activityIndex === -1) {
      res.status(404).json({ error: "Activity not found in the original day" });
      return;
    }

    const [movedActivity] = fromDay.activities.splice(activityIndex, 1);
    toDay.activities.push(movedActivity);

    await itinerary.save();
    res.status(200).json(itinerary);
    return;

  } catch {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
