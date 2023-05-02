import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IComerCommissionsPerGood } from '../../models/ms-thirdparty/third-party.model';

@Injectable({
  providedIn: 'root',
})
export class ComerCommissionsPerGoodService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IComerCommissionsPerGood>> {
    return this.get<IListResponse<IComerCommissionsPerGood>>(
      ThirdPartyEndpoints.ComerCommissionsPerGood,
      params
    );
  }

  getFilter(id: string | number, params?: ListParams) {
    const route = `${ThirdPartyEndpoints.ComerCommissionsPerGood}?filter.comCalculatedId=${id}`;
    return this.get(route, params);
  }

  create(model: IComerCommissionsPerGood) {
    return this.post(ThirdPartyEndpoints.ComerCommissionsPerGood, model);
  }
  //
  update(model: IComerCommissionsPerGood) {
    const route = `${ThirdPartyEndpoints.ComerCommissionsPerGood}`;
    return this.put(route, model);
  }
}
