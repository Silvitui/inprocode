import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintService {
  API_URL = `${environment.apiUrl}/itineraries`; 
  http = inject(HttpClient);

  getEmissions(city: string, day: number, transport: string): Observable<{ transport: string; carbonEmission: number }> {
    return this.http.get<{ transport: string; carbonEmission: number }>(
      `${this.API_URL}/${city}/${day}/emissions/${transport}`
    );
  }
}
