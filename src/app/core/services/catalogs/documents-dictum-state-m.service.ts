import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocumentsDictumXStateM } from '../../models/ms-documents/documents-dictum-x-state-m';

@Injectable({
  providedIn: 'root',
})
export class DocumentsDictumStatetMService extends HttpService {
  private readonly route = DocumentsEndpoints;
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAll(params?: _Params): Observable<IListResponse<IDocumentsDictumXStateM>> {
    return this.get<IListResponse<IDocumentsDictumXStateM>>(
      this.route.DocumentsDictuXStateM,
      params
    );
  }

  create(body: IDocumentsDictumXStateM) {
    return this.post(this.route.DocumentsDictuXStateM, body);
  }

  update(body: Partial<IDocumentsDictumXStateM>) {
    return this.put(this.route.DocumentsDictuXStateM, body);
  }

  remove(body: {
    ofDictNumber: string | number;
    id: string | number;
    typeDict: string;
  }) {
    return this.delete(this.route.DocumentsDictuXStateM, body);
  }
}
