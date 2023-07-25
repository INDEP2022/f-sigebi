import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from '../../interfaces/list-response.interface';
import { IComerExpense } from '../../models/ms-spent/comer-expense';
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
}
