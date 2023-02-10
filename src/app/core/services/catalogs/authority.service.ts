import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAuthority } from '../../models/catalogs/authority.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorityService
  extends HttpService
  implements ICrudMethods<IAuthority>
{
  private readonly route: string = ENDPOINT_LINKS.Authority;
  constructor(private authorityRepository: Repository<IAuthority>) {
    super();
    this.microservice = 'catalog';
  }

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
    const route = 'catalog/api/v1/authority/id';
    return this.httpClient.post<IListResponse<IAuthority>>(
      `${environment.API_URL}${route}`,
      model
    );
  }

  getAllFilter(params?: _Params) {
    return this.get('authority', params);
  }

  postByColumns(
    _params?: ListParams,
    model?: Object
  ): Observable<IListResponse<IAuthority>> {
    const route = `catalog/api/v1/authority/columns`;
    const params = this.makeParams(_params);

    return this.httpClient.post<IListResponse<IAuthority>>(
      `${environment.API_URL}${route}?${params}`,
      model
    );
  }

  search(_params?: ListParams): Observable<IListResponse<IAuthority>> {
    const route = `catalog/api/v1/authority/search`;
    const params = this.makeParams(_params);

    return this.httpClient.get<IListResponse<IAuthority>>(
      `${environment.API_URL}${route}?${params}`
    );
  }

  private makeParams(params: ListParams): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }
}
