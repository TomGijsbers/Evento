import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '.././events/events.service';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.component.html'
})
export class LocationCardComponent {
  @Input() location!: Location;
  @Input() index = 0;
  @Output() remove = new EventEmitter<Location>();
}
