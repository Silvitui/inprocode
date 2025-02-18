import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from '../models/Places';

dotenv.config();

const places =  [
    {
    name: 'Sagrada Familia',
    category: 'landmark',
    coordinates: { lat: 41.4036, lng: 2.1744 },
    description: 'Inspiración natural y restauración con eficiencia energética.',
    address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain'
  },
  {
    name: 'Parc Güell',
    category: 'park',
    coordinates: { lat: 41.4145, lng: 2.1527 },
    description: 'Obra maestra de Gaudí que combina arquitectura y naturaleza.',
    address: 'Carrer d\'Olot, 08024 Barcelona, Spain'
  },
  {
    name: 'Hospital de Sant Pau',
    category: 'landmark',
    coordinates: { lat: 41.4112, lng: 2.1745 },
    description: 'Patrimonio de la Humanidad con restauración eco-friendly.',
    address: 'Carrer de Sant Antoni Maria Claret, 167, 08025 Barcelona, Spain'
  },
  {
    name: 'La Perra Verde',
    category: 'restaurant',
    coordinates: { lat: 41.3895, lng: 2.1712 },
    description: 'Restaurante con ingredientes ecológicos y de proximidad.',
    address: 'Carrer del Parlament, Barcelona, Spain'
  },
  {
    name: 'Bunkers del Carmel',
    category: 'viewpoint',
    coordinates: { lat: 41.4184, lng: 2.1594 },
    description: 'Vistas panorámicas de Barcelona en un espacio sin turistas masivos.',
    address: 'Carrer de Marià Labèrnia, 08032 Barcelona, Spain'
  },
  {
    name: 'Museu de Ciències Naturals de Barcelona',
    category: 'museum',
    coordinates: { lat: 41.4122, lng: 2.2223 },
    description: 'Exposición sobre biodiversidad y sostenibilidad.',
    address: 'Plaça Leonardo da Vinci, 4-5, 08019 Barcelona, Spain'
  },
  {
    name: 'Parc del Guinardó',
    category: 'park',
    coordinates: { lat: 41.4198, lng: 2.1695 },
    description: 'Un pulmón verde menos masificado, perfecto para descansar.',
    address: 'Carrer de Tenerife, 08041 Barcelona, Spain'
  },
  {
    name: 'Can Cortès',
    category: 'restaurant',
    coordinates: { lat: 41.4792, lng: 2.0786 },
    description: 'Restaurante de cocina de proximidad y sostenible.',
    address: 'Camí de Can Cortès, 08197 Sant Cugat del Vallès, Barcelona, Spain'
  },
  {
    name: 'Casa Bonay – Libertine',
    category: 'restaurant',
    coordinates: { lat: 41.3901, lng: 2.1719 },
    description: 'Un espacio multifuncional con cócteles eco y eventos culturales.',
    address: 'Gran Via de les Corts Catalanes, 700, 08010 Barcelona, Spain'
  },
  {
    name: 'Barrio Gótico',
    category: 'landmark',
    coordinates: { lat: 41.3833, lng: 2.1766 },
    description: 'Descubriendo la historia y restauración sostenible de la ciudad.',
    address: 'Barrio Gótico, 08002 Barcelona, Spain'
  },
  {
    name: 'Museu del Xocolata',
    category: 'museum',
    coordinates: { lat: 41.3853, lng: 2.1805 },
    description: 'Aprender sobre el impacto del cacao sostenible.',
    address: 'Carrer del Comerç, 36, 08003 Barcelona, Spain'
  },
  {
    name: 'Casa de la Seda',
    category: 'landmark',
    coordinates: { lat: 41.3869, lng: 2.1723 },
    description: 'Espacio histórico con procesos textiles eco-friendly.',
    address: 'Carrer de Sant Pere Més Alt, 1, 08003 Barcelona, Spain'
  },
  {
    name: 'Hummus Barcelona',
    category: 'restaurant',
    coordinates: { lat: 41.3881, lng: 2.1657 },
    description: 'Tapas veganas y sostenibles.',
    address: 'Carrer de Valldonzella, 60, 08001 Barcelona, Spain'
  },
  {
    name: 'Playa de la Barceloneta',
    category: 'landmark',
    coordinates: { lat: 41.3785, lng: 2.1925 },
    description: 'Relajación y paseo junto al mar.',
    address: 'Playa de la Barceloneta, 08003 Barcelona, Spain'
  },
  {
    name: 'Barcelona Slow Fashion',
    category: 'shop',
    coordinates: { lat: 41.3879, lng: 2.1683 },
    description: 'Tienda de ropa sostenible y comercio justo.',
    address: 'Carrer dels Banys Nous, 14, 08002 Barcelona, Spain'
  },
  {
    name: 'Jardines de Mossèn Costa i Llobera',
    category: 'park',
    coordinates: { lat: 41.3703, lng: 2.1783 },
    description: 'Jardín botánico con especies adaptadas al clima.',
    address: 'Ctra. de Miramar, 08038 Barcelona, Spain'
  }
];

export const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI as string);
    await Place.deleteMany(); // Limpia la colección antes de insertar
    await Place.insertMany(places);
    console.log('Base de datos poblada con éxito.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    mongoose.connection.close();
  }
};

seedDB();
