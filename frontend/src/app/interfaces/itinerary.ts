export interface Place {
  _id: string; 
  name: string;
  coordinates: { lat: number; lng: number };
  category: string; 
}

export interface Day {
  day: number;
  activities: Place[];  
  lunch: Place;         
  dinner: Place;        
}

export interface Itinerary {
  _id: string; 
  city: string;
  days: Day[];
}
