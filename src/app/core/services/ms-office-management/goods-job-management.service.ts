import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodJobManagement } from '../../models/ms-officemanagement/good-job-management.model';
@Injectable({
  providedIn: 'root',
})
export class GoodsJobManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = 'officemanagement';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IGoodJobManagement>>(
      'goods-job-management',
      params
    );
  }
}
