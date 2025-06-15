import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, map } from 'rxjs';
import * as jose from 'jose';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private authService: AuthService = inject(AuthService);

  hasPermission(permission: string) : Observable<boolean> {
    
    return this.authService.getAccessTokenSilently().pipe(
      map((token) => {
        // Decode the token
        if(token){
        const decodedToken = jose.decodeJwt(token) as {permissions: string[]} | null;
        // Check for permissions from the decoded token
        if (
          decodedToken &&
          decodedToken.permissions &&
          decodedToken.permissions.includes(permission)
        ) {
          // User has the required permission
          return true;
        } else {
          // User does not have the required permission
          console.log(
            'Unauthorized: User does not have the required permission.'
          );
        }
      }
      
        return false;
      })
    );
  }
}
