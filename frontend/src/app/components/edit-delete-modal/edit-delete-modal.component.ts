import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-delete-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-delete-modal.component.html',
  styleUrls: ['./edit-delete-modal.component.scss']
})
export class EditDeleteModalComponent {
  @Input() activityName: string = '';
  @Output() saveEdit = new EventEmitter<string>();
  @Output() deleteActivity = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  editedName: string = '';

  ngOnInit(): void {
    this.editedName = this.activityName;
  }

  onSave(): void {
    if (this.editedName.trim() && this.editedName.trim() !== this.activityName) {
      this.saveEdit.emit(this.editedName.trim());
    }
  }

  onDelete(): void {
    this.deleteActivity.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
