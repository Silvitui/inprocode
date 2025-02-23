import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trip-modal.component.html'
})
export class TripModalComponent {
  @Output() saveTrip = new EventEmitter<{ startDate: string, daysCount: number }>();
  @Output() closeModal = new EventEmitter<void>();

  openModal = true;
  startDate!: string;
  daysCount = 5;

  close() {
    this.openModal = false;
    this.closeModal.emit();
  }

  save() {
    this.openModal = false;
    this.saveTrip.emit({ startDate: this.startDate, daysCount: this.daysCount });
  }
}
