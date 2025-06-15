/* 
 * Admin Dashboard Component
 * 
 * Dit component toont een overzicht van alle events met hun inschrijvingen
 * in een admin dashboard interface met Bauhaus-geïnspireerd design.
 * 
 * Functionaliteiten:
 * - KPI overzicht (totaal events, locaties, inschrijvingen)
 * - Uitklapbare panelen per event
 * - Tabel met alle inschrijvingen per event
 * - Mogelijkheid om inschrijvingen te verwijderen
 * - Loading states met Bauhaus animaties
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// PrimeIcons toevoegen indien nodig - uitcommentariëren als nodig
// import 'primeicons/primeicons.css';
import { EventsService, EventWithRegistrationsCount, Location } from '/School/angular/WorkShopAngularAuth0/src/app/events/events.service';
import { RegistrationService, EventRegistrationDTO } from './registration.service';
import { LocationsService, CreateLocationDto } from '../locations/locations.service';
import { MapPickerComponent, LocationDto } from '../map-picker/map-picker.component';
import { forkJoin, map } from 'rxjs';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { RegistrationTableComponent } from '../registration-table/registration-table.component';
import { LocationCardComponent } from '../location-card/location-card.component';
import { EventAdminCardComponent } from '../event-admin-card/event-admin-card.component';
import { CreateEventModalComponent } from '../create-event-modal/create-event-modal.component';
import { CreateLocationModalComponent } from '../create-location-modal/create-location-modal.component';
import { NotificationService } from '../shared/notification.service';

/**
 * AdminEventBoardComponent - Admin dashboard voor het beheren van event inschrijvingen
 * 
 * Dit component toont alle events met hun inschrijvingen in een Bauhaus-geïnspireerde design.
 * Het stelt admins in staat om inschrijvingen per event te bekijken en indien nodig te verwijderen.
 * Het component gebruikt Angular Material's uitklapbare panelen om event details te tonen.
 * 
 * Features:
 * - Laadt alle events met hun inschrijvingsaantallen bij initialisatie
 * - Toont events in een visueel onderscheidende Bauhaus stijl
 * - Biedt mogelijkheid om inschrijvingsdetails per event te bekijken
 * - Ondersteunt het verwijderen van individuele inschrijvingen
 * - Toont loading indicatoren tijdens asynchrone operaties
 * - Toont KPI statistieken in overzichtelijke kaarten
 */
@Component({
  selector: 'app-admin-event-board',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [
    /* Angular Material componenten voor UI */
    MatExpansionModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    /* Angular common directives voor template logica */
    CommonModule,
    /* Reactive forms for event creation */
    ReactiveFormsModule,
    /* Map picker for location creation */
    MapPickerComponent,
    /* KPI Card Component */
    KpiCardComponent,
    /* Registration table component */
    RegistrationTableComponent,
    /* Location card component */
    LocationCardComponent,
    /* Event admin card component */
    EventAdminCardComponent,
    /* Create event modal component */
    CreateEventModalComponent,
    CreateLocationModalComponent
  ]
})
export class AdminEventBoardComponent implements OnInit {
  // Array om events met hun registratie data op te slaan
  events: EventWithRegistrationsCount[] = [];
  
  // Vlag om data loading status bij te houden
  loading = false;
  
  // KPI eigenschappen voor dashboard statistieken
  totalEvents = 0;        // Totaal aantal events in het systeem
  totalLocations = 0;     // Totaal aantal beschikbare locaties
  totalRegistrations = 0; // Totaal aantal inschrijvingen over alle events

  // Create event functionality
  locations: Location[] = [];                    // Beschikbare locaties
  showCreateModal = false;                       // Modal zichtbaarheid
  eventForm: FormGroup;                          // Formulier voor nieuw event

  // Location management properties
  showCreateLocationModal = false;
  locationForm: FormGroup;

