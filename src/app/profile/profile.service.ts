import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { map, switchMap } from 'rxjs/operators';
import { UserProfileDto, UpdateProfileDto } from './user-profile.dto';

const API_BASE = 'https://localhost:7100';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(
    private http : HttpClient,
    private auth : AuthService
  ) {}

  /** ─────────────────────────────────────────────────────────────
   *  Eén centrale helper om headers met Bearer-token op te bouwen
   *  ────────────────────────────────────────────────────────────*/
  private getHeaders$(audience = API_BASE) {
    return this.auth.getAccessTokenSilently({
      authorizationParams: {
        audience: audience,                //  <-- MOET identiek zijn aan je Auth0-API Identifier
        scope:    'openid profile email'   //  eventueel extra scopes
      }
    }).pipe(
      map(token =>
        new HttpHeaders().set('Authorization', `Bearer ${token}`))
    );
  }

  /** Profiel ophalen uit eigen backend */
  getProfile() {
    return this.getHeaders$().pipe(
      switchMap(headers =>
        this.http.get<UserProfileDto>(`${API_BASE}/api/users/profile`, { headers })
      )
    );
  }

  /** Profiel bijwerken in eigen backend */
  updateProfile(dto: UpdateProfileDto) {
    return this.getHeaders$().pipe(
      switchMap(headers =>
        this.http.put<void>(`${API_BASE}/api/users/profile`, dto, { headers })
      )
    );
  }

  /** User aanmaken/verzekeren in DB */
  ensureUserInDb() {
    return this.getHeaders$().pipe(
      switchMap(headers =>
        this.http.get(`${API_BASE}/api/users/me`, { headers })
      )
    );
  }
}
