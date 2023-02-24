import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocuments } from '../../models/ms-documents/documents';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IDocuments>> {
    return this.get<IListResponse<IDocuments>>(
      DocumentsEndpoints.Documents,
      params
    );
  }

  getAllFilter(params?: string): Observable<IListResponse<IDocuments>> {
    return this.get<IListResponse<IDocuments>>(
      `${DocumentsEndpoints.Documents}?${params}`
    );
  }

  getById(id: string | number) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.get<IDocuments>(route);
  }

  create(documents: IDocuments) {
    return this.post<IDocuments>(DocumentsEndpoints.Documents, documents);
  }

  update(id: string | number, documents: Partial<IDocuments>) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.put(route, documents);
  }

  remove(id: string | number) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.delete(route);
  }
  getByDesc(
    description: string,
    params?: ListParams
  ): Observable<IListResponse<IDocuments>> {
    const route = `${DocumentsEndpoints.Documents}/${description}`;
    return this.get<IListResponse<IDocuments>>(route, params);
  }
  getByGoodAndScanStatus(
    id: string | number,
    idGood: string | number,
    scanStatus: string,
    params?: ListParams
  ): Observable<IListResponse<IDocuments>> {
    const route = `${DocumentsEndpoints.Documents}/?filter.id=$eq:${id}&filter.noGood=$eq:${idGood}&filter.scanStatus=$eq:${scanStatus}`;
    return this.get<IListResponse<IDocuments>>(route, params);
  }
}
