import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IManagement } from '../../models/catalogs/management.model';
@Injectable({
  providedIn: 'root',
})
export class ManagementService implements ICrudMethods<IManagement> {
  private readonly route: string = ENDPOINT_LINKS.Management;
  constructor(private managementRepository: Repository<IManagement>) {}

  getAll(params?: ListParams): Observable<IListResponse<IManagement>> {
    return this.managementRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IManagement> {
    return this.managementRepository.getById(this.route, id);
  }

  create(model: IManagement): Observable<IManagement> {
    return this.managementRepository.create(this.route, model);
  }

  update(id: string | number, model: IManagement): Observable<Object> {
    return this.managementRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.managementRepository.remove(this.route, id);
  }
}
