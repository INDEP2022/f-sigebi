import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderEntryEndpoints } from 'src/app/common/constants/endpoints/ms-orderentry-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodOrderEntry } from '../../models/ms-order-entry/good-order-entry.model';
import { IOrderEntry } from '../../models/ms-order-entry/order-entry.model';

@Injectable({
  providedIn: 'root',
})
export class orderentryService extends HttpService {
  constructor() {
    super();
    this.microservice = OrderEntryEndpoints.BasePath;
  }

  getorderentry(id?: any, params?: ListParams): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      'application/get-EventData',
      id,
      params
    );
  }

  /* ORDEN DE INGRESO */
  getAllOrderEntry(
    params?: ListParams | string
  ): Observable<IListResponse<IOrderEntry>> {
    const route = OrderEntryEndpoints.SAE_NSBDB_ORDER_ENTRY;
    return this.get<IListResponse<IOrderEntry>>(route, params);
  }

  createOrderEntry(body: Object): Observable<IListResponse<IOrderEntry>> {
    const route = OrderEntryEndpoints.SAE_NSBDB_ORDER_ENTRY;
    return this.post<IListResponse<IOrderEntry>>(route, body);
  }

  updateOrderEntry(body: IOrderEntry) {
    const route = `${OrderEntryEndpoints.SAE_NSBDB_ORDER_ENTRY}/${body.id}`;
    return this.put(route, body);
  }

  removeOrderEntry(id: number | string) {
    const route = `${OrderEntryEndpoints.SAE_NSBDB_ORDER_ENTRY}/${id}`;
    return this.delete(route);
  }

  /* BIENES ORDEN DE INGRESO */
  getAllGoodOrderEntry(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodOrderEntry>> {
    const route = OrderEntryEndpoints.SAE_NSBDB_GOOD_ORDER_ENTRY;
    return this.get<IListResponse<IGoodOrderEntry>>(route, params);
  }

  createGoodOrderEntry(
    body: Object
  ): Observable<IListResponse<IGoodOrderEntry>> {
    const route = OrderEntryEndpoints.SAE_NSBDB_GOOD_ORDER_ENTRY;
    return this.post<IListResponse<IGoodOrderEntry>>(route, body);
  }

  updateGoodOrderEntry(body: IGoodOrderEntry) {
    const route = `${OrderEntryEndpoints.SAE_NSBDB_GOOD_ORDER_ENTRY}/${body.id}`;
    return this.put(route, body);
  }

  removeGoodOrderEntry(id: number | string) {
    const route = `${OrderEntryEndpoints.SAE_NSBDB_GOOD_ORDER_ENTRY}/${id}`;
    return this.delete(route);
  }
}
