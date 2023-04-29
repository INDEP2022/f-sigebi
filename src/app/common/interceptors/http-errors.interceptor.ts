import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { showHideErrorInterceptorService } from './../services/show-hide-error-interceptor.service';

import { BasePage } from 'src/app/core/shared/base-page';

interface BaseResponse {
  statusCode: number;
  message: string;
  data: Data;
}

interface Data {
  statusCode: string;
  message: string;
  error: string;
}

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorsInterceptor extends BasePage implements HttpInterceptor {
  showError: boolean;
  constructor(
    private router: Router,
    private showHideErrorInterceptorService: showHideErrorInterceptorService
  ) {
    super();
  }

  get blockAllErrors() {
    return this.showHideErrorInterceptorService.blockAllErrors;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error.
      const error = {
        status: 0,
        error: {
          description: 'Error de Conexión!',
        },
        statusText: 'Se perdío la conexión de red. Intentar nuevament!',
      };
      this.alert(
        'warning',
        'Error de Conexión!',
        'Se perdío la conexión de red. Intentar nuevamente!'
      );
      return throwError(() => new HttpErrorResponse(error));
    } else {
      if (req.headers.has(InterceptorSkipHeader)) {
        const headers = req.headers.delete(InterceptorSkipHeader);
        return next.handle(req.clone({ headers }));
      }
      // else return the normal request
      return next.handle(req).pipe(
        map(response => {
          this.getValue();
          return this.handleSuccess(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.handleError(error);
          this.resetValue();
          return throwError(() => error);
        })
      );
    }
  }

  getValue() {
    this.showError = this.showHideErrorInterceptorService.getValue();
  }

  resetValue() {
    this.showHideErrorInterceptorService.showHideError(true);
  }

  handleError(error: HttpErrorResponse) {
    const status = error.status;
    let message = '';
    if (Array.isArray(error?.error?.message) === true) {
      message = error?.error?.message[0];
    } else if (Array.isArray(error?.error?.message) === false) {
      message = error?.error?.message;
    } else {
      message = 'Error del servidor';
    }
    if (status === 0 && this.showError && !this.blockAllErrors) {
      message = 'Inténtelo nuevamente';
      this.onLoadToast('error', 'Conexión no disponible', message);
      return;
    }
    if (status === 400 && this.showError && !this.blockAllErrors) {
      //this.onLoadToast('warning', 'advertencia', message);
      //console.log(status, this.showError, message);
      return;
    }
    if (status === 500 && this.showError && !this.blockAllErrors) {
      message = 'Error del Servidor';
      //this.onLoadToast('warning', 'Advertencia', message);
      return;
    }
    if (status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      message = 'La sesión expiró';
      this.onLoadToast('error', 'No autorizado', message);
      this.router.navigate(['/auth/login']);
      return;
    }
    if (status === 403) {
      this.router.navigate(['/forbidden']);
      this.onLoadToast(
        'error',
        'Error' + status,
        'No tiene permisos para realizar esta acción'
      );
      return;
    }

    // this.onLoadToast('error', 'Error' + status, message);
  }

  private handleSuccess(response: HttpEvent<any>) {
    if (response instanceof HttpResponse) {
      this.validateResponse(response);
      if (!response.body) {
        const error = new HttpErrorResponse({
          error: { message: 'data not found' },
          headers: response.headers,
          status: 404,
          url: response.url,
        });
        throw error;
      }
      const { data, count, message } = response.body;
      if (Array.isArray(data)) {
        if (data && count >= 0) {
          return response.clone({ body: { count, data, message } });
        }
        return response.clone({ body: { data, message } });
      }
      if (data) {
        return response.clone({ body: data });
      }
      return response;
    }
    return response;
  }

  private validateResponse(response: HttpResponse<BaseResponse>) {
    const statusCode = Number(response.body?.statusCode);
    if (!statusCode) return;
    if (statusCode >= 400) {
      const error = new HttpErrorResponse({
        error: { message: response.body?.message[0] ?? '' },
        headers: response.headers,
        status: statusCode,
        url: response.url,
      });
      this.handleError(error);
      throw error;
    }
  }
}
