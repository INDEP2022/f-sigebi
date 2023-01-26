import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDateDocuments } from '../../models/catalogs/date-documents.model';

@Injectable({
  providedIn: 'root',
})
export class DateDocumentsService implements ICrudMethods<IDateDocuments> {
  private readonly route: string = ENDPOINT_LINKS.documents;
  constructor(private dateDocumentsRepository: Repository<IDateDocuments>) {}

  getById3(id: string | number): Observable<IListResponse<IDateDocuments>> {
    return this.dateDocumentsRepository.getById3(`${this.route}/expedient`, id);
  }
  getAllPaginated2(
    params?: ListParams
  ): Observable<IListResponse<IDateDocuments>> {
    return this.dateDocumentsRepository.getAllPaginated2(this.route, params);
  }
  create(model: IDateDocuments): Observable<IDateDocuments> {
    return this.dateDocumentsRepository.create2(this.route, model);
  }

  update3(model: IDateDocuments): Observable<Object> {
    return this.dateDocumentsRepository.update3(this.route, model);
  }
}
