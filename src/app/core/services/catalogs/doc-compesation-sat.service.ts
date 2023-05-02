import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDocCompesationSat } from '../../models/catalogs/doc-compesation-sat.model';
@Injectable({
  providedIn: 'root',
})
export class DocCompensationSATService
  implements ICrudMethods<IDocCompesationSat>
{
  private readonly route: string = ENDPOINT_LINKS.DocCompensationSAT;
  constructor(
    private docCompensationSATRepository: Repository<IDocCompesationSat>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IDocCompesationSat>> {
    return this.docCompensationSATRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IDocCompesationSat> {
    return this.docCompensationSATRepository.getById(this.route, id);
  }

  create(model: IDocCompesationSat): Observable<IDocCompesationSat> {
    return this.docCompensationSATRepository.create(this.route, model);
  }

  update(id: string | number, model: IDocCompesationSat): Observable<Object> {
    return this.docCompensationSATRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.docCompensationSATRepository.remove(this.route, id);
  }
}
