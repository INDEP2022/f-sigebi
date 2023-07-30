import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronicFirmEndpoint } from 'src/app/common/constants/endpoints/ms-electronicfirm-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IComerDestXML,
  IComerDocumentsXML,
  IComerOrigins,
  IUpdateComerPagosRef,
} from '../../models/ms-electronicfirm/signatories-model';

@Injectable({
  providedIn: 'root',
})
export class ElectronicFirmService extends HttpService {
  constructor() {
    super();
    this.microservice = ElectronicFirmEndpoint.BasePage;
  }

  getAllComerDocumentsXml(
    params: _Params
  ): Observable<IListResponse<IComerDocumentsXML>> {
    return this.get<IListResponse<IComerDocumentsXML>>(
      ElectronicFirmEndpoint.ComerDocumentsXml,
      params
    );
  }

  updateComerPagosRefS(
    body: IUpdateComerPagosRef
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ElectronicFirmEndpoint.ComerUpdatePagosRefS,
      body
    );
  }

  updateComerPagosRef(
    body: IUpdateComerPagosRef
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ElectronicFirmEndpoint.ComerUpdatePagosRef,
      body
    );
  }

  getComerOrigins(params: _Params): Observable<IListResponse<IComerOrigins>> {
    return this.get<IListResponse<IComerOrigins>>(
      ElectronicFirmEndpoint.ComerOrigins,
      params
    );
  }

  getComerDestXML(params: _Params): Observable<IListResponse<IComerDestXML>> {
    return this.get<IListResponse<IComerDestXML>>(
      ElectronicFirmEndpoint.ComerDestXML,
      params
    );
  }
}
