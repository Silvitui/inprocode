export interface Place {
    name: string;
    coordinates: { lat: number; lng: number };
    category: "restaurant" | "park" | "museum" | "landmark" | "viewpoint" | "market" | "shop" | "others";
    description?: string;
    address?: string;
  }
  