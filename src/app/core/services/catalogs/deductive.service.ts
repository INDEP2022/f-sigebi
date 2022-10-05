import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDeductive } from '../../models/catalogs/deductive.model';
@Injectable({
  providedIn: 'root',
})
export class DeductiveService implements ICrudMethods<IDeductive> {
  private readonly route: string = ENDPOINT_LINKS.Deductive;
  constructor(private deductiveRepository: Repository<IDeductive>) {}

  getAll(params?: ListParams): Observable<IListResponse<IDeductive>> {
    return this.deductiveRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDeductive> {
    return this.deductiveRepository.getById(this.route, id);
  }

  create(model: IDeductive): Observable<IDeductive> {
    return this.deductiveRepository.create(this.route, model);
  }

  update(id: string | number, model: IDeductive): Observable<Object> {
    return this.deductiveRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.deductiveRepository.remove(this.route, id);
  }
}
