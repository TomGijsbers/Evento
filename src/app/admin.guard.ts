import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RoleService } from './role.service';

export const adminGuard: CanActivateFn = () => {
  const roleService: RoleService = inject(RoleService);

  //RoleService checks permissions
    return roleService.hasPermission('read:admin');
};

