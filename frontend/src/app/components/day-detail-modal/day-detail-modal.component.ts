import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from '../../interfaces/calendar';
import { Itinerary, Day, Place } from '../../interfaces/itinerary';
import { UserService } from '../../services/user.service';
import { EditDeleteModalComponent } from '../edit-delete-modal/edit-delete-modal.component';

@Component({
  selector: 'app-day-detail-modal',
  standalone: true,
  imports: [CommonModule, EditDeleteModalComponent],
  templateUrl: './day-detail-modal.component.html',
  styleUrls: ['./day-detail-modal.component.scss']
})
export class DayDetailModalComponent implements OnChanges {
  userService = inject(UserService);

  @Input() selectedDate: Date | null = null;
  @Input() events: CalendarEvent[] = [];
  @Input() currentItinerary: Itinerary | null = null; // Saved trip del usuario
  openModal = signal(false);
  editModalOpen = signal(false);
  dayDescription = signal('');
  activityToEdit: string | null = null;

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
    console.log("Day description generated:", this.dayDescription());
  }

  close(): void {
    this.openModal.set(false);
  }
  openEditModal(activityName: string): void {
    console.log("Open edit-delete modal for activity:", activityName);
    this.activityToEdit = activityName;
    this.editModalOpen.set(true);
  }


  handleEditSave(newName: string): void {
    if (!this.currentItinerary) return;
    const oldName = this.activityToEdit;
    if (!oldName) return;
    if (!this.currentItinerary._id) {
      console.error("❌ Cannot update itinerary because _id is missing.");
      return;
    }
    const updatedDays: Day[] = this.currentItinerary.days.map(day => ({
      ...day,
      activities: day.activities.map(activity =>
        activity.name === oldName ? { ...activity, name: newName } : activity
      )
    }));
    console.log("Updating itinerary for edit with updatedDays:", updatedDays);
    this.userService.updateUserTrip(this.currentItinerary._id!, { days: updatedDays }).subscribe({
      next: (updatedTrip) => {
        console.log("✅ Activity edited successfully:", updatedTrip);
        this.currentItinerary = updatedTrip;
        this.editModalOpen.set(false);
      },
      error: (err) => console.error("❌ Error editing activity:", err)
    });
  }

 
  handleDelete(): void {
    if (!this.currentItinerary) return;
    const activityName = this.activityToEdit;
    if (!activityName) return;
    if (!this.currentItinerary._id) {
      console.error(" Cannot update itinerary because _id is missing.");
      return;
    }
    const updatedDays: Day[] = this.currentItinerary.days.map(day => ({
      ...day,
      activities: day.activities.filter(activity => activity.name !== activityName)
    }));
    console.log("Updating itinerary for deletion with updatedDays:", updatedDays);
    this.userService.updateUserTrip(this.currentItinerary._id!, { days: updatedDays }).subscribe({
      next: (updatedTrip) => {
        console.log("✅ Activity deleted successfully:", updatedTrip);
        this.currentItinerary = updatedTrip;
        this.editModalOpen.set(false);
      },
      error: (err) => console.error("Error deleting activity:", err)
    });
  }

  trackEvent(index: number, event: CalendarEvent): string {
    return event.title;
  }
  

  cancelEdit(): void {
    this.editModalOpen.set(false);
  }
}
