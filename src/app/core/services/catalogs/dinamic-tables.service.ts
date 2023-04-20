import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicCatalogEndpoint } from 'src/app/common/constants/endpoints/ms-dynamiccatalog-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ITables,
  ITablesType,
} from '../../models/catalogs/dinamic-tables.model';
@Injectable({
  providedIn: 'root',
})
export class DinamicTablesService
  extends HttpService
  implements ICrudMethods<ITables>
{
  private readonly route: string = ENDPOINT_LINKS.DinamicTables;
  private readonly route1: string = ENDPOINT_LINKS.DinamicTablesType;
  constructor(
    private dinamicTablesRepository: Repository<ITables>,
    private dinamicTablesTypeRepository: Repository<ITablesType>
  ) {
    super();
    this.microservice = DynamicCatalogEndpoint.BasePage;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITables>> {
    return this.dinamicTablesRepository.getAllPaginated(this.route, params);
  }

  getById5(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<ITablesType>> {
    return this.dinamicTablesTypeRepository.getById4(
      `${this.route1}`,
      id,
      params
    );
  }

  getById(id: string | number): Observable<ITables> {
    return this.dinamicTablesRepository.getById(this.route, id);
  }

  create(model: ITables): Observable<ITables> {
    return this.dinamicTablesRepository.create(this.route, model);
  }

  update(id: string | number, model: ITables): Observable<Object> {
    return this.dinamicTablesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.dinamicTablesRepository.remove(this.route, id);
  }

  getAll2(params?: ListParams | string): Observable<IListResponse<ITables>> {
    return this.get<IListResponse<ITables>>(
      DynamicCatalogEndpoint.DinamicTables,
      params
    );
  }

  create2(model: ITables) {
    return this.post(DynamicCatalogEndpoint.DinamicTables, model);
  }

  update2(id: number, model: ITables) {
    const route = `${DynamicCatalogEndpoint.DinamicTables}/${id}`;
    return this.put(route, model);
  }

  remove2(id: string | number) {
    const route = `${DynamicCatalogEndpoint.DinamicTables}/${id}`;
    return this.delete(route);
  }
}
