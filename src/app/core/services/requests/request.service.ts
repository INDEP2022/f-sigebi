import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRequest } from '../../models/requests/request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.request;
  }

  getAll(params?: any): Observable<IListResponse<IRequest>> {
    return this.get<IListResponse<IRequest>>(ENDPOINT_LINKS.request, params);
  }

  getById(id: string | number) {
    const route = `${ENDPOINT_LINKS.request}/${id}`;
    return this.get(route);
  }

  create(request: IRequest) {
    return this.post(ENDPOINT_LINKS.request, request);
  }

  update(id: string | number, request: IRequest) {
    const route = `${ENDPOINT_LINKS.request}/${id}`;
    return this.put(route, request);
  }

  remove(id: string | number) {
    const route = `${ENDPOINT_LINKS.request}/${id}`;
    return this.delete(route);
  }

  update2(id: string | number, obj: Object) {
    const route = `${ENDPOINT_LINKS.request}/${id}`;
    return this.put(route, obj);
  }
}
