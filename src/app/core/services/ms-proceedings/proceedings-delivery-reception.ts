import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IValidations } from '../../models/ms-proceedings/validations.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsDeliveryReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(`${this.endpoint}`);
  }

  getProceedingsByDelAndSub(
    delegation: string | number,
    subdelegation: string | number,
    filter: string,
    dataFilter: any
  ): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(
      `${this.endpoint}/find/delegation/${delegation}/subdelegation/${subdelegation}?filter.${filter}=${dataFilter}`
    );
  }

  getByFilter(params?: string): Observable<IListResponse<IValidations>> {
    let partials = this.endpoint;
    console.log(partials);
    /* this.microservice = partials[0]; */
    console.log(
      this.get<IListResponse<IValidations>>(partials[1], params).pipe(
        tap(() => (this.microservice = ''))
      )
    );
    return this.get<IListResponse<IValidations>>(partials[1], params).pipe(
      tap(() => (this.microservice = ''))
    );
  }
}
