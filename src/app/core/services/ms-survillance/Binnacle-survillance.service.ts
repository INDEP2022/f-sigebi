import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SurvillanceEndpoints } from 'src/app/common/constants/endpoints/ms-survillance';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IViewVigDelegations,
  IVigBinnacle,
} from '../../models/ms-survillance/survillance';

@Injectable({
  providedIn: 'root',
})
export class BinnacleService extends HttpService {
  private readonly route = SurvillanceEndpoints;
  private readonly route1 = SurvillanceEndpoints.View_VigDelegations;
  private readonly route2 = SurvillanceEndpoints.View_VigDelegations;
  constructor(
    private binnacle: Repository<IVigBinnacle>,
    private delegation: Repository<IViewVigDelegations>
  ) {
    super();
    this.microservice = this.route.Survillance;
  }

  getAll(params: ListParams): Observable<IListResponse<IVigBinnacle>> {
    return this.binnacle.getAllPaginated(this.route.VigBinnacle, params);
  }

  getDelegations(
    params: ListParams
  ): Observable<IListResponse<IViewVigDelegations>> {
    console.log(this.route1);
    console.log(this.delegation);
    return this.delegation.getAllPaginated(this.route1, params);
  }

  getDelegations2(
    params: ListParams
  ): Observable<IListResponse<IViewVigDelegations>> {
    console.log(this.route1);
    console.log(this.delegation);
    return this.delegation.getAllPaginated(this.route2, params);
  }
}
