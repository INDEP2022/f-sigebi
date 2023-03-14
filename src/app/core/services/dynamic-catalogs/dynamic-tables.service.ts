import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicCatalogEndpoint } from 'src/app/common/constants/endpoints/ms-dynamiccatalog-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogRepository } from 'src/app/common/repository/repositories/ms-dynamiccatalog-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ISingleTable,
  ITables,
  ITablesData,
  TvalTable1Data,
} from '../../models/catalogs/dinamic-tables.model';
@Injectable({
  providedIn: 'root',
})
export class DynamicTablesService extends HttpService {
  private readonly route: string = DynamicCatalogEndpoint.getTablesByID;
  constructor(
    private dynamicCatalogRepository: DynamicCatalogRepository<ITables>
  ) {
    super();
    this.microservice = DynamicCatalogEndpoint.DyanicCatalog;
  }

  getById(id: string | number): Observable<ITables> {
    return this.dynamicCatalogRepository.getById(this.route, id);
  }

  getByIdData(id: string | number): Observable<ITablesData> {
    return this.dynamicCatalogRepository.getByIdData(this.route, id);
  }

  getByTableKeyOtKey(
    tableKey: number | string,
    OtKey: number | string
  ): Observable<ISingleTable> {
    const route = `${DynamicCatalogEndpoint.DinamicTables}/tableKey/${tableKey}/otKey/${OtKey}`;
    return this.get<ISingleTable>(route);
  }

  getAll(params?: ListParams): Observable<IListResponse<ITables>> {
    return this.get<IListResponse<ITablesData>>(
      DynamicCatalogEndpoint.DinamicTables,
      params
    );
  }

  getTvalTable1ByTableKey(
    id: number | string,
    params: ListParams
  ): Observable<IListResponse<TvalTable1Data>> {
    const fullRoute = `${DynamicCatalogEndpoint.DinamicTables}/${DynamicCatalogEndpoint.findTvalTable1ByKey}/${id}`;
    return this.get<IListResponse<TvalTable1Data>>(fullRoute, params);
  }

  getStatusByTable400(params?: ListParams): Observable<IListResponse<ITables>> {
    return this.get<IListResponse<ITablesData>>(
      DynamicCatalogEndpoint.StatusTableBy400,
      params
    );
  }

  getTvalTable5ByTable(id: number | string) {
    const fullRoute = `${DynamicCatalogEndpoint.getTvalTable5ByTable}/${id}`;
    return this.get<IListResponse<TvalTable1Data>>(fullRoute);
  }

  /* getfindTvaltable1ByTableKey() */
}
