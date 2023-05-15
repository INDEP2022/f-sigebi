import { Injectable } from '@angular/core';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ISpentConcept, ISpentType } from '../../models/ms-spent/spent.model';

@Injectable({
  providedIn: 'root',
})
export class SpentService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.MSSpent;
  }

  getExpensesTypes(params?: _Params) {
    return this.get<IListResponse<ISpentType>>(this.route.ExpenseTypes, params);
  }

  getExpensesConcept(params?: _Params) {
    return this.get<IListResponse<ISpentConcept>>(
      this.route.ExpenseConcept,
      params
    );
  }

  getExpensesConceptById(id: number) {
    return this.get<{ data: ISpentConcept }>(
      `${this.route.ExpenseConcept}/${id}`
    );
  }
}
