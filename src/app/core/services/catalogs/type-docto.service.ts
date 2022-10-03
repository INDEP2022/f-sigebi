import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeDocto } from '../../models/catalogs/type-docto.model';
@Injectable({
  providedIn: 'root',
})
export class TypeDoctoService implements ICrudMethods<ITypeDocto> {
  private readonly route: string = ENDPOINT_LINKS.TypeDocto;
  constructor(private typeDoctoRepository: Repository<ITypeDocto>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeDocto>> {
    return this.typeDoctoRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeDocto> {
    return this.typeDoctoRepository.getById(this.route, id);
  }

  create(model: ITypeDocto): Observable<ITypeDocto> {
    return this.typeDoctoRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeDocto): Observable<Object> {
    return this.typeDoctoRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeDoctoRepository.remove(this.route, id);
  }
}
