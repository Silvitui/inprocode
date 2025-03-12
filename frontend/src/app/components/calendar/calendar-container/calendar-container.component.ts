// // calendar-container.component.ts
// import { Component, inject, OnInit, signal } from '@angular/core';
// import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { UserService } from '../../../services/user.service';
// import { Itinerary } from '../../../interfaces/itinerary';
// import { CalendarEvent } from '../../../interfaces/calendar';
// import { CalendarService } from '../../../services/calendar.service';
// import { CalendarViewComponent } from '../calendar-view/calendar-view.component';



// @Component({
//   selector: 'app-calendar-container',
//   standalone: true,
//   imports: [CalendarViewComponent],
//   templateUrl: `./calendar-container.component.html`,
  
  
// })
// export class CalendarContainerComponent implements OnInit {
//   userService = inject(UserService);
//   calendarService = inject(CalendarService);

//   // Estado
//   savedTrips = signal<Itinerary[]>([]);
//   currentItinerary = signal<Itinerary | null>(null);
//   events = signal<CalendarEvent[]>([]);
  
//   tripModalOpen = signal(false);
//   dayDetailModalOpen = signal(false);
//   selectedDayEvents = signal<{ date: Date; events: CalendarEvent[] } | null>(null);

//   calendarOptions: CalendarOptions = {
//     plugins: [dayGridPlugin, interactionPlugin],
//     initialView: 'dayGridMonth',
//     events: [],
//     // eventClick se delega a una función del contenedor (si se necesita)
//     eventClick: (info: EventClickArg) => this.handleEventClick(info)
//   };

//   ngOnInit(): void {
//     this.loadUserSavedTrips();
//   }

//   loadUserSavedTrips(): void {
//     this.userService.getUserSavedTrips().subscribe({
//       next: (trips) => {
//         console.log("✅ SavedTrips recibidos:", trips);
//         if (trips.length > 0) {
//           this.savedTrips.set(trips);
//           // Usamos el primer trip guardado como base para generar eventos
//           this.currentItinerary.set(trips[0]);
//           const allEvents = trips.flatMap(trip => this.calendarService.generateEventsFromTrip(trip));
//           this.events.set(allEvents);
//           this.calendarOptions = { ...this.calendarOptions, events: allEvents };
//         } else {
//           console.log("⚠️ No hay trips guardados. Cargando itinerario base...");
//           this.loadItineraryBase();
//         }
//       },
//       error: (error) => {
//         console.error("❌ Error al cargar savedTrips:", error);
//         this.loadItineraryBase();
//       }
//     });
//   }

//   loadItineraryBase(): void {
//     const defaultItinerary: Itinerary = {
//       _id: 'default',
//       city: 'Barcelona',
//       startDate: new Date(),
//       days: Array.from({ length: 5 }, (_, i) => ({
//         day: i + 1,
//         title: `Día ${i + 1}`,
//         activities: [],
//         lunch: null,
//         dinner: null,
//         distance: 0,
//         transportation: {}
//       })) // 🔥 Genera 5 días automáticamente
//     };
  
//     console.log("✅ Cargando itinerario base con días:", defaultItinerary.days);
//     this.currentItinerary.set(defaultItinerary);
//   }
  
//   openTripModal(): void {
//     this.tripModalOpen.set(true);
//   }

//   onSaveTrip({ startDate, daysCount }: { startDate: string, daysCount: number }): void {
//     if (!this.currentItinerary()) {
//       console.warn("No hay itinerario base cargado para copiar.");
//       return;
//     }
//     // Prevención: si ya existe un trip para esa fecha, no se crea uno nuevo.
//     const formattedDate = new Date(startDate).toISOString().split("T")[0];
//     const duplicate = this.savedTrips().find(trip => {
//       if (trip.startDate) {
//         const tripDate = new Date(trip.startDate).toISOString().split("T")[0];
//         return tripDate === formattedDate;
//       }
//       return false;
//     });
//     if (duplicate) {
//       console.warn("Ya existe un trip guardado para esa fecha.");
//       return;
//     }
    
//     const copiedItinerary: Itinerary = {
//       ...this.currentItinerary()!,
//       _id: '', // Se generará un nuevo ID en el backend
//       startDate: new Date(startDate),
//       // Aquí se copia la plantilla; se asume que los días vienen ya definidos en la plantilla.
//       days: this.currentItinerary()!.days.map(day => ({ ...day }))
//     };

//     this.userService.saveUserTrip(copiedItinerary.city, copiedItinerary.days, new Date(startDate))
//       .subscribe({
//         next: (newTrip) => {
//           console.log("✅ Nuevo itinerario guardado:", newTrip);
//           this.savedTrips.update(trips => [...trips, newTrip]);
//           this.currentItinerary.set(newTrip);
//           const newTripEvents = this.calendarService.generateEventsFromTrip(newTrip);
//           this.events.update(old => [...old, ...newTripEvents]);
//           this.calendarOptions = { ...this.calendarOptions, events: [...this.events()] };
//           this.tripModalOpen.set(false);
//         },
//         error: (error) => console.error("❌ Error al guardar el trip:", error)
//       });
//   }

//   handleEventClick(clickInfo: EventClickArg): void {
//     const clickedDate = clickInfo.event.start;
//     if (!clickedDate) return;
//     const clickedDateStr = clickedDate.toISOString().split("T")[0];
//     const eventsForDay = this.events().filter(({ start }) => start === clickedDateStr);
//     if (!eventsForDay.length) {
//       console.warn("⚠️ No se encontraron eventos para esta fecha.");
//       return;
//     }
//     this.selectedDayEvents.set({ date: clickedDate, events: eventsForDay });
//     this.dayDetailModalOpen.set(true);
//   }
// }
