import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap, take } from 'rxjs/operators';
import { ProfileService } from '../profile/profile.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isChecking = false;
  dbStatus: { success: boolean, message: string } | null = null;
  userName: string = '';

  constructor(
    public auth: AuthService,
    private profileSvc: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract user's name when authenticated
    this.auth.user$.subscribe(user => {
      if (user) {
        // Use nickname, name, or email as fallbacks
        this.userName = user.nickname || user.name || user.email || 'valued user';
      }
    });

    // Handle DB sync for authenticated users
    this.auth.isAuthenticated$.pipe(
      filter(v => v),
      take(1),
      switchMap(() => {
        this.isChecking = true;
        return this.profileSvc.ensureUserInDb();
      })
    ).subscribe({
      next: () => {
        console.log('✅ gebruiker staat (nu) in DB');
        this.dbStatus = { success: true, message: 'Je account is gesynchroniseerd met de database.' };
        this.isChecking = false;
      },
      error: err => {
        console.error('❌ ensureUserInDb fout', err);
        this.dbStatus = { success: false, message: 'Er is een probleem opgetreden bij het controleren van je account in de database.' };
        this.isChecking = false;
      }
    });
  }

  reload() {
    this.isChecking = true;
    this.dbStatus = null;
    
    this.profileSvc.ensureUserInDb().subscribe({
      next: () => {
        console.log('✅ DB-check opnieuw gelukt');
        this.dbStatus = { success: true, message: 'Je account is opnieuw gesynchroniseerd met de database.' };
        this.isChecking = false;
      },
      error: err => {
        console.error('❌ DB-check fout', err);
        this.dbStatus = { success: false, message: 'Er is een probleem opgetreden bij het synchroniseren met de database.' };
        this.isChecking = false;
      }
    });
  }
  
  login() {
    this.auth.loginWithRedirect();
  }
  
  navigateToEvents() {
    this.router.navigate(['/events']);
  }
}
