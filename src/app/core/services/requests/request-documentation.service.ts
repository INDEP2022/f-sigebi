import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IRequest } from '../../models/requests/request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestDocumentationService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.request;
  }

  getAll(params?: any): Observable<any> {
    return this.get<any>(ENDPOINT_LINKS.RequestDocumentation, params);
  }

  getById(id: string | number) {
    const route = `${ENDPOINT_LINKS.RequestDocumentation}/${id}`;
    return this.get(route);
  }

  create(request: IRequest) {
    return this.post(ENDPOINT_LINKS.RequestDocumentation, request);
  }

  update(request: IRequest) {
    const route = `${ENDPOINT_LINKS.RequestDocumentation}`;
    return this.put(route, request);
  }

  remove(params: Object) {
    const route = `${ENDPOINT_LINKS.RequestDocumentation}`;
    return this.delete(route, params);
  }
}
