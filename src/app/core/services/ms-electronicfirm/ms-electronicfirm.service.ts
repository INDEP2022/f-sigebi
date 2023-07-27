import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronicFirmEndpoint } from 'src/app/common/constants/endpoints/ms-electronicfirm-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IComerDocumentsXML,
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
}
