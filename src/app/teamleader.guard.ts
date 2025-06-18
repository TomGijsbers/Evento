import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleService } from './role.service';

//  Deze guard controleert of een gebruiker teamleider rechten heeft
// Voor toegang tot teamleider-specifieke functies zoals het aanmaken van evenementen
export const teamleaderGuard: CanActivateFn = () => {
  const roleService: RoleService = inject(RoleService);
  //  Controleert of de gebruiker 'create:event' permissies heeft
  // Alleen teamleiders kunnen nieuwe evenementen aanmaken
  return roleService.hasPermission('create:event');
};
