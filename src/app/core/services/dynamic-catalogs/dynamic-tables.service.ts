import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicCatalogEndpoint } from 'src/app/common/constants/endpoints/ms-dynamiccatalog-endpoint';
import { IDynamicCatalogMethods } from 'src/app/common/repository/interfaces/ms-dynamiccatalog-methods';
import { DynamicCatalogRepository } from 'src/app/common/repository/repositories/ms-dynamiccatalog-repository';
import { ITables } from '../../models/catalogs/dinamic-tables.model';
@Injectable({
  providedIn: 'root',
})
export class DynamicTablesService implements IDynamicCatalogMethods<ITables> {
  private readonly route: string = DynamicCatalogEndpoint.getTablesByID;
  constructor(
    private dynamicCatalogRepository: DynamicCatalogRepository<ITables>
  ) {}

  getById(id: string | number): Observable<ITables> {
    return this.dynamicCatalogRepository.getById(this.route, id);
  }
  //   getAll(params?: ListParams): Observable<IListResponse<ITables>> {
  //     return this.dynamicCatalogRepository.getAllPaginated(this.route, params);
  //   }
}
