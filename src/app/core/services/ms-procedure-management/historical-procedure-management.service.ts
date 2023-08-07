import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcedureManagementEndPoints } from 'src/app/common/constants/endpoints/ms-proceduremanagement-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  getAllFilter(
    params?: ListParams
  ): Observable<IListResponse<IProceduremanagement>> {
    return this.get<IListResponse<IProceduremanagement>>(
      'proceduremanagement',
      params
    );
  }

  update(params?: ListParams): Observable<IListResponse<IProceduremanagement>> {
    return this.get<IListResponse<IProceduremanagement>>(
      'proceduremanagement',
      params
    );
  }

  updateWithBody(params: any): Observable<IListResponse<IProceduremanagement>> {
    return this.post<IListResponse<any>>(
      'proceduremanagement/pup-act-gestion',
      params
    );
  }

  updateStatus(params: any) {
    const route = `${ProcedureManagementEndPoints.updateStatus}`;
    return this.post(route, params);
  }
}
