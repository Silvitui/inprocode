import { Response } from 'express';
import Trip from '../models/Trip';
import { AuthenticatedRequest } from '../utils/types/types';
import CarbonFoot from '../models/CarbonFoot';

const carbonEmissionRates: { [key: string]: number } = {
    car: 192, // g CO₂/km
    train: 41,
    bus: 105,
    bike: 0,
    walking: 0
};

export const createTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return;
        }

        const { city, startDate, endDate, places, transport, distance } = req.body;

        if (!city || !startDate || !endDate || !places || !places.length || !transport || !distance) {
            res.status(400).json({ error: "Todos los campos son obligatorios, incluyendo la distancia" });
            return;
        }

        const existingTrip = await Trip.findOne({ city, startDate, endDate, user: userId });
        if (existingTrip) {
            res.status(400).json({ error: "Ya hay un viaje creado para esa ciudad en esas fechas" });
            return;
        }
        const carEmissions = distance * carbonEmissionRates["car"];
        const userEmissions = distance * (carbonEmissionRates[transport] || 0);
        const co2Saved = carEmissions - userEmissions;
        const newTrip = new Trip({ user: userId, city, startDate, endDate, places, transport, distance });
        await newTrip.save();
        const newCarbonFoot = new CarbonFoot({
            user: userId,
            trip: newTrip._id,
            co2Saved,
            distance,
            transportation: transport,
            createdAt: new Date() 
        });
        await newCarbonFoot.save();

        res.status(201).json({ message: "Viaje registrado correctamente", trip: newTrip, carbonFoot: newCarbonFoot });
        return;
    } catch (error) {
        console.error("Error en createTrip:", error);
        res.status(500).json({ error: "Error al registrar el viaje" });
        return;
    }
};

export const getTripById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findById(id).populate("places");

        if (!trip) {
            res.status(404).json({ error: "Viaje no encontrado" });
            return;
        }

        res.status(200).json(trip);
        return;
    } catch (error) {
        console.error("Error en getTripById:", error);
        res.status(500).json({ error: "Error al obtener el viaje" });
        return;
    }
};

export const getAllTrips = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const trips = await Trip.find({ user: req.user?.id }).populate("places");

        if (!trips || trips.length === 0) {
            res.status(200).json({ message: "No hay viajes registrados", trips: [] });
            return;
        }

        res.status(200).json(trips);
        return;
    } catch (error) {
        console.error("Error en getAllTrips:", error);
        res.status(500).json({ error: "Error al obtener los viajes" });
        return;
    }
};

export const updateTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { city, startDate, endDate, places, transport, distance } = req.body;

        const existingTrip = await Trip.findById(id);
        if (!existingTrip) {
            res.status(404).json({ error: "No se ha encontrado el viaje" });
            return;
        }

        const updateFields: { city?: string; startDate?: Date; endDate?: Date; places?: string[], transport?: string, distance?: number, carbonSaved?: number } = {};
        if (city) updateFields.city = city;
        if (startDate) updateFields.startDate = new Date(startDate);
        if (endDate) updateFields.endDate = new Date(endDate);
        if (places && places.length > 0) updateFields.places = places;
        if (transport) updateFields.transport = transport;
        if (distance) updateFields.distance = distance;

        // Si el usuario actualiza el transporte o la distancia, recalculamos el CO₂ ahorrado
        if (transport && distance) {
            const carEmissions = distance * carbonEmissionRates["car"];
            const userEmissions = distance * carbonEmissionRates[transport] || 0;
            updateFields.carbonSaved = carEmissions - userEmissions;
        }

        const updatedTrip = await Trip.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json({ message: "Viaje actualizado correctamente", trip: updatedTrip });
        return;
    } catch (error) {
        console.error("Error en updateTrip:", error);
        res.status(500).json({ error: "Error al actualizar el viaje" });
        return;
    }
};

export const deleteTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const deletedTrip = await Trip.findByIdAndDelete(id);
        if (!deletedTrip) {
            res.status(404).json({ error: "Viaje no encontrado" });
            return;
        }

        res.status(200).json({ message: "Viaje eliminado correctamente" });
        return;
    } catch (error) {
        console.error("Error en deleteTrip:", error);
        res.status(500).json({ error: "Error al eliminar el viaje" });
        return;
    }
};
