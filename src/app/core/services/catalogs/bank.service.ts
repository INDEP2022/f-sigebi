import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IBank } from '../../models/catalogs/bank.model';
@Injectable({
  providedIn: 'root',
})
export class BankService implements ICrudMethods<IBank> {
  private readonly route: string = ENDPOINT_LINKS.Bank;
  constructor(private bankRepository: Repository<IBank>) {}

  getAll(params?: ListParams): Observable<IListResponse<IBank>> {
    return this.bankRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IBank> {
    return this.bankRepository.getById(this.route, id);
  }

  create(model: IBank): Observable<IBank> {
    return this.bankRepository.create(this.route, model);
  }

  update(id: string | number, model: IBank): Observable<Object> {
    return this.bankRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.bankRepository.remove(this.route, id);
  }
}
