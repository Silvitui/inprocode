export interface Itinerary {
    city: string;
    days: Day[];
  }
  
  export interface Day {
    day: number;
    title: string;
    activities: Place[];
    lunch?: Place;
    dinner?: Place;
  }
  
  export interface Place {
    name: string;
    coordinates: { lat: number; lng: number };
  }
  