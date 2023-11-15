import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotificacionAbandonoService extends HttpService {
  private readonly route = NotificationEndpoints;
  constructor() {
    super();
    this.microservice = NotificationEndpoints.BasePath;
  }

  confirmarStatus(statusFinal: string, body: any): Observable<any> {
    return this.post<any>(`${this.route.confirmStatus}/${statusFinal}`, body);
  }
  getAll(statusFinal: string, body: any): Observable<any> {
    return this.post<any>(`${this.route.confirmStatus}/${statusFinal}`, body);
  }
}
