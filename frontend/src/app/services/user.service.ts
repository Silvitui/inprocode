import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day, Itinerary } from '../interfaces/itinerary';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';
  private http = inject(HttpClient);

  saveUserTrip(city: string, days: Day[]): Observable<Itinerary> {
    return this.http.post<Itinerary>(`${this.apiUrl}/saveTrip`, { city, days }, { withCredentials: true });
  }

  getUserSavedTrips(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/savedTrips`, { withCredentials: true });
  }

  updateUserTrip(itineraryId: string, updatedData: Partial<Itinerary>): Observable<Itinerary> {
    return this.http.put<Itinerary>(`${this.apiUrl}/savedTrips/${itineraryId}`, updatedData, { withCredentials: true });
  }


  deleteUserTrip(itineraryId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/savedTrips/${itineraryId}`, { withCredentials: true });
  }
}
