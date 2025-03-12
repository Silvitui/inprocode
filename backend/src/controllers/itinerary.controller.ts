import { Request, Response } from "express";
import Itinerary from "../models/Itinerary";
import { AuthenticatedRequest, Day, ProcessedDay } from "../interfaces/types";
import User from "../models/User";

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
      city: { $regex: new RegExp(`^${city}$`, "i") } // ^ y $ indican que debe coincidir desde el inicio hasta el final de la cadena, debe ser una coincidencia exacta. Y "i" significa "case-insensitive"
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

/**
 * Obtiene los lugares de un día específico de un itinerario.
 */
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

/**
 * Crea un itinerario general (o plantilla) con startDate.
 */
export const createItinerary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { city, days, startDate } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }
    if (!city || !days || !Array.isArray(days) || !startDate) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }
    // Procesa cada día (calculando emisiones, etc.)
    const processedDays: ProcessedDay[] = days.map((day: Day) => ({
      ...day,
      transportation: calculateEmissions(day.distance)
    }));
    // Crear el itinerario con startDate (convertido a Date)
    const newItinerary = await Itinerary.create({ city, days: processedDays, startDate: new Date(startDate) });
    console.log("Se ha creado el itinerario nuevo en la base de datos:", newItinerary);
    // Se asocia el itinerario al usuario agregándolo a savedTrips
    const update = await User.findByIdAndUpdate(userId, { $push: { savedTrips: newItinerary._id } });
    if (!update) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
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
