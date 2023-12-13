import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
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

  update(body: IMandExpenseCont) {
    return this.put(AccountingEndpoints.MandExpenseCont, body);
  }

  create(body: IMandExpenseCont) {
    return this.post(AccountingEndpoints.MandExpenseCont + '/seq ', body);
  }

  remove(body: IMandExpenseCont) {
    return this.delete(AccountingEndpoints.MandExpenseCont, {
      spentId: body.spentId,
      mandxexpensecontId: body.mandxexpensecontId,
    });
  }

  updateMassive(body: IMandExpenseCont[]) {
    return this.put(AccountingEndpoints.MassiveUpdateExpenseCont, body);
  }

  getMandateTotal(idSpent: number) {
    return this.get<{ data: { totMandate: number }[] }>(
      'application/query-sum-total/' + idSpent
    ).pipe(
      catchError(x => of({ data: [] })),
      map(x => {
        return x.data ? (x.data.length > 0 ? x.data[0].totMandate : 0) : 0;
      })
    );
  }

  getLotFinalTotal(idSpent: number) {
    return this.get<{ data: { totAmount: number }[] }>(
      'application/query-sum-finalPrice/' + idSpent
    ).pipe(
      catchError(x => of({ data: [] })),
      map(x => {
        return x.data ? (x.data.length > 0 ? x.data[0].totAmount : 0) : 0;
      })
    );
  }
}
