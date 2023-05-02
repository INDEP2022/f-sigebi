import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ParameterComerEndpoints } from '../../../common/constants/endpoints/ms-parametercomer-endpoints';
import { IConfigvtadmun } from '../../models/ms-parametercomer/configvtadmum.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigvtadmunService extends HttpService {
  private readonly endpoint: string = ParameterComerEndpoints.Configvtadmun;
  constructor() {
    super();
    this.microservice = ParameterComerEndpoints.BasePath;
  }

  getAllFilter(params?: _Params): Observable<IListResponse<IConfigvtadmun>> {
    return this.get<IListResponse<IConfigvtadmun>>(this.endpoint, params);
  }

  update(config: Partial<IConfigvtadmun>) {
    return this.put(this.endpoint, config);
  }

  create(config: Partial<IConfigvtadmun>) {
    return this.post(this.endpoint, config);
  }

  remove(body: { idTable: string; idColumn: string }) {
    return this.delete(this.endpoint, body);
  }
}
