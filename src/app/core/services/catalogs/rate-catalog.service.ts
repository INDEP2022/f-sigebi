import { Injectable } from '@angular/core';
import { ENDPOINT_LINKS } from 'endpoints';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { environment } from 'src/environments/environment';
import { IRateCatalog } from '../../models/catalogs/rate-catalog.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterBaseCatService extends HttpService {
  // private readonly route: string = ParameterGoodEndpoints.BasePath;
  private readonly route: string = ENDPOINT_LINKS.parametergoodBase;
  private readonly route1: string = ENDPOINT_LINKS.parametergoodBase1;

  constructor(private deductiveRepository: Repository<IRateCatalog>) {
    super();
    this.microservice = ParameterGoodEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IRateCatalog>> {
    console.log('this.route:', this.route);
    const URL = `${environment.API_URL}${this.route}/api/v1/rates`;

    return this.deductiveRepository.getAllPaginated2(this.route, params);
  }

  newItem(model: IRateCatalog): Observable<IRateCatalog> {
    return this.deductiveRepository.create(this.route1, model);
  }

  update(model: IRateCatalog): Observable<Object> {
    return this.deductiveRepository.update6(this.route1, model);
  }

  remove(model: IRateCatalog): Observable<Object> {
    return this.deductiveRepository.remove3(this.route1, model);
  }
}
