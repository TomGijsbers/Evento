import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  isAuthenticated = signal(false);
  isAdmin = signal(false);
  isTeamLeader = signal(false);

  constructor(private auth: AuthService, private roleService: RoleService) {
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

  handleLogin() {
    this.auth.loginWithRedirect();
  }

  handleLogout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  handleSignUp() {
    this.auth.loginWithRedirect(); // zonder screen_hint
  }
}
