import { Router } from "express";
import {  createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from "../controllers/trip.controller";

const tripRouter = Router();
tripRouter.post("/", createTrip);
tripRouter.get("/user", getAllTrips);
tripRouter.get("/:id", getTripById);
tripRouter.put("/:id", updateTrip);
tripRouter.delete("/:id", deleteTrip);

export default tripRouter;
