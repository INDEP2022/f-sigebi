import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

import { Observable } from 'rxjs';
import { OfficeManagementEndpoint } from 'src/app/common/constants/endpoints/office-management-endpoint';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMJobManagementExtSSF3 } from '../../models/ms-officemanagement/m-job-management.model';

@Injectable({
  providedIn: 'root',
})
export class OfficeManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = OfficeManagementEndpoint.BasePath;
  }

  removeGoodOfficeManagement(no_management: string | number): Observable<any> {
    const route = `${OfficeManagementEndpoint.DeleteGoodOffice}/${no_management}`;
    return this.delete(route);
  }

  removeDocumOfficeManagement(no_management: string | number): Observable<any> {
    const route = `${OfficeManagementEndpoint.DeleteDocumentOffice}/${no_management}`;
    return this.delete(route);
  }

  removeMOfficeManagement(no_management: string | number): Observable<any> {
    const route = `${OfficeManagementEndpoint.DeleteMOffice}/${no_management}`;
    return this.delete(route);
  }

  removeCopiesManagement(no_management: string | number): Observable<any> {
    const route = `${OfficeManagementEndpoint.DeleteCopiesOffice}/${no_management}`;
    return this.delete(route);
  }

  ObtainKeyOffice(data: Object) {
    return this.post<IListResponse<any>>(
      OfficeManagementEndpoint.ObtainKeyOffice,
      data
    );
  }

  customPostTmpClasifGood(body: any) {
    const route = OfficeManagementEndpoint.TmpClasifBienCustomPost;
    return this.post(`${route}`, body);
  }

  //Elimina tablas de Bien_Oficio_Gestion, Docum_Oficio_Gestion,M_Oficio_Gestion,Copias_Gestion,
  deleteJobGestion(body: any): Observable<any> {
    const route = OfficeManagementEndpoint.DeleteJobGestion;
    return this.post(`${route}`, body);
  }

  createMJobManagementExtSSF3(body: IMJobManagementExtSSF3) {
    return this.post(OfficeManagementEndpoint.MJobManagementExtSSF3, body);
  }

  updateStatusProcess(no_process: number) {
    const route = OfficeManagementEndpoint.updateStatusProcess;
    return this.put(`${route}/${no_process}`);
  }
  postOfficeAvaluo(model: any) {
    return this.post(`application/getOfficeAvaluo`, model);
  }
}
