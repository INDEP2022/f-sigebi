import { Injectable } from '@angular/core';
import { DocumentsComersEndpoints } from 'src/app/common/constants/endpoints/ms-documents-comers-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ComerceDocumentsXmlT } from '../../models/ms-documents/documents-comerce.model';

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
}
