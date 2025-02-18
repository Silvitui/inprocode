import { Response } from "express";
import CarbonFoot from "../models/CarbonFoot";
import { AuthenticatedRequest } from "../utils/types/types";

export const getCarbonFootByUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Usuario no autenticado" });
            return;
        }

        const userCarbonFoot = await CarbonFoot.find({ user: userId }).populate("trip");

        if (!userCarbonFoot.length) {
            res.status(200).json({ message: "No se encontraron registros de huella de carbono para este usuario", data: [] });
            return;
        }

        res.status(200).json(userCarbonFoot);
        return;
    } catch (error) {
        console.error("Error en getCarbonFootByUser:", error);
        res.status(500).json({ error: "Error al obtener la huella de carbono del usuario" });
        return;
    }
};

export const getCarbonFootByTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { tripId } = req.params;
        const tripCarbonFoot = await CarbonFoot.find({ trip: tripId }).populate("user");

        if (!tripCarbonFoot.length) {
            res.status(200).json({ message: "No se encontraron registros de huella de carbono para este viaje", data: [] });
            return;
        }

        res.status(200).json(tripCarbonFoot);
        return;
    } catch (error) {
        console.error("Error en getCarbonFootByTrip:", error);
        res.status(500).json({ error: "Error al obtener la huella de carbono del viaje" });
        return;
    }
};

export const getAllCarbonFootData = async (_req: AuthenticatedRequest, res: Response) => {
    try {
        const allCarbonFoot = await CarbonFoot.find().populate("user trip");

        if (!allCarbonFoot.length) {
            res.status(200).json({ message: "No hay registros de huella de carbono", data: [] });
            return;
        }

        res.status(200).json(allCarbonFoot);
        return;
    } catch (error) {
        console.error("Error en getAllCarbonFootData:", error);
        res.status(500).json({ error: "Error al obtener los datos de huella de carbono" });
        return;
    }
};
