import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IOffice } from '../../models/catalogs/office.model';
@Injectable({
  providedIn: 'root',
})
export class OfficeService implements ICrudMethods<IOffice> {
  private readonly route: string = ENDPOINT_LINKS.Office;
  constructor(private officeRepository: Repository<IOffice>) {}

  getAll(params?: ListParams): Observable<IListResponse<IOffice>> {
    return this.officeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IOffice> {
    return this.officeRepository.getById(this.route, id);
  }

  create(model: IOffice): Observable<IOffice> {
    return this.officeRepository.create(this.route, model);
  }

  update(id: string | number, model: IOffice): Observable<Object> {
    return this.officeRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.officeRepository.remove(this.route, id);
  }
}
