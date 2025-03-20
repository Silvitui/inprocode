import { Router } from "express";
import { 
  getAllUsers, 
  saveUserTrip, 
  getUserSavedTrips, 
  moveUserTripActivity, 
  deleteUserTripActivity 
} from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.get('/all', getAllUsers);
userRouter.post('/saveTrip', authMiddleware, saveUserTrip);
userRouter.get('/savedTrips', authMiddleware, getUserSavedTrips);
userRouter.put('/savedTrips/:itineraryId/activity/move', authMiddleware, moveUserTripActivity);
userRouter.delete('/savedTrips/:tripId/activity/delete', authMiddleware, deleteUserTripActivity);

export default userRouter;
