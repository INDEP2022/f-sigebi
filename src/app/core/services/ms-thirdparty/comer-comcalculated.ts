import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerComCalculated } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class ComerComCalculatedService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IComerComCalculated>> {
    return this.get<IListResponse<IComerComCalculated>>(
      ThirdPartyEndpoints.ComerComCalculated,
      params
    );
  }

  create(model: IComerComCalculated) {
    return this.post(ThirdPartyEndpoints.ComerComCalculated, model);
  }
  //
  update(id: string | number, model: IComerComCalculated) {
    const route = `${ThirdPartyEndpoints.ComerComCalculated}/${id}`;
    return this.put(route, model);
  }
}
