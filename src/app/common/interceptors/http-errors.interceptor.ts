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
    return next.handle(req).pipe(
      map(response => {
        return this.handleSuccess(response);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  handleError(error: HttpErrorResponse) {
    const status = error.status;
    const message = error?.error?.message[0] ?? 'Unknown error';

    if (status === 0) {
      this.onLoadToast('error', 'Error', 'Unable to connect to server');
      return;
    }
    if (status === 400) {
      this.onLoadToast('warning', 'advertencia', message);
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
      const { data, count } = response.body;
      if ((data && count) || Array.isArray(data)) {
        return response.clone({ body: { count, data } });
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
