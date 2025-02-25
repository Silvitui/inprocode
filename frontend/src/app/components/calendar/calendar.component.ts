import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary, Day, Place } from '../../interfaces/itinerary';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { TripModalComponent } from '../trip-modal/trip-modal.component';
import { DayDetailModalComponent } from '../day-detail-modal/day-detail-modal.component';
import { CalendarEvent } from '../../interfaces/calendar';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, CommonModule, TripModalComponent, DayDetailModalComponent],
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  itineraryService = inject(ItineraryService);
  itinerary = signal<Itinerary | null>(null);
  events = signal<CalendarEvent[]>([]);
  tripModalOpen = signal(false);
  dayDetailModalOpen = signal(false);
  selectedDayEvents = signal<{ date: Date; events: CalendarEvent[] } | null>(null);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  ngOnInit(): void {
    this.loadItinerary();
  }

  loadItinerary() {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (response) => {
        this.itinerary.set(response);
      },
      error: (error) => console.error('Error:', error)
    });
  }

  openTripModal() {
    this.tripModalOpen.set(true);
  }

  onSaveTrip({ startDate, daysCount }: { startDate: string, daysCount: number }) {
    const start = new Date(startDate);
    this.generateEvents(start, daysCount);
    this.tripModalOpen.set(false);
  }

  generateEvents(startDate: Date, daysCount: number) {
    if (!this.itinerary()) return;
  
    const itineraryDays = this.itinerary()?.days ?? [];
  
    console.log("🚀 Generando eventos desde:", startDate.toISOString());
  
    const eventsArray = itineraryDays.slice(0, daysCount).flatMap((day, index) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + index);
  //Para cada día del itinerario, se crea una nueva fecha usando la fecha inicial 
    
      const formattedDate = eventDate.getFullYear() +
        '-' + String(eventDate.getMonth() + 1).padStart(2, '0') +
        '-' + String(eventDate.getDate()).padStart(2, '0'); //* FullCalendar espera fechas en formato claro YYYY-MM-DD.  Esta línea formatea la fecha correctamente para coincidir exactamente con ese formato. El guión separa,getMonth() devuelve el mes actual en formato número 0 (enero) 11 (diciembre)   por eso le suma +1 , para ajustar el mes correcto, luego con padstart aseguramos q ue la cadena tenga siempre dos dígitos.**//
      return [...day.activities, day.lunch, day.dinner]
        .filter(Boolean) // Filtra los lugares que no existen (undefined) para evitar errores.
        .map((place: Place, index) => ({
          _id: `${formattedDate}-${index}`,
          title: place.name,
          start: formattedDate,
          category: place.category ?? "activity"
        }));
    });

    this.events.set(eventsArray);
    this.calendarOptions = { ...this.calendarOptions, events: this.events() };
  }
  
  
  
  handleEventClick(clickInfo: EventClickArg) {
    const clickedDate = clickInfo.event.start;
    if (!clickedDate) return;

    const clickedDateStr = clickedDate.getFullYear() +
      '-' + String(clickedDate.getMonth() + 1).padStart(2, '0') +
      '-' + String(clickedDate.getDate()).padStart(2, '0');
    const eventsForDay = this.events().filter(({ start }) => start === clickedDateStr);
    if (!eventsForDay.length) console.warn(" No se encontraron eventos para esta fecha.");
    this.selectedDayEvents.set({ date: clickedDate, events: eventsForDay });
    this.dayDetailModalOpen.set(true);
  }
  
}
