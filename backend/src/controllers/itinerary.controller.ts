import { Request, Response } from "express";
import Itinerary from "../models/Itinerary";
import { AuthenticatedRequest, Day, ProcessedDay } from "../interfaces/types";
import User from "../models/User";
import mongoose from "mongoose";

// Tabla de emisiones de carbono por tipo de transporte
const carbonEmissionRates: { [key: string]: number } = {
  car: 192,
  train: 41,
  bus: 105,
  bike: 0,
  walking: 0
};

// Función para calcular emisiones según la distancia recorrida
const calculateEmissions = (distance: number) => {
  const emissions: { [key: string]: number } = {};
  Object.keys(carbonEmissionRates).forEach(transport => {
    emissions[transport] = distance * carbonEmissionRates[transport];
  });
  return emissions;
};

/**
 * Obtiene todos los itinerarios, incluyendo la población de actividades, lunch y dinner.
 */
export const getAllItineraries = async (_req: Request, res: Response) => {
  try {
    const itineraries = await Itinerary.find()
      .populate("days.activities days.lunch days.dinner");
    res.status(200).json(itineraries);
    return;
  } catch (error) {
    console.error("Error en getAllItineraries:", error);
    res.status(500).json({ error: "Error al obtener los itinerarios" });
    return;
  }
};


export const getItineraryByCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city } = req.params;
    const itinerary = await Itinerary.findOne({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("days.activities days.lunch days.dinner");
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    res.status(200).json(itinerary);
    return;
  } catch (error) {
    console.error("Error en getItineraryByCity:", error);
    res.status(500).json({ error: "Error al obtener el itinerario" });
    return;
  }
};


export const getPlacesByDay = async (req: Request, res: Response) => {
  try {
    const { city, day } = req.params;
    const itinerary = await Itinerary.findOne({ city: city.toLowerCase() })
      .populate("days.activities days.lunch days.dinner");
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    const dayData = itinerary.days.find(d => d.day === parseInt(day));
    if (!dayData) {
      res.status(404).json({ error: "Día no encontrado en el itinerario" });
      return;
    }
    res.status(200).json({ places: dayData.activities, lunch: dayData.lunch, dinner: dayData.dinner });
    return;
  } catch (error) {
    console.error("Error en getPlacesByDay:", error);
    res.status(500).json({ error: "Error al obtener los lugares del día" });
    return;
  }
};


export const createItinerary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { city, days } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }
    // Procesa cada día (por ejemplo, calculando emisiones según la distancia)
    const processedDays: ProcessedDay[] = days.map((day: Day) => ({
      ...day,
      transportation: calculateEmissions(day.distance)
    }));
    const newItinerary = new Itinerary({ city, days: processedDays });
    await newItinerary.save();
    // Se asocia el itinerario al usuario agregándolo a savedTrips
    await User.findByIdAndUpdate(userId, { $push: { savedTrips: newItinerary._id } });
    console.log("Itinerario guardado en bbdd usuario:", newItinerary);
    res.status(201).json(newItinerary);
    return;
  } catch (error) {
    console.error("Error en createItinerary:", error);
    res.status(500).json({ error: "Error al crear el itinerario" });
    return;
  }
};

/**
 * Obtiene las emisiones de carbono para un transporte específico en un día de un itinerario.
 */
export const getEmissionsByTransport = async (req: Request, res: Response) => {
  try {
    const { city, day, transport } = req.params;
    const itinerary = await Itinerary.findOne({ city: city });
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    const dayData = itinerary.days.find(d => d.day === parseInt(day));
    if (!dayData) {
      res.status(404).json({ error: "Día no encontrado en el itinerario" });
      return;
    }
    const distance = dayData.distance ?? 0;
    const emissionRate = carbonEmissionRates[transport] || 0;
    const emission = distance * emissionRate;
    res.status(200).json({ transport, carbonEmission: emission, distance });
    return;
  } catch (error) {
    console.error("Error en getEmissionsByTransport:", error);
    res.status(500).json({ error: "Error al obtener emisiones de carbono" });
    return;
  }
};

/**
 * Actualiza el nombre de un lugar dentro del itinerario.
 * (Endpoint original para actualizar el nombre de un lugar)
 */
export const updatePlaceNameInItinerary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { itineraryId, placeId } = req.params;
    const { newName } = req.body;
    if (!newName) {
      res.status(400).json({ error: "El nuevo nombre es obligatorio" });
      return;
    }
    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(itineraryId as unknown as mongoose.Types.ObjectId)) {
      res.status(404).json({ error: "Itinerario no encontrado en savedTrips" });
      return;
    }
    const itinerary = await Itinerary.findById(itineraryId).populate("days.activities days.lunch days.dinner");
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    let placeUpdated = false;
    for (const day of itinerary.days) {
      day.activities.forEach((place) => {
        if (place.toString() === placeId) {
          (place as unknown as { name: string }).name = newName;
          placeUpdated = true;
        }
      });
      if (day.lunch && day.lunch._id.toString() === placeId) {
        (day.lunch as unknown as { _id: mongoose.Types.ObjectId, name: string }).name = newName;
        placeUpdated = true;
      }
      if (day.dinner && day.dinner._id.toString() === placeId) {
        (day.dinner as unknown as { _id: mongoose.Types.ObjectId, name: string }).name = newName;
        placeUpdated = true;
      }
    }
    if (!placeUpdated) {
      res.status(404).json({ error: "Lugar no encontrado en el itinerario" });
      return;
    }
    await itinerary.save();
    res.status(200).json({ message: "Nombre del lugar actualizado correctamente", itinerary });
    return;
  } catch (error) {
    console.error("Error en updatePlaceNameInItinerary:", error);
    res.status(500).json({ error: "Error al actualizar el nombre del lugar" });
    return;
  }
};

/**
 * Actualiza el nombre del trip cambiando el campo "city" del itinerario.
 * Se espera recibir en los parámetros { itineraryId } y en el body { newCity }.
 * Se verifica que el itinerario esté en savedTrips del usuario.
 */
export const updateTripCity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { itineraryId } = req.params;
    const { newCity } = req.body;
    if (!newCity) {
      res.status(400).json({ error: "El nuevo nombre (newCity) es obligatorio" });
      return;
    }
    const user = await User.findById(userId);
    if (!user || !user.savedTrips.includes(itineraryId as unknown as mongoose.Types.ObjectId)) {
      res.status(404).json({ error: "Itinerario no encontrado en savedTrips" });
      return;
    }
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      res.status(404).json({ error: "Itinerario no encontrado" });
      return;
    }
    itinerary.city = newCity;
    await itinerary.save();
    res.status(200).json({ message: "Nombre del trip actualizado correctamente", itinerary });
    return;
  } catch (error) {
    console.error("Error en updateTripCity:", error);
    res.status(500).json({ error: "Error al actualizar el nombre del trip" });
    return;
  }
};
