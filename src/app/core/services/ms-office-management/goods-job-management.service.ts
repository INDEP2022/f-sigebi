import { Injectable } from '@angular/core';
import { GoodsJobManagementEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-goods-jog-management-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IGoodJobManagement,
  IGoodJobManagementByIds,
  ImanagementOffice,
} from '../../models/ms-officemanagement/good-job-management.model';
@Injectable({
  providedIn: 'root',
})
export class GoodsJobManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodsJobManagementEndpoints.OfficeManagement;
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IGoodJobManagement>>(
      GoodsJobManagementEndpoints.GoodsJobManagement,
      params
    );
  }

  findByIds(body: IGoodJobManagementByIds) {
    return this.post<IListResponse<IGoodJobManagementByIds>>(
      GoodsJobManagementEndpoints.FindByIds,
      body
    );
  }

  // => Oficce Documents
  getAllOfficialDocument() {
    return this.get<IListResponse<ImanagementOffice>>(
      GoodsJobManagementEndpoints.mJobManagement
    );
  }
}
