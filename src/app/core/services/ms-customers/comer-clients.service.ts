import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomersEndpoints } from 'src/app/common/constants/endpoints/ms-customers-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IComerClients } from 'src/app/core/models/ms-customers/customers-model';

@Injectable({
  providedIn: 'root',
})
export class ComerClientsService extends HttpService {
  private readonly endpoint: string = CustomersEndpoints.ComerClients;
  constructor() {
    super();
    this.microservice = CustomersEndpoints.BaseRoute;
  }

  getAll(params?: ListParams): Observable<IListResponse<IComerClients>> {
    return this.get<IListResponse<IComerClients>>(this.endpoint, params);
  }

  getAllV2(params?: ListParams) {
    return this.get<IListResponse<IComerClients>>(this.endpoint, params);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IComerClients>> {
    return this.get<IListResponse<IComerClients>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(client: IComerClients) {
    return this.post(this.endpoint, client);
  }

  update(id: string | number, client: IComerClients) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, client);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }

  getComerCustomerEvent(params?: string) {
    return this.get('comer-clientsxevent', params);
  }
  getAll_(params?: _Params): Observable<IListResponse<IComerClients>> {
    return this.get<IListResponse<IComerClients>>(this.endpoint, params);
  }

  getById_(id?: any): Observable<IListResponse<IComerClients>> {
    return this.get<IListResponse<IComerClients>>(`${this.endpoint}/${id}`);
  }

  getClientEventId(id: number | string) {
    const route = `${CustomersEndpoints.ComerClients}/${id}`;
    return this.get(route);
  }

  getAll_XEvent(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      CustomersEndpoints.ComerClientsXEvent,
      params
    );
  }

  createClientXEvent(params: any): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      CustomersEndpoints.ComerClientsXEvent,
      params
    );
  }

  updateClientXEvent(params: any): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      CustomersEndpoints.ComerClientsXEvent,
      params
    );
  }

  getComerClientsXEventgetAllV2(
    params?: _Params
  ): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      CustomersEndpoints.ComerClientsXEventgetAllV2,
      params
    );
  }
}
