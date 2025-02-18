import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";


const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser);
authRouter.post('/logout', authMiddleware, logoutUser);

export default authRouter;
