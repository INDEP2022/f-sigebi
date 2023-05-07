import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MassiveGoodEndpoints } from '../../../common/constants/endpoints/ms-massivegood-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
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
}
