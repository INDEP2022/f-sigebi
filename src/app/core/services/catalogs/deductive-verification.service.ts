import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDeductiveVerification } from '../../models/catalogs/deductive-verification.model';
@Injectable({
  providedIn: 'root',
})
export class DeductiveVerificationService
  implements ICrudMethods<IDeductiveVerification>
{
  private readonly route: string = ENDPOINT_LINKS.DeductiveVerification;
  constructor(
    private deductiveVerificationRepository: Repository<IDeductiveVerification>
  ) {}

  getAll(
    params?: ListParams
  ): Observable<IListResponse<IDeductiveVerification>> {
    return this.deductiveVerificationRepository.getAllPaginated(
      this.route,
      params
    );
  }

  getById(id: string | number): Observable<IDeductiveVerification> {
    return this.deductiveVerificationRepository.getById(this.route, id);
  }

  create(model: IDeductiveVerification): Observable<IDeductiveVerification> {
    return this.deductiveVerificationRepository.create(this.route, model);
  }

  update(
    id: string | number,
    model: IDeductiveVerification
  ): Observable<Object> {
    return this.deductiveVerificationRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.deductiveVerificationRepository.remove(this.route, id);
  }
}
