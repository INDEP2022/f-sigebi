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

  getByKeyId(
    Key: string,
    params?: ListParams | string
  ): Observable<IListResponse> {
    return this.get<IListResponse>(
      `${PolicyEndpoint.getPolicesXRight}?filter.policyKeyId=$eq:${Key}`,
      params
    );
  }

  /*getAllK(params?: ListParams | string): Observable<IListResponse<IDocuments>> {
    return this.get<IListResponse<IDocuments>>(
      DocumentsEndpoints.Documents,
      params
    );
  }*/

  putPolicyGood(params: any) {
    return this.put(PolicyEndpoint.getPolicesXRight, params);
  }

  postPolicyGood(params: any) {
    return this.post(PolicyEndpoint.getPolicesXRight, params);
  }

  deletePolicyGood(params: any) {
    return this.delete(PolicyEndpoint.getPolicesXRight, params);
  }

  postPolicy(params: any) {
    return this.post(PolicyEndpoint.getPoliciesXSubtype, params);
  }

  getSinister(PolicyKey: string) {
    return this.get<IListResponse>(
      `${PolicyEndpoint.getPolicesXsinister}?filter.policyKeyId=$eq:${PolicyKey}`
    );
  }
}
