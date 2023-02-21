import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParameterGoodEndpoints } from 'src/app/common/constants/endpoints/ms-parametergood-endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParameters } from '../../models/ms-parametergood/parameters.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterCatService
  extends HttpService
  implements ICrudMethods<IParameters>
{
  private readonly route: string = ParameterGoodEndpoints.ParameterMaintenace;

  constructor(private repository: Repository<IParameters>) {
    super();
    this.microservice = 'parametergood';
  }

  getAll(params: ListParams): Observable<IListResponse<IParameters>> {
    return this.repository.getAllPaginated(this.route, params);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IParameters>> {
    return this.get<IListResponse<IParameters>>('parameters', params);
  }

  create(model: IParameters): Observable<IParameters> {
    return this.repository.create(this.route, model);
  }

  update(id: string | number, model: IParameters): Observable<Object> {
    return this.repository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.repository.remove(this.route, id);
  }
}
