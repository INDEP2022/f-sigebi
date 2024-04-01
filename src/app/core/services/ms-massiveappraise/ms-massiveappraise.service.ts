import { Injectable } from '@angular/core';
import { MassiveAppraiseEndPoints } from 'src/app/common/constants/endpoints/ms-massiveappraise-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class MsMassiveappraiseService extends HttpService {
  private readonly route = MassiveAppraiseEndPoints;
  constructor() {
    super();
    this.microservice = MassiveAppraiseEndPoints.BasePath;
  }
  pupValidFile(body: any) {
    return this.post(this.route.pupValidFile, body);
  }
  postValidaArchivoAppraisalRegistry(params: ListParams, file: any, body: any) {
    const formData = new FormData();
    formData.append('vIva', body.vIva);
    formData.append('columNumber', body.columNumber);
    formData.append('file', file);
    return this.post(
      MassiveAppraiseEndPoints.pupValidaArchivoAppraisalRegistry,
      formData,
      params
    );
  }
  postValidaArchivoAppraisalRegistryProperty(
    params: ListParams,
    file: any,
    body: any
  ) {
    const formData = new FormData();
    formData.append('columNumber', body.columNumber);
    formData.append('file', file);
    return this.post(
      MassiveAppraiseEndPoints.pupValidaArchivoAppraisalRegistryProperty,
      formData,
      params
    );
  }
}
