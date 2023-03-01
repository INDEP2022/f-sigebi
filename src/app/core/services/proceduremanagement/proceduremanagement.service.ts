import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProcedureManagementEndPoints } from 'src/app/common/constants/endpoints/ms-proceduremanagement-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IManagamentProcessPgr,
  IManagamentProcessSat,
  IManagementArea,
  IProceduremanagement,
} from '../../models/ms-proceduremanagement/ms-proceduremanagement.interface';

@Injectable({
  providedIn: 'root',
})
export class ProcedureManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
  }

  getAll(params?: ListParams): Observable<IListResponse<IProceduremanagement>> {
    return this.get<IListResponse<IProceduremanagement>>(
      ProcedureManagementEndPoints.ProcedureManagement,
      params
    );
  }

  getAllFiltered(
    params?: string
  ): Observable<IListResponse<IProceduremanagement>> {
    return this.get<IListResponse<IProceduremanagement>>(
      ProcedureManagementEndPoints.ProcedureManagement,
      params
    );
  }

  getById(id: number | string): Observable<IProceduremanagement> {
    return this.get(
      `${ProcedureManagementEndPoints.ProcedureManagement}/${id}`
    );
  }

  getManagamentProcessSat(
    params?: ListParams
  ): Observable<IListResponse<IManagamentProcessSat>> {
    return this.get<IListResponse<IManagamentProcessSat>>(
      ProcedureManagementEndPoints.ManagamentProcessSat,
      params
    );
  }

  getManagamentProcessPgr(
    params?: ListParams
  ): Observable<IListResponse<IManagamentProcessPgr>> {
    return this.get<IListResponse<IManagamentProcessPgr>>(
      ProcedureManagementEndPoints.ManagamentProcessPgr,
      params
    );
  }

  getManagamentArea(
    params?: ListParams
  ): Observable<IListResponse<IManagementArea>> {
    return this.get<IListResponse<IManagementArea>>(
      ProcedureManagementEndPoints.ManagamentArea,
      params
    );
  }

  getManagementAreasFiltered(
    params?: string
  ): Observable<IListResponse<IManagementArea>> {
    return this.get<IListResponse<IManagementArea>>(
      ProcedureManagementEndPoints.ManagamentArea,
      params
    );
  }

  getReportProcedureManage(
    params: ListParams
  ): Observable<IListResponse<IManagamentProcessSat>> {
    this.microservice = 'massivegood';
    return this.get<IListResponse<IManagamentProcessSat>>(
      ProcedureManagementEndPoints.ReportViews,
      params
    ).pipe(
      tap(() => {
        this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
      })
    );
  }
  // http://sigebimsqa.indep.gob.mx/massivegood/api/v1/views/file-procedure-mng?limit=11&page=1

  update(
    id: number,
    body: Partial<IProceduremanagement>
  ): Observable<IProceduremanagement> {
    return this.put<IProceduremanagement>(
      `${ProcedureManagementEndPoints.ProcedureManagement}/${id}`,
      body
    );
  }

  create(body: IProceduremanagement): Observable<IProceduremanagement> {
    return this.post<IProceduremanagement>(
      `${ProcedureManagementEndPoints.ProcedureManagement}`,
      body
    );
  }
}
