import { Request } from "express";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
    user?: jwt.JwtPayload;
}


export interface Day {
    day: number;
    activities: string[];
    lunch: string;
    dinner: string;
    distance: number;
}

export interface ProcessedDay extends Day {
    transportation: { [key: string]: number };
}

export interface IItinerary {
    _id: string;
    city: string;
    startDate: Date;
    days: Day[];
}

