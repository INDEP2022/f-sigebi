import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IThirdParty } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IThirdParty>> {
    return this.get<IListResponse<IThirdParty>>(
      ThirdPartyEndpoints.ThirdParty,
      params
    );
  }

  update(id: string | number, model: IThirdParty) {
    const route = `${ThirdPartyEndpoints.ThirdParty}/id/${id}`;
    return this.put(route, model);
  }

  create(model: IThirdParty) {
    return this.post(ThirdPartyEndpoints.ThirdParty, model);
  }
}
