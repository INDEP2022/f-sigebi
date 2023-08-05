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
}
