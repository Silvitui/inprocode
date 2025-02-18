import { Request, Response } from "express";
import Place from "../models/Places";


export const createPlace = async (req: Request, res: Response) => {
    try {
        const { name, coordinates, category, description, address } = req.body;

        if (!name || !coordinates?.lat || !coordinates?.lng || !category) {
            res.status(400).json({ error: "Todos los campos obligatorios: name, coordinates, category" });
            return;
        }

        const newPlace = new Place({ name, coordinates, category, description, address });
        await newPlace.save();

        res.status(201).json({ message: "Lugar registrado correctamente", place: newPlace });
        return;
    } catch (error) {
        console.error("Error en createPlace:", error);
        res.status(500).json({ error: "Error al registrar el lugar" });
        return;
    }
};

export const getPlaces = async (_req: Request, res: Response) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
        return;
    } catch (error) {
        console.error("Error en getPlaces:", error);
        res.status(500).json({ error: "Error al obtener los lugares" });
        return;
    }
};

export const getPlaceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id);
        if (!place) {
            res.status(404).json({ error: "Lugar no encontrado" });
            return;
        }
        res.status(200).json(place);
        return;
    } catch (error) {
        console.error("Error en getPlaceById:", error);
        res.status(500).json({ error: "Error al obtener el lugar" });
        return;
    }
};
