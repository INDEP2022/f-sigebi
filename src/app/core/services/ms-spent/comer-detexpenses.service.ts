import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IComerDetExpense } from '../../models/ms-spent/comer-detexpense';

@Injectable({
  providedIn: 'root',
})
export class ComerDetexpensesService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponseMessage<IComerDetExpense>> {
    return this.get<IListResponseMessage<IComerDetExpense>>(
      SpentEndpoints.ExpenseComerDet,
      params
    );
  }
}
