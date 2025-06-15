import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleService } from './role.service';

export const teamleaderGuard: CanActivateFn = () => {
  const roleService: RoleService = inject(RoleService);
  return roleService.hasPermission('create:event');
};
