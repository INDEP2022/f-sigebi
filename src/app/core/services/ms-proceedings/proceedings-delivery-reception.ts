import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProccedingsDeliveryReception } from '../../models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IValidations,
  TransferProceeding,
} from '../../models/ms-proceedings/validations.model';

@Injectable({
  providedIn: 'root',
})
export class ProceedingsDeliveryReceptionService extends HttpService {
  private readonly endpoint = ProceedingsEndpoints.ProceedingsDeliveryReception;
  constructor() {
    super();
    this.microservice = ProceedingsEndpoints.BasePath;
  }

  postProceeding(data: IProccedingsDeliveryReception) {
    return this.post<IListResponse<IValidations>>(this.endpoint, data);
  }

  getAll(params?: ListParams): Observable<IListResponse<IValidations>> {
    return this.get<IListResponse<IValidations>>(`${this.endpoint}`);
  }

  deleteProceeding(id: string) {
    return this.delete(`${this.endpoint}/${id}`);
  }

  editProceeding() {}

  newDeleteProceeding(id: string) {
    return this.delete(`${this.endpoint}/${id}`);
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

  getTransfer(model: TransferProceeding) {
    let partials = ProceedingsEndpoints.ProceedingDeliveryReceptionTranfer;
    /* this.microservice = partials[0]; */
    return this.post<IListResponse<IValidations>>(partials, model);
  }

  getByFilter(params?: string): Observable<IListResponse<IValidations>> {
    // let partials = this.endpoint;
    // console.log(partials);
    /* this.microservice = partials[0]; */
    return this.get<IListResponse<IValidations>>(`${this.endpoint}`, params);
    // return this.get<IListResponse<IValidations>>(partials, params).pipe(
    //   tap(() => (this.microservice = ''))
    // );
  }
}
