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

  categories: string[] = [];
  selectedCategories = new Set<string>(); // usamos la instancia SET para evitar duplicados. Facilita el (add,select,delete)

  ngOnInit(): void {
    this.loadItinerary();
  }

  loadItinerary() {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (response) => {
        this.itinerary.set(response);
        this.initMap();
      },
      error: (error) => console.error('Error loading itinerary:', error)
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

    this.map.on('load', () => this.loadMarkers());
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
    ].filter(Boolean) as Place[]; // usamos filter para eliminar los valores undefined 

  
    this.categories = [...new Set(places.map(place => place.category))];
    if (this.selectedCategories.size === 0) {
      this.selectedCategories = new Set(this.categories);
    }

    const filteredPlaces = places.filter(place => this.selectedCategories.has(place.category));

    filteredPlaces.forEach((place) => {
      const marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([place.coordinates.lng, place.coordinates.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place.name}</h3>`))
        .addTo(this.map);

      this.markers.push(marker);
    });

    this.drawRoute(filteredPlaces);
    this.loadCarbonEmissions();
  }

  onFilterChange(event: any): void {
    const category = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.add(category);
    } else {
      this.selectedCategories.delete(category);
    }
    this.loadMarkers();
  }

  loadCarbonEmissions() {
    if (!this.itinerary()) return;

    const city = this.itinerary()?.city ?? '';
    const day = this.selectedDay();

    const transports = ["car", "train", "bus", "bike", "walking"];
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
          console.error(`Error loading carbon emission for ${transport}:`, err);
          completedRequests++;
          //  Si ya recibimos TODAS las respuestas, actualizamos la señal 'carbonEmissions'
          if (completedRequests === transports.length) {
            this.carbonEmissions.set(emissionsData);
          }
        }
      });
    });
  }

  changeDay(day: number) {
    this.selectedDay.set(day);
    this.selectedCategories.clear();
    this.loadMarkers();
  }

  selectTransport(mode: string) {
    this.selectedTransport.set(mode);
    this.loadCarbonEmissions();
  }

  drawRoute(places: Place[]) { // Este método dibuja la ruta conectando los lugares en el mapa.
    // Si ya existe una ruta, la eliminamos
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
// verifica que haya almenos dos lugares para dibujarla
    if (places.length < 2) return;
// convierte place en un array de coordenadas.
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
      type: 'line',// Indica que vamos a dibujar una característica geográfica.
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' }, // Unión de las líneas con forma redondeada.
      paint: { 'line-color': '#1DB954', 'line-width': 4 }
    });  
 
    const bounds = new mapboxgl.LngLatBounds(); //Ajusta el zoom y la posición del mapa para q la ruta sea visible
    coordinates.forEach(coord => bounds.extend(coord));
    this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  }


}