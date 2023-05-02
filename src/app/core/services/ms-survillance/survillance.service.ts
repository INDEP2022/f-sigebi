import { Injectable } from '@angular/core';
import { SurvillanceEndpoints } from 'src/app/common/constants/endpoints/ms-survillance';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IViewVigDelegations,
  IVigBinnacle,
  IVigProcessPercentages,
} from '../../models/ms-survillance/survillance';

@Injectable({
  providedIn: 'root',
})
export class SurvillanceService extends HttpService {
  private readonly route = SurvillanceEndpoints;
  constructor() {
    super();
    this.microservice = this.route.Survillance;
  }

  getVigProcessPercentages(params?: _Params) {
    return this.get<IListResponse<IVigProcessPercentages>>(
      this.route.VigProcessPercentages,
      params
    );
  }

  getViewVigDelegations(params?: _Params) {
    return this.get<IListResponse<IViewVigDelegations>>(
      this.route.View_VigDelegations,
      params
    );
  }

  postVigProcessPercentages(data: IVigProcessPercentages) {
    return this.post(this.route.VigProcessPercentages, data);
  }

  putVigProcessPercentages(id: number, data: IVigProcessPercentages) {
    return this.put(`${this.route.VigProcessPercentages}/${id}`, data);
  }

  deleteVigProcessPercentages(id: number) {
    return this.delete(`${this.route.VigProcessPercentages}/${id}`);
  }

  getVigBinnacle(params?: _Params) {
    return this.get<IListResponse<IVigBinnacle>>(
      this.route.VigBinnacle,
      params
    );
  }

  postDeletePeriod(data: any) {
    return this.post(this.route.DeletePeriod, data);
  }

  postRecordRandom(data: any) {
    return this.post(this.route.RecordRandom, data);
  }

  postValidPeriod(data: any) {
    return this.post(this.route.ValidPeriod, data);
  }

  postPeriods(data: any) {
    return this.post(this.route.Periods, data);
  }

  postChangePeriod(data: any) {
    return this.post(this.route.ChangePeriod, data);
  }

  postChangeGoodAle(data: any) {
    return this.post(this.route.ChangeGoodAle, data);
  }
}
