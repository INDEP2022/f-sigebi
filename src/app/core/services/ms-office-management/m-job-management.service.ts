import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMJobManagement } from '../../models/ms-officemanagement/m-job-management.model';

@Injectable({
  providedIn: 'root',
})
export class MJobManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = 'officemanagement';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IMJobManagement>>('m-job-management', params);
  }
}
