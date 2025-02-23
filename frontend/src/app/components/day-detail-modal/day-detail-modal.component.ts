import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-day-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-detail-modal.component.html'
})
export class DayDetailModalComponent implements OnChanges {
  @Input() selectedDate!: Date;
  @Input() events: { title: string; start: string }[] = [];
  @Output() closeModal = new EventEmitter<void>();

  openModal = true;
  dayDescription = '';

  ngOnChanges(changes: SimpleChanges): void { // objeto que angular pasa con todos los inputs que acaban de cambiar
    if (changes['events'] && this.events.length > 0) {
      this.generateDayDescription();
      this.openModal = true;
    }
  }

  generateDayDescription() {
    const titles = this.events.map(e => e.title);

    if (titles.includes('Sagrada Familia')) {
      this.dayDescription = `
      Start your day marveling at Gaudí's masterpiece, the Sagrada Familia.
        Continue to explore the modernist wonder of Hospital de Sant Pau, then immerse yourself 
        in nature at Parc del Guinardó and Bunkers del Carmel, ending your journey at Parc Güell. 
        Recharge energy at Quinoa Bar Vegetarià. A day filled with sustainable beauty and inspiring architecture!
      `;
    } else if (titles.includes('Montjuïc')) {
      this.dayDescription = `
       Today is all about stunning views and slow-paced exploration.
        Visit Montjuïc and the historic Castillo de Montjuïc, followed by a peaceful stroll 
        through Jardines de Mossèn Costa i Llobera. Conclude with a memorable dinner at Terraza Martínez, 
        overlooking Barcelona's skyline.
      `;
    } else if (titles.includes('Parc de la Ciutadella')) {
      this.dayDescription = `
        Enjoy slow living in the charming streets of El Born and Gothic.
        Begin your morning in Parc de la Ciutadella, then explore sustainable craft workshops 
        and responsible shopping experiences at Taller de Artesanía and Barcelona Slow Fashion. 
        Delicious meals await you at Wynwood Café and Alive Restaurant!
      `;
    } else if (titles.includes('Barri Gòtic')) {
      this.dayDescription = `
        Dive deep into Barcelona's historic heart and culinary traditions.
        Wander through Barri Gòtic, discover sweet history at Museu de la Xocolata, explore 
        iconic art at Museu Picasso, and embrace local flavors at Mercat de Santa Caterina. 
        Lunch at Hummus Barcelona, finishing the day in style at Casa Bonay – Libertine.
      `;
    } else if (titles.includes('Platja de la Barceloneta')) {
      this.dayDescription = `
        Your final day invites relaxation and coastal charm.
        Enjoy the sun at Platja de la Barceloneta, stroll leisurely along Passeig Marítim, 
        and experience the vibrant atmosphere of Port Olímpic. Nourish your body at Blueproject 
        Foundation Café, concluding your trip sustainably at Rasoterra.
      `;
    } else {
      this.dayDescription = 'Enjoy your sustainable journey discovering beautiful Barcelona!';
    }
  }

  close() {
    this.openModal = false;
    this.closeModal.emit();
  }
}
