import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItineraryService } from '../../../services/itinerary.service';
import { CarbonFootprintService } from '../../../services/carbon-footprint.service';
import { Day, Itinerary, Place } from '../../../interfaces/itinerary';
import { MapMarker, MapRoute } from '../../../interfaces/mapa';
import { MapViewComponent } from '../map-view/map-view.component';
import { CarbonFootprintComponent } from '../../carbon-footprint/carbon-footprint.component';

@Component({
  selector: 'app-map-container',
  templateUrl: `./map-container.component.html`,
  imports: [MapViewComponent, CommonModule], 
  standalone: true,
})
export class MapContainerComponent implements OnInit {
  itineraryService = inject(ItineraryService);
  carbonFootprintService = inject(CarbonFootprintService);

  itinerary = signal<Itinerary | null>(null);
  markers = signal<MapMarker[]>([]);
  route = signal<MapRoute | null>(null);
  carbonEmissions = signal<{ [key: string]: number }>({});

  selectedDay = signal<number>(1);
  selectedTransport = signal<string>('car');

  ngOnInit(): void {
    this.loadItinerary();
  }

  loadItinerary(): void {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (response) => {
        this.itinerary.set(response);
        this.computeMapData();
      },
      error: (error) => console.error('Error loading itinerary:', error),
    });
  }

  computeMapData(): void {
    if (!this.itinerary()) return;

    const dayData = this.itinerary()?.days.find(day => day.day === this.selectedDay());
    if (!dayData) return;

    const places: Place[] = [...dayData.activities, dayData.lunch, dayData.dinner].filter(Boolean) as Place[];

    this.markers.set(
      places.map(place => ({
        coordinates: [place.coordinates.lng, place.coordinates.lat],
        label: place.name,
        color: 'green',
      }))
    );

    this.route.set(places.length >= 2 ? { coordinates: places.map(p => [p.coordinates.lng, p.coordinates.lat]) } : null);

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
}  
