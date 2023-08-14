import { Injectable } from '@angular/core';
import { DocumentsComersEndpoints } from 'src/app/common/constants/endpoints/ms-documents-comers-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  ComerceDocumentsXmlH,
  ComerceDocumentsXmlT,
  IComerDocumsXmlT,
} from '../../models/ms-documents/documents-comerce.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsComerceService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsComersEndpoints.BasePath;
  }

  getAllComerceDocumentsXmlT(params: _Params) {
    return this.get<IListResponse<ComerceDocumentsXmlT>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlT,
      params
    );
  }

  createComerceDocumentsXmlT(body: Partial<ComerceDocumentsXmlT>) {
    return this.post<IListResponse<ComerceDocumentsXmlT>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlT,
      body
    );
  }

  deleteComerceDocumentsXmlT(body: Partial<IComerDocumsXmlT>) {
    return this.delete<IListResponse<ComerceDocumentsXmlT>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlT,
      body
    );
  }

  updateComerceDocumentsXmlT(body: Partial<ComerceDocumentsXmlT>) {
    return this.put<IListResponse<ComerceDocumentsXmlT>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlT,
      body
    );
  }

  getAllComerceDocumentsXmlTCatFelec(params: _Params) {
    return this.get<IListResponse<ComerceDocumentsXmlT>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlTCatFelec,
      params
    );
  }

  getAllComerceDocumentsXmlH(params: _Params) {
    return this.get<IListResponse<ComerceDocumentsXmlH>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlH,
      params
    );
  }

  createComerceDocumentsXmlH(body: Partial<ComerceDocumentsXmlH>) {
    return this.post<IListResponse<any>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlH,
      body
    );
  }

  updateComerceDocumentsXmlH(body: Partial<ComerceDocumentsXmlH>) {
    return this.put<IListResponse<any>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlH,
      body
    );
  }

  deleteComerceDocumentsXmlH(id: number) {
    //body: Partial<ComerceDocumentsXmlH>) {
    return this.delete<IListResponse<any>>(
      DocumentsComersEndpoints.ComerceDocumentsXmlH + '/' + id
    );
  }
}
