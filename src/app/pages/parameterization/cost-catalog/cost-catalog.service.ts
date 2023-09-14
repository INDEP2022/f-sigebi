import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CostCatalogService {
  constructor(
    private htpp: HttpClient,
    private costCatalogRepository: Repository<IServiceCat>
  ) {}

  getCostCatalogparams(
    params?: ListParams
  ): Observable<IListResponse<IServiceCat>> {
    const url = `catalog/api/v1/service-cat`;
    return this.costCatalogRepository.getAllPaginated2(url, params);
  }

  getCostCatalogForSearch(search: string) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/${search}`;
    return this.htpp.get(url);
  }

  putCostCatalog(code: string, body: any) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/id/${code}`;
    return this.htpp.put(url, body);
  }

  postCostCatalog(body: any) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat`;
    return this.htpp.post(url, body);
  }

  deleteCostCatalog(code: string) {
    const url = `${environment.API_URL}catalog/api/v1/service-cat/id/${code}`;
    return this.htpp.delete(url);
  }
}
