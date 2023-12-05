/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpensePrepareeventService } from './expense-prepareevent.service';

describe('Service: ExpensePrepareevent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpensePrepareeventService],
    });
  });

  it('should ...', inject(
    [ExpensePrepareeventService],
    (service: ExpensePrepareeventService) => {
      expect(service).toBeTruthy();
    }
  ));
});
