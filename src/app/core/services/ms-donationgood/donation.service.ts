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
} from '../../models/ms-donation/donation.model';

const api: string = DonationEndPoint.donation;

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
}
