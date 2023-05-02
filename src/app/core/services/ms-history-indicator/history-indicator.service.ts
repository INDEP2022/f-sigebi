import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
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
}
