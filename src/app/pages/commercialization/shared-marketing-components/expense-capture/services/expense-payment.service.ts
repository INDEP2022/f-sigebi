import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
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
}
