import { Injectable } from '@angular/core';
import { notificationcomerEndPoint } from 'src/app/common/constants/endpoints/ms-notificationcomer-endpoint';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationcomerService extends HttpService {
  constructor() {
    super();
    this.microservice = notificationcomerEndPoint.BasePath;
  }

  getcomer(id: string | number) {
    const route = `${notificationcomerEndPoint.comer}?filter.idEvent=$eq:${id}`;
    return this.get(route);
  }
}
