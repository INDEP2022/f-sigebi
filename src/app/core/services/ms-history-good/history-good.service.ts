import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryGoodEndpoints } from 'src/app/common/constants/endpoints/ms-historygood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IHistoricGoodsAsegExtdom,
  IHistoryGood,
  IReturnStatusProcess,
  ISentSirsae,
} from '../../models/administrative-processes/history-good.model';

@Injectable({
  providedIn: 'root',
})
export class HistoryGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = HistoryGoodEndpoints.HistoryGood;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IHistoryGood>> {
    return this.get<IListResponse<IHistoryGood>>(
      HistoryGoodEndpoints.HistoryStatusGood,
      params
    );
  }

  getAllFilter(params?: string): Observable<IListResponse<IHistoryGood>> {
    return this.get<IListResponse<IHistoryGood>>(
      `${HistoryGoodEndpoints.HistoryStatusGood}?${params}`
    );
  }

  getById(id: string | number) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.get<IHistoryGood>(route);
  }

  create(documents: IHistoryGood) {
    return this.post<IHistoryGood>(
      HistoryGoodEndpoints.HistoryStatusGood,
      documents
    );
  }

  sentSirsae(data: ISentSirsae) {
    return this.post<ISentSirsae>(HistoryGoodEndpoints.SentSirsae, data);
  }

  update(id: string | number, documents: IHistoryGood) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.put(route, documents);
  }

  remove(id: string | number) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}/${id}`;
    return this.delete(route);
  }
  getByGoodAndProcess(
    idGood: string | number,
    process: string
  ): Observable<IListResponse<IHistoryGood>> {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}?filter.propertyNum=$eq:${idGood}&filter.extDomProcess=$not:${process}`;
    /* const route = `http://sigebimsqa.indep.gob.mx/historygood/api/v1/historical-status-good`;
    console.log(routess); */
    return this.get<IListResponse<IHistoryGood>>(route);
  }

  getHistoryStatusGoodById(query: any) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGoodFindById}`;
    return this.post(route, query);
  }
  returnStatusProcess(data: IReturnStatusProcess) {
    return this.post<any>(HistoryGoodEndpoints.ReturnStatusProcess, data);
  }

  getPrexdoAnterior(noBien: number | string) {
    const route = HistoryGoodEndpoints.GetPrexdoAnterior;
    return this.get(`${route}/${noBien}`);
  }

  getChangeDateHistory(noBien: number | string) {
    const route = HistoryGoodEndpoints.GetChangeDate;
    return this.get(`${route}/${noBien}`);
  }

  getHistoryGoodStatus(goodId: number | string, params: _Params) {
    const route = `application/getHistoryStatusGood/${goodId}`;
    return this.get(route, params);
  }

  getPreviousHistoryGood(body: any) {
    const route = HistoryGoodEndpoints.GetEstPreviousHistory;
    return this.post(`${route}`, body);
  }

  getPreviousHistoryGood2(body: any) {
    const route = HistoryGoodEndpoints.GetEstPreviousHistory2;
    return this.post(`${route}`, body);
  }

  validateDateToUpdateStatus(body: any) {
    const route = HistoryGoodEndpoints.ValidateDatesToUpdateStatus;
    return this.post(`${route}`, body);
  }

  getProcessExtDom(goodNumber: any) {
    const route = HistoryGoodEndpoints.GetProcessExtDom;
    return this.get(`${route}/` + goodNumber);
  }
  getChangeDate(goodNumber: any) {
    const route = 'historical/getChangeDate/' + goodNumber;
    return this.get(`${route}`);
  }

  updateGoodStatusWhenDelete(body: any) {
    const route = HistoryGoodEndpoints.UpdateGoodStatusWhenDelete;
    return this.post(`${route}`, body);
  }
  getAllFilterHistoricGoodsAsegExtdom(
    params?: _Params
  ): Observable<IListResponse<IHistoricGoodsAsegExtdom>> {
    return this.get<IListResponse<IHistoricGoodsAsegExtdom>>(
      `${HistoryGoodEndpoints.HistoricGoodsAsegExtdom}`,
      params
    );
  }
  createHistoricGoodsAsegExtdom(body: Partial<IHistoricGoodsAsegExtdom>) {
    return this.post<IHistoricGoodsAsegExtdom>(
      HistoryGoodEndpoints.HistoricGoodsAsegExtdom,
      body
    );
  }
  updateHistoricGoodsAsegExtdom(body: Partial<IHistoricGoodsAsegExtdom>) {
    return this.put<IHistoricGoodsAsegExtdom>(
      HistoryGoodEndpoints.HistoricGoodsAsegExtdom,
      body
    );
  }
  updateHistoricGoods(body: Partial<IHistoricGoodsAsegExtdom>) {
    return this.put<IHistoricGoodsAsegExtdom>(
      HistoryGoodEndpoints.HistoryStatusGood,
      body
    );
  }

  PostStatus(params: any) {
    const route = `${HistoryGoodEndpoints.HistoryStatusGood}`;
    return this.post(route, params);
  }

  getStatus(goodNumber: string | number, params: any) {
    const route = `${HistoryGoodEndpoints.GetStatus}/${goodNumber}`;
    return this.get(route, params);
  }

  getCount(goodNumber: string | number) {
    const route = `${HistoryGoodEndpoints.GetCount}/${goodNumber}`;
    return this.get(route);
  }

  getUpdateGoodXHist(goodNumber: string | number) {
    const route = `${HistoryGoodEndpoints.UpdateGoodXHist}/${goodNumber}`;
    return this.get(route);
  }
}
