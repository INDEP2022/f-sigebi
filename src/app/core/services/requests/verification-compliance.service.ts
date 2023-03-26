import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRequest } from '../../models/requests/request.model';

@Injectable({
  providedIn: 'root',
})
export class VerificationComplianceService extends HttpService {
  constructor() {
    super();
    this.microservice = ENDPOINT_LINKS.request;
  }

  getAll(params?: any): Observable<IListResponse<IRequest>> {
    return this.get<any>(ENDPOINT_LINKS.VerificationCompliance, params);
  }

  getById(id: string | number) {
    const route = `${ENDPOINT_LINKS.VerificationCompliance}/${id}`;
    return this.get(route);
  }

  create(request: IRequest) {
    return this.post(ENDPOINT_LINKS.VerificationCompliance, request);
  }

  update(id: string | number, request: IRequest) {
    const route = `${ENDPOINT_LINKS.VerificationCompliance}/${id}`;
    return this.put(route, request);
  }

  remove(id: string | number) {
    const route = `${ENDPOINT_LINKS.VerificationCompliance}/${id}`;
    return this.delete(route);
  }
}
