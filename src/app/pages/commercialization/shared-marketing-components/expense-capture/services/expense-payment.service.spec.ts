/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpensePaymentService } from './expense-payment.service';

describe('Service: ExpensePayment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpensePaymentService],
    });
  });

  it('should ...', inject(
    [ExpensePaymentService],
    (service: ExpensePaymentService) => {
      expect(service).toBeTruthy();
    }
  ));
});
