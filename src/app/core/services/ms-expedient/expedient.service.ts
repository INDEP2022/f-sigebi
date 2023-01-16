import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExpedientRepository } from 'src/app/common/repository/repositories/ms-expedient-repository';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpedient } from '../../models/ms-expedient/expedient';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService {
  private readonly route = ExpedientEndpoints;

  constructor(private expedientRepository: ExpedientRepository<IExpedient>) {}

  getById(id: string | number): Observable<IListResponse<IExpedient>> {
    return this.expedientRepository.getById(this.route.GetCountByKey, id);
  }
}
