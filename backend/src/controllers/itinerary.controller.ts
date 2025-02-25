import { Request, Response } from "express";
import Itinerary from "../models/Itinerary";
import { Day, ProcessedDay } from "../interfaces/types";


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


export const createItinerary = async (req: Request, res: Response) => {
  try {
    const { city, days } = req.body;

    const processedDays: ProcessedDay[] = days.map((day: Day) => ({
      ...day,
      transportation: calculateEmissions(day.distance)
    }));

    const newItinerary = new Itinerary({ city, days: processedDays });
    await newItinerary.save();

    res.status(201).json(newItinerary);
    return;
  } catch (error) {
    console.error("Error en createItinerary:", error);
    res.status(500).json({ error: "Error al crear el itinerario" });
    return;
  }
};

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

    const distance = dayData.distance;
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


