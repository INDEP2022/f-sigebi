import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/good/good.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class GoodService implements ICrudMethods<IGood> {
  private readonly route: string = 'pendiente/parametros';
  constructor(
    private goodRepository: Repository<IGood>,
    private http: HttpClient
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAllPaginated('good/good', params);
  }

  getById(id: string | number): Observable<any> {
    return this.goodRepository.getById('good/good', id);
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
}
