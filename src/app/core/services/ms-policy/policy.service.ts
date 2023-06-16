import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDeletePolicyXGood,
  IPolicyXBien,
} from '../../models/ms-policy/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService extends HttpService {
  private readonly route = 'policy';
  constructor() {
    super();
    this.microservice = 'policy';
  }

  getAll(params?: ListParams): Observable<IListResponse<IPolicyXBien>> {
    const route = 'policies-x-right';
    return this.get<IListResponse<IPolicyXBien>>(route, params);
  }

  remove(model: IDeletePolicyXGood) {
    const route = 'policies-x-right';
    return this.delete(route, model);
  }
}
