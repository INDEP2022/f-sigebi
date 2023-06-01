import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  getAll(params?: ListParams): Observable<IListResponse<IMJobManagement>> {
    return this.get<IListResponse<IMJobManagement>>('m-job-management', params);
  }

  postFindById(params: Object): Observable<IListResponse<IMJobManagement>> {
    return this.post('m-job-management/find-by-ids', params);
  }

  getDocOficioGestion(params?: ListParams): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>('document-job-management', params);
  }

  deleteDocOficioGestion(params?: any): Observable<IListResponse<any>> {
    return this.delete<IListResponse<any>>('document-job-management', params);
  }

  deleteMJobGestion(params: any): Observable<IListResponse<IMJobManagement>> {
    return this.delete<IListResponse<any>>('m-job-management', params);
  }

  getMOficioGestionStage2(
    params: any
  ): Observable<IListResponse<IMJobManagement>> {
    return this.get<IListResponse<any>>(
      `application/stage2/${params.numberManagement}`
    );
  }

  getMOficioGestionlnJob(
    params: any
  ): Observable<IListResponse<IMJobManagement>> {
    return this.post<IListResponse<any>>(`application/lnJob`, params);
  }
  getMOficioGestionmaxLnJob(
    params: any
  ): Observable<IListResponse<IMJobManagement>> {
    return this.post<IListResponse<any>>(`application/maxLnJob`, params);
  }

  create(params?: any): Observable<IListResponse<IMJobManagement>> {
    return this.post<IListResponse<IMJobManagement>>(
      'm-job-management',
      params
    );
  }

  update(params?: any): Observable<IListResponse<IMJobManagement>> {
    return this.put<IListResponse<IMJobManagement>>('m-job-management', params);
  }
  createCopyOficeManag(params?: any): Observable<any> {
    return this.post<IListResponse<any>>('copies-job-management', params);
  }

  createDocumentOficeManag(params?: any): Observable<any> {
    return this.post<IListResponse<any>>('document-job-management', params);
  }
}
