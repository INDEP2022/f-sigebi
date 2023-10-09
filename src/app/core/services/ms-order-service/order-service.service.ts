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
import { ISamplingOrderService } from '../../models/ms-order-service/sampling-order-service.model';

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

  updateServiceVehicle(
    idTypeVehicle: number,
    orderServiceId: number,
    formVehicle: IServiceVehicle
  ) {
    const route = `${OrderServiceEndpoint.ServiceVehicle}/${idTypeVehicle}/${orderServiceId}`;
    return this.put(route, formVehicle);
  }

  getSamplingOrderView(body: Object, page: number, limit: number) {
    const route = `${OrderServiceEndpoint.SamplingOrderView}?limit=${limit}&page=${page}`;
    return this.post(route, body);
  }

  getAllSamplingOrderService(params: ListParams | string) {
    const route = `${OrderServiceEndpoint.SamplingOrderService}`;
    return this.get(route, params);
  }

  createSamplingOrderService(body: ISamplingOrderService) {
    const route = `${OrderServiceEndpoint.SamplingOrderService}`;
    return this.post(route, body);
  }

  updateSamplingOrderService(
    sampleOrderId: number,
    orderServiceId: number,
    body: ISamplingOrderService
  ) {
    const route = `${OrderServiceEndpoint.SamplingOrderService}/${sampleOrderId}/${orderServiceId}`;
    return this.put(route, body);
  }

  deleteSamplingOrderService(sampleOrderId: number, orderServiceId: number) {
    const route = `${OrderServiceEndpoint.SamplingOrderService}/${sampleOrderId}/${orderServiceId}`;
    return this.delete(route);
  }

  /* Muestreo Ordenes */
  createSampleOrder(body: Object) {
    const route = OrderServiceEndpoint.SampleOrders;
    return this.post(route, body);
  }

  getAllSampleOrder(params: ListParams) {
    const route = OrderServiceEndpoint.SampleOrders;
    return this.get(route, params);
  }

  getSampleOrderById(id: number) {
    const route = `${OrderServiceEndpoint.SampleOrders}/${id}`;
    return this.get(route);
  }

  deleteSampleOrderById(id: number) {
    const route = `${OrderServiceEndpoint.SampleOrders}/${id}`;
    return this.delete(route);
  }

  updateSampleOrder(body: any) {
    const route = `${OrderServiceEndpoint.SampleOrders}/${body.idSamplingOrder}`;
    return this.put(route, body);
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
