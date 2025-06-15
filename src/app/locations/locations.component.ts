import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsService, Location } from './locations.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  loading = true;
  error = false;

  constructor(
    private locationsService: LocationsService
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
  }

  private fetchLocations(): void {
    this.locationsService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching locations', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}