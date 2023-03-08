import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodSpent } from '../../models/ms-spent/good-spent.model';

@Injectable({
  providedIn: 'root',
})
export class GoodSpentService extends HttpService {
  constructor() {
    super();
    this.microservice = 'spent';
  }

  getGoodSpents(body: Object, params: _Params) {
    return this.post<IListResponse<IGoodSpent>>('good-spent', body, params);
  }
}
