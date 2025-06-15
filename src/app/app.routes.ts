import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { adminGuard } from './admin.guard';
import { teamleaderGuard } from './teamleader.guard';
import { AdminEventBoardComponent } from './admindashboard/admindashboard.component';
import { EventsComponent } from './events/events.component';
import { ProfileComponent } from './profile/profile.component'; // Import the ProfileComponent
import { LocationsComponent } from './locations/locations.component';
import { TeamleaderCreateEventComponent } from './teamleader-create-event/teamleader-create-event.component'; // Added import

export const routes: Routes = [
  { path: '', component: HomeComponent },

  /* Algemeen ingelogd -------------------------------------------*/
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },

  /* TeamLeader  --------------------------------------------------*/
  { path: 'locations', component: LocationsComponent, canActivate: [AuthGuard, teamleaderGuard] },
  { path: 'teamleader/create-event', component: TeamleaderCreateEventComponent, canActivate: [AuthGuard, teamleaderGuard] }, // Added route

  /* Admin --------------------------------------------------------*/
  { path: 'admin', component: AdminEventBoardComponent, canActivate: [AuthGuard, adminGuard] },

  /* Overig */
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'callback', component: HomeComponent }
];

