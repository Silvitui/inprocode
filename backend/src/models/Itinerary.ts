import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  city: { type: String, required: true },
  startDate: { type: Date, required: true }, // Nueva propiedad para la fecha de inicio
  days: [
    {
      day: { type: Number, required: true },
      title: { type: String },
      activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], 
      distance: { type: Number },
      transportation: {
        type: Map,
        of: Number,
        default: {}
      }
    }
  ]
});

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
export default Itinerary;
