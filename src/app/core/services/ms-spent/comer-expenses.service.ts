import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import {
  IListResponseMessage,
  IResponse,
} from '../../interfaces/list-response.interface';
import {
  IComerExpense,
  IComerExpenseDTO,
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

  save(body: IComerExpenseDTO) {
    return this.post<IResponse<IComerExpense>>(
      SpentEndpoints.ExpenseComer,
      body
    );
  }

  edit(body: IComerExpenseDTO) {
    return this.put<IListResponseMessage<IComerExpense>>(
      SpentEndpoints.ExpenseComer + '/' + body.expenseNumber,
      body
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

  putExpedientureExpended(body: any) {
    return this.put('expenditure-exerted', body);
  }

  postExpedientureExpended(body: any) {
    return this.post(`expenditure-exerted`, body);
  }
}
