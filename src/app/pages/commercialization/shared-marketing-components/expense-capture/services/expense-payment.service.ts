import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IContract } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class ExpensePaymentService extends HttpService {
  constructor() {
    super();
    this.microservice = 'payment';
  }

  validateContract(
    option: number,
    desContract: string,
    conceptId: number,
    pAddress: string
  ) {
    return this.post<IListResponseMessage<IContract>>(
      'application/validate-contract',
      {
        option,
        desContract,
        conceptId,
        pAddress,
      }
    );
  }

  getAllFilterSelf(
    self?: ExpensePaymentService,
    option?: number,
    desContract?: string,
    conceptId?: number,
    pAddress?: string,
    params?: _Params
  ) {
    let body = {};
    if (option) {
      body = { ...body, option };
    }
    if (desContract) {
      body = { ...body, desContract };
    }
    if (conceptId) {
      body = { ...body, conceptId };
    }
    if (pAddress) {
      body = { ...body, pAddress };
    }
    return self.post<IListResponseMessage<IContract>>(
      'application/validate-contract',
      body,
      params
    );
  }
}
