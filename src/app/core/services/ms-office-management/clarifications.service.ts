import { Injectable } from '@angular/core';
import { ClarificationsEndpoints } from 'src/app/common/constants/endpoints/officemanagement/ms-clarifications-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IClarifications } from '../../models/ms-officemanagement/clarifications.model';

@Injectable({
  providedIn: 'root',
})
export class ClarificationsService extends HttpService {
  constructor() {
    super();
    this.microservice = ClarificationsEndpoints.OfficeManagement;
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<IClarifications>>(
      ClarificationsEndpoints.Clarifications,
      params
    );
  }
}
