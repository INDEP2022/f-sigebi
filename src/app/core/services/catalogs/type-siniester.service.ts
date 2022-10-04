import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeSiniester } from '../../models/catalogs/type-siniester.model';
@Injectable({
  providedIn: 'root',
})
export class TypeSiniesterService implements ICrudMethods<ITypeSiniester> {
  private readonly route: string = ENDPOINT_LINKS.TypeSiniester;
  constructor(private typeSiniesterRepository: Repository<ITypeSiniester>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeSiniester>> {
    return this.typeSiniesterRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeSiniester> {
    return this.typeSiniesterRepository.getById(this.route, id);
  }

  create(model: ITypeSiniester): Observable<ITypeSiniester> {
    return this.typeSiniesterRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeSiniester): Observable<Object> {
    return this.typeSiniesterRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeSiniesterRepository.remove(this.route, id);
  }
}
