import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IContract, IRetention } from '../models/payment';
import { ExpenseCaptureDataService } from './expense-capture-data.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensePaymentService extends HttpService {
  constructor(private dataService: ExpenseCaptureDataService) {
    super();
    this.microservice = 'payment';
  }

  validateContract() {
    let body: any = {};
    if (this.dataService.form.get('conceptNumber').value) {
      body = {
        ...body,
        conceptId: this.dataService.form.get('conceptNumber').value,
      };
    }
    if (this.dataService.address) {
      body = { ...body, address: this.dataService.address };
    }
    return this.post<IListResponseMessage<IContract>>(
      'application/validate-contract',
      body
    );
  }

  catalogRetentions(params?: _Params) {
    return this.get<IListResponseMessage<IRetention>>(
      'application/valid-retention-type',
      params
    );
  }

  getAllFilterSelf(self?: ExpensePaymentService, params?: _Params) {
    let body: any = { OPTION: 2 };
    if (self.dataService.form.get('conceptNumber').value) {
      body = {
        ...body,
        conceptId: self.dataService.form.get('conceptNumber').value,
      };
    }
    if (self.dataService.address) {
      body = { ...body, address: self.dataService.address };
    }
    return self.post<IListResponseMessage<IContract>>(
      'application/validate-contract',
      body,
      params
    );
  }
}
