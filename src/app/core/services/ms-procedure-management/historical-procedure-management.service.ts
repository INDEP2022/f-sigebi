import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcedureManagementEndPoints } from 'src/app/common/constants/endpoints/ms-proceduremanagement-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProceduremanagement } from '../../models/ms-proceduremanagement/ms-proceduremanagement.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoricalProcedureManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
  }

  getAllFiltered(
    params?: _Params
  ): Observable<IListResponse<IProceduremanagement>> {
    return this.get<IListResponse<IProceduremanagement>>(
      'historical-procedure-management',
      params
    );
  }
}
