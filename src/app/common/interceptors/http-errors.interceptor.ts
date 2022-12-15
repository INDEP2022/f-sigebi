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
import { catchError, Observable, throwError } from 'rxjs';
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
      // map(response => {
      //   return this.handleSuccess(response);
      // }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  async handleError(error: HttpErrorResponse) {
    const status = error.status;
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

  private handleSuccess(response: HttpEvent<any>) {
    if (response instanceof HttpResponse) {
      this.validateResponse(response);
      const body = response.body?.data ?? response.body;
      return response.clone({ body });
    }
    return response;
  }

  private validateResponse(response: HttpResponse<BaseResponse>) {
    const statusCode = Number(response.body?.data?.statusCode);
    if (!statusCode) return;
    if (statusCode >= 400) {
      const error = new HttpErrorResponse({
        error: { message: response.body.data.message },
        headers: response.headers,
        status: statusCode,
        url: response.url,
      });
      this.handleError(error);
      throw error;
    }
  }
}
