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

  isAuthenticated = signal(false);
  isAdmin = signal(false);
  isTeamLeader = signal(false);
  isMobileMenuOpen = signal(false);

  constructor(private auth: AuthService, public roleService: RoleService) {
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated.set(authenticated);

      if (authenticated) {
        this.roleService.hasPermission('create:event')
          .subscribe(flag => this.isTeamLeader.set(flag));

        this.roleService.hasPermission('read:admin')
          .subscribe(flag => this.isAdmin.set(flag));
    
  } else {
  this.isAdmin.set(false);
  this.isTeamLeader.set(false);
}
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }

handleLogin(): void {
  this.auth.loginWithRedirect({
    appState: {
      target: '/',
    },
    authorizationParams: {
      prompt: 'login',
    },
  });
}

handleSignUp(): void {
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

handleLogout(): void {
  this.auth.logout({
    logoutParams: {
      returnTo: environment.home_url,
    },
  });
}
}