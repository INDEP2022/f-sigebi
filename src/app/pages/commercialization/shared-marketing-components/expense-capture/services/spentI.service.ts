import { Injectable } from '@angular/core';
import { SpentEndpoints } from 'src/app/common/constants/endpoints/ms-spent';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ExpenseCaptureDataService } from './expense-capture-data.service';

@Injectable({
  providedIn: 'root',
})
export class SpentIService extends HttpService {
  private readonly route = SpentEndpoints;
  constructor(private dataService: ExpenseCaptureDataService) {
    super();
    this.microservice = this.route.BasePath;
  }

  getAllFilterSelf(self?: SpentIService, params?: _Params) {
    let PDIRECCION_A = self.dataService.PDIRECCION_A;
    return self.get<IListResponseMessage<IComerExpense>>(
      SpentEndpoints.ExpenseComer +
        '?filter.address=$in:' +
        self.dataService.address +
        (PDIRECCION_A ? ',' + PDIRECCION_A : ''),
      params
    );
  }
}
