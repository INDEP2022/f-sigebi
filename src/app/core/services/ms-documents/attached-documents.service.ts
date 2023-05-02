import { Injectable } from '@angular/core';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAttachedDocument } from '../../models/ms-documents/attached-document.model';

@Injectable({
  providedIn: 'root',
})
export class AtachedDocumentsService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAllFilter(params?: _Params) {
    return this.get<IListResponse<IAttachedDocument>>(
      'attached-documents',
      params
    );
  }
}
