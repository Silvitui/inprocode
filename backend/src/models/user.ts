import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }], 
  ecoPoints: { type: Number, default: 0 } 
}, { timestamps: true }); // timestamp genera createdAt y updatedAt automáticamente 

const User = mongoose.model('User', UserSchema);
export default User;
