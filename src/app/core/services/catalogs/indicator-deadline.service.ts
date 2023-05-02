import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIndicatorDeadline } from '../../models/catalogs/indicator-deadline.model';
@Injectable({
  providedIn: 'root',
})
export class IndicatorDeadlineService
  implements ICrudMethods<IIndicatorDeadline>
{
  private readonly route: string = ENDPOINT_LINKS.IndicatorDeadline;
  constructor(
    private indicatorDeadlineRepository: Repository<IIndicatorDeadline>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IIndicatorDeadline>> {
    return this.indicatorDeadlineRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IIndicatorDeadline> {
    return this.indicatorDeadlineRepository.getById(this.route, id);
  }

  create(model: IIndicatorDeadline): Observable<IIndicatorDeadline> {
    return this.indicatorDeadlineRepository.create(this.route, model);
  }

  update(id: string | number, model: IIndicatorDeadline): Observable<Object> {
    return this.indicatorDeadlineRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.indicatorDeadlineRepository.remove(this.route, id);
  }
}
