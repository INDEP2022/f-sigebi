import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationEndPoint } from 'src/app/common/constants/endpoints/ms-donation';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DonationRepository } from 'src/app/common/repository/repositories/ms-donation-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDonationGood,
  IFilterDonation,
  IGoodDonation,
} from '../../models/ms-donation/donation.model';

const api: string = DonationEndPoint.donation;
const donationEvent = DonationEndPoint.eventComDonation;
const endpoint: string = DonationEndPoint.eventComDonation;
@Injectable({
  providedIn: 'root',
})
export class DonationService
  extends HttpService
  implements ICrudMethods<IDonationGood>
{
  constructor(private donationRepository: DonationRepository<IDonationGood>) {
    super();

    this.microservice = 'donationgood';
  }

  getAll(params?: ListParams): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.getAll(api, params);
  }

  getAllWidthFilters(
    parmas: _Params
  ): Observable<IListResponse<IDonationGood>> {
    return this.get(api, parmas);
  }

  createDonation(
    data: IFilterDonation
  ): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.create(api, data);
  }

  updateDonation(
    data: IFilterDonation,
    id: string
  ): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.update(api, id, data);
  }

  remove(id: string): Observable<any> {
    return this.donationRepository.remove(api, id);
  }

  getEventComDonation(params?: ListParams): Observable<IListResponse<any>> {
    return this.donationRepository.getAll(donationEvent, params);
  }

  getEventComDonationDetail(
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.donationRepository.getAll(
      DonationEndPoint.DetailEventComDon,
      params
    );
  }

  getExcel(params: ListParams) {
    return this.get(DonationEndPoint.eventComDonationExcel, params);
  }

  createAdmonDonation(model: any) {
    return this.post('admon-donation', model);
  }

  deleteAdmonDonation(id: number) {
    return this.delete(`admon-donation/${id}`);
  }
  createD(goodDon: IGoodDonation) {
    const route = `${endpoint}`;
    return this.post(route, goodDon);
  }
  getTempGood(params: ListParams) {
    return this.get(DonationEndPoint.TempDonationGood, params);
  }

  getDonationRequest(requestId: number) {
    return this.get(`/donac-request-good?filter.requestId.id=$eq:${requestId}`);
  }
}
