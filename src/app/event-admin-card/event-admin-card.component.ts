import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventWithRegistrationsCount } from '../events/events.service';

@Component({
  selector: 'app-event-admin-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-admin-card.component.html'
})
export class EventAdminCardComponent {
  @Input() event!: EventWithRegistrationsCount;
  @Input() index = 0;

  /** Klik op hele kaart → open accordion */
  @Output() open    = new EventEmitter<EventWithRegistrationsCount>();
  /** Klik op rode knop → verwijderen */
  @Output() remove  = new EventEmitter<EventWithRegistrationsCount>();
}
