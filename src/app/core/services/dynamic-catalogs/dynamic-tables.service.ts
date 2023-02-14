import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicCatalogEndpoint } from 'src/app/common/constants/endpoints/ms-dynamiccatalog-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DynamicCatalogRepository } from 'src/app/common/repository/repositories/ms-dynamiccatalog-repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
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
}
