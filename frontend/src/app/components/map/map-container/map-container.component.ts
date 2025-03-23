import { UserService } from './../../../services/user.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItineraryService } from '../../../services/itinerary.service';
import { CarbonFootprintService } from '../../../services/carbon-footprint.service';
import { Itinerary, Place } from '../../../interfaces/itinerary';
import { MapMarker, MapRoute } from '../../../interfaces/mapa';
import { MapViewComponent } from '../map-view/map-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-container',
  templateUrl: `./map-container.component.html`,
  imports: [MapViewComponent, CommonModule],
  standalone: true,
})
export class MapContainerComponent implements OnInit {
  itineraryService = inject(ItineraryService);
  router = inject(Router);
  userService = inject(UserService);
  carbonFootprintService = inject(CarbonFootprintService);

  itinerary = signal<Itinerary | null>(null);
  markers = signal<MapMarker[]>([]);
  route = signal<MapRoute | null>(null);
  carbonEmissions = signal<{ [key: string]: number }>({});

  selectedDay = signal<number>(1);
  selectedTransport = signal<string>('car');
  selectedCategories = signal<string[]>([]);

  redirectToCalendar(): void {
    this.router.navigate(['/calendar']); 
  }

  ngOnInit(): void {
    this.loadItinerary();
  }

  loadItinerary(): void {
    this.userService.getUserSavedTrips().subscribe(
      (trips) => {
        if (trips.length > 0) {
          const savedItinerary = trips[0];
          this.itinerary.set(savedItinerary);
          this.computeMapData();
        } else {
          this.itinerary.set(null);
        }
      },
      (error) => console.error('Error getting user saved trips:', error)
    );
  }

  computeMapData(): void {
    if (!this.itinerary()) return;
  
    const dayData = this.itinerary()?.days.find(day => day.day === this.selectedDay());
    if (!dayData) return;
  
    let places: Place[] = [...dayData.activities].filter(Boolean) as Place[];
    if (this.selectedCategories().length > 0) {
      places = places.filter(place => this.selectedCategories().includes(place.category));
    }
  
    this.markers.set(
      places.map(place => ({
        coordinates: [place.coordinates.lng, place.coordinates.lat],
        label: place.name,
        color: 'green',
      }))
    );
  
    //  Solo mostramos la ruta si hay al menos 2 lugares en el filtro
    if (places.length >= 2) {
      this.route.set({ coordinates: places.map(p => [p.coordinates.lng, p.coordinates.lat]) });
    } else {
      this.route.set(null); 
    }
  
    this.loadCarbonEmissions();
  }
  
  loadCarbonEmissions(): void {
    if (!this.itinerary()) return;
    const city = this.itinerary()?.city ?? '';
    const day = this.selectedDay();
    const transports = ['car', 'train', 'bus', 'bike', 'walking'];
    const emissionsData: { [key: string]: number } = {};
    let completedRequests = 0;

    transports.forEach(transport => {
      this.carbonFootprintService.getEmissions(city, day, transport).subscribe({
        next: (response) => {
          emissionsData[transport] = response.carbonEmission;
          completedRequests++;
          if (completedRequests === transports.length) {
            this.carbonEmissions.set(emissionsData);
          }
        },
        error: (err) => {
          console.error(`Error al obtener emisiones para ${transport}:`, err);
          completedRequests++;
          if (completedRequests === transports.length) {
            this.carbonEmissions.set(emissionsData);
          }
        }
      });
    });
  }

  selectTransport(mode: string): void {
    this.selectedTransport.set(mode);
    this.loadCarbonEmissions();
  }

  changeDay(day: number): void {
    this.selectedDay.set(day);
    this.computeMapData();
  }

  updateSelectedCategories(categories: string[]): void {
    this.selectedCategories.set(categories);
    this.computeMapData();
  }
}
