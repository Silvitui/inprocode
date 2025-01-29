import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }], 
  ecoPoints: { type: Number, default: 0 } 
});

UserSchema.pre('save', function (next) {

  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
