import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Itinerary from '../models/Itinerary';
import Place from '../models/Places';

dotenv.config();
const mongoURI = process.env.MONGO_DB_URI as string;

if (!mongoURI) {
  process.exit(1);
}

const places = [
  {
    name: 'Sagrada Familia',
    category: 'landmark',
    coordinates: { lng: 2.1744, lat: 41.4036 },
    description: 'Natural inspiration and energy efficiency.',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain'
  },
  {
    name: 'Hospital de Sant Pau',
    category: 'landmark',
    coordinates: { lng: 2.1745, lat: 41.4112 },
    description: 'World Heritage Site with eco-friendly restoration.',
    address: 'Carrer de Sant Antoni Maria Claret, 167, 08025 Barcelona, Spain'
  },
  {
    name: 'Parc Güell',
    category: 'park',
    coordinates: { lng: 2.1527, lat: 41.4145 },
    description: 'Gaudí’s connection with nature.',
    address: "Carrer d'Olot, 08024 Barcelona, Spain"
  },
  {
    name: 'Parc del Guinardó',
    category: 'park',
    coordinates: { lng: 2.1695, lat: 41.4198 },
    description: 'Nature and panoramic views.',
    address: 'Carrer de Tenerife, 08041 Barcelona, Spain'
  },
  {
    name: 'Bunkers del Carmel',
    category: 'viewpoint',
    coordinates: { lng: 2.1594, lat: 41.4184 },
    description: 'A viewpoint away from mass tourism.',
    address: 'Carrer de Marià Labèrnia, 08032 Barcelona, Spain'
  },
  {
    name: 'Montjuïc',
    category: 'landmark',
    coordinates: { lng: 2.1585, lat: 41.3643 },
    description: 'Nature, history, and panoramic views.',
    address: 'Montjuïc, Barcelona, Spain'
  },
  {
    name: 'Jardines de Mossèn Costa i Llobera',
    category: 'park',
    coordinates: { lng: 2.17233, lat:  41.3689 },
    description: 'Mediterranean climate-adapted vegetation.',
    address: 'Ctra. de Miramar, 08038 Barcelona, Spain'
  },
  {
    name: 'Castillo de Montjuïc',
    category: 'landmark',
    coordinates: { lng: 2.16572975349827, lat: 41.3633691 },
    description: 'History and a spectacular viewpoint.',
    address: 'Carretera de Montjuïc, 66, 08038 Barcelona, Spain'
  },
  {
    name: 'Parc de la Ciutadella',
    category: 'park',
    coordinates: { lng: 2.1850, lat: 41.3880 },
    description: 'A green lung to start the day relaxing.',
    address: 'Passeig de Picasso, 21, 08003 Barcelona, Spain'
  },
  {
    name: 'Taller de Artesanía Sostenible en El Born',
    category: 'landmark',
    coordinates: { lng: 2.1813, lat: 41.3842 },
    description: 'Eco-friendly crafts: ceramics, bookbinding, or jewelry.',
    address: 'El Born, Barcelona, Spain'
  },
  {
    name: 'Barcelona Slow Fashion',
    category: 'shop',
    coordinates: { lng: 2.1683, lat: 41.3879 },
    description: 'Sustainable and fair-trade fashion.',
    address: 'Carrer dels Banys Nous, 14, 08002 Barcelona, Spain'
  },
  {
    name: 'Barri Gòtic',
    category: 'landmark',
    coordinates: { lng: 2.1766, lat: 41.3833 },
    description: 'History and sustainable restoration.',
    address: 'Barri Gòtic, 08002 Barcelona, Spain'
  },
  {
    name: 'Museu de la Xocolata',
    category: 'museum',
    coordinates: { lng: 2.1805, lat: 41.3853 },
    description: 'The impact of sustainable cacao.',
    address: 'Carrer del Comerç, 36, 08003 Barcelona, Spain'
  },
  {
    name: 'Museu Picasso',
    category: 'museum',
    coordinates: { lng: 2.1816, lat: 41.3851 },
    description: 'Art and cultural preservation.',
    address: 'Carrer de Montcada, 15-23, 08003 Barcelona, Spain'
  },
  {
    name: 'Mercat de Santa Caterina',
    category: 'market',
    coordinates: { lng: 2.1771, lat: 41.3858 },
    description: 'A sustainable alternative to La Boquería.',
    address: 'Avinguda de Francesc Cambó, 16, 08003 Barcelona, Spain'
  },
  {
    name: 'Platja de la Barceloneta',
    category: 'landmark',
    coordinates: { lng: 2.1925, lat: 41.3785 },
    description: 'Relaxation by the sea.',
    address: 'Barceloneta Beach, 08003 Barcelona, Spain'
  },
  {
    name: 'Quinoa Bar Vegetarià',
    category: 'restaurant',
    coordinates: { lng: 2.1530, lat: 41.4006 },
    description: 'Cozy vegetarian restaurant with vegan options and fresh local produce.',
    address: 'Travessera de Gràcia, 203, 08012 Barcelona, Spain'
  },
  {
    name: 'Passeig Marítim',
    category: 'landmark',
    coordinates: { lng: 2.1931, lat: 41.3802 },
    description: 'Bike or walking route along the sea.',
    address: 'Passeig Marítim, Barcelona, Spain'
  },
  {
    name: 'Port Olímpic',
    category: 'landmark',
    coordinates: { lng: 2.1993, lat: 41.3855 },
    description: 'A place to enjoy the sunset.',
    address: 'Port Olímpic, Barcelona, Spain'
  },
  {
    name: 'La Caseta del Migdia',
    category: 'restaurant',
    coordinates: { lng: 2.1601, lat: 41.3632 },
    description: 'An outdoor restaurant with views of the port, specialized in grilled cuisine.',
    address: 'Mirador del Migdia, Passeig del Migdia, 08038 Barcelona, Spain'
  },
  {
    name: 'Terraza Martínez',
    category: 'restaurant',
    coordinates: { lng: 2.1724662371969856, lat:  41.3696840960271 },
    description: 'A terrace restaurant in Montjuïc, famous for its rice dishes and sustainable seafood.',
    address: 'Carretera de Miramar, 38, 08038 Barcelona, Spain'
  },
  {
    name: 'Wynwood Café',
    category: 'restaurant',
    coordinates: { lng: 2.1360, lat: 41.3906 },
    description: 'A restaurant offering healthy food with vegan and gluten-free options, using fresh and local ingredients.',
    address: 'Avinguda Diagonal, 557, 08029 Barcelona, Spain'
},
{
    name: 'Alive Restaurant',
    category: 'restaurant',
    coordinates: { lng: 2.1410, lat: 41.3886 },
    description: 'A vegan restaurant serving high-quality, homemade, healthy, and delicious meals made with organic products.',
    address: 'Carrer de Balmes, 129, 08008 Barcelona, Spain'
},
{
  name: 'Hummus Barcelona',
  category: 'restaurant',
  coordinates: { lng: 2.1657, lat: 41.3881 },
  description: 'Vegan and sustainable tapas.',
  address: 'Carrer de Valldonzella, 60, 08001 Barcelona, Spain'
},
{
  name: 'Casa Bonay – Libertine',
  category: 'restaurant',
  coordinates: { lng: 2.1719, lat: 41.3901  },
  description: 'A multifunctional space with eco-friendly cocktails and cultural events.',
  address: 'Gran Via de les Corts Catalanes, 700, 08010 Barcelona, Spain'
},
{
  name: 'Blueproject Foundation Café',
  category: 'restaurant',
  coordinates: { lng: 2.1811, lat: 41.3857 },
  description: 'Plant-based cuisine with organic and seasonal ingredients.',
  address: 'Carrer de la Princesa, 57, 08003 Barcelona, Spain'
},
{
  name: 'Rasoterra',
  category: 'restaurant',
  coordinates: { lng: 2.1753, lat: 41.3799 },
  description: 'A cozy vegan bistro focused on seasonal and sustainable ingredients.',
  address: 'Carrer del Palau, 5, 08002 Barcelona, Spain'
}
];