  constructor(
    private eventsService: EventsService,    // Service voor event data operaties
    private regService: RegistrationService,  // Service voor registratie data operaties
    private fb: FormBuilder,  // Add FormBuilder
    private locationsService: LocationsService,
    private notificationService: NotificationService
  ) {
    // Initialiseer formulier met validators
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      eventDate: ['', Validators.required],
      locationId: [null, Validators.required]
    });
    
    // Initialiseer locatie formulier
    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  /**
   * Angular lifecycle hook die draait wanneer het component initialiseert
   * Start het laden van de initiële data
   */
  ngOnInit(): void {
    this.loadEvents();
    this.loadLocations(); // Load locations for form dropdown
  }

  /**
   * Laadt alle events met hun registratie data en berekent KPIs
   * Gebruikt forkJoin om te wachten tot alle API calls voltooid zijn voordat de UI wordt bijgewerkt
   * 
   * Proces:
   * 1. Zet loading status op true
   * 2. Haalt events en locaties op voor KPI berekening
   * 3. Voor elk event, haalt de bijbehorende inschrijvingen op
   * 4. Combineert alle data en berekent totalen
   * 5. Zet loading status op false
   */
  loadEvents(): void {
    this.loading = true;
    
    // Laad zowel events als locaties voor KPI berekening
    forkJoin({
      events: this.eventsService.getAllEvents(),
      locations: this.eventsService.getAllLocations()
    }).subscribe({
      next: ({ events, locations }) => {
        // Bereken basis KPIs
        this.totalEvents = events.length;
        this.totalLocations = locations.length;
        
        // Als er geen events zijn, stop hier
        if (events.length === 0) {
          this.events = [];
          this.totalRegistrations = 0;
          this.loading = false;
          return;
        }

        // Voor elk event, maak een Observable die zijn inschrijvingen ophaalt
        const registrationRequests = events.map(event => 
          this.regService.getRegistrationsByEvent(event.id).pipe(
            map(registrations => ({
              ...event,
              registrations
            } as EventWithRegistrationsCount))
          )
        );

        // Wacht tot alle inschrijving requests voltooid zijn
        forkJoin(registrationRequests).subscribe({
          next: eventsWithRegistrations => {
            this.events = eventsWithRegistrations;
            // Bereken totaal inschrijvingen over alle events
            this.totalRegistrations = eventsWithRegistrations.reduce(
              (total, event) => total + (event.registrations?.length || 0), 0
            );
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => (this.loading = false)
    });
  }

  /**
   * Laadt alle beschikbare locaties voor het formulier
   */
  loadLocations() {
    this.eventsService.getAllLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  /**
   * Opent de modal voor het aanmaken van een nieuw event
   */
  openCreateModal() {
    this.showCreateModal = true;
  }

  /**
   * Sluit de modal en reset het formulier
   */
  closeCreateModal() {
    this.showCreateModal = false;
    this.eventForm.reset();
    
    // Reset formulier validatie status
    Object.keys(this.eventForm.controls).forEach(key => {
      this.eventForm.get(key)?.setErrors(null);
      this.eventForm.get(key)?.markAsPristine();
      this.eventForm.get(key)?.markAsUntouched();
    });
  }

  /**
   * Voegt een nieuw event toe
   * Deze methode wordt nu aangeroepen door de CreateEventModalComponent
   */
  onAddEvent(newEventData: any) {
    this.eventsService.addEvent(newEventData).subscribe({
      next: () => {
        this.loadEvents();
        this.closeCreateModal();
        this.notificationService.showSuccess(`Event "${newEventData.name}" succesvol aangemaakt!`);
      },
      error: (err) => {
        console.error('Fout bij toevoegen event:', err);
        this.notificationService.showError('Fout bij het aanmaken van het event. Probeer het opnieuw.');
      }
    });
  }

  /**
   * Opent de modal voor het aanmaken van een nieuwe locatie
   */
  openCreateLocationModal() {
    this.showCreateLocationModal = true;
  }

  /**
   * Sluit de locatie modal
   */
  closeCreateLocationModal() {
    this.showCreateLocationModal = false;
  }

  /**
   * Voegt een nieuwe locatie toe
   */
  onAddLocation(locationData: any): void {
    // Convert to proper format if needed
    const location: CreateLocationDto = {
      name: locationData.name,
      address: locationData.address,
      latitude: typeof locationData.latitude === 'string' ? 
        parseFloat(locationData.latitude) : locationData.latitude,
      longitude: typeof locationData.longitude === 'string' ? 
        parseFloat(locationData.longitude) : locationData.longitude
    };

    this.locationsService.createLocation(location).subscribe({
      next: (created) => {
        this.locations.push(created);
        this.totalLocations = this.locations.length;
        this.closeCreateLocationModal();
        this.notificationService.showSuccess(`Locatie "${locationData.name}" succesvol aangemaakt!`);
      },
      error: (err) => {
        console.error('Fout bij toevoegen locatie:', err);
        this.notificationService.showError('Fout bij het aanmaken van de locatie. Probeer het opnieuw.');
      }
    });
  }

  /**
   * Laadt inschrijvingen voor een specifiek event wanneer het paneel wordt uitgeklapd
   * Deze methode wordt bewaard voor backwards compatibility maar is mogelijk niet nodig
   * omdat we nu alle inschrijvingen vooraf laden
   * 
   * @param event Het event waarvoor inschrijvingen geladen moeten worden
   */
  loadRegistrations(event: EventWithRegistrationsCount): void {
    // Als al geladen, niets doen
    if (event.registrations) return; 
    
    // Haal inschrijvingen op voor dit specifieke event
    this.regService
      .getRegistrationsByEvent(event.id)
      .subscribe(r => (event.registrations = r));
  }

  /**
   * Verwijdert een event en werkt de UI en KPIs bij
   * Toont een bevestigingsdialoog voordat het event wordt verwijderd
   * 
   * @param event Het event dat verwijderd moet worden
   */
  deleteEvent(event: EventWithRegistrationsCount) {
    if (confirm(`Weet je zeker dat je "${event.name}" wilt verwijderen?`)) {
      this.eventsService.deleteEvent(event.id).subscribe({
        next: () => {
          // Verwijder event uit lokale array
          this.events = this.events.filter(e => e.id !== event.id);
          
          // Update KPIs in real-time
          this.totalEvents = Math.max(0, this.totalEvents - 1);
          const deletedRegistrations = event.registrations?.length || 0;
          this.totalRegistrations = Math.max(0, this.totalRegistrations - deletedRegistrations);
          
          this.notificationService.showSuccess(`Event "${event.name}" succesvol verwijderd!`);
        },
        error: (err) => {
          console.error('Fout bij verwijderen event:', err);
          this.notificationService.showError('Fout bij het verwijderen van het event. Probeer het opnieuw.');
        }
      });
    }
  }

  /**
   * Verwijdert een inschrijving van een event
   */
  deleteRegistration(event: EventWithRegistrationsCount, regId: number) {
    this.regService.deleteRegistration(regId).subscribe({
      next: () => {
        // Werk de lokale data bij door de verwijderde inschrijving eruit te filteren
        event.registrations =
          event.registrations?.filter(r => r.id !== regId) ?? [];
        
        // Werk de totaal inschrijvingen KPI in real-time bij
        // Math.max zorgt ervoor dat we niet onder 0 gaan
        this.totalRegistrations = Math.max(0, this.totalRegistrations - 1);
        this.notificationService.showSuccess('Inschrijving succesvol verwijderd!');
      },
      error: (err) => {
        console.error('Fout bij verwijderen inschrijving:', err);
        this.notificationService.showError('Fout bij het verwijderen van de inschrijving. Probeer het opnieuw.');
      }
    });
  }

  /**
   * Verwijdert een locatie
   */
  deleteLocation(location: Location) {
    if (confirm(`Weet je zeker dat je "${location.name}" wilt verwijderen?`)) {
      this.locationsService.deleteLocation(location.id).subscribe({
        next: () => {
          this.locations = this.locations.filter(l => l.id !== location.id);
          this.totalLocations = this.locations.length;
          this.notificationService.showSuccess(`Locatie "${location.name}" succesvol verwijderd!`);
        },
        error: (err) => {
          console.error('Fout bij verwijderen locatie:', err);
          this.notificationService.showError('Fout bij het verwijderen van de locatie. Probeer het opnieuw.');
        }
      });
    }
  }

  /**
   * Handles location picked from map
   */
  onLocationPicked(loc: LocationDto): void {
    console.log('Location picked:', loc); // Debug log
    this.locationForm.patchValue({
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address ?? ''
    });
  }
}
