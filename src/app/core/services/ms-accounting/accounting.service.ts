import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IMandExpenseCont } from '../../models/ms-accounting/mand-expensecont';
import { AccountingEndpoints } from './endpoints';

@Injectable({
  providedIn: 'root',
})
export class AccountingService extends HttpService {
  constructor() {
    super();
    this.microservice = AccountingEndpoints.BasePath;
  }

  getAll(params?: _Params) {
    return this.get<IListResponseMessage<IMandExpenseCont>>(
      AccountingEndpoints.MandExpenseCont,
      params
    );
  }
}
