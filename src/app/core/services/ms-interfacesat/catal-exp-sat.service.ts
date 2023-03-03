import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { InterfaceSatEndpoints } from '../../../common/constants/endpoints/ms-intefacesat-endpoints';
import { ICatExpSat } from '../../models/ms-interfacesat/ms-interfacesat.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalExpSatService extends HttpService {
  private readonly route = InterfaceSatEndpoints;
  constructor() {
    super();
    this.microservice = this.route.InterfaceSat;
  }

  getAll(params?: ListParams): Observable<IListResponse<ICatExpSat>> {
    return this.get<IListResponse<ICatExpSat>>(this.route.CatExpSat, params);
  }

  getAllWithFilters(params?: string): Observable<IListResponse<ICatExpSat>> {
    return this.get<IListResponse<ICatExpSat>>(this.route.CatExpSat, params);
  }

  getById(id: string | number): Observable<ICatExpSat> {
    const route = `${this.route.CatExpSat}/${id}`;
    return this.get(route);
  }

  create(body: ICatExpSat) {
    return this.post(this.route.CatExpSat, body);
  }

  update(id: string | number, body: ICatExpSat) {
    const route = `${this.route.CatExpSat}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.CatExpSat}/${id}`;
    return this.delete(route);
  }
}
