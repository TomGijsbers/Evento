import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  id: number;        // Unieke identificatie van de locatie
  name: string;      // Naam van de locatie
  address: string;   // Adres van de locatie
  latitude: number;  // Breedtegraad voor kaartweergave
  longitude: number; // Lengtegraad voor kaartweergave
}

// Data Transfer Object voor het aanmaken van nieuwe locaties (zonder id)
export type CreateLocationDto = Omit<Location, 'id'>;

/**
 * Service voor het beheren van locaties
 * Communiceert met de backend API voor CRUD operaties
 */
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  // Base URL voor de locaties API endpoints
  private apiUrl = 'https://localhost:7100/api/Locations';

  constructor(private http: HttpClient) { }

  /**
   * Haalt alle locaties op van de backend
   * @returns Observable met een array van locaties
   */
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  /**
   * Maakt een nieuwe locatie aan in de database
   * @param dto Locatie gegevens zonder id (wordt door backend toegewezen)
   * @returns Observable met de aangemaakte locatie inclusief id
   */
  createLocation(dto: CreateLocationDto): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, dto);   // ← dto heeft géén id
  }

  /**
   * Verwijdert een locatie uit de database
   * @param id Het id van de te verwijderen locatie
   * @returns Observable voor het volgen van de delete operatie
   */
  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

