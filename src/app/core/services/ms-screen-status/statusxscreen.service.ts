import { Injectable } from '@angular/core';
import { ScreenStatusEndpoints } from 'src/app/common/constants/endpoints/ms-screen-status-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IScreenXStatus } from '../../models/ms-screen-status/screen-status.model';

@Injectable({
  providedIn: 'root',
})
export class StatusXScreenService extends HttpService {
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  getList(params?: _Params) {
    return this.get<IListResponseMessage<IScreenXStatus>>(
      ScreenStatusEndpoints.StatusXScreenList,
      params
    );
  }
}
