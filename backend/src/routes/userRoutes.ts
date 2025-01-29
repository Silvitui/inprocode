import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, registerUser, updateUser } from "../controllers/userController";

const userRouter = Router();

userRouter.post('/', registerUser)
userRouter.get('/all', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)


export default userRouter;