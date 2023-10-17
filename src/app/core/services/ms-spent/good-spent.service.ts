import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpenseConcept } from '../../models/ms-spent/expense-concept.model';
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

  getExpenseConcept(
    params?: ListParams
  ): Observable<IListResponse<IExpenseConcept>> {
    return this.get<IListResponse<IExpenseConcept>>(`/expense-concept`, params);
  }
  getExpenseConceptGetAll(
    params?: ListParams
  ): Observable<IListResponse<IExpenseConcept>> {
    return this.get<IListResponse<IExpenseConcept>>(
      `/expense-concept/getAll`,
      params
    );
  }

  getOpenCurReport(params: any) {
    const route = `aplication/openCursorReport`;
    return this.post(route, params);
  }

  openPerid(params: any) {
    const route = `aplication/openPeriod`;
    return this.post(route, params);
  }

  sumarize(params: any) {
    const route = `aplication/sumarize`;
    return this.post(route, params);
  }
}
