import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormBuilder, FormGroup,
         ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateLocationDto }            from '../locations/locations.service';
import { MapPickerComponent, LocationDto } from '../map-picker/map-picker.component';

@Component({
  selector: 'app-create-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapPickerComponent],
  templateUrl: './create-location-modal.component.html',
  styleUrl: './create-location-modal.component.css'
})
export class CreateLocationModalComponent {

  @Input() visible = false;

  @Output() add   = new EventEmitter<CreateLocationDto>();
  @Output() close = new EventEmitter<void>();

  locationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.locationForm = this.fb.group({
      name:      ['', Validators.required],
      address:   ['', Validators.required],
      latitude:  ['', Validators.required],
      longitude: ['', Validators.required]
    });
  }

  submit() {
    if (this.locationForm.valid) {
      this.add.emit({
        name:      this.locationForm.value.name,
        address:   this.locationForm.value.address,
        latitude:  parseFloat(this.locationForm.value.latitude),
        longitude: parseFloat(this.locationForm.value.longitude)
      });
      this.locationForm.reset();
    } else {
      this.locationForm.markAllAsTouched();
    }
  }

  /* uit MapPicker */
  onLocationPicked(loc: LocationDto) {
    this.locationForm.patchValue({
      latitude:  loc.lat,
      longitude: loc.lng,
      address:   loc.address ?? ''
    });
  }

  onCloseModal(): void {
    this.close.emit();
  }
}
