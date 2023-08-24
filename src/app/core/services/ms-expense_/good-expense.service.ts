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
}
