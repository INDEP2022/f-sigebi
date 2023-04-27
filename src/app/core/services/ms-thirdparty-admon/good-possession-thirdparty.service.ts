import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyAdmonEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-admon-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodPossessionThirdParty } from '../../models/ms-thirdparty-admon/third-party-admon.model';

@Injectable({
  providedIn: 'root',
})
export class GoodPosessionThirdpartyService extends HttpService {
  constructor() {
    super();
    this.microservice = ThirdPartyAdmonEndpoints.BasePath;
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IGoodPossessionThirdParty>> {
    return this.get<IListResponse<any>>(
      ThirdPartyAdmonEndpoints.GoodPossessionThirdParty,
      params
    );
  }
}
