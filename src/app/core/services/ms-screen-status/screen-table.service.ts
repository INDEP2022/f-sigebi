import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IScreenTable } from '../../models/ms-screen-status/screen-table.model';
import { ScreenStatusEndpoints } from './../../../common/constants/endpoints/ms-screen-status-endpoint';

@Injectable({
  providedIn: 'root',
})
export class ScreenTableService extends HttpService {
  constructor() {
    super();
    this.microservice = ScreenStatusEndpoints.BasePath;
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IScreenTable>>(
      ScreenStatusEndpoints.ScreenTable,
      params
    );
  }
}
