import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INotary } from '../../models/catalogs/notary.model';
@Injectable({
  providedIn: 'root',
})
export class NotaryService implements ICrudMethods<INotary> {
  private readonly route: string = ENDPOINT_LINKS.Notary;
  constructor(private notaryRepository: Repository<INotary>) {}

  getAll(params?: ListParams): Observable<IListResponse<INotary>> {
    return this.notaryRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<INotary> {
    return this.notaryRepository.getById(this.route, id);
  }

  create(model: INotary): Observable<INotary> {
    return this.notaryRepository.create(this.route, model);
  }

  update(id: string | number, model: INotary): Observable<Object> {
    return this.notaryRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.notaryRepository.remove(this.route, id);
  }
}
