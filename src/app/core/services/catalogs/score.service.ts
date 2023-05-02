import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IScore } from '../../models/catalogs/score.model';
@Injectable({
  providedIn: 'root',
})
export class ScoreService implements ICrudMethods<IScore> {
  private readonly route: string = ENDPOINT_LINKS.Score;
  constructor(private scoreRepository: Repository<IScore>) {}

  getAll(params?: ListParams): Observable<IListResponse<IScore>> {
    return this.scoreRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IScore> {
    return this.scoreRepository.getById(this.route, id);
  }

  create(model: IScore): Observable<IScore> {
    return this.scoreRepository.create(this.route, model);
  }

  update(id: string | number, model: IScore): Observable<Object> {
    return this.scoreRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.scoreRepository.remove(this.route, id);
  }
}
