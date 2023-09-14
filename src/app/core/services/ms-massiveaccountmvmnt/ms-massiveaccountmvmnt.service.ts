import { Injectable } from '@angular/core';
import { MassiveAccountmvmntEndPoints } from 'src/app/common/constants/endpoints/ms-massiveaccountmvmnt-endpoint';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MsMassiveAccountmvmntlineService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveAccountmvmntEndPoints.Massiveaccountmvmnt;
  }

  getPupPreviewDatosCsv2(formData: any, params: any) {
    return this.post(
      `${MassiveAccountmvmntEndPoints.PupPreviewDatosCsv2}`,
      formData,
      params
    );
  }
}
