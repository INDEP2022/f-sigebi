import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { SeparatorsDocuments } from '../../models/ms-documents/document-separators';

@Injectable({
  providedIn: 'root',
})
export class DocumentsSeparatorsService
  implements ICrudMethods<SeparatorsDocuments>
{
  private readonly route: string = ENDPOINT_LINKS.DocumentSeparators;

  constructor(private requestRepository: Repository<SeparatorsDocuments>) {}

  getAll(params?: ListParams): Observable<IListResponse<SeparatorsDocuments>> {
    return this.requestRepository.getAllPaginated(this.route, params);
  }
  create(model: SeparatorsDocuments): Observable<SeparatorsDocuments> {
    return this.requestRepository.create(this.route, model);
  }

  update(id: string | number, model: SeparatorsDocuments): Observable<Object> {
    return this.requestRepository.update(this.route, id, model);
  }
}
