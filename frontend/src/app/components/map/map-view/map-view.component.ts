import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';
import { TransportSelectorComponent } from '../../transport-selector/transport-selector.component';
import { MapMarker, MapRoute } from '../../../interfaces/mapa';
import { CarbonFootprintComponent } from '../../carbon-footprint/carbon-footprint.component';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule,  CarbonFootprintComponent],
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit, OnChanges {
  @Input() markers: MapMarker[] = [];
  @Input() route: MapRoute | null = null;
  @Input() selectedDay: number = 1;
  @Input() selectedTransport: string = 'car';
  @Input() carbonEmissions: { [key: string]: number } = {};
  @Input() selectedCategories: string[] = [];
  @Output() transportChange = new EventEmitter<string>();
  @Output() dayChange = new EventEmitter<number>();
  @Output() categoryFilterChange = new EventEmitter<string[]>();

  @ViewChild('mapContainer') mapContainer: any;
  map!: mapboxgl.Map;
  currentMarkers: mapboxgl.Marker[] = [];
  availableCategories = ['park', 'restaurant', 'museum', 'landmark', 'viewpoint', 'market', 'shop'];

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['markers'] || changes['route'])) {
      this.updateMap();
    }
  }

  initializeMap(): void {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.1734, 41.3851],
      zoom: 12,
      accessToken: environment.mapboxToken  
    });

    this.map.on('load', () => {
      this.updateMap();
    });
  }

updateMap(): void {
  this.currentMarkers.forEach(marker => marker.remove());
  this.currentMarkers = [];

  //  Dibujar los marcadores filtrados
  this.markers.forEach(markerData => {
    const marker = new mapboxgl.Marker({ color: markerData.color })
      .setLngLat(markerData.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${markerData.label}</h3>`))
      .addTo(this.map);
    this.currentMarkers.push(marker);
  });
  const filteredCoordinates = this.markers.map(marker => marker.coordinates);
  
  if (filteredCoordinates.length >= 2) {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    // esta es la línea de los puntos del mapa 
    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: filteredCoordinates 
        }
      }
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#1DB954', 'line-width': 4 }
    });

    //  Ajustamos la vista del mapa a los puntos filtrados
    const bounds = new mapboxgl.LngLatBounds();
    filteredCoordinates.forEach(coord => bounds.extend(coord));
    this.map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
  } else {
    //  Si no hay suficientes puntos, elimino cualquier ruta existente
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
  }
}


  toggleCategory(category: string): void {
    this.categoryFilterChange.emit(
      this.selectedCategories.includes(category)
        ? this.selectedCategories.filter(cat => cat !== category)
        : [...this.selectedCategories, category]
    );
  }
}
