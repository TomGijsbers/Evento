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
  // Lijst van locaties die weergegeven worden
  locations: Location[] = [];
  // Indicator of data nog wordt geladen
  loading = true;
  // Indicator of er een fout is opgetreden
  error = false;

  constructor(
    private locationsService: LocationsService
  ) {}

  /**
   * Angular lifecycle hook - wordt uitgevoerd na initialisatie
   * Haalt de locaties op van de API
   */
  ngOnInit(): void {
    this.fetchLocations();
  }

  /**
   * Haalt alle locaties op van de backend API
   * Behandelt zowel succesvolle responses als fouten
   */
  private fetchLocations(): void {
    this.locationsService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fout bij het ophalen van locaties', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}