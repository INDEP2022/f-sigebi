import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISiseProcess } from '../../models/catalogs/sise-process.model';
@Injectable({
  providedIn: 'root',
})
export class SiseProcessService implements ICrudMethods<ISiseProcess> {
  private readonly route: string = ENDPOINT_LINKS.SiseProcess;
  constructor(private siseProcessRepository: Repository<ISiseProcess>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISiseProcess>> {
    return this.siseProcessRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISiseProcess> {
    return this.siseProcessRepository.getById(this.route, id);
  }

  create(model: ISiseProcess): Observable<ISiseProcess> {
    return this.siseProcessRepository.create(this.route, model);
  }

  update(id: string | number, model: ISiseProcess): Observable<Object> {
    return this.siseProcessRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.siseProcessRepository.remove(this.route, id);
  }
}
