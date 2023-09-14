/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseGoodProcessService } from './expense-good-process.service';

describe('Service: ExpenseGoodProcess', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseGoodProcessService],
    });
  });

  it('should ...', inject(
    [ExpenseGoodProcessService],
    (service: ExpenseGoodProcessService) => {
      expect(service).toBeTruthy();
    }
  ));
});
