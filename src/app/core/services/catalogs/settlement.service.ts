import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISettlement } from '../../models/catalogs/settlement.model';
@Injectable({
  providedIn: 'root',
})
export class SettlementService implements ICrudMethods<ISettlement> {
  private readonly route: string = ENDPOINT_LINKS.Settlement;
  constructor(private settlementRepository: Repository<ISettlement>) {}

  getAll(params?: ListParams): Observable<IListResponse<ISettlement>> {
    return this.settlementRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ISettlement> {
    return this.settlementRepository.getById(this.route, id);
  }

  create(model: ISettlement): Observable<ISettlement> {
    return this.settlementRepository.create(this.route, model);
  }

  update(id: string | number, model: ISettlement): Observable<Object> {
    return this.settlementRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.settlementRepository.remove(this.route, id);
  }
}
