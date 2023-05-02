import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMaximumTimes } from '../../models/catalogs/maximum-times-model';

@Injectable({
  providedIn: 'root',
})
export class MaximumTimesService implements ICrudMethods<IMaximumTimes> {
  private readonly route: string = ENDPOINT_LINKS.parametergood;
  constructor(private maximumTimesRepository: Repository<IMaximumTimes>) {}

  getAll(params?: ListParams): Observable<IListResponse<IMaximumTimes>> {
    return this.maximumTimesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMaximumTimes> {
    return this.maximumTimesRepository.getById(this.route, id);
  }

  create(model: IMaximumTimes): Observable<IMaximumTimes> {
    return this.maximumTimesRepository.create(this.route, model);
  }

  update(id: string | number, model: IMaximumTimes): Observable<Object> {
    return this.maximumTimesRepository.update(this.route, id, model);
  }
  remove(id: string | number): Observable<Object> {
    return this.maximumTimesRepository.remove(this.route, id);
  }
}
