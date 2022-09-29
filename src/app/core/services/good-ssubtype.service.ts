import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IGoodSsubType } from '../models/good-ssubtype.model';
@Injectable({
  providedIn: 'root',
})
export class GoodSsubtypeService implements ICrudMethods<IGoodSsubType> {
  private readonly route: string = ENDPOINT_LINKS.GoodSsubtype;
  constructor(private goodSsubtypeRepository: Repository<IGoodSsubType>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGoodSsubType>> {
    return this.goodSsubtypeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGoodSsubType> {
    return this.goodSsubtypeRepository.getById(this.route, id);
  }

  create(model: IGoodSsubType): Observable<IGoodSsubType> {
    return this.goodSsubtypeRepository.create(this.route, model);
  }

  update(id: string | number, model: IGoodSsubType): Observable<Object> {
    return this.goodSsubtypeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodSsubtypeRepository.remove(this.route, id);
  }
}
