import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodParameter } from '../../models/good-parameters/good-parameter.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodParameterService implements ICrudMethods<IGoodParameter> {
  private readonly route: string = 'parametergood/parameters';
  constructor(private goodParameterRepository: Repository<IGoodParameter>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodParameter>> {
    return this.goodParameterRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGoodParameter> {
    return this.goodParameterRepository.getById(this.route, id);
  }

  create(model: IGoodParameter): Observable<IGoodParameter> {
    return this.goodParameterRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodParameter): Observable<Object> {
    return this.goodParameterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodParameterRepository.remove(this.route, id);
  }
}
