import mongoose from 'mongoose';

const CarbonFootSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  co2SavedKg: { type: Number, required: true }, 
  transportationMode: { 
    type: String, 
    enum: ['bike', 'public_transport', 'walking'], 
    required: true 
  }, 
  createdAt: { type: Date, default: Date.now }
});

const CarbonFoot = mongoose.model('CarbonFoot', CarbonFootSchema);
export default CarbonFoot;
