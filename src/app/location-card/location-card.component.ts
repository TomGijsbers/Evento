import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '.././events/events.service';

/**
 * Locatie kaart component - toont locatie informatie met verwijder functionaliteit
 */
@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.component.html'
})
export class LocationCardComponent {
  @Input() location!: Location;  // Locatie gegevens
  @Input() index = 0;            // Index voor styling
  @Output() remove = new EventEmitter<Location>();  // Verwijder event
}
