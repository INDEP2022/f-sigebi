import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DocumentsTypeRepository } from 'src/app/common/repository/repositories/ms-documets-type-repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocument } from '../../models/ms-documents/document';
import { IInventoryQuery } from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService implements ICrudMethods<IDocument> {
  private readonly route: string = ENDPOINT_LINKS.Document;

  constructor(private requestRepository: DocumentsTypeRepository<IDocument>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocument>> {
    return this.requestRepository.getAll(this.route, params);
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
