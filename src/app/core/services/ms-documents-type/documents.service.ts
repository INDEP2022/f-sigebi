import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DocumentsTypeRepository } from 'src/app/common/repository/repositories/ms-documets-type-repository';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocument } from '../../models/ms-documents/document';
import { IInventoryQuery } from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService implements ICrudMethods<IDocument> {
  private readonly route: string = ENDPOINT_LINKS.Document;
  private readonly route1: string = ENDPOINT_LINKS.RelDocuments;
  constructor(
    private htpp: HttpClient,
    private requestRepository: DocumentsTypeRepository<IDocument>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocument>> {
    return this.requestRepository.getAll(this.route, params);
  }
  getGoodsRelDocuments(params?: ListParams): Observable<any> {
    const url = `${environment.API_URL}documents/api/v1/goods-rel-documents`;
    return this.htpp.get(url, { params });
  }

  getByFilters(filters: any): Observable<IListResponse<IDocument>> {
    let filtersUrl: string = '?';
    let i = 0;
    for (let property in filters) {
      if (i > 0) {
        filtersUrl = filtersUrl + `&filter.${property}=${filters[property]}`;
      } else {
        filtersUrl = filtersUrl + `filter.${property}=${filters[property]}`;
      }
      i++;
    }
    console.log(filtersUrl);
    filtersUrl = this.route + filtersUrl;
    return this.requestRepository.getByFilters(filtersUrl);
  }

  createDocument(model: IInventoryQuery): Observable<IListResponse<IDocument>> {
    return this.requestRepository.create(this.route, model);
  }
  createRelDocument(model: IInventoryQuery): Observable<IListResponse<any>> {
    return this.requestRepository.create(this.route1, model);
  }

  updateDocument(
    id: string | number,
    model: IInventoryQuery
  ): Observable<IListResponse<IDocument>> {
    return this.requestRepository.update(this.route, id, model);
  }

  delete(id: string | number): Observable<IListResponse<IDocument>> {
    return this.requestRepository.remove(this.route, id);
  }
}
