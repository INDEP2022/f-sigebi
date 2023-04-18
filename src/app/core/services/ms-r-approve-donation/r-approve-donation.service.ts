import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RapproveDonationEndpoint } from 'src/app/common/constants/endpoints/ms-r-approve-donation-edpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRapproveDonation } from '../../models/ms-r-approve-donation/r-approve-donation.model';

@Injectable({
  providedIn: 'root',
})
export class RapproveDonationService extends HttpService {
  private readonly endpoint: string = RapproveDonationEndpoint.ApproveDonation;
  constructor() {
    super();
    this.microservice = RapproveDonationEndpoint.BasePath;
  }
  getAll(params?: ListParams): Observable<IListResponse<IRapproveDonation>> {
    return this.get<IListResponse<IRapproveDonation>>(this.endpoint, params);
  }
}
