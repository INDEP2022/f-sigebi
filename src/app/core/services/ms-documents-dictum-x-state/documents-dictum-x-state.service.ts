import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDocumentsDictumXState,
  KeyDocument,
  KeyDocumentPeer,
} from '../../models/ms-documents/documents-dictum-x-state.model';

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

  create(data: any) {
    return this.post(DocumentsEndpoints.DocumentsDictuXState, data);
  }
  getDocumentsDictamen(
    params?: string
  ): Observable<IListResponse<KeyDocumentPeer>> {
    return this.get<IListResponse<KeyDocumentPeer>>(
      DocumentsEndpoints.DocumentRequestPerGood,
      params
    );
  }
  getDocFoDIcta(params?: string): Observable<IListResponse<KeyDocument>> {
    return this.get<IListResponse<KeyDocument>>(
      DocumentsEndpoints.DocumentsForDictum,
      params
    );
  }
  createDocsRevi(revision: any) {
    return this.post(DocumentsEndpoints.DocumentsDictuXState, revision);
  }
  update(revision: IDocumentsDictumXState) {
    return this.put<IListResponse<IDocumentsDictumXState>>(
      DocumentsEndpoints.DocumentsDictuXState,
      revision
    );
  }
}
