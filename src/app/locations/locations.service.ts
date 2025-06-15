import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Payload zonder id
export type CreateLocationDto = Omit<Location, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private apiUrl = 'https://localhost:7100/api/Locations';

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  createLocation(dto: CreateLocationDto): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, dto);   // ← dto heeft géén id
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

