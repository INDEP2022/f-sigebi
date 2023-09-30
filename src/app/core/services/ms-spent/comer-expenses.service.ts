import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IComerExpense,
  IFillExpenseData,
  IFillExpensesDTO,
} from '../../models/ms-spent/comer-expense';

@Injectable({
  providedIn: 'root',
})
export class SpentService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponseMessage<IComerExpense>> {
    return this.get<IListResponseMessage<IComerExpense>>(
      SpentEndpoints.ExpenseComer,
      params
    );
  }

  getAllFilterSelf(self?: SpentService, params?: _Params) {
    return self.get<IListResponseMessage<IComerExpense>>(
      SpentEndpoints.ExpenseComer,
      params
    );
  }

  getAllComerPagosRef(params?: string) {
    return this.get('comer-payment-ref-gens', params);
  }

  getAllComerPagosRef2(params?: ListParams) {
    return this.get('comer-payment-ref-gens', params);
  }

  fillExpenses(body: IFillExpensesDTO) {
    return this.post<IFillExpenseData>(SpentEndpoints.FillExpenses, body);
  }

  getExpenditureExpended(params?: ListParams) {
    return this.get(`expenditure-exerted`, params);
  }
}
