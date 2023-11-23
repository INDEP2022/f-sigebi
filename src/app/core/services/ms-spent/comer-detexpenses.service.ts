import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import {
  IComerDetExpense,
  IComerDetExpense2,
  IMandContaDTO,
} from '../../models/ms-spent/comer-detexpense';

@Injectable({
  providedIn: 'root',
})
export class ComerDetexpensesService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  massiveInsert(body: IComerDetExpense[]) {
    return this.post('aplication/massiveInsertComerDetexpenses', body);
  }

  getAll(
    idGasto: string,
    PVALIDADET: string,
    PDEVPARCIALBIEN: string,
    CHCONIVA: string,
    IVA: number,
    params?: _Params
  ): Observable<IListResponseMessage<IComerDetExpense2>> {
    return this.get<IListResponseMessage<IComerDetExpense2>>(
      'aplication/comer-det-payments-mod-where/' + idGasto,
      params
    ).pipe(
      catchError(x =>
        of({ data: [] as IComerDetExpense2[], message: x, count: 0 })
      ),
      map(x => {
        return {
          ...x,
          data:
            PVALIDADET === 'S'
              ? x.data.map(row => {
                  return {
                    ...row,
                    amount: row.amount ? row.amount : row.amount,
                    total: row.total ? row.total : row.total2,
                    iva:
                      idGasto === '643' && row.iva2 === 0 && CHCONIVA === 'S'
                        ? row.amount * IVA
                        : row.iva,
                  };
                })
              : PDEVPARCIALBIEN === 'S'
              ? x.data.map(row => {
                  if (row.partialGoodNumber) {
                    const ATP_PRECIOTOT =
                      row.priceRiAtp * (row.amount ? row.amount : 0);
                    const ATP_PRECIO = +(ATP_PRECIOTOT / 1.15).toFixed(2);
                    const ATP_IVA = ATP_PRECIOTOT - ATP_PRECIO;
                    return {
                      ...row,
                      goodNumber: row.partialGoodNumber,
                      amount: ATP_PRECIO,
                      iva: ATP_IVA,
                      total: ATP_PRECIOTOT,
                    };
                  } else {
                    return {
                      ...row,
                      goodNumber: null,
                      description: null,
                      amount: 0,
                      iva: 0,
                      total: 0,
                    };
                  }
                })
              : x.data,
        };
      })
    );
  }

  remove(body: { expenseDetailNumber: string; expenseNumber: string }) {
    return this.delete(SpentEndpoints.ExpenseComerDet, body);
  }

  create(body: IComerDetExpense) {
    return this.post(SpentEndpoints.ExpenseComerDet + '/insert-custom', body);
  }

  edit(body: IComerDetExpense) {
    return this.put(SpentEndpoints.ExpenseComerDet, body);
  }

  mandConta(body: IMandContaDTO) {
    return this.post('aplication/get-mandaContaT', body);
  }

  mandContaTpBien(body: IMandContaDTO) {
    return this.post('aplication/get-mandaContaTpBien', body);
  }

  getExpenses(body: ListParams) {
    return this.post(SpentEndpoints.GetAllExpensesByFilter, body);
  }

  removeMassive(
    body: { expenseDetailNumber: string; expenseNumber: string }[]
  ) {
    return this.post(SpentEndpoints.MassiveDeleteDetExpenses, body);
  }

  updateMassive(body: IComerDetExpense2[]) {
    return this.put(SpentEndpoints.MassiveUpdateComerDetexpenses, body);
  }
}
