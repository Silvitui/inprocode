import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  type: { type: String, enum: ["restaurants","parks","museums","others"], required: true } 
});

const Place = mongoose.model('Place', PlaceSchema);
export default Place;
