import { Component, EventEmitter, Output, signal } from '@angular/core';
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

  openModal = signal(true);
  startDate = signal('');
  daysCount = signal(5);

  close() {
    this.openModal.set(false);
    this.closeModal.emit();
  }

  save() {
    this.openModal.set(false);
    this.saveTrip.emit({
      startDate: this.startDate(),
      daysCount: this.daysCount()
    });
  }
}
