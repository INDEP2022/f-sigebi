import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  postSpInsertaOficioRespuesta(body: any): Observable<any> {
    const route = ClarificationsEndpoints.SpInsertaOficioRespuesta;
    return this.post(`${route}`, body);
  }
  postInsertReasonsRev(body: any): Observable<any> {
    const route = ClarificationsEndpoints.InsertReasonsRev;
    return this.post(`${route}`, body);
  }
  postGetSpEnviaRespuestaOficio(body: any): Observable<any> {
    const route = ClarificationsEndpoints.GetSpEnviaRespuestaOficio;
    return this.post(`${route}`, body);
  }
}
