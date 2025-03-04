import { Router } from "express";
import { getAllUsers, saveUserTrip} from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";


const userRouter = Router();

userRouter.get('/all', getAllUsers)
userRouter.post('/saveTrip', authMiddleware, saveUserTrip)
export default userRouter;