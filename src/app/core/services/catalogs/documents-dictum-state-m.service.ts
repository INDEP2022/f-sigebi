import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDataDocumentosBien,
  IDocumentsDictumXStateCreate,
  IDocumentsDictumXStateM,
} from '../../models/ms-documents/documents-dictum-x-state-m';

@Injectable({
  providedIn: 'root',
})
export class DocumentsDictumStatetMService extends HttpService {
  private readonly route = DocumentsEndpoints;
  private readonly doc = DocumentsEndpoints.DocumentsDictuXState;
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAll(params?: _Params): Observable<IDataDocumentosBien> {
    return this.get<IDataDocumentosBien>(
      this.route.DocumentsDictuXStateM,
      params
    );
  }

  getAllDictum(
    params?: _Params
  ): Observable<IListResponse<IDocumentsDictumXStateM>> {
    return this.get<IListResponse<IDocumentsDictumXStateM>>(
      this.route.DocumentsDictuXStateM,
      params
    );
  }

  getAllGetDocument(params?: ListParams) {
    return this.get<any>(this.route.GetDocument, params);
  }

  create(body: IDocumentsDictumXStateM) {
    return this.post(this.route.DocumentsDictuXStateM, body);
  }
  createDocDict(body: IDocumentsDictumXStateCreate) {
    return this.post(this.doc, body);
  }
  updateDocDict(body: IDocumentsDictumXStateCreate) {
    return this.put(this.doc, body);
  }
  getDocDict(params: _Params) {
    return this.get(this.doc, params);
  }

  update(body: Partial<IDocumentsDictumXStateM>) {
    return this.put(this.route.DocumentsDictuXStateM, body);
  }

  remove(body: { ofDictNumber: string | number; typeDictum: string }) {
    //console.log(body);
    return this.delete(this.route.DocumentsDictuXStateM, body);
  }
  removeDictamen(body: {
    officialNumber: string | number;
    id: string | number;
    typeDict: string;
  }) {
    //console.log(body);
    return this.delete(`${this.route.DocumentsDictuXStateM}/delete`, body);
  }

  deleteMassive(body: any) {
    return this.post(`${this.route.DocumentsDictumXStateMassive}`, body);
  }

  deleteDocumentXGood(goodNumber: number) {
    return this.delete(`${this.route.DeleteDocumXGoodM}/${goodNumber}`);
  }

  getSeqDocument() {
    const route = `${DocumentsEndpoints.SeqDocument}`;
    return this.post(route, null);
  }

  postDocument(data: any) {
    return this.post(DocumentsEndpoints.postdocument, data);
  }

  postPupFol(data: any) {
    return this.post(DocumentsEndpoints.postPup, data);
  }

  getDocumentXState(body: any) {
    return this.post(DocumentsEndpoints.DocumentsDictumXStateM, body);
  }
}
