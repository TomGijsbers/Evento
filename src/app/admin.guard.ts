import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleService } from './role.service';

// Deze guard controleert of een gebruiker administrator rechten heeft
// Voor toegang tot admin-specifieke routes zoals gebruikersbeheer en systeeminstellingen
export const adminGuard: CanActivateFn = () => {
  const roleService: RoleService = inject(RoleService);

  // RoleService controleert of de gebruiker 'read:admin' permissies heeft
  // Alleen gebruikers met admin rechten kunnen admin pagina's bekijken
  return roleService.hasPermission('read:admin');
};

