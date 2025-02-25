import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerary } from '../interfaces/itinerary'; 


@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  apiUrl = 'http://localhost:3000/api/itineraries'; 
  http = inject(HttpClient);

  getItinerary(city: string): Observable<Itinerary> {  
    return this.http.get<Itinerary>(`${this.apiUrl}/${city}`, { withCredentials: true });
  }

  
}
