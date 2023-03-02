import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatus } from '../../models/ms-screen-status/status.model';
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

  getStatus(filters: { screen: string; goodArray: number[]; action: string }) {
    return this.post<IListResponse<IStatus>>(
      `${this.endpoint.StatusXScreenAndGoods}`,
      filters
    );
  }
}
