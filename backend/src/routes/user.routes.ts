import { Router } from "express";
import { getAllUsers, saveUserTrip, getUserSavedTrips, updateUserTrip } from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get('/all', getAllUsers);
userRouter.post('/saveTrip', authMiddleware, saveUserTrip);
userRouter.get('/savedTrips', authMiddleware, getUserSavedTrips);
userRouter.put('/savedTrips/:id', authMiddleware, updateUserTrip);




export default userRouter;
