import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAuthority } from '../../models/catalogs/authority.model';
@Injectable({ providedIn: 'root' })
export class AuthorityService implements ICrudMethods<IAuthority> {
  private readonly route: string = ENDPOINT_LINKS.Authority;
  constructor(private localityRepository: Repository<IAuthority>) {}

  getAll(params?: ListParams): Observable<IListResponse<IAuthority>> {
    return this.localityRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IAuthority> {
    return this.localityRepository.getById(this.route, id);
  }

  create(model: IAuthority): Observable<IAuthority> {
    return this.localityRepository.create(this.route, model);
  }

  update(id: string | number, model: IAuthority): Observable<Object> {
    return this.localityRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.localityRepository.remove(this.route, id);
  }
}
