import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorityEndpoints } from 'src/app/common/constants/endpoints/authority-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import {
  IListResponse,
  IResponse,
} from '../../interfaces/list-response.interface';
import {
  IAuthority,
  IAuthority2,
  IAuthorityIssuingParams,
  INoCityByAsuntoSAT,
} from '../../models/catalogs/authority.model';

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
    return this.authorityRepository.getById(`${this.route}/id`, id);
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

  //borrar
  postByIds(model: Object): Observable<IListResponse<IAuthority>> {
    const route = 'catalog/api/v1/authority/id';
    return this.httpClient.post<IListResponse<IAuthority>>(
      `${environment.API_URL}${route}`,
      model
    );
  }

  getAllFilter(params?: _Params): Observable<IListResponse<IAuthority>> {
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

  getCityByAsuntoSat(id: string | number): Observable<INoCityByAsuntoSAT> {
    const route = `catalog/api/v1/authority/city-number/`;
    return this.authorityRepository.getCityByAsuntoSat(this.route, id);
  }

  getAuthorityIssuingByParams(body: IAuthorityIssuingParams | any) {
    return this.authorityRepository.getAuthorityIssuingByParams(
      'catalog/api/v1/authority/authority-and-station?limit=10&page=1',
      body
    );
  }
  getAuthorityIssuingByAverPrevia(body: IAuthorityIssuingParams | any) {
    return this.authorityRepository.getAuthorityIssuingByParams(
      'catalog/authority/authority-and-station?limit=1&page=1',
      body
    );
  }

  getAuthorityByTransferent(
    id: string | number,
    id2: string | number,
    params?: ListParams
  ): Observable<IListResponse<IAuthority2>> {
    const route = `${AuthorityEndpoints.Authority}?filter.idStation=${id}&filter.idTransferer=${id2}`;
    return this.get(route, params);
  }

  getAppsDescAuthory(params?: ListParams) {
    return this.get<IResponse>(AuthorityEndpoints.Apps, params);
  }

  /*getGoodAppraise(params?: ListParams) {
    return this.get<IResponse>(AuthorityEndpoints.Apps, params);
  }*/

  create2(model: IAuthority) {
    return this.post(AuthorityEndpoints.Authority, model);
  }

  update2(model: IAuthority) {
    const route = `${AuthorityEndpoints.Authority}`;
    return this.put(route, model);
  }

  update3(id: string | number, model: IAuthority) {
    const route = `${AuthorityEndpoints.Authority}/id/${id}`;
    return this.put(route, model);
  }

  remove2(id: number | string, model: Object) {
    const route = `${AuthorityEndpoints.Authority}/id/${id}`;
    return this.delete(route, model);
  }

  getDescription(id: number) {
    const route = `${AuthorityEndpoints.Sssubtipe}?filter.numClasifGoods=$eq:${id}`;
    return this.get(route);
  }

  getTranfer(params?: ListParams | string): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.transferent}`;
    return this.get(route, params);
  }

  getTranferId(id: number) {
    const route = `${AuthorityEndpoints.transferent}?filter.id=$eq:${id}`;
    return this.get(route);
  }

  getTranferIdandEmisora(
    params?: ListParams | string
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.station}`;
    return this.get(route, params);
  }

  getstationId(trasnfer: any, emisora: any) {
    const route = `${AuthorityEndpoints.station}?filter.idTransferent=$eq:${trasnfer}&filter.id=$eq:${emisora}`;
    return this.get(route);
  }

  getStrategyFormat(
    params?: ListParams | string
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.getTdsau}`;
    return this.get(route, params);
  }

  getAllUthorities(
    params: ListParams | string,
    params2: any
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.getAllAutoritiesV2}`;
    return this.post(route, params2, params);
  }

  getAllDataQuery(
    params: ListParams | string,
    delegation: any
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.getDataQuery}?virDelegation=${delegation}`;
    return this.get(route, params);
  }

  getAuthorities(
    params: any,
    Autority: any,
    transferer: any,
    station: any
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.getAllAutoritiesV2}?filter.idAuthority=$eq:${Autority}&filter.idTransferer=$eq:${transferer}&filter.idStation=$eq:${station}`;
    return this.post(route, params);
  }

  getDataQuery(
    delegation: any,
    noWarehouse: any
  ): Observable<IListResponse<any>> {
    const route = `${AuthorityEndpoints.getDataQuery}?virDelegation=${delegation}&noWarehouse=${noWarehouse}`;
    return this.get(route);
  }

  getDescriptionService(params: ListParams) {
    return this.get(AuthorityEndpoints.ServiceCat, params);
  }
}
