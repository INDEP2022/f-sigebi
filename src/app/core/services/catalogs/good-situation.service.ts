import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodSituation } from '../../models/catalogs/good-situation.model';
@Injectable({
  providedIn: 'root',
})
export class GoodSituationService implements ICrudMethods<IGoodSituation> {
  private readonly route: string = ENDPOINT_LINKS.GoodSituation;
  constructor(private goodSituationRepository: Repository<IGoodSituation>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodSituation>> {
    return this.goodSituationRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGoodSituation> {
    return this.goodSituationRepository.getById(this.route, id);
  }

  create(model: IGoodSituation): Observable<IGoodSituation> {
    return this.goodSituationRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodSituation): Observable<Object> {
    return this.goodSituationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodSituationRepository.remove(this.route, id);
  }
}
