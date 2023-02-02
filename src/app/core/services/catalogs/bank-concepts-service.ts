import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBankConcepts } from '../../models/catalogs/bank-concepts-model';
@Injectable({
  providedIn: 'root',
})
export class BankConceptsService implements ICrudMethods<IBankConcepts> {
  private readonly route: string = ENDPOINT_LINKS.BankConcepts;
  constructor(private bankConceptsRepository: Repository<IBankConcepts>) {}

  getAll(params?: ListParams): Observable<IListResponse<IBankConcepts>> {
    return this.bankConceptsRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IBankConcepts> {
    return this.bankConceptsRepository.getById(this.route, id);
  }

  create(model: IBankConcepts): Observable<IBankConcepts> {
    return this.bankConceptsRepository.create(this.route, model);
  }

  update(id: string | number, model: IBankConcepts): Observable<Object> {
    return this.bankConceptsRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.bankConceptsRepository.remove(this.route, id);
  }
}
