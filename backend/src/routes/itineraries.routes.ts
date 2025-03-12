import { Router } from 'express';
import {
  getAllItineraries,
  getItineraryByCity,
  getPlacesByDay,
  getEmissionsByTransport,

} from '../controllers/itinerary.controller';


const itineraryRouter = Router();

itineraryRouter.get('/', getAllItineraries);
itineraryRouter.get('/:city', getItineraryByCity);
itineraryRouter.get('/:city/:day/places', getPlacesByDay);
itineraryRouter.get('/:city/:day/emissions/:transport', getEmissionsByTransport);



export default itineraryRouter;
