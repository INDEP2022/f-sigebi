import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IMinpub } from '../../models/catalogs/minpub.model';
@Injectable({
  providedIn: 'root',
})
export class MinPubService implements ICrudMethods<IMinpub> {
  private readonly route: string = ENDPOINT_LINKS.MinPub;
  constructor(private minPubRepository: Repository<IMinpub>) {}

  getAll(params?: ListParams): Observable<IListResponse<IMinpub>> {
    return this.minPubRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IMinpub> {
    return this.minPubRepository.getById(this.route, id);
  }

  create(model: IMinpub): Observable<IMinpub> {
    return this.minPubRepository.create(this.route, model);
  }

  update(id: string | number, model: IMinpub): Observable<Object> {
    return this.minPubRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.minPubRepository.remove(this.route, id);
  }
}
