import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';

/**
 * Interface voor locaties of venues voor events
 * Bevat geografische en adres informatie
 */
export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;  // Geografische coördinaten voor kaarten
  longitude: number;
}

/**
 * Basis Event interface met event gegevens
 * Elk event is gekoppeld aan een specifieke locatie
 */
export interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;     // ISO datetime string for when the event takes place
  location: Location;     // Genest locatie object voor venue details
  locationId: number;     // Foreign key verwijzing naar locatie
}

/**
 * Uitgebreide Event interface met registratie data
 * Gebruikt in admin dashboard om events met inschrijvingsaantallen weer te geven
 */
export interface EventWithRegistrationsCount extends Event {
  registrations?: any[];  // Collectie gebruikersregistraties voor dit event
}


export interface Feedback {
  author : string;
  message: string;
  created: string;     // ISO-datum als string
}

/**
 * Service verantwoordelijk voor alle event-gerelateerde API operaties
 * Verzorgt CRUD operaties voor events en het ophalen van locatie data
 */
@Injectable({ providedIn: 'root' })
export class EventsService {
  // API endpoint URLs
  private apiUrl          = 'https://localhost:7100/api/events';
  private locationsUrl    = 'https://localhost:7100/api/locations';
  private registrationsUrl= 'https://localhost:7100/api/registrations';

  constructor(
    private http : HttpClient,
    private auth : AuthService
  ) {}

  /* ----- HELPER METHODE: voer een callback uit met Bearer-headers ----- */
  private authed<T>(cb: (h: HttpHeaders) => Observable<T>): Observable<T> {
    // Deze helper vereenvoudigt het toevoegen van auth tokens aan requests
    return from(this.auth.getAccessTokenSilently()).pipe(
      switchMap(token => cb(
        new HttpHeaders().set('Authorization', `Bearer ${token}`)
      ))
    );
  }
  

  /* ----- BASIS REQUESTS ZONDER AUTHENTICATIE ----- */
  // Alle events ophalen
  getAllEvents() { 
    return this.http.get<Event[]>(this.apiUrl); 
  }
  
  // Specifiek event op basis van ID ophalen
  getEventById(id: number) { 
    return this.http.get<Event>(`${this.apiUrl}/${id}`); 
  }
  
  // Alle beschikbare locaties ophalen
  getAllLocations() { 
    return this.http.get<Location[]>(this.locationsUrl); 
  }

  // Nieuw event toevoegen
  addEvent(dto: Omit<Event,'id'|'location'>) {
    // Dummy locatie object toevoegen zoals vereist door de API
    return this.http.post<Event>(this.apiUrl, {
      ...dto,
      location:{ id:0,name:'',address:'',latitude:0,longitude:0 }
    });
  }
  
  // Event verwijderen op basis van ID
  deleteEvent(id:number) { 
    return this.http.delete(`${this.apiUrl}/${id}`); 
  }

  /* ----- REGISTRATIE FUNCTIONALITEIT (MET AUTH) ----- */
  // Gebruiker inschrijven voor een event
  registerForEvent(eventId:number){
    return this.authed(h =>
      this.http.post(`${this.registrationsUrl}/event/${eventId}`, {}, { headers:h })
    );
  }

  // Gebruiker uitschrijven voor een event
  unregisterFromEvent(eventId:number){
    return this.authed(h =>
      this.http.delete(`${this.registrationsUrl}/event/${eventId}/current`, { headers:h })
    );
  }

  // Controleer of huidige gebruiker is ingeschreven voor een event
  isUserRegisteredForEvent(eventId:number){
    return this.authed(h =>
      this.http.get<boolean>(`${this.registrationsUrl}/event/${eventId}/current`, { headers:h })
        .pipe( catchError(()=>of(false)) )  // Bij fout: niet ingeschreven
    );
  }



getFeedback(eventId: number): Observable<Feedback[]> {
  // Backend requires auth - use the authed helper like other secured endpoints
  return this.authed(h =>
    this.http.get<Feedback[]>(`${this.apiUrl}/${eventId}/feedback`, { headers: h })
  );
}

addFeedback(eventId: number, msg: string): Observable<any> {
  return this.authed(h =>
    this.http.post(
      `${this.apiUrl}/${eventId}/feedback`,
      JSON.stringify(msg),                 // body is plain string
      { headers: h.set('Content-Type','application/json') }
    )
  );
}


}
