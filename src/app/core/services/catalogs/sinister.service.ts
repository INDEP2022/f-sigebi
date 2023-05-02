import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISinister } from '../../models/catalogs/sinister.model';
@Injectable({
  providedIn: 'root',
})
export class SinisterService implements ICrudMethods<ISinister> {
  private readonly route: string = ENDPOINT_LINKS.Sinister;
  constructor(private sinisterRepository: Repository<ISinister>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISinister>> {
    return this.sinisterRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISinister> {
    return this.sinisterRepository.getById(this.route, id);
  }

  create(model: ISinister): Observable<ISinister> {
    return this.sinisterRepository.create(this.route, model);
  }

  update(id: string | number, model: ISinister): Observable<Object> {
    return this.sinisterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.sinisterRepository.remove(this.route, id);
  }
}
