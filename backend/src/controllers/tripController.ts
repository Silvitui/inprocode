import { Request, Response } from 'express';
import Trip from '../models/trip';

export const createTrip = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const {city,startDate,endDate,places} = req.body;
        
        if (!city || !startDate || !endDate || !places || !places.length) {
            res.status(400).json({error: "Todos los campos son obligatorios"})
        }

        const existingTrip = await Trip.findOne({city,startDate,endDate});
        if (existingTrip) {
            res.status(400).json({error: "Ya hay un viaje creado para esa ciudad, fecha de inicio y fecha de fin"})
        }
        const newTrip = new Trip ({city,startDate,endDate,places})
        await newTrip.save();
        res.status(201).json({message: "Viaje registrado correctamente"})
        return 
    }
}

export const updateTrip = async (req: Request,res:Response) {
    try {
        const {city, startDate,endDate,places} = req.params;
        const existingTrip = await Trip.findOne({city, startDate, endDate,places})
        if (!existingTrip) {
            res.status(404).json({error: "No se ha encontrado el viaje"})
        }
        const updateFields: {city?:string,startDate?:string}
        if (city) updateFields.city = city;
        if (email) updateFields.email = email;
        if (startDate) updateFields.city = startDate;
    }
}