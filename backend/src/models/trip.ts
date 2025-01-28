import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  city: { type: String, required: true }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date, required: true }, 
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }], 
  createdAt: { type: Date, default: Date.now }
});

const Trip = mongoose.model('Trip', TripSchema);
export default Trip;
