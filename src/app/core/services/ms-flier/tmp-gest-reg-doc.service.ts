import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { FlierEndpoints } from '../../../common/constants/endpoints/ms-flier-endpoints';
import { HttpService } from '../../../common/services/http.service';
import { ITmpGestRegDoc } from '../../models/ms-flier/tmp-doc-reg-management.model';

@Injectable({
  providedIn: 'root',
})
export class TmpGestRegDocService extends HttpService {
  private readonly endpoint: string = FlierEndpoints.TempGestRegDoc;
  constructor() {
    super();
    this.microservice = FlierEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<ITmpGestRegDoc>> {
    return this.get<IListResponse<ITmpGestRegDoc>>(this.endpoint, params);
  }

  getAllWithFilters(
    params?: string
  ): Observable<IListResponse<ITmpGestRegDoc>> {
    return this.get<IListResponse<ITmpGestRegDoc>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(body: ITmpGestRegDoc) {
    return this.post(this.endpoint, body);
  }

  update(id: string | number, body: ITmpGestRegDoc) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, body);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
