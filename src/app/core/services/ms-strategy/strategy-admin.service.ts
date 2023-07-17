import { Injectable } from '@angular/core';
import { StrategyEndpoints } from 'src/app/common/constants/endpoints/ms-strategy-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IStrategyAdmin } from '../../models/ms-strategy-admin/strategy-admin.model';

@Injectable({
  providedIn: 'root',
})
export class StrategyAdminService extends HttpService {
  constructor() {
    super();
    this.microservice = StrategyEndpoints.BasePath;
  }

  getAllTableFolio(params?: ListParams | string) {
    return this.get(StrategyEndpoints.FolioDeliveredWeather, params);
  }

  postReport(model: IStrategyAdmin) {
    return this.post(StrategyEndpoints.StrategyAdmin, model);
  }
}
