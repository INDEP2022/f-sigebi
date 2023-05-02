import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusProcess } from '../../models/catalogs/status-process.model';
@Injectable({
  providedIn: 'root',
})
export class StatusProcessService implements ICrudMethods<IStatusProcess> {
  private readonly route: string = ENDPOINT_LINKS.StatusProcess;
  constructor(private statusProcessRepository: Repository<IStatusProcess>) {}

  getAll(params?: ListParams): Observable<IListResponse<IStatusProcess>> {
    return this.statusProcessRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusProcess> {
    return this.statusProcessRepository.getById(this.route, id);
  }

  create(model: IStatusProcess): Observable<IStatusProcess> {
    return this.statusProcessRepository.create(this.route, model);
  }

  update(id: string | number, model: IStatusProcess): Observable<Object> {
    return this.statusProcessRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.statusProcessRepository.remove(this.route, id);
  }
}
