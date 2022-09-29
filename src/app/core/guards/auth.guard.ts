import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.authService.getTokenExpiration();
    if (this.authService.existToken() && !this.authService.isTokenExpired()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

}
