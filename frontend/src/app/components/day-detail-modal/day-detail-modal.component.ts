import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../interfaces/calendar';
import { Itinerary } from '../../interfaces/itinerary';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-day-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-detail-modal.component.html',
  styleUrls: ['./day-detail-modal.component.scss']
})
export class DayDetailModalComponent implements OnChanges {
  userService = inject(UserService);

  @Input() selectedDate: Date | null = null;
  @Input() events: CalendarEvent[] = [];
  @Input() currentItinerary: Itinerary | null = null; // Guardar trip del usuario
  @Output() updatedItinerary = new EventEmitter<{ action: string; activity: CalendarEvent }>();

  openModal = signal(false);
  dayDescription = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events.length > 0) {
      this.generateDayDescription();
      this.openModal.set(true);
    }
  }

  generateDayDescription(): void {
    const titles = this.events.map(e => e.title);
    if (titles.includes('Sagrada Familia')) {
      this.dayDescription.set(`Start your day marveling at Gaudí's masterpiece, the Sagrada Familia...`);
    } else if (titles.includes('Montjuïc')) {
      this.dayDescription.set(`Today is all about stunning views and slow-paced exploration at Montjuïc...`);
    } else {
      this.dayDescription.set('Enjoy your sustainable journey discovering beautiful Barcelona!');
    }
    console.log("📝 Day description generated:", this.dayDescription());
  }

  close(): void {
    this.openModal.set(false);
  }

  handleDeleteActivity(activity: CalendarEvent): void {
    this.updatedItinerary.emit({
      action: 'delete',
      activity
    });
  }

  trackEvent(event: CalendarEvent): string {
    return event._id;
  }
}
