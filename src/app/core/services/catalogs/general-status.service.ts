import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGeneralStatus } from '../../models/catalogs/general-status.model';
@Injectable({
  providedIn: 'root',
})
export class GeneralStatusService implements ICrudMethods<IGeneralStatus> {
  private readonly route: string = ENDPOINT_LINKS.GeneralStatus;
  constructor(private generalStatusRepository: Repository<IGeneralStatus>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGeneralStatus>> {
    return this.generalStatusRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IGeneralStatus> {
    return this.generalStatusRepository.getById(this.route, id);
  }

  create(model: IGeneralStatus): Observable<IGeneralStatus> {
    return this.generalStatusRepository.create(this.route, model);
  }

  update(id: string | number, model: IGeneralStatus): Observable<Object> {
    return this.generalStatusRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.generalStatusRepository.remove(this.route, id);
  }
}
