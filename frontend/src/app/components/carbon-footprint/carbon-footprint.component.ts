import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables); //habilita todas las funcionalidades de chartjs 

@Component({
  selector: 'app-carbon-footprint',
  templateUrl: './carbon-footprint.component.html',
  styleUrls: ['./carbon-footprint.component.scss']
})
export class CarbonFootprintComponent implements OnChanges, AfterViewInit {
  chart!: Chart;
  @Input() carbonEmissions: { [key: string]: number } = {}; 
  @Input() selectedTransport: string = ''; 
  @ViewChild('chartCanvas') chartCanvas!: { nativeElement: HTMLCanvasElement }; // chartjs necesita manipular directamente el DOM por eso usamos viewchild. 
   
  ngAfterViewInit(): void {
    this.initializeChart();
  }
  // ngAfterViewInit Se ejecuta cuando el componente ya se ha renderizado 

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
      public_transport: '#FF9F40'
    };
  }

   initializeChart() {
    if (!this.chartCanvas?.nativeElement) return;
    
    const transportLabels = Object.keys(this.carbonEmissions);
    const emissionValues = Object.values(this.carbonEmissions);
    const transportColors = this.getTransportColors();

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: transportLabels.map(t => t.toUpperCase()),
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
          y: { beginAtZero: true }
        }
      } as ChartOptions
    });
  }

  updateChart() {
    if (!this.chart) return;
    const transportLabels = Object.keys(this.carbonEmissions);
    const emissionValues = Object.values(this.carbonEmissions);
    const transportColors = this.getTransportColors();
    this.chart.data.labels = transportLabels.map(t => t.toUpperCase());
    this.chart.data.datasets[0].data = emissionValues;
    this.chart.data.datasets[0].backgroundColor = transportLabels.map(t => transportColors[t] || '#000000');
    this.chart.update();
  }
}
