import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ExpedientRepository } from 'src/app/common/repository/repositories/ms-expedient-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpedientSami } from '../../models/ms-expedient/expedient';

@Injectable({
  providedIn: 'root',
})
export class ExpedientSamiService extends HttpService {
  private readonly route = ExpedientEndpoints;

  constructor(
    private expedientRepository: ExpedientRepository<IExpedientSami>
  ) {
    super();
    this.microservice = this.route.Base;
  }

  getAll(params: _Params) {
    return this.get<IListResponse<IExpedientSami>>(
      this.route.ExpedientSami,
      params
    );
  }

  getById(id: string | number): Observable<IExpedientSami> {
    return this.expedientRepository.getById(this.route.ExpedientSami, id);
  }

  create(body: IExpedientSami): Observable<IExpedientSami> {
    return this.post(this.route.ExpedientSami, body);
  }

  update(id: number | string, body: Partial<IExpedientSami>) {
    return this.post(`${this.route.ExpedientSami}/${id}`, body);
  }
}
