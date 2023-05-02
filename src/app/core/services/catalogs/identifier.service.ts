import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIdentifier } from '../../models/catalogs/identifier.model';
@Injectable({
  providedIn: 'root',
})
export class IdentifierService
  extends HttpService
  implements ICrudMethods<IIdentifier>
{
  private readonly route: string = ENDPOINT_LINKS.Identifier;
  constructor(private identifierRepository: Repository<IIdentifier>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IIdentifier>> {
    return this.identifierRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IIdentifier> {
    const segments = this.route.split('/');
    const route = `${segments[1]}/id/${id}`;
    return this.get(route);
    // return this.identifierRepository.getById(this.route, id);
  }

  create(model: IIdentifier): Observable<IIdentifier> {
    return this.identifierRepository.create(this.route, model);
  }

  update(id: string | number, model: IIdentifier): Observable<Object> {
    return this.identifierRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.identifierRepository.remove(this.route, id);
  }
}
