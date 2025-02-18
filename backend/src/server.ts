import  express, { Request, Response } from 'express';
import 'dotenv/config'
import process from 'process';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { DBconnection } from './DB/connection';
import userRouter from './routes/user.routes';
import authRouter from './routes/auth.routes';
import tripRouter from './routes/trip.routes';
import carbonFootRouter from './routes/carbonFoot.routes';
import placesRouter from './routes/places.routes';
import authMiddleware from './middlewares/authMiddleware';
import { options } from './utils/config/cors';


const app = express();
const PORT = +(process.env.PORT ?? 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(options))
app.use(morgan('dev')); // sirve para visualizar en consola las peticiones http que llegan al backend

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World 🎈🎃🎊🎉✨');
})

app.use("/api/auth", authRouter);
app.use('/api/user', authMiddleware, userRouter)
app.use("/api/trips",authMiddleware, tripRouter);
app.use("/api/carbon", authMiddleware, carbonFootRouter);
app.use("/api/places", authMiddleware, placesRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    DBconnection()
})