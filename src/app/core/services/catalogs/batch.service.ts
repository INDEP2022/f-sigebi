import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBatch } from '../../models/catalogs/batch.model';
@Injectable({
  providedIn: 'root',
})
export class BatchService implements ICrudMethods<IBatch> {
  private readonly route: string = ENDPOINT_LINKS.Batch;
  constructor(private batchRepository: Repository<IBatch>) {}

  getAll(params?: ListParams): Observable<IListResponse<IBatch>> {
    return this.batchRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IBatch> {
    return this.batchRepository.getById(this.route, id);
  }

  create(model: IBatch): Observable<IBatch> {
    return this.batchRepository.create(this.route, model);
  }

  update(id: string | number, model: IBatch): Observable<Object> {
    return this.batchRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.batchRepository.remove(this.route, id);
  }
}
