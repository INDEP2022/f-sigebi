import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocumentsForDictum } from '../../models/catalogs/documents-for-dictum.model';
@Injectable({
  providedIn: 'root',
})
export class DocumentsForDictumService
  implements ICrudMethods<IDocumentsForDictum>
{
  private readonly route: string = ENDPOINT_LINKS.DocumentsForDictum;
  private readonly route1: string = ENDPOINT_LINKS.DocumentsForDictumType;

  constructor(
    private documentsForDictumRepository: Repository<IDocumentsForDictum>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocumentsForDictum>> {
    return this.documentsForDictumRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IDocumentsForDictum> {
    return this.documentsForDictumRepository.getById(this.route, id);
  }

  getById3(
    id: string | number
  ): Observable<IListResponse<IDocumentsForDictum>> {
    return this.documentsForDictumRepository.getById3(
      `${this.route1}/typeDictum`,
      id
    );
  }
  create(model: IDocumentsForDictum): Observable<IDocumentsForDictum> {
    return this.documentsForDictumRepository.create(this.route, model);
  }

  update(id: string | number, model: IDocumentsForDictum): Observable<Object> {
    return this.documentsForDictumRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.documentsForDictumRepository.remove(this.route, id);
  }
}
