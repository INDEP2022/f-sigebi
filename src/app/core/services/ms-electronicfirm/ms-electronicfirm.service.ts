import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElectronicFirmEndpoint } from 'src/app/common/constants/endpoints/ms-electronicfirm-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IComerDestXML,
  IComerDocumentsXML,
  IComerOrigins,
  IComerTypeSignatories,
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

  updateComerOrigins(
    id: number,
    body: Partial<IComerOrigins>
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ElectronicFirmEndpoint.ComerOrigins + '/' + id,
      body
    );
  }

  createComerOrigins(
    body: Partial<IComerOrigins>
  ): Observable<IListResponse<IComerOrigins>> {
    return this.post<IListResponse<IComerOrigins>>(
      ElectronicFirmEndpoint.ComerOrigins,
      body
    );
  }

  getComerDestXML(params: _Params): Observable<IListResponse<IComerDestXML>> {
    return this.get<IListResponse<IComerDestXML>>(
      ElectronicFirmEndpoint.ComerDestXML,
      params
    );
  }

  updateComerDestXML(
    body: Partial<IComerDestXML>
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ElectronicFirmEndpoint.ComerDestXML,
      body
    );
  }

  createComerDestXML(
    body: Partial<IComerDestXML>
  ): Observable<IListResponse<IComerDestXML>> {
    return this.post<IListResponse<IComerDestXML>>(
      ElectronicFirmEndpoint.ComerDestXML,
      body
    );
  }

  getComerTypeSignatories(
    params: _Params
  ): Observable<IListResponse<IComerTypeSignatories>> {
    return this.get<IListResponse<IComerTypeSignatories>>(
      ElectronicFirmEndpoint.ComerTypeSignatories,
      params
    );
  }

  updateComerTypeSignatories(
    id: number,
    body: Partial<IComerTypeSignatories>
  ): Observable<IListResponse<any>> {
    return this.put<IListResponse<any>>(
      ElectronicFirmEndpoint.ComerTypeSignatories + '/' + id,
      body
    );
  }

  createComerTypeSignatories(
    body: Partial<IComerTypeSignatories>
  ): Observable<IListResponse<IComerTypeSignatories>> {
    return this.post<IListResponse<IComerTypeSignatories>>(
      ElectronicFirmEndpoint.ComerTypeSignatories,
      body
    );
  }
}
