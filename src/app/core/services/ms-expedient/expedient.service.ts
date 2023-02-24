import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExpedientRepository } from 'src/app/common/repository/repositories/ms-expedient-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpedient } from '../../models/ms-expedient/expedient';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService extends HttpService {
  private readonly route = ExpedientEndpoints;

  constructor(private expedientRepository: ExpedientRepository<IExpedient>) {
    super();
    this.microservice = 'expedient';
  }

  getById(id: string | number): Observable<IExpedient> {
    return this.expedientRepository.getById(this.route.FindIdentificator, id);
  }

  getAllFilter(params: _Params) {
    return this.get<IListResponse<IExpedient>>('expedient', params);
  }

  getNextVal(): Observable<{ nextval: string }> {
    return this.get(this.route.GetNextVal);
  }
}
