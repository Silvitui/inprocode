// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CalendarOptions } from '@fullcalendar/core';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import { CommonModule } from '@angular/common';
// import { TripModalComponent } from '../../trip-modal/trip-modal.component';
// import { DayDetailModalComponent } from '../../day-detail-modal/day-detail-modal.component';
// import { CalendarEvent } from '../../../interfaces/calendar';

// @Component({
//   selector: 'app-calendar-view',
//   standalone: true,
//   imports: [FullCalendarModule, CommonModule, TripModalComponent, DayDetailModalComponent],
//   templateUrl: './calendar-view.component.html',
//   styleUrls: ['./calendar-view.component.scss']
// })
// export class CalendarViewComponent {
//   // Inputs que recibe del contenedor
//   @Input() calendarOptions!: CalendarOptions;
//   @Input() tripModalOpen: boolean = false;
//   @Input() dayDetailModalOpen: boolean = false;
//   @Input() selectedDayEvents: { date: Date; events: CalendarEvent[] } | null = null;
  
//   // Outputs para delegar acciones al contenedor
//   @Output() openTripModal = new EventEmitter<void>();
//   @Output() saveTrip = new EventEmitter<{ startDate: string, daysCount: number }>();
//   @Output() dayDetailModalClose = new EventEmitter<void>();
// }
