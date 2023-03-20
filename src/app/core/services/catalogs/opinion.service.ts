import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { HttpService } from '../../../common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IOpinion } from '../../models/catalogs/opinion.model';
@Injectable({
  providedIn: 'root',
})
export class OpinionService
  extends HttpService
  implements ICrudMethods<IOpinion>
{
  private readonly route: string = ENDPOINT_LINKS.Opinion;
  constructor(private opinionRepository: Repository<IOpinion>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IOpinion>> {
    return this.opinionRepository.getAllPaginated(this.route, params);
  }

  getAllFiltered(params?: string): Observable<IListResponse<IOpinion>> {
    const segments = ENDPOINT_LINKS.Opinion.split('/');
    const route = `${segments[1]}`;
    return this.get<IListResponse<IOpinion>>(route, params);
  }

  getById(id: string | number): Observable<IOpinion> {
    return this.opinionRepository.getById(this.route, id);
  }

  create(model: IOpinion): Observable<IOpinion> {
    return this.opinionRepository.create(this.route, model);
  }

  update(id: string | number, model: IOpinion): Observable<Object> {
    return this.opinionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.opinionRepository.remove(this.route, id);
  }
}
