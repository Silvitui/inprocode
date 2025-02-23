export interface Place {
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
  city: string;
  days: Day[]; 
}
