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

  getAllWhereType(delegation: any) {
    const route = `${RapproveDonationEndpoint.donac}?filter.authorizeType=$ilike:A&filter.regionalDelegationId=$ilike:${delegation}`;
    return this.get(route);
  }

  getGoodDonation(params: any) {
    const route = `${RapproveDonationEndpoint.goodDonation}`;
    return this.post(route, params);
  }

  getGoodProgDonation(good?: any) {
    const route = `${RapproveDonationEndpoint.goodProgDonation}?filter.goodId.goodNumber=$eq:${good}`;
    return this.get(route);
  }

  getvIndProg(region: any) {
    const route = `${RapproveDonationEndpoint.progDonation}?filter.regional=$eq:${region}`;
    return this.get(route);
  }

  getgoodAut(good: any, request: any, user: any) {
    const route = `${RapproveDonationEndpoint.goodAut}?filter.goodId=$eq:${good}&filter.requestId=$eq:${request}&filter.userId.id=$ilike:${user}`;
    return this.get(route);
  }

  getGoodSinPackage(good: any) {
    const route = `${RapproveDonationEndpoint.goodSinPackage}/${good}`;
    return this.get(route);
  }

  getC_DATCTA(user: any) {
    const route = `${RapproveDonationEndpoint.tmpGood}?filter.userId.id=$eq${user}`;
    return this.get(route);
  }

  getC_BIEPAR(user: any, request: any) {
    const route = `${RapproveDonationEndpoint.tmpGood}?filter.userId.id=$eq${user}&filter.requestId=$eq${request}$filter.valPartial=$eq:1`;
    return this.get(route);
  }

  getC_PARBIE(user: any, request: any) {
    const route = `${RapproveDonationEndpoint.tmpGood}?filter.userId.id=$eq${user}&filter.requestId=$eq${request}$filter.valPartial=$eq:1`;
    return this.get(route);
  }

  getC_VALSOL(request: any) {
    const route = `${RapproveDonationEndpoint.tmpGood}?filter.requestId=$eq${request}`;
    return this.get(route);
  }

  getPartializeGood(params: any) {
    const route = `${RapproveDonationEndpoint.partializeGood}`;
    return this.post(route, params);
  }

  getInsGoodDonar(params: any) {
    const route = `${RapproveDonationEndpoint.insGoodDonation}`;
    return this.post(route, params);
  }
}
