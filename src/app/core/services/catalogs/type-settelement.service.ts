import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeSettelement } from '../../models/catalogs/type-settelement.model';
@Injectable({
  providedIn: 'root',
})
export class TypeSettelementService implements ICrudMethods<ITypeSettelement> {
  private readonly route: string = ENDPOINT_LINKS.TypeSettelement;
  constructor(
    private typeSettelementRepository: Repository<ITypeSettelement>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeSettelement>> {
    return this.typeSettelementRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeSettelement> {
    return this.typeSettelementRepository.getById(this.route, id);
  }

  create(model: ITypeSettelement): Observable<ITypeSettelement> {
    return this.typeSettelementRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeSettelement): Observable<Object> {
    return this.typeSettelementRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeSettelementRepository.remove(this.route, id);
  }
}
