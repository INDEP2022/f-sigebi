import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SurvillanceContractEndpoints } from 'src/app/common/constants/endpoints/ms-surveillance-contract-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SurvillanceContractService extends HttpService {
  constructor() {
    super();
    this.microservice = SurvillanceContractEndpoints.BasePath;
  }

  private makeParams(params: ListParams | string): HttpParams {
    if (typeof params === 'string') {
      return new HttpParams({ fromString: params });
    }
    let httpParams: HttpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      httpParams = httpParams.append(key, (params as any)[key]);
    });
    return httpParams;
  }

  getSurvillanceContracts(_params: ListParams | string) {
    const params = this.makeParams(_params);

    const route = `${SurvillanceContractEndpoints.FindAll}?search=${encodeURI(
      params.get('text')
    )}&limit=${params.get('limit')}&page=${params.get(
      'page'
    )}&filter.assignees=${params.get('others')}`;

    return this.get(route);
  }
}
