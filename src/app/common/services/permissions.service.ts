import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
const PERMISSION_ENABLED = 1;
@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private authService: AuthService) {}

  hasPermissionOnScreen(permission: string, screenId: string): boolean {
    const roles = this.authService.accessRoles();
    return roles.some((rol: any) =>
      rol.menus.some(
        (menu: any) =>
          menu.screen === screenId &&
          menu.permissions[permission] == PERMISSION_ENABLED
      )
    );
  }
}
