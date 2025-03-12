export interface Place {
  _id: string; 
  name: string;
  coordinates: { lat: number; lng: number };
  category: string; 
}

export interface Day {
  day: number;
  activities: Place[];  
  lunch: Place | null;         
  dinner: Place | null;        
}

export interface Itinerary {
  _id?: string;
  city: string;
  days: Day[];
  startDate: Date; // Guardamos la fecha de inicio en formato "YYYY-MM-DD"
}

