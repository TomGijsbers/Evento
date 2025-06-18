import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment.development';

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
  isAuthenticated = signal(false);
  isAdmin = signal(false);
  isTeamLeader = signal(false);
  isMobileMenuOpen = signal(false); // Added missing signal

  constructor(private auth: AuthService, public roleService: RoleService) {
    this.auth.isAuthenticated$.subscribe((auth) => {
      this.isAuthenticated.set(auth);

      if (auth) {
        this.roleService.hasPermission('delete:event:any').subscribe((r) =>
          this.isAdmin.set(r)
        );
        this.roleService.hasPermission('create:event').subscribe((r) =>
          this.isTeamLeader.set(r)
        );
      }
    });
  }

  // Add missing methods that are used in the template
  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  public closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  public handleLogin() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/',
      },
      authorizationParams: {
        prompt: 'login',
      },
    });
  }

  public handleLogout() {
    this.auth.logout({
      logoutParams: {
        returnTo: environment.home_url,
      },
    });
  }

  public handleSignUp() {
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
}
