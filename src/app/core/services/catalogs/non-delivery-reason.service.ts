import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { INonDeliveryReason } from '../../models/catalogs/non-delivery-reason.model';
@Injectable({
  providedIn: 'root',
})
export class NonDeliveryReasonService
  implements ICrudMethods<INonDeliveryReason>
{
  private readonly route: string = ENDPOINT_LINKS.NonDeliveryReason;
  constructor(
    private nonDeliveryReasonRepository: Repository<INonDeliveryReason>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<INonDeliveryReason>> {
    return this.nonDeliveryReasonRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<INonDeliveryReason> {
    return this.nonDeliveryReasonRepository.getById(this.route, id);
  }

  create(model: INonDeliveryReason): Observable<INonDeliveryReason> {
    return this.nonDeliveryReasonRepository.create(this.route, model);
  }

  update7(model: INonDeliveryReason): Observable<Object> {
    return this.nonDeliveryReasonRepository.update7(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.nonDeliveryReasonRepository.remove(this.route, id);
  }
}
