import { Component, inject, OnInit, signal } from '@angular/core';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from '../../services/user.service';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary, Place } from '../../interfaces/itinerary';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { TripModalComponent } from '../trip-modal/trip-modal.component';
import { DayDetailModalComponent } from '../day-detail-modal/day-detail-modal.component';
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

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    editable: true,
    eventDrop: this.handleEventDrop.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  ngOnInit(): void {
    this.loadUserSavedTrips();
  }

  loadUserSavedTrips(): void {
    this.userService.getUserSavedTrips().subscribe({
      next: (savedTrips) => {
        const sortedTrips = savedTrips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        this.savedTrips.set(sortedTrips);

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
          this.loadGeneralItinerary();
        }
      },
      error: (error) => console.error('Error loading saved trips:', error)
    });
  }

  loadGeneralItinerary(): void {
    this.itineraryService.getItinerary('barcelona').subscribe({
      next: (itinerary) => {
        if (!itinerary.days || itinerary.days.length === 0) return;
        this.currentItinerary.set(itinerary);
        const eventsFromGeneral = this.generateEventsFromItinerary(itinerary, new Date(itinerary.startDate));
        this.events.set(eventsFromGeneral);
        this.calendarOptions = { ...this.calendarOptions, events: this.events() };
      },
      error: (error) => console.error('Error loading general itinerary:', error)
    });
  }

  openTripModal(): void {
    this.tripModalOpen.set(true);
  }

  showToast(text: string): void {
    this.toastMessage.set({ type: 'info', text });
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  generateEventsFromItinerary(itinerary: Itinerary, startDate: Date): CalendarEvent[] {
    if (!itinerary || !itinerary.days || itinerary.days.length === 0) return [];

    const baseDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    return itinerary.days.flatMap((day, index) => {
      const currentDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + index);
      const formattedDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}-${('0' + currentDate.getDate()).slice(-2)}`;
      const places: Place[] = this.extractPlaces(day.activities);

      return places.map((place) => ({
        _id: place._id,
        title: place.name || 'Unknown Place',
        start: formattedDate,
        category: place.category || 'activity',
        itineraryId: itinerary._id!,
      }));
    });
  }

  extractPlaces(places: (Place | string | null)[]): Place[] {
    return places.filter((place): place is Place => place !== null && typeof place === 'object' && 'name' in place);
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const clickedDate = clickInfo.event.start;
    if (!clickedDate) return;

    const localClickedDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
    const clickedDateStr = `${localClickedDate.getFullYear()}-${('0' + (localClickedDate.getMonth() + 1)).slice(-2)}-${('0' + localClickedDate.getDate()).slice(-2)}`;

    const eventsForDay = this.events().filter(({ start }) => start === clickedDateStr);
    if (!eventsForDay.length) return;

    const itineraryId = eventsForDay[0].itineraryId;
    const matchingTrip = this.savedTrips().find(trip => trip._id === itineraryId);
    if (matchingTrip) {
      this.currentItinerary.set(matchingTrip);
    }

    this.selectedDayEvents.set({ date: clickedDate, events: eventsForDay });
    this.dayDetailModalOpen.set(true);
  }

  handleEventDrop(info: EventDropArg): void {
    const event = info.event;
    const itineraryId = event.extendedProps['itineraryId'];
    const activityId = event.extendedProps['_id'];
    const toDayDate = event.start?.toISOString().split('T')[0];
    const fromDayDate = info.oldEvent.start?.toISOString().split('T')[0];

    if (!itineraryId || !activityId || !fromDayDate || !toDayDate) {
      console.warn("🚨 Falta información del evento, no se puede mover.");
      return;
    }

    this.userService.moveUserTripActivity(itineraryId, activityId, fromDayDate, toDayDate)
      .subscribe({
        next: (updatedItinerary) => {
          console.log("Actividad movida exitosamente:", updatedItinerary);
          this.updateCalendarEvents(updatedItinerary);
          this.showToast("✅ Activity moved!");
        },
        error: (error) => {
          console.error("Error al mover la actividad:", error);
          info.revert();
          this.showToast("❌ Failed to move activity.");
        }
      });
  }

  onSaveTrip({ startDate }: { startDate: string }): void {
    const currentTrip = this.currentItinerary();
    if (!currentTrip) {
      this.showToast("⚠️ No itinerary currently loaded");
      return;
    }

    const newTripStartDate = new Date(startDate).toISOString().split('T')[0];
    const tripAlreadyExists = this.savedTrips().some(
      trip => new Date(trip.startDate).toISOString().split('T')[0] === newTripStartDate
    );

    if (tripAlreadyExists) {
      this.showToast("⚠️ You already have a trip saved for this date.");
      return;
    }

    this.userService.saveUserTrip(
      currentTrip.city,
      currentTrip.days,
      new Date(startDate)
    ).subscribe({
      next: (newTrip) => {
        console.log("Nuevo viaje guardado:", newTrip);
        this.savedTrips.update(trips => [...trips, newTrip]);
        this.currentItinerary.set(newTrip);
        const newTripEvents = this.generateEventsFromItinerary(newTrip, new Date(newTrip.startDate));
        this.events.update(events => [...events, ...newTripEvents]);
        this.calendarOptions = { ...this.calendarOptions, events: this.events() };
        this.showToast("✅ Trip saved successfully.");
        this.tripModalOpen.set(false);
      },
      error: (error) => {
        console.error(" Error saving trip:", error);
        this.showToast("❌ Error saving the trip.");
      }
    });
  }

  updateCalendarEvents(updatedTrip: Itinerary): void {
    const updatedEvents = this.generateEventsFromItinerary(updatedTrip, new Date(updatedTrip.startDate));
    this.events.set(updatedEvents);
    this.calendarOptions = { ...this.calendarOptions, events: this.events() };
  }
}
