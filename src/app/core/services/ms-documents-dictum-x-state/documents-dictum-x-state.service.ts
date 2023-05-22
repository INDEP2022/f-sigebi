import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocumentsDictumXState } from '../../models/ms-documents/documents-dictum-x-state.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsDictumXStateService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAllFirters(
    params?: string
  ): Observable<IListResponse<IDocumentsDictumXState>> {
    return this.get<IListResponse<IDocumentsDictumXState>>(
      DocumentsEndpoints.DocumentsDictuXState,
      params
    );
  }
}
