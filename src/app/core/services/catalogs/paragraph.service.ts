import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IParagraph } from '../../models/catalogs/paragraph.model';
@Injectable({
  providedIn: 'root',
})
export class ParagraphService implements ICrudMethods<IParagraph> {
  private readonly route: string = ENDPOINT_LINKS.Paragraph;
  constructor(private paragraphRepository: Repository<IParagraph>) {}

  getAll(params?: ListParams): Observable<IListResponse<IParagraph>> {
    return this.paragraphRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IParagraph> {
    return this.paragraphRepository.getById(this.route, id);
  }

  create(model: IParagraph): Observable<IParagraph> {
    return this.paragraphRepository.create(this.route, model);
  }

  update(id: string | number, model: IParagraph): Observable<Object> {
    return this.paragraphRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.paragraphRepository.remove(this.route, id);
  }
}
