import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsService, Location, Event } from '../events/events.service';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component'; // Corrected path

@Component({
  selector: 'app-teamleader-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateEventModalComponent],
  templateUrl: './teamleader-create-event.component.html',
  styleUrls: ['./teamleader-create-event.component.css']
})
export class TeamleaderCreateEventComponent implements OnInit {
  locations: Location[] = [];
  showCreateModal = false;

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.eventsService.getAllLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  onAddEvent(newEventData: Omit<Event, 'id' | 'registrations'>): void {
    this.eventsService.addEvent(newEventData).subscribe({
      next: () => {
        console.log('Event added successfully by team leader');
        this.closeCreateModal();
        // Optionally, you can add a success message or redirect the user
      },
      error: (err) => {
        console.error('Error adding event:', err);
        // Optionally, display an error message to the user
      }
    });
  }
}
