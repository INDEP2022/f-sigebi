import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { PermissionsService } from 'src/app/common/services/permissions.service';
import { showHideErrorInterceptorService } from '../../common/services/show-hide-error-interceptor.service';
import { AuthService } from '../services/authentication/auth.service';
const READ_PERMISSION = 'read';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  timeOut: number = 10;
  private isRefreshing = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private permissionsService: PermissionsService,
    private showHideErrorService: showHideErrorInterceptorService,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.verify(route);
  }

  canLoad(route: Route): boolean {
    return this.verify(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.verify(childRoute);
  }

  verify(route: Route) {
    const token = localStorage.getItem('token');
    const isTokenExpired = this.jwtHelper.isTokenExpired(token);
    if (!token || isTokenExpired) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
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

  refreshToken(token: string) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.authService.refreshToken(token).subscribe({
        next: response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('r_token', response.refresh_token);
          this.isRefreshing = false;
        },
      });
    }
  }
}
