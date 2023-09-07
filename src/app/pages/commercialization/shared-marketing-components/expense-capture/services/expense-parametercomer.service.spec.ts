/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseParametercomerService } from './expense-parametercomer.service';

describe('Service: ExpenseParametercomer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseParametercomerService],
    });
  });

  it('should ...', inject(
    [ExpenseParametercomerService],
    (service: ExpenseParametercomerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
