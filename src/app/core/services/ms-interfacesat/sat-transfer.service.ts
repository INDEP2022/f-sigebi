import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { InterfaceSatEndpoints } from '../../../common/constants/endpoints/ms-intefacesat-endpoints';
import {
  ICountAffairOptions,
  ISatTransfer,
} from '../../models/ms-interfacesat/ms-interfacesat.interface';

@Injectable({
  providedIn: 'root',
})
export class SatTransferService extends HttpService {
  private readonly route = InterfaceSatEndpoints;
  constructor() {
    super();
    this.microservice = this.route.InterfaceSat;
  }

  getAll(params?: ListParams): Observable<IListResponse<ISatTransfer>> {
    return this.get<IListResponse<ISatTransfer>>(
      this.route.SatTransfer,
      params
    );
  }

  getAllWithFilters(params?: string): Observable<IListResponse<ISatTransfer>> {
    return this.get<IListResponse<ISatTransfer>>(
      this.route.SatTransfer,
      params
    );
  }

  getById(id: string | number): Observable<ISatTransfer> {
    const route = `${this.route.SatTransfer}/${id}`;
    return this.get(route);
  }

  create(body: ISatTransfer) {
    return this.post(this.route.SatTransfer, body);
  }

  update(id: string | number, body: ISatTransfer) {
    const route = `${this.route.SatTransfer}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.SatTransfer}/${id}`;
    return this.delete(route);
  }

  getCountAffair(options: ICountAffairOptions): Observable<{ count: number }> {
    return this.post<{ count: string }>(
      `${this.route.CountAffair}`,
      options
    ).pipe(
      map(resp => {
        return { count: Number(resp.count) };
      })
    );
  }

  getCountRegisters(body: {}) {
    return this.post(this.route.CountRegisters, body);
  }
}
