import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeService } from '../../models/catalogs/typeservices.model';
@Injectable({
  providedIn: 'root',
})
export class TypeServicesService implements ICrudMethods<ITypeService> {
  private readonly route: string = ENDPOINT_LINKS.TypeServices;
  constructor(private typeServicesRepository: Repository<ITypeService>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeService>> {
    return this.typeServicesRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeService> {
    return this.typeServicesRepository.getById(this.route, id);
  }

  create(model: ITypeService): Observable<ITypeService> {
    return this.typeServicesRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeService): Observable<Object> {
    return this.typeServicesRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeServicesRepository.remove(this.route, id);
  }
}
