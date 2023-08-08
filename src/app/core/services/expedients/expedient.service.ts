import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { IExpedient } from '../../models/expedient/expedient.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class ExpedientService
  extends HttpService
  implements ICrudMethods<IExpedient>
{
  private readonly route: string = 'expedient/expedient/find-identificator';
  constructor(private expedientRepository: Repository<IExpedient>) {
    super();
    this.microservice = 'expedient';
  }
  getById(id: string | number): Observable<IExpedient> {
    return this.expedientRepository.getById(this.route, id);
  }

  getTempExpedientById(id: number | string) {
    return this.expedientRepository.getById(
      'expedient/tmp-expedients',
      id
    ) as any;
  }

  getExpeidentByFilters(params: HttpParams) {
    return this.get('expedient', params);
  }
}
