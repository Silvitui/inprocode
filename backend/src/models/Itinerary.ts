import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  city: { type: String, required: true},
  days: [
    {
      day: Number,
      title: String,
      activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], 
      lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Place" }, 
      dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
      distance: { type: Number},
      transportation: {
        type: Map, // Usamos un mapa para guardar emisiones por cada transporte
        of: Number, // Cada valor será un número que representa la emisión de CO2
        default: {} // Para que no falle si está vacío
      }
    }
  ]
});

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
export default Itinerary;


// import mongoose from "mongoose";

// const ItinerarySchema = new mongoose.Schema({
//   city: { type: String, required: true, unique: true },
//   days: [
//     {
//       day: Number,
//       title: String,
//       activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], 
//       lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Place" }, 
//       dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
//       transportation: { type: String, enum: ["bike", "public_transport", "walking", "car", "train", "bus"] },
//       distance: { type: Number, required: true },
//       carbonEmission: { type: Number, required: true }  // Cuanto CO2 genera el viaje en toneladas
//     }
//   ]
// });

// const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
// export default Itinerary;
