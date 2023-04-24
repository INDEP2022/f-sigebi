import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationEndPoint } from 'src/app/common/constants/endpoints/ms-donation';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DonationRepository } from 'src/app/common/repository/repositories/ms-donation-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDonationGoodRequest,
  IDonationPropolsal,
  IRequestDonation,
  ISendRequest,
  ISendRequestProposal,
} from '../../models/ms-donation/donation-good.model';

const api: string = DonationEndPoint.requets;
const apiDonac: string = DonationEndPoint.requestGood;
const apiDonacPro: string = DonationEndPoint.requestGoodPro;
const apiUpdateRequest: string = DonationEndPoint.requestUpdate;
@Injectable({
  providedIn: 'root',
})
export class DonationRequestService
  extends HttpService
  implements ICrudMethods<any>
{
  constructor(private donationRepository: DonationRepository<any>) {
    super();
    this.microservice = 'donationgood';
  }

  getAll(params?: ListParams): Observable<IListResponse<any>> {
    return this.donationRepository.getAll(api, params);
  }

  getAllWidthFilters(parmas: _Params): Observable<IListResponse<any>> {
    return this.get(api, parmas);
  }

  createDonation(data: any): Observable<IListResponse<any>> {
    return this.donationRepository.create(api, data);
  }

  updateDonation(data: any, id: string): Observable<IListResponse<any>> {
    return this.donationRepository.update(api, id, data);
  }

  remove(id: string): Observable<any> {
    return this.donationRepository.remove(api, id);
  }

  getAllDonacGood(
    data: ISendRequest,
    params: ListParams
  ): Observable<IListResponse<IDonationGoodRequest>> {
    return this.post(apiDonac, data, params);
  }

  getAllDonacGoodProposal(
    data: ISendRequestProposal,
    params: ListParams
  ): Observable<IListResponse<IDonationPropolsal>> {
    return this.post(apiDonacPro, data, params);
  }

  updateRequestDonation(data: IRequestDonation) {
    return this.put(apiUpdateRequest, data);
  }
}