export const seedDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    await Place.deleteMany();
    await Itinerary.deleteMany();

    const insertedPlaces = await Place.insertMany(places);
    const getPlaceId = (name: string) => {
      const place = insertedPlaces.find((p) => p.name === name);
      if (!place) {
        throw new Error(`Place with name ${name} not found`);
      }
      return place._id;
    };

    console.log('Places inserted:', insertedPlaces);

    const carbonEmissionRates: { [key: string]: number } = {
      car: 192, // gramos de co2
      train: 41,
      bus: 105,
      bike: 0,
      walking: 0
  };
  
  const distancesByDay: { [key: number]: number } = {
      1: 3.47, 
      2: 2.24, 
      3: 1.09, 
      4: 1.89, 
      5: 1.46
  };
  
  const calculateEmissions = (distance: number) => {
      const emissions: { [key: string]: number } = {};
      Object.keys(carbonEmissionRates).forEach(transport => {
          emissions[transport] = distance * carbonEmissionRates[transport];
      });
      return emissions;
  };
  
  const itinerary = {
      city: 'Barcelona',
      days: [
          {
              day: 1,
              title: 'Sustainable Architecture and Culture',
              activities: [
                  getPlaceId('Sagrada Familia'),
                  getPlaceId('Hospital de Sant Pau'),
                  getPlaceId('Parc del Guinardó'),
                  getPlaceId('Bunkers del Carmel'),
                  getPlaceId('Parc Güell'),
              ],
              lunch: getPlaceId('Quinoa Bar Vegetarià'),
              dinner: null,
              distance: distancesByDay[1],
              transportation: calculateEmissions(distancesByDay[1]) // Guardamos todas las emisiones
          },
          {
              day: 2,
              title: 'Scenic Views and Slow Culture',
              activities: [
                  getPlaceId('Montjuïc'),
                  getPlaceId('Castillo de Montjuïc'),
                  getPlaceId('Jardines de Mossèn Costa i Llobera'),
              ],
              lunch: null,
              dinner: getPlaceId('Terraza Martínez'),
              distance: distancesByDay[2],
              transportation: calculateEmissions(distancesByDay[2])
          },
          {
              day: 3,
              title: 'Slow Living and Responsible Shopping in El Born and Gothic',
              activities: [
                  getPlaceId('Parc de la Ciutadella'),
                  getPlaceId('Taller de Artesanía Sostenible en El Born'),
                  getPlaceId('Barcelona Slow Fashion')
              ],
              lunch: getPlaceId('Wynwood Café'),
              dinner: getPlaceId('Alive Restaurant'),
              distance: distancesByDay[3],
              transportation: calculateEmissions(distancesByDay[3])
          },
          {
              day: 4,
              title: 'Historic Center and Traditions',
              activities: [
                  getPlaceId('Barri Gòtic'),
                  getPlaceId('Museu de la Xocolata'),
                  getPlaceId('Museu Picasso'),
                  getPlaceId('Mercat de Santa Caterina')
              ],
              lunch: getPlaceId('Hummus Barcelona'),
              dinner: getPlaceId('Casa Bonay – Libertine'),
              distance: distancesByDay[4],
              transportation: calculateEmissions(distancesByDay[4])
          },
          {
              day: 5,
              title: 'Beach and Relaxation',
              activities: [
                  getPlaceId('Platja de la Barceloneta'),
                  getPlaceId('Passeig Marítim'),
                  getPlaceId('Port Olímpic')
              ],
              lunch: getPlaceId('Blueproject Foundation Café'),
              dinner: getPlaceId('Rasoterra'),
              distance: distancesByDay[5],
              transportation: calculateEmissions(distancesByDay[5])
          }
      ]
  };
  
    console.log('Itinerary created:', itinerary);
    await Itinerary.create(itinerary);

  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close();
  }
  return;
};

seedDB();
