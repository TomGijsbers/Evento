import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule }            from '@angular/material/card';
import { MatButtonModule }          from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService }              from '@auth0/auth0-angular';

import { ProfileService }           from './profile.service';
import { UserProfileDto, UpdateProfileDto } from './user-profile.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {

  // reactive form
  form;

  // signals (v17) voor UI-reactiviteit
  loading      = signal(true);
  savePending  = signal(false);
  profile      = signal<UserProfileDto | null>(null);

  constructor(
    private fb: FormBuilder,
    private svc: ProfileService,
    public  auth: AuthService,         // voor avatar / name
    private snackBar: MatSnackBar      // Add this line
  ) {
    // Initialize form in constructor after fb is available
   this.form = this.fb.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.svc.getProfile().subscribe({
      next: profile => {
        console.log('Auth0 userinfo received:', profile);
        this.profile.set(profile);
        
        // Map Auth0 userinfo to form fields
        this.form.patchValue({
  
  firstName : profile.firstName,
  lastName  : profile.lastName
        });
        
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading Auth0 userinfo:', error);
        this.loading.set(false);
      }
    });
  }

  save(): void {
    const dto: UpdateProfileDto = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!
    };
    this.savePending.set(true);
    this.svc.updateProfile(dto).subscribe({
      next: () => {
        this.snackBar.open('Profiel succesvol bijgewerkt', 'Sluiten', { duration: 3000 });
        this.profile.update(p =>
          p ? { ...p, firstName: dto.firstName, lastName: dto.lastName } : p
        );
        this.savePending.set(false);
      },
      error: () => this.savePending.set(false)
    });
  }
}
