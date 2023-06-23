import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  GoodsExcel,
  NumDetGood,
} from 'src/app/pages/administrative-processes/numerary/numerary-request/models/goods-det';
import { MassiveGoodEndpoints } from '../../../common/constants/endpoints/ms-massivegood-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IIdentifierCount,
  IMassiveGoodTracker,
} from '../../models/ms-massivegood/massive-good-goods-tracker.model';
import { IMassiveGood } from '../../models/ms-massivegood/massivegood.model';

@Injectable({
  providedIn: 'root',
})
export class MassiveGoodService extends HttpService {
  private readonly route = MassiveGoodEndpoints;
  constructor() {
    super();
    this.microservice = this.route.MassiveGood;
  }

  getAll(params?: ListParams): Observable<IListResponse<IMassiveGood>> {
    return this.get<IListResponse<IMassiveGood>>(
      this.route.MassiveChargeGoods,
      params
    );
  }

  getAllWithFilters(params?: string): Observable<IListResponse<IMassiveGood>> {
    return this.get<IListResponse<IMassiveGood>>(
      this.route.MassiveChargeGoods,
      params
    );
  }

  getById(id: string | number): Observable<IMassiveGood> {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.get(route);
  }

  create(body: IMassiveGood) {
    return this.post(this.route.MassiveChargeGoods, body);
  }

  update(id: string | number, body: Partial<IMassiveGood>) {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.MassiveChargeGoods}/${id}`;
    return this.delete(route);
  }

  countMassiveGood(id: number): Observable<{ data: number }> {
    return this.get<{ data: string }>(
      `${this.route.CountMassiveGood}/${id}`
    ).pipe(
      map(resp => {
        return { data: Number(resp.data) };
      })
    );
  }

  massivePropertyExcel(body: { base64: string }) {
    return this.post(this.route.MassivePropertyExcel, body);
  }

  deleteMassiveGoodComer(good: number) {
    return this.delete(`${this.route.DeleteMassiveGood}/${good}`);
  }

  getWheelNotificationsByExpedientNumber(goodNumber: string) {
    const route = `${this.route.GetFlierNumberMassiveGood}/${goodNumber}`;
    return this.get(route);
  }

  getDatosCSV() {
    return this.post(this.route.GetFileCSV, '');
  }
  updateMassiveGoods(body: {}) {
    const route = `${this.route.MassiveChargeGoods}/update-massive-goods`;
    return this.put(route, body);
  }

  goodTracker(body: any) {
    const route = `application/goodTracker`;
    return this.post<IMassiveGoodTracker>(route, body);
  }

  chargeGoodsByExpedient(expedient: number | string) {
    const route = MassiveGoodEndpoints.chargeGoodByExpedient;
    return this.get(`${route}/${expedient}`);
  }

  pufVerificaComers(body: any) {
    const route = `findica/pup-verif-comer`;
    return this.post<IMassiveGoodTracker>(route, body);
  }

  getIdentifierCount(
    params: ListParams
  ): Observable<IListResponse<IIdentifierCount>> {
    const route = `application/getIdentifierCount`;
    return this.get(route, params);
  }

  getDataCSVFile(currency: string, file: any) {
    const formData = new FormData();
    formData.append('tCurrency', currency);
    formData.append('file', file);
    return this.post<IListResponse<NumDetGood>>(this.route.FileCSV, formData);
  }

  getBanVal(status:string){
    const route = `application/act-bdc-change-status`
    return this.get(`${route}/${status}`)

  }
}
