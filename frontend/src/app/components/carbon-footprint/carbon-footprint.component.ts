import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables); // cuando usamos chart.js trabajamos con el DOM usando viewchild...puedo usar libreria como: ng2-charts, pero no me funciona.

@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrls: ['./carbon-footprint.component.scss']
})
export class CarbonFootprintComponent implements OnChanges, AfterViewInit {
  chart!: Chart;
  @Input() carbonEmissions: { [key: string]: number } = {}; 
  @Input() selectedTransport: string = ''; 
  @ViewChild('chartCanvas') chartCanvas!: { nativeElement: HTMLCanvasElement };

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['carbonEmissions'] && this.carbonEmissions) {
      this.updateChart();
    }
  }

  getTransportColors(): { [key: string]: string } {
    return {
      car: '#FF6384', 
      bike: '#36A2EB', 
      walking: '#4BC0C0', 
      train: '#FFCE56', 
      bus: '#9966FF',
    };
  }

  getTransportEmojis(): { [key: string]: string } {
    return {
      car: '🚗',
      bike: '🚴',
      walking: '🚶',
      train: '🚆',
      bus: '🚌'
    };
  }

  initializeChart() {
    if (!this.chartCanvas?.nativeElement) return;
    
    const transportOrder = ['walking', 'bike', 'bus', 'train', 'car']; // Orden fijo
    const transportLabels = transportOrder.filter(t => this.carbonEmissions.hasOwnProperty(t));
    const emissionValues = transportLabels.map(t => this.carbonEmissions[t] || 0);
    const transportColors = this.getTransportColors();
    const transportEmojis = this.getTransportEmojis();

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: transportLabels.map(t => `${transportEmojis[t] || ''} ${t.toUpperCase()}`),
        datasets: [{
          label: 'Carbon Emissions (g CO₂)',
          data: emissionValues,
          backgroundColor: transportLabels.map(t => transportColors[t] || '#000000'),
          borderColor: '#000000',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true,
            min: 0, // Mínimo fijo en 0
            max: 1200, // Máximo fijo en 1000
            ticks: {
              stepSize: 200 
           },

          }
        }
      } as ChartOptions
    });
  }

  updateChart() {
    if (!this.chart) return;

    const transportOrder = ['walking', 'bike', 'bus', 'train', 'car']; // Orden fijo
    const transportLabels = transportOrder.filter(t => this.carbonEmissions.hasOwnProperty(t));
    const emissionValues = transportLabels.map(t => this.carbonEmissions[t] || 0);
    const transportColors = this.getTransportColors();
    const transportEmojis = this.getTransportEmojis();

    this.chart.data.labels = transportLabels.map(t => `${transportEmojis[t] || ''} ${t.toUpperCase()}`);
    this.chart.data.datasets[0].data = emissionValues;
    this.chart.data.datasets[0].backgroundColor = transportLabels.map(t => transportColors[t] || '#000000');
    this.chart.update();
  }
}
