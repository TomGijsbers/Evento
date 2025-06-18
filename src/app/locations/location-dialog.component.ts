import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LocationsService } from '../locations/locations.service';
import { MapPickerComponent } from '../map-picker/map-picker.component';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements AfterViewInit {
  locationForm: FormGroup;
  @ViewChild('mapPicker') mapPicker?: MapPickerComponent;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LocationDialogComponent>,
    private locationsService: LocationsService
  ) {
    this.locationForm = this.fb.group({
      // Define your form controls and their initial values here
    });
  }

  ngAfterViewInit(): void {
    // Wait for dialog animation to complete
    setTimeout(() => {
      this.initializeMap();
    }, 250);
  }

  private initializeMap(): void {
    if (this.mapPicker && this.mapPicker.map) {
      // Force the map to recalculate its container size
      this.mapPicker.map.invalidateSize(true);
      console.log('Map size invalidated');
    }
  }


}
