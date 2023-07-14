import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PolicyEndpoint } from 'src/app/common/constants/endpoints/policy-endpoint';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDeletePolicyXGood,
  IPolicyXBien,
  IPolicyxRequest,
} from '../../models/ms-policy/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService extends HttpService {
  private readonly route = 'policy';
  constructor() {
    super();
    this.microservice = PolicyEndpoint.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IPolicyXBien>> {
    const route = 'policies-x-right';
    return this.get<IListResponse<IPolicyXBien>>(route, params);
  }

  remove(model: IDeletePolicyXGood) {
    const route = 'policies-x-right';
    return this.delete(route, model);
  }

  getByNoRequest(NoSolicitud: String | number): Observable<IPolicyxRequest> {
    return this.get<IPolicyxRequest>(
      `${PolicyEndpoint.getRequestNumber}/${NoSolicitud}`
    );
  }

  getBypolicyKeyId(PolicyKey: string | number) {
    return this.get<IListResponse>(
      `${PolicyEndpoint.getPoliciesXSubtype}?filter.policyKeyId=$eq:${PolicyKey}`
    );
  }
}
