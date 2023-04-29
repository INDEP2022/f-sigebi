import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private authService: AuthService
  ) {}

  load() {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('token');
      const isTokenExpired = this.jwtHelper.isTokenExpired(token);
      if (!token || isTokenExpired) {
        this.router.navigate(['/auth/login']);
        return resolve(true);
      }
      this.authService.setTokenTimer();
      return resolve(true);
    });
  }
}
