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

  constructor(private goodRepository: GoodRepository<IGood>) {}

  getAll(params?: ListParams): Observable<IListResponse<IGood>> {
    return this.goodRepository.getAll(this.route.Good, params);
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

  getByWarehouse(
    body: Object,
    params?: ListParams
  ): Observable<IListResponse<IGood>> {
    return this.goodRepository.getByWarehouse(
      'good/getGoodByWarehouse',
      body,
      params
    );
  }

  /*getGoodsByRecordId(recordId: number) {
    return this.goodRepository.getAllPaginated(
      'good/good/getidReferenceGood/' + recordId
    );
  }*/
}
