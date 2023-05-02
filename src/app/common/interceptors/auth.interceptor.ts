import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { HttpHeaders } from '@angular/common/http';
import { BasePage } from 'src/app/core/shared/base-page';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../core/services/authentication/auth.service';

@Injectable()
export class AuthInterceptor extends BasePage implements HttpInterceptor {
  /**
   * Constructor
   *
   * @param {AuthService} _authService
   */

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private timeOut: number = 10;
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

    //ignore interceptor when is refresh token
    if (request.context.get(BYPASS_JW_TOKEN) === true) {
      return next.handle(request);
    }

    if (this.authService.useReportToken) {
      //Set Bearer Token
      const authHeaders: HttpHeaders = new HttpHeaders({
        Authorization:
          'Basic ' +
          btoa(`${environment.API_REPORTS_USR}:${environment.API_REPORTS_PSW}`),
      });
      newReq = request.clone({
        headers: authHeaders,
      });
    } else if (
      this.authService.existToken() &&
      !this.authService.isTokenExpired()
    ) {
      const timeNow = new Date(
        this.authService.getTokenExpiration().valueOf() - new Date().valueOf()
      ).getMinutes();

      if (timeNow <= this.timeOut && timeNow > 0) {
        this.refreshToken(newReq, next).subscribe();
      }

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
    //console.log(error);
    const message = 'Error en el servidor'; // error?.error?.message ?? 'Error en el servidor';
    if (status === 0) {
      /*this.onLoadToast(
        'error',
        'Servidor no disponible',
        'Verifique su conexión, o inténtelo más tarde'
      );*/
      return;
    }

    if (status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      let message = 'La sesión expiró';
      if (error.error?.error === 'invalid_grant') {
        this.onLoadToast(
          'error',
          'Credenciales incorrectas',
          'Inténtalo nuevamente'
        );
      } else {
        this.onLoadToast('error', 'No autorizado', message);
      }
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

    //this.onLoadToast('error', 'Error' + status, message);
  }

  refreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.authService.accessRefreshToken();

      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            localStorage.setItem('token', token.access_token);
            localStorage.setItem('r_token', token.refresh_token);
            this.refreshTokenSubject.next(token.accessToken);
            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError(err => {
            this.isRefreshing = false;
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set(
        'Authorization',
        'Bearer ' + this.authService.accessToken()
      ),
    });
  }
}

export const BYPASS_JW_TOKEN = new HttpContextToken(() => false);
