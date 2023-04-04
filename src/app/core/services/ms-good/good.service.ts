import { EventEmitter, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDescriptionByNoGoodBody,
  IDescriptionByNoGoodResponse,
  IFromGoodsAndExpedientsBody,
  IFromGoodsAndExpedientsResponse,
} from '../../models/good/good.model';
import { ITrackedGood } from '../../models/ms-good-tracker/tracked-good.model';
import { GoodGetData, IGood } from '../../models/ms-good/good';
import { IGoodDesc } from '../../models/ms-good/good-and-desc.model';

@Injectable({
  providedIn: 'root',
})
export class GoodService extends HttpService {
  good$ = new EventEmitter<IGood>();

  constructor() {
    super();
    this.microservice = GoodEndpoints.Good;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(GoodEndpoints.Good, params);
  }

  getData(goodData: GoodGetData): Observable<IListResponse<IGood>> {
    return this.post(GoodEndpoints.GoodGetDat, goodData);
  }

  getAllFilter(params?: string): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(`${GoodEndpoints.Good}?${params}`);
  }

  getById(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.get<IGood>(route);
  }

  create(good: IGood) {
    return this.post(GoodEndpoints.Good, good);
  }

  //
  update(good: IGood) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  updateWithoutId(good: IGood) {
    const route = `${GoodEndpoints.Good}`;
    return this.put(route, good);
  }

  updateGoodStatusMassive(goodNumbers: number[] | string[], status: string) {
    return forkJoin(
      goodNumbers.map(goodNumber => {
        return this.updateGoodStatus(goodNumber, status);
      })
    );
  }

  updateGoodStatus(goodNumber: number | string, status: string) {
    const route = `${GoodEndpoints.Good}/updateGoodStatus/${goodNumber}/${status}`;
    return this.put(route);
  }

  remove(id: string | number) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.delete(route);
  }

  removeGood(body: Object) {
    const route = `${GoodEndpoints.Good}`;
    return this.delete(route, body);
  }

  getByExpedient(
    expedient: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    if (params) {
      params['expedient'] = expedient;
    }
    const route = GoodEndpoints.SearchByExpedient;
    return this.get<IListResponse<IGood>>(route, params);
  }

  getGoodAndDesc(goodId: number | string) {
    const route = `${GoodEndpoints.GoodAndDesc}/${goodId}`;
    return this.get<IGoodDesc>(route);
  }

  getByWarehouse(
    body: Object,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}/getGoodByWarehouse`;
    console.log(route);

    return this.post<IListResponse<IGood>>(route, body);
  }
  getByExpedientAndStatus(
    expedient: string | number,
    status: string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.fileNumber=$eq:${expedient}&filter.status=$eq:${status}`;
    return this.get<IListResponse<IGood>>(route, params);
  }
  getStatusByGood(idGood: string | number): Observable<any> {
    const route = `${GoodEndpoints.StatusAndDesc}/${idGood}`;
    return this.get<any>(route);
  }
  getBySafe(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.vaultNumber=$eq:${id}`;
    console.log(route);
    return this.get<IListResponse<IGood>>(route, params);
  }

  getGoodByStatusPDS(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}`;
    return this.get<IListResponse<IGood>>(route, params);
  }
  updateTracked(id: string | number, good: ITrackedGood) {
    const route = `${GoodEndpoints.Good}/${id}`;
    return this.put(route, good);
  }

  getExemptedGoods(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    const route = `${GoodEndpoints.Good}?filter.extDomProcess=TRANSFERENTE`;
    const route2 = `${GoodEndpoints.Good}?filter.goodId=2203409`;
    return this.get<IListResponse<IGood>>(route2, params);
  }

  getGoodByStatusPDSelect(
    params?: ListParams | string
  ): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.status=PDS`,
      params
    );
  }

  getGoodsByExpedientAndStatus(
    id: number | string,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    return this.get<IListResponse<IGood>>(
      `${GoodEndpoints.Good}?filter.fileNumber=$eq:${id}&filter.status=RGA`,
      params
    );
  }
  getDescriptionGoodByNoGood(body: IDescriptionByNoGoodBody) {
    return this.post<IListResponse<IDescriptionByNoGoodResponse>>(
      GoodEndpoints.DiStatusGood,
      body
    );
  }
  getFromGoodsAndExpedients(body: IFromGoodsAndExpedientsBody) {
    return this.post<IListResponse<IFromGoodsAndExpedientsResponse>>(
      GoodEndpoints.DiStatusGood,
      body
    );
  }
}
