import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITmpManagementProcedure } from '../../models/ms-proceduremanagement/tmp-managemet-procedure.model';

@Injectable({
  providedIn: 'root',
})
export class TmpManagementProcedureService extends HttpService {
  constructor() {
    super();
    this.microservice = 'proceduremanagement';
  }

  getAllFiltered(params?: _Params) {
    return this.get<IListResponse<ITmpManagementProcedure>>(
      'tmp-management-procedure',
      params
    );
  }
}
