import { Router } from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/authMiddleware";


const authRouter = Router();

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser);
authRouter.get('/logout', logoutUser);
authRouter.get("/check-auth", authMiddleware, checkAuth);

export default authRouter;
