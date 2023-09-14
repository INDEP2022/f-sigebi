import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { AliasStockEndpoint } from 'src/app/common/constants/endpoints/store-alias-stock-endpoint';
import {
  IStoreAliasStock,
  IStoreStock,
} from '../../models/ms-store-alias-stock/store-alias-stock.model';

@Injectable({
  providedIn: 'root',
})
export class StoreAliasStockService extends HttpService {
  constructor() {
    super();
    this.microservice = AliasStockEndpoint.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IStoreAliasStock>> {
    return this.get<IListResponse<IStoreAliasStock>>(
      AliasStockEndpoint.AliasStock,
      params
    );
  }

  getAllWarehouses(
    params?: ListParams
  ): Observable<IListResponse<IStoreStock>> {
    return this.get<IListResponse<IStoreStock>>('tsig004-store', params);
  }

  getById(id: string | number) {
    const route = `${AliasStockEndpoint.AliasStock}/${id}`;
    return this.get<IStoreAliasStock>(route);
  }

  create(alias: IStoreAliasStock): Observable<IStoreAliasStock> {
    return this.post<IStoreAliasStock>(AliasStockEndpoint.AliasStock, alias);
  }

  //
  update(alias: IStoreAliasStock) {
    const route = `${AliasStockEndpoint.AliasStock}`;
    return this.put(route, alias);
  }

  createdataStore(data: IStoreStock) {
    const route = `tsig004-store`;
    return this.post(route, data);
  }

  updateDataStore(id: number, data: IStoreStock) {
    const route = `tsig004-store/${id}`;
    return this.put(route, data);
  }

  remove(id: string | number) {
    const route = `${AliasStockEndpoint.AliasStock}/${id}`;
    return this.delete(route);
  }
}
