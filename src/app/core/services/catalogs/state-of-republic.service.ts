import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStateOfRepublic } from '../../models/catalogs/state-of-republic.model';
@Injectable({
  providedIn: 'root',
})
export class StateOfRepublicService
  extends HttpService
  implements ICrudMethods<IStateOfRepublic>
{
  private readonly route: string = ENDPOINT_LINKS.StateOfRepublic;
  constructor(private stateOfRepublicRepository: Repository<IStateOfRepublic>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IStateOfRepublic>> {
    return this.stateOfRepublicRepository.getAllPaginated(this.route, params);
  }

  search(params?: ListParams): Observable<IListResponse<IStateOfRepublic>> {
    var route = `${this.route}/search`;
    return this.stateOfRepublicRepository.getAllPaginated(route, params);
  }

  getById(id: string | number): Observable<IStateOfRepublic> {
    return this.stateOfRepublicRepository.getById(`${this.route}/id`, id);
  }

  create(model: IStateOfRepublic): Observable<IStateOfRepublic> {
    return this.stateOfRepublicRepository.create(this.route, model);
  }

  update(id: string | number, model: IStateOfRepublic): Observable<Object> {
    return this.stateOfRepublicRepository.update(this.route + '/id', id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.stateOfRepublicRepository.remove(this.route + '/id/', id);
  }

  getAll2(params?: ListParams) {
    return this.get('state-of-republic', params);
  }
}
