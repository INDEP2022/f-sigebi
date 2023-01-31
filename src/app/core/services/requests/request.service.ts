import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsRequestRepository } from 'src/app/common/repository/repositories/ms-request-repository';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRequest } from '../../models/requests/request.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService implements ICrudMethods<IRequest> {
  private readonly route: string = ENDPOINT_LINKS.request;

  private readonly requestExtRepository = inject(MsRequestRepository);

  constructor(private requestRepository: Repository<IRequest>) {}

  getAll(params?: ListParams): Observable<IListResponse<IRequest>> {
    //return this.requestRepository.getAllPaginated(this.route+'find-all', params);
    return this.requestExtRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRequest> {
    return this.requestExtRepository.getRequestById(this.route, id);
  }

  create(model: IRequest): Observable<IRequest> {
    return this.requestRepository.create(this.route, model);
  }

  update(id: string | number, model: IRequest): Observable<Object> {
    return this.requestRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.requestRepository.remove(this.route, id);
  }
}
