import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/common/services/permissions.service';
import { showHideErrorInterceptorService } from '../../common/services/show-hide-error-interceptor.service';
import { AuthService } from '../services/authentication/auth.service';
const READ_PERMISSION = 'read';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private permissionsService: PermissionsService,
    private showHideErrorService: showHideErrorInterceptorService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.verify(route);
  }

  canLoad(route: Route): boolean {
    return this.verify(route);
  }

  verify(route: Route) {
    this.authService.getTokenExpiration();
    // Reestablece propiedad al navegar a cualquier pantalla
    this.showHideErrorService.blockAllErrors = false;
    if (this.authService.existToken() && !this.authService.isTokenExpired()) {
      return true;
      //TODO: Habilitar checkRoles()
      //this.checkRoles(route);
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  checkRoles(route: ActivatedRouteSnapshot | Route): boolean {
    // TODO: Cambiar "any" por la interfaz
    const screenId = !!route && route.data ? route.data['screen'] : '';
    // TODO: quitar este if cuando todos los menus tengan sus permisos
    if (!screenId) return true;
    return this.permissionsService.hasPermissionOnScreen(
      READ_PERMISSION,
      screenId
    );
  }
}
