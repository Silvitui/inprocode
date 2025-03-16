import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from '../../services/user.service';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary, Place } from '../../interfaces/itinerary';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { TripModalComponent } from '../trip-modal/trip-modal.component';
import { DayDetailModalComponent } from '../day-detail-modal/day-detail-modal.component';
import { EditDeleteModalComponent } from '../edit-delete-modal/edit-delete-modal.component';
import { CalendarEvent } from '../../interfaces/calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, TripModalComponent, DayDetailModalComponent],
  templateUrl: './calendary.component.html',
  styleUrls: ['./calendary.component.scss'],
})
export class CalendaryComponent implements OnInit {
  userService = inject(UserService);
  itineraryService = inject(ItineraryService);
  savedTrips = signal<Itinerary[]>([]);
  currentItinerary = signal<Itinerary | null>(null);
  events = signal<CalendarEvent[]>([]);
  tripModalOpen = signal(false);
  dayDetailModalOpen = signal(false);
  selectedDayEvents = signal<{ date: Date; events: CalendarEvent[] } | null>(null);
  toastMessage = signal<{ type: string; text: string } | null>(null);
  editModalOpen = signal(false);
  selectedActivity = signal<{ itineraryId: string; activityId: string; name: string } | null>(null);
  editedActivityName = signal('');

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };

  ngOnInit(): void {
    this.loadUserSavedTrips();
  }

  loadUserSavedTrips(): void {
    this.userService.getUserSavedTrips().subscribe({
      next: (savedTrips) => {
        // Ordenar los itinerarios por fecha de inicio
        const sortedTrips = savedTrips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        this.savedTrips.set(sortedTrips);

        // Si hay itinerarios guardados, creamos los eventos en el calendario
        if (sortedTrips.length > 0) {
          this.currentItinerary.set(sortedTrips[0]);
          let combinedEvents: CalendarEvent[] = [];
          sortedTrips.forEach(trip => {
            if (trip.days && trip.days.length > 0) {
              const tripEvents = this.generateEventsFromItinerary(trip, new Date(trip.startDate));
              combinedEvents = combinedEvents.concat(tripEvents);
            }
          });
          this.events.set(combinedEvents);
          this.calendarOptions = { ...this.calendarOptions, events: this.events() };
        } else {
          console.warn('⚠️ No saved trips. Loading general itinerary.');
          this.loadGeneralItinerary();
        }
      },
      error: (error) => console.error(' Error loading saved trips:', error)
    });
  }

  loadGeneralItinerary(): void {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (itinerary) => {
        console.log('General itinerary loaded:', itinerary);
        if (!itinerary.days || itinerary.days.length === 0) {
          console.error('The general itinerary has no days.');
          return;
        }
        this.currentItinerary.set(itinerary);
        const eventsFromGeneral = this.generateEventsFromItinerary(itinerary, new Date(itinerary.startDate));
        this.events.set(eventsFromGeneral);
        this.calendarOptions = { ...this.calendarOptions, events: this.events() };
      },
      error: (error) => console.error(' Error loading general itinerary:', error)
    });
  }

  openTripModal(): void {
    this.tripModalOpen.set(true);
  }

  onSaveTrip({ startDate }: { startDate: string }): void {
    const currentTrip = this.currentItinerary();
    if (!currentTrip) {
      this.showToast('⚠️ No itinerary currently loaded');
      return;
    }
    const newTripStartDate = new Date(startDate).toISOString().split('T')[0];
    const tripAlreadyExists = this.savedTrips().some(
      trip => new Date(trip.startDate).toISOString().split('T')[0] === newTripStartDate
    );
    if (tripAlreadyExists) {
      this.showToast('⚠️ You already have a trip saved for this date.');
      return;
    }
    // llamamos al backend para guardar el viaje
    this.userService.saveUserTrip(
      currentTrip.city,
      currentTrip.days,
      new Date(startDate)
    ).subscribe({
      next: (newTrip) => {
        console.log('✅ Nuevo viaje guardado :', newTrip);
        // Actualizar la lista de viajes guardados
        this.savedTrips.update(trips => [...trips, newTrip]);
        // El nuevo viaje se queda como itinerario actual
        this.currentItinerary.set(newTrip);
        const newTripEvents = this.generateEventsFromItinerary(newTrip, new Date(newTrip.startDate));
        this.events.update(events => [...events, ...newTripEvents]);
        this.calendarOptions = { ...this.calendarOptions, events: this.events() };
        this.showToast('✅ Trip saved successfully.');
        this.tripModalOpen.set(false);
      },
      error: (error) => {
        console.error('❌ Error saving trip:', error);
        this.showToast('❌ Error saving the trip.');
      }
    });
  }

  showToast(text: string): void {
    this.toastMessage.set({ type: 'info', text });
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  // Generar los eventos del calendario a partir de un itinerario
  generateEventsFromItinerary(itinerary: Itinerary, startDate: Date): CalendarEvent[] {
    if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
      console.warn('⚠️ El itinerario no tiene días.');
      return [];
    }

    // Normalizamos la fecha de inicio en tiempo local (hora 0)
    const baseDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    // Usamos el orden del array (el primer día del array se asigna a baseDate, etc.)
    const events: CalendarEvent[] = itinerary.days.flatMap((day, index) => {
      // Calculamos la fecha para este día en tiempo local
      const currentDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + index);
      // Formateamos la fecha de manera local en formato YYYY-MM-DD
      const formattedDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;

      // Combina las actividades, lunch y dinner
      const places: Place[] = [
        ...this.extractPlaces(day.activities),
        ...(day.lunch && typeof day.lunch === 'object' ? [day.lunch as Place] : []),
        ...(day.dinner && typeof day.dinner === 'object' ? [day.dinner as Place] : [])
      ];

      return places.map((place, i) => ({
        _id: `${formattedDate}-${i}`,
        title: place.name || 'Unknown Place',
        start: formattedDate,
        category: place.category || 'activity',
        itineraryId: itinerary._id! // Forzamos que _id sea string
      }));
    });

    console.log('Generated events:', events);
    return events;
  }

  // Al hacer clic sobre un evento, lo usamos para editar una actividad o ver detalles
  handleEventClick(clickInfo: EventClickArg): void {
    const clickedDate = clickInfo.event.start;
    if (!clickedDate) return;

    // Convertimos clickedDate a tiempo local
    const localClickedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const clickedDateStr = `${localClickedDate.getFullYear()}-${('0' + (localClickedDate.getMonth() + 1)).slice(-2)}-${('0' + localClickedDate.getDate()).slice(-2)}`;

    const eventsForDay = this.events().filter(({ start }) => start === clickedDateStr);
    if (!eventsForDay.length) {
      console.warn('No events found for this date.');
      return;
    }
    // Usamos el itineraryId del primer evento para encontrar el trip
    const itineraryId = eventsForDay[0].itineraryId;
    const matchingTrip = this.savedTrips().find(trip => trip._id === itineraryId);
    if (matchingTrip) {
      this.currentItinerary.set(matchingTrip);
    }

    // Si quieres mostrar un modal de detalles del día:
    this.selectedDayEvents.set({ date: clickedDate, events: eventsForDay });
    this.dayDetailModalOpen.set(true);
  }

  // Filtra los objetos nulos y strings para quedarnos solo con Place
  extractPlaces(places: (Place | string | null)[]): Place[] {
    return places.filter((place): place is Place =>
      place !== null &&
      typeof place === 'object' &&
      'name' in place &&
      typeof (place as Place).name === 'string'
    );
  }
  onUpdatedTrip(updatedTrip: Itinerary): void {
    this.savedTrips.update(trips =>
      trips.map(trip => trip._id === updatedTrip._id ? updatedTrip : trip)
    );
  
    if (this.currentItinerary()?._id === updatedTrip._id) {
      this.currentItinerary.set(updatedTrip);
    }
    const updatedEvents = this.events().map(event => {
      const updatedActivity = updatedTrip.days
        .flatMap(day => day.activities)
        .find(activity => activity.name === event.title);  
      return updatedActivity ? { ...event, title: updatedActivity.name } : event;
    });
  
    this.events.set(updatedEvents);
    this.calendarOptions = { ...this.calendarOptions, events: this.events() };
  }
  
  
  
}
