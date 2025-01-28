import  express, { Request, Response } from 'express';
import 'dotenv/config'
import process from 'process';
import { DBconnection } from './config/DB/connection';

const app = express();
const PORT = +(process.env.PORT ?? 3000);


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World fascistoide de mierda');
})


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    DBconnection()
})