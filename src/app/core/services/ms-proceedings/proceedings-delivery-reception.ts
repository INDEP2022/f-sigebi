import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { ProceedingsEndpoints } from '../../../common/constants/endpoints/ms-proceedings-endpoints';
import {
  IListResponse,
  IResponse,
} from '../../interfaces/list-response.interface';
import { IProceedingDeliveryReception } from '../../models/ms-proceedings/proceeding-delivery-reception';
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
  private readonly endpoint2 = ProceedingsEndpoints.GoStatus;
  private readonly filter = `?.filter.keysProceedings=`;
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

  editProceeding(id: string, model: IProccedingsDeliveryReception) {
    return this.put(`${this.endpoint}/${id}`, model);
  }

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

  // getAllByActa(
  //   cve: string,
  //   params?: ListParams
  // ): Observable<IListResponse<IProccedingsDeliveryReception>> {
  //   return this.get<IListResponse<IValidations>>(
  //     `${this.endpoint}${this.filter}${cve}`
  //   );
  // }
  getAllByActa(
    cve: string,
    fileNumber: number,
    tipe: number
  ): Observable<IListResponse<IProceedingDeliveryReception>> {
    return this.get<IListResponse<IProceedingDeliveryReception>>(
      `${this.endpoint}/proceedings-delivery-reception?text.${cve}&file.filesId=${fileNumber}`
    );
  }

  getStatusConversion(id: string | number) {
    return this.get(`${this.endpoint2}/${id}`);
  }
  createDetail(model: IProceedingDeliveryReception) {
    console.log(model);
    return this.post<IResponse>('detail-proceedings-delivery-reception', model);
    // return this.post<{
    //   message: string[];
    //   data: IProceedingDeliveryReception;
    // }>('detail-proceedings-delivery-reception', model);
  }

  createDeliveryReception(model: any) {
    console.log(model);
    return this.post<IResponse>('proceedings-delivery-reception', model);
  }

  updateGoodEInsertHistoric(body: any) {
    return this.post<IResponse>('aplication/get-status-acta-closed', body);
  }

  getByFilter_(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(`${this.endpoint}`, params);
  }

  getStatusDeliveryCveExpendienteAll(params?: ListParams) {
    const route = `${ProceedingsEndpoints.ProceedingsDeliveryReception}`;
    return this.get(route, params);
  }
}
