import { Component, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';
import * as L from 'leaflet';

export interface LocationDto {
  lat: number;      // Breedtegraad
  lng: number;      // Lengtegraad  
  address?: string; // Optioneel adres
}

/**
 * Kaart kiezer component - selecteer locatie door op kaart te klikken
 */
@Component({
  selector: 'app-map-picker',
  standalone: true,
  template: `<div id="map" class="h-72 w-full rounded border-2 border-black"></div>`,
})
export class MapPickerComponent implements AfterViewInit {

  @Output() locationSelected = new EventEmitter<LocationDto>();

  private map!: L.Map;
  private marker?: L.Marker;

  constructor(private ngZone: NgZone) {}  

  ngAfterViewInit(): void {
    // Start kaart op Antwerpen
    this.map = L.map('map').setView([51.219, 4.402], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Wacht tot dialog animatie klaar is
    this.ngZone.runOutsideAngular(() =>
      setTimeout(() => this.map.invalidateSize(), 200)
    );

    // Luister naar kaart klik events
    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Marker verplaatsen of aanmaken
      if (this.marker) { 
        this.marker.setLatLng(e.latlng); 
      } else { 
        this.marker = L.marker(e.latlng).addTo(this.map); 
      }

      // Adres opzoeken via reverse geocoding
      let address: string | undefined;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        address = data.display_name;
      } catch { 
        // Negeer fouten bij adres opzoeken
      }

      this.locationSelected.emit({ lat, lng, address });
    });
  }
}