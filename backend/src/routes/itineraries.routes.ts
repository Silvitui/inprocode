import { Router } from 'express';
import { getAllItineraries,  getEmissionsByTransport, getItineraryByCity, getPlacesByDay } from '../controllers/itinerary.controller';

const itineraryRouter = Router();

itineraryRouter.get('/', getAllItineraries);
itineraryRouter.get('/:city/:day/places', getPlacesByDay); 
itineraryRouter.get('/:city/:day/emissions/:transport', getEmissionsByTransport); 
itineraryRouter.get('/:city', getItineraryByCity);


export default itineraryRouter;
