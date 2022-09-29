import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ISaveValue } from '../models/save-value.model';
@Injectable({
  providedIn: 'root',
})
export class SaveValueService implements ICrudMethods<ISaveValue> {
  private readonly route: string = ENDPOINT_LINKS.SaveValue;
  constructor(private saveValueRepository: Repository<ISaveValue>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISaveValue>> {
    return this.saveValueRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISaveValue> {
    return this.saveValueRepository.getById(this.route, id);
  }

  create(model: ISaveValue): Observable<ISaveValue> {
    return this.saveValueRepository.create(this.route, model);
  }

  update(id: string | number, model: ISaveValue): Observable<Object> {
    return this.saveValueRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.saveValueRepository.remove(this.route, id);
  }
}
