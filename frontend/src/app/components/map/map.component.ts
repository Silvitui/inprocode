import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import { ItineraryService } from '../../services/itinerary.service'; 
import { CarbonFootprintService } from '../../services/carbon-footprint.service';
import { TransportSelectorComponent } from '../transport-selector/transport-selector.component';
import { CarbonFootprintComponent } from '../carbon-footprint/carbon-footprint.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Day, Itinerary, Place } from '../../interfaces/itinerary';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, CarbonFootprintComponent, TransportSelectorComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map!: mapboxgl.Map;
  itineraryService = inject(ItineraryService); 
  carbonFootprintService = inject(CarbonFootprintService);
  router = inject(Router);
  itinerary = signal<Itinerary | null>(null); 
  selectedDay = signal<number>(1);
  selectedTransport = signal<string>('car'); 
  carbonEmissions = signal<{ [key: string]: number }>({}); 
  markers: mapboxgl.Marker[] = [];

  ngOnInit(): void {
    this.loadItinerary();
  }
  
  loadItinerary() {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (response) => {
        console.log(" Itinerary data received:", response);
        this.itinerary.set(response);
        this.initMap();
      },
      error: (error) => console.error(' Error loading itinerary:', error)
    });
  }

  initMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.1734, 41.3851],
      zoom: 12,
      accessToken: environment.mapboxToken
    });

    this.map.on('load', () => {
      this.loadMarkers();
    });
  }

  loadMarkers() {
    if (!this.itinerary()) return;

    const selectedDayData: Day | undefined = this.itinerary()?.days.find(day => day.day === this.selectedDay());
    if (!selectedDayData) return;

    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    const places: Place[] = [
      ...selectedDayData.activities, 
      selectedDayData.lunch, 
      selectedDayData.dinner
    ].filter(Boolean) as Place[];

    places.forEach((place) => {
      const marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([place.coordinates.lng, place.coordinates.lat]) 
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3>`))
        .addTo(this.map);
      
      this.markers.push(marker);
    });

    this.drawRoute(places);
    this.loadCarbonEmissions(); 
  }

  loadCarbonEmissions() {
    if (!this.itinerary()) return;

    const city = this.itinerary()?.city ?? '';
    const day = this.selectedDay();

    const transports = ["car", "train", "bus", "bike", "walking"]; 

    const emissionsData: { [key: string]: number } = {}; 

    let completedRequests = 0;

    transports.forEach(transport => {
      return this.carbonFootprintService.getEmissions(city, day, transport).subscribe({
        next: (response) => {
          emissionsData[transport] = response.carbonEmission;
          completedRequests++;
        //  Si ya recibimos TODAS las respuestas, actualizamos la señal 'carbonEmissions'
          if (completedRequests === transports.length) {
            this.carbonEmissions.set(emissionsData);
          }
        },
        error: (err) => {
          console.error(`Error loading carbon emission for ${transport}:`, err);
          completedRequests++;

          if (completedRequests === transports.length) {
            this.carbonEmissions.set(emissionsData);
          }
        }
      });
    });
  }

  changeDay(day: number) {
    this.selectedDay.set(day);
    this.loadMarkers();
  }

  selectTransport(mode: string) {
    this.selectedTransport.set(mode);
    this.loadCarbonEmissions();
    console.log(` Selected transport mode: ${mode}`);
  }

  drawRoute(places: Place[]) {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    if (places.length < 2) return;

    const coordinates: Array<[number, number]> = places.map(place => [place.coordinates.lng, place.coordinates.lat]);
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1DB954',
        'line-width': 4
      }
    });

    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach(coord => bounds.extend(coord));

    if (coordinates.length >= 2) {
      this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }

  goBack() {
    this.router.navigate(['/']); 
  }
}
