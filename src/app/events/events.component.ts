import { Component, OnInit, signal } from '@angular/core';
import { EventsService, Event, Location, Feedback } from './events.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { map, forkJoin, catchError, of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  // Signalen voor reactieve state
  events = signal<Event[]>([]);                        // Lijst van events
  selectedEvent = signal<Event | null>(null);          // Geselecteerd event voor detail weergave
  locations = signal<Location[]>([]);                  // Beschikbare locaties
  loading = signal<boolean>(false);                    // Laad status
  feedbackList = signal<Feedback[]>([]);
  feedbackLoading = signal<boolean>(false);


  // Gebruikersinschrijvingen en loading status
  userRegistrations = signal<Map<number, boolean>>(new Map());  // Map van eventId -> ingeschreven status
  registrationLoading = signal<Set<number>>(new Set());         // Set van eventIds die worden verwerkt

  constructor(
    private eventsService: EventsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Laad initiële data
    this.loadEvents();
    this.loadLocations();
  }

  // Events laden en registratie status controleren
  loadEvents() {
    this.loading.set(true);

    this.eventsService.getAllEvents().subscribe({
      next: events => {
        this.events.set(events);
        this.checkRegistrationStatus(events); // Check inschrijvingsstatus voor elk event
        this.loading.set(false);
      },
      error: err => {
        console.error('Fout bij laden events:', err);
        this.loading.set(false);
      }
    });
  }

  // Locaties laden voor dropdown in formulier
  loadLocations() {
    this.eventsService.getAllLocations().subscribe(locations => {
      this.locations.set(locations);
    });
  }

  // Controleer voor welke events de gebruiker is ingeschreven
  checkRegistrationStatus(events: Event[]) {
    if (events.length === 0) return;

    // Maak observables voor elke registratie check
    const statusChecks = events.map(event =>
      this.eventsService.isUserRegisteredForEvent(event.id).pipe(
        map(isRegistered => ({ eventId: event.id, isRegistered })),
        catchError(() => of({ eventId: event.id, isRegistered: false }))
      )
    );

    // Wacht tot alle checks klaar zijn
    forkJoin(statusChecks).subscribe(results => {
      const registrationMap = new Map<number, boolean>();
      results.forEach(result => {
        registrationMap.set(result.eventId, result.isRegistered);
      });
      this.userRegistrations.set(registrationMap);
    });
  }

  // Inschrijven voor een event
  joinEvent(event: Event, e: MouseEvent) {
    e.stopPropagation(); // Voorkom triggeren van card click

    // Event ID toevoegen aan loading set
    const loadingSet = new Set(this.registrationLoading());
    loadingSet.add(event.id);
    this.registrationLoading.set(loadingSet);

    this.eventsService.registerForEvent(event.id).subscribe({
      next: () => {
        // Update registratiestatus
        const registrations = new Map(this.userRegistrations());
        registrations.set(event.id, true);
        this.userRegistrations.set(registrations);

        // Verwijder van loading
        const updatedLoading = new Set(this.registrationLoading());
        updatedLoading.delete(event.id);
        this.registrationLoading.set(updatedLoading);

        // Toon succesmelding met snackbar
        this.showSuccess(`Succesvol ingeschreven voor "${event.name}"!`);
      },
      error: (err) => {
        console.error('Inschrijvingsfout:', err);

        // Verwijder van loading
        const updatedLoading = new Set(this.registrationLoading());
        updatedLoading.delete(event.id);
        this.registrationLoading.set(updatedLoading);

        // Foutafhandeling met snackbar
        if (err.status === 409) {
          // Al ingeschreven
          const registrations = new Map(this.userRegistrations());
          registrations.set(event.id, true);
          this.userRegistrations.set(registrations);
          this.showInfo('Je bent al ingeschreven voor dit event.');
        } else if (err.status === 401) {
          this.showError('Log in om je in te schrijven voor events.');
          this.auth.loginWithRedirect();
        } else if (err.status === 403) {
          this.showError('Je hebt geen toestemming om je in te schrijven.');
        } else if (err.status === 404) {
          this.showError('Event niet gevonden.');
        } else {
          this.showError('Inschrijven mislukt. Probeer het opnieuw.');
        }
      }
    });
  }

  // Uitschrijven van een event
  leaveEvent(event: Event, e: MouseEvent) {
    e.stopPropagation();

    // Event ID toevoegen aan loading set
    const loadingSet = new Set(this.registrationLoading());
    loadingSet.add(event.id);
    this.registrationLoading.set(loadingSet);

    this.eventsService.unregisterFromEvent(event.id).subscribe({
      next: () => {
        // Update registratiestatus
        const registrations = new Map(this.userRegistrations());
        registrations.set(event.id, false);
        this.userRegistrations.set(registrations);

        // Verwijder van loading
        const updatedLoading = new Set(this.registrationLoading());
        updatedLoading.delete(event.id);
        this.registrationLoading.set(updatedLoading);

        this.showSuccess(`Je bent uitgeschreven voor "${event.name}"`);
      },
      error: err => {
        console.error('Uitschrijvingsfout:', err);

        // Verwijder van loading
        const updatedLoading = new Set(this.registrationLoading());
        updatedLoading.delete(event.id);
        this.registrationLoading.set(updatedLoading);

        this.showError('Uitschrijven mislukt - probeer het opnieuw.');
      }
    });
  }

  // Helper methodes voor snackbar berichten in Bauhaus stijl
  private showSuccess(message: string) {
    this.snackBar.open(message, '✓', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success', 'bauhaus-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, '✕', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-error', 'bauhaus-snackbar']
    });
  }

  private showInfo(message: string) {
    this.snackBar.open(message, 'ℹ', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-info', 'bauhaus-snackbar']
    });
  }

  // Event details tonen
  showDetails(event: Event) {
    this.selectedEvent.set(event);
    this.loadFeedback(event.id);
  }

  // Details modal sluiten
  closeModal() {
    this.selectedEvent.set(null);
  }


  loadFeedback(eventId: number) {
    this.feedbackLoading.set(true);
    this.eventsService.getFeedback(eventId).subscribe({
      next: (list: Feedback[]) => { this.feedbackList.set(list); this.feedbackLoading.set(false); },
      error: (_: any) => { this.feedbackList.set([]); this.feedbackLoading.set(false); }
    });
  }

  sendFeedback(form: NgForm) {
    if (form.invalid || !this.selectedEvent()) return;

    const msg = form.value.msg as string;
    const id = this.selectedEvent()!.id;

    this.eventsService.addFeedback(id, msg).subscribe({
      next: () => {
        // Get current user info for optimistic update
        this.auth.user$.subscribe(user => {
          if (user?.name || user?.email) {
            // optimistic update: voeg nieuwe feedback bovenaan toe
            const newFeedback: Feedback = {
              author: user.name || user.email || 'Onbekend',
              message: msg,
              created: new Date().toISOString()
            };
            this.feedbackList.update(l => [newFeedback, ...l]);
          } else {
            // Fallback: reload feedback from server
            this.loadFeedback(id);
          }
        });
        form.resetForm();
      },
      error: () => this.showError('Kon feedback niet versturen')
    });
  }
  




}

