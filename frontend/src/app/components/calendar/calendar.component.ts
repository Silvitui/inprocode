import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from '../../services/user.service';
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
  userService = inject(UserService);
  itineraryService = inject(ItineraryService);
  savedTrips = signal<Itinerary[]>([]);
  currentItinerary = signal<Itinerary | null>(null);
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
    this.loadGeneralItinerary();
  }

  loadGeneralItinerary() {
    this.itineraryService.getItinerary("barcelona").subscribe({
      next: (itinerary) => {
        console.log(" Itinerario general cargado:", itinerary);
        this.currentItinerary.set(itinerary);
      },
      error: (error) => console.error(' Error al cargar el itinerario general:', error)
    });
  }

  openTripModal() {
    this.tripModalOpen.set(true);
  }

  onSaveTrip({ startDate, daysCount }: { startDate: string, daysCount: number }) {
    if (!this.currentItinerary()) {
      console.warn("No hay itinerario general cargado.");
      return;
    }
    const copiedItinerary: Itinerary = {
      ...this.currentItinerary()!,
      _id: '', // Se genera un nuevo ID en el backend.
      days: this.currentItinerary()!.days.map(day => ({
        ...day,
        activities: [...day.activities],
        lunch: day.lunch ? { ...day.lunch } : null,
        dinner: day.dinner ? { ...day.dinner } : null
      }))
    };

    // Guardar la copia usando el endpoint saveUserTrip.
    this.userService.saveUserTrip(copiedItinerary.city, copiedItinerary.days).subscribe({
      next: (newTrip) => {
        console.log(" Nuevo itinerario guardado:", newTrip);
        this.savedTrips.update(trips => [...trips, newTrip]);
        // Actualizamos el itinerario actual con la copia guardada.
        this.currentItinerary.set(newTrip);
        // Generamos los eventos usando la fecha seleccionada en el modal.
        this.generateEventsFromItinerary(newTrip, new Date(startDate));
        this.tripModalOpen.set(false);
      },
      error: (error) => console.error(' Error al guardar el trip:', error)
    });
  }


  generateEventsFromItinerary(itinerary: Itinerary, startDate?: Date) {
    if (!startDate) startDate = new Date();

    const allEvents: CalendarEvent[] = itinerary.days.flatMap((day, index) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + index);
      // Formateamos la fecha en formato "YYYY-MM-DD"
      const formattedDate = eventDate.toISOString().split("T")[0];

      return [...day.activities, day.lunch, day.dinner]
        .filter((place): place is Place => place !== null)
        .map((place, i) => ({
          _id: `${formattedDate}-${i}`,
          title: place.name ?? "Unknown Place",
          start: formattedDate,
          category: place.category ?? "activity"
        }));
    });

    this.events.set(allEvents);
    this.calendarOptions = { ...this.calendarOptions, events: [...this.events()] };
  }

  handleEventClick(clickInfo: EventClickArg) {
    const clickedDate = clickInfo.event.start;
    if (!clickedDate) return;

    const clickedDateStr = clickedDate.toISOString().split("T")[0];
    const eventsForDay = this.events().filter(({ start }) => start === clickedDateStr);
    if (!eventsForDay.length) {
      console.warn(" No se encontraron eventos para esta fecha.");
      return;
    }

    this.selectedDayEvents.set({ date: clickedDate, events: eventsForDay });
    this.dayDetailModalOpen.set(true);
  }
}
