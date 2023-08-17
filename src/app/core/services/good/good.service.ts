import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';
import { IAttribGoodBad, IGoodSiab } from '../../models/ms-good/good';
@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodService extends HttpService implements ICrudMethods<IGood> {
  private readonly route: string = 'pendiente/parametros';
  constructor(
    private goodRepository: Repository<IGood>,
    private http: HttpClient
  ) {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAllPaginated('good/good', params);
  }

  getByFilter(
    params?: HttpParams,
    id?: string
  ): Observable<IListResponse<IGood>> {
    return this.get(`good?${id}`, params);
  }

  getById(id: string | number): Observable<any> {
    return this.goodRepository.getById('good/good', id);
  }

  getById2(id: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(`${route}?filter.id=$eq:${id}`).pipe(
      map(items => {
        return items.data
          ? items.data.length > 0
            ? items.data[0]
            : null
          : null;
      })
    );
  }

  getByIdv3(goodId: string | number) {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(
      `${route}?filter.goodId=$eq:${goodId}`
    ).pipe(
      map(items => {
        return items.data
          ? items.data.length > 0
            ? items.data[0]
            : null
          : null;
      })
    );
  }

  getGoodByIds(id: string | number): Observable<any> {
    const route = `good/good/getGoodById/${id}/${id}`;
    return this.goodRepository.getGoodByIds(route);
  }

  getDataByGoodFather(goodFather: number) {
    return this.goodRepository.getById(
      'good/good/getDataByGoodFather',
      goodFather
    );
  }

  getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }

  getGoodAtributesByClasifNum(clasifNum: number) {
    const route = `good/status-good/getAttribGoodData/${clasifNum}`;
    const params = { inicio: 1, pageSize: 150 };
    return this.goodRepository.getAllPaginated(route, params);
  }

  updateStatusGood(model: IGood): Observable<Object> {
    const route = 'good/good';
    return this.goodRepository.update7(route, model);
  }

  getStatusAll(params: ListParams) {
    return this.goodRepository.getAllPaginated('good/status-good', params);
  }
  getStatusByGood(idGood: string | number): Observable<any> {
    const route = 'good/good/getDescAndStatus';
    return this.goodRepository.getById(route, idGood);
  }
  getDataGoodByDeparture(departureNum: number | string) {
    const route = 'good/good/dataGoodByDeparture';
    return this.goodRepository.getById(route, departureNum);
  }

  getTempGood(body: any) {
    const route = 'good/status-good/tmpGoodAllSelect';
    return this.goodRepository.create(route, body) as any;
  }

  create(model: IGood): Observable<IGood> {
    return this.goodRepository.create('good/good', model);
  }

  update(id: string | number, model: IGood): Observable<Object> {
    return this.goodRepository.update('good/good', id, model);
  }

  updateByBody(formData: Object) {
    const route = `good/api/v1/good`;
    return this.http.put(`${environment.API_URL}/${route}`, formData);
  }

  getByExpedientAndStatus(
    expedient: string | number,
    status: string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `?filter.fileNumber=$eq:${expedient}&filter.status=$eq:${status}`;
    return this.goodRepository.getAllPaginated(`good/good${route}`, params);
  }

  getGoodsDomicilies(params?: ListParams) {
    return this.goodRepository.getAllPaginated(`good/domicilies`, params);
  }

  getByStatus(idStatus: string) {
    return this.goodRepository.getById('good/status-good/', idStatus);
  }
  getByIdNew(id: string | number, goodId: number | string): Observable<any> {
    const route = `good/api/v1/good/getGoodbyId`;
    return this.http.get(`${environment.API_URL}${route}/${id}/${goodId}`);
  }

  getAttribGoodBadAll(
    params?: _Params
  ): Observable<IListResponse<IAttribGoodBad>> {
    return this.get<IListResponse<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    );
  }

  getGoodSiabAll(params?: _Params): Observable<IListResponse<IGoodSiab>> {
    return this.get<IListResponse<IGoodSiab>>(
      GoodEndpoints.GoodGetSiab,
      params
    );
  }
  getAttribGoodBadFilter(
    params?: _Params
  ): Observable<IListResponse<IAttribGoodBad>> {
    return this.get<IListResponse<IAttribGoodBad>>(
      GoodEndpoints.AttribGoodBad,
      params
    );
  }

  getByExpedient(id: number) {
    const URL = `${environment.API_URL}/good/api/v1/good/`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append('filter.fileNumber', `$eq:${id}`);

    return this.http
      .get<any>(URL, { headers: headers, params: params })
      .pipe(map(res => res));
  }

  getByExpedient_(id: number, _params?: ListParams) {
    _params['filter.fileNumber'] = `$eq:${id}`;
    const URL = `${environment.API_URL}/good/api/v1/good/`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append('filter.fileNumber', `$eq:${id}`);

    return this.http
      .get<any>(URL, { headers: headers, params: _params })
      .pipe(map(res => res));
  }

  getByRequestId(Norequest: string | number) {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.requestId=$eq:${Norequest}`
    );
  }
}
