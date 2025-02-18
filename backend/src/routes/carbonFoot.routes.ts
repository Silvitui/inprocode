import {Router} from 'express';

import {  getAllCarbonFootData, getCarbonFootByTrip, getCarbonFootByUser } from '../controllers/carbonFoot.controller';

const carbonFootRouter = Router();
carbonFootRouter.get("/user", getCarbonFootByUser);

carbonFootRouter.get("/trip", getCarbonFootByTrip);

carbonFootRouter.get("/", getAllCarbonFootData);

export default carbonFootRouter;
