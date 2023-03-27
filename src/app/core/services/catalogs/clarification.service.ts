import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IClarification } from '../../models/catalogs/clarification.model';
@Injectable({
  providedIn: 'root',
})
export class ClarificationService
  extends HttpService
  implements ICrudMethods<IClarification>
{
  private readonly route: string = ENDPOINT_LINKS.Clarification;

  constructor(private clarificationRepository: Repository<IClarification>) {
    super();
    this.microservice = 'clarification';
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IClarification>> {
    return this.clarificationRepository.getAllPaginated(this.route, params);
  }

  getAllFilter(
    params?: ListParams | string
  ): Observable<IListResponse<IClarification>> {
    return this.get('clarifications-sat', params);
  }

  getById(id: string | number): Observable<IClarification> {
    return this.clarificationRepository.getById(`${this.route}/id`, id);
  }

  create(model: IClarification): Observable<IClarification> {
    return this.clarificationRepository.create(this.route, model);
  }

  update(id: string | number, model: IClarification): Observable<Object> {
    return this.clarificationRepository.newUpdateId(this.route, id, model);
  }

  newUpdate(model: IClarification): Observable<Object> {
    return this.clarificationRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.clarificationRepository.remove(this.route, id);
  }
}
