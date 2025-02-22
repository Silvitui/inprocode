import { Router } from "express";
import { getAllUsers} from "../controllers/user.controller";


const userRouter = Router();

userRouter.get('/all', getAllUsers)



export default userRouter;