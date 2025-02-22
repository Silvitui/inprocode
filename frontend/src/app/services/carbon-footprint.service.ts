import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarbonFootprintService {
  API_URL = 'http://localhost:3000/api/itineraries'; 
 http = inject(HttpClient);

  getEmissions(city: string, day: number, transport: string): Observable<{ transport: string; carbonEmission: number }> {
    return this.http.get<{ transport: string; carbonEmission: number }>(
      `${this.API_URL}/${city}/${day}/emissions/${transport}`
    );
  }

}
