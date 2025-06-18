import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface voor event registratie gegevens
 * Bevat alle informatie over een gebruikersregistratie voor een event
 */
export interface EventRegistrationDTO {
  id: number;           // Unieke identificatie van de registratie
  userEmail: string;    // Email adres van de geregistreerde gebruiker
  eventName: string;    // Naam van het event waarvoor geregistreerd is
  registeredAt: string; // Tijdstip van registratie (ISO string formaat)
}

/**
 * Service voor het beheren van event registraties
 * Biedt functionaliteit voor het bekijken, aanmaken en verwijderen van registraties
 */
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  // API URL voor registratie endpoints
  private apiUrl = 'https://localhost:7100/api/Registrations';

  constructor(private http: HttpClient) { }

  /**
   * Haalt alle registraties op voor een specifiek event
   * Gebruikt door admins om te zien wie er geregistreerd is
   * @param eventId Het id van het event waarvoor registraties opgehaald worden
   * @returns Observable met array van registratie gegevens
   */
  getRegistrationsByEvent(eventId: number): Observable<EventRegistrationDTO[]> {
    return this.http.get<EventRegistrationDTO[]>(`${this.apiUrl}/event/${eventId}`);
  }

  /**
   * Verwijdert een registratie op basis van registratie ID
   * Kan gebruikt worden door admins of gebruikers om registratie te annuleren
   * @param registrationId Het id van de te verwijderen registratie
   * @returns Observable voor het volgen van de delete operatie
   */
  deleteRegistration(registrationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${registrationId}`);
  }

  /**
   * Registreert een gebruiker voor een event
   * Gebruiker moet ingelogd zijn - backend haalt user info uit JWT token
   * @param eventId Het id van het event waarvoor geregistreerd wordt
   * @returns Observable voor het volgen van de registratie
   */
  registerForEvent(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/event/${eventId}`, {});
  }
}
