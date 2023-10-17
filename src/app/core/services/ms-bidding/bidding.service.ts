import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BiddingEndPoint } from 'src/app/common/constants/endpoints/ms-bidding-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITenders } from '../../models/ms-bidding/bidding.interface';

@Injectable({
  providedIn: 'root',
})
export class BiddingService extends HttpService {
  constructor() {
    super();
    this.microservice = BiddingEndPoint.BasePage;
  }

  getAllTenders(params: _Params): Observable<IListResponse<ITenders>> {
    return this.get<IListResponse<ITenders>>(BiddingEndPoint.Tenders, params);
  }

  getBigging(id: number) {
    const route = `${BiddingEndPoint.biddingGood}/custom?filter.biddingId=$eq:${id}`;
    return this.get(route);
  }

  getComerTender(id: number) {
    const route = `${BiddingEndPoint.comerTender}?filter.biddingId=$eq:${id}`;
    return this.get(route);
  }

  postGenerateBiddingGood(params: any) {
    const route = `${BiddingEndPoint.comerBidding}`;
    return this.post(route, params);
  }

  postAutorizeTender(params: any) {
    const route = `${BiddingEndPoint.autorizeTender}`;
    return this.post(route, params);
  }

  postGenerateLineCap(params: any) {
    const route = `${BiddingEndPoint.generateLineCap}`;
    return this.post(route, params);
  }

  postRecalculateLineCap(params: any) {
    const route = `${BiddingEndPoint.recalculateLineCap}`;
    return this.post(route, params);
  }

  postDeleteBidding(params: any) {
    const route = `${BiddingEndPoint.deleteBigging}`;
    return this.post(route, params);
  }
}
