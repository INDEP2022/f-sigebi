import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDynamicStatusXScreen,
  IGoodStatusScreen,
  IStatus,
  IStatusXScreen,
} from '../../models/ms-screen-status/status.model';
import { ScreenStatusEndpoints } from './../../../common/constants/endpoints/ms-screen-status-endpoint';

@Injectable({
  providedIn: 'root',
})
export class ScreenStatusService extends HttpService {
  private readonly endpoint = ScreenStatusEndpoints;
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  getStatus(filters: IGoodStatusScreen) {
    return this.post<IListResponse<IStatus>>(
      `${this.endpoint.StatusXScreenAndGoods}`,
      filters
    );
  }
  getStatusXScreen(filters: IDynamicStatusXScreen) {
    return this.post<IListResponse<IStatusXScreen>>(
      `${this.endpoint.StatusXScreen}`,
      filters
    );
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IStatusXScreen>>('status-x-screen', params);
  }
}
