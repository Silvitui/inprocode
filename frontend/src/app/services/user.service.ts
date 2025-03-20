import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Itinerary[]>(`${this.apiUrl}/savedTrips`, { withCredentials: true });
  }

  moveUserTripActivity(itineraryId: string, activityId: string, fromDayDate: string, toDayDate: string): Observable<Itinerary> {
    return this.http.put<Itinerary>(
      `${this.apiUrl}/savedTrips/${itineraryId}/activity/move`,
      { activityId, fromDayDate, toDayDate },
      { withCredentials: true }
    );
  }


  deleteUserTripActivity(itineraryId: string, activityId: string): Observable<Itinerary> {
    return this.http.request<Itinerary>('delete', `${this.apiUrl}/savedTrips/${itineraryId}/activity/delete`, {
      body: { activityId },
      withCredentials: true
    });
  }
}

