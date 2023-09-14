import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IScreenStatusCValRevocation,
  IScreenStatusCValUniversalFolio,
  ISegAppScreen,
} from '../../models/ms-screen-status/seg-app-screen.model';
import { ScreenStatusEndpoints } from './../../../common/constants/endpoints/ms-screen-status-endpoint';

@Injectable({
  providedIn: 'root',
})
export class SegAppScreenService extends HttpService {
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  getById(id: string) {
    const route = `${ScreenStatusEndpoints.SegAppScreen}/${id}`;
    return this.get<ISegAppScreen>(route);
  }

  cValFolUni(body: IScreenStatusCValUniversalFolio) {
    return this.post<IListResponse<any>>(
      ScreenStatusEndpoints.cValFolUni,
      body
    );
  }

  cValFolRev(body: IScreenStatusCValRevocation) {
    return this.post<IListResponse<any>>(
      ScreenStatusEndpoints.cValFolRev,
      body
    );
  }
}
