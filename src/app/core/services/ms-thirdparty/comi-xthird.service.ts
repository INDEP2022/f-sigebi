import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComiXThird } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class ComiXThirdService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IComiXThird>> {
    return this.get<IListResponse<IComiXThird>>(
      ThirdPartyEndpoints.ThirdParty,
      params
    );
  }

  getById(id: string | number): Observable<IListResponse<IComiXThird>> {
    const route = `${ThirdPartyEndpoints.ComiXthird}/id/${id}`;
    return this.get<IListResponse<IComiXThird>>(route);
  }

  update(id: string | number, model: IComiXThird) {
    const route = `${ThirdPartyEndpoints.ComiXthird}/id/${id}`;
    return this.put(route, model);
  }

  create(model: IComiXThird) {
    return this.post(ThirdPartyEndpoints.ComiXthird, model);
  }
}
