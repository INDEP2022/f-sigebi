import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderServiceEndpoint } from 'src/app/common/constants/endpoints/ms-order-service/order-service-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IServiceVehicle } from '../../models/ms-order-service/order-service-vehicle.model';
import {
  IOrderService,
  IOrderServiceDTO,
} from '../../models/ms-order-service/order-service.mode';

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

  /* ORDEN DE SERVICIO */
  createOrderService(
    body: IOrderServiceDTO
  ): Observable<IListResponse<IOrderServiceDTO>> {
    const route = OrderServiceEndpoint.ORDER_SERVICE;
    return this.post<IListResponse<IOrderServiceDTO>>(route, body);
  }

  getAllOrderService(
    params: ListParams | string
  ): Observable<IListResponse<IOrderServiceDTO>> {
    const route = OrderServiceEndpoint.ORDER_SERVICE;
    return this.get<IListResponse<IOrderServiceDTO>>(route, params);
  }

  updateOrderService(body: IOrderServiceDTO) {
    const route = `${OrderServiceEndpoint.ORDER_SERVICE}/${body.id}`;
    return this.put<IListResponse<IOrderServiceDTO>>(route, body);
  }

  getServiceVehicle(
    _params: ListParams
  ): Observable<IListResponse<IServiceVehicle>> {
    const params = this.makeParams(_params);
    return this.get<IListResponse<IServiceVehicle>>(
      `${OrderServiceEndpoint.ServiceVehicle}?${params}`
    );
  }

  postServiceVehicle(formVehicle: IServiceVehicle) {
    return this.post(OrderServiceEndpoint.ServiceVehicle, formVehicle);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
