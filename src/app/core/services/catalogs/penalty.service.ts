import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IPenalty } from '../../models/catalogs/penalty.model';
@Injectable({
  providedIn: 'root',
})
export class PenaltyService implements ICrudMethods<IPenalty> {
  private readonly route: string = ENDPOINT_LINKS.Penalty;
  constructor(private penaltyRepository: Repository<IPenalty>) {}

  getAll(params?: ListParams): Observable<IListResponse<IPenalty>> {
    return this.penaltyRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IPenalty> {
    return this.penaltyRepository.getById(this.route, id);
  }

  create(model: IPenalty): Observable<IPenalty> {
    return this.penaltyRepository.create(this.route, model);
  }

  update(id: string | number, model: IPenalty): Observable<Object> {
    return this.penaltyRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.penaltyRepository.remove(this.route, id);
  }
}
