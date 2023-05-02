import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeOrderService } from '../../models/catalogs/typeorderservices.model';
@Injectable({
  providedIn: 'root',
})
export class TypeOrderServicesService
  implements ICrudMethods<ITypeOrderService>
{
  private readonly route: string = ENDPOINT_LINKS.TypeOrderServices;
  constructor(
    private typeOrderServicesRepository: Repository<ITypeOrderService>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeOrderService>> {
    return this.typeOrderServicesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeOrderService> {
    return this.typeOrderServicesRepository.getById(this.route, id);
  }

  create(model: ITypeOrderService): Observable<ITypeOrderService> {
    return this.typeOrderServicesRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeOrderService): Observable<Object> {
    return this.typeOrderServicesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeOrderServicesRepository.remove(this.route, id);
  }
}
