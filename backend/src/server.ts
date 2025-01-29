import  express, { Request, Response } from 'express';
import 'dotenv/config'
import process from 'process';
import { DBconnection } from './config/DB/connection';
import userRouter from './routes/userRoutes';

const app = express();
const PORT = +(process.env.PORT ?? 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World 🎈🎃🎊🎉✨');
})

app.use('/user', userRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    DBconnection()
})