import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventRegistrationDTO } from '../admindashboard/registration.service';

@Component({
  selector: 'app-registration-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './registration-table.component.html',
  styleUrls: ['./registration-table.component.css']
})
export class RegistrationTableComponent {
  @Input() registrations: EventRegistrationDTO[] | null = null;
  @Output() delete = new EventEmitter<number>();
  
  // Helper method to emit the delete event
  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
