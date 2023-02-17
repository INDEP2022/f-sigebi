import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParametersV2 } from '../../models/ms-parametergood/parameters.model';

@Injectable({
  providedIn: 'root',
})
export class ParameterCatService implements ICrudMethods<IParametersV2> {
  private readonly route: string = ENDPOINT_LINKS.Parameter;

  constructor(private repository: Repository<IParametersV2>) {}

  getAll(params: ListParams): Observable<IListResponse<IParametersV2>> {
    return this.repository.getAllPaginated(this.route, params);
  }

  create(model: IParametersV2): Observable<IParametersV2> {
    return this.repository.create(this.route, model);
  }

  update(id: string | number, model: IParametersV2): Observable<Object> {
    return this.repository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.repository.remove(this.route, id);
  }
}
