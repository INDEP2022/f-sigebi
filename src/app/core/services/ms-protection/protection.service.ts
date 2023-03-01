import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProtectionEndpoints } from '../../../common/constants/endpoints/protection-endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProtection } from '../../models/ms-protection/protection.model';

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

  getAllWithFilters(params?: string): Observable<IListResponse<IProtection>> {
    return this.get<IListResponse<IProtection>>(this.route.Protection, params);
  }

  getById(id: string | number): Observable<IProtection> {
    const route = `${this.route.Protection}/${id}`;
    return this.get(route);
  }

  create(body: IProtection) {
    return this.post(this.route.Protection, body);
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
