import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIndiciados } from '../../models/catalogs/indiciados.model';
@Injectable({
  providedIn: 'root',
})
export class IndiciadosService implements ICrudMethods<IIndiciados> {
  private readonly route: string = ENDPOINT_LINKS.Indiciados;
  private readonly route2: string = 'catalog/indiciados/id';
  constructor(private indiciadosRepository: Repository<IIndiciados>) {}

  getAll(params?: ListParams): Observable<IListResponse<IIndiciados>> {
    return this.indiciadosRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IIndiciados> {
    return this.indiciadosRepository.getById(this.route, id);
  }

  create(model: IIndiciados): Observable<IIndiciados> {
    return this.indiciadosRepository.create(this.route, model);
  }

  update(id: string | number, model: IIndiciados): Observable<Object> {
    return this.indiciadosRepository.update(this.route2, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.indiciadosRepository.remove(this.route2, id);
  }
}
