import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  MassiveChargeGoods,
  ProcedureManagementEndPoints,
} from 'src/app/common/constants/endpoints/ms-proceduremanagement-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IManagamentProcessPgr,
  IManagamentProcessSat,
  IManagementArea,
  IManagementGroupWork,
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
    params?: string | ListParams
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
  getFolioMax(del: number | string): Observable<any> {
    //return this.httpClient.get(`http://localhost:3000/api/v1/proceduremanagement/FolioMax/${del}`);
    return this.get(`${ProcedureManagementEndPoints.FolioMax}/${del}`);
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
    params?: _Params
  ): Observable<IListResponse<IManagementArea>> {
    return this.get<IListResponse<IManagementArea>>(
      ProcedureManagementEndPoints.ManagamentArea,
      params
    );
  }

  getManagamentGroupWork(
    params?: string
  ): Observable<IListResponse<IManagementGroupWork>> {
    return this.get<IListResponse<IManagementGroupWork>>(
      ProcedureManagementEndPoints.ManagamentGroupWork,
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

  getReportTransferenciaSat(
    params: ListParams
  ): Observable<IListResponse<IManagamentProcessSat>> {
    this.microservice = 'massivegood';
    return this.get<IListResponse<IManagamentProcessSat>>(
      ProcedureManagementEndPoints.ReportTranferenciaViews,
      params
    ).pipe(
      tap(() => {
        this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
      })
    );
  }

  getReportProcedureManagePgr(
    params: ListParams
  ): Observable<IListResponse<IManagamentProcessSat>> {
    this.microservice = 'massivegood';
    return this.get<IListResponse<IManagamentProcessSat>>(
      ProcedureManagementEndPoints.ReportViewsPgr,
      params
    ).pipe(
      tap(() => {
        this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
      })
    );
  }

  getReportTransferenciaPgr(
    params: ListParams
  ): Observable<IListResponse<IManagamentProcessSat>> {
    this.microservice = 'massivegood';
    return this.get<IListResponse<IManagamentProcessSat>>(
      ProcedureManagementEndPoints.ReportTranferenciaPgrViews,
      params
    ).pipe(
      tap(() => {
        this.microservice = ProcedureManagementEndPoints.ProcedureManagement;
      })
    );
  }

  uploadExcelMassiveChargeGoods(
    data: any,
    requestId: string,
    user: string
  ): Observable<any> {
    this.microservice = MassiveChargeGoods.base;
    const route = MassiveChargeGoods.MassiveChargeGoodExcel;
    let formData = new FormData();
    formData.append('file', data);
    formData.append('request', requestId);
    formData.append('user', user);

    return this.post<any>(route, formData);
  }

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
