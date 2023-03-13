import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DocumentsTypeRepository } from 'src/app/common/repository/repositories/ms-documets-type-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { TypesDocuments } from '../../models/ms-documents/documents-type';
import { IInventoryQuery } from '../../models/ms-inventory-query/inventory-query.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsTypeService
  extends HttpService
  implements ICrudMethods<TypesDocuments>
{
  private readonly route: string = ENDPOINT_LINKS.DocumentsType;

  constructor(
    private requestRepository: DocumentsTypeRepository<TypesDocuments>
  ) {
    super();
    this.microservice = 'documents';
  }

  getAll(params?: ListParams): Observable<IListResponse<TypesDocuments>> {
    return this.requestRepository.getAll(this.route, params);
  }

  getAllWidthFilters(params: _Params) {
    return this.get(this.route, params);
  }

  createDocument(
    model: IInventoryQuery
  ): Observable<IListResponse<TypesDocuments>> {
    return this.requestRepository.create(this.route, model);
  }

  updateDocument(
    id: string | number,
    model: IInventoryQuery
  ): Observable<IListResponse<TypesDocuments>> {
    return this.requestRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<IListResponse<TypesDocuments>> {
    return this.requestRepository.remove(this.route, id);
  }
}
