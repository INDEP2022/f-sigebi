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
  import { NotificationService } from '../services/notification.service';
  
  @Injectable({
    providedIn: 'root',
  })
  export class HttpErrorsInterceptor implements HttpInterceptor {
    constructor(
      private router: Router,
      private notificationService: NotificationService,
    ) {}
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
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
        this.router.navigate(['/auth/login']);
        this.notificationService.errorNotification('Unauthorized', 'Error' + error.status);
      }
      if (error.status === 403) {
        this.router.navigate(['/forbidden']);
        this.notificationService.errorNotification(
          'No tienes permisos para realizar esta acción', 'Error' + error.status
        );
      }
      if (error.status === 400) {
        this.notificationService.errorNotification(
          error?.error?.message, 'Error' + error.status
        );
      }
      if (error.status === 500) {
        this.notificationService.errorNotification(
          error?.error?.message, 'Error' + error.status
        );
      }
  
      if (error.status === 0) {
        this.notificationService.errorNotification('Unable to conect to server', 'Error');
      }
    }
  }
  