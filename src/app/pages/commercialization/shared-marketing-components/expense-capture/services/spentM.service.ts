import { Injectable } from '@angular/core';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';

@Injectable({
  providedIn: 'root',
})
export class SpentMService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  getAllFilterSelf(self?: SpentMService, params?: _Params) {
    return self.get<IListResponseMessage<IComerExpense>>(
      SpentEndpoints.ExpenseComer + '?filter.address=$in:M,C',
      params
    );
  }
}
