import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  type: { type: String, enum: ['restaurant', 'park', 'museum', 'other'], required: true } 
});

const Place = mongoose.model('Place', PlaceSchema);
export default Place;
