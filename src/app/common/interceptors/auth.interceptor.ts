import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { BasePage } from 'src/app/core/shared/base-page';
import { AuthService } from '../../core/services/authentication/auth.service';

@Injectable()
export class AuthInterceptor extends BasePage implements HttpInterceptor {
  /**
   * Constructor
   *
   * @param {AuthService} _authService
   */
  constructor(
    private router: Router,
    private readonly authService: AuthService
  ) {
    super();
  }
  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Clone the request object
    let newReq = request.clone();

    if (this.authService.existToken() && !this.authService.isTokenExpired()) {
      //Set Bearer Token
      newReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this.authService.accessToken()
        ),
      });
    }
    // Response
    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  async handleError(error: HttpErrorResponse) {
    const status = error.status;
    console.log(error);
    const message = error?.error?.message ?? 'Unknown error';
    if (status === 0) {
      this.onLoadToast('error', 'Error', 'Unable to connect to server');
      return;
    }

    if (status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      this.onLoadToast('error', 'Unauthorized', 'Error' + status);
      this.router.navigate(['/auth/login']);
      return;
    }
    if (status === 403) {
      this.router.navigate(['/forbidden']);
      this.onLoadToast(
        'error',
        'Error' + status,
        'No tienes permisos para realizar esta acción'
      );
      return;
    }

    this.onLoadToast('error', 'Error' + status, message);
  }
}
