import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDomicile } from '../../models/catalogs/domicile';

@Injectable({
  providedIn: 'root',
})
export class DomicileService implements ICrudMethods<IDomicile> {
  private readonly route: string = ENDPOINT_LINKS.Domicile;
  private domicileRepository = inject(Repository<IDomicile>);

  constructor() {}

  getAll(params?: ListParams): Observable<IListResponse<IDomicile>> {
    return this.domicileRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IDomicile> {
    return this.domicileRepository.getById(this.route, id);
  }

  create(model: IDomicile): Observable<IDomicile> {
    return this.domicileRepository.create(this.route, model);
  }

  update(id: string | number, model: IDomicile): Observable<Object> {
    return this.domicileRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.domicileRepository.remove(this.route, id);
  }
}
