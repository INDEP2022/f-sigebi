import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProtectionEndpoints } from '../../../common/constants/endpoints/protection-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IProtection,
  IProtectionPerGood,
} from '../../models/ms-protection/protection.model';

@Injectable({
  providedIn: 'root',
})
export class ProtectionService extends HttpService {
  private readonly route = ProtectionEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Protection;
  }

  getAll(params?: ListParams): Observable<IListResponse<IProtection>> {
    return this.get<IListResponse<IProtection>>(this.route.Protection, params);
  }
  getByIdNew(id: string): Observable<IListResponse<IProtection>> {
    return this.httpClient.get<IListResponse<IProtection>>(
      `${this.url}${this.prefix}${this.route.Protection}/${id}`
    );
  }
  getAllWithFilters(params?: string): Observable<IListResponse<IProtection>> {
    return this.get<IListResponse<IProtection>>(this.route.Protection, params);
  }

  getByPerIds(data: any): Observable<any> {
    return this.post<any>(this.route.ProtectionGoodIds, data);
  }

  getById(id: string | number): Observable<IProtection> {
    const route = `${this.route.Protection}/${id}`;
    return this.get(route);
  }

  create(body: IProtection) {
    return this.post(this.route.Protection, body);
  }

  createPerProtection(body: IProtectionPerGood) {
    return this.post(this.route.ProtectionGood, body);
  }

  update(id: string | number, body: IProtection) {
    const route = `${this.route.Protection}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.route.Protection}/${id}`;
    return this.delete(route);
  }
}
