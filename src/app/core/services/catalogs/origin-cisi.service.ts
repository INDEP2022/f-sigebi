import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IOriginCisi } from '../../models/catalogs/origin-cisi.model';
@Injectable({
  providedIn: 'root',
})
export class OiriginCisiService implements ICrudMethods<IOriginCisi> {
  private readonly route: string = ENDPOINT_LINKS.OriginCisi;
  constructor(private originCisiRepository: Repository<IOriginCisi>) {}

  getAll(params?: ListParams): Observable<IListResponse<IOriginCisi>> {
    return this.originCisiRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IOriginCisi> {
    return this.originCisiRepository.getById(this.route, id);
  }

  create(model: IOriginCisi): Observable<IOriginCisi> {
    return this.originCisiRepository.create(this.route, model);
  }

  update(id: string | number, model: IOriginCisi): Observable<Object> {
    return this.originCisiRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.originCisiRepository.remove(this.route, id);
  }
}
