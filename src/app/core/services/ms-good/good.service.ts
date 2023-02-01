import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodRepository } from 'src/app/common/repository/repositories/ms-good-repository';
import { GoodEndpoints } from '../../../common/constants/endpoints/ms-good-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGood } from '../../models/ms-good/good';

@Injectable({
  providedIn: 'root',
})
export class GoodService {
  private readonly route = GoodEndpoints;
  private readonly routeGood: string = GoodEndpoints.Good;

  constructor(private goodRepository: GoodRepository<IGood>) {}

  create(formData: Object): Observable<IGood> {
    return this.goodRepository.create(this.routeGood, formData);
  }

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAll(this.routeGood, params);
  }

  getByExpedient(
    id: string | number,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    return this.goodRepository.getByExpedient(
      this.route.SearchByExpedient,
      id,
      params
    );
  }

  update(id: string | number, formData: IGood): Observable<Object> {
    return this.goodRepository.update(this.routeGood, id, formData);
  }

  remove(id: string | number): Observable<Object> {
    return this.goodRepository.remove(this.routeGood, id);
  }

  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}
