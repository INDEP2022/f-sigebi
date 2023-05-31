import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThirdPartyAdmonEndpoints } from 'src/app/common/constants/endpoints/ms-third-party-admon-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
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
    params?: _Params
  ): Observable<IListResponse<IGoodPossessionThirdParty>> {
    return this.get<IListResponse<any>>(
      ThirdPartyAdmonEndpoints.GoodPossessionThirdParty,
      params
    );
  }

  getAllDetailGoodPossessionThirdParty(params?: _Params) {
    return this.get<
      IListResponse<{
        possessionNumber: number;
        goodNumber: number;
        steeringwheelNumber: number;
        nbOrigin: string;
      }>
    >(ThirdPartyAdmonEndpoints.DetailGoodPossessionThirdParty, params);
  }
}
