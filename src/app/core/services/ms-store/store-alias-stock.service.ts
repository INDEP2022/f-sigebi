import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

import { AliasStockEndpoint } from 'src/app/common/constants/endpoints/store-alias-stock-endpoint';
import { IStoreAliasStock } from '../../models/ms-store-alias-stock/store-alias-stock.model';

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

  remove(id: string | number) {
    const route = `${AliasStockEndpoint.AliasStock}/${id}`;
    return this.delete(route);
  }
}
