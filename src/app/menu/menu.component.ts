import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment.development';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  // Signalen voor het bijhouden van de authenticatie- en gebruikersstatus
  isAuthenticated = signal(false);  // Houdt bij of de gebruiker is ingelogd
  isAdmin = signal(false);          // Houdt bij of de gebruiker admin rechten heeft
  isTeamLeader = signal(false);     // Houdt bij of de gebruiker teamleider rechten heeft
  isMobileMenuOpen = signal(false); // Houdt bij of het mobiele menu geopend is

  constructor(private auth: AuthService, public roleService: RoleService) {
    // Luistert naar veranderingen in de authenticatiestatus
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated.set(authenticated);

      if (authenticated) {
        // Controleert of de gebruiker teamleider rechten heeft
        this.roleService.hasPermission('create:event')
          .subscribe(flag => this.isTeamLeader.set(flag));

        // Controleert of de gebruiker admin rechten heeft
        this.roleService.hasPermission('read:admin')
          .subscribe(flag => this.isAdmin.set(flag));
    
      } else {
        // Reset de rol-statussen wanneer de gebruiker uitgelogd is
        this.isAdmin.set(false);
        this.isTeamLeader.set(false);
      }
    });
  }

  // Opent of sluit het mobiele navigatiemenu
  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  // Sluit het mobiele navigatiemenu
  public closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  // Start het inlogproces via Auth0
  public handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/',
      },
      authorizationParams: {
        prompt: 'login',
      },
    });
  }

  // Start het registratieproces via Auth0
  public handleSignUp(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: "/",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  }

  // Logt de gebruiker uit en redirect naar de homepagina
  public handleLogout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: environment.home_url,
      },
    });
  }
}