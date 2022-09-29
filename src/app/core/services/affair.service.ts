import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IAffair } from '../models/affair.model';
@Injectable({
  providedIn: 'root',
})
export class AffairService implements ICrudMethods<IAffair> {
  private readonly route: string = ENDPOINT_LINKS.Affair;
  constructor(private affairRepository: Repository<IAffair>) {}

  getAll(params?: ListParams): Observable<IListResponse<IAffair>> {
    return this.affairRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IAffair> {
    return this.affairRepository.getById(this.route, id);
  }

  create(model: IAffair): Observable<IAffair> {
    return this.affairRepository.create(this.route, model);
  }

  update(id: string | number, model: IAffair): Observable<Object> {
    return this.affairRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.affairRepository.remove(this.route, id);
  }
}
