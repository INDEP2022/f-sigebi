import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { IExpedient } from '../../models/expedient/expedient.model';

@Injectable({
  providedIn: 'root',
})
export class ExpedientService implements ICrudMethods<IExpedient> {
  private readonly route: string = 'expedient/expedient/find-identificator';
  constructor(private expedientRepository: Repository<IExpedient>) {}
  getById(id: string | number): Observable<IExpedient> {
    return this.expedientRepository.getById(this.route, id);
  }
}
