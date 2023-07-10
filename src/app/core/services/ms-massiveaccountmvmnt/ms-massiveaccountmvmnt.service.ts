import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MassiveAccountmvmntEndPoints } from 'src/app/common/constants/endpoints/ms-massiveaccountmvmnt-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MsMassiveAccountmvmntlineService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveAccountmvmntEndPoints.Massiveaccountmvmnt;
  }

  getPupPreviewDatosCsv2(
    formData: any,
    params: any
  ): Observable<IListResponse<any>> {
    return this.post<IListResponse<any>>(
      `${MassiveAccountmvmntEndPoints.PupPreviewDatosCsv2}`,
      formData,
      params
    );
  }
}
