import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  city: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true }],
  transport: { type: String, required: true, enum: ["car", "train", "bus", "bike", "walking"] },
  distance: { type: Number, required: true }, // Nuevo campo en kilómetros
  carbonSaved: { type: Number, default: 0 } // CO₂ ahorrado
});

const Trip = mongoose.model("Trip", TripSchema);
export default Trip;
