/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseScreenService } from './expense-screen.service';

describe('Service: ExpenseScreen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseScreenService],
    });
  });

  it('should ...', inject(
    [ExpenseScreenService],
    (service: ExpenseScreenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
