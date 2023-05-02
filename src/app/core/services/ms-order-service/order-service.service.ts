import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderServiceEndpoint } from 'src/app/common/constants/endpoints/ms-order-service/order-service-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IOrderService } from '../../models/ms-order-service/order-service.mode';

@Injectable({
  providedIn: 'root',
})
export class OrderServiceService extends HttpService {
  constructor() {
    super();
    this.microservice = OrderServiceEndpoint.Base;
  }

  UpdateStatusGood(params: IOrderService): Observable<IOrderService> {
    return this.post<IOrderService>(
      OrderServiceEndpoint.UpdateStatusGood,
      params
    );
  }
}
