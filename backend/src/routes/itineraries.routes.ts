import { Router } from 'express';
import {
  getAllItineraries,
  getItineraryByCity,
  getPlacesByDay,
  createItinerary,
  getEmissionsByTransport,
  updatePlaceNameInItinerary,
  updateTripCity
} from '../controllers/itinerary.controller';
import authMiddleware from '../middlewares/authMiddleware';

const itineraryRouter = Router();

itineraryRouter.get('/', getAllItineraries);
itineraryRouter.get('/:city', getItineraryByCity);
itineraryRouter.get('/:city/:day/places', getPlacesByDay);
itineraryRouter.get('/:city/:day/emissions/:transport', getEmissionsByTransport);
itineraryRouter.post('/', authMiddleware, createItinerary);
itineraryRouter.put('/:itineraryId/:placeId', authMiddleware, updatePlaceNameInItinerary);
itineraryRouter.put('/:itineraryId', authMiddleware, updateTripCity);

export default itineraryRouter;
