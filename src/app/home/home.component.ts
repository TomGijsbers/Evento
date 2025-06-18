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
  // Indicator of er momenteel een database controle bezig is
  isChecking = false;
  // Status van de database synchronisatie
  dbStatus: { success: boolean, message: string } | null = null;
  // Naam van de ingelogde gebruiker
  userName: string = '';

  constructor(
    public auth: AuthService,        // Auth0 service voor authenticatie
    private profileSvc: ProfileService, // Service voor gebruikersprofiel beheer
    private router: Router           // Router voor navigatie
  ) {}

  /**
   * Angular lifecycle hook - uitgevoerd na component initialisatie
   * Haalt gebruikersnaam op en synchroniseert gebruiker met database
   */
  ngOnInit(): void {
    // Gebruikersnaam ophalen wanneer geauthenticeerd
    this.auth.user$.subscribe(user => {
      if (user) {
        // Gebruik nickname, name, of email als fallbacks
        this.userName = user.nickname || user.name || user.email || 'gewaardeerde gebruiker';
      }
    });

    // Database synchronisatie voor geauthenticeerde gebruikers
    this.auth.isAuthenticated$.pipe(
      filter(v => v),        // Alleen verder als gebruiker is ingelogd
      take(1),               // Slechts één keer uitvoeren
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

  /**
   * Herlaadt de database synchronisatie handmatig
   * Kan gebruikt worden als de eerste poging is mislukt
   */
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
  
  /**
   * Start het inlogproces via Auth0
   * Redirect gebruiker naar Auth0 login pagina
   */
  login() {
    this.auth.loginWithRedirect();
  }
  
  /**
   * Navigeert naar de events pagina
   * Voor het bekijken van beschikbare evenementen
   */
  navigateToEvents() {
    this.router.navigate(['/events']);
  }
}
