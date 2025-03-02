import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Itinerary } from '../interfaces/itinerary';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  apiUrl = 'http://localhost:3000/api/itineraries';
  http = inject(HttpClient);


  updatePlaceName(itineraryId: string, placeId: string, newName: string): Observable<Itinerary> {
    return this.http.put<Itinerary>(
      `${this.apiUrl}/${itineraryId}/${placeId}`, 
      { newName },
      { withCredentials: true }
    );
  }
  deletePlaceFromItinerary(itineraryId: string, placeId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${itineraryId}/${placeId}`,  
      { withCredentials: true }
    );
  }
}
