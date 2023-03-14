import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITypeRelevant } from '../../models/catalogs/type-relevant.model';
@Injectable({
  providedIn: 'root',
})
export class TypeRelevantService implements ICrudMethods<ITypeRelevant> {
  private readonly route: string = ENDPOINT_LINKS.TypeRelevant;
  constructor(private typeRelevantRepository: Repository<ITypeRelevant>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITypeRelevant>> {
    return this.typeRelevantRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITypeRelevant> {
    return this.typeRelevantRepository.getById(`${this.route}/id`, id);
  }

  create(model: ITypeRelevant): Observable<ITypeRelevant> {
    return this.typeRelevantRepository.create(this.route, model);
  }

  update(id: string | number, model: ITypeRelevant): Observable<Object> {
    return this.typeRelevantRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.typeRelevantRepository.remove(this.route, id);
  }

  //Borrar servicio
  search(params: ListParams): Observable<IListResponse<ITypeRelevant>> {
    return this.typeRelevantRepository.getAllPaginated(
      `${this.route}/search`,
      params
    );
  }
}
