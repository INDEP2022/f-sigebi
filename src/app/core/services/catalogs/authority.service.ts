import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAuthority } from '../../models/catalogs/authority.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorityService implements ICrudMethods<IAuthority> {
  private readonly route: string = ENDPOINT_LINKS.Authority;
  constructor(private authorityRepository: Repository<IAuthority>) {}

  getAll(params?: ListParams): Observable<IListResponse<IAuthority>> {
    return this.authorityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IAuthority> {
    return this.authorityRepository.getById(this.route, id);
  }

  create(model: IAuthority): Observable<IAuthority> {
    return this.authorityRepository.create(this.route, model);
  }

  update(id: string | number, model: IAuthority): Observable<Object> {
    return this.authorityRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.authorityRepository.remove(this.route, id);
  }

  postByIds(model: Object): Observable<IListResponse<IAuthority>> {
    return this.authorityRepository.postByIds(this.route, model);
  }

  postByColumns(
    params?: ListParams,
    model?: Object
  ): Observable<IListResponse<IAuthority>> {
    return this.authorityRepository.postByColumns(this.route, params, model);
  }
}
