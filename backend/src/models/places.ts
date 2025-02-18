import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  coordinates: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  category: { 
    type: String,
    enum: ["restaurant", "park", "museum", "landmark", "viewpoint", "market", "shop", "others"], 
    required: true 
  },
  description: { type: String }, 
  address: { type: String } 
});

const Place = mongoose.model('Place', PlaceSchema);
export default Place;
