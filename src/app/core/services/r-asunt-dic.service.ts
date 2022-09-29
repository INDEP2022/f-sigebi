import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IRAsuntDic } from '../models/r-asunt-dic.model';
@Injectable({
  providedIn: 'root',
})
export class RAsuntDicService implements ICrudMethods<IRAsuntDic> {
  private readonly route: string = ENDPOINT_LINKS.RAsuntDic;
  constructor(private rAsuntDicRepository: Repository<IRAsuntDic>) {}

  getAll(params?: ListParams): Observable<IListResponse<IRAsuntDic>> {
    return this.rAsuntDicRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRAsuntDic> {
    return this.rAsuntDicRepository.getById(this.route, id);
  }

  create(model: IRAsuntDic): Observable<IRAsuntDic> {
    return this.rAsuntDicRepository.create(this.route, model);
  }

  update(id: string | number, model: IRAsuntDic): Observable<Object> {
    return this.rAsuntDicRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.rAsuntDicRepository.remove(this.route, id);
  }
}
