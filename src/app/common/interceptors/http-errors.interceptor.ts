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

@Injectable({
  providedIn: 'root',
})
export class HttpErrorsInterceptor extends BasePage implements HttpInterceptor {
  constructor(private router: Router) {
    super();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(req);
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(error);
      })
    );
  }

  async handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      this.onLoadToast('error', 'Unauthorized', 'Error' + error.status);
      this.router.navigate(['/auth/login']);
    }
    if (error.status === 403) {
      this.router.navigate(['/forbidden']);
      this.onLoadToast(
        'error',
        'No tienes permisos para realizar esta acción',
        'Error' + error.status
      );
    }
    if (error.status === 400) {
      this.onLoadToast('error', error?.error?.message, 'Error' + error.status);
    }
    if (error.status === 404) {
      this.onLoadToast('error', error?.error?.message, 'Error' + error.status);
    }
    if (error.status === 500) {
      this.onLoadToast('error', error?.error?.message, 'Error' + error.status);
    }

    if (error.status === 0) {
      this.onLoadToast('error', 'Unable to connect to server', 'Error');
    }
  }
}
