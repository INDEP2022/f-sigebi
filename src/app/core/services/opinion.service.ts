import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IOpinion } from '../models/opinion.model';
@Injectable({
  providedIn: 'root',
})
export class OpinionService implements ICrudMethods<IOpinion> {
  private readonly route: string = ENDPOINT_LINKS.Opinion;
  constructor(private opinionRepository: Repository<IOpinion>) {}

  getAll(params?: ListParams): Observable<IListResponse<IOpinion>> {
    return this.opinionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IOpinion> {
    return this.opinionRepository.getById(this.route, id);
  }

  create(model: IOpinion): Observable<IOpinion> {
    return this.opinionRepository.create(this.route, model);
  }

  update(id: string | number, model: IOpinion): Observable<Object> {
    return this.opinionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.opinionRepository.remove(this.route, id);
  }
}
