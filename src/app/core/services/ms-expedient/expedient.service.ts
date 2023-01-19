import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ExpedientRepository } from 'src/app/common/repository/repositories/ms-expedient-repository';
import { ExpedientEndpoints } from '../../../common/constants/endpoints/ms-expedient-endpoints';
import { IExpedient } from '../../models/ms-expedient/expedient';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService {
  private readonly route = ExpedientEndpoints;

  constructor(private expedientRepository: ExpedientRepository<IExpedient>) {}

  getById(id: string | number): Observable<IExpedient> {
    return this.expedientRepository
      .getById(this.route.FindIdentificator, id)
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }
}
