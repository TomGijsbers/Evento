import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormBuilder, FormGroup,
         ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Location, Event }              from '.././events/events.service';

@Component({
  selector: 'app-create-event-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event-modal.component.html',
  styleUrl: './create-event-modal.component.css'
})
export class CreateEventModalComponent {

  /** Modal zichtbaar?  */
  @Input() showCreateModal = false;  // Changed from visible to match adminDashboard
  /** Locaties voor de dropdown */
  @Input() locations: Location[] = [];

  /** Emit nieuw event-payload naar parent */
  @Output() add   = new EventEmitter<Omit<Event,'id'|'registrations'>>();
  /** Emit wanneer gebruiker annuleert of X klikt */
  @Output() close = new EventEmitter<void>();

  // Declare the form without initialization - will be initialized in constructor
  eventForm: FormGroup;

  // Custom validator for future dates
  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    return selectedDate >= today ? null : { pastDate: true };
  }

  constructor(private fb: FormBuilder) {
    // Initialize the form in the constructor after fb is injected
    this.eventForm = this.fb.group({
      name:        ['', Validators.required],
      description: ['', Validators.required],
      eventDate:   ['', [Validators.required, this.futureDateValidator.bind(this)]],
      locationId:  [null, Validators.required]
    });
  }

  onAddEvent() {
    if (this.eventForm.valid) {
      this.add.emit(this.eventForm.value);
      this.eventForm.reset();
    } else {
      this.eventForm.markAllAsTouched();
    }
  }
  
  closeCreateModal() {
    this.close.emit();
  }
}
