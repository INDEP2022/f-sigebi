import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService extends HttpService {
  constructor() {
    super();
    this.microservice = 'expense';
  }

  getData(params: _Params, body: any) {
    return this.post<IListResponse<any>>(
      `aplication/vConceptCost`,
      body,
      params
    );
  }

  getDataState(params: any) {
    const route = `aplication/getPeridoState`;
    return this.get(route, params);
  }

  getDataPeriod(params: any, period: any) {
    const route = `aplication/getDirectIndirect?filter.period=$eq:${period}`;
    return this.get(route, params);
  }

  getDataExpense(params: any) {
    const route = `concept-expense`;
    return this.get(route, params);
  }

  updateDataExpense(params: any, id: any) {
    const route = `concept-expense/${id}`;
    return this.put(route, params);
  }

  insertDataExpense(params: any) {
    const route = `concept-expense`;
    return this.post(route, params);
  }

  deleteDataExpense(id: any) {
    const route = `concept-expense/${id}`;
    return this.delete(route);
  }

  getSeqExpense(params?: any) {
    const route = `concept-expense/getSecuence`;
    return this.post(route, params);
  }
}
