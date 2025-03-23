import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day, Itinerary } from '../interfaces/itinerary';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  apiUrl = `${environment.apiUrl}/itineraries`;  
  http = inject(HttpClient);

  getItinerary(city: string): Observable<Itinerary> {
    return this.http.get<Itinerary>(`${this.apiUrl}/${city}`, { withCredentials: true });
  }
}
