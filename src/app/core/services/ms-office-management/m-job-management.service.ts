import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IMJobManagement,
  IRSender,
} from '../../models/ms-officemanagement/m-job-management.model';

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

  getDocOficioGestion(params?: ListParams): Observable<
    IListResponse<{
      cveDocument: string;
      goodNumber: any;
      managementNumber: string;
      recordNumber: string;
      rulingType: string;
    }>
  > {
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

  getCopyOficeManag(managementNumber?: any): Observable<any> {
    return this.get<IListResponse<any>>(
      `copies-job-management?filter.managementNumber=$eq:${managementNumber}`
    );
  }

  updateCopyOficeManag(
    params?: any,
    id?: any
  ): Observable<IListResponse<IMJobManagement>> {
    return this.put<IListResponse<IMJobManagement>>(
      `copies-job-management/${id}`,
      params
    );
  }

  deleteCopyOficeManag(id?: any): Observable<IListResponse<any>> {
    return this.delete<IListResponse<any>>(`copies-job-management/${id}`);
  }

  deleteGoodsJobManagement1(
    managementNumber: string | number
    // no_of_gestion: string | number
  ): Observable<any> {
    return this.delete(
      `application/delete1/${managementNumber}` /* , {
      no_of_gestion,
    } */
    );
  }
  deleteDocumentJobManagement2(
    managementNumber: string | number
    // no_of_gestion: string | number
  ): Observable<any> {
    return this.delete(
      `application/delete2/${managementNumber}` /* {
      no_of_gestion,
    } */
    );
  }
  deleteMJobManagement3(
    managementNumber: string | number
    // no_of_gestion: string | number
  ): Observable<any> {
    return this.delete(
      `application/delete3/${managementNumber}` /* {
      no_of_gestion,
    } */
    );
  }
  deleteCopiesJobManagement4(
    managementNumber: string | number
    // no_of_gestion: string | number
  ): Observable<any> {
    return this.delete(
      `application/delete4/${managementNumber}` /* {
      no_of_gestion,
    } */
    );
  }

  getActNom(no_of_management: any): Observable<{ actnom: number }> {
    return this.get(`application/get-actnom/${no_of_management}`);
  }

  postPupSearchNumber(body: {
    pCveOfManagement: string;
    pDelegationNumber: number | string;
    pManagementOfNumber: string;
  }): Observable<{
    // statusCode: number;
    // message: string[];
    // data: {
    NUM_CLAVE_ARMADA: string;
    CVE_OF_GESTION: string;
    FECHA_INSERTO: string;
    // };
  }> {
    return this.post('application/pup-serach-number', body);
  }

  getRegSender(params: ListParams): Observable<IListResponse<IRSender>> {
    return this.get(`application/regRemitente`, params);
  }

  getRegAddressee(params: ListParams): Observable<IListResponse<IRSender>> {
    return this.get(`application/regDestinatario`, params);
  }

  deleteJobManagement(pCveOfManagement: number, pFlyerNumber: number) {
    return this.post(`application/delete-job-gestion`, {
      pCveOfManagement,
      pFlyerNumber,
    });
  }
}
