import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { IProficient } from '../models/proficient.model';
@Injectable({
  providedIn: 'root',
})
export class ProeficientService implements ICrudMethods<IProficient> {
  private readonly route: string = ENDPOINT_LINKS.Proeficient;
  constructor(private proeficientRepository: Repository<IProficient>) {}

  getAll(params?: ListParams): Observable<IListResponse<IProficient>> {
    return this.proeficientRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IProficient> {
    return this.proeficientRepository.getById(this.route, id);
  }

  create(model: IProficient): Observable<IProficient> {
    return this.proeficientRepository.create(this.route, model);
  }

  update(id: string | number, model: IProficient): Observable<Object> {
    return this.proeficientRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.proeficientRepository.remove(this.route, id);
  }
}
