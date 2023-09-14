import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { LocalViewIndicators } from 'src/app/pages/general-processes/indicators/indicators-history/components/indicators-history-detail/indicators-history-detail.component';
interface IViewBody {
  proceedingsNum: number;
  flierNum: number;
}
@Injectable({
  providedIn: 'root',
})
export class HistoryIndicatorService extends HttpService {
  constructor() {
    super();
    this.microservice = 'historyindicator';
  }

  getHistoryIndicatorView(params?: _Params, body?: IViewBody) {
    return this.post('views/history-indicator-view', body, params);
  }

  getHistoryIndicatorViewIndicators(body: LocalViewIndicators) {
    return this.post('views/history-indicator-view', body);
  }
}
