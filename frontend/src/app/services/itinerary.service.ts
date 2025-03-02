import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day, Itinerary } from '../interfaces/itinerary';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  apiUrl = 'http://localhost:3000/api/itineraries';
  http = inject(HttpClient);


  getItinerary(city: string): Observable<Itinerary> {
    return this.http.get<Itinerary>(`${this.apiUrl}/${city}`, { withCredentials: true });
  }
  saveItinerary(city: string, days: Day[]): Observable<Itinerary> {
    return this.http.post<Itinerary>(
      `${this.apiUrl}/`,
      { city, days },
      { withCredentials: true }
    );
  }


  updatePlaceName(itineraryId: string, placeId: string, newName: string): Observable<Itinerary> {
    return this.http.put<Itinerary>(
      `${this.apiUrl}/${itineraryId}/${placeId}`,
      { newName },
      { withCredentials: true }
    );
  }
  updateTripCity(itineraryId: string, newCity: string): Observable<Itinerary> {
    return this.http.put<Itinerary>(
      `${this.apiUrl}/${itineraryId}`,
      { newCity },
      { withCredentials: true }
    );
  }
}
