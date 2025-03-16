import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Day, Itinerary } from '../interfaces/itinerary';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 apiUrl = 'http://localhost:3000/api/user';
 http = inject(HttpClient);

 
 saveUserTrip(city: string, days: Day[], startDate: Date): Observable<Itinerary> {
  return this.http.post<Itinerary>(
    `${this.apiUrl}/saveTrip`,
    { city, days, startDate: startDate.toISOString() },
    { withCredentials: true }
  );
}

  getUserSavedTrips(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/savedTrips`, { withCredentials: true }).pipe(
      map((trips) => trips || []) 
    );
  }
  
  updateUserTrip(itineraryId: string, updateData: { oldActivityName: string, newActivityName: string }): Observable<Itinerary> {
    return this.http.patch<Itinerary>(`${this.apiUrl}/savedTrips/${itineraryId}`, updateData, { withCredentials: true });
  }
  
}