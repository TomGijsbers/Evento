import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventRegistrationDTO {
  id: number;
  userEmail: string;
  eventName: string;
  registeredAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'https://localhost:7100/api/Registrations';

  constructor(private http: HttpClient) { }

  getRegistrationsByEvent(eventId: number): Observable<EventRegistrationDTO[]> {
    return this.http.get<EventRegistrationDTO[]>(`${this.apiUrl}/event/${eventId}`);
  }

  deleteRegistration(registrationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${registrationId}`);
  }

  registerForEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/event/${eventId}`, {});
  }
}
